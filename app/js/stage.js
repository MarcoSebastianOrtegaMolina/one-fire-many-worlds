/* Escenario 3D compartido de One Fire, Many Worlds (three.js 0.187.0). Un solo WebGLRenderer y un solo <canvas>,
   fijo a toda la ventana dentro de #stage, detras del contenido y sin recibir el raton. Cada escena se dibuja dentro
   del rectangulo de un elemento de la pagina (getBoundingClientRect en cada cuadro, transformaciones CSS incluidas),
   asi que la composicion, el celular y las transiciones son CSS normal y el 3D solo sigue al elemento.
   La composicion de cada escena vive en js/scenes.js.

   API publica: window.OFMW_STAGE (llega despues de los scripts clasicos; esperar `ready` o el evento
   "ofmw-stage-ready" en window).
     supported            false si no hay WebGL 2: mount() pone la imagen fija img/scenes/<id>.jpg en el elemento.
     ready                promesa que se cumple cuando el escenario esta listo.
     mount(el, sceneId, { priority })  devuelve un control:
       setTier("lite"|"full")   "full" descarga la version completa con avance y la cambia sin parpadeo al
                                llegar; mientras tanto sigue la ligera.
       setInteractive(on, { zoom, touch, onTap })  arrastrar para girar (raton y dedo), pellizco para acercar,
                                rueda si zoom es true, doble clic o doble toque para volver al encuadre inicial,
                                flechas, + y - y 0 con el teclado. onTap: un toque o clic sin arrastre.
       onProgress(fn)           fn({ tier, loaded, total, done, failed }) en bytes.
       onState(fn)              fn(state, info): state es "loading", "ready", "still" (sin modelo: imagen fija)
                                o "error"; info = { parts: [{ id, name, credit, page }], notToScale, tier }.
       info(), retry(), reset(), dispose().
     setStars(on)               estrellas fijas en todo el lienzo (solo la portada).
     setSolo(handle|null)       dibuja solo esa escena (pantalla completa).
     prefetch(sceneIds, tier)   descarga en segundo plano los modelos de esas escenas (por omision, nivel "path").
     Niveles: "path" (portada, si existe; si no, el ligero), "lite" y "full". mount() acepta { tier, placeholder }:
     placeholder pone la imagen fija mientras llega el modelo.
     stats()                    { gpu, fps, mounts: [{ scene, calls, triangles, state }] } para medir.
     mountCustom(el, { id, fov, build(THREE, ctx) })  una escena hecha a mano (la usa js/title.js), con el mismo ciclo
                                de dibujo, recorte por el rectangulo de el, pausa fuera de pantalla, tope de densidad y
                                desmontaje que mount(). build devuelve { object, update(t), place(camera, rect),
                                dispose(), ready }: object se agrega a la escena (ya trae la luz de sol y la ambiente de
                                los mundos); update(t) recibe el reloj en segundos (0 y una sola vez con movimiento
                                reducido); place, si esta, coloca la camara en cada cuadro; ready, una promesa opcional
                                (la escena se dibuja al cumplirse). ctx = { scene, root, camera, reduced,
                                model(id, tier, size) }: model pide un modelo de models/ por id y nivel ("lite" por
                                omision) con el cargador y la cache del escenario y devuelve una promesa con una copia
                                centrada cuyo lado mayor mide size. Devuelve { el, state, onState(fn), dispose() };
                                sin WebGL 2 o si build falla, el estado es "error" y quien llamo pone su respaldo.
   Rendimiento: densidad de pixeles con tope (2 escritorio, 1.5 celular), solo se dibujan escenas en pantalla,
   pausa con la pestana oculta, sin sombras, cola de descargas por prioridad, cada modelo se descarga una vez y se
   comparte entre montajes, y lo que nadie usa se libera 30 s despues. */
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { SCENES, ROLES, MODELS, IMAGE_DIR, IMAGE_EXT } from "./scenes.js";

const host = document.getElementById("stage") || document.body.appendChild(document.createElement("div"));
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const coarse = window.matchMedia("(pointer: coarse)");
const RAD = Math.PI / 180, FOV = 28, TIERS = ["path", "lite", "full"];
let readyFn; const ready = new Promise((r) => { readyFn = r; });

