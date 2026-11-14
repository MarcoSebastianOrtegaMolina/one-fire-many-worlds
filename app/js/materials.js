/* Material passport: for each solid material, whether it burns, what smoke it makes and whether the detector sees it. */
(function () {
  "use strict";
  var A = window.OFMW_APP, h = A.h, fmt = A.fmt, plural = A.plural, D = A.D, C = A.C;
  if (!D || !C) return;
  var OUT = { out: "went out by itself", burn: "kept burning", none: "did not ignite or spread" };
  var maxD = Math.max.apply(null, D.materials.map(function (m) { return m.smoke.medianDiameterNm || 0; }));
  var maxV = Math.max.apply(null, D.materials.map(function (m) { return m.smoke.detectorMedianV || 0; }));

  function href(m) { return "#/material/" + encodeURIComponent(m.name); }
  function range(r, unit) { return r ? (r[0] === r[1] ? r[0] : r[0] + " to " + r[1]) + " " + unit : "Not recorded"; }
  function bar(value, max, cls) {
    return h("span", { "class": "bar " + cls, style: "width:" + Math.max(2, Math.round(value / max * 100)) + "%", "aria-hidden": "true" });
  }
  function measure(value, max, unit, cls) {
    if (value === null || value === undefined) return h("span", { "class": "missing", text: "No data" });
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

  function listView() {
    document.title = "Materials · One Fire, Many Worlds";
    var full = D.materials.filter(function (m) { return m.burn.tests && m.smoke.runs && m.smoke.detectorMedianV !== null; });
    A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "sheet page" },
      h("h1", { text: "Material passport" }),
      h("p", { "class": "intro", text: "Prevention starts with choosing materials. For each solid material in NASA's repository: was it burned, what smoke does it make, and does the Station detector see that smoke? " + (full.length === 1 ? "Only " + full[0].name.toLowerCase() + " has all three answers." : full.length + " materials have all three answers.") + "" }),
      h("div", { "class": "table" }, h("table", { "class": "list" },
        h("thead", null, h("tr", null, ["Material", "Burn tests", "Oxygen tested", "Smoke runs", "Smoke particle size", "Detector response"].map(function (t) { return h("th", { scope: "col", text: t }); }))),
        h("tbody", null, D.materials.map(function (m) {
          return h("tr", null,
            h("th", { scope: "row" }, h("a", { href: href(m), text: m.name }), h("span", { "class": "sub", text: C.materials[m.name] })),
            h("td", { "class": m.burn.tests ? "num" : "", }, m.burn.tests ? fmt(m.burn.tests) : h("span", { "class": "missing", text: "No data" })),
            h("td", { "class": "num", text: m.burn.o2 ? range(m.burn.o2, "%") : "" }),
            h("td", { "class": m.smoke.runs ? "num" : "" }, m.smoke.runs ? fmt(m.smoke.runs) : h("span", { "class": "missing", text: "No data" })),
            h("td", null, measure(m.smoke.medianDiameterNm, maxD, "nm", "solid")),
            h("td", null, measure(m.smoke.detectorMedianV, maxV, "V", "gas")));
        })))),
      h("p", { "class": "note", text: "Particle size is the median count mean diameter of the SAME-R runs. Detector response is the median change in the obscuration signal of the Station smoke detector in SAME-R; it is a coarse summary that ranks materials and does not give an alarm threshold." }))));
  }

  function block(title, body) { return h("section", { "class": "front" }, h("h3", { text: title }), body); }
  function passportView(parts) {
    var name = decodeURIComponent(parts.join("/") || "");
    var m = D.materials.filter(function (x) { return x.name === name; })[0];
    if (!m) { A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "error" }, h("h1", { text: "No such material" }),
      h("p", null, h("a", { href: "#/materials", text: "See all materials" }), ".")))); return; }
    document.title = m.name + " · One Fire, Many Worlds";
    var gp = pairs(m), tests = D.tests.filter(function (t) { return t.family === m.name; });
    var invs = Object.keys(m.byInv);
    var burn = m.burn.tests ? [
      h("p", { "class": "known" }, h("strong", { text: plural(m.burn.tests, "burn test") }), " at " + range(m.burn.o2, "% oxygen") + (m.burn.flow ? " and airflow of " + range(m.burn.flow, "cm/s") : "") + "."),
      outcomes(m.burn.outcomes) ? h("p", { "class": "known", text: "Recorded endings: " + outcomes(m.burn.outcomes) + "." }) : h("p", { "class": "known", text: "Results are free-text observations; no ending is classified in the data." }),
      h("p", { "class": "known", text: "Never tested above 22.7 % oxygen: nothing is known about it in Moon-base air." })
    ] : h("p", { "class": "known nodata", text: "No burn test in the repository." });
    var smoke = m.smoke.runs ? [
      h("p", { "class": "known" }, h("strong", { text: plural(m.smoke.runs, "smoke run") }), ", " + m.smoke.withSize + " with particle size in SAME-R."),
      h("p", { "class": "known" }, "Median particle diameter: ", measure(m.smoke.medianDiameterNm, maxD, "nm", "solid"))
    ] : h("p", { "class": "known nodata", text: "No smoke measurement in the repository." });
    var det = m.smoke.detectorMedianV !== null ? [
      h("p", { "class": "known" }, "Median change in the Station detector signal: ", measure(m.smoke.detectorMedianV, maxV, "V", "gas")),
      h("p", { "class": "known", text: "From " + m.smoke.detectorRuns + " SAME-R runs. The Station detector measures scattered light and responds best to particles larger than one micrometer, so finer smoke gives a weaker signal." })
    ] : h("p", { "class": "known nodata", text: "No detector data in the repository." });

    A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "sheet page" },
      h("p", { "class": "crumb" }, h("a", { href: "#/materials", text: "Materials" }), " / " + m.name),
      h("h1", { text: m.name }),
      h("p", { "class": "intro", text: C.materials[m.name] }),
      h("div", { "class": "fronts" }, block("Does it burn?", burn), block("What smoke does it make?", smoke), block("Does the detector see it?", det)),
      gp.length ? [h("h2", { text: "In orbit and on the ground" }),
        h("div", { "class": "table" }, h("table", null,
          h("thead", null, h("tr", null, ["Sample", "Material", "Thickness", "Burned in microgravity", "Burned in normal gravity"].map(function (t) { return h("th", { scope: "col", text: t }); }))),
          h("tbody", null, gp.map(function (g) {
            var zero = function (v) { return /^~ 0/.test(v); };
            return h("tr", null, h("th", { scope: "row", text: g.sample }), h("td", { text: g.material }), h("td", { text: g.thickness }),
              h("td", { "class": zero(g.microBurn) ? "noburn" : "burn", text: g.microBurn }), h("td", { "class": zero(g.normalBurn) ? "noburn" : "burn", text: g.normalBurn }));
          })))),
        h("p", { "class": "note", text: "Source: PSI-99 (Saffire-II) experimental table. \"Complete\" means the whole sample burned." })] : null,
      h("h2", { text: "Where it was tested" }),
      h("p", { "class": "links" }, invs.map(function (acr, k) {
        var i = D.investigations.filter(function (x) { return x.acr === acr; })[0];
        return [k ? " · " : "", i ? A.invLink(i) : acr, " (" + plural(m.byInv[acr], "test") + ")"];
      })),
      h("div", { "class": "table" }, h("table", null,
        h("thead", null, h("tr", null, ["Investigation", "Sample", "Oxygen", "Flow", "Result"].map(function (t) { return h("th", { scope: "col", text: t }); }))),
        h("tbody", null, tests.slice(0, 8).map(function (t) {
          return h("tr", null, h("th", { scope: "row", text: t.acr }), h("td", { text: t.fuel }), h("td", { "class": "num", text: t.o2 === null ? "" : t.o2 + " %" }),
            h("td", { "class": "num", text: t.flow === null ? "" : t.flow + " cm/s" }), h("td", { text: t.res.length > 140 ? t.res.slice(0, 140) + " ..." : t.res }));
        })))),
      h("p", { "class": "note", text: "Showing " + Math.min(8, tests.length) + " of " + fmt(tests.length) + " tests." }))));
  }

  A.section({ id: "materials", label: "Materials", href: "#/materials" }, listView);
  A.route("material", "materials", passportView);
})();
