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

  /* ---------- record ---------- */
  function fact(label, value) { return h("div", null, h("dt", { text: label }), h("dd", null, value)); }
  function recordView(parts) {
    var i = A.inv(parts[0]);
    if (!i) { A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "error" }, h("h1", { text: T("No such investigation") }),
      h("p", null, T("There is no record called ") + (parts[0] || "that") + ". ", h("a", { href: "#/investigations", text: T("See all investigations") }), ".")))); return; }
    var c = C.investigations[i.id];
    document.title = i.acr + " · One Fire, Many Worlds";
    var tests = D.tests.filter(function (t) { return t.inv === i.id; });
    var sample = tests.slice(0, 10);
    var text = function (label, body) { return body ? h("details", null, h("summary", { text: label }), h("p", { text: body })) : null; };
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
            fact(T("What varied"), i.varied.length ? cap(i.varied.map(T).join(", ")) : T("Not visible in the table")),
            fact(T("What was measured"), i.measures.length ? cap(i.measures.map(T).join(", ")) : T("Not given in the table")),
            fact(T("How tests ended"), outcomes(i)),
            fact(T("Hardware"), T(i.hw) + (i.facility ? " (" + i.facility + ")" : "")),
            fact(T("Years"), years(i)), fact(T("Tests"), i.tests ? fmt(i.tests) + T(" individual tests in the data") : T("No individual tests in the data")))),
        h("div", null, A.plane(null, i.id),
          h("h2", { "class": "tight", text: T("What it found") }), h("p", { "class": "finding", text: c.finding }),
          c.caveat ? h("p", { "class": "caveat" }, h("strong", { text: T("Caveat. ") }), c.caveat) : null,
          h("p", { "class": "note", text: T("Summary, finding and caveat were written with AI from the PSI record and its reports, then checked against the data.") }))),
      h("h2", { text: T("In NASA's words") }),
      h("p", { text: T("Text from the PSI record, unchanged.") }),
      h("div", { "class": "words" }, text(T("Objectives"), i.objectives), text(T("Approach"), i.approach), text(T("Hypothesis"), i.hypothesis), text(T("Benefits on Earth"), i.earth)),
      sample.length ? [h("h2", { text: T("Its tests") }),
        h("div", { "class": "table" }, h("table", null,
          h("thead", null, h("tr", null, [T("Test"), T("Fuel or material"), T("Oxygen"), T("Pressure"), T("Flow"), T("Result"), T("Source row")].map(function (t) { return h("th", { scope: "col", text: t }); }))),
          h("tbody", null, sample.map(function (t) {
            return h("tr", null, h("th", { scope: "row", text: t.id || T("(no id)") }), h("td", { text: t.fuel }),
              h("td", { "class": "num", text: t.o2 === null ? "" : t.o2 + " %" }), h("td", { "class": "num", text: t.p === null ? "" : t.p + " psi" }),
              h("td", { "class": "num", text: t.flow === null ? "" : t.flow + " cm/s" }), h("td", { text: t.res.length > 150 ? t.res.slice(0, 150) + " ..." : t.res }), h("td", { "class": "num", text: t.row }));
          })))),
        h("p", { "class": "note", text: T("Showing ") + sample.length + T(" of ") + fmt(tests.length) + T(". Source: ") + tests[0].src + "." })] : null,
      h("h2", { text: T("Cite and open") }),
      h("p", { "class": "cite", text: i.cite }),
      h("p", { "class": "links" }, h("a", { href: i.url, target: "_blank", rel: "noopener", text: T("Open the PSI record") }),
        i.doi ? [" · ", h("a", { href: "https://doi.org/" + i.doi, target: "_blank", rel: "noopener", text: "DOI " + i.doi })] : null,
        " · " + plural(i.pubs, "publication") + T(" listed · record version ") + i.version + T(", modified ") + i.modified + T(" · license ") + i.license))));
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
