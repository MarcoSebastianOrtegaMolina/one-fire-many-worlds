/* Composicion de cada escena 3D del recorrido: que modelos lleva, de que tamano y como se mueve.
   Lo importa js/stage.js. Sumar o cambiar un modelo es cambiar una linea de SCENES.

   Cada linea de `parts`: [modelo, respaldo mientras el modelo no exista, diametro en la escena, papel, opciones].
   - modelo: id de models/<id>-lite.glb y models/<id>-full.glb.
   - respaldo: otro id que se usa mientras el primero no exista (null: si no existe, la escena va sin el).
   - diametro: la medida mas larga del modelo, en unidades de la escena (el planeta mide 2).
   - papel: una de las funciones de ROLES (abajo).
   La primera linea es el objeto principal. Los acompanantes van exagerados de tamano para que se distingan:
   por eso toda escena con dos objetos lleva "Not to scale".

   Estado de los modelos el 15-nov-2026 (piloto P2):
   - station: tres niveles: station-path.glb (portada, 3.4 MB), station-lite.glb (vista del mundo, 8.6 MB) y
     station-full.glb (pantalla completa, 14.4 MB). La nave en orbita es shuttle; el dueno aun elige entre shuttle y
     capsule-alt (Gemini): cambiarla es cambiar "shuttle" por "capsule-alt" en su linea. capsule (ESAS) quedo descartada.
   - mars: habitat-1, como recomienda models.json; habitat-2 de respaldo.
   - moon: el rover (rover-lite.glb) ya existe; habitat-1 queda como respaldo.
   - suit: hatch existe (recorte de la esclusa de la Estacion); el traje es suit, con astronaut de respaldo. */
import * as THREE from "three";

export const IMAGE_DIR = "img/scenes/";
export const IMAGE_EXT = "jpg";

/* Nombre, credito y pagina de origen de cada modelo. Si models/models.json los trae, mandan los de ahi.
   Fuente de estos: app/js/viewer3d.js, lineas 11 a 33. Los marcados "provisional" no estaban ahi. */
export const MODELS = {
  station: { name: "International Space Station (ISS) (D) (IGOAL)", credit: "NASA",
    page: "https://github.com/nasa/NASA-3D-Resources/tree/master/3D%20Models/International%20Space%20Station%20(ISS)%20(D)%20(IGOAL)" },
  hatch: { name: "International Space Station (ISS) (D) (IGOAL), airlock", credit: "NASA",            /* provisional */
    page: "https://github.com/nasa/NASA-3D-Resources/tree/master/3D%20Models/International%20Space%20Station%20(ISS)%20(D)%20(IGOAL)" },
  moon: { name: "Moon 3D Models for Web, AR, and Animation (moon_small)", credit: "NASA's Goddard Space Flight Center",
    page: "https://svs.gsfc.nasa.gov/14959/" },
  rover: { name: "Multi-Mission Space Exploration Vehicle", credit: "NASA", page: null },             /* provisional */
  "habitat-1": { name: "Habitat Demonstration Unit (part 1)", credit: "NASA", page: "https://science.nasa.gov/3d-resources/habitat-demonstration-unit/" },
  "habitat-2": { name: "Habitat Demonstration Unit (part 2)", credit: "NASA", page: "https://science.nasa.gov/3d-resources/habitat-demonstration-unit/" },
  mars: { name: "Planet Mars, 3D Model", credit: "NASA/JPL-Caltech", page: "https://science.nasa.gov/resource/planet-mars-3d-model" },
  earth: { name: "Earth with Clouds 3D Model", credit: "NASA Visualization Technology Applications and Development (VTAD)",
    page: "https://science.nasa.gov/resource/earth-with-clouds-3d-model" },
  suit: { name: "Extravehicular Mobility Unit", credit: "NASA/Michael D. Carbajal", page: "https://science.nasa.gov/3d-resources/extravehicular-mobility-unit/" },
  astronaut: { name: "Astronaut", credit: "NASA", page: null },                                        /* provisional */
  /* Linea de tiempo (agente F): los mismos datos que trae models/models.json para estos tres. */
  skylab: { name: "Skylab", credit: "NASA", page: "https://github.com/nasa/NASA-3D-Resources/tree/master/3D%20Models/Skylab" },
  mir: { name: "Mir", credit: "NASA", page: "https://github.com/nasa/NASA-3D-Resources/tree/master/3D%20Models/Mir" },
  "lunar-module": { name: "Apollo Lunar Module", credit: "NASA", page: "https://github.com/nasa/NASA-3D-Resources/tree/master/3D%20Models/Apollo%20Lunar%20Module" }
};

