/* The page of one cited source (#/source/<id>): the page of the report, large and zoomable, with the passage
   marked, and beside it what the page supports, the passage as written and who uses it.
   It replaces the view registered by sources.js (this file loads after it). A.sourcePage(e, compact) draws
   the same page small, for the side panel of the question box. */
(function () {
  "use strict";
  var A = window.OFMW_APP, h = A.h, T = A.T;
  var E = window.OFMW_EVIDENCE || [], L = window.OFMW_LANG === "es" ? "es" : "en";
  if (!A.D) return;

  A.es({
    "The page of the report behind a finding, with the cited passage marked. Zoom in to read it.": "La página del reporte detrás de un hallazgo, con el pasaje citado marcado. Acércate para leerlo.",
    "Back to the conversation": "Volver a la conversación",
    "Back to the material": "Volver al material",
    "Back to the investigation": "Volver a la investigación",
    "Back to sources": "Volver a las fuentes",
    "Back to the figure": "Volver a la figura",
    "Back to the world": "Volver al mundo",
    "Back to the data": "Volver a los datos",
    "All sources": "Todas las fuentes",
    "Zoom in": "Acercar",
    "Zoom out": "Alejar",
    "Fit": "Ajustar",
    "Zoom": "Zoom",
    "Page image. Zoom with the buttons, with Ctrl and the mouse wheel, or by pinching; drag to move around.": "Imagen de la página. Haz zoom con los botones, con Ctrl y la rueda del ratón, o pellizcando; arrastra para moverte.",
    "Page of the report, with the cited passage marked": "Página del reporte, con el pasaje citado marcado",
    "page ": "página ",
    " of ": " de ",
    " in the PDF": " del PDF",
    "What this page supports": "Qué sostiene esta página",
    "The passage, as written": "El pasaje, tal como está escrito",
    "The passage is quoted in English, as in the report.": "El pasaje se cita en inglés, como en el reporte.",
    "Used by": "Lo usan",
    "Download the original document": "Descargar el documento original",
    "Open the record in PSI": "Abrir la ficha en PSI",
    "Open the document at NASA": "Abrir el documento en NASA",
    "The page image is not reproduced for this document.": "La imagen de la página no se reproduce para este documento.",
    "No page image": "Sin imagen de la página",
    "PSI delivers the whole PDF. Once it opens, go to page ": "PSI entrega el PDF completo. Cuando abra, ve a la página ",
    "This document is not in PSI: it is cited as context. Once it opens, go to page ": "Este documento no está en PSI: se cita como contexto. Cuando abra, ve a la página ",
    "Previous source": "Fuente anterior",
    "Next source": "Fuente siguiente",
    "Source ": "Fuente ",
    "No such source": "No existe esa fuente",
    "The link points to a source that is not in this site's catalog.": "El enlace apunta a una fuente que no está en el catálogo de este sitio.",
    "See all sources": "Ver todas las fuentes",
    "Outside PSI": "Fuera de PSI",
    "Not a microgravity result: ": "No es un resultado en microgravedad: ",
    "ground test": "prueba en tierra",
    "partial gravity": "gravedad parcial",
    "standard": "norma",
    "memo, history": "memorándum, historia",
    "planned": "planeado",
    "p. ": "p. ",
    "Pages ": "Páginas ",
    " and ": " y ",
    "Record at NASA": "Ficha en NASA"
  });

  function get(id) { return E.filter(function (e) { return e.id === id; })[0]; }
  /* Copied from sources.js: a cited place that is not a single PDF page (a range, a poster page, an abstract). */
  function where(e) {
    if (e.page) return T("p. ") + e.page;
    var label = String(e.pageLabel || "");
    if (/^\d+$/.test(label)) return T("p. ") + label;
    if (/\d/.test(label)) return T("Pages ") + label.replace(/ and /g, T(" and "));
    return label ? T(label) : T("Record at NASA");
  }
  function label(e) { return e.doc[L] + ", " + where(e); }
  var KIND = { ground: "ground test", partial: "partial gravity", standard: "standard", history: "memo, history", planned: "planned" };
  /* The marks the data carries: outside PSI, and what kind of evidence it is when it is not a microgravity result. */
  function tags(e) {
    var out = [];
    if (!e.docInv) out.push(A.tag("outside", T("Outside PSI")));
    if (KIND[e.origin]) out.push(A.tag(e.origin === "ground" ? "ground" : "kind", T(KIND[e.origin])));
    return out.length ? h("p", { "class": "ask-src-tags" }, out) : null;
  }

  /* ---------- the zoomable page ---------- */
  function viewer(e, compact) {
    var ratio = e.h / e.w, s = 1, fit = 1, tx = 0, ty = 0, W = 0, V = 0;
    var img = h("img", { src: e.img, width: e.w, height: e.h, draggable: "false",
      alt: T("Page of the report, with the cited passage marked") + (e.quote ? ": " + e.quote : "") });
    var stage = h("div", { "class": "ask-pg-stage" }, img);
    (e.rects || []).forEach(function (r) {
      stage.appendChild(h("span", { "class": "ask-pg-mark", "aria-hidden": "true",
        style: "left:" + (r[0] * 100 - 0.4) + "%;top:" + (r[1] * 100 - 0.2) + "%;width:" + ((r[2] - r[0]) * 100 + 0.8) + "%;height:" + ((r[3] - r[1]) * 100 + 0.4) + "%" }));
    });
    var view = h("div", { "class": "ask-pg-view", tabindex: "0", role: "group", style: "aspect-ratio:" + e.w + " / " + e.h,
      "aria-label": T("Page image. Zoom with the buttons, with Ctrl and the mouse wheel, or by pinching; drag to move around.") }, stage);
    var level = h("span", { "class": "ask-pg-level num", "aria-live": "polite" });
    var zin = h("button", { type: "button", "class": "c-btn", onclick: function () { zoomAt(s * 1.4, W / 2, V / 2); } }, T("Zoom in"));
    var zout = h("button", { type: "button", "class": "c-btn", onclick: function () { zoomAt(s / 1.4, W / 2, V / 2); } }, T("Zoom out"));
    var zfit = h("button", { type: "button", "class": "c-btn", onclick: reset }, T("Fit"));
    var tools = h("div", { "class": "ask-pg-tools" }, zin, zout, zfit, h("span", { "class": "ask-pg-zoom" }, T("Zoom") + " ", level));

    function measure() { W = view.clientWidth; V = view.clientHeight; fit = W ? Math.min(1, V / (W * ratio)) : 1; }
    function clamp() {
      var sw = W * s, sh = W * ratio * s;
      tx = sw <= W ? (W - sw) / 2 : Math.min(0, Math.max(W - sw, tx));
      ty = sh <= V ? (V - sh) / 2 : Math.min(0, Math.max(V - sh, ty));
    }
    function paint() {
      clamp();
      stage.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + s + ")";
      var zoomed = s > fit + 0.001;
      view.classList.toggle("ask-pg-zoomed", zoomed);
      level.textContent = Math.round(s / fit * 100) + " %";
      zout.disabled = !zoomed; zfit.disabled = !zoomed; zin.disabled = s >= fit * 6 - 0.001;
    }
    function zoomAt(next, px, py) {
      next = Math.max(fit, Math.min(fit * 6, next));
      tx = px - (px - tx) * (next / s); ty = py - (py - ty) * (next / s); s = next; paint();
    }
    function reset() { measure(); s = fit; tx = 0; ty = 0; paint(); }
    function local(cx, cy) { var b = view.getBoundingClientRect(); return [cx - b.left, cy - b.top]; }

    view.addEventListener("wheel", function (ev) {
      if (!ev.ctrlKey) return;                     /* without Ctrl the wheel scrolls the page, as everywhere */
      ev.preventDefault();
      var p = local(ev.clientX, ev.clientY);
      zoomAt(s * Math.exp(-ev.deltaY * 0.0025), p[0], p[1]);
    }, { passive: false });
    var drag = null;
    view.addEventListener("pointerdown", function (ev) {
      if (ev.pointerType === "touch" || s <= fit + 0.001 || ev.button !== 0) return;
      drag = { x: ev.clientX, y: ev.clientY, tx: tx, ty: ty };
      view.setPointerCapture(ev.pointerId); view.classList.add("ask-pg-drag");
    });
    view.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      tx = drag.tx + ev.clientX - drag.x; ty = drag.ty + ev.clientY - drag.y; paint();
    });
    function endDrag() { drag = null; view.classList.remove("ask-pg-drag"); }
    view.addEventListener("pointerup", endDrag);
    view.addEventListener("pointercancel", endDrag);
    /* Touch: one finger moves the page only when it is zoomed (otherwise it scrolls the site); two fingers pinch. */
    var pinch = null, pan = null;
    function dist(t) { return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY); }
    function mid(t) { return local((t[0].clientX + t[1].clientX) / 2, (t[0].clientY + t[1].clientY) / 2); }
    view.addEventListener("touchstart", function (ev) {
      if (ev.touches.length === 2) {
        ev.preventDefault(); pan = null;
        pinch = { d: dist(ev.touches), m: mid(ev.touches), s: s, tx: tx, ty: ty };
      } else if (ev.touches.length === 1 && s > fit + 0.001) {
        ev.preventDefault();
        pan = { x: ev.touches[0].clientX, y: ev.touches[0].clientY, tx: tx, ty: ty };
      }
    }, { passive: false });
    view.addEventListener("touchmove", function (ev) {
      if (pinch && ev.touches.length === 2) {
        ev.preventDefault();
        var m = mid(ev.touches), next = Math.max(fit, Math.min(fit * 6, pinch.s * dist(ev.touches) / pinch.d));
        tx = m[0] - (pinch.m[0] - pinch.tx) * (next / pinch.s); ty = m[1] - (pinch.m[1] - pinch.ty) * (next / pinch.s); s = next; paint();
      } else if (pan && ev.touches.length === 1) {
        ev.preventDefault();
        tx = pan.tx + ev.touches[0].clientX - pan.x; ty = pan.ty + ev.touches[0].clientY - pan.y; paint();
      }
    }, { passive: false });
    view.addEventListener("touchend", function (ev) { if (ev.touches.length < 2) pinch = null; if (!ev.touches.length) pan = null; });
    view.addEventListener("keydown", function (ev) {
      var step = 60;
      if (ev.key === "+" || ev.key === "=") zoomAt(s * 1.4, W / 2, V / 2);
      else if (ev.key === "-") zoomAt(s / 1.4, W / 2, V / 2);
      else if (ev.key === "0") reset();
      else if (s > fit + 0.001 && /^Arrow/.test(ev.key)) {
        if (ev.key === "ArrowLeft") tx += step; if (ev.key === "ArrowRight") tx -= step;
        if (ev.key === "ArrowUp") ty += step; if (ev.key === "ArrowDown") ty -= step;
        paint();
      } else return;
      ev.preventDefault();
    });
    if (typeof ResizeObserver === "function") {
      var lastW = 0;
      new ResizeObserver(function () { if (view.clientWidth && view.clientWidth !== lastW) { lastW = view.clientWidth; reset(); } }).observe(view);
    }
    setTimeout(reset, 0);
    return h("figure", { "class": "ask-pg" + (compact ? " ask-pg-compact" : "") }, tools, view,
      h("figcaption", { "class": "ask-pg-cap", text: e.doc[L] + ". " + T("page ") + e.page + T(" of ") + e.pages + T(" in the PDF") + "." }));
  }

  /* ---------- what the page supports ---------- */
  function side(e, compact) {
    var k = E.indexOf(e), prev = E[k - 1], next = E[k + 1];
    function step(x, text) {
      return h("a", { "class": "c-btn", href: "#/source/" + x.id,
        onclick: function (ev) { if (compact) return; ev.preventDefault(); location.replace("#/source/" + x.id); } }, text);
    }
    return h("div", { "class": "ask-src-side" },
      h("section", null, h("h2", { "class": "ask-src-h", text: T("What this page supports") }), h("p", { "class": "ask-src-claim", text: e.claim[L] })),
      e.quote ? h("section", null, h("h2", { "class": "ask-src-h", text: T("The passage, as written") }),
        h("blockquote", { "class": "ask-src-quote", lang: "en", text: e.quote }),
        L === "es" ? h("p", { "class": "ask-src-note", text: T("The passage is quoted in English, as in the report.") }) : null) : null,
      (e.invs || []).length ? h("section", null, h("h2", { "class": "ask-src-h", text: T("Used by") }),
        h("ul", { "class": "ask-src-used" }, e.invs.map(function (id) {
          var i = A.inv(id);
          return h("li", null, i ? h("a", { href: "#/investigation/" + id }, h("span", { "class": "ask-src-acr", text: i.acr }), " ", h("span", { text: i.title || "" })) : h("span", { "class": "num", text: id }));
        }))) : null,
      compact ? null : h("div", { "class": "ask-src-actions" }, e.docInv
        ? [h("a", { "class": "c-btn c-btn-primary", href: e.download, target: "_blank", rel: "noopener", text: T("Download the original document") }),
          h("a", { "class": "c-btn", href: e.record, target: "_blank", rel: "noopener", text: T("Open the record in PSI") })]
        : h("a", { "class": "c-btn c-btn-primary", href: e.record || e.download, target: "_blank", rel: "noopener", text: T("Open the document at NASA") })),
      h("p", { "class": "ask-src-note", text: !e.page ? T("The page image is not reproduced for this document.")
        : e.docInv ? T("PSI delivers the whole PDF. Once it opens, go to page ") + e.page + "."
        : T("This document is not in PSI: it is cited as context. Once it opens, go to page ") + e.page + "." }),
      compact ? null : h("nav", { "class": "ask-src-steps", "aria-label": T("Source ") + (k + 1) + T(" of ") + E.length },
        prev ? step(prev, T("Previous source")) : h("span"),
        h("span", { "class": "num ask-src-count", text: (k + 1) + " / " + E.length }),
        next ? step(next, T("Next source")) : h("span")));
  }
  function noImage() {
    return h("div", { "class": "ask-pg-none" }, A.tag("missing", T("No page image")),
      h("p", { text: T("The page image is not reproduced for this document.") }));
  }
  /* The same page, drawn full (its own route) or compact (the side panel of the question box). */
  function sourcePage(e, compact) {
    return h("div", { "class": "ask-src-grid" + (compact ? " ask-src-compact" : "") },
      h("div", { "class": "ask-src-left" }, compact ? h("p", { "class": "ask-src-where" }, h("span", { "class": "ask-src-page", text: where(e) }), " ", tags(e)) : null,
        e.img ? viewer(e, compact) : noImage()),
      side(e, compact));
  }
  A.sourcePage = sourcePage;
  A.sourceTags = tags;
  A.sourceWhere = where;

  /* ---------- where the person came from, so Back returns there ---------- */
  var KEY = "ofmw-src-origin";
  function origin() { try { return JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch (e) { return null; } }
  function setOrigin(v) { try { if (v) sessionStorage.setItem(KEY, JSON.stringify(v)); else sessionStorage.removeItem(KEY); } catch (e) { /* no storage */ } }
  window.addEventListener("hashchange", function (ev) {
    var was = String(ev.oldURL || "").split("#")[1] || "/", now = location.hash.replace(/^#/, "");
    var fromSrc = /^\/source\//.test(was), toSrc = /^\/source\//.test(now);
    if (toSrc && !fromSrc) setOrigin({ hash: "#" + was });          /* stepping between sources keeps the first origin */
    else if (!toSrc && fromSrc) setOrigin(null);
  });
  function backLabel(hash) {
    var p = hash.replace(/^#\/?/, "").split("/")[0];
    return { ask: "Back to the conversation", material: "Back to the material", materials: "Back to the material", investigation: "Back to the investigation",
      sources: "Back to sources", figure: "Back to the figure", world: "Back to the world", "": "Back to the world", data: "Back to the data" }[p] || "Back";
  }
  function backLink() {
    var o = origin();
    if (!o) return A.back("#/sources", T("All sources"));
    var a = A.back(o.hash, T(backLabel(o.hash)));
    a.addEventListener("click", function (ev) { ev.preventDefault(); history.back(); });
    return a;
  }

  function view(parts) {
    var e = get(parts[0]);
    if (!e) {
      document.title = T("No such source") + " · One Fire, Many Worlds";
      A.main.replaceChildren(h("div", { "class": "wrap ask-src" }, h("div", { "class": "ask-src-top" }, backLink()),
        A.intro(T("No such source"), T("The link points to a source that is not in this site's catalog.")),
        A.state("empty", T("No such source"), parts[0] ? parts[0] : null, h("a", { "class": "c-btn", href: "#/sources", text: T("See all sources") }))));
      return;
    }
    document.title = label(e) + " · One Fire, Many Worlds";
    A.main.replaceChildren(h("div", { "class": "wrap ask-src" },
      h("div", { "class": "ask-src-top" }, backLink()),
      A.intro(e.doc[L], T("The page of the report behind a finding, with the cited passage marked. Zoom in to read it.")),
      h("p", { "class": "ask-src-where" }, h("span", { "class": "ask-src-page", text: where(e) }), " ", tags(e)),
      sourcePage(e, false)));
  }

  A.route("source", "sources", view);
})();
