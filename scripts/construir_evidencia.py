"""Catalogo de fuentes exactas: la pagina del reporte de donde salio cada hallazgo.

Para cada entrada busca la frase en la pagina indicada del PDF, guarda la imagen de esa pagina en
app/evidence/ y escribe app/data/evidence.js con la cita literal, la zona a resaltar y los enlaces a PSI.
Si la frase no esta en la pagina, la busca en todo el documento y avisa; si no aparece, falla.

Los PDF son archivos bajados de PSI: se leen como datos. Correr con:
    python -E -P scripts/construir_evidencia.py
"""
import csv
import json
import re
import sys
import urllib.parse
from pathlib import Path

import fitz  # pymupdf

RAIZ = Path(__file__).resolve().parent.parent
DOCS = RAIZ / "data" / "raw" / "documentos"
SAL_IMG = RAIZ / "app" / "evidence"
SAL_JS = RAIZ / "app" / "data" / "evidence.js"

DOCUMENTOS = {
    "bre-final": ("PSI-20", "Reports", "PSI-20_Reports_Final_20220201.pdf", "ACME BRE final report (2022)", "Reporte final de ACME BRE (2022)"),
    "bass2": ("PSI-25", "Reports", "PSI-25_Reports_BASS-II Summary Report.pdf", "BASS and BASS-II summary report, NASA/TM-20210011385", "Reporte resumen de BASS y BASS-II, NASA/TM-20210011385"),
    "cfi": ("PSI-39", "Reports", "PSI-39_Reports_CFI Science Final Report.pdf", "CFI science final report", "Reporte final de ciencia de CFI"),
    "same": ("PSI-102", "Reports", "PSI-102_Reports_SAME_Final Science Report.pdf", "SAME final science report", "Reporte final de ciencia de SAME"),
    "samer": ("PSI-101", "Reports", "PSI-101_Reports_SAME-R_Final Report.pdf", "SAME-R final report", "Reporte final de SAME-R"),
    "spice": ("PSI-107", "Reports", "PSI-107_Reports_SPICE_FinalReport.pdf", "SPICE final report", "Reporte final de SPICE"),
    "efield": ("PSI-22", "Reports", "PSI-22_Reports_E-FIELD Flames Final Report.pdf", "E-FIELD Flames final report", "Reporte final de E-FIELD Flames"),
    "guide": (None, None, "researchers_guide_combustion_science_2015.pdf", "A Researcher's Guide to International Space Station Combustion Science (NASA, 2015)", "A Researcher's Guide to International Space Station Combustion Science (NASA, 2015)"),
    # Documentos de contexto que subio el equipo a aportes/ (revisados en aportes/REVISION.md). No son de PSI:
    # viven en data/raw/contexto/ y llevan su propio enlace, el sexto dato.
    "std6001": (None, None, "NASA-STD-6001B_Change3_2025.pdf",
                "NASA-STD-6001B with Change 3, flammability requirements and test procedures (2011, revalidated 2025)",
                "NASA-STD-6001B con Cambio 3, requisitos y pruebas de inflamabilidad (2011, revalidada en 2025)",
                "https://standards.nasa.gov/standard/NASA/NASA-STD-6001"),
    "tm1989": (None, None, "NASA-TM-101463_Friedman_Olson_1989.pdf",
               "Fire Safety Applications for Spacecraft, NASA TM-101463 (1989)",
               "Fire Safety Applications for Spacecraft, NASA TM-101463 (1989)",
               "https://ntrs.nasa.gov/citations/19890015042"),
    "bass2poster": (None, None, "BASS-II_cartel_ASGSR_2014_NTRS-20160000593.pdf",
                    "BASS-II results poster, ASGSR 2014 (NTRS 20160000593)",
                    "Cartel de resultados de BASS-II, ASGSR 2014 (NTRS 20160000593)",
                    "https://ntrs.nasa.gov/citations/20160000593"),
    "same2ices": (None, None, "SAME-2_ICES-2012_NTRS-20130000422.pdf",
                  "SAME-2 smoke particle morphology and size paper, ICES 2012 (AIAA 2012-3536)",
                  "Artículo de morfología y tamaño de partículas de humo de SAME-2, ICES 2012 (AIAA 2012-3536)",
                  "https://ntrs.nasa.gov/citations/20130000422"),
    "meyer2015": (None, None, "Meyer_NASA-TM-2015-218891_NTRS-20160000940.pdf",
                  "Smoke from overheated spacecraft materials, NASA/TM-2015-218891 (ground tests)",
                  "Humo de materiales de nave sobrecalentados, NASA/TM-2015-218891 (pruebas en tierra)",
                  "https://ntrs.nasa.gov/citations/20160000940"),
    "apollo13": (None, None, "Apollo13_caso_Anderson_2011_NTRS-20110015690.pdf",
                 "A Case Study of the Failure on Apollo 13, NASA Marshall Space Flight Center (2011)",
                 "A Case Study of the Failure on Apollo 13, NASA Marshall Space Flight Center (2011)",
                 "https://ntrs.nasa.gov/citations/20110015690"),
}
GUIA = "https://www.nasa.gov/missions/station/a-researchers-guide-to-combustion-science/"
PMMA, SIBAL = "PMMA (acrylic)", "SIBAL (cotton-fiberglass fabric)"

