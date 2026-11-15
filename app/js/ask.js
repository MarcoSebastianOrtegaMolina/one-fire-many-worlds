/* Ask: a question box answered from the platform's own data, and a research report on the same topic.
   Saved answers work with no network. */
(function () {
  "use strict";
  var A = window.OFMW_APP, h = A.h, D = A.D, C = A.C, T = A.T;
  if (!D || !C) return;
  var L = window.OFMW_LANG === "es" ? "es" : "en", KEY = "ofmw-report";
  var state = { q: "", status: "idle", kind: "answer", answer: "", note: "", saved: false, model: "", when: "" };
  var pending = null;

  /* The last report survives a reload in this tab: writing it again costs time and money. */
  try {
    var kept = JSON.parse(sessionStorage.getItem(KEY) || "null");
    if (kept && kept.answer) state = { q: kept.q || "", status: "done", kind: "report", answer: kept.answer, note: "", saved: false, model: kept.model || "", when: kept.when || "" };
  } catch (e) { /* no storage: the report lasts until the page reloads */ }
  function keep() { try { sessionStorage.setItem(KEY, JSON.stringify({ q: state.q, answer: state.answer, model: state.model, when: state.when })); } catch (e) { /* ignore */ } }
  function forget() { try { sessionStorage.removeItem(KEY); } catch (e) { /* ignore */ } }

  function newRefs() { return { invs: [], pages: [], rows: [], figs: [] }; }
  function note(list, v) { if (list.indexOf(v) < 0) list.push(v); }

  /* Turn each citation into a link, as text only (nothing is inserted as HTML), and remember what was cited:
     [PSI-20] opens the record, [PSI-20 row 3] opens that row in Data, [bre-final-18] opens the page of the report. */
  /* What one reference points at. [PSI-20 test 327] is the platform's own test number, unique; [PSI-25 row 43] is a
     row of the source table, which two tables of one investigation can share, so it may match several tests. */
  function resolve(inner) {
    var m, list, ev;
    if ((m = /^(PSI-\d+) test (\d+)$/i.exec(inner))) {
      list = D.tests.filter(function (t) { return t.n === Number(m[2]) && t.inv === m[1]; });
      return list.length ? { kind: "test", inv: m[1], tests: list, href: "#/data/" + m[1] + "/n" + m[2], text: m[1] + " " + T("test") + " " + (list[0].id || "#" + m[2]) } : null;
    }
    if ((m = /^(PSI-\d+) (?:row|fila) (.+)$/i.exec(inner))) {
      list = D.tests.filter(function (t) { return t.inv === m[1] && String(t.row) === m[2]; });
      return list.length ? { kind: "test", inv: m[1], tests: list, href: "#/data/" + m[1] + "/" + encodeURIComponent(m[2]), text: inner } : null;
    }
    if (/^PSI-\d+$/.test(inner) && A.inv(inner)) return { kind: "inv", inv: inner, href: "#/investigation/" + inner, text: inner };
    ev = A.evidence ? A.evidence(inner) : null;
    return ev ? { kind: "page", ev: ev } : null;
  }
  function cited(text, refs) {
    var out = [], re = /\[([^\[\]\n]{3,80})\]/g, last = 0, m, got;
    while ((m = re.exec(text))) {
      got = m[1].trim().split(/\s*[,;]\s*/).map(resolve);      /* "[PSI-25, PSI-26]" is read as two references */
      if (m.index > last) out.push(text.slice(last, m.index));
      if (got.every(Boolean)) got.forEach(function (r, k) {
        if (k) out.push(" ");
        if (r.kind === "page") { out.push(A.sourceLink(r.ev, "[" + A.sourceLabel(r.ev) + "]")); note(refs.pages, r.ev.id); return; }
        out.push(h("a", { href: r.href, text: "[" + r.text + "]" })); note(refs.invs, r.inv);
        if (r.kind === "test" && r.tests.length <= 3) r.tests.forEach(function (t) { note(refs.rows, t.n); });   /* a row shared by many tests is a link, not table rows */
      });
      else out.push(m[0]);
      last = re.lastIndex;
    }
    if (last < text.length) out.push(text.slice(last));
    return out;
  }

  /* The model's text as page elements. A line that is only [[figure:ID]] becomes that figure, in place (at most
     three, and only ids in the catalog). In a report, "# " is the title, "## " a section and "- " a list item. */
  var HEADINGS = ["summary", "what the data says", "prevention, detection and suppression", "what has not been tested", "limits of this report"];
  function body(text, refs, report) {
    var nodes = [], para = [], items = [], title = "", heads = [];
    function endPara() { if (para.length) { nodes.push(h("p", null, cited(para.join(" "), refs))); para = []; } }
    function endList() { if (items.length) { nodes.push(h("ul", { "class": "replist" }, items.map(function (t) { return h("li", null, cited(t, refs)); }))); items = []; } }
    text.replace(/\*\*([^*\n]+)\*\*/g, "$1").replace(/[ \t]*\[\[figure:([\w-]+)\]\][ \t]*/g, "\n[[figure:$1]]\n").split("\n").forEach(function (raw) {
      var line = raw.trim(), m, f;
      if (!line) { endPara(); endList(); return; }
      if ((m = /^\[\[figure:([\w-]+)\]\]$/.exec(line))) {
        endPara(); endList();
        f = A.figure ? A.figure(m[1]) : null;
        if (f && refs.figs.indexOf(f.id) < 0 && refs.figs.length < 3) { refs.figs.push(f.id); nodes.push(A.figureBlock(f)); }
        return;
      }
      if (report && (m = /^#{1,3}\s+(.+)$/.exec(line))) {
        endPara(); endList();
        if (line.charAt(1) !== "#" && !title) title = m[1]; else { heads.push(h("h3", { text: m[1].replace(/:$/, "") })); nodes.push(heads[heads.length - 1]); }
        return;
      }
      if (report && (m = /^[-•]\s+(.+)$/.exec(line))) { endPara(); items.push(m[1]); return; }
      endList();
      para.push(line.replace(/^#{1,3}\s+/, ""));
      if (!report) endPara();                                  /* in a short answer every line is its own paragraph */
    });
    endPara(); endList();
    /* The model sometimes leaves one heading in English inside a report in another language: put it in the page's language. */
    var english = heads.filter(function (n) { return HEADINGS.indexOf(n.textContent.trim().toLowerCase()) >= 0; });
    if (english.length && english.length < heads.length) english.forEach(function (n) {
      var k = HEADINGS.indexOf(n.textContent.trim().toLowerCase());
      n.textContent = T(["Summary", "What the data says", "Prevention, detection and suppression", "What has not been tested", "Limits of this report"][k]);
    });
    return { title: title, nodes: nodes };
  }

  function send(kind, question) {
    var mine = typeof AbortController === "function" ? new AbortController() : {};
    if (pending && pending.abort) pending.abort();
    pending = mine;
    forget();                                                 /* a new request replaces the report kept for this tab */
    state = { q: question, status: "loading", kind: kind, answer: "", note: "", saved: false, model: "", when: "" };
    view();
    fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: question, kind: kind }), signal: mine.signal })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, body: j }; }); })
      .then(function (r) {
        if (mine !== pending) return;                         /* cancelled, or replaced by a newer request */
        pending = null;
        if (r.ok && r.body.answer) {
          state.status = "done"; state.answer = r.body.declined ? T(r.body.answer) : r.body.answer; state.model = r.body.model || ""; state.when = new Date().toISOString();
          /* a refusal or a one-line "not about this data" comes back as a plain answer, not as a report */
          state.kind = kind === "report" && r.body.kind === "report" && /^#\s/m.test(r.body.answer) ? "report" : "answer";
          state.note = r.body.truncated ? T(state.kind === "report" ? "The report was cut short." : "The answer was cut short.") : "";
          if (state.kind === "report") keep();
        } else { state.status = "error"; state.note = T((r.body && r.body.message) || "Live answers are not available right now."); }
        view();
      })
      .catch(function () {
        if (mine !== pending) return;
        pending = null; state.status = "error";
        state.note = T("Live answers need a connection to the server, and it did not respond. The saved answers below work offline."); view();
      });
  }
  function cancel() { var p = pending; pending = null; if (p && p.abort) p.abort(); state.status = "idle"; view(); }
  function showSaved(e) {
    var p = pending; pending = null; if (p && p.abort) p.abort();        /* a late live answer must not replace the saved one being read */
    forget();
    state = { q: e.q, status: "done", kind: "answer", answer: e.a, note: "", saved: true, model: "", when: "" }; view();
  }
  function closeReport() { forget(); state = { q: state.q, status: "idle", kind: "answer", answer: "", note: "", saved: false, model: "", when: "" }; view(); }

  /* ---------- report ---------- */
  function day(iso) {
    try { return new Date(iso).toLocaleDateString(L === "es" ? "es-MX" : "en-US", { year: "numeric", month: "long", day: "numeric" }); }
    catch (e) { return String(iso).slice(0, 10); }
  }
  function url(u) { return h("a", { "class": "url", href: u, target: "_blank", rel: "noopener", text: u }); }
  function testsTable(rows) {
    /* rows holds the platform's test numbers, unique, so the table can never show a different test from the one cited */
    var list = rows.map(function (n) { return D.tests.filter(function (t) { return t.n === n; })[0]; }).filter(Boolean);
    if (!list.length) return null;
    return [h("h3", { text: T("Tests cited") }),
      h("div", { "class": "table" }, h("table", null,
        h("thead", null, h("tr", null, [T("Test"), T("Fuel or material"), T("Oxygen"), T("Pressure"), T("Flow"), T("Result"), T("Source row")].map(function (t) { return h("th", { scope: "col", text: t }); }))),
        h("tbody", null, list.map(function (t) {
          return h("tr", null, h("th", { scope: "row" }, h("a", { href: "#/data/" + t.inv + "/n" + t.n, text: t.acr + " " + (t.id || "#" + t.n) })),
            h("td", { text: t.fuel }),
            h("td", { "class": "num", text: t.o2 === null ? "" : t.o2 + " %" + (t.ref === "burner" ? " " + T("(burner gas)") : "") }), h("td", { "class": "num", text: t.p === null ? "" : t.p + " psi" }),
            h("td", { "class": "num", text: t.flow === null ? "" : t.flow + " cm/s" }), h("td", { text: t.res.length > 170 ? t.res.slice(0, 170) + " ..." : t.res }),
            h("td", { text: String(t.src).replace(/^PSI-\d+_Experimental table_/, "").replace(/\.csv$/, "") + " · " + t.row }));
        }))))];
  }
  function sources(refs) {
    var items = [];
    refs.invs.forEach(function (id) {
      var i = A.inv(id);
      if (i) items.push(h("li", null, h("strong", { text: "[" + id + "] " }), (i.cite || i.acr + ". " + i.title + ".") + " ", url(i.url)));
    });
    refs.pages.forEach(function (id) {
      var e = A.evidence(id);
      if (e) items.push(h("li", null, h("a", { href: "#/source/" + e.id, text: A.sourceLabel(e) }), ". ", url(e.record)));
    });
    refs.figs.forEach(function (id) {
      var f = A.figure(id);
      if (f) items.push(h("li", null, h("a", { href: "#/figure/" + f.id, text: A.figureLabel(f) }), ". ", url(f.record)));
    });
    return items.length ? [h("h3", { text: T("Sources") }), h("ol", { "class": "repsrc" }, items)] : null;
  }
  function reportView() {
    var refs = newRefs(), b = body(state.answer, refs, true);
    document.title = (b.title || state.q) + " · One Fire, Many Worlds";      /* the browser uses it as the PDF's file name */
    return [h("article", { "class": "report" },
      h("header", { "class": "rephead" },
        h("p", { "class": "kicker", text: T("Research report") + " · One Fire, Many Worlds" }),
        h("h2", { "class": "reptitle", text: b.title || state.q }),
        h("p", { "class": "repmeta" }, h("strong", { text: T("Topic asked: ") }), state.q),
        h("p", { "class": "repmeta", text: T("Written by AI") + (state.model ? " (" + state.model + ")" : "") + (state.when ? T(" on ") + day(state.when) : "") +
          T(", from the data of One Fire, Many Worlds: NASA's PSI repository, downloaded November 13, 2026. Team Hamác, 2026 NASA Space Apps Challenge.") })),
      b.nodes, testsTable(refs.rows), sources(refs),
      h("p", { "class": "note", text: (refs.figs.length ? T("The AI picked the figures by their captions; it has not seen the images. ") : "") +
        T("The ranking of investigations and the list of experiments still to be done are the team's interpretation, not NASA's. A student project, not affiliated with or endorsed by NASA. Check the sources before relying on this report.") + (state.note ? " " + state.note : "") })),
    h("div", { "class": "repactions" },
      h("button", { type: "button", "class": "action", onclick: function () { window.print(); } }, T("Print or save as PDF")),
      h("button", { type: "button", "class": "action quiet", onclick: closeReport }, T("Close the report")))];
  }

  function view() {
    document.title = T("Ask · One Fire, Many Worlds");
    var box = h("textarea", { id: "ask-q", rows: "3", maxlength: "500", placeholder: T("For example: what is known about smoke detection for a Moon base?") });
    box.value = state.q;
    var busy = state.status === "loading", isReport = state.kind === "report";
    function go(kind) { var q = box.value.trim(); if (q && !busy) send(kind, q); else if (!q) box.focus(); }
    var form = h("form", { "class": "askform", onsubmit: function (ev) { ev.preventDefault(); go("answer"); } },
      h("label", { "for": "ask-q" }, h("span", { text: T("Your question") }), box),
      h("div", { "class": "askbtns" },
        h("button", { type: "submit", "class": "action", disabled: busy ? "" : null }, busy && !isReport ? T("Reading the data ...") : T("Ask")),
        h("button", { type: "button", "class": "action quiet", disabled: busy ? "" : null, onclick: function () { go("report"); } }, busy && isReport ? T("Writing the report ...") : T("Create report"))));
    var result = null, report = null, refs = newRefs();
    if (busy) result = h("div", { "class": "answer", role: "status" },
      h("p", { "class": "wait", text: isReport ? T("Writing the report from the investigations. This can take up to a minute.") : T("Reading the investigations and writing an answer. This can take a few seconds.") }),
      h("p", { "class": "more" }, h("button", { type: "button", "class": "action small quiet", onclick: cancel }, T("Cancel"))));
    if (state.status === "done" && isReport) report = reportView();
    if (state.status === "done" && !isReport) {
      var b = body(state.answer, refs, false);
      result = h("div", { "class": "answer", role: "status" },
        h("h2", { "class": "tight", text: state.q }), b.nodes,
        A.sourceStrip ? A.sourceStrip(refs.pages) : null,
        h("p", { "class": "note", text: (state.saved ? T("Saved answer, written with AI and checked against the data. ") : T("Answer written live by AI from this site's data. Check the cited records before relying on it. ")) +
          (refs.figs.length && !state.saved ? T("The AI picked the figures by their captions; it has not seen the images. ") : "") + state.note }),
        h("p", { "class": "more" }, h("button", { type: "button", "class": "action small quiet", onclick: function () { send("report", state.q); } }, T("Turn this answer into a report"))));
    }
    if (state.status === "error") result = h("div", { "class": "answer problem", role: "alert" },
      h("h2", { "class": "tight", text: isReport ? T("The report was not written") : T("No live answer") }), h("p", { text: state.note }), h("p", { text: T("Pick one of the saved questions below, or try again.") }));

    A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "sheet page" },
      h("h1", { text: T("Ask the data") }),
      h("p", { "class": "intro", text: T("Ask in your own words. The answer is written by AI from the investigations, materials and worlds on this site, cites the PSI record behind each statement, and says so when something is not in the data.") }),
      h("p", { "class": "intro", text: T("Create report writes a longer, printable report on the same topic, with figures, the tests it cites and its sources.") }),
      h("div", { "class": "askcol" }, form, result),
      report,
      h("h2", { text: T("Saved questions") }),
      h("p", { text: T("These work without a connection.") }),
      h("ul", { "class": "saved" }, C.examples.map(function (e) {
        return h("li", null, h("button", { type: "button", onclick: function () { showSaved(e); window.scrollTo(0, 0); } }, e.q));
      })))));
  }

  A.section({ id: "ask", label: T("Ask"), href: "#/ask" }, view);
})();
