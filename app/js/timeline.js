/* Timeline: from accident to experiment. Built by agent F (second wave of the new interface).
   One entry at a time under an axis of years drawn to scale, with the vehicle's NASA 3D model when the entry names
   it, else a figure from the reports of its investigations, else the year. "Show all" lists every entry.
   The chosen entry lives in the hash (#/timeline/<year>, #/timeline/all), so Back returns to the one before.
   Data: C.timeline (data/content.js). It replaces timelineView in js/explore.js, which registers first. */
(function () {
  "use strict";
  var A = window.OFMW_APP;
  if (!A) return;
  var h = A.h, T = A.T, C = A.C, D = A.D;

  A.es({
    "Every emergency left a question, and the experiments in NASA's repository are attempts to answer them.":
      "Cada emergencia dejó una pregunta, y los experimentos del repositorio de NASA intentan responderla.",
    "Which investigation answers which event is our reading; the events and their sources are NASA's.":
      "Qué investigación responde a qué suceso es nuestra lectura; los sucesos y sus fuentes son de NASA.",
    "Kinds of entry": "Tipos de entrada",
    "Show all": "Mostrar todo",
    "Previous": "Anterior",
    "Next": "Siguiente",
    "Entry ": "Entrada ",
    " of ": " de ",
    "Timeline entries. Use the left and right arrow keys to move between them.":
      "Entradas de la línea de tiempo. Usa las flechas izquierda y derecha para moverte entre ellas.",
    "Investigations that study this problem": "Investigaciones que estudian este problema",
    "Record": "Ficha",
    "Source: ": "Fuente: ",
    "3D model of ": "Modelo 3D de ",
    "Drag to rotate the model. Double-click to return to the first view.": "Arrastra para girar el modelo. Doble clic para volver a la vista inicial.",
    "Model: ": "Modelo: ",
    "Credit: ": "Crédito: ",
    "Used for education; it does not imply endorsement by NASA. ": "Se usa con fines educativos; no implica respaldo de NASA. ",
    "Open the model at NASA": "Abrir el modelo en NASA",
    "Loading model": "Cargando modelo",
    "This model did not load": "Este modelo no cargó",
    "Try again": "Intentar de nuevo",
    "Figure ": "Figura ",
    ", page ": ", página ",
    "A figure from the reports of ": "Una figura de los reportes de ",
    ". From ": ". De ",
    "Open the figure and its source": "Abrir la figura y su fuente",
    "No 3D model fits this entry and its investigations have no figure, so the frame shows the year.":
      "Ningún modelo 3D corresponde a esta entrada y sus investigaciones no tienen figura, así que el marco muestra el año.",
    "Open on the timeline": "Abrir en la línea de tiempo",
    "No entry with that year": "No hay entrada con ese año",
    "The address names an entry that is not on the timeline.": "La dirección nombra una entrada que no está en la línea de tiempo.",
    "Go to the first entry": "Ir a la primera entrada",
    "The timeline is empty": "La línea de tiempo está vacía",
    "No entries came with the data. Reload the page to try again.": "No llegaron entradas con los datos. Vuelve a cargar la página para intentarlo de nuevo.",
    "Reload": "Volver a cargar",
    "Emergency": "Emergencia", "Experiment": "Experimento", "Planned": "Planeado",
    "From accident to experiment": "De accidente a experimento",
    "Timeline · One Fire, Many Worlds": "Línea de tiempo · One Fire, Many Worlds",
    "Test dates in the repository run from ": "Las fechas de las pruebas del repositorio van de ",
    " to ": " a "
  });

  var KIND = { accident: "Emergency", experiment: "Experiment", planned: "Planned" };
  var LANG = window.OFMW_LANG === "es" ? "es" : "en";
  var FIGS = window.OFMW_FIGURES || [];
  var SPAN = 80;   /* percent of the axis for the dated entries; "Recent" and "Future" share the rest, not to scale */
  var wide = window.matchMedia("(min-width: 60.0625rem)");

  /* Honesty rule for models: only when the entry itself names the vehicle or the place.
     1970 Apollo 13: the Apollo Lunar Module, named as such, nothing said about its role (allowed by the brief).
     1974: "aboard Skylab 4". 1997: "Fire aboard Mir". FM2: "on the lunar surface". Apollo 1 has no model. */
  var BY_YEAR = { "1970": "tl-lunar-module", "1974": "tl-skylab", "1997": "tl-mir" };
  var STILL = {   /* only used if the 3D module never arrives: the same names and credits as models/models.json */
    "tl-lunar-module": { name: "Apollo Lunar Module", credit: "NASA", page: "https://github.com/nasa/NASA-3D-Resources/tree/master/3D%20Models/Apollo%20Lunar%20Module" },
    "tl-skylab": { name: "Skylab", credit: "NASA", page: "https://github.com/nasa/NASA-3D-Resources/tree/master/3D%20Models/Skylab" },
    "tl-mir": { name: "Mir", credit: "NASA", page: "https://github.com/nasa/NASA-3D-Resources/tree/master/3D%20Models/Mir" },
    "tl-moon": { name: "Moon 3D Models for Web, AR, and Animation (moon_small)", credit: "NASA's Goddard Space Flight Center", page: "https://svs.gsfc.nasa.gov/14959/" }
  };
  function sceneFor(e) {
    if (BY_YEAR[e.year]) return BY_YEAR[e.year];
    if (e.kind === "planned" && e.title === "FM2") return "tl-moon";
    return null;
  }
  /* The figure: from the first linked investigation that has one, the figure whose shape best fills the frame. */
  function figureFor(e) {
    var k, list, best = null, d, bd = Infinity;
    for (k = 0; k < e.answers.length; k++) {
      list = FIGS.filter(function (f) { return f.invs && f.invs.indexOf(e.answers[k]) >= 0 && f.img && f.w && f.h; });
      if (!list.length) continue;
      list.forEach(function (f) { d = Math.abs(Math.log(f.w / f.h / (4 / 3))); if (d < bd) { bd = d; best = f; } });
      return { f: best, inv: e.answers[k] };
    }
    return null;
  }

  function entries() { return (C && C.timeline) || []; }
  function slug(e, i) {
    if (/^\d{4}$/.test(e.year)) return e.year;
    var y = String(e.year).toLowerCase();
    if (y === "recent" || y === "reciente") return "recent";
    if (y === "future" || y === "futuro") return "future";
    return String(i + 1);
  }
  function indexFor(part) {
    var list = entries(), p, i, n;
    if (!part) return 0;
    p = decodeURIComponent(part).toLowerCase();
    for (i = 0; i < list.length; i++) if (slug(list[i], i) === p) return i;
    n = /^\d{1,2}$/.test(p) ? parseInt(p, 10) : 0;
    return n >= 1 && n <= list.length ? n - 1 : -1;
  }
  function positions(list) {
    var years = list.map(function (e) { return /^\d{4}$/.test(e.year) ? +e.year : null; });
    var nums = years.filter(function (y) { return y !== null; });
    var lo = Math.min.apply(null, nums), hi = Math.max.apply(null, nums), far = list.length - nums.length, k = 0;
    return years.map(function (y) {
      if (y !== null) return hi > lo ? (y - lo) / (hi - lo) * (nums.length < list.length ? SPAN : 100) : 0;
      k += 1;
      return SPAN + k * (100 - SPAN) / far;
    });
  }

  /* ---------- the 3D stage: arrives after the classic scripts, or never ---------- */
  var STAGE = null, noStage = false, ui = null, lastY = 0;
  function onStage() {
    if (STAGE || !window.OFMW_STAGE) return;
    STAGE = window.OFMW_STAGE;
    attachScene();
  }
  if (window.OFMW_STAGE) onStage();
  else {
    window.addEventListener("ofmw-stage-ready", onStage);
    setTimeout(function () { if (STAGE) return; noStage = true; if (ui && ui.scene) attachScene(); }, 12000);
  }
  window.addEventListener("scroll", function () { lastY = window.scrollY; }, { passive: true });
  /* Leaving the timeline: the scene is unmounted, so no scene of ours stays on the shared canvas. */
  window.addEventListener("hashchange", function () { if (!/^#\/timeline(\/|$)/.test(location.hash)) dropScene(); });

  function modelCaption(sc, parts) {
    sc.cap.replaceChildren.apply(sc.cap, parts.map(function (p) {
      return h("p", null, T("Model: "), h("b", { text: p.name }), ". ", p.credit ? T("Credit: ") + p.credit + ". " : "",
        T("Used for education; it does not imply endorsement by NASA. "),
        p.page ? h("a", { href: p.page, target: "_blank", rel: "noopener", text: T("Open the model at NASA") }) : null, p.page ? "." : "");
    }).concat(noStage ? [] : [h("p", { text: T("Drag to rotate the model. Double-click to return to the first view.") })]));
  }
  function attachScene() {
    var sc = ui && ui.scene;
    if (!sc || sc.handle || sc.still) return;
    if (noStage || !STAGE) {
      if (!noStage) return;
      sc.still = true;
      sc.el.insertBefore(h("img", { "class": "jr-still", alt: "", src: "img/scenes/" + sc.id + ".jpg" }), sc.el.firstChild);
      sc.el.setAttribute("data-state", "still");
      modelCaption(sc, [STILL[sc.id]]);
      return;
    }
    sc.handle = STAGE.mount(sc.el, sc.id, { priority: 0, tier: "lite" });
    sc.handle.onState(function (state, info) {
      if (info && info.parts && info.parts.length) {
        sc.el.setAttribute("aria-label", T("3D model of ") + info.parts[0].name);
        modelCaption(sc, info.parts);
      }
      if (state === "ready" || state === "still") sc.el.setAttribute("tabindex", "0");
    });
    if (STAGE.supported) sc.handle.setInteractive(true, { zoom: false, touch: "pan-y" });
  }
  function dropScene() {
    if (!ui || !ui.scene) return;
    if (ui.scene.handle) ui.scene.handle.dispose();
    ui.scene = null;
  }

  /* ---------- pieces ---------- */
  /* The entry asked for but not drawn yet: two quick presses move two entries, not one. */
  function cur() { return ui.want !== null && ui.want !== undefined ? ui.want : ui.sel; }
  function go(i) { ui.want = i; location.hash = "#/timeline/" + slug(entries()[i], i); }
  function kindTag(e) { return A.tag("kind", T(KIND[e.kind] || e.kind)); }
  function invLinks(e) {
    var links = e.answers.map(A.inv).filter(Boolean);
    if (!links.length) return null;
    return [h("h3", { "class": "tl-label", text: e.kind === "experiment" ? T("Record") : T("Investigations that study this problem") }),
      h("ul", { "class": "tl-invs" }, links.map(function (i) { return h("li", null, h("a", { "class": "tl-inv", href: "#/investigation/" + i.id, text: i.acr })); }))];
  }
  function source(e) {
    return h("p", { "class": "tl-src" }, T("Source: "), e.url ? h("a", { href: e.url, target: "_blank", rel: "noopener", text: e.source }) : e.source);
  }
  function texts(e) {
    return [h("p", { "class": "tl-what", text: e.what }), h("p", { "class": "tl-lesson", text: e.lesson })];
  }
  function frameFor(e) {
    var frame = h("div", { "class": "tl-frame" }), cap = h("div", { "class": "tl-cap" }), id = sceneFor(e), fig;
    if (id) {
      var sc = { id: id, cap: cap, handle: null };
      sc.retry = h("button", { type: "button", "class": "c-btn", onclick: function () { if (sc.handle) sc.handle.retry(); } }, T("Try again"));
      sc.el = h("div", { "class": "tl-scene", role: "img", "aria-label": T("3D model of ") + STILL[id].name, "data-scene": id, "data-state": "loading" },
        h("span", { "class": "tl-wait", text: T("Loading model") }),
        h("div", { "class": "tl-fail", role: "alert" }, h("p", { text: T("This model did not load") }), sc.retry));
      frame.appendChild(sc.el);
      ui.scene = sc;
    } else if ((fig = figureFor(e))) {
      var f = fig.f, inv = A.inv(fig.inv), doc = f.doc ? (f.doc[LANG] || f.doc.en) : "";
      frame.setAttribute("data-kind", "figure");
      frame.appendChild(h("a", { "class": "tl-figlink", href: "#/figure/" + f.id },
        h("img", { src: f.img, width: f.w, height: f.h, alt: (f.number ? T("Figure ") + f.number + ": " : "") + f.caption, lang: "en" })));
      cap.appendChild(h("p", null, T("A figure from the reports of "), inv ? A.invLink(inv) : fig.inv,
        doc ? T(". From ") + doc + (f.page ? T(", page ") + f.page : "") : "", ". ",
        f.credit ? T("Credit: ") + f.credit + ". " : "",
        h("a", { href: "#/figure/" + f.id, text: T("Open the figure and its source") }), "."));
    } else {
      frame.setAttribute("data-kind", "year");
      frame.appendChild(h("div", { "class": "tl-bigyear" + (/^\d{4}$/.test(e.year) ? "" : " tl-word"), "aria-hidden": "true", text: e.year }));
      cap.appendChild(h("p", { text: T("No 3D model fits this entry and its investigations have no figure, so the frame shows the year.") }));
    }
    if (id) frame.setAttribute("data-kind", "model");
    return h("figure", { "class": "tl-figure" }, frame, h("figcaption", null, cap));
  }
  function entryView(e) {
    return [frameFor(e),
      h("div", { "class": "tl-text" },
        h("div", { "class": "tl-head" }, h("span", { "class": "tl-year" + (/^\d{4}$/.test(e.year) ? "" : " tl-word"), text: e.year }), kindTag(e)),
        h("h2", { "class": "tl-title", text: e.title }), texts(e), invLinks(e), source(e))];
  }
  function listView(list) {
    return h("ol", { "class": "tl-list" }, list.map(function (e, i) {
      return h("li", { "class": "tl-row" },
        h("div", { "class": "tl-head" }, h("span", { "class": "tl-year" + (/^\d{4}$/.test(e.year) ? "" : " tl-word"), text: e.year }), kindTag(e)),
        h("div", { "class": "tl-text" }, h("h2", { "class": "tl-title", text: e.title }), texts(e)),
        h("div", { "class": "tl-side" }, invLinks(e), source(e),
          h("a", { "class": "c-btn tl-open", href: "#/timeline/" + slug(e, i) }, T("Open on the timeline"))));
    }));
  }
  function stepButtons() {
    return {
      prev: h("button", { type: "button", "class": "c-btn tl-step", "data-step": "prev", onclick: function () { if (cur() > 0) go(cur() - 1); } }, T("Previous")),
      next: h("button", { type: "button", "class": "c-btn tl-step", "data-step": "next", onclick: function () { if (cur() < entries().length - 1) go(cur() + 1); } }, T("Next"))
    };
  }

  /* Labels in two rows, above and below the line, so close years never overlap on a wide screen. */
  function rows() {
    if (!ui || !wide.matches) return;
    var w = ui.axis.clientWidth, last = [-Infinity, -Infinity];
    ui.nodes.forEach(function (n, i) {
      var x = ui.pos[i] / 100 * w, r = x - last[0] >= 56 ? 0 : x - last[1] >= 56 ? 1 : (last[0] <= last[1] ? 0 : 1);
      n.setAttribute("data-row", String(r));
      last[r] = x;
    });
  }
  function centerStrip() {
    if (!ui || wide.matches) return;
    var n = ui.nodes[ui.sel];
    if (n) ui.axis.scrollLeft = n.offsetLeft - (ui.axis.clientWidth - n.offsetWidth) / 2;
  }

  function build(list) {
    var top = stepButtons(), bottom = stepButtons();
    ui = { sel: -1, all: null, scene: null, list: list, pos: positions(list), top: top, bottom: bottom };
    ui.nodes = list.map(function (e, i) {
      return h("a", { "class": "tl-node tl-node-" + e.kind + (ui.pos[i] > SPAN ? " tl-node-far" : ""), href: "#/timeline/" + slug(e, i),
        style: "--x:" + ui.pos[i].toFixed(3) + "%", tabindex: "-1", "aria-label": e.year + ", " + T(KIND[e.kind] || e.kind) + ": " + e.title, "data-row": "0" },
        h("span", { "class": "tl-node-dot", "aria-hidden": "true" }, h("span", { "class": "tl-dot tl-dot-" + e.kind })),
        h("span", { "class": "tl-node-year" + (/^\d{4}$/.test(e.year) ? "" : " tl-word"), "aria-hidden": "true", text: e.year }));
    });
    var farFrom = Math.min.apply(null, ui.pos.filter(function (p) { return p > SPAN; }).concat([100]));
    ui.axis = h("div", { "class": "tl-axis", role: "group", "aria-label": T("Timeline entries. Use the left and right arrow keys to move between them.") },
      h("span", { "class": "tl-track", style: "left:0; right:" + (100 - SPAN) + "%" }),
      farFrom < 100 || ui.pos.some(function (p) { return p > SPAN; }) ? h("span", { "class": "tl-track tl-track-far", style: "left:" + SPAN + "%; right:0" }) : null,
      ui.nodes);
    ui.axis.addEventListener("keydown", function (ev) {
      var i = cur(), n = list.length;
      if (ev.key === "ArrowRight") i = Math.min(n - 1, i + 1);
      else if (ev.key === "ArrowLeft") i = Math.max(0, i - 1);
      else if (ev.key === "Home") i = 0;
      else if (ev.key === "End") i = n - 1;
      else return;
      ev.preventDefault();
      if (i !== cur()) { ui.focus = true; go(i); }
    });
    ui.nodes.forEach(function (n) { n.addEventListener("click", function () { ui.focus = true; }); });
    ui.nav = h("div", { "class": "tl-nav" }, top.prev, ui.axis, top.next);
    ui.count = h("span", { "class": "tl-count", "aria-hidden": "true" });
    ui.bar = h("div", { "class": "tl-bar" }, bottom.prev, ui.count, bottom.next);
    ui.toggle = h("button", { type: "button", role: "switch", "aria-checked": "false", "class": "tl-switch",
      onclick: function () { location.hash = ui.all ? "#/timeline/" + slug(list[Math.max(0, ui.sel)], Math.max(0, ui.sel)) : "#/timeline/all"; } },
      h("span", { "class": "tl-switch-track", "aria-hidden": "true" }), T("Show all"));
    ui.live = h("p", { "class": "tl-sr", "aria-live": "polite" });
    ui.entry = h("div", { "class": "tl-entry" });
    ui.body = h("div", null, ui.nav, ui.entry, ui.bar);
    ui.listBox = h("div", { hidden: "" });
    ui.root = h("div", { "class": "wrap tl" },
      h("div", { "class": "tl-top" }, A.intro(T("From accident to experiment"), T("Every emergency left a question, and the experiments in NASA's repository are attempts to answer them.")),
      h("div", { "class": "tl-tools" },
        h("ul", { "class": "tl-legend", "aria-label": T("Kinds of entry") }, ["accident", "experiment", "planned"].map(function (k) {
          return h("li", null, h("span", { "class": "tl-dot tl-dot-" + k, "aria-hidden": "true" }), T(KIND[k]));
        })),
        ui.toggle)),
      ui.body, ui.listBox, ui.live,
      h("p", { "class": "tl-note" }, T("Which investigation answers which event is our reading; the events and their sources are NASA's."), " ",
        D && D.summary && D.summary.years ? T("Test dates in the repository run from ") + D.summary.years[0] + T(" to ") + D.summary.years[1] + "." : ""));
    A.main.replaceChildren(ui.root);
    if (window.ResizeObserver) { ui.ro = new ResizeObserver(function () { rows(); centerStrip(); }); ui.ro.observe(ui.axis); }
  }

  function select(i) {
    var list = ui.list, e = list[i], changed = ui.sel !== i || ui.all !== false;
    ui.all = false; ui.want = null;
    ui.listBox.hidden = true; ui.listBox.replaceChildren();
    ui.body.hidden = false;
    ui.toggle.setAttribute("aria-checked", "false");
    ui.nodes.forEach(function (n, k) {
      n.classList.toggle("is-on", k === i);
      if (k === i) n.setAttribute("aria-current", "step"); else n.removeAttribute("aria-current");
      n.setAttribute("tabindex", k === i ? "0" : "-1");
    });
    [ui.top, ui.bottom].forEach(function (b) { b.prev.disabled = i === 0; b.next.disabled = i === list.length - 1; });
    ui.count.textContent = T("Entry ") + (i + 1) + T(" of ") + list.length;
    if (changed) {
      dropScene();
      ui.sel = i;
      ui.entry.replaceChildren.apply(ui.entry, entryView(e));
      ui.entry.classList.remove("tl-in"); void ui.entry.offsetWidth; ui.entry.classList.add("tl-in");
      attachScene();
      ui.live.textContent = e.year + ". " + e.title + ". " + T("Entry ") + (i + 1) + T(" of ") + list.length + ".";
    }
    rows(); centerStrip();
    if (ui.focus) { ui.focus = false; ui.nodes[i].focus({ preventScroll: true }); }
  }
  function showAll() {
    dropScene();
    ui.all = true; ui.want = null;
    ui.body.hidden = true;
    ui.listBox.replaceChildren(listView(ui.list));
    ui.listBox.hidden = false;
    ui.toggle.setAttribute("aria-checked", "true");
    if (ui.sel < 0) ui.sel = 0;
  }

  function timeline(parts) {
    document.title = T("Timeline · One Fire, Many Worlds");
    var list = entries(), y = lastY, fresh = !ui || !ui.root.isConnected;
    if (!list.length) {
      dropScene(); ui = null;
      A.main.replaceChildren(h("div", { "class": "wrap tl" }, A.intro(T("From accident to experiment"), T("Every emergency left a question, and the experiments in NASA's repository are attempts to answer them.")),
        A.state("error", T("The timeline is empty"), T("No entries came with the data. Reload the page to try again."),
          h("button", { type: "button", "class": "c-btn", onclick: function () { location.reload(); } }, T("Reload")))));
      return;
    }
    var all = parts[0] === "all", i = all ? 0 : indexFor(parts[0]);
    if (i < 0) {
      dropScene(); ui = null;
      A.main.replaceChildren(h("div", { "class": "wrap tl" }, A.intro(T("From accident to experiment"), T("Every emergency left a question, and the experiments in NASA's repository are attempts to answer them.")),
        A.state("empty", T("No entry with that year"), T("The address names an entry that is not on the timeline."),
          h("a", { "class": "c-btn", href: "#/timeline/" + slug(list[0], 0) }, T("Go to the first entry")))));
      return;
    }
    if (fresh) { dropScene(); build(list); }
    if (all) showAll(); else select(i);
    if (fresh) return;   /* a new visit opens at the top, as the router left it */
    /* Within the timeline the router has scrolled to the top: keep the reader where they were, or bring the
       axis back into view when they were further down (Next at the foot of a phone). */
    var navTop = ui.root.querySelector(all ? ".tl-tools" : ".tl-nav").getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo(0, Math.max(0, Math.min(y, navTop)));
  }
  wide.addEventListener && wide.addEventListener("change", function () { if (ui && ui.root.isConnected) { rows(); centerStrip(); } });

  A.route("timeline", "timeline", timeline);
})();