# id, documento, pagina del PDF, frase a resaltar, investigaciones a las que sirve, que sostiene (en, es)
ENTRADAS = [
    ("bre-final-18", "bre-final", 18, "the flames generally persisted for 3 minutes or more", ["PSI-20"],
     "At 27 % oxygen and 10.2 psia, and at 34 % and 8.2 psia, the flames generally persisted; extinction was seen mostly at 21 % oxygen and 14.7 psia.",
     "Con 27 % de oxígeno a 10.2 psia y con 34 % a 8.2 psia, las flamas en general persistían; la extinción se vio sobre todo con 21 % a 14.7 psia."),
    ("bre-final-55", "bre-final", 55, "the flames mostly persisted for 2 minutes or more", ["PSI-20"],
     "The same result stated again in the results section: flames mostly persisted in the two exploration atmospheres.",
     "El mismo resultado, dicho otra vez en la sección de resultados: las flamas persistían en las dos atmósferas de exploración."),
    ("bass2-19", "bass2", 19, "U-shaped flammability boundary", ["PSI-25", "PSI-26"],
     "The tests outlined a U-shaped flammability boundary, with blowoff on one side and quenching on the other.",
     "Las pruebas delinearon una frontera de inflamabilidad en forma de U, con soplado de un lado y extinción por falta de flujo del otro."),
    ("bass2-84", "bass2", 84, "is significantly lower than the observed upward flame spread limit", ["PSI-25", "PSI-26"],
     "Figure 6.10 draws the flammability boundary of PMMA rods. Their minimum oxygen in microgravity, 13.5 %, is lower than the 15.4 % upward flame spread limit measured in normal gravity with an added 4 cm/s forced flow: the material stays flammable under the weak ventilation only found in microgravity. The 15.4 % is a laboratory measurement on rods, not a NASA-STD-6001 Test 1 result; Test 1 gives pass or fail, not an oxygen limit.",
     "La figura 6.10 dibuja la frontera de inflamabilidad de barras de PMMA. Su oxígeno mínimo en microgravedad, 13.5 %, es menor que el límite de 15.4 % de la propagación hacia arriba medido en gravedad normal con 4 cm/s de aire forzado: el material sigue siendo inflamable con la ventilación débil que solo hay en microgravedad. El 15.4 % es una medición de laboratorio con barras, no un resultado de la Prueba 1 de NASA-STD-6001; la Prueba 1 da «pasa» o «no pasa», no un límite de oxígeno.",
     [PMMA]),
    ("bass2-36", "bass2", 36, "COMPARISON OF EXTINCTION VELOCITY", ["PSI-25"],
     "Thin PMMA at 1 atm extinguishes near 10 mm/s at 21 % oxygen and near 30 mm/s at 16 %.",
     "El PMMA delgado a 1 atm se extingue a unos 10 mm/s con 21 % de oxígeno y a unos 30 mm/s con 16 %."),
    ("bass2-109", "bass2", 109, "Concurrent flame growth and extinction over a thin flat cotton-fiberglass", ["PSI-25", "PSI-26"],
     "Conclusions for the cotton-fiberglass fabric: how the flame grows and goes out as the airflow is lowered.",
     "Conclusiones para la tela de algodón y fibra de vidrio: cómo crece la flama y cómo se apaga al bajar el flujo de aire."),
    ("cfi-6", "cfi", 6, "multiple reignition cycles were observed", ["PSI-39"],
     "Above 2 atm, reignition cycles appear: the hot flame goes out by radiative loss, a cool flame follows, and it reignites.",
     "Por encima de 2 atm aparecen ciclos de reignición: la flama caliente se apaga por pérdida radiativa, sigue una flama fría y vuelve a encenderse."),
    ("same-25", "same", 25, "the signal from the ISS detector was more erratic", ["PSI-102"],
     "With Teflon smoke the Shuttle detector gave a strong signal and the Station detector an erratic one, because its particles are mostly smaller than one micrometer.",
     "Con humo de teflón el detector del transbordador dio señal fuerte y el de la Estación una señal errática, porque sus partículas miden casi todas menos de un micrómetro."),
    ("same-28", "same", 28, "show strong signals on the Space Shuttle detector", ["PSI-102"],
     "Every test in the series gave a strong signal on the Shuttle ionization detector.",
     "Todas las pruebas de la serie dieron señal fuerte en el detector de ionización del transbordador."),
    ("same-56", "same", 56, "count mean diameters are all in the 100 to 200 nm range", ["PSI-102"],
     "The report says the count mean diameters are all in the 100 to 200 nm range, gives 227 nm for silicone rubber on the same page, and warns that one statistic can mislead: almost half of the silicone smoke mass is in particles larger than 1000 nm. In the per-run results, single silicone runs reach 372 nm.",
     "El reporte dice que los diámetros medios por conteo están todos entre 100 y 200 nm, en la misma página da 227 nm para el silicón y advierte que una sola cifra engaña: casi la mitad de la masa del humo de silicón está en partículas de más de 1000 nm. En los resultados por corrida, hay corridas de silicón que llegan a 372 nm."),
    ("samer-5", "samer", 5, "will make detection of this smoke challenging for light scattering devices", ["PSI-101"],
     "The much smaller particles of Kapton and Teflon smoke will be hard to detect with light-scattering devices.",
     "Las partículas mucho más chicas del humo de Kapton y de teflón serán difíciles de detectar con dispositivos de dispersión de luz."),
    ("spice-2", "spice", 2, "Fifty-two smoke points were found", ["PSI-107"],
     "Fifty-two smoke points were found for ethylene, propane, propylene and propylene-nitrogen mixtures.",
     "Se encontraron cincuenta y dos puntos de humo para etileno, propano, propileno y mezclas de propileno con nitrógeno."),
    ("efield-37", "efield", 37, "approximating buoyancy body forces at partial gravity", ["PSI-22"],
     "The report suggests electric fields may be a tool for approximating buoyancy at partial gravity. It is a suggestion, not a measurement.",
     "El reporte sugiere que los campos eléctricos podrían servir para aproximar la flotación en gravedad parcial. Es una sugerencia, no una medición."),
    ("guide-19", "guide", 19, "The glovebox is normally limited to ISS", ["PSI-25", "PSI-26"],
     "The glovebox where BASS ran is normally limited to Station air, 21 % oxygen at one atmosphere; nitrogen was used to go lower. The team reads this as the reason solids were not tested with more oxygen; the page does not say so.",
     "La guantera donde corrió BASS está limitada al aire de la Estación, 21 % de oxígeno a una atmósfera; se usó nitrógeno para bajarlo. El equipo lo lee como la razón de que los sólidos no se probaran con más oxígeno; la página no lo dice."),
    ("guide-22", "guide", 22, "NASA-STD-6001 Test 1 worst case", ["PSI-25", "PSI-26"],
     "The microgravity limiting oxygen is compared with the ground test NASA-STD-6001 Test 1 to evaluate the safety margins of normal-gravity testing.",
     "El oxígeno límite en microgravedad se compara con la prueba en tierra NASA-STD-6001 Test 1 para evaluar los márgenes de seguridad de probar en gravedad normal."),

    # --- Aportes del equipo (14-nov-2026). El octavo dato, cuando lo hay, son los materiales a los que sirve la pagina.
    ("std6001-27", "std6001", 27, "will self-extinguish and not transfer burning debris", ["PSI-25", "PSI-26"],
     "What Test 1 is: the upward flame propagation test of NASA-STD-6001B checks whether a material, lit by a standard ignition source, self-extinguishes and does not pass burning debris to nearby materials. It is run in the worst-case atmosphere the material could be exposed to.",
     "Qué es la Prueba 1: la prueba de propagación de flama hacia arriba de NASA-STD-6001B comprueba si un material, encendido con una fuente de ignición estándar, se apaga solo y no pasa residuos ardiendo a lo que tiene cerca. Se hace en la peor atmósfera a la que el material podría quedar expuesto."),
    ("std6001-28", "std6001", 28, "No test specimen of the five standard-sized specimens burns", ["PSI-25", "PSI-26"],
     "A material passes Test 1 when none of five specimens burns more than 15 cm (6 in) and none spreads the flame by burning debris. The test gives pass or fail in one atmosphere; it does not give an oxygen limit.",
     "Un material pasa la Prueba 1 cuando ninguna de cinco muestras se quema más de 15 cm y ninguna propaga la flama con residuos ardiendo. La prueba da «pasa» o «no pasa» en una atmósfera; no da un límite de oxígeno."),
    ("std6001-29", "std6001", 29, "oxygen level being the highest that the material could witness", ["PSI-25", "PSI-26"],
     "The test gas is an oxygen and nitrogen mixture with the oxygen at the highest level the material could see in use. The same page defines the maximum oxygen concentration as the highest at which at least five specimens pass.",
     "El gas de prueba es una mezcla de oxígeno y nitrógeno con el oxígeno más alto que el material podría ver en uso. La misma página define la concentración máxima de oxígeno como la más alta a la que al menos cinco muestras pasan."),
    ("std6001-30", "std6001", 30, "Air shall not be allowed to flow during tests", ["PSI-25", "PSI-26"],
     "Test 1 is run with no airflow. BASS-II found that in microgravity a material is most flammable under a weak forced flow (summary report, p. 84), a condition this test does not include.",
     "La Prueba 1 se hace sin flujo de aire. BASS-II encontró que en microgravedad un material es más inflamable con un flujo forzado débil (reporte resumen, pág. 84), una condición que esta prueba no incluye."),
    ("std6001-60", "std6001", 60, "may not be representative of real spacecraft applications", ["PSI-25", "PSI-26"],
     "The only place in the 158 pages where the standard mentions microgravity: for the supplemental heat release test (Test 2) it lists microgravity among the factors of a fire risk assessment and says the standard flow conditions may not represent real spacecraft.",
     "El único lugar de las 158 páginas donde la norma menciona la microgravedad: para la prueba suplementaria de liberación de calor (Prueba 2) la pone entre los factores de una evaluación de riesgo y dice que las condiciones de flujo estándar pueden no representar una nave real."),
    ("tm1989-4", "tm1989", 4, "15 cm", ["PSI-25", "PSI-26"],
     "History, 1989: the main acceptance test for spacecraft materials was already the upward flammability test, failed when the flame spreads more than 15 cm. Today's standard keeps the same 15 cm criterion.",
     "Historia, 1989: la prueba principal para aceptar materiales de nave ya era la de inflamabilidad hacia arriba, que se reprueba cuando la flama avanza más de 15 cm. La norma de hoy conserva ese mismo criterio de 15 cm."),
    ("tm1989-5", "tm1989", 5, "submicrometer-sized", ["PSI-102", "PSI-101"],
     "History, 1989: the Shuttle smoke detector was an ionization type with its own fan and a screen that let only submicrometer particles in. The report asks whether that size range represents the smoke of an incipient fire in space, the question SAME later measured.",
     "Historia, 1989: el detector de humo del transbordador era de ionización, con ventilador propio y una malla que solo dejaba entrar partículas de menos de un micrómetro. El reporte pregunta si ese rango de tamaño representa el humo de un incendio incipiente en el espacio, la pregunta que SAME midió después."),
    ("tm1989-7", "tm1989", 7, "Skylab", [],
     "History: the Skylab tests of 1974 were the only solid-material combustion experiments in orbit up to 1989. Venting the chamber to vacuum made the flame burn harder for a moment before it went out, and a poorly dispersed water spray scattered burning material.",
     "Historia: las pruebas de Skylab de 1974 eran los únicos experimentos de combustión de sólidos en órbita hasta 1989. Ventear la cámara al vacío avivó la flama un momento antes de apagarla, y un chorro de agua mal dispersado esparció material ardiendo."),
    ("tm1989-10", "tm1989", 10, "as low as 15", ["PSI-25", "PSI-26"],
     "History, 1989, before BASS: with low-speed ventilation in low gravity, thin paper may burn at oxygen as low as 15 %, below its downward-spread limit in normal gravity without forced flow. The data came from drop-tower tests lasting seconds.",
     "Historia, 1989, antes de BASS: con ventilación de baja velocidad en baja gravedad, el papel delgado puede arder con oxígeno tan bajo como 15 %, por debajo de su límite de propagación hacia abajo en gravedad normal sin aire forzado. Los datos eran de torres de caída, de segundos."),
    ("bass2poster-6", "bass2poster", 6, "Typical Flammability Boundary for a Solid Fuel", ["PSI-25", "PSI-26"],
     "A sketch of a typical flammability boundary for a solid fuel: oxygen against flow speed, a U-shaped flammable zone and the buoyant flow limit of normal gravity. It is a schematic, not measured data.",
     "Un esquema de la frontera de inflamabilidad típica de un sólido: oxígeno contra velocidad del flujo, una zona inflamable en forma de U y el límite del flujo por flotación de la gravedad normal. Es un esquema, no datos medidos."),
    ("bass2poster-14", "bass2poster", 14, "black and clear PMMA rods", ["PSI-25"],
     "The rods of the Material Ignition and Suppression Test in BASS-II were black and clear PMMA in three diameters. The PSI table lists them only as rods; this poster and the summary report name the material.",
     "Las barras del Material Ignition and Suppression Test de BASS-II eran de PMMA negro y transparente en tres diámetros. La tabla de PSI solo dice «rod»; este cartel y el reporte resumen nombran el material.",
     [PMMA]),
    ("bass2poster-15", "bass2poster", 15, "1g tests have higher flame spread", ["PSI-25"],
     "For PMMA rods, flames spread faster in normal gravity (21 % oxygen, natural convection) than in microgravity. The microgravity values are averaged over flow speed and oxygen, so the comparison is not like for like. A lower oxygen limit in microgravity does not mean faster spread.",
     "En barras de PMMA, la flama se propaga más rápido en gravedad normal (21 % de oxígeno, convección natural) que en microgravedad. Los valores de microgravedad están promediados sobre flujo y oxígeno, así que la comparación no es pareja. Un límite de oxígeno más bajo en microgravedad no significa una propagación más rápida.",
     [PMMA]),
    ("bass2poster-18", "bass2poster", 18, "negative Oxygen Margin of Safety", ["PSI-25"],
     "Preliminary figure from 2014, for one rod size: the 1/4 inch PMMA rod blows off at 16 % oxygen in normal gravity but spread steadily at 13.6 % in BASS-II, a negative oxygen margin of 2.4 points. The 2021 summary report gives the final figures, 13.5 % and 15.4 %.",
     "Cifra preliminar de 2014, de un solo tamaño de barra: la barra de PMMA de 1/4 de pulgada se apaga por soplado a 16 % de oxígeno en gravedad normal, pero se propagó de forma estable a 13.6 % en BASS-II, un margen de oxígeno negativo de 2.4 puntos. El reporte resumen de 2021 da las cifras finales, 13.5 % y 15.4 %.",
     [PMMA]),
    ("same2ices-7", "same2ices", 7, "Diameter results for baseline runs", ["PSI-101"],
     "Table 1 gives the smoke particle diameters by material, fresh and aged 720 s. Unaged count mean diameters: Kapton 0.056 µm, Teflon 0.101, lamp wick 0.128, silicone 0.196 and Pyrell 0.204.",
     "La tabla 1 da los diámetros de las partículas de humo por material, recién hecho y envejecido 720 s. Diámetros medios por conteo sin envejecer: Kapton 0.056 µm, teflón 0.101, mecha 0.128, silicón 0.196 y Pyrell 0.204.",
     ["Kapton", "Teflon", "Lampwick", "Silicone", "Pyrell"]),
    ("same2ices-8", "same2ices", 8, "smoke trapped in an avionics enclosure", ["PSI-101"],
     "Kapton and Teflon smoke is much finer and hard for a light-scattering detector; lamp wick and silicone smoke would give very large signals. Particles grow at low flow, so smoke trapped in an electronics enclosure can be expected to be much larger than smoke released in ventilated areas.",
     "El humo de Kapton y de teflón es mucho más fino y difícil para un detector de dispersión de luz; el de mecha y el de silicón darían señales muy grandes. Las partículas crecen con poco flujo, así que el humo atrapado en un gabinete de electrónica se espera mucho más grueso que el que sale en zonas ventiladas.",
     ["Kapton", "Teflon", "Lampwick", "Silicone"]),
    ("same2ices-10", "same2ices", 10, "presented no particles that were visible via TEM", ["PSI-101"],
     "Of 72 samples taken for the electron microscope, silicone rubber left no visible particles, presumably because they were liquid and evaporated. Figure 11 on this page shows the smoke particles of Teflon, Pyrell, lamp wick and Kapton made in orbit.",
     "De 72 muestras tomadas para el microscopio electrónico, el silicón no dejó partículas visibles, se supone que porque eran líquidas y se evaporaron. La figura 11 de esta página muestra las partículas de humo de teflón, Pyrell, mecha y Kapton hechas en órbita.",
     ["Silicone", "Teflon", "Pyrell", "Lampwick", "Kapton"]),
    ("same2ices-11", "same2ices", 11, "This is the case for the Teflon and Pyrell smokes", ["PSI-101"],
     "Teflon and Pyrell smoke particles are solid and stick together in fractal-like clusters. Lamp wick, silicone and Kapton smoke is liquid and merges into larger droplets.",
     "Las partículas de humo de teflón y de Pyrell son sólidas y se pegan en racimos de aspecto fractal. El humo de mecha, de silicón y de Kapton es líquido y se junta en gotas más grandes.",
     ["Teflon", "Pyrell", "Lampwick", "Silicone", "Kapton"]),
    ("same2ices-12", "same2ices", 12, "2 to 3 times larger than those produced at the nominal 8 cm/s flow rate", ["PSI-101"],
     "With no airflow the smoke particles were 2 to 3 times larger than at 8 cm/s. The paper concludes that detectors measuring more than one moment of the size distribution may detect better and reject more false alarms.",
     "Sin flujo de aire, las partículas de humo fueron de 2 a 3 veces más grandes que con 8 cm/s. El artículo concluye que los detectores que miden más de un momento de la distribución de tamaños pueden detectar mejor y rechazar más falsas alarmas."),
    ("meyer2015-5", "meyer2015", 5, "spacecraft fires are expected to be generated from overheating electronics", ["PSI-102", "PSI-101"],
     "Ground tests at NASA White Sands, not in orbit. Spacecraft fires are expected to start from overheated electronics made of flame-resistant materials, so the smoke of interest comes from heating without flame. Ten kinds of smoke were imaged with electron microscopes.",
     "Pruebas en tierra en NASA White Sands, no en órbita. Se espera que un incendio en una nave empiece por electrónica sobrecalentada hecha de materiales resistentes a la flama, así que el humo de interés sale de calentar sin flama. Se retrataron diez tipos de humo con microscopios electrónicos."),
    ("meyer2015-29", "meyer2015", 29, "Teflon particles coagulate into compact spherical agglomerates", ["PSI-102", "PSI-101"],
     "Ground tests: Teflon smoke formed compact spherical clumps, unlike the fractal clusters of Teflon smoke in SAME, both on the ground and on the Station.",
     "Pruebas en tierra: el humo de teflón formó grumos esféricos compactos, a diferencia de los racimos fractales del humo de teflón en SAME, tanto en tierra como en la Estación.",
     ["Teflon"]),
    ("meyer2015-30", "meyer2015", 30, "Kapton smoke particles are consistent in size and morphology with SAME smoke", ["PSI-102", "PSI-101"],
     "Ground tests: Kapton smoke matches the SAME smoke from the Station in size and shape, and Nomex smoke showed tar-ball particles.",
     "Pruebas en tierra: el humo de Kapton coincide en tamaño y forma con el de SAME en la Estación, y el humo de Nomex mostró partículas tipo bola de alquitrán.",
     ["Kapton", "Nomex"]),
    ("apollo13-10", "apollo13", 10, "The shelf drop incident was not mentioned in these discussions", [],
     "Apollo 13, before launch: the oxygen tank would not empty in ground tests, and it was emptied by running its heaters and fans for hours. When the launch decision was discussed, the earlier drop of the tank shelf was not mentioned, and most participants did not know about the heater use.",
     "Apollo 13, antes del lanzamiento: el tanque de oxígeno no se vaciaba en las pruebas en tierra, y se vació prendiendo sus calentadores y ventiladores durante horas. Al discutir el lanzamiento no se mencionó la caída previa del estante del tanque, y la mayoría no sabía del uso de los calentadores."),
    ("apollo13-11", "apollo13", 11, "severe damage to Teflon insulation on wiring", [],
     "Apollo 13: the heaters' thermostatic switches, rated for 28 V, did not open on the 65 V ground supply. The heaters may have reached temperatures as high as about 1,000 °F, which was shown to severely damage the Teflon insulation of the wiring.",
     "Apollo 13: los interruptores térmicos de los calentadores, hechos para 28 V, no se abrieron con la fuente de 65 V de tierra. Los calentadores pudieron llegar a unos 1,000 °F, temperatura que, según se comprobó, daña mucho el aislante de teflón de los cables.",
     ["Teflon"]),
    ("apollo13-12", "apollo13", 12, "the current flow generated a spark which ignited oxygen in the tank", [],
     "Apollo 13, in flight: the wiring in the tank had lost its Teflon insulation; when the crew turned on the tank fans, the current made a spark that ignited the oxygen. The tank burst and damaged the second oxygen tank.",
     "Apollo 13, en vuelo: los cables del tanque habían perdido su aislante de teflón; cuando la tripulación prendió los ventiladores del tanque, la corriente hizo una chispa que encendió el oxígeno. El tanque reventó y dañó el segundo tanque de oxígeno.",
     ["Teflon"]),
]

