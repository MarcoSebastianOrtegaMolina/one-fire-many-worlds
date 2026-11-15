/* One Fire, Many Worlds. The home page below the journey: one band per tool, each with a small live preview drawn
   from the real data and a button that opens the tool. window.OFMW_HOME() returns the element; js/journey.js hangs it
   under the worlds. The route #/home-preview shows the same bands alone, for review. Class prefix hm-. */
(function () {
  "use strict";
  var A = window.OFMW_APP;
  if (!A) return;
  var h = A.h, T = A.T, D = A.D, C = A.C, fmt = A.fmt;

  A.es({
    "Beyond the five worlds, the platform has six tools. Each one opens from here.": "Además de los cinco mundos, la plataforma tiene seis herramientas. Cada una se abre desde aquí.",
    "Tools on this page": "Herramientas en esta página",
    "Data and sources": "Datos y fuentes",
    "Ask in your own words. An AI answers from the records of the repository and cites the page behind every claim.":
      "Pregunta con tus palabras. Una IA responde con las fichas del repositorio y cita la página detrás de cada afirmación.",
    "Your question": "Tu pregunta",
    "For example: which materials were burned in Moon-base air?": "Por ejemplo: ¿qué materiales se quemaron en aire de base lunar?",
    "Ask a question": "Hacer una pregunta",
    "Or open a saved answer, one per front:": "O abre una respuesta guardada, una por frente:",
    "The {n} combustion investigations in PSI, ordered by how much they matter for fire safety.":
      "Las {n} investigaciones de combustión de PSI, ordenadas por lo que importan para la seguridad contra incendios.",
    "Open the investigations": "Abrir las investigaciones",
    "The five investigations with the most tests that record oxygen. Each dot is one test.":
      "Las cinco investigaciones con más pruebas que registran oxígeno. Cada punto es una prueba.",
    "tests with oxygen": "pruebas con oxígeno",
    "Oxygen, %": "Oxígeno, %",
    "No solid tested from {a} to {b} % oxygen": "Ningún sólido probado de {a} a {b} % de oxígeno",
    "Ring: oxygen measured in the burner gas, not in the chamber air.": "Anillo: oxígeno medido en el gas del quemador, no en el aire de la cámara.",
    "Gas": "Gas", "Liquid": "Líquido", "Solid": "Sólido",
    "For each solid: whether it burned, what smoke it gives and whether the detector sees it.":
      "Para cada sólido: si ardió, qué humo da y si el detector lo ve.",
    "Open the materials": "Abrir los materiales",
    "Burned": "Ardió", "Smoke": "Humo", "Detector": "Detector",
    "no data": "sin datos", "tests": "pruebas", "runs": "corridas",
    "Image: ": "Imagen: ",
    "Each mark says whether the repository holds that answer for the material. Red means no data.":
      "Cada marca dice si el repositorio tiene esa respuesta para el material. Rojo quiere decir sin datos.",
    "Set an atmosphere and see what was really tested near it.": "Fija una atmósfera y mira qué se probó de verdad cerca de ahí.",
    "Open Will it burn?": "Abrir ¿Arderá?",
    "Start from an atmosphere:": "Empieza desde una atmósfera:",
    "Pressure, psi": "Presión, psi",
    "% oxygen at": "% de oxígeno a",
    "Moon base zone": "Zona de la base lunar",
    "Each circle groups the tests at one oxygen level and pressure; {n} tests are drawn. Crosses mark the atmospheres below; the spacesuit is above the chart.":
      "Cada círculo agrupa las pruebas con un mismo oxígeno y presión; hay {n} pruebas dibujadas. Las cruces marcan las atmósferas de abajo; el traje queda arriba de la gráfica.",
    "Every emergency left a question; these experiments try to answer it.": "De cada emergencia salió una pregunta; estos experimentos intentan responderla.",
    "Open the timeline": "Abrir la línea de tiempo",
    "Accident": "Accidente", "Experiment": "Experimento", "Planned": "Planeado",
    "The {tests} tests in one table you can download, and the exact page behind every finding.":
      "Las {tests} pruebas en una tabla que se descarga, y la página exacta detrás de cada hallazgo.",
    "tests in the table": "pruebas en la tabla",
    "combustion investigations": "investigaciones de combustión",
    "tests with oxygen and pressure": "pruebas con oxígeno y presión",
    "Some of the {n} cited pages kept as images:": "Algunas de las {n} páginas citadas guardadas como imagen:",
    "Page {p} of {doc}": "Página {p} de {doc}",
    "p. {p}": "p. {p}",
    "Open the data": "Abrir los datos",
    "Open the sources": "Abrir las fuentes",
    "No cited page has an image yet.": "Todavía ninguna página citada tiene imagen.",
    "No data for this preview": "Sin datos para esta vista previa",
    "The data behind it did not load. The tool itself may still work.": "Los datos detrás de ella no cargaron. La herramienta puede funcionar igual.",
    "Fuel type": "Tipo de combustible",
    "Marker": "Marca",
    "Filled: oxygen of the chamber atmosphere": "Lleno: oxígeno de la atmósfera de la cámara",
    "Ring: oxygen of the burner gas (inverse flame)": "Anillo: oxígeno del gas del quemador (flama inversa)",
    "Oxygen in each test (%)": "Oxígeno en cada prueba (%)",
    "Oxygen in the atmosphere (%)": "Oxígeno en la atmósfera (%)",
    "Pressure (psi)": "Presión (psi)",
    "Oxygen recorded in each test, in the five investigations with the most such tests": "Oxígeno registrado en cada prueba, en las cinco investigaciones con más pruebas así",
    "Data: {src}. Each dot is one row of the investigation's experimental tables in PSI. The red band runs from {a} %, the highest oxygen of any solid tested in PSI, to {b} %, the Moon-base air of the challenge.":
      "Datos: {src}. Cada punto es un renglón de las tablas experimentales de la investigación en PSI. La franja roja va de {a} %, el oxígeno más alto de un sólido probado en PSI, a {b} %, el aire de base lunar del reto.",
    "Tests by oxygen and pressure, with the Station and Moon-base atmospheres": "Pruebas por oxígeno y presión, con las atmósferas de la Estación y de la base lunar",
    "Data: {src}. Oxygen and pressure as recorded in the experimental tables of each investigation. Drawn: {n} tests whose oxygen is the chamber atmosphere, up to 24 psi; each circle groups the tests at one oxygen level and pressure, and larger means more tests. Station zone: 13.5 to 16 psi and 19.5 to 23.5 % oxygen. Moon-base zone: 30 % oxygen or more at 11 psi or less.":
      "Datos: {src}. Oxígeno y presión como vienen en las tablas experimentales de cada investigación. Dibujadas: {n} pruebas cuyo oxígeno es la atmósfera de la cámara, hasta 24 psi; cada círculo agrupa las pruebas con un mismo oxígeno y presión, y más grande quiere decir más pruebas. Zona de la Estación: 13.5 a 16 psi y 19.5 a 23.5 % de oxígeno. Zona de la base lunar: 30 % de oxígeno o más a 11 psi o menos.",
    "Atmosphere marked": "Atmósfera marcada",
    "Cross: the five atmospheres beside the chart; circled: the one marked": "Cruz: las cinco atmósferas junto a la gráfica; en círculo: la marcada",
    "Point at an atmosphere to mark it on the chart; choose it to open the tool with it set.": "Señala una atmósfera para marcarla en la gráfica; elígela para abrir la herramienta con ella puesta.",
    "above the chart": "arriba de la gráfica",
    "Burned: ": "Ardió: ", "Smoke: ": "Humo: ", "Detector: ": "Detector: ",
    "{n} tests": "{n} pruebas", "{n} runs": "{n} corridas",
    "No NASA image found": "No se encontró imagen de NASA",
    "Emergencies and the experiments that answer them, with four of their 3D models": "Emergencias y los experimentos que las responden, con cuatro de sus modelos 3D",
    "Kind of entry": "Tipo de entrada",
    "Model: ": "Modelo: ",
    "Entries: the timeline of this site; each one gives its source on its own page. Models: Apollo Lunar Module, Skylab and Mir from NASA 3D Resources; Moon from NASA's Goddard Space Flight Center. Not to scale.":
      "Entradas: la línea de tiempo de este sitio; cada una da su fuente en su propia página. Modelos: Apollo Lunar Module, Skylab y Mir de NASA 3D Resources; la Luna del Goddard Space Flight Center de NASA. No están a escala.",
    "Tools": "Herramientas",
    "Preview of the bands under the home page, one per tool.": "Vista previa de las franjas bajo la portada, una por herramienta."
  });

  var LANG = window.OFMW_LANG === "es" ? "es" : "en";
  var KEY_Q = "ofmw-home-question";                     /* the question handed from the home page to #/ask */
  var REDUCE = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  var FUEL = { gas: "Gas", liquid: "Liquid", solid: "Solid" };
  var SVGNS = "http://www.w3.org/2000/svg";
  function tpl(text, o) { var out = T(text), k; for (k in o) out = out.split("{" + k + "}").join(o[k]); return out; }
  function sv(tag, attrs, parent, text) {
    var n = document.createElementNS(SVGNS, tag), k;
    for (k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    if (parent) parent.appendChild(n);
    return n;
  }
  function missing() { return A.state("empty", T("No data for this preview"), T("The data behind it did not load. The tool itself may still work.")); }

  /* A drawing that is redrawn at the real pixel size of its box, so its labels never shrink below 14 px. */
  function fitted(cls, label, draw) {
    var box = h("div", { "class": "hm-fit " + cls });
    var svg = sv("svg", { role: "img", "aria-label": label, focusable: "false" }, box);
    var lastW = -1;
    function paint() {
      var w = Math.round(box.clientWidth);
      if (!w || w === lastW) return;
      lastW = w;
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var hgt = draw(svg, w);
      svg.setAttribute("viewBox", "0 0 " + w + " " + hgt);
      svg.setAttribute("width", w); svg.setAttribute("height", hgt);
    }
    if (window.ResizeObserver) new ResizeObserver(paint).observe(box);
    else window.addEventListener("resize", paint);
    box.hmPaint = paint;
    box.hmRedraw = function () { lastW = -1; paint(); };
    return box;
  }

  /* ---------- the bands ---------- */
  var TOOLS = [
    { id: "hm-ask", name: "Ask the data" },
    { id: "hm-investigations", name: "Investigations" },
    { id: "hm-materials", name: "Materials" },
    { id: "hm-burn", name: "Will it burn?" },
    { id: "hm-timeline", name: "Timeline" },
    { id: "hm-data", name: "Data and sources" }
  ];

  function band(t, what, preview, actions, flip) {
    return h("section", { "class": "hm-sec" + (flip ? " hm-flip" : ""), id: t.id, "aria-labelledby": t.id + "-h" },
      h("div", { "class": "wrap" },
        h("div", { "class": "hm-grid" },
          h("div", { "class": "hm-text" }, h("h2", { id: t.id + "-h", tabindex: "-1", text: T(t.name) }), h("p", { "class": "hm-what", text: what })),
          h("div", { "class": "hm-preview hm-rise" }, preview),
          h("div", { "class": "hm-actions" }, actions))));
  }

  function bridge() {
    return h("div", { "class": "hm-bridge" }, h("div", { "class": "wrap" },
      h("p", { "class": "hm-bridge-line", text: T("Beyond the five worlds, the platform has six tools. Each one opens from here.") }),
      h("nav", { "aria-label": T("Tools on this page") }, h("ul", { "class": "hm-jump" }, TOOLS.map(function (t) {
        return h("li", null, h("a", { href: "#" + t.id, "data-hm-jump": t.id, text: T(t.name) }));
      })))));
  }

  /* Ask the data: a real question box. The question travels to #/ask in sessionStorage and is put in its box. */
  var FRONT_OF = [[4, "Prevent"], [1, "Detect"], [2, "Suppress"]];   /* one saved question per front; same order in both languages */
  function askBand() {
    var t = TOOLS[0];
    var input = h("input", { type: "text", id: "hm-q", name: "q", maxlength: "500", autocomplete: "off",
      placeholder: T("For example: which materials were burned in Moon-base air?") });
    var form = h("form", { "class": "hm-ask-form", role: "search", onsubmit: function (ev) { ev.preventDefault(); handOff(input.value.trim(), false); } },
      h("label", { "class": "hm-label", "for": "hm-q", text: T("Your question") }),
      h("div", { "class": "hm-ask-row" }, input, h("button", { type: "submit", "class": "c-btn c-btn-primary", text: T("Ask a question") })));
    var ex = (C.examples || []);
    var saved = FRONT_OF.filter(function (f) { return ex[f[0]] && ex[f[0]].q; });
    return h("section", { "class": "hm-sec hm-sec-ask", id: t.id, "aria-labelledby": t.id + "-h" },
      h("div", { "class": "wrap" }, h("div", { "class": "hm-ask" },
        h("h2", { id: t.id + "-h", tabindex: "-1", text: T(t.name) }),
        h("p", { "class": "hm-what", text: T("Ask in your own words. An AI answers from the records of the repository and cites the page behind every claim.") }),
        h("div", { "class": "hm-rise" }, form,
          saved.length ? [h("p", { "class": "hm-saved-lead", text: T("Or open a saved answer, one per front:") }),
            h("ul", { "class": "hm-saved" }, saved.map(function (f) {
              var q = ex[f[0]].q;
              return h("li", null, h("button", { type: "button", "class": "hm-saved-btn", onclick: function () { handOff(q, true); } },
                h("span", { "class": "hm-saved-front", text: T(f[1]) }), h("span", { "class": "hm-saved-q", text: q })));
            }))] : null))));
  }
  function handOff(q, saved) {
    remember();
    try { if (q) sessionStorage.setItem(KEY_Q, JSON.stringify({ q: q, saved: !!saved })); else sessionStorage.removeItem(KEY_Q); } catch (e) { /* no storage */ }
    pendingQ = q ? { q: q, saved: !!saved } : null;
    location.hash = "#/ask";
    deliver(0);
  }
  var pendingQ = null;
  function takeQ() {
    var p = pendingQ;
    try { if (!p) p = JSON.parse(sessionStorage.getItem(KEY_Q) || "null"); sessionStorage.removeItem(KEY_Q); } catch (e) { /* no storage */ }
    pendingQ = null;
    return p && p.q ? p : null;
  }
  function deliver(tries) {
    if (!/^#\/ask\/?$/.test(location.hash)) return;
    var box = document.getElementById("ask-q");
    if (!box) { if (tries < 60) setTimeout(function () { deliver(tries + 1); }, 50); return; }
    var p = takeQ();
    if (!p) return;
    if (p.saved) {                                         /* a saved answer opens as saved, without asking the AI again */
      var btns = A.main.querySelectorAll("button"), i;
      for (i = 0; i < btns.length; i++) if (btns[i].textContent.trim() === p.q) { btns[i].click(); return; }
    }
    box.value = p.q;
    box.dispatchEvent(new Event("input", { bubbles: true }));
    box.focus();
  }
  if (/^#\/ask\/?$/.test(location.hash)) setTimeout(function () { deliver(0); }, 0);   /* a reload on #/ask */

  /* A legend with its title (D-1423): the three fuel colours. */
  function fuelKey(extra) {
    return h("div", { "class": "hm-legend" }, h("p", { "class": "hm-legend-t", text: T("Fuel type") }),
      h("p", { "class": "c-key hm-key" }, ["gas", "liquid", "solid"].map(function (k) { return h("span", { style: "--c:var(--" + k + ")", text: T(FUEL[k]) }); })),
      extra || null);
  }

  /* Investigations: the five with the most tests that record oxygen, as a strip of dots on an oxygen axis (Figure 1). */
  function invBand() {
    var t = TOOLS[1], byInv = {}, order = [];
    D.tests.forEach(function (x) {
      if (x.o2 === null || x.o2 === undefined) return;
      if (!byInv[x.inv]) { byInv[x.inv] = []; order.push(x.inv); }
      byInv[x.inv].push(x);
    });
    var top = order.sort(function (a, b) { return byInv[b].length - byInv[a].length; }).slice(0, 5);
    var lo = 10, hi = 90, all = [];
    top.forEach(function (id) { byInv[id].forEach(function (x) { all.push(x.o2); }); });
    if (all.length) { hi = Math.max(hi, Math.ceil(Math.max.apply(null, all) / 10) * 10); lo = Math.min(lo, Math.floor(Math.min.apply(null, all) / 10) * 10); }
    var gapA = Math.round(D.summary.solidsMaxO2 * 10) / 10, gapB = 30;
    var gapText = tpl("No solid tested from {a} to {b} % oxygen", { a: gapA, b: gapB });

    function rowDraw(list) {
      return function (svg, w) {
        var H = 40, x = function (o) { return 2 + (o - lo) / (hi - lo) * (w - 4); };
        sv("rect", { x: x(gapA), y: 0, width: x(gapB) - x(gapA), height: H, "class": "hm-gap" }, svg);
        sv("line", { x1: 0, y1: H / 2, x2: w, y2: H / 2, "class": "hm-base" }, svg);
        list.forEach(function (q, k) {
          var j = ((k * 0.61803398875) % 1) - 0.5;          /* a steady spread, so equal values do not stack into one dot */
          sv("circle", { cx: x(q.o2), cy: H / 2 + j * (H - 12), r: 3, "class": "hm-dot hm-" + (q.type || "none") + (q.ref === "burner" ? " hm-ring" : "") }, svg);
        });
        return H;
      };
    }
    var rows = top.map(function (id) {
      var i = A.inv(id) || { acr: id, id: id }, list = byInv[id];
      return h("li", { "class": "hm-strip-row" },
        h("p", { "class": "hm-strip-name" }, h("a", { href: "#/investigation/" + i.id, text: i.acr }), " ",
          h("span", { "class": "hm-strip-n" }, A.num(fmt(list.length)), " " + T("tests with oxygen"))),
        fitted("hm-strip-plot", i.acr + ": " + fmt(list.length) + " " + T("tests with oxygen"), rowDraw(list)));
    });
    var axis = fitted("hm-strip-axis", T("Oxygen in each test (%)"), function (svg, w) {
      var x = function (o) { return 2 + (o - lo) / (hi - lo) * (w - 4); }, step = w < 420 ? 20 : 10, o;
      for (o = lo; o <= hi; o += step) {
        sv("line", { x1: x(o), y1: 0, x2: x(o), y2: 6, "class": "hm-tick" }, svg);
        sv("text", { x: Math.min(w - 14, Math.max(10, x(o))), y: 24, "text-anchor": "middle", "class": "hm-num" }, svg, String(o));
      }
      sv("text", { x: w / 2, y: 48, "text-anchor": "middle", "class": "hm-axlabel" }, svg, T("Oxygen in each test (%)"));
      return 56;
    });
    var preview = top.length ? A.apaFigure(1, T("Oxygen recorded in each test, in the five investigations with the most such tests"),
      h("div", { "class": "hm-strip" },
        h("ol", { "class": "hm-strip-list" }, rows), h("div", { "class": "hm-strip-axisrow" }, axis),
        h("p", { "class": "hm-gap-key" }, h("span", { "class": "hm-gap-sw", "aria-hidden": "true" }), gapText),
        fuelKey(h("p", { "class": "hm-marker" }, h("span", { "class": "hm-legend-t", text: T("Marker") }),
          h("span", { "class": "hm-mk hm-mk-fill", text: T("Filled: oxygen of the chamber atmosphere") }),
          h("span", { "class": "hm-mk hm-mk-ring", text: T("Ring: oxygen of the burner gas (inverse flame)") })))),
      tpl("Data: {src}. Each dot is one row of the investigation's experimental tables in PSI. The red band runs from {a} %, the highest oxygen of any solid tested in PSI, to {b} %, the Moon-base air of the challenge.",
        { src: T(D.summary.source), a: gapA, b: gapB })) : missing();
    return band(t, tpl("The {n} combustion investigations in PSI, ordered by how much they matter for fire safety.", { n: fmt(D.summary.investigations) }),
      preview, h("a", { "class": "c-btn", href: "#/investigations", text: T("Open the investigations") }), false);
  }

  /* Materials: the ten solids as cards with the same image as the Materials gallery and three short answers.
     The rule is the one of js/materials.js (IMG and image()): three files from images.nasa.gov, recorded in
     _imagenes/materiales.json, and site figures from data/figures.js; Ultem has none. Replicated here because that
     function is not reachable from outside its file. */
  var MAT_IMG = {
    "PMMA (acrylic)": { file: "img/materials/pmma.jpg", short: "NASA, JSC", focus: "52% 55%" },
    "SIBAL (cotton-fiberglass fabric)": { file: "img/materials/sibal.jpg", short: "NASA, JSC", focus: "35% 50%" },
    "Kapton": { fig: "meyer-p24-fig21", focus: "50% 50%" },
    "Silicone": { fig: "saffire17-p14", focus: "50% 12%" },
    "Teflon": { fig: "meyer-p20-fig15", focus: "50% 50%" },
    "Lampwick": { fig: "samer-p9-fig13", focus: "100% 0%" },
    "Wax": { file: "img/materials/wax.jpg", short: "NASA, JSC", focus: "50% 45%" },
    "Pyrell": { fig: "samer-p9-fig13", focus: "0% 0%" },
    "Nomex": { fig: "meyer-p29-fig28", focus: "0% 50%" },
    "Ultem": null
  };
  function matImage(m) {
    var i = MAT_IMG[m.name], f;
    if (!i) return null;
    if (!i.fig) return i;
    f = (window.OFMW_FIGURES || []).filter(function (x) { return x.id === i.fig; })[0];
    if (!f || !f.img) return null;
    return { file: f.img, focus: i.focus, short: f.team && f.credit ? f.credit.split(",")[0] + ", NASA" : (f.doc ? f.doc[LANG] || f.doc.en : "") };
  }
  function matBand() {
    var t = TOOLS[2], list = D.materials || [];
    function answer(label, n, unit) {
      return h("li", { "class": "hm-ans" + (n > 0 ? "" : " hm-ans-none") }, h("span", { "class": "hm-ans-k", text: T(label) }),
        n > 0 ? h("span", null, A.num(fmt(n)), " " + T(unit).replace("{n}", "").trim()) : h("span", { text: T("no data") }));
    }
    var preview = list.length ? h("div", null,
      h("ul", { "class": "hm-mats" }, list.map(function (m) {
        var im = matImage(m), b = m.burn || {}, sm = m.smoke || {};
        return h("li", null, h("a", { "class": "hm-mat", href: "#/material/" + encodeURIComponent(m.name) },
          im ? h("span", { "class": "hm-mat-img" }, h("img", { src: im.file, alt: "", loading: "lazy", decoding: "async", style: "object-position:" + (im.focus || "50% 50%") }))
            : h("span", { "class": "hm-mat-img hm-mat-noimg" }, h("span", { "class": "hm-mat-noimg-name", text: m.name }), A.tag("missing", T("No NASA image found"))),
          h("span", { "class": "hm-mat-name", text: m.name }),
          im ? h("span", { "class": "hm-mat-credit", text: T("Image: ") + im.short }) : null,
          h("ul", { "class": "hm-answers" }, answer("Burned: ", b.tests || 0, "{n} tests"), answer("Smoke: ", sm.runs || 0, "{n} runs"), answer("Detector: ", sm.detectorRuns || 0, "{n} runs"))));
      }))) : missing();
    return band(t, T("For each solid: whether it burned, what smoke it gives and whether the detector sees it."),
      preview, h("a", { "class": "c-btn", href: "#/materials", text: T("Open the materials") }), true);
  }

  /* Will it burn?: the oxygen-pressure plane in small (Figure 2), and five atmospheres that open the tool already set.
     Pointing at an atmosphere marks it on the chart; the first one is marked to begin with. */
  var PRESETS = [["Station air", 21, 14.7], ["10.2 psia crew atmosphere", 26.5, 10.2], ["8.2 psia crew atmosphere", 34, 8.2], ["Moon base", 30, 10.2], ["Spacesuit", 100, 4.3]];
  function burnBand() {
    var t = TOOLS[3], groups = {}, drawn = 0, sel = 0;
    D.tests.forEach(function (x) {
      if (x.o2 === null || x.p === null || !x.type || x.ref !== "atmosphere" || x.p > 24) return;
      var k = x.type + "|" + Math.round(x.o2 * 2) / 2 + "|" + Math.round(x.p * 4) / 4;
      groups[k] = (groups[k] || 0) + 1; drawn++;
    });
    var pts = Object.keys(groups).map(function (k) { var a = k.split("|"); return { type: a[0], o2: +a[1], p: +a[2], n: groups[k] }; })
      .sort(function (a, b) { return b.n - a.n; });
    var plot = fitted("hm-plane", T("Tests by oxygen and pressure, with the Station and Moon-base atmospheres"), function (svg, w) {
      var H = Math.round(Math.max(280, Math.min(420, w * 0.64))), L = 52, R = w - 10, Tp = 10, B = H - 56;
      var x = function (p) { return L + (p - 4) / 20 * (R - L); }, y = function (o) { return B - (Math.min(45, o) - 10) / 35 * (B - Tp); }, p, o;
      for (p = 4; p <= 24; p += (w < 420 ? 4 : 2)) { sv("line", { x1: x(p), y1: Tp, x2: x(p), y2: B, "class": "hm-grid-l" }, svg); sv("text", { x: x(p), y: B + 20, "text-anchor": "middle", "class": "hm-num" }, svg, String(p)); }
      for (o = 10; o <= 45; o += 5) { sv("line", { x1: L, y1: y(o), x2: R, y2: y(o), "class": "hm-grid-l" }, svg); sv("text", { x: L - 6, y: y(o) + 5, "text-anchor": "end", "class": "hm-num" }, svg, String(o)); }
      sv("rect", { x: x(13.5), y: y(23.5), width: x(16) - x(13.5), height: y(19.5) - y(23.5), "class": "hm-zone" }, svg);
      sv("rect", { x: x(4), y: y(45), width: x(11) - x(4), height: y(30) - y(45), "class": "hm-zone" }, svg);
      var k = Math.max(0.8, Math.min(1.25, w / 560));
      pts.forEach(function (q) { sv("circle", { cx: x(q.p), cy: y(q.o2), r: Math.min(15, 2.4 + Math.sqrt(q.n) * 1.1) * k, "class": "hm-pt hm-" + q.type }, svg); });
      PRESETS.forEach(function (a, i) {
        if (i === sel || a[1] > 45) return;
        sv("path", { d: "M" + (x(a[2]) - 5) + " " + (y(a[1]) - 5) + " l10 10 m0 -10 l-10 10", "class": "hm-cross" }, svg);
      });
      sv("text", { x: x(4) + 8, y: y(45) + 20, "class": "hm-zlabel" }, svg, T("Moon base"));
      sv("text", { x: Math.min(x(16) + 6, R - 4), y: y(23.5) - 8, "text-anchor": x(16) + 100 > R ? "end" : "start", "class": "hm-zlabel" }, svg, T("Station air"));
      var a = PRESETS[sel], mx = x(a[2]), my = y(a[1]), over = a[1] > 45;
      sv("circle", { cx: mx, cy: my, r: 13, "class": "hm-probe" }, svg);
      sv("path", { d: "M" + (mx - 8) + " " + (my - 8) + " l16 16 m0 -16 l-16 16", "class": "hm-cross hm-cross-on" }, svg);
      var lbl = T(a[0]) + ": " + a[1] + " %, " + a[2] + " psi" + (over ? " (" + T("above the chart") + ")" : ""), right = mx < (L + R) / 2;
      var tx = sv("text", { x: right ? mx + 20 : mx - 20, y: over ? my + 30 : my - 18, "text-anchor": right ? "start" : "end", "class": "hm-plabel" }, svg, lbl);
      tx.setAttribute("paint-order", "stroke");
      sv("text", { x: (L + R) / 2, y: H - 10, "text-anchor": "middle", "class": "hm-axlabel" }, svg, T("Pressure (psi)"));
      sv("text", { x: 14, y: (Tp + B) / 2, "text-anchor": "middle", transform: "rotate(-90 14 " + (Tp + B) / 2 + ")", "class": "hm-axlabel" }, svg, T("Oxygen in the atmosphere (%)"));
      sv("path", { d: "M" + L + " " + Tp + " V" + B + " H" + R, "class": "hm-ax" }, svg);
      return H;
    });
    var btns = PRESETS.map(function (a, i) {
      function mark() { if (sel === i) return; sel = i; btns.forEach(function (b, j) { b.setAttribute("aria-current", j === i ? "true" : "false"); }); plot.hmRedraw(); }
      return h("a", { "class": "c-btn hm-preset", href: "#/burn?o2=" + a[1] + "&p=" + a[2], "aria-current": i === sel ? "true" : "false", onmouseenter: mark, onfocus: mark },
        h("span", { text: T(a[0]) }), h("span", { "class": "hm-preset-v" }, A.num(String(a[1])), "\u00a0" + T("% oxygen at") + " ", A.num(String(a[2])), "\u00a0psi"));
    });
    var preview = pts.length ? A.apaFigure(2, T("Tests by oxygen and pressure, with the Station and Moon-base atmospheres"),
      h("div", null, plot, fuelKey(h("p", { "class": "hm-marker" }, h("span", { "class": "hm-legend-t", text: T("Atmosphere marked") }),
        h("span", { "class": "hm-mk hm-mk-cross" }, (function () { var k = sv("svg", { viewBox: "0 0 12 12", "aria-hidden": "true" }); sv("path", { d: "M1 1 L11 11 M11 1 L1 11" }, k); return k; })(), T("Cross: the five atmospheres beside the chart; circled: the one marked"))))),
      tpl("Data: {src}. Oxygen and pressure as recorded in the experimental tables of each investigation. Drawn: {n} tests whose oxygen is the chamber atmosphere, up to 24 psi; each circle groups the tests at one oxygen level and pressure, and larger means more tests. Station zone: 13.5 to 16 psi and 19.5 to 23.5 % oxygen. Moon-base zone: 30 % oxygen or more at 11 psi or less.",
        { src: T(D.summary.source), n: fmt(drawn) })) : missing();
    return band(t, T("Set an atmosphere and see what was really tested near it."), preview,
      [h("a", { "class": "c-btn", href: "#/burn", text: T("Open Will it burn?") }),
        h("div", { "class": "hm-presets-box" }, h("p", { "class": "hm-saved-lead", text: T("Start from an atmosphere:") }),
          h("p", { "class": "hm-note hm-presets-help", text: T("Point at an atmosphere to mark it on the chart; choose it to open the tool with it set.") }),
          h("ul", { "class": "hm-presets" }, btns.map(function (b) { return h("li", null, b); })))], false);
  }

  /* Timeline (Figure 3): four of its 3D models in small, mounted on the shared stage only while the band is on the
     home page and has been seen, and every entry on one line, each opening its own year. */
  function tlSlug(e, i) {
    if (/^\d{4}$/.test(e.year)) return e.year;
    var y = String(e.year).toLowerCase();
    if (y === "recent" || y === "reciente") return "recent";
    if (y === "future" || y === "futuro") return "future";
    return String(i + 1);
  }
  /* Which entry each model belongs to: the same rule as js/timeline.js (sceneFor). Names and credits as models/models.json. */
  var TL_MODELS = [["tl-lunar-module", "1970", "Apollo Lunar Module", "NASA"], ["tl-skylab", "1974", "Skylab", "NASA"], ["tl-mir", "1997", "Mir", "NASA"],
    ["tl-moon", "future", "Moon", "NASA's Goddard Space Flight Center"]];
  var tiles = [], STG = null, noStage = false;
  function stageArrived() { if (!STG && window.OFMW_STAGE) { STG = window.OFMW_STAGE; mountTiles(); } }
  if (window.OFMW_STAGE) STG = window.OFMW_STAGE;
  else {
    window.addEventListener("ofmw-stage-ready", stageArrived);
    setTimeout(function () { if (!STG) { noStage = true; mountTiles(); } }, 12000);
  }
  function mountTiles() {
    tiles.forEach(function (tl) {
      if (!tl.want || !tl.el.isConnected || tl.handle || tl.still) return;
      if (!STG) {
        if (!noStage) return;
        tl.still = h("img", { "class": "hm-scene-still", alt: "", src: "img/scenes/" + tl.id + ".jpg" });
        tl.el.appendChild(tl.still); tl.el.setAttribute("data-state", "still");
        return;
      }
      tl.handle = STG.mount(tl.el, tl.id, { placeholder: true, tier: "lite", priority: 5 });
      tl.handle.onState(function (state, info) {
        tl.el.setAttribute("data-state", state);   /* the caption keeps its short name: a longer one would move the page under the reader */
      });
    });
  }
  function dropTiles() {
    tiles.forEach(function (tl) { if (tl.handle) { tl.handle.dispose(); tl.handle = null; } tl.el.removeAttribute("data-state"); });
  }
  /* Leaving the page that shows the bands: every scene of ours is unmounted, so none stays on the canvas. */
  window.addEventListener("hashchange", function () {
    setTimeout(function () { tiles.forEach(function (tl) { if (!tl.el.isConnected && tl.handle) { tl.handle.dispose(); tl.handle = null; } }); }, 0);
  });
  function tlBand() {
    var t = TOOLS[4], list = C.timeline || [];
    var bySlug = {};
    list.forEach(function (e, i) { bySlug[tlSlug(e, i)] = e; });
    var mine = [];
    var models = h("ul", { "class": "hm-models" }, TL_MODELS.filter(function (m) { return bySlug[m[1]]; }).map(function (m) {
      var e = bySlug[m[1]], el = h("div", { "class": "hm-scene", "aria-hidden": "true" }), cap = h("span", { "class": "hm-model-credit", text: T("Model: ") + m[2] + ", " + m[3] });
      var tl = { id: m[0], el: el, cap: cap, handle: null, still: null, want: false };
      tiles.push(tl); mine.push(tl);
      return h("li", null, h("a", { "class": "hm-model", href: "#/timeline/" + m[1], "aria-label": e.year + ", " + e.title },
        el, h("span", { "class": "hm-model-year" + (/^\d{4}$/.test(e.year) ? " num" : ""), text: e.year }), h("span", { "class": "hm-model-title", text: e.title }), cap));
    }));
    if (window.IntersectionObserver) {
      var io = new IntersectionObserver(function (en) {
        en.forEach(function (x) { if (x.isIntersecting) { mine.forEach(function (tl) { tl.want = true; }); mountTiles(); } });
      }, { rootMargin: "200px 0px" });
      io.observe(models);
    } else mine.forEach(function (tl) { tl.want = true; });
    var rows = list.length ? h("ol", { "class": "hm-tl" }, list.map(function (e, i) {
      var kind = e.kind === "accident" || e.kind === "experiment" || e.kind === "planned" ? e.kind : "";
      return h("li", { "class": kind ? "hm-tl-" + kind : null }, h("a", { href: "#/timeline/" + tlSlug(e, i) },
        h("span", { "class": "hm-tl-dot", "aria-hidden": "true" }),
        /^\d{4}$/.test(e.year) ? h("span", { "class": "hm-tl-year num", text: e.year }) : h("span", { "class": "hm-tl-year", text: e.year }),
        h("span", { "class": "hm-tl-title", text: e.title }),
        kind ? h("span", { "class": "hm-tl-kind", text: T({ accident: "Accident", experiment: "Experiment", planned: "Planned" }[kind]) }) : null));
    })) : null;
    var key = h("div", { "class": "hm-legend" }, h("p", { "class": "hm-legend-t", text: T("Kind of entry") }),
      h("p", { "class": "hm-tl-key" }, [["accident", "Accident"], ["experiment", "Experiment"], ["planned", "Planned"]].map(function (k) {
        return h("span", { "class": "hm-tl-" + k[0] }, h("span", { "class": "hm-tl-dot", "aria-hidden": "true" }), T(k[1]));
      })));
    var preview = list.length ? A.apaFigure(3, T("Emergencies and the experiments that answer them, with four of their 3D models"),
      h("div", null, models, rows, key),
      T("Entries: the timeline of this site; each one gives its source on its own page. Models: Apollo Lunar Module, Skylab and Mir from NASA 3D Resources; Moon from NASA's Goddard Space Flight Center. Not to scale.")) : missing();
    return band(t, T("Every emergency left a question; these experiments try to answer it."), preview,
      h("a", { "class": "c-btn", href: "#/timeline", text: T("Open the timeline") }), true);
  }

  /* Data and sources: three figures from the summary and a row of cited pages. */
  function dataBand() {
    var t = TOOLS[5], S = D.summary, ev = (window.OFMW_EVIDENCE || []).filter(function (e) { return e && e.img; });
    var seen = {}, pick = [];
    ev.forEach(function (e) { var k = e.docInv || e.file; if (pick.length < 6 && !seen[k]) { seen[k] = 1; pick.push(e); } });
    ev.forEach(function (e) { if (pick.length < 6 && pick.indexOf(e) < 0) pick.push(e); });
    function doc(e) { return e.doc ? (e.doc[LANG] || e.doc.en || "") : (e.file || e.id); }
    var figs = h("dl", { "class": "hm-figs" }, [[S.tests, "tests in the table"], [S.investigations, "combustion investigations"], [S.withO2AndPressure, "tests with oxygen and pressure"]].map(function (f) {
      return h("div", null, h("dt", { text: T(f[1]) }), h("dd", { "class": "num", text: fmt(f[0]) }));
    }));
    var pages = pick.length ? [h("p", { "class": "hm-saved-lead", text: tpl("Some of the {n} cited pages kept as images:", { n: fmt(ev.length) }) }),
      h("ul", { "class": "hm-pages" }, pick.map(function (e) {
        var label = tpl("Page {p} of {doc}", { p: e.page, doc: doc(e) });
        return h("li", null, h("a", { href: "#/source/" + encodeURIComponent(e.id), "aria-label": label, title: label },
          h("img", { src: e.img, alt: "", loading: "lazy", decoding: "async", width: e.w || null, height: e.h || null }),
          h("span", { "class": "hm-page-n", text: tpl("p. {p}", { p: e.page }) })));
      }))] : A.state("empty", T("No cited page has an image yet."), null);
    return band(t, tpl("The {tests} tests in one table you can download, and the exact page behind every finding.", { tests: fmt(S.tests) }),
      h("div", null, figs, pages),
      [h("a", { "class": "c-btn", href: "#/data", text: T("Open the data") }), h("a", { "class": "c-btn", href: "#/sources", text: T("Open the sources") })], false);
  }

  /* ---------- appearing once, and the way back to the same place ---------- */
  /* Nothing is hidden until the observer has said it is off screen; anything it never reports stays visible,
     and a scroll check shows whatever is on screen even if the observer is late. */
  function reveal(root) {
    if (!window.IntersectionObserver || (REDUCE && REDUCE.matches)) return;
    root.classList.add("hm-anim");
    function show(n) { n.classList.remove("hm-wait"); n.classList.add("hm-shown"); }
    var io = new IntersectionObserver(function (list) {
      list.forEach(function (en) {
        if (en.isIntersecting) { show(en.target); io.unobserve(en.target); }
        else if (!en.target.classList.contains("hm-shown") && en.boundingClientRect.top > 0) en.target.classList.add("hm-wait");
      });
    }, { threshold: 0 });
    root.querySelectorAll(".hm-rise").forEach(function (n) { io.observe(n); });
    window.addEventListener("scroll", function () {
      root.querySelectorAll(".hm-wait").forEach(function (n) { var r = n.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) { show(n); io.unobserve(n); } });
    }, { passive: true });
  }
  /* Before leaving for a tool, the scroll position is kept in this history entry; Back brings it again. */
  function remember() {
    try { var st = history.state && typeof history.state === "object" ? history.state : {}, o = {}, k; for (k in st) o[k] = st[k]; o.hmY = window.scrollY; history.replaceState(o, "", location.href); } catch (e) { /* history not writable */ }
  }
  var backY = null, roots = [], previewRoot = null;
  window.addEventListener("popstate", function (ev) { backY = ev.state && typeof ev.state.hmY === "number" ? ev.state.hmY : null; });
  window.addEventListener("hashchange", function () {
    if (backY === null) return;
    var y = backY; backY = null;
    function go() { if (roots.some(function (r) { return r.isConnected; })) window.scrollTo(0, y); }
    /* the journey puts its own home position back in the next frame; this runs after it, then once more after late layout */
    setTimeout(go, 0); requestAnimationFrame(function () { requestAnimationFrame(go); }); setTimeout(go, 150); setTimeout(go, 400);
  });

  function build() {
    if (!D || !C || !D.summary) return h("div", { "class": "hm" }, h("div", { "class": "wrap" }, missing()));
    var parts = [bridge()], makers = [askBand, invBand, matBand, burnBand, tlBand, dataBand];
    makers.forEach(function (m) { try { parts.push(m()); } catch (e) { parts.push(h("div", { "class": "wrap" }, missing())); } });
    var root = h("div", { "class": "hm" }, parts);
    root.addEventListener("click", function (ev) {
      var a = ev.target.closest && ev.target.closest("a");
      if (!a) return;
      var jump = a.getAttribute("data-hm-jump");
      if (jump) {                                          /* the bridge links scroll to their band, without touching the router */
        ev.preventDefault();
        var sec = document.getElementById(jump), head = document.getElementById(jump + "-h");
        if (sec) sec.scrollIntoView({ behavior: REDUCE && REDUCE.matches ? "auto" : "smooth", block: "start" });
        if (head) head.focus({ preventScroll: true });
        return;
      }
      if (/^#\//.test(a.getAttribute("href") || "")) remember();
    });
    reveal(root);
    roots.push(root);
    return root;
  }

  window.OFMW_HOME = function () { return build(); };   /* the journey keeps the one it hangs */

  /* The review page: the same bands alone, under a title. */
  A.route("home-preview", "world", function () {
    document.title = T("Tools") + " · One Fire, Many Worlds";
    var root = previewRoot || (previewRoot = build());
    A.main.replaceChildren(h("div", { "class": "wrap" }, A.intro(T("Tools"), T("Preview of the bands under the home page, one per tool."))), root);
    root.querySelectorAll(".hm-fit").forEach(function (b) { if (b.hmPaint) b.hmPaint(); });
  });
})();