function webgl2() {
  if (/[?&]nowebgl\b/.test(location.search)) return false;   /* para probar la salida sin WebGL */
  try { const c = document.createElement("canvas"); return !!c.getContext("webgl2"); } catch (e) { return false; }
}

let renderer = null, supported = webgl2(), gpu = "";
if (supported) {
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.autoClear = false;
    renderer.info.autoReset = false;
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);
    const gl = renderer.getContext(), ext = gl.getExtension("WEBGL_debug_renderer_info");
    gpu = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    renderer.domElement.addEventListener("webglcontextlost", (e) => { e.preventDefault(); });
  } catch (e) { supported = false; renderer = null; }
}

/* Leaving the page (a reload, another address) cancels the downloads under way: aborted here they end quietly,
   instead of reaching the browser as failed loads (WebKit reports those as page errors). If the page stays after all
   (a download that opens no page), a new controller takes over and the cancelled loads go back to the queue. */
let leaving = new AbortController();
addEventListener("beforeunload", () => { leaving.abort(); setTimeout(() => { if (leaving.signal.aborted) leaving = new AbortController(); }, 1500); });   /* still here: carry on */
addEventListener("pagehide", () => leaving.abort());

/* ---------- which files exist, and what the manifest says about them ---------- */
const files = (async () => {
  const set = new Set(); let manifest = null;
  const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  async function listing() {
    const r = await fetch("models/", { cache: "no-store", signal: leaving.signal });
    const t = r.ok ? await r.text() : "";
    if (!/Directory listing/i.test(t)) return false;
    t.replace(/href="([^"?#]+\.(?:glb|json))"/g, (_, f) => { set.add(decodeURIComponent(f)); return _; });
    return true;
  }
  async function readManifest() {
    const r = await fetch("models/models.json", { cache: "no-store", signal: leaving.signal });
    if (r.ok) manifest = await r.json();
  }
  try {
    /* En el servidor de desarrollo la carpeta trae su listado; asi no se pide un archivo que no existe. */
    if (local && await listing()) { if (set.has("models.json")) await readManifest(); }
    else await readManifest();
  } catch (e) { /* sin listado ni manifiesto: se intenta cargar y, si falla, se muestra el error */ }
  const meta = {};
  if (manifest) {
    const list = Array.isArray(manifest) ? manifest : (manifest.models || manifest);
    const entries = Array.isArray(list) ? list.map((m) => [m.id, m]) : Object.entries(list);
    const bytesOf = (x) => typeof x === "number" ? x : (x && (x.bytes || x.size)) || 0;
    const fileOf = (x) => x && typeof x === "object" ? (x.file || x.src || x.path || "") : (typeof x === "string" ? x : "");
    for (const [id, m] of entries) {
      if (!id || !m || typeof m !== "object") continue;
      const x = meta[id] || (meta[id] = {});
      x.name = x.name || m.name || m.title; x.credit = x.credit || m.credit; x.page = x.page || m.sourceUrl || m.page || m.source || m.url;
      if (m.tier && m.file) {   /* models/models.json de P1: una entrada por modelo y nivel */
        x[m.tier + "Bytes"] = m.bytes || 0; set.add(String(m.file).split("/").pop());
        continue;
      }
      const tiers = m.tiers || m.versions || m.files || {};
      ["path", "lite", "full"].forEach((t) => {
        const v = m[t] || tiers[t];
        if (v) { x[t + "Bytes"] = bytesOf(v) || m[t + "Bytes"] || 0; const f = fileOf(v); if (f) set.add(f.split("/").pop()); }
      });
    }
  }
  return { known: set.size > 0, has: (f) => set.size === 0 || set.has(f), meta };
})();

function modelMeta(id, fileMeta) {
  const a = MODELS[id] || {}, b = (fileMeta && fileMeta[id]) || {};
  return { id, name: b.name || a.name || id, credit: b.credit || a.credit || "", page: b.page || a.page || null };
}

/* ---------- loading: one queue, by priority, two at a time; one download per file ---------- */
let loader = null;
function getLoader() {
  if (loader) return loader;
  const draco = new DRACOLoader();
  draco.setDecoderPath(new URL("../vendor/three/0.187.0/examples/jsm/libs/draco/gltf/", import.meta.url).href);
  loader = new GLTFLoader();
  loader.setDRACOLoader(draco);
  loader.setMeshoptDecoder(MeshoptDecoder);
  return loader;
}
const cache = new Map();   /* file -> entry */
const queue = []; let active = 0;
function pump() {
  queue.sort((a, b) => a.priority - b.priority);
  while (active < 2 && queue.length) {
    const e = queue.shift(); active++;
    e.run().finally(() => { active--; pump(); });
  }
}
async function fetchBuffer(url, onBytes) {
  const res = await fetch(url, { signal: leaving.signal });
  if (!res.ok) throw new Error("HTTP " + res.status + " " + url);
  const total = +res.headers.get("Content-Length") || 0;
  if (!res.body || !res.body.getReader) { const b = await res.arrayBuffer(); onBytes(b.byteLength, b.byteLength); return b; }
  const reader = res.body.getReader(), chunks = []; let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value); got += value.length; onBytes(got, total);
  }
  const out = new Uint8Array(got); let o = 0;
  for (const c of chunks) { out.set(c, o); o += c.length; }
  return out.buffer;
}
function tidyMaterials(root) {
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = o.receiveShadow = false;
    (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
      /* La transmision pide un pase extra de dibujo por escena; el vidrio queda como transparencia simple. */
      if (m && m.transparent && m.side === THREE.DoubleSide) m.forceSinglePass = true;   /* una pasada, no dos */
      if (m && m.transmission > 0) { m.transmission = 0; m.transparent = true; m.opacity = Math.min(m.opacity, 0.45); m.depthWrite = false; }
    });
  });
}
function request(file, priority) {
  let e = cache.get(file);
  if (!e) {
    e = { file, refs: 0, object: null, loaded: 0, total: 0, listeners: new Set(), timer: 0, priority, failed: false };
    e.promise = new Promise((resolve, reject) => {
      e.run = async () => {
        try {
          const buf = await fetchBuffer("models/" + file, (got, total) => { e.loaded = got; e.total = total; e.listeners.forEach((f) => f()); });
          const gltf = await getLoader().parseAsync(buf, "models/");
          tidyMaterials(gltf.scene);
          e.object = gltf.scene; resolve(e);
        } catch (err) {
          if (err && err.name === "AbortError") {   /* cancelled by leaving: quiet; back in the queue if the page stays */
            const again = () => { if (leaving.signal.aborted) setTimeout(again, 250); else { queue.push(e); pump(); } };
            setTimeout(again, 250); return;
          }
          e.failed = true; cache.delete(file); reject(err);
        }
      };
    });
    e.promise.catch(() => {});
    cache.set(file, e);
    queue.push(e); pump();
  } else if (priority < e.priority && queue.includes(e)) { e.priority = priority; pump(); }
  return e;
}
function hold(e) { e.refs++; clearTimeout(e.timer); }
function release(e) {
  if (!e || --e.refs > 0) return;
  clearTimeout(e.timer);
  e.timer = setTimeout(() => {
    if (e.refs > 0 || !e.object) return;
    e.object.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
        if (!m) return;
        for (const k in m) if (m[k] && m[k].isTexture) m[k].dispose();
        m.dispose();
      });
    });
    cache.delete(e.file);
  }, 30000);
}

