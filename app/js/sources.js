/* Sources: the exact page of the NASA report behind each finding, shown in place with the passage marked. */
(function () {
  "use strict";
  var A = window.OFMW_APP, h = A.h, T = A.T, D = A.D;
  var E = window.OFMW_EVIDENCE || [], L = window.OFMW_LANG === "es" ? "es" : "en";
  if (!D) return;
  A.es({
    "Cited pages": "Páginas citadas", "Sources and figures": "Fuentes y figuras", "List": "Lista", "Table": "Tabla", "Show as": "Ver como",
    "Find in the pages": "Buscar en las páginas", "Document, passage or finding": "Documento, pasaje o hallazgo",
    "Outside PSI only": "Solo fuera de PSI", " pages": " páginas", " page": " página", " figures": " figuras", " figure": " figura",
    "No page matches": "Ninguna página coincide", "No page matches the filter or the search.": "Ninguna página coincide con el filtro o la búsqueda.",
    "No page image": "Sin imagen de la página", "Open the page": "Abrir la página",
    "Pick a figure to see it large, with its caption as written and the page it comes from.": "Elige una figura para verla grande, con su pie tal como está escrito y la página de donde sale.",
    "No figure matches": "Ninguna figura coincide", "No figure matches these filters.": "Ninguna figura coincide con estos filtros.",
    "All figures": "Todas las figuras", "Zoom in": "Acercar", "Zoom out": "Alejar", "Fit": "Ajustar", "Zoom": "Zoom",
    "Materials": "Materiales", "Material": "Material", "Where it comes from": "De dónde sale"
  });

  function get(id) { return E.filter(function (e) { return e.id === id; })[0]; }
  /* A cited place that is not a single PDF page: a page range, one poster page, or only the abstract of its NTRS record. */
  function where(e) {
    if (e.page) return T("p. ") + e.page;
    var label = String(e.pageLabel || "");
    if (/^\d+$/.test(label)) return T("p. ") + label;
    if (/\d/.test(label)) return T("Pages ") + label.replace(/ and /g, T(" and "));
    return label ? T(label) : T("Record at NASA");
  }
  function label(e) { return e.doc[L] + ", " + where(e); }
  function link(e, text) { return h("a", { href: "#/source/" + e.id, text: text || label(e) }); }
  function forInv(id) { return E.filter(function (e) { return e.invs.indexOf(id) >= 0; }); }

  A.evidence = get;
  A.sourceLabel = label;
  A.sourceLink = link;
  /* A line of links to the exact pages behind an investigation's finding. */
  A.sourceList = function (invId) {
    var list = forInv(invId), docs = [];
    if (!list.length) return null;
    list.forEach(function (e) {
      var d = docs.filter(function (x) { return x.title === e.doc[L]; })[0];
      if (!d) { d = { title: e.doc[L], items: [] }; docs.push(d); }
      d.items.push(e);
    });
    return h("p", { "class": "srcline" }, T("See the exact page: "), docs.map(function (d, k) {
      return [k ? "; " : "", d.title + ", ", d.items.map(function (e, n) { return [n ? ", " : "", link(e, where(e))]; })];
    }));
  };
  /* Thumbnails of the pages an answer cites. */
  A.sourceStrip = function (ids) {
    var list = ids.map(get).filter(Boolean);
    if (!list.length) return null;
    return h("div", { "class": "cited" }, h("h3", { text: T("Pages cited in this answer") }),
      h("ul", null, list.map(function (e) {
        return h("li", null, h("a", { href: "#/source/" + e.id },
          e.img ? h("img", { src: e.img, alt: "", loading: "lazy", width: e.w, height: e.h }) : null,
          h("span", { "class": "t", text: label(e) }), h("span", { "class": "c", text: e.claim[L] })));
      })));
  };

  /* ---------- shared pieces of the list and the gallery ---------- */
  var X = A.exp;
  var F = window.OFMW_FIGURES || [];
  /* A ground test or a team image says so on its thumbnail, so it is never read as a result from orbit. */
  var GROUND = { ground: T("ground test"), partial: T("partial gravity"), standard: T("standard"), history: T("memo, history"), planned: T("planned") };
  function count(n, one, many) { return h("span", { "class": "exp-gcount" }, h("span", { "class": "num", text: A.fmt(n) }), T(n === 1 ? one : many)); }
  function tabs(current) {
    return h("nav", { "class": "exp-tabs", "aria-label": T("Sources and figures") },
      h("a", { href: (X.memo.sources && X.memo.sources.hash) || "#/sources", "class": "exp-tab", "aria-current": current === "sources" ? "page" : null },
        T("Cited pages"), h("span", { "class": "num exp-tab-n", text: String(E.length) })),
      h("a", { href: (X.memo.figures && X.memo.figures.hash) || "#/figures", "class": "exp-tab", "aria-current": current === "figures" ? "page" : null },
        T("Figures"), h("span", { "class": "num exp-tab-n", text: String(F.length) })));
  }
  function groups(list, docOf) {
    var docs = [];
    list.forEach(function (x) {
      var d = docs.filter(function (g) { return g.title === docOf(x); })[0];
      if (!d) { d = { title: docOf(x), items: [] }; docs.push(d); }
      d.items.push(x);
    });
    return docs;
  }
  function invLinks(ids) { return ids.map(function (id, n) { var i = A.inv(id); return [n ? ", " : "", i ? A.invLink(i) : id]; }); }

  /* ---------- sources: the cited pages, grouped by document ---------- */
  var srcSt = { inv: "", q: "", view: "list" };
  function listView(parts) {
    var q = X.query();
    srcSt.inv = q.inv || ""; srcSt.q = q.q || ""; srcSt.view = q.view === "table" ? "table" : "list";
    document.title = T("Sources · One Fire, Many Worlds");
    var invIds = [];
    E.forEach(function (e) { e.invs.forEach(function (id) { if (invIds.indexOf(id) < 0) invIds.push(id); }); });
    invIds.sort(function (a, b) { var x = A.inv(a), y = A.inv(b); return (x ? x.acr : a).localeCompare(y ? y.acr : b); });
    var opts = [["", T("All")]].concat(invIds.map(function (id) { var i = A.inv(id); return [id, i ? i.acr : id]; }), [["outside", T("Outside PSI only")]]);
    var counter = h("p", { "class": "exp-count", "aria-live": "polite" }), body = h("div", { "class": "exp-srcbody" });
    var clearAll = h("button", { type: "button", "class": "c-btn c-btn-quiet", onclick: function () {
      srcSt.inv = ""; srcSt.q = ""; var s = document.getElementById("exp-sq"), i = document.getElementById("exp-sinv");
      if (s) { s.value = ""; s.nextSibling.hidden = true; } if (i) i.value = ""; changed();
    } }, T("Clear filters"));
    var viewBtns = [["list", T("List")], ["table", T("Table")]].map(function (v) {
      return h("button", { type: "button", "class": "exp-seg", "aria-pressed": String(srcSt.view === v[0]), "data-v": v[0], onclick: function () {
        srcSt.view = v[0]; viewBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-v") === srcSt.view)); }); changed();
      } }, v[1]);
    });
    function hash() { return X.build("#/sources", { inv: srcSt.inv, q: srcSt.q, view: srcSt.view === "table" ? "table" : "" }); }
    function changed() { X.setHash(hash(), false); paint(); }
    function matches() {
      var s = srcSt.q.trim().toLowerCase();
      return E.filter(function (e) {
        if (srcSt.inv === "outside" ? e.docInv : srcSt.inv && e.invs.indexOf(srcSt.inv) < 0) return false;
        return !s || (e.doc[L] + " " + where(e) + " " + e.claim[L] + " " + (e.quote || "") + " " + e.id).toLowerCase().indexOf(s) >= 0;
      });
    }
    function item(e) {
      return h("li", { "class": "exp-src" },
        h("a", { "class": "exp-src-thumb", href: "#/source/" + e.id, "aria-label": T("Open the page") + ": " + label(e) },
          e.img ? h("img", { src: e.img, alt: "", loading: "lazy", width: e.w, height: e.h }) : h("span", { "class": "exp-noimg", text: T("No page image") })),
        h("div", { "class": "exp-src-text" },
          h("p", { "class": "exp-src-where" }, h("a", { href: "#/source/" + e.id, text: where(e) }),
            GROUND[e.origin] ? A.tag("ground", GROUND[e.origin]) : null),
          h("p", { "class": "exp-src-claim", text: e.claim[L] }),
          h("p", { "class": "exp-src-invs" }, (e.invs || []).length ? [h("span", { "class": "exp-label-inline", text: T("Used by") }), " ", invLinks(e.invs)]
            : A.tag("outside", T("Context, outside PSI")))));
    }
    function paint() {
      var list = matches();
      counter.replaceChildren(h("span", { "class": "num", text: A.fmt(list.length) }), T(" of ") + A.fmt(E.length) + T(" pages"));
      clearAll.hidden = !(srcSt.inv || srcSt.q);
      if (!list.length) {
        body.replaceChildren(A.state("empty", T("No page matches"), T("No page matches the filter or the search."),
          h("button", { type: "button", "class": "c-btn", onclick: function () { clearAll.click(); } }, T("Clear filters"))));
        return;
      }
      if (srcSt.view === "table") {
        body.replaceChildren(X.apa(1, T("Report pages cited on this site, with what each one supports"), h("table", { "class": "exp-srctable" },
          h("thead", null, h("tr", null, [T("Document"), T("Page"), T("What it supports"), T("Investigations")].map(function (t) { return h("th", { scope: "col", text: t }); }))),
          h("tbody", null, list.map(function (e) {
            return h("tr", null, h("th", { scope: "row" }, link(e, e.doc[L])), h("td", { "class": "num", text: where(e) }),
              h("td", { text: e.claim[L] }), h("td", null, (e.invs || []).length ? invLinks(e.invs) : A.tag("outside", T("Context, outside PSI"))));
          }))),
          T("Each document opens at the cited page with the passage marked. Documents outside PSI are cited as context and say so. What each page supports is the team's summary; the passage is quoted as written.")));
        return;
      }
      body.replaceChildren.apply(body, groups(list, function (e) { return e.doc[L]; }).map(function (g) {
        var outside = !g.items[0].docInv;
        return h("section", { "class": "exp-group" },
          h("h2", { "class": "exp-group-h" }, h("span", { "class": "exp-group-t", text: g.title }), count(g.items.length, " page", " pages"), outside ? A.tag("outside", T("Outside PSI")) : null),
          h("ul", { "class": "exp-srclist" }, g.items.map(item)));
      }).concat([h("p", { "class": "exp-small", text: T("Each document opens at the cited page with the passage marked. Documents outside PSI are cited as context and say so. What each page supports is the team's summary; the passage is quoted as written.") })]));
    }
    A.main.replaceChildren(h("div", { "class": "wrap exp-page exp-sources" },
      A.intro(T("The exact page behind each finding"), T("Every finding quoted from a NASA report points to the page it came from. Open a page to read the passage in its place.")),
      tabs("sources"),
      h("div", { "class": "exp-bar-filters exp-bar-loose", role: "search" },
        X.select("exp-sinv", T("Investigation"), opts, srcSt.inv, function (v) { srcSt.inv = v; changed(); }),
        X.searchBox("exp-sq", T("Find in the pages"), srcSt.q, T("Document, passage or finding"), function (v) { srcSt.q = v; changed(); }),
        h("div", { "class": "exp-field" }, h("p", { "class": "exp-label", id: "exp-sview", text: T("Show as") }),
          h("div", { "class": "exp-segs exp-segs-row", role: "group", "aria-labelledby": "exp-sview" }, viewBtns)),
        h("div", { "class": "exp-bar-end" }, counter, clearAll)),
      body));
    paint();
    X.restore("sources");
  }

  /* ---------- figures: cut from the reports, each with its caption as written and the page it comes from ---------- */
  function fig(id) { return F.filter(function (f) { return f.id === id; })[0]; }
  function figName(f) {
    var slide = /^slide\s+(\S+)/i.exec(String(f.number || ""));          /* slides have no figure number, only their own */
    if (slide) return T("Slide ") + slide[1];
    if (!f.number || /^photo$/i.test(f.number)) return T("Photo");      /* a photo from a web page: no number, no page */
    return T("Figure ") + f.number;
  }
  function figWhere(f) { return f.page ? f.doc[L] + ", " + T("p. ") + f.page : f.doc[L]; }
  function figAlt(f) { return figName(f) + T(" of the report"); }
  function thumbs(list) {
    return h("ul", { "class": "exp-thumbs" }, list.map(function (f) {
      return h("li", null, h("a", { "class": "exp-thumb", href: "#/figure/" + f.id },
        h("span", { "class": "exp-thumb-img" }, h("img", { src: f.img, alt: "", loading: "lazy", width: f.w, height: f.h })),
        h("span", { "class": "exp-thumb-t", text: figName(f) + (f.page ? ", " + T("p. ") + f.page : "") }),
        /* both marks when both apply: a team image of a ground test says it is a ground test */
        GROUND[f.origin] || f.team ? h("span", { "class": "exp-thumb-tags" },
          GROUND[f.origin] ? A.tag("ground", GROUND[f.origin]) : null,
          f.team ? A.tag("team", T("team image")) : null) : null,
        h("span", { "class": "exp-thumb-c", lang: "en", text: f.caption })));
    }));
  }

  A.figure = fig;
  A.figureThumbs = thumbs;
  A.figureLabel = function (f) { return figName(f) + ", " + figWhere(f); };
  function figTitle(f) {
    /* The title is the caption as the report wrote it, without its own "Figure 6.10." so the two numbers do not clash. */
    var title = f.caption.replace(/^\s*(?:Figure|Fig\.?)\s*[\d.]+\s*[.:—–-]*\s*/i, "");
    return title.charAt(0).toUpperCase() + title.slice(1);
  }
  function figNote(f) {
    return [f.page ? T("From ") + figWhere(f) + T(", where it is ") + figName(f) + T(". Cut from the page of the report; the title is the caption as written there. ")
      : T("Photo from ") + figWhere(f) + T("; the title is the caption as written there. "),
      GROUND[f.origin] ? T("Not a microgravity result: ") + GROUND[f.origin] + ". " : "",
      f.credit ? T("Credit: ") + f.credit + " " : ""];
  }
  /* A figure shown in place, inside an answer: the image, its caption as written, and where it comes from. */
  A.figureBlock = function (f, n) {
    return A.apaFigure(n, figTitle(f),
      h("a", { "class": "figimg", href: "#/figure/" + f.id }, h("img", { src: f.img, width: f.w, height: f.h, loading: "lazy", alt: figAlt(f) })),
      figNote(f).concat([h("a", { href: "#/figure/" + f.id, text: T("Open the figure and its source") }), "."]), "en");
  };
  /* The figures of one investigation's reports, for its record. */
  A.figureGallery = function (invId, inside) {
    var list = F.filter(function (f) { return f.invs.indexOf(invId) >= 0; });
    if (!list.length) return null;
    return [inside ? h("p", { "class": "sublabel", text: T("Figures from its reports") }) : h("h2", { text: T("Figures from its reports") }), thumbs(list.slice(0, 6)),
      h("p", { "class": "note" }, T("Captions are quoted in English, as in the reports."), list.length > 6 ? [" ", h("a", { href: "#/figures/" + invId, text: T("See all ") + list.length + T(" figures") })] : null)];
  };

  function figureView(parts) {
    var f = fig(parts[0]), galleryHref = (X.memo.figures && X.memo.figures.hash) || "#/figures";
    if (!f) {
      document.title = T("No such figure") + " · One Fire, Many Worlds";
      A.main.replaceChildren(h("div", { "class": "wrap exp-page" }, h("p", { "class": "exp-backrow" }, A.back(galleryHref, T("All figures"))),
        A.state("error", T("No such figure"), null, h("a", { "class": "c-btn", href: "#/figures", text: T("See all figures") }))));
      return;
    }
    document.title = figName(f) + ", " + figWhere(f) + " · One Fire, Many Worlds";
    var k = F.indexOf(f), prev = F[k - 1], next = F[k + 1], nasa = f.download === f.record;
    var zoom = 1, img = h("img", { src: f.img, width: f.w, height: f.h, alt: figAlt(f) + ": " + f.caption, "class": "exp-zoom-img" });
    var frame = h("div", { "class": "exp-zoom", tabindex: "0", "aria-label": T("Zoom") }, img);
    var level = h("span", { "class": "num exp-zoom-level", "aria-live": "polite", text: "100 %" });
    var outBtn = h("button", { type: "button", "class": "c-btn", onclick: function () { setZoom(zoom / 1.5); } }, T("Zoom out"));
    var inBtn = h("button", { type: "button", "class": "c-btn", onclick: function () { setZoom(zoom * 1.5); } }, T("Zoom in"));
    var fitBtn = h("button", { type: "button", "class": "c-btn c-btn-quiet", onclick: function () { setZoom(1); } }, T("Fit"));
    function setZoom(z) {
      zoom = Math.max(1, Math.min(4, Math.round(z * 100) / 100));
      img.style.width = (zoom * 100) + "%"; frame.classList.toggle("exp-zoomed", zoom > 1);
      level.textContent = Math.round(zoom * 100) + " %";
      outBtn.disabled = zoom <= 1; fitBtn.disabled = zoom <= 1; inBtn.disabled = zoom >= 4;
    }
    var figure = A.apaFigure(1, figTitle(f), h("div", { "class": "exp-zoombox" },
      h("div", { "class": "exp-zoombar" }, outBtn, level, inBtn, fitBtn), frame), figNote(f), "en");
    X.apaClass(figure);
    figure.classList.add("exp-bigfig");
    var mats = f.materials || [];
    var side = h("aside", { "class": "exp-figside" },
      h("h2", { "class": "exp-h3", text: T("The caption, as written") }), h("blockquote", { "class": "exp-quote", lang: "en", text: f.caption }),
      L === "es" ? h("p", { "class": "exp-small", text: T("The caption is quoted in English, as in the report.") }) : null,
      h("h2", { "class": "exp-h3", text: T("Used by") }),
      f.invs.length ? h("p", { "class": "exp-links" }, invLinks(f.invs)) : A.tag("outside", T("Context, outside PSI")),
      mats.length ? [h("h2", { "class": "exp-h3", text: T("Materials") }),
        h("p", { "class": "exp-links" }, mats.map(function (m, n) { return [n ? ", " : "", h("a", { href: "#/material/" + encodeURIComponent(m), text: m })]; }))] : null,
      h("h2", { "class": "exp-h3", text: T("Where it comes from") }),
      h("p", { "class": "exp-actions" }, nasa
        ? h("a", { "class": "c-btn", href: f.download, target: "_blank", rel: "noopener", text: T("Open the document at NASA") })
        : [h("a", { "class": "c-btn", href: f.download, target: "_blank", rel: "noopener", text: T("Download the original document") }),
          h("a", { "class": "c-btn c-btn-quiet", href: f.record, target: "_blank", rel: "noopener", text: T("Open the record in PSI") })]),
      h("p", { "class": "exp-small", text: !f.page ? T("Photo as published on that page. Nothing else was changed.")
        : (nasa ? "" : T("PSI delivers the whole PDF. Once it opens, go to page ") + f.page + ". ") + T("Cut from the page of the report. Nothing else was changed.") }));
    A.main.replaceChildren(h("div", { "class": "wrap exp-page exp-figpage" },
      h("p", { "class": "exp-backrow" }, A.back(galleryHref, T("All figures"))),
      A.intro(figName(f), figWhere(f)),
      h("div", { "class": "exp-figgrid" }, figure, side),
      h("nav", { "class": "exp-prevnext", "aria-label": T("Figures") },
        prev ? h("a", { "class": "c-btn", href: "#/figure/" + prev.id, rel: "prev" }, T("Previous figure")) : h("span"),
        next ? h("a", { "class": "c-btn", href: "#/figure/" + next.id, rel: "next" }, T("Next figure")) : h("span"))));
    setZoom(1);
  }

  var figSt = { inv: "", mat: "" };
  function figuresView(parts) {
    var q = X.query(), first = parts && parts[0] ? parts[0] : "";
    figSt.inv = ""; figSt.mat = "";
    if (first && first.charAt(0) !== "?") figSt.inv = A.inv(first) ? first : "";        /* #/figures/PSI-20, the link from an investigation */
    else { figSt.inv = q.inv || ""; figSt.mat = q.mat || ""; }
    document.title = T("Figures · One Fire, Many Worlds");
    var invIds = [], mats = [];
    F.forEach(function (f) {
      f.invs.forEach(function (id) { if (invIds.indexOf(id) < 0) invIds.push(id); });
      (f.materials || []).forEach(function (m) { if (mats.indexOf(m) < 0) mats.push(m); });
    });
    invIds.sort(function (a, b) { var x = A.inv(a), y = A.inv(b); return (x ? x.acr : a).localeCompare(y ? y.acr : b); });
    mats.sort();
    var counter = h("p", { "class": "exp-count", "aria-live": "polite" }), body = h("div", { "class": "exp-figbody" });
    var clearAll = h("button", { type: "button", "class": "c-btn c-btn-quiet", onclick: function () {
      figSt.inv = ""; figSt.mat = ""; var a = document.getElementById("exp-finv"), b = document.getElementById("exp-fmat");
      if (a) a.value = ""; if (b) b.value = ""; changed();
    } }, T("Clear filters"));
    function changed() { X.setHash(X.build("#/figures", { inv: figSt.inv, mat: figSt.mat }), false); paint(); }
    function paint() {
      var list = F.filter(function (f) { return (!figSt.inv || f.invs.indexOf(figSt.inv) >= 0) && (!figSt.mat || (f.materials || []).indexOf(figSt.mat) >= 0); });
      counter.replaceChildren(h("span", { "class": "num", text: A.fmt(list.length) }), T(" of ") + A.fmt(F.length) + T(" figures"));
      clearAll.hidden = !(figSt.inv || figSt.mat);
      if (!list.length) {
        body.replaceChildren(A.state("empty", T("No figure matches"), T("No figure matches these filters."),
          h("button", { type: "button", "class": "c-btn", onclick: function () { clearAll.click(); } }, T("Clear filters"))));
        return;
      }
      body.replaceChildren.apply(body, groups(list, function (f) { return f.doc[L]; }).map(function (g) {
        return h("section", { "class": "exp-group" },
          h("h2", { "class": "exp-group-h" }, h("span", { "class": "exp-group-t", text: g.title }), count(g.items.length, " figure", " figures")),
          thumbs(g.items));
      }).concat([h("p", { "class": "exp-small", text: T("Captions are quoted in English, as in the reports.") })]));
    }
    A.main.replaceChildren(h("div", { "class": "wrap exp-page exp-figures" },
      A.intro(T("Figures from the reports"), T("Pick a figure to see it large, with its caption as written and the page it comes from.")),
      tabs("figures"),
      h("div", { "class": "exp-bar-filters exp-bar-loose", role: "search" },
        X.select("exp-finv", T("Investigation"), [["", T("All")]].concat(invIds.map(function (id) { var i = A.inv(id); return [id, i ? i.acr : id]; })), figSt.inv,
          function (v) { figSt.inv = v; changed(); }),
        X.select("exp-fmat", T("Material"), [["", T("All")]].concat(mats.map(function (m) { return [m, m]; })), figSt.mat, function (v) { figSt.mat = v; changed(); }),
        h("div", { "class": "exp-bar-end" }, counter, clearAll)),
      body));
    paint();
    X.restore("figures");
  }

  A.section({ id: "sources", label: T("Sources"), href: "#/sources" }, listView);
  A.route("figure", "sources", figureView);
  A.route("figures", "sources", figuresView);
})();
