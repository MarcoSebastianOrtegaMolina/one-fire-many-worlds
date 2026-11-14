/* Ask: a question box answered from the platform's own data. Saved answers work with no network. */
(function () {
  "use strict";
  var A = window.OFMW_APP, h = A.h, D = A.D, C = A.C;
  if (!D || !C) return;
  var state = { q: "", status: "idle", answer: "", note: "", saved: false };

  /* Turn [PSI-20] and [PSI-20 row 3] into links to the record. Text only: nothing is inserted as HTML. */
  function cited(text) {
    var out = [], re = /\[(PSI-\d+)([^\]]*)\]/g, last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) out.push(text.slice(last, m.index));
      out.push(A.inv(m[1]) ? h("a", { href: "#/investigation/" + m[1], text: "[" + m[1] + m[2] + "]" }) : m[0]);
      last = re.lastIndex;
    }
    if (last < text.length) out.push(text.slice(last));
    return out;
  }
  function paragraphs(text) { return text.split(/\n{2,}/).map(function (p) { return h("p", null, cited(p)); }); }

  function ask(question) {
    state.q = question; state.status = "loading"; state.answer = ""; state.note = ""; state.saved = false; view();
    fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: question }) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, status: r.status, body: j }; }); })
      .then(function (r) {
        if (r.ok && r.body.answer) { state.status = "done"; state.answer = r.body.answer; state.note = r.body.truncated ? "The answer was cut short." : ""; }
        else { state.status = "error"; state.note = (r.body && r.body.message) || "Live answers are not available right now."; }
        view();
      })
      .catch(function () {
        state.status = "error"; state.note = "Live answers need a connection to the server, and it did not respond. The saved answers below work offline."; view();
      });
  }
  function showSaved(e) { state.q = e.q; state.status = "done"; state.answer = e.a; state.note = ""; state.saved = true; view(); }

  function view() {
    document.title = "Ask · One Fire, Many Worlds";
    var box = h("textarea", { id: "ask-q", rows: "3", maxlength: "500", placeholder: "For example: what is known about smoke detection for a Moon base?" });
    box.value = state.q;
    var busy = state.status === "loading";
    var form = h("form", { "class": "askform", onsubmit: function (ev) { ev.preventDefault(); var q = box.value.trim(); if (q && !busy) ask(q); } },
      h("label", { "for": "ask-q" }, h("span", { text: "Your question" }), box),
      h("button", { type: "submit", "class": "action", disabled: busy ? "" : null }, busy ? "Reading the data ..." : "Ask"));
    var result = null;
    if (state.status === "loading") result = h("div", { "class": "answer", role: "status" }, h("p", { "class": "wait", text: "Reading the investigations and writing an answer. This can take a few seconds." }));
    if (state.status === "done") result = h("div", { "class": "answer", role: "status" },
      h("h2", { "class": "tight", text: state.q }), paragraphs(state.answer),
      h("p", { "class": "note", text: (state.saved ? "Saved answer, written with AI and checked against the data. " : "Answer written live by AI from this site's data. Check the cited records before relying on it. ") + state.note }));
    if (state.status === "error") result = h("div", { "class": "answer problem", role: "alert" },
      h("h2", { "class": "tight", text: "No live answer" }), h("p", { text: state.note }), h("p", { text: "Pick one of the saved questions below, or try again." }));

    A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "sheet page" },
      h("h1", { text: "Ask the data" }),
      h("p", { "class": "intro", text: "Ask in your own words. The answer is written by AI from the investigations, materials and worlds on this site, cites the PSI record behind each statement, and says so when something is not in the data." }),
      h("div", { "class": "lead asklead" }, h("div", null, form, result),
        h("div", null, h("h2", { "class": "tight", text: "Saved questions" }),
          h("p", { "class": "note", text: "These work without a connection." }),
          h("ul", { "class": "saved" }, C.examples.map(function (e) {
            return h("li", null, h("button", { type: "button", onclick: function () { showSaved(e); } }, e.q));
          })))))));
    if (state.status !== "idle") { var a = document.querySelector(".answer"); if (a && a.scrollIntoView && window.innerWidth < 700) a.scrollIntoView({ block: "nearest" }); }
  }

  A.section({ id: "ask", label: "Ask", href: "#/ask" }, view);
})();