/* ---------- stars: fixed points across the window, only on the home page ---------- */
let starsOn = false, starScene = null, starCam = null, starKey = "";
function buildStars(w, h, pr) {
  const key = w + "x" + h + "@" + pr;
  if (key === starKey) return;
  starKey = key;
  if (starScene) starScene.children.forEach((c) => { c.geometry.dispose(); c.material.dispose(); });
  starScene = new THREE.Scene(); starCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const n = Math.round(Math.min(420, w * h / 7000)), pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  let s = 20261115;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < n; i++) {
    pos[i * 3] = rnd() * 2 - 1; pos[i * 3 + 1] = rnd() * 2 - 1; pos[i * 3 + 2] = 0;
    const g = 0.28 + rnd() * 0.42; col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = g;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  starScene.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: Math.max(1, 1.25 * pr), sizeAttenuation: false, vertexColors: true, depthTest: false })));
}

/* ---------- mounts ---------- */
const mounts = new Set();
let solo = null, dirty = true;

function stillImage(el, id) {
  if (el.querySelector(":scope > .jr-still")) return;
  const img = document.createElement("img");
  img.className = "jr-still"; img.alt = ""; img.decoding = "async";
  img.src = IMAGE_DIR + id + "." + IMAGE_EXT;
  el.insertBefore(img, el.firstChild);
}
function dropStill(el) { const i = el.querySelector(":scope > .jr-still"); if (i) i.remove(); }

