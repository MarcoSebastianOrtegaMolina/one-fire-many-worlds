/* The first screen of the home page: the problem (agent K). Classic script, no libraries.
   window.OFMW_INTRO()          builds and returns the element: a first screen with the title, two lines (the problem
                                and what the platform does), the Apollo craft in 3D with the oxygen tank burst of
                                Apollo 13 and a button down to the worlds (#worlds); then a band with the fires the
                                challenge cites (from the timeline) and the two candles, on Earth and in free fall.
                                Calling it again first takes down what the previous call mounted.
   window.OFMW_INTRO.dispose()  takes down the 3D craft, the 3D title words and the listeners.
   The craft is a hand-made scene on the shared stage (js/stage.js, mountCustom). It uses models/apollo-lite.glb when
   models/models.json lists "apollo", else the Lunar Module without the burst. Without WebGL, or if it fails, a still
   image in the same place. With reduced motion the craft stands still and nothing bursts.
   Route #/intro-preview shows the element alone, for review. */
(function () {
  "use strict";
  var A = window.OFMW_APP;
  if (!A || !A.h) return;
  var h = A.h, T = A.T;

  A.es({
    "Fire safety for every world where people will live": "Seguridad contra incendios para cada mundo donde vivirá la gente",
    "In free fall, fire does not rise: it becomes a sphere, and decades of NASA flame data are hard to find and compare.":
      "En caída libre el fuego no sube: se vuelve una esfera, y décadas de datos de flamas de NASA son difíciles de encontrar y comparar.",
    "This platform sorts and interprets {tests} tests from {inv} investigations into what is known to prevent, detect and suppress fire on every world.":
      "Esta plataforma ordena e interpreta {tests} pruebas de {inv} investigaciones en lo que se sabe para prevenir, detectar y apagar el fuego en cada mundo.",
    "The problem": "El problema",
    "Fires and alarms the challenge cites": "Incendios y alarmas que cita el reto",
    "Open {title} on the timeline": "Abrir {title} en la línea de tiempo",
    "See the five worlds": "Ver los cinco mundos",
    "More below": "Más abajo",
    "Model credits": "Créditos de los modelos",
    "Illustration of the event.": "Ilustración del suceso.",
    "Model: ": "Modelo: ",
    'NASA, Apollo spacecraft from the model "Apollo Soyuz"': 'NASA, la nave Apollo del modelo "Apollo Soyuz"',
    "Apollo spacecraft drifting in space; on one side of its service module, a burst of gas and small fragments, repeated every few seconds.":
      "La nave Apollo flotando en el espacio; de un costado de su módulo de servicio sale, cada pocos segundos, un estallido de gas y fragmentos chicos.",
    "Apollo Lunar Module drifting in space.": "El módulo lunar del Apollo flotando en el espacio.",
    "Apollo spacecraft drifting in space.": "La nave Apollo flotando en el espacio.",
    "Illustration: a candle flame on Earth and in free fall. Without buoyancy the hot gas does not rise, and the flame becomes a blue sphere.":
      "Ilustración: la flama de una vela en la Tierra y en caída libre. Sin flotación el gas caliente no sube, y la flama se vuelve una esfera azul.",
    "On Earth": "En la Tierra", "In free fall": "En caída libre",
    "Intro preview": "Vista previa de la primera pantalla",
    "Back to home": "Volver a la portada",
    "The first screen of the home page, alone, for review before it goes on the home page.":
      "La primera pantalla de la portada, sola, para revisarla antes de ponerla en la portada."
  });

  var TITLE = "Fire safety for every world where people will live";
  var LINE_PROBLEM = "In free fall, fire does not rise: it becomes a sphere, and decades of NASA flame data are hard to find and compare.";
  var LINE_DOES = "This platform sorts and interprets {tests} tests from {inv} investigations into what is known to prevent, detect and suppress fire on every world.";
  var reduced = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  var live = null;   /* what the last call mounted: { h1, flame, handle, off: [] } */

  function fill(template, map) {   /* "text {key} text" -> nodes, each {key} replaced by map[key] */
    return T(template).split(/(\{\w+\})/).map(function (part) {
      var m = /^\{(\w+)\}$/.exec(part);
      return m && map[m[1]] !== undefined ? map[m[1]] : part;
    }).filter(function (x) { return x !== ""; });
  }
  function slug(e) {   /* the same address js/timeline.js gives an entry */
    var y = String(e.year);
    if (/^\d{4}$/.test(y)) return y;
    y = y.toLowerCase();
    if (y === "recent" || y === "reciente") return "recent";
    if (y === "future" || y === "futuro") return "future";
    return encodeURIComponent(y);
  }
  function firstSentence(text) {   /* the timeline's own text, cut at its first sentence */
    var t = String(text || ""), m = /^(.+?[.!?])(\s|$)/.exec(t);
    return m ? m[1] : t;
  }

  /* ---------- the fires the challenge cites, from the timeline ---------- */
  function accidents() {
    var list = ((A.C && A.C.timeline) || []).filter(function (e) { return e && e.kind === "accident"; }).slice(0, 4);
    if (!list.length) return null;
    return h("section", { "class": "in-acc", "aria-labelledby": "in-acc-h" },
      h("h2", { "class": "in-acc-h", id: "in-acc-h", text: T("Fires and alarms the challenge cites") }),
      h("ol", { "class": "in-acc-list" }, list.map(function (e) {
        return h("li", { "class": "in-acc-item" },
          h("a", { "class": "in-acc-link", href: "#/timeline/" + slug(e), "data-year": slug(e),
            "aria-label": fill("Open {title} on the timeline", { title: e.title }).join("") + ", " + e.year },
            h("span", { "class": "in-acc-year" + (/^\d{4}$/.test(e.year) ? " num" : ""), text: e.year }),
            h("span", { "class": "in-acc-title", text: e.title }),
            h("span", { "class": "in-acc-what", text: firstSentence(e.what) })));
      })));
  }

  /* ---------- the flame: two candles drawn in SVG, the same candle with the flame of each world ----------
     Left, on Earth: the teardrop flame, yellow with a blue base, that flickers. Right, in free fall: a sphere full of
     blue light around the wick, brightest near it and fading to a soft edge, weaker and smaller, that breathes.
     No WebGL needed; with reduced motion both stand still (CSS). */
  var svgN = 0;
  function candles() {
    var k = "in" + (++svgN), u = function (id) { return "url(#" + k + id + ")"; };
    return '<svg class="in-svg" viewBox="0 0 360 300" role="presentation" focusable="false" aria-hidden="true">' +
      '<defs>' +
        '<radialGradient id="' + k + 'eg" cx="0.5" cy="0.8" r="0.8">' +
          '<stop offset="0" stop-color="#ffffff"/><stop offset="0.2" stop-color="#fff4d8"/><stop offset="0.48" stop-color="#ffd884"/>' +
          '<stop offset="0.78" stop-color="#f6a750" stop-opacity="0.92"/><stop offset="1" stop-color="#f29d49" stop-opacity="0.35"/></radialGradient>' +
        '<radialGradient id="' + k + 'eb" cx="0.5" cy="0.5" r="0.5">' +
          '<stop offset="0" stop-color="#288bff" stop-opacity="0.95"/><stop offset="0.6" stop-color="#609af6" stop-opacity="0.6"/><stop offset="1" stop-color="#609af6" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="' + k + 'eh" cx="0.5" cy="0.6" r="0.5">' +
          '<stop offset="0" stop-color="#f3a868" stop-opacity="0.3"/><stop offset="1" stop-color="#f3a868" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="' + k + 'sg" cx="0.5" cy="0.5" r="0.5">' +
          '<stop offset="0" stop-color="#eef4ff" stop-opacity="0.95"/><stop offset="0.12" stop-color="#bcd3ff" stop-opacity="0.85"/>' +
          '<stop offset="0.36" stop-color="#8fb8ff" stop-opacity="0.62"/><stop offset="0.66" stop-color="#609af6" stop-opacity="0.44"/>' +
          '<stop offset="0.88" stop-color="#3d8cf8" stop-opacity="0.36"/><stop offset="0.95" stop-color="#288bff" stop-opacity="0.22"/>' +
          '<stop offset="1" stop-color="#288bff" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="' + k + 'sh" cx="0.5" cy="0.5" r="0.5">' +
          '<stop offset="0.55" stop-color="#609af6" stop-opacity="0.16"/><stop offset="1" stop-color="#609af6" stop-opacity="0"/></radialGradient>' +
      '</defs>' +
      /* on Earth */
      '<g class="in-c in-c-earth">' +
        '<rect x="89" y="186" width="32" height="104" rx="2" fill="#e6e0d4"/><ellipse cx="105" cy="186" rx="16" ry="4" fill="#f4f0e8"/>' +
        '<path d="M105 186 L105 170 Q105.5 166 107 164" stroke="#2e2e32" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<g class="in-fl-earth">' +
          '<ellipse cx="105" cy="128" rx="44" ry="66" fill="' + u("eh") + '"/>' +
          '<path d="M105 70 C113 98 126 122 124 147 C122 166 115 177 105 177 C95 177 88 166 86 147 C84 122 97 98 105 70 Z" fill="' + u("eg") + '"/>' +
          '<ellipse cx="105" cy="168" rx="13" ry="11" fill="' + u("eb") + '"/>' +
        '</g>' +
      '</g>' +
      /* in free fall: the same candle, a little nearer the middle and a little larger in the frame */
      '<g class="in-c in-c-space">' +
        '<rect x="223" y="196" width="36" height="94" rx="2" fill="#e6e0d4"/><ellipse cx="241" cy="196" rx="18" ry="4.5" fill="#f4f0e8"/>' +
        '<path d="M241 196 L241 178" stroke="#2e2e32" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<g class="in-fl-space">' +
          '<circle cx="241" cy="167" r="60" fill="' + u("sh") + '"/>' +
          '<circle cx="241" cy="167" r="42" fill="' + u("sg") + '"/>' +
        '</g>' +
      '</g>' +
    '</svg>';
  }

  /* ---------- the craft: Apollo with the Apollo 13 oxygen tank burst, on the shared stage ---------- */
  var LM = { id: "lunar-module", name: "Apollo Lunar Module", credit: "NASA", page: "https://github.com/nasa/NASA-3D-Resources/tree/master/3D%20Models/Apollo%20Lunar%20Module" };
  var STILL = "img/scenes/intro-apollo.webp";   /* taken from this same scene, standing still, on black */
  var APOLLO = { text: 'NASA, Apollo spacecraft from the model "Apollo Soyuz"', page: "https://github.com/nasa/NASA-3D-Resources/tree/master/3D%20Models/Apollo%20Soyuz" };
  var manifest = null;
  function readManifest() {   /* models/models.json, read once: does it list the Apollo craft yet? */
    if (!manifest) manifest = fetch("models/models.json", { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
    return manifest;
  }
  function apolloEntry(m) {
    var list = m ? (Array.isArray(m) ? m : (m.models || m)) : null, i, e;
    if (!list) return null;
    if (!Array.isArray(list)) list = Object.keys(list).map(function (k) { var x = list[k]; if (x && typeof x === "object" && !x.id) x.id = k; return x; });
    for (i = 0; i < list.length; i++) {
      e = list[i];
      if (e && e.id === "apollo" && (!e.tier || e.tier === "lite")) return e;
    }
    return null;
  }
  function vec(v, fallback) {
    if (Array.isArray(v) && v.length >= 3) return [+v[0], +v[1], +v[2]];
    if (v && typeof v === "object" && "x" in v) return [+v.x, +v.y, +v.z];
    if (typeof v === "string") return { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1], "-x": [-1, 0, 0], "-y": [0, -1, 0], "-z": [0, 0, -1] }[v.toLowerCase()] || fallback;
    return fallback;
  }
  function dotTexture(THREE) {   /* a soft round dot, for the gas and the flash */
    var c = document.createElement("canvas"); c.width = c.height = 64;
    var x = c.getContext("2d"), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.35, "rgba(255,255,255,.55)"); g.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    var t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  function craftScene(entry) {
    return function (THREE, ctx) {
      var trash = [], group = new THREE.Group(), turn = new THREE.Group(), aligned = new THREE.Group(), ticks = [];
      var SIZE = 2.5, still = ctx.reduced || reduced.matches;
      function keep(x) { trash.push(x); return x; }
      /* the model is plain white: a key light from the side and a dim fill give it volume on the black */
      var key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(5, 2.5, 1.5);
      var fill = new THREE.DirectionalLight(0xc9d8ff, 0.35); fill.position.set(-3, -1.5, 4);
      group.add(key, fill, turn); turn.add(aligned);
      var id = entry ? (entry.id || "apollo") : LM.id;
      var ready = ctx.model(id, "lite", SIZE).then(function (obj) {
        aligned.add(obj);
        if (!entry) { aligned.rotation.set(0.18, -0.6, 0.08); return; }
        /* the long axis of the craft across the frame, a little tilted; the burst side turned toward the camera */
        var axis = new THREE.Vector3().fromArray(vec(entry.axis && entry.axis.direction ? entry.axis.direction : entry.axis, [1, 0, 0])).normalize();
        var target = new THREE.Vector3(1, -0.16, 0.22).normalize();
        var q = new THREE.Quaternion().setFromUnitVectors(axis, target);
        var b = entry.burst || {}, bp = vec(b.position || b.pos || b.point || b.p, null), bd = vec(b.direction || b.dir || b.normal || b.d, [0, 0, 1]);
        var dir = new THREE.Vector3().fromArray(bd).normalize().applyQuaternion(q);
        var want = new THREE.Vector3(0.15, 0.45, 0.88);
        var a1 = dir.clone().sub(target.clone().multiplyScalar(dir.dot(target))), a2 = want.clone().sub(target.clone().multiplyScalar(want.dot(target)));
        if (a1.lengthSq() > 1e-6 && a2.lengthSq() > 1e-6) q.premultiply(new THREE.Quaternion().setFromUnitVectors(a1.normalize(), a2.normalize()));
        aligned.quaternion.copy(q);
        if (!bp || still) return;
        /* the burst point in the model's own units, mapped like the stage's normalize() did: centred, then scaled */
        var scaled = obj.children[0], inner = scaled && scaled.children[0], k = scaled ? scaled.scale.x : 1;
        var p = new THREE.Vector3(bp[0], bp[1], bp[2]);
        if (inner) p.add(inner.position);
        p.multiplyScalar(k);
        burst(THREE, aligned, p, new THREE.Vector3().fromArray(bd).normalize(), k, b);
      }).catch(function (err) { if (window.console) console.warn("intro craft: " + (err && err.message)); throw err; });
      /* Apollo 13: a panel of the service module flies off, a thin dense jet of gas opens into a cone and fades, a few
         small fragments, a short flash and a small jolt of the craft. Then the craft stays clean for a few seconds. */
      var jolt = -1;
      function burst(THREE, parent, p, d, k, info) {
        var dot = keep(dotTexture(THREE)), PERIOD = 8, START = 0.4, i;
        var side = new THREE.Vector3(1, 0, 0); if (Math.abs(d.dot(side)) > 0.9) side.set(0, 1, 0);
        var u = new THREE.Vector3().crossVectors(d, side).normalize(), w = new THREE.Vector3().crossVectors(d, u).normalize();
        function rnd(a0, a1) { return a0 + Math.random() * (a1 - a0); }
        function perp() { var a = Math.random() * Math.PI * 2; return u.clone().multiplyScalar(Math.cos(a)).add(w.clone().multiplyScalar(Math.sin(a))); }
        /* the panel: a thin curved piece of the cylinder skin, in the model's own units, centred on the burst point */
        var r = (info && info.serviceModuleRadius) || 2.56, H = 2.1, TH = 0.62;
        var pg = keep(new THREE.CylinderGeometry(r, r, H, 16, 1, true, -TH / 2, TH));
        pg.rotateZ(-Math.PI / 2); pg.translate(0, 0, -r);
        var panelMat = keep(new THREE.MeshStandardMaterial({ color: 0xe6e6e8, emissive: 0x6a6a70, metalness: 0.2, roughness: 0.5, side: THREE.DoubleSide, transparent: true }));
        var panel = new THREE.Mesh(pg, panelMat); panel.scale.setScalar(k * 1.02); parent.add(panel);
        /* where it was: a dark opening that stays until the cycle starts again */
        var holeMat = keep(new THREE.MeshBasicMaterial({ color: 0x0b0b0d, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
        var hole = new THREE.Mesh(pg, holeMat); hole.scale.setScalar(k * 1.004); hole.position.copy(p); parent.add(hole);
        var spinAxis = new THREE.Vector3(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)).normalize(), drift = d.clone().multiplyScalar(0.7).add(new THREE.Vector3(0, 0, 0)).add(u.clone().multiplyScalar(0.5)).normalize();
        /* the jet: many small dots let out over a second, fast along d, spreading into a cone as they go */
        var N = 520, gas = [], pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
        for (i = 0; i < N; i++) gas.push({ t0: Math.pow(Math.random(), 1.6) * 1.3, sp: rnd(0.55, 1.15), side: perp().multiplyScalar(Math.pow(Math.random(), 0.8) * 0.42), life: rnd(1.3, 2.3) });
        var geo = keep(new THREE.BufferGeometry());
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3)); geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
        var gasMat = keep(new THREE.PointsMaterial({ size: 0.1, map: dot, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true, toneMapped: false }));
        var cloud = new THREE.Points(geo, gasMat); cloud.frustumCulled = false; parent.add(cloud);
        /* the flash: short */
        var flashMat = keep(new THREE.SpriteMaterial({ map: dot, color: 0xeaf2ff, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, toneMapped: false }));
        var flash = new THREE.Sprite(flashMat); flash.position.copy(p); parent.add(flash);
        /* a few small fragments */
        var bits = [], bitGeo = keep(new THREE.BoxGeometry(1, 0.6, 0.12));
        for (i = 0; i < 6; i++) {
          var mat = keep(new THREE.MeshStandardMaterial({ color: 0xd1d1d3, metalness: 0.4, roughness: 0.45, transparent: true }));
          var m = new THREE.Mesh(bitGeo, mat); m.scale.setScalar(rnd(0.05, 0.085)); parent.add(m);
          bits.push({ m: m, v: d.clone().add(perp().multiplyScalar(rnd(0.3, 0.9))).normalize().multiplyScalar(rnd(0.45, 0.9)), spin: new THREE.Vector3(rnd(2, 6), rnd(2, 6), rnd(2, 6)) });
        }
        function hideAll() { panel.visible = hole.visible = flash.visible = false; bits.forEach(function (x) { x.m.visible = false; }); }
        hideAll();
        ticks.push(function (t) {
          var age = (t % PERIOD) - START, j, g, a, f, dist;
          if (age < 0 || age > 4.6) { hideAll(); for (j = 0; j < N * 3; j++) col[j] = 0; geo.attributes.color.needsUpdate = true; jolt = -1; return; }
          jolt = age;
          hole.visible = true;
          /* flash, about 0.15 s */
          flash.visible = age < 0.18;
          if (flash.visible) { flash.scale.setScalar(0.25 + age * 4); flashMat.opacity = 1 - age / 0.18; }
          /* the panel: off the side, turning and drifting away, clearly seen for two seconds, then fading */
          panel.visible = age < 4.2;
          var pd = age * (0.22 + 0.08 * Math.min(1, age));
          panel.position.copy(p).addScaledVector(drift, pd + 0.02);
          panel.quaternion.setFromAxisAngle(spinAxis, age * 1.7);
          panelMat.opacity = Math.max(0, Math.min(1, (4.2 - age) / 1.2));
          /* the jet */
          for (j = 0; j < N; j++) {
            g = gas[j]; a = age - g.t0;
            if (a < 0 || a > g.life) { col[j * 3] = col[j * 3 + 1] = col[j * 3 + 2] = 0; continue; }
            dist = g.sp * a * (1 - 0.22 * a / g.life);
            pos[j * 3] = p.x + d.x * dist + g.side.x * dist; pos[j * 3 + 1] = p.y + d.y * dist + g.side.y * dist; pos[j * 3 + 2] = p.z + d.z * dist + g.side.z * dist;
            f = (1 - a / g.life) * (a < 0.05 ? a / 0.05 : 1) * 0.8;
            col[j * 3] = 0.84 * f; col[j * 3 + 1] = 0.9 * f; col[j * 3 + 2] = 1.0 * f;
          }
          geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true;
          bits.forEach(function (x) {
            x.m.visible = age < 3.4;
            x.m.position.copy(p).addScaledVector(x.v, age);
            x.m.rotation.set(x.spin.x * age, x.spin.y * age, x.spin.z * age);
            x.m.material.opacity = Math.max(0, Math.min(1, (3.4 - age) / 1));
          });
        });
      }
      return {
        object: group, ready: ready,
        update: function (t) {
          var s = still ? 0 : t;
          turn.position.y = Math.sin(s * 0.45) * 0.06;            /* drifting */
          turn.rotation.y = Math.sin(s * 0.11) * 0.42;            /* turning slowly, side to side */
          turn.rotation.z = Math.sin(s * 0.07) * 0.06;
          turn.position.x = 0;
          if (!still && jolt >= 0 && jolt < 0.5) { var e = 1 - jolt / 0.5; turn.position.x = Math.sin(jolt * 70) * 0.02 * e; turn.rotation.z += Math.sin(jolt * 55) * 0.012 * e; }
          if (!still) ticks.forEach(function (f) { f(s); });   /* runs the burst first: jolt is read on the next frame */
        },
        place: function (camera, rect) {
          camera.fov = 28; camera.aspect = Math.max(1, rect.width) / Math.max(1, rect.height);
          var half = 1.55 / Math.tan(14 * Math.PI / 180), d = camera.aspect < 1 ? half / camera.aspect : half;
          camera.position.set(0, 0.45, d); camera.near = 0.1; camera.far = 100;   /* the craft a little low in the frame: the burst goes up */
          camera.lookAt(0, 0.45, 0); camera.updateProjectionMatrix();
        },
        dispose: function () { trash.forEach(function (x) { x.dispose(); }); trash = []; ticks = []; }
      };
    };
  }
  function stage() {
    if (window.OFMW_STAGE) return Promise.resolve(window.OFMW_STAGE);
    return new Promise(function (res) {
      window.addEventListener("ofmw-stage-ready", function () { res(window.OFMW_STAGE); }, { once: true });
      setTimeout(function () { res(window.OFMW_STAGE || null); }, 10000);
    });
  }
  function showStill(rec) {
    if (live !== rec || rec.craft.querySelector(".in-still")) return;
    rec.craft.setAttribute("data-mode", "still");
    rec.box.appendChild(h("img", { "class": "in-still", src: STILL, alt: T("Apollo spacecraft drifting in space."), width: "1000", height: "1000", decoding: "async" }));
    rec.setCredit({ text: T(APOLLO.text), page: APOLLO.page });
  }
  function mountCraft(rec) {
    stage().then(function (S) {
      if (live !== rec) return;
      if (!S || !S.supported || typeof S.mountCustom !== "function") { showStill(rec); return; }
      return readManifest().then(function (m) {
        if (live !== rec) return;
        var entry = window.OFMW_INTRO.testEntry || apolloEntry(m);   /* testEntry: for review, another model standing in for Apollo */
        rec.setCredit(entry ? { text: T('NASA, Apollo spacecraft from the model "Apollo Soyuz"'), page: entry.sourceUrl || entry.page || null } : LM);
        rec.box.setAttribute("aria-label", T(entry ? "Apollo spacecraft drifting in space; on one side of its service module, a burst of gas and small fragments, repeated every few seconds." : "Apollo Lunar Module drifting in space."));
        rec.craft.setAttribute("data-model", entry ? "apollo" : LM.id);
        if (entry) rec.craft.querySelector(".in-craft-ill").removeAttribute("hidden");   /* only the craft with the burst illustrates the event */
        var hd;
        try { hd = S.mountCustom(rec.stageBox, { id: "intro-craft", fov: 28, build: craftScene(entry) }); } catch (e) { showStill(rec); return; }
        rec.handle = hd;
        hd.onState(function (st) {
          if (live !== rec) return;
          if (st === "error") showStill(rec); else rec.craft.setAttribute("data-mode", st === "ready" ? "3d" : "loading");
        });
      });
    }).catch(function () { showStill(rec); });
  }

  /* ---------- the screen ---------- */
  function topOffset() {   /* the banner and the header above the screen, so it fills what is left of the window */
    var head = document.getElementById("head"), r = head ? head.getBoundingClientRect() : null;
    return r ? Math.max(0, Math.round(r.bottom + (window.scrollY || 0))) : 96;
  }
  function headHeight() { var head = document.getElementById("head"); return head ? head.offsetHeight : 60; }

  function dispose() {
    var rec = live; live = null;
    if (!rec) return;
    try { if (rec.handle) rec.handle.dispose(); } catch (e) { /* already gone */ }
    rec.handle = null;
    try { if (window.OFMW_TITLE && typeof window.OFMW_TITLE.dispose === "function") window.OFMW_TITLE.dispose(rec.h1); } catch (e) { /* the flat title stays */ }
    rec.off.forEach(function (f) { try { f(); } catch (e) { /* nothing to undo */ } });
    rec.off = [];
  }

  function build() {
    dispose();
    var rec = { off: [], handle: null };
    live = rec;
    var S = (A.D && A.D.summary) || {};

    var h1 = h("h1", { "class": "in-title", text: T(TITLE) });
    rec.h1 = h1;

    /* the craft: 3D on the stage, or a still image; under it, the fact, its link and the credit */
    var tl = ((A.C && A.C.timeline) || []).filter(function (e) { return e && String(e.year) === "1970"; })[0];
    var stageBox = h("div", { "class": "in-craft-stage", "aria-hidden": "true" });
    var box = h("div", { "class": "in-craft-box", role: "img", "aria-label": T("Apollo Lunar Module drifting in space.") }, stageBox);
    var creditSlot = h("span", { "class": "in-craft-credit" });
    var craft = h("figure", { "class": "in-craft", "data-mode": "loading" }, box,
      h("figcaption", { "class": "in-craft-cap" },
        tl ? h("a", { "class": "in-craft-fact", href: "#/timeline/" + slug(tl) },
          h("span", { "class": "in-n", text: tl.year }), " ", h("b", { text: tl.title }), ". ", firstSentence(tl.what)) : null,
        h("span", { "class": "in-craft-note" }, h("span", { "class": "in-craft-ill", hidden: "" }, T("Illustration of the event."), " "), creditSlot)));
    rec.craft = craft; rec.box = box; rec.stageBox = stageBox;
    rec.setCredit = function (m) {
      var label = m.text || (m.name + " (" + m.credit + ")");
      creditSlot.replaceChildren(T("Model: "), m.page ? h("a", { href: m.page, target: "_blank", rel: "noopener", text: label }) : label);
    };
    rec.setCredit(LM);

    var lines = h("div", { "class": "in-lines" },
      h("p", { "class": "in-line in-line-1", text: T(LINE_PROBLEM) }),
      h("p", { "class": "in-line in-line-2" }, fill(LINE_DOES, {
        tests: h("span", { "class": "in-n", text: A.fmt(S.tests != null ? S.tests : 0) }), inv: h("span", { "class": "in-n", text: A.fmt(S.investigations != null ? S.investigations : 0) }) })));

    var go = h("a", { "class": "c-btn in-go", href: "#worlds", text: T("See the five worlds"),
      onclick: function (ev) { ev.preventDefault(); down(); } });

    var credits = null;
    try {
      var cr = window.OFMW_TITLE && typeof window.OFMW_TITLE.credits === "function" ? window.OFMW_TITLE.credits() : null;
      if (cr && (cr.text || cr.credit)) credits = h("details", { "class": "in-credits" },
        h("summary", { text: T("Model credits") }),
        h("p", null, cr.href ? h("a", { href: cr.href, target: "_blank", rel: "noopener", text: cr.text || cr.credit }) : (cr.text || cr.credit)));
    } catch (e) { credits = null; }

    var first = h("div", { "class": "in-first" },
      h("div", { "class": "in-grid wrap" }, h1, craft, lines, h("div", { "class": "in-act" }, go)),
      h("div", { "class": "in-foot wrap" }, h("p", { "class": "in-more", "aria-hidden": "true" }, h("span", { "class": "in-more-line" }), h("span", { text: T("More below") })), credits));

    var band = h("div", { "class": "in-band wrap" }, accidents(),
      h("figure", { "class": "in-flame" },
        h("div", { "class": "in-flame-box", html: candles() }),
        h("div", { "class": "in-flame-labels" }, h("span", { "class": "in-lab in-lab-earth", text: T("On Earth") }), h("span", { "class": "in-lab in-lab-space", text: T("In free fall") })),
        h("figcaption", { "class": "in-flame-cap", text: T("Illustration: a candle flame on Earth and in free fall. Without buoyancy the hot gas does not rise, and the flame becomes a blue sphere.") })));

    var screen = h("section", { "class": "in-screen", id: "intro", "aria-label": T("The problem") }, first, band);

    function down() {
      var target = document.getElementById("worlds"), smooth = reduced.matches ? "auto" : "smooth";
      if (target) { target.scrollIntoView({ behavior: smooth, block: "start" }); try { target.focus({ preventScroll: true }); } catch (e) { /* not focusable */ } }
      else window.scrollBy({ top: Math.max(200, window.innerHeight - headHeight()), behavior: smooth });
    }
    screen.scrollDown = down;

    function size() { screen.style.setProperty("--in-top", topOffset() + "px"); }
    size();
    window.addEventListener("resize", size);
    rec.off.push(function () { window.removeEventListener("resize", size); });

    try { if (window.OFMW_TITLE && typeof window.OFMW_TITLE.enhance === "function") window.OFMW_TITLE.enhance(h1); } catch (e) { /* the flat title stays */ }
    try { mountCraft(rec); } catch (e) { showStill(rec); }
    return screen;
  }

  window.OFMW_INTRO = build;
  window.OFMW_INTRO.dispose = dispose;

  /* ---------- review route: the screen alone, until the home page hangs it ---------- */
  if (!A.route) return;
  A.route("intro-preview", "world", function () {
    document.title = T("Intro preview") + " · One Fire, Many Worlds";
    var screen = build();
    A.main.replaceChildren(h("div", { "class": "in-preview" }, screen,
      h("div", { "class": "wrap in-preview-next", id: "worlds", tabindex: "-1" },
        A.back("#/", T("Back to home")),
        h("p", { "class": "c-what", text: T("The first screen of the home page, alone, for review before it goes on the home page.") }))));
    function leave() {
      if (/^#\/?intro-preview/.test(location.hash)) return;
      window.removeEventListener("hashchange", leave);
      dispose();
    }
    window.addEventListener("hashchange", leave);
  });
})();