/* view: elevacion y azimut de la camara en grados; zoom < 1 acerca la camara (el encuadre deja caer algo del vaiven). sway: vaiven lento de toda la escena (amplitud en grados, periodo en s). */
export const SCENES = {
  station: { view: { elev: 22, az: 28, zoom: 0.9 }, parts: [
    ["station", null, 2.6, "spin", { period: 150 }],
    ["shuttle", null, 0.55, "orbit", { radius: 1.22, incl: 24, period: 48 }]          /* o "capsule-alt" (Gemini) */
  ] },
  moon: { view: { elev: 16, az: 0 }, parts: [
    ["moon", null, 2, "wheel", { period: -160 }],   /* negativo: la Luna gira hacia atras y el rover avanza de frente */
    ["rover", "habitat-1", 0.62, "rider", { sink: 0.012 }]                             /* habitat-1: respaldo si falta el rover */
  ] },
  mars: { view: { elev: 8, az: 0 }, parts: [
    ["mars", null, 2, "planet", { period: 90, toward: 30 }],
    ["habitat-1", "habitat-2", 0.46, "settled", { lat: 62, lon: 20, sink: 0.01 }]
  ] },
  earth: { view: { elev: 10, az: 0, zoom: 0.92 }, parts: [
    ["earth", null, 2, "planet", { period: 80, side: 23.4 }],
    ["moon", null, 0.5, "satellite", { radius: 1.5, incl: 8, period: 55 }]
  ] },
  suit: { view: { elev: 12, az: -32, zoom: 0.78 }, sway: { amp: 14, period: 40 }, parts: [
    ["hatch", null, 2, "still"],
    ["suit", "astronaut", 0.95, "floater", { dir: [0.2, 0.05, 1], dist: 1.2, amp: 0.12, period: 14, yaw: 180 }]   /* yaw 180: de frente a la camara, como el visor viejo (180deg 80deg) */
  ] },
  /* Linea de tiempo (agente F): un solo modelo que gira despacio, sin acompanantes. Solo cuando la entrada nombra
     ese vehiculo o lugar: Skylab (1974), Mir (1997), el modulo lunar de Apollo 13 (1970) y la Luna de FM2 (futuro). */
  "tl-skylab": { view: { elev: 18, az: 30, zoom: 1.12 }, parts: [["skylab", null, 2, "spin", { period: 70 }]] },
  "tl-mir": { view: { elev: 18, az: 30, zoom: 1.12 }, parts: [["mir", null, 2, "spin", { period: 70 }]] },
  "tl-lunar-module": { view: { elev: 14, az: 20 }, parts: [["lunar-module", null, 2, "spin", { period: 70 }]] },
  "tl-moon": { view: { elev: 10, az: 0 }, parts: [["moon", null, 2, "planet", { period: 120 }]] }
};

const TURN = Math.PI * 2, RAD = Math.PI / 180;

/* Cada papel arma el nodo de su parte (p.node) y lo mueve con el tiempo t, en segundos.
   ctx.main es la parte principal ya armada (o null si no existe). reach() dice hasta donde llega, para el encuadre. */
