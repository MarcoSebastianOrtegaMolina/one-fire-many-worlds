/* How this was made: the data, the tools the team used at each stage, and where AI was used and how it was checked. */
(function () {
  "use strict";
  var A = window.OFMW_APP, h = A.h, T = A.T, D = A.D, fmt = A.fmt;
  if (!D) return;

  /* stage, tool, what it was used for. Versions are the ones installed when the site was built. */
  var TOOLS = [
    ["Getting the data", "Python 3.14, standard library only", "Download the records, the experimental tables and 738 supporting documents from NASA's PSI repository on November 13, 2026, with a manifest of every file."],
    ["Cleaning the data", "Python 3.14 (csv, json, re) and xlrd 2.0.2 for old Excel files", "Turn the tables of each investigation into one table with one format: one row per test, with the table and the row it comes from."],
    ["Checking the data", "Python scripts of the team", "Recount, against the cleaned data, the 18 figures the team quotes, and count which tests fall near each atmosphere of the challenge."],
    ["Reading the reports", "PyMuPDF 1.28", "Find the quoted passage on its page, render that page as an image, and cut the figures of the reports with their captions."],
    ["Building the site", "HTML, CSS and JavaScript, with no libraries", "Every screen of this platform. The data travels with the page, so it opens without a database."],
    ["Publishing", "Vercel, Git and GitHub", "Hosting, the one server function behind the question box, and the history of every change."],
    ["AI inside the platform", "Claude Opus 5.5, through Anthropic's API and its official SDK 1.8.0", "Write the answers and the reports of the question box, only from the data of this site, citing the record, the test or the page behind each statement."],
    ["AI while building", "Claude Code with Claude Fable 5.2", "Write the code and draft the texts under the team's direction. An independent review with Claude Opus 5.5 looked for errors before presenting."]
  ];

  function view() {
    document.title = T("How this was made · One Fire, Many Worlds");
    var num = A.counter(), s = D.summary;
    var tools = A.apaTable(num.table(), T("Tools used in the project, by stage"),
      h("table", { "class": "how" },
        h("thead", null, h("tr", null, [T("Stage"), T("Tool"), T("What it was used for")].map(function (t) { return h("th", { scope: "col", text: t }); }))),
        h("tbody", null, TOOLS.map(function (r) { return h("tr", null, h("th", { scope: "row", text: T(r[0]) }), h("td", { text: T(r[1]) }), h("td", { text: T(r[2]) })); }))),
      T("Versions are those installed on November 14, 2026. The table lists the tools recorded in the project's repository."));
    var steps = [
      T("Download from PSI: the record of each investigation, its experimental tables and its supporting documents."),
      T("Clean: ") + fmt(s.tests) + T(" individual tests in one table, ") + fmt(s.withO2AndPressure) + T(" of them with both oxygen and pressure. Nothing is filled in: what a table does not give stays empty."),
      T("Classify: each of the ") + s.investigations + T(" investigations by safety front, fuel, equipment and relevance. The relevance grade is the team's reading."),
      T("Check: a script recounts the quoted figures against the data, and a reviewer with a clean context looks for what the builder missed."),
      T("Show: each figure on the site links to its PSI record, to the row of its table or to the page of its report.")
    ];
    A.main.replaceChildren(h("div", { "class": "wrap" }, h("div", { "class": "sheet page" },
      h("p", { "class": "crumb" }, h("a", { href: "#/sources", text: T("Sources") }), " / " + T("How this was made")),
      h("h1", { text: T("How this was made") }),
      h("p", { "class": "intro", text: T("Where the data comes from, which tools the team used at each stage, and where artificial intelligence was used and how it was checked.") }),
      h("h2", { text: T("From the repository to this page") }),
      h("ol", { "class": "steps" }, steps.map(function (t) { return h("li", { text: t }); })),
      h("h2", { text: T("Tools") }),
      tools,
      h("h2", { text: T("Where AI was used, and how it was checked") }),
      h("p", { "class": "prose", text: T("The team chose the challenge, the five worlds and the questions the platform answers, and decided what to keep after each review. AI wrote the code and drafted the summaries, the findings and the caveats from the PSI records and their reports.") }),
      h("p", { "class": "prose", text: T("The question box sends the question to an AI model together with the data of this site. The model may only use that data, must cite it, and says so when the data does not hold an answer. It picks figures by their captions; it has not seen the images.") }),
      h("p", { "class": "prose", text: T("Three checks stand between the AI and the reader: every figure can be traced to a record, a row or a page; a script recounts the quoted figures; and an independent review found errors that were corrected before presenting. The ranking of investigations and the list of experiments still to be done are the team's interpretation, not NASA's.") }),
      h("p", { "class": "links" }, h("a", { href: "#/sources", text: T("See the exact page behind each finding") }), " · ", h("a", { href: "#/data", text: T("See every test") })))));
  }

  A.route("method", "sources", view);
})();
