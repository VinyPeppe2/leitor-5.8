/* Leitor QR - Peppe · service worker (tudo local: funciona offline desde a primeira abertura)
 * - Páginas e scripts próprios: rede primeiro (atualizações chegam sem limpar cache), cache como reserva offline.
 * - Bibliotecas (pasta vendor/) e ícones: cache primeiro.
 */
const CACHE = "leitor-qr-peppe-v5-8";
const FILES = [
  "./", "./index.html", "./style.css", "./core.js", "./report.js", "./i18n.js", "./app.js",
  "./manifest.webmanifest", "./icon.svg",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png", "./icons/apple-touch-icon.png"
];
const LIBS = [
  "./vendor/html5-qrcode.min.js", "./vendor/qrcode.min.js", "./vendor/JsBarcode.all.min.js", "./vendor/jspdf.umd.min.js"
];

self.addEventListener("install", e => e.waitUntil(
  caches.open(CACHE)
    .then(async c => { await Promise.all(FILES.concat(LIBS).map(u => c.add(u).catch(() => {}))); })   // um arquivo ausente não pode impedir a instalação
    .then(() => self.skipWaiting())
));

self.addEventListener("activate", e => e.waitUntil(
  caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));

const put = (req, res) => { if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; };

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const u = new URL(req.url);
  const same = u.origin === location.origin;

  const vendor = same && /\/vendor\//.test(u.pathname);
  if (same && !vendor && (req.mode === "navigate" || /\.(html|js|css|webmanifest)$|\/$/.test(u.pathname))) {
    e.respondWith(
      fetch(req).then(res => put(req, res))
        .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match("./index.html")))
    );
    return;
  }
  if (same) {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => put(req, res))));
  }
});
