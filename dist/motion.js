(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(reduced.matches||!Element.prototype.animate||!window.IntersectionObserver)return;
 const ease='cubic-bezier(.16,1,.3,1)', running=new Set();
 const animate=(el,frames,options={})=>{
  if(!el)return;
  const a=el.animate(frames,{duration:1000,easing:ease,fill:'backwards',...options});
  running.add(a);a.finished.then(()=>running.delete(a)).catch(()=>running.delete(a));return a;
 };
 document.documentElement.classList.add('motion-enabled');
 const rise=[{opacity:0,transform:'translateY(42px)'},{opacity:1,transform:'translateY(0)'}];
 // Choreograph the opening around the headline, photograph, and next action.
 document.querySelectorAll('.hero-copy > *').forEach((el,i)=>{if(el.tagName!=='H1')animate(el,rise,{delay:100+i*110,duration:1100})});
 animate(document.querySelector('.hero h1'),[
  {opacity:0,transform:'translateY(55px)',clipPath:'inset(0 0 100% 0)'},
  {opacity:1,transform:'translateY(0)',clipPath:'inset(0 0 0% 0)'}
 ],{delay:180,duration:1250});
 animate(document.querySelector('.hero-media'),[
  {clipPath:'inset(0 100% 0 0 round 3px)'},
  {clipPath:'inset(0 0% 0 0 round 3px)'}
 ],{duration:1400,delay:150});
 animate(document.querySelector('.photo-label'),rise,{delay:950});
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(({target,isIntersecting})=>{
   if(!isIntersecting)return;
   observer.unobserve(target);
   const stagger=target.matches('.service,.steps li,.rating-card,.review-grid figure,.trust-grid > *');
   const delay=stagger?Math.min([...target.parentElement.children].indexOf(target),4)*120:0;
   if(target.matches('.project-image,.portrait')){
    animate(target,[{opacity:.25,clipPath:'inset(12% 0 12% 0)',transform:'translateY(35px)'},{opacity:1,clipPath:'inset(0% 0 0% 0)',transform:'translateY(0)'}],{duration:1200,delay});
   }else animate(target,rise,{delay});
  });
 },{threshold:.16,rootMargin:'0px 0px -35px 0px'});
 document.querySelectorAll('.section-top,.service,.project-image,.project-card figcaption,.value>div:first-child,.value-list article,.portrait,.about-copy,.steps li,.rating-card,.review-grid figure,.faq>div,.form-copy,#inspection-form,.trust-grid > *').forEach(el=>observer.observe(el));
 const progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');document.querySelector('header').append(progress);
 const hero=document.querySelector('.hero'),heroImage=document.querySelector('.hero-media img');
 const depth=[...document.querySelectorAll('.project-image img,.portrait img')];
 let frame=0;
 const render=()=>{
  frame=0;
  if(reduced.matches)return;
  const y=window.scrollY,max=document.documentElement.scrollHeight-innerHeight;
  progress.style.transform=`scaleX(${max>0?Math.min(y/max,1):0})`;
  document.querySelector('header').classList.toggle('has-scrolled',y>25);
  const r=hero.getBoundingClientRect();
  if(r.bottom>0)heroImage.style.transform=`translateY(${Math.min(y*.12,heroImage.parentElement.clientHeight*.05)}px) scale(1.13)`;
  if(innerWidth>820)depth.forEach(img=>{
   const rect=img.parentElement.getBoundingClientRect();
   if(rect.bottom>0&&rect.top<innerHeight){
    const offset=(innerHeight*.5-(rect.top+rect.height*.5))*.065;
    img.style.setProperty('--depth-y',`${Math.max(-22,Math.min(22,offset))}px`);
   }
  });
 };
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(render)};
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);render();
 // Light follows the pointer across each service, without moving the text.
 if(matchMedia('(hover:hover) and (pointer:fine)').matches){
  document.querySelectorAll('.service').forEach(card=>{
   card.addEventListener('pointermove',event=>{
    if(reduced.matches)return;
    const r=card.getBoundingClientRect();
    card.style.setProperty('--pointer-x',`${event.clientX-r.left}px`);
    card.style.setProperty('--pointer-y',`${event.clientY-r.top}px`);
   });
  });
 }
 // Native disclosure behavior with a short content entrance.
 document.querySelectorAll('details').forEach(detail=>detail.addEventListener('toggle',()=>{
  if(detail.open&&!reduced.matches)[...detail.children].filter(el=>el.tagName!=='SUMMARY').forEach(el=>animate(el,[{opacity:0,transform:'translateY(-8px)'},{opacity:1,transform:'translateY(0)'}],{duration:350}));
 }));
 reduced.addEventListener('change',event=>{
  if(!event.matches)return;
  observer.disconnect();running.forEach(a=>a.cancel());running.clear();
  cancelAnimationFrame(frame);heroImage.style.transform='';
  depth.forEach(img=>img.style.removeProperty('--depth-y'));
  document.documentElement.classList.remove('motion-enabled');
 });
})();
