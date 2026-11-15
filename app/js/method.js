/* How this was made: the data, the tools the team used at each stage, and where AI was used and how it was checked. */
(function () {
  "use strict";
  var A = window.OFMW_APP, h = A.h, T = A.T, D = A.D, fmt = A.fmt;
  if (!D) return;
  /* Asked by the main session on 15-nov-2026: the 3D now runs on three.js, and the site serves its own typefaces. */
  A.es({
    "HTML, CSS and JavaScript of our own, with the typefaces Anton, Inter, Public Sans and DM Mono (SIL Open Font License 1.1), served from this site":
      "HTML, CSS y JavaScript propios, con las tipografías Anton, Inter, Public Sans y DM Mono (SIL Open Font License 1.1), servidas desde este sitio",
    "three.js 0.187.0 (MIT), served from this site, with its Draco decoder; gltf-transform 4.5.1 (MIT) and Pillow to lighten them":
      "three.js 0.187.0 (MIT), servido desde este sitio, con su decodificador Draco; gltf-transform 4.5.1 (MIT) y Pillow para aligerarlos",
    "From the repository to this page": "Del repositorio a esta página",
    "Show a NASA model of each world, served from this site: the light versions of the five worlds load with the home page, and the full version of each model only when it opens full screen. The scripts scripts/preparar_modelos.py and scripts/aligerar_glb.py and gltf-transform made the heavy models lighter; the geometry and the insignias are NASA's.":
      "Mostrar un modelo de NASA de cada mundo, servido desde este sitio: las versiones ligeras de los cinco mundos se cargan con la portada, y la versión completa de cada modelo solo al abrir la pantalla completa. Los scripts scripts/preparar_modelos.py y scripts/aligerar_glb.py y gltf-transform aligeraron los modelos pesados; la geometría y las insignias son las de NASA."
  });

  /* stage, tool, what it was used for. Versions are the ones installed when the site was built. */
  var TOOLS = [
    ["Getting the data", "Python 3.14, standard library only", "Download the records, the experimental tables and 738 supporting documents from NASA's PSI repository on November 13, 2026, with a manifest of every file."],
    ["Cleaning the data", "Python 3.14 (csv, json, re) and xlrd 2.0.2 for old Excel files", "Turn the tables of each investigation into one table with one format: one row per test, with the table and the row it comes from."],
    ["Checking the data", "Python scripts of the team", "Recount, against the cleaned data, the 18 figures the team quotes, and count which tests fall near each atmosphere of the challenge."],
    ["Reading the reports", "PyMuPDF 1.28", "Find the quoted passage on its page, render that page as an image, and cut the figures of the reports with their captions."],
    ["Building the site", "HTML, CSS and JavaScript of our own, with the typefaces Anton, Inter, Public Sans and DM Mono (SIL Open Font License 1.1), served from this site", "Every screen of this platform. The data travels with the page, so it opens without a database."],
    ["3D models", "three.js 0.187.0 (MIT), served from this site, with its Draco decoder; gltf-transform 4.5.1 (MIT) and Pillow to lighten them", "Show a NASA model of each world, served from this site: the light versions of the five worlds load with the home page, and the full version of each model only when it opens full screen. The scripts scripts/preparar_modelos.py and scripts/aligerar_glb.py and gltf-transform made the heavy models lighter; the geometry and the insignias are NASA's."],
    ["Publishing", "Vercel, Git and GitHub", "Hosting, the one server function behind the question box, and the history of every change."],
    ["AI inside the platform", "Claude Opus 5.5, through Anthropic's API and its official SDK 1.8.0", "Write the answers and the reports of the question box, only from the data of this site, citing the record, the test or the page behind each statement."],
    ["AI while building", "Claude Code with Claude Fable 5.2", "Write the code and draft the texts under the team's direction. An independent review with Claude Opus 5.5 looked for errors before presenting."]
  ];

  function view() {
    document.title = T("How this was made · One Fire, Many Worlds");
    var num = A.counter(), s = D.summary;
    var tools = A.exp.apa(num.table(), T("Tools used in the project, by stage"),
      h("table", { "class": "exp-how" },
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
    A.main.replaceChildren(h("div", { "class": "wrap exp-page exp-method" },
      h("p", { "class": "exp-backrow" }, A.back("#/sources", T("Sources"))),
      A.intro(T("How this was made"), T("Where the data comes from, which tools the team used at each stage, and where artificial intelligence was used and how it was checked.")),
      h("div", { "class": "exp-read" },
        h("h2", { "class": "exp-h2", text: T("From the repository to this page") }),
        h("ol", { "class": "exp-steps" }, steps.map(function (t) { return h("li", { text: t }); }))),
      h("h2", { "class": "exp-h2", text: T("Tools") }),
      tools,
      h("div", { "class": "exp-read" },
        h("h2", { "class": "exp-h2", text: T("Where AI was used, and how it was checked") }),
        h("p", { text: T("The team chose the challenge, the five worlds and the questions the platform answers, and decided what to keep after each review. AI wrote the code and drafted the summaries, the findings and the caveats from the PSI records and their reports.") }),
        h("p", { text: T("The question box sends the question to an AI model together with the data of this site. The model may only use that data, must cite it, and says so when the data does not hold an answer. It picks figures by their captions; it has not seen the images.") }),
        h("p", { text: T("Three checks stand between the AI and the reader: every figure can be traced to a record, a row or a page; a script recounts the quoted figures; and an independent review found errors that were corrected before presenting. The ranking of investigations and the list of experiments still to be done are the team's interpretation, not NASA's.") }),
        h("p", { "class": "exp-actions" }, h("a", { "class": "c-btn", href: "#/sources", text: T("See the exact page behind each finding") }), h("a", { "class": "c-btn", href: "#/data", text: T("See every test") })))));
  }

  A.route("method", "sources", view);
})();