function normalize(object, size) {
  const holder = new THREE.Group(), inner = object;
  inner.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(inner), dim = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
  const k = size / Math.max(dim.x, dim.y, dim.z, 1e-6);
  inner.position.sub(c);
  const scaled = new THREE.Group(); scaled.scale.setScalar(k); scaled.add(inner);
  holder.add(scaled);
  return { holder, box: dim.clone().multiplyScalar(k), bottom: (box.min.y - c.y) * k, halfH: dim.y * k / 2 };
}

function mount(el, sceneId, opts = {}) {
  const def = SCENES[sceneId];
  const m = {
    el, sceneId, def, priority: opts.priority || 0, tier: TIERS.includes(opts.tier) ? opts.tier : "lite", state: "loading", info: null,
    placeholder: !!opts.placeholder, stateFns: new Set(), progressFns: new Set(), held: { path: [], lite: [], full: [] }, parts: [], disposed: false,
    yaw: 0, pitch: 0, zoom: 1, calls: 0, triangles: 0, interactive: false, iopts: {}
  };
  const handle = {
    el, scene: sceneId,
    get state() { return m.state; },
    setTier: (t) => setTier(m, t), setInteractive: (on, o) => setInteractive(m, on, o),
    onProgress: (fn) => { m.progressFns.add(fn); return () => m.progressFns.delete(fn); },
    onState: (fn) => { m.stateFns.add(fn); if (m.info || m.state !== "loading") fn(m.state, m.info); return () => m.stateFns.delete(fn); },
    info: () => m.info, retry: () => load(m, m.tier, true), reset: () => { m.yaw = m.pitch = 0; m.zoom = 1; dirty = true; },
    dispose: () => dispose(m)
  };
  m.handle = handle;
  if (!def) { setState(m, "error"); return handle; }
  if (!supported) {
    stillImage(el, sceneId);
    files.then((f) => { m.info = describe(m, f, resolveParts(def, f, "lite")); setState(m, "still"); });
    return handle;
  }
  m.scene = new THREE.Scene();
  const sun = new THREE.DirectionalLight(0xffffff, 3.1); sun.position.set(-4.5, 3.6, 3.2);
  m.scene.add(sun, new THREE.AmbientLight(0xffffff, 0.14));
  m.root = new THREE.Group(); m.scene.add(m.root);
  m.camera = new THREE.PerspectiveCamera(FOV, 1, 0.01, 100);
  mounts.add(m);
  if (m.placeholder) stillImage(el, sceneId);
  load(m, m.tier);
  start();
  return handle;
}

