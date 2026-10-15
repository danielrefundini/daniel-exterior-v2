/* Suggestions load only after typing; typed addresses remain valid without a lookup. */
(() => {
 const form=document.querySelector('#inspection-form');
 const input=document.querySelector('#property-address');
 const list=document.querySelector('#address-suggestions');
 const status=document.querySelector('#address-status');
 if(!form||!input||!list||!status)return;
 let items=[],active=-1,debounce,controller,version=0,focused=false;
 const cache=new Map();
 const close=()=>{list.hidden=true;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');active=-1};
 const clearParts=()=>{['city','state','zip'].forEach(name=>{form.elements[name].value=''})};
 const cancel=()=>{clearTimeout(debounce);controller?.abort();version++};
 const format=p=>{
  const street=[p.housenumber,p.street].filter(Boolean).join(' ');
  const city=p.city||p.town||p.village||p.locality||'';
  const state=({'Maryland':'MD','Virginia':'VA','District of Columbia':'DC'})[p.state]||p.state||'';
  const region=[state,p.postcode].filter(Boolean).join(' ');
  return {label:[street,city,region,p.country||'United States of America'].filter(Boolean).join(', '),city,state,zip:p.postcode||'',street};
 };
 const choose=index=>{
  const item=items[index];if(!item)return;
  cancel();input.value=item.label;clearParts();
  ['city','state','zip'].forEach(name=>{form.elements[name].value=item[name]});
  close();input.dispatchEvent(new Event('change',{bubbles:true}));input.focus();
  status.textContent='Address selected. Check the house number and add an apartment or unit if needed.';
 };
 const highlight=index=>{
  active=index;
  [...list.children].forEach((option,i)=>option.setAttribute('aria-selected',String(i===index)));
  if(index>=0){const option=list.children[index];input.setAttribute('aria-activedescendant',option.id);option.scrollIntoView({block:'nearest'})}
 };
 const render=results=>{
  const seen=new Set();
  items=results.map(feature=>format(feature.properties||{})).filter(item=>item.street&&!seen.has(item.label)&&seen.add(item.label));
  list.replaceChildren();active=-1;input.removeAttribute('aria-activedescendant');
  if(!items.length){close();status.textContent='No matching addresses found. You can enter the full address manually.';return}
  items.forEach((item,index)=>{
   const option=document.createElement('li');
   option.id='address-option-'+index;option.setAttribute('role','option');option.setAttribute('aria-selected','false');
   option.textContent=item.label;
   option.addEventListener('click',()=>choose(index));
   list.append(option);
  });
  list.hidden=false;input.setAttribute('aria-expanded','true');
  status.textContent=items.length+' address suggestions available. Use the arrow keys and Enter to choose.';
 };
 const search=async(query,requestVersion)=>{
  if(requestVersion!==version||!focused)return;
  const key=query.toLowerCase();
  if(cache.has(key)){render(cache.get(key));return}
  const request=new AbortController();controller=request;
  const timeout=setTimeout(()=>request.abort(),10000);
  status.textContent='Looking for matching addresses…';
  try{
   const params=new URLSearchParams({q:query,countrycode:'US',limit:'6',lang:'en',lat:'38.9',lon:'-77.0'});
   const response=await fetch('https://photon.komoot.io/api/?'+params,{signal:request.signal,credentials:'omit',headers:{Accept:'application/json'}});
   if(!response.ok)throw new Error('Address lookup failed');
   const result=await response.json();
   if(requestVersion!==version||!focused||input.value.trim()!==query)return;
   const features=Array.isArray(result.features)?result.features:[];
   if(cache.size>=30)cache.delete(cache.keys().next().value);
   cache.set(key,features);render(features);
  }catch{
   if(requestVersion!==version||!focused)return;
   close();status.textContent='Address suggestions are unavailable. Please enter your full address manually.';
  }finally{clearTimeout(timeout);if(controller===request)controller=null}
 };
 input.addEventListener('focus',()=>{focused=true});
 input.addEventListener('input',()=>{
  focused=true;cancel();clearParts();close();status.textContent='';
  const query=input.value.trim();if(query.length<4)return;
  const requestVersion=version;
  debounce=setTimeout(()=>search(query,requestVersion),450);
 });
 input.addEventListener('keydown',event=>{
  if(event.key==='Escape'){cancel();close();status.textContent='';return}
  if(event.key==='Tab'){cancel();close();return}
  if(list.hidden||!items.length)return;
  if(event.key==='ArrowDown'){event.preventDefault();highlight((active+1)%items.length)}
  else if(event.key==='ArrowUp'){event.preventDefault();highlight(active<=0?items.length-1:active-1)}
  else if(event.key==='Enter'){event.preventDefault();choose(active>=0?active:0)}
 });
 // Keep pointer selection from blurring the input before the click is handled.
 list.addEventListener('pointerdown',event=>event.preventDefault());
 input.addEventListener('blur',()=>{focused=false;cancel();close()});
 form.addEventListener('reset',()=>{cancel();close();list.replaceChildren();items=[];status.textContent='';clearParts()});
})();
