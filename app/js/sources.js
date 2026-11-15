/* Sources: the exact page of the NASA report behind each finding, shown in place with the passage marked. */
(function () {
  "use strict";
  var A = window.OFMW_APP, h = A.h, T = A.T, D = A.D;
  var E = window.OFMW_EVIDENCE || [], L = window.OFMW_LANG === "es" ? "es" : "en";
  if (!D) return;

  function get(id) { return E.filter(function (e) { return e.id === id; })[0]; }
  function where(e) { return e.page ? T("p. ") + e.page : T("Pages ") + e.pageLabel; }
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

  function page(e) {
    var box = h("div", { "class": "pagebox" }, h("img", { src: e.img, width: e.w, height: e.h,
      alt: T("Page of the report, with the cited passage marked") + ": " + e.quote }));
    e.rects.forEach(function (r) {
      box.appendChild(h("span", { "class": "mark", "aria-hidden": "true",
        style: "left:" + (r[0] * 100 - 0.4) + "%;top:" + (r[1] * 100 - 0.2) + "%;width:" + ((r[2] - r[0]) * 100 + 0.8) + "%;height:" + ((r[3] - r[1]) * 100 + 0.4) + "%" }));
    });
    return h("figure", { "class": "pagefig" }, box,
      h("figcaption", { text: e.doc[L] + ". " + T("page ") + e.page + T(" of ") + e.pages + T(" in the PDF") + "." }));
  }

  function view(parts) {
    var e = get(parts[0]);
    if (!e) { A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "error" }, h("h1", { text: T("No such source") }),
      h("p", null, h("a", { href: "#/sources", text: T("See all sources") }), ".")))); return; }
    document.title = label(e) + " · One Fire, Many Worlds";
    var k = E.indexOf(e), prev = E[k - 1], next = E[k + 1];
    var side = h("div", { "class": "srcside" },
      h("h2", { "class": "tight", text: T("What this page supports") }), h("p", { "class": "finding", text: e.claim[L] }),
      e.quote ? [h("h2", { "class": "tight", text: T("The passage, as written") }), h("blockquote", { lang: "en", text: e.quote }),
        L === "es" ? h("p", { "class": "note", text: T("The passage is quoted in English, as in the report.") }) : null] : null,
      (e.invs || []).length ? [h("h2", { "class": "tight", text: T("Used by") }),
        h("p", { "class": "links" }, e.invs.map(function (id, n) { var i = A.inv(id); return [n ? " · " : "", i ? A.invLink(i) : id]; }))] : null,
      /* A document outside PSI (a standard, a memo, a poster) has its own page at NASA instead of a PSI record. */
      h("p", { "class": "srcactions" }, e.docInv
        ? [h("a", { "class": "action", href: e.download, target: "_blank", rel: "noopener", text: T("Download the original document") }),
          h("a", { "class": "action quiet", href: e.record, target: "_blank", rel: "noopener", text: T("Open the record in PSI") })]
        : h("a", { "class": "action", href: e.record || e.download, target: "_blank", rel: "noopener", text: T("Open the document at NASA") })),
      h("p", { "class": "note", text: !e.page ? T("The page image is not reproduced for this document.")
        : e.docInv ? T("PSI delivers the whole PDF. Once it opens, go to page ") + e.page + "."
        : T("This document is not in PSI: it is cited as context. Once it opens, go to page ") + e.page + "." }),
      h("p", { "class": "links" }, prev ? link(prev, T("Previous source")) : null, prev && next ? " · " : "", next ? link(next, T("Next source")) : null));
    A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "sheet page" },
      h("p", { "class": "crumb" }, h("a", { href: "#/sources", text: T("Sources") }), " / " + e.id),
      h("h1", { "class": "srctitle", text: e.doc[L] }),
      h("p", { "class": "headline", text: where(e) }),
      h("div", { "class": "lead srclead" }, e.img ? page(e) : h("p", { "class": "empty", text: T("The page image is not reproduced for this document.") }), side))));
    var mark = document.querySelector(".pagebox .mark");
    if (mark && window.innerWidth >= 992) { /* wide screens: the passage is already beside the text */ }
  }

  function listView() {
    document.title = T("Sources · One Fire, Many Worlds");
    A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "sheet page" },
      h("h1", { text: T("The exact page behind each finding") }),
      h("p", { "class": "intro", text: T("Every finding quoted from a NASA report points to the page it came from. Open a page to read the passage in its place.") }),
      (window.OFMW_FIGURES || []).length ? h("p", { "class": "links" }, h("a", { href: "#/figures", text: T("See the figures cut from these reports") }), " (" + window.OFMW_FIGURES.length + ")") : null,
      h("div", { "class": "table" }, h("table", { "class": "list" },
        h("thead", null, h("tr", null, [T("Document"), T("Page"), T("What it supports"), T("Investigations")].map(function (t) { return h("th", { scope: "col", text: t }); }))),
        h("tbody", null, E.map(function (e) {
          return h("tr", null, h("th", { scope: "row" }, link(e, e.doc[L])), h("td", { "class": "num", text: e.page ? String(e.page) : e.pageLabel }),
            h("td", { text: e.claim[L] }), h("td", null, (e.invs || []).length ? e.invs.map(function (id, n) { var i = A.inv(id); return [n ? ", " : "", i ? A.invLink(i) : id]; })
              : h("span", { "class": "missing", text: T("Context, outside PSI") })));
        })))))));
  }

  /* ---------- figures: cut from the reports, each with its caption as written and the page it comes from ---------- */
  var F = window.OFMW_FIGURES || [];
  function fig(id) { return F.filter(function (f) { return f.id === id; })[0]; }
  function figName(f) {
    var slide = /^slide\s+(\S+)/i.exec(String(f.number || ""));          /* slides have no figure number, only their own */
    return slide ? T("Slide ") + slide[1] : T("Figure ") + f.number;
  }
  function figWhere(f) { return f.doc[L] + ", " + T("p. ") + f.page; }
  function figAlt(f) { return figName(f) + T(" of the report"); }
  /* A ground test or a team image says so on its thumbnail, so it is never read as a result from orbit. */
  var GROUND = { ground: T("ground test"), standard: T("standard"), history: T("memo, history"), planned: T("planned") };
  function thumbs(list) {
    return h("ul", { "class": "figgrid" }, list.map(function (f) {
      var tag = f.team ? T("team image") : GROUND[f.origin];
      return h("li", null, h("a", { href: "#/figure/" + f.id },
        h("img", { src: f.img, alt: "", loading: "lazy", width: f.w, height: f.h }),
        h("span", { "class": "t", text: (f.number ? figName(f) + ", " : "") + (f.page ? T("p. ") + f.page : "") }),
        tag ? h("span", { "class": "tag tag-" + (f.team ? "team" : f.origin), text: tag }) : null,
        h("span", { "class": "c", lang: "en", text: f.caption })));
    }));
  }

  A.figure = fig;
  A.figureThumbs = thumbs;
  A.figureLabel = function (f) { return figName(f) + ", " + figWhere(f); };
  /* A figure shown in place, inside an answer: the image, its caption as written, and where it comes from. */
  A.figureBlock = function (f, n) {
    /* The title is the caption as the report wrote it, without its own "Figure 6.10." so the two numbers do not clash. */
    var title = f.caption.replace(/^\s*(?:Figure|Fig\.?)\s*[\d.]+\s*[.:—–-]*\s*/i, "");
    return A.apaFigure(n, title.charAt(0).toUpperCase() + title.slice(1),
      h("a", { "class": "figimg", href: "#/figure/" + f.id }, h("img", { src: f.img, width: f.w, height: f.h, loading: "lazy", alt: figAlt(f) })),
      [T("From ") + figWhere(f) + T(", where it is ") + figName(f) + T(". Cut from the page of the report; the title is the caption as written there. "),
        h("a", { href: "#/figure/" + f.id, text: T("Open the figure and its source") }), "."], "en");
  };
  /* The figures of one investigation's reports, for its record. */
  A.figureGallery = function (invId, inside) {
    var list = F.filter(function (f) { return f.invs.indexOf(invId) >= 0; });
    if (!list.length) return null;
    return [inside ? h("p", { "class": "sublabel", text: T("Figures from its reports") }) : h("h2", { text: T("Figures from its reports") }), thumbs(list.slice(0, 6)),
      h("p", { "class": "note" }, T("Captions are quoted in English, as in the reports."), list.length > 6 ? [" ", h("a", { href: "#/figures/" + invId, text: T("See all ") + list.length + T(" figures") })] : null)];
  };

  function figureView(parts) {
    var f = fig(parts[0]);
    if (!f) { A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "error" }, h("h1", { text: T("No such figure") }),
      h("p", null, h("a", { href: "#/figures", text: T("See all figures") }), ".")))); return; }
    document.title = figName(f) + ", " + figWhere(f) + " · One Fire, Many Worlds";
    var k = F.indexOf(f), prev = F[k - 1], next = F[k + 1], nasa = f.download === f.record;
    var side = h("div", { "class": "srcside" },
      h("h2", { "class": "tight", text: T("The caption, as written") }), h("blockquote", { lang: "en", text: f.caption }),
      f.credit ? h("p", { "class": "note" }, h("strong", { text: T("Credit: ") }), h("span", { lang: "en", text: f.credit })) : null,
      L === "es" ? h("p", { "class": "note", text: T("The caption is quoted in English, as in the report.") }) : null,
      f.invs.length ? [h("h2", { "class": "tight", text: T("Used by") }),
        h("p", { "class": "links" }, f.invs.map(function (id, n) { var i = A.inv(id); return [n ? " · " : "", i ? A.invLink(i) : id]; }))] : null,
      h("p", { "class": "srcactions" }, nasa
        ? h("a", { "class": "action", href: f.download, target: "_blank", rel: "noopener", text: T("Open the document at NASA") })
        : [h("a", { "class": "action", href: f.download, target: "_blank", rel: "noopener", text: T("Download the original document") }),
          h("a", { "class": "action quiet", href: f.record, target: "_blank", rel: "noopener", text: T("Open the record in PSI") })]),
      h("p", { "class": "note", text: (nasa ? "" : T("PSI delivers the whole PDF. Once it opens, go to page ") + f.page + ". ") + T("Cut from the page of the report. Nothing else was changed.") }),
      h("p", { "class": "links" }, prev ? h("a", { href: "#/figure/" + prev.id, text: T("Previous figure") }) : null, prev && next ? " · " : "",
        next ? h("a", { href: "#/figure/" + next.id, text: T("Next figure") }) : null));
    A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "sheet page" },
      h("p", { "class": "crumb" }, h("a", { href: "#/sources", text: T("Sources") }), " / ", h("a", { href: "#/figures", text: T("Figures") }), " / " + f.id),
      h("h1", { "class": "srctitle", text: figName(f) }),
      h("p", { "class": "headline", text: figWhere(f) }),
      h("div", { "class": "lead srclead" },
        h("figure", { "class": "pagefig" }, h("div", { "class": "pagebox figbig" }, h("img", { src: f.img, width: f.w, height: f.h, alt: figAlt(f) + ": " + f.caption }))), side))));
  }

  function figuresView(parts) {
    var only = parts[0] && A.inv(parts[0]), docs = [];
    document.title = T("Figures · One Fire, Many Worlds");
    F.forEach(function (f) {
      if (only && f.invs.indexOf(only.id) < 0) return;
      var d = docs.filter(function (x) { return x.title === f.doc[L]; })[0];
      if (!d) { d = { title: f.doc[L], items: [] }; docs.push(d); }
      d.items.push(f);
    });
    A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "sheet page" },
      h("p", { "class": "crumb" }, h("a", { href: "#/sources", text: T("Sources") }), " / " + T("Figures")),
      h("h1", { text: T("Figures from the reports") }),
      h("p", { "class": "intro", text: T("Figures cut from the NASA reports behind the investigations, each with its caption as written and the page it comes from.") }),
      only ? h("p", { "class": "links" }, T("Showing the figures of ") + only.acr + ". ", h("a", { href: "#/figures", text: T("Show the figures of every report") })) : null,
      docs.length ? docs.map(function (d) { return [h("h2", { text: d.title }), thumbs(d.items)]; })
        : h("p", { "class": "empty" }, T("No figure was cut from the reports of this investigation. "), h("a", { href: "#/figures", text: T("See all figures") })),
      h("p", { "class": "note", text: T("Captions are quoted in English, as in the reports.") }))));
  }

  A.section({ id: "sources", label: T("Sources"), href: "#/sources" }, listView);
  A.route("source", "sources", view);
  A.route("figure", "sources", figureView);
  A.route("figures", "sources", figuresView);
})();
