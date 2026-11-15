# Revisión de los aportes del equipo

Revisado el sábado 14 de noviembre de 2026 por Claude en una sesión aparte, a pedido de Marco Sebastián;
terminado a las 16:50. Cubre todo lo que había en `aportes/` a esa hora (lo último subido es de las 16:30).
Esta revisión no cambió ningún archivo del proyecto: solo propone.

## Resumen en cinco líneas

1. Los tres PDF son lo que dicen ser y se pueden usar: la norma NASA-STD-6001B (vigente, revalidada en
   2025), un cartel de BASS-II de 2014 (NTRS 20160000593) y un memorando de NASA de 1989 (NTRS 19890015042).
2. La norma no sostiene por sí sola la comparación 13.5 % contra 15.4 %: no trae ningún límite de oxígeno. El
   15.4 % sale del reporte de BASS-II y es de barras de PMMA en gravedad normal con 4 cm/s de aire forzado, no
   un resultado de la Prueba 1. La frase de la plataforma es correcta pero le falta esa condición.
3. El cartel de BASS-II no trae pruebas nuevas (sus conteos por investigador coinciden con `data/pruebas.csv`),
   pero sí permite asignar material (PMMA) a 57 filas de BASS-II que hoy dicen «no especificado en la tabla».
4. La guía de uso de medios de NASA, actualizada el 27-oct-2026, trae reglas para productos con IA: prohíbe
   frases del tipo «según NASA» en lo que escribe la IA y prohíbe usar la insignia. Conviene una línea nueva
   en las instrucciones de `api/ask.js`.
5. Diseño y modelos 3D (guía de marca, Horizon, NASA Eyes, modelos de Tierra, Luna, Marte y Estación): sirven
   como referencia y para después de la IA. La lista «Feedback» es una respuesta de otra IA: de sus 14
   afirmaciones comprobé 7 (3 imprecisas y 1 cierta a medias), 1 quedó solo documentada y 6 sin verificar.

## Cómo leer las etiquetas

- **verificado:** abrí hoy el archivo o la fuente primaria y dice eso.
- **documentado:** lo dice una fuente que no abrí completa, o un resultado de búsqueda. No cierra nada solo.
- **por-probar:** es una inferencia mía a partir de cosas verificadas; falta la prueba directa.
- **sin verificar:** no lo comprobé o no pude.

Las páginas de los PDF son las del archivo (la que marca el lector), no la impresa en la hoja, salvo que se
diga. Los enlaces se abrieron con Brave y la extensión Claude in Chrome; la página de la Luna (SVS) se leyó
con WebFetch porque el navegador la redirigía, y tres datos salieron de búsquedas web y van marcados como
«documentado». La distancia de cada fecha es respecto al 14-nov-2026.

## Inventario

| Archivo | De quién | Qué es | Veredicto |
|---|---|---|---|
| `marina/data.pdf` | Marina | Cartel de BASS-II, ASGSR 2014 (NTRS 20160000593) | Usar ahora |
| `marina/19890015042.pdf` | Marina | NASA TM-101463, «Fire Safety Applications for Spacecraft», 1989 | Usar ahora como contexto histórico |
| `marina/NASA Brand Guidelines` | Marina | Enlace a la guía de marca de NASA | Usar ahora como regla de lo que no se puede hacer |
| `marina/NASA Horizon Design System` | Marina | Enlace al repositorio `nasa/hds-core` | Usar después de la IA, solo como referencia |
| `marina/Plataforma oficial de visualizaciones interactivas de NASA` | Marina | Enlace a NASA Eyes | No usar en la plataforma; referencia de interacción |
| `sebastian-martinez/2025_06_25_NASA-STD-6001B_...pdf` | Sebastián Martínez | Norma NASA-STD-6001B con Cambio 3 | Usar ahora |
| `sebastian-martinez/3D Resources` | Sebastián Martínez | Cinco enlaces a modelos 3D de NASA | Usar después de la IA |
| `sebastian-martinez/Feedback` | Sebastián Martínez | Lista de fuentes escrita con otra IA | No usar tal cual; rescatar tres pistas |
| `victor/README.md`, `marco-sebastian/README.md` | | Solo la plantilla de bienvenida | Nada que revisar |
| `marina/README.md`, `sebastian-martinez/README.md`, `README.md`, `PLANTILLA.md` | | Instrucciones de la carpeta | Nada que revisar |

Nadie usó `PLANTILLA.md`, la tabla 5 de `FUENTES.md` está vacía y `BITACORA.md` no tiene renglones del
equipo. Al final van las filas listas para pegar.

---

## 1. `marina/data.pdf`: el cartel de BASS-II

**Qué es (verificado).** «Combustion of Solids in Microgravity: Results from the BASS-II Experiment». Autores:
Paul V. Ferkul, Subrata Bhattacharjee, Carlos Fernandez-Pello, Fletcher Miller, Sandra L. Olson, Fumiaki
Takahashi y James S. T'ien. Cartel presentado en la 30.ª conferencia anual de la American Society for
Gravitational and Space Research, Pasadena, 22 al 26 de octubre de 2014 (hace 12 años). Son 21 láminas. Los
metadatos del archivo dicen título «BASS POIWG Presentation», autor Paul Ferkul, creado el 22-oct-2014.

- Ficha en NTRS: https://ntrs.nasa.gov/citations/20160000593 (documento 20160000593, tipo «Presentation»,
  fecha de publicación 23-oct-2014, informe GRC-E-DAA-TN18274; el pie del sitio dice «Last Modified:
  September 21, 2026»).
- No comprobé que el archivo sea idéntico byte a byte al de NTRS, porque no se podía descargar nada. El
  título, los autores y el contenido coinciden con la ficha. SHA-256 del archivo de Marina:
  `9f2c89db9e1954c3c44409364ed6764f7e7466250264c28ff2d425350287546c`.

**Licencia (verificado).** NTRS dice distribución pública y «Public Use Permitted». La lámina 10 muestra a
un astronauta identificable (Alex Gerst): para uso educativo no hay problema, pero no debe ir en nada
promocional (regla de la guía de medios de NASA, sección 5 de este documento).

**¿Trae pruebas que no estén en `data/pruebas.csv`? No (verificado).** El cartel no tiene tabla por prueba;
da conteos por investigador, y coinciden con las 129 filas de PSI-25:

| Investigador | Cartel (oct-2014) | `data/pruebas.csv` | Nota |
|---|---|---|---|
| Bhattacharjee | 22 puntos de prueba (lám. 12) | 22 | Igual |
| Miller | 20 puntos de prueba (lám. 16) | 20 | Igual |
| T'ien | 29 pruebas (lám. 20) | 29 | Igual |
| Olson | 24 barras (lám. 18) | 27 | Las 3 de más son del 26-feb-2016 (O20, O21, O22) |
| Fernandez-Pello | 54 velocidades de propagación (lám. 14); no da número de pruebas | 27 | No comparable |
| Ferkul | No aparece | 4 | Nomex y cera |

**Qué sí aporta.**

1. **Material de 57 filas (verificado en el cartel; el cambio está por decidir).** En `data/pruebas.csv`, 57
   de las 129 filas de BASS-II tienen `material_familia` = «no especificado en la tabla», porque la tabla de
   PSI solo dice «1/4" clear rod», «3/8" black rod», «100 micron film» o «4 cm spherical section». El cartel
   nombra el material de cada grupo: las láminas de Bhattacharjee son PMMA de 0.1 a 0.4 mm (lám. 12, 5
   filas); las barras de Fernandez-Pello son PMMA negro y transparente de 0.25, 0.375 y 0.5 pulgadas (lám.
   14, 27 filas); las barras de Olson son PMMA (lám. 18, 23 filas); las dos secciones esféricas de T'ien son
   PMMA (lám. 20, 2 filas). El reporte resumen que ya tenemos dice lo mismo de las barras («three sizes of
   clear and black polymethylmethacrylate rods», NASA/TM-20210011385, resumen del capítulo 6). Con eso, el
   PMMA de BASS-II pasaría de 41 a 98 filas y «no especificado» de 57 a 0.
2. **Una figura que explica la comparación con la prueba en tierra (verificado mirando la lámina 6).** Es un
   esquema titulado «Typical Flammability Boundary for a Solid Fuel»: oxígeno contra velocidad del aire, la
   zona inflamable en forma de U y una línea vertical «1-g buoyant flow limit». Es un esquema típico, no
   datos; hay que decirlo en el pie. En el catálogo de figuras tenemos las fronteras medidas (figuras 6.9 y
   6.10 del reporte), pero ninguna que dibuje el límite de gravedad normal.
