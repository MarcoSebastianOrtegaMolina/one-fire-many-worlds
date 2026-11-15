/* Oxygen against pressure: the shared chart. A.plane(w, focusInv, mark) keeps the signature of js/app.js and its
   three modes: one world (w), one investigation highlighted (w null, focusInv), or a mark from Will it burn? (mark).
   The chart is drawn at the real pixel width of its box (one SVG unit is one pixel), so the type stays at 13 px or
   more on any screen; it is redrawn when the box changes width. A box narrower than 40rem gets a taller frame with
   fewer ticks. Class prefix ch-. */
(function () {
  "use strict";
  var A = window.OFMW_APP;
  if (!A) return;
  var h = A.h, s = A.s, T = A.T, D = A.D, fmt = A.fmt, plural = A.plural, num = A.num;

  A.es({
    "Oxygen in the test atmosphere, %": "Oxígeno en la atmósfera de la prueba, %",
    "Pressure of the test atmosphere, psi": "Presión de la atmósfera de la prueba, psi",
    "Fuel type": "Tipo de combustible", "Marks": "Marcas", "Zones": "Zonas",
    "Dashed box: the air planned for a habitat": "Recuadro punteado: el aire previsto para un hábitat",
    "What the table of this investigation measured: ": "Lo que midió la tabla de esta investigación: ",
    "The table of this investigation does not say what was measured.": "La tabla de esta investigación no dice qué se midió.",
    "Data: the experimental tables of the PSI investigations, ": "Datos: las tablas experimentales de las investigaciones de PSI, ",
    "NASA PSI Data Repository": "repositorio PSI de NASA",
    "Tests, count": "Pruebas, número", "Of this investigation, count": "De esta investigación, número",
    "Oxygen and pressure of the tests, and the air of this world": "Oxígeno y presión de las pruebas, y el aire de este mundo",
    "Oxygen and pressure of the tests, with this investigation highlighted": "Oxígeno y presión de las pruebas, con esta investigación resaltada",
    "Oxygen and pressure of the tests, with the atmosphere you set": "Oxígeno y presión de las pruebas, con la atmósfera que elegiste",
    "Fuels shown": "Combustibles a la vista",
    "Solids": "Sólidos", "Liquids": "Líquidos", "Gases": "Gases",
    "Show as table": "Ver como tabla", "Hide table": "Ocultar tabla",
    "Fuel": "Combustible", "Oxygen, %": "Oxígeno, %", "Tests": "Pruebas", "Of this investigation": "De esta investigación",
    "Groups of tests drawn in the figure": "Grupos de pruebas dibujados en la figura",
    "One row per circle of the figure: tests of one fuel family at one oxygen level and pressure. ":
      "Un renglón por cada círculo de la figura: pruebas de una familia de combustible con un nivel de oxígeno y una presión. ",
    " % oxygen, ": " % de oxígeno, ",
    " of this investigation": " de esta investigación",
    "Source: ": "Fuente: ",
    "Chart of the tests. Use the arrow keys to read each group.": "Gráfica de las pruebas. Usa las flechas del teclado para leer cada grupo.",
    "Circle size: number of tests": "Tamaño del círculo: número de pruebas",
    "Filled box: the air of this world": "Recuadro relleno: el aire de este mundo",
    "Red: air with no tests": "Rojo: aire sin pruebas",
    "Highlighted: this investigation": "Resaltado: esta investigación",
    "Oval: the window counted as near your atmosphere": "Óvalo: la ventana que cuenta como cercana a tu atmósfera"
  });

  var P = { pmin: 4, pmax: 24, omin: 10, omax: 45 };
  var CROSSES = [[14.7, 21], [10.2, 26.5], [8.2, 34]];
  var FUELS = [["solid", "Solids"], ["liquid", "Liquids"], ["gas", "Gases"]];
  var uid = 0;

  /* Same grouping as planePoints() in js/app.js: the counts in the note must not change. */
  function points(only) {
    var groups = {}, out = 0, burner = 0;
    D.tests.forEach(function (t) {
      if (t.o2 === null || t.p === null || !t.type) return;
      if (only && !only(t)) return;
      if (t.ref !== "atmosphere") { burner++; return; }
      if (t.p > P.pmax) { out++; return; }
      var key = t.type + "|" + Math.round(t.o2 * 2) / 2 + "|" + Math.round(t.p * 4) / 4;
      groups[key] = (groups[key] || 0) + 1;
    });
    var pts = Object.keys(groups).map(function (k) { var a = k.split("|"); return { type: a[0], o2: +a[1], p: +a[2], n: groups[k] }; });
    pts.sort(function (a, b) { return b.n - a.n; });
    return { pts: pts, drawn: pts.reduce(function (a, q) { return a + q.n; }, 0), out: out, burner: burner };
  }

  /* Greedy word wrap by an average glyph width; good enough for short labels in a known font. */
  function wrap(text, maxPx, charPx) {
    var words = String(text).split(" "), lines = [], line = "", max = Math.max(6, Math.floor(maxPx / charPx));
    words.forEach(function (wd) {
      if (!line) line = wd;
      else if ((line + " " + wd).length <= max) line += " " + wd;
      else { lines.push(line); line = wd; }
    });
    if (line) lines.push(line);
    return lines;
  }
  function label(svg, lines, x, y, cls, anchor) {
    var t = s("text", { x: x, y: y, "class": cls, "text-anchor": anchor || "start" }, svg);
    lines.forEach(function (l, k) { s("tspan", { x: x, dy: k ? 17 : 0 }, t, l); });
    return t;
  }

  function plane(w, focusInv, mark) {
    var data = points(), focus = null, k = ++uid;
    if (!w) { w = { id: "", name: focusInv || "" }; if (focusInv) focus = points(function (t) { return t.inv === focusInv; }); }
    var on = { solid: true, liquid: true, gas: true };
    var aria = focus ? T("Oxygen against pressure. ") + fmt(focus.drawn) + T(" tests of this investigation are highlighted over all ") + fmt(data.drawn) + "."
      : mark ? T("Oxygen against pressure for ") + fmt(data.drawn) + T(" tests, with a cross at ") + mark.o2 + T(" percent oxygen and ") + mark.p + " psi."
      : T("Oxygen against pressure for ") + fmt(data.drawn) + T(" tests. ") + T(w.name) + ": " + A.worldCount(w).text + ".";

    /* Locations: groups at the same oxygen and pressure, for the tooltip and the keyboard. */
    var focusAt = {};
    if (focus) focus.pts.forEach(function (q) { var key = q.o2 + "|" + q.p; (focusAt[key] = focusAt[key] || []).push(q); });

    var canvas = h("div", { "class": "ch-canvas", tabindex: "0", role: "group", "aria-label": T("Chart of the tests. Use the arrow keys to read each group.") });
    var tip = h("div", { "class": "ch-tip", hidden: "", "aria-hidden": "true" });
    var live = h("div", { "class": "ch-sr", "aria-live": "polite" });
    var svg = null, geo = null, locs = [], cur = -1, lastW = 0;

    function draw(W) {
      W = Math.max(280, Math.round(W));
      lastW = W;
      var narrow = W < 640;
      var left = narrow ? 50 : 64, right = narrow ? 14 : 24, bottom = narrow ? 58 : 62;
      var plotW = W - left - right;
      var cw = 8;   /* average width of a 14 px label glyph */
      var suitText = T("Spacesuit: 100 % oxygen at 4.3 psi, above this chart");
      var suitX = left + (5.4 - P.pmin) / (P.pmax - P.pmin) * plotW + 8;
      var suitLines = wrap(suitText, W - right - suitX, cw);
      var top = 14 + suitLines.length * 17 + 10;
      var plotH = narrow ? Math.round(Math.min(Math.max(plotW * 1.25, 360), 560)) : Math.round(Math.min(Math.max(plotW * 0.5, 340), 560));
      var H = top + plotH + bottom;
      var x0 = left, x1 = left + plotW, y0 = top + plotH, y1 = top;
      var kr = Math.min(1.5, Math.max(0.85, plotW / 688));
      function px(p) { return x0 + (p - P.pmin) / (P.pmax - P.pmin) * (x1 - x0); }
      function py(o) { return y0 - (o - P.omin) / (P.omax - P.omin) * (y0 - y1); }
      geo = { px: px, py: py, W: W, H: H };

      var n = s("svg", { viewBox: "0 0 " + W + " " + H, width: W, height: H, "class": "ch-svg", role: "img", "aria-label": aria }, null);
      var p, o, stepP = narrow ? 4 : 2, stepO = narrow ? 10 : 5;
      for (p = P.pmin; p <= P.pmax; p += stepP) {
        s("line", { x1: px(p), y1: y0, x2: px(p), y2: y1, "class": "ch-gl" }, n);
        s("text", { x: px(p), y: y0 + 21, "text-anchor": "middle" }, n, String(p));
      }
      for (o = P.omin; o <= P.omax; o += stepO) {
        s("line", { x1: x0, y1: py(o), x2: x1, y2: py(o), "class": "ch-gl" }, n);
        s("text", { x: x0 - 9, y: py(o) + 4.5, "text-anchor": "end" }, n, String(o));
      }
      s("text", { x: narrow ? W / 2 : (x0 + x1) / 2, y: y0 + 48, "text-anchor": "middle", "class": "ch-ttl" }, n, T("Pressure of the test atmosphere, psi"));
      s("text", { x: 15, y: (y0 + y1) / 2, "text-anchor": "middle", "class": "ch-ttl", transform: "rotate(-90 15 " + (y0 + y1) / 2 + ")" }, n, T("Oxygen in the test atmosphere, %"));

      /* Zones: Station and Earth air, Moon base and rover, and the suit, whose air is above the chart (no tests). */
      var airOn = w.id === "station" || w.id === "earth";
      s("rect", { x: px(13.5), y: py(23.5), width: px(16) - px(13.5), height: py(19.5) - py(23.5), "class": "ch-zone" + (airOn ? " ch-on" : "") }, n);
      s("rect", { x: px(4), y: py(45), width: px(11) - px(4), height: py(30) - py(45), "class": "ch-zone" + (w.id === "moon" ? " ch-on" : "") }, n);
      s("rect", { x: px(4), y: 8, width: Math.max(10, px(5.4) - px(4)), height: 12, "class": "ch-zone ch-miss" + (w.id === "suit" ? " ch-on" : "") }, n);

      /* circles: every group, dimmed under a highlighted investigation or a mark of another fuel */
      data.pts.forEach(function (q) {
        var dim = focus || (mark && mark.type && mark.type !== q.type);
        s("circle", { cx: px(q.p), cy: py(q.o2), r: Math.min(15, 2.2 + Math.sqrt(q.n) * 1.15) * kr,
          "class": "ch-pt ch-" + q.type + (dim ? " ch-dim" : "") + (on[q.type] ? "" : " ch-off") }, n);
      });
      if (focus) focus.pts.forEach(function (q) {
        s("circle", { cx: px(q.p), cy: py(q.o2), r: Math.min(15, 2.6 + Math.sqrt(q.n) * 1.15) * kr,
          "class": "ch-pt ch-hot ch-" + q.type + (on[q.type] ? "" : " ch-off") }, n);
      });
      CROSSES.forEach(function (a) {
        s("path", { d: "M" + (px(a[0]) - 7) + " " + (py(a[1]) - 7) + " l14 14 m0 -14 l-14 14", "class": "ch-cross" }, n);
      });

      /* zone names */
      label(n, wrap(T("Moon base and rover"), px(11) - px(4) - 14, cw), px(4) + 8, py(45) + 20, "ch-lbl" + (w.id === "moon" ? " ch-lbl-on" : ""));
      var airText = w.id === "earth" ? T("Earth air (tested in microgravity)") : T("Station and Earth air");
      var roomRight = x1 - px(16) - 10;
      if (roomRight >= 150) label(n, wrap(airText, roomRight, cw), px(16) + 8, py(21.5) + 4, "ch-lbl" + (airOn ? " ch-lbl-on" : ""));
      else label(n, wrap(airText, Math.min(plotW * 0.55, 190), cw), (px(13.5) + px(16)) / 2, py(19.5) + 20, "ch-lbl" + (airOn ? " ch-lbl-on" : ""), "middle");
      label(n, suitLines, suitX, 18, "ch-lbl ch-lbl-miss");
      if (w.id === "mars") label(n, wrap(T("Mars: no atmosphere given, no data at its gravity"), plotW * (narrow ? 0.62 : 0.4), cw), px(16.5), py(41.5), "ch-lbl ch-lbl-miss", "middle");
      s("path", { d: "M" + x0 + " " + y1 + " V" + y0 + " H" + x1, "class": "ch-ax" }, n);

      if (mark) {
        var mx = px(Math.min(P.pmax, Math.max(P.pmin, mark.p))), my = py(Math.min(P.omax, Math.max(P.omin, mark.o2)));
        s("ellipse", { cx: mx, cy: my, rx: Math.abs(px(P.pmin + mark.rp) - px(P.pmin)), ry: Math.abs(py(P.omin) - py(P.omin + mark.ro)), "class": "ch-probe" }, n);
        s("path", { d: "M" + (mx - 11) + " " + my + " h22 M" + mx + " " + (my - 11) + " v22", "class": "ch-probe-x" }, n);
      }
      geo.ring = s("circle", { cx: -50, cy: -50, r: 8, "class": "ch-ring", visibility: "hidden" }, n);

      /* locations the tooltip can name: visible fuels only, ordered by pressure then oxygen */
      var byKey = {};
      data.pts.forEach(function (q) {
        if (!on[q.type]) return;
        var key = q.o2 + "|" + q.p;
        if (!byKey[key]) byKey[key] = { o2: q.o2, p: q.p, groups: [], focus: [], r: 0 };
        byKey[key].groups.push(q);
        byKey[key].r = Math.max(byKey[key].r, Math.min(15, 2.2 + Math.sqrt(q.n) * 1.15) * kr);
      });
      Object.keys(byKey).forEach(function (key) {
        byKey[key].focus = (focusAt[key] || []).filter(function (q) { return on[q.type]; });
      });
      locs = Object.keys(byKey).map(function (key) { return byKey[key]; }).sort(function (a, b) { return a.p - b.p || a.o2 - b.o2; });
      locs.forEach(function (l) { l.x = px(l.p); l.y = py(l.o2); });

      if (svg) canvas.replaceChild(n, svg); else canvas.insertBefore(n, canvas.firstChild);
      svg = n;
      cur = -1; hide();
    }

    function tipText(l) {
      var rows = l.groups.map(function (q) {
        var f = l.focus.filter(function (x) { return x.type === q.type; })[0];
        return plural(q.n, q.type + " test") + (f ? " (" + fmt(f.n) + T(" of this investigation") + ")" : "");
      });
      return { head: l.o2 + T(" % oxygen, ") + l.p + " psi", rows: rows };
    }
    function show(i) {
      if (i < 0 || i >= locs.length) { hide(); return; }
      cur = i;
      var l = locs[i], t = tipText(l);
      tip.replaceChildren.apply(tip, [h("p", { "class": "ch-tip-h", text: t.head })].concat(t.rows.map(function (r) { return h("p", { text: r }); })));
      tip.hidden = false;
      geo.ring.setAttribute("cx", l.x); geo.ring.setAttribute("cy", l.y); geo.ring.setAttribute("r", l.r + 4);
      geo.ring.setAttribute("visibility", "visible");
      /* place it beside the point, kept inside the chart (and so inside the screen) */
      var scale = svg.getBoundingClientRect().width / geo.W || 1;
      var x = l.x * scale, y = l.y * scale, cwid = canvas.clientWidth, chei = canvas.clientHeight;
      var tw = tip.offsetWidth, th = tip.offsetHeight;
      var left = x + 14 + tw > cwid - 4 ? x - 14 - tw : x + 14;
      var top = y - th - 10 < 4 ? y + 14 : y - th - 10;
      tip.style.left = Math.max(4, Math.min(cwid - tw - 4, left)) + "px";
      tip.style.top = Math.max(4, Math.min(chei - th - 4, top)) + "px";
      live.textContent = t.head + ". " + t.rows.join(". ") + ".";
    }
    function hide() {
      tip.hidden = true;
      if (geo && geo.ring) geo.ring.setAttribute("visibility", "hidden");
    }
    function nearest(ev) {
      var r = svg.getBoundingClientRect(), scale = r.width / geo.W || 1;
      var x = (ev.clientX - r.left) / scale, y = (ev.clientY - r.top) / scale, best = -1, bd = Infinity;
      locs.forEach(function (l, i) {
        var d = Math.sqrt((l.x - x) * (l.x - x) + (l.y - y) * (l.y - y)) - l.r;
        if (d < bd) { bd = d; best = i; }
      });
      return bd <= (ev.pointerType === "mouse" ? 10 : 22) ? best : -1;
    }
    canvas.addEventListener("pointermove", function (ev) {
      if (ev.pointerType !== "mouse" || !svg) return;
      var i = nearest(ev);
      if (i < 0) { cur = -1; hide(); } else if (i !== cur || tip.hidden) show(i);
    });
    canvas.addEventListener("pointerleave", function (ev) { if (ev.pointerType === "mouse" && document.activeElement !== canvas) hide(); });
    canvas.addEventListener("pointerdown", function (ev) {
      if (!svg || ev.pointerType === "mouse") return;
      var i = nearest(ev);
      if (i < 0) hide(); else show(i);
    });
    canvas.addEventListener("focus", function () { if (canvas.matches(":focus-visible")) show(cur >= 0 ? cur : 0); });
    canvas.addEventListener("blur", hide);
    canvas.addEventListener("keydown", function (ev) {
      var i = cur, last = locs.length - 1;
      if (ev.key === "ArrowRight" || ev.key === "ArrowDown") i = cur < last ? cur + 1 : 0;
      else if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") i = cur > 0 ? cur - 1 : last;
      else if (ev.key === "Home") i = 0;
      else if (ev.key === "End") i = last;
      else if (ev.key === "Escape") { hide(); return; }
      else return;
      ev.preventDefault();
      show(i);
    });
    var seen = false;
    function outside(ev) {   /* a tap anywhere else closes the tooltip; the listener leaves with the chart */
      if (canvas.isConnected) seen = true;
      else if (seen) { document.removeEventListener("pointerdown", outside); return; }
      if (!canvas.contains(ev.target)) hide();
    }
    document.addEventListener("pointerdown", outside);

    draw(760);
    canvas.appendChild(tip);
    canvas.appendChild(live);
    if (window.ResizeObserver) {
      var pending = 0;
      var ro = new ResizeObserver(function (entries) {
        if (!canvas.isConnected && seen) { ro.disconnect(); return; }
        if (canvas.isConnected) seen = true;
        var wd = entries[0].contentRect.width;
        if (!wd || Math.abs(wd - lastW) < 1) return;
        cancelAnimationFrame(pending);
        pending = requestAnimationFrame(function () { draw(wd); });
      });
      ro.observe(canvas);
    }

    /* fuel switches: hiding a fuel dims its circles, the scale stays */
    var togs = FUELS.map(function (f) {
      var b = h("button", { type: "button", "class": "ch-tog", "aria-pressed": "true", style: "--c:var(--" + f[0] + ")", "data-fuel": f[0],
        onclick: function () {
          on[f[0]] = !on[f[0]];
          b.setAttribute("aria-pressed", String(on[f[0]]));
          draw(lastW);
        } }, T(f[1]));
      return b;
    });
    var tools = h("div", { "class": "ch-tools", role: "group", "aria-label": T("Fuels shown") },
      h("span", { "class": "ch-tools-l", text: T("Fuels shown") }), togs);

    var crossKey = s("svg", { viewBox: "0 0 12 12", "aria-hidden": "true", "class": "ch-key-x" }, null);
    s("path", { d: "M1 1 L11 11 M11 1 L1 11" }, crossKey);
    var zoneOn = w.id === "station" || w.id === "earth" || w.id === "moon" || w.id === "suit";
    /* legend in three titled groups: what the colours are, what the marks are, what the boxes are */
    function group(title, items) {
      return h("div", { "class": "ch-key-g" }, h("p", { "class": "ch-key-t", text: title }), h("div", { "class": "c-key" }, items));
    }
    var legend = h("div", { "class": "ch-key" },
      group(T("Fuel type"), A.TYPES.map(function (t) { return h("span", { style: "--c:var(--" + t[0] + ")", text: t[1] }); })),
      group(T("Marks"), [
        h("span", { "class": "ch-k-plain" }, crossKey, T("Atmospheres NASA considers for crews"), ": ",
          CROSSES.map(function (a, i) { return [i ? " " : "", h("span", { "class": "num ch-atm", text: a[1] + " %, " + a[0] + " psi" + (i < CROSSES.length - 1 ? ";" : "") })]; })),
        h("span", { "class": "ch-k-plain ch-k-size", text: T("Circle size: number of tests") }),
        focus ? h("span", { "class": "ch-k-plain ch-k-hot", text: T("Highlighted: this investigation") }) : null,
        mark ? h("span", { "class": "ch-k-plain ch-k-oval", text: T("Oval: the window counted as near your atmosphere") }) : null]),
      group(T("Zones"), [
        zoneOn && !focus && !mark ? h("span", { "class": "ch-k-plain ch-k-zone", text: T("Filled box: the air of this world") }) : null,
        h("span", { "class": "ch-k-plain", text: T("Dashed box: the air planned for a habitat") }),
        h("span", { "class": "ch-k-plain ch-k-miss", text: T("Red: air with no tests") })]));

    /* the note keeps what the old caption said, with the same counts, and adds where the data come from */
    var note;
    if (mark) note = [T("The cross is the atmosphere you set and the oval is the window counted as near it. "),
      mark.o2 > P.omax ? T("This oxygen level is above the chart, so the cross sits at its top edge. ") : "", T("Each circle groups tests at one oxygen level and pressure.")];
    else if (focus) note = [focus.drawn ? T("The tests of this investigation that record both oxygen and pressure are drawn in full colour over every other test in the repository.")
      : T("This investigation has no test with both oxygen and pressure recorded, so nothing is highlighted.")];
    else note = [T("Each circle groups the tests run at one oxygen level and pressure; larger means more tests. "),
      num(fmt(data.drawn)), T(" of "), num(fmt(D.summary.withO2AndPressure)), T(" tests with both values are drawn: "), num(fmt(data.out)),
      T(" are above 24 psi and "), num(fmt(data.burner)), T(" are inverse flames, where the oxygen leaves the burner and is not the chamber air.")];
    var invRec = focusInv ? A.inv(focusInv) : null;
    if (invRec) note.push(" " + (invRec.measures && invRec.measures.length
      ? T("What the table of this investigation measured: ") + invRec.measures.map(T).join(", ") + "."
      : T("The table of this investigation does not say what was measured.")));
    var source = T("Data: the experimental tables of the PSI investigations, ") + (D.summary && D.summary.source ? T(D.summary.source) : T("NASA PSI Data Repository")) + ".";
    note.push(" " + source);

    /* the same groups as a table, for reading without the picture */
    var rowsData = data.pts.slice().sort(function (a, b) { return a.type < b.type ? -1 : a.type > b.type ? 1 : a.o2 - b.o2 || a.p - b.p; });
    var tableId = "ch-table-" + k;
    var tblNumEl = h("span", { "class": "c-fig-num", text: T("Table ") + 1 });
    var tbl = h("table", null,
      h("thead", null, h("tr", null, h("th", { scope: "col", text: T("Fuel type") }), h("th", { scope: "col", "class": "num", text: T("Oxygen, %") }),
        h("th", { scope: "col", "class": "num", text: T("Pressure, psi") }), h("th", { scope: "col", "class": "num", text: T("Tests, count") }),
        focus ? h("th", { scope: "col", "class": "num", text: T("Of this investigation, count") }) : null)),
      h("tbody", null, rowsData.map(function (q) {
        var f = focus ? (focusAt[q.o2 + "|" + q.p] || []).filter(function (x) { return x.type === q.type; })[0] : null;
        return h("tr", null, h("td", { text: T(q.type.charAt(0).toUpperCase() + q.type.slice(1)) }), h("td", { "class": "num", text: String(q.o2) }),
          h("td", { "class": "num", text: String(q.p) }), h("td", { "class": "num", text: fmt(q.n) }), focus ? h("td", { "class": "num", text: f ? fmt(f.n) : "0" }) : null);
      })));
    var tableBox = h("div", { "class": "ch-tablebox", id: tableId, hidden: "" },
      h("p", { "class": "ch-table-cap" }, tblNumEl, h("span", { "class": "c-fig-title", text: T("Groups of tests drawn in the figure") })),
      h("div", { "class": "c-table ch-table" }, tbl),
      h("p", { "class": "c-fig-note" }, h("em", { text: T("Note. ") }),
        T("One row per circle of the figure: tests of one fuel family at one oxygen level and pressure. "), source));
    var tblBtn = h("button", { type: "button", "class": "c-btn ch-tblbtn", "aria-expanded": "false", "aria-controls": tableId,
      onclick: function () {
        var open = tableBox.hidden;
        tableBox.hidden = !open;
        tblBtn.setAttribute("aria-expanded", String(open));
        tblBtn.textContent = open ? T("Hide table") : T("Show as table");
      } }, T("Show as table"));

    var numEl = h("span", { "class": "c-fig-num", text: T("Figure ") + 1 });
    var title = focus || focusInv ? T("Oxygen and pressure of the tests, with this investigation highlighted")
      : mark ? T("Oxygen and pressure of the tests, with the atmosphere you set") : T("Oxygen and pressure of the tests, and the air of this world");
    var fig = h("figure", { "class": "c-fig ch-fig" },
      h("figcaption", { "class": "ch-cap" }, numEl, h("span", { "class": "c-fig-title", text: title })),
      h("div", { "class": "ch-body" }, tools, canvas, legend,
        h("p", { "class": "c-fig-note" }, h("em", { text: T("Note. ") }), note),
        h("div", { "class": "ch-more" }, tblBtn), tableBox));
    /* a view with several figures or tables renumbers this one: setNumber(figure, table) */
    fig.setNumber = function (n, t) { numEl.textContent = T("Figure ") + n; if (t) tblNumEl.textContent = T("Table ") + t; };
    return fig;
  }

  A.plane = plane;
})();
