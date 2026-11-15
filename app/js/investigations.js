/* Investigations: the ranked list with filters, the record of each one, and the side-by-side comparison. */
(function () {
  "use strict";
  var A = window.OFMW_APP, h = A.h, add = A.add, fmt = A.fmt, plural = A.plural, D = A.D, C = A.C, T = A.T;
  if (!D || !C) return;
  var FRONT_LABEL = { prevention: T("Prevention"), detection: T("Detection"), suppression: T("Suppression"), "basic science": T("Flame science") };
  var OUT_LABEL = { out: T("went out by itself"), burn: T("kept burning"), none: T("did not ignite or spread") };
  var state = { front: "", fuel: "", hw: "", sort: "relevance", dir: -1, picked: [] };

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
  function select(label, key, options) {
    var sel = h("select", { id: "f-" + key, onchange: function () { state[key] = sel.value; listView(); } },
      h("option", { value: "", text: T("All") }), options.map(function (o) { return h("option", { value: o[0], text: o[1], selected: state[key] === o[0] ? "" : null }); }));
    return h("label", { "for": "f-" + key }, h("span", { text: label }), sel);
  }
  function uniq(key) {
    var seen = {};
    D.investigations.forEach(function (i) { seen[i[key]] = 1; });
    return Object.keys(seen).sort();
  }

  /* ---------- list ---------- */
  var COLS = [["acr", T("Investigation")], ["front", T("Front")], ["fuelType", T("Fuel")], ["tests", T("Tests")], ["o2", T("Oxygen")], ["p", T("Pressure")], ["relevance", T("Relevance")]];
  function sortValue(i, key) {
    if (key === "relevance") return A.REL[i.relevance] * 10000 + i.tests;
    if (key === "o2" || key === "p") return i[key] ? i[key][1] : -1;
    return i[key];
  }
  function listView() {
    document.title = T("Investigations · One Fire, Many Worlds");
    var focused = document.activeElement && document.activeElement.id;
    var rows = D.investigations.filter(function (i) {
      return (!state.front || i.front === state.front) && (!state.fuel || i.fuelType === state.fuel) && (!state.hw || i.hw === state.hw);
    }).sort(function (a, b) {
      var x = sortValue(a, state.sort), y = sortValue(b, state.sort);
      return (x < y ? -1 : x > y ? 1 : 0) * state.dir || a.acr.localeCompare(b.acr);
    });
    var head = h("tr", null, h("th", { scope: "col", text: T("Compare") }), COLS.map(function (c) {
      var on = state.sort === c[0];
      return h("th", { scope: "col", "aria-sort": on ? (state.dir > 0 ? "ascending" : "descending") : null },
        h("button", { type: "button", "class": "sort", onclick: function () { state.dir = on ? -state.dir : (c[0] === "acr" || c[0] === "front" || c[0] === "fuelType" ? 1 : -1); state.sort = c[0]; listView(); } },
          c[1], on ? h("span", { "class": "dir", text: state.dir > 0 ? T(" ascending") : T(" descending") }) : null));
    }));
    var body = rows.map(function (i) {
      var picked = state.picked.indexOf(i.id) >= 0;
      var box = h("input", { type: "checkbox", id: "c-" + i.id, checked: picked ? "" : null, disabled: !picked && state.picked.length >= 3 ? "" : null,
        "aria-label": T("Compare ") + i.acr, onchange: function () {
          if (box.checked) state.picked.push(i.id); else state.picked.splice(state.picked.indexOf(i.id), 1);
          listView();
        } });
      return h("tr", { "class": picked ? "picked" : "" }, h("td", { "class": "check" }, box),
        h("th", { scope: "row" }, h("a", { href: "#/investigation/" + i.id, text: i.acr }), h("span", { "class": "sub", text: C.investigations[i.id].line })),
        h("td", { text: FRONT_LABEL[i.front] }), h("td", { text: T(cap(i.fuelType)) }), h("td", { "class": "num", text: i.tests ? fmt(i.tests) : T("None") }),
        h("td", { "class": "num", text: i.o2 ? range(i.o2, "%") : "" }), h("td", { "class": "num", text: i.p ? range(i.p, "psi") : "" }),
        h("td", { text: T(cap(i.relevance)) }));
    });
    var n = state.picked.length;
    A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "sheet page" },
      h("h1", { text: T("Investigations") }),
      h("p", { "class": "intro", text: T("The ") + D.investigations.length + T(" combustion investigations in NASA's repository that bear on fire safety, ranked by relevance. The relevance grade is our reading of each record, and every record explains it.") }),
      h("div", { "class": "filters" },
        select(T("Front"), "front", Object.keys(FRONT_LABEL).map(function (k) { return [k, FRONT_LABEL[k]]; })),
        select(T("Fuel"), "fuel", uniq("fuelType").map(function (k) { return [k, T(cap(k))]; })),
        select(T("Hardware"), "hw", uniq("hw").map(function (k) { return [k, T(k)]; })),
        h("a", { "class": "action" + (n >= 2 ? "" : " off"), href: n >= 2 ? "#/compare/" + state.picked.join(",") : null, "aria-disabled": n >= 2 ? null : "true",
          text: n >= 2 ? T("Compare ") + n + T(" side by side") : T("Tick two or three to compare") })),
      rows.length ? h("div", { "class": "table" }, h("table", { "class": "list" }, h("thead", null, head), h("tbody", null, body)))
        : h("p", { "class": "empty", text: T("No investigation matches these filters. Set a filter back to All.") }),
      h("p", { "class": "note", text: plural(rows.length, "investigation") + T(" shown. Tests are the individual tests in the cleaned data; some investigations publish only test days or no table at all.") }))));
    var again = focused && document.getElementById(focused);
    if (again) again.focus();
  }

  /* One layout for every table of tests, wherever it appears: a record, an answer or a report. */
  A.testsTable = function (list, n, title, lead) {
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
    return A.apaTable(n, title, table, [lead || "",
      T("Data from the experimental tables of NASA's PSI repository, downloaded November 13, 2026. Each test opens in Data; the last column gives the table and the row it comes from. Oxygen is that of the chamber atmosphere. An empty cell means the table does not record that value. The result is quoted in English, as in the table."),
      burner ? " " + T("* Oxygen of the gas leaving the burner, not of the atmosphere.") : ""]);
  };

  /* ---------- record ---------- */
  function fact(label, value) { return h("div", null, h("dt", { text: label }), h("dd", null, value)); }
  function recordView(parts) {
    var i = A.inv(parts[0]);
    if (!i) { A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "error" }, h("h1", { text: T("No such investigation") }),
      h("p", null, T("There is no record called ") + (parts[0] || "that") + ". ", h("a", { href: "#/investigations", text: T("See all investigations") }), ".")))); return; }
    var c = C.investigations[i.id];
    document.title = i.acr + " · One Fire, Many Worlds";
    var tests = D.tests.filter(function (t) { return t.inv === i.id; });
    var sample = tests.slice(0, 10), num = A.counter();
    var nasa = function (body) {
      return body ? h("p", { "class": "nasa", lang: "en", text: body }) : h("p", { "class": "empty", text: T("Not stated in the PSI record.") });
    };
    var step = function (n, label, content) { return h("section", { "class": "step" }, h("h3", null, h("span", { "class": "stepn", text: n + ". " }), label), content); };
    var row = function (label, value) { return h("tr", null, h("th", { scope: "row", text: label }), h("td", null, value)); };
    var people = (i.investigators || "").split(/;\s*/).filter(Boolean);
    /* What was measured and with what: only what the PSI record and its table give; what is missing is said, not guessed. */
    var how = A.apaTable(num.table(), T("What ") + i.acr + T(" varied, what it measured and with what equipment"),
      h("table", { "class": "how" },
        h("thead", null, h("tr", null, h("th", { scope: "col", text: T("Aspect") }), h("th", { scope: "col", text: T("What the PSI record and its table say") }))),
        h("tbody", null,
          row(T("What was varied"), i.varied.length ? cap(i.varied.map(T).join(", ")) : T("Not visible in the table")),
          row(T("What was measured"), i.measures.length ? cap(i.measures.map(T).join(", ")) : T("Not given in the table")),
          row(T("Facility or equipment"), i.facility || T("Not stated in the PSI record.")),
          row(T("Equipment group on this site"), T(i.hw)),
          row(T("Where it ran"), i.platform || T("Not stated in the PSI record.")),
          row(T("Instrument for each variable"), T("The PSI record does not name it; it has to be read in the reports of the investigation.")),
          row(T("How tests ended"), outcomes(i)))),
      T("Facility and platform are quoted from the PSI record, in English. What was varied and what was measured are read from the columns of its experimental table."));
    var study = h("div", { "class": "study" },
      h("h2", { text: T("The study, step by step") }),
      h("p", { text: T("Objective, hypothesis and method are NASA's text from the PSI record, unchanged.") }),
      step(1, T("Objective"), nasa(i.objectives)),
      step(2, T("Hypothesis"), nasa(i.hypothesis)),
      step(3, T("Method"), nasa(i.approach)),
      step(4, T("What was measured, and with what"), how),
      step(5, T("Results"), [
        h("p", { text: T("The finding is stated at the top of this page. This is the evidence behind it.") }),
        A.sourceList ? A.sourceList(i.id) : null,
        sample.length ? [A.testsTable(sample, num.table(), T("First ") + sample.length + T(" of ") + fmt(tests.length) + T(" tests of ") + i.acr, T("Source: ") + tests[0].src + ". "),
          h("p", { "class": "links" }, h("a", { href: "#/data/" + i.id, text: T("See all its tests in Data") }))]
          : h("p", { "class": "empty", text: T("No individual tests in the data") }),
        A.figureGallery ? A.figureGallery(i.id, true) : null]),
      step(6, T("Limits"), [
        c.caveat ? h("p", { "class": "caveat", text: c.caveat }) : h("p", { text: T("The team did not note a specific caveat for this investigation.") }),
        h("p", { "class": "note", text: T("Summary, finding and caveat were written with AI from the PSI record and its reports, then checked against the data.") })]),
      step(7, T("Who did it"), [
        people.length ? h("ul", { "class": "people" }, people.map(function (p) { return h("li", { text: p }); })) : h("p", { "class": "empty", text: T("Not stated in the PSI record.") }),
        h("p", { "class": "cite", text: i.cite }),
        h("p", { "class": "links" }, h("a", { href: i.url, target: "_blank", rel: "noopener", text: T("Open the PSI record") }),
          i.doi ? [" · ", h("a", { href: "https://doi.org/" + i.doi, target: "_blank", rel: "noopener", text: "DOI " + i.doi })] : null,
          " · " + plural(i.pubs, "publication") + T(" listed · record version ") + i.version + T(", modified ") + i.modified + T(" · license ") + i.license)]),
      i.earth ? h("div", { "class": "words" }, h("details", null, h("summary", { text: T("Benefits on Earth") }), h("p", { lang: "en", text: i.earth }))) : null);
    A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "sheet page" },
      h("p", { "class": "crumb" }, h("a", { href: "#/investigations", text: T("Investigations") }), " / " + i.id),
      h("div", { "class": "lead" },
        h("div", null,
          h("h1", { text: i.acr }), h("p", { "class": "headline", text: i.title }),
          h("p", { "class": "takeaway", text: c.line }),
          h("dl", { "class": "facts" },
            fact(T("Front"), FRONT_LABEL[i.front]),
            fact(T("Relevance"), [h("strong", { text: T(cap(i.relevance)) }), ". " + c.why]),
            fact(T("Fuels"), i.fuels.length ? i.fuels.join("; ") : T(cap(i.fuelType))),
            fact(T("Shape and size"), shapes(i.id)),
            fact(T("Oxygen"), range(i.o2, "%")), fact(T("Pressure"), range(i.p, "psi")), fact(T("Airflow"), range(i.flow, "cm/s")),
            fact(T("Years"), years(i)), fact(T("Tests"), i.tests ? fmt(i.tests) + T(" individual tests in the data") : T("No individual tests in the data")))),
        h("div", null, A.plane(null, i.id),
          h("h2", { "class": "tight", text: T("What it found") }), h("p", { "class": "finding", text: c.finding }))),
      study)));
  }

  /* ---------- compare ---------- */
  function compareView(parts) {
    var list = (parts[0] || "").split(",").map(A.inv).filter(Boolean).slice(0, 3);
    if (list.length < 2) { location.hash = "#/investigations"; return; }
    document.title = T("Compare · One Fire, Many Worlds");
    var ROWS = [
      [T("In one line"), function (i) { return C.investigations[i.id].line; }],
      [T("Front"), function (i) { return FRONT_LABEL[i.front]; }],
      [T("Relevance"), function (i) { return T(cap(i.relevance)); }],
      [T("Fuel type"), function (i) { return T(cap(i.fuelType)); }],
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
      [T("What it found"), function (i) { return C.investigations[i.id].finding; }]
    ];
    var same = 0;
    var body = ROWS.map(function (r) {
      var vals = list.map(r[1]), eq = vals.every(function (v) { return v === vals[0]; });
      if (eq) same++;
      return h("tr", { "class": eq ? "same" : "" }, h("th", { scope: "row" }, r[0], h("span", { "class": "sub", text: eq ? T("Same") : T("Differs") })),
        vals.map(function (v) { return h("td", { text: v }); }));
    });
    A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "sheet page" },
      h("p", { "class": "crumb" }, h("a", { href: "#/investigations", text: T("Investigations") }), T(" / Compare")),
      h("h1", { text: list.map(function (i) { return i.acr; }).slice(0, -1).join(", ") + T(" and ") + list[list.length - 1].acr }),
      h("p", { "class": "intro", text: T("The attributes the challenge asks to compare, side by side. ") + same + T(" of ") + ROWS.length + T(" are the same across these investigations; the rest differ.") }),
      h("div", { "class": "table" }, h("table", { "class": "cmp" },
        h("thead", null, h("tr", null, h("th", { scope: "col", text: T("Attribute") }), list.map(function (i) { return h("th", { scope: "col" }, h("a", { href: "#/investigation/" + i.id, text: i.acr })); }))),
        h("tbody", null, body))),
      h("p", { "class": "links" }, h("a", { href: "#/investigations", text: T("Change the selection") })))));
  }

  A.section({ id: "investigations", label: T("Investigations"), href: "#/investigations" }, listView);
  A.route("investigation", "investigations", recordView);
  A.route("compare", "investigations", compareView);
})();
