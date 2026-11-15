/* Material passport: for each solid material, everything the site holds about it, in one place: whether it burns,
   what smoke it makes, whether the detector sees it, the pages of the documents that speak of it, its figures,
   its tests, and what is still missing. Documents are grouped by where the evidence comes from, so a ground test
   is never read as a test in orbit.
   The list is a gallery (each material with a real NASA image) or the comparative table; the passport opens with
   the image, the three answers side by side and an index of its sections. Classes start with mat-. */
(function () {
  "use strict";
  var A = window.OFMW_APP, h = A.h, fmt = A.fmt, plural = A.plural, D = A.D, C = A.C, T = A.T;
  if (!D || !C) return;

  A.es({
    "For each solid material in NASA's repository: was it burned, what smoke does it make, and does the Station detector see that smoke?":
      "Para cada material sólido del repositorio de NASA: ¿se quemó?, ¿qué humo da? y ¿lo ve el detector de la Estación?",
    "View": "Vista", "Gallery": "Galería", "Table": "Tabla", "Sort by": "Ordenar por", "Repository order": "Orden del repositorio",
    "Name": "Nombre", "Most tests": "Más pruebas", "Most complete": "Más completo",
    "Burned?": "¿Ardió?", "Smoke": "Humo", "Detector": "Detector",
    "% oxygen tested": "% de oxígeno probado", "median particle size": "tamaño mediano de partícula", "median signal change": "cambio mediano de señal",
    "All three answers": "Las tres respuestas", "Image: ": "Imagen: ", "No NASA image found": "Sin imagen de NASA",
    "On the ground": "En tierra", "All materials": "Todos los materiales", "On this page": "En esta página",
    "The three answers": "Las tres respuestas", "Bars compare each value with the highest of the ten materials.": "Las barras comparan cada valor con el más alto de los diez materiales.",
    "smoke runs": "corridas de humo", "Show all ": "Mostrar las ", "Show fewer": "Mostrar menos",
    "microgravity": "microgravedad", "not microgravity": "sin microgravedad", "no data yet": "aún sin datos",
    "Previous material": "Material anterior", "Next material": "Material siguiente",
    "Close": "Cerrar", "Previous": "Anterior", "Next": "Siguiente", " of ": " de ",
    "Credit: ": "Crédito: ", "Image page at NASA": "Página de la imagen en NASA", "Source": "Fuente",
    "Open the material": "Abrir el material", "There is no material called ": "No hay un material llamado ",
    "No image from NASA shows this material in its experiment. The searches are listed in the image manifest of the site.":
      "Ninguna imagen de NASA muestra este material en su experimento. Las búsquedas están en el manifiesto de imágenes del sitio.",
    "Main image of the material": "Imagen principal del material",
    "Figures and images that speak of this material": "Figuras e imágenes que hablan de este material",
    "Open a figure to see it large, with its caption, its credit and its source.": "Abre una figura para verla en grande, con su pie, su crédito y su fuente.",
    "Enlarged figure": "Figura ampliada",
    "Test the gallery or the table, and open a material to see its passport.": "Cambia entre galería y tabla, y abre un material para ver su pasaporte.",
    "materials": "materiales", "Burn tests": "Pruebas de quemado", "Pages": "Páginas", "Figures": "Figuras", "Investigations": "Investigaciones",
    /* what each main image shows (interface text written for this view; titles and credits stay as NASA gives them) */
    "A flame over a 4 mm thick, 1 cm wide acrylic slab during a BASS-II flame test session aboard the International Space Station (card 2).":
      "Una llama sobre una placa de acrílico de 4 mm de grosor y 1 cm de ancho durante una sesión de pruebas de BASS-II a bordo de la Estación Espacial Internacional (tarjeta 2).",
    "A 40 cm wide cotton-fiberglass fabric sample burning inside Saffire-IV, lit by green LEDs; Saffire-IV is not one of the PSI investigations.":
      "Una muestra de tela de algodón y fibra de vidrio de 40 cm de ancho ardiendo dentro de Saffire-IV, iluminada con LED verdes; Saffire-IV no es una de las investigaciones de PSI.",
    "Aged Kapton smoke particles collected by SAME aboard the ISS, seen with a transmission electron microscope.":
      "Partículas envejecidas de humo de Kapton recogidas por SAME a bordo de la Estación, vistas con un microscopio electrónico de transmisión.",
    "The Saffire-II sample card before burning: silicone samples 1 to 4 are at the top.":
      "La tarjeta de muestras de Saffire-II antes de quemarse: las muestras de silicón 1 a 4 están arriba.",
    "Teflon smoke particles collected by SAME aboard the ISS, seen with a transmission electron microscope.":
      "Partículas de humo de Teflon recogidas por SAME a bordo de la Estación, vistas con un microscopio electrónico de transmisión.",
    "Electron-microscope images of Pyrell and lampwick smoke from SAME-R runs, with and without airflow; the lampwick panels are on the right.":
      "Imágenes de microscopio electrónico del humo de Pyrell y de mecha de lámpara en corridas de SAME-R, con y sin flujo de aire; los cuadros de la mecha están a la derecha.",
    "Electron-microscope images of Pyrell and lampwick smoke from SAME-R runs, with and without airflow; the Pyrell panels are on the left.":
      "Imágenes de microscopio electrónico del humo de Pyrell y de mecha de lámpara en corridas de SAME-R, con y sin flujo de aire; los cuadros de Pyrell están a la izquierda.",
    "A candle flame inside the glovebox of the Candle Flames in Microgravity experiment on STS-50; it is not one of the BASS candle tests counted in PSI.":
      "La llama de una vela dentro de la caja de guantes del experimento Candle Flames in Microgravity, en la misión STS-50; no es una de las pruebas de velas de BASS que cuenta PSI.",
    "Nomex snips before heating, their char after heating, and filters with Nomex smoke, from the ground tests of NASA/TM-2015-218891.":
      "Recortes de Nomex antes de calentarlos, su carbón después y filtros con su humo, de las pruebas en tierra de NASA/TM-2015-218891."
  });

  var E = window.OFMW_EVIDENCE || [], F = window.OFMW_FIGURES || [], L = window.OFMW_LANG === "es" ? "es" : "en";
  var OUT = { out: T("went out by itself"), burn: T("kept burning"), none: T("did not ignite or spread") };
  function maxOf(get) { return Math.max.apply(null, D.materials.map(function (m) { return get(m) || 0; })); }
  var maxD = maxOf(function (m) { return m.smoke.medianDiameterNm; });
  var maxV = maxOf(function (m) { return m.smoke.detectorMedianV; });
  var maxB = maxOf(function (m) { return m.burn.tests; });
  var MOON_O2 = 30;                                   /* the Moon-base air of the challenge: 30 % oxygen or more (content.js, agenda) */

  /* The main image of each material. The record of each one (page, title and credit as NASA gives them, what it
     shows, date checked) is interfaz/_imagenes/materiales.json. Three come from images.nasa.gov; the others are
     figures already on the site, credited in data/figures.js. focus is where the crop of the gallery centres. */
  var IMG = {
    "PMMA (acrylic)": { file: "img/materials/pmma.jpg", w: 1600, h: 1062, focus: "52% 55%", url: "https://images.nasa.gov/details/iss040e072900",
      title: "BASS II Operations", credit: "NASA, Johnson Space Center. Photographer: Reid Wiseman", short: "NASA, JSC", date: "2014-07-23", setting: "microgravity",
      shows: "A flame over a 4 mm thick, 1 cm wide acrylic slab during a BASS-II flame test session aboard the International Space Station (card 2)." },
    "SIBAL (cotton-fiberglass fabric)": { file: "img/materials/sibal.jpg", w: 1500, h: 1216, focus: "35% 50%", url: "https://images.nasa.gov/details/jsc2023e046375",
      title: "jsc2023e046375", credit: "NASA, Johnson Space Center", short: "NASA, JSC", date: "2023-07-25", setting: "microgravity",
      shows: "A 40 cm wide cotton-fiberglass fabric sample burning inside Saffire-IV, lit by green LEDs; Saffire-IV is not one of the PSI investigations." },
    "Kapton": { fig: "meyer-p24-fig21", focus: "50% 50%", setting: "microgravity",
      shows: "Aged Kapton smoke particles collected by SAME aboard the ISS, seen with a transmission electron microscope." },
    "Silicone": { fig: "saffire17-p14", focus: "50% 12%", setting: "ground",
      shows: "The Saffire-II sample card before burning: silicone samples 1 to 4 are at the top." },
    "Teflon": { fig: "meyer-p20-fig15", focus: "50% 50%", setting: "microgravity",
      shows: "Teflon smoke particles collected by SAME aboard the ISS, seen with a transmission electron microscope." },
    "Lampwick": { fig: "samer-p9-fig13", focus: "100% 0%", zoom: "scale(1.3)", origin: "100% 0%", setting: "microgravity",
      shows: "Electron-microscope images of Pyrell and lampwick smoke from SAME-R runs, with and without airflow; the lampwick panels are on the right." },
    "Wax": { file: "img/materials/wax.jpg", w: 1600, h: 1068, focus: "50% 45%", url: "https://images.nasa.gov/details/sts050-232-011",
      title: "Candle Flames in Microgravity Experiment", credit: "NASA, Johnson Space Center", short: "NASA, JSC", date: "1992-07-09", setting: "microgravity",
      shows: "A candle flame inside the glovebox of the Candle Flames in Microgravity experiment on STS-50; it is not one of the BASS candle tests counted in PSI." },
    "Pyrell": { fig: "samer-p9-fig13", focus: "0% 0%", zoom: "scale(1.3)", origin: "0% 0%", setting: "microgravity",
      shows: "Electron-microscope images of Pyrell and lampwick smoke from SAME-R runs, with and without airflow; the Pyrell panels are on the left." },
    "Nomex": { fig: "meyer-p29-fig28", focus: "0% 50%", setting: "ground",
      shows: "Nomex snips before heating, their char after heating, and filters with Nomex smoke, from the ground tests of NASA/TM-2015-218891." },
    "Ultem": null
  };
  /* A site figure lends its file, size, page and credit; a report figure without a credit line is credited to its report. */
  function image(m) {
    var i = IMG[m.name], f;
    if (!i) return null;
    if (!i.fig) return i;
    f = F.filter(function (x) { return x.id === i.fig; })[0];
    if (!f) return null;
    return { file: f.img, w: f.w, h: f.h, focus: i.focus, zoom: i.zoom, origin: i.origin, url: f.record || f.download, title: f.caption, figId: f.id, setting: i.setting, shows: i.shows,
      credit: f.credit || f.doc.en + (f.page ? ", p. " + f.page : "") + ", NASA Physical Sciences Informatics",
      short: f.team ? f.credit.split(",")[0] + ", NASA" : f.doc.en };
  }

  /* How each material is named in a caption or a claim, for catalog entries that do not list their materials yet. */
  var NAMES = {
    "PMMA (acrylic)": /\bpmma\b|acrylic|polymethyl/i, "SIBAL (cotton-fiberglass fabric)": /sibal|cotton[- ]fiberglass/i,
    "Kapton": /kapton/i, "Silicone": /silicone/i, "Teflon": /teflon|\bptfe\b/i, "Lampwick": /lamp ?wick/i,
    "Wax": /\bwax\b|candle/i, "Pyrell": /pyrell/i, "Nomex": /nomex/i, "Ultem": /ultem/i
  };
  function named(m) { return NAMES[m.name] || new RegExp(m.name.split(" ")[0].replace(/[^\w]/g, ""), "i"); }
  function about(entry, m, text) { return entry.materials ? entry.materials.indexOf(m.name) >= 0 : named(m).test(text || ""); }
  function pagesOf(m) { return E.filter(function (e) { return about(e, m, e.claim && e.claim.en); }); }
  function figuresOf(m) { return F.filter(function (f) { return about(f, m, f.caption); }); }

  /* Where the evidence comes from. The catalog says it in `origin`; until it does, the document tells. */
  var BY_DOC = { std6001: "standard", tm1989: "history", apollo13: "history", meyer2015: "ground", fm2poster: "planned" };
  function origin(x) { return x.origin || BY_DOC[String(x.id).split("-")[0]] || "microgravity"; }
  var GROUPS = [
    { id: "flight", label: T("In microgravity"), tag: ["flight", T("microgravity")], note: T("Tests in orbit, in parabolic flight or in drop towers, and the reports about them."), has: ["microgravity"] },
    { id: "ground", label: T("On the ground, in partial gravity and in standards"), tag: ["ground", T("not microgravity")], note: T("Tests in normal gravity or in partial gravity for seconds to a few minutes, NASA's acceptance standard for materials, and earlier memos. They do not measure microgravity."), has: ["ground", "partial", "standard", "history"] },
    { id: "planned", label: T("Planned, no data yet"), tag: ["planned", T("no data yet")], note: T("Experiments that are designed or proposed. Nothing has been measured yet."), has: ["planned"] }
  ];
  var TAG = { ground: T("ground test"), partial: T("partial gravity"), standard: T("standard"), history: T("memo, history"), planned: T("planned") };

  /* What was burned outside PSI in Moon-base-like air (D-1429): Saffire VI, December 2023, aboard an uncrewed
     Cygnus. Preliminary results, ICES 2024, p. 11. Its test-by-test data is not in PSI. */
  var OUTSIDE = {
    "SIBAL (cotton-fiberglass fabric)": { saffire: T("31.0 % oxygen at 54.1 kPa") },
    /* p. 11: VI-3, two-sided PMMA, 30.3 % at 54.6 kPa; VI-4, one-sided PMMA, 28.8 % at 55.2 kPa */
    "PMMA (acrylic)": { saffire: T("30.3 % oxygen at 54.6 kPa (two-sided sample) and 28.8 % at 55.2 kPa (one-sided)") },
    /* Nomex: a 2025 poster prepared for FM2, ground, drop tower and centrifuge, not a flight */
    "Nomex": { text: T("A 2025 poster prepared for the FM2 experiment gives approximate limiting oxygen for Nomex HT90-40 fabric at 8.2 psi: about 23 % in normal gravity, 29 % in lunar gravity and 38 % in microgravity, from ground, centrifuge and drop-tower tests. "), source: "nomex-fm2-2025" }
  };
  function outsideNote(m) {
    var o = OUTSIDE[m.name];
    if (!o) return null;
    var id = o.source || "saffire6-11", ev = A.evidence && A.evidence(id);
    var text = o.text || T("Saffire VI burned it in December 2023, aboard an uncrewed Cygnus, at ") + o.saffire + T(" (about 8 psi): close to Moon-base air. Preliminary results; its test-by-test data is not open in PSI. ");
    return h("p", { "class": "mat-known mat-outside" }, A.tag("outside", T("Outside PSI")), " ", text,
      ev ? h("a", { href: "#/source/" + id, text: T("See the page") }) : null);
  }

  function href(m) { return "#/material/" + encodeURIComponent(m.name); }
  function range(r, unit) { return r ? (r[0] === r[1] ? r[0] : r[0] + T(" to ") + r[1]) + " " + unit : T("Not recorded"); }
  function pct(v, max) { return Math.max(2, Math.min(100, Math.round(v / max * 100))); }
  function rail(left, width) {
    return h("span", { "class": "mat-rail", "aria-hidden": "true" }, h("span", { "class": "mat-fill", style: "left:" + left + "%;width:" + width + "%" }));
  }
  function nodata() { return A.tag("missing", T("No data")); }
  function pairs(m) {
    var key = m.name.split(" ")[0];
    return D.gravityPairs.filter(function (g) { return g.material.indexOf(key) >= 0; });
  }
  function outcomes(o) {
    var k = Object.keys(o || {});
    return k.length ? k.map(function (x) { return o[x] + " " + OUT[x]; }).join("; ") : "";
  }
  /* Tables and figures in academic layout with the shared classes (c-fig, c-table): number, title, body, note. */
  function apa(kind, n, title, body, note, titleLang) {
    return h("figure", { "class": "c-fig mat-apa" },
      h("figcaption", null, h("span", { "class": "c-fig-num", text: T(kind === "table" ? "Table " : "Figure ") + n }),
        h("span", { "class": "c-fig-title", lang: titleLang || null, text: title })),
      kind === "table" ? h("div", { "class": "c-table mat-tableframe", tabindex: "0", role: "region", "aria-label": title }, body) : body,
      note ? h("p", { "class": "c-fig-note" }, h("em", { text: T("Note. ") }), note) : null);
  }
  /* replaceChildren turns null into the text "null": fill() skips empty parts and flattens arrays. */
  function fill(el) { el.replaceChildren(); A.add(el, [].slice.call(arguments, 1)); }
  function store(key, value) { try { if (value === null) sessionStorage.removeItem(key); else sessionStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked */ } }
  function recall(key) { try { return JSON.parse(sessionStorage.getItem(key) || "null"); } catch (e) { return null; } }

  /* Everything the list shows about one material, counted once. */
  var INFO = D.materials.map(function (m, k) {
    var score = (m.burn.tests ? 1 : 0) + (m.smoke.medianDiameterNm !== null ? 1 : 0) + (m.smoke.detectorMedianV !== null ? 1 : 0);
    return { m: m, k: k, tests: D.tests.filter(function (t) { return t.family === m.name; }).length,
      pages: pagesOf(m).length, figs: figuresOf(m).length, score: score, full: !!(m.burn.tests && m.smoke.runs && m.smoke.detectorMedianV !== null) };
  });

  /* ---------- list ---------- */
  var VIEWS = ["gallery", "table"], SORTS = [["repo", "Repository order"], ["name", "Name"], ["tests", "Most tests"], ["complete", "Most complete"]];
  function listHash(view, sort) { return view === "gallery" && sort === "repo" ? "#/materials" : "#/materials/" + view + "/" + sort; }
  function sorted(sort) {
    var list = INFO.slice();
    list.sort(function (a, b) {
      if (sort === "name") return T(a.m.name).localeCompare(T(b.m.name), L);
      if (sort === "tests") return b.tests - a.tests || a.k - b.k;
      if (sort === "complete") return b.score - a.score || (b.pages + b.figs) - (a.pages + a.figs) || b.tests - a.tests || a.k - b.k;
      return a.k - b.k;
    });
    return list;
  }
  function media(m, img, cls) {
    if (!img) return h("div", { "class": "mat-media mat-media-missing " + (cls || "") },
      h("span", { "class": "mat-media-name", text: T(m.name) }), A.tag("missing", T("No NASA image found")));
    return h("div", { "class": "mat-media " + (cls || "") },
      h("img", { src: img.file, alt: T(img.shows), width: img.w, height: img.h, loading: "lazy", decoding: "async", style: "object-position:" + img.focus + (img.zoom && cls !== "mat-media-hero" ? ";transform:" + img.zoom + ";transform-origin:" + img.origin : "") }),
      img.setting === "ground" ? A.tag("ground", T("On the ground")) : null);
  }
  function cell(label, value) { return h("div", null, h("dt", { text: label }), h("dd", null, value)); }
  function strip(m) {
    var o2 = m.burn.o2;
    return h("dl", { "class": "mat-strip" },
      cell(T("Burned?"), m.burn.tests && o2 ? [h("span", { "class": "mat-v num", text: o2[0] === o2[1] ? String(o2[0]) : o2[0] + "–" + o2[1] }),
        rail(o2[0] / 40 * 100, Math.max(2, (o2[1] - o2[0]) / 40 * 100)), h("span", { "class": "mat-u", text: T("% oxygen tested") })] : nodata()),
      cell(T("Smoke"), m.smoke.medianDiameterNm !== null ? [h("span", { "class": "mat-v num", text: m.smoke.medianDiameterNm + " nm" }),
        rail(0, pct(m.smoke.medianDiameterNm, maxD)), h("span", { "class": "mat-u", text: T("median particle size") })] : nodata()),
      cell(T("Detector"), m.smoke.detectorMedianV !== null ? [h("span", { "class": "mat-v num", text: m.smoke.detectorMedianV + " V" }),
        rail(0, pct(m.smoke.detectorMedianV, maxV)), h("span", { "class": "mat-u", text: T("median signal change") })] : nodata()));
  }
  function counts(x) {
    return h("p", { "class": "mat-counts" },
      h("span", null, h("span", { "class": "num", text: fmt(x.tests) }), " " + T(x.tests === 1 ? "test" : "tests")),
      h("span", null, h("span", { "class": "num", text: fmt(x.pages) }), " " + T(x.pages === 1 ? "cited page" : "cited pages")),
      h("span", null, h("span", { "class": "num", text: fmt(x.figs) }), " " + T(x.figs === 1 ? "figure" : "figures")));
  }
  function card(x) {
    var m = x.m, img = image(m);
    return h("li", { "class": "mat-card" + (x.full ? " mat-card-full" : ""), "data-name": m.name },
      media(m, img),
      img ? h("p", { "class": "mat-credit" }, T("Image: "), h("a", { href: img.url, target: "_blank", rel: "noopener", lang: "en", text: img.short })) : h("p", { "class": "mat-credit" }, " "),
      h("div", { "class": "mat-card-body" },
        h("h2", { "class": "mat-card-name" }, h("a", { "class": "mat-card-link", href: href(m), text: T(m.name) })),
        x.full ? h("p", { "class": "mat-card-flag" }, A.tag("full", T("All three answers"))) : null,
        strip(m), counts(x)));
  }
  function listTable() {
    var table = h("table", { "class": "mat-table" },
      h("thead", null, h("tr", null, [T("Material"), T("Burn tests"), T("Oxygen tested (%)"), T("Smoke runs"), T("Smoke particle size (nm)"), T("Detector response (V)"), T("Pages and figures")].map(function (t, k) { return h("th", { scope: "col", "class": k ? "mat-r" : null, text: t }); }))),
      h("tbody", null, D.materials.map(function (m) {
        var docs = pagesOf(m).length + figuresOf(m).length;
        var meter = function (v, max, unit) { return v === null || v === undefined ? nodata() : h("span", { "class": "mat-meter" }, h("span", { "class": "num", text: v + " " + unit }), rail(0, pct(v, max))); };
        return h("tr", null,
          h("th", { scope: "row" }, h("a", { href: href(m), text: T(m.name) }), h("span", { "class": "mat-sub", text: C.materials[m.name] })),
          h("td", { "class": "num" }, m.burn.tests ? fmt(m.burn.tests) : nodata()),
          h("td", { "class": "num", text: m.burn.o2 ? (m.burn.o2[0] === m.burn.o2[1] ? String(m.burn.o2[0]) : m.burn.o2[0] + T(" to ") + m.burn.o2[1]) : "" }),
          h("td", { "class": "num" }, m.smoke.runs ? fmt(m.smoke.runs) : nodata()),
          h("td", { "class": "num" }, meter(m.smoke.medianDiameterNm, maxD, "nm")),
          h("td", { "class": "num" }, meter(m.smoke.detectorMedianV, maxV, "V")),
          h("td", { "class": "num" }, docs ? h("a", { href: href(m), text: String(docs) }) : nodata()));
      })));
    return apa("table", 1, T("What is known about each solid material in PSI"), table,
      T("Burn tests and oxygen come from the experimental tables of PSI. Particle size is the median count mean diameter of the SAME-R runs. Detector response is the median change in the obscuration signal of the Station smoke detector in SAME-R; it is a coarse summary that ranks materials and does not give an alarm threshold. Pages and figures counts the cited report pages and figures that speak of the material."));
  }
  function seg(label, options, current, pick) {
    return h("div", { "class": "mat-tool" }, h("span", { "class": "mat-tool-label", id: "mat-l-" + label.replace(/\W/g, "") , text: T(label) }),
      h("div", { "class": "mat-seg", role: "group", "aria-labelledby": "mat-l-" + label.replace(/\W/g, "") }, options.map(function (o) {
        return h("button", { type: "button", "class": "mat-seg-btn", "data-value": o[0], "aria-pressed": String(o[0] === current), text: T(o[1]),
          onclick: function () { pick(o[0]); } });
      })));
  }
  function listView(parts) {
    document.title = T("Materials · One Fire, Many Worlds");
    var view = VIEWS.indexOf(parts[0]) >= 0 ? parts[0] : "gallery";
    var sort = SORTS.some(function (s) { return s[0] === parts[1]; }) ? parts[1] : "repo";
    var body = h("div", { "class": "mat-listbody", "aria-live": "polite" });
    var tools = h("div", { "class": "mat-tools" });
    function draw(focusValue) {
      fill(tools, 
        seg("View", [["gallery", "Gallery"], ["table", "Table"]], view, function (v) { view = v; draw(v); }),
        view === "gallery" ? seg("Sort by", SORTS, sort, function (v) { sort = v; draw(v); }) : null);
      fill(body, view === "gallery"
        ? h("ul", { "class": "mat-grid", "aria-label": T("Material passport") }, sorted(sort).map(card))
        : listTable());
      var hash = listHash(view, sort);
      if (location.hash !== hash && !(hash === "#/materials" && /^#\/materials\/?$/.test(location.hash))) history.replaceState(null, "", hash);
      store("mat-list", hash);
      if (focusValue) { var b = tools.querySelector('[data-value="' + focusValue + '"]'); if (b) b.focus(); }
    }
    draw();
    /* Leaving for a passport: remember where the list was, so coming back puts it where it was. */
    body.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href^='#/material/']");
      if (a) store("mat-return", { hash: listHash(view, sort), y: window.scrollY, href: a.getAttribute("href") });
    });
    var full = INFO.filter(function (x) { return x.full; });
    A.main.replaceChildren(h("div", { "class": "wrap mat-page" },
      A.intro(T("Material passport"), T("For each solid material in NASA's repository: was it burned, what smoke does it make, and does the Station detector see that smoke?") + " " +
        (full.length === 1 ? T("Only ") + T(full[0].m.name).toLowerCase() + T(" has all three answers.") : full.length + T(" materials have all three answers."))),
      tools, body));
    var back = recall("mat-return");
    if (back && back.hash === listHash(view, sort)) {
      store("mat-return", null);
      window.scrollTo(0, back.y);
      var link = A.main.querySelector('a[href="' + back.href + '"]');
      if (link) link.focus({ preventScroll: true });
    }
  }

  /* ---------- passport ---------- */
  function docLabel(e) { return e.doc[L] + ", " + (e.page ? T("p. ") + e.page : T("Pages ") + e.pageLabel); }
  function figName(f) {
    var slide = /^slide\s+(\S+)/i.exec(String(f.number || ""));
    if (slide) return T("Slide ") + slide[1];
    if (!f.number || /^photo$/i.test(f.number)) return T("Photo");
    return T("Figure ") + f.number;
  }
  function section(id, title, content) {
    return h("section", { "class": "mat-sec", id: id, "aria-labelledby": id + "-h" }, h("h2", { id: id + "-h", tabindex: "-1", text: title }), content);
  }
  function answers(m) {
    var top = m.burn.o2 ? m.burn.o2[1] : null;
    function block(title, big, unit, bar, detail) {
      return h("section", { "class": "mat-answer" }, h("h3", { text: title }),
        big === null ? h("p", { "class": "mat-big mat-big-missing", text: T("No data") })
          : h("p", { "class": "mat-big" }, h("span", { "class": "num", text: big }), h("span", { "class": "mat-big-unit", text: unit })),
        big === null ? null : rail(0, bar),
        h("div", { "class": "mat-detail" }, detail));
    }
    var burn = m.burn.tests ? [
      h("p", { "class": "mat-known" }, h("strong", { text: plural(m.burn.tests, "burn test") }), T(" at ") + range(m.burn.o2, T("% oxygen")) + (m.burn.flow ? T(" and airflow of ") + range(m.burn.flow, "cm/s") : "") + "."),
      outcomes(m.burn.outcomes) ? h("p", { "class": "mat-known", text: T("Recorded endings: ") + outcomes(m.burn.outcomes) + "." }) : h("p", { "class": "mat-known", text: T("Results are free-text observations; no ending is classified in the data.") }),
      top !== null ? h("p", { "class": "mat-known", text: T("In PSI it was never tested above ") + top + T(" % oxygen: PSI holds nothing about it in Moon-base air.") }) : null,
      outsideNote(m)
    ] : [h("p", { "class": "mat-known", text: T("No burn test in the repository.") }), outsideNote(m)];
    var smoke = m.smoke.runs ? [
      h("p", { "class": "mat-known" }, h("strong", { text: plural(m.smoke.runs, "smoke run") }), ", " + m.smoke.withSize + T(" with particle size in SAME-R."))
    ] : h("p", { "class": "mat-known", text: T("No smoke measurement in the repository.") });
    var det = m.smoke.detectorMedianV !== null ? [
      h("p", { "class": "mat-known", text: T("From ") + m.smoke.detectorRuns + T(" SAME-R runs. The Station detector measures scattered light and responds best to particles larger than one micrometer, so finer smoke gives a weaker signal.") })
    ] : h("p", { "class": "mat-known", text: T("No detector data in the repository.") });
    return [h("div", { "class": "mat-answers" },
        block(T("Does it burn?"), m.burn.tests ? fmt(m.burn.tests) : null, T(m.burn.tests === 1 ? "burn test" : "burn tests"), pct(m.burn.tests, maxB), burn),
        block(T("What smoke does it make?"), m.smoke.medianDiameterNm !== null ? String(m.smoke.medianDiameterNm) : null, "nm", pct(m.smoke.medianDiameterNm, maxD),
          [m.smoke.medianDiameterNm !== null ? h("p", { "class": "mat-known", text: T("Median particle diameter: ") + m.smoke.medianDiameterNm + " nm" }) : null, smoke]),
        block(T("Does the detector see it?"), m.smoke.detectorMedianV !== null ? String(m.smoke.detectorMedianV) : null, "V", pct(m.smoke.detectorMedianV, maxV),
          [m.smoke.detectorMedianV !== null ? h("p", { "class": "mat-known", text: T("Median change in the Station detector signal: ") + m.smoke.detectorMedianV + " V" }) : null, det])),
      h("p", { "class": "mat-note", text: T("Bars compare each value with the highest of the ten materials.") })];
  }
  function documents(m) {
    var list = pagesOf(m);
    if (!list.length) return A.state("empty", T("No cited page of a report speaks of this material yet."));
    var SHOW = 4;
    return [h("p", { "class": "mat-lead", text: T("Each page opens in place, with the passage marked. Grouped by where the evidence comes from.") }),
      GROUPS.map(function (g) {
        /* PSI first: within a group, pages of PSI documents come before documents from outside PSI. */
        var mine = list.filter(function (e) { return g.has.indexOf(origin(e)) >= 0; });
        mine = mine.filter(function (e) { return e.docInv; }).concat(mine.filter(function (e) { return !e.docInv; }));
        if (!mine.length) return null;
        var items = mine.map(function (e, k) {
          var o = origin(e);
          return h("li", { "class": "mat-doc", hidden: k >= SHOW ? "" : null },
            h("a", { "class": "mat-doc-thumb", href: "#/source/" + e.id, tabindex: "-1", "aria-hidden": "true" },
              e.img ? h("img", { src: e.img, alt: "", loading: "lazy", width: e.w, height: e.h }) : h("span", { "class": "mat-doc-noimg", text: T("p. ") + (e.page || e.pageLabel || "") })),
            h("div", { "class": "mat-doc-text" },
              h("a", { "class": "mat-doc-link", href: "#/source/" + e.id, text: docLabel(e) }),
              h("p", { "class": "mat-doc-claim", text: e.claim[L] }),
              h("p", { "class": "mat-doc-tags" }, TAG[o] ? A.tag(o === "planned" ? "planned" : "ground", TAG[o]) : null,
                !e.docInv ? A.tag("outside", T("document outside PSI")) : null)));
        });
        var ul = h("ul", { "class": "mat-docs" }, items), more = null;
        if (mine.length > SHOW) {
          more = h("button", { type: "button", "class": "c-btn mat-more", "aria-expanded": "false", text: T("Show all ") + mine.length,
            onclick: function () {
              var open = more.getAttribute("aria-expanded") === "true";
              items.forEach(function (li, k) { if (k >= SHOW) { if (open) li.setAttribute("hidden", ""); else li.removeAttribute("hidden"); } });
              more.setAttribute("aria-expanded", String(!open));
              more.textContent = open ? T("Show all ") + mine.length : T("Show fewer");
              if (!open && items[SHOW]) items[SHOW].querySelector(".mat-doc-link").focus();
            } });
        }
        return h("section", { "class": "mat-group mat-group-" + g.id },
          h("div", { "class": "mat-group-head" }, h("h3", null, g.label, " ", h("span", { "class": "num mat-group-n", text: "(" + mine.length + ")" })), A.tag(g.tag[0], g.tag[1])),
          h("p", { "class": "mat-note", text: g.note }), ul, more);
      })];
  }
  /* The enlarged figure: a modal dialog with the image, its caption as written, its credit and its source;
     Previous and Next, Close and Escape. Focus stays inside and goes back to the thumbnail on closing. */
  function lightbox(list) {
    var at = 0, opener = null;
    var img = h("img", { "class": "mat-lb-img", alt: "" });
    var count = h("p", { "class": "mat-lb-count", "aria-live": "polite" });
    var title = h("p", { "class": "mat-lb-title", id: "mat-lb-title" });
    var cap = h("p", { "class": "mat-lb-cap", lang: "en" });
    var credit = h("p", { "class": "mat-lb-credit" });
    var links = h("p", { "class": "mat-lb-links" });
    var prev = h("button", { type: "button", "class": "c-btn", text: T("Previous"), onclick: function () { show(at - 1); } });
    var next = h("button", { type: "button", "class": "c-btn", text: T("Next"), onclick: function () { show(at + 1); } });
    var close = h("button", { type: "button", "class": "c-btn mat-lb-close", text: T("Close"), onclick: function () { dlg.close(); } });
    var dlg = h("dialog", { "class": "mat-lb", "aria-labelledby": "mat-lb-title" },
      h("div", { "class": "mat-lb-bar" }, count, close),
      h("div", { "class": "mat-lb-stage" }, img),
      h("div", { "class": "mat-lb-text" }, title, cap, credit, links),
      h("div", { "class": "mat-lb-nav" }, prev, next));
    function show(i) {
      at = (i + list.length) % list.length;
      var f = list[at];
      img.src = f.img; img.width = f.w; img.height = f.h;
      img.alt = figName(f) + (f.page ? ", " + T("p. ") + f.page : "");
      count.textContent = (at + 1) + T(" of ") + list.length;
      fill(title, figName(f) + (f.page ? ", " + T("p. ") + f.page : ""), " ",
        GROUND_TAG[origin(f)] ? A.tag("ground", GROUND_TAG[origin(f)]) : null, " ", f.team ? A.tag("team", T("team image")) : null);
      cap.textContent = f.caption;
      fill(credit, h("strong", { text: T("Source") + ": " }), h("span", { lang: "en", text: f.doc.en }),
        f.credit ? [h("br"), h("strong", { text: T("Credit: ") }), h("span", { lang: "en", text: f.credit })] : null);
      fill(links, h("a", { href: "#/figure/" + f.id, onclick: function () { dlg.close(); }, text: T("Open the figure and its source") }));
      prev.disabled = next.disabled = list.length < 2;
    }
    dlg.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); show(at - 1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); show(at + 1); }
      else if (e.key === "Tab") {                     /* keep the focus inside: from the last control back to the first, and the reverse */
        var f = [].slice.call(dlg.querySelectorAll("button:not([disabled]), a[href]"));
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && (document.activeElement === first || !dlg.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && (document.activeElement === last || !dlg.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
      }
    });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });     /* a click on the dark backdrop closes */
    dlg.addEventListener("close", function () { if (opener && document.contains(opener)) opener.focus(); });
    return { el: dlg, open: function (i, from) { opener = from; show(i); if (!dlg.open) dlg.showModal(); close.focus(); } };
  }
  var GROUND_TAG = { ground: T("ground test"), partial: T("partial gravity"), standard: T("standard"), history: T("memo, history"), planned: T("planned") };
  function figures(m, num) {
    var all = figuresOf(m), reports = all.filter(function (f) { return !f.team; }), team = all.filter(function (f) { return f.team; });
    if (!all.length) return null;
    var list = reports.concat(team), lb = lightbox(list);
    function thumbs(items, offset) {
      return h("ul", { "class": "mat-thumbs" }, items.map(function (f, k) {
        var o = origin(f);
        return h("li", null, h("button", { type: "button", "class": "mat-thumb", "aria-haspopup": "dialog",
          onclick: function (e) { lb.open(offset + k, e.currentTarget); } },
          h("span", { "class": "mat-thumb-img" }, h("img", { src: f.img, alt: "", loading: "lazy", width: f.w, height: f.h })),
          h("span", { "class": "mat-thumb-t", text: figName(f) + (f.page ? ", " + T("p. ") + f.page : "") }),
          GROUND_TAG[o] || f.team ? h("span", { "class": "mat-thumb-tags" }, GROUND_TAG[o] ? A.tag("ground", GROUND_TAG[o]) : null, f.team ? A.tag("team", T("team image")) : null) : null,
          h("span", { "class": "mat-thumb-c", lang: "en", text: f.caption })));
      }));
    }
    var group = function (title, items, offset) {
      return items.length ? h("div", { "class": "mat-figgroup" }, h("h3", null, title, " ", h("span", { "class": "num mat-group-n", text: "(" + items.length + ")" })), thumbs(items, offset)) : null;
    };
    return [apa("figure", num.figure(), T("Figures and images that speak of this material"),
      h("div", null, group(T("From the reports"), reports, 0), group(T("Gathered by the team"), team, reports.length)),
      [T("Open a figure to see it large, with its caption, its credit and its source.") + " ",
        reports.length ? T("Cut from NASA's reports; each opens with its caption as written, its page and its source. Ground tests are marked.") + " " : "",
        team.length ? T("Images the team gathered, each with its credit and its license. Ground tests are marked.") : ""]), lb.el];
  }
  function gravityTable(gp, n) {
    var zero = function (v) { return /^~ 0/.test(v); };
    return apa("table", n, T("The same samples burned in orbit and on the ground (Saffire-II)"),
      h("table", { "class": "mat-table" },
        h("thead", null, h("tr", null, [T("Sample"), T("Material"), T("Thickness"), T("Burned in microgravity"), T("Burned in normal gravity")].map(function (t) { return h("th", { scope: "col", text: t }); }))),
        h("tbody", null, gp.map(function (g) {
          return h("tr", null, h("th", { scope: "row", text: g.sample }), h("td", { text: g.material }), h("td", { text: g.thickness }),
            h("td", { "class": zero(g.microBurn) ? "mat-noburn" : null, text: g.microBurn }), h("td", { "class": zero(g.normalBurn) ? "mat-noburn" : null, text: g.normalBurn }));
        }))),
      T("Source: PSI-99 (Saffire-II) experimental table. Lengths as written in the table; \"Complete\" means the whole sample burned."));
  }
  /* The same columns and note as every table of tests on the site (investigations.js), drawn with this view's classes. */
  function testsTable(list, n, title) {
    var burner = list.some(function (t) { return t.ref === "burner"; });
    var table = h("table", { "class": "mat-table mat-tests" },
      h("thead", null, h("tr", null, [T("Test"), T("Fuel or material"), T("Oxygen (%)"), T("Pressure (psi)"), T("Airflow (cm/s)"), T("Result"), T("Source table and row")].map(function (t, k) { return h("th", { scope: "col", "class": k >= 2 && k <= 4 ? "mat-r" : null, text: t }); }))),
      h("tbody", null, list.map(function (t) {
        return h("tr", null, h("th", { scope: "row" }, h("a", { href: "#/data/" + t.inv + "/n" + t.n, text: t.acr + " " + (t.id || "#" + t.n) })),
          h("td", { lang: "en", text: t.fuel }),
          h("td", { "class": "num", text: t.o2 === null ? "" : t.o2 + (t.ref === "burner" ? " *" : "") }),
          h("td", { "class": "num", text: t.p === null ? "" : String(t.p) }),
          h("td", { "class": "num", text: t.flow === null ? "" : String(t.flow) }),
          h("td", { lang: "en", text: t.res.length > 170 ? t.res.slice(0, 170) + " ..." : t.res }),
          h("td", { text: String(t.src).replace(/^PSI-\d+_Experimental table_/, "").replace(/\.csv$/, "") + " · " + t.row }));
      })));
    return apa("table", n, title, table, [T("Data from the experimental tables of NASA's PSI repository, downloaded November 13, 2026. Each test opens in Data; the last column gives the table and the row it comes from. Oxygen is that of the chamber atmosphere. An empty cell means the table does not record that value. The result is quoted in English, as in the table."),
      burner ? " " + T("* Oxygen of the gas leaving the burner, not of the atmosphere.") : ""]);
  }
  function gaps(m) {
    var out = [], top = m.burn.o2 ? m.burn.o2[1] : null;
    if (OUTSIDE[m.name] && OUTSIDE[m.name].saffire) out.push(T("Open the data in Moon-base air: Saffire VI burned it near that air in 2023, outside PSI, but its test-by-test data is not public in PSI, and neither PSI nor Saffire VI burned it at 34 % oxygen and 8.2 psi."));
    else if (OUTSIDE[m.name]) out.push(T("Burn it in flight in Moon-base air: PSI has no test of it there, and the limits outside PSI come from ground, centrifuge and drop-tower tests."));
    else if (!m.burn.tests) out.push(T("Burn it: there is no burn test of this material in the repository."));
    else if (top !== null && top < MOON_O2) out.push(T("Burn it in Moon-base air: in PSI it was tested up to ") + top + T(" % oxygen, and a Moon base is expected at 30 % or more."));
    if (!m.smoke.runs) out.push(T("Measure its smoke: there is no smoke run of this material in the repository."));
    else {
      if (m.smoke.detectorMedianV === null) out.push(T("Test the Station detector with its smoke: its smoke was measured, but no detector response is recorded."));
      out.push(T("Measure its smoke in exploration atmospheres: the smoke runs do not record oxygen or pressure."));
    }
    out.push(T("Burn it in lunar or Martian gravity: PSI has no partial-gravity combustion data."));
    return [h("ol", { "class": "mat-gaps" }, out.map(function (t) { return h("li", { text: t }); })),
      h("p", { "class": "mat-note", text: T("Read from the data above. Which gap matters most is the team's interpretation.") })];
  }
  function hero(m, img, num) {
    if (!img) return h("figure", { "class": "mat-hero" }, media(m, null, "mat-media-hero"),
      h("figcaption", { "class": "c-fig-note", text: T("No image from NASA shows this material in its experiment. The searches are listed in the image manifest of the site.") }));
    var n = num.figure();
    return h("figure", { "class": "mat-hero" },
      h("figcaption", { "class": "mat-hero-cap" }, h("span", { "class": "c-fig-num", text: T("Figure ") + n }),
        h("span", { "class": "c-fig-title", lang: "en", text: img.title })),
      media(m, img, "mat-media-hero"),
      h("p", { "class": "c-fig-note" }, h("em", { text: T("Note. ") }), T(img.shows) + " ",
        h("span", null, T("Credit: "), h("span", { lang: "en", text: img.credit + (img.date && !img.figId ? ", " + img.date : "") }), ". "),
        h("a", { href: img.url, target: "_blank", rel: "noopener", text: img.figId ? T("Source") : T("Image page at NASA") }),
        img.figId ? [". ", h("a", { href: "#/figure/" + img.figId, text: T("Open the figure and its source") })] : null, "."));
  }
  function toc(entries) {
    var nav = h("nav", { "class": "mat-toc", "aria-label": T("On this page") },
      h("p", { "class": "mat-toc-title", text: T("On this page") }),
      h("ul", null, entries.map(function (e) {
        return h("li", null, h("button", { type: "button", "class": "mat-toc-btn", "data-target": e[0], text: e[1],
          onclick: function () {
            var head = document.getElementById(e[0] + "-h");
            if (!head) return;
            head.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
            head.focus({ preventScroll: true });
            mark(e[0]);
          } }));
      })));
    function mark(id) {
      nav.querySelectorAll(".mat-toc-btn").forEach(function (b) { if (b.getAttribute("data-target") === id) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current"); });
    }
    nav.mark = mark;
    return nav;
  }

  function passportView(parts) {
    var name = decodeURIComponent(parts.join("/") || "");
    var k = -1;
    D.materials.forEach(function (x, i) { if (x.name === name) k = i; });
    var m = D.materials[k], list = recall("mat-list") || "#/materials";
    if (!m) {
      document.title = T("No such material") + " · One Fire, Many Worlds";
      A.main.replaceChildren(h("div", { "class": "wrap mat-page" }, h("div", { "class": "mat-backrow" }, A.back(list, T("All materials"))),
        A.intro(T("No such material")),
        A.state("empty", T("No such material"), T("There is no material called ") + (name || "that") + ".", h("a", { "class": "c-btn", href: "#/materials", text: T("See all materials") }))));
      return;
    }
    document.title = T(m.name) + " · One Fire, Many Worlds";
    var x = INFO[k], img = image(m), gp = pairs(m), tests = D.tests.filter(function (t) { return t.family === m.name; }), num = A.counter();
    var invs = Object.keys(m.byInv);
    var heroFig = hero(m, img, num);
    var secs = [["mat-answers", T("The three answers")], ["mat-docs", T("What the documents say")]];
    var figs = figures(m, num);
    if (figs) secs.push(["mat-figs", T("Figures and images")]);
    if (gp.length) secs.push(["mat-pairs", T("In orbit and on the ground")]);
    secs.push(["mat-tests", T("Its tests")], ["mat-gaps", T("What is still to be tested")]);
    var nav = toc(secs);
    var prevM = D.materials[k - 1], nextM = D.materials[k + 1];

    A.main.replaceChildren(h("div", { "class": "wrap mat-page mat-passport" },
      h("div", { "class": "mat-backrow" }, A.back(list, T("All materials"))),
      h("div", { "class": "mat-head" },
        h("div", { "class": "mat-head-media" }, heroFig),
        h("div", { "class": "mat-head-text" },
          A.intro(T(m.name), C.materials[m.name]),
          h("dl", { "class": "mat-stats" },
            h("div", null, h("dt", { text: T("Tests") }), h("dd", { "class": "num", text: fmt(tests.length) })),
            h("div", null, h("dt", { text: T("Pages") }), h("dd", { "class": "num", text: fmt(x.pages) })),
            h("div", null, h("dt", { text: T("Figures") }), h("dd", { "class": "num", text: fmt(x.figs) })),
            h("div", null, h("dt", { text: T("Investigations") }), h("dd", { "class": "num", text: fmt(invs.length) }))))),
      h("div", { "class": "mat-layout" },
        nav,
        h("div", { "class": "mat-body" },
          section("mat-answers", T("The three answers"), answers(m)),
          section("mat-docs", T("What the documents say"), documents(m)),
          figs ? section("mat-figs", T("Figures and images"), figs) : null,
          gp.length ? section("mat-pairs", T("In orbit and on the ground"), gravityTable(gp, num.table())) : null,
          section("mat-tests", T("Its tests"), [
            h("p", { "class": "mat-invs" }, invs.map(function (acr) {
              var i = D.investigations.filter(function (z) { return z.acr === acr; })[0];
              return h("span", null, i ? A.invLink(i) : acr, " ", h("span", { "class": "mat-invs-n", text: "(" + plural(m.byInv[acr], "test") + ")" }));
            })),
            tests.length ? [testsTable(tests.slice(0, 10), num.table(), T("First ") + Math.min(10, tests.length) + T(" of ") + fmt(tests.length) + T(" tests of ") + T(m.name)),
              h("p", { "class": "mat-more-row" }, h("a", { "class": "c-btn", href: "#/data/material/" + encodeURIComponent(m.name), text: T("See all its tests in Data") }))]
              : A.state("empty", T("No data"))]),
          section("mat-gaps", T("What is still to be tested"), gaps(m)),
          h("nav", { "class": "mat-pager", "aria-label": T("Materials") },
            prevM ? h("a", { "class": "mat-pager-a mat-pager-prev", href: href(prevM) }, h("span", { "class": "mat-pager-l", text: T("Previous material") }), h("span", { "class": "mat-pager-n", text: T(prevM.name) })) : h("span"),
            nextM ? h("a", { "class": "mat-pager-a mat-pager-next", href: href(nextM) }, h("span", { "class": "mat-pager-l", text: T("Next material") }), h("span", { "class": "mat-pager-n", text: T(nextM.name) })) : h("span"))))));

    /* The index marks the section being read. */
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) { if (en.isIntersecting) nav.mark(en.target.id); });
      }, { rootMargin: "-30% 0px -60% 0px" });
      A.main.querySelectorAll(".mat-sec").forEach(function (s) { io.observe(s); });
      window.addEventListener("hashchange", function stop() { io.disconnect(); window.removeEventListener("hashchange", stop); });
    }
  }

  A.section({ id: "materials", label: T("Materials"), href: "#/materials" }, listView);
  A.route("material", "materials", passportView);
})();
