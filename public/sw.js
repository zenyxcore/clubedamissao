// Only public print files and the offline notice are cached. No APIs, purchase sessions or paid stories.
const CACHE='clube-public-v1';
const FILES=['/offline.html','/materiais/pistas-da-missao.pdf','/materiais/pistas-economicas.pdf','/materiais/guia-do-responsavel.pdf','/materiais/carta-convite.pdf','/materiais/diario-do-explorador.pdf','/materiais/kit-da-missao.pdf'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('clube-public-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(u.origin!==self.location.origin||e.request.method!=='GET')return;if(FILES.includes(u.pathname)){e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request)));return;}if(e.request.mode==='navigate')e.respondWith(fetch(e.request).catch(()=>caches.match('/offline.html')));});
