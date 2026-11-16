export const today=()=>new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'});
export function loadData(key,fallback=[]){try{return JSON.parse(localStorage.getItem(key))||fallback}catch{return fallback}}
export function promoStatus(p,date=today()){return !p.active?'Disabled':date<p.start?'Scheduled':date>p.end?'Expired':'Active'}
export function discountFor(p,price,date=today()){if(!p||promoStatus(p,date)!=='Active')return 0;const value=Number(p.value);if(!Number.isFinite(value)||value<=0||!['percent','fixed'].includes(p.type)||p.type==='percent'&&value>100)return 0;return Math.min(price,Math.round((p.type==='percent'?price*value/100:value)*100)/100)}
