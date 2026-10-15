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
 const typedNumber=query=>query.match(/^(\d+[A-Za-z]?(?:-\d+[A-Za-z]?)?)\s+/)?.[1]||'';
 const format=(feature,query)=>{
  const p=feature.properties||{};
  const streetName=p.street||((p.osm_key==='highway'||p.type==='street')?p.name:'')||'';
  if(!streetName)return null;
  const enteredNumber=typedNumber(query);
  if(enteredNumber&&p.housenumber&&String(p.housenumber).toLowerCase()!==enteredNumber.toLowerCase())return null;
  const houseNumber=p.housenumber||enteredNumber;
  const street=[houseNumber,streetName].filter(Boolean).join(' ');
  const city=p.city||p.town||p.village||p.locality||'';
  const state=({'Maryland':'MD','Virginia':'VA','District of Columbia':'DC'})[p.state]||p.state||'';
  const region=[state,p.postcode].filter(Boolean).join(' ');
  return {label:[street,city,region,p.country||'United States of America'].filter(Boolean).join(', '),city,state,zip:p.postcode||'',street,streetOnly:!p.housenumber};
 };
 const normalize=(results,query)=>{
  const seen=new Set();
  return results.map(feature=>format(feature,query)).filter(item=>item&&!seen.has(item.label)&&seen.add(item.label));
 };
 const choose=index=>{
  const item=items[index];if(!item)return;
  cancel();input.value=item.label;clearParts();
  ['city','state','zip'].forEach(name=>{form.elements[name].value=item[name]});
  close();input.dispatchEvent(new Event('change',{bubbles:true}));input.focus();
  status.textContent=item.streetOnly?'Street match selected. The house number is not verified; confirm it and add a unit if needed.':'Address selected. Check the house number and add an apartment or unit if needed.';
 };
 const highlight=index=>{
  active=index;
  [...list.children].forEach((option,i)=>option.setAttribute('aria-selected',String(i===index)));
  if(index>=0){const option=list.children[index];input.setAttribute('aria-activedescendant',option.id);option.scrollIntoView({block:'nearest'})}
 };
 const render=(results,query)=>{
  items=normalize(results,query);
  list.replaceChildren();active=-1;input.removeAttribute('aria-activedescendant');
  if(!items.length){close();status.textContent='No matching addresses found. You can enter the full address manually.';return}
  items.forEach((item,index)=>{
   const option=document.createElement('li');
   option.id='address-option-'+index;option.setAttribute('role','option');option.setAttribute('aria-selected','false');
   option.textContent=item.label;
   if(item.streetOnly){const note=document.createElement('span');note.className='address-match-note';note.textContent='Street match — confirm house number';option.append(note)}
   option.addEventListener('click',()=>choose(index));
   list.append(option);
  });
  list.hidden=false;input.setAttribute('aria-expanded','true');
  status.textContent=items.length+' address suggestions available. Use the arrow keys and Enter to choose.';
 };
 const search=async(query,requestVersion)=>{
  if(requestVersion!==version||!focused)return;
  const key=query.toLowerCase();
  if(cache.has(key)){render(cache.get(key),query);return}
  const request=new AbortController();controller=request;
  const timeout=setTimeout(()=>request.abort(),10000);
  status.textContent='Looking for matching addresses…';
  try{
   const lookup=async text=>{
    const params=new URLSearchParams({q:text,countrycode:'US',limit:'6',lang:'en',lat:'38.9',lon:'-77.0'});
    const response=await fetch('https://photon.komoot.io/api/?'+params,{signal:request.signal,credentials:'omit',headers:{Accept:'application/json'}});
    if(!response.ok)throw new Error('Address lookup failed');
    const result=await response.json();
    return Array.isArray(result.features)?result.features:[];
   };
   let features=await lookup(query);
   if(requestVersion!==version||!focused||input.value.trim()!==query)return;
   // Photon may not index an individual house number even when its street exists.
   const streetQuery=typedNumber(query)?query.replace(/^\d+[A-Za-z]?(?:-\d+[A-Za-z]?)?\s+/,'').trim():'';
   if(!normalize(features,query).length&&streetQuery.length>=4){
    features=await lookup(streetQuery);
    if(requestVersion!==version||!focused||input.value.trim()!==query)return;
   }
   if(cache.size>=30)cache.delete(cache.keys().next().value);
   // Don't retain misses: an incomplete result may be temporary.
   if(normalize(features,query).length)cache.set(key,features);
   render(features,query);
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
