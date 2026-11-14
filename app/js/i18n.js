/* Language: English is the source; Spanish is a dictionary keyed by the English text.
   The language is fixed for a page load: switching it saves the choice and reloads. */
(function () {
  "use strict";
  var lang = "en";
  try { lang = localStorage.getItem("ofmw-lang") || ""; } catch (e) { lang = ""; }
  var asked = /[?&]lang=(en|es)\b/.exec(location.search);      /* a link can carry the language: ?lang=es */
  if (asked) lang = asked[1];
  if (lang !== "en" && lang !== "es") lang = /^es/i.test(navigator.language || "") ? "es" : "en";
  document.documentElement.lang = lang;

  var ES = {
    /* shell */
    "Worlds": "Mundos", "Investigations": "Investigaciones", "Materials": "Materiales", "Timeline": "Línea de tiempo",
    "Will it burn?": "¿Arderá?", "Data": "Datos", "Ask": "Preguntar", "Light sheet": "Hoja clara", "Dark board": "Pizarrón oscuro",
    "Skip to content": "Saltar al contenido", "Sections": "Secciones",
    "Data: NASA Physical Sciences Informatics (PSI) Data Repository, downloaded November 13, 2026. Every figure traces to a PSI record, table or report.":
      "Datos: repositorio Physical Sciences Informatics (PSI) de NASA, descargado el 13 de noviembre de 2026. Cada cifra sale de una ficha, tabla o reporte de PSI.",
    "Summaries were written with AI from those records. The ranking of investigations and the list of experiments still to be done are the team's interpretation, not NASA's.":
      "Los resúmenes se escribieron con IA a partir de esas fichas. El orden de las investigaciones y la lista de experimentos que faltan son interpretación del equipo, no de NASA.",
    "Team Hamác, 2026 NASA Space Apps Challenge, Flame in Freefall. A student project, not affiliated with or endorsed by NASA.":
      "Equipo Hamác, NASA Space Apps Challenge 2026, Flame in Freefall. Proyecto estudiantil, sin relación oficial con NASA ni respaldo suyo.",
    "The fuel names, test results and NASA's own text are shown in English, as in the repository.": "Los nombres de combustibles, los resultados de las pruebas y el texto de NASA se muestran en inglés, como en el repositorio.",
    /* fuel types and fronts */
    "Solids: fabrics, acrylic, wax": "Sólidos: telas, acrílico, cera", "Liquids: fuel droplets": "Líquidos: gotas de combustible", "Gases": "Gases",
    "Prevent": "Prevenir", "Detect": "Detectar", "Suppress": "Apagar",
    "Prevention": "Prevención", "Detection": "Detección", "Suppression": "Supresión", "Flame science": "Ciencia de flamas",
    "prevention": "prevención", "detection": "detección", "suppression": "supresión",
    "solid": "sólido", "liquid": "líquido", "gas": "gas", "other": "otro", "Solid": "Sólido", "Liquid": "Líquido", "Gas": "Gas", "Other": "Otro",
    "solid tests": "pruebas con sólidos", "liquid tests": "pruebas con líquidos", "gas tests": "pruebas con gases",
    "solid test": "prueba con sólidos", "liquid test": "prueba con líquidos", "gas test": "prueba con gases",
    "High": "Alta", "Medium": "Media", "Low": "Baja", "N/a": "No aplica",
    "High relevance.": "Relevancia alta.", "Medium relevance.": "Relevancia media.", "Low relevance.": "Relevancia baja.", "N/a relevance.": "Relevancia no asignada.",
    /* nouns for counts */
    "test": "prueba", "tests": "pruebas", "sample": "muestra", "samples": "muestras", "investigation": "investigación", "investigations": "investigaciones",
    "publication": "publicación", "publications": "publicaciones", "burn test": "prueba de quemado", "burn tests": "pruebas de quemado",
    "smoke run": "corrida de humo", "smoke runs": "corridas de humo",
    /* worlds: names and conditions that come from the data */
    "Station and spacecraft": "Estación y naves", "Moon base and rover": "Base lunar y rover", "Spacesuit": "Traje espacial", "Mars habitat": "Hábitat en Marte", "Earth": "Tierra",
    "microgravity": "microgravedad", "1/6 of Earth gravity": "1/6 de la gravedad terrestre", "depends on where it is worn": "depende de dónde se use",
    "about 3/8 of Earth gravity": "cerca de 3/8 de la gravedad terrestre", "normal gravity": "gravedad normal",
    "Microgravity": "Microgravedad", "Depends on where it is worn": "Depende de dónde se use", "About 3/8 of Earth gravity": "Cerca de 3/8 de la gravedad terrestre", "Normal gravity": "Gravedad normal",
    "Earth-like air: about 21 % oxygen at 14.7 psi": "Aire como el de la Tierra: cerca de 21 % de oxígeno a 14.7 psi",
    "30 % oxygen or more at 10.2 psi or less (expected)": "30 % de oxígeno o más a 10.2 psi o menos (esperado)",
    "100 % oxygen at 4.3 psi": "100 % de oxígeno a 4.3 psi", "Not specified in the challenge": "El reto no lo dice", "About 21 % oxygen at 14.7 psi": "Cerca de 21 % de oxígeno a 14.7 psi",
    "Oxygen 19.5 to 23.5 % with pressure 13.5 to 16 psi": "Oxígeno de 19.5 a 23.5 % con presión de 13.5 a 16 psi",
    "Oxygen 30 % or more with pressure 11 psi or less": "Oxígeno de 30 % o más con presión de 11 psi o menos",
    "Oxygen 95 % or more with pressure 5 psi or less": "Oxígeno de 95 % o más con presión de 5 psi o menos",
    "No partial-gravity combustion data exists in PSI": "PSI no tiene datos de combustión en gravedad parcial",
    "PSI holds flight data; normal-gravity results come from one paired test": "PSI tiene datos de vuelo; los resultados en gravedad normal salen de un solo experimento con pares",
    "Same oxygen, pressure not reported": "Mismo oxígeno, sin presión reportada", "With the exact 10.2 psi cut": "Con el corte exacto de 10.2 psi",
    "Highest ambient oxygen and lowest pressure ever tested": "El oxígeno ambiente más alto y la presión más baja que se han probado",
    "Partial-gravity tests in PSI": "Pruebas en gravedad parcial en PSI", "40 % and 6.2 psi": "40 % y 6.2 psi",
    /* gravity axis */
    " compared with normal gravity": " comparadas con gravedad normal", "No data": "Sin datos", " in air like this": " con un aire parecido",
    "No test in air like this": "Ninguna prueba con un aire parecido", "no combustion data between the two ends": "sin datos de combustión entre los dos extremos",
    "Worlds, ordered by gravity": "Mundos, ordenados por gravedad", "Off the scale: worn in any gravity": "Fuera de la escala: se usa en cualquier gravedad",
    "Every flight test in NASA's repository ran in microgravity. One experiment repeated its samples in normal gravity. Nothing has been burned at the gravity of the Moon or Mars.":
      "Todas las pruebas de vuelo del repositorio de NASA se hicieron en microgravedad. Un experimento repitió sus muestras en gravedad normal. Nada se ha quemado a la gravedad de la Luna ni de Marte.",
    /* plane */
    "Oxygen against pressure. ": "Oxígeno contra presión. ", " tests of this investigation are highlighted over all ": " pruebas de esta investigación resaltadas sobre las ",
    "Oxygen against pressure for ": "Oxígeno contra presión de ", " tests, with a cross at ": " pruebas, con una cruz en ", " percent oxygen and ": " por ciento de oxígeno y ",
    " tests. ": " pruebas. ", "Pressure, psi": "Presión, psi", "Oxygen in the atmosphere": "Oxígeno en la atmósfera", " at ": " a ", " % oxygen and ": " % de oxígeno y ",
    " of this investigation at ": " de esta investigación a ", "Earth air (tested in microgravity)": "Aire de la Tierra (probado en microgravedad)",
    "Station and Earth air": "Aire de la Estación y de la Tierra", "Spacesuit: 100 % oxygen at 4.3 psi, above this chart": "Traje: 100 % de oxígeno a 4.3 psi, arriba de esta gráfica",
    "Mars: no atmosphere given, no data at its gravity": "Marte: sin atmósfera definida ni datos a su gravedad", "Atmospheres NASA considers for crews": "Atmósferas que NASA considera para tripulaciones",
    "The cross is the atmosphere you set and the oval is the window counted as near it. ": "La cruz es la atmósfera que fijaste y el óvalo es la ventana que cuenta como cercana. ",
    "This oxygen level is above the chart, so the cross sits at its top edge. ": "Ese oxígeno queda arriba de la gráfica, así que la cruz se dibuja en el borde superior. ",
    "Each circle groups tests at one oxygen level and pressure.": "Cada círculo agrupa las pruebas hechas con un mismo oxígeno y una misma presión.",
    "The tests of this investigation that record both oxygen and pressure are drawn in full colour over every other test in the repository.": "Las pruebas de esta investigación que traen oxígeno y presión se dibujan a todo color sobre las demás pruebas del repositorio.",
    "This investigation has no test with both oxygen and pressure recorded, so nothing is highlighted.": "Esta investigación no tiene pruebas con oxígeno y presión a la vez, así que no hay nada resaltado.",
    "Each circle groups the tests run at one oxygen level and pressure; larger means more tests. ": "Cada círculo agrupa las pruebas hechas con un mismo oxígeno y una misma presión; mientras más grande, más pruebas. ",
    " of ": " de ", " tests with both values are drawn: ": " pruebas con los dos datos están dibujadas: ", " are above 24 psi and ": " quedan arriba de 24 psi y ",
    " are inverse flames, where the oxygen leaves the burner and is not the chamber air.": " son flamas inversas, donde el oxígeno sale del quemador y no es el aire de la cámara.",
    /* ranking */
    " also burned in normal gravity": " quemadas también en gravedad normal", "Ground study built on flight data": "Estudio en tierra hecho con datos de vuelo",
    " in flight; oxygen and pressure not recorded": " en vuelo; sin oxígeno ni presión registrados", "Not tested in this air; ": "Sin pruebas en este aire; ", " elsewhere": " en otras condiciones",
    "No individual tests in the data": "Sin pruebas individuales en los datos",
    /* world sheet */
    "Gravity": "Gravedad", "Air": "Aire", "Evidence": "Evidencia", "samples burned in orbit and compared with normal gravity": "muestras quemadas en órbita y comparadas con gravedad normal",
    "tests in air like this": "pruebas con un aire parecido", "Also": "Además", "What is known, front by front": "Lo que se sabe, frente por frente",
    "NASA's fire safety work has three fronts. Investigations are ordered by how much they tested in this world's air, then by relevance to fire safety. The order is our reading of the data.":
      "La seguridad contra incendios de NASA tiene tres frentes. Las investigaciones van ordenadas por cuánto probaron con el aire de este mundo y luego por su relevancia para la seguridad. El orden es nuestra lectura de los datos.",
    "No data.": "Sin datos.", "No data for this world.": "Sin datos para este mundo.", "Investigations, most relevant first": "Investigaciones, de más a menos relevante",
    "Supporting flame science, not tied to one front: ": "Ciencia de flamas de apoyo, sin un frente propio: ", " in air like this)": " con un aire parecido)",
    "The same sample, in orbit and on the ground": "La misma muestra, en órbita y en tierra",
    "Saffire-II burned nine samples in a cargo vehicle and repeated each in normal gravity. Gravity changes the verdict for some materials.": "Saffire-II quemó nueve muestras en un vehículo de carga y repitió cada una en gravedad normal. La gravedad cambia el veredicto de algunos materiales.",
    "Sample": "Muestra", "Material": "Material", "Thickness": "Espesor", "Flow": "Flujo", "Burned in microgravity": "Ardió en microgravedad", "Burned in normal gravity": "Ardió en gravedad normal",
    "Source: PSI-99 experimental table. Airflow 20 cm/s, oxygen about 21.5 to 22.1 %. \"Complete\" means the whole sample burned.": "Fuente: tabla experimental de PSI-99. Flujo de aire de 20 cm/s, oxígeno de 21.5 a 22.1 %. «Complete» quiere decir que ardió la muestra entera.",
    "What to burn next": "Lo que falta quemar",
    "Experiments that do not exist yet for this world. The list and its order are our proposal, drawn from the gaps in the data.": "Experimentos que todavía no existen para este mundo. La lista y su orden son propuesta nuestra, sacada de los huecos de los datos.",
    "Closest evidence today: ": "Lo más cercano hoy: ", "Nothing listed for this world.": "No hay nada en la lista para este mundo.",
    "The data did not load": "Los datos no cargaron",
    "This page needs data/data.js and data/content.js next to it. Rebuild them with: python scripts/construir_datos_app.py": "Esta página necesita data/data.js y data/content.js junto a ella. Se vuelven a generar con: python scripts/construir_datos_app.py",
    /* investigations */
    "went out by itself": "se apagó sola", "kept burning": "siguió ardiendo", "did not ignite or spread": "no encendió o no propagó",
    "Not recorded": "No registrado", "Not classified in the data": "Sin clasificar en los datos", "Not given in the table": "No viene en la tabla", "Not given": "No viene",
    "All": "Todos", "Investigation": "Investigación", "Front": "Frente", "Fuel": "Combustible", "Tests": "Pruebas", "Oxygen": "Oxígeno", "Pressure": "Presión", "Relevance": "Relevancia",
    "Investigations · One Fire, Many Worlds": "Investigaciones · One Fire, Many Worlds", "Compare": "Comparar", " ascending": " ascendente", " descending": " descendente",
    "Compare ": "Comparar ", "None": "Ninguna", "The ": "Las ",
    " combustion investigations in NASA's repository that bear on fire safety, ranked by relevance. The relevance grade is our reading of each record, and every record explains it.":
      " investigaciones de combustión del repositorio de NASA que tocan la seguridad contra incendios, ordenadas por relevancia. El grado de relevancia es nuestra lectura de cada ficha, y cada ficha lo explica.",
    "Hardware": "Equipo", " side by side": " lado a lado", "Tick two or three to compare": "Marca dos o tres para comparar",
    "No investigation matches these filters. Set a filter back to All.": "Ninguna investigación cumple estos filtros. Regresa un filtro a Todos.",
    " shown. Tests are the individual tests in the cleaned data; some investigations publish only test days or no table at all.": " en la lista. Las pruebas son las individuales de los datos limpios; algunas investigaciones publican solo días de prueba o ninguna tabla.",
    "No such investigation": "No existe esa investigación", "There is no record called ": "No hay una ficha llamada ", "See all investigations": "Ver todas las investigaciones",
    "Fuels": "Combustibles", "Shape and size": "Forma y tamaño", "Airflow": "Flujo de aire", "What varied": "Qué varió", "Not visible in the table": "No se ve en la tabla",
    "What was measured": "Qué se midió", "How tests ended": "Cómo terminaron las pruebas", "Years": "Años", " individual tests in the data": " pruebas individuales en los datos",
    "What it found": "Qué encontró", "Caveat. ": "Aviso. ",
    "Summary, finding and caveat were written with AI from the PSI record and its reports, then checked against the data.": "El resumen, el hallazgo y el aviso se escribieron con IA a partir de la ficha de PSI y sus reportes, y se cotejaron con los datos.",
    "In NASA's words": "En palabras de NASA", "Text from the PSI record, unchanged.": "Texto de la ficha de PSI, sin cambios y en inglés.",
    "Objectives": "Objetivos", "Approach": "Enfoque", "Hypothesis": "Hipótesis", "Benefits on Earth": "Beneficios en la Tierra", "Its tests": "Sus pruebas",
    "Test": "Prueba", "Fuel or material": "Combustible o material", "Result": "Resultado", "Source row": "Fila de origen", "Showing ": "Se muestran ", ". Source: ": ". Fuente: ",
    "Cite and open": "Citar y abrir", "Open the PSI record": "Abrir la ficha en PSI", " listed · record version ": " listadas · versión de la ficha ", ", modified ": ", modificada el ", " · license ": " · licencia ",
    "Compare · One Fire, Many Worlds": "Comparar · One Fire, Many Worlds", "In one line": "En una línea", "Fuel type": "Tipo de combustible", "Same": "Igual", "Differs": "Distinto",
    " / Compare": " / Comparar", " and ": " y ", "The attributes the challenge asks to compare, side by side. ": "Los atributos que el reto pide comparar, lado a lado. ",
    " are the same across these investigations; the rest differ.": " coinciden entre estas investigaciones; los demás son distintos.", "Attribute": "Atributo", "Change the selection": "Cambiar la selección",
    " to ": " a ", "(no id)": "(sin id)",
    /* data-derived words */
    "fuel or material": "combustible o material", "oxygen": "oxígeno", "pressure": "presión", "airflow": "flujo de aire", "flow direction": "dirección del flujo",
    "diluent or suppressant": "diluyente o supresor", "shape and size": "forma y tamaño",
    "end": "fin", "final time (s)": "tiempo final (s)", "flow (cm/s)": "flujo (cm/s)", "width (cm)": "ancho (cm)", "spread rate (mm/s)": "velocidad de propagación (mm/s)",
    "burn time (min)": "tiempo de quemado (min)", "sides burning": "lados ardiendo", "thickness (mm)": "espesor (mm)", "outcome (report table 7.1)": "desenlace (tabla 7.1 del reporte)",
    "full analysis": "análisis completo", "hot burning rate (mm2/s)": "tasa de quemado caliente (mm2/s)", "hot flame time (s)": "tiempo de flama caliente (s)",
    "hot extinction diameter (mm)": "diámetro de extinción caliente (mm)", "cool burning rate (mm2/s)": "tasa de quemado fría (mm2/s)", "cool extinction diameter (mm)": "diámetro de extinción fría (mm)",
    "reignitions": "reigniciones", "burn time (s)": "tiempo de quemado (s)", "burning rate": "tasa de quemado", "extinction diameter (mm)": "diámetro de extinción (mm)", "burn time": "tiempo de quemado",
    "burn length in microgravity": "largo quemado en microgravedad", "spread rate in microgravity": "propagación en microgravedad", "count mean diameter (nm)": "diámetro medio por conteo (nm)",
    "diameter of average mass (nm)": "diámetro de masa promedio (nm)", "mass loss": "pérdida de masa", "flame out (GMT)": "flama apagada (GMT)", "hot ignition": "ignición caliente", "color": "color", "cool flame": "flama fría",
    "CIR with the ACME insert": "CIR con el inserto ACME", "CIR with the MDCA droplet apparatus": "CIR con el aparato de gotas MDCA", "Microgravity Science Glovebox (MSG)": "Guantera de microgravedad (MSG)",
    "Cygnus cargo vehicle": "Vehículo de carga Cygnus", "Ground study, no flight hardware": "Estudio en tierra, sin equipo de vuelo", "Other hardware": "Otro equipo",
    "PMMA (acrylic)": "PMMA (acrílico)", "SIBAL (cotton-fiberglass fabric)": "SIBAL (tela de algodón y fibra de vidrio)", "Silicone": "Silicón", "Teflon": "Teflón", "Lampwick": "Mecha de lámpara", "Wax": "Cera",
    /* materials */
    "Materials · One Fire, Many Worlds": "Materiales · One Fire, Many Worlds", "Material passport": "Pasaporte de material",
    "Prevention starts with choosing materials. For each solid material in NASA's repository: was it burned, what smoke does it make, and does the Station detector see that smoke? ":
      "La prevención empieza por elegir materiales. Para cada material sólido del repositorio de NASA: ¿se quemó, qué humo da y el detector de la Estación ve ese humo? ",
    "Only ": "Solo el ", " has all three answers.": " tiene las tres respuestas.", " materials have all three answers.": " materiales tienen las tres respuestas.",
    "Burn tests": "Pruebas de quemado", "Oxygen tested": "Oxígeno probado", "Smoke runs": "Corridas de humo", "Smoke particle size": "Tamaño de la partícula de humo", "Detector response": "Respuesta del detector",
    "Particle size is the median count mean diameter of the SAME-R runs. Detector response is the median change in the obscuration signal of the Station smoke detector in SAME-R; it is a coarse summary that ranks materials and does not give an alarm threshold.":
      "El tamaño de partícula es la mediana del diámetro medio por conteo de las corridas de SAME-R. La respuesta del detector es la mediana del cambio en la señal de oscurecimiento del detector de humo de la Estación en SAME-R; es un resumen grueso que ordena materiales y no da un umbral de alarma.",
    "No such material": "No existe ese material", "See all materials": "Ver todos los materiales", "% oxygen": "% de oxígeno", " and airflow of ": " y flujo de aire de ",
    "Recorded endings: ": "Desenlaces registrados: ", "Results are free-text observations; no ending is classified in the data.": "Los resultados son observaciones en texto libre; los datos no clasifican ningún desenlace.",
    "Never tested above 22.7 % oxygen: nothing is known about it in Moon-base air.": "Nunca se probó por encima de 22.7 % de oxígeno: no se sabe nada de él con el aire de una base lunar.",
    "No burn test in the repository.": "El repositorio no tiene pruebas de quemado.", " with particle size in SAME-R.": " con tamaño de partícula en SAME-R.", "Median particle diameter: ": "Mediana del diámetro de partícula: ",
    "No smoke measurement in the repository.": "El repositorio no tiene mediciones de humo.", "Median change in the Station detector signal: ": "Mediana del cambio en la señal del detector de la Estación: ",
    "From ": "De ", " SAME-R runs. The Station detector measures scattered light and responds best to particles larger than one micrometer, so finer smoke gives a weaker signal.":
      " corridas de SAME-R. El detector de la Estación mide luz dispersada y responde mejor a partículas de más de un micrómetro, así que el humo más fino da una señal más débil.",
    "No detector data in the repository.": "El repositorio no tiene datos del detector.", "Does it burn?": "¿Arde?", "What smoke does it make?": "¿Qué humo da?", "Does the detector see it?": "¿El detector lo ve?",
    "In orbit and on the ground": "En órbita y en tierra", "Source: PSI-99 (Saffire-II) experimental table. \"Complete\" means the whole sample burned.": "Fuente: tabla experimental de PSI-99 (Saffire-II). «Complete» quiere decir que ardió la muestra entera.",
    "Where it was tested": "Dónde se probó", " tests.": " pruebas.", " at ": " a ",
    /* timeline, evidence, data */
    "Went out by itself": "Se apagó sola", "Kept burning": "Siguió ardiendo", "Did not ignite or spread": "No encendió o no propagó", "No ending recorded": "Sin desenlace registrado",
    "Emergency": "Emergencia", "Experiment": "Experimento", "Planned": "Planeado", "Timeline · One Fire, Many Worlds": "Línea de tiempo · One Fire, Many Worlds",
    "From accident to experiment": "De accidente a experimento",
    "Every emergency left a question, and the experiments in NASA's repository are attempts to answer them. Which investigation answers which event is our reading; the events and their sources are NASA's.":
      "Cada emergencia dejó una pregunta, y los experimentos del repositorio de NASA son intentos de responderlas. Qué investigación responde a cada evento es lectura nuestra; los eventos y sus fuentes son de NASA.",
    "Record: ": "Ficha: ", "Investigations that study this problem: ": "Investigaciones que estudian este problema: ", "Source: ": "Fuente: ", "Test dates in the repository run from ": "Las fechas de las pruebas del repositorio van de ",
    "Station air": "Aire de la Estación", "10.2 psia crew atmosphere": "Atmósfera de 10.2 psia", "8.2 psia crew atmosphere": "Atmósfera de 8.2 psia", "Moon base": "Base lunar",
    "Will it burn? · One Fire, Many Worlds": "¿Arderá? · One Fire, Many Worlds", " % oxygen": " % de oxígeno", " ran within ": " a menos de ", " psi of these conditions.": " psi de estas condiciones.",
    "Of the ": "De las ", " with a recorded ending: ": " con desenlace registrado: ", " kept burning, ": " siguieron ardiendo, ", " went out by themselves": " se apagaron solas",
    " did not ignite or spread": " no encendieron o no propagaron", " have no ending in the data.": " no traen desenlace en los datos.", "None of them has a recorded ending in the data.": "Ninguna trae desenlace registrado en los datos.",
    " By fuel: ": " Por combustible: ", "No test": "Ninguna prueba", "No solid test": "Ninguna prueba con sólidos", "No liquid test": "Ninguna prueba con líquidos", "No gas test": "Ninguna prueba con gases",
    "The closest test is ": "La prueba más cercana es ", "The closest solid test is ": "La prueba con sólidos más cercana es ",
    "The closest liquid test is ": "La prueba con líquidos más cercana es ", "The closest gas test is ": "La prueba con gases más cercana es ",
    "The repository has no test with both oxygen and pressure.": "El repositorio no tiene ninguna prueba con oxígeno y presión a la vez.",
    "The repository has no solid test with both oxygen and pressure.": "El repositorio no tiene ninguna prueba con sólidos que traiga oxígeno y presión a la vez.",
    "The repository has no liquid test with both oxygen and pressure.": "El repositorio no tiene ninguna prueba con líquidos que traiga oxígeno y presión a la vez.",
    "The repository has no gas test with both oxygen and pressure.": "El repositorio no tiene ninguna prueba con gases que traiga oxígeno y presión a la vez.",
    "The nearest tests": "Las pruebas más cercanas", "How it ended": "Cómo terminó", "Nothing to show for this fuel type.": "No hay nada que mostrar para este tipo de combustible.",
    "Rows in lighter text are outside the 5 % and 2 psi window. Only tests whose oxygen is the chamber atmosphere are counted; inverse flames are left out.":
      "Las filas en texto más claro quedan fuera de la ventana de 5 % y 2 psi. Solo cuentan las pruebas cuyo oxígeno es el de la atmósfera de la cámara; las flamas inversas quedan fuera.",
    "Any fuel": "Cualquier combustible", "Start from": "Empieza en",
    "Set an atmosphere and a fuel, and see what was actually tested near it and how those tests ended. This is evidence, not a prediction: where nothing was tested, it says so.":
      "Fija una atmósfera y un combustible, y mira qué se probó de verdad cerca de ahí y cómo terminaron esas pruebas. Es evidencia, no una predicción: donde no se probó nada, lo dice.",
    "Data · One Fire, Many Worlds": "Datos · One Fire, Many Worlds", "Material, test or result": "Material, prueba o resultado",
    "Every individual test behind this site, in one table with one format: ": "Todas las pruebas individuales detrás de este sitio, en una sola tabla con un solo formato: ",
    " tests from the repository, ": " pruebas del repositorio, ", " of them with oxygen and pressure together. Each row names the table and row it came from.": " de ellas con oxígeno y presión a la vez. Cada fila dice de qué tabla y de qué renglón salió.",
    "Search": "Buscar", "Download all tests (CSV)": "Descargar todas las pruebas (CSV)", "No test matches. Clear the search or set a filter back to All.": "Ninguna prueba coincide. Borra la búsqueda o regresa un filtro a Todos.",
    " matching tests.": " pruebas que coinciden.", "Show 100 more": "Mostrar 100 más",
    ". The download is the cleaned table in English; the oxygen reference column tells chamber atmosphere from burner gas.": ". La descarga es la tabla limpia, en inglés; la columna de referencia del oxígeno distingue la atmósfera de la cámara del gas del quemador.",
    "NASA PSI Data Repository, downloaded 2026-11-13": "repositorio PSI de NASA, descargado el 13 de noviembre de 2026",
    /* ask */
    "The answer was cut short.": "La respuesta quedó cortada.", "Live answers are not available right now.": "Las respuestas en vivo no están disponibles ahora.",
    "Live answers need a connection to the server, and it did not respond. The saved answers below work offline.": "Las respuestas en vivo necesitan conexión con el servidor, y no respondió. Las respuestas guardadas de abajo funcionan sin red.",
    "Live answers are not set up on this server.": "Las respuestas en vivo no están configuradas en este servidor.",
    "Ask · One Fire, Many Worlds": "Preguntar · One Fire, Many Worlds", "For example: what is known about smoke detection for a Moon base?": "Por ejemplo: ¿qué se sabe de la detección de humo para una base lunar?",
    "Your question": "Tu pregunta", "Reading the data ...": "Leyendo los datos ...", "Reading the investigations and writing an answer. This can take a few seconds.": "Leyendo las investigaciones y escribiendo la respuesta. Puede tardar unos segundos.",
    "Saved answer, written with AI and checked against the data. ": "Respuesta guardada, escrita con IA y cotejada con los datos. ",
    "Answer written live by AI from this site's data. Check the cited records before relying on it. ": "Respuesta escrita en vivo por IA con los datos de este sitio. Revisa las fichas citadas antes de apoyarte en ella. ",
    "No live answer": "Sin respuesta en vivo", "Pick one of the saved questions below, or try again.": "Elige una de las preguntas guardadas, o inténtalo de nuevo.", "Ask the data": "Pregúntale a los datos",
    "Ask in your own words. The answer is written by AI from the investigations, materials and worlds on this site, cites the PSI record behind each statement, and says so when something is not in the data.":
      "Pregunta con tus palabras. La respuesta la escribe una IA con las investigaciones, los materiales y los mundos de este sitio, cita la ficha de PSI detrás de cada afirmación y dice cuando algo no está en los datos.",
    "Saved questions": "Preguntas guardadas", "These work without a connection.": "Funcionan sin conexión."
  };

  function T(text) {
    if (lang !== "es" || typeof text !== "string") return text;
    return Object.prototype.hasOwnProperty.call(ES, text) ? ES[text] : text;
  }
  /* Spanish content: the same structure as content.js, text fields only. */
  function merge() {
    var C = window.OFMW_CONTENT, E = window.OFMW_CONTENT_ES, k;
    if (lang !== "es" || !C || !E) return;
    for (k in E.investigations) if (C.investigations[k]) Object.assign(C.investigations[k], E.investigations[k]);
    for (k in E.worlds) if (C.worlds[k]) Object.assign(C.worlds[k], E.worlds[k]);
    C.agenda.forEach(function (a) { if (E.agenda[a.id]) Object.assign(a, E.agenda[a.id]); });
    C.timeline.forEach(function (t, i) { if (E.timeline[i]) Object.assign(t, E.timeline[i]); });
    for (k in E.materials) C.materials[k] = E.materials[k];
    C.examples = E.examples;
  }
  merge();
  window.OFMW_LANG = lang;
  window.OFMW_T = T;
  window.OFMW_SETLANG = function (next) {
    try { localStorage.setItem("ofmw-lang", next); } catch (e) { /* private mode: nothing to save */ }
    location.href = location.pathname + "?lang=" + next + location.hash;
  };
})();