/* A hand-made scene (js/title.js): the same loop, clip, pause and teardown as mount(), without the SCENES table. */
function mountCustom(el, spec = {}) {
  const m = {
    el, sceneId: spec.id || "custom", def: { parts: [] }, priority: 0, tier: "lite", state: "loading", info: null, placeholder: false,
    stateFns: new Set(), progressFns: new Set(), held: { path: [], lite: [], full: [] }, parts: [], disposed: false,
    yaw: 0, pitch: 0, zoom: 1, calls: 0, triangles: 0, interactive: false, iopts: {}
  };
  const handle = {
    el, scene: m.sceneId,
    get state() { return m.state; },
    onState: (fn) => { m.stateFns.add(fn); if (m.state !== "loading") fn(m.state, m.info); return () => m.stateFns.delete(fn); },
    dispose: () => dispose(m)
  };
  m.handle = handle;
  if (!supported || typeof spec.build !== "function") { setState(m, "error"); return handle; }
  m.scene = new THREE.Scene();
  const sun = new THREE.DirectionalLight(0xffffff, 3.1); sun.position.set(-4.5, 3.6, 3.2);
  m.scene.add(sun, new THREE.AmbientLight(0xffffff, 0.14));
  m.root = new THREE.Group(); m.scene.add(m.root);
  m.camera = new THREE.PerspectiveCamera(spec.fov || FOV, 1, 0.01, 100);
  const ctx = {
    scene: m.scene, root: m.root, camera: m.camera, reduced: reduced.matches,
    model: (id, tier = "lite", size = 1) => files.then((f) => {
      const file = f.has(id + "-" + tier + ".glb") ? id + "-" + tier + ".glb" : id + "-lite.glb";
      return request(file, m.priority).promise;
    }).then((e) => {
      if (m.disposed) throw new Error("disposed");
      hold(e); m.held.lite.push(e);
      return normalize(e.object.clone(true), size).holder;
    })
  };
  let built;
  try { built = spec.build(THREE, ctx) || {}; } catch (err) { setState(m, "error"); return handle; }
  if (built.object) m.root.add(built.object);
  m.customDispose = built.dispose || null;
  if (built.place) m.place = () => built.place(m.camera, m.el.getBoundingClientRect());
  m.parts = [{ role: { update: (p, t) => { if (built.update) built.update(t); } } }];
  m.radius = 1;
  mounts.add(m);
  Promise.resolve(built.ready).then(() => { if (!m.disposed) setState(m, "ready"); }, () => { if (!m.disposed) setState(m, "error"); });
  start();
  return handle;
}

function setState(m, s) {
  m.state = s; dirty = true;
  m.el.setAttribute("data-state", s);
  m.stateFns.forEach((fn) => fn(s, m.info));
}
function emitProgress(m, p) { m.progressFns.forEach((fn) => fn(p)); }

/* For each line of the scene, the file to use at this tier: the model, else its stand-in; the full tier falls
   back to the light file of the same model. */
function resolveParts(def, f, tier) {
  return def.parts.map(([id, fb, size, role, opt]) => {
    for (const cand of [id, fb]) {
      if (!cand) continue;
      if (tier !== "lite" && f.has(cand + "-" + tier + ".glb")) return { id: cand, file: cand + "-" + tier + ".glb", size, role, opt: opt || {} };
      if (f.has(cand + "-lite.glb")) return { id: cand, file: cand + "-lite.glb", size, role, opt: opt || {} };
    }
    return null;
  });
}
function describe(m, f, resolved) {
  const parts = resolved.filter(Boolean).map((r) => modelMeta(r.id, f.meta));
  return { parts, notToScale: parts.length > 1, tier: m.tier, fullBytes: 0 };
}

async function load(m, tier) {
  const f = await files;
  if (m.disposed) return;
  const resolved = resolveParts(m.def, f, tier);
  if (!m.info || m.state !== "ready") m.info = describe(m, f, resolved);
  const live = resolved.filter(Boolean);
  if (!live.length) {   /* nada que dibujar en este nivel: la imagen fija */
    stillImage(m.el, m.sceneId);
    if (m.state !== "ready") setState(m, "still");
    emitProgress(m, { tier, loaded: 0, total: 0, done: true, failed: false });
    return;
  }
  if (m.state !== "ready" && m.state !== "loading") setState(m, "loading");
  else if (m.state === "loading") setState(m, "loading");
  const entries = live.map((r) => request(r.file, tier === "full" ? -1 : m.priority));
  const listen = () => {
    let loaded = 0, total = 0;
    entries.forEach((e) => { loaded += e.loaded; total += e.total || (f.meta[e.file.replace(/-(path|lite|full)\.glb$/, "")] || {})[tier + "Bytes"] || 0; });
    if (tier === "full" && m.info) m.info.fullBytes = total;
    emitProgress(m, { tier, loaded, total, done: false, failed: false });
  };
  entries.forEach((e) => e.listeners.add(listen));
  listen();
  const results = await Promise.allSettled(entries.map((e) => e.promise));
  entries.forEach((e) => e.listeners.delete(listen));
  if (m.disposed) return;
  const ok = results.map((r) => r.status === "fulfilled");
  if (!ok[0] && live[0] === resolved[0]) {   /* el principal no cargo */
    emitProgress(m, { tier, loaded: 0, total: 0, done: true, failed: true });
    if (m.state !== "ready") setState(m, "error");
    return;
  }
  if (tier === "full" && m.tier !== "full") {   /* se cerro antes de llegar: se suelta para liberarla despues */
    results.forEach((r) => { if (r.status === "fulfilled") { hold(r.value); release(r.value); } });
    emitProgress(m, { tier, loaded: 0, total: 0, done: true, failed: false });
    return;
  }
  const prev = m.held[tier]; m.held[tier] = [];
  live.forEach((r, i) => { if (ok[i]) { hold(results[i].value); m.held[tier].push(results[i].value); } });
  prev.forEach(release);
  emitProgress(m, { tier, loaded: 1, total: 1, done: true, failed: false });
  if (tier === m.tier) show(m, f, tier);
}

