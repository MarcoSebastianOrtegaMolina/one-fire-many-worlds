/* The home title with two special words (agent H). Classic script, no libraries.
   window.OFMW_TITLE.enhance(h1)  wraps "Fire"/"incendios" (flames in the lower half of the letters) and
                                  "world"/"mundo" (NASA's Earth at night inside the letters). The text stays real
                                  text; the h1 gets an aria-label with the whole sentence. Calling it twice does
                                  not duplicate anything. Other text: nothing happens.
   window.OFMW_TITLE.dispose(h1)  puts the h1 back as it was.
   window.OFMW_TITLE.credits()    the credit and link of the NASA image, for the footer of the home page.
   The flame textures are drawn once into a small canvas and used as CSS backgrounds: no drawing loop.
   Route #/title-preview shows the title on black, in both languages, at 56, 74 and 96 px. */
(function () {
  "use strict";
  var A = window.OFMW_APP;
  var T = (A && A.T) || window.OFMW_T || function (x) { return x; };
  if (A && A.es) A.es({
    "Title preview": "Vista previa del título",
    "The home title with its two special words, on black, in English and Spanish, at three sizes. For review before it goes on the home page.":
      "El título de la portada con sus dos palabras especiales, sobre negro, en inglés y en español, a tres tamaños. Para revisarlo antes de ponerlo en la portada.",
    "Back to home": "Volver a la portada",
    "English": "Inglés", "Spanish": "Español",
    "Variant A: flames only": "Variante A: solo llamas",
    "Variant B: flames with tree silhouettes": "Variante B: llamas con siluetas de árboles",
    "The flames rise inside the lower half of the letters; the upper half stays white.":
      "Las llamas suben por la mitad de abajo de las letras; la mitad de arriba queda blanca.",
    "The same flames with a row of pine trees cut out against them at the foot of the letters.":
      "Las mismas llamas con una fila de pinos recortados contra ellas al pie de las letras.",
    "Set at": "Tamaño de letra", "On narrow screens the size shrinks to fit the width.": "En pantallas angostas el tamaño se reduce para caber a lo ancho.",
    "Image inside the word world: ": "Imagen dentro de la palabra mundo: ",
    "NASA page of the image": "Página de NASA de la imagen",
    "Measured on this page": "Medido en esta página",
    "Time to apply the effect to one title: ": "Tiempo para aplicar el efecto a un título: ",
    "Frames per second with every sample moving: ": "Cuadros por segundo con todas las muestras en movimiento: ",
    "measuring": "midiendo", "first title": "el primero", "then": "después", "on average": "en promedio",
    "Motion is reduced on this device: the flames and the Earth stand still.": "Este equipo pide reducir el movimiento: las llamas y la Tierra quedan quietas.",
    "The home title with its two special words in 3D, in English and Spanish, at three sizes; below, the flat version used without WebGL.":
      "El título de la portada con sus dos palabras especiales en 3D, en inglés y en español, a tres tamaños; abajo, la versión plana que se usa sin WebGL.",
    "With volume": "Con volumen", "Without 3D": "Sin 3D",
    "The two words are drawn in 3D on the shared stage; the rest of the title is flat white text. Line height 1.5, so the line above does not hide the city and the two craft.":
      "Las dos palabras se dibujan en 3D en el escenario compartido; el resto del título es texto blanco plano. Interlineado de 1.5, para que el renglón de arriba no tape la ciudad ni las dos naves.",
    "The two words are drawn in 3D on the shared stage; the rest of the title is flat white text.":
      "Las dos palabras se dibujan en 3D en el escenario compartido; el resto del título es texto blanco plano.",
    "Used when there is no WebGL: flames inside the letters and NASA's Earth at night inside the word world.":
      "Se usa cuando no hay WebGL: llamas dentro de las letras y la Tierra de noche de NASA dentro de la palabra mundo.",
    "Five worlds at once, to measure": "Cinco mundos a la vez, para medir",
    "The five worlds of the home page, mounted here only to measure the frame rate with the title.":
      "Los cinco mundos de la portada, montados aquí solo para medir los cuadros por segundo con el título.",
    "Credits": "Créditos", "The small city on the word world is hand-made decoration, not a real place.":
      "La ciudad chiquita sobre la palabra mundo es decoración hecha a mano, no un lugar real.",
    "Frames per second on this page: ": "Cuadros por segundo en esta página: ",
    "Draw calls for the two words of one title: ": "Llamadas de dibujo de las dos palabras de un título: ",
    "Graphics: ": "Gráficos: ", "No WebGL here: the flat version is shown.": "Aquí no hay WebGL: se muestra la versión plana.",
    "Title models: ": "Modelos del título: ", "Without 3D: ": "Sin 3D: "
  });

  var WORDS = { fire: /(^|[^\wÀ-ÿ])(fire|incendios)(?=$|[^\wÀ-ÿ])/i, world: /(^|[^\wÀ-ÿ])(world|mundo)(?=$|[^\wÀ-ÿ])/i };
  var IMAGE = {
    file: "img/title/tierra-noche-2012.jpg",
    title: "Night Lights 2012 Map",
    credit: "NASA Earth Observatory image by Robert Simmon, using Suomi NPP VIIRS data provided courtesy of Chris Elvidge (NOAA National Geophysical Data Center). Suomi NPP is the result of a partnership between NASA, NOAA, and the Department of Defense.",
    href: "https://science.nasa.gov/earth/earth-observatory/night-lights-2012-map-79765/"
  };
  var STATE = typeof WeakMap === "function" ? new WeakMap() : null;
  var tex = null, capRatio = null, lastEnhanceMs = null;

  /* ---------- flame textures: tileable value noise, made once ---------- */
  function hash(i, j, seed) {
    var n = (Math.imul(i, 374761393) + Math.imul(j, 668265263) + Math.imul(seed, 982451653)) | 0;
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    n = n ^ (n >>> 16);
    return (n >>> 0) / 4294967295;
  }
  function noise(x, y, px, py, seed) {          /* periodic in x every px cells and in y every py cells */
    var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    var x0 = ((xi % px) + px) % px, x1 = (x0 + 1) % px, y0 = ((yi % py) + py) % py, y1 = (y0 + 1) % py;
    var a = hash(x0, y0, seed), b = hash(x1, y0, seed), c = hash(x0, y1, seed), d = hash(x1, y1, seed);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  function texture(w, h, cx, cy, octaves, lo, hi, alpha, seed) {
    var cv = document.createElement("canvas"); cv.width = w; cv.height = h;
    var ctx = cv.getContext("2d"), img = ctx.createImageData(w, h), d = img.data;
    var vals = new Float32Array(w * h), mn = 1e9, mx = -1e9, x, y, o, k;
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
      var n = 0, amp = 1, tot = 0, f = 1;
      for (o = 0; o < octaves; o++) { n += amp * noise(x / w * cx * f, y / h * cy * f, cx * f, cy * f, seed + o * 17); tot += amp; amp *= 0.5; f *= 2; }
      n /= tot; vals[y * w + x] = n; if (n < mn) mn = n; if (n > mx) mx = n;
    }
    for (k = 0; k < w * h; k++) {
      var t = (vals[k] - mn) / (mx - mn || 1);
      t = Math.pow(t * t * (3 - 2 * t), 1.4);     /* more contrast, and the hot parts thinner: pointed tongues */
      var g = Math.round((lo + (hi - lo) * t) * 255);
      d[k * 4] = d[k * 4 + 1] = d[k * 4 + 2] = g; d[k * 4 + 3] = alpha;
    }
    ctx.putImageData(img, 0, 0);
    return cv.toDataURL("image/png");
  }
  function trees() {                               /* a row of pines, white: the colour map turns full white into near black */
    var spots = [[12, 34], [34, 44], [55, 27], [80, 40], [104, 48], [126, 30], [150, 42], [176, 36], [198, 46], [222, 31]], p = "";
    spots.forEach(function (s) {
      var x = s[0], hgt = s[1], w = hgt * 0.42, base = 50, i;
      for (i = 0; i < 3; i++) {
        var top = base - hgt + i * hgt * 0.26, bot = base - hgt * 0.12 - (2 - i) * hgt * 0.22, half = w * (0.5 + i * 0.25) / 1.6;
        p += "M" + x + " " + top.toFixed(1) + "L" + (x + half).toFixed(1) + " " + bot.toFixed(1) + "L" + (x - half).toFixed(1) + " " + bot.toFixed(1) + "Z";
      }
      p += "M" + (x - 1.5) + " " + (base - hgt * 0.14).toFixed(1) + "h3V50h-3Z";
    });
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 50' preserveAspectRatio='none'><path fill='#fff' d='" + p + "'/></svg>";
    return "url(\"data:image/svg+xml," + encodeURIComponent(svg) + "\")";
  }
  function textures() {
    if (tex) return tex;
    tex = {
      a: "url(" + texture(96, 224, 6, 2, 3, 0, 0.88, 255, 11) + ")",    /* tall narrow cells: rising tongues */
      b: "url(" + texture(128, 128, 6, 4, 3, 0, 0.88, 128, 29) + ")",   /* half transparent: averages with A */
      trees: trees()
    };
    return tex;
  }
  /* Heat to colour: 0 white, then pale yellow, yellow, orange, red-orange at 0.95; 1.0 (only the trees) near black. */
  var MAP = [
    [1, 1, 1], [1, 1, 1], [1, 1, .96], [1, .96, .66], [1, .9, .42], [1, .84, .26], [1, .78, .16], [1, .71, .1], [1, .64, .07], [1, .58, .05],
    [1, .52, .04], [1, .47, .03], [.99, .42, .03], [.98, .37, .02], [.96, .32, .02], [.94, .28, .02], [.91, .24, .02], [.88, .2, .02], [.84, .17, .02], [.78, .14, .02], [.16, .03, .02]];
  function ensureFilter() {
    if (document.getElementById("tt-fire-map") || !A || !A.s) return;
    var svg = A.s("svg", { "class": "tt-defs", "aria-hidden": "true", focusable: "false", width: "0", height: "0" });
    var f = A.s("filter", { id: "tt-fire-map", "color-interpolation-filters": "sRGB", x: "0", y: "0", width: "1", height: "1" }, svg);
    var ct = A.s("feComponentTransfer", {}, f);
    ["R", "G", "B"].forEach(function (c, i) { A.s("feFunc" + c, { type: "table", tableValues: MAP.map(function (m) { return m[i]; }).join(" ") }, ct); });
    document.body.appendChild(svg);
  }

  /* ---------- metrics: where the capitals sit inside the word's box, in em, so it holds at any size ---------- */
  function measureCap(span) {
    var cs = getComputedStyle(span), c = document.createElement("canvas").getContext("2d");
    c.font = cs.fontWeight + " 100px " + cs.fontFamily;
    var m = c.measureText("H");
    return m.actualBoundingBoxAscent ? m.actualBoundingBoxAscent / 100 : 0.73;
  }
  function layout(el) {
    var st = STATE && STATE.get(el); if (!st) return;
    var span = st.fire || st.world; if (!span || !span.isConnected) return;
    var r = span.getBoundingClientRect(); if (!r.height) return;
    var fs = parseFloat(getComputedStyle(span).fontSize) || 16;
    var probe = document.createElement("i");
    probe.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline";
    span.appendChild(probe);
    var base = (probe.getBoundingClientRect().top - r.top) / fs;
    span.removeChild(probe);
    if (capRatio === null || !st.capDone) { capRatio = measureCap(span); st.capDone = document.fonts ? document.fonts.check("400 20px Anton") : true; }
    var cap = capRatio, top = base - cap, set = function (k, v) { el.style.setProperty(k, v.toFixed(4) + "em"); };
    set("--tt-r0", top + cap * 0.28);       /* above this the letters are pure white */
    set("--tt-r1", top + cap * 0.92);       /* the ramp is full near the foot */
    set("--tt-r3", top + cap * 0.70);       /* from here down the foot is kept hot... */
    set("--tt-r2", base);                   /* ...most of all on the baseline */
    set("--tt-wy", top + cap / 2 - 0.65);   /* the Earth strip (1.3em tall) centred on the capitals */
    set("--tt-ty", base - 0.62 + 0.01);     /* the trees stand on the baseline */
  }

  /* ---------- 3D: the two words with volume, drawn on the shared stage (js/stage.js, mountCustom) ----------
     World units are em of the title. The origin is the left edge of the word's box on the baseline; the front of
     the letters sits on z = 0. The camera stands above the word and looks straight ahead with a shifted lens, so
     the front of the letters is drawn exactly where the browser draws the flat text, and the tops show. */
  /* Room above the word (em): the two craft on "fire" stand OBJ_H tall plus a short flame and smoke; the city on
     "world" is at most BLD_MAX tall. enhance() writes the larger one as --tt-top on the h1. The line above covers
     whatever rises past the gap between lines, so the title needs line-height >= CAP + --tt-top to show it all:
     about 0.86 + 0.62 = 1.48. At 1.22 only the lowest 0.36 em shows (the foot of the craft and of the city). */
  var CAP = 1760 / 2048, DEPTH = 0.2, BELOW = 0.32, TAU = Math.PI * 2, RAD = Math.PI / 180;
  var OBJ_H = CAP * 0.6, BLD_MAX = CAP * 0.6, ROOM = { fire: OBJ_H + 0.42, world: BLD_MAX + 0.08 }, TOP = { fire: OBJ_H + 0.1, world: BLD_MAX + 0.02 };
  var LIB = null;
  function lib() {
    if (!LIB) {
      LIB = Promise.all([
        import("three/addons/loaders/FontLoader.js"), import("three/addons/geometries/TextGeometry.js"),
        fetch("fonts/anton/anton-3d.json").then(function (r) { if (!r.ok) throw new Error("anton-3d.json " + r.status); return r.json(); }),
        document.fonts ? document.fonts.load("400 100px Anton") : null
      ]).then(function (a) { return { font: new a[0].Font(a[2]), TextGeometry: a[1].TextGeometry }; });
      LIB.catch(function () { LIB = null; });
    }
    return LIB;
  }
  function stage() {
    if (window.OFMW_STAGE) return Promise.resolve(window.OFMW_STAGE);
    return new Promise(function (res) {
      window.addEventListener("ofmw-stage-ready", function () { res(window.OFMW_STAGE); }, { once: true });
      setTimeout(function () { res(window.OFMW_STAGE || null); }, 10000);
    });
  }
  /* The top edge of a capital, column by column, read from the browser's own Anton: where buildings can stand. */
  var PROF = {}, PS = 160;
  function profile(ch) {
    if (PROF[ch]) return PROF[ch];
    var c = document.createElement("canvas"); c.width = PS; c.height = PS;
    var x = c.getContext("2d"); x.font = "400 " + PS + "px Anton"; x.fillStyle = "#fff"; x.fillText(ch, 0, PS * 0.95);
    var w = Math.min(PS, Math.ceil(x.measureText(ch).width)), d = x.getImageData(0, 0, PS, PS).data, top = [], col, row;
    for (col = 0; col < w; col++) {
      var y = -1;
      for (row = 0; row < PS; row++) if (d[(row * PS + col) * 4 + 3] > 128) { y = (PS * 0.95 - row) / PS; break; }
      top.push(y);
    }
    return (PROF[ch] = top);
  }
  function topAt(ch, a, b) {   /* a, b: em from the letter's left edge. lo: lowest top in the range (-1 if a gap), hi: highest */
    var p = profile(ch), lo = 9, hi = -1, i;
    for (i = Math.max(0, Math.floor(a * PS)); i <= Math.min(p.length - 1, Math.ceil(b * PS)); i++) {
      if (p[i] < 0) { lo = -1; continue; }
      if (lo !== -1) lo = Math.min(lo, p[i]);
      hi = Math.max(hi, p[i]);
    }
    return { lo: lo === 9 ? -1 : lo, hi: hi };
  }
  /* Where the browser put each letter of the word, in em, so the 3D letters land on the flat ones. */
  function measure(span) {
    var tn = span.firstChild; if (!tn || tn.nodeType !== 3 || !span.isConnected) return null;
    var r = span.getBoundingClientRect(); if (r.width < 2) return null;
    var fs = parseFloat(getComputedStyle(span).fontSize) || 16;
    var probe = document.createElement("i");
    probe.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline";
    span.appendChild(probe);
    var base = (probe.getBoundingClientRect().top - r.top) / fs;
    span.removeChild(probe);
    var rg = document.createRange(), up = tn.data.toUpperCase(), letters = [], i;
    for (i = 0; i < tn.data.length; i++) {
      rg.setStart(tn, i); rg.setEnd(tn, i + 1);
      var q = rg.getBoundingClientRect();
      letters.push({ ch: up[i], x: (q.left - r.left) / fs, w: q.width / fs });
    }
    var right = (document.documentElement.clientWidth - r.right) / fs - 0.02;
    return { base: base, w: r.width / fs, fs: fs, letters: letters, padL: 0.4, padR: Math.max(0, Math.min(0.4, right)) };
  }
  function seeded(s) { return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
  /* All the letters of a word in one geometry with two groups (faces, then sides): two draw calls for the word. */
  function merge(THREE, geos, kinds) {
    var parts = [[], []], total = 0;
    geos.forEach(function (g, gi) { g.groups.forEach(function (gr) { parts[gr.materialIndex ? 1 : 0].push([g, gr.start, gr.count, kinds ? kinds[gi] : 0]); total += gr.count; }); });
    var pos = new Float32Array(total * 3), nor = new Float32Array(total * 3), kd = new Float32Array(total), o = 0, out = new THREE.BufferGeometry();
    parts.forEach(function (list, mi) {
      var start = o;
      list.forEach(function (q) {
        pos.set(q[0].attributes.position.array.subarray(q[1] * 3, (q[1] + q[2]) * 3), o * 3);
        nor.set(q[0].attributes.normal.array.subarray(q[1] * 3, (q[1] + q[2]) * 3), o * 3);
        kd.fill(q[3], o, o + q[2]);
        o += q[2];
      });
      out.addGroup(start, o - start, mi);
    });
    out.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    out.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
    out.setAttribute("aKind", new THREE.BufferAttribute(kd, 1));
    geos.forEach(function (g) { g.dispose(); });
    return out;
  }
  var NOISE = "float hh(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}" +
    "float vn(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);" +
    "return mix(mix(hh(i),hh(i+vec2(1.0,0.0)),u.x),mix(hh(i+vec2(0.0,1.0)),hh(i+vec2(1.0,1.0)),u.x),u.y);}" +
    "float fbm(vec2 p){float s=0.0,a=0.5;for(int k=0;k<4;k++){s+=a*vn(p);p*=2.03;a*=0.5;}return s;}";
  /* The face of "incendios": white on top, red-hot below the middle, with heat that rises. */
  function hotFace(THREE) {
    return new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uCap: { value: CAP } },
      vertexShader: "varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: "uniform float uTime; uniform float uCap; varying vec3 vPos;" + NOISE +
        "void main(){ float n = fbm(vec2(vPos.x * 5.0, vPos.y * 4.0 - uTime * 1.3));" +
        " float h = vPos.y / uCap + (n - 0.5) * 0.22; float heat = 1.0 - smoothstep(0.1, 0.52, h);" +
        " vec3 ember = mix(vec3(1.0, 0.78, 0.3), vec3(0.93, 0.24, 0.04), smoothstep(0.3, 0.95, heat));" +
        " ember = mix(ember, vec3(0.72, 0.1, 0.03), smoothstep(0.85, 1.0, heat) * 0.6);" +
        " gl_FragColor = vec4(mix(vec3(1.0), ember, smoothstep(0.0, 0.3, heat)), 1.0); }"
    });
  }
  /* The face of "world"/"mundo", the sister of the hot face: snow on top (the white of the flat title), then rock and
     green, and water at the foot that runs slowly. The lines between them wander, never straight. Kind 1 (M, W) has
     its snow coming further down, like two snowy peaks. */
  var WATER = " vec3 water(vec2 p, float t, float n){ float s = smoothstep(0.72, 1.0, sin(p.x * 24.0 - t * 1.3 + n * 5.0 + p.y * 18.0));" +
    " return mix(vec3(0.16, 0.44, 0.9), vec3(0.66, 0.86, 1.0), s * 0.75); }";
  function landFace(THREE) {
    return new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uCap: { value: CAP } },
      vertexShader: "attribute float aKind; varying vec3 vPos; varying float vKind; void main(){ vPos = position; vKind = aKind; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: "uniform float uTime; uniform float uCap; varying vec3 vPos; varying float vKind;" + NOISE + WATER +
        "void main(){ float h = vPos.y / uCap; float n = fbm(vec2(vPos.x * 9.0, vPos.y * 9.0)); float w = vn(vec2(vPos.x * 3.0 + 7.0, 0.5));" +
        " float snow = (vKind > 0.5 ? 0.4 + abs(fract(vPos.x * 2.6) - 0.5) * 0.12 : 0.56) + (w - 0.5) * 0.16 + (n - 0.5) * 0.12;" +
        " float sea = 0.15 + (w - 0.5) * 0.07;" +
        " vec3 rock = mix(vec3(0.56, 0.5, 0.43), vec3(0.72, 0.65, 0.55), n); vec3 green = mix(vec3(0.25, 0.55, 0.25), vec3(0.45, 0.7, 0.32), n);" +
        " vec3 c = mix(green, rock, smoothstep(sea + 0.08, snow - 0.03, h + (n - 0.5) * 0.14));" +
        " c = mix(water(vPos.xy, uTime, n), c, smoothstep(sea - 0.015, sea + 0.015, h));" +
        " c = mix(c, vec3(1.0), smoothstep(snow - 0.015, snow + 0.015, h));" +
        " gl_FragColor = vec4(c, 1.0); }"
    });
  }
  function waterMat(THREE) {
    return new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: "varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: "uniform float uTime; varying vec3 vPos;" + NOISE + WATER +
        "void main(){ float n = fbm(vec2(vPos.x * 9.0, vPos.y * 9.0)); gl_FragColor = vec4(water(vPos.xy, uTime, n), 1.0); }"
    });
  }
  /* Flames and smoke: camera-facing sheets, each with its own seed, all in one geometry per kind. */
  function sheets(THREE, list) {
    var n = list.length, pos = new Float32Array(n * 12), uv = new Float32Array(n * 8), seed = new Float32Array(n * 4), idx = [];
    list.forEach(function (s, i) {
      var x0 = s.x - s.w / 2, x1 = s.x + s.w / 2, y0 = s.y, y1 = s.y + s.h;
      pos.set([x0, y0, s.z, x1, y0, s.z, x1, y1, s.z, x0, y1, s.z], i * 12);
      uv.set([0, 0, 1, 0, 1, 1, 0, 1], i * 8);
      seed.set([s.seed, s.seed, s.seed, s.seed], i * 4);
      idx.push(i * 4, i * 4 + 1, i * 4 + 2, i * 4, i * 4 + 2, i * 4 + 3);
    });
    var g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.setIndex(idx);
    return g;
  }
  var SHEET_V = "attribute float aSeed; varying vec2 vUv; varying float vSeed; void main(){ vUv = uv; vSeed = aSeed; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }";
  function flameMat(THREE) {
    return new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } }, vertexShader: SHEET_V, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      fragmentShader: "uniform float uTime; varying vec2 vUv; varying float vSeed;" + NOISE +
        "void main(){ vec2 uv = vUv; float n = fbm(vec2(uv.x * 3.0 + vSeed * 7.0, uv.y * 2.2 - uTime * 1.6 + vSeed * 3.0));" +
        " float side = 1.0 - pow(abs(uv.x * 2.0 - 1.0), 2.0); float f = side * (1.0 - uv.y) * (0.55 + n) - uv.y * 0.3;" +
        " float a = smoothstep(0.16, 0.6, f);" +
        " vec3 c = mix(vec3(0.9, 0.18, 0.02), vec3(1.0, 0.6, 0.1), smoothstep(0.2, 0.7, f)); c = mix(c, vec3(1.0, 0.9, 0.5), smoothstep(0.6, 0.95, f));" +
        " gl_FragColor = vec4(c, a * 0.85); }"
    });
  }
  function smokeMat(THREE) {
    return new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } }, vertexShader: SHEET_V, transparent: true, depthWrite: false,
      fragmentShader: "uniform float uTime; varying vec2 vUv; varying float vSeed;" + NOISE +
        "void main(){ vec2 uv = vUv; float x = uv.x - 0.5 - sin(uv.y * 5.0 - uTime * 1.2 + vSeed * 6.0) * 0.18 * uv.y;" +
        " float n = fbm(vec2(uv.x * 2.0 + vSeed * 5.0, uv.y * 3.0 - uTime * 0.7));" +
        " float a = (1.0 - smoothstep(0.08, 0.32 + uv.y * 0.15, abs(x))) * smoothstep(0.0, 0.12, uv.y) * (1.0 - uv.y) * (0.35 + n * 0.65);" +
        " gl_FragColor = vec4(vec3(0.62), a * 0.55); }"
    });
  }
  function windows(THREE) {   /* a small canvas: grey facade with warm lit windows; the glow map keeps only the lit ones */
    function draw(glow) {
      var c = document.createElement("canvas"); c.width = 32; c.height = 64;
      var x = c.getContext("2d"), r = seeded(77), i, j;
      x.fillStyle = glow ? "#000" : "#6f727b"; x.fillRect(0, 0, 32, 64);
      for (j = 0; j < 7; j++) for (i = 0; i < 2; i++) {
        var on = r() < 0.7;
        x.fillStyle = on ? "#ffd98a" : (glow ? "#000" : "#24262c");
        if (on || !glow) x.fillRect(5 + i * 13, 5 + j * 8.4, 9, 5);
      }
      var tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; return tx;
    }
    return { map: draw(false), glow: draw(true) };
  }

  /* One feature per letter of "world"/"mundo": M and W snowy peaks, U and L water, N and R the city, D pines, O the planet. */
  var FEATURE = { M: "peaks", W: "peaks", U: "lake", L: "lake", N: "city", R: "city", D: "trees" };
  function scene3d(kind, M) {
    return function (THREE, ctx) {
      var group = new THREE.Group(), ticks = [], trash = [], W = M.w, rnd = seeded(kind === "fire" ? 1311 : 2026);
      function keep(x) { trash.push(x); return x; }
      function nul() { return null; }
      var cam = { cx: W / 2, cy: CAP + 2.2, D: 13, x0: -M.padL, x1: W + M.padR, y0: -BELOW, y1: CAP + ROOM[kind] };
      if (kind === "world") group.add(new THREE.AmbientLight(0xffffff, 0.75));   /* lifts the night side, so the white poles show */
      var ready = lib().then(function (L) {
        return Promise.all([
          kind === "world" ? ctx.model("earth", "lite", 1).catch(nul) : null,
          kind === "fire" ? ctx.model("capsule-alt", "lite", 1).catch(nul) : null,
          kind === "fire" && M.fs >= 64 ? ctx.model("habitat-1", "lite", 1).catch(nul) : null
        ]).then(function (res) {
          var earth = res[0], geos = [], kinds = [];
          M.letters.forEach(function (l) {
            if (earth && l.ch === "O") return;
            var g = new L.TextGeometry(l.ch, { font: L.font, size: 1, depth: DEPTH, curveSegments: 6, bevelEnabled: false });
            g.translate(l.x, 0, -DEPTH); geos.push(g); kinds.push(FEATURE[l.ch] === "peaks" ? 1 : 0);
          });
          var face = keep(kind === "fire" ? hotFace(THREE) : landFace(THREE));
          var side = keep(new THREE.MeshStandardMaterial({ color: 0x8b8c92, roughness: 0.75, metalness: 0 }));
          group.add(new THREE.Mesh(keep(merge(THREE, geos, kinds)), [face, side]));
          if (face.uniforms) ticks.push(function (t) { face.uniforms.uTime.value = t; });
          if (kind === "world") world3d(THREE, earth); else fire3d(THREE, res[1], res[2]);
        });
      });
      function world3d(THREE, earth) {
        var o = M.letters.filter(function (l) { return l.ch === "O"; })[0];
        if (earth && o) {
          /* The O is the planet, its axis tilted sideways so both poles sit on its rim (the camera is about 11 degrees
             above, hence the small tilt back). It stands behind the letters, so the W and the R beside it stay whole;
             position and size are pushed back along the line of sight, so on screen it is exactly the O's height. */
          var R = CAP * 1.15 / 2, tilt = new THREE.Group(), spin = new THREE.Group(), z = -DEPTH - R - 0.02, k = (cam.D - z) / cam.D;
          earth.scale.setScalar(2 * R);
          tilt.position.set(cam.cx + (o.x + o.w / 2 - cam.cx) * k, cam.cy + (CAP / 2 - cam.cy) * k, z);
          tilt.scale.setScalar(k);
          tilt.rotation.set(-0.19, 0, -23.4 * RAD);
          spin.add(earth); tilt.add(spin); group.add(tilt);
          ticks.push(function (t) { spin.rotation.y = 1.2 + t / 36 * TAU; });
        }
        var spots = [], trees = [], lakes = [];
        M.letters.forEach(function (l) {
          var f = FEATURE[l.ch], prof = profile(l.ch), c, runs = [], run = null;
          if (f === "city") {   /* tall buildings on the flat stretches of the top edge (the stems of the N, the top of the R) */
            var flat = null, flats = [];
            for (c = 0; c <= prof.length; c++) {
              var on = c < prof.length && prof[c] >= CAP * 0.97;
              if (on && !flat) flat = { a: c, b: c }; else if (on) flat.b = c; else if (flat) { flats.push(flat); flat = null; }
            }
            flats.filter(function (r) { return r.b - r.a > 8; }).slice(0, 3).forEach(function (r, j) {
              var wR = (r.b - r.a) / PS, bw = Math.min(0.15, wR * 0.8);
              spots.push([l.x + (r.a + r.b) / 2 / PS, CAP, -DEPTH / 2, bw, CAP * [0.58, 0.44, 0.52][j], 0.12]);
            });
          } else if (f === "trees") {   /* a few pines on the top edge */
            [0.2, 0.47, 0.74].forEach(function (u, j) {
              var a = u * l.w - 0.05, top = topAt(l.ch, a, a + 0.1);
              if (top.lo < CAP * 0.95) return;
              trees.push([l.x + u * l.w, top.hi, -DEPTH / 2, 0.075, CAP * [0.3, 0.4, 0.26][j]]);
            });
          } else if (f === "lake") {   /* water in the low part of the letter: the cup of the U, the foot of the L */
            for (c = 0; c <= prof.length; c++) {
              var low = c < prof.length && prof[c] > 0 && prof[c] < CAP * 0.8;
              if (low && !run) run = { a: c, b: c, floor: prof[c] };
              else if (low) { run.b = c; run.floor = Math.min(run.floor, prof[c]); }
              else if (run) { runs.push(run); run = null; }
            }
            runs.sort(function (p, q) { return (q.b - q.a) - (p.b - p.a); });
            if (runs[0] && runs[0].b - runs[0].a > 6) lakes.push([l.x + runs[0].a / PS + 0.01, l.x + (runs[0].b + 1) / PS - 0.01, runs[0].floor - 0.02, CAP * (l.ch === "U" ? 0.5 : 0.4)]);
          }
        });
        if (spots.length) {
          var tx = windows(THREE); keep(tx.map); keep(tx.glow);
          var box = keep(new THREE.BoxGeometry(1, 1, 1)); box.translate(0, 0.5, 0);
          var mat = keep(new THREE.MeshStandardMaterial({ map: tx.map, emissiveMap: tx.glow, emissive: 0xffffff, emissiveIntensity: 1.1, roughness: 0.85 }));
          var city = new THREE.InstancedMesh(box, mat, spots.length), mtx = new THREE.Matrix4(), q = new THREE.Quaternion();
          spots.forEach(function (s, i) { mtx.compose(new THREE.Vector3(s[0], s[1] - 0.004, s[2]), q, new THREE.Vector3(s[3], s[4], s[5])); city.setMatrixAt(i, mtx); });
          group.add(city);
        }
        if (trees.length) {
          var cone = keep(new THREE.ConeGeometry(1, 1, 7)); cone.translate(0, 0.5, 0);
          var pine = new THREE.InstancedMesh(cone, keep(new THREE.MeshStandardMaterial({ color: 0x2f7d3a, roughness: 0.8 })), trees.length), m2 = new THREE.Matrix4(), q2 = new THREE.Quaternion();
          trees.forEach(function (s, i) { m2.compose(new THREE.Vector3(s[0], s[1] - 0.004, s[2]), q2, new THREE.Vector3(s[3], s[4], s[3])); pine.setMatrixAt(i, m2); });
          group.add(pine);
        }
        if (lakes.length) {
          var pos = [];
          lakes.forEach(function (k) { pos.push(k[0], k[2], -0.03, k[1], k[2], -0.03, k[1], k[3], -0.03, k[0], k[2], -0.03, k[1], k[3], -0.03, k[0], k[3], -0.03); });
          var lg = keep(new THREE.BufferGeometry()); lg.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
          var wm = keep(waterMat(THREE));
          group.add(new THREE.Mesh(lg, wm));
          ticks.push(function (t) { wm.uniforms.uTime.value = t; });
        }
      }
      function perch(THREE, obj, fx, rot, height) {   /* sets a model down on the top edge of the word, at fx of its width, height em tall */
        var holder = new THREE.Group(); obj.rotation.set(rot[0], rot[1], rot[2]); holder.add(obj); holder.updateMatrixWorld(true);
        var bb = new THREE.Box3().setFromObject(holder), size = bb.getSize(new THREE.Vector3());
        obj.scale.multiplyScalar(height / Math.max(size.y, 1e-6)); holder.updateMatrixWorld(true);
        bb.setFromObject(holder); size = bb.getSize(new THREE.Vector3());
        var x = Math.min(W - size.x / 2, Math.max(size.x / 2, W * fx));
        var l = M.letters.filter(function (k) { return x >= k.x && x <= k.x + k.w; })[0] || M.letters[0];
        var top = topAt(l.ch, x - l.x - size.x / 2, x - l.x + size.x / 2), y = (top.hi > 0 ? top.hi : CAP) - bb.min.y - 0.006;
        holder.position.set(x - (bb.min.x + bb.max.x) / 2, y, -DEPTH / 2 - (bb.min.z + bb.max.z) / 2);
        group.add(holder);
        return { x: x, base: y + bb.min.y, top: y + bb.max.y, w: size.x, back: -DEPTH / 2 - size.z / 2 };
      }
      function fire3d(THREE, ship, base) {
        var flames = [], smoke = [], n = Math.max(2, Math.ceil(W / 0.42)), k;
        /* wide overlapping sheets in front of the letters, from the foot up to a little under the middle: one band of
           fire, not a candle on each letter, and never above the top of the word */
        for (k = 0; k < n; k++) {
          var fx0 = Math.max(0.02, (k - 0.45) * W / n), fx1 = Math.min(W - 0.02, (k + 1.45) * W / n);   /* inside the word, never past its ends */
          flames.push({ x: (fx0 + fx1) / 2, w: fx1 - fx0, y: 0, h: CAP * 0.46, z: 0.03, seed: rnd() });
        }
        [[ship, base ? 0.16 : 0.5, [0.15, 0.6, -0.25]], [base, 0.84, [0, -0.5, 0]]].forEach(function (o) {
          if (!o[0]) return;
          var p = perch(THREE, o[0], o[1], o[2], OBJ_H);
          /* one clear flame behind the craft, rising past one side, so its markings stay in sight; a short smoke */
          flames.push({ x: p.x + p.w * 0.22, w: p.w * 0.85, y: p.base - 0.02, h: OBJ_H * 0.95, z: p.back - 0.02, seed: rnd() });
          smoke.push({ x: p.x + p.w * 0.1, w: 0.26, y: p.top - 0.06, h: 0.36, z: p.back - 0.04, seed: rnd() });
        });
        var fm = keep(flameMat(THREE)), sm = keep(smokeMat(THREE));
        var fl = new THREE.Mesh(keep(sheets(THREE, flames)), fm); fl.renderOrder = 2; group.add(fl);
        if (smoke.length) { var sk = new THREE.Mesh(keep(sheets(THREE, smoke)), sm); sk.renderOrder = 1; group.add(sk); }
        ticks.push(function (t) { fm.uniforms.uTime.value = t; sm.uniforms.uTime.value = t; });
      }
      return {
        object: group, ready: ready,
        update: function (t) { ticks.forEach(function (f) { f(t); }); },
        place: function (camera) {
          var near = 0.5, k = near / cam.D;
          camera.position.set(cam.cx, cam.cy, cam.D); camera.rotation.set(0, 0, 0); camera.near = near; camera.far = 60;
          camera.updateMatrixWorld();
          camera.projectionMatrix.makePerspective((cam.x0 - cam.cx) * k, (cam.x1 - cam.cx) * k, (cam.y1 - cam.cy) * k, (cam.y0 - cam.cy) * k, near, 60);
          camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
        },
        dispose: function () { trash.forEach(function (x) { x.dispose(); }); trash = []; ticks = []; }
      };
    };
  }
  function laidOut(span, tries) {
    return new Promise(function (res) {
      (function check(n) {
        if (span.isConnected && span.getBoundingClientRect().width > 1) return res(true);
        if (n <= 0) return res(false);
        requestAnimationFrame(function () { check(n - 1); });
      })(tries || 240);
    });
  }
  function start3d(el, st) {
    st.three = [];
    el.style.setProperty("--tt-top", Math.max(st.fire ? TOP.fire : 0, st.world ? TOP.world : 0).toFixed(3) + "em");
    stage().then(function (S) {
      if (!S || !S.supported || !S.mountCustom || STATE.get(el) !== st) return;
      return lib().then(function () {
        ["fire", "world"].forEach(function (kind) {
          var span = st[kind]; if (!span) return;
          laidOut(span).then(function (ok) {
            if (!ok || STATE.get(el) !== st) return;
            var M = measure(span); if (!M) return;
            var ov = document.createElement("span");
            ov.className = "tt-stage"; ov.setAttribute("aria-hidden", "true");
            ov.style.top = (M.base - CAP - ROOM[kind]).toFixed(4) + "em";
            ov.style.height = (CAP + ROOM[kind] + BELOW).toFixed(4) + "em";
            ov.style.left = (-M.padL).toFixed(4) + "em";
            ov.style.width = (M.w + M.padL + M.padR).toFixed(4) + "em";
            span.appendChild(ov);
            var hd;
            try { hd = S.mountCustom(ov, { id: "title-" + kind, build: scene3d(kind, M) }); } catch (e) { ov.remove(); return; }
            st.three.push({ span: span, ov: ov, handle: hd });
            hd.onState(function (s) {
              if (STATE.get(el) !== st) return;
              span.classList.toggle("tt-3d-on", s === "ready");
              span.setAttribute("data-3d", s);
            });
          });
        });
      });
    }).catch(function () { /* the flat title stays */ });
  }

  function wrap(el, text, re, cls) {
    var m = re.exec(text); if (!m) return null;
    return { at: m.index + m[1].length, len: m[2].length, cls: cls };
  }
  function enhance(el, opts) {
    if (!el || el.nodeType !== 1) return el;
    var t0 = performance.now(), st = STATE && STATE.get(el);
    var flat = !!(opts && opts.mode === "2d");
    if (st) { if (el.textContent === st.text && !!(opts && opts.variant === "b") === st.b && flat === st.flat) return el; dispose(el); }
    var text = el.textContent;
    var hits = [wrap(el, text, WORDS.fire, "fire"), wrap(el, text, WORDS.world, "world")].filter(Boolean);
    if (!hits.length) return el;
    hits.sort(function (a, b) { return a.at - b.at; });
    st = { text: text, nodes: Array.prototype.slice.call(el.childNodes), aria: el.getAttribute("aria-label"), cls: el.className, b: !!(opts && opts.variant === "b"), flat: flat };
    var parts = [], pos = 0;
    hits.forEach(function (hit) {
      if (hit.at < pos) return;
      if (hit.at > pos) parts.push(document.createTextNode(text.slice(pos, hit.at)));
      var span = document.createElement("span");
      span.className = "tt-w tt-" + hit.cls;
      span.textContent = text.slice(hit.at, hit.at + hit.len);
      st[hit.cls] = span; parts.push(span); pos = hit.at + hit.len;
    });
    if (pos < text.length) parts.push(document.createTextNode(text.slice(pos)));
    el.replaceChildren.apply(el, parts);
    el.setAttribute("aria-label", text.replace(/\s+/g, " ").trim());
    el.classList.remove("c-title-flame");
    el.classList.add("tt-title");
    STATE && STATE.set(el, st);
    try {
      var tx = textures();
      ensureFilter();
      el.style.setProperty("--tt-na", tx.a);
      el.style.setProperty("--tt-nb", tx.b);
      if (st.b) el.style.setProperty("--tt-trees", tx.trees);
      el.classList.add("tt-on");
    } catch (e) { el.classList.remove("tt-on"); }   /* plain white title */
    layout(el);
    if (typeof ResizeObserver === "function") { st.ro = new ResizeObserver(function () { layout(el); }); st.ro.observe(el); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (STATE && STATE.get(el) === st) { st.capDone = false; capRatio = null; layout(el); } });
    if (!flat) start3d(el, st);
    lastEnhanceMs = performance.now() - t0;
    return el;
  }
  function dispose(el) {
    var st = el && STATE && STATE.get(el); if (!st) return el;
    if (st.ro) st.ro.disconnect();
    (st.three || []).forEach(function (x) { x.handle.dispose(); x.ov.remove(); x.span.classList.remove("tt-3d-on"); });
    st.three = [];
    el.replaceChildren.apply(el, st.nodes);
    if (st.aria === null) el.removeAttribute("aria-label"); else el.setAttribute("aria-label", st.aria);
    el.className = st.cls;
    if (!el.className) el.removeAttribute("class");
    ["--tt-na", "--tt-nb", "--tt-trees", "--tt-r0", "--tt-r1", "--tt-r2", "--tt-r3", "--tt-wy", "--tt-ty", "--tt-top"].forEach(function (k) { el.style.removeProperty(k); });
    if (!el.getAttribute("style")) el.removeAttribute("style");
    STATE.delete(el);
    return el;
  }
  /* Credits: the NASA models in the 3D words and the NASA image of the flat fallback. text is one line for a footer;
     items has each one with its link. The little city on "world" is hand-made decoration, not a NASA model. */
  var MODELS3D = [
    { title: "Earth with Clouds 3D Model", credit: "NASA Visualization Technology Applications and Development (VTAD)", href: "https://science.nasa.gov/resource/earth-with-clouds-3d-model" },
    { title: "Gemini", credit: "NASA", href: "https://github.com/nasa/NASA-3D-Resources/tree/master/3D%20Models/Gemini" },
    { title: "Habitat Demonstration Unit (part 1)", credit: "NASA", href: "https://science.nasa.gov/3d-resources/habitat-demonstration-unit/" }
  ];
  function credits() {
    var items = MODELS3D.concat([{ title: IMAGE.title, credit: IMAGE.credit, href: IMAGE.href }]);
    return { text: T("Title models: ") + MODELS3D.map(function (m) { return m.title + " (" + m.credit + ")"; }).join("; ") + ". " +
        T("Without 3D: ") + IMAGE.title + ". " + IMAGE.credit,
      title: IMAGE.title, credit: IMAGE.credit, href: IMAGE.href, file: IMAGE.file, items: items };
  }

  window.OFMW_TITLE = { enhance: enhance, dispose: dispose, credits: credits, lastEnhanceMs: function () { return lastEnhanceMs; } };

  /* ---------- review page ---------- */
  if (!A || !A.route) return;
  var FULL = { en: "Fire safety for every world where people will live", es: "Seguridad contra incendios para cada mundo donde vivirá la gente" };
  var WORLDS5 = ["station", "moon", "mars", "earth", "suit"];
  A.route("title-preview", "world", function () {
    var h = A.h, q = A.query();
    document.title = T("Title preview") + " · One Fire, Many Worlds";
    var samples = [], times = [], extra = [];
    function sample(lang, size, mode) {
      var line = h("div", { "class": "tt-line tt-" + size, lang: lang, "data-lang": lang, "data-size": size, "data-mode": mode, text: FULL[lang] });
      samples.push([line, mode]);
      return h("div", { "class": "tt-sample" }, h("p", { "class": "tt-label" }, T(lang === "en" ? "English" : "Spanish") + ". " + T("Set at") + " ", A.num(size + " px")), line);
    }
    function set(title, what, mode, sizes) {
      return h("section", { "class": "tt-set", "data-mode": mode }, h("h2", { text: title }), h("p", { text: what }),
        h("div", { "class": "tt-grid" }, sizes.map(function (sz) { return [sample("en", sz, mode), sample("es", sz, mode)]; })));
    }
    var c = credits(), fps = A.num(T("measuring")), ms = h("span", { "class": "tt-ms" }), calls = A.num(T("measuring")), gpu = h("span", { "class": "tt-gpu" });
    var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var worldsRow = q.worlds ? h("section", { "class": "tt-set tt-worlds" }, h("h2", { text: T("Five worlds at once, to measure") }),
      h("p", { text: T("The five worlds of the home page, mounted here only to measure the frame rate with the title.") }),
      h("div", { "class": "tt-worlds-row" }, WORLDS5.map(function (id) { return h("div", { "class": "tt-world-box", "data-scene": id }); }))) : null;
    var page = h("div", { "class": "wrap tt-preview" },
      A.back("#/", T("Back to home")),
      A.intro(T("Title preview"), T("The home title with its two special words in 3D, in English and Spanish, at three sizes; below, the flat version used without WebGL.")),
      set(T("With volume"), T("The two words are drawn in 3D on the shared stage; the rest of the title is flat white text. Line height 1.5, so the line above does not hide the city and the two craft."), "3d", [56, 74, 96]),
      set(T("Without 3D"), T("Used when there is no WebGL: flames inside the letters and NASA's Earth at night inside the word world."), "2d", [74, 96]),
      worldsRow,
      h("div", { "class": "tt-meta" },
        h("p", null, h("strong", { text: T("Credits") + ". " }), MODELS3D.map(function (m, k) {
          return [k ? "; " : "", h("a", { href: m.href, rel: "noopener", target: "_blank", text: m.title }), " (" + m.credit + ")"];
        }), ". " + T("The small city on the word world is hand-made decoration, not a real place.")),
        h("p", null, T("Image inside the word world: ") + c.title + ". " + c.credit + " ", h("a", { href: c.href, rel: "noopener", target: "_blank", text: T("NASA page of the image") })),
        h("p", { "class": "tt-sizes", text: T("On narrow screens the size shrinks to fit the width.") }),
        reduced ? h("p", { text: T("Motion is reduced on this device: the flames and the Earth stand still.") }) : null,
        h("p", { "class": "tt-perf" }, h("strong", { text: T("Measured on this page") + ". " }), T("Time to apply the effect to one title: "), ms, ". ",
          T("Frames per second on this page: "), fps, ". ", T("Draw calls for the two words of one title: "), calls, ". ", gpu)));
    A.main.replaceChildren(page);
    /* Every line starts flat; a 3D line is mounted while it is near the screen and goes back to flat when it leaves,
       so the stage never holds more scenes than the ones in sight. */
    samples.forEach(function (s) { enhance(s[0], { mode: "2d" }); times.push(lastEnhanceMs); });
    var io = typeof IntersectionObserver === "function" ? new IntersectionObserver(function (es) {
      es.forEach(function (e) { enhance(e.target, { mode: e.isIntersecting ? "3d" : "2d" }); });
    }, { rootMargin: "120px 0px" }) : null;
    samples.forEach(function (s) { if (s[1] === "3d") { if (io) io.observe(s[0]); else enhance(s[0]); } });
    var avg = times.reduce(function (a, b) { return a + b; }, 0) / times.length;
    ms.replaceChildren(T("first title") + " ", A.num(times[0].toFixed(1) + " ms"), ", " + T("then") + " ", A.num(avg.toFixed(2) + " ms"), " " + T("on average"));
    page.setAttribute("data-enhance-first", times[0].toFixed(2));
    page.setAttribute("data-enhance-avg", avg.toFixed(3));
    stage().then(function (S) {
      if (!S || !page.isConnected) return;
      if (q.worlds && S.supported) page.querySelectorAll(".tt-world-box").forEach(function (b) { extra.push(S.mount(b, b.getAttribute("data-scene"), { tier: "path" })); });
      gpu.textContent = S.supported ? T("Graphics: ") + S.stats().gpu + "." : T("No WebGL here: the flat version is shown.");
    });
    /* Reads the stage's own counters after a few seconds; leaving the page takes every scene down. */
    setTimeout(function () {
      var S = window.OFMW_STAGE; if (!S || !page.isConnected) return;
      var st = S.stats(), mine = st.mounts.filter(function (m) { return /^title-/.test(m.scene) && m.state === "ready"; });
      var pair = mine.length >= 2 ? mine[0].calls + mine[1].calls : 0;
      calls.textContent = mine.length ? String(pair) : "0";
      page.setAttribute("data-calls", String(pair)); page.setAttribute("data-stage-fps", String(st.fps));
    }, 4000);
    /* Frames the browser shows per second, counted here for two seconds (the stage's own counter counts only the
       frames it redraws, so it reads 0 when nothing moves, as with reduced motion). */
    var nF = 0, t0 = 0;
    requestAnimationFrame(function tick(now) {
      if (!page.isConnected) return;
      if (!t0) t0 = now;
      nF++;
      if (now - t0 < 2000) { requestAnimationFrame(tick); return; }
      var v = nF / ((now - t0) / 1000);
      fps.textContent = v.toFixed(0); page.setAttribute("data-fps", v.toFixed(1));
    });
    window.addEventListener("hashchange", function () {
      if (io) io.disconnect();
      samples.forEach(function (s) { dispose(s[0]); });
      extra.forEach(function (x) { x.dispose(); });
    }, { once: true });
  });
})();