3. **Un matiz para la IA (verificado, lám. 15).** En barras de PMMA, las pruebas en gravedad normal (21 % de
   oxígeno, convección natural) dieron una propagación más rápida que las de microgravedad. La comparación no
   es pareja: los valores de microgravedad están promediados sobre varios flujos y oxígenos de 16 a 21 %. Aun
   así apunta a que en microgravedad el material arde con menos oxígeno, pero no más rápido. Hoy la plataforma
   solo dice lo primero.
4. **El puente con lo que viene (verificado, lám. 2 y 14).** Entre los objetivos de BASS-II están empezar a
   cerrar la brecha con el método NASA-STD-6001 Test 1 y dar datos preliminares a los investigadores de
   SoFIE; la parte de Fernandez-Pello se llama «Material Ignition and Suppression Test» y habla de atmósferas
   de exploración.

**Lo que repite.** La lámina 19 (frontera de inflamabilidad de barras de PMMA) es la versión preliminar de
la figura 6.9 del reporte de 2021, que ya está en `app/data/figures.js` (`bass2-p83-fig6-9`). Las láminas 7
a 10 (equipo y guantera) repiten las figuras 1.1 y 1.2.

**Lo que choca con la plataforma (verificado).** El cartel da otra pareja de cifras para la misma idea: la
barra de 1/4 de pulgada se apaga por soplado a 16 % de oxígeno en gravedad normal y en BASS-II siguió
propagándose a 13.6 %, un margen negativo de 2.4 puntos (lám. 18). El reporte de 2021 dice 15.4 % contra
13.5 %. No se contradicen (el cartel es preliminar, de una barra y de 2014), pero no deben mezclarse: la
plataforma debe quedarse con el reporte de 2021 y, si cita el cartel, decir «preliminar, 2014».

**Un indicio de paso (por-probar).** La tabla de PSI fecha dos pruebas de T'ien (T9 y T18, filas 109 y 118)
el 24-jun-2018; el reporte resumen repite esa fecha, al lado de pruebas del 23-jun-2014. Como el cartel de
octubre de 2014 ya cuenta las 29 pruebas de T'ien, lo más probable es que 2018 sea una errata de la fuente
por 2014. La plataforma dice «251 pruebas con materiales sólidos hasta 2018» (`app/data/content.es.js`,
línea 230, y su par en inglés). No lo cambiaría sin anotarlo: es un dato de NASA.

**Sin verificar.** La lámina 12 dice que los datos están catalogados en http://flame.sdsu.edu; no lo abrí.

**Veredicto: usar ahora.** Lo de más valor es el punto 1 (calidad de datos). Esfuerzo: 30 a 45 minutos para
el material; 20 a 30 para la figura.

---

## 2. `marina/19890015042.pdf`: el memorando de 1989

**Qué es (verificado).** NASA Technical Memorandum 101463, «Fire Safety Applications for Spacecraft», de
Robert Friedman y Sandra L. Olson, Lewis Research Center (hoy Glenn), Cleveland. Preparado para el Symposium
on Aircraft Fire Safety del panel AGARD/OTAN, Sintra, Portugal, 22 al 26 de mayo de 1989 (hace 37 años). 29
páginas: portada, texto en las págs. 2 a 16, 36 referencias (págs. 16 a 18), 14 figuras (págs. 19 a 28) y la
hoja de datos (pág. 29). Es un escaneo con texto reconocido; se lee bien.

- Ficha en NTRS: https://ntrs.nasa.gov/citations/19890015042 (publicación 1-ene-1989, informes
  NASA-TM-101463 y E-4511, acceso N89-24413).
- Sandra Olson es también la primera autora del reporte resumen de BASS-II de 2021: la misma investigadora,
  32 años después.

**Licencia (verificado).** NTRS: distribución pública, «Work of the US Gov. Public Use Permitted».

**Qué aporta, con página.**

| Qué dice | Pág. | Para qué sirve |
|---|---|---|
| La prueba principal de aceptación de materiales es la de propagación hacia arriba (manual NHB 8060.1B): muestra vertical encendida por abajo; no pasa si la flama avanza más de 15 cm o si gotea y enciende un papel | 4 | El mismo criterio de 15 cm sigue en la norma de hoy (sección 3) |
| Los factores de seguridad que dan las pruebas en gravedad normal son inciertos | 4 | La duda que BASS vino a medir ya estaba escrita en 1989 |
| El transbordador llevaba nueve detectores de humo de ionización, con ventilador propio y una malla que solo deja pasar partículas de menos de un micrómetro | 4 y 5 | Coincide con lo que SAME midió después y con el texto de detección |
| Pregunta abierta: si el tamaño de partícula que filtra el detector es el del humo de un incendio incipiente en el espacio | 5 | Es la pregunta que SAME y SAME-R contestaron |
| Extintores de halón 1301 en el transbordador y sus problemas: productos tóxicos y corrosivos, poco útil en fuegos de brasa | 5 y 6 | Mundo Estación, supresión, como historia |
| Skylab, 1974: únicas pruebas de combustión de sólidos en órbita hasta entonces. Al ventear al vacío, el aire que sale aviva la flama un momento antes de apagarla; un chorro de agua mal dispersado esparció material ardiendo | 7 | Línea de tiempo y supresión |
| Ventilación del transbordador: 8 a 20 cm/s en la cabina | 7 | Es justo el rango donde BASS encontró la zona inflamable |
| Con ventilación de baja velocidad en baja gravedad, el papel puede arder con oxígeno tan bajo como 15 %, por debajo del límite de propagación hacia abajo medido en gravedad normal sin aire forzado | 10 | Antecedente directo de la frontera en U; son pruebas de torre de caída con papel delgado |
| El mayor peligro de un incendio en una nave es la toxicidad de los productos, no el calor | 14 | Detección y supresión |
| Menciona una vez un programa de investigación en baja gravedad y gravedad parcial | 8 | Solo la mención; no trae datos de gravedad parcial |

Figuras útiles (verificado mirando las páginas 25 y 27): la figura 8 compara una flama de baja gravedad con
una de gravedad normal sobre un sólido delgado; la figura 11 dibuja la velocidad de propagación contra la
velocidad del aire con el rango de ventilación de una nave; la figura 12 es el mapa de inflamabilidad
(oxígeno contra velocidad del aire) del papel delgado. Son dibujos de línea en blanco y negro, nítidos. La
figura 2 (pág. 19) es el esquema de la prueba de propagación hacia arriba.

**Dónde entraría.** Como documento de contexto, igual que la guía de 2015 (`data/raw/contexto/`): páginas
citadas en `scripts/construir_evidencia.py`, figuras en `scripts/construir_figuras.py`, dos entradas en la
línea de tiempo de `app/data/content.js` y `content.es.js` (Skylab 1974; la advertencia de 1989) y la fila
en `FUENTES.md`.

**Lo que repite o contradice.** No está en `FUENTES.md`, ni en `INVESTIGACION.md`, ni en `data/raw/`. No
contradice nada de la plataforma. Hay que cuidar tres cosas para no usarlo mal: tiene 37 años, describe el
transbordador y una estación (Freedom) que no se construyó así, y sus datos son de torres de caída de
segundos, no de la Estación. Todo lo que se tome de aquí va presentado como historia, no como práctica
actual.

**Veredicto: usar ahora, como contexto histórico.** Esfuerzo: 20 minutos para la línea de tiempo; 45 para
páginas citadas y figuras.

---

## 3. `sebastian-martinez/2025_06_25_NASA-STD-6001B_w_Change_3_FINAL_Admin-Change-FINAL.pdf`: la norma

**Qué es (verificado).** NASA Technical Standard NASA-STD-6001B con Cambio 3, «Flammability, Offgassing, and
Compatibility Requirements and Test Procedures». 158 páginas. Aprobada el 26-ago-2011 (firma del ingeniero
en jefe de NASA); Cambio 3 del 9-jun-2025: revalidada tal cual, sin cambios técnicos. Antes se publicaba
como manual NHB 8060.1 (pág. 3), el mismo que cita el memorando de 1989.