# Paginas escaneadas: el texto reconocido sale con las letras separadas, asi que la cita se escribe a mano,
# literal, leyendo la pagina. La frase de ENTRADAS sigue sirviendo para marcar la zona en la imagen.
CITA_FIJA = {
    "tm1989-4": "To pass the test, the material either resists ignition or, if ignited, must not sustain a flame propagating more than a stated limit (15 cm at present).",
    "tm1989-5": "In fact, several questions for future space applications must be resolved, namely, (1) is the screened particle-size range most representative of smoke-particle densities generated in incipient space fires?",
    "tm1989-7": "The only on-orbit combustion experiments to date were direct continuations of the early aircraft tests.",
    "tm1989-10": "Under these conditions, the material may burn at oxygen concentrations as low as 15 percent, which is below the measured downward-spread flammability limit in normal gravity with no forced convection.",
    # Titulos de figura o de tabla y texto de cartel: el corte automatico por oraciones agarra rotulos sueltos.
    "bass2poster-6": "Typical Flammability Boundary for a Solid Fuel",
    "same2ices-7": "Table 1: Diameter results for baseline runs for each material (Diameters are in micrometers).",
}

# Fuentes que se citan sin imagen de pagina (se enlaza el documento en PSI)
SIN_IMAGEN = [
    {"id": "bre-thesis", "invs": ["PSI-20"], "docInv": "PSI-20", "file": "PSI-20_Reports_Dissertation-PD-revised_.pdf",
     "doc": {"en": "Dissertation archived with the ACME BRE reports", "es": "Tesis archivada entre los reportes de ACME BRE"},
     "pageLabel": "110-112, 163-164",
     "claim": {"en": "Tables 6.1, E.1 and F.1 give oxygen, pressure and outcome for the 177 BRE tests. The page image is not reproduced here; open the document in PSI.",
               "es": "Las tablas 6.1, E.1 y F.1 dan oxígeno, presión y desenlace de las 177 pruebas de BRE. La imagen de la página no se reproduce aquí; abre el documento en PSI."}},
    # El cartel de FM2 (aporte de Marina) no dice «Public Use Permitted» en NTRS, sino uso por o para el gobierno de
    # Estados Unidos: se cita y se enlaza, pero la imagen de su pagina no se reproduce.
    {"id": "fm2poster-1", "invs": [], "docInv": "", "file": "FM2_cartel_Glenn_2024_NTRS-20240008623.pdf",
     "url": "https://ntrs.nasa.gov/citations/20240008623", "materials": [SIBAL, PMMA],
     "doc": {"en": "Flammability of Materials on the Moon (FM2) poster, Glenn Space Technology Symposium, July 2024 (NTRS 20240008623)",
             "es": "Cartel de Flammability of Materials on the Moon (FM2), Glenn Space Technology Symposium, julio de 2024 (NTRS 20240008623)"},
     "pageLabel": "1",
     "claim": {"en": "Planned, with no lunar data yet (2024): FM2 is a self-contained chamber meant to burn four samples on the lunar surface, two cotton-fiberglass (SIBAL) fabrics in air and two acrylic rods in exploration atmospheres, at 21 % oxygen and 14.7 psia and at 34 % and 8.2 psia. The poster says centrifuge and parabolic flight tests found SIBAL burns downward in air in lunar gravity. The page image is not reproduced here; open the poster at NASA.",
               "es": "Planeado, todavía sin datos de la Luna (2024): FM2 es una cámara autónoma pensada para quemar cuatro muestras en la superficie lunar, dos telas de algodón y fibra de vidrio (SIBAL) en aire y dos barras de acrílico en atmósferas de exploración, con 21 % de oxígeno a 14.7 psia y con 34 % a 8.2 psia. El cartel dice que pruebas en centrífuga y en vuelo parabólico hallaron que el SIBAL arde hacia abajo en aire en gravedad lunar. La imagen de la página no se reproduce aquí; abre el cartel en NASA."}},
    {"id": "fm2poster-1-limits", "invs": [], "docInv": "", "file": "FM2_cartel_Glenn_2024_NTRS-20240008623.pdf",
     "url": "https://ntrs.nasa.gov/citations/20240008623", "materials": [SIBAL, PMMA],
     "doc": {"en": "Flammability of Materials on the Moon (FM2) poster, Glenn Space Technology Symposium, July 2024 (NTRS 20240008623)",
             "es": "Cartel de Flammability of Materials on the Moon (FM2), Glenn Space Technology Symposium, julio de 2024 (NTRS 20240008623)"},
     "pageLabel": "1",
     "claim": {"en": "The FM2 poster states that lunar gravity widens the flammability limits of some materials compared with Earth gravity: less convective heat loss, yet enough buoyant flow to bring fresh oxygen to the flame. Its evidence is centrifuge drops of 5.18 seconds, not a long test; PSI holds no partial-gravity data. The page image is not reproduced here; open the poster at NASA.",
               "es": "El cartel de FM2 afirma que la gravedad lunar amplía los límites de inflamabilidad de algunos materiales frente a la gravedad terrestre: menos pérdida de calor por convección y, aun así, suficiente flujo por flotación para llevar oxígeno a la flama. Su evidencia son caídas en centrífuga de 5.18 segundos, no una prueba larga; PSI no tiene datos de gravedad parcial. La imagen de la página no se reproduce aquí; abre el cartel en NASA."}},
]


