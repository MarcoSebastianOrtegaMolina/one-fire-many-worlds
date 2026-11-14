/* Material passport: for each solid material, whether it burns, what smoke it makes and whether the detector sees it. */
(function () {
  "use strict";
  var A = window.OFMW_APP, h = A.h, fmt = A.fmt, plural = A.plural, D = A.D, C = A.C, T = A.T;
  if (!D || !C) return;
  var OUT = { out: T("went out by itself"), burn: T("kept burning"), none: T("did not ignite or spread") };
  var maxD = Math.max.apply(null, D.materials.map(function (m) { return m.smoke.medianDiameterNm || 0; }));
  var maxV = Math.max.apply(null, D.materials.map(function (m) { return m.smoke.detectorMedianV || 0; }));

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

  function listView() {
    document.title = T("Materials · One Fire, Many Worlds");
    var full = D.materials.filter(function (m) { return m.burn.tests && m.smoke.runs && m.smoke.detectorMedianV !== null; });
    A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "sheet page" },
      h("h1", { text: T("Material passport") }),
      h("p", { "class": "intro", text: T("Prevention starts with choosing materials. For each solid material in NASA's repository: was it burned, what smoke does it make, and does the Station detector see that smoke? ") + (full.length === 1 ? T("Only ") + T(full[0].name).toLowerCase() + T(" has all three answers.") : full.length + T(" materials have all three answers.")) + "" }),
      h("div", { "class": "table" }, h("table", { "class": "list" },
        h("thead", null, h("tr", null, [T("Material"), T("Burn tests"), T("Oxygen tested"), T("Smoke runs"), T("Smoke particle size"), T("Detector response")].map(function (t) { return h("th", { scope: "col", text: t }); }))),
        h("tbody", null, D.materials.map(function (m) {
          return h("tr", null,
            h("th", { scope: "row" }, h("a", { href: href(m), text: T(m.name) }), h("span", { "class": "sub", text: C.materials[m.name] })),
            h("td", { "class": m.burn.tests ? "num" : "", }, m.burn.tests ? fmt(m.burn.tests) : h("span", { "class": "missing", text: T("No data") })),
            h("td", { "class": "num", text: m.burn.o2 ? range(m.burn.o2, "%") : "" }),
            h("td", { "class": m.smoke.runs ? "num" : "" }, m.smoke.runs ? fmt(m.smoke.runs) : h("span", { "class": "missing", text: T("No data") })),
            h("td", null, measure(m.smoke.medianDiameterNm, maxD, "nm", "solid")),
            h("td", null, measure(m.smoke.detectorMedianV, maxV, "V", "gas")));
        })))),
      h("p", { "class": "note", text: T("Particle size is the median count mean diameter of the SAME-R runs. Detector response is the median change in the obscuration signal of the Station smoke detector in SAME-R; it is a coarse summary that ranks materials and does not give an alarm threshold.") }))));
  }

  function block(title, body) { return h("section", { "class": "front" }, h("h3", { text: title }), body); }
  function passportView(parts) {
    var name = decodeURIComponent(parts.join("/") || "");
    var m = D.materials.filter(function (x) { return x.name === name; })[0];
    if (!m) { A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "error" }, h("h1", { text: T("No such material") }),
      h("p", null, h("a", { href: "#/materials", text: T("See all materials") }), ".")))); return; }
    document.title = T(m.name) + " · One Fire, Many Worlds";
    var gp = pairs(m), tests = D.tests.filter(function (t) { return t.family === m.name; });
    var invs = Object.keys(m.byInv);
    var burn = m.burn.tests ? [
      h("p", { "class": "known" }, h("strong", { text: plural(m.burn.tests, "burn test") }), T(" at ") + range(m.burn.o2, T("% oxygen")) + (m.burn.flow ? T(" and airflow of ") + range(m.burn.flow, "cm/s") : "") + "."),
      outcomes(m.burn.outcomes) ? h("p", { "class": "known", text: T("Recorded endings: ") + outcomes(m.burn.outcomes) + "." }) : h("p", { "class": "known", text: T("Results are free-text observations; no ending is classified in the data.") }),
      h("p", { "class": "known", text: T("Never tested above 22.7 % oxygen: nothing is known about it in Moon-base air.") })
    ] : h("p", { "class": "known nodata", text: T("No burn test in the repository.") });
    var smoke = m.smoke.runs ? [
      h("p", { "class": "known" }, h("strong", { text: plural(m.smoke.runs, "smoke run") }), ", " + m.smoke.withSize + T(" with particle size in SAME-R.")),
      h("p", { "class": "known" }, T("Median particle diameter: "), measure(m.smoke.medianDiameterNm, maxD, "nm", "solid"))
    ] : h("p", { "class": "known nodata", text: T("No smoke measurement in the repository.") });
    var det = m.smoke.detectorMedianV !== null ? [
      h("p", { "class": "known" }, T("Median change in the Station detector signal: "), measure(m.smoke.detectorMedianV, maxV, "V", "gas")),
      h("p", { "class": "known", text: T("From ") + m.smoke.detectorRuns + T(" SAME-R runs. The Station detector measures scattered light and responds best to particles larger than one micrometer, so finer smoke gives a weaker signal.") })
    ] : h("p", { "class": "known nodata", text: T("No detector data in the repository.") });

    A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "sheet page" },
      h("p", { "class": "crumb" }, h("a", { href: "#/materials", text: T("Materials") }), " / " + T(m.name)),
      h("h1", { text: T(m.name) }),
      h("p", { "class": "intro", text: C.materials[m.name] }),
      h("div", { "class": "fronts" }, block(T("Does it burn?"), burn), block(T("What smoke does it make?"), smoke), block(T("Does the detector see it?"), det)),
      gp.length ? [h("h2", { text: T("In orbit and on the ground") }),
        h("div", { "class": "table" }, h("table", null,
          h("thead", null, h("tr", null, [T("Sample"), T("Material"), T("Thickness"), T("Burned in microgravity"), T("Burned in normal gravity")].map(function (t) { return h("th", { scope: "col", text: t }); }))),
          h("tbody", null, gp.map(function (g) {
            var zero = function (v) { return /^~ 0/.test(v); };
            return h("tr", null, h("th", { scope: "row", text: g.sample }), h("td", { text: g.material }), h("td", { text: g.thickness }),
              h("td", { "class": zero(g.microBurn) ? "noburn" : "burn", text: g.microBurn }), h("td", { "class": zero(g.normalBurn) ? "noburn" : "burn", text: g.normalBurn }));
          })))),
        h("p", { "class": "note", text: T("Source: PSI-99 (Saffire-II) experimental table. \"Complete\" means the whole sample burned.") })] : null,
      h("h2", { text: T("Where it was tested") }),
      h("p", { "class": "links" }, invs.map(function (acr, k) {
        var i = D.investigations.filter(function (x) { return x.acr === acr; })[0];
        return [k ? " · " : "", i ? A.invLink(i) : acr, " (" + plural(m.byInv[acr], "test") + ")"];
      })),
      h("div", { "class": "table" }, h("table", null,
        h("thead", null, h("tr", null, [T("Investigation"), T("Sample"), T("Oxygen"), T("Flow"), T("Result")].map(function (t) { return h("th", { scope: "col", text: t }); }))),
        h("tbody", null, tests.slice(0, 8).map(function (t) {
          return h("tr", null, h("th", { scope: "row", text: t.acr }), h("td", { text: t.fuel }), h("td", { "class": "num", text: t.o2 === null ? "" : t.o2 + " %" }),
            h("td", { "class": "num", text: t.flow === null ? "" : t.flow + " cm/s" }), h("td", { text: t.res.length > 140 ? t.res.slice(0, 140) + " ..." : t.res }));
        })))),
      h("p", { "class": "note", text: T("Showing ") + Math.min(8, tests.length) + T(" of ") + fmt(tests.length) + T(" tests.") }))));
  }

  A.section({ id: "materials", label: T("Materials"), href: "#/materials" }, listView);
  A.route("material", "materials", passportView);
})();
