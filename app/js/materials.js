/* Material passport: for each solid material, everything the site holds about it, in one place: whether it burns,
   what smoke it makes, whether the detector sees it, the pages of the documents that speak of it, its figures,
   its tests, and what is still missing. Documents are grouped by where the evidence comes from, so a ground test
   is never read as a test in orbit. */
(function () {
  "use strict";
  var A = window.OFMW_APP, h = A.h, fmt = A.fmt, plural = A.plural, D = A.D, C = A.C, T = A.T;
  if (!D || !C) return;
  var E = window.OFMW_EVIDENCE || [], F = window.OFMW_FIGURES || [], L = window.OFMW_LANG === "es" ? "es" : "en";
  var OUT = { out: T("went out by itself"), burn: T("kept burning"), none: T("did not ignite or spread") };
  var maxD = Math.max.apply(null, D.materials.map(function (m) { return m.smoke.medianDiameterNm || 0; }));
  var maxV = Math.max.apply(null, D.materials.map(function (m) { return m.smoke.detectorMedianV || 0; }));
  var MOON_O2 = 30;                                   /* the Moon-base air of the challenge: 30 % oxygen or more (content.js, agenda) */

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
    { id: "flight", label: T("In microgravity"), note: T("Tests in orbit, in parabolic flight or in drop towers, and the reports about them."), has: ["microgravity"] },
    { id: "ground", label: T("On the ground, in partial gravity and in standards"), note: T("Tests in normal gravity or in partial gravity for a few seconds, NASA's acceptance standard for materials, and earlier memos. They do not measure microgravity."), has: ["ground", "partial", "standard", "history"] },
    { id: "planned", label: T("Planned, no data yet"), note: T("Experiments that are designed or proposed. Nothing has been measured yet."), has: ["planned"] }
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
    return h("p", { "class": "known outside" }, h("span", { "class": "tag tag-outside", text: T("outside PSI") }), " ", text,
      ev ? h("a", { href: "#/source/" + id, text: T("See the page") }) : null);
  }

  function href(m) { return "#/material/" + encodeURIComponent(m.name); }
  function range(r, unit) { return r ? (r[0] === r[1] ? r[0] : r[0] + T(" to ") + r[1]) + " " + unit : T("Not recorded"); }
  function bar(value, max, cls) {
    return h("span", { "class": "bar " + cls, style: "width:" + Math.max(2, Math.round(value / max * 100)) + "%", "aria-hidden": "true" });
  }
  function measure(value, max, unit, cls) {
    if (value === null || value === undefined) return h("span", { "class": "missing", text: T("No data") });
    return h("span", { "class": "meter" }, h("span", { "class": "num", text: value + " " + unit }), h("span", { "class": "rail" }, bar(value, max, cls)));
  }
  function pairs(m) {
    var key = m.name.split(" ")[0];
    return D.gravityPairs.filter(function (g) { return g.material.indexOf(key) >= 0; });
  }
  function outcomes(o) {
    var k = Object.keys(o || {});
    return k.length ? k.map(function (x) { return o[x] + " " + OUT[x]; }).join("; ") : "";
  }

  /* ---------- list ---------- */
  function listView() {
    document.title = T("Materials · One Fire, Many Worlds");
    var full = D.materials.filter(function (m) { return m.burn.tests && m.smoke.runs && m.smoke.detectorMedianV !== null; });
    var table = h("table", { "class": "list" },
      h("thead", null, h("tr", null, [T("Material"), T("Burn tests"), T("Oxygen tested (%)"), T("Smoke runs"), T("Smoke particle size (nm)"), T("Detector response (V)"), T("Pages and figures")].map(function (t) { return h("th", { scope: "col", text: t }); }))),
      h("tbody", null, D.materials.map(function (m) {
        var docs = pagesOf(m).length + figuresOf(m).length;
        return h("tr", null,
          h("th", { scope: "row" }, h("a", { href: href(m), text: T(m.name) }), h("span", { "class": "sub", text: C.materials[m.name] })),
          h("td", { "class": m.burn.tests ? "num" : "" }, m.burn.tests ? fmt(m.burn.tests) : h("span", { "class": "missing", text: T("No data") })),
          h("td", { "class": "num", text: m.burn.o2 ? (m.burn.o2[0] === m.burn.o2[1] ? String(m.burn.o2[0]) : m.burn.o2[0] + T(" to ") + m.burn.o2[1]) : "" }),
          h("td", { "class": m.smoke.runs ? "num" : "" }, m.smoke.runs ? fmt(m.smoke.runs) : h("span", { "class": "missing", text: T("No data") })),
          h("td", null, measure(m.smoke.medianDiameterNm, maxD, "nm", "solid")),
          h("td", null, measure(m.smoke.detectorMedianV, maxV, "V", "gas")),
          h("td", { "class": "num" }, docs ? h("a", { href: href(m), text: String(docs) }) : h("span", { "class": "missing", text: "0" })));
      })));
    A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "sheet page" },
      h("h1", { text: T("Material passport") }),
      h("p", { "class": "intro", text: T("Prevention starts with choosing materials. For each solid material in NASA's repository: was it burned, what smoke does it make, and does the Station detector see that smoke? ") + (full.length === 1 ? T("Only ") + T(full[0].name).toLowerCase() + T(" has all three answers.") : full.length + T(" materials have all three answers.")) + T(" Open a material to see everything the site holds about it.") }),
      A.apaTable(1, T("What is known about each solid material in PSI"), table,
        T("Burn tests and oxygen come from the experimental tables of PSI. Particle size is the median count mean diameter of the SAME-R runs. Detector response is the median change in the obscuration signal of the Station smoke detector in SAME-R; it is a coarse summary that ranks materials and does not give an alarm threshold. Pages and figures counts the cited report pages and figures that speak of the material.")))));
  }

  /* ---------- passport ---------- */
  function block(title, body) { return h("section", { "class": "front" }, h("h3", { text: title }), body); }
  function docLabel(e) { return e.doc[L] + ", " + (e.page ? T("p. ") + e.page : T("Pages ") + e.pageLabel); }
  function documents(m) {
    var list = pagesOf(m);
    if (!list.length) return [h("h2", { text: T("What the documents say") }),
      h("p", { "class": "empty", text: T("No cited page of a report speaks of this material yet.") })];
    return [h("h2", { text: T("What the documents say") }),
      h("p", { text: T("Each page opens in place, with the passage marked. Grouped by where the evidence comes from.") }),
      GROUPS.map(function (g) {
        var mine = list.filter(function (e) { return g.has.indexOf(origin(e)) >= 0; });
        if (!mine.length) return null;
        return h("section", { "class": "evgroup evgroup-" + g.id },
          h("h3", null, g.label, h("span", { "class": "count", text: " (" + mine.length + ")" })),
          h("p", { "class": "note", text: g.note }),
          h("ul", { "class": "evlist" }, mine.map(function (e) {
            var o = origin(e);
            return h("li", null,
              h("a", { href: "#/source/" + e.id, text: docLabel(e) }),
              TAG[o] ? h("span", { "class": "tag tag-" + o, text: TAG[o] }) : !e.docInv ? h("span", { "class": "tag tag-outside", text: T("document outside PSI") }) : null,
              h("span", { "class": "claim", text: e.claim[L] }));
          })));
      })];
  }
  function figures(m, num) {
    var list = figuresOf(m), team = list.filter(function (f) { return f.team; }), reports = list.filter(function (f) { return !f.team; });
    if (!list.length) return null;
    var group = function (title, items, note) {
      return items.length ? h("section", { "class": "figgroup" }, h("p", { "class": "sublabel", text: title + " (" + items.length + ")" }), A.figureThumbs(items, num), h("p", { "class": "note", text: note })) : null;
    };
    return [h("h2", { text: T("Figures and images") }),
      group(T("From the reports"), reports, T("Cut from NASA's reports; each opens with its caption as written, its page and its source. Ground tests are marked.")),
      group(T("Gathered by the team"), team, T("Images the team gathered, each with its credit and its license. Ground tests are marked."))];
  }
  function gravityTable(gp, n) {
    var zero = function (v) { return /^~ 0/.test(v); };
    return A.apaTable(n, T("The same samples burned in orbit and on the ground (Saffire-II)"),
      h("table", null,
        h("thead", null, h("tr", null, [T("Sample"), T("Material"), T("Thickness"), T("Burned in microgravity"), T("Burned in normal gravity")].map(function (t) { return h("th", { scope: "col", text: t }); }))),
        h("tbody", null, gp.map(function (g) {
          return h("tr", null, h("th", { scope: "row", text: g.sample }), h("td", { text: g.material }), h("td", { text: g.thickness }),
            h("td", { "class": zero(g.microBurn) ? "noburn" : "burn", text: g.microBurn }), h("td", { "class": zero(g.normalBurn) ? "noburn" : "burn", text: g.normalBurn }));
        }))),
      T("Source: PSI-99 (Saffire-II) experimental table. Lengths as written in the table; \"Complete\" means the whole sample burned."));
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
    return [h("h2", { text: T("What is still to be tested") }),
      h("ul", { "class": "replist gaps" }, out.map(function (t) { return h("li", { text: t }); })),
      h("p", { "class": "note", text: T("Read from the data above. Which gap matters most is the team's interpretation.") })];
  }

  function passportView(parts) {
    var name = decodeURIComponent(parts.join("/") || "");
    var m = D.materials.filter(function (x) { return x.name === name; })[0];
    if (!m) { A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "error" }, h("h1", { text: T("No such material") }),
      h("p", null, h("a", { href: "#/materials", text: T("See all materials") }), ".")))); return; }
    document.title = T(m.name) + " · One Fire, Many Worlds";
    var gp = pairs(m), tests = D.tests.filter(function (t) { return t.family === m.name; }), num = A.counter();
    var invs = Object.keys(m.byInv), top = m.burn.o2 ? m.burn.o2[1] : null;
    var burn = m.burn.tests ? [
      h("p", { "class": "known" }, h("strong", { text: plural(m.burn.tests, "burn test") }), T(" at ") + range(m.burn.o2, T("% oxygen")) + (m.burn.flow ? T(" and airflow of ") + range(m.burn.flow, "cm/s") : "") + "."),
      outcomes(m.burn.outcomes) ? h("p", { "class": "known", text: T("Recorded endings: ") + outcomes(m.burn.outcomes) + "." }) : h("p", { "class": "known", text: T("Results are free-text observations; no ending is classified in the data.") }),
      top !== null ? h("p", { "class": "known", text: T("In PSI it was never tested above ") + top + T(" % oxygen: PSI holds nothing about it in Moon-base air.") }) : null,
      outsideNote(m)
    ] : [h("p", { "class": "known nodata", text: T("No burn test in the repository.") }), outsideNote(m)];
    var smoke = m.smoke.runs ? [
      h("p", { "class": "known" }, h("strong", { text: plural(m.smoke.runs, "smoke run") }), ", " + m.smoke.withSize + T(" with particle size in SAME-R.")),
      h("p", { "class": "known" }, T("Median particle diameter: "), measure(m.smoke.medianDiameterNm, maxD, "nm", "solid"))
    ] : h("p", { "class": "known nodata", text: T("No smoke measurement in the repository.") });
    var det = m.smoke.detectorMedianV !== null ? [
      h("p", { "class": "known" }, T("Median change in the Station detector signal: "), measure(m.smoke.detectorMedianV, maxV, "V", "gas")),
      h("p", { "class": "known", text: T("From ") + m.smoke.detectorRuns + T(" SAME-R runs. The Station detector measures scattered light and responds best to particles larger than one micrometer, so finer smoke gives a weaker signal.") })
    ] : h("p", { "class": "known nodata", text: T("No detector data in the repository.") });
    var nPages = pagesOf(m).length, nFigs = figuresOf(m).length;

    A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "sheet page" },
      h("p", { "class": "crumb" }, h("a", { href: "#/materials", text: T("Materials") }), " / " + T(m.name)),
      h("h1", { text: T(m.name) }),
      h("p", { "class": "intro", text: C.materials[m.name] }),
      h("p", { "class": "tally", text: plural(tests.length, "test") + " · " + plural(nPages, "cited page") + " · " + plural(nFigs, "figure") + " · " + plural(invs.length, "investigation") }),
      h("div", { "class": "fronts" }, block(T("Does it burn?"), burn), block(T("What smoke does it make?"), smoke), block(T("Does the detector see it?"), det)),
      documents(m),
      figures(m, num),
      gp.length ? [h("h2", { text: T("In orbit and on the ground") }), gravityTable(gp, num.table())] : null,
      h("h2", { text: T("Its tests") }),
      h("p", { "class": "links" }, invs.map(function (acr, k) {
        var i = D.investigations.filter(function (x) { return x.acr === acr; })[0];
        return [k ? " · " : "", i ? A.invLink(i) : acr, " (" + plural(m.byInv[acr], "test") + ")"];
      })),
      tests.length ? [A.testsTable(tests.slice(0, 10), num.table(), T("First ") + Math.min(10, tests.length) + T(" of ") + fmt(tests.length) + T(" tests of ") + T(m.name)),
        h("p", { "class": "links" }, h("a", { href: "#/data/material/" + encodeURIComponent(m.name), text: T("See all its tests in Data") }))] : null,
      gaps(m))));
  }

  A.section({ id: "materials", label: T("Materials"), href: "#/materials" }, listView);
  A.route("material", "materials", passportView);
})();