def limpio(t):
    #  es la letra mu de la fuente Symbol: sin esto «1 µm» se lee «1 m»
    return re.sub(r"\s+", " ", t.replace("", "µ")).strip()


# Citas que son una tabla: se corta despues del titulo, porque el resto son celdas sueltas (se ven en la imagen)
RECORTE = {"bass2-36": "AT 1 atm"}
FIN_ORACION = re.compile(r"(?<!Ref)(?<!Fig)(?<!al)(?<!vs)\. ")
ENCABEZADO = re.compile(r"^N?ASA/TM\S* \d+ (?:\d+(?:\.\d+)+ )?")


def cita(texto, frase, eid=""):
    """La oracion que contiene la frase, sin el encabezado de pagina ni el numero de seccion."""
    t = limpio(texto)
    i = t.lower().find(frase.lower())
    if i < 0:
        return frase
    ini = max(t.rfind(". ", 0, i), t.rfind("? ", 0, i)) + 2
    m = FIN_ORACION.search(t, i + len(frase))
    fin = m.start() + 1 if m else len(t)
    q = ENCABEZADO.sub("", t[ini:fin])
    if eid in RECORTE and RECORTE[eid] in q:
        q = q[:q.find(RECORTE[eid]) + len(RECORTE[eid])]
    return q[:420]


