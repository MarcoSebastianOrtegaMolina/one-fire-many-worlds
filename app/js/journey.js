/* The journey of worlds: the home page (the five worlds in 3D over the gravity line, 0 g to 1 g), the view of one
   world (#/world/<id>) and a model at full screen (#/world/<id>/full). The 3D comes from js/stage.js
   (window.OFMW_STAGE), which arrives after this script or not at all; everything here works without it.
   One element per world carries its scene and moves between the home path, the world view and the full-screen
   layer, so a model downloads once and the move is a CSS transition (FLIP) the 3D follows. */
(function () {
  "use strict";
  var A = window.OFMW_APP;
  if (!A) return;
  var h = A.h, T = A.T, D = A.D, C = A.C;

  A.es({
    "Fire safety for every world where people will live": "Seguridad contra incendios para cada mundo donde vivirá la gente",
    "Built for the 2026 NASA Space Apps challenge Flame in Freefall. It sorts and interprets {tests} tests from {inv} combustion investigations in NASA's PSI repository, front by front: prevent, detect, suppress.":
      "Hecho para el reto Flame in Freefall del NASA Space Apps 2026. Ordena e interpreta {tests} pruebas de {inv} investigaciones de combustión del repositorio PSI de NASA, frente por frente: prevenir, detectar, apagar.",
    "No solid with data in PSI was tested above {o2} oxygen. A Moon base is expected at {moon} or more.":
      "Ningún sólido con datos en PSI se probó con más de {o2} de oxígeno. Para una base lunar se esperan {moon} o más.",
    "See the evidence": "Ver la evidencia",
    "Choose a world to see what is known there.": "Elige un mundo para ver qué se sabe ahí.",
    "All worlds": "Todos los mundos",
    "Full screen": "Pantalla completa",
    "Not to scale": "Sin escala",
    "Loading model": "Cargando modelo",
    "This model did not load": "Este modelo no cargó",
    "Loading full detail": "Cargando el detalle completo",
    "Loading full detail, {size}": "Cargando el detalle completo, {size}",
    "Drag to rotate, scroll or pinch to zoom, double-click to reset": "Arrastra para girar, rueda o pellizca para acercar, doble clic para volver al inicio",
    "Drag to rotate. Click or tap the model to open it at full screen.": "Arrastra para girar. Haz clic o toca el modelo para abrirlo en pantalla completa.",
    "3D model: the International Space Station turning, with a capsule in orbit around it": "Modelo 3D: la Estación Espacial Internacional girando, con una cápsula en órbita a su alrededor",
    "3D model: the International Space Station turning": "Modelo 3D: la Estación Espacial Internacional girando",
    "3D model: the Moon turning with a pressurized rover on it": "Modelo 3D: la Luna girando con un róver presurizado encima",
    "3D model: the Moon turning with a habitat module on it": "Modelo 3D: la Luna girando con un módulo habitable encima",
    "3D model: the Moon turning": "Modelo 3D: la Luna girando",
    "3D model: Mars turning, with a habitat module on its surface": "Modelo 3D: Marte girando, con un módulo habitable en su superficie",
    "3D model: Mars turning": "Modelo 3D: Marte girando",
    "3D model: the Earth turning, with the Moon in orbit": "Modelo 3D: la Tierra girando, con la Luna en órbita",
    "3D model: the Earth turning": "Modelo 3D: la Tierra girando",
    "3D model: a spacesuit floating toward the airlock hatch of the Space Station": "Modelo 3D: un traje espacial flotando hacia la escotilla de la esclusa de la Estación Espacial",
    "3D model: an astronaut floating toward the airlock hatch of the Space Station": "Modelo 3D: un astronauta flotando hacia la escotilla de la esclusa de la Estación Espacial",
    "3D model: a spacesuit turning": "Modelo 3D: un traje espacial girando",
    "3D model: the airlock hatch of the Space Station": "Modelo 3D: la escotilla de la esclusa de la Estación Espacial"
  });

  var AXIS = ["station", "moon", "mars", "earth"], ALL = AXIS.concat(["suit"]);
  var GRAV = { station: "0 g", moon: "1/6 g", mars: "3/8 g", earth: "1 g" };
  /* Download order on the home page: the Station is by far the heaviest, so it comes last and shows its fixed image meanwhile. */
  var PRIORITY = { moon: 0, mars: 1, earth: 2, suit: 3, station: 4 };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var STAGE = null, noStage = false;
  var scenes = {}, home = null, homeScroll = 0, cur = { mode: "none", id: null, wv: null }, fs = null, pushFull = false;

  /* ---------- small helpers ---------- */
  function fill(template, map) {   /* "text {key} text" -> nodes, with each {key} replaced by map[key] */
    return T(template).split(/(\{\w+\})/).map(function (part) {
      var m = /^\{(\w+)\}$/.exec(part);
      return m && map[m[1]] !== undefined ? map[m[1]] : part;
    }).filter(function (x) { return x !== ""; });
  }
  function size(b) { return b < 1e6 ? Math.round(b / 1e3) + " KB" : (b / 1e6).toFixed(1) + " MB"; }
  function pos(g) { return (A.axisX(g) - 3) / 94 * 100; }   /* axisX gives 3 to 97 %; the path spans 0 to 100 % */
  function label(id, info) {
    var p = info && info.parts ? info.parts.map(function (x) { return x.id; }) : null, two = p && p.length > 1;
    switch (id) {
      case "station": return T(two ? "3D model: the International Space Station turning, with a capsule in orbit around it" : "3D model: the International Space Station turning");
      case "moon": return T(!p || p.indexOf("rover") >= 0 ? "3D model: the Moon turning with a pressurized rover on it" : two ? "3D model: the Moon turning with a habitat module on it" : "3D model: the Moon turning");
      case "mars": return T(!p || two ? "3D model: Mars turning, with a habitat module on its surface" : "3D model: Mars turning");
      case "earth": return T(!p || two ? "3D model: the Earth turning, with the Moon in orbit" : "3D model: the Earth turning");
      default:
        if (p && p.indexOf("hatch") < 0) return T("3D model: a spacesuit turning");
        if (p && !two) return T("3D model: the airlock hatch of the Space Station");
        return T(p && p.indexOf("astronaut") >= 0 ? "3D model: an astronaut floating toward the airlock hatch of the Space Station" : "3D model: a spacesuit floating toward the airlock hatch of the Space Station");
    }
  }

  /* ---------- one scene element per world ---------- */
  function scene(id) {
    if (scenes[id]) return scenes[id];
    var s = { id: id, handle: null, state: "loading", info: null, progress: null };
    s.retry = h("button", { type: "button", "class": "c-btn", onclick: function (e) { e.preventDefault(); e.stopPropagation(); if (s.handle) s.handle.retry(); } }, T("Try again"));
    s.fail = h("div", { "class": "jr-fail" }, h("p", { text: T("This model did not load") }), s.retry);
    s.el = h("div", { "class": "jr-scene", role: "img", "aria-label": label(id, null), "data-scene": id, "data-state": "loading" },
      h("span", { "class": "jr-wait", text: T("Loading model") }), s.fail);
    s.el.addEventListener("keydown", function (e) {   /* (L2) the help says the model opens: by keyboard too */
      if ((e.key === "Enter" || e.key === " ") && !fs && cur.mode === "world" && cur.id === s.id && e.target === s.el) { e.preventDefault(); openFrom(s.el); }
    });
    scenes[id] = s;
    attach(s);
    return s;
  }
  function attach(s) {
    if (s.handle) return;
    if (noStage) { stillOnly(s); return; }
    if (!STAGE) return;
    s.handle = STAGE.mount(s.el, s.id, { priority: PRIORITY[s.id], tier: tierFor(s), placeholder: s.id === "station" && tierFor(s) === "path" });
    s.handle.onState(function (state, info) {
      s.state = state; s.info = info;
      s.el.setAttribute("aria-label", label(s.id, info));
      paint(s);
    });
    s.handle.onProgress(function (p) { if (p.tier === "full") { s.progress = p; if (fs && fs.s === s) fullProgress(); } });
    mode(s);
  }
  function stillOnly(s) {   /* no stage at all: the fixed image of the scene */
    if (s.el.querySelector(".jr-still")) return;
    s.el.insertBefore(h("img", { "class": "jr-still", alt: "", src: "img/scenes/" + s.id + ".jpg" }), s.el.firstChild);
    s.state = "still"; s.el.setAttribute("data-state", "still");
  }
  /* The "Try again" button cannot live inside a link: on the home path the card itself leads to the world view. */
  function paint(s) {
    s.retry.hidden = !!s.el.closest("a");
    if (cur.mode === "world" && cur.id === s.id && cur.wv) caption(cur.wv.cap, s);
    if (fs && fs.s === s) { caption(fs.cap, s); fullProgress(); capRoom(); }
  }
  function tierFor(s) {   /* path on the home page, lite in the world view, full at full screen */
    return fs && fs.s === s ? "full" : cur.mode === "world" && cur.id === s.id ? "lite" : "path";
  }
  function mode(s) {
    if (!s || !s.handle) return;
    var here = cur.mode === "world" && cur.id === s.id;
    s.handle.setTier(tierFor(s));
    if (fs && fs.s === s) s.handle.setInteractive(true, { zoom: true, touch: "none", onTap: null });
    else if (here) s.handle.setInteractive(true, { zoom: false, touch: "pan-y", onTap: function () { openFrom(s.el); } });
    else s.handle.setInteractive(false);
    if (here || (fs && fs.s === s)) s.el.setAttribute("tabindex", "0"); else s.el.removeAttribute("tabindex");
  }
  function caption(box, s) {
    var info = s.info;
    if (!box) return;
    /* Rebuilt only when it changes: a link in focus is never taken out from under the reader (Firefox dropped the
       focus to the page when the full detail arrived); if it must change, the focus goes to the new first link. */
    var key = !info || !info.parts.length ? "" : JSON.stringify([document.documentElement.lang, !!info.notToScale,
      info.parts.map(function (p) { return [p.name, p.credit, p.page]; })]);
    if (box.getAttribute("data-k") === key) return;
    var had = box.contains(document.activeElement);
    box.setAttribute("data-k", key);
    if (!key) { box.replaceChildren(); return; }
    setTimeout(function () { if (had && box.isConnected) { var a = box.querySelector("a"); if (a) a.focus({ preventScroll: true }); } }, 0);
    box.replaceChildren.apply(box, info.parts.map(function (p) {
      return h("p", null, T("Model: "), h("b", { text: p.name }), ". ", p.credit ? T("Credit: ") + p.credit + ". " : "",
        T("Used for education; it does not imply endorsement by NASA. "),
        p.page ? h("a", { href: p.page, target: "_blank", rel: "noopener", text: T("Open the model at NASA") }) : null, p.page ? "." : "");
    }).concat(info.notToScale ? [h("p", { "class": "jr-scale", text: T("Not to scale") })] : []));
  }
  function onStage(api) {
    if (STAGE) return;
    STAGE = api || window.OFMW_STAGE;
    if (!STAGE) return;
    ALL.forEach(function (id) { if (scenes[id]) attach(scenes[id]); });
    STAGE.setStars(false);
    if (cur.mode === "world") STAGE.prefetch(ALL.filter(function (x) { return x !== cur.id; }));
    if (fs) STAGE.setSolo(fs.s.handle);
  }
  if (window.OFMW_STAGE) onStage(window.OFMW_STAGE);
  else {
    window.addEventListener("ofmw-stage-ready", function () { onStage(window.OFMW_STAGE); });
    setTimeout(function () {   /* the module never arrived: fixed images, and everything else as usual */
      if (STAGE) return;
      noStage = true;
      ALL.forEach(function (id) { if (scenes[id]) stillOnly(scenes[id]); });
    }, 12000);
  }

  /* FLIP: the element was at `before`; it now sits in its new place; it starts from the old box and eases into the new one. */
  function flip(el, before) {
    if (!before || reduce.matches) return;
    var after = el.getBoundingClientRect();
    if (!after.width || !before.width || !after.height) return;
    var done = function () { el.style.transition = ""; el.style.transform = ""; el.style.transformOrigin = ""; el.removeEventListener("transitionend", done); };
    el.style.transition = "none";
    el.style.transformOrigin = "0 0";
    el.style.transform = "translate(" + (before.left - after.left) + "px," + (before.top - after.top) + "px) scale(" + before.width / after.width + "," + before.height / after.height + ")";
    el.getBoundingClientRect();
    el.style.transition = "transform 900ms var(--ease)";
    el.style.transform = "none";
    el.addEventListener("transitionend", done);
    setTimeout(done, 1000);
  }
  function rectOf(el) { return el.isConnected ? el.getBoundingClientRect() : null; }

  /* ---------- home ---------- */
  /* From 48rem up the first screen is a fixed composition, written by hand: height is gravity, so the route climbs
     from the Station (0 g, bottom left) to the Earth (1 g, top right), and the suit stays off the route at the bottom
     right. Each world has a fixed centre (x: share of the window width; y: share of the area from the bottom of the
     header to the bottom of the window, at least 560 px tall) and a side from one formula (sideOf). Nothing is
     searched, so it lands the same way at every size. Below 48rem the worlds zigzag down the page. */
  var SPOT = {
    station: { x: 0.10, y: 0.86, f: 0.9,  lab: "right" },
    moon:    { x: 0.40, y: 0.70, f: 1,    lab: "right" },
    mars:    { x: 0.63, y: 0.52, f: 0.9,  lab: "right" },
    earth:   { x: 0.87, y: 0.21, f: 1.2,  lab: "left" },    /* under it below 1100 px */
    suit:    { x: 0.85, y: 0.84, f: 0.72, lab: "left" }
  };
  var BOB = { station: [8, 9.2, -1.1], moon: [7, 10.6, -4.3], mars: [9, 7.4, -2.6], earth: [6, 11, -6.8], suit: [10, 8.3, -3.5] };   /* px, s, delay */
  var SIDE = { station: "left", moon: "right", mars: "left", earth: "right", suit: "left" };   /* zigzag on phones */
  var drawn = false, sky = null;

  function nb(text) { return String(text).replace(/(\d(?:[.,\/]\d+)?) (g|%|kPa|s)\b/g, "$1\u00a0$2"); }   /* (L13) number and unit stay on one line */
  function countParts(text) { var m = /^([\d,]+)(\s.*)$/.exec(text); return m ? [A.num(m[1]), nb(m[2])] : nb(text); }
  function card(id) {
    var w = A.world(id), c = A.worldCount(w), s = scene(id), out = C.worlds[id] && C.worlds[id].outside;   /* D-1448: PSI first */
    var labels = h("span", { "class": "jr-labels" },
      h("span", { "class": "jr-name", text: T(w.name) }),
      GRAV[id] ? h("span", { "class": "jr-g", text: GRAV[id] }) : null,
      h("span", { "class": "jr-count" + (c.n ? "" : " jr-none") }, countParts(c.text)),
      out ? h("span", { "class": "jr-out", text: nb(out) }) : null);
    var slot = h("span", { "class": "jr-slot" }, s.el);
    s.homeSlot = slot;
    var b = BOB[id];
    return h("a", { "class": "jr-world", href: "#/world/" + id },
      h("span", { "class": "jr-float", style: "--ba:" + b[0] + "px; --bp:" + b[1] + "s; --bd:" + b[2] + "s" }, slot), labels);
  }
  /* The screen before the worlds ("the problem", js/intro.js): an element, or null when it is missing or fails. */
  function preScreen() {
    if (typeof window.OFMW_INTRO !== "function") return null;
    try { var el = window.OFMW_INTRO(); return el && el.nodeType ? el : null; } catch (e) { return null; }
  }
  function preDispose() {
    try { if (window.OFMW_INTRO && typeof window.OFMW_INTRO.dispose === "function") window.OFMW_INTRO.dispose(); } catch (e) { /* nothing to put away */ }
  }
  /* With the screen before (preEl), the title, the line on what this is and the title's credit live there; the worlds
     screen keeps one band of text: "Choose a world" and the finding with its button. Without it, the title stays here. */
  function buildHome(preEl) {
    var pre = !!preEl, S = D.summary, moonAir = /(\d+(?:\.\d+)?) % oxygen/.exec((A.world("moon") || {}).air || "");
    var o2 = A.num((Math.round(S.solidsMaxO2 * 10) / 10).toFixed(1) + " %"), moon = A.num((moonAir ? moonAir[1] : "30") + " %");
    var items = {}, gapText = T("no combustion data between the two ends");
    ["station", "moon", "mars", "earth", "suit"].forEach(function (id) {
      items[id] = h("li", { "class": "jr-item jr-" + SIDE[id] + (id === "suit" ? " jr-off" : ""), "data-id": id },
        id === "suit" ? h("p", { "class": "jr-off-note", text: T("Off the scale: worn in any gravity") }) : null, card(id));
    });
    var gapRow = h("li", { "class": "jr-gap-row" }, h("span", { "class": "jr-gap-text", text: gapText }));   /* phones: in the list, between Mars and Earth */
    var gap = h("div", { "class": "jr-gap" }, h("span", { "class": "jr-gap-text", text: gapText }));         /* wider: on the route, between Mars and Earth */
    var svg = A.s("svg", { "class": "jr-route", "aria-hidden": "true" });
    var marks = h("div", { "class": "jr-marks", "aria-hidden": "true" });
    var find = h("div", { "class": "jr-find" },
      h("p", { "class": "jr-finding" }, fill("No solid with data in PSI was tested above {o2} oxygen. A Moon base is expected at {moon} or more.", { o2: o2, moon: moon })),
      h("a", { "class": "c-btn", href: "#/world/moon", text: T("See the evidence") }));
    var intro = pre ? h("div", { "class": "jr-intro jr-intro-band" }, h("h2", { "class": "jr-choose", text: T("Choose a world to see what is known there.") }), find)
      : h("div", { "class": "jr-intro" },
      h("h1", { text: T("Fire safety for every world where people will live") }),
      h("p", { "class": "jr-what" }, fill("Built for the 2026 NASA Space Apps challenge Flame in Freefall. It sorts and interprets {tests} tests from {inv} combustion investigations in NASA's PSI repository, front by front: prevent, detect, suppress.",
        { tests: A.num(A.fmt(S.tests)), inv: A.num(A.fmt(S.investigations)) })),
      find,
      h("p", { "class": "jr-hint", text: T("Choose a world to see what is known there.") }));
    var nav = h("nav", { "class": "jr-path", "aria-label": T("Worlds, ordered by gravity") }, svg, marks, gap,
      h("ol", { "class": "jr-worlds" }, items.station, items.moon, items.mars, gapRow, items.earth, items.suit));
    var credit = null;
    if (!pre) try {
      var cr = window.OFMW_TITLE && typeof window.OFMW_TITLE.credits === "function" ? window.OFMW_TITLE.credits() : null;
      if (cr && (cr.text || cr.credit)) credit = h("p", { "class": "jr-credit" },
        cr.href ? h("a", { href: cr.href, target: "_blank", rel: "noopener", text: cr.text || cr.credit }) : (cr.text || cr.credit));
    } catch (e) { credit = null; }
    var hero = h("section", { "class": "jr-hero" + (pre ? " jr-hero-pre" : ""), id: "worlds" }, intro, nav, credit);
    var root = h("div", { "class": "jr-home" }, preEl, hero);
    if (typeof window.OFMW_HOME === "function") {   /* the sections another view hangs under the first screen */
      try { var more = window.OFMW_HOME(); if (more && more.nodeType) root.appendChild(more); }
      catch (e) { /* the home page stands without them */ }
    }
    root.parts = { hero: hero, intro: intro, nav: nav, svg: svg, marks: marks, gap: gap, items: items, credit: credit, pre: pre, preEl: preEl };
    /* the 3D title (js/title.js) and the fonts settle after the first layout: when the text block changes size, place again */
    /* (and the page: the scroll bar comes and goes as the sections under it load, which fires no resize) */
    if (window.ResizeObserver) { var ro = root.parts.ro = new ResizeObserver(function () { relayout(); }); ro.observe(intro); ro.observe(document.documentElement); ro.observe(gap);
      [].forEach.call(nav.querySelectorAll(".jr-labels"), function (n) { ro.observe(n); }); }   /* late fonts reflow the tag and the labels */
    return root;
  }

  /* Place the worlds (from 48rem) and draw the curved route through the four on the gravity axis. */
  function clampN(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function hits(a, list) { return list.some(function (b) { return a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t; }); }
  function grow(r, k) { return { l: r.l - k, t: r.t - k, r: r.r + k, b: r.b + k }; }
  /* The side of a scene, from the area: m is the smaller of its height and 56 % of the width, the base side is
     m (0.35 - 0.0000738 m) (about 0.30 m on laptops, 0.25 m on large screens) and each world has its factor.
     It meets the owner's minimums from 1024x768 to 2560x1440 (1280x720 is the tightest); the Earth is the largest. */
  function sideOf(id, W, H) { var m = Math.min(H, 0.56 * W, 1800); return Math.round(m * (0.35 - 0.0000738 * m) * SPOT[id].f); }
  function setLab(li, side) { li.className = li.className.replace(/ jr-lab-\w+/g, "") + (side ? " jr-lab-" + side : ""); }
  /* The suit's note goes over its label beside the scene; on phones it stays over the whole card. */
  function noteTo(li, wide) {
    var note = li.querySelector(".jr-off-note"), labels = li.querySelector(".jr-labels");
    if (!note) return;
    if (wide && note.parentNode !== labels) labels.insertBefore(note, labels.firstChild);
    else if (!wide && note.parentNode !== li) li.insertBefore(note, li.firstChild);
  }
  function lineCount(n) {   /* lines of text only: the 3D stages of the title (js/title.js) are boxes, not lines */
    var rg = document.createRange(), tops = [], tol = parseFloat(getComputedStyle(n).fontSize) * 0.5;
    var walk = document.createTreeWalker(n, NodeFilter.SHOW_TEXT), t;
    while ((t = walk.nextNode())) {
      if (!t.nodeValue.trim()) continue;
      rg.selectNodeContents(t);
      [].forEach.call(rg.getClientRects(), function (q) {
        if (q.height > 0 && q.width > 0 && !tops.some(function (y) { return Math.abs(y - q.top) < tol; })) tops.push(q.top);
      });
    }
    return tops.length;
  }
  /* The text block ends 12 px above the Mars scene (limit, in window pixels): the title gives way until it does.
     From 1280 px wide it is held to a little over half its one-line width, so it breaks in two lines. */
  function fitTitle(P, W, limit) {
    var h1 = P.intro.querySelector("h1"), two = W >= 1280;
    if (!h1) return;   /* with the screen before, the band of text is short and keeps its size */
    h1.style.fontSize = ""; h1.style.maxWidth = "";
    var f = parseFloat(getComputedStyle(h1).fontSize);
    for (var i = 0; i < 40; i++) {
      if (two) {
        h1.style.maxWidth = ""; h1.style.whiteSpace = "nowrap"; h1.style.width = "max-content";
        var one = h1.getBoundingClientRect().width;
        h1.style.whiteSpace = ""; h1.style.width = "";
        h1.style.maxWidth = Math.ceil(one * 0.56) + "px";
      }
      if (f <= 24 || ((!two || lineCount(h1) <= 2) && P.intro.getBoundingClientRect().bottom <= limit)) break;
      f = Math.floor(f * 0.95); h1.style.fontSize = f + "px";
    }
  }
  /* A label sits at the middle of its scene; when that would cover another world, the text block or a label already
     placed, it slides along its side (up or down) the least that clears, without leaving the area. */
  function fitLabels(P, aTop, aBot) {
    var box = function (n) { var r = n.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width }; };
    var scenesR = {}, text = [].slice.call(P.intro.children).map(box).filter(function (q) { return q.w > 0; }), done = [];
    ALL.forEach(function (id) { scenesR[id] = grow(box(P.items[id]), 6); });
    ["earth", "mars", "suit", "moon", "station"].forEach(function (id) {
      var lab = P.items[id].querySelector(".jr-labels");
      lab.style.removeProperty("--dy");
      var b = box(lab), s = scenesR[id], obst = text.concat(done);
      ALL.forEach(function (o) { if (o !== id) obst.push(scenesR[o]); });
      /* what the label would cover at a shift dy (0 = free); outside the area it does not count as a place */
      var cover = function (dy) {
        var q = { l: b.l, r: b.r, t: b.t + dy, b: b.b + dy };
        if (q.t < aTop || q.b > aBot || q.l < 16 || q.r > document.documentElement.clientWidth - 16) return Infinity;
        return obst.reduce(function (acc, o) { return acc + Math.max(0, Math.min(q.r, o.r) - Math.max(q.l, o.l)) * Math.max(0, Math.min(q.b, o.b) - Math.max(q.t, o.t)); }, 0);
      };
      var dy = 0, least = 0, settle = function () {
        b = box(lab); dy = 0; least = cover(0);
        var reach = (s.b - s.t + b.b - b.t) / 2 - 24;
        for (var d = 2; d <= reach && least > 0; d += 2) [d, -d].forEach(function (x) { var c = cover(x); if (c < least) { least = c; dy = x; } });
      };
      lab.style.maxWidth = "";
      settle();
      if (least > 0) {   /* still covering something: a narrower label (more lines) may slip beside the other world */
        var keep = { w: "", dy: dy, least: least };
        for (var w = Math.floor(b.r - b.l) - 8; w >= 120 && keep.least > 0; w -= 8) {
          lab.style.maxWidth = w + "px"; settle();
          if (least < keep.least) keep = { w: w + "px", dy: dy, least: least };
        }
        lab.style.maxWidth = keep.w; b = box(lab); dy = keep.dy; least = keep.least;
      }
      var li = P.items[id], side = / jr-lab-(right|left)/.exec(li.className);
      if (least > 0 && side) {   /* still covering: the other side of its scene, kept only if it covers less */
        var was = { w: lab.style.maxWidth, dy: dy, least: least };
        setLab(li, side[1] === "right" ? "left" : "right"); lab.style.maxWidth = ""; settle();
        if (!(least < was.least)) { setLab(li, side[1]); lab.style.maxWidth = was.w; b = box(lab); dy = was.dy; }
      }
      if (dy) lab.style.setProperty("--dy", dy + "px");
      done.push(grow({ l: b.l, r: b.r, t: b.t + dy, b: b.b + dy }, 8));
    });
  }
  function layoutHome() {
    if (!home || cur.mode !== "home" || !home.isConnected) return;
    var P = home.parts, hero = P.hero, wide = window.matchMedia("(min-width:48rem)").matches, centers = {};
    ALL.forEach(function (id) { noteTo(P.items[id], wide); });
    if (!wide) {
      hero.style.minHeight = ""; hero.classList.remove("jr-short");
      var h1n = P.intro.querySelector("h1"); if (h1n) h1n.style.fontSize = "";
      ALL.forEach(function (id) { var li = P.items[id]; setLab(li, ""); li.style.left = li.style.top = ""; li.style.removeProperty("--size"); });
    } else {
      var sy = window.scrollY, W = document.documentElement.clientWidth, hr = hero.getBoundingClientRect();
      var hx = hr.left, hy = hr.top + sy, marsTop = 0, head = document.getElementById("head");
      /* the area, in page pixels: under the header at the top of the page; with the screen before, the worlds screen
         as it stands when scrolled to sit right under the fixed header */
      var top = P.pre ? hy : A.main.getBoundingClientRect().top + sy;
      var H = Math.max(560, window.innerHeight - (P.pre ? (head ? head.offsetHeight : 0) : top));
      hero.classList.toggle("jr-short", !P.pre && H < 720);   /* with the title here, the outside-PSI line waits for the world view */
      ALL.forEach(function (id) {
        var t = SPOT[id], li = P.items[id], s = sideOf(id, W, H), r = s / 2;
        /* inside the area: 16 px from the sides and 8 px over its bottom, counting the float of the scene */
        var cx = clampN(t.x * W, 16 + r, W - 16 - r), cy = Math.min(top + t.y * H, top + H - 8 - BOB[id][0] - r);
        setLab(li, id === "earth" && W < 1100 ? "below" : t.lab);
        li.style.setProperty("--size", s + "px");
        li.style.left = Math.round(cx - r - hx) + "px"; li.style.top = Math.round(cy - r - hy) + "px";
        if (id === "mars") marsTop = cy - r;
      });
      fitTitle(P, W, marsTop - 12 - sy);
      fitLabels(P, top - sy, top + H - 8 - sy);
      var creditH = P.credit && P.credit.offsetParent ? P.credit.offsetHeight + 8 : 0;   /* the credit waits just under the fold */
      hero.style.minHeight = Math.round(top + H - hy + creditH) + "px";
    }
    var nr = P.nav.getBoundingClientRect();
    AXIS.forEach(function (id) {
      var r = (wide ? P.items[id] : P.items[id].querySelector(".jr-slot")).getBoundingClientRect();   /* from 48rem the item does not float */
      centers[id] = { x: r.left - nr.left + r.width / 2, y: r.top - nr.top + r.height / 2, r: r.width / 2 };
    });
    route(P, centers, nr, wide);
  }
  /* A smooth curve (Catmull-Rom as cubic Bezier) through the four worlds, hidden where it would cross a planet. */
  function route(P, c, nr, wide) {
    var pts = AXIS.map(function (id) { return c[id]; }), d = "M" + pts[0].x + " " + pts[0].y, i;
    for (i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += " C" + (p1.x + (p2.x - p0.x) / 6) + " " + (p1.y + (p2.y - p0.y) / 6) + " " + (p2.x - (p3.x - p1.x) / 6) + " " + (p2.y - (p3.y - p1.y) / 6) + " " + p2.x + " " + p2.y;
    }
    var svg = P.svg;
    svg.setAttribute("width", nr.width); svg.setAttribute("height", nr.height); svg.setAttribute("viewBox", "0 0 " + nr.width + " " + nr.height);
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var mask = A.s("mask", { id: "jr-route-mask", maskUnits: "userSpaceOnUse", x: 0, y: 0, width: nr.width, height: nr.height }, svg);
    A.s("rect", { x: 0, y: 0, width: nr.width, height: nr.height, fill: "#fff" }, mask);
    pts.forEach(function (p) { A.s("circle", { cx: p.x, cy: p.y, r: p.r * 0.8, fill: "#000" }, mask); });
    /* from 48rem the route also passes behind the labels, never through their text */
    var labs = [].map.call(P.nav.querySelectorAll(wide ? ".jr-labels" : ".jr-labels, .jr-gap-row .jr-gap-text"), function (n) {   /* (L13) phones: the red tag too */
      var r = n.getBoundingClientRect(); return { l: r.left - nr.left - 6, t: r.top - nr.top - 6, r: r.right - nr.left + 6, b: r.bottom - nr.top + 6 };
    });
    labs.forEach(function (q) { A.s("rect", { x: q.l, y: q.t, width: q.r - q.l, height: q.b - q.t, fill: "#000" }, mask); });
    var path = A.s("path", { d: d, "class": "jr-route-line", mask: "url(#jr-route-mask)" }, svg);
    var len = path.getTotalLength(), N = 360, samples = [];
    for (i = 0; i <= N; i++) { var q = path.getPointAtLength(len * i / N); samples.push({ x: q.x, y: q.y }); }
    var near = pts.map(function (p) {
      var best = 0, bd = 1e9;
      samples.forEach(function (s, k) { var dd = Math.hypot(s.x - p.x, s.y - p.y); if (dd < bd) { bd = dd; best = k; } });
      return best;
    });
    /* the gravity of each world, as a small mark where the route meets it */
    /* (from 48rem just outside the box of the scene, so the mark covers no world; on phones at the edge of the planet) */
    var inLab = function (s) { return labs.some(function (q) { return s.x > q.l && s.x < q.r && s.y > q.t && s.y < q.b; }); };
    var inside = function (s, p) { return wide ? (Math.abs(s.x - p.x) < p.r + 8 && Math.abs(s.y - p.y) < p.r + 8) || inLab(s) : Math.hypot(s.x - p.x, s.y - p.y) < p.r * 0.84; };
    P.marks.replaceChildren.apply(P.marks, pts.map(function (p, k) {
      /* from 48rem each mark sits where the route leaves its world for the next one (the Earth, the last, where it
         arrives): one mark per stretch, two on the long one to the Earth; on phones as before */
      var j = near[k], step = (wide ? k < pts.length - 1 : k === 0) ? 1 : -1;
      while (j + step >= 0 && j + step <= N && inside(samples[j], p)) j += step;
      var s = samples[j], dx = s.x - p.x, dy = s.y - p.y;
      return h("span", { "class": "jr-mark" + (dx < 0 ? " is-w" : "") + (dy < 0 ? " is-n" : ""), style: "left:" + s.x + "px; top:" + s.y + "px" },
        h("span", { "class": "jr-dot" }), h("span", { "class": "jr-g", text: GRAV[AXIS[k]] }));
    }));
    /* from 48rem each gravity figure takes the corner of its mark that touches no world, label or text */
    if (wide) {
      var vbox = function (n) { var r = n.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width }; };
      var taken = [].slice.call(P.nav.querySelectorAll(".jr-labels")).concat([].slice.call(P.intro.children)).map(vbox)
        .filter(function (q) { return q.w > 0; }).map(function (q) { return grow(q, 4); });
      var boxes = [].map.call(P.nav.querySelectorAll(".jr-item"), function (n) { return grow(vbox(n), 4); });
      /* second try: the empty corner of a scene's box may hold the figure, never the disc of the world itself */
      var discs = [].map.call(P.nav.querySelectorAll(".jr-item"), function (n) { var q = vbox(n), r = (q.r - q.l) / 2; return { x: q.l + r, y: q.t + r, r: r * 0.8 }; });   /* the drawn worlds fill about 0.7 of it */
      var clearOf = function (q) { return discs.every(function (d) { return Math.hypot(Math.max(q.l - d.x, 0, d.x - q.r), Math.max(q.t - d.y, 0, d.y - q.b)) > d.r; }); };
      [].forEach.call(P.marks.children, function (m) {
        var first = m.className, g = m.querySelector(".jr-g"), pick = null;
        var tries = [first, "jr-mark", "jr-mark is-w", "jr-mark is-n", "jr-mark is-w is-n"];
        [true, false].some(function (strict) {
          return tries.some(function (c) {
            m.className = c;
            var q = vbox(g);
            if (!hits(q, taken) && (strict ? !hits(q, boxes) : clearOf(q))) { pick = c; return true; }
            return false;
          });
        });
        m.className = pick || first + " is-quiet";
        if (pick) taken.push(grow(vbox(g), 4));
      });
    }
    /* the tag on the stretch from Mars to the Earth: beside its middle, on the side where it touches nothing */
    if (wide) {
      var gap = P.gap, a = near[2], b = near[3], best = null;
      gap.style.transform = "translate(-50%,-50%)"; gap.style.left = "0px"; gap.style.top = "0px";   /* measured free of its last place: near an edge it shrinks */
      var gw = gap.offsetWidth, gh = gap.offsetHeight;
      var obst = [].slice.call(P.nav.querySelectorAll(".jr-item, .jr-labels, .jr-mark .jr-g, .jr-mark .jr-dot")).concat([].slice.call(P.intro.children)).map(function (n) {
        var r = n.getBoundingClientRect();
        return { l: r.left - nr.left - 8, t: r.top - nr.top - 8, r: r.right - nr.left + 8, b: r.bottom - nr.top + 8, w: r.width };
      }).filter(function (q) { return q.w > 0; });
      [0.5, 0.45, 0.55, 0.4, 0.6, 0.35, 0.65, 0.3, 0.7, 0.25, 0.75].forEach(function (f) {
        var k = Math.round(a + (b - a) * f), s0 = samples[k], s1 = samples[Math.min(N, k + 2)], s2 = samples[Math.max(0, k - 2)];
        var nx = -(s1.y - s2.y), ny = s1.x - s2.x, nl = Math.hypot(nx, ny) || 1;
        nx /= nl; ny /= nl;
        [1, -1].forEach(function (side) {
          [0, 12, 24, 40].forEach(function (extra) {
            var d = gw / 2 * Math.abs(nx) + gh / 2 * Math.abs(ny) + 8 + extra, x = s0.x + side * nx * d, y = s0.y + side * ny * d;
            var box = { l: x - gw / 2, t: y - gh / 2, r: x + gw / 2, b: y + gh / 2 };
            var over = obst.reduce(function (acc, q) { return acc + Math.max(0, Math.min(box.r, q.r) - Math.max(box.l, q.l)) * Math.max(0, Math.min(box.b, q.b) - Math.max(box.t, q.t)); }, 0)
              + samples.reduce(function (acc, p) { return acc + (p.x > box.l && p.x < box.r && p.y > box.t && p.y < box.b ? 400 : 0); }, 0)
              + (box.l < 0 || box.r > nr.width || box.t < 0 || box.b > nr.height ? 1e6 : 0);
            var cost = over * 100 + Math.abs(f - 0.5) * 200 + extra;
            if (!best || cost < best.cost) best = { x: x, y: y, cost: cost };
          });
        });
      });
      if (best.cost >= 100) {   /* nothing free beside the middle: the nearest free place around it, off the route */
        var mid = samples[Math.round((a + b) / 2)], spot = null, far = Infinity;
        for (var gy = gh / 2 + 4; gy < nr.height - gh / 2 - 4; gy += 12) for (var gx = gw / 2 + 4; gx < nr.width - gw / 2 - 4; gx += 12) {
          var dd = Math.hypot(gx - mid.x, gy - mid.y), gb = { l: gx - gw / 2, t: gy - gh / 2, r: gx + gw / 2, b: gy + gh / 2 };
          if (dd < far && !hits(gb, obst) && !samples.some(function (p) { return p.x > gb.l && p.x < gb.r && p.y > gb.t && p.y < gb.b; })) { far = dd; spot = { x: gx, y: gy }; }
        }
        if (spot) best = spot;
      }
      gap.style.left = best.x + "px"; gap.style.top = best.y + "px";
    }
    if (!drawn && !reduce.matches) {   /* the route draws itself once: the only animated entrance */
      path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
      path.getBoundingClientRect();
      path.style.transition = "stroke-dashoffset 1.2s var(--ease)"; path.style.strokeDashoffset = "0";
    }
    drawn = true;
  }
  var layoutRaf = 0;
  function relayout() { if (!layoutRaf) layoutRaf = requestAnimationFrame(function () { layoutRaf = 0; layoutHome(); }); }
  window.addEventListener("resize", relayout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);

  /* Stars in three depths, behind the 3D canvas: they drift very slowly and move a few pixels with the pointer. */
  function buildSky() {
    var host = document.getElementById("stage");
    if (!host || sky) return;
    var seed = 1511;
    var rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    sky = h("div", { "class": "jr-sky", "aria-hidden": "true" });
    [[70, 0.6, 0.45, 3], [45, 0.9, 0.6, 7], [26, 1.25, 0.8, 12]].forEach(function (L, k) {
      var svg = A.s("svg", { "class": "jr-sky-in", width: "100%", height: "100%" }), n;
      for (n = 0; n < L[0]; n++) A.s("circle", { cx: (rnd() * 100).toFixed(2) + "%", cy: (rnd() * 100).toFixed(2) + "%", r: L[1], fill: "#fff", "fill-opacity": (L[2] * (0.6 + rnd() * 0.4)).toFixed(2) }, svg);
      svg.setAttribute("data-k", L[3]);
      sky.appendChild(h("div", { "class": "jr-sky-layer jr-sky-" + k }, svg));
    });
    host.insertBefore(sky, host.firstChild);
    var px = 0, py = 0, pending = false;
    window.addEventListener("pointermove", function (e) {
      if (reduce.matches || cur.mode !== "home") return;
      px = e.clientX / window.innerWidth - 0.5; py = e.clientY / window.innerHeight - 0.5;
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        [].forEach.call(sky.querySelectorAll(".jr-sky-in"), function (s) {
          var k = +s.getAttribute("data-k"); s.style.transform = "translate(" + (-px * k).toFixed(1) + "px," + (-py * k).toFixed(1) + "px)";
        });
      });
    }, { passive: true });
  }

  function titleOn(on) {   /* the title view (js/title.js) dresses the h1 while the home page is mounted */
    if (!on && home && home.parts.pre) preDispose();   /* leaving the home page: the screen before puts its things away */
    if (!home || !window.OFMW_TITLE) return;
    var h1 = home.parts.intro.querySelector("h1");
    if (!h1) return;
    try { if (on) { window.OFMW_TITLE.enhance(h1); relayout(); } else if (typeof window.OFMW_TITLE.dispose === "function") window.OFMW_TITLE.dispose(h1); }
    catch (e) { /* the plain title stays */ }
  }
  /* The home page goes back to where it was: now, after the next frames and after late layout of the sections under
     it (they load their own pieces), unless the reader scrolls first: wheel, touch, keys, or any scroll to another
     place while the page is already tall enough to hold y (a shorter page only clamps it, which is not the reader). */
  /* (M2) The browser puts back the scroll of the page a Back or Forward goes to before the hash change reaches us, so
     window.scrollY then belongs to that page: the home position is followed as the reader moves and frozen from a
     history step until the view changes. */
  var homeY = 0, stepping = false;
  window.addEventListener("popstate", function () { stepping = true; });
  window.addEventListener("scroll", function () { if (cur.mode === "home" && !stepping) homeY = window.scrollY; }, { passive: true });
  function restoreScroll(y) {
    var moved = false, mark = function () { moved = true; };
    var onScroll = function () {
      if (Math.abs(window.scrollY - y) > 1 && document.documentElement.scrollHeight - window.innerHeight >= y + 1) moved = true;
    };
    window.scrollTo(0, y);
    window.addEventListener("wheel", mark, { passive: true, once: true });
    window.addEventListener("touchstart", mark, { passive: true, once: true });
    window.addEventListener("keydown", mark, { once: true });
    setTimeout(function () { window.addEventListener("scroll", onScroll, { passive: true }); }, 0);   /* after our own first jump */
    setTimeout(function () { window.removeEventListener("scroll", onScroll); }, 1000);
    var go = function () { if (!moved && cur.mode === "home" && Math.abs(window.scrollY - y) > 1) window.scrollTo(0, y); };
    requestAnimationFrame(function () { requestAnimationFrame(go); });
    setTimeout(go, 0); setTimeout(go, 120); setTimeout(go, 300); setTimeout(go, 600); setTimeout(go, 900);
  }
  /* Leaving the journey for another section: remember the home position, put the title and the stars away. */
  window.addEventListener("hashchange", function () {
    var first = location.hash.replace(/^#\/?/, "").split("/")[0];
    if (first === "" || first === "world") return;
    if (fs) closeFull();
    if (cur.mode === "home") { homeScroll = stepping ? homeY : window.scrollY; titleOn(false); cur = { mode: "away", id: null, wv: null }; }
    if (sky) sky.classList.remove("is-on");
    stepping = false;
  });

  var shownOnce = false;
  function showHome() {
    /* Shown again without having left (Back pressed before the browser delivered the way out): the reader stays
       where they are, and the screen before is put away before a fresh one is hung. */
    if (cur.mode === "home") { homeScroll = stepping ? homeY : window.scrollY; if (home && home.parts.pre) preDispose(); }
    var preEl = preScreen();   /* a fresh one each time: the last one was put away on leaving */
    if (!home || !!preEl !== home.parts.pre) { if (home && home.parts.ro) home.parts.ro.disconnect(); home = buildHome(preEl); }
    else if (preEl) {
      if (home.parts.preEl && home.parts.preEl.parentNode === home) home.replaceChild(preEl, home.parts.preEl); else home.insertBefore(preEl, home.firstChild);
      home.parts.preEl = preEl;
    }
    var s = cur.mode === "world" ? scenes[cur.id] : null, before = s ? rectOf(s.el) : null;
    document.title = "One Fire, Many Worlds";
    A.main.replaceChildren(home);
    if (s) s.homeSlot.appendChild(s.el);
    cur = { mode: "home", id: null, wv: null };
    buildSky();
    if (sky) sky.classList.add("is-on");
    layoutHome();
    titleOn(true);
    if (shownOnce) restoreScroll(homeScroll);   /* the first time there is nothing to put back */
    shownOnce = true; stepping = false; homeY = homeScroll;
    if (STAGE) STAGE.setStars(false);
    ALL.forEach(function (id) { mode(scenes[id]); paint(scenes[id]); });
    if (s) flip(s.el, before);
  }

  /* ---------- one world ---------- */
  function strip(current) {
    var track = h("div", { "class": "jr-strip-track" }, h("span", { "class": "jr-strip-line", "aria-hidden": "true" }), h("span", { "class": "jr-strip-void", "aria-hidden": "true" }));
    AXIS.forEach(function (id, k) {
      track.appendChild(h("a", { "class": "jr-pt" + (k === 0 ? " is-first" : "") + (k === 3 ? " is-last" : "") + (k === 1 ? " is-up" : ""),
        href: "#/world/" + id, style: "--x:" + pos(A.world(id).g) + "%", "aria-current": id === current ? "page" : null },
        h("span", { "class": "jr-pt-dot", "aria-hidden": "true" }), h("span", { "class": "jr-pt-name", text: T(A.world(id).name) })));
    });
    var suit = h("a", { "class": "jr-pt-off", href: "#/world/suit", "aria-current": current === "suit" ? "page" : null },
      h("span", { "class": "jr-pt-dot", "aria-hidden": "true" }), T(A.world("suit").name));
    return h("nav", { "class": "jr-strip", "aria-label": T("Worlds, ordered by gravity") }, h("div", { "class": "jr-strip-in" }, track, suit));
  }
  function buildWorld(id) {
    var sheet = A.worldSheet(id, { bare: true }), p = sheet.parts;
    var wv = { id: id, slot: h("div", { "class": "jr-stage-slot" }), cap: h("div", { "class": "jr-cap" }) };
    wv.full = h("button", { type: "button", "class": "c-btn", onclick: function () { openFrom(wv.full); } }, T("Full screen"));
    wv.view = h("div", { "class": "jr-wv wrap" },
      h("div", { "class": "jr-top" }, A.back("#/", T("All worlds")), strip(id)),
      h("div", { "class": "jr-lead" },
        h("div", { "class": "jr-text" }, h("h1", { text: p.name }), h("p", { "class": "jr-headline", text: p.headline }), p.facts, h("p", { "class": "jr-takeaway", text: p.takeaway })),
        h("figure", { "class": "jr-figure" }, wv.slot,
          h("figcaption", { "class": "jr-figcap" }, h("div", null, wv.cap, h("p", { "class": "jr-help", text: T("Drag to rotate. Click or tap the model to open it at full screen.") })), wv.full))),
      h("div", { "class": "jr-sheet" }, sheet));
    return wv;
  }
  function showWorld(id) {
    var s = scene(id), before = cur.mode === "home" ? rectOf(s.el) : null;
    if (cur.mode === "home") { homeScroll = stepping ? homeY : window.scrollY; titleOn(false); }
    var prev = cur.mode === "world" && cur.id !== id ? scenes[cur.id] : null;
    if (prev) { if (prev.homeSlot) prev.homeSlot.appendChild(prev.el); else prev.el.remove(); }
    var wv = buildWorld(id);
    wv.slot.appendChild(s.el);
    A.main.replaceChildren(wv.view);
    cur = { mode: "world", id: id, wv: wv };
    if (sky) sky.classList.remove("is-on");
    window.scrollTo(0, 0);
    if (STAGE) {
      STAGE.setStars(false);
      STAGE.prefetch(ALL.filter(function (x) { return x !== id; }));
    }
    if (prev) mode(prev);
    mode(s); paint(s);
    flip(s.el, before);
    stepping = false;
  }

  /* ---------- full screen ---------- */
  function openFrom(opener) {
    if (!cur.wv || fs) return;
    pushFull = true;
    cur.wv.opener = opener;
    location.hash = "#/world/" + cur.id + "/full";
  }
  /* (L3) The model at full screen ends above the credit box: the room under it is the box and 12 px. */
  function capRoom() {
    if (!fs) return;
    var c = fs.ui.querySelector(".jr-full-cap"), r = c ? c.getBoundingClientRect() : null;
    fs.wrap.style.setProperty("--jr-cap-h", (r && r.height ? Math.round(window.innerHeight - r.top + 12) : 0) + "px");
  }
  window.addEventListener("resize", function () { capRoom(); });
  function fullProgress() {
    if (!fs) return;
    var p = fs.s.progress, loading = p && !p.done, failed = (p && p.failed) || fs.s.state === "error";
    fs.load.hidden = !loading;
    fs.err.classList.toggle("is-on", !!failed && !loading);
    if (loading) {
      var pct = p.total ? Math.min(100, Math.round(p.loaded / p.total * 100)) : 0;
      fs.loadText.replaceChildren.apply(fs.loadText, p.total ? fill("Loading full detail, {size}", { size: A.num(size(p.total)) }) : [T("Loading full detail")]);
      fs.bar.style.width = pct + "%";
      fs.pct.textContent = pct + " %";
    }
  }
  function openFull() {
    if (fs || cur.mode !== "world") return;
    var s = scene(cur.id), w = A.world(cur.id), before = rectOf(s.el);
    var bg = h("div", { "class": "jr-full-bg" });
    var close = h("button", { type: "button", "class": "c-btn jr-close", onclick: leaveFull }, T("Close"));
    var loadText = h("span"), bar = h("i"), pct = h("span", { "class": "num" });
    var load = h("div", { "class": "jr-load", role: "status", hidden: "" }, loadText, h("span", { "class": "jr-bar", "aria-hidden": "true" }, bar), pct);
    var retry = h("button", { type: "button", "class": "c-btn", onclick: function () { s.progress = null; if (s.handle) s.handle.retry(); } }, T("Try again"));
    var err = h("div", { "class": "jr-err", role: "alert" }, h("p", { text: T("This model did not load") }), retry);
    var cap = h("div", { "class": "jr-cap" });
    var ui = h("div", { "class": "jr-full-ui", role: "dialog", "aria-modal": "true", "aria-label": T(w.name) + ". " + T("Full screen") },
      load, err, close, h("div", { "class": "jr-full-cap" }, cap, h("p", { "class": "jr-help", text: T("Drag to rotate, scroll or pinch to zoom, double-click to reset") })));
    var wrap = h("div", { "class": "jr-full" }, bg, ui);
    fs = { s: s, wrap: wrap, ui: ui, close: close, load: load, loadText: loadText, bar: bar, pct: pct, err: err, cap: cap,
      opener: cur.wv.opener || cur.wv.full, pushed: pushFull };
    pushFull = false; cur.wv.opener = null;
    document.body.appendChild(wrap);
    bg.appendChild(s.el);
    document.documentElement.classList.add("jr-lock");
    ["head", "banner"].forEach(function (k) { var n = document.getElementById(k); if (n) n.inert = true; });
    A.main.inert = true;
    var foot = document.querySelector(".site-foot"); if (foot) foot.inert = true;
    var host = document.getElementById("stage"); if (host) host.classList.add("jr-top");
    if (STAGE && s.handle) STAGE.setSolo(s.handle);
    mode(s); paint(s);
    close.focus({ preventScroll: true });
    flip(s.el, before);
  }
  function closeFull() {
    if (!fs) return;
    var f = fs, s = f.s, before = rectOf(s.el);
    fs = null;
    if (cur.mode === "world" && cur.id === s.id && cur.wv) cur.wv.slot.appendChild(s.el);
    else if (s.homeSlot) s.homeSlot.appendChild(s.el); else s.el.remove();
    f.wrap.remove();
    document.documentElement.classList.remove("jr-lock");
    ["head", "banner"].forEach(function (k) { var n = document.getElementById(k); if (n) n.inert = false; });
    A.main.inert = false;
    var foot = document.querySelector(".site-foot"); if (foot) foot.inert = false;
    var host = document.getElementById("stage"); if (host) host.classList.remove("jr-top");
    if (STAGE && s.handle) STAGE.setSolo(null);
    s.progress = null;
    mode(s); paint(s);
    var back = f.opener && f.opener.isConnected ? f.opener : cur.wv && cur.wv.full;
    if (back) back.focus({ preventScroll: true });
    flip(s.el, before);
  }
  function leaveFull() {   /* Close and Escape: the same as the browser's Back button when we opened it */
    if (!fs) return;
    if (fs.pushed) history.back(); else location.replace("#/world/" + fs.s.id);
  }
  document.addEventListener("keydown", function (e) {
    if (!fs) return;
    if (e.key === "Escape") { e.preventDefault(); leaveFull(); return; }
    if (e.key !== "Tab") return;
    var list = [fs.s.el].concat([].slice.call(fs.ui.querySelectorAll("button:not([hidden]), a[href]"))).filter(function (n) { return n.offsetParent !== null || n === fs.s.el; });
    var i = list.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); list[list.length - 1].focus(); }
    else if (!e.shiftKey && (i === list.length - 1 || i < 0)) { e.preventDefault(); list[0].focus(); }
  });

  /* ---------- the route: #/, #/world, #/world/<id>, #/world/<id>/full ---------- */
  A.route("world", "world", function (parts) {
    var id = parts[0] && A.world(parts[0]) ? parts[0] : null, full = !!id && parts[1] === "full";
    if (!id) { closeFull(); showHome(); return; }
    if (cur.mode === "world" && cur.id === id && cur.wv && cur.wv.view.isConnected) { if (full) openFull(); else closeFull(); return; }
    closeFull();
    showWorld(id);
    if (full) openFull();
  });
})();