- Página oficial: https://standards.nasa.gov/standard/NASA/NASA-STD-6001. Estado «ACTIVE», fecha del
  documento 08/26/2011, fecha del cambio 06/09/2025 (hace 17 meses). El archivo público que ofrece la página
  se llama exactamente igual que el de Sebastián Martínez y pesa lo mismo (2.15 MB).
- El nombre del archivo dice «2025_06_25», pero la fecha del cambio dentro del documento y en la página es
  9 de junio de 2025.
- El contenido técnico es de 2011 (hace 15 años). Para saber si cambió algo después revisé el historial de
  la pág. 2: los cambios 1 y 2 (2016) y el 3 (2025) son administrativos.

**Licencia (verificado).** La portada dice «Approved for public release, distribution is unlimited», y la
página oficial la marca como pública en internet.

**Qué dice de la Prueba 1 (verificado, sección 7.1, págs. 27 a 31).**

- Propósito: saber si un material, expuesto a una fuente de ignición estándar, se apaga solo y no pasa
  residuos ardiendo que enciendan lo de al lado (7.1.1, pág. 27).
- Cómo: cinco muestras de 30 por 6.5 cm, una a la vez, montadas en vertical y encendidas por abajo (7.1.2,
  pág. 27). Método base: ISO 14624-1:2003, con excepciones (7.1.4, pág. 29).
- Criterio: pasa si ninguna de las cinco se quema más de 15 cm y ninguna propaga la flama con residuos
  ardiendo (7.1.3, pág. 28). Si falla una, falla el material en esa atmósfera (pág. 29).
- Atmósfera: la peor a la que el material podría quedar expuesto (7.1.2 a, pág. 27); mezcla de oxígeno y
  nitrógeno con el oxígeno más alto que el material vería en uso (7.1.4 f, pág. 29). Define «concentración
  máxima de oxígeno» como la más alta a la que al menos cinco muestras pasan (7.1.4 c, pág. 29).
- **No se permite flujo de aire durante la prueba** (7.1.4 i, pág. 30).
- «Condiciones ambiente» son 20.9 % de oxígeno, 101.4 kPa (14.7 psia) y 23 °C (7.1.4 j, pág. 30).
- Si un material no pasa, se evalúa el sistema: por análisis o con una prueba de configuración como la
  Prueba 10 (6.1, pág. 20).
- En compartimientos habitables se exigen las pruebas 1, 4 (aislante de cables), 7 (gases que desprende) y
  18 (arco eléctrico) (tabla 1, pág. 18).
- Los datos de pruebas ya hechas están en la base MAPTIS de NASA Marshall (pág. 17).
- La palabra «microgravity» aparece **una sola vez** en las 158 páginas (pág. 60, apéndice A.2.1.3, sobre la
  Prueba 2). No aparecen «reduced gravity», «partial gravity» ni «lunar». Lo comprobé buscando en el texto
  extraído.

**¿Sostiene la comparación 13.5 % contra 15.4 %? No, y hay que precisar la frase (verificado).**

- La norma no trae ningún límite de oxígeno de ningún material. La Prueba 1 da «pasa» o «no pasa» en una
  atmósfera dada, no un porcentaje.
- El 15.4 % viene del reporte de BASS-II, pág. 84 del PDF (pág. 76 impresa). Dice que el mínimo de 13.5 % de
  oxígeno en microgravedad es bastante menor que el límite observado de propagación hacia arriba, 15.4 %,
  «in normal gravity with an additional 4-cm/s forced flow (Ref. 23)». La referencia 23 es un artículo de
  Olson y Ferkul (Combustion and Flame, vol. 180, 2017) sobre barras de PMMA. La pág. 97 repite el dato y
  añade que supone unos 20 cm/s de flujo por flotación más los 4 cm/s forzados.
- Entonces el 15.4 % es una medición de laboratorio con barras de PMMA y aire forzado. No es la Prueba 1:
  la Prueba 1 prohíbe el flujo de aire, usa muestras planas de 30 por 6.5 cm y no mide un límite.
- Lo que la plataforma dice hoy está en `scripts/construir_evidencia.py`, líneas 47 y 48 (entrada
  `bass2-84`, que genera `app/data/evidence.js`): «El oxígeno mínimo en microgravedad, 13.5 %, es menor que
  el límite de 15.4 % de la propagación hacia arriba en gravedad normal». Es correcto, pero le faltan tres
  cosas: que es de barras de PMMA, que el dato en tierra lleva 4 cm/s de aire forzado y que no es un
  resultado de la Prueba 1. La entrada `guide-22` (líneas 79 a 81) habla de la Prueba 1 justo al lado, así
  que la IA puede juntar las dos y decir que «la Prueba 1 da 15.4 %». Eso sería falso.
- Lo que la norma sí sostiene: qué es la Prueba 1 y que se hace sin flujo de aire. Junto con el reporte de
  BASS-II (pág. 63: la Prueba 1 «is driven by buoyant forces since gravity is present») se puede decir con
  fuente por qué la prueba en tierra no reproduce el peor caso de microgravedad.
- Dato afín, ya en nuestras figuras (`bass2-p77-fig6-2`): el reporte dice que la Prueba 1 enciende unos 25
  segundos y que en BASS-II hubo igniciones que tardaron hasta 230 segundos (págs. 76 y 77). El tiempo de 25
  segundos no está en el texto de la norma, que remite al método ISO; la cifra es del reporte.

**Una precisión para el mundo «base lunar» (verificado en la norma; la redacción es interpretación).** La
norma obliga a probar en tierra con el oxígeno más alto de uso. Por eso el hueco que muestra la plataforma
(ningún sólido de PSI por encima de 22.7 % de oxígeno) es un hueco de datos en microgravedad, no de pruebas
en general. Conviene decirlo para que un juez no entienda que nadie prueba materiales con 34 % de oxígeno.

**Dónde entraría.** Páginas citadas (`scripts/construir_evidencia.py`): 27, 28, 29, 30 y 60. Figura 2,
«Flammability Post-Test Specimen» (pág. 28), en `scripts/construir_figuras.py`. Textos de BASS y BASS-II en
`app/data/content.js` y `content.es.js` (líneas 14 y 20 de la versión en español). La IA la recibe sola,
porque `api/ask.js` carga `evidence.js`. Fila en `FUENTES.md`.

**Lo que repite.** La plataforma ya nombra la norma (`INVESTIGACION.md`, líneas 88 y 187; `content.es.js`,
línea 20), pero a través de la guía de 2015 y de las fichas: nadie había abierto la norma. No está en
`FUENTES.md` ni en `data/raw/`.

**Veredicto: usar ahora.** Es el aporte que más ayuda a la IA. Esfuerzo: 15 minutos para precisar la frase;
45 a 60 para las páginas citadas y la figura.

---

## 4. `sebastian-martinez/3D Resources`: cinco enlaces a modelos

Los cinco enlaces abren (verificado hoy).

| Enlace | Qué es | Fecha | Crédito | Archivos |
|---|---|---|---|---|
| https://science.nasa.gov/3d-resources/ | Catálogo «3D Resources» de NASA (unas 25 páginas de modelos) | Sin fecha visible | | Formatos glb, stl, blender y otros |
| https://science.nasa.gov/resource/earth-with-clouds-3d-model | «Earth with Clouds 3D Model» | 22-abr-2019 (archivos del 9-sep-2023) | NASA VTAD | glTF de 18.05 MB; USDZ de 957.57 KB |
| https://svs.gsfc.nasa.gov/14959/ | «Moon 3D Models for Web, AR, and Animation», con datos del orbitador LRO | Publicado el 29-ene-2026, actualizado el 1-abr-2026 (hace 7 meses) | NASA's Goddard Space Flight Center | Plano chico: `moon_small.glb`, 13.2 MB. Con retícula chico: 6.9 MB. Con relieve: de 77.7 a 298.9 MB |
| https://science.nasa.gov/resource/planet-mars-3d-model | «Planet Mars, 3D Model» | 27-abr-2019 (archivos del 8-mar-2024) | NASA/JPL-Caltech | glTF de 3.85 MB; USDZ de 862.14 KB |
| https://science.nasa.gov/3d-resources/international-space-station-iss-a/ | «International Space Station (ISS) (A)» | Archivo del 7-abr-2025 | Sin crédito visible en la página | Un `.glb` que la página lista con 38.78 KB |

- El tamaño de 38.78 KB del modelo de la Estación es raro para un modelo así: hay que abrirlo antes de
  contar con él (por-probar).
