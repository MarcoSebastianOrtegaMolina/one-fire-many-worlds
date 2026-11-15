/* Ask: a question box answered from the platform's own data, kept as a conversation, and a research report on
   the same topic presented as a document (#/ask/report). Saved answers work with no network.
   The API (/api/ask), the citation format and the limits are the same as before; only the interface changed. */
(function () {
  "use strict";
  var A = window.OFMW_APP, h = A.h, D = A.D, C = A.C, T = A.T;
  if (!D || !C) return;
  var L = window.OFMW_LANG === "es" ? "es" : "en";

  A.es({
    "Ask the data": "Pregúntale a los datos",
    "Ask in your own words. An AI answers from the investigations, materials and worlds on this site, cites the record or page behind each statement, and says when something is not in the data.":
      "Pregunta con tus palabras. Una IA responde con las investigaciones, los materiales y los mundos de este sitio, cita la ficha o la página detrás de cada afirmación y avisa cuando algo no está en los datos.",
    "How it answers": "Cómo responde",
    "The answer is written by AI from the investigations, materials and worlds on this site, cites the PSI record behind each statement, and says so when something is not in the data.":
      "La respuesta la escribe una IA con las investigaciones, los materiales y los mundos de este sitio, cita la ficha de PSI detrás de cada afirmación y lo dice cuando algo no está en los datos.",
    "Each small number in an answer is a source. It opens the record, the row of the table or the page of the report it comes from, and the list under the answer says what each one supports.":
      "Cada número chico de una respuesta es una fuente. Abre la ficha, el renglón de la tabla o la página del reporte de donde sale, y la lista debajo de la respuesta dice qué sostiene cada una.",
    "Create report writes a longer, printable report on the same topic, with figures, the tests it cites and its sources.":
      "Crear informe escribe un informe más largo e imprimible sobre el mismo tema, con figuras, las pruebas que cita y sus fuentes.",
    "The saved questions were answered beforehand and checked against the data. They work without a connection. Live answers have a daily limit.":
      "Las preguntas guardadas se respondieron antes y se revisaron contra los datos. Funcionan sin conexión. Las respuestas en vivo tienen un tope diario.",
    "Your question": "Tu pregunta",
    "For example: what is known about smoke detection for a Moon base?": "Por ejemplo: ¿qué se sabe de la detección de humo para una base lunar?",
    "Ask another question": "Haz otra pregunta",
    "Enter sends. Shift+Enter starts a new line.": "Enter envía. Mayús+Enter hace un salto de línea.",
    "Ask": "Preguntar",
    "Stop": "Detener",
    "Create report": "Crear informe",
    "Writing a report": "Escribiendo un informe",
    "Write a question first.": "Escribe primero una pregunta.",
    "An answer is on its way. Stop it to ask something else.": "Viene una respuesta en camino. Detenla para preguntar otra cosa.",
    "Answering. Time so far: ": "Respondiendo. Tiempo hasta ahora: ",
    "Start with a saved question": "Empieza con una pregunta guardada",
    "Saved questions": "Preguntas guardadas",
    "Works offline": "Funciona sin conexión",
    "Prevent": "Prevenir", "Detect": "Detectar", "Suppress": "Apagar", "Worlds": "Mundos",
    "Conversation": "Conversación",
    "New conversation": "Nueva conversación",
    "Clear this question and its answer?": "¿Borrar esta pregunta y su respuesta?",
    "Clear these questions and answers?": "¿Borrar estas preguntas y respuestas?",
    "Clear": "Borrar",
    "Keep them": "Conservarlas",
    "You asked": "Preguntaste",
    "Reading the investigations": "Leyendo las investigaciones",
    "Writing an answer from the data. This can take a few seconds. Time so far: ": "Escribiendo una respuesta con los datos. Puede tardar unos segundos. Tiempo hasta ahora: ",
    "No connection": "Sin conexión",
    "Live answers need a connection to the server, and it did not respond. The saved questions still work without one.":
      "Las respuestas en vivo necesitan conexión con el servidor, y no respondió. Las preguntas guardadas siguen funcionando sin ella.",
    "No live answer": "Sin respuesta en vivo",
    "Live answers are paused": "Las respuestas en vivo están en pausa",
    "Try again": "Intentar de nuevo",
    "Ask again": "Preguntar de nuevo",
    "You stopped this answer.": "Detuviste esta respuesta.",
    "This answer was interrupted when the page reloaded.": "Esta respuesta se interrumpió al recargar la página.",
    "Sources cited in this answer": "Fuentes citadas en esta respuesta",
    "Investigation record": "Ficha de la investigación",
    "Row of the experimental table": "Renglón de la tabla experimental",
    "PSI record": "Ficha en PSI",
    "Copy answer": "Copiar respuesta",
    "Copied": "Copiada",
    "Copy failed. Select the text to copy it.": "No se pudo copiar. Selecciona el texto para copiarlo.",
    "Turn into report": "Convertir en informe",
    "Saved answer, written with AI and checked against the data. ": "Respuesta guardada, escrita con IA y revisada contra los datos. ",
    "Answer written live by AI from this site's data. Check the cited records before relying on it. ": "Respuesta escrita en vivo por una IA con los datos de este sitio. Revisa las fichas citadas antes de apoyarte en ella. ",
    "The AI picked the figures by their captions; it has not seen the images. ": "La IA eligió las figuras por sus pies; no ha visto las imágenes. ",
    "Source ": "Fuente ",
    "Cited page": "Página citada",
    "Close": "Cerrar",
    "Open full page": "Abrir la página completa",
    "Answer ready.": "Respuesta lista.",
    "Cut short": "Cortada",
    "Swipe sideways to see every column": "Desliza a los lados para ver todas las columnas",
    "The answer stops before its end. Ask again, or ask a narrower question.": "La respuesta se detiene antes de terminar. Pregunta de nuevo, o haz una pregunta más acotada.",
    "The report stops before its end. Try again, or ask about a narrower topic.": "El informe se detiene antes de terminar. Intenta de nuevo, o pide un tema más acotado.",
    "No answer from the data": "Sin respuesta con los datos",
    "This box answers from the investigations, materials and worlds on this site. Ask about one of them, or about preventing, detecting or putting out a fire, or start with a saved question:": "Esta caja responde con las investigaciones, los materiales y los mundos de este sitio. Pregunta por uno de ellos, o por prevenir, detectar o apagar un fuego, o empieza con una pregunta guardada:",
    "row": "fila",
    "Download these tests (CSV)": "Descargar estas pruebas (CSV)",
    "The download did not work. Try again.": "La descarga no funcionó. Intenta de nuevo.",
    "Writing the answer": "Escribiendo la respuesta",
    "Who ran the investigations cited here": "Quién hizo las investigaciones citadas",
    "Reports take up to a minute. Time so far: ": "Los informes tardan hasta un minuto. Tiempo hasta ahora: ",
    "Answer stopped.": "Respuesta detenida.",
    /* report */
    "Research report": "Informe de investigación",
    "Report": "Informe",
    "Writing the report": "Escribiendo el informe",
    "Reports are written in one piece and take up to a minute; the text appears when it is complete. Time so far: ": "Los informes se escriben de una sola vez y tardan hasta un minuto; el texto aparece cuando está completo. Tiempo hasta ahora: ",
    "The report was not written": "El informe no se escribió",
    "You stopped the report.": "Detuviste el informe.",
    "No report yet": "Todavía no hay informe",
    "Write a question in the conversation and choose Create report.": "Escribe una pregunta en la conversación y elige Crear informe.",
    "Go to the conversation": "Ir a la conversación",
    "Back to the conversation": "Volver a la conversación",
    "Print or save as PDF": "Imprimir o guardar como PDF",
    "Open the report": "Abrir el informe",
    "Report ready: ": "Informe listo: ",
    "A report is being written: ": "Se está escribiendo un informe: ",
    "See its progress": "Ver su avance",
    "The last report did not finish: ": "El último informe no terminó: ",
    "Contents": "Contenido",
    "Topic asked: ": "Tema preguntado: ",
    "Written by AI": "Escrito por IA",
    " on ": " el ",
    ", from the data of One Fire, Many Worlds: NASA's PSI repository, downloaded November 13, 2026. Team Hamác, 2026 NASA Space Apps Challenge.":
      ", con los datos de One Fire, Many Worlds: el repositorio PSI de NASA, descargado el 13 de noviembre de 2026. Equipo Hamác, NASA Space Apps Challenge 2026.",
    "Tests cited": "Pruebas citadas",
    "Tests cited in this report": "Pruebas citadas en este informe",
    "Tests cited in this answer": "Pruebas citadas en esta respuesta",
    "Sources": "Fuentes",
    "Figures": "Figuras",
    "Notes": "Notas",
    "The ranking of investigations and the list of experiments still to be done are the team's interpretation, not NASA's. A student project, not affiliated with or endorsed by NASA. Check the sources before relying on this report.":
      "El orden de las investigaciones y la lista de experimentos por hacer son la interpretación del equipo, no de NASA. Un proyecto estudiantil, sin afiliación ni respaldo de NASA. Revisa las fuentes antes de apoyarte en este informe.",
    "The report was cut short.": "El informe quedó cortado.",
    "The answer was cut short.": "La respuesta quedó cortada.",
    "Live answers are not available right now.": "Las respuestas en vivo no están disponibles ahora.",
    "Summary": "Resumen", "What the data says": "Qué dicen los datos", "Prevention, detection and suppression": "Prevención, detección y supresión",
    "What has not been tested": "Qué no se ha probado", "Limits of this report": "Límites de este informe",
    "test": "prueba"
  });

  /* ---------- state, kept for this tab ---------- */
  var KEY_TURNS = "ofmw-ask-turns", KEY_REPORT = "ofmw-report", KEY_SCROLL = "ofmw-ask-scroll";
  function load(k) { try { return JSON.parse(sessionStorage.getItem(k) || "null"); } catch (e) { return null; } }
  function store(k, v) { try { if (v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* no storage: it lasts until reload */ } }
  var turns = (load(KEY_TURNS) || []).filter(function (t) { return t && t.q; }).map(function (t) {
    if (t.status === "loading" || t.status === "streaming") { t.status = "cancelled"; t.note = "This answer was interrupted when the page reloaded."; }
    return t;
  });
  /* The last report survives a reload in this tab: writing it again costs time and money (same key as before). */
  var report = (function () {
    var k = load(KEY_REPORT);
    return k && k.answer ? { q: k.q || "", status: "done", answer: k.answer, model: k.model || "", when: k.when || "", note: k.note || "" } : null;
  })();
  var pendingA = null, pendingR = null, draft = "", seq = Date.now(), confirmOpen = false, panelId = null, panelTrigger = null;
  var savedY = Number(load(KEY_SCROLL)) || 0, lastHash = location.hash;
  function saveTurns() { store(KEY_TURNS, turns.slice(-30)); }
  function saveReport() { if (report && report.status === "done") store(KEY_REPORT, { q: report.q, answer: report.answer, model: report.model, when: report.when, note: report.note }); }
  function onAsk() { return /^#\/ask(\/|$)/.test(location.hash) && !/^#\/ask\/report/.test(location.hash); }
  function onReport() { return /^#\/ask\/report/.test(location.hash); }

  window.addEventListener("scroll", function () { if (onAsk()) { savedY = window.scrollY; store(KEY_SCROLL, savedY); } }, { passive: true });
  window.addEventListener("hashchange", function (ev) { lastHash = "#" + (String(ev.oldURL || "").split("#")[1] || "/"); });
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- citations: short numbers per answer ---------- */
  function newRefs() { return { invs: [], pages: [], rows: [], figs: [], list: [] }; }
  function note(list, v) { if (list.indexOf(v) < 0) list.push(v); }
  /* What one reference points at. [PSI-20 test 327] is the platform's own test number, unique; [PSI-25 row 43] is a
     row of the source table, which two tables of one investigation can share, so it may match several tests. */
  function resolve(inner) {
    var m, list, ev;
    if ((m = /^(PSI-\d+) test (\d+)$/i.exec(inner))) {
      list = D.tests.filter(function (t) { return t.n === Number(m[2]) && t.inv === m[1]; });
      return list.length ? { kind: "test", key: "t" + m[1] + m[2], inv: m[1], tests: list, href: "#/data/" + m[1] + "/n" + m[2], text: m[1] + " " + T("test") + " " + (list[0].id || "#" + m[2]),
        parts: [m[1], T("test"), list[0].id || "#" + m[2]] } : null;
    }
    if ((m = /^(PSI-\d+) (?:row|fila) (.+)$/i.exec(inner))) {
      list = D.tests.filter(function (t) { return t.inv === m[1] && String(t.row) === m[2]; });
      return list.length ? { kind: "test", key: "r" + inner, inv: m[1], tests: list, href: "#/data/" + m[1] + "/" + encodeURIComponent(m[2]), text: inner, parts: [m[1], T("row"), m[2]] } : null;
    }
    if (/^PSI-\d+$/.test(inner) && A.inv(inner)) return { kind: "inv", key: "i" + inner, inv: inner, href: "#/investigation/" + inner, text: inner };
    ev = A.evidence ? A.evidence(inner) : null;
    return ev ? { kind: "page", key: "p" + ev.id, ev: ev, href: "#/source/" + ev.id, text: A.sourceLabel(ev) } : null;
  }
  function number(refs, r) {
    var got = refs.list.filter(function (x) { return x.key === r.key; })[0];
    if (!got) { got = r; r.num = refs.list.length + 1; refs.list.push(r); }
    return got.num;
  }
  function cited(text, refs) {
    var out = [], re = /\[([^\[\]\n]{3,80})\]/g, last = 0, m, got;
    while ((m = re.exec(text))) {
      got = m[1].trim().split(/\s*[,;]\s*/).map(resolve);      /* "[PSI-25, PSI-26]" is read as two references */
      if (m.index > last) out.push(text.slice(last, m.index));
      if (got.every(Boolean)) {
        var refsHere = h("span", { "class": "ask-refs" });
        got.forEach(function (r, k) {
          var n = number(refs, r);
          if (r.kind === "page") note(refs.pages, r.ev.id); else note(refs.invs, r.inv);
          if (r.kind === "test" && r.tests.length <= 3) r.tests.forEach(function (t) { note(refs.rows, t.n); });   /* a row shared by many tests is a link, not table rows */
          if (k) refsHere.appendChild(document.createTextNode(", "));
          refsHere.appendChild(h("a", { "class": "ask-ref", href: r.href, "data-src": r.kind === "page" ? r.ev.id : null,
            "aria-label": T("Source ") + n + ": " + r.text, title: r.text, text: String(n) }));
        });
        out.push(refsHere);
      } else out.push(m[0]);
      last = re.lastIndex;
    }
    if (last < text.length) out.push(text.slice(last));
    return out;
  }

  /* The model's text as page elements. A line that is only [[figure:ID]] becomes that figure, in place (at most
     three, and only ids in the catalog). In a report, "# " is the title, "## " a section, "### " a subsection, "- " an item. */
  var HEADINGS = ["summary", "what the data says", "prevention, detection and suppression", "what has not been tested", "limits of this report"];
  function body(text, refs, report, num, cache) {
    var nodes = [], para = [], items = [], title = "", heads = [];
    function endPara() { if (para.length) { nodes.push(h("p", null, cited(para.join(" "), refs))); para = []; } }
    function endList() { if (items.length) { nodes.push(h("ul", { "class": "ask-list" }, items.map(function (t) { return h("li", null, cited(t, refs)); }))); items = []; } }
    text.replace(/\*\*([^*\n]+)\*\*/g, "$1").replace(/[ \t]*\[\[figure:([\w-]+)\]\][ \t]*/g, "\n[[figure:$1]]\n").split("\n").forEach(function (raw) {
      var line = raw.trim(), m, f;
      if (!line) { endPara(); endList(); return; }
      if ((m = /^\[\[figure:([\w-]+)\]\]$/.exec(line))) {
        endPara(); endList();
        f = A.figure ? A.figure(m[1]) : null;
        if (f && refs.figs.indexOf(f.id) < 0 && refs.figs.length < 3) {
          refs.figs.push(f.id);
          var fb = cache && cache[f.id] ? cache[f.id] : A.figureBlock(f, num.figure());   /* while streaming, a figure is drawn once */
          if (cache) { if (cache[f.id]) num.figure(); cache[f.id] = fb; }
          nodes.push(fb);
        }
        return;
      }
      if (report && (m = /^(#{1,3})\s+(.+)$/.exec(line))) {
        endPara(); endList();
        if (m[1].length === 1 && !title) title = m[2];
        else { var hd = h(m[1].length === 3 ? "h3" : "h2", { "class": "ask-doc-h", text: m[2].replace(/:$/, "") }); heads.push(hd); nodes.push(hd); }
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
    return { title: title, nodes: nodes, heads: heads };
  }

  /* Tables and figures come from shared helpers with the old class names; give them the new academic layout
     (c-fig, c-table) so this view does not depend on the old stylesheet. */
  function modern(root) {
    [["apa", "c-fig"], ["apanum", "c-fig-num"], ["apatitle", "c-fig-title"], ["apanote", "c-fig-note"], ["figimg", "ask-figimg"]].forEach(function (p) {
      Array.prototype.forEach.call(root.querySelectorAll("." + p[0]), function (n) { n.classList.remove(p[0]); n.classList.add(p[1]); });
    });
    Array.prototype.forEach.call(root.querySelectorAll(".c-fig > div.table"), function (n) { n.classList.remove("table"); n.classList.add("c-table"); });
    Array.prototype.forEach.call(root.querySelectorAll(".c-fig.fig"), function (n) { n.classList.remove("fig"); });
    return root;
  }
  /* The cited tests as a CSV with the same columns and format as the full table of Data (data/tests.csv): the rows
     are cut from that file by the platform's test number (t.n is its row, counting from 0 after the header).
     If the file cannot be read, the same columns are written from the data already loaded. UTF-8 with BOM. */
  var COLS = ["investigation", "acronym", "test_id", "date", "fuel_type", "fuel_or_material", "material_family", "shape_and_size", "oxygen_pct_min", "oxygen_pct_max",
    "oxygen_reference", "pressure_psia", "flow_cm_s", "flow_direction", "diluent_or_suppressant", "outcome_class", "result", "source_table", "source_row"];
  function cell(v) { v = v === null || v === undefined ? "" : String(v); return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  function fromData(list) {
    return [COLS.join(",")].concat(list.map(function (t) {
      return [t.inv, t.acr, t.id, t.date, t.type, t.fuel, t.family, t.shape, t.o2min, t.o2max, t.ref, t.pmin, t.flow, t.dir, t.dil, t.out, t.res, t.src, t.row].map(cell).join(",");
    })).join("\n") + "\n";
  }
  function slug(text) {
    return String(text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/, "");
  }
  function csvButton(rows, q, kind) {
    var list = citedTests(rows);
    if (!list.length) return null;
    var msg = h("span", { "class": "ask-copy-msg", "aria-live": "polite" });
    var btn = h("button", { type: "button", "class": "c-btn ask-csv", onclick: function () {
      msg.textContent = "";
      var name = "one-fire-many-worlds-tests-cited-in-" + (kind === "report" ? "report" : "answer") + (slug(q) ? "-" + slug(q) : "") + ".csv";
      function save(text) {
        var blob = new Blob(["\ufeff" + text], { type: "text/csv;charset=utf-8" }), href = URL.createObjectURL(blob);
        var a = h("a", { href: href, download: name, style: "display:none" });
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(href); }, 4000);
      }
      fetch("data/tests.csv").then(function (r) { if (!r.ok) throw new Error("csv"); return r.text(); }).then(function (text) {
        var lines = text.replace(/^\ufeff/, "").replace(/\r\n/g, "\n").split("\n");
        if (lines[lines.length - 1] === "") lines.pop();
        if (lines.length !== D.tests.length + 1) throw new Error("rows");   /* not the table this page knows: write it from the data */
        save([lines[0]].concat(list.map(function (t) { return lines[t.n + 1]; })).join("\n") + "\n");
      }).catch(function () {
        try { save(fromData(list)); } catch (e) { msg.textContent = T("The download did not work. Try again."); }
      });
    } }, T("Download these tests (CSV)"));
    return [btn, msg];
  }
  function citedTests(rows) {
    return rows.map(function (n) { return D.tests.filter(function (t) { return t.n === n; })[0]; }).filter(Boolean);
  }
  /* A table wider than its frame scrolls inside it; a line above says so, only while it overflows. */
  function swipeHints(root) {
    Array.prototype.forEach.call((root || document).querySelectorAll(".ask-view .c-table, .ask-turn .c-table"), function (box) {
      var hint = box.previousElementSibling;
      if (!hint || !hint.classList.contains("ask-swipe")) { hint = h("p", { "class": "ask-swipe", hidden: "" }, T("Swipe sideways to see every column")); box.before(hint); }
      var over = box.scrollWidth > box.clientWidth + 1;
      if (over) hint.removeAttribute("hidden"); else hint.setAttribute("hidden", "");
    });
  }
  function hintsSoon() { (window.requestAnimationFrame || setTimeout)(function () { swipeHints(A.main); }); }
  window.addEventListener("resize", function () { if (onAsk() || onReport()) hintsSoon(); });
  function testsTable(rows, num, isReport) {
    /* rows holds the platform's test numbers, unique, so the table can never show a different test from the one cited */
    var list = rows.map(function (n) { return D.tests.filter(function (t) { return t.n === n; })[0]; }).filter(Boolean);
    if (!list.length || !A.testsTable) return null;
    return A.testsTable(list, num.table(), isReport ? T("Tests cited in this report") : T("Tests cited in this answer"));
  }

  /* ---------- talking to the API ---------- */
  function outcome(r) {
    if (r.ok && r.body.answer) return null;
    var msg = r.body && r.body.message;
    if (r.status === 429) return { type: "limit", message: T(msg || "Live answers are not available right now.") };
    if (!msg && (r.status === 502 || r.status === 503 || r.status === 504)) return { type: "offline" };
    return { type: "error", message: T(msg || "Live answers are not available right now.") };
  }
  /* The request asks for a stream. A server that streams answers with text/event-stream: "delta" events carry the
     text in order, one "done" carries the same fields as the JSON answer, "error" says what failed. A server that
     does not stream (or an error 400, 429, 503) answers with JSON, as before. onDelta(textSoFar) is called per piece. */
  function post(kind, q, signal, onDelta) {
    return fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json", "Accept": "text/event-stream" },
      body: JSON.stringify({ question: q, kind: kind, stream: true }), signal: signal })
      .then(function (r) {
        var type = (r.headers.get("Content-Type") || "").toLowerCase();
        if (type.indexOf("text/event-stream") >= 0 && r.body && r.body.getReader && typeof TextDecoder === "function") return readStream(r, onDelta);
        return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, status: r.status, body: j || {} }; });
      });
  }
  function readStream(r, onDelta) {
    var reader = r.body.getReader(), dec = new TextDecoder(), buf = "", text = "", done = null, err = null;
    function handle(block) {
      var data = block.split(/\r?\n/).filter(function (l) { return l.indexOf("data:") === 0; }).map(function (l) { return l.slice(5).replace(/^ /, ""); }).join("\n");
      if (!data) return;
      var ev; try { ev = JSON.parse(data); } catch (e) { return; }
      if (!ev) return;
      if (ev.type === "delta" && typeof ev.text === "string") { text += ev.text; if (onDelta) onDelta(text); }
      else if (ev.type === "done") done = ev;
      else if (ev.type === "error") err = ev;
    }
    function finish() {
      if (err) return { ok: false, status: err.error === "limit" ? 429 : 500, body: { error: err.error, message: err.message }, partial: text, streamed: true };
      if (done) { var b = {}, k; for (k in done) b[k] = done[k]; if (!b.answer) b.answer = text; return { ok: true, status: 200, body: b, partial: text, streamed: true }; }
      if (text) return { ok: true, status: 200, body: { answer: text, truncated: true }, partial: text, streamed: true };   /* the stream ended early */
      return { ok: false, status: 502, body: {}, streamed: true };
    }
    function pump() {
      return reader.read().then(function (x) {
        if (x.done) { buf += dec.decode(); if (buf.trim()) handle(buf); return finish(); }
        buf += dec.decode(x.value, { stream: true });
        var parts = buf.split(/\r?\n\r?\n/); buf = parts.pop(); parts.forEach(handle);
        if (done || err) { try { reader.cancel(); } catch (e) { /* already closed */ } return finish(); }
        return pump();
      });
    }
    return pump();
  }
  /* What can be shown of a text still arriving: a half-written figure tag and an unclosed bold mark wait for the rest.
     A citation whose bracket has not closed stays as plain text until it closes. */
  /* A text that stopped for good (stopped, failed): what follows an unclosed bracket is dropped, so no half citation shows. */
  function closed(text) {
    var s = settled(text), i = s.lastIndexOf("[");
    return i >= 0 && s.indexOf("]", i) < 0 ? s.slice(0, i).replace(/\s+$/, "") : s;
  }
  function settled(text) {
    var s = String(text || ""), i = s.lastIndexOf("[[");
    if (i >= 0 && s.indexOf("]]", i) < 0) s = s.slice(0, i);
    if ((s.match(/\*\*/g) || []).length % 2) { var k = s.lastIndexOf("**"); s = s.slice(0, k) + s.slice(k + 2); }
    return s;
  }
  /* Keep the end of the text in view only if the reader is already there; if they scrolled up to read, leave them. */
  function atEnd(el) { return el.getBoundingClientRect().bottom <= window.innerHeight + 140; }
  function showEnd(el) {
    var bar = document.querySelector(".ask-bar-sticky"), room = window.innerHeight - (bar ? bar.offsetHeight : 0) - 16;
    var over = el.getBoundingClientRect().bottom - room;
    if (over > 0) window.scrollBy(0, over);
  }
  var figCache = {}, frame = {};
  function soon(key, fn) {
    if (frame[key]) return;
    frame[key] = true;
    (window.requestAnimationFrame || setTimeout)(function () { frame[key] = false; fn(); });
  }
  function ctl() { return typeof AbortController === "function" ? new AbortController() : { signal: undefined, abort: function () {} }; }

  function ask(q, again) {
    if (pendingA) return;
    var t = again ? turns.filter(function (x) { return x.id === again; })[0] : null;
    if (!t) { t = { id: "t" + (seq++), q: q }; turns.push(t); }
    Object.assign(t, { status: "loading", declined: false, answer: "", partial: "", note: "", saved: false, model: "", when: "", err: null, started: Date.now() });
    var c = ctl(); pendingA = { c: c, id: t.id };
    figCache[t.id] = {};
    saveTurns(); refresh(t.id); tick();
    post("answer", t.q, c.signal, function (text) {
      if (!pendingA || pendingA.id !== t.id) return;
      t.status = "streaming"; t.partial = text;
      soon(t.id, function () { paintStream(t); });
    }).then(function (r) {
      if (!pendingA || pendingA.id !== t.id) return;           /* stopped, or replaced */
      pendingA = null;
      var bad = outcome(r);
      if (bad) { t.status = "error"; t.err = bad; t.partial = r.partial || ""; }
      else {
        t.status = "done"; t.declined = !!r.body.declined; t.answer = r.body.declined ? T(r.body.answer) : r.body.answer; t.model = r.body.model || ""; t.when = new Date().toISOString();
        t.note = r.body.truncated ? "The answer was cut short." : ""; t.partial = "";
      }
      saveTurns();
      if (r.streamed) finishInPlace(t); else refresh(t.id);
      announce(T("Answer ready."));
    }).catch(function () {
      if (!pendingA || pendingA.id !== t.id) return;
      pendingA = null; t.status = "error"; t.err = { type: "offline" }; saveTurns(); finishInPlace(t);
    });
  }
  /* Draw the text received so far in the turn, with the look of the final answer. */
  function paintStream(t) {
    var el = document.getElementById("ask-" + t.id);
    if (!el || !onAsk() || t.status !== "streaming") return;
    var follow = atEnd(el), box = el.querySelector(".ask-a-live");
    if (!box) { var fresh = modern(turnEl(t)); el.replaceWith(fresh); el = fresh; setBar(); }
    else {
      var refs = newRefs(), num = A.counter();
      box.replaceChildren.apply(box, body(settled(t.partial), refs, false, num, figCache[t.id]).nodes);
      modern(box);
    }
    if (follow) showEnd(el);
  }
  /* The final answer replaces the streamed text in place: same text, same place, then the tables and sources. */
  function finishInPlace(t) {
    if (!onAsk()) return;
    var el = document.getElementById("ask-" + t.id);
    if (!el || !convo) { refresh(); return; }
    var a = el.querySelector(".ask-a"), y0 = a ? a.getBoundingClientRect().top : 0;
    var fresh = modern(turnEl(t)); el.replaceWith(fresh); setBar(); swipeHints(fresh);
    var a2 = fresh.querySelector(".ask-a");
    if (a && a2) window.scrollBy(0, a2.getBoundingClientRect().top - y0);
    delete figCache[t.id];
  }
  function stopAnswer() {
    var p = pendingA; if (!p) return;
    pendingA = null; p.c.abort();
    var t = turns.filter(function (x) { return x.id === p.id; })[0];
    if (t) { t.status = "cancelled"; t.note = ""; }            /* what already arrived stays, marked as stopped */
    saveTurns(); if (t && t.partial) finishInPlace(t); else refresh(); announce(T("Answer stopped."));
  }
  function addSaved(e) {
    var t = { id: "t" + (seq++), q: e.q, status: "done", answer: e.a, note: "", saved: true, model: "", when: "" };
    turns.push(t); saveTurns(); refresh(t.id);
  }

  function startReport(q) {
    if (pendingR) { pendingR.c.abort(); pendingR = null; }
    report = { q: q, status: "loading", answer: "", partial: "", model: "", when: "", note: "", err: null, started: Date.now() };
    figCache.report = {};
    store(KEY_REPORT, null);                                   /* a new report replaces the one kept for this tab */
    var c = ctl(), mine = { c: c }; pendingR = mine;
    if (onReport()) reportPage(); else location.hash = "#/ask/report";
    tick();
    post("report", q, c.signal, function (text) {
      if (pendingR !== mine) return;
      report.status = "streaming"; report.partial = text;
      soon("report", paintReport);
    }).then(function (r) {
      if (pendingR !== mine) return;
      pendingR = null;
      var bad = outcome(r);
      if (bad) { report.status = "error"; report.err = bad; }
      else if (r.body.kind === "report" && /^#\s/m.test(r.body.answer)) {
        report.status = "done"; report.answer = r.body.answer; report.model = r.body.model || ""; report.when = new Date().toISOString();
        report.note = r.body.truncated ? "The report was cut short." : ""; saveReport();
      } else {
        /* a refusal or a one-line "not about this data" comes back as a plain answer: it joins the conversation */
        report.status = "error"; report.err = { type: "error", message: r.body.declined ? T(r.body.answer) : r.body.answer };
      }
      if (report.status !== "done") report.partial = r.ok ? "" : r.partial || "";   /* a refusal in "done" replaces what was streamed */
      redrawKeeping();
    }).catch(function () {
      if (pendingR !== mine) return;
      pendingR = null; report.status = "error"; report.err = { type: "offline" }; redraw();
    });
  }
  function stopReport() {
    var p = pendingR; if (!p) return;
    pendingR = null; p.c.abort(); report.status = "cancelled"; redrawKeeping();
  }
  /* Redraw the report page keeping its text where it was on screen (the contents appear when it is complete). */
  function redrawKeeping() {
    if (!onReport()) { redraw(); return; }
    var b0 = document.querySelector(".ask-doc-body"), y0 = b0 ? b0.getBoundingClientRect().top : null;
    reportPage();
    var b1 = document.querySelector(".ask-doc-body");
    if (y0 !== null && b1) window.scrollBy(0, b1.getBoundingClientRect().top - y0);
  }
  function paintReport() {
    if (!onReport() || !report || report.status !== "streaming") return;
    var bodyEl = document.querySelector(".ask-doc-body");
    if (!bodyEl) { reportPage(); return; }
    var grid = document.querySelector(".ask-doc-grid"), follow = atEnd(grid);
    var refs = newRefs(), b = body(settled(report.partial), refs, true, A.counter(), figCache.report);
    bodyEl.replaceChildren.apply(bodyEl, b.nodes); modern(bodyEl);
    var title = document.querySelector(".ask-doc-title");
    if (title) title.textContent = b.title || report.q;
    if (follow) showEnd(grid);
  }
  function redraw() { if (onReport()) reportPage(); else if (onAsk()) refresh(); }

  /* One clock while nothing has arrived yet: it goes away with the first piece of text. */
  var timer = null;
  function tick() {
    if (timer) return;
    timer = setInterval(function () {
      if (!pendingA && !pendingR) { clearInterval(timer); timer = null; return; }
      Array.prototype.forEach.call(document.querySelectorAll("[data-since]"), function (n) {
        n.textContent = Math.max(0, Math.round((Date.now() - Number(n.getAttribute("data-since"))) / 1000)) + " s";
      });
    }, 1000);
  }
  function since(t0) { return h("span", { "class": "num", "data-since": String(t0), text: Math.max(0, Math.round((Date.now() - t0) / 1000)) + " s" }); }
  var live = null;
  function announce(text) { if (live) { live.textContent = ""; setTimeout(function () { if (live) live.textContent = text; }, 50); } }

  /* ---------- pieces of the conversation page ---------- */
  /* Which front each saved question belongs to, by its topic. The order of C.examples is the same in both languages. */
  var GROUPS = [["prevention", "Prevent"], ["detection", "Detect"], ["suppression", "Suppress"], ["worlds", "Worlds"]];
  var GROUP_OF = ["worlds", "detection", "suppression", "worlds", "prevention"];
  function starters(compact) {
    var cols = GROUPS.map(function (g) {
      var list = C.examples.map(function (e, i) { return { e: e, g: GROUP_OF[i] || "worlds" }; }).filter(function (x) { return x.g === g[0]; });
      if (!list.length) return null;
      return h("section", { "class": "ask-group" }, h("h3", { "class": "ask-group-h", text: T(g[1]) }),
        h("ul", { "class": "ask-group-list" }, list.map(function (x) {
          return h("li", null, h("button", { type: "button", "class": "ask-saved", onclick: function () { addSaved(x.e); } }, x.e.q));
        })));
    });
    return h("div", { "class": "ask-groups" + (compact ? " ask-groups-compact" : "") }, cols);
  }
  function howBlock() {
    return h("details", { "class": "ask-how" }, h("summary", { text: T("How it answers") }),
      h("div", { "class": "ask-how-body" },
        h("p", { text: T("The answer is written by AI from the investigations, materials and worlds on this site, cites the PSI record behind each statement, and says so when something is not in the data.") }),
        h("p", { text: T("Each small number in an answer is a source. It opens the record, the row of the table or the page of the report it comes from, and the list under the answer says what each one supports.") }),
        h("p", { text: T("Create report writes a longer, printable report on the same topic, with figures, the tests it cites and its sources.") }),
        h("p", { text: T("The saved questions were answered beforehand and checked against the data. They work without a connection. Live answers have a daily limit.") })));
  }
  function reportStrip() {
    if (!report || report.status === "idle") return null;
    var line = report.status === "done" ? [T("Report ready: "), h("span", { "class": "ask-strip-q", text: report.q })]
      : report.status === "loading" ? [T("A report is being written: "), h("span", { "class": "ask-strip-q", text: report.q }), " ", since(report.started)]
      : [T("The last report did not finish: "), h("span", { "class": "ask-strip-q", text: report.q })];
    return h("div", { "class": "ask-strip", role: "status" }, h("p", null, line),
      h("a", { "class": "c-btn", href: "#/ask/report", text: report.status === "loading" ? T("See its progress") : T("Open the report") }));
  }

  var box = null, msg = null, sendBtn = null, repBtn = null, busyLine = null;
  function bar(sticky) {
    box = h("textarea", { id: "ask-q", rows: "1", maxlength: "500", "aria-describedby": "ask-hint ask-msg",
      placeholder: sticky ? T("Ask another question") : T("For example: what is known about smoke detection for a Moon base?") });
    box.value = draft;
    box.addEventListener("input", function () { draft = box.value; grow(); if (box.value.trim()) say(""); });
    box.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" && !ev.shiftKey && !ev.isComposing) { ev.preventDefault(); submit(); }
    });
    msg = h("p", { id: "ask-msg", "class": "ask-msg", "aria-live": "polite" });
    sendBtn = h("button", { type: "submit", "class": "c-btn c-btn-primary ask-send" });
    repBtn = h("button", { type: "button", "class": "c-btn ask-make", onclick: function () {
      var q = box.value.trim();
      if (!q) { say(T("Write a question first.")); box.focus(); return; }
      if (pendingR) { location.hash = "#/ask/report"; return; }
      startReport(q);
    } });
    busyLine = h("p", { "class": "ask-busy", "aria-live": "off" });
    var form = h("form", { "class": "ask-bar" + (sticky ? " ask-bar-sticky" : ""), onsubmit: function (ev) { ev.preventDefault(); if (pendingA) stopAnswer(); else submit(); } },
      h("label", { "for": "ask-q", "class": "ask-label", text: T("Your question") }),
      h("div", { "class": "ask-bar-row" }, box, h("div", { "class": "ask-bar-btns" }, sendBtn, repBtn)),
      h("div", { "class": "ask-bar-foot" }, h("p", { id: "ask-hint", "class": "ask-hint", text: T("Enter sends. Shift+Enter starts a new line.") }), busyLine, msg));
    setBar();
    setTimeout(grow, 0);
    return form;
  }
  function grow() {
    if (!box) return;
    var cs = getComputedStyle(box), line = parseFloat(cs.lineHeight) || 24, pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + 2;
    box.style.height = "auto";
    box.style.height = Math.min(box.scrollHeight + 2, line * 5 + pad) + "px";
    box.style.overflowY = box.scrollHeight + 2 > line * 5 + pad ? "auto" : "hidden";
  }
  function say(text) { if (msg) msg.textContent = text; }
  function setBar() {
    if (!sendBtn) return;
    sendBtn.textContent = pendingA ? T("Stop") : T("Ask");
    sendBtn.setAttribute("aria-label", pendingA ? T("Stop") : T("Ask"));
    repBtn.textContent = pendingR ? T("Writing a report") : T("Create report");
    busyLine.replaceChildren();
    if (pendingA) { var t = turns.filter(function (x) { return x.id === pendingA.id; })[0]; if (t && t.status === "loading") busyLine.append(T("Answering. Time so far: "), since(t.started)); }   /* gone with the first piece of text */
  }
  function submit() {
    var q = box.value.trim();
    if (!q) { say(T("Write a question first.")); box.focus(); return; }
    if (pendingA) { say(T("An answer is on its way. Stop it to ask something else.")); return; }
    say(""); box.value = ""; draft = ""; grow();
    ask(q);
  }

  function citesList(refs) {
    if (!refs.list.length) return null;
    return h("section", { "class": "ask-cites" }, h("h3", { "class": "ask-cites-h", text: T("Sources cited in this answer") }),
      h("ol", { "class": "ask-cites-list" }, refs.list.map(function (r) {
        var thumb = null, title, what;
        if (r.kind === "page") {
          var e = r.ev;
          thumb = e.img ? h("img", { src: e.img, alt: "", loading: "lazy", width: e.w, height: e.h }) : h("span", { "class": "ask-thumb-none" }, A.tag("missing", T("No page image")));
          title = [h("span", { "class": "ask-cite-doc", text: e.doc[L] }), " ", h("span", { "class": "ask-src-page", text: A.sourceWhere ? A.sourceWhere(e) : "" })];
          what = [h("span", { "class": "ask-cite-what", text: e.claim[L] }), A.sourceTags ? A.sourceTags(e) : null];
        } else if (r.kind === "inv") {
          var i = A.inv(r.inv);
          title = [h("span", { "class": "ask-cite-doc", text: i.acr }), " ", h("span", { text: i.title || "" })];
          what = h("span", { "class": "ask-cite-what", text: T("Investigation record") });
        } else {
          title = r.parts ? h("span", { "class": "ask-cite-doc" }, h("span", { "class": "num", text: r.parts[0] }), " " + r.parts[1] + " ", h("span", { "class": "num", text: r.parts[2] }))
            : h("span", { "class": "ask-cite-doc", text: r.text });
          what = h("span", { "class": "ask-cite-what" }, T("Row of the experimental table"), r.tests[0] && r.tests[0].fuel ? ": " + r.tests[0].fuel : "");
        }
        return h("li", { "class": "ask-cite" + (thumb ? "" : " ask-cite-nothumb") },
          h("span", { "class": "ask-cite-n", text: String(r.num) }),
          h("a", { "class": "ask-cite-link", href: r.href, "data-src": r.kind === "page" ? r.ev.id : null },
            thumb ? h("span", { "class": "ask-thumb" }, thumb) : null,
            h("span", { "class": "ask-cite-text" }, h("span", { "class": "ask-cite-title" }, title), what)));
      })));
  }
  /* The people behind the investigations an answer cites (A.people, built by another view). If it is not there or
     has nobody for these investigations, the section is left out. */
  function peopleSection(refs, isReport) {
    var P = A.people;
    if (!P || typeof P.forInvestigations !== "function" || typeof P.cards !== "function") return null;
    var ids = refs.invs.slice();
    refs.list.forEach(function (r) { if (r.kind === "page" && r.ev.docInv) note(ids, r.ev.docInv); });
    if (!ids.length) return null;
    try {
      var list = P.forInvestigations(ids);
      if (!list || !list.length) return null;
      var cards = P.cards(list, { compact: true });
      if (!cards) return null;
      /* on paper: name, role, institution and the profile address written out */
      var lines = list.map(function (p) {
        if (!p || typeof p !== "object" || !p.name) return null;
        var e = p.entry && p.entry.status === "verified" ? p.entry : null;      /* only what was checked, as the cards do */
        var roles = (Array.isArray(p.roles) ? p.roles : []).map(function (r) {
          var i = r && A.inv(r.inv); return r && r.role ? (i ? i.acr : r.inv) + ": " + r.role : null;
        }).filter(Boolean).join("; ");
        var first = Array.isArray(p.roles) && p.roles[0] && A.inv(p.roles[0].inv);
        var link = e && e.profile && e.profile.url ? e.profile.url : first && first.url ? T("PSI record") + ": " + first.url : "";
        return h("li", null, [p.name, roles, e && [e.position, e.org].filter(Boolean).join(", ")].filter(Boolean).join(", "), link ? ". " + link : "");
      }).filter(Boolean);
      var print = lines.length ? h("ul", { "class": "ask-people-print" }, lines) : null;
      var head = isReport ? h("h2", { "class": "ask-doc-h", id: "ask-sec-people", text: T("Who ran the investigations cited here") })
        : h("h3", { "class": "ask-cites-h ask-people-h", text: T("Who ran the investigations cited here") });
      return h("section", { "class": "ask-people" + (print ? " ask-people-has-print" : "") }, head, h("div", { "class": "ask-people-cards" }, cards), print);
    } catch (e) { return null; }
  }
  function cutNotice(text, label, again) {
    return h("div", { "class": "ask-cut", role: "note" }, A.tag("missing", T("Cut short")), h("p", { text: T(text) }),
      again ? h("button", { type: "button", "class": "c-btn", onclick: again }, T(label)) : null);
  }
  function copyText(t, el) {
    var text = t.q + "\n\n" + (el.querySelector(".ask-a") ? el.querySelector(".ask-a").innerText : "") +
      (el.querySelector(".ask-cites") ? "\n\n" + el.querySelector(".ask-cites").innerText : "");
    return text.replace(/\n{3,}/g, "\n\n").trim();
  }
  function turnEl(t) {
    var el = h("article", { "class": "ask-turn", id: "ask-" + t.id, "aria-labelledby": "ask-" + t.id + "-q" },
      h("h2", { "class": "ask-q", id: "ask-" + t.id + "-q" }, h("span", { "class": "ask-q-label", text: T("You asked") }), h("span", { "class": "ask-q-text", text: t.q })));
    if (t.status === "loading") {
      el.appendChild(A.state("loading", T("Reading the investigations"), null));
      el.lastChild.appendChild(h("p", null, T("Writing an answer from the data. This can take a few seconds. Time so far: "), since(t.started)));
      el.lastChild.appendChild(h("button", { type: "button", "class": "c-btn", onclick: stopAnswer }, T("Stop")));
      return el;
    }
    if (t.status === "streaming") {
      var sr = newRefs();
      el.append(h("div", { "class": "ask-a ask-a-live", "aria-busy": "true" }, body(settled(t.partial), sr, false, A.counter(), figCache[t.id]).nodes),
        h("div", { "class": "ask-streaming" }, h("p", { "class": "ask-streaming-t", text: T("Writing the answer") }),
          h("button", { type: "button", "class": "c-btn", onclick: stopAnswer }, T("Stop"))));
      return el;
    }
    if (t.partial && (t.status === "cancelled" || t.status === "error")) el.appendChild(h("div", { "class": "ask-a ask-a-partial" }, body(closed(t.partial), newRefs(), false, A.counter()).nodes));
    if (t.status === "cancelled") {
      el.appendChild(A.state("empty", T(t.note || "You stopped this answer."), null,
        h("button", { type: "button", "class": "c-btn", onclick: function () { ask(t.q, t.id); } }, T("Ask again"))));
      return el;
    }
    if (t.status === "error") {
      var e = t.err || { type: "error" };
      el.appendChild(A.state(e.type === "limit" ? "empty" : "error",
        e.type === "offline" ? T("No connection") : e.type === "limit" ? T("Live answers are paused") : T("No live answer"),
        e.type === "offline" ? T("Live answers need a connection to the server, and it did not respond. The saved questions still work without one.") : e.message,
        h("button", { type: "button", "class": "c-btn", onclick: function () { ask(t.q, t.id); } }, T("Try again"))));
      return el;
    }
    if (t.declined) {
      el.append(h("div", { "class": "ask-a" }, body(t.answer, newRefs(), false, A.counter()).nodes),
        h("div", { "class": "ask-declined" }, h("p", { "class": "ask-declined-t", text: T("No answer from the data") }),
          h("p", { text: T("This box answers from the investigations, materials and worlds on this site. Ask about one of them, or about preventing, detecting or putting out a fire, or start with a saved question:") }),
          h("ul", { "class": "ask-declined-list" }, C.examples.map(function (e) {
            return h("li", null, h("button", { type: "button", "class": "ask-saved", onclick: function () { addSaved(e); } }, e.q));
          }))));
      return el;
    }
    var cut = t.note === "The answer was cut short.";
    var refs = newRefs(), num = A.counter(), b = body(t.answer, refs, false, num);
    var copyBtn = h("button", { type: "button", "class": "c-btn" }, T("Copy answer"));
    var copyMsg = h("span", { "class": "ask-copy-msg", "aria-live": "polite" });
    copyBtn.addEventListener("click", function () {
      var text = copyText(t, el), done = function () { copyBtn.textContent = T("Copied"); setTimeout(function () { copyBtn.textContent = T("Copy answer"); }, 2000); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { copyMsg.textContent = T("Copy failed. Select the text to copy it."); });
      else copyMsg.textContent = T("Copy failed. Select the text to copy it.");
    });
    A.add(el, [h("div", { "class": "ask-a" }, b.nodes),
      cut ? cutNotice("The answer stops before its end. Ask again, or ask a narrower question.", "Ask again", function () { ask(t.q, t.id); }) : null,
      testsTable(refs.rows, num, false),
      citesList(refs),
      peopleSection(refs, false),
      h("p", { "class": "ask-note", text: (t.saved ? T("Saved answer, written with AI and checked against the data. ") : T("Answer written live by AI from this site's data. Check the cited records before relying on it. ")) +
        (refs.figs.length && !t.saved ? T("The AI picked the figures by their captions; it has not seen the images. ") : "") + (t.note && !cut ? T(t.note) : "") }),
      h("div", { "class": "ask-actions" }, copyBtn, csvButton(refs.rows, t.q, "answer"),
        h("button", { type: "button", "class": "c-btn", onclick: function () { startReport(t.q); } }, T("Turn into report")), copyMsg)]);   /* add() skips the parts an answer does not have */
    if (t.saved) el.querySelector(".ask-q").appendChild(A.tag("kind", T("Works offline")));
    return el;
  }

  function newConvControl() {
    var wrap = h("div", { "class": "ask-new" });
    function closed() {
      wrap.replaceChildren(h("button", { type: "button", "class": "c-btn c-btn-quiet", onclick: function () { confirmOpen = true; open(); } }, T("New conversation")));
    }
    function open() {
      var keep = h("button", { type: "button", "class": "c-btn", onclick: function () { confirmOpen = false; closed(); wrap.querySelector("button").focus(); } }, T("Keep them"));
      wrap.replaceChildren(h("div", { "class": "ask-confirm", role: "group" },
        h("p", { text: turns.length === 1 ? T("Clear this question and its answer?") : T("Clear these questions and answers?") }),
        h("button", { type: "button", "class": "c-btn ask-clear", onclick: function () {
          confirmOpen = false; if (pendingA) { pendingA.c.abort(); pendingA = null; }
          turns = []; saveTurns(); closePanel(true); savedY = 0; store(KEY_SCROLL, 0); chatPage(); window.scrollTo(0, 0); if (box) box.focus();
        } }, T("Clear")), keep));
      keep.focus();
    }
    wrap.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && confirmOpen) { ev.preventDefault(); ev.stopPropagation(); confirmOpen = false; closed(); wrap.querySelector("button").focus(); }
    });
    if (confirmOpen) open(); else closed();
    return wrap;
  }

  /* ---------- the side panel with the cited page (1280 px and wider) ---------- */
  var side = null;
  function wide() { return window.innerWidth >= 1280; }
  function sideContent() {
    if (!side) return;
    var e = panelId && A.evidence ? A.evidence(panelId) : null;
    if (e && A.sourcePage) {
      var close = h("button", { type: "button", "class": "c-btn", onclick: function () { closePanel(); } }, T("Close"));
      var head = h("h2", { "class": "ask-panel-h", tabindex: "-1", text: T("Cited page") });
      side.replaceChildren(h("div", { "class": "ask-panel", role: "region", "aria-label": T("Cited page") },
        h("div", { "class": "ask-panel-top" }, head, h("div", { "class": "ask-panel-btns" }, h("a", { "class": "c-btn", href: "#/source/" + e.id, text: T("Open full page") }), close)),
        h("p", { "class": "ask-panel-doc", text: e.doc[L] }),
        A.sourcePage(e, true)));
      side.classList.add("ask-side-panel");
      return head;
    }
    side.classList.remove("ask-side-panel");
    side.replaceChildren(h("div", { "class": "ask-side-saved" }, h("h2", { "class": "ask-side-h" }, T("Saved questions"), " ", A.tag("kind", T("Works offline"))), starters(true)));
    return null;
  }
  function openPanel(id, trigger) {
    panelId = id; panelTrigger = trigger;
    var head = sideContent();
    if (head) head.focus({ preventScroll: true });
  }
  function closePanel(quiet) {
    var back = panelTrigger; panelId = null; panelTrigger = null; sideContent();
    if (!quiet && back && document.body.contains(back)) back.focus({ preventScroll: true });
  }
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape" && panelId && onAsk()) closePanel(); });
  window.addEventListener("resize", function () { if (panelId && !wide() && onAsk()) closePanel(true); });

  /* ---------- the conversation page ---------- */
  var convo = null, root = null;
  function chatPage() {
    document.title = T("Ask the data") + " · One Fire, Many Worlds";
    var hadFocus = document.activeElement && document.activeElement.id === "ask-q";
    live = h("p", { "class": "ask-live", "aria-live": "polite" });
    root = h("div", { "class": "wrap ask-view" });
    root.append(A.intro(T("Ask the data"), T("Ask in your own words. An AI answers from the investigations, materials and worlds on this site, cites the record or page behind each statement, and says when something is not in the data.")),
      howBlock(), reportStrip() || "", live);
    if (!turns.length) {
      side = null; convo = null;
      root.append(bar(false), h("section", { "class": "ask-start" },
        h("div", { "class": "ask-start-head" }, h("h2", { "class": "ask-start-h", text: T("Start with a saved question") }), A.tag("kind", T("Works offline"))),
        starters(false)));
    } else {
      convo = h("div", { "class": "ask-convo" }, turns.map(turnEl));
      side = h("aside", { "class": "ask-side" });
      root.append(h("div", { "class": "ask-layout" },
        h("div", { "class": "ask-main" },
          h("div", { "class": "ask-convo-head" }, h("h2", { "class": "ask-convo-h", text: T("Conversation") }), newConvControl()),
          h("details", { "class": "ask-saved-narrow" }, h("summary", null, T("Saved questions"), " ", A.tag("kind", T("Works offline"))), starters(true)),
          convo, bar(true)),
        side));
      sideContent();
    }
    root.addEventListener("click", function (ev) {
      var a = ev.target.closest && ev.target.closest("a[data-src]");
      if (!a || !wide() || !A.sourcePage || !side || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.button) return;
      if (a.closest(".ask-panel")) return;
      ev.preventDefault(); openPanel(a.getAttribute("data-src"), a);
    });
    A.main.replaceChildren(modern(root));
    hintsSoon();
    if (hadFocus && box) box.focus({ preventScroll: true });
  }
  /* Redraw after a change. With a target turn, bring it into view; otherwise keep the reader where they were. */
  function refresh(targetId) {
    if (!onAsk()) return;
    var y = window.scrollY;
    if (!convo || !turns.length) chatPage();
    else {
      var hadFocus = document.activeElement && document.activeElement.id === "ask-q";
      convo.replaceChildren.apply(convo, turns.map(turnEl)); modern(convo); setBar(); swipeHints(convo);
      var strip = root.querySelector(".ask-strip"), next = reportStrip();
      if (strip && next) strip.replaceWith(next); else if (strip) strip.remove(); else if (next) live.before(next);
      if (hadFocus && box) box.focus({ preventScroll: true });
      window.scrollTo(0, y);
    }
    if (targetId) {
      var el = document.getElementById("ask-" + targetId);
      if (el) el.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
    }
  }

  /* ---------- the report, as a document ---------- */
  function day(iso) {
    try { return new Date(iso).toLocaleDateString(L === "es" ? "es-MX" : "en-US", { year: "numeric", month: "long", day: "numeric" }); }
    catch (e) { return String(iso).slice(0, 10); }
  }
  function url(u) { return h("a", { "class": "ask-url", href: u, target: "_blank", rel: "noopener", text: u }); }
  function reportSources(refs) {
    var items = refs.list.map(function (r) {
      if (r.kind === "page") return h("li", { value: String(r.num) }, h("a", { href: "#/source/" + r.ev.id, text: A.sourceLabel(r.ev) }), ". ", r.ev.record ? url(r.ev.record) : null);
      if (r.kind === "inv") { var i = A.inv(r.inv); return h("li", { value: String(r.num) }, (i.cite || i.acr + ". " + i.title + ".") + " ", i.url ? url(i.url) : null); }
      return h("li", { value: String(r.num) }, h("a", { href: r.href, text: r.text }));
    });
    var figs = refs.figs.map(function (id) { var f = A.figure(id); return f ? h("li", null, h("a", { href: "#/figure/" + f.id, text: A.figureLabel(f) }), ". ", url(f.record)) : null; }).filter(Boolean);
    return { items: items, figs: figs };
  }
  function goBack(ev) {
    if (/^#\/ask\/?$/.test(lastHash)) { ev.preventDefault(); history.back(); }   /* returns to the same point of the conversation */
  }
  /* The head of the report. While it is being written the date is the day it started and the model is not known yet. */
  function docHead(title, r, writing) {
    var when = r.when || (writing ? new Date(r.started || Date.now()).toISOString() : "");
    return h("header", { "class": "ask-doc-head" },
      h("h1", { "class": "ask-doc-title", text: title }),
      h("p", { "class": "ask-doc-kind" }, T("Research report"), when ? [", ", h("time", { datetime: when, text: day(when) })] : null),
      h("p", { "class": "ask-doc-meta" }, h("strong", { text: T("Topic asked: ") }), r.q),
      h("p", { "class": "ask-doc-meta", text: T("Written by AI") + (r.model ? " (" + r.model + ")" : "") + (when ? T(" on ") + day(when) : "") +
        T(", from the data of One Fire, Many Worlds: NASA's PSI repository, downloaded November 13, 2026. Team Hamác, 2026 NASA Space Apps Challenge.") }));
  }
  function reportPage() {
    var top = h("div", { "class": "ask-docbar" }), back = A.back("#/ask", T("Back to the conversation"));
    top.appendChild(back);
    var page = h("div", { "class": "wrap ask-view ask-report" }, top), r = report;
    document.title = T("Report") + " · One Fire, Many Worlds";
    if (!r) {
      page.append(A.intro(T("Research report"), null), A.state("empty", T("No report yet"), T("Write a question in the conversation and choose Create report."),
        h("a", { "class": "c-btn c-btn-primary", href: "#/ask", text: T("Go to the conversation") })));
    } else if (r.status === "loading") {
      page.append(A.intro(T("Writing the report"), r.q),
        A.state("loading", T("Writing the report"), null));
      var st = page.querySelector(".c-state");
      st.append(h("p", null, T("Reports take up to a minute. Time so far: "), since(r.started)),
        h("button", { type: "button", "class": "c-btn", onclick: stopReport }, T("Stop")));
    } else if (r.status === "streaming") {
      var sb = body(settled(r.partial), newRefs(), true, A.counter(), figCache.report);
      top.appendChild(h("div", { "class": "ask-docbusy" }, h("p", { text: T("Writing the report") }), h("button", { type: "button", "class": "c-btn", onclick: stopReport }, T("Stop"))));
      page.append(h("article", { "class": "ask-doc-grid", "aria-busy": "true" },
        docHead(sb.title || r.q, r, true), h("div", { "class": "ask-doc" }, h("div", { "class": "ask-doc-body" }, sb.nodes))));
    } else if (r.status === "error" || r.status === "cancelled") {
      var e = r.err || {};
      if (r.partial) page.append(h("article", { "class": "ask-doc-grid" }, h("div", { "class": "ask-doc" }, h("div", { "class": "ask-doc-body" }, body(closed(r.partial), newRefs(), true, A.counter()).nodes))));
      page.append(A.intro(T("Research report"), r.q),
        r.status === "cancelled" ? A.state("empty", T("You stopped the report."), null, null)
          : A.state(e.type === "limit" ? "empty" : "error",
            e.type === "offline" ? T("No connection") : e.type === "limit" ? T("Live answers are paused") : T("The report was not written"),
            e.type === "offline" ? T("Live answers need a connection to the server, and it did not respond. The saved questions still work without one.") : e.message, null));
      page.querySelector(".c-state").appendChild(h("button", { type: "button", "class": "c-btn", onclick: function () { startReport(r.q); } }, T("Try again")));
    } else {
      var refs = newRefs(), num = A.counter(), b = body(r.answer, refs, true, num), tests = testsTable(refs.rows, num, true), src = reportSources(refs);
      document.title = (b.title || r.q) + " · One Fire, Many Worlds";      /* the browser uses it as the PDF's file name */
      top.appendChild(h("button", { type: "button", "class": "c-btn c-btn-primary", onclick: function () { window.print(); } }, T("Print or save as PDF")));
      var toc = [], k = 0;
      b.heads.forEach(function (n) { n.id = "ask-sec-" + (++k); toc.push({ el: n, text: n.textContent, sub: n.tagName === "H3" }); });
      var testsH = tests ? h("h2", { "class": "ask-doc-h", id: "ask-sec-tests", text: T("Tests cited") }) : null;
      var srcH = src.items.length || src.figs.length ? h("h2", { "class": "ask-doc-h", id: "ask-sec-src", text: T("Sources") }) : null;
      if (testsH) toc.push({ el: testsH, text: testsH.textContent });
      if (srcH) toc.push({ el: srcH, text: srcH.textContent });
      var people = peopleSection(refs, true);
      if (people) toc.push({ el: people.querySelector("h2"), text: T("Who ran the investigations cited here") });
      var nav = toc.length ? h("nav", { "class": "ask-toc", "aria-labelledby": "ask-toc-h" }, h("h2", { "class": "ask-toc-h", id: "ask-toc-h", text: T("Contents") }),
        h("ol", null, toc.map(function (x) {
          return h("li", { "class": x.sub ? "ask-toc-sub" : null }, h("a", { href: "#/ask/report", text: x.text, onclick: function (ev) {
            ev.preventDefault(); x.el.setAttribute("tabindex", "-1"); x.el.focus({ preventScroll: true });
            x.el.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
          } }));
        }))) : null;
      /* phone: title, contents, text; wide: the contents in a column of their own beside the title and the text */
      page.append(h("article", { "class": "ask-doc-grid" },
          docHead(b.title || r.q, r, false),
          nav,
          h("div", { "class": "ask-doc" },
          h("div", { "class": "ask-doc-body" }, b.nodes),
          r.note === "The report was cut short." ? cutNotice("The report stops before its end. Try again, or ask about a narrower topic.", "Try again", function () { startReport(r.q); }) : null,
          testsH, tests, tests ? h("div", { "class": "ask-actions" }, csvButton(refs.rows, r.q, "report")) : null,
          srcH, src.items.length ? h("ol", { "class": "ask-doc-src" }, src.items) : null,
          src.figs.length ? [h("h3", { "class": "ask-doc-h", text: T("Figures") }), h("ul", { "class": "ask-doc-src" }, src.figs)] : null,
          people,
          h("p", { "class": "ask-note", text: (refs.figs.length ? T("The AI picked the figures by their captions; it has not seen the images. ") : "") +
            T("The ranking of investigations and the list of experiments still to be done are the team's interpretation, not NASA's. A student project, not affiliated with or endorsed by NASA. Check the sources before relying on this report.") }))));
    }
    /* Printing uses the browser's own dialog on this same page (window.print, @media print in ask.css). Images
       below the fold load now, so the print preview does not show empty boxes for figures not yet scrolled to. */
    Array.prototype.forEach.call(page.querySelectorAll("img[loading='lazy']"), function (img) { img.loading = "eager"; });
    A.main.replaceChildren(modern(page));
    hintsSoon();
  }

  function view(parts) {
    if (parts[0] === "report") { reportPage(); return; }
    chatPage();
    if (savedY) window.scrollTo(0, savedY);                    /* back from a source or a report: the same point */
  }
  A.section({ id: "ask", label: T("Ask"), href: "#/ask" }, view);
})();
