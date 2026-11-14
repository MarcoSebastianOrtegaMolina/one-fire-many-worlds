/* The only server piece of One Fire, Many Worlds: answers a question, or writes a research report, from the
   platform's own data. The key never reaches the page: it is read from the environment (ANTHROPIC_API_KEY)
   by the SDK. Grounding: the knowledge base is built from the files in app/data, the same ones the page reads,
   so an answer can only cite what the site itself shows. */
import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import path from "node:path";

const MODEL = process.env.ASK_MODEL || "claude-opus-5-5";
const MAX_QUESTION = 500;                                  // characters
/* Two kinds of request. A report is longer and costs more, so it has its own caps. Caps are per server instance. */
const KINDS = {
  answer: { effort: process.env.ASK_EFFORT || "low", maxTokens: 4000, rows: 30, perMinute: 8, perDay: Number(process.env.ASK_DAILY_CAP || 300) },
  report: { effort: process.env.REPORT_EFFORT || "medium", maxTokens: 9000, rows: 50, perMinute: 3, perDay: Number(process.env.REPORT_DAILY_CAP || 100) },
};

/* Shared by both kinds and placed before the knowledge base, so the cached prefix is the same for both. */
const COMMON = [
  "You write inside One Fire, Many Worlds, a student dashboard about fire safety in human spaceflight.",
  "It is built on the combustion investigations of NASA's Physical Sciences Informatics (PSI) repository.",
  "Readers are hackathon judges and students, not combustion specialists.",
  "",
  "Use only the knowledge base below and the test rows that come with the request.",
  "Cite every investigation you rely on by its PSI id in square brackets, like [PSI-20]. Cite a test row as [PSI-20 row 123].",
  "When a statement rests on a page listed in reportPages, also cite that page by its id in square brackets, like [bre-final-18], so the reader can open the exact page.",
  "The knowledge base lists figures cut from the reports, each with its caption. You have not seen the images, only the captions.",
  "When a figure would let the reader see what a paragraph says, put it right after that paragraph, on a line of its own, as [[figure:ID]] with an id copied exactly from the list.",
  "Use at most three figures, only where the caption clearly matches what you wrote, and say nothing about a figure beyond what its caption says. When the reader asks for images, give the ones that fit. When no figure fits, use none.",
  "The test rows are picked by keyword and may not be relevant: use them only when they help, and never comment on rows you do not use.",
  "When the knowledge base does not hold the answer, say that it is not in the data and name the closest thing that is.",
  "Keep data apart from interpretation: relevance grades, rankings and the list of experiments still to be done are the team's reading, and you say so when you use them.",
  "If the request is not about this data or about fire safety in space, say in one line that you can only write about this data.",
].join("\n");

const FORMAT = {
  answer: "Write plain text in 180 words or fewer, in the language of the question. No Markdown: no headings, no bullet symbols, no asterisks for bold.",
  report: [
    "Write a research report on the topic the reader gives. The reader is deciding how to keep people safe from fire in a place where people will live, and will check your sources.",
    "Use exactly this layout. The only markup allowed is a line starting with '# ' for the title, '## ' for a section heading and '- ' for a list item. No bold, no tables, no numbered lists.",
    "# Title: at most 14 words, stating the main finding rather than the topic.",
    "## Summary: two or three sentences with the main answer and the main gap.",
    "## What the data says: two to four paragraphs with the numbers and their citations. Figures go here.",
    "## Prevention, detection and suppression: one short paragraph for each front the data covers on this topic; say plainly when a front has no data.",
    "## What has not been tested: two to five list items, each a gap the data shows. Say when an item is the team's interpretation.",
    "## Limits of this report: two or three sentences on what the data cannot support.",
    "Write the title and all five headings in the language of the request, the last one included, without the instructions after the colon.",
    "When test rows come with the request and fit the topic, cite at least three of them as [PSI-N row R] next to the statements they support: the page lists every cited test in a table. When none fits, cite none.",
    "Do not add a list of sources or a closing remark: the page builds the sources from your citations. Between 450 and 700 words, in the language of the request.",
  ].join("\n"),
};