/* Draw the scene from the files this mount already holds for that tier. */
function show(m, f, tier) {
  const objs = resolveParts(m.def, f, tier).map((r) => {
    if (!r) return null;
    const e = m.held[tier].find((x) => x.file === r.file);
    return e ? { r, object: e.object } : null;
  });
  if (!objs.some(Boolean)) return false;
  build(m, objs);
  m.info = Object.assign(describe(m, f, objs.map((o) => o && o.r)), { tier, fullBytes: m.info ? m.info.fullBytes : 0 });
  dropStill(m.el);
  setState(m, "ready");
  return true;
}

function build(m, objs) {
  m.root.clear();
  m.parts = [];
  const ctx = { main: null };
  objs.forEach((o, i) => {
    if (!o) return;
    const n = normalize(o.object.clone(true), o.r.size);
    let role = ROLES[o.r.role] || ROLES.still;
    if (i > 0 && !ctx.main && ["rider", "settled", "orbit", "satellite"].includes(o.r.role)) role = ROLES.spin;
    const p = Object.assign({ id: o.r.id, size: o.r.size, opt: o.r.opt, role }, n);
    role.setup(p, ctx);
    (p.attach || m.root).add(p.node);
    if (i === 0) ctx.main = p;
    m.parts.push(p);
  });
  m.ctx = ctx;
  m.radius = Math.max(0.5, ...m.parts.map((p) => p.role.reach(p, ctx)));
  dirty = true;
}

async function setTier(m, tier) {
  if (!supported || m.disposed || !TIERS.includes(tier) || m.tier === tier) return;
  const leaving = m.tier;
  m.tier = tier;
  const f = await files;
  if (m.disposed || m.tier !== tier) return;
  if (!m.held[tier].length || !show(m, f, tier)) load(m, tier);
  if (leaving === "full") { m.held.full.forEach(release); m.held.full = []; }
}

function dispose(m) {
  if (m.disposed) return;
  m.disposed = true;
  setInteractive(m, false);
  mounts.delete(m);
  if (solo === m) solo = null;
  if (m.root) m.root.clear();
  if (m.customDispose) { try { m.customDispose(); } catch (err) { /* nada */ } m.customDispose = null; }
  TIERS.forEach((t) => { m.held[t].forEach(release); m.held[t] = []; });
  dropStill(m.el); m.el.removeAttribute("data-state");
  dirty = true;
}

