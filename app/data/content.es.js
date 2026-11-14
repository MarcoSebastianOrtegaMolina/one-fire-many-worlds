/* Texto en español de la plataforma. Misma estructura que content.js, solo los campos de texto.
   Todo sale de INVESTIGACION.md. Los resúmenes se escribieron con IA a partir de las fichas de PSI. */
window.OFMW_CONTENT_ES = {
  investigations: {
    "PSI-20": {
      line: "Flamas de gas sobre un quemador poroso que imitan cómo arde un material sólido o líquido, en las tres atmósferas que NASA considera para misiones tripuladas.",
      finding: "Las flamas se extinguían sobre todo con 21 % de oxígeno a 14.7 psia. Con 27 % a 10.2 psia y con 34 % a 8.2 psia, en general persistían dos o tres minutos o más (reporte final de 2022, págs. 18 y 55). Los datos por prueba van en la misma dirección: cerca de 8.2 psia con 30 a 39 % de oxígeno, 25 de 36 flamas siguieron ardiendo hasta que se cortó el combustible.",
      why: "Es el puente más directo entre las flamas de gas y la inflamabilidad de materiales en atmósferas de exploración. 34 de sus 177 pruebas están cerca de las condiciones de una base lunar.",
      caveat: "La presión y el desenlace de cada prueba salen de una tesis archivada entre sus reportes, leída del texto del PDF y todavía sin cotejar a ojo."
    },
    "PSI-25": {
      line: "Muestras sólidas (acrílico, tela de algodón y fibra de vidrio, Nomex, cera) quemadas en un ducto de flujo chico, con el oxígeno bajado de 21 % agregando nitrógeno.",
      finding: "La frontera de inflamabilidad tiene forma de U frente al flujo de aire. La tela de algodón y fibra de vidrio se apaga cuando el flujo baja a entre 1 y 5 cm/s. El PMMA delgado a 1 atm se extingue a unos 10 mm/s con 21 % de oxígeno y a unos 30 mm/s con 16 % (reporte resumen NASA/TM-20210011385, págs. 19, 36 y 109).",
      why: "Es la mejor base de datos de sólidos en PSI y la que muestra el hueco por encima de 22 % de oxígeno: 129 pruebas, todas entre 13.6 y 22.2 %.",
      caveat: "Casi todos los resultados son observaciones en texto libre. La velocidad de propagación viene en 20 pruebas y el desenlace en otras 20."
    },
    "PSI-26": {
      line: "Muestras sólidas quemadas en la guantera de microgravedad con flujo de aire controlado. Es la única investigación que aplicó un supresor, nitrógeno, sobre sólidos ardiendo.",
      finding: "Su matriz de pruebas da, prueba por prueba, oxígeno (16.1 a 22.7 %), presión (14.3 a 14.8 psi), flujo (0 a 44 cm/s) y observaciones. El nitrógeno se aplicó en 7 pruebas.",
      why: "Muy relevante por su objetivo: cuestiona la prueba de inflamabilidad en tierra NASA-STD-6001 Test 1. Tiene el oxígeno más alto registrado para un sólido en PSI, 22.7 %.",
      caveat: "El efecto del nitrógeno está descrito en texto, no medido. Su reporte final aparece en PSI pero da error al abrirlo."
    },
    "PSI-69": {
      line: "Gotas de metanol y de heptano quemadas en atmósferas diluidas con dióxido de carbono o helio, para medir cómo los supresores apagan una flama.",
      finding: "274 pruebas con oxígeno, presión, supresor y desenlace: 186 terminaron en extinción, 61 en disrupción de la gota y 27 ardieron hasta consumirse. 103 se hicieron a 0.7 atm nominales, y 17 de esas con 30 a 34 % de oxígeno.",
      why: "Es la única investigación con supresores, y la única con pruebas individuales de un combustible condensado cerca de la atmósfera de una base lunar. Su documento de diseño dice que cuantifica el efecto de posibles atmósferas de exploración sobre la supresión.",
      caveat: "Solo dos combustibles líquidos. Las pruebas a 0.7 atm midieron de 10.3 a 10.5 psi, apenas arriba de los 10.2 psi que el reto da para una base lunar."
    },
    "PSI-98": {
      line: "Una lámina de algodón y fibra de vidrio de 40.6 por 94 cm quemada dentro de un vehículo de carga Cygnus.",
      finding: "2 muestras con flujo de aire de 20 cm/s y 21.5 a 21.7 % de oxígeno.",
      why: "Pocos puntos, pero a escala real: según nuestra lectura, el fuego más grande quemado a propósito en el espacio.",
      caveat: "La tabla solo trae el tiempo de quemado."
    },
    "PSI-99": {
      line: "Nueve muestras de silicón, algodón y fibra de vidrio, PMMA y Nomex quemadas en un vehículo Cygnus, cada una comparada con la misma prueba en gravedad normal.",
      finding: "El silicón delgado no propagó la flama en microgravedad (largo quemado de casi 0), pero en gravedad normal dos de sus cuatro muestras ardieron completas. El algodón y fibra de vidrio ardió sus 29 cm completos en los dos casos.",
      why: "Es la mejor comparación directa de microgravedad contra gravedad normal, material por material.",
      caveat: "Nueve muestras, con un solo flujo de aire (20 cm/s) y oxígeno como el de la Tierra (21.5 a 22.1 %)."
    },
    "PSI-100": {
      line: "Una muestra grande de algodón y fibra de vidrio quemada en un vehículo Cygnus con más flujo de aire que Saffire-I.",
      finding: "2 muestras a 30 cm/s. La tabla no trae oxígeno ni resultado; los sensores del vehículo dan 19.4 a 20.1 % de oxígeno y 14.4 a 14.5 psi.",
      why: "Relevante por su escala.",
      caveat: "Casi sin datos en la tabla experimental."
    },
    "PSI-101": {
      line: "Humo de materiales de nave sobrecalentados (Kapton, silicón, teflón, mecha de lámpara, Pyrell) medido en microgravedad, incluido cómo envejece.",
      finding: "El humo recién hecho tiene un diámetro medio geométrico de 42 nm (Kapton) a 149 nm (Pyrell); tras 720 s de envejecimiento, de 70 a 293 nm. El reporte final (pág. 5) concluye que el humo de Kapton y de teflón será difícil de detectar con dispositivos de dispersión de luz, y que distinguir el humo del polvo sin falsas alarmas pide un detector que mida más de un momento de la distribución de tamaños.",
      why: "Es la base para diseñar detectores de humo para microgravedad.",
      caveat: "No registra oxígeno ni presión. Las 109 filas son 67 corridas más sus envejecimientos secundarios."
    },
    "PSI-102": {
      line: "Tamaño de las partículas de humo y respuesta de los detectores, medidos en microgravedad en 2007 para teflón, Kapton, silicón, mecha de lámpara y un líquido de referencia.",
      finding: "Los diámetros medios por conteo de las partículas de humo están todos entre 100 y 200 nm (reporte final, pág. 56). El detector de ionización del transbordador dio señal fuerte en todas las pruebas; el de dispersión de luz de la Estación fue errático con humo de teflón, cuyas partículas miden menos de un micrómetro (págs. 25 y 28).",
      why: "Misma relevancia que SAME-R, con menos corridas.",
      caveat: "La tabla experimental tiene 8 renglones; las 45 corridas salen de su archivo de resultados."
    },
    "PSI-159": {
      line: "Flamas esféricas de gas (etano, propano y butano), incluidas flamas inversas donde el oxidante sale del quemador.",
      finding: "333 pruebas con oxígeno, presión y desenlace. 20 flamas normales se hicieron con 33 a 39 % de oxígeno en la cámara a 7.3 psi. En las flamas inversas el oxidante del quemador llega a 85 % de oxígeno.",
      why: "20 pruebas cerca de las condiciones de una base lunar, con gas y no con materiales.",
      caveat: "El 85 % es el gas que sale del quemador, no la atmósfera de la cámara, así que no se cuenta como oxígeno ambiente."
    },
    "PSI-10": {
      line: "Flamas esféricas usadas para encontrar los límites de formación de hollín y de extinción.",
      finding: "327 pruebas con oxígeno y presión juntos; atmósfera de la cámara de 19.8 a 40 % de oxígeno.",
      why: "No estudia materiales, pero sus límites de extinción sirven para modelos.",
      caveat: ""
    },
    "PSI-22": {
      line: "Flamas bajo un campo eléctrico. El reto la nombra como el experimento que imitó la gravedad parcial.",
      finding: "Su reporte final (pág. 37) sugiere que los campos eléctricos podrían aproximar las fuerzas de flotación de la gravedad parcial.",
      why: "Relevante solo como aproximación al hueco de gravedad parcial.",
      caveat: "Es una sugerencia, no una medición. La tabla no trae voltajes ni oxígeno, y su ficha dice que no se hizo para aplicaciones espaciales."
    },
    "PSI-23": {
      line: "Estructura y extinción de flamas esféricas.",
      finding: "Días de prueba con 21 y 30 % de oxígeno cerca de 1 atm, diluidos con nitrógeno o helio.",
      why: "Aporta extinción con helio a 30 % de oxígeno.",
      caveat: "Los datos van por día de prueba, no por prueba individual."
    },
    "PSI-39": {
      line: "Flamas frías en gotas de combustible.",
      finding: "Por encima de unas 2 atm aparecen ciclos de reignición: la flama caliente se apaga por pérdida radiativa, queda una flama fría y vuelve a encenderse hasta consumir la gota (reporte final, págs. 6 y 9). Su resumen de datos trae 227 pruebas con diámetros de extinción, tasas de quemado y reigniciones.",
      why: "Las flamas frías importan para la seguridad porque una gota puede seguir reaccionando después de apagarse la flama visible. Eso lo dice la guía de NASA de 2015 sobre FLEX.",
      caveat: "Oxígeno solo de 17 y 21 %."
    },
    "PSI-47": {
      line: "Dos sesiones de 2005 que probaron un contador de partículas en microgravedad con polvo de prueba. No se quemó nada.",
      finding: "Muy pocos datos: dos sesiones.",
      why: "Sirve para distinguir humo de polvo en un detector. Usó un instrumento que después voló en SAME.",
      caveat: ""
    },
    "PSI-68": {
      line: "Combustión de gotas de ocho combustibles y mezclas.",
      finding: "La tabla es una matriz por combustible con intervalos, no pruebas individuales. Sus 124 llenados medidos van de 16.6 a 39.7 % de oxígeno entre 7.4 y 45.2 psia; ninguno tiene 30 % o más a 11 psia o menos.",
      why: "No cubre condiciones de base lunar. Sí aporta oxígeno alto con helio a 1 y 3 atm.",
      caveat: "No se sabe qué llenado se usó en cada prueba."
    },
    "PSI-107": {
      line: "Puntos de humo de flamas de chorro de gas con aire en coflujo.",
      finding: "435 pruebas distintas con boquilla, gasto de combustible y velocidad del aire (0.3 a 85 cm/s). El reporte final da 52 puntos de humo para etileno, propano, propileno y mezclas de propileno con nitrógeno.",
      why: "El punto de humo dice cuánto hollín produce un combustible, lo que importa para la detección y para la radiación de la flama.",
      caveat: "No registra oxígeno."
    },
    "PSI-21": {
      line: "Flamas de coflujo diluidas cerca de la extinción, para validar modelos.",
      finding: "Solo días de prueba; la tabla no trae oxígeno, presión ni flujo.",
      why: "Sirve para validar modelos de flamas cerca de la extinción.",
      caveat: ""
    },
    "PSI-106": {
      line: "Estructura y despegue de flamas laminares.",
      finding: "12 días de prueba con el combustible del día; sin oxígeno ni flujo.",
      why: "Ciencia de flamas para validar modelos.",
      caveat: ""
    },
    "PSI-62": {
      line: "Estudio en tierra que modela la propagación concurrente de flama sobre sólidos con datos de BASS.",
      finding: "Sin tabla experimental.",
      why: "Es un ejemplo de lo que pide el reto: datos de vuelo que alimentan un modelo predictivo.",
      caveat: ""
    },
    "PSI-115": {
      line: "Estudio en tierra que simula cómo crece el humo con la gravedad, con datos de SAME.",
      finding: "Sin tabla experimental.",
      why: "Une las mediciones de humo en microgravedad con la gravedad normal.",
      caveat: ""
    },
    "PSI-117": {
      line: "Estudio en tierra de flamas frías en gotas, con datos de FLEX.",
      finding: "Sin tabla experimental.",
      why: "Ciencia básica hecha con datos de vuelo.",
      caveat: ""
    },
    "PSI-142": {
      line: "Estudio en tierra de límites de inflamabilidad, con datos de FLEX.",
      finding: "Su tabla es un índice de figuras de artículos, no una lista de pruebas.",
      why: "Ciencia básica hecha con datos de vuelo.",
      caveat: ""
    },
    "PSI-60": {
      line: "Estudio en tierra que vuelve a analizar el hollín de las flamas de SPICE.",
      finding: "Sin tabla experimental.",
      why: "Ciencia básica hecha con datos de vuelo.",
      caveat: ""
    },
    "PSI-179": {
      line: "Muestreo de las partículas del aire de la cabina de la Estación. No se quema nada.",
      finding: "Sin tabla experimental.",
      why: "Describe el polvo de fondo que un detector de humo tiene que distinguir del humo.",
      caveat: "No es una investigación de combustión; se conserva como contexto para la detección."
    }
  },

  worlds: {
    station: {
      headline: "Donde se probó casi todo",
      prevention: "Los sólidos solo se quemaron aquí. 263 filas de sólidos traen oxígeno medido, de 13.6 a 22.7 %: los experimentos bajaron el oxígeno, nunca lo subieron. BASS y BASS-II encontraron una frontera de inflamabilidad en forma de U frente al flujo de aire.",
      detection: "154 corridas de humo en SAME y SAME-R, 131 con tamaño de partícula. El detector de la Estación mide luz dispersada y responde mejor a partículas de más de un micrómetro; el humo de Kapton y de teflón es más fino y será difícil de detectar (reporte final de SAME-R, pág. 5).",
      suppression: "FLEX quemó 274 gotas con dióxido de carbono o helio y registró cómo terminó cada una. BASS aplicó nitrógeno sobre sólidos ardiendo en 7 pruebas.",
      takeaway: "Esta es la referencia. Todos los demás mundos se leen contra ella."
    },
    moon: {
      headline: "Aquí las flamas no se apagan solas",
      prevention: "71 pruebas se hicieron con un aire así, ninguna con sólidos: 34 flamas de gas de ACME BRE, 20 de ACME CFI-G y 17 gotas de FLEX. En BRE, cerca de 8.2 psia con 30 a 39 % de oxígeno, 25 de 36 flamas siguieron ardiendo hasta que se cortó el combustible. Cerca de 14.7 psia con menos de 23 % de oxígeno, las 10 se apagaron solas.",
      detection: "No se hizo ninguna prueba de humo en esta atmósfera. Los experimentos de humo no registran oxígeno ni presión.",
      suppression: "Las 17 gotas de FLEX, a 0.7 atm con 30 a 34 % de oxígeno, son las únicas pruebas de un experimento de supresión cerca de estas condiciones.",
      takeaway: "Ninguna tela ni plástico se ha quemado en microgravedad con el aire de una base lunar en los datos que tiene PSI. La gravedad de la Luna nunca se ha probado."
    },
    suit: {
      headline: "Nunca se ha probado",
      prevention: "Ninguna prueba se acerca a 100 % de oxígeno a 4.3 psi. El oxígeno ambiente más alto en PSI es 40 % y la presión más baja es 6.2 psi.",
      detection: "Sin datos.",
      suppression: "Sin datos.",
      takeaway: "Apollo 1 ardió en una cabina llena de 100 % de oxígeno. PSI no tiene ninguna prueba de combustión en una atmósfera de oxígeno puro."
    },
    mars: {
      headline: "Todavía sin datos",
      prevention: "PSI no tiene datos de combustión en gravedad parcial, y el reto no da una atmósfera para un hábitat en Marte. Sí dice que los resultados de microgravedad y de gravedad normal podrían acotar lo que pasa en medio.",
      detection: "Sin datos.",
      suppression: "Sin datos.",
      takeaway: "ACME E-FIELD Flames sugiere que los campos eléctricos podrían aproximar la flotación de la gravedad parcial. Es una sugerencia en un reporte, no una medición."
    },
    earth: {
      headline: "El otro extremo de la escala",
      prevention: "Saffire-II quemó 9 muestras en órbita y comparó cada una con gravedad normal. El silicón delgado no propagó la flama en microgravedad, pero dos de sus cuatro muestras ardieron completas en gravedad normal. La guía de NASA de 2015 agrega el aviso contrario: los materiales pueden arder con menos oxígeno en microgravedad que en la Tierra, así que la prueba en tierra no es conservadora.",
      detection: "Un detector hecho primero para el transbordador distingue las partículas de combustión del polvo, y se usa en minas (NASA Spinoff, 1978). SAME muestra por qué importa: el tamaño de la partícula decide si un detector ve el humo.",
      suppression: "El reto cita los extintores de niebla fina de agua desarrollados para la Estación como un beneficio en la Tierra. PSI no tiene ninguna prueba con niebla de agua.",
      takeaway: "PSI guarda, para cada investigación, un texto sobre sus beneficios en la Tierra, y cinco estudios en tierra reutilizan datos de vuelo para hacer modelos. Los tanques de aire de bomberos (1976) y la ropa de protección (1982) salieron de trabajo de NASA."
    }
  },

  agenda: {
    "solids-moon": { title: "Quemar sólidos con el aire de una base lunar",
      why: "Ningún sólido con datos en PSI se probó por encima de 22.7 % de oxígeno. Para una base lunar se esperan 30 % o más y 10.2 psi o menos, donde las flamas de gas ya tienden a seguir ardiendo.",
      closest: "ACME BRE imita con gas un material ardiendo en esas mismas atmósferas.", planned: "" },
    "partial-gravity": { title: "Probar flamas en la gravedad de la Luna y de Marte",
      why: "PSI no tiene datos de combustión en gravedad parcial. Todo es microgravedad o gravedad normal.",
      closest: "Saffire-II compara microgravedad con gravedad normal en 9 muestras.", planned: "El reto nombra dos experimentos futuros: LUCI y FM2." },
    "smoke-atmospheres": { title: "Medir el humo en atmósferas de exploración",
      why: "Los experimentos de humo no registran oxígeno ni presión, así que nadie sabe cómo cambia el humo con el aire de una base lunar.",
      closest: "SAME y SAME-R dan el tamaño de partícula de cinco materiales en el aire de la Estación.", planned: "" },
    "suppress-solids": { title: "Medir la supresión sobre sólidos ardiendo",
      why: "Los datos de supresores son de gotas de dos líquidos. Sobre sólidos hay 7 pruebas con nitrógeno cuyo efecto está descrito, no medido. PSI no tiene ninguna prueba con niebla de agua.",
      closest: "FLEX mide la extinción con dióxido de carbono y helio.", planned: "" },
    "suit": { title: "Probar oxígeno puro a baja presión",
      why: "Un traje espacial lleva 100 % de oxígeno a 4.3 psi. La prueba ambiente más cercana en PSI es de 40 % de oxígeno.",
      closest: "ACME CFI-G llega a 85 % de oxígeno, pero solo en el gas que sale del quemador.", planned: "" },
    "materials": { title: "Probar los materiales que vuelan hoy",
      why: "PSI cubre acrílico, algodón y fibra de vidrio, Nomex, cera y unos pocos más. No hay cables, espumas, baterías ni telas de traje.",
      closest: "BASS, BASS-II y Saffire prueban los materiales sólidos que tiene PSI.", planned: "" }
  },

  timeline: [
    { title: "Apollo 1", what: "Incendio en la cabina durante una prueba previa al lanzamiento. La cabina estaba llena de 100 % de oxígeno; la tripulación murió.",
      lesson: "NASA limitó y controló los materiales combustibles, cambió la escotilla y rediseñó los trajes con materiales resistentes al fuego.",
      source: "NASA Safety and Mission Assurance, página de Apollo 1 (sin fecha visible)" },
    { title: "Apollo 13", what: "Un tanque de oxígeno explotó camino a la Luna.",
      lesson: "El reto lo cita como una de las emergencias de fuego y oxígeno que marcaron la seguridad de las naves.",
      source: "Enunciado del reto; el equipo todavía no lee la página de NASA" },
    { title: "Incendio en la estación Mir", what: "Se encendió un generador de oxígeno de combustible sólido. La flama duró varios minutos y al final se apagó sola; el humo llenó los módulos y tardó horas en limpiarse.",
      lesson: "Las lecciones pasaron al diseño y a las operaciones de la Estación Espacial Internacional.",
      source: "NASA, 25 Years Ago: Fire Aboard Space Station Mir (publicado el 23 de febrero de 2022)" },
    { title: "SAME mide el humo en órbita", what: "Tamaño de partícula y respuesta de los detectores para humo hecho en microgravedad.",
      lesson: "Las partículas de humo en microgravedad miden entre 100 y 200 nm de diámetro medio por conteo.", source: "PSI-102" },
    { title: "FLEX empieza a quemar gotas con supresores", what: "274 pruebas con gotas hasta 2011, con dióxido de carbono y helio.",
      lesson: "Cada prueba registra extinción, disrupción o combustión completa.", source: "PSI-69" },
    { title: "BASS y BASS-II queman sólidos", what: "251 pruebas con materiales sólidos hasta 2018, siempre con 22.7 % de oxígeno o menos.",
      lesson: "La frontera de inflamabilidad tiene forma de U frente al flujo de aire.", source: "PSI-26 y PSI-25" },
    { title: "ACME BRE prueba atmósferas de exploración", what: "177 flamas hasta 2021 en las tres atmósferas que NASA considera para misiones tripuladas.",
      lesson: "En condiciones parecidas a las de una base lunar, las flamas en general persistían en vez de apagarse.", source: "PSI-20" },
    { year: "Reciente", title: "Alarma de humo en Artemis II", what: "Sonó una alarma de humo a unas 80,000 millas de casa.",
      lesson: "La detección tiene que funcionar, y ser de fiar, lejos de cualquier ayuda.", source: "Enunciado del reto" },
    { year: "Futuro", title: "LUCI y FM2", what: "Lunar-g Combustion Investigation y Flammability of Materials on the Moon.",
      lesson: "El reto espera que sumen a PSI los primeros datos en gravedad parcial.", source: "Enunciado del reto" }
  ],

  materials: {
    "PMMA (acrylic)": "El sólido más probado en PSI: barras, esferas y láminas en BASS, BASS-II y Saffire-II. No tiene datos de humo.",
    "SIBAL (cotton-fiberglass fabric)": "Probado en cinco investigaciones, desde tiras angostas en la guantera hasta las láminas de 94 cm de Saffire. No tiene datos de humo.",
    "Kapton": "Solo tiene datos de humo. Da las partículas más chicas y la respuesta más débil del detector; el reporte de SAME-R dice que su humo será difícil de detectar con dispersión de luz.",
    "Silicone": "Casi no ardió en microgravedad en Saffire-II, y aun así da las partículas de humo más grandes y la respuesta más fuerte del detector. En gravedad normal, dos de sus cuatro muestras ardieron completas.",
    "Teflon": "Solo tiene datos de humo. El detector de la Estación fue errático con su humo, cuyas partículas miden menos de un micrómetro.",
    "Lampwick": "Solo tiene datos de humo, de SAME y SAME-R.",
    "Wax": "Pruebas con velas, casi todas en BASS. No tiene datos de humo.",
    "Pyrell": "Solo tiene datos de humo, de SAME-R. Su humo recién hecho tiene el diámetro medio geométrico más grande de los cinco materiales, 149 nm.",
    "Nomex": "Unas pocas pruebas en BASS y BASS-II. En Saffire-II, la parte de Nomex de una muestra combinada no encendió.",
    "Ultem": "Dos pruebas en BASS."
  },

  examples: [
    { q: "¿Qué se sabe del fuego con la atmósfera de una base lunar?",
      a: "71 pruebas se hicieron con un aire como el de una base lunar, con 30 % de oxígeno o más a 11 psi o menos, y ninguna con sólidos: 34 flamas de gas de ACME BRE [PSI-20], 20 de ACME CFI-G [PSI-159] y 17 gotas de FLEX [PSI-69]. En BRE, cerca de 8.2 psia con 30 a 39 % de oxígeno, 25 de 36 flamas siguieron ardiendo hasta que se cortó el combustible, mientras que cerca de 14.7 psia con menos de 23 % de oxígeno las 10 se apagaron solas. El reporte final lo dice con palabras [bre-final-18].\n\nNinguna tela ni plástico se ha quemado con ese aire en los datos, y nada se ha probado en la gravedad de la Luna." },
    { q: "¿Qué humo le cuesta más ver al detector de la Estación?",
      a: "El de Kapton y el de teflón. En SAME-R, la señal de oscurecimiento del detector de la Estación cambió una mediana de 0.006 V con humo de Kapton y 0.019 V con teflón, contra 1.08 V con silicón. Sus partículas son las más chicas: una mediana de 110 y 167 nm de diámetro medio por conteo [PSI-101]. El reporte final de SAME-R concluye que el humo de Kapton y de teflón será difícil de detectar con dispositivos de dispersión de luz, y en SAME el detector de la Estación fue errático con humo de teflón [PSI-102] [samer-5] [same-25].\n\nLas cifras del detector son un resumen grueso que ordena materiales. No son un umbral de alarma." },
    { q: "¿Qué supresores se probaron, y sobre qué?",
      a: "Dióxido de carbono y helio, sobre gotas de metanol y de heptano. FLEX hizo 274 pruebas y registró extinción en 186, disrupción de la gota en 61 y combustión completa en 27 [PSI-69]. Sobre sólidos, BASS aplicó nitrógeno en 7 pruebas, pero el efecto está descrito en texto, no medido [PSI-26].\n\nLa niebla de agua, que el reto menciona, no está en los datos: PSI no tiene ninguna prueba con niebla de agua." },
    { q: "¿Hay datos para un hábitat en Marte?",
      a: "Eso no está en los datos. PSI no tiene ninguna prueba de combustión en gravedad parcial, y el reto no da una atmósfera para un hábitat en Marte. Lo más cercano está en los dos extremos de la escala de gravedad: las pruebas de vuelo en microgravedad y Saffire-II, que repitió 9 muestras en gravedad normal [PSI-99].\n\nACME E-FIELD Flames sugiere que los campos eléctricos podrían aproximar la flotación de la gravedad parcial; es una sugerencia de su reporte, no una medición [PSI-22] [efield-37]. El reto nombra dos experimentos futuros, LUCI y FM2." },
    { q: "¿El silicón arde?",
      a: "En microgravedad, casi no: las cuatro muestras de silicón de Saffire-II no propagaron la flama, con un largo quemado de casi 0 [PSI-99]. En gravedad normal las mismas muestras se comportaron distinto: dos ardieron completas, una ardió 7.6 cm y una no ardió.\n\nEl silicón sí da humo cuando se sobrecalienta. En SAME y SAME-R produjo las partículas más grandes y la respuesta más fuerte del detector de la Estación [PSI-101] [PSI-102]. Solo se probó con 21.5 a 22.1 % de oxígeno, así que no se sabe nada de él con el aire de una base lunar." }
  ]
};
