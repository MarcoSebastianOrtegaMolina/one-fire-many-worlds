/* The page of one world, under its 3D model. A.worldSheet(id, opts) replaces the one in js/app.js and hands back
   the same sheet.parts (world, name, headline, takeaway, facts, plane, count); js/journey.js places them.
   The numbers and the content text come out exactly as in app.js: worldCount() and rank() are copied from there.
   Class prefix wd-. */
(function () {
  "use strict";
  var A = window.OFMW_APP;
  if (!A) return;
  var h = A.h, T = A.T, D = A.D, C = A.C, fmt = A.fmt, plural = A.plural, add = A.add, world = A.world;
  var REL = A.REL, TYPES = A.TYPES, FRONTS = A.FRONTS;

  A.es({
    "On this page": "En esta página",
    "Tested air": "Aire probado", "Three fronts": "Tres frentes", "Orbit and ground": "Órbita y tierra", "Still to burn": "Falta quemar",
    "The air that was tested": "El aire que se probó",
    "Where the repository's tests sit by oxygen and pressure, and where this world's air falls among them.":
      "Dónde quedan las pruebas del repositorio según su oxígeno y su presión, y dónde cae entre ellas el aire de este mundo.",
    "Read more": "Leer más", "Show less": "Leer menos",
    "Not counted": "Sin conteo",
    "Not yet burned": "Sin quemar todavía",
    "Saffire-II samples burned in microgravity and repeated in normal gravity": "Muestras de Saffire-II quemadas en microgravedad y repetidas en gravedad normal",
    "Burned": "Ardió", "Did not burn": "No ardió",
    "Table ": "Tabla ",
    "Units as recorded in the source table: thickness in millimetres (one sample in centimetres), burned length in centimetres.":
      "Unidades como vienen en la tabla de origen: grosor en milímetros (una muestra en centímetros), largo quemado en centímetros.",
    "Tests in this air, by investigation": "Pruebas en este aire, por investigación"
  });

  /* ---------- copied from js/app.js: same numbers, same words ---------- */
  function worldCount(w) {
    if (w.id === "earth") return { n: w.extra.n, text: plural(w.extra.n, "sample") + T(" compared with normal gravity") };
    if (w.id === "mars") { var pairs = world("earth").extra.n; return { n: pairs, text: plural(pairs, "sample pair") + T(" at 0 g and 1 g, none at 3/8 g") }; }
    return { n: w.near.total, text: w.near.total ? plural(w.near.total, "test") + T(" in air like this") : T("No test in air like this") };
  }
  function rank(w, front) {
    var near = w.near.byInv || {};
    return D.investigations.filter(function (i) { return i.front === front; }).map(function (i) {
      var n = near[i.id] || 0, why;
      if (w.id === "earth" && i.id === "PSI-99") { n = D.gravityPairs.length; why = plural(n, "sample") + T(" also burned in normal gravity"); }
      else if (w.id === "earth" && i.group === "ground study") { n = 0.5; why = T("Ground study built on flight data"); }
      else if (n) why = plural(n, "test") + T(" in air like this");
      else if (w.id === "station" && i.group === "flight" && i.o2 === null && i.tests) { n = 0.5; why = plural(i.tests, "test") + T(" in flight; oxygen and pressure not recorded"); }
      else if (i.tests) why = T("Not tested in this air; ") + plural(i.tests, "test") + T(" elsewhere");
      else why = T("No individual tests in the data");
      return { inv: i, n: n, why: why + ". " + T(i.relevance.charAt(0).toUpperCase() + i.relevance.slice(1) + " relevance.") };
    }).sort(function (a, b) {
      return (b.n > 0) - (a.n > 0) || REL[b.inv.relevance] - REL[a.inv.relevance] || b.n - a.n || b.inv.tests - a.inv.tests;
    });
  }

  /* ---------- small pieces ---------- */
  var uid = 0;
  /* A long paragraph shows about five lines, with Read more; the button only appears when the text is cut. */
  function clamp(p) {
    var id = "wd-c" + (++uid);
    p.id = id;
    p.classList.add("wd-clamp");
    var btn = h("button", { type: "button", "class": "wd-more", "aria-expanded": "false", "aria-controls": id, hidden: "" }, T("Read more"));
    btn.addEventListener("click", function () {
      var open = !p.classList.contains("is-open");
      p.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open ? T("Show less") : T("Read more");
    });
    function check() {
      if (p.classList.contains("is-open")) return;
      btn.hidden = p.scrollHeight <= p.clientHeight + 2;
    }
    if (window.ResizeObserver) new ResizeObserver(check).observe(p);
    else if (p.textContent.length > 320) btn.hidden = false;
    return h("div", { "class": "wd-clampbox" }, p, btn);
  }
  function invA(i) { return h("a", { "class": "wd-acr", href: "#/investigation/" + i.id, text: i.acr }); }

  function factsOf(w, c) {
    var byType = w.near.byType || {};
    var breakdown = w.near.total ? TYPES.map(function (t) { return (byType[t[0]] || 0) + " " + T(t[0]); }).join(", ") : "";
    var ev = w.id === "earth" ? w.extra.n : w.near.total;
    function row(cls, dt, dd) { return h("div", { "class": "wd-fact" + (cls ? " " + cls : "") }, h("dt", null, dt), dd); }
    var bar = w.near.total ? h("span", { "class": "wd-mix", "aria-hidden": "true" }, TYPES.map(function (t) {
      var n = byType[t[0]] || 0;
      return n ? h("i", { style: "flex-grow:" + n + "; background:var(--" + t[0] + ")" }) : null;
    })) : null;
    var alsoZero = w.id !== "earth" && !w.extra.text && !w.extra.n;
    return h("dl", { "class": "wd-facts" },
      row("", T("Gravity"), h("dd", { text: T(w.gravity.charAt(0).toUpperCase() + w.gravity.slice(1)) })),
      row("", T("Air"), h("dd", { text: T(w.air) })),
      row("wd-ev" + (ev ? "" : " is-zero"), T("Evidence"), h("dd", null,
        h("strong", { "class": "wd-big num", text: fmt(ev) }), " ",
        h("span", { "class": "wd-ev-t", text: w.id === "earth" ? T("samples burned in orbit and compared with normal gravity")
          : T("tests in air like this") + (breakdown ? " (" + breakdown + ")" : "") }),
        bar,
        h("span", { "class": "wd-fact-note", text: T(w.nearNote) + "." }))),
      w.id !== "earth" ? row(alsoZero ? "is-zero" : "", T("Also"), h("dd", null, T(w.extra.label) + ": ",
        h("strong", { "class": "num", text: w.extra.text ? T(w.extra.text) : fmt(w.extra.n) }))) : null,
      c.outside ? row("wd-out", A.tag("outside", T("Outside PSI")), h("dd", { text: c.outside.replace(/^[^:]+:\s*/, "") })) : null);   /* D-1440, after PSI */
  }

  function frontsOf(w, c) {
    return h("div", { "class": "wd-fronts" }, FRONTS.map(function (f) {
      var list = rank(w, f[0]), text = c[f[0]], nodata = text === T("No data.");
      var max = list.reduce(function (m, r) { return r.n >= 1 && r.n > m ? r.n : m; }, 0);
      return h("section", { "class": "wd-front", "aria-label": f[1] },
        h("h3", { "class": "wd-front-h", text: f[1] }),
        nodata ? h("p", { "class": "wd-known wd-nodata", text: T("No data for this world.") }) : clamp(h("p", { "class": "wd-known", text: text })),
        h("h4", { "class": "wd-rank-h", text: T("Investigations, most relevant first") }),
        h("ol", { "class": "wd-rank", "aria-label": T("Tests in this air, by investigation") }, list.map(function (r) {
          var counted = r.n >= 1, part = r.n > 0 && r.n < 1;
          return h("li", { "class": "wd-row" + (r.n > 0 ? "" : " is-dim") },
            h("div", { "class": "wd-row-top" }, invA(r.inv),
              h("span", { "class": "wd-n num" + (part ? " is-part" : ""), text: counted ? fmt(r.n) : part ? T("Not counted") : "0" })),
            h("span", { "class": "wd-bar", "aria-hidden": "true" },
              counted && max ? h("i", { style: "width:" + Math.max(2, r.n / max * 100).toFixed(1) + "%" }) : null),
            h("p", { "class": "wd-why", text: r.why }));
        })));
    }));
  }

  function pairsTable() {
    var zero = function (v) { return /^~ 0/.test(v); };
    function burn(v) {
      var z = zero(v);
      return h("td", { "class": z ? "wd-noburn" : "wd-burn" }, h("span", { "class": "wd-verdict", text: z ? T("Did not burn") : T("Burned") }), h("span", { "class": "wd-burnv", text: v }));
    }
    var table = h("table", null,
      h("thead", null, h("tr", null, [T("Sample"), T("Material"), T("Thickness"), T("Flow"), T("Burned in microgravity"), T("Burned in normal gravity")].map(function (t) { return h("th", { scope: "col", text: t }); }))),
      h("tbody", null, D.gravityPairs.map(function (g) {
        return h("tr", null, h("th", { scope: "row", "class": "num", text: g.sample }), h("td", { text: g.material }), h("td", { "class": "wd-nowrap", text: g.thickness }), h("td", { text: g.flowDir }),
          burn(g.microBurn), burn(g.normalBurn));
      })));
    return h("figure", { "class": "c-fig wd-apa" },
      h("figcaption", { "class": "wd-apa-cap" }, h("span", { "class": "c-fig-num", text: T("Table ") + 2 }),
        h("span", { "class": "c-fig-title", text: T("Saffire-II samples burned in microgravity and repeated in normal gravity") })),
      h("div", { "class": "c-table wd-pairs" }, table),
      h("p", { "class": "c-fig-note" }, h("em", { text: T("Note. ") }), T("Source: PSI-99 experimental table. Airflow 20 cm/s, oxygen about 21.5 to 22.1 %. \"Complete\" means the whole sample burned."), " ",
        T("Units as recorded in the source table: thickness in millimetres (one sample in centimetres), burned length in centimetres.")));
  }

  function agendaOf(w) {
    var items = C.agenda.filter(function (a) { return a.worlds.indexOf(w.id) >= 0; });
    if (!items.length) return A.state("empty", T("Nothing listed for this world."));
    return h("ul", { "class": "wd-gaps" }, items.map(function (a) {
      return h("li", { "class": "wd-gap" },
        h("div", { "class": "wd-gap-head" },
          h("h3", { "class": "wd-gap-t", text: a.title }),
          h("p", { "class": "wd-gap-tags" }, A.tag("missing", T("Not yet burned")), " ", A.tag("front", T(a.front)))),
        h("div", { "class": "wd-gap-body" },
          clamp(h("p", { "class": "wd-gap-why", text: a.why })),
          h("p", { "class": "wd-closest" }, h("span", { "class": "wd-closest-l", text: T("Closest evidence today: ") }), a.closest + (a.planned ? " " + a.planned : ""))));
    }));
  }

  /* ---------- the index that sticks under the header and marks where you are ---------- */
  function indexOf(sections) {
    var buttons = sections.map(function (sec) {
      return h("button", { type: "button", "class": "wd-idx-b", "data-for": sec.id, onclick: function () {
        var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
        sec.el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        var hd = sec.el.querySelector("h2");
        if (hd) hd.focus({ preventScroll: true });
      } }, sec.label);
    });
    var nav = h("nav", { "class": "wd-index", "aria-label": T("On this page") }, h("div", { "class": "wd-index-in" }, buttons));
    var ticking = false, attached = false;
    function mark() {
      ticking = false;
      if (!nav.isConnected) { if (attached) window.removeEventListener("scroll", onScroll); return; }
      attached = true;
      var line = nav.getBoundingClientRect().bottom + 40, at = 0;   /* a section reached from the index lands 26 px under it (scroll margins) */
      sections.forEach(function (sec, k) { if (sec.el.getBoundingClientRect().top <= line) at = k; });
      buttons.forEach(function (b, k) {
        if (k !== at) { b.removeAttribute("aria-current"); return; }
        if (b.getAttribute("aria-current") === "true") return;
        b.setAttribute("aria-current", "true");
        /* on a phone the index scrolls sideways: keep the current one in view */
        var strip = b.parentNode, l = b.offsetLeft - strip.offsetLeft, r = l + b.offsetWidth;
        if (l < strip.scrollLeft) strip.scrollLeft = l;
        else if (r > strip.scrollLeft + strip.clientWidth) strip.scrollLeft = r - strip.clientWidth;
      });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(mark); } }
    window.addEventListener("scroll", onScroll, { passive: true });
    requestAnimationFrame(mark);
    return nav;
  }

  /* ---------- the sheet ---------- */
  function worldSheet(id, opts) {
    opts = opts || {};
    var w = world(id) || world("moon"), c = C.worlds[w.id], cnt = worldCount(w);
    document.title = T(w.name) + " · One Fire, Many Worlds";
    var facts = factsOf(w, c);
    var planeFig = A.plane(w);
    if (planeFig.setNumber) planeFig.setNumber(1, 1);   /* Figure 1 and, behind Show as table, Table 1 */

    var secs = [];
    function section(key, label, title, lede, body) {
      var el = h("section", { "class": "wd-sec", id: "wd-" + key, "aria-labelledby": "wd-" + key + "-h" },
        h("h2", { "class": "wd-h2", id: "wd-" + key + "-h", tabindex: "-1", text: title }),
        lede ? h("p", { "class": "wd-lede", text: lede }) : null, body);
      secs.push({ id: "wd-" + key, el: el, label: label });
      return el;
    }

    var air = section("air", T("Tested air"), T("The air that was tested"),
      T("Where the repository's tests sit by oxygen and pressure, and where this world's air falls among them."), planeFig);
    var fronts = section("fronts", T("Three fronts"), T("What is known, front by front"),
      T("NASA's fire safety work has three fronts. Investigations are ordered by how much they tested in this world's air, then by relevance to fire safety. The order is our reading of the data."),
      [frontsOf(w, c),
        h("p", { "class": "wd-support" }, T("Supporting flame science, not tied to one front: "),
          D.investigations.filter(function (i) { return i.front === "basic science"; }).map(function (i, k) {
            var n = (w.near.byInv || {})[i.id];
            return [k ? ", " : "", invA(i), n ? " (" + plural(n, "test") + T(" in air like this)") : ""];
          }), ".")]);
    var orbit = w.id === "earth" ? section("orbit", T("Orbit and ground"), T("The same sample, in orbit and on the ground"),
      T("Saffire-II burned nine samples in a cargo vehicle and repeated each in normal gravity. Gravity changes the verdict for some materials."), pairsTable()) : null;
    var next = section("next", T("Still to burn"), T("What to burn next"),
      T("Experiments that do not exist yet for this world. The list and its order are our proposal, drawn from the gaps in the data."), agendaOf(w));

    var sheet = h("div", { "class": "wd-sheet" },
      opts.bare ? null : h("div", { "class": "wd-lead" },
        h("h1", { "class": "wd-name", text: T(w.name) }), h("p", { "class": "wd-headline", text: c.headline }), facts, h("p", { "class": "wd-takeaway", text: c.takeaway })),
      indexOf(secs), air, fronts, orbit, next);

    /* Leaving for an investigation and coming back with Back or the browser's Back keeps the place on the page
       and the opened paragraphs: they ride on this history entry. */
    sheet.addEventListener("click", function (ev) {
      var a = ev.target.closest && ev.target.closest("a[href^='#/']");
      if (!a) return;
      var open = [].map.call(sheet.querySelectorAll(".wd-clamp"), function (p, k) { return p.classList.contains("is-open") ? k : -1; }).filter(function (k) { return k >= 0; });
      try { history.replaceState({ wdWorld: w.id, wdY: window.scrollY, wdOpen: open }, ""); } catch (e) { /* history not writable: nothing kept */ }
    });
    var st = history.state;
    if (st && st.wdWorld === w.id) {
      var clamps = sheet.querySelectorAll(".wd-clamp");
      (st.wdOpen || []).forEach(function (k) {
        var p = clamps[k], b = p && p.parentNode.querySelector(".wd-more");
        if (p && b) { p.classList.add("is-open"); b.hidden = false; b.setAttribute("aria-expanded", "true"); b.textContent = T("Show less"); }
      });
      requestAnimationFrame(function () { requestAnimationFrame(function () { if (sheet.isConnected) window.scrollTo(0, st.wdY || 0); }); });
    }

    sheet.parts = { world: w, name: T(w.name), headline: c.headline, takeaway: c.takeaway, facts: facts, plane: planeFig, count: cnt };
    return sheet;
  }

  A.worldSheet = worldSheet;
})();