let kb = null;
function load() {
  if (kb) return kb;
  const win = {};
  for (const file of ["data.js", "content.js", "evidence.js", "figures.js"]) {
    const text = fs.readFileSync(path.join(process.cwd(), "app", "data", file), "utf8");
    new Function("window", text)(win);                     // our own generated files, not user input
  }
  const D = win.OFMW, C = win.OFMW_CONTENT, E = win.OFMW_EVIDENCE || [], G = win.OFMW_FIGURES || [];
  const invs = D.investigations.map((i) => ({
    id: i.id, name: i.acr, title: i.title, front: i.front, relevance: i.relevance, fuelType: i.fuelType, fuels: i.fuels,
    tests: i.tests, oxygenPct: i.o2, pressurePsi: i.p, flowCmS: i.flow, hardware: i.hw, years: [i.start, i.end],
    varied: i.varied, measured: i.measures, endings: i.outcomes, testsNearMoonBase: i.nearMoon,
    summary: C.investigations[i.id].line, finding: C.investigations[i.id].finding,
    whyRelevant: C.investigations[i.id].why, caveat: C.investigations[i.id].caveat,
  }));
  const worlds = D.worlds.map((w) => ({ id: w.id, name: w.name, gravity: w.gravity, air: w.air, testsInAirLikeThis: w.near, note: w.nearNote, also: w.extra, ...C.worlds[w.id] }));
  const base = { summary: D.summary, worlds, investigations: invs, materials: D.materials.map((m) => ({ ...m, note: C.materials[m.name] })),
    sameSampleInOrbitAndOnTheGround: D.gravityPairs, experimentsStillToBeDone: C.agenda, timeline: C.timeline,
    reportPages: E.map((e) => ({ id: e.id, investigations: e.invs, document: e.doc.en, page: e.page || e.pageLabel, supports: e.claim.en, passage: e.quote })),
    figures: G.map((f) => ({ id: f.id, investigations: f.invs, document: f.doc.en, page: f.page, caption: f.caption })) };
  kb = { system: COMMON + "\n\nKNOWLEDGE BASE (JSON)\n" + JSON.stringify(base), tests: D.tests, figures: G.length };
  return kb;
}

/* Test rows that share a whole word with the request, so the text can cite individual tests.
   Whole words only: "fire" must not match "Saffire". Spanish names of materials and fuels map to the data. */
const ALIAS = { silicon: "silicone", acrilico: "pmma", acrylic: "pmma", cera: "wax", mecha: "lampwick", metanol: "methanol",
  heptano: "heptane", propano: "propane", etileno: "ethylene", etano: "ethane", butano: "butane", metano: "methane",
  solido: "solid", solidos: "solid", liquido: "liquid", liquidos: "liquid", gases: "gas", solids: "solid", liquids: "liquid" };
const plain = (text) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const words = (text) => (plain(text).match(/[a-z0-9]{3,}/g) || []).map((w) => ALIAS[w] || w);
function rowsFor(question, tests, most) {
  const asked = [...new Set(words(question.replace(/psi[- ]?(\d+)/gi, "psi$1")))];   // "PSI-20" as one word
  if (!asked.length) return [];
  const scored = [];
  for (const t of tests) {
    const hay = new Set(words(t.inv.replace("-", "") + " " + t.acr + " " + t.acr.replace(/-/g, "") + " " + t.fuel + " " + t.family + " " + t.type));
    const score = asked.reduce((n, w) => n + (hay.has(w) ? 1 : 0), 0);
    if (score) scored.push([score, t]);
  }
  scored.sort((a, b) => b[0] - a[0] || a[1].n - b[1].n);
  return scored.slice(0, most).map(([, t]) => ({ id: t.inv, row: t.row, test: t.id, fuel: t.fuel, oxygenPct: t.o2, pressurePsi: t.p, flowCmS: t.flow, ended: t.out, result: t.res.slice(0, 220) }));
}