- No hay modelo para el mundo «traje». Busqué «suit» en el catálogo con la dirección de la página y dio
  cero resultados, pero la primera página del catálogo lista un «Advanced Crew Escape Suit», así que mi
  búsqueda no es concluyente (sin verificar).

**Licencia (verificado).** El catálogo dice que todo es gratis para descargar y usar, y remite a la guía de
medios de NASA (sección 5): uso educativo o informativo permitido, con crédito a NASA y sin dar a entender
respaldo. El repositorio espejo https://github.com/nasa/NASA-3D-Resources dice que los recursos son libres y
sin derechos de autor; sus últimos cambios son del 3-jun-2025 (hace 17 meses), así que el catálogo de
science.nasa.gov es la fuente más al día.

**Qué aporta y dónde.** Solo al diseño: un globo o una estación por cada mundo en la portada o en la vista
de mundo. No aporta datos ni nada a la IA.

**Por qué no ahora.** Tres razones verificadas en el proyecto: la plataforma no usa librerías (`README.md`,
línea 32) y un visor 3D necesita una; la decisión vigente es no tocar la interfaz; y solo Tierra, Luna y
Marte suman entre 29 y 35 MB con las versiones más chicas, en un sitio que hoy no carga nada de ese tamaño.

**Veredicto: usar después de la IA.** Dos caminos cuando se rehaga la interfaz: una imagen fija de cada
modelo con su crédito (30 a 45 minutos, sin librerías), o un visor 3D con los modelos chicos servidos desde
el propio sitio (3 a 5 horas, con una librería que habría que elegir y fijar). Durabilidad: alta para los
modelos (son archivos que quedan en nuestro sitio); la del visor depende de la librería. Plan B: la imagen
fija.

---

## 5. `marina/NASA Brand Guidelines`: la guía de marca

**Qué es (verificado).** https://www.nasa.gov/nasa-brand-center/brand-guidelines/, «NASA Brand Guidelines».
Publicada el 20-jul-2023 y actualizada el 27-feb-2026 (hace 8 meses y medio); la leí hoy en vivo, así que es
lo vigente. Resume el manual de normas gráficas de NASA, emitido bajo el reglamento 14 CFR 1221.

Marina la describió como «paleta de colores institucional, jerarquía tipográfica y uso correcto de insignias
y créditos». Lo que la página dice de verdad es sobre todo lo que **no** puede hacer alguien de fuera:

**Qué prohíbe a un proyecto estudiantil no afiliado (verificado).**

- La insignia (el círculo azul), el logotipo (las letras rojas) y el sello **no se pueden usar para ningún
  fin sin permiso explícito**, ni por personas que no sean empleadas de NASA, ni en páginas web que NASA no
  patrocine, ni para dar a entender respaldo.
- No se permite texto con tipografías que se parezcan a la de la insignia o a la del logotipo.
- Los identificadores de misiones y programas tampoco son de dominio público.
- La paleta que muestra es la de la insignia. No es una paleta para terceros.

**Qué permite.**

- La guía de medios, https://www.nasa.gov/nasa-brand-center/images-and-media/ (publicada el 20-jul-2023,
  actualizada el 27-oct-2026, hace 18 días): las imágenes, el audio, el video y los modelos 3D de NASA en
  general no tienen derechos de autor en Estados Unidos y se pueden usar con fines educativos o informativos,
  también en páginas web, sin pedir permiso, si se reconoce a NASA como fuente y no se da a entender
  respaldo. Excepciones: material de terceros marcado con derechos y personas identificables en usos
  comerciales.