/* ---------- interaction ---------- */
function setInteractive(m, on, o = {}) {
  m.iopts = o;
  const el = m.el;
  el.style.touchAction = on ? (o.touch || "pan-y") : "";
  if (on === m.interactive) return;
  m.interactive = on;
  if (!on) { m.off && m.off(); m.off = null; el.classList.remove("is-interactive"); return; }
  el.classList.add("is-interactive");
  const pts = new Map(); let drag = null, pinch = null, lastTap = 0, tapTimer = 0;
  const dist = () => { const a = [...pts.values()]; return Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y) || 1; };
  const down = (e) => {
    if (e.button > 0) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try { el.setPointerCapture(e.pointerId); } catch (err) { /* nada */ }
    if (pts.size === 1) drag = { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, moved: false };
    if (pts.size === 2) { pinch = { d: dist(), zoom: m.zoom }; if (drag) drag.moved = true; }
  };
  const move = (e) => {
    const p = pts.get(e.pointerId); if (!p) return;
    p.x = e.clientX; p.y = e.clientY;
    if (pts.size === 2 && pinch) { m.zoom = clamp(pinch.zoom * pinch.d / dist(), 0.35, 2.5); dirty = true; return; }
    if (!drag) return;
    if (!drag.moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 6) { drag.moved = true; el.classList.add("is-dragging"); }
    if (drag.moved) {
      m.yaw -= (e.clientX - drag.x) * 0.008;
      m.pitch = clamp(m.pitch + (e.clientY - drag.y) * 0.006, -1.2, 1.2);
      dirty = true;
    }
    drag.x = e.clientX; drag.y = e.clientY;
  };
  const up = (e) => {
    if (!pts.has(e.pointerId)) return;
    pts.delete(e.pointerId);
    if (pts.size < 2) pinch = null;
    if (pts.size === 0 && drag) {
      const tap = !drag.moved && e.type === "pointerup";
      drag = null; el.classList.remove("is-dragging");
      if (!tap) return;
      const now = performance.now();
      if (now - lastTap < 320) { clearTimeout(tapTimer); lastTap = 0; m.handle.reset(); return; }
      lastTap = now;
      if (m.iopts.onTap) { clearTimeout(tapTimer); tapTimer = setTimeout(() => { if (m.interactive && m.iopts.onTap) m.iopts.onTap(); }, 320); }
    }
  };
  const wheel = (e) => {
    if (!m.iopts.zoom) return;
    e.preventDefault();
    m.zoom = clamp(m.zoom * Math.exp(e.deltaY * 0.0012), 0.35, 2.5); dirty = true;
  };
  const key = (e) => {
    const k = e.key; let used = true;
    if (k === "ArrowLeft") m.yaw += 0.15; else if (k === "ArrowRight") m.yaw -= 0.15;
    else if (k === "ArrowUp") m.pitch = clamp(m.pitch + 0.12, -1.2, 1.2); else if (k === "ArrowDown") m.pitch = clamp(m.pitch - 0.12, -1.2, 1.2);
    else if (k === "+" || k === "=") m.zoom = clamp(m.zoom / 1.15, 0.35, 2.5); else if (k === "-") m.zoom = clamp(m.zoom * 1.15, 0.35, 2.5);
    else if (k === "0" || k === "Home") m.handle.reset(); else used = false;
    if (used) { e.preventDefault(); dirty = true; }
  };
  el.addEventListener("pointerdown", down); el.addEventListener("pointermove", move);
  el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
  el.addEventListener("wheel", wheel, { passive: false }); el.addEventListener("keydown", key);
  m.off = () => {
    clearTimeout(tapTimer);
    el.removeEventListener("pointerdown", down); el.removeEventListener("pointermove", move);
    el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up);
    el.removeEventListener("wheel", wheel); el.removeEventListener("keydown", key);
  };
}
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

