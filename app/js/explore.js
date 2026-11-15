/* Timeline (from accident to experiment), Will it burn? (the evidence near a condition) and Data (every test, downloadable). */
(function () {
  "use strict";
  var A = window.OFMW_APP, h = A.h, fmt = A.fmt, plural = A.plural, D = A.D, C = A.C, T = A.T;
  if (!D || !C) return;
  A.es({
    "Set an atmosphere and a fuel": "Fija una atmósfera y un combustible", "Atmosphere and fuel": "Atmósfera y combustible",
    "Oxygen in the atmosphere, %": "Oxígeno en la atmósfera, %", "Pressure, psi": "Presión, psi", "Reset": "Restablecer",
    "How they ended": "Cómo terminaron", "By fuel": "Por combustible", "No test near here": "Ninguna prueba cerca",
    "Oxygen (%)": "Oxígeno (%)", "Pressure (psi)": "Presión (psi)", "Flow (cm/s)": "Flujo (cm/s)",
    "Outside the window": "Fuera de la ventana", "Show all ": "Mostrar las ", "Show the nearest 15": "Mostrar solo las 15 más cercanas",
    "Low to high": "De menor a mayor", "High to low": "De mayor a menor", "A to Z": "De la A a la Z", "Z to A": "De la Z a la A",
    "Sort by ": "Ordenar por ", "The nearest tests, by distance to the conditions you set": "Las pruebas más cercanas, por distancia a las condiciones que fijaste",
    "Every test in the repository, one row per test": "Todas las pruebas del repositorio, un renglón por prueba",
    "Clear": "Borrar", "Clear the search": "Borrar la búsqueda", "Clear filters": "Quitar filtros", " of ": " de ", " tests": " pruebas",
    "No test matches": "Ninguna prueba coincide", "Show the details of this test": "Ver el detalle de esta prueba",
    "Test": "Prueba", "Date": "Fecha", "Fuel family": "Familia del combustible", "Sample shape": "Forma de la muestra",
    "Flow direction": "Dirección del flujo", "Diluent": "Diluyente", "Oxygen range": "Rango de oxígeno", "Lowest pressure": "Presión mínima",
    "Oxygen measured in": "Oxígeno medido en", "chamber atmosphere": "la atmósfera de la cámara", "burner gas (inverse flame)": "el gas del quemador (flama inversa)",
    "Source table": "Tabla de origen", "Source row": "Fila de origen", "Not recorded": "Sin registro", "Open the investigation": "Abrir la investigación",
    "Close": "Cerrar", "Investigation filter": "Filtro de investigación",
    "Download these ": "Descargar estas ", " tests (CSV)": " pruebas (CSV)", "Download this test (CSV)": "Descargar esta prueba (CSV)",
    "Select test ": "Seleccionar la prueba ", "Select every test that matches these filters": "Seleccionar todas las pruebas que cumplen estos filtros",
    "test selected": "prueba seleccionada", "tests selected": "pruebas seleccionadas", " not shown with these filters": " no se ven con estos filtros",
    "Download selected (CSV)": "Descargar las seleccionadas (CSV)", "Clear selection": "Quitar la selección", "Selection": "Selección"
  });
  var OUT = { out: T("Went out by itself"), burn: T("Kept burning"), none: T("Did not ignite or spread"), "": T("No ending recorded") };
  function cap(t) { return t ? t.charAt(0).toUpperCase() + t.slice(1) : ""; }

  /* ---------- timeline ---------- */
  var KIND = { accident: T("Emergency"), experiment: T("Experiment"), planned: T("Planned") };
  function timelineView() {
    document.title = T("Timeline · One Fire, Many Worlds");
    A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "sheet page" },
      h("h1", { text: T("From accident to experiment") }),
      h("p", { "class": "intro", text: T("Every emergency left a question, and the experiments in NASA's repository are attempts to answer them. Which investigation answers which event is our reading; the events and their sources are NASA's.") }),
      h("ol", { "class": "timeline" }, C.timeline.map(function (e) {
        var links = e.answers.map(A.inv).filter(Boolean);
        return h("li", { "class": e.kind },
          h("p", { "class": "when" }, h("span", { "class": "year", text: e.year }), h("span", { "class": "kind", text: KIND[e.kind] })),
          h("div", null,
            h("h2", { text: e.title }), h("p", { text: e.what }), h("p", { "class": "lesson", text: e.lesson }),
            links.length ? h("p", { "class": "answers" }, e.kind === "experiment" ? T("Record: ") : T("Investigations that study this problem: "),
              links.map(function (i, k) { return [k ? ", " : "", A.invLink(i)]; })) : null,
            h("p", { "class": "note" }, T("Source: "), e.url ? h("a", { href: e.url, target: "_blank", rel: "noopener", text: e.source }) : e.source)));
      })),
      h("p", { "class": "note", text: T("Test dates in the repository run from ") + D.summary.years[0] + T(" to ") + D.summary.years[1] + "." }))));
  }

  /* ---------- shared by the exploration views (sources.js and method.js use it through A.exp) ---------- */
  /* Going to a detail and coming back leaves a list as it was: each view's last hash and scroll position are kept,
     and restored when the reader comes back to that same hash (browser Back, or a Back link that points to it). */
  var NAV = { prev: "", y: 0, memo: {} }, MINE = { burn: 1, data: 1, sources: 1, figures: 1 }, saveTimer = 0;
  function sectionOf(hash) { return String(hash || "").replace(/^#?\/?/, "").split(/[\/?]/)[0]; }
  function save() { var s = sectionOf(location.hash); if (MINE[s]) NAV.memo[s] = { hash: location.hash, y: window.pageYOffset }; }
  window.addEventListener("hashchange", function (e) {           /* registered before the router, so it runs first */
    var i = String(e.oldURL || "").indexOf("#"), ps;
    clearTimeout(saveTimer);
    NAV.prev = i >= 0 ? e.oldURL.slice(i) : "#/"; NAV.y = window.pageYOffset;
    ps = sectionOf(NAV.prev);
    if (MINE[ps]) NAV.memo[ps] = { hash: NAV.prev, y: NAV.y };
  });
  window.addEventListener("scroll", function () { clearTimeout(saveTimer); saveTimer = setTimeout(save, 150); }, { passive: true });
  function restore(s) {
    if (!NAV.prev) return;
    var prev = sectionOf(NAV.prev), m = NAV.memo[s];
    if (prev === s) window.scrollTo(0, NAV.y);
    else if (m && m.hash === location.hash) window.scrollTo(0, m.y);
    NAV.prev = "";
  }
  function setHash(hash, push) {
    if (location.hash === hash) return;
    if (push) history.pushState(null, "", hash); else history.replaceState(history.state, "", hash);
    save();
  }
  function query() {
    var hs = location.hash, i = hs.indexOf("?"), o = {};
    if (i < 0) return o;
    hs.slice(i + 1).split("&").forEach(function (pair) {
      if (!pair) return;
      var kv = pair.split("=");
      try { o[decodeURIComponent(kv[0])] = decodeURIComponent(kv.slice(1).join("=").replace(/\+/g, " ")); } catch (e) { /* a broken link keeps the default */ }
    });
    return o;
  }
  function build(base, o) {
    var q = Object.keys(o).filter(function (k) { return o[k] !== "" && o[k] !== null && o[k] !== undefined; })
      .map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(o[k]); }).join("&");
    return base + (q ? "?" + q : "");
  }
  /* A.apaTable and A.apaFigure give the academic layout; the new classes replace the inherited ones. */
  function apaClass(f) {
    f.className = "c-fig exp-apa";
    [].slice.call(f.querySelectorAll(".apanum")).forEach(function (x) { x.className = "c-fig-num"; });
    [].slice.call(f.querySelectorAll(".apatitle")).forEach(function (x) { x.className = "c-fig-title"; });
    [].slice.call(f.querySelectorAll(".apanote")).forEach(function (x) { x.className = "c-fig-note"; });
    [].slice.call(f.children).forEach(function (x) { if (x.classList.contains("table")) x.className = "c-table exp-tbox"; });
    return f;
  }
  function apa(n, title, table, note) { return apaClass(A.apaTable(n, title, table, note)); }
  /* Sortable column heads: the order is said in words under the name, not only with an arrow. */
  var SORTW = { num: [T("Low to high"), T("High to low")], text: [T("A to Z"), T("Z to A")] };
  function sortHead(cols, st, onSort) {
    return h("thead", null, h("tr", null, cols.map(function (c) {
      var on = st.key === c.k, words = SORTW[c.num ? "num" : "text"];
      var attrs = { scope: "col", "class": (c.num ? "num " : "") + (c.cls || "") };
      if (c.sort === false) return h("th", attrs, c.label);
      if (c.pre) {
        attrs["aria-sort"] = on ? (st.dir === "asc" ? "ascending" : "descending") : "none";
        return h("th", attrs, h("div", { "class": "exp-cellwrap" }, c.pre,
          h("button", { type: "button", "class": "exp-sort", "data-k": c.k, "aria-label": T("Sort by ") + c.label + (on ? ", " + words[st.dir === "asc" ? 0 : 1] : ""),
            onclick: function () { onSort(c.k); } },
            h("span", { "class": "exp-sort-name", text: c.label }), on ? h("span", { "class": "exp-sortstate", text: words[st.dir === "asc" ? 0 : 1] }) : null)));
      }
      attrs["aria-sort"] = on ? (st.dir === "asc" ? "ascending" : "descending") : "none";
      return h("th", attrs, h("button", { type: "button", "class": "exp-sort", "data-k": c.k, "aria-label": T("Sort by ") + c.label + (on ? ", " + words[st.dir === "asc" ? 0 : 1] : ""),
        onclick: function () { onSort(c.k); } },
        h("span", { "class": "exp-sort-name", text: c.label }), on ? h("span", { "class": "exp-sortstate", text: words[st.dir === "asc" ? 0 : 1] }) : null));
    })));
  }
  function nextSort(st, key) {
    if (st.key !== key) { st.key = key; st.dir = "asc"; } else if (st.dir === "asc") st.dir = "desc"; else { st.key = ""; st.dir = ""; }
  }
  function empty(v) { return v === null || v === undefined || v === ""; }
  function cmp(get, isNum, dir) {
    var m = dir === "desc" ? -1 : 1;
    return function (a, b) {
      var x = get(a), y = get(b);
      if (empty(x) || empty(y)) return empty(x) && empty(y) ? 0 : empty(x) ? 1 : -1;      /* no value goes last either way */
      return (isNum ? (x - y) : String(x).localeCompare(String(y), "en", { numeric: true })) * m;
    };
  }
  function select(id, label, options, value, onchange) {
    var sel = h("select", { id: id, "class": "exp-select", onchange: function () { onchange(sel.value); } },
      options.map(function (o) { return h("option", { value: o[0], text: o[1], selected: o[0] === value ? "" : null }); }));
    return h("div", { "class": "exp-field" }, h("label", { "for": id, "class": "exp-label", text: label }), sel);
  }
  function searchBox(id, label, value, placeholder, oninput) {
    var input = h("input", { type: "search", id: id, "class": "exp-input", value: value, placeholder: placeholder, autocomplete: "off" });
    var clear = h("button", { type: "button", "class": "exp-clear", hidden: value ? null : "", "aria-label": T("Clear the search") }, T("Clear"));
    input.addEventListener("input", function () { clear.hidden = !input.value; oninput(input.value); });
    clear.addEventListener("click", function () { input.value = ""; clear.hidden = true; oninput(""); input.focus(); });
    return h("div", { "class": "exp-field exp-field-grow" }, h("label", { "for": id, "class": "exp-label", text: label }),
      h("div", { "class": "exp-search" }, input, clear));
  }
  A.exp = { query: query, build: build, setHash: setHash, restore: restore, memo: NAV.memo, apaClass: apaClass, apa: apa,
    sortHead: sortHead, nextSort: nextSort, cmp: cmp, select: select, searchBox: searchBox };

  /* ---------- will it burn? ---------- */
  var DEF = { o2: 30, p: 10.2, type: "" };
  var probe = { o2: DEF.o2, p: DEF.p, type: DEF.type };
  var PRESETS = [[T("Station air"), 21, 14.7], [T("10.2 psia crew atmosphere"), 26.5, 10.2], [T("8.2 psia crew atmosphere"), 34, 8.2], [T("Moon base"), 30, 10.2], [T("Spacesuit"), 100, 4.3]];
  var LIM = { o2: [10, 100, 0.5], p: [3, 24, 0.1] };
  var RO = 5, RP = 2;                                  /* "near" means within 5 % oxygen and 2 psi */
  var FUELS = ["solid", "liquid", "gas"];
  var burnSt = { sort: { key: "", dir: "" }, all: false };
  function near() {
    return D.tests.filter(function (t) {
      return t.ref === "atmosphere" && t.o2 !== null && t.p !== null && (!probe.type || t.type === probe.type);
    }).map(function (t) {
      var a = (t.o2 - probe.o2) / RO, b = (t.p - probe.p) / RP;
      return { t: t, d: Math.sqrt(a * a + b * b) };
    }).sort(function (x, y) { return x.d - y.d; });
  }
  function clampTo(k, v) {
    if (v === "" || v === null || v === undefined) return null;
    v = Number(v);
    if (!isFinite(v)) return null;
    return Math.min(LIM[k][1], Math.max(LIM[k][0], Math.round(v * 10) / 10));
  }
  function burnHash() { return build("#/burn", { o2: probe.o2, p: probe.p, fuel: probe.type }); }
  var BCOLS = [
    { k: "inv", label: T("Investigation"), get: function (x) { return x.t.acr; } },
    { k: "fuel", label: T("Fuel or material"), get: function (x) { return x.t.fuel; } },
    { k: "o2", label: T("Oxygen (%)"), num: 1, get: function (x) { return x.t.o2; } },
    { k: "p", label: T("Pressure (psi)"), num: 1, get: function (x) { return x.t.p; } },
    { k: "out", label: T("How it ended"), get: function (x) { return OUT[x.t.out]; } },
    { k: "res", label: T("Result"), sort: false }
  ];
  function stack(title, segs) {
    return h("div", { "class": "exp-stack" },
      h("p", { "class": "exp-stack-t", text: title }),
      h("div", { "class": "exp-bar", "aria-hidden": "true" }, segs.map(function (s) {
        return h("span", { "class": "exp-bar-seg " + (s.cls || ""), style: "flex-grow:" + s.n + (s.color ? ";background:" + s.color : "") });
      })),
      h("ul", { "class": "exp-stack-key" }, segs.map(function (s) {
        return h("li", null, h("span", { "class": "exp-sw " + (s.cls || ""), style: s.color ? "background:" + s.color : null, "aria-hidden": "true" }),
          h("span", { "class": "num exp-stack-n", text: fmt(s.n) }), h("span", { text: s.label }));
      })));
  }
  function burnView() {
    document.title = T("Will it burn? · One Fire, Many Worlds");
    var q = query();
    if (q.o2 !== undefined || q.p !== undefined || q.fuel !== undefined) {      /* a shared link sets the state */
      var o = clampTo("o2", q.o2), p = clampTo("p", q.p);
      probe.o2 = o === null ? DEF.o2 : o; probe.p = p === null ? DEF.p : p;
      probe.type = FUELS.indexOf(q.fuel) >= 0 ? q.fuel : "";
    }
    var result = h("div", { "class": "exp-result", "aria-live": "polite" }), chart = h("div", { "class": "exp-chart" }), list = h("div", { "class": "exp-near" });
    var inputs = {};
    var segs = PRESETS.map(function (pr) {
      return h("button", { type: "button", "class": "exp-seg", "aria-pressed": "false", onclick: function () {
        probe.o2 = pr[1]; probe.p = pr[2]; burnSt.all = false; sync(); paint(); setHash(burnHash(), true);
      } }, pr[0]);
    });
    function changed() { paint(); setHash(burnHash(), false); }
    function field(k, id, label, unit) {
      var lim = LIM[k];
      var range = h("input", { type: "range", id: id + "-range", "class": "exp-range", min: lim[0], max: lim[1], step: lim[2], value: probe[k], "aria-label": label });
      var box = h("input", { type: "number", id: id, "class": "exp-input exp-numin", min: lim[0], max: lim[1], step: "any", inputmode: "decimal", value: probe[k] });
      range.addEventListener("input", function () { probe[k] = +range.value; box.value = probe[k]; changed(); });
      box.addEventListener("input", function () {
        var v = Number(box.value);
        if (box.value !== "" && isFinite(v) && v >= lim[0] && v <= lim[1]) { probe[k] = Math.round(v * 10) / 10; range.value = probe[k]; changed(); }
      });
      box.addEventListener("change", function () {
        var v = clampTo(k, box.value);
        if (v === null) v = probe[k];
        probe[k] = v; box.value = v; range.value = v; changed();
      });
      inputs[k] = { range: range, box: box };
      return h("div", { "class": "exp-field" },
        h("label", { "for": id, "class": "exp-label", text: label }),
        h("div", { "class": "exp-slide" }, range, h("span", { "class": "exp-numwrap" }, box, h("span", { "class": "exp-unit", "aria-hidden": "true", text: unit }))));
    }
    var typeSel = h("select", { id: "exp-fuel", "class": "exp-select", onchange: function () { probe.type = typeSel.value; burnSt.all = false; changed(); } },
      h("option", { value: "", text: T("Any fuel") }), A.TYPES.map(function (t) { return h("option", { value: t[0], text: T(cap(t[0])) }); }));
    function sync() {
      ["o2", "p"].forEach(function (k) { inputs[k].range.value = probe[k]; inputs[k].box.value = probe[k]; });
      typeSel.value = probe.type;
    }
    function pressed() {
      segs.forEach(function (b, i) { b.setAttribute("aria-pressed", String(PRESETS[i][1] === probe.o2 && PRESETS[i][2] === probe.p)); });
    }
    function paintTable(focusKey) {
      var all = near(), close = all.filter(function (x) { return x.d <= 1; });
      var rows = burnSt.all && close.length > 15 ? close.slice() : all.slice(0, 15);
      var col = BCOLS.filter(function (c) { return c.k === burnSt.sort.key; })[0];
      if (col) rows.sort(cmp(col.get, col.num, burnSt.sort.dir));
      var table = rows.length ? apa(1, T("The nearest tests, by distance to the conditions you set"), h("table", null,
        sortHead(BCOLS, burnSt.sort, function (k) { nextSort(burnSt.sort, k); paintTable(k); }),
        h("tbody", null, rows.map(function (x) {
          var t = x.t, far = x.d > 1;
          return h("tr", { "class": far ? "exp-far" : null },
            h("th", { scope: "row" }, h("a", { href: "#/investigation/" + t.inv, text: t.acr }), far ? h("span", { "class": "exp-farnote", text: T("Outside the window") }) : null),
            h("td", { text: t.fuel }), h("td", { "class": "num", text: String(t.o2) }), h("td", { "class": "num", text: String(t.p) }),
            h("td", { text: OUT[t.out] }), h("td", { "class": "exp-res", title: t.res.length > 110 ? t.res : null, text: t.res.length > 110 ? t.res.slice(0, 110) + " ..." : t.res }));
        }))),
        T("Rows in lighter text are outside the 5 % and 2 psi window. Only tests whose oxygen is the chamber atmosphere are counted; inverse flames are left out.") + " " + T("Source: ") + T(D.summary.source) + ".")
        : A.state("empty", T("Nothing to show for this fuel type."), null);
      list.replaceChildren(h("h2", { "class": "exp-h2", text: T("The nearest tests") }), table,
        close.length > 15 ? h("p", { "class": "exp-more" }, h("button", { type: "button", "class": "c-btn", id: "exp-burn-all", onclick: function () {
          burnSt.all = !burnSt.all; paintTable(); var b = document.getElementById("exp-burn-all"); if (b) b.focus({ preventScroll: true });
        } }, burnSt.all ? T("Show the nearest 15") : T("Show all ") + fmt(close.length))) : null);
      if (focusKey) { var b = list.querySelector('.exp-sort[data-k="' + focusKey + '"]'); if (b) b.focus({ preventScroll: true }); }
    }
    function paint() {
      pressed();
      var all = near(), close = all.filter(function (x) { return x.d <= 1; });
      var by = { out: 0, burn: 0, none: 0, "": 0 }, types = {};
      close.forEach(function (x) { by[x.t.out] += 1; types[x.t.type] = (types[x.t.type] || 0) + 1; });
      var what = probe.type ? probe.type + " " : "";
      var known = by.out + by.burn + by.none, blocks;
      if (close.length) {
        blocks = [
          h("p", { "class": "exp-verdict" }, h("strong", { "class": "exp-big", text: plural(close.length, what + "test") }), T(" ran within ") + RO + T(" % oxygen and ") + RP + T(" psi of these conditions.")),
          h("div", { "class": "exp-stacks" },
            stack(T("How they ended"), [["burn", by.burn], ["out", by.out], ["none", by.none], ["", by[""]]].filter(function (x) { return x[1]; })
              .map(function (x) { return { cls: "exp-o-" + (x[0] || "unk"), n: x[1], label: OUT[x[0]] }; })),
            probe.type ? null : stack(T("By fuel"), A.TYPES.filter(function (t) { return types[t[0]]; })
              .map(function (t) { return { color: "var(--" + t[0] + ")", n: types[t[0]], label: T(t[0]) }; }))),
          h("p", { "class": "exp-small" }, known
            ? T("Of the ") + known + T(" with a recorded ending: ") + by.burn + T(" kept burning, ") + by.out + T(" went out by themselves") + (by.none ? ", " + by.none + T(" did not ignite or spread") : "") + ". " + by[""] + T(" have no ending in the data.")
            : T("None of them has a recorded ending in the data."),
            probe.type ? "" : T(" By fuel: ") + A.TYPES.map(function (t) { return (types[t[0]] || 0) + " " + T(t[0]); }).join(", ") + ".")
        ];
      } else {
        blocks = [
          A.tag("missing", T("No test near here")),
          h("p", { "class": "exp-verdict exp-none" }, h("strong", { "class": "exp-big", text: T("No " + what + "test") }), T(" ran within ") + RO + T(" % oxygen and ") + RP + T(" psi of these conditions.")),
          h("p", { "class": "exp-small", text: all.length ? T("The closest " + what + "test is ") + all[0].t.acr + T(" at ") + all[0].t.o2 + T(" % oxygen and ") + all[0].t.p + " psi." : T("The repository has no " + what + "test with both oxygen and pressure.") })
        ];
      }
      result.className = "exp-result" + (close.length ? "" : " exp-result-none");
      result.replaceChildren.apply(result, blocks);
      chart.replaceChildren(A.plane(null, null, { o2: probe.o2, p: probe.p, ro: RO, rp: RP, type: probe.type }));
      paintTable();
    }
    var controls = h("section", { "class": "c-panel exp-controls", "aria-label": T("Atmosphere and fuel") },
      h("div", { "class": "exp-field" }, h("p", { "class": "exp-label", id: "exp-start", text: T("Start from") }),
        h("div", { "class": "exp-segs", role: "group", "aria-labelledby": "exp-start" }, segs)),
      field("o2", "exp-o2", T("Oxygen in the atmosphere, %"), "%"),
      field("p", "exp-p", T("Pressure, psi"), "psi"),
      h("div", { "class": "exp-field exp-fuelrow" },
        h("div", { "class": "exp-field" }, h("label", { "for": "exp-fuel", "class": "exp-label", text: T("Fuel") }), typeSel),
        h("button", { type: "button", "class": "c-btn", id: "exp-reset", onclick: function () {
          probe.o2 = DEF.o2; probe.p = DEF.p; probe.type = DEF.type; burnSt.sort = { key: "", dir: "" }; burnSt.all = false;
          sync(); paint(); setHash(burnHash(), true);
        } }, T("Reset"))));
    A.main.replaceChildren(h("div", { "class": "wrap exp-page exp-burn" },
      A.intro(T("Will it burn?"), T("Set an atmosphere and a fuel, and see what was actually tested near it and how those tests ended. This is evidence, not a prediction: where nothing was tested, it says so.")),
      h("div", { "class": "exp-burn-top" }, controls, chart),
      result, list));
    sync(); paint();
    setHash(burnHash(), false);
    restore("burn");
  }

  /* ---------- data ---------- */
  var filt = { inv: "", type: "", q: "", row: "", sort: { key: "", dir: "" }, shown: 100, open: {}, sig: "" };
  var DCOLS = [
    { k: "inv", label: T("Investigation"), get: function (t) { return t.acr; } },
    { k: "id", label: T("Test"), cls: "exp-hide-m", get: function (t) { return t.id; } },
    { k: "fuel", label: T("Fuel or material"), get: function (t) { return t.fuel; } },
    { k: "o2", label: T("Oxygen (%)"), num: 1, get: function (t) { return t.o2; } },
    { k: "p", label: T("Pressure (psi)"), num: 1, get: function (t) { return t.p; } },
    { k: "flow", label: T("Flow (cm/s)"), num: 1, cls: "exp-hide-m", get: function (t) { return t.flow; } },
    { k: "out", label: T("How it ended"), cls: "exp-hide-s", get: function (t) { return t.out ? OUT[t.out] : ""; } },
    { k: "res", label: T("Result"), cls: "exp-hide-s", sort: false },
    { k: "row", label: T("Source row"), cls: "exp-hide-l", get: function (t) { return t.row; } }
  ];
  function dataHash() { return build("#/data", { inv: filt.inv, fuel: filt.type, q: filt.q, row: filt.row, sort: filt.sort.key, dir: filt.sort.key ? filt.sort.dir : "" }); }
  function readData(parts) {
    var q = query(), first = parts && parts[0] ? parts[0] : "";
    filt.inv = ""; filt.type = ""; filt.q = ""; filt.row = ""; filt.sort = { key: "", dir: "" };
    if (first && first.charAt(0) !== "?") {                         /* the older links other views use */
      try {
        if (first === "material") filt.q = parts[1] ? decodeURIComponent(parts[1]) : "";      /* #/data/material/Kapton: every test of one material */
        else { filt.inv = decodeURIComponent(first); filt.row = parts[1] ? decodeURIComponent(parts[1]) : ""; }
      } catch (e) { /* a broken link shows every test */ }
      return;
    }
    filt.inv = q.inv || ""; filt.type = FUELS.indexOf(q.fuel) >= 0 ? q.fuel : ""; filt.q = q.q || ""; filt.row = q.row || "";
    if (DCOLS.some(function (c) { return c.k === q.sort && c.sort !== false; })) filt.sort = { key: q.sort, dir: q.dir === "desc" ? "desc" : "asc" };
  }
  function matching() {
    var q = filt.q.trim().toLowerCase(), byNumber = /^n\d+$/.test(filt.row);   /* #/data/PSI-20/n327 opens one test by the platform's own number */
    var rows = D.tests.filter(function (t) {
      return (!filt.inv || t.inv === filt.inv) && (!filt.row || (byNumber ? t.n === Number(filt.row.slice(1)) : String(t.row) === filt.row)) && (!filt.type || t.type === filt.type) &&
        (!q || (t.fuel + " " + t.acr + " " + t.id + " " + t.res + " " + t.family).toLowerCase().indexOf(q) >= 0);
    });
    var col = DCOLS.filter(function (c) { return c.k === filt.sort.key; })[0];
    if (col) rows.sort(cmp(col.get, col.num, filt.sort.dir));
    return rows;
  }
  function detail(t) {
    function line(label, value, isNum) {
      return h("div", null, h("dt", { text: label }), empty(value) ? h("dd", { "class": "exp-none-v", text: T("Not recorded") }) : h("dd", { "class": isNum ? "num" : null, text: String(value) }));
    }
    var range = t.o2 === null ? "" : (t.o2min !== null && t.o2max !== null && t.o2min !== t.o2max ? t.o2min + T(" to ") + t.o2max + " %" : "");
    return h("div", { "class": "exp-detail" },
      h("dl", { "class": "exp-dl" },
        line(T("Test"), t.id, true), line(T("Date"), t.date, true), line(T("Fuel or material"), t.fuel),
        t.family ? line(T("Fuel family"), t.family) : null, t.shape ? line(T("Sample shape"), t.shape) : null,
        line(T("Oxygen (%)"), t.o2, true), range ? line(T("Oxygen range"), range, true) : null,
        line(T("Oxygen measured in"), t.o2 === null ? "" : t.ref === "burner" ? T("burner gas (inverse flame)") : T("chamber atmosphere")),
        line(T("Pressure (psi)"), t.p, true), line(T("Flow (cm/s)"), t.flow, true),
        t.dir ? line(T("Flow direction"), t.dir) : null, t.dil ? line(T("Diluent"), t.dil) : null,
        line(T("How it ended"), t.out ? OUT[t.out] : ""),
        h("div", { "class": "exp-dl-wide" }, h("dt", { text: T("Result") }), t.res ? h("dd", { lang: "en", text: t.res }) : h("dd", { "class": "exp-none-v", text: T("Not recorded") })),
        h("div", { "class": "exp-dl-wide" }, h("dt", { text: T("Source table") }), h("dd", { "class": "exp-srcfile", text: t.src })),
        line(T("Source row"), t.row, true)),
      h("p", { "class": "exp-detail-act" }, h("a", { "class": "c-btn", href: "#/investigation/" + t.inv }, T("Open the investigation") + ": " + t.acr)));
  }
  /* The same columns, header and number format as data/tests.csv (checked line by line against it), built in the browser. */
  var CSV = [["investigation", "inv"], ["acronym", "acr"], ["test_id", "id"], ["date", "date"], ["fuel_type", "type"], ["fuel_or_material", "fuel"],
    ["material_family", "family"], ["shape_and_size", "shape"], ["oxygen_pct_min", "o2min"], ["oxygen_pct_max", "o2max"], ["oxygen_reference", "ref"],
    ["pressure_psia", "pmin"], ["flow_cm_s", "flow"], ["flow_direction", "dir"], ["diluent_or_suppressant", "dil"], ["outcome_class", "out"],
    ["result", "res"], ["source_table", "src"], ["source_row", "row"]];
  function csvCell(v) {
    if (v === null || v === undefined) return "";
    if (typeof v === "number") v = Number.isInteger(v) ? v + ".0" : String(v);
    v = String(v);
    return /[",\r\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  }
  function csvOf(list) {
    return [CSV.map(function (c) { return c[0]; }).join(",")].concat(list.map(function (t) {
      return CSV.map(function (c) { return csvCell(t[c[1]]); }).join(",");
    })).join("\n") + "\n";
  }
  function slug(x) { return String(x).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40); }
  function download(list, what) {
    var name = "one-fire-many-worlds-tests-" + what + "-" + list.length + (list.length === 1 ? "-row" : "-rows") + ".csv";
    var url = URL.createObjectURL(new Blob(["\ufeff" + csvOf(list)], { type: "text/csv;charset=utf-8" }));
    var a = h("a", { href: url, download: name, hidden: "" });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }
  var sel = {};                                      /* chosen tests, by number: they stay chosen across sorting, filters and pages */
  function selCount() { return Object.keys(sel).length; }
  function sortedAll() {
    var list = D.tests.slice(), col = DCOLS.filter(function (c) { return c.k === filt.sort.key; })[0];
    if (col) list.sort(cmp(col.get, col.num, filt.sort.dir));
    return list;
  }
  function dataView(parts) {
    readData(parts);
    document.title = T("Data · One Fire, Many Worlds");
    var sig = JSON.stringify([filt.inv, filt.type, filt.q, filt.row, filt.sort]);
    if (sig !== filt.sig) { filt.shown = 100; filt.open = {}; filt.sig = sig; }
    var invOpts = [["", T("All")]].concat(D.investigations.filter(function (i) { return i.tests; }).map(function (i) { return [i.id, i.acr]; }));
    var fuelOpts = [["", T("All")]].concat(A.TYPES.map(function (t) { return [t[0], T(cap(t[0]))]; }));
    var counter = h("p", { "class": "exp-count", "aria-live": "polite" }), clearAll = h("button", { type: "button", "class": "c-btn c-btn-quiet exp-clearall", onclick: function () {
      filt.inv = ""; filt.type = ""; filt.q = ""; filt.row = ""; changed();
      var s = document.getElementById("exp-dq"), i = document.getElementById("exp-dinv"), f = document.getElementById("exp-dfuel");
      if (s) { s.value = ""; s.nextSibling.hidden = true; } if (i) i.value = ""; if (f) f.value = "";
    } }, T("Clear filters"));
    var notice = h("div", { "class": "exp-notice-slot" }), body = h("div", { "class": "exp-dbody" }), current = [], root = null;
    var dlFilt = h("button", { type: "button", "class": "c-btn exp-download", id: "exp-dl-filtered", hidden: "", onclick: function () {
      var what = [filt.inv && (A.inv(filt.inv) ? A.inv(filt.inv).acr : filt.inv), filt.type, filt.q && "search-" + filt.q, filt.row && "row-" + filt.row].filter(Boolean).join("-");
      download(current, slug(what) || "filtered");
    } });
    var selText = h("p", { "class": "exp-seltext", "aria-live": "polite" });
    var selBar = h("div", { "class": "exp-selbar", hidden: "", role: "region", "aria-label": T("Selection") }, selText,
      h("button", { type: "button", "class": "c-btn", id: "exp-dl-selected", onclick: function () {
        download(sortedAll().filter(function (t) { return sel[t.n]; }), "selected");
      } }, T("Download selected (CSV)")),
      h("button", { type: "button", "class": "c-btn c-btn-quiet", id: "exp-sel-clear", onclick: function () {
        sel = {}; refresh(); var b = document.getElementById("exp-selall"); if (b) b.focus({ preventScroll: true });
      } }, T("Clear selection")));
    var headBox = h("input", { type: "checkbox", id: "exp-selall", "aria-label": T("Select every test that matches these filters") });
    headBox.addEventListener("change", function () {
      var all = headBox.checked;
      current.forEach(function (t) { if (all) sel[t.n] = true; else delete sel[t.n]; });
      [].slice.call(body.querySelectorAll(".exp-rowcheck")).forEach(function (x) { x.checked = !!sel[x.getAttribute("data-n")]; x.closest("tr").classList.toggle("exp-sel", x.checked); });
      selUpdate();
    });
    function selUpdate() {
      var n = selCount(), inView = current.filter(function (t) { return sel[t.n]; }).length, hiddenN = n - inView;
      headBox.checked = current.length > 0 && inView === current.length; headBox.indeterminate = inView > 0 && inView < current.length;
      selBar.hidden = !n;
      selText.replaceChildren.apply(selText, [h("span", { "class": "num", text: fmt(n) }), " " + T(n === 1 ? "test selected" : "tests selected")]
        .concat(hiddenN ? [", ", h("span", { "class": "num", text: fmt(hiddenN) }), T(" not shown with these filters")] : []));
      measure();
    }
    function changed() { filt.shown = 100; filt.open = {}; filt.sig = JSON.stringify([filt.inv, filt.type, filt.q, filt.row, filt.sort]); setHash(dataHash(), false); refresh(); }
    var bar = h("div", { "class": "exp-bar-filters", role: "search" },
      select("exp-dinv", T("Investigation"), invOpts, filt.inv, function (v) { filt.inv = v; filt.row = ""; changed(); }),
      select("exp-dfuel", T("Fuel"), fuelOpts, filt.type, function (v) { filt.type = v; changed(); }),
      searchBox("exp-dq", T("Search"), filt.q, T("Material, test or result"), function (v) { filt.q = v; changed(); }),
      h("div", { "class": "exp-bar-end" }, counter, clearAll), selBar);
    function rowFor(t) {
      var id = "exp-t" + t.n, open = !!filt.open[t.n];
      var box = h("input", { type: "checkbox", "class": "exp-rowcheck", "data-n": t.n, checked: sel[t.n] ? "" : null, "aria-label": T("Select test ") + (t.id || "#" + t.n) + ", " + t.acr });
      box.addEventListener("change", function () { if (box.checked) sel[t.n] = true; else delete sel[t.n]; tr.classList.toggle("exp-sel", box.checked); selUpdate(); });
      var tr = h("tr", { "class": "exp-drow" + (open ? " exp-open" : "") + (sel[t.n] ? " exp-sel" : ""), "data-n": t.n },
        h("th", { scope: "row" }, h("div", { "class": "exp-cellwrap" }, h("label", { "class": "exp-check" }, box),
          h("button", { type: "button", "class": "exp-rowbtn", "aria-expanded": String(open), "aria-controls": id, title: T("Show the details of this test") }, t.acr))),
        h("td", { "class": "num exp-hide-m", text: t.id }), h("td", { text: t.fuel }),
        h("td", { "class": "num", text: t.o2 === null ? "" : String(t.o2) }), h("td", { "class": "num", text: t.p === null ? "" : String(t.p) }),
        h("td", { "class": "num exp-hide-m", text: t.flow === null ? "" : String(t.flow) }), h("td", { "class": "exp-hide-s", text: t.out ? OUT[t.out] : "" }),
        h("td", { "class": "exp-hide-s exp-res", text: t.res.length > 120 ? t.res.slice(0, 120) + " ..." : t.res }), h("td", { "class": "num exp-hide-l", text: t.row }));
      tr.addEventListener("click", function (e) {
        if (e.target.closest && (e.target.closest("a") || e.target.closest(".exp-check"))) return;
        var now = !filt.open[t.n], btn = tr.querySelector(".exp-rowbtn"), next = tr.nextSibling;
        if (now) { filt.open[t.n] = true; tr.parentNode.insertBefore(h("tr", { "class": "exp-drow-detail", id: id }, h("td", { colspan: DCOLS.length }, detail(t))), next); }
        else { delete filt.open[t.n]; if (next && next.id === id) next.parentNode.removeChild(next); }
        tr.classList.toggle("exp-open", now); btn.setAttribute("aria-expanded", String(now));
      });
      return open ? [tr, h("tr", { "class": "exp-drow-detail", id: id }, h("td", { colspan: DCOLS.length }, detail(t)))] : [tr];
    }
    function refresh(focusKey) {
      var rows = matching(), any = filt.inv || filt.type || filt.q || filt.row;
      counter.replaceChildren(h("span", { "class": "num", text: fmt(rows.length) }), T(" of ") + fmt(D.tests.length) + T(" tests"));
      clearAll.hidden = !any;
      current = rows;
      dlFilt.hidden = !any || !rows.length;
      dlFilt.textContent = rows.length === 1 ? T("Download this test (CSV)") : T("Download these ") + fmt(rows.length) + T(" tests (CSV)");
      selUpdate();
      var byNumber = /^n\d+$/.test(filt.row);
      notice.replaceChildren(filt.row ? h("p", { "class": "exp-notice" }, (byNumber ? T("Showing test ") + (rows[0] ? rows[0].id || "#" + rows[0].n : filt.row) : T("Showing row ") + filt.row) + T(" of ") + filt.inv + ". ",
        h("button", { type: "button", id: "d-all", "class": "c-btn", onclick: function () { filt.row = ""; changed(); } }, T("Show every test of this investigation"))) : "");
      if (!rows.length) {
        body.replaceChildren(A.state("empty", T("No test matches"), T("No test matches. Clear the search or set a filter back to All."),
          h("button", { type: "button", "class": "c-btn", onclick: function () { clearAll.click(); } }, T("Clear filters"))));
        return;
      }
      var page = rows.slice(0, filt.shown), tbody = h("tbody", null, page.map(rowFor));
      var shownNote = h("p", { "class": "exp-small exp-shown", text: T("Showing ") + fmt(page.length) + T(" of ") + fmt(rows.length) + T(" matching tests.") });
      var more = h("p", { "class": "exp-more" });
      function moreBtn() {
        more.replaceChildren(rows.length > filt.shown ? h("button", { type: "button", id: "d-more", "class": "c-btn", onclick: function () {
          var from = filt.shown; filt.shown += 100;
          var add = rows.slice(from, filt.shown);
          add.forEach(function (t) { rowFor(t).forEach(function (r) { tbody.appendChild(r); }); });
          shownNote.textContent = T("Showing ") + fmt(Math.min(filt.shown, rows.length)) + T(" of ") + fmt(rows.length) + T(" matching tests.");
          moreBtn();
          var b = document.getElementById("d-more");
          if (b) b.focus({ preventScroll: true }); else { var last = tbody.querySelector('tr[data-n="' + add[0].n + '"] .exp-rowbtn'); if (last) last.focus({ preventScroll: true }); }
        } }, T("Show 100 more")) : "");
      }
      moreBtn();
      var table = apa(1, T("Every test in the repository, one row per test"), h("table", { "class": "exp-dtable" },
        sortHead(DCOLS.map(function (c) { return c.k === "inv" ? Object.assign({}, c, { pre: h("label", { "class": "exp-check" }, headBox) }) : c; }), filt.sort, function (k) { nextSort(filt.sort, k); changed(); var b = body.querySelector('.exp-sort[data-k="' + k + '"]'); if (b) b.focus({ preventScroll: true }); }), tbody),
        T("Source: ") + T(D.summary.source) + T(". The download is the cleaned table in English; the oxygen reference column tells chamber atmosphere from burner gas."));
      table.classList.add("exp-dfig");
      body.replaceChildren(table, shownNote, more);
      if (focusKey) { var b = body.querySelector('.exp-sort[data-k="' + focusKey + '"]'); if (b) b.focus({ preventScroll: true }); }
      measure();
    }
    root = h("div", { "class": "wrap exp-page exp-data" },
      h("div", { "class": "exp-introrow" },
        A.intro(T("Data"), T("Every individual test behind this site, in one table with one format: ") + fmt(D.summary.tests) + T(" tests from the repository, ") + fmt(D.summary.withO2AndPressure) + T(" of them with oxygen and pressure together. Each row names the table and row it came from.")),
        h("div", { "class": "exp-dls" }, dlFilt,
          h("a", { "class": "c-btn c-btn-primary exp-download", href: "data/tests.csv", download: "one-fire-many-worlds-tests.csv", text: T("Download all tests (CSV)") }))),
      bar, notice, body);
    function measure() { if (!root) return; root.style.setProperty("--exp-barh", (getComputedStyle(bar).position === "sticky" ? bar.offsetHeight : 0) + "px"); }
    A.main.replaceChildren(root);
    refresh();
    measure();
    restore("data");
  }
  window.addEventListener("resize", function () {
    var root = document.querySelector(".exp-data"), bar = root && root.querySelector(".exp-bar-filters");
    if (bar) root.style.setProperty("--exp-barh", (getComputedStyle(bar).position === "sticky" ? bar.offsetHeight : 0) + "px");
  });

  A.section({ id: "timeline", label: T("Timeline"), href: "#/timeline" }, timelineView);
  A.section({ id: "burn", label: T("Will it burn?"), href: "#/burn" }, burnView);
  A.section({ id: "data", label: T("Data"), href: "#/data" }, dataView);
})();