- Existe una «NASA Data Insignia» para productos que usan datos públicos de NASA
  (https://www.nasa.gov/nasa-data-insignia/, publicada el 25-nov-2025, hace un año). **Exige aprobación
  previa** de la oficina de comunicaciones de NASA por formulario; sin ella su uso está prohibido. No da
  tiempo antes del domingo: no usarla. Sí sirve su aviso modelo como referencia de redacción.

**Lo más importante: reglas para productos con IA (verificado).** La guía de medios tiene una sección sobre
aplicaciones de superinteligencia (así llama a la IA desde la orden ejecutiva 14434 del 29-sep-2026, la misma
palabra del título del reto). Dice, en resumen:

- No se permite atribuir directamente a NASA lo que genera el modelo. Las salidas se atribuyen al producto,
  no a NASA; frases como «según NASA» están prohibidas en esos productos.
- Sí se puede decir, como hecho, que la herramienta incluye material de NASA, sin dar a entender que NASA
  revisó o autorizó ese uso.
- La insignia no puede aparecer junto a imágenes generadas ni usarse para entrenar herramientas.
- Recomienda marcar lo generado con IA y aclarar que NASA no responde por su exactitud.

**Cómo está la plataforma frente a eso.**

- Cumple (verificado): marca lo escrito con IA (`app/js/ask.js`, líneas 149 y 176; `app/js/investigations.js`,
  línea 117; `app/js/i18n.js`, línea 213) y declara que no tiene relación ni respaldo de NASA
  (`app/index.html`, líneas 29 y 30). Busqué «according to NASA», «según NASA» y «NASA says» en `app/` y
  `api/`: no aparecen en ningún texto fijo.
- Falta (verificado): las instrucciones de la IA (`api/ask.js`, líneas 18 a 33) no le dicen cómo atribuir.
  Hoy nada impide que una respuesta en vivo o un informe escriba «según NASA».
- Por-probar: si alguna de las 16 páginas de `app/evidence/` o de las 71 figuras de `app/figures/` muestra
  la insignia (por ejemplo una portada o un encabezado). La regla habla de imágenes generadas, no de páginas
  de reportes, pero conviene mirarlas una vez.
- Para la sesión del logo: no usar la insignia, ni formas o letras que la recuerden. Le dejé una nota en la
  carpeta compartida de las sesiones.

**Sin verificar.** Si Space Apps tiene sus propias reglas de marca para los equipos (qué logotipos del
concurso se pueden usar).

**Veredicto: usar ahora, como regla.** Esfuerzo: 15 a 20 minutos para la línea nueva y su prueba.

---

## 6. `marina/NASA Horizon Design System`: el sistema de diseño

**Qué es (verificado).** https://github.com/nasa/hds-core, paquete `@nasa-hds/core`: una capa de tema en CSS
y Sass sobre el U.S. Web Design System (USWDS), con la tipografía, los colores y los componentes de la marca
NASA. Última versión v0.10.0; últimos cambios del 6-nov-2026 (hace 8 días). Su propia documentación avisa
que, antes de la versión 1.0, los nombres pueden cambiar entre versiones menores. Pide Node 20 o más y
depende de `@uswds/uswds` 3.14 o más.

Marina lo describió como «sistema de diseño web oficial actual de NASA». Es cierto, pero es para sitios de
NASA.

**Licencia (verificado).** Dominio público (CC0 1.0), salvo las tipografías incluidas (SIL OFL 1.1) y las
marcas e insignias de NASA.

**Qué permite y qué no a un proyecto como el nuestro (verificado en su README).** Está pensado para sitios y
aplicaciones de NASA que operan fuera de su gestor de contenidos principal. Dice que los sitios que no son
de marca NASA deben usar USWDS. Además, vestir un proyecto estudiantil como un sitio oficial de NASA va en
contra de la guía de marca.

**Qué sí se puede tomar.** Las tres tipografías que usa son abiertas y están en Google Fonts según la guía
de marca: Inter (títulos), Public Sans (texto) y DM Mono (números y etiquetas). Usar una tipografía abierta
no es usar la marca. También trae una hoja de paletas para gráficas (`hds-dataviz.min.css`, 1.2 KB) que
sirve de referencia.

**Durabilidad: baja para adoptarlo como tema** (anterior a la versión 1.0 y hecho para otro tipo de sitio);
alta para las tipografías. Plan B: seguir con el estilo propio.

**Veredicto: usar después de la IA, solo como referencia.** No instalar el paquete. Choca con dos decisiones
vigentes: no tocar la interfaz por ahora y no usar librerías.

---

## 7. `marina/Plataforma oficial de visualizaciones interactivas de NASA`: NASA Eyes

**Qué es (verificado).** https://science.nasa.gov/eyes/. «NASA's Eyes» es un conjunto de aplicaciones web 3D
de NASA/JPL-Caltech: Eyes on the Solar System, Eyes on Asteroids, Eyes on the Earth, Eyes on Exoplanets, DSN
Now, Mars Relay Network y Mars 2020 EDL. Sin fecha visible; la página muestra eventos de septiembre de 2026,
así que está al día. El archivo de Marina trae solo el enlace, sin descripción.

**Licencia.** La página no dice en qué condiciones se pueden incrustar las aplicaciones en un sitio de
terceros (sin verificar). Ofrece cuatro modelos 3D para descargar (Europa Clipper, Juno, InSight y
Curiosity, del 13-mar-2024), que no sirven a nuestros cinco mundos.

**Qué aporta.** Nada a los datos ni a la IA: no tiene información de combustión. Sirve como referencia de
cómo se cuenta una historia desplazando la página y de cómo se presenta un lugar en 3D.

**Veredicto: no usar en la plataforma; guardar como referencia** para cuando se rehaga la interfaz.

---

## 8. `sebastian-martinez/Feedback`: la lista de fuentes

**Qué es.** Un texto de 3,599 caracteres en cuatro apartados, escrito por un asistente de IA. Le habla al
equipo en segunda persona («tu aplicación», «busca», «usa») y menciona direcciones internas de la
plataforma (`#/world/moon`). Son recomendaciones para el equipo, no instrucciones para esta revisión, y no
seguí ninguna. No cita ni un solo documento con enlace directo y fecha, así que no cumple la regla de
`aportes/README.md`. Supone que la plataforma usa Three.js o React; no usa ninguna librería.

| # | Afirmación | Resultado |
|---|---|---|
| 1 | NASA Image and Video Library (images.nasa.gov) es la fuente más rica de fotos de flamas | **Imprecisa.** La biblioteca existe y está en la lista oficial de NASA (verificado). Buscando en su servicio: «BASS flame» da 13 imágenes, «Saffire fire experiment» 8, «FLEX flame droplet» 8 y «microgravity candle flame» 7. Varias son fotos de la tripulación operando el equipo, no de flamas. No abrí cada imagen |
| 2 | Sus imágenes son de «dominio público» | **Imprecisa.** NASA dice que en general no tienen derechos de autor en Estados Unidos y pide crédito, no insinuar respaldo y cuidado con personas identificables y material de terceros (verificado, sección 5) |
| 3 | Hay fotos del interior de la Cygnus quemada en Saffire | Sin verificar. Los 8 resultados de Saffire incluyen fotos del equipo dentro de la Cygnus (por ejemplo `iss051e039882`, del 8-may-2017); no vi ninguna del interior quemado |
| 4 | Existe una «Microgravity Combustion Gallery» de Glenn en grc.nasa.gov, con fotos lado a lado | Sin verificar. No la busqué a fondo. Las páginas de Glenn sobre combustión hoy viven bajo nasa.gov/glenn |
| 5 | JAXA Digital Archives (jda.jaxa.jp) | **Existe (verificado), pero no es de uso libre.** Un aviso del 5-sep-2025 dice que el trámite de solicitud de uso tarda unos cinco días hábiles. No da tiempo |
| 6 | FLARE es «Flammability Limits at Reduced-Gravity» y cubre el hueco de gravedad parcial | **Imprecisa.** El nombre es «Flammability Limits At Reduced-g Experiment». Según la página de NASA (publicada el 13-jul-2025, actualizada el 12-ago-2026), busca relacionar los límites de inflamabilidad en gravedad normal y en microgravedad, no en gravedad parcial. Lo dirige JAXA, con NASA y ESA, en el módulo Kibo, y quiere proponer un método de prueba que corrija las limitaciones de NASA-STD-6001B. La página aún dice que los vuelos se esperan «en 2017 o después»: está desactualizada en ese punto |
| 7 | En jda.jaxa.jp hay esquemas de FLARE | Sin verificar |
| 8 | NTRS tiene los memorandos técnicos y la norma NASA-STD-6001 | Verificado para los tres documentos de esta revisión. La norma vive en standards.nasa.gov |
| 9 | SoFIE vino a llenar el hueco de sólidos | Documentado por búsqueda, sin abrir la fuente: su primer ensayo (GEL) habría corrido el 13-ene-2023, con esferas de PMMA de 4 cm y oxígeno de 13 a 28 %. Lo que sí verifiqué: el cartel de BASS-II dice que uno de sus objetivos era dar datos preliminares a SoFIE (lám. 2), y `INVESTIGACION.md` (línea 226) ya anota que SoFIE no existe en PSI como investigación |
| 10 | La torre de caída de ZARM y los vuelos parabólicos de ESA simulan 1/6 g y 3/8 g | **Parcial.** La página de instalaciones de ZARM (sin fecha visible) dice que la torre de caída da hasta 9.3 segundos de ingravidez y que la gravedad parcial la da otra instalación, la GraviTower (verificado). Las campañas de gravedad parcial de ESA: documentado por búsqueda, sin abrir |
| 11 | nasa3d.arc.nasa.gov y el repositorio de GitHub tienen modelos gratis | Verificado: la dirección antigua redirige a science.nasa.gov/3d-resources/, y el repositorio existe (sección 4) |
| 12 | Hay modelos de trajes xEMU y de vehículos presurizados | Sin verificar |
| 13 | solarsystem.nasa.gov tiene texturas de la Luna y de Marte | Sin verificar. La fuente comprobada para la Luna es la página de SVS de la sección 4 |
| 14 | En NTRS hay micrografías de hollín de Kapton y teflón, de menos de 200 nm, para comparar con regolito | Sin verificar. El tamaño de 100 a 200 nm ya lo tenemos de SAME, con página |

El apartado 4 del archivo (qué usar en cada sección) no trae fuentes nuevas: repite las anteriores.

**Una advertencia práctica.** El archivo propone bajar el repositorio completo de modelos con git. No medí su
tamaño, pero es una colección entera de modelos y texturas: si algún día se usa, se baja el archivo suelto
desde el catálogo, no el repositorio.

**Qué se rescata.**

1. FLARE como contexto de «qué falta probar»: es el esfuerzo internacional para corregir justo la limitación
   de la Prueba 1 que BASS mostró. Fuente:
   https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/flammability-limits-at-reduced-g-experiment-flare/.
   Antes de escribir que ya voló, falta una fuente primaria de JAXA.
2. Las fotos de BASS y BASS-II de la biblioteca de imágenes, si algún día se quiere una foto real además de
   las figuras de los reportes. Identificadores vistos: `iss040e072900` (23-jul-2014), `iss040e086481`
   (2-ago-2014) e `iss035e016429` (9-abr-2013). Hay que abrir cada una y leer su pie antes de usarla.
3. La GraviTower de ZARM, como ejemplo de que sí hay instalaciones para gravedad parcial, de segundos.

**Veredicto: no usar tal cual.** Lo rescatable entra después de la IA y solo tras abrir cada fuente.

---

## Mejoras propuestas, por prioridad

Ninguna está aplicada. Los tiempos son estimaciones mías.

| # | Mejora | Archivos que tocaría | Cómo se comprueba | Tiempo |
|---|---|---|---|---|
| 1 | Precisar la comparación 13.5 % contra 15.4 %: barras de PMMA, 4 cm/s de aire forzado en tierra, y que no es un resultado de la Prueba 1 | `scripts/construir_evidencia.py` (líneas 47 y 48), que regenera `app/data/evidence.js` | Correr el script; preguntarle a la IA «¿qué límite de oxígeno da la Prueba 1?» y ver que no conteste 15.4 % | 15 min |
| 2 | Decirle a la IA cómo atribuir: al documento o a la ficha («el reporte resumen de BASS-II dice»), nunca «según NASA» | `api/ask.js` (bloque `COMMON`, líneas 18 a 33) | Cinco preguntas en vivo y un informe; buscar «NASA says», «according to NASA» y «según NASA» en las respuestas, también en las guardadas | 15 a 20 min |
| 3 | Agregar la norma como documento citado: págs. 27, 28, 29, 30 y 60, y su figura 2 | Copia del PDF en `data/raw/contexto/`; `scripts/construir_evidencia.py`; `scripts/construir_figuras.py`; `FUENTES.md` | El script se detiene si la frase no está en la página. Frases que sí están, de una sola línea: «atmosphere to which the material could be exposed» (27), «standard-sized specimens burns» (28), «Maximum Oxygen Concentration» (29), «Air shall not be allowed to flow during tests» (30) | 45 a 60 min |
| 4 | Asignar PMMA a las 57 filas de BASS-II sin material, con la fuente en `notas` | `scripts/limpiar_psi.py` (regla de familias, cerca de la línea 117); `data/README.md` (línea 131: la regla hoy es «solo cuando el texto nombra el material»); regenerar `data/pruebas.csv`, `app/data/data.js` y `app/data/tests.csv` | En PSI-25, «no especificado» pasa de 57 a 0 y PMMA de 41 a 98; correr `scripts/verificar_cifras.py` y revisar el pasaporte de PMMA en la plataforma | 30 a 45 min |
| 5 | Aclarar en el mundo «base lunar» que en tierra sí se prueba con el oxígeno más alto de uso, y que lo que falta es el dato en microgravedad o en gravedad lunar | `app/data/content.js` y `content.es.js` (textos de mundos) | Lectura; cita de las págs. 27 y 29 de la norma | 10 min |
| 6 | Dos entradas en la línea de tiempo: Skylab 1974 (primeras pruebas de sólidos en órbita) y 1989 (la advertencia de que la ventilación débil aviva la flama) | `app/data/content.js` y `content.es.js` (bloque `timeline`) | Citas de las págs. 7 y 10 del memorando | 20 min |
| 7 | Figuras nuevas: esquema de la frontera con el límite de gravedad normal (cartel, lám. 6); figuras 8, 11 y 12 del memorando (págs. 25 y 27) | `scripts/construir_figuras.py`; `app/figures/` | Verlas en la plataforma. El cartel no numera sus figuras; no revisé si el script admite figuras sin pie numerado | 45 min |
| 8 | Añadir a la IA el matiz de BASS-II: límite de oxígeno más bajo en microgravedad, pero propagación más lenta | Hallazgo de PSI-25 en `app/data/content.js` y `content.es.js`, o una página citada del cartel | Preguntar «¿arde más rápido en microgravedad?» | 15 min |
| 9 | Llenar la tabla 5 de `FUENTES.md` y un renglón por persona en `BITACORA.md` | `FUENTES.md`, `BITACORA.md` | Las filas están abajo | 5 min |
| 10 | Después de la IA: imagen fija o visor 3D por mundo; tipografías abiertas | `app/` | Sección 4 y sección 6 | 45 min a 5 h |

Las mejoras 1 y 3 deben ir juntas o en ese orden: si entra la norma sin precisar la frase, crece el riesgo de
que la IA una la Prueba 1 con el 15.4 %.

### Filas listas para la tabla 5 de `FUENTES.md`

| Quién | Fecha | Qué es | Enlace | Fecha del documento | Con qué se encontró | ¿Se abrió la fuente original? | Para qué serviría |
|---|---|---|---|---|---|---|---|
| Marina | 14-nov-2026 | Cartel «Combustion of Solids in Microgravity: Results from the BASS-II Experiment» (Ferkul y otros) | https://ntrs.nasa.gov/citations/20160000593 | 23-oct-2014 | No lo dijo | Sí, en la revisión del 14-nov | Material de 57 filas de BASS-II; esquema de la frontera de inflamabilidad |
| Marina | 14-nov-2026 | NASA TM-101463, «Fire Safety Applications for Spacecraft» (Friedman y Olson) | https://ntrs.nasa.gov/citations/19890015042 | Mayo de 1989 | No lo dijo | Sí, en la revisión del 14-nov | Línea de tiempo; antecedente de la frontera en U |
| Marina | 14-nov-2026 | NASA Brand Guidelines | https://www.nasa.gov/nasa-brand-center/brand-guidelines/ | Actualizada el 27-feb-2026 | No lo dijo | Sí | Qué no se puede usar de la marca NASA |
| Marina | 14-nov-2026 | NASA Images and Media Usage Guidelines (enlazada desde la anterior) | https://www.nasa.gov/nasa-brand-center/images-and-media/ | Actualizada el 27-oct-2026 | Revisión del 14-nov | Sí | Uso de imágenes y modelos; reglas para productos con IA |
| Marina | 14-nov-2026 | NASA Horizon Design System (`nasa/hds-core`) | https://github.com/nasa/hds-core | v0.10.0; cambios del 6-nov-2026 | No lo dijo | Sí | Referencia de tipografía; no se instala |
| Marina | 14-nov-2026 | NASA's Eyes | https://science.nasa.gov/eyes/ | Sin fecha visible | No lo dijo | Sí | Referencia de interacción |
| Sebastián Martínez | 14-nov-2026 | NASA-STD-6001B con Cambio 3 | https://standards.nasa.gov/standard/NASA/NASA-STD-6001 | 26-ago-2011; revalidada el 9-jun-2025 | No lo dijo | Sí, en la revisión del 14-nov | Qué es la Prueba 1; páginas citadas |
| Sebastián Martínez | 14-nov-2026 | Modelos 3D de Tierra, Luna, Marte y Estación | https://science.nasa.gov/3d-resources/ y los cuatro enlaces de su archivo | 2019 a 2026, según el modelo | No lo dijo | Sí | Diseño, después de la IA |
| Sebastián Martínez | 14-nov-2026 | Lista «Feedback» de fuentes fuera de PSI | Sin enlaces directos | Sin fecha | Otra IA | Parcial: 7 de 14 afirmaciones | Tres pistas: FLARE, fotos de BASS, GraviTower |

---

## Ya integrado (14-nov, 17:45)

Por decisión de Marco Sebastián (D-1422 y D-1424), esta sesión escribe datos y catálogos. Primera pieza
hecha, sin commit todavía: el catálogo de páginas citadas pasó de 16 a 39 fuentes
(`scripts/construir_evidencia.py`, `app/data/evidence.js`, 21 imágenes nuevas en `app/evidence/`).

- La entrada `bass2-84` ahora dice que el 15.4 % es de barras de PMMA con 4 cm/s de aire forzado y que no es
  un resultado de la Prueba 1 (mejora 1).
- Entraron 5 páginas de la norma, 4 del memorando de 1989, 4 del cartel de BASS-II, 5 del artículo de SAME-2
  y 3 del memorando de humo de 2015, cada una con su frase comprobada en la página (mejora 3 y parte de la 8).
- El cartel de FM2 entró como dos citas con enlace y sin imagen de la página, por su permiso (ver abajo).
- 12 entradas llevan el campo nuevo `materials`, para que la ficha de cada material las muestre.
- Comprobado: las 15 entradas anteriores quedaron idénticas salvo `bass2-84`; el archivo carga en Node.
- Los seis PDF se copiaron a `data/raw/contexto/`, que git ignora. Quien regenere el catálogo en otra
  computadora necesita esas copias.

Falta: figuras por material, las 57 filas de PMMA, la línea de tiempo y los modelos 3D.

## Imágenes bajadas de NASA (19:30, D-1430)

Con el visto bueno de Marco Sebastián se bajaron dos fotos, ya en las fichas de PMMA con su crédito:
- Flama sobre PMMA de 1 cm en Saffire IV, de la página de NASA del 20-may-2020 enlazada por Sebastián Martínez.
- SoFIE GEL en la Estación, de NASA SVS 31394 (6-may-2026). La página no nombra el material; el nombre del
  archivo de NASA dice PMMA de 0.5 mm, y el pie lo aclara.

No se usaron: dos secuencias de SVS cuyo material no se nombra, el video de SIBAL de Saffire IV (YouTube), la
ficha de Saffire (99 KB, una sola imagen de cabecera) y la foto del equipo de Saffire-I (no muestra material).
Con esto quedan 79 figuras; PMMA tiene 8 y siguen sin figura Pyrell y Ultem.

## Tercera tanda y pendientes (revisados a las 19:10)

| Aporte | Qué es (verificado en NTRS o en la página, hoy) | Qué se hizo |
|---|---|---|
| `marina/ASGSR_FinalPoster JSchechter.pdf` (nuevo) | «Characterizing the Flammability of Nomex Fabric for the Preparation of FM2», Schechter, Zayac, Ferkul, Dietrich y Liao (Case Western, Ohio Northern, NASA Glenn), ASGSR 2025, 3 al 6-dic-2025, NTRS 20250010975. Permiso: uso por o para el gobierno de Estados Unidos | Cita `nomex-fm2-2025`, sin imagen. Nota de Nomex: oxígeno límite aproximado de la tela Nomex HT90-40 a 8.2 psi, cerca de 23 % en gravedad normal, 29 % en gravedad lunar y 38 % en microgravedad |
| `sebastian-martinez/20180005168.pdf` (láminas de Saffire, ASGSR 2017) | Uso público. Sus láminas 30 y 31 son la tabla de NASA con los resultados de Saffire I a III | Cita `saffire17-30`, sin imagen por la insignia de las láminas. **Discrepancia:** la tabla de PSI de Saffire-III (PSI-100) dice 30 cm/s y grosor «.33 cm»; las láminas dicen 25 cm/s y 0.37 mm, y traen los resultados que PSI no tiene (300 s a 2.3 mm/s y 60 s a 0.98 mm/s). El texto de PSI-100 lo dice ahora. También difiere el oxígeno: PSI-100 trae 19.4 a 20.1 % de la telemetría y las láminas, 21.2 a 21.0 % |
| `sebastian-martinez/Model Development ... Saffire-IV ...pdf` | Brooker y Niehaus, NASA Glenn, ICES-2022-278, NTRS 20220002714, uso público. Modelo numérico de CO2 y temperatura en la Cygnus durante Saffire-IV | No se integra: no trae datos de combustión que falten en la plataforma |
| `marina/19920004363.pdf` | NASA TM-105317, Friedman, Sacksteder y Urban, 1991, uso público | No se integra: repite el memorando de 1989. Dato útil para el texto: en 1991 las torres de caída daban de 2 a 5 s de baja gravedad y los aviones unos 20 s |
| `victor/marsds.json` | Cuatro fichas de NTRS, todas existen y su resumen coincide con lo que dice el archivo: Takahashi y otros 2001 (20010074098) y 2003 (20040053580), sobre supresión en gravedad reducida; Gollner y otros 2021 (20210022402, libro blanco); Sacksteder y otros 2003 (20040053567). Una imprecisión: el archivo dice que en 2003 se varió el oxígeno, y el resumen dice que se variaron la presión y el ancho de la muestra | Cita `kc135-2003` (resumen de NTRS, sin bajar el PDF): vuelos de gravedad parcial de 0.1 a 1 g en el avión KC-135. **Corrigió una frase mía:** «la gravedad lunar solo se ha ensayado en caídas de centrífuga» pasó a «solo se ha reproducido por segundos, en vuelos parabólicos y en centrífugas» |
| `sebastian-martinez/Articulos` | SVS 31394 existe (6-may-2026, crédito NASA, imágenes de SoFIE: una tela delgada y, según el nombre del archivo, PMMA de 0.5 mm); la foto de Christina Koch existe (15-abr-2019, inserto de ACME; su pie dice «April 9, 2018», probable errata de NASA); la página de ACME existe. La imagen de JAXA no se pudo leer | Sin integrar. Las imágenes de SVS servirían para PMMA y telas; bajarlas necesita el visto bueno de Marco Sebastián |

## Segunda tanda (leída a las 18:20)

Todo bajado de GitHub y comparado con su ficha de NTRS hoy (14-nov-2026).

| Archivo | De quién | Qué es (verificado) | Permiso en NTRS | Qué se hizo |
|---|---|---|---|---|
| `marina/20110015690.pdf` | Marina | «A Case Study of the Failure on Apollo 13», Brenda Lindley Anderson, NASA Marshall, conferencia ISSC, 8-ago-2011; basado en el reporte de la junta de revisión de Apollo 13 (TMX-65270) | Uso público permitido | Tres páginas citadas (`apollo13-10/11/12`) y la entrada de Apollo 13 de la línea de tiempo, que antes decía que el equipo no había leído la fuente |
| `sebastian-martinez/Preliminary Results from the Saffire VI Experiment.pdf` | Sebastián Martínez | Presentación de Urban y otros, ICES 2024 (21 al 25-jul-2024), NTRS 20240007488 | Partes con posibles derechos de terceros | Dos citas sin imagen (`saffire6-11`, `saffire6-20`). **Corrige a la plataforma:** fuera de PSI, Saffire VI quemó SIBAL con 31.0 % de oxígeno y PMMA con 30.3 y 28.8 %, a unos 55 kPa, en microgravedad, en diciembre de 2023 (pág. 11). Se ajustaron el cierre del mundo Luna, la agenda y las notas de PMMA y SIBAL; la frase «no se sabe nada» de la ficha de material es de la sesión principal y se le pidió cambiarla |
| `sebastian-martinez/materiales-saffire-imagenes.md` | Sebastián Martínez | Lista de datos fuera de PSI y de imágenes por material. Su tabla de Saffire IV a VI coincide con las págs. 11 y 20 de la presentación de Saffire VI | No aplica | Usada para lo anterior. Sus enlaces a imágenes siguen sin abrir uno por uno |
| `sebastian-martinez/Model Development of Large-Scale Spacecraft Fires during the Saffire-IV Experiments.pdf` | Sebastián Martínez | Brooker y Niehaus, NASA Glenn, ICES-2022-278 (10 al 14-jul-2022), NTRS 20220002714. Modelo numérico de los fuegos de Saffire-IV | Uso público permitido | Sin integrar todavía |
| `sebastian-martinez/20180005168.pdf` | Sebastián Martínez | «Saffire: A Novel Approach to Study of Spacecraft Fire Safety Using Un-manned Spacecraft», Urban y otros, ASGSR, 25-oct-2017 | Uso público permitido | Sin integrar todavía; 13 de sus 32 láminas son imagen sin texto |
| `marina/19920004363.pdf` | Marina | NASA TM-105317, «Risks, Designs, and Research for Fire Safety in Spacecraft», Friedman, Sacksteder y Urban, 1991 | Uso público permitido | Sin integrar todavía; escaneo, mismo tipo que el memorando de 1989 |
| `sebastian-martinez/Articulos` | Sebastián Martínez | Cinco enlaces: SVS 31394, una imagen de JAXA, una foto de Christina Koch, la misión ACME | No aplica | Sin abrir. La imagen de JAXA pide trámite de uso (sección 8) |
| `victor/marsds.json` | Victor | Cuatro fichas de NTRS (2001 a 2021) sobre supresión en gravedad reducida y combustión de sólidos en gravedad parcial, cada una con un «key_finding» escrito con otra IA | Sin verificar | Sin abrir. Los «key_finding» no son citas: hay que abrir cada PDF antes de usarlos |

El catálogo de figuras ganó `materials` y `origin` (contrato con la sesión principal, D-1426) y nueve imágenes
del equipo con `team: true` y su crédito: seis micrografías de humo del memorando de 2015 (teflón, Kapton y
Nomex; dos de ellas recogidas en la Estación por SAME) y tres láminas de Saffire de 2017 (tarjeta de muestras de
Saffire-II, flamas de Saffire-I y III, tela SIBAL), recortadas sin la insignia de NASA. Quedan 77 figuras, 23 con
material. Pyrell y Ultem siguen sin figura. Los enlaces a imágenes de páginas web de NASA que trae
`materiales-saffire-imagenes.md` no se bajaron: bajar archivos de la web necesita el visto bueno de Marco Sebastián.

Saffire VI ya está en todos los textos que decían que no había datos con aire de base lunar (encargo D-1429).

Mejora 4 hecha: las 57 filas de BASS-II sin material son ahora PMMA, con la fuente en `notas`
(`scripts/limpiar_psi.py`). PMMA pasa de 91 a 148 pruebas en la plataforma; el verificador da 18 de 18.

## Llegó después de la revisión (leído a las 17:40)

Decisión de Marco Sebastián del 14-nov (D-1422): todo lo que el equipo suba se integra con todo su valor, y
la ficha de cada material reúne ahí mismo lo que haya de él. La revisión sigue abierta. Los tres PDF nuevos
se leyeron directo de GitHub, porque aún no están en la carpeta local. Lo nuevo:

| Archivo | Dónde está | Qué es, según su ficha de NTRS (verificado hoy) | Para qué serviría |
|---|---|---|---|
| `marina/20130000422.pdf` | En GitHub; aún no en la carpeta local | «Particle Morphology and Size Results from the Smoke Aerosol Measurement Experiment-2», Urban y otros, conferencia ICES, 15-jul-2012 (AIAA 2012-3536). https://ntrs.nasa.gov/citations/20130000422. Uso público permitido | Es el artículo de SAME-R detrás de la tabla «ICES 2012» que ya usamos. Humo de teflón, Kapton, algodón, silicón y Pyrell, con imágenes de microscopio de las partículas: va directo a la ficha de esos materiales |
| `sebastian-martinez/20160000940.pdf` | En GitHub; aún no en la carpeta local | NASA/TM-2015-218891, «Particle Morphology and Elemental Composition of Smoke Generated by Overheating Common Spacecraft Materials», Marit E. Meyer, 1-dic-2015. https://ntrs.nasa.gov/citations/20160000940. Uso público permitido | Micrografías y composición del humo de diez materiales de nave. Son pruebas en tierra (White Sands), no en microgravedad: hay que decirlo en cada pie |
| `marina/20240008623.pdf` | En GitHub; aún no en la carpeta local | Cartel «Flammability of Materials on the Moon» (FM2), de Zayac, Johnston, Ruff y Ferkul, Glenn Space Technology Symposium, 15 al 17-jul-2024. https://ntrs.nasa.gov/citations/20240008623. **Su permiso es distinto:** NTRS dice «Use by or on behalf of the US Gov. Permitted», no uso público | Es lo más cercano que hay a datos de gravedad lunar: describe FM2, que quemará dos telas SIBAL y dos barras de acrílico en la Luna con 21 % de oxígeno a 14.7 psia y con 34 % a 8.2 psia, y dice que en centrífuga y vuelo parabólico el SIBAL arde hacia abajo en gravedad lunar. Se cita y se enlaza; la página no se reproduce. Su cabecera trae la insignia de NASA |
| `sebastian-martinez/3D Resources` (versión de las 17:01) | Local | Agrega dos modelos y cinco fuentes de imágenes | Ver abajo |

Lo que dejaron los dos artículos de humo, ya leídos:

- **SAME-2, 2012 (en órbita).** Tabla 1 con los diámetros por material, recién hecho y envejecido 720 s
  (pág. 7): sin envejecer, diámetro medio por conteo de 0.056 µm en Kapton, 0.101 en teflón, 0.128 en mecha,
  0.196 en silicón y 0.204 en Pyrell. El humo de teflón y de Pyrell es sólido y forma racimos; el de mecha,
  silicón y Kapton es líquido y se junta en gotas (pág. 11). Sin flujo de aire las partículas salen de 2 a 3
  veces más grandes (pág. 12). Figuras 11 a 13: micrografías del humo de teflón, Pyrell, mecha y Kapton.
- **Meyer, 2015 (en tierra).** 28 figuras: tarjeta de circuitos (1 a 5), aislante de cable (6 y 7), teflón
  (8 a 15), Kapton (16 a 21) y Nomex (22 a 28). Las figuras 15 y 21 son humo de teflón y de Kapton recogido
  en la Estación por SAME. Conclusiones (págs. 29 y 30): en estas pruebas el teflón formó grumos esféricos
  compactos, distinto de SAME; el Kapton coincide con SAME; el Nomex dio partículas tipo bola de alquitrán.
- Hay dos fichas relacionadas de FM2 en NTRS, 20240015307 y 20260009334 (esta de 2026), sin abrir: pueden
  traer datos más nuevos.

Del archivo de modelos, comprobé hoy los dos modelos nuevos; las cinco fuentes de imágenes siguen sin abrir.

- **Mark III Spacesuit** (https://science.nasa.gov/3d-resources/mark-iii-spacesuit/): un `.glb` de 873.14 KB,
  del 23-jul-2025. La página dice que el traje se diseñó para operar a 8.3 psi. Es el modelo que le faltaba
  al mundo «traje».
- **Habitat Demonstration Unit** (https://science.nasa.gov/3d-resources/habitat-demonstration-unit/): dos
  `.glb` de 504.64 y 694.32 KB, del 27-mar-2025. Sirve para el mundo «base lunar».
- Los dos son livianos, mucho más que los globos de la sección 4.
- El archivo avisa que una revisión externa halló la insignia de NASA incrustada en las texturas de varios
  modelos, entre ellos estos dos. Sin verificar: hay que abrir cada modelo y mirar la textura antes de
  usarlo, por la regla de la sección 5.
- Sin verificar: SVS 31394 («NASA Studies Fire in Microgravity»), «Studying Flames in Microgravity», el
  artículo de flamas frías de CFI-G, la foto del inserto ACME y la entrada «Flights of Flames» del blog de
  la Estación.
- El archivo trae dos palabras sueltas, «firecrawl» y «huggingface», que parecen restos de la herramienta
  con que se escribió. No son fuentes.

## Lo que quedó sin verificar

1. Que `marina/data.pdf` sea idéntico byte a byte al PDF de NTRS 20160000593 (no se podía descargar).
2. El sitio http://flame.sdsu.edu que cita el cartel.
3. Si la fecha 24-jun-2018 de las pruebas T9 y T18 de BASS-II es una errata de NASA por 2014.
4. Las condiciones para incrustar NASA Eyes en un sitio de terceros.
5. El modelo de la Estación (38.78 KB según la página): no lo abrí.
6. Si hay un modelo de traje en el catálogo de 3D Resources.
7. Si Space Apps tiene reglas de marca propias para los equipos.
8. De «Feedback»: la galería de Glenn, los esquemas de FLARE en JAXA, las fotos de la Cygnus quemada, las
   micrografías de hollín, las texturas de solarsystem.nasa.gov y los modelos xEMU.
9. Si FLARE ya voló y qué encontró; el estado actual de SoFIE. Solo tengo resultados de búsqueda.
10. Si la base MAPTIS de resultados de la Prueba 1 es de acceso público.
11. Si alguna página de `app/evidence/` o figura de `app/figures/` muestra la insignia de NASA.
12. El tamaño del repositorio `nasa/NASA-3D-Resources`.

## Visto de paso, fuera del encargo

En `data/pruebas.csv`, cinco filas de BASS-II traen en `notas` un «O2 final pct» imposible o muy raro frente
a su oxígeno inicial: B2 (fila 3: 22.2 inicial, 1.6 final), P22a (fila 97: 20.8 y 0.6), P22b (fila 98: 20.0
y 39.1), T28a (fila 128: 20.7 y 0.9) y T28b (fila 129: 20.7 y 40.4). No revisé si viene así de la tabla de
PSI o de la limpieza. No toca las cifras de la portada, porque el rango de oxígeno usa el valor inicial.

## Preguntas que tiene que decidir Marco Sebastián

1. **La frase del 13.5 % contra 15.4 %.** Hoy es correcta pero incompleta. Yo la precisaría ahora (mejora 1,
   15 minutos), porque es la cifra que más fácil puede cuestionar un juez que conozca la norma. Opciones:
   precisarla ahora, dejarla anotada o no tocarla.
2. **Regla de atribución para la IA.** La guía de NASA prohíbe «según NASA» en productos con IA. Yo agregaría
   la línea ahora (mejora 2). Es mi lectura de una guía, no un requisito del concurso; no encontré que Space
   Apps lo exija. Opciones: agregarla ahora, preguntarle primero a la sede o no hacerlo.
3. **Las 57 filas de PMMA.** Mejora los datos con fuente comprobada, pero mueve cifras que ya se ven en la
   plataforma (el pasaporte de PMMA) y obliga a correr otra vez el verificador. Opciones: hacerlo ahora,
   hacerlo después de la entrega y decirlo como límite conocido, o no hacerlo.
4. **Documentos fuera de PSI.** La norma, el memorando de 1989 y el cartel no tienen PSI-ID. La regla del
   `README.md` dice que cada cifra se rastrea a un PSI-ID; la guía de 2015 ya entró como «contexto». ¿Entran
   estos tres igual, marcados como contexto, o solo la norma?
5. **«Hasta 2018».** ¿Se deja como está, se cambia a «hasta 2016, con dos pruebas que la fuente fecha en
   2018», o se anota la duda en `INVESTIGACION.md`?
6. **Modelos 3D.** Para cuando se rehaga la interfaz: imagen fija por mundo (sin librerías) o visor 3D (con
   una librería nueva). Yo empezaría por la imagen fija.
7. **El resto de «Feedback».** ¿Lo verifica Sebastián Martínez con la plantilla (una fuente abierta por
   afirmación) o se deja?
8. **Nombres y plantilla.** `data.pdf` no dice qué es. ¿Se le pide a Marina renombrarlo (por ejemplo
   `20160000593_BASS-II_cartel_2014.pdf`) y a cada quien llenar `PLANTILLA.md`, o lo acomoda la sesión
   principal?
9. **Preguntar a la sede** si los equipos pueden usar algún logotipo de Space Apps o de NASA en la plataforma
   y en la presentación. Hasta tener respuesta, ninguno.
