/* Location is requested only after an explicit click. Manual address entry always works. */
(() => {
 const form=document.querySelector('#inspection-form');
 const button=document.querySelector('#use-location');
 if(!form||!button)return;
 const status=document.querySelector('#location-status');
 const credit=document.querySelector('#location-credit');
 const fields=['address','city','state','zip'];
 const values=()=>fields.map(name=>form.elements[name].value);
 const say=(message,error=false)=>{status.textContent=message;status.classList.toggle('error',error)};
 let busy=false,lastAttempt=0,revision=0;
 fields.forEach(name=>form.elements[name].addEventListener('input',()=>{revision++}));
 form.addEventListener('reset',()=>{revision++;say('');credit.hidden=true});
 button.addEventListener('click',async()=>{
  if(busy)return;
  if(!window.isSecureContext||!navigator.geolocation){say('Location is unavailable in this browser. Please enter the property address manually.',true);return}
  if(Date.now()-lastAttempt<10000){say('Please wait a few seconds before trying again, or enter the address manually.');return}
  const snapshot=JSON.stringify(values()),startRevision=revision;
  lastAttempt=Date.now();busy=true;button.disabled=true;button.textContent='Finding your location…';button.setAttribute('aria-busy','true');
  say('Allow location access if you are at the property. You can keep entering your address manually.');
  let timer;
  try{
   const position=await new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(resolve,reject,{enableHighAccuracy:true,timeout:12000,maximumAge:0}));
   if(startRevision!==revision||snapshot!==JSON.stringify(values())){say('Your address edits were kept. Location lookup was cancelled.');return}
   const {latitude,longitude,accuracy}=position.coords;
   if(!Number.isFinite(latitude)||!Number.isFinite(longitude))throw new Error('invalid-location');
   if(Number.isFinite(accuracy)&&accuracy>1000){say('Your location is too approximate to identify the property. Please enter the address manually.',true);return}
   const controller=new AbortController();timer=setTimeout(()=>controller.abort(),10000);
   const params=new URLSearchParams({lat:String(latitude),lon:String(longitude),limit:'1',lang:'en',radius:'0.5'});
   const response=await fetch('https://photon.komoot.io/reverse?'+params,{signal:controller.signal,credentials:'omit',headers:{Accept:'application/json'}});
   if(!response.ok)throw new Error('lookup-unavailable');
   const result=await response.json();
   if(startRevision!==revision||snapshot!==JSON.stringify(values())){say('Your address edits were kept. Location lookup was cancelled.');return}
   const p=result.features?.[0]?.properties;
   if(!p||(p.countrycode&&p.countrycode.toUpperCase()!=='US'))throw new Error('no-address');
   const address=[p.housenumber,p.street].filter(Boolean).join(' ');
   const city=p.city||p.town||p.village||p.locality||'';
   const state=({'Maryland':'MD','Virginia':'VA','District of Columbia':'DC'})[p.state]||p.state||'';
   const zip=/^[0-9]{5}(-[0-9]{4})?$/.test(p.postcode||'')?p.postcode:'';
   if(!address&&!city&&!zip)throw new Error('no-address');
   // Do not replace a typed address. Existing fields remain available for correction.
   const found={address,city,state,zip};
   fields.forEach(name=>{if(!form.elements[name].value.trim()&&found[name]){form.elements[name].value=found[name];form.elements[name].dispatchEvent(new Event('input',{bubbles:true}))}});
   credit.hidden=false;
   say(p.housenumber&&p.street?'A nearby address was found. Check the house number, street, unit, city, state, and ZIP before sending.':'Your area was found. Add or check the house number, street, unit, city, state, and ZIP before sending.');
   form.elements.address.focus();
  }catch(error){
   const message=error.code===1?'Location permission was not granted. Please enter the property address manually.':error.code===2?'Your device could not determine its location. Please enter the property address manually.':error.code===3||error.name==='AbortError'?'Location lookup timed out. Please enter the property address manually.':'We couldn’t find an address for your location. Please enter the property address manually.';
   say(message,true);
  }finally{clearTimeout(timer);busy=false;button.disabled=false;button.textContent='Use my location ⌖';button.removeAttribute('aria-busy')}
 });
})();
