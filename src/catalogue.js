export const screenSize = item => String(item.screen || (item.brand === 'Apple' ? '13.3' : /Inspiron 15/.test(item.model) ? '15.6' : '14'));
export function filterLaptops(items, {query='', status='All laptops', brand='', processor='', screen='', condition='', ram='', storage='', maxPrice=''} = {}) {
  const tokens = query.toLowerCase().replace(/\b(inch|inches|laptop|laptops|and)\b/g, '').trim().split(/\s+/).filter(Boolean);
  return items.filter(item => {
    const text = `${item.brand} ${item.model} ${item.spec} ${item.serial || ''} ${screenSize(item)} inch`.toLowerCase();
    return tokens.every(token => text.includes(token)) && (status === 'All laptops' || item.status === status) && (!brand || item.brand === brand) && (!processor || item.spec.toLowerCase().includes(processor.toLowerCase())) && (!screen || (screen === '15' ? Number(screenSize(item)) >= 15 && Number(screenSize(item)) < 16 : screenSize(item).startsWith(screen))) && (!condition || item.condition === condition) && (!ram || new RegExp(`(?:^|[^0-9])${ram} RAM`, 'i').test(item.spec)) && (!storage || item.spec.toLowerCase().includes(storage.toLowerCase())) && (!maxPrice || item.price <= Number(maxPrice));
  });
}
export function publicProducts(items) {
  return items.map(({id, brand, model, spec, condition, price, status, color, screen, photos}) => ({id, brand, model, spec, condition, price, status, color, screen, photos}));
}
export function encodeCatalogue(items,promos=[]) {
  return btoa(Array.from(new TextEncoder().encode(JSON.stringify({items:publicProducts(items),promos})), byte => String.fromCharCode(byte)).join(''));
}
export function readCatalogue(hash) {
  if (!hash.startsWith('#catalogue=')) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(hash.slice(11)), c => c.charCodeAt(0))));
    const value=Array.isArray(payload)?payload:payload?.items;
    const promos=Array.isArray(payload?.promos)?payload.promos.filter(p=>p&&typeof p.code==='string'&&typeof p.start==='string'&&typeof p.end==='string'&&typeof p.active==='boolean'&&['percent','fixed'].includes(p.type)&&Number.isFinite(p.value)&&p.value>0):[];
    if (!Array.isArray(value) || value.length > 500 || value.some(i => !i || typeof i.model !== 'string' || typeof i.spec !== 'string' || typeof i.brand !== 'string' || !Number.isFinite(i.price))) return {error:true};
    if(value.some(i=>i.photos!==undefined&&(!Array.isArray(i.photos)||i.photos.length>3||i.photos.some(p=>typeof p!=='string'||!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(p)))))return {error:true};
    return {promos,items:publicProducts(value).map(i=>i.status==='Reserved'?{...i,status:'Available'}:i)};
  } catch { return {error:true}; }
}
