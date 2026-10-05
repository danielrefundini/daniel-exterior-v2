const menu=document.querySelector('.menu'),nav=document.querySelector('#nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.focus()}});
document.querySelectorAll('[data-service]').forEach(a=>a.addEventListener('click',()=>{(()=>{const input=[...document.querySelectorAll('input[name="project"]')].find(x=>x.value===a.dataset.service);if(input){input.checked=true;projectError.hidden=true}})()}));
const dialog=document.querySelector('#privacy-dialog');
document.querySelectorAll('[data-privacy]').forEach(b=>b.addEventListener('click',()=>dialog.showModal()));
dialog.querySelectorAll('.dialog-close,.close-privacy').forEach(b=>b.addEventListener('click',()=>dialog.close()));
document.querySelector('#year').textContent=new Date().getFullYear();
const form=document.querySelector('#inspection-form'),statusEl=document.querySelector('#form-status'),fallback=document.querySelector('#fallback');
let sending=false;
const projectInputs=[...form.querySelectorAll('input[name="project"]')],projectError=document.querySelector('#project-error');
projectInputs.forEach(input=>input.addEventListener('change',()=>{projectError.hidden=true}));
form.elements.phone.addEventListener('input',()=>form.elements.phone.setCustomValidity(''));
form.addEventListener('submit',async event=>{
 event.preventDefault();if(sending)return;
 form.elements.fullName.value=form.elements.fullName.value.trim();
 const digits=form.elements.phone.value.replace(/\D/g,'');
 form.elements.phone.setCustomValidity(digits.length>=10&&digits.length<=15?'':'Please enter your phone number with area code.');
 if(!form.reportValidity()||form.elements._gotcha.value)return;
 if(!projectInputs.some(input=>input.checked)){projectError.hidden=false;projectInputs[0].focus();return;}
 projectError.hidden=true;
 const data=new FormData(form);
 const message=['Inspection request — Daniel Refundini website','Name: '+data.get('fullName'),'Phone: '+data.get('phone'),'Property ZIP: '+data.get('zip'),'Projects: '+data.getAll('project').join(', '),'Details: '+(data.get('details')||'Not provided'),'Approximate age: '+(data.get('age')||'Not provided'),'Consent to phone follow-up: Yes','Appointment not yet scheduled.'].join('\n\n');
 document.querySelector('#email-fallback').href='mailto:danielrefundini@gmail.com?subject='+encodeURIComponent('Free inspection request')+'&body='+encodeURIComponent(message);
 const button=form.querySelector('[type=submit]');sending=true;button.disabled=true;button.textContent='Sending your request…';statusEl.textContent='';statusEl.classList.remove('error');fallback.hidden=true;
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),25000);
 try{
  const response=await fetch(form.action,{method:'POST',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify({subject:'New Inspection Request — Daniel Refundini',message,_gotcha:''}),signal:controller.signal});
  if(!response.ok)throw new Error('Request not accepted');
  const result=await response.json();if(result.ok!==true)throw new Error('Receipt not confirmed');
  statusEl.textContent='Your request has been sent. Daniel will follow up to arrange your inspection. Your appointment is not booked yet.';
  form.reset();form.querySelector('.optional-details').open=false;
 }catch{
  statusEl.classList.add('error');statusEl.textContent='We couldn’t confirm receipt. Please try again or email your request below.';fallback.hidden=false;
 }finally{clearTimeout(timer);sending=false;button.disabled=false;button.innerHTML='Request my free inspection <span aria-hidden="true">↗</span>';statusEl.focus({preventScroll:true});}
});