export const ROLES = {
  spin: {   /* gira sobre su eje vertical */
    setup(p) { p.node = new THREE.Group(); p.node.add(p.holder); },
    update(p, t) { p.node.rotation.y = t / (p.opt.period || 120) * TURN; },
    reach(p) { return p.size / 2; }
  },
  still: {
    setup(p) { p.node = p.holder; }, update() {}, reach(p) { return p.size / 2; }
  },
  orbit: {  /* da vueltas alrededor del centro en un plano inclinado */
    setup(p, ctx) {
      const r = (p.opt.radius || 1.6) * (ctx.main ? ctx.main.size / 2 : 1);
      p.r = r; p.node = new THREE.Group(); p.node.rotation.x = (p.opt.incl || 20) * RAD;
      p.arm = new THREE.Group(); p.node.add(p.arm); p.arm.add(p.holder); p.holder.position.set(r, 0, 0);
    },
    update(p, t) { p.arm.rotation.y = t / (p.opt.period || 45) * TURN; },
    reach(p) { return p.r + p.size / 2; }
  },
  wheel: {  /* la Luna gira bajo el rover: eje hacia la camara, la superficie de arriba corre de lado */
    setup(p) { p.node = new THREE.Group(); p.node.add(p.holder); },
    update(p, t) { p.node.rotation.z = -t / (p.opt.period || 160) * TURN; },
    reach(p) { return p.size / 2; }
  },
  rider: {  /* fijo arriba del planeta, cerca del borde visible, con su lado largo de costado */
    setup(p, ctx) {
      p.node = new THREE.Group(); p.node.add(p.holder);
      if (p.box.x < p.box.z) p.holder.rotation.y = Math.PI / 2;
      const R = ctx.main ? ctx.main.size / 2 : 0;
      p.node.position.y = R - p.bottom - (p.opt.sink || 0) * (ctx.main ? 1 : 0);
      p.top = p.node.position.y + p.halfH;
    },
    update() {},
    reach(p) { return Math.max(p.size / 2, p.top || 0); }
  },
  planet: { /* gira sobre un eje inclinado: toward lo inclina hacia la camara, side hacia un lado */
    setup(p) {
      p.node = new THREE.Group();
      p.node.rotation.x = (p.opt.toward || 0) * RAD; p.node.rotation.z = -(p.opt.side || 0) * RAD;
      p.spin = new THREE.Group(); p.node.add(p.spin); p.spin.add(p.holder);
    },
    update(p, t) { p.spin.rotation.y = t / (p.opt.period || 90) * TURN; },
    reach(p) { return p.size / 2; }
  },
  settled: { /* posado en la superficie del planeta y girando con el, a latitud alta */
    setup(p, ctx) {
      p.node = new THREE.Group(); p.node.add(p.holder);
      if (!ctx.main || !ctx.main.spin) return;
      const R = ctx.main.size / 2, lat = (p.opt.lat || 60) * RAD, lon = (p.opt.lon || 0) * RAD;
      const n = new THREE.Vector3(Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon));
      p.node.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
      p.node.position.copy(n).multiplyScalar(R - p.bottom - (p.opt.sink || 0));
      p.attach = ctx.main.spin;
    },
    update() {},
    reach(p, ctx) { return (ctx.main ? ctx.main.size / 2 : 0) + p.size; }
  },
  satellite: { /* luna en orbita, siempre con la misma cara hacia el planeta */
    setup(p, ctx) { ROLES.orbit.setup(p, ctx); },
    update(p, t) { ROLES.orbit.update(p, t); },
    reach(p) { return p.r + p.size / 2; }
  },
  floater: { /* flota hacia la escotilla con un vaiven lento */
    setup(p, ctx) {
      p.node = new THREE.Group(); p.node.add(p.holder);
      p.holder.rotation.y = (p.opt.yaw || 0) * RAD;
      p.dir = new THREE.Vector3().fromArray(p.opt.dir || [0, 0, 1]).normalize();
      p.alone = !ctx.main;
    },
    update(p, t) {
      if (p.alone) { p.node.rotation.y = t / 60 * TURN; return; }
      const d = (p.opt.dist || 1.4) + (p.opt.amp || 0.15) * Math.sin(t / (p.opt.period || 14) * TURN);
      p.node.position.copy(p.dir).multiplyScalar(d);
      p.node.position.y += 0.04 * Math.sin(t / 9 * TURN);
      p.node.rotation.z = 0.06 * Math.sin(t / 11 * TURN);
    },
    reach(p) { return p.alone ? p.size / 2 : (p.opt.dist || 1.4) + (p.opt.amp || 0.15) + p.size / 2; }
  }
};
