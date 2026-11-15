/* The first screen of the home page: the problem (agent K). Classic script, no libraries.
   window.OFMW_INTRO()          builds and returns the screen: the title, the problem in three short sentences from
                                the challenge statement, the fires and alarm the challenge cites (from the timeline),
                                what the platform does, a button down to the worlds (#worlds) and a microgravity flame.
                                Calling it again first takes down what the previous call mounted.
   window.OFMW_INTRO.dispose()  takes down the 3D title words and the listeners.
   The illustration is two candles in SVG, on Earth and in free fall; it needs no WebGL, and with reduced motion
   both flames stand still.
   Route #/intro-preview shows the screen alone, for review. */
(function () {
  "use strict";
  var A = window.OFMW_APP;
  if (!A || !A.h) return;
  var h = A.h, T = A.T;

  A.es({
    "Fire safety for every world where people will live": "Seguridad contra incendios para cada mundo donde vivirá la gente",
    "Built for the 2026 NASA Space Apps challenge Flame in Freefall. It sorts and interprets {tests} tests from {inv} combustion investigations in NASA's PSI repository, front by front: prevent, detect, suppress.":
      "Hecho para el reto Flame in Freefall del NASA Space Apps 2026. Ordena e interpreta {tests} pruebas de {inv} investigaciones de combustión del repositorio PSI de NASA, frente por frente: prevenir, detectar, apagar.",
    "In free fall there is no buoyancy, so hot gases do not rise. A candle flame becomes a blue sphere that gets its oxygen by diffusion.":
      "En caída libre no hay flotación, así que los gases calientes no suben. La flama de una vela se vuelve una esfera azul que recibe su oxígeno por difusión.",
    "NASA has studied flames in microgravity for decades, and the results are public in its PSI repository. There are so many that they are hard to find, compare and interpret.":
      "NASA lleva décadas estudiando flamas en microgravedad, y los resultados son públicos en su repositorio PSI. Son tantos que cuesta encontrarlos, compararlos e interpretarlos.",
    "That matters more now, as crews return to the Moon and head for Mars.":
      "Eso importa más ahora, cuando se vuelve a la Luna y se apunta a Marte.",
    "From the challenge statement, 2026 NASA Space Apps, Flame in Freefall.":
      "Del enunciado del reto Flame in Freefall, NASA Space Apps 2026.",
    "The problem": "El problema",
    "Fires and alarms the challenge cites": "Incendios y alarmas que cita el reto",
    "Open {title} on the timeline": "Abrir {title} en la línea de tiempo",
    "See the five worlds": "Ver los cinco mundos",
    "More below: the worlds and the tools": "Más abajo: los mundos y las herramientas",
    "Illustration: a candle flame on Earth and in free fall. Without buoyancy the hot gas does not rise, and the flame becomes a blue sphere.":
      "Ilustración: la flama de una vela en la Tierra y en caída libre. Sin flotación el gas caliente no sube, y la flama se vuelve una esfera azul.",
    "On Earth": "En la Tierra", "In free fall": "En caída libre",
    "Intro preview": "Vista previa de la primera pantalla",
    "Back to home": "Volver a la portada",
    "The first screen of the home page, alone, for review before it goes on the home page.":
      "La primera pantalla de la portada, sola, para revisarla antes de ponerla en la portada."
  });

  var TITLE = "Fire safety for every world where people will live";
  var PLATFORM = "Built for the 2026 NASA Space Apps challenge Flame in Freefall. It sorts and interprets {tests} tests from {inv} combustion investigations in NASA's PSI repository, front by front: prevent, detect, suppress.";
  var PROBLEM = [
    "In free fall there is no buoyancy, so hot gases do not rise. A candle flame becomes a blue sphere that gets its oxygen by diffusion.",
    "NASA has studied flames in microgravity for decades, and the results are public in its PSI repository. There are so many that they are hard to find, compare and interpret.",
    "That matters more now, as crews return to the Moon and head for Mars."
  ];
  var reduced = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  var live = null;   /* what the last call mounted: { h1, flame, handle, off: [] } */

  function fill(template, map) {   /* "text {key} text" -> nodes, each {key} replaced by map[key] */
    return T(template).split(/(\{\w+\})/).map(function (part) {
      var m = /^\{(\w+)\}$/.exec(part);
      return m && map[m[1]] !== undefined ? map[m[1]] : part;
    }).filter(function (x) { return x !== ""; });
  }
  function slug(e) {   /* the same address js/timeline.js gives an entry */
    var y = String(e.year);
    if (/^\d{4}$/.test(y)) return y;
    y = y.toLowerCase();
    if (y === "recent" || y === "reciente") return "recent";
    if (y === "future" || y === "futuro") return "future";
    return encodeURIComponent(y);
  }
  function firstSentence(text) {   /* the timeline's own text, cut at its first sentence */
    var t = String(text || ""), m = /^(.+?[.!?])(\s|$)/.exec(t);
    return m ? m[1] : t;
  }

  /* ---------- the fires the challenge cites, from the timeline ---------- */
  function accidents() {
    var list = ((A.C && A.C.timeline) || []).filter(function (e) { return e && e.kind === "accident"; }).slice(0, 4);
    if (!list.length) return null;
    return h("section", { "class": "in-acc", "aria-labelledby": "in-acc-h" },
      h("h2", { "class": "in-acc-h", id: "in-acc-h", text: T("Fires and alarms the challenge cites") }),
      h("ol", { "class": "in-acc-list" }, list.map(function (e) {
        return h("li", { "class": "in-acc-item" },
          h("a", { "class": "in-acc-link", href: "#/timeline/" + slug(e), "data-year": slug(e),
            "aria-label": fill("Open {title} on the timeline", { title: e.title }).join("") + ", " + e.year },
            h("span", { "class": "in-acc-year num", text: e.year }),
            h("span", { "class": "in-acc-title", text: e.title }),
            h("span", { "class": "in-acc-what", text: firstSentence(e.what) })));
      })));
  }

  /* ---------- the flame: two candles drawn in SVG, the same candle with the flame of each world ----------
     Left, on Earth: the teardrop flame, yellow with a blue base, that flickers. Right, in free fall: a sphere full of
     blue light around the wick, brightest near it and fading to a soft edge, weaker and smaller, that breathes.
     No WebGL needed; with reduced motion both stand still (CSS). */
  var svgN = 0;
  function candles() {
    var k = "in" + (++svgN), u = function (id) { return "url(#" + k + id + ")"; };
    return '<svg class="in-svg" viewBox="0 0 360 300" role="presentation" focusable="false" aria-hidden="true">' +
      '<defs>' +
        '<radialGradient id="' + k + 'eg" cx="0.5" cy="0.8" r="0.8">' +
          '<stop offset="0" stop-color="#ffffff"/><stop offset="0.2" stop-color="#fff4d8"/><stop offset="0.48" stop-color="#ffd884"/>' +
          '<stop offset="0.78" stop-color="#f6a750" stop-opacity="0.92"/><stop offset="1" stop-color="#f29d49" stop-opacity="0.35"/></radialGradient>' +
        '<radialGradient id="' + k + 'eb" cx="0.5" cy="0.5" r="0.5">' +
          '<stop offset="0" stop-color="#288bff" stop-opacity="0.95"/><stop offset="0.6" stop-color="#609af6" stop-opacity="0.6"/><stop offset="1" stop-color="#609af6" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="' + k + 'eh" cx="0.5" cy="0.6" r="0.5">' +
          '<stop offset="0" stop-color="#f3a868" stop-opacity="0.3"/><stop offset="1" stop-color="#f3a868" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="' + k + 'sg" cx="0.5" cy="0.5" r="0.5">' +
          '<stop offset="0" stop-color="#eef4ff" stop-opacity="0.95"/><stop offset="0.12" stop-color="#bcd3ff" stop-opacity="0.85"/>' +
          '<stop offset="0.36" stop-color="#8fb8ff" stop-opacity="0.62"/><stop offset="0.66" stop-color="#609af6" stop-opacity="0.44"/>' +
          '<stop offset="0.88" stop-color="#3d8cf8" stop-opacity="0.36"/><stop offset="0.95" stop-color="#288bff" stop-opacity="0.22"/>' +
          '<stop offset="1" stop-color="#288bff" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="' + k + 'sh" cx="0.5" cy="0.5" r="0.5">' +
          '<stop offset="0.55" stop-color="#609af6" stop-opacity="0.16"/><stop offset="1" stop-color="#609af6" stop-opacity="0"/></radialGradient>' +
      '</defs>' +
      /* on Earth */
      '<g class="in-c in-c-earth">' +
        '<rect x="89" y="186" width="32" height="104" rx="2" fill="#e6e0d4"/><ellipse cx="105" cy="186" rx="16" ry="4" fill="#f4f0e8"/>' +
        '<path d="M105 186 L105 170 Q105.5 166 107 164" stroke="#2e2e32" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<g class="in-fl-earth">' +
          '<ellipse cx="105" cy="128" rx="44" ry="66" fill="' + u("eh") + '"/>' +
          '<path d="M105 70 C113 98 126 122 124 147 C122 166 115 177 105 177 C95 177 88 166 86 147 C84 122 97 98 105 70 Z" fill="' + u("eg") + '"/>' +
          '<ellipse cx="105" cy="168" rx="13" ry="11" fill="' + u("eb") + '"/>' +
        '</g>' +
      '</g>' +
      /* in free fall: the same candle, a little nearer the middle and a little larger in the frame */
      '<g class="in-c in-c-space">' +
        '<rect x="223" y="196" width="36" height="94" rx="2" fill="#e6e0d4"/><ellipse cx="241" cy="196" rx="18" ry="4.5" fill="#f4f0e8"/>' +
        '<path d="M241 196 L241 178" stroke="#2e2e32" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<g class="in-fl-space">' +
          '<circle cx="241" cy="167" r="60" fill="' + u("sh") + '"/>' +
          '<circle cx="241" cy="167" r="42" fill="' + u("sg") + '"/>' +
        '</g>' +
      '</g>' +
    '</svg>';
  }

  /* ---------- the screen ---------- */
  function topOffset() {   /* the banner and the header above the screen, so it fills what is left of the window */
    var head = document.getElementById("head"), r = head ? head.getBoundingClientRect() : null;
    return r ? Math.max(0, Math.round(r.bottom + (window.scrollY || 0))) : 96;
  }
  function headHeight() { var head = document.getElementById("head"); return head ? head.offsetHeight : 60; }

  function dispose() {
    var rec = live; live = null;
    if (!rec) return;
    try { if (window.OFMW_TITLE && typeof window.OFMW_TITLE.dispose === "function") window.OFMW_TITLE.dispose(rec.h1); } catch (e) { /* the flat title stays */ }
    rec.off.forEach(function (f) { try { f(); } catch (e) { /* nothing to undo */ } });
    rec.off = [];
  }

  function build() {
    dispose();
    var rec = { off: [] };
    live = rec;
    var S = (A.D && A.D.summary) || {};

    var h1 = h("h1", { "class": "in-title", text: T(TITLE) });
    rec.h1 = h1;

    var flame = h("figure", { "class": "in-flame" },
      h("div", { "class": "in-flame-box", html: candles() }),
      h("div", { "class": "in-flame-labels" }, h("span", { "class": "in-lab in-lab-earth", text: T("On Earth") }), h("span", { "class": "in-lab in-lab-space", text: T("In free fall") })),
      h("figcaption", { "class": "in-flame-cap", text: T("Illustration: a candle flame on Earth and in free fall. Without buoyancy the hot gas does not rise, and the flame becomes a blue sphere.") }));
    rec.flame = flame;

    var problem = h("div", { "class": "in-problem" },
      h("h2", { "class": "in-sr", text: T("The problem") }),
      PROBLEM.map(function (p, i) { return h("p", { "class": "in-p in-p-" + (i + 1), text: T(p) }); }),
      h("p", { "class": "in-src", text: T("From the challenge statement, 2026 NASA Space Apps, Flame in Freefall.") }));

    var platform = h("p", { "class": "in-platform" }, fill(PLATFORM, {
      tests: A.num(A.fmt(S.tests != null ? S.tests : 0)), inv: A.num(A.fmt(S.investigations != null ? S.investigations : 0)) }));

    var go = h("a", { "class": "c-btn c-btn-primary in-go", href: "#worlds", text: T("See the five worlds"),
      onclick: function (ev) { ev.preventDefault(); down(); } });
    var more = h("p", { "class": "in-more", "aria-hidden": "true" }, h("span", { "class": "in-more-line" }), h("span", { text: T("More below: the worlds and the tools") }));

    var credit = null;
    try {
      var cr = window.OFMW_TITLE && typeof window.OFMW_TITLE.credits === "function" ? window.OFMW_TITLE.credits() : null;
      if (cr && (cr.text || cr.credit)) credit = h("p", { "class": "in-credit" },
        cr.href ? h("a", { href: cr.href, target: "_blank", rel: "noopener", text: cr.text || cr.credit }) : (cr.text || cr.credit));
    } catch (e) { credit = null; }

    var grid = h("div", { "class": "in-grid wrap" },
      h1, flame, problem, accidents(), h("div", { "class": "in-act" }, platform, go));
    var screen = h("section", { "class": "in-screen", id: "intro", "aria-label": T("The problem") }, grid, h("div", { "class": "in-foot wrap" }, more, credit));

    function down() {
      var target = document.getElementById("worlds"), smooth = reduced.matches ? "auto" : "smooth";
      if (target) { target.scrollIntoView({ behavior: smooth, block: "start" }); try { target.focus({ preventScroll: true }); } catch (e) { /* not focusable */ } }
      else window.scrollBy({ top: Math.max(200, window.innerHeight - headHeight()), behavior: smooth });
    }
    screen.scrollDown = down;

    function size() { screen.style.setProperty("--in-top", topOffset() + "px"); }
    size();
    window.addEventListener("resize", size);
    rec.off.push(function () { window.removeEventListener("resize", size); });

    try { if (window.OFMW_TITLE && typeof window.OFMW_TITLE.enhance === "function") window.OFMW_TITLE.enhance(h1); } catch (e) { /* the flat title stays */ }
    return screen;
  }

  window.OFMW_INTRO = build;
  window.OFMW_INTRO.dispose = dispose;

  /* ---------- review route: the screen alone, until the home page hangs it ---------- */
  if (!A.route) return;
  A.route("intro-preview", "world", function () {
    document.title = T("Intro preview") + " · One Fire, Many Worlds";
    var screen = build();
    A.main.replaceChildren(h("div", { "class": "in-preview" }, screen,
      h("div", { "class": "wrap in-preview-next", id: "worlds", tabindex: "-1" },
        A.back("#/", T("Back to home")),
        h("p", { "class": "c-what", text: T("The first screen of the home page, alone, for review before it goes on the home page.") }))));
    function leave() {
      if (/^#\/?intro-preview/.test(location.hash)) return;
      window.removeEventListener("hashchange", leave);
      dispose();
    }
    window.addEventListener("hashchange", leave);
  });
})();
