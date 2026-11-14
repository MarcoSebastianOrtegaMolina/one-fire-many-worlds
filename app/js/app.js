/* One Fire, Many Worlds. No libraries: a hash router and views drawn from data/data.js and data/content.js. */
(function () {
  "use strict";
  var D = window.OFMW, C = window.OFMW_CONTENT;
  var main = document.getElementById("main");
  var SVGNS = "http://www.w3.org/2000/svg";
  var REL = { high: 3, medium: 2, low: 1, "n/a": 0 };
  var TYPES = [["solid", "Solids: fabrics, acrylic, wax"], ["liquid", "Liquids: fuel droplets"], ["gas", "Gases"]];
  var FRONTS = [["prevention", "Prevent"], ["detection", "Detect"], ["suppression", "Suppress"]];
  var SECTIONS = [{ id: "world", label: "Worlds", href: "#/world/moon" }];
  var VIEWS = {}, lastSection = "";

  /* ---------- helpers ---------- */
  function h(tag, props) {
    var n = document.createElement(tag), i, k;
    if (props) for (k in props) {
      if (k === "text") n.textContent = props[k];
      else if (k === "html") n.innerHTML = props[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), props[k]);
      else if (props[k] !== null && props[k] !== undefined && props[k] !== false) n.setAttribute(k, props[k]);
    }
    for (i = 2; i < arguments.length; i++) add(n, arguments[i]);
    return n;
  }
  function add(parent, child) {
    if (child === null || child === undefined || child === false) return;
    if (Array.isArray(child)) { child.forEach(function (c) { add(parent, c); }); return; }
    parent.appendChild(typeof child === "string" || typeof child === "number" ? document.createTextNode(String(child)) : child);
  }
  function s(tag, attrs, parent, text) {
    var n = document.createElementNS(SVGNS, tag), k;
    for (k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    if (parent) parent.appendChild(n);
    return n;
  }
  function fmt(n) { return Number(n).toLocaleString("en-US"); }
  function plural(n, one, many) { return fmt(n) + " " + (n === 1 ? one : (many || one + "s")); }
  function num(text) { return h("span", { "class": "num", text: text }); }
  function inv(id) { return D.investigations.filter(function (i) { return i.id === id; })[0]; }
  function world(id) { return D.worlds.filter(function (w) { return w.id === id; })[0]; }

  /* ---------- gravity axis ---------- */
  var ON_AXIS = ["station", "moon", "mars", "earth"];
  function axisX(g) { return 3 + g * 94; }                 /* percent of the axis width */
  function worldCount(w) {
    if (w.id === "earth") return { n: w.extra.n, text: plural(w.extra.n, "sample") + " compared with normal gravity" };
    if (w.id === "mars") return { n: 0, text: "No data" };
    return { n: w.near.total, text: w.near.total ? plural(w.near.total, "test") + " in air like this" : "No test in air like this" };
  }
  function worldButton(w, current) {
    var c = worldCount(w);
    return h("button", { type: "button", "class": "world", "aria-pressed": String(w.id === current),
      onclick: function () { location.hash = "#/world/" + w.id; } },
      h("b", { text: w.name }), h("span", { text: w.gravity }), h("span", { "class": "count" + (c.n ? "" : " none"), text: c.text }));
  }
  function gravityNav(current) {
    var axis = h("div", { "class": "axis", "aria-hidden": "true" });
    axis.appendChild(h("div", { "class": "track" }));
    axis.appendChild(h("div", { "class": "void", style: "left:" + (axisX(0) + 1.2) + "%; right:" + (100 - axisX(1) + 1.2) + "%" }));
    axis.appendChild(h("span", { "class": "void-note", style: "left:" + axisX(0.69) + "%", text: "no combustion data between the two ends" }));
    var svg = s("svg", { viewBox: "0 0 100 100", preserveAspectRatio: "none" }, null);
    ON_AXIS.forEach(function (id, k) {
      var w = world(id), x = axisX(w.g);
      axis.appendChild(h("span", { "class": "dot" + (id === current ? " on" : ""), style: "left:" + x + "%" }));
      axis.appendChild(h("span", { "class": "tick" + (k === 0 ? " first" : k === 3 ? " last" : ""), style: "left:" + x + "%",
        text: ["0 g", "1/6 g", "3/8 g", "1 g"][k] }));
      s("line", { x1: x, y1: 0, x2: 12.5 + k * 25, y2: 100, "class": id === current ? "on" : "" }, svg);
    });
    axis.appendChild(svg);
    return h("nav", { "class": "gravity", "aria-label": "Worlds, ordered by gravity" },
      h("div", { "class": "gravity-row" },
        h("div", null, axis, h("div", { "class": "worlds" }, ON_AXIS.map(function (id) { return worldButton(world(id), current); }))),
        h("div", { "class": "offaxis" }, h("p", { text: "Off the scale: worn in any gravity" }), worldButton(world("suit"), current))),
      h("p", { "class": "axis-caption", text: "Every flight test in NASA's repository ran in microgravity. One experiment repeated its samples in normal gravity. Nothing has been burned at the gravity of the Moon or Mars." }));
  }

  /* ---------- oxygen-pressure plane ---------- */
  var PX = { x0: 56, x1: 744, y0: 392, y1: 22, pmin: 4, pmax: 24, omin: 10, omax: 45 };
  function px(p) { return PX.x0 + (p - PX.pmin) / (PX.pmax - PX.pmin) * (PX.x1 - PX.x0); }
  function py(o) { return PX.y0 - (o - PX.omin) / (PX.omax - PX.omin) * (PX.y0 - PX.y1); }
  function planePoints(only) {
    var groups = {}, out = 0, burner = 0;
    D.tests.forEach(function (t) {
      if (t.o2 === null || t.p === null || !t.type) return;
      if (only && !only(t)) return;
      if (t.ref !== "atmosphere") { burner++; return; }
      if (t.p > PX.pmax) { out++; return; }
      var key = t.type + "|" + Math.round(t.o2 * 2) / 2 + "|" + Math.round(t.p * 4) / 4;
      groups[key] = (groups[key] || 0) + 1;
    });
    var pts = Object.keys(groups).map(function (k) { var a = k.split("|"); return { type: a[0], o2: +a[1], p: +a[2], n: groups[k] }; });
    pts.sort(function (a, b) { return b.n - a.n; });
    return { pts: pts, drawn: pts.reduce(function (a, q) { return a + q.n; }, 0), out: out, burner: burner };
  }
  function plane(w, focusInv) {
    var data = planePoints(), focus = null;
    if (!w) { w = { id: "", name: focusInv }; focus = planePoints(function (t) { return t.inv === focusInv; }); }
    var svg = s("svg", { viewBox: "0 0 760 440", role: "img",
      "aria-label": focus ? "Oxygen against pressure. " + fmt(focus.drawn) + " tests of this investigation are highlighted over all " + fmt(data.drawn) + "."
        : "Oxygen against pressure for " + fmt(data.drawn) + " tests. " + w.name + ": " + worldCount(w).text + "." }, null);
    var p, o;
    for (p = 4; p <= 24; p += 2) { s("line", { x1: px(p), y1: PX.y0, x2: px(p), y2: PX.y1, "class": "gl" }, svg); s("text", { x: px(p), y: PX.y0 + 16, "text-anchor": "middle" }, svg, String(p)); }
    for (o = 10; o <= 45; o += 5) { s("line", { x1: PX.x0, y1: py(o), x2: PX.x1, y2: py(o), "class": "gl" }, svg); s("text", { x: PX.x0 - 8, y: py(o) + 4, "text-anchor": "end" }, svg, o + " %"); }
    s("text", { x: (PX.x0 + PX.x1) / 2, y: PX.y0 + 34, "text-anchor": "middle" }, svg, "Pressure, psi");
    s("text", { x: 14, y: (PX.y0 + PX.y1) / 2, "text-anchor": "middle", transform: "rotate(-90 14 " + (PX.y0 + PX.y1) / 2 + ")" }, svg, "Oxygen in the atmosphere");

    var airOn = w.id === "station" || w.id === "earth";
    s("rect", { x: px(13.5), y: py(23.5), width: px(16) - px(13.5), height: py(19.5) - py(23.5), "class": "zone" + (airOn ? " on" : "") }, svg);
    s("rect", { x: px(4), y: py(45), width: px(11) - px(4), height: py(30) - py(45), "class": "zone" + (w.id === "moon" ? " on" : "") }, svg);
    s("rect", { x: px(4), y: PX.y1 - 14, width: px(5.4) - px(4), height: 14, "class": "zone" + (w.id === "suit" ? " on empty" : "") }, svg);

    data.pts.forEach(function (q) {
      var c = s("circle", { cx: px(q.p), cy: py(q.o2), r: Math.min(15, 2.2 + Math.sqrt(q.n) * 1.15), "class": "pt " + q.type + (focus ? " dim" : "") }, svg);
      s("title", {}, c, plural(q.n, q.type + " test") + " at " + q.o2 + " % oxygen and " + q.p + " psi");
    });
    if (focus) focus.pts.forEach(function (q) {
      var c = s("circle", { cx: px(q.p), cy: py(q.o2), r: Math.min(15, 2.6 + Math.sqrt(q.n) * 1.15), "class": "pt hot " + q.type }, svg);
      s("title", {}, c, plural(q.n, "test") + " of this investigation at " + q.o2 + " % oxygen and " + q.p + " psi");
    });
    [[14.7, 21], [10.2, 26.5], [8.2, 34]].forEach(function (a) {
      s("path", { d: "M" + (px(a[0]) - 6) + " " + (py(a[1]) - 6) + " l12 12 m0 -12 l-12 12", "class": "cross" }, svg);
    });
    s("text", { x: px(4) + 6, y: py(45) + 16, "class": "lbl" }, svg, "Moon base and rover");
    s("text", { x: px(16) + 8, y: py(18.4), "class": "lbl" }, svg, w.id === "earth" ? "Earth air (tested in microgravity)" : "Station and Earth air");
    s("text", { x: px(5.4) + 6, y: PX.y1 - 3, "class": "lbl" + (w.id === "suit" ? " miss" : "") }, svg, "Spacesuit: 100 % oxygen at 4.3 psi, above this chart");
    if (w.id === "mars") s("text", { x: px(14), y: py(41), "class": "lbl miss", "text-anchor": "middle" }, svg, "Mars: no atmosphere given, no data at its gravity");
    s("path", { d: "M" + PX.x0 + " " + PX.y1 + " V" + PX.y0 + " H" + PX.x1, "class": "ax" }, svg);

    var key = s("svg", { viewBox: "0 0 12 12", "aria-hidden": "true" }, null);
    s("path", { d: "M1 1 L11 11 M11 1 L1 11" }, key);
    var legend = h("div", { "class": "legend" }, TYPES.map(function (t) { return h("span", { style: "--c:var(--" + t[0] + ")", text: t[1] }); }),
      h("span", { "class": "cross-key" }, key, "Atmospheres NASA considers for crews"));
    if (focus) return h("figure", null, h("div", { "class": "canvas" }, svg), legend,
      h("figcaption", null, focus.drawn ? "The tests of this investigation that record both oxygen and pressure are drawn in full colour over every other test in the repository."
        : "This investigation has no test with both oxygen and pressure recorded, so nothing is highlighted."));
    return h("figure", null, h("div", { "class": "canvas" }, svg), legend,
      h("figcaption", null, "Each circle groups the tests run at one oxygen level and pressure; larger means more tests. ",
        num(fmt(data.drawn)), " of ", num(fmt(D.summary.withO2AndPressure)), " tests with both values are drawn: ", num(fmt(data.out)),
        " are above 24 psi and ", num(fmt(data.burner)), " are inverse flames, where the oxygen leaves the burner and is not the chamber air."));
  }

  /* ---------- ranking ---------- */
  function rank(w, front) {
    var near = w.near.byInv || {};
    return D.investigations.filter(function (i) { return i.front === front; }).map(function (i) {
      var n = near[i.id] || 0, why;
      if (w.id === "earth" && i.id === "PSI-99") { n = D.gravityPairs.length; why = plural(n, "sample") + " also burned in normal gravity"; }
      else if (w.id === "earth" && i.group === "ground study") { n = 0.5; why = "Ground study built on flight data"; }
      else if (n) why = plural(n, "test") + " in air like this";
      else if (w.id === "station" && i.group === "flight" && i.o2 === null && i.tests) { n = 0.5; why = plural(i.tests, "test") + " in flight; oxygen and pressure not recorded"; }
      else if (i.tests) why = "Not tested in this air; " + plural(i.tests, "test") + " elsewhere";
      else why = "No individual tests in the data";
      return { inv: i, n: n, why: why + ". " + i.relevance.charAt(0).toUpperCase() + i.relevance.slice(1) + " relevance." };
    }).sort(function (a, b) {
      return (b.n > 0) - (a.n > 0) || REL[b.inv.relevance] - REL[a.inv.relevance] || b.n - a.n || b.inv.tests - a.inv.tests;
    });
  }
  function invLink(i) { return h("a", { href: "#/investigation/" + i.id, text: i.acr }); }

  /* ---------- world view ---------- */
  function worldView(id) {
    var w = world(id) || world("moon"), c = C.worlds[w.id], cnt = worldCount(w);
    document.title = w.name + " · One Fire, Many Worlds";
    var byType = w.near.byType || {};
    var breakdown = w.near.total ? TYPES.map(function (t) { return (byType[t[0]] || 0) + " " + t[0]; }).join(", ") : "";
    var facts = h("dl", { "class": "facts" },
      h("div", null, h("dt", { text: "Gravity" }), h("dd", { text: w.gravity.charAt(0).toUpperCase() + w.gravity.slice(1) })),
      h("div", null, h("dt", { text: "Air" }), h("dd", { text: w.air })),
      h("div", { "class": cnt.n ? "" : "zero" }, h("dt", { text: "Evidence" }),
        h("dd", null, h("strong", { text: w.id === "earth" ? fmt(w.extra.n) : fmt(w.near.total) }), " ",
          w.id === "earth" ? "samples burned in orbit and compared with normal gravity" : "tests in air like this" + (breakdown ? " (" + breakdown + ")" : ""),
          h("br"), h("span", { "class": "note", text: w.nearNote + "." }))),
      w.id !== "earth" ? h("div", null, h("dt", { text: "Also" }), h("dd", null, w.extra.label + ": ", h("strong", { text: w.extra.text || fmt(w.extra.n) }))) : null);

    var sheet = h("div", { "class": "sheet" },
      h("div", { "class": "lead" },
        h("div", null, h("h1", { text: w.name }), h("p", { "class": "headline", text: c.headline }), facts, h("p", { "class": "takeaway", text: c.takeaway })),
        plane(w)),
      h("h2", { text: "What is known, front by front" }),
      h("p", { text: "NASA's fire safety work has three fronts. Investigations are ordered by how much they tested in this world's air, then by relevance to fire safety. The order is our reading of the data." }),
      h("div", { "class": "fronts" }, FRONTS.map(function (f) {
        var list = rank(w, f[0]), text = c[f[0]];
        return h("section", { "class": "front" },
          h("h3", { text: f[1] }),
          h("p", { "class": "known" + (text === "No data." ? " nodata" : ""), text: text === "No data." ? "No data for this world." : text }),
          h("h4", { text: "Investigations, most relevant first" }),
          h("ol", { "class": "rank" }, list.map(function (r) { return h("li", null, h("span", null, invLink(r.inv), h("span", { "class": "why", text: r.why }))); })));
      })),
      h("p", { "class": "support" }, "Supporting flame science, not tied to one front: ",
        D.investigations.filter(function (i) { return i.front === "basic science"; }).map(function (i, k) {
          var n = (w.near.byInv || {})[i.id];
          return [k ? ", " : "", invLink(i), n ? " (" + plural(n, "test") + " in air like this)" : ""];
        }), "."));

    if (w.id === "earth") {
      add(sheet, [h("h2", { text: "The same sample, in orbit and on the ground" }),
        h("p", { text: "Saffire-II burned nine samples in a cargo vehicle and repeated each in normal gravity. Gravity changes the verdict for some materials." }),
        h("div", { "class": "table" }, h("table", null,
          h("thead", null, h("tr", null, ["Sample", "Material", "Thickness", "Flow", "Burned in microgravity", "Burned in normal gravity"].map(function (t) { return h("th", { text: t }); }))),
          h("tbody", null, D.gravityPairs.map(function (g) {
            var zero = function (v) { return /^~ 0/.test(v); };
            return h("tr", null, h("th", { text: g.sample }), h("td", { text: g.material }), h("td", { text: g.thickness }), h("td", { text: g.flowDir }),
              h("td", { "class": zero(g.microBurn) ? "noburn" : "burn", text: g.microBurn }), h("td", { "class": zero(g.normalBurn) ? "noburn" : "burn", text: g.normalBurn }));
          })))),
        h("p", { "class": "note", text: "Source: PSI-99 experimental table. Airflow 20 cm/s, oxygen about 21.5 to 22.1 %. \"Complete\" means the whole sample burned." })]);
    }

    var items = C.agenda.filter(function (a) { return a.worlds.indexOf(w.id) >= 0; });
    add(sheet, [h("h2", { text: "What to burn next" }),
      h("p", { text: "Experiments that do not exist yet for this world. The list and its order are our proposal, drawn from the gaps in the data." }),
      items.length ? h("ul", { "class": "agenda" }, items.map(function (a) {
        return h("li", null,
          h("div", null, h("h3", { text: a.title }), h("p", { "class": "tag", text: a.front })),
          h("div", null, h("p", { text: a.why }), h("p", { text: "Closest evidence today: " + a.closest + (a.planned ? " " + a.planned : "") })));
      })) : h("p", { "class": "note", text: "Nothing listed for this world." })]);

    main.replaceChildren(h("div", { "class": "wrap" }, gravityNav(w.id), sheet));
  }

  /* ---------- router ---------- */
  function setNav(section) {
    var nav = document.getElementById("nav");
    nav.replaceChildren.apply(nav, SECTIONS.map(function (x) {
      return h("a", { href: x.href, "aria-current": x.id === section ? "page" : null, text: x.label });
    }));
  }
  function route() {
    var parts = location.hash.replace(/^#\/?/, "").split("/"), section = parts[0] || "world";
    if (!D || !C) {
      main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "error" }, h("h1", { text: "The data did not load" }),
        h("p", { text: "This page needs data/data.js and data/content.js next to it. Rebuild them with: python scripts/construir_datos_app.py" }))));
      return;
    }
    var v = VIEWS[section];
    if (!v) { section = "world"; }
    setNav(v ? v.nav : "world");
    if (section !== "world" || lastSection !== "world") window.scrollTo(0, 0);
    lastSection = section;
    if (v) v.fn(parts.slice(1)); else worldView(parts[1] || "moon");
  }
  var themeBtn = document.getElementById("theme");
  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }
  function paintTheme() { themeBtn.textContent = currentTheme() === "dark" ? "Light sheet" : "Dark board"; }
  themeBtn.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("ofmw-theme", next); } catch (e) { /* private mode: the choice lasts for this visit */ }
    paintTheme();
  });
  try { var saved = localStorage.getItem("ofmw-theme"); if (saved) document.documentElement.setAttribute("data-theme", saved); } catch (e) { /* ignore */ }
  paintTheme();
  window.OFMW_APP = { h: h, s: s, add: add, fmt: fmt, plural: plural, num: num, inv: inv, world: world, plane: plane, invLink: invLink,
    D: D, C: C, main: main, TYPES: TYPES, FRONTS: FRONTS, REL: REL,
    section: function (def, fn) { SECTIONS.push(def); VIEWS[def.id] = { fn: fn, nav: def.id }; },
    route: function (id, nav, fn) { VIEWS[id] = { fn: fn, nav: nav }; },
    start: function () { window.addEventListener("hashchange", route); route(); } };
})();
