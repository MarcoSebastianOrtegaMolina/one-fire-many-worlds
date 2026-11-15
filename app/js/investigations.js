/* Investigations: every test of every investigation as a mark on one shared oxygen axis, the record of each
   investigation, and the side-by-side comparison. Classes start with inv-; no rule of legacy.css is needed. */
(function () {
  "use strict";
  var A = window.OFMW_APP, h = A.h, add = A.add, fmt = A.fmt, plural = A.plural, D = A.D, C = A.C, T = A.T;
  if (!D || !C) return;

  A.es({
    "Each row is one investigation and each mark is one of its tests, placed at the oxygen it burned in. Filter, open one, or pick up to three to compare.":
      "Cada renglón es una investigación y cada marca es una de sus pruebas, puesta en el oxígeno en que ardió. Filtra, abre una o elige hasta tres para compararlas.",
    "Front": "Frente", "Fuel": "Combustible", "Equipment": "Equipo", "Sort by": "Ordenar por", "View": "Vista",
    "Relevance": "Relevancia", "Number of tests": "Número de pruebas", "Name": "Nombre",
    "Strips": "Tiras", "Table": "Tabla", "Gas": "Gas", "Solid": "Sólido", "Liquid": "Líquido", "Other": "Otro",
    "Gases": "Gases", "Solids": "Sólidos", "Liquids": "Líquidos",
    "Prevention": "Prevención", "Detection": "Detección", "Suppression": "Supresión", "Flame science": "Ciencia de la flama",
    "High relevance": "Relevancia alta", "Medium relevance": "Relevancia media", "Low relevance": "Relevancia baja",
    "High": "Alta", "Medium": "Media", "Low": "Baja",
    "Showing ": "Se ven ", " of ": " de ", " investigations": " investigaciones",
    "Clear filters": "Quitar filtros",
    "No investigation matches these filters": "Ninguna investigación cumple estos filtros",
    "Turn a fuel back on, or set the front and the equipment to All.": "Vuelve a prender un combustible, o pon el frente y el equipo en Todos.",
    "with oxygen": "con oxígeno", "test": "prueba", "tests": "pruebas",
    "No oxygen recorded": "Sin oxígeno registrado", "No individual tests in the data": "Sin pruebas individuales en los datos",
    "Oxygen in the chamber, %": "Oxígeno en la cámara, %",
    "Solids up to ": "Sólidos hasta ", "Moon base 30 %": "Base lunar 30 %", "No solid tested here": "Ningún sólido probado aquí",
    "Oxygen of every test, investigation by investigation": "Oxígeno de cada prueba, investigación por investigación",
    "Each mark is a test, placed at the oxygen of the chamber atmosphere; taller marks hold more tests at that level. Inverse flames, where the oxygen leaves the burner, are not drawn: it is not the chamber air. The striped band runs from the most oxygen any solid burned in (":
      "Cada marca es una prueba, puesta en el oxígeno de la atmósfera de la cámara; las marcas más altas juntan más pruebas en ese nivel. Las flamas inversas, donde el oxígeno sale del quemador, no se dibujan: no es el aire de la cámara. La franja rayada va del oxígeno más alto en que ardió un sólido (",
    " %) to the 30 % expected in a Moon base. Data: experimental tables of the PSI repository, downloaded November 13, 2026.":
      " %) al 30 % esperado en una base lunar. Datos: tablas experimentales del repositorio PSI, descargadas el 13 de noviembre de 2026.",
    ": ": ": ", " tests with oxygen recorded, from ": " pruebas con oxígeno registrado, de ",
    "Use the left and right arrow keys to read each mark.": "Usa las flechas izquierda y derecha para leer cada marca.",
    "Oxygen": "Oxígeno", "Pressure": "Presión", "How it ended": "Cómo terminó", "How they ended": "Cómo terminaron",
    "Tests": "Pruebas", " and ": " y ", " more": " más",
    "went out by itself": "se apagó sola", "kept burning": "siguió ardiendo", "did not ignite or spread": "no encendió o no se propagó",
    "Not classified in the data": "Sin clasificar en los datos",
    "Compare": "Comparar", "Selected": "Elegida", "Remove": "Quitar", "Clear": "Limpiar", "Compare ": "Comparar ",
    "Selected to compare": "Elegidas para comparar",
    "Pick one more to compare.": "Elige una más para comparar.", "You can add one more.": "Puedes agregar una más.",
    "Three is the most. Remove one to pick another.": "Tres es el máximo. Quita una para elegir otra.",
    "Three are already selected. Remove one to pick this.": "Ya hay tres elegidas. Quita una para elegir esta.",
    "The investigations, their tests and their oxygen and pressure": "Las investigaciones, sus pruebas y su oxígeno y presión",
    "Investigation": "Investigación", "With oxygen": "Con oxígeno", "Oxygen (%)": "Oxígeno (%)", "Pressure (psi)": "Presión (psi)",
    "Not recorded": "No registrado",
    "Tests are the individual tests in the cleaned data; some investigations publish only test days or no table at all. Oxygen and pressure are the ranges of the chamber atmosphere in the experimental tables of the PSI repository, downloaded November 13, 2026.":
      "Las pruebas son las pruebas individuales de los datos limpios; algunas investigaciones publican solo días de prueba o ninguna tabla. Oxígeno y presión son los rangos de la atmósfera de la cámara en las tablas experimentales del repositorio PSI, descargadas el 13 de noviembre de 2026.",
    "All investigations": "Todas las investigaciones",
    "No such investigation": "No existe esa investigación", "There is no record called ": "No hay ninguna ficha llamada ",
    "See all investigations": "Ver todas las investigaciones",
    "Key facts": "Datos clave", "Fuels": "Combustibles", "Shape and size": "Forma y tamaño", "Airflow": "Flujo de aire", "Years": "Años",
    " individual tests in the data": " pruebas individuales en los datos", "Not given in the table": "No viene en la tabla", "Not given": "No viene",
    "Oxygen and pressure of the tests of ": "Oxígeno y presión de las pruebas de ", " over every test in PSI": " sobre todas las pruebas de PSI",
    "Chamber oxygen and pressure from the experimental tables of the PSI repository, downloaded November 13, 2026.":
      "Oxígeno y presión de la cámara según las tablas experimentales del repositorio PSI, descargadas el 13 de noviembre de 2026.",
    "What it found": "Qué encontró", "The study, step by step": "El estudio, paso a paso", "Steps of the study": "Pasos del estudio",
    "Objective, hypothesis and method are NASA's text from the PSI record, unchanged.": "Objetivo, hipótesis y método son el texto de NASA de la ficha de PSI, sin cambios.",
    "Objective": "Objetivo", "Hypothesis": "Hipótesis", "Method": "Método", "What was measured, and with what": "Qué se midió y con qué",
    "Results": "Resultados", "Limits": "Límites", "Who did it": "Quién lo hizo", "Who ran it": "Quién la hizo",
    "Read more": "Leer más", "Show less": "Mostrar menos", "Not stated in the PSI record.": "La ficha de PSI no lo dice.",
    "What ": "Qué ", " varied, what it measured and with what equipment": " varió, qué midió y con qué equipo",
    "Aspect": "Aspecto", "What the PSI record and its table say": "Lo que dicen la ficha de PSI y su tabla",
    "What was varied": "Qué se varió", "What was measured": "Qué se midió", "Facility or equipment": "Instalación o equipo",
    "Equipment group on this site": "Grupo de equipo en este sitio", "Where it ran": "Dónde se hizo",
    "Instrument for each variable": "Instrumento de cada variable",
    "The PSI record does not name it; it has to be read in the reports of the investigation.": "La ficha de PSI no lo nombra; hay que leerlo en los informes de la investigación.",
    "How tests ended": "Cómo terminaron las pruebas", "Not visible in the table": "No se ve en la tabla",
    "Facility and platform are quoted from the PSI record, in English. What was varied and what was measured are read from the columns of its experimental table.":
      "Instalación y plataforma se citan de la ficha de PSI, en inglés. Qué se varió y qué se midió se leen de las columnas de su tabla experimental.",
    "The finding is stated at the top of this page. This is the evidence behind it.": "El hallazgo está arriba en esta página. Esta es la evidencia detrás.",
    "First ": "Primeras ", " tests of ": " pruebas de ", "Source: ": "Fuente: ", "See all its tests in Data": "Ver todas sus pruebas en Datos",
    "The team did not note a specific caveat for this investigation.": "El equipo no anotó una advertencia específica para esta investigación.",
    "Summary, finding and caveat were written with AI from the PSI record and its reports, then checked against the data.":
      "El resumen, el hallazgo y la advertencia se escribieron con IA a partir de la ficha de PSI y sus informes, y luego se revisaron contra los datos.",
    "Open the PSI record": "Abrir la ficha de PSI", "publication": "publicación", "publications": "publicaciones",
    " listed": " en la lista", "Record version ": "Versión de la ficha ", ", modified ": ", modificada ", "License ": "Licencia ",
    "Benefits on Earth": "Beneficios en la Tierra", "More investigations": "Más investigaciones", "Previous": "Anterior", "Next": "Siguiente",
    "Test": "Prueba", "Fuel or material": "Combustible o material", "Airflow (cm/s)": "Flujo de aire (cm/s)", "Result": "Resultado",
    "Source table and row": "Tabla y renglón de origen",
    "Data from the experimental tables of NASA's PSI repository, downloaded November 13, 2026. Each test opens in Data; the last column gives the table and the row it comes from. Oxygen is that of the chamber atmosphere. An empty cell means the table does not record that value. The result is quoted in English, as in the table.":
      "Datos de las tablas experimentales del repositorio PSI de NASA, descargadas el 13 de noviembre de 2026. Cada prueba se abre en Datos; la última columna da la tabla y el renglón de donde sale. El oxígeno es el de la atmósfera de la cámara. Una celda vacía significa que la tabla no registra ese valor. El resultado se cita en inglés, como en la tabla.",
    "* Oxygen of the gas leaving the burner, not of the atmosphere.": "* Oxígeno del gas que sale del quemador, no de la atmósfera.",
    "Filters and view": "Filtros y vista", "Hide filters": "Ocultar filtros",
    "Compare investigations": "Comparar investigaciones", "Back to the list": "Volver a la lista",
    "Pick two or three investigations to compare": "Elige dos o tres investigaciones para comparar",
    "Use the Compare button on each row of the list.": "Usa el botón Comparar de cada renglón de la lista.", "Go to the list": "Ir a la lista",
    "Their tests on the same oxygen axis, then the attributes the challenge asks to compare, side by side.":
      "Sus pruebas en el mismo eje de oxígeno y después, lado a lado, los atributos que el reto pide comparar.",
    "Oxygen of every test of these investigations": "Oxígeno de cada prueba de estas investigaciones",
    "Attributes of ": "Atributos de ", " attributes are the same; the rest differ.": " atributos son iguales; los demás difieren.",
    "Only differences": "Solo diferencias", "Attribute": "Atributo", "Same": "Igual", "Differs": "Difiere",
    "In one line": "En una línea", "Fuel type": "Tipo de combustible", "What varied": "Qué varió", "Hardware": "Equipo",
    "None": "Ninguna",
    "From the PSI record of each investigation and its experimental table. \"In one line\" and \"What it found\" are the team's summaries.":
      "De la ficha de PSI de cada investigación y de su tabla experimental. «En una línea» y «Qué encontró» son resúmenes del equipo.",
    "All the attributes are the same.": "Todos los atributos son iguales.",
    "Investigations · One Fire, Many Worlds": "Investigaciones · One Fire, Many Worlds",
    "Compare · One Fire, Many Worlds": "Comparar · One Fire, Many Worlds"
  });

  var FRONT_ORDER = ["prevention", "detection", "suppression", "basic science"];
  var FRONT_LABEL = { prevention: T("Prevention"), detection: T("Detection"), suppression: T("Suppression"), "basic science": T("Flame science") };
  var OUT_LABEL = { out: T("went out by itself"), burn: T("kept burning"), none: T("did not ignite or spread") };
  var FUELS = [["gas", T("Gases")], ["solid", T("Solids")], ["liquid", T("Liquids")]];
  var FUEL_ONE = { gas: T("Gas"), solid: T("Solid"), liquid: T("Liquid"), other: T("Other") };
  var REL_WORD = { high: T("High relevance"), medium: T("Medium relevance"), low: T("Low relevance") };
  var REL_SHORT = { high: T("High"), medium: T("Medium"), low: T("Low") };
  var AX_MIN = 10, AX_MAX = 45, MOON_O2 = 30, SOLID_MAX = D.summary.solidsMaxO2;
  var SOLID_TXT = (Math.round(SOLID_MAX * 10) / 10).toFixed(1);
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function cap(t) { return t ? t.charAt(0).toUpperCase() + t.slice(1) : ""; }
  function range(r, unit) { return r ? (r[0] === r[1] ? r[0] : r[0] + T(" to ") + r[1]) + " " + unit : T("Not recorded"); }
  function outcomes(i) {
    var keys = Object.keys(i.outcomes || {});
    return keys.length ? keys.map(function (k) { return i.outcomes[k] + " " + OUT_LABEL[k]; }).join("; ") : T("Not classified in the data");
  }
  function shapes(id) {
    var seen = [];
    D.tests.forEach(function (t) { if (t.inv === id && t.shape && seen.indexOf(t.shape) < 0 && seen.length < 2) seen.push(t.shape); });
    return seen.length ? seen.join("; ") : T("Not given in the table");
  }
  function years(i) { return i.start && i.end ? (i.start === i.end ? i.start : i.start + T(" to ") + i.end) : T("Not given"); }
  function pct(o) { return (Math.max(AX_MIN, Math.min(AX_MAX, o)) - AX_MIN) / (AX_MAX - AX_MIN) * 100; }
  function uniqHw() { var seen = {}; D.investigations.forEach(function (i) { seen[i.hw] = 1; }); return Object.keys(seen).sort(); }
  function sr(text) { return h("span", { "class": "inv-sr", text: text }); }

  /* Tables and figures in academic layout with the shared c- classes (number, title above, note below). */
  function apa(kind, n, title, content, note) {
    return h("figure", { "class": "c-fig inv-apa" },
      h("figcaption", null, h("span", { "class": "c-fig-num", text: T(kind === "table" ? "Table " : "Figure ") + n }), h("span", { "class": "c-fig-title", text: title })),
      kind === "table" ? h("div", { "class": "c-table" }, content) : content,
      note ? h("p", { "class": "c-fig-note" }, h("em", { text: T("Note. ") }), note) : null);
  }

  /* ---------- the list's memory: filters, order, view, selection and scroll survive a visit to a record ---------- */
  var KEY = "ofmw-inv-list";
  var HW = uniqHw();
  var st = { front: "", off: [], hw: "", sort: "relevance", view: "strips", picked: [], scroll: 0 };
  try {
    var saved = JSON.parse(sessionStorage.getItem(KEY) || "null");
    if (saved && typeof saved === "object") Object.keys(st).forEach(function (k) { if (k in saved) st[k] = saved[k]; });
  } catch (e) { /* storage blocked: the list starts fresh */ }
  if (!FRONT_LABEL[st.front]) st.front = "";
  st.off = Array.isArray(st.off) ? st.off.filter(function (f) { return f === "gas" || f === "solid" || f === "liquid"; }) : [];
  if (HW.indexOf(st.hw) < 0) st.hw = "";
  if (["relevance", "tests", "name"].indexOf(st.sort) < 0) st.sort = "relevance";
  if (st.view !== "table") st.view = "strips";
  st.picked = Array.isArray(st.picked) ? st.picked.filter(function (id, k, all) { return A.inv(id) && all.indexOf(id) === k; }).slice(0, 3) : [];
  st.scroll = +st.scroll || 0;
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* not kept, still works */ } }

  /* ---------- tests of each investigation, grouped in half-percent oxygen columns ---------- */
  var BY = {}, INFO = {}, MAXN = 1;
  D.tests.forEach(function (t) { (BY[t.inv] = BY[t.inv] || []).push(t); });
  D.investigations.forEach(function (i) {
    var list = BY[i.id] || [], bins = {}, withO2 = 0, lo = null, hi = null;
    list.forEach(function (t) {
      if (t.o2 === null || t.ref !== "atmosphere" || !t.type || t.o2 < AX_MIN || t.o2 > AX_MAX) return;
      withO2++;
      lo = lo === null ? t.o2 : Math.min(lo, t.o2); hi = hi === null ? t.o2 : Math.max(hi, t.o2);
      var o = Math.round(t.o2 * 2) / 2, key = t.type + "|" + o;
      (bins[key] = bins[key] || { type: t.type, o2: o, tests: [] }).tests.push(t);
    });
    var cols = Object.keys(bins).map(function (k) { return bins[k]; }).sort(function (a, b) { return a.o2 - b.o2 || (a.type < b.type ? -1 : 1); });
    cols.forEach(function (c) { if (c.tests.length > MAXN) MAXN = c.tests.length; });
    INFO[i.id] = { inv: i, tests: list, withO2: withO2, lo: lo, hi: hi, cols: cols };
  });
  function colHeight(n) { return Math.round(4 + 36 * Math.sqrt((n - 1) / Math.max(1, MAXN - 1))); }

  /* ---------- the bubble that reads a mark ---------- */
  var tip = null;
  function hideTip() {
    if (tip) tip.hidden = true;
    var on = document.querySelectorAll(".inv-col.is-on");
    for (var k = 0; k < on.length; k++) on[k].classList.remove("is-on");
  }
  function testName(t) { return t.acr + " " + (t.id || "#" + t.n); }
  function tipLine(label, value, english) {
    return h("p", null, h("span", { "class": "inv-tip-k", text: label }), " ", h("span", { lang: english ? "en" : null, text: value }));
  }
  function spread(values, unit) {
    if (!values.length) return null;
    var lo = Math.min.apply(null, values), hi = Math.max.apply(null, values);
    return (lo === hi ? lo : lo + T(" to ") + hi) + " " + unit;
  }
  function tipBody(col) {
    var list = col.tests, t = list[0];
    if (list.length === 1) return [h("p", { "class": "inv-tip-h", text: testName(t) }),
      tipLine(T("Fuel"), t.fuel || FUEL_ONE[t.type], !!t.fuel),
      tipLine(T("Oxygen"), t.o2 + " %"),
      t.p !== null ? tipLine(T("Pressure"), t.p + " psi") : null,
      t.out ? tipLine(T("How it ended"), OUT_LABEL[t.out]) : t.res ? tipLine(T("How it ended"), t.res.length > 120 ? t.res.slice(0, 120) + " ..." : t.res, true)
        : tipLine(T("How it ended"), T("Not classified in the data"))];
    var fuels = [], outs = {};
    list.forEach(function (x) { if (x.fuel && fuels.indexOf(x.fuel) < 0) fuels.push(x.fuel); if (x.out) outs[x.out] = (outs[x.out] || 0) + 1; });
    var ps = list.map(function (x) { return x.p; }).filter(function (p) { return p !== null; });
    var outText = Object.keys(outs).map(function (k) { return outs[k] + " " + OUT_LABEL[k]; }).join("; ");
    var ids = list.slice(0, 4).map(testName).join(", ") + (list.length > 4 ? T(" and ") + fmt(list.length - 4) + T(" more") : "");
    return [h("p", { "class": "inv-tip-h", text: plural(list.length, "test") }),
      tipLine(T("Oxygen"), spread(list.map(function (x) { return x.o2; }), "%")),
      ps.length ? tipLine(T("Pressure"), spread(ps, "psi")) : null,
      fuels.length ? tipLine(T("Fuel"), fuels.slice(0, 2).join("; ") + (fuels.length > 2 ? T(" and ") + (fuels.length - 2) + T(" more") : ""), true) : null,
      tipLine(T("How they ended"), outText || T("Not classified in the data")),
      tipLine(T("Tests"), ids, true)];
  }
  function showTip(strip, k) {
    var info = strip.invInfo, col = info && info.cols[k];
    if (!col) return;
    strip.invK = k;
    var marks = strip.querySelectorAll(".inv-col");
    for (var j = 0; j < marks.length; j++) marks[j].classList.toggle("is-on", j === k);
    if (!tip || !document.body.contains(tip)) { tip = h("div", { "class": "inv-tip", role: "status", "aria-live": "polite" }); A.main.appendChild(tip); }
    tip.replaceChildren(); add(tip, tipBody(col)); tip.hidden = false;
    var r = marks[k].getBoundingClientRect(), sr2 = strip.getBoundingClientRect(), vw = document.documentElement.clientWidth;
    var w = tip.offsetWidth, ht = tip.offsetHeight, top = sr2.top - ht - 8;
    if (top < 76) top = sr2.bottom + 8;
    tip.style.left = Math.max(8, Math.min(vw - w - 8, r.left + r.width / 2 - w / 2)) + "px";
    tip.style.top = top + "px";
  }
  function nearest(strip, x, reach) {
    var scale = strip.querySelector(".inv-scale").getBoundingClientRect(), info = strip.invInfo, best = -1, gap = reach;
    info.cols.forEach(function (c, k) { var d = Math.abs(scale.left + pct(c.o2) / 100 * scale.width - x); if (d <= gap) { gap = d; best = k; } });
    return best;
  }
  function wireStrip(strip) {
    strip.addEventListener("pointermove", function (e) {
      var k = nearest(strip, e.clientX, e.pointerType === "mouse" ? 12 : 22);
      if (k >= 0) showTip(strip, k); else if (document.activeElement !== strip) hideTip();
    });
    strip.addEventListener("pointerdown", function (e) { var k = nearest(strip, e.clientX, 22); if (k >= 0) showTip(strip, k); });
    strip.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse" && document.activeElement !== strip) hideTip(); });
    strip.addEventListener("focus", function () { showTip(strip, strip.invK || 0); });
    strip.addEventListener("blur", hideTip);
    strip.addEventListener("keydown", function (e) {
      var n = strip.invInfo.cols.length, k = strip.invK || 0;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") k = Math.min(n - 1, k + 1);
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") k = Math.max(0, k - 1);
      else if (e.key === "Home") k = 0;
      else if (e.key === "End") k = n - 1;
      else if (e.key === "Escape") { hideTip(); return; }
      else return;
      e.preventDefault(); showTip(strip, k);
    });
  }

  /* ---------- pieces of a strip ---------- */
  function bandOf(extra) { return h("span", { "class": "inv-band" + (extra || ""), "aria-hidden": "true", style: "left:" + pct(SOLID_MAX) + "%;right:" + (100 - pct(MOON_O2)) + "%" }); }
  function stripCell(i) {
    var info = INFO[i.id], scale = h("div", { "class": "inv-scale" }, bandOf(), h("span", { "class": "inv-base", "aria-hidden": "true" }));
    if (!info.tests.length || !info.cols.length) {
      return h("div", { "class": "inv-strip inv-strip-none" }, scale,
        h("div", { "class": "inv-strip-msg" }, A.tag("missing", info.tests.length ? T("No oxygen recorded") : T("No individual tests in the data"))));
    }
    info.cols.forEach(function (c) {
      scale.appendChild(h("span", { "class": "inv-col", "aria-hidden": "true",
        style: "left:" + pct(c.o2) + "%;height:" + colHeight(c.tests.length) + "px;--c:var(--" + c.type + ")" }));
    });
    var strip = h("div", { "class": "inv-strip", tabindex: "0", role: "group",
      "aria-label": i.acr + T(": ") + fmt(info.withO2) + T(" tests with oxygen recorded, from ") + info.lo + T(" to ") + info.hi + " %. " + T("Use the left and right arrow keys to read each mark.") }, scale);
    strip.invInfo = info; strip.invK = 0;
    wireStrip(strip);
    return strip;
  }
  function axis(sticky) {
    var scale = h("div", { "class": "inv-scale" }, bandOf(" inv-band-axis"),
      h("span", { "class": "inv-mark inv-mark-solid", style: "right:" + (100 - pct(SOLID_MAX)) + "%" }, T("Solids up to ") + SOLID_TXT + " %"),
      h("span", { "class": "inv-mark inv-mark-moon", style: "left:" + pct(MOON_O2) + "%" }, T("Moon base 30 %")),
      h("span", { "class": "inv-gap", style: "left:" + pct(SOLID_MAX) + "%;right:" + (100 - pct(MOON_O2)) + "%" }, T("No solid tested here")));
    for (var o = AX_MIN; o <= AX_MAX; o += 5) scale.appendChild(h("span", { "class": "inv-tick", style: "left:" + pct(o) + "%" }, h("span", { "class": "num", text: String(o) })));
    return h("div", { "class": "inv-axis" + (sticky ? " is-sticky" : ""), "aria-hidden": "true" },
      h("div", { "class": "inv-axis-title", text: T("Oxygen in the chamber, %") }), h("div", { "class": "inv-axis-scale" }, scale));
  }
  function relCell(i) {
    var lvl = A.REL[i.relevance] || 0;
    return h("div", { "class": "inv-rel" },
      h("span", { "class": "inv-meter", "aria-hidden": "true" }, [1, 2, 3].map(function (k) { return h("span", { "class": k <= lvl ? "on" : "" }); })),
      h("span", { text: REL_WORD[i.relevance] || cap(i.relevance) }));
  }
  function burned(i) {
    var list = i.fuels.slice(0, 3).join("; ");
    return h("span", { "class": "inv-burned", title: i.fuels.length ? i.fuels.join("; ") : null },
      h("span", { "class": "inv-dot", "aria-hidden": "true", style: "--c:var(--" + i.fuelType + ", var(--text-3))" }),
      FUEL_ONE[i.fuelType] || cap(i.fuelType), list ? [T(": "), h("span", { lang: "en", text: list })] : null);
  }
  function row(i, withPick) {
    var info = INFO[i.id];
    return h("div", { "class": "inv-row" + (withPick ? "" : " inv-row-mini"), "data-id": i.id },
      h("div", { "class": "inv-name" }, h("a", { "class": "inv-acr", href: "#/investigation/" + i.id, text: i.acr }),
        h("span", { "class": "inv-front", text: FRONT_LABEL[i.front] }), burned(i)),
      stripCell(i),
      h("div", { "class": "inv-counts" },
        h("span", { "class": "inv-cnt" }, h("span", { "class": "num inv-n", text: fmt(i.tests) }), " " + T(i.tests === 1 ? "test" : "tests")),
        i.tests ? h("span", { "class": "inv-cnt inv-cnt-o2" }, h("span", { "class": "num", text: fmt(info.withO2) }), " " + T("with oxygen")) : null),
      relCell(i),
      withPick ? h("div", { "class": "inv-pickcell" }, pickButton(i)) : null);
  }

  /* ---------- picking for comparison ---------- */
  function pickButton(i) {
    return h("button", { type: "button", "class": "c-btn inv-pick", "data-pick": i.id, "aria-pressed": "false", onclick: function () { togglePick(i.id); } },
      h("span", { "class": "inv-pick-t", text: T("Compare") }), sr(" " + i.acr));
  }
  function togglePick(id) {
    var k = st.picked.indexOf(id);
    if (k >= 0) st.picked.splice(k, 1); else if (st.picked.length < 3) st.picked.push(id);
    save(); syncPicks();
  }
  function syncPicks() {
    var btns = document.querySelectorAll("[data-pick]"), full = st.picked.length >= 3;
    for (var k = 0; k < btns.length; k++) {
      var b = btns[k], on = st.picked.indexOf(b.getAttribute("data-pick")) >= 0;
      b.setAttribute("aria-pressed", String(on));
      b.classList.toggle("is-on", on);
      b.querySelector(".inv-pick-t").textContent = on ? T("Selected") : T("Compare");
      if (full && !on) { b.setAttribute("disabled", ""); b.setAttribute("title", T("Three are already selected. Remove one to pick this.")); }
      else { b.removeAttribute("disabled"); b.removeAttribute("title"); }
    }
    renderTray();
  }
  function renderTray() {
    var tray = document.getElementById("inv-tray"), spacer = document.getElementById("inv-spacer");
    if (!tray) return;
    var n = st.picked.length, msg = tray.querySelector(".inv-tray-msg");
    tray.hidden = !n;
    msg.textContent = n === 1 ? T("Pick one more to compare.") : n === 2 ? T("You can add one more.") : n === 3 ? T("Three is the most. Remove one to pick another.") : "";
    tray.querySelector(".inv-chips").replaceChildren.apply(tray.querySelector(".inv-chips"), st.picked.map(function (id) {
      var i = A.inv(id);
      return h("li", { "class": "inv-chip" }, h("span", { "class": "inv-chip-name", text: i.acr }),
        h("button", { type: "button", "class": "c-btn c-btn-quiet inv-chip-x", onclick: function () {
          togglePick(id);
          var next = document.querySelector("#inv-tray:not([hidden]) .inv-chip-x") || document.querySelector('[data-pick="' + id + '"]') || document.getElementById("inv-count");
          if (next) next.focus();
        } }, T("Remove"), sr(" " + i.acr)));
    }));
    var go = tray.querySelector(".inv-go");
    go.textContent = n >= 2 ? T("Compare ") + n : T("Compare");
    if (n >= 2) { go.setAttribute("href", "#/compare/" + st.picked.join(",")); go.removeAttribute("aria-disabled"); }
    else { go.removeAttribute("href"); go.setAttribute("aria-disabled", "true"); }
    if (spacer) spacer.style.height = n ? tray.offsetHeight + "px" : "0";
  }
  function tray() {
    return h("div", { "class": "inv-tray", id: "inv-tray", role: "region", "aria-label": T("Selected to compare"), hidden: "" },
      h("div", { "class": "wrap inv-tray-in" },
        h("p", { "class": "inv-tray-msg", "aria-live": "polite" }),
        h("ul", { "class": "inv-chips" }),
        h("div", { "class": "inv-tray-act" },
          h("button", { type: "button", "class": "c-btn", onclick: function () { st.picked = []; save(); syncPicks(); var c = document.getElementById("inv-count"); if (c) c.focus(); }, text: T("Clear") }),
          h("a", { "class": "c-btn c-btn-primary inv-go", role: "link" }))));
  }

  /* ---------- list ---------- */
  var listRoot = null, lastView = "", scrollRaf = 0;
  function filtersOn() { return !!(st.front || st.hw || st.off.length); }
  function sorted(list) {
    return list.slice().sort(function (a, b) {
      if (st.sort === "tests") return b.tests - a.tests || a.acr.localeCompare(b.acr);
      if (st.sort === "name") return a.acr.localeCompare(b.acr);
      return (A.REL[b.relevance] || 0) - (A.REL[a.relevance] || 0) || b.tests - a.tests || a.acr.localeCompare(b.acr);
    });
  }
  function filtered() {
    return sorted(D.investigations.filter(function (i) {
      if (st.front && i.front !== st.front) return false;
      if (st.hw && i.hw !== st.hw) return false;
      if (st.off.length && (st.off.indexOf(i.fuelType) >= 0 || ["gas", "solid", "liquid"].indexOf(i.fuelType) < 0)) return false;
      return true;
    }));
  }
  function segment(label, items, current, onPick, cls) {
    var group = h("div", { "class": "inv-seg " + (cls || ""), role: "group", "aria-label": label });
    items.forEach(function (it) {
      group.appendChild(h("button", { type: "button", "class": "inv-seg-b", "aria-pressed": String(it[0] === current), "data-v": it[0],
        onclick: function () {
          var bs = group.querySelectorAll("button");
          for (var k = 0; k < bs.length; k++) bs[k].setAttribute("aria-pressed", String(bs[k] === this));
          onPick(it[0]);
        } }, it[1]));
    });
    return h("div", { "class": "inv-ctl" }, h("span", { "class": "inv-ctl-l", "aria-hidden": "true", text: label }), group);
  }
  function selectCtl(id, label, items, current, onPick) {
    var sel = h("select", { id: id, "class": "inv-select", onchange: function () { onPick(sel.value); } },
      items.map(function (o) { return h("option", { value: o[0], text: o[1], selected: o[0] === current ? "" : null }); }));
    return h("div", { "class": "inv-ctl" }, h("label", { "class": "inv-ctl-l", "for": id, text: label }), sel);
  }
  function stripsBlock(list, sticky, withPick) {
    return h("div", { "class": "inv-strips" + (withPick ? "" : " inv-strips-mini") }, axis(sticky), list.map(function (i) { return row(i, withPick); }));
  }
  function stripsNote() { return T("Each mark is a test, placed at the oxygen of the chamber atmosphere; taller marks hold more tests at that level. Inverse flames, where the oxygen leaves the burner, are not drawn: it is not the chamber air. The striped band runs from the most oxygen any solid burned in (") + SOLID_TXT + T(" %) to the 30 % expected in a Moon base. Data: experimental tables of the PSI repository, downloaded November 13, 2026."); }
  function tableBlock(list) {
    var cols = [T("Investigation"), T("Front"), T("Fuel"), T("Tests"), T("With oxygen"), T("Oxygen (%)"), T("Pressure (psi)"), T("Relevance"), T("Compare")];
    var rangeN = function (r) { return r ? (r[0] === r[1] ? String(r[0]) : r[0] + T(" to ") + r[1]) : null; };
    var miss = function () { return h("span", { "class": "inv-none", text: T("Not recorded") }); };
    var table = h("table", { "class": "inv-table" },
      h("thead", null, h("tr", null, cols.map(function (c, k) { return h("th", { scope: "col", "class": k >= 3 && k <= 6 ? "num" : null, text: c }); }))),
      h("tbody", null, list.map(function (i) {
        var o = rangeN(i.o2), p = rangeN(i.p);
        return h("tr", null,
          h("th", { scope: "row" }, h("a", { "class": "inv-acr", href: "#/investigation/" + i.id, text: i.acr }), h("span", { "class": "inv-tline", text: (C.investigations[i.id] || {}).line || "" })),
          h("td", { text: FRONT_LABEL[i.front] }), h("td", null, burned(i)),
          h("td", { "class": "num", text: fmt(i.tests) }), h("td", { "class": "num", text: fmt(INFO[i.id].withO2) }),
          h("td", { "class": "num" }, o || miss()), h("td", { "class": "num" }, p || miss()),
          h("td", null, relCell(i)), h("td", null, pickButton(i)));
      })));
    return apa("table", 1, T("The investigations, their tests and their oxygen and pressure"), table,
      T("Tests are the individual tests in the cleaned data; some investigations publish only test days or no table at all. Oxygen and pressure are the ranges of the chamber atmosphere in the experimental tables of the PSI repository, downloaded November 13, 2026."));
  }
  function listView() {
    var returning = lastView === "record" || lastView === "compare", target = st.scroll;
    lastView = "list";
    document.title = T("Investigations · One Fire, Many Worlds");
    var count = h("p", { "class": "inv-count", id: "inv-count", tabindex: "-1", role: "status" });
    var clear = h("button", { type: "button", "class": "c-btn c-btn-quiet inv-clear", hidden: "", onclick: clearFilters, text: T("Clear filters") });
    var body = h("div", { "class": "inv-body" });
    var fuelGroup = h("div", { "class": "inv-seg inv-fuels", role: "group", "aria-label": T("Fuel") }, FUELS.map(function (f) {
      return h("button", { type: "button", "class": "inv-fuel", "data-fuel": f[0], "aria-pressed": String(st.off.indexOf(f[0]) < 0), style: "--c:var(--" + f[0] + ")",
        onclick: function () {
          var k = st.off.indexOf(f[0]);
          if (k >= 0) st.off.splice(k, 1); else st.off.push(f[0]);
          this.setAttribute("aria-pressed", String(k >= 0));
          save(); renderRows();
        } }, h("span", { "class": "inv-dot", "aria-hidden": "true" }), f[1]);
    }));
    var barToggle = h("button", { type: "button", "class": "c-btn inv-bar-toggle", "aria-expanded": "false", "aria-controls": "inv-bar",
      onclick: function () { var open = !bar.classList.toggle("is-closed"); barToggle.setAttribute("aria-expanded", String(open)); barToggle.textContent = open ? T("Hide filters") : T("Filters and view"); } },
      T("Filters and view"));
    var bar = h("div", { "class": "inv-bar is-closed", id: "inv-bar" },
      segment(T("Front"), [["", T("All")]].concat(FRONT_ORDER.map(function (f) { return [f, FRONT_LABEL[f]]; })), st.front, function (v) { st.front = v; save(); renderRows(); }, "inv-fronts"),
      h("div", { "class": "inv-ctl" }, h("span", { "class": "inv-ctl-l", "aria-hidden": "true", text: T("Fuel") }), fuelGroup),
      selectCtl("inv-hw", T("Equipment"), [["", T("All")]].concat(HW.map(function (k) { return [k, T(k)]; })), st.hw, function (v) { st.hw = v; save(); renderRows(); }),
      selectCtl("inv-sort", T("Sort by"), [["relevance", T("Relevance")], ["tests", T("Number of tests")], ["name", T("Name")]], st.sort, function (v) { st.sort = v; save(); renderRows(); }),
      segment(T("View"), [["strips", T("Strips")], ["table", T("Table")]], st.view, function (v) { st.view = v; save(); renderRows(); }, "inv-views"));
    function renderRows() {
      hideTip();
      var list = filtered();
      count.textContent = T("Showing ") + list.length + T(" of ") + D.investigations.length + T(" investigations");
      if (filtersOn()) clear.removeAttribute("hidden"); else clear.setAttribute("hidden", "");
      body.replaceChildren(list.length
        ? (st.view === "table" ? tableBlock(list) : apa("figure", 1, T("Oxygen of every test, investigation by investigation"), stripsBlock(list, true, true), stripsNote()))
        : A.state("empty", T("No investigation matches these filters"), T("Turn a fuel back on, or set the front and the equipment to All."),
          h("button", { type: "button", "class": "c-btn", onclick: clearFilters, text: T("Clear filters") })));
      syncPicks();
    }
    function clearFilters() {
      st.front = ""; st.hw = ""; st.off = []; save();
      var bs = bar.querySelectorAll(".inv-fronts button");
      for (var k = 0; k < bs.length; k++) bs[k].setAttribute("aria-pressed", String(bs[k].getAttribute("data-v") === ""));
      var fs = bar.querySelectorAll(".inv-fuel");
      for (k = 0; k < fs.length; k++) fs[k].setAttribute("aria-pressed", "true");
      document.getElementById("inv-hw").value = "";
      renderRows(); count.focus();
    }
    listRoot = h("div", { "class": "wrap inv-page inv-list" },
      A.intro(T("Investigations"), T("Each row is one investigation and each mark is one of its tests, placed at the oxygen it burned in. Filter, open one, or pick up to three to compare.")),
      h("p", { "class": "inv-people-link" }, h("a", { href: "#/people", text: T("The people behind the investigations") })),
      barToggle, bar, h("div", { "class": "inv-status" }, count, clear), body, h("div", { "class": "inv-spacer", id: "inv-spacer", "aria-hidden": "true" }), tray());
    A.main.replaceChildren(listRoot);
    renderRows();
    if (returning && target) requestAnimationFrame(function () { window.scrollTo(0, target); });
  }
  window.addEventListener("scroll", function () {
    if (tip && !tip.hidden) {
      var f = document.activeElement;
      if (f && f.classList && f.classList.contains("inv-strip")) showTip(f, f.invK || 0); else hideTip();
    }
    if (scrollRaf || !listRoot) return;
    scrollRaf = requestAnimationFrame(function () {
      scrollRaf = 0;
      if (listRoot && document.body.contains(listRoot)) { st.scroll = Math.round(window.scrollY); save(); }
    });
  }, { passive: true });
  window.addEventListener("resize", function () { hideTip(); renderTray(); });
  /* Leaving for another section forgets that the list should come back at its old position. */
  window.addEventListener("hashchange", function () {
    var sec = location.hash.replace(/^#\/?/, "").split("/")[0];
    if (sec !== "investigations" && sec !== "investigation" && sec !== "compare" && sec !== "people") lastView = "other";
    else if (sec === "people" && lastView === "list") lastView = "record";
    hideTip();
  });

  /* One layout for every table of tests, wherever it appears: a record, an answer or a report. */
  function testsTableWith(apaFn, list, n, title, lead) {
    var burner = list.some(function (t) { return t.ref === "burner"; });
    var table = h("table", null,
      h("thead", null, h("tr", null, [T("Test"), T("Fuel or material"), T("Oxygen (%)"), T("Pressure (psi)"), T("Airflow (cm/s)"), T("Result"), T("Source table and row")].map(function (t) { return h("th", { scope: "col", text: t }); }))),
      h("tbody", null, list.map(function (t) {
        return h("tr", null, h("th", { scope: "row" }, h("a", { href: "#/data/" + t.inv + "/n" + t.n, text: t.acr + " " + (t.id || "#" + t.n) })),
          h("td", { text: t.fuel }),
          h("td", { "class": "num", text: t.o2 === null ? "" : t.o2 + (t.ref === "burner" ? " *" : "") }),
          h("td", { "class": "num", text: t.p === null ? "" : String(t.p) }),
          h("td", { "class": "num", text: t.flow === null ? "" : String(t.flow) }),
          h("td", { text: t.res.length > 170 ? t.res.slice(0, 170) + " ..." : t.res }),
          h("td", { text: String(t.src).replace(/^PSI-\d+_Experimental table_/, "").replace(/\.csv$/, "") + " · " + t.row }));
      })));
    return apaFn(n, title, table, [lead || "",
      T("Data from the experimental tables of NASA's PSI repository, downloaded November 13, 2026. Each test opens in Data; the last column gives the table and the row it comes from. Oxygen is that of the chamber atmosphere. An empty cell means the table does not record that value. The result is quoted in English, as in the table."),
      burner ? " " + T("* Oxygen of the gas leaving the burner, not of the atmosphere.") : ""]);
  }
  A.testsTable = function (list, n, title, lead) { return testsTableWith(A.apaTable, list, n, title, lead); };
  function apaTableLocal(n, title, table, note) { return apa("table", n, title, table, note); }

  /* ---------- record ---------- */
  function recordView(parts) {
    lastView = "record";
    var i = A.inv(parts[0]);
    if (!i) {
      document.title = T("No such investigation") + " · One Fire, Many Worlds";
      A.main.replaceChildren(h("div", { "class": "wrap inv-page" }, A.back("#/investigations", T("All investigations")),
        A.state("error", T("No such investigation"), T("There is no record called ") + (parts[0] || "") + ".",
          h("a", { "class": "c-btn", href: "#/investigations", text: T("See all investigations") }))));
      return;
    }
    var c = C.investigations[i.id] || {}, info = INFO[i.id];
    document.title = i.acr + " · One Fire, Many Worlds";
    var tests = info.tests, sample = tests.slice(0, 10), num = A.counter(), clampers = [];
    var nasa = function (body) {
      if (!body) return h("p", { "class": "inv-empty", text: T("Not stated in the PSI record.") });
      var p = h("p", { "class": "inv-nasa is-clamped", lang: "en", text: body });
      var btn = h("button", { type: "button", "class": "c-btn c-btn-quiet inv-more", "aria-expanded": "false", hidden: "",
        onclick: function () {
          var open = !p.classList.toggle("is-clamped");
          btn.setAttribute("aria-expanded", String(open)); btn.textContent = open ? T("Show less") : T("Read more");
        } }, T("Read more"));
      clampers.push([p, btn]);
      return h("div", { "class": "inv-nasawrap" }, p, btn);
    };
    var row2 = function (label, value) { return h("tr", null, h("th", { scope: "row", text: label }), h("td", null, value)); };
    var people = (i.investigators || "").split(/;\s*/).filter(Boolean);
    var how = apa("table", num.table(), T("What ") + i.acr + T(" varied, what it measured and with what equipment"),
      h("table", { "class": "inv-how" },
        h("thead", null, h("tr", null, h("th", { scope: "col", text: T("Aspect") }), h("th", { scope: "col", text: T("What the PSI record and its table say") }))),
        h("tbody", null,
          row2(T("What was varied"), i.varied.length ? cap(i.varied.map(T).join(", ")) : T("Not visible in the table")),
          row2(T("What was measured"), i.measures.length ? cap(i.measures.map(T).join(", ")) : T("Not given in the table")),
          row2(T("Facility or equipment"), i.facility ? h("span", { lang: "en", text: i.facility }) : T("Not stated in the PSI record.")),
          row2(T("Equipment group on this site"), T(i.hw)),
          row2(T("Where it ran"), i.platform ? h("span", { lang: "en", text: i.platform }) : T("Not stated in the PSI record.")),
          row2(T("Instrument for each variable"), T("The PSI record does not name it; it has to be read in the reports of the investigation.")),
          row2(T("How tests ended"), outcomes(i)))),
      T("Facility and platform are quoted from the PSI record, in English. What was varied and what was measured are read from the columns of its experimental table."));
    var STEPS = [
      [T("Objective"), nasa(i.objectives)],
      [T("Hypothesis"), nasa(i.hypothesis)],
      [T("Method"), nasa(i.approach)],
      [T("What was measured, and with what"), how],
      [T("Results"), [
        h("p", { "class": "inv-p", text: T("The finding is stated at the top of this page. This is the evidence behind it.") }),
        A.sourceList ? A.sourceList(i.id) : null,
        sample.length ? [testsTableWith(apaTableLocal, sample, num.table(), T("First ") + sample.length + T(" of ") + fmt(tests.length) + T(" tests of ") + i.acr, T("Source: ") + tests[0].src + ". "),
          h("p", { "class": "inv-links" }, h("a", { href: "#/data/" + i.id, text: T("See all its tests in Data") }))]
          : A.state("empty", T("No individual tests in the data")),
        A.figureGallery ? A.figureGallery(i.id, true) : null]],
      [T("Limits"), [
        c.caveat ? h("p", { "class": "inv-p", text: c.caveat }) : h("p", { "class": "inv-p", text: T("The team did not note a specific caveat for this investigation.") }),
        h("p", { "class": "inv-small", text: T("Summary, finding and caveat were written with AI from the PSI record and its reports, then checked against the data.") })]],
      [T("Who ran it"), [
        A.people ? A.people.cards(A.people.forInvestigations([i.id]), { current: i.id })
          : people.length ? h("ul", { "class": "inv-people" }, people.map(function (p) { return h("li", { lang: "en", text: p }); })) : h("p", { "class": "inv-empty", text: T("Not stated in the PSI record.") }),
        i.cite ? h("p", { "class": "inv-cite", lang: "en", text: i.cite }) : null,
        h("p", { "class": "inv-links" }, h("a", { "class": "c-btn", href: i.url, target: "_blank", rel: "noopener", text: T("Open the PSI record") }),
          i.doi ? h("a", { "class": "c-btn c-btn-quiet", href: "https://doi.org/" + i.doi, target: "_blank", rel: "noopener", text: "DOI " + i.doi }) : null),
        h("p", { "class": "inv-small" }, plural(i.pubs, "publication") + T(" listed") + ". " + T("Record version ") + i.version + T(", modified ") + i.modified + "." + (i.license ? " " + T("License ") + i.license + "." : ""))]]
    ];
    var tocBtns = [], secs = [];
    var toc = h("nav", { "class": "inv-toc", "aria-label": T("Steps of the study") }, h("ol", null, STEPS.map(function (s, k) {
      var b = h("button", { type: "button", "class": "inv-toc-b", onclick: function () { goStep(k); } },
        h("span", { "class": "inv-toc-n num", text: String(k + 1) }), h("span", { "class": "inv-toc-t", text: s[0] }));
      tocBtns.push(b);
      return h("li", null, b);
    })));
    var steps = h("div", { "class": "inv-steps" }, STEPS.map(function (s, k) {
      var sec = h("section", { "class": "inv-step", id: "inv-step-" + (k + 1), "aria-labelledby": "inv-step-h" + (k + 1) },
        h("h3", { id: "inv-step-h" + (k + 1), tabindex: "-1" }, h("span", { "class": "inv-step-n num", text: String(k + 1) }), s[0]), s[1]);
      secs.push(sec);
      return sec;
    }));
    function setActive(k) {
      tocBtns.forEach(function (b, j) { if (j === k) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current"); });
      var bar = toc, b = tocBtns[k];
      if (bar.scrollWidth > bar.clientWidth + 2) bar.scrollLeft = Math.max(0, b.offsetLeft - bar.clientWidth / 2 + b.offsetWidth / 2);
    }
    var lockUntil = 0;
    function goStep(k) {
      lockUntil = Date.now() + (REDUCED ? 150 : 1200);   /* the smooth scroll passes other steps; the one you chose stays marked */
      secs[k].scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" });
      secs[k].querySelector("h3").focus({ preventScroll: true });
      setActive(k);
    }
    var order = sorted(D.investigations), at = order.indexOf(i), prev = order[at - 1], next = order[at + 1];
    var pagerLink = function (inv2, label, cls) {
      return inv2 ? h("a", { "class": "c-btn inv-pager-b " + cls, href: "#/investigation/" + inv2.id }, h("span", { "class": "inv-pager-l", text: label }), h("span", { "class": "inv-pager-acr", text: inv2.acr })) : h("span");
    };
    var fact = function (label, value, wide) { return h("div", { "class": "inv-fact" + (wide ? " inv-fact-wide" : "") }, h("dt", { text: label }), h("dd", null, value)); };
    var fuelsText = i.fuels.length ? i.fuels.join("; ") : "";
    /* The shared chart already comes as a numbered figure with its note; it is only wrapped when it does not. */
    var planeFig = A.plane(null, i.id);
    if (planeFig && typeof planeFig.setNumber === "function") planeFig.setNumber(num.figure());
    else planeFig = apa("figure", num.figure(), T("Oxygen and pressure of the tests of ") + i.acr + T(" over every test in PSI"), planeFig,
      T("Chamber oxygen and pressure from the experimental tables of the PSI repository, downloaded November 13, 2026."));
    var root = h("div", { "class": "wrap inv-page inv-record" },
      A.back("#/investigations", T("All investigations")),
      h("div", { "class": "inv-head" },
        h("div", { "class": "inv-head-text" },
          h("header", { "class": "c-intro inv-intro" },
            h("h1", { text: i.acr }), h("p", { "class": "inv-title", lang: "en", text: i.title }), c.line ? h("p", { "class": "c-what", text: c.line }) : null,
            h("p", { "class": "inv-tags" }, A.tag("front", FRONT_LABEL[i.front]), A.tag("rel", REL_WORD[i.relevance] || cap(i.relevance)))),
          h("section", { "class": "inv-found", "aria-labelledby": "inv-found-h" }, h("h2", { id: "inv-found-h", text: T("What it found") }), h("p", { text: c.finding || T("Not stated in the PSI record.") })),
          h("dl", { "class": "inv-facts", "aria-label": T("Key facts") },
            fact(T("Fuels"), fuelsText ? h("span", { lang: "en", text: fuelsText }) : FUEL_ONE[i.fuelType] || cap(i.fuelType), fuelsText.length > 60),
            fact(T("Shape and size"), shapes(i.id), true),
            fact(T("Oxygen"), h("span", { "class": "num", text: range(i.o2, "%") })),
            fact(T("Pressure"), h("span", { "class": "num", text: range(i.p, "psi") })),
            fact(T("Airflow"), h("span", { "class": "num", text: range(i.flow, "cm/s") })),
            fact(T("Years"), h("span", { "class": "num", text: years(i) })),
            fact(T("Tests"), i.tests ? [h("span", { "class": "num", text: fmt(i.tests) }), T(" individual tests in the data")] : T("No individual tests in the data")),
            fact(T("Relevance"), [h("strong", { text: REL_SHORT[i.relevance] || cap(i.relevance) }), c.why ? ". " + c.why : ""], true))),
        h("div", { "class": "inv-head-fig" }, planeFig)),
      h("section", { "class": "inv-study", "aria-labelledby": "inv-study-h" },
        h("h2", { id: "inv-study-h", text: T("The study, step by step") }),
        h("p", { "class": "inv-small", text: T("Objective, hypothesis and method are NASA's text from the PSI record, unchanged.") }),
        h("div", { "class": "inv-study-grid" }, toc, steps)),
      i.earth ? h("details", { "class": "inv-earth" }, h("summary", { text: T("Benefits on Earth") }), h("p", { lang: "en", text: i.earth })) : null,
      h("nav", { "class": "inv-pager", "aria-label": T("More investigations") }, pagerLink(prev, T("Previous"), "inv-prev"), pagerLink(next, T("Next"), "inv-next")));
    A.main.replaceChildren(root);
    setActive(0);
    requestAnimationFrame(function () {
      clampers.forEach(function (pb) { if (pb[0].scrollHeight > pb[0].clientHeight + 2) pb[1].removeAttribute("hidden"); });
    });
    var raf = 0;
    function track() {
      if (!document.body.contains(root)) { window.removeEventListener("scroll", onScroll); return; }
      if (Date.now() < lockUntil) return;
      var line = 140, k = 0;
      secs.forEach(function (s, j) { if (s.getBoundingClientRect().top <= line) k = j; });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        secs.forEach(function (s, j) { if (s.getBoundingClientRect().top < window.innerHeight) k = Math.max(k, j); });
      }
      setActive(k);
    }
    function onScroll() { if (!raf) raf = requestAnimationFrame(function () { raf = 0; track(); }); }
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- compare ---------- */
  function compareView(parts) {
    lastView = "compare";
    document.title = T("Compare · One Fire, Many Worlds");
    var list = [];
    (parts[0] || "").split(",").forEach(function (id) { var i = A.inv(id); if (i && list.indexOf(i) < 0) list.push(i); });
    list = list.slice(0, 3);
    var root = h("div", { "class": "wrap inv-page inv-compare" }, A.back("#/investigations", T("Back to the list")));
    if (list.length < 2) {
      add(root, [A.intro(T("Compare investigations"), null),
        A.state("empty", T("Pick two or three investigations to compare"), T("Use the Compare button on each row of the list."),
          h("a", { "class": "c-btn", href: "#/investigations", text: T("Go to the list") }))]);
      A.main.replaceChildren(root);
      return;
    }
    st.picked = list.map(function (i) { return i.id; }); save();     /* the list shows the same selection when you go back */
    var ROWS = [
      [T("In one line"), function (i) { return (C.investigations[i.id] || {}).line || ""; }],
      [T("Front"), function (i) { return FRONT_LABEL[i.front]; }],
      [T("Relevance"), function (i) { return REL_SHORT[i.relevance] || cap(i.relevance); }],
      [T("Fuel type"), function (i) { return FUEL_ONE[i.fuelType] || cap(i.fuelType); }],
      [T("Fuels"), function (i) { return i.fuels.join("; ") || T("Not given"); }],
      [T("Shape and size"), function (i) { return shapes(i.id); }],
      [T("Oxygen"), function (i) { return range(i.o2, "%"); }],
      [T("Pressure"), function (i) { return range(i.p, "psi"); }],
      [T("Airflow"), function (i) { return range(i.flow, "cm/s"); }],
      [T("What varied"), function (i) { return i.varied.length ? cap(i.varied.map(T).join(", ")) : T("Not visible in the table"); }],
      [T("What was measured"), function (i) { return i.measures.length ? cap(i.measures.map(T).join(", ")) : T("Not given in the table"); }],
      [T("How tests ended"), outcomes],
      [T("Tests"), function (i) { return i.tests ? fmt(i.tests) : T("None"); }],
      [T("Hardware"), function (i) { return T(i.hw); }],
      [T("Years"), years],
      [T("What it found"), function (i) { return (C.investigations[i.id] || {}).finding || ""; }]
    ];
    var same = 0;
    var body = ROWS.map(function (r) {
      var vals = list.map(r[1]), eq = vals.every(function (v) { return v === vals[0]; });
      if (eq) same++;
      return h("tr", { "class": eq ? "inv-same" : "inv-diff" },
        h("th", { scope: "row" }, h("span", { "class": "inv-attr", text: r[0] }), h("span", { "class": "inv-flag", text: eq ? T("Same") : T("Differs") })),
        vals.map(function (v) { return h("td", { text: v }); }));
    });
    var table = h("table", { "class": "inv-cmp" },
      h("thead", null, h("tr", null, h("th", { scope: "col", text: T("Attribute") }), list.map(function (i) { return h("th", { scope: "col" }, h("a", { href: "#/investigation/" + i.id, text: i.acr })); }))),
      h("tbody", null, body));
    var onlyBtn = h("button", { type: "button", "class": "c-btn inv-only", "aria-pressed": "false", onclick: function () {
      var on = onlyBtn.getAttribute("aria-pressed") !== "true";
      onlyBtn.setAttribute("aria-pressed", String(on)); table.classList.toggle("inv-only-diff", on);
      allSame.hidden = !(on && same === ROWS.length);
    } }, T("Only differences"));
    var allSame = h("p", { "class": "inv-small", hidden: "", text: T("All the attributes are the same.") });
    var names = list.map(function (i) { return i.acr; });
    add(root, [
      A.intro(names.slice(0, -1).join(", ") + T(" and ") + names[names.length - 1], T("Their tests on the same oxygen axis, then the attributes the challenge asks to compare, side by side.")),
      apa("figure", 1, T("Oxygen of every test of these investigations"), stripsBlock(list, false, false), stripsNote()),
      h("div", { "class": "inv-cmp-bar" }, h("p", { "class": "inv-count", text: same + T(" of ") + ROWS.length + T(" attributes are the same; the rest differ.") }), onlyBtn),
      allSame,
      apa("table", 1, T("Attributes of ") + names.slice(0, -1).join(", ") + T(" and ") + names[names.length - 1], table,
        T("From the PSI record of each investigation and its experimental table. \"In one line\" and \"What it found\" are the team's summaries."))]);
    A.main.replaceChildren(root);
  }

  A.section({ id: "investigations", label: T("Investigations"), href: "#/investigations" }, listView);
  A.route("investigation", "investigations", recordView);
  A.route("compare", "investigations", compareView);
})();