def main():
    inventario = {(r["id"], r["archivo"]): r for r in csv.DictReader(open(RAIZ / "data" / "raw" / "inventario_archivos.csv", encoding="utf-8-sig"))}
    SAL_IMG.mkdir(parents=True, exist_ok=True)
    salida, avisos = [], []
    abiertos = {}
    for entrada in ENTRADAS:
        eid, doc, pag, frase, invs, en, es = entrada[:7]
        materiales = entrada[7] if len(entrada) > 7 else []
        inv, cat, archivo, titulo_en, titulo_es = DOCUMENTOS[doc][:5]
        enlace = DOCUMENTOS[doc][5] if len(DOCUMENTOS[doc]) > 5 else GUIA
        ruta = (DOCS / inv / cat / archivo) if inv else (RAIZ / "data" / "raw" / "contexto" / archivo)
        if doc not in abiertos:
            abiertos[doc] = fitz.open(ruta)
        pdf = abiertos[doc]
        pagina = pdf[pag - 1]
        zonas = pagina.search_for(frase)
        if not zonas:
            encontradas = [n + 1 for n in range(len(pdf)) if pdf[n].search_for(frase)]
            if not encontradas:
                sys.exit("NO ESTA: %s en %s (pagina %d)" % (frase, archivo, pag))
            avisos.append("%s: la frase no esta en la pagina %d; se uso la %d (aparece en %s)" % (eid, pag, encontradas[0], encontradas))
            pag = encontradas[0]
            pagina = pdf[pag - 1]
            zonas = pagina.search_for(frase)
        w, h = pagina.rect.width, pagina.rect.height
        # 105 puntos por pulgada, pero nunca mas de 1300 px de ancho: una lamina grande saldria enorme
        pix = pagina.get_pixmap(dpi=max(20, min(105, int(1300 * 72 / w))))
        destino = SAL_IMG / (eid + ".jpg")
        destino.write_bytes(pix.tobytes("jpeg", jpg_quality=72))
        descarga = registro = ""
        if inv:
            fila = inventario.get((inv, archivo))
            version = (fila or {}).get("version", "1")
            descarga = "https://psi.nasa.gov/geode-py/ws/studies/%s/download?file=%s&version=%s" % (inv, urllib.parse.quote(archivo), version)
            registro = "https://psi.nasa.gov/physci/repo/data/investigations/" + inv
        else:
            descarga = registro = enlace
        fila_salida = {
            "id": eid, "invs": invs, "docInv": inv or "", "doc": {"en": titulo_en, "es": titulo_es}, "file": archivo,
            "page": pag, "pages": len(pdf), "claim": {"en": en, "es": es},
            "quote": CITA_FIJA.get(eid) or cita(pagina.get_text(), frase, eid),
            "rects": [[round(z.x0 / w, 4), round(z.y0 / h, 4), round(z.x1 / w, 4), round(z.y1 / h, 4)] for z in zonas],
            "img": "evidence/" + destino.name, "w": pix.width, "h": pix.height, "download": descarga, "record": registro,
        }
        if materiales:
            fila_salida["materials"] = materiales
        salida.append(fila_salida)
    for s in SIN_IMAGEN:
        fila = inventario.get((s["docInv"], s["file"]))
        s2 = dict(s)
        s2.update({"page": None, "quote": "", "rects": [], "img": "", "w": 0, "h": 0})
        enlace = s2.pop("url", "")
        if enlace:                                   # documento de contexto, fuera de PSI
            s2.update({"download": enlace, "record": enlace})
        else:
            s2.update({"download": "https://psi.nasa.gov/geode-py/ws/studies/%s/download?file=%s&version=%s" % (s["docInv"], urllib.parse.quote(s["file"]), (fila or {}).get("version", "1")),
                       "record": "https://psi.nasa.gov/physci/repo/data/investigations/" + s["docInv"]})
        salida.append(s2)
    SAL_JS.write_text("window.OFMW_EVIDENCE=" + json.dumps(salida, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8", newline="\n")
    peso = sum(f.stat().st_size for f in SAL_IMG.glob("*.jpg"))
    print("fuentes: %d (%d con imagen) | imagenes: %.1f MB" % (len(salida), len(ENTRADAS), peso / 1e6))
    for e in salida:
        if e["img"]:
            print("  %-14s p%-4s zonas=%d %dx%d | %s" % (e["id"], e["page"], len(e["rects"]), e["w"], e["h"], e["quote"][:110]))
    for a in avisos:
        print("  AVISO:", a)


if __name__ == "__main__":
    main()