/* ---------- the frame loop ---------- */
let raf = 0, last = 0, clock = 0, W = 0, H = 0, PR = 1, frames = 0, fpsT = 0, fps = 0;
const lastRects = new Map();
function start() { if (!raf && supported && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } }
function resize() {
  const w = host.clientWidth || window.innerWidth, h = host.clientHeight || window.innerHeight;
  const pr = Math.min(window.devicePixelRatio || 1, coarse.matches || w < 768 ? 1.5 : 2);
  if (w !== W || h !== H || pr !== PR) { W = w; H = h; PR = pr; renderer.setPixelRatio(pr); renderer.setSize(w, h, false); dirty = true; }
}
function place(m) {
  if (m.place) { m.place(m); return; }   /* mountCustom: the scene places its own camera */
  const fit = m.radius || 1, aspect = m.camera.aspect;
  const v = FOV * RAD, hv = 2 * Math.atan(Math.tan(v / 2) * aspect);
  const view = m.def.view || {};
  const d = fit * 1.04 / Math.sin(Math.min(v, hv) / 2) * m.zoom * (view.zoom || 1);
  const el = clamp((view.elev || 0) * RAD + m.pitch, -1.35, 1.35), az = (view.az || 0) * RAD + m.yaw;
  m.camera.position.set(Math.sin(az) * Math.cos(el) * d, Math.sin(el) * d, Math.cos(az) * Math.cos(el) * d);
  m.camera.near = Math.max(0.01, d - fit * 3); m.camera.far = d + fit * 3;
  m.camera.lookAt(0, 0, 0);
  m.camera.updateProjectionMatrix();
}
function frame(now) {
  raf = 0;
  if (document.hidden) return;
  const dt = Math.min(0.1, (now - last) / 1000); last = now;
  const still = reduced.matches;
  if (!still) clock += dt;
  resize();
  const list = [];
  let changed = dirty || !still;
  for (const m of mounts) {
    if (solo && m !== solo) continue;
    if (m.state !== "ready" || !m.parts.length) continue;
    const r = m.el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > H || r.right < 0 || r.left > W) continue;
    const key = r.left + "," + r.top + "," + r.width + "," + r.height, prev = lastRects.get(m);
    if (prev !== key) { changed = true; lastRects.set(m, key); }
    list.push([m, r]);
  }
  if (changed) {
    renderer.setScissorTest(false);
    renderer.clear(true, true, false);
    if (starsOn && !solo) { buildStars(W, H, PR); renderer.setViewport(0, 0, W, H); renderer.render(starScene, starCam); }
    for (const [m, r] of list) {
      if (!still || dirty) m.parts.forEach((p) => p.role.update(p, still ? 0 : clock, m.ctx));
      if (m.def.sway && !still) m.root.rotation.y = m.def.sway.amp * RAD * Math.sin(clock / m.def.sway.period * Math.PI * 2);
      const x = r.left, y = H - r.bottom;
      renderer.setViewport(x, y, r.width, r.height);
      const sx = Math.max(0, x), sy = Math.max(0, y);
      renderer.setScissor(sx, sy, Math.max(0, Math.min(W, x + r.width) - sx), Math.max(0, Math.min(H, y + r.height) - sy));
      renderer.setScissorTest(true);
      renderer.clearDepth();
      m.camera.aspect = r.width / r.height;
      place(m);
      renderer.info.reset();
      renderer.render(m.scene, m.camera);
      m.calls = renderer.info.render.calls; m.triangles = renderer.info.render.triangles;
    }
    renderer.setScissorTest(false);
    dirty = false;
    frames++;
  }
  if (now - fpsT > 1000) { fps = Math.round(frames * 1000 / (now - fpsT)); frames = 0; fpsT = now; }
  if (mounts.size || starsOn) raf = requestAnimationFrame(frame);
}
document.addEventListener("visibilitychange", () => { if (!document.hidden) { dirty = true; start(); } });
window.addEventListener("resize", () => { dirty = true; });
reduced.addEventListener && reduced.addEventListener("change", () => { dirty = true; });

/* ---------- public API ---------- */
const api = {
  supported, ready, mount, mountCustom,
  setStars(on) { starsOn = !!on && supported; dirty = true; start(); },
  setSolo(h) { solo = h ? [...mounts].find((m) => m.handle === h) || null : null; dirty = true; },
  prefetch(ids, tier = "path") {
    if (!supported) return;
    files.then((f) => ids.forEach((id, k) => {
      const def = SCENES[id]; if (!def) return;
      resolveParts(def, f, tier).forEach((r) => { if (r) request(r.file, 50 + k); });
    }));
  },
  stats() {
    return { gpu, fps, pixelRatio: PR, mounts: [...mounts].map((m) => ({ scene: m.sceneId, calls: m.calls, triangles: m.triangles, state: m.state, tier: m.tier })) };
  }
};
window.OFMW_STAGE = api;
readyFn(api);
window.dispatchEvent(new Event("ofmw-stage-ready"));
