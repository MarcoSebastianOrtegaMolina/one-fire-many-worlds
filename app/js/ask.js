/* Ask: a question box answered from the platform's own data. Saved answers work with no network. */
(function () {
  "use strict";
  var A = window.OFMW_APP, h = A.h, D = A.D, C = A.C, T = A.T;
  if (!D || !C) return;
  var state = { q: "", status: "idle", answer: "", note: "", saved: false };

  /* Turn each citation into a link, as text only (nothing is inserted as HTML):
     [PSI-20] opens the record, [PSI-20 row 3] opens that row in Data, [bre-final-18] opens the page of the report. */
  function cited(text, found) {
    var out = [], re = /\[([^\]\n]{3,60})\]/g, last = 0, m, inner, row, ev;
    while ((m = re.exec(text))) {
      inner = m[1].trim();
      row = /^(PSI-\d+) row (\S+)$/i.exec(inner);
      ev = A.evidence ? A.evidence(inner) : null;
      if (m.index > last) out.push(text.slice(last, m.index));
      if (row && A.inv(row[1])) out.push(h("a", { href: "#/data/" + row[1] + "/" + encodeURIComponent(row[2]), text: m[0] }));
      else if (/^PSI-\d+$/.test(inner) && A.inv(inner)) out.push(h("a", { href: "#/investigation/" + inner, text: m[0] }));
      else if (ev) { out.push(A.sourceLink(ev, "[" + A.sourceLabel(ev) + "]")); if (found && found.indexOf(ev.id) < 0) found.push(ev.id); }
      else out.push(m[0]);
      last = re.lastIndex;
    }
    if (last < text.length) out.push(text.slice(last));
    return out;
  }

  function ask(question) {
    state.q = question; state.status = "loading"; state.answer = ""; state.note = ""; state.saved = false; view();
    fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: question }) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, status: r.status, body: j }; }); })
      .then(function (r) {
        if (r.ok && r.body.answer) { state.status = "done"; state.answer = r.body.answer; state.note = r.body.truncated ? T("The answer was cut short.") : ""; }
        else { state.status = "error"; state.note = T((r.body && r.body.message) || "Live answers are not available right now."); }
        view();
      })
      .catch(function () {
        state.status = "error"; state.note = T("Live answers need a connection to the server, and it did not respond. The saved answers below work offline."); view();
      });
  }
  function showSaved(e) { state.q = e.q; state.status = "done"; state.answer = e.a; state.note = ""; state.saved = true; view(); }

  function view() {
    document.title = T("Ask · One Fire, Many Worlds");
    var box = h("textarea", { id: "ask-q", rows: "3", maxlength: "500", placeholder: T("For example: what is known about smoke detection for a Moon base?") });
    box.value = state.q;
    var busy = state.status === "loading";
    var form = h("form", { "class": "askform", onsubmit: function (ev) { ev.preventDefault(); var q = box.value.trim(); if (q && !busy) ask(q); } },
      h("label", { "for": "ask-q" }, h("span", { text: T("Your question") }), box),
      h("button", { type: "submit", "class": "action", disabled: busy ? "" : null }, busy ? T("Reading the data ...") : T("Ask")));
    var result = null, found = [];
    if (state.status === "loading") result = h("div", { "class": "answer", role: "status" }, h("p", { "class": "wait", text: T("Reading the investigations and writing an answer. This can take a few seconds.") }));
    if (state.status === "done") {
      var paragraphs = state.answer.split(/\n{2,}/).map(function (p) { return h("p", null, cited(p, found)); });
      result = h("div", { "class": "answer", role: "status" },
        h("h2", { "class": "tight", text: state.q }), paragraphs,
        A.sourceStrip ? A.sourceStrip(found) : null,
        h("p", { "class": "note", text: (state.saved ? T("Saved answer, written with AI and checked against the data. ") : T("Answer written live by AI from this site's data. Check the cited records before relying on it. ")) + state.note }));
    }
    if (state.status === "error") result = h("div", { "class": "answer problem", role: "alert" },
      h("h2", { "class": "tight", text: T("No live answer") }), h("p", { text: state.note }), h("p", { text: T("Pick one of the saved questions below, or try again.") }));

    A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "sheet page" },
      h("h1", { text: T("Ask the data") }),
      h("p", { "class": "intro", text: T("Ask in your own words. The answer is written by AI from the investigations, materials and worlds on this site, cites the PSI record behind each statement, and says so when something is not in the data.") }),
      h("div", { "class": "askcol" }, form, result),
      h("h2", { text: T("Saved questions") }),
      h("p", { text: T("These work without a connection.") }),
      h("ul", { "class": "saved" }, C.examples.map(function (e) {
        return h("li", null, h("button", { type: "button", onclick: function () { showSaved(e); window.scrollTo(0, 0); } }, e.q));
      })))));
  }

  A.section({ id: "ask", label: T("Ask"), href: "#/ask" }, view);
})();
