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
      h("h2", { "class": "tight", text: T("Used by") }),
      h("p", { "class": "links" }, e.invs.map(function (id, n) { var i = A.inv(id); return [n ? " · " : "", i ? A.invLink(i) : id]; })),
      h("p", { "class": "srcactions" },
        h("a", { "class": "action", href: e.download, target: "_blank", rel: "noopener", text: T("Download the original document") }),
        h("a", { "class": "action quiet", href: e.record, target: "_blank", rel: "noopener", text: T("Open the record in PSI") })),
      h("p", { "class": "note", text: e.page ? T("PSI delivers the whole PDF. Once it opens, go to page ") + e.page + "." : T("The page image is not reproduced for this document.") }),
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
      h("div", { "class": "table" }, h("table", { "class": "list" },
        h("thead", null, h("tr", null, [T("Document"), T("Page"), T("What it supports"), T("Investigations")].map(function (t) { return h("th", { scope: "col", text: t }); }))),
        h("tbody", null, E.map(function (e) {
          return h("tr", null, h("th", { scope: "row" }, link(e, e.doc[L])), h("td", { "class": "num", text: e.page ? String(e.page) : e.pageLabel }),
            h("td", { text: e.claim[L] }), h("td", null, e.invs.map(function (id, n) { var i = A.inv(id); return [n ? ", " : "", i ? A.invLink(i) : id]; })));
        })))))));
  }

  A.section({ id: "sources", label: T("Sources"), href: "#/sources" }, listView);
  A.route("source", "sources", view);
})();