const hits = { answer: new Map(), report: new Map() };
const today = { answer: 0, report: 0 };
let day = "";
function allowed(ip, kind) {
  const now = Date.now(), stamp = new Date(now).toISOString().slice(0, 10), cap = KINDS[kind];
  if (stamp !== day) { day = stamp; today.answer = 0; today.report = 0; }
  if (today[kind] >= cap.perDay) return "daily";
  const recent = (hits[kind].get(ip) || []).filter((t) => now - t < 60000);
  if (recent.length >= cap.perMinute) { hits[kind].set(ip, recent); return "minute"; }
  recent.push(now); hits[kind].set(ip, recent); today[kind] += 1;
  return "";
}
const LIMIT_MESSAGE = {
  answer: { minute: "Too many questions in a minute. Wait a moment and ask again.", daily: "The daily limit for live answers was reached. The saved answers still work." },
  report: { minute: "Too many reports in a minute. Wait a moment and try again.", daily: "The daily limit for reports was reached. Questions still work." },
};

export default async function handler(req, res) {
  if (req.method === "GET") {                              // status check: shows that the data loads, never the key
    try { const k = load(); return res.status(200).json({ ok: true, liveAnswers: Boolean(process.env.ANTHROPIC_API_KEY), knowledgeBaseChars: k.system.length, tests: k.tests.length, figures: k.figures, reports: true, model: MODEL }); }
    catch (error) { console.error(error); return res.status(500).json({ ok: false, error: "data", message: "The data files did not load on the server." }); }
  }
  if (req.method !== "POST") { res.setHeader("Allow", "GET, POST"); return res.status(405).json({ error: "method", message: "Send the question with POST." }); }
  const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";
  const kind = req.body?.kind === "report" ? "report" : "answer";
  if (!question) return res.status(400).json({ error: "empty", message: "Write a question first." });
  if (question.length > MAX_QUESTION) return res.status(400).json({ error: "long", message: "Keep the question under " + MAX_QUESTION + " characters." });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: "not_configured", message: "Live answers are not set up on this server." });
  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
  const limit = allowed(ip, kind);
  if (limit) return res.status(429).json({ error: "limit", message: LIMIT_MESSAGE[kind][limit] });

  try {
    const { system, tests } = load();
    const cap = KINDS[kind];
    const rows = rowsFor(question, tests, cap.rows);
    const client = new Anthropic();
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: cap.maxTokens,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",                                 // a declined request is re-run on a fallback model in the same call
      output_config: { effort: cap.effort },
      system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } },   // stable prefix: cached across questions and reports
        { type: "text", text: FORMAT[kind] }],
      messages: [{ role: "user", content: (kind === "report" ? "Topic of the report: " : "Question: ") + question + (rows.length ? "\n\nTest rows that may help (JSON):\n" + JSON.stringify(rows) : "") }],
    });
    if (response.stop_reason === "refusal") {
      return res.status(200).json({ answer: "The model declined to answer this question. Try asking about an investigation, a material or a world.", kind: "answer", model: response.model, declined: true });
    }
    const answer = response.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
    return res.status(200).json({ answer: answer || "No answer came back. Ask again.", kind, model: response.model, truncated: response.stop_reason === "max_tokens",
      usage: { input: response.usage.input_tokens, cached: response.usage.cache_read_input_tokens, output: response.usage.output_tokens } });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) return res.status(503).json({ error: "not_configured", message: "Live answers are not set up on this server." });
    if (error instanceof Anthropic.RateLimitError) return res.status(429).json({ error: "limit", message: "The model is busy. Wait a moment and ask again." });
    if (error instanceof Anthropic.APIError) return res.status(502).json({ error: "upstream", message: "The model could not answer just now. Ask again in a moment." });
    console.error(error);
    return res.status(500).json({ error: "server", message: "Something failed on the server. The saved answers still work." });
  }
}
