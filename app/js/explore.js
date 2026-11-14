/* Timeline (from accident to experiment), Will it burn? (the evidence near a condition) and Data (every test, downloadable). */
(function () {
  "use strict";
  var A = window.OFMW_APP, h = A.h, fmt = A.fmt, plural = A.plural, D = A.D, C = A.C;
  if (!D || !C) return;
  var OUT = { out: "Went out by itself", burn: "Kept burning", none: "Did not ignite or spread", "": "No ending recorded" };
  function cap(t) { return t ? t.charAt(0).toUpperCase() + t.slice(1) : ""; }

  /* ---------- timeline ---------- */
  var KIND = { accident: "Emergency", experiment: "Experiment", planned: "Planned" };
  function timelineView() {
    document.title = "Timeline · One Fire, Many Worlds";
    A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "sheet page" },
      h("h1", { text: "From accident to experiment" }),
      h("p", { "class": "intro", text: "Every emergency left a question, and the experiments in NASA's repository are attempts to answer them. Which investigation answers which event is our reading; the events and their sources are NASA's." }),
      h("ol", { "class": "timeline" }, C.timeline.map(function (e) {
        var links = e.answers.map(A.inv).filter(Boolean);
        return h("li", { "class": e.kind },
          h("p", { "class": "when" }, h("span", { "class": "year", text: e.year }), h("span", { "class": "kind", text: KIND[e.kind] })),
          h("div", null,
            h("h2", { text: e.title }), h("p", { text: e.what }), h("p", { "class": "lesson", text: e.lesson }),
            links.length ? h("p", { "class": "answers" }, e.kind === "experiment" ? "Record: " : "Investigations that study this problem: ",
              links.map(function (i, k) { return [k ? ", " : "", A.invLink(i)]; })) : null,
            h("p", { "class": "note" }, "Source: ", e.url ? h("a", { href: e.url, target: "_blank", rel: "noopener", text: e.source }) : e.source)));
      })),
      h("p", { "class": "note", text: "Test dates in the repository run from " + D.summary.years[0] + " to " + D.summary.years[1] + "." }))));
  }

  /* ---------- will it burn? ---------- */
  var probe = { o2: 30, p: 10.2, type: "" };
  var PRESETS = [["Station air", 21, 14.7], ["10.2 psia crew atmosphere", 26.5, 10.2], ["8.2 psia crew atmosphere", 34, 8.2], ["Moon base", 30, 10.2], ["Spacesuit", 100, 4.3]];
  var RO = 5, RP = 2;                                  /* "near" means within 5 % oxygen and 2 psi */
  function near() {
    return D.tests.filter(function (t) {
      return t.ref === "atmosphere" && t.o2 !== null && t.p !== null && (!probe.type || t.type === probe.type);
    }).map(function (t) {
      var a = (t.o2 - probe.o2) / RO, b = (t.p - probe.p) / RP;
      return { t: t, d: Math.sqrt(a * a + b * b) };
    }).sort(function (x, y) { return x.d - y.d; });
  }
  function burnView() {
    document.title = "Will it burn? · One Fire, Many Worlds";
    var results = h("div", { "aria-live": "polite" }), chart = h("div"), list = h("div");
    var outO = h("output", { "for": "p-o2" }), outP = h("output", { "for": "p-p" });
    function paint() {
      outO.textContent = probe.o2 + " % oxygen"; outP.textContent = probe.p + " psi";
      var all = near(), close = all.filter(function (x) { return x.d <= 1; });
      var by = { out: 0, burn: 0, none: 0, "": 0 }, types = {};
      close.forEach(function (x) { by[x.t.out] += 1; types[x.t.type] = (types[x.t.type] || 0) + 1; });
      var what = probe.type ? probe.type + " " : "";
      var head = close.length
        ? h("p", { "class": "verdict" }, h("strong", { text: plural(close.length, what + "test") }), " ran within " + RO + " % oxygen and " + RP + " psi of these conditions.")
        : h("p", { "class": "verdict none" }, h("strong", { text: "No " + what + "test" }), " ran within " + RO + " % oxygen and " + RP + " psi of these conditions.");
      var known = by.out + by.burn + by.none;
      var detail = close.length ? h("p", null, known
        ? "Of the " + known + " with a recorded ending: " + by.burn + " kept burning, " + by.out + " went out by themselves" + (by.none ? ", " + by.none + " did not ignite or spread" : "") + ". " + by[""] + " have no ending in the data."
        : "None of them has a recorded ending in the data.",
        probe.type ? "" : " By fuel: " + A.TYPES.map(function (t) { return (types[t[0]] || 0) + " " + t[0]; }).join(", ") + ".")
        : h("p", { text: all.length ? "The closest " + what + "test is " + all[0].t.acr + " at " + all[0].t.o2 + " % oxygen and " + all[0].t.p + " psi." : "The repository has no " + what + "test with both oxygen and pressure." });
      var rows = all.slice(0, 12);
      results.replaceChildren(head, detail);
      list.replaceChildren(
        h("h2", { text: "The nearest tests" }),
        rows.length ? h("div", { "class": "table" }, h("table", null,
          h("thead", null, h("tr", null, ["Investigation", "Fuel or material", "Oxygen", "Pressure", "How it ended", "Result"].map(function (t) { return h("th", { scope: "col", text: t }); }))),
          h("tbody", null, rows.map(function (x) {
            var t = x.t;
            return h("tr", { "class": x.d <= 1 ? "" : "far" }, h("th", { scope: "row" }, h("a", { href: "#/investigation/" + t.inv, text: t.acr })), h("td", { text: t.fuel }),
              h("td", { "class": "num", text: t.o2 + " %" }), h("td", { "class": "num", text: t.p + " psi" }),
              h("td", { "class": t.out === "burn" ? "burn" : t.out ? "" : "noburn", text: OUT[t.out] }), h("td", { text: t.res.length > 110 ? t.res.slice(0, 110) + " ..." : t.res }));
          })))) : h("p", { "class": "empty", text: "Nothing to show for this fuel type." }),
        h("p", { "class": "note", text: "Rows in lighter text are outside the 5 % and 2 psi window. Only tests whose oxygen is the chamber atmosphere are counted; inverse flames are left out." }));
      chart.replaceChildren(A.plane(null, null, { o2: probe.o2, p: probe.p, ro: RO, rp: RP, type: probe.type }));
    }
    function slider(id, label, key, min, max, step, out) {
      var input = h("input", { type: "range", id: id, min: min, max: max, step: step, value: probe[key],
        oninput: function () { probe[key] = +input.value; paint(); } });
      return h("label", { "for": id }, h("span", { text: label }), input, out);
    }
    var typeSel = h("select", { id: "p-type", onchange: function () { probe.type = typeSel.value; paint(); } },
      h("option", { value: "", text: "Any fuel" }), A.TYPES.map(function (t) { return h("option", { value: t[0], text: cap(t[0]), selected: probe.type === t[0] ? "" : null }); }));
    var controls = h("div", { "class": "controls" },
      slider("p-o2", "Oxygen", "o2", 10, 100, 0.5, outO), slider("p-p", "Pressure", "p", 3, 24, 0.1, outP),
      h("label", { "for": "p-type" }, h("span", { text: "Fuel" }), typeSel));
    var presets = h("div", { "class": "presets" }, h("span", { text: "Start from" }), PRESETS.map(function (p) {
      return h("button", { type: "button", "class": "action quiet small", onclick: function () {
        probe.o2 = p[1]; probe.p = p[2];
        document.getElementById("p-o2").value = p[1]; document.getElementById("p-p").value = p[2]; paint();
      } }, p[0]);
    }));
    A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "sheet page" },
      h("h1", { text: "Will it burn?" }),
      h("p", { "class": "intro", text: "Set an atmosphere and a fuel, and see what was actually tested near it and how those tests ended. This is evidence, not a prediction: where nothing was tested, it says so." }),
      presets, controls,
      h("div", { "class": "lead burnlead" }, results, chart), list)));
    paint();
  }

  /* ---------- data ---------- */
  var filt = { inv: "", type: "", q: "", shown: 50 };
  function dataView() {
    document.title = "Data · One Fire, Many Worlds";
    var focused = document.activeElement && document.activeElement.id, caret = focused === "d-q" ? document.activeElement.selectionStart : null;
    var q = filt.q.trim().toLowerCase();
    var rows = D.tests.filter(function (t) {
      return (!filt.inv || t.inv === filt.inv) && (!filt.type || t.type === filt.type) &&
        (!q || (t.fuel + " " + t.acr + " " + t.id + " " + t.res + " " + t.family).toLowerCase().indexOf(q) >= 0);
    });
    var page = rows.slice(0, filt.shown);
    var invSel = h("select", { id: "d-inv", onchange: function () { filt.inv = invSel.value; filt.shown = 50; dataView(); } },
      h("option", { value: "", text: "All" }), D.investigations.filter(function (i) { return i.tests; }).map(function (i) { return h("option", { value: i.id, text: i.acr, selected: filt.inv === i.id ? "" : null }); }));
    var typeSel = h("select", { id: "d-type", onchange: function () { filt.type = typeSel.value; filt.shown = 50; dataView(); } },
      h("option", { value: "", text: "All" }), A.TYPES.map(function (t) { return h("option", { value: t[0], text: cap(t[0]), selected: filt.type === t[0] ? "" : null }); }));
    var search = h("input", { type: "search", id: "d-q", value: filt.q, placeholder: "Material, test or result", oninput: function () { filt.q = search.value; filt.shown = 50; dataView(); } });
    A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "sheet page" },
      h("h1", { text: "Data" }),
      h("p", { "class": "intro", text: "Every individual test behind this site, in one table with one format: " + fmt(D.summary.tests) + " tests from the repository, " + fmt(D.summary.withO2AndPressure) + " of them with oxygen and pressure together. Each row names the table and row it came from." }),
      h("div", { "class": "filters" },
        h("label", { "for": "d-inv" }, h("span", { text: "Investigation" }), invSel), h("label", { "for": "d-type" }, h("span", { text: "Fuel" }), typeSel),
        h("label", { "for": "d-q" }, h("span", { text: "Search" }), search),
        h("a", { "class": "action", href: "data/tests.csv", download: "one-fire-many-worlds-tests.csv", text: "Download all tests (CSV)" })),
      rows.length ? h("div", { "class": "table" }, h("table", null,
        h("thead", null, h("tr", null, ["Investigation", "Test", "Fuel or material", "Oxygen", "Pressure", "Flow", "How it ended", "Result", "Source row"].map(function (t) { return h("th", { scope: "col", text: t }); }))),
        h("tbody", null, page.map(function (t) {
          return h("tr", null, h("th", { scope: "row" }, h("a", { href: "#/investigation/" + t.inv, text: t.acr })), h("td", { "class": "num", text: t.id }), h("td", { text: t.fuel }),
            h("td", { "class": "num", text: t.o2 === null ? "" : t.o2 + " %" }), h("td", { "class": "num", text: t.p === null ? "" : t.p + " psi" }),
            h("td", { "class": "num", text: t.flow === null ? "" : t.flow + " cm/s" }), h("td", { text: t.out ? OUT[t.out] : "" }),
            h("td", { text: t.res.length > 120 ? t.res.slice(0, 120) + " ..." : t.res }), h("td", { "class": "num", text: t.row }));
        })))) : h("p", { "class": "empty", text: "No test matches. Clear the search or set a filter back to All." }),
      h("p", { "class": "note", text: "Showing " + fmt(page.length) + " of " + fmt(rows.length) + " matching tests." }),
      rows.length > page.length ? h("p", { "class": "links" }, h("button", { type: "button", id: "d-more", "class": "action quiet", onclick: function () { filt.shown += 100; dataView(); } }, "Show 100 more")) : null,
      h("p", { "class": "note", text: "Source: " + D.summary.source + ". The download is the cleaned table in English; the oxygen reference column tells chamber atmosphere from burner gas." }))));
    var again = focused && document.getElementById(focused);
    if (again) { again.focus(); if (caret !== null && again.setSelectionRange) again.setSelectionRange(caret, caret); }
  }

  A.section({ id: "timeline", label: "Timeline", href: "#/timeline" }, timelineView);
  A.section({ id: "burn", label: "Will it burn?", href: "#/burn" }, burnView);
  A.section({ id: "data", label: "Data", href: "#/data" }, dataView);
})();
