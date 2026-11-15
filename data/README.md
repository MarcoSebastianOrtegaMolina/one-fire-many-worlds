# Datos: fuentes, descarga y limpieza

Todo viene del repositorio **PSI (Physical Sciences Informatics) de NASA**, https://psi.nasa.gov, la fuente
que `RETO.md` marca como obligatoria. Es abierto y no pide cuenta.

- **Fecha de descarga:** viernes 13 de noviembre de 2026 (hora de Hermosillo, UTC-7), en varias tandas. La
  hora exacta, la URL, los bytes y el sha256 de cada archivo están en `raw/manifest.json`.
- **Cómo se bajó:** con `scripts/descargar_psi.py` y `scripts/descargar_documentos.py`, a una petición cada
  1.1 segundos, por las direcciones que usa el propio sitio. No están documentadas y pueden cambiar.
- **Segunda versión.** Este archivo se corrigió después de una auditoría; `INVESTIGACION.md`, sección 10,
  dice qué cambió.
- **Licencia:** cada ficha declara la suya; 27 de las 28 dicen CC0-1.0 y una no declara ninguna (ver la
  tabla de citas, al final).

## Direcciones usadas

| Qué | Dirección |
|---|---|
| Lista o búsqueda | `https://psi.nasa.gov/geode-py/ws/repo/search?term=TÉRMINO&source=psi&type=investigation&size=500` |
| Ficha de una investigación | `https://psi.nasa.gov/geode-py/ws/repo/investigations/PSI-N` |
| Archivo de una investigación | `https://psi.nasa.gov/geode-py/ws/studies/PSI-N/download?file=NOMBRE&version=V` |
| Listado completo de archivos | `POST https://psi.nasa.gov/geode-py/ws/files/v2` con el cuerpo JSON `{"folder": "", "fileType": "study", "studyId": "PSI-N", "version": V}` |
| Página para humanos | `https://psi.nasa.gov/physci/repo/data/investigations/PSI-N` |

Cuatro cosas que aprendimos de la API:

- Sin `size`, la búsqueda entrega 25 resultados aunque reporte más. Con `size=500` llegan todos. `from=25`
  también funciona; `page=2` no hace nada.
- Con `term` vacío devuelve las 133 investigaciones de PSI.
- El nombre de cada tabla experimental está en la ficha, en `experimentalTable[].file_name`, con su `version`.
- **El campo `added[]` de la ficha no es la lista de archivos.** Solo trae lo que cambió en la última
  versión de la investigación, así que una investigación cuya última versión fue un cambio de metadatos
  parece no tener archivos. La lista completa la da la llamada `files/v2` de la tabla de arriba (la que usa
  el sitio en "Data files and documents"); devuelve un árbol con `sortingCategory`, `key`, `bytes_size` y
  `version` por archivo. La primera versión de este trabajo cayó en ese error.

## Qué hay en cada carpeta

<!-- TABLA:archivos -->
| Carpeta de data/raw/ | Archivos | Peso |
|---|---|---|
| archivos | 28 | 31.9 MB |
| documentos | 738 | 1490.4 MB |
| fichas | 28 | 22.7 MB |
| listas | 47 | 3.5 MB |
| tablas | 26 | 0.2 MB |
| **total** | 867 | 1548.8 MB |

Descarga hecha entre 2026-11-13T14:37:52-07:00 y 2026-11-13T16:45:15-07:00. Fallos registrados: 6.
<!-- /TABLA:archivos -->

| Ruta | Contenido |
|---|---|
| `raw/listas/todas.json` | Las 133 investigaciones de PSI |
| `raw/listas/busqueda_*.json` | Una búsqueda por término: combustion, fire, flame, smoke, aerosol, flammability, soot, extinguishment, droplet y cada acrónimo |
| `raw/candidatas.json` | Por qué entró cada investigación (área o término que la encontró) |
| `raw/fichas/PSI-N.json` | Ficha completa, tal cual |
| `raw/tablas/PSI-N/` | Tablas experimentales, tal cual, con su nombre original |
| `raw/documentos/PSI-N/CATEGORÍA/` | Documentos de apoyo (Science Documents, Engineering Documents, Reference Data) |
| `raw/archivos/PSI-N.json` | Listado completo de archivos de cada investigación, tal cual |
| `raw/inventario_archivos.csv` | Todo lo que no es dato crudo, por investigación y categoría, con una columna que dice si se bajó |
| `raw/documentos_omitidos.csv` | Los 91 archivos de las tres categorías que no se bajaron, con su motivo |
| `raw/documentos_texto/` | Texto extraído de cada documento, para buscar con `scripts/buscar_texto.py`; `indice.csv` dice cuáles no tienen texto |
| `raw/contexto/` | La Researcher's Guide de NASA (PDF y texto extraído). No es de PSI |
| `investigaciones.csv` | Una fila por investigación (28) |
| `pruebas.csv` | Una fila por prueba, muestra, día de prueba o renglón de matriz (2,348) |
| `publicaciones.csv` | Los 382 artículos que listan las fichas, con autores y DOI (295 lo traen) |
| `extra/` | Hojas útiles sacadas de los documentos: matriz "as run" de BASS, resumen de CFI y calibración del ventilador de BASS-II (tal cual); `saffire_ambiente.csv` (presión de cabina de las tres Saffire y oxígeno de Saffire-III: mínimo, mediana y máximo por sensor) `same_r_tamanos_particula.csv` (tamaños de partícula del humo por material), `flex_mezclas.csv` (composición del gas medida en cada llenado de la cámara de FLEX y FLEX-2, con su presión cuando hay lecturas: 155 archivos de mezcla) y `same_respuesta_detectores.csv` (base, pico y cambio de cada detector de humo en cada hoja de SAME y SAME-R; resumen grueso, sin validar: el pico es el percentil 99 de alejamiento de la base y el día, la corrida y el material salen del nombre del archivo) |
| `cobertura.csv` | Intervalos de oxígeno, presión y flujo por investigación |
| `clasificacion.csv` | Pilar, combustible, equipo y relevancia. **Es interpretación nuestra**, escrita a mano |

**Qué entró.** Las 24 investigaciones del área "Combustion Science" más 4 de otras áreas que salían en las
búsquedas temáticas (PSI-77, 108, 179 y 181), que quedan marcadas como fuera de alcance. Las búsquedas por
acrónimo no meten investigaciones nuevas: "SAME", "BASS" o "FLEX" coinciden con palabras comunes.

**Qué no se bajó.** Datos crudos (65,994 archivos, 14 TB), datos analizados (2,190; 31.8 GB), calibración
(183; 9.9 GB) y presentaciones (134; 3.0 GB). De los 43 reportes finales se bajaron 41 (dos dieron error
404, entre ellos el de BASS). De los datos crudos y analizados se bajaron solo tablas, por nombre: 9 chicas
(92 MB) con la telemetría de las tres Saffire, los sensores por muestra de Saffire-III y el archivo de
resultados de SAME y SAME-R; y las 125 hojas .xls de datos analizados de SAME y SAME-R (683 MB), con las
series de tiempo de sus detectores, una lectura por segundo. También, de los datos crudos de FLEX y
FLEX-2, 303 archivos de texto chicos (4.4 MB): los `_Mixture.txt` de cada llenado de la cámara y sus
`_Chamber_Readings.txt`, más cuatro archivos de una prueba de muestra.

**Librería instalada en el proyecto.** xlrd 2.0.2 (licencia BSD, sin dependencias, solo lee .xls; subida a
PyPI el 14 de junio de 2025, según https://pypi.org/pypi/xlrd/json consultado el 13 de noviembre de 2026).
Está en `scripts/_vendor/`, fuera de git; se reinstala con
`python -m pip install --target scripts/_vendor xlrd==2.0.2`. La usa `extraer_texto.py`. De las tres categorías de documentos
(338 archivos) se bajaron 242: se omitieron 9 videos, 81 zip de más de 5 MB (fotos y planos) y un documento
de más de 20 MB, y 5 entradas del listado (4 archivos distintos) dieron error 404. Ese límite de tamaño lo pusimos nosotros.

**Qué documentos se pueden leer.** De los 283 (242 más 41 reportes), 204 tienen texto (183 documentos y 21
zip). 69 son PDF escaneados sin capa de texto (casi todos planos), 6 están en formatos viejos (.doc y .ppt)
y 4 zip dieron error. No se hizo reconocimiento de caracteres.

## investigaciones.csv

Sale de la ficha JSON, salvo `palabras_clave`, que solo viene en la lista.

| Columna | De dónde sale |
|---|---|
| `id`, `acronimo`, `titulo`, `doi` | `accession`, `investigationAcronym`, `title`, `doi` |
| `grupo` | Derivada: `combustion_microgravedad`, `estudio_en_tierra` (si `projectType` dice Ground) o `fuera_de_alcance` (lista fija en el script) |
| `area`, `subarea`, `tipo_proyecto` | `researchArea`, `subResearchArea`, `projectType` |
| `plataforma`, `equipo` | `flightProgram`, `experimentHardware` |
| `fecha_inicio`, `fecha_fin`, `fecha_publicacion` | `investigationStartDate`, `investigationEndDate`, `releaseDate` |
| `investigadores` | `contacts[]` con su rol |
| `objetivos`, `enfoque`, `hipotesis`, `beneficios_tierra` | `objective`, `approach`, `hypothesis`, `researchImpacts` |
| `investigaciones_relacionadas` | `related_glds` |
| `palabras_clave` | `Keywords` de `raw/listas/todas.json` |
| `n_tablas` | Número de entradas en `experimentalTable` |
| `n_filas_pruebas`, `nivel_filas`, `n_pruebas_individuales` | Contadas en `pruebas.csv` |
| `n_flamas_encendidas` | Suma de "Flames Ignited" en las tablas que van por día |
| `n_publicaciones`, `tamano_total_gb`, `licencia`, `version_ficha`, `fecha_modificacion` | `publications`, `totalFileSize`, `licenseIdentifier`, `version`, `modifiedDate` |
| `fecha_descarga`, `url`, `url_api` | Del manifest y del ID |
| `cita_psi` | Cita con la fórmula que usa el sitio en "Cite this Investigation" (ver "Citas") |

## pruebas.csv

### Columnas

| Columna | Qué es |
|---|---|
| `id_investigacion`, `acronimo` | PSI-ID y acrónimo |
| `tabla_origen`, `fila_origen` | Archivo en `raw/tablas/PSI-N/` y número de registro en ese CSV (el encabezado es el 1) |
| `nivel_fila` | Qué representa la fila: `prueba`, `muestra`, `dia_de_prueba`, `matriz_por_combustible`, `sesion` o `dato_auxiliar` |
| `id_prueba` | Identificador de la tabla original |
| `fecha` | En formato AAAA-MM-DD, solo si la tabla trae la fecha completa |
| `fecha_original` | Lo que dice la tabla |
| `combustible_material` | Texto original |
| `material_familia` | **Derivada.** Cuando el texto nombra el material (PMMA, SIBAL, Nomex, cera...). Si no, "no especificado en la tabla". Una excepción con fuente: en BASS-II (PSI-25), 57 muestras que la tabla solo describe como barra, lámina o sección esférica son PMMA según el cartel de BASS-II (ASGSR 2014, NTRS 20160000593, láminas 12, 14, 18 y 20) y el reporte resumen NASA/TM-20210011385; esas filas lo dicen en `notas` (cambio del 14-nov-2026) |
| `tipo_combustible` | **Derivada**, fija por tabla: sólido, líquido o gas |
| `forma_tamano` | Forma y tamaño de la muestra o del quemador, cuando vienen en columnas aparte |
| `oxigeno_pct_min`, `oxigeno_pct_max` | Oxígeno en porcentaje por volumen. Iguales si la fila da un solo valor |
| `oxigeno_original` | Texto original, con el nombre de su columna |
| `oxigeno_referencia` | `atmosfera` o `gas_del_quemador (flama inversa)` |
| `presion_original` | Texto original con su unidad |
| `presion_kpa_min`, `presion_kpa_max`, `presion_psia_min`, `presion_psia_max` | **Convertidas.** 1 atm = 101.325 kPa; 1 bar = 100 kPa; 1 mmHg = 0.1333224 kPa; 1 psi = 6.894757 kPa |
| `flujo_original` | Texto original |
| `flujo_cm_s_min`, `flujo_cm_s_max` | Solo cuando la tabla lo da en cm/s |
| `flujo_direccion` | concurrente, opuesto o coflujo |
| `diluyente_supresor` | Gas que diluye o apaga, cuando la tabla lo dice |
| `resultado` | Desenlace, cuando la tabla lo trae |
| `notas` | Lo demás de la fila y cualquier aviso de calidad ("AVISO", "OJO") |
| `duplicado_de_fila` | Si la fila es copia exacta de otra de la misma tabla, el número de la primera. Vacío si no |

Reglas generales:

- Lo que la tabla no trae queda vacío. No se rellenó nada con lo que "debería" ser.
- Las fracciones molares de oxígeno se multiplicaron por 100.
- Los intervalos y las listas ("21; 26.5; 40", "21.5 - 21.7") dan mínimo y máximo.
- Un valor imposible (presión de 0 mmHg, oxígeno de 3400 %, fecha del año 2103) queda vacío y con nota.
- Las filas totalmente vacías y los renglones de notas al pie no generan fila.
- `id_prueba` no es único: se repite en SPICE, CFI y BASS. La llave de una fila es `tabla_origen` más
  `fila_origen`.
- 35 filas son copias exactas de otra (34 en SPICE, 1 en E-FIELD). Se conservan, marcadas en
  `duplicado_de_fila`, y `cobertura.py` no las cuenta.
- BRE aparece dos veces, con niveles distintos: 18 filas por día (de la tabla experimental) y 177 por
  prueba (de una tesis). `cobertura.py` cuenta solo las 177.
- SAME también: 8 filas `muestra` (de la tabla experimental) y 45 filas `prueba` (corridas de 2007, del
  archivo de resultados).
- La presión de las tres Saffire y el oxígeno de Saffire-III salen de su telemetría (datos crudos), vía
  `extra/saffire_ambiente.csv`; se pone el intervalo mínimo a máximo medido y `notas` dice el archivo.
- Seis cosas más salen de un documento o de la ficha y no de la tabla experimental; cada fila lo dice en
  `tabla_origen`, `notas` o `fecha_original`: las condiciones de BASS, las 227 pruebas de CFI, las 113
  pruebas de BRE, el año de SAME-R, el año de SPICE y la fecha de Saffire-III.

### Mapeo tabla por tabla

**PSI-25 BASS-II** (129 filas, `prueba`)

| Columna original | Va a |
|---|---|
| Test # | `id_prueba` |
| Date | `fecha` |
| Fuel Sample Material | `combustible_material`, `material_familia` |
| Calibrated initial O2 % by vol | `oxigeno_pct_min` y `max` |
| Air display | `flujo_cm_s`. El ReadMe de BASS-II lo define: "Air display: flow speed measured in the duct in cm/s on the video display" |
| Fan display, Flow restrictor | `flujo_original`. Fan display es el voltaje del ventilador por 10; el restrictor va de 0 (más flujo) a 2 (menos) |
| PI, Sample #, Calibrated final O2, CO2 inicial y final, CO inicial y final | `notas` |
| GMT, Radiometer gain, Total Frames Shot | no se usan |

En "Air display" se quita lo que va entre paréntesis (son posiciones del potenciómetro). El anemómetro tarda
cerca de un minuto en responder, según el ReadMe, así que la lectura solo es fiable en flujo sostenido. Tres
filas dan más de 40 cm/s, por encima de lo que declara la ficha, y dos pruebas tienen un oxígeno final
imposible; llevan "AVISO" en `notas`.

La dirección del flujo y el resultado no salen de la tabla experimental sino del reporte resumen de BASS-II
(`BASS-II Summary Report.pdf`, NASA/TM-20210011385, en los Reports de PSI-25):

| De dónde | Va a |
|---|---|
| Apéndice A (págs. 111 a 121), columna "Sample distance": Opposed, Concurrent o Stagnation | `flujo_direccion` |
| Apéndice A, columna "Test observations and anomalies" | `resultado` (hasta 600 caracteres) |
| Tabla 5.1 (pág. 65), pruebas M1 a M20: spread rate, burn time, velocity, sides, thickness, width | `resultado`, antepuesto a las observaciones |
| Tabla 7.1 (pág. 104), pruebas T1 a T29: comments (Quenched, No ignition, Blow-off...) | `resultado`, antepuesto |

El apéndice se lee por la posición de las palabras en la página (necesita pymupdf). Una fila solo se usa si
su oxígeno inicial calibrado coincide con el de la tabla experimental: coincidieron 126 de 126. Las pruebas
O20, O21 y O22 no están en el reporte.

**PSI-26 BASS** (122 filas, `prueba`)

| Columna original | Va a |
|---|---|
| Test # (o As Run Test # si falta) | `id_prueba` |
| Date | `fecha` |
| Fuel Sample Material | `combustible_material`, `material_familia`; si el texto dice "opposed", `flujo_direccion` |
| Sample #, As Run Test # | `notas` |

La tabla experimental no trae oxígeno, presión, flujo ni resultado. Se completan con el documento
`As Run_Test Matrix.xlsx` (Science Documents de PSI-26), hojas "2012" y "2013", unido por "As Run Test #":

| Columna de la matriz | Va a |
|---|---|
| O2 % by volume (viene como fracción) | oxígeno, multiplicado por 100 |
| pressure, atm | presión |
| Air display | `flujo_cm_s` (misma regla que en BASS-II) |
| Fan display | `flujo_original` |
| GN2 display, GN2 Pot | `diluyente_supresor` = "N2 aplicado", solo si GN2 display trae un número |
| Test Observations and Anomalies | `resultado` (hasta 600 caracteres) |
| CO2, mm Hg | `notas` |

121 de las 122 filas encontraron su renglón. En 3 el material de la tabla y el de la matriz no coinciden;
llevan "OJO" en `notas`. Necesita la librería openpyxl; sin ella, BASS queda como en la tabla.

**PSI-98, PSI-99, PSI-100 Saffire-I, II y III** (2, 9 y 2 filas `muestra`; 2 y 2 `dato_auxiliar`)

| Columna original | Va a |
|---|---|
| Sample Number | `id_prueba` |
| Material | `combustible_material`, `material_familia` |
| Sample Thickness, Length, Width | `forma_tamano` |
| Percent O2 | oxígeno (Saffire-III no la trae) |
| Air Flow | `flujo_cm_s` |
| Flow Direction o Direction | `flujo_direccion` |
| Burn Time, µ-g Burn Length, µ-g Spread Length | `resultado` |
| Ignition Power, Ignition Time | `notas` |
| 1-g Burn Length, 1-g Spread Rate, Camera 1 y 2 | no se usan (siguen en la tabla original) |

La fecha de Saffire-III (3 de junio de 2017) no viene en la tabla: sale de los sellos de tiempo de las
imágenes en `SAFFIRE-III_MergeResult-raw_Final.xlsx`. Las filas "Pre-test flow visualization" son `dato_auxiliar`. Las "Note 1" a "Note 4" van a `notas` de la
primera muestra. La nota 1 de Saffire-II dice que el oxígeno se derivó del CO2 medido.

**PSI-101 SAME-R** (109 filas, `prueba`)

| Columna original | Va a |
|---|---|
| SAME Test # | `id_prueba` |
| Sample Type | `combustible_material`, `material_familia` |
| Date | `fecha`, con el año 2010 tomado de la ficha ("SAME-R flight tests were conducted from July 16, to September 9, 2010"; las fechas de la tabla van del 16-Jul al 9-Sep) |
| Inlet velocity (cm/s) | `flujo_cm_s` |
| Description, Rt/R0, Duration, tiempos de envejecimiento y mezclado | `notas` |

**PSI-101 y PSI-102, resultados por corrida.** El archivo `SAME, SAME-R_Results.xlsx` (Analyzed Data de
PSI-101) trae una fila por corrida de los dos experimentos; la columna "Flight" dice de cuál es (1 = SAME,
2 = SAME-R). De ahí salen a `resultado` el diámetro medio por conteo ("M1/M0 (micro-m)--CMD", pasado a nm),
el diámetro de masa promedio, sigma g y la pérdida de masa. En SAME-R se unen a las filas de su tabla por
el número de prueba (106 de 109). En SAME son filas nuevas (45 corridas de 2007, nivel `prueba`), porque su
tabla experimental solo lista 8 muestras.

**PSI-102 SAME** (8 filas, `muestra`): Sample # a `id_prueba`; Sample Material a `combustible_material`;
Air Flow a `flujo_cm_s`; Weight loss rate y Aging Duration a `notas`. Cuatro filas solo dicen "same
conditions as 1-4" y quedan sin condiciones.

**PSI-47 DAFT / DAFT-2** (2 filas, `sesion`): Session Name a `id_prueba`; Actual Day ("GMT 54 (2005)") a
`fecha`; Sample Material a `combustible_material`; lo demás a `notas`. No hay combustión.

**PSI-107 SPICE** (469 filas, `prueba`)

| Columna original | Va a |
|---|---|
| GMT date + GMT ignition | `id_prueba`; `fecha`, con el año 2009 tomado del reporte de 30 días de SPICE ("It was operated in the Microgravity Science Glovebox by various crew members in 2009") |
| Fuel | `combustible_material` |
| Nozzle (mm) | `forma_tamano` |
| Air Rate (cm/s) | `flujo_cm_s`; `flujo_direccion` = coflujo, **tomado del título del experimento** |
| GMT Flame Off | `resultado` |
| Fuel Rate (sccm), Fuel Rate (mg/s), HC Fuel Rate | `notas` |

**PSI-106 SLICE** (12 filas, `dia_de_prueba`): Test Date a `fecha` (el texto pegado a la fecha va a
`notas`); Fuel Type a `combustible_material`; si dice "balance N2", `diluyente_supresor`.

**PSI-10 ACME Flame Design**, flamas normales (207 filas, `prueba`)

| Columna original | Va a |
|---|---|
| Test | `id_prueba` |
| Day | `fecha_original` (número de día de prueba) |
| Fuel | `combustible_material` |
| XO2 (init) | oxígeno de la atmósfera |
| pinit (atm) | presión |
| Xfuel menor que 1 | `diluyente_supresor` = N2 en el combustible |
| Flame Type, mfuel, mN2, XO2 (final), pfinal, mean Zst, Tad | `notas` |
| mtot, pmean | no se usan |

**PSI-10 ACME Flame Design**, flamas inversas (120 filas, `prueba`): igual, pero `XO2` es el oxígeno **del
gas que sale del quemador** (`oxigeno_referencia` lo dice) y el combustible es el C2H4 de la cámara
(`XC2H4 initial`). Once filas dicen "RAMP" o "LOW O2" y quedan sin número.

**PSI-159 ACME CFI-G**, flamas normales (179 filas) e inversas (154 filas), `prueba`

| Columna original | Va a |
|---|---|
| Test | `id_prueba` |
| Fuel | `combustible_material` |
| XO2 before test (normales) | oxígeno de la atmósfera |
| XO2 (inversas) | oxígeno del gas del quemador |
| approx p (bar) | presión |
| Hot ignition, burn time, Self-ext or flow term, Cool flame?, Color | `resultado` |
| Xf, flujos, TFP, Tad, Zst, Peak burner T, Comments | `notas` |

"SE" y "FT" son los valores de la columna "Self-ext or flow term". La tabla de inversas trae 861 filas vacías.

**PSI-20 ACME BRE** (18 filas, `dia_de_prueba`): Year, Month y Date a `fecha`; Burner Size a `forma_tamano`;
Fuel Bottle a `combustible_material`; Oxygen Conc (percent) a oxígeno (es una lista de las concentraciones
del día); Flames Ignited a `resultado`. El diluyente (N2) sale de la nota de la tabla.

**PSI-21 ACME CLD Flame** (32 filas, `dia_de_prueba`): Test Day (formato AADDD, explicado en la nota de la
tabla) a `fecha`; Fuel Bottle a `combustible_material`; Flames ignited a `resultado`; Test Type, Fuel MFC,
N2 MFC y Fuel conc. Range a `notas`. Quemador y dirección de coflujo tomados del nombre del experimento.

**PSI-22 ACME E-FIELD Flames** (21 filas, `dia_de_prueba`): Year, Month y Date a `fecha`; Fuel Bottle y
Fuel Conc a `combustible_material`; Test Type da el quemador en `forma_tamano`; Mesh Polarity a `notas`;
Flames Ignited a `resultado`. Once renglones de continuación se pegan al día anterior.

**PSI-23 ACME s-Flame** (18 filas, `dia_de_prueba`): Year, Month y Date a `fecha`; Fuel Bottle a
`combustible_material`; Atmosphere ("~30% and ~21% O2 with He") a oxígeno y a `diluyente_supresor`; la
presión (1 atm) sale de la nota de la tabla; Flames Ignited a `resultado`.

**PSI-20 ACME BRE, por prueba** (177 filas, `prueba`). No salen de la tabla experimental sino de tres tablas
de la tesis `Dissertation-PD-revised_.pdf`, archivada en los Reports de PSI-20: la 6.1 (etileno con
nitrógeno, páginas 110 a 112, 124 pruebas), la E.1 (metano con nitrógeno, quemador de 25 mm, página 163, 29
pruebas) y la F.1 (etileno con nitrógeno, quemador de 50 mm, página 164, 24 pruebas). En las E.1 y F.1 el
orden de columnas es ∆hc, XO2 antes, XO2 después, p. Se lee del texto
extraído del PDF (`raw/documentos_texto/`), así que hay que correr antes `extraer_texto.py`.

| Columna de la tabla 6.1 | Va a |
|---|---|
| test ID (formato AADDDX#, explicado en el ReadMe de BRE) | `id_prueba`; `fecha` |
| XO2 before test | oxígeno de la atmósfera |
| p (bar) | presión |
| end condition: SE, FT o FTO | `resultado` (se autoextinguió; se cortó el combustible; se cortó con oscilaciones) |
| Ext Time/end time, Osc. Time | `resultado` |
| XO2 after test, ∆hc, flujo másico, yf, rf | `notas` |

Un renglón sin oxígeno o presión legibles se descarta (3). Uno incompleto se conserva, marcado en `notas`
(9, de ellos 5 sin condición final). Las 177 pruebas se cotejaron con una segunda lectura del PDF por
posición de las palabras, renglón por renglón: 176 coinciden en oxígeno, presión y condición final; la otra
aparece en dos tablas con distinto redondeo. Una prueba que sale en dos tablas se queda con su primera aparición. Cada fila lleva en `notas` el aviso de comprobarla contra la página antes de citarla.

**PSI-39 CFI** (227 filas, `prueba`). No salen de la tabla experimental (87 filas, 79 distintas, solo
condiciones) sino del documento `CFI_DataSummary_Spreadsheet_Jan2021.xlsx`, hojas "Master Sheet" (mismas
columnas que la tabla, 227 pruebas), "DATA" (resultados) y "Comments". Las 79 de la tabla están todas en el
documento, con las mismas condiciones; cada fila dice en `notas` si estaba en la tabla. De "DATA" van a
`resultado` los diámetros de extinción caliente y fría, las tasas de quemado, las reigniciones y el tiempo
de flama caliente; el diámetro inicial va a `forma_tamano`. Necesita openpyxl; sin ella se usa la tabla.

Mapeo de las columnas comunes:

| Columna original | Va a |
|---|---|
| Flex Number | `id_prueba` |
| Test Date | `fecha` |
| Fuel | `combustible_material` |
| Fiber | `forma_tamano` (gota libre o sostenida en fibra) |
| Oxygen | oxígeno |
| Pressure | presión |
| Nitrogen, Helium | `diluyente_supresor` |
| CIR, Local Time | `notas` |

**PSI-68 FLEX-2** (8 filas, `matriz_por_combustible`): cada fila es un combustible con los **intervalos**
de diámetro de gota, oxígeno, presión y flujo que abarcó el experimento. No son pruebas individuales.

**PSI-69 FLEX** (274 filas, `prueba`)

| Columna original | Va a |
|---|---|
| FLEX Identifier | `id_prueba` |
| Test Date | `fecha` |
| Fuel | `combustible_material` |
| Droplet initial diameter; mm | `forma_tamano` |
| O initial ambient composition; mole fraction | oxígeno |
| Ambient pressure; mmHg | presión |
| CO y He initial ambient composition | `diluyente_supresor` |
| Test end, Visible flame extinction diameter, Burning rate, Burn time | `resultado` |
| FLEX Test #, Test GMT, N | `notas` |

El encabezado perdió los subíndices: "O", "N", "CO" y "He". **"CO" se tomó como CO2.** Es interpretación: la
ficha habla de CO2 como supresor y las cuatro fracciones suman 1 en 268 de las 274 filas.

### Tablas que se bajaron y no entran a pruebas.csv

| ID | Por qué |
|---|---|
| PSI-142 | Es un índice de figuras de artículos, no una lista de pruebas |
| PSI-77 | Soldadura, no combustión |
| PSI-108 (2 tablas) | Física de fluidos, no combustión |
| PSI-181 | Ciencia de materiales, no combustión |

## Citas

NASA pide citar cada investigación con su DOI. El sitio no guarda el texto de "Cite this Investigation": lo
arma en el navegador con una fórmula fija. La leímos de su código (`main.5216219a85b99359.js`, funciones
`getCitation` y `sortPeople`, el 13 de noviembre de 2026) y la reprodujimos en `limpiar_psi.py`:

    Apellido N, Apellido N. "Título", NASA PSI Data Repository, Version V, http://doi.org/DOI

Los autores son los contactos de la ficha, ordenados por rol (investigador principal, coinvestigador,
científico de proyecto y después los demás), con la inicial del nombre y, si hay, la del segundo nombre.

**Sin comprobar contra la página ya dibujada.** Antes de entregar, abrir una investigación, pulsar "Cite
this Investigation" y comparar con su fila. Las erratas de los nombres (por ejemplo "Bhattachjee") vienen
de la ficha.

<!-- TABLA:doi -->
| ID | Acrónimo | DOI | Licencia | Ficha modificada | Cita, con la fórmula de "Cite this Investigation" del sitio |
|---|---|---|---|---|---|
| PSI-10 | ACME/Flame Design | [10.60555/w4zy-bt45](https://doi.org/10.60555/w4zy-bt45) | no declara | 20-Nov-2025 | Axelbaum RL, Sunderland PB, Urban DL, Stocker DP, Frolov SM. "Advanced Combustion via Microgravity Experiments / Flame Design", NASA PSI Data Repository, Version 1, http://doi.org/10.60555/w4zy-bt45 |
| PSI-20 | ACME BRE | [10.60555/vb93-3y72](https://doi.org/10.60555/vb93-3y72) | CC0-1.0 | 05-Jun-2025 | Quintiere JG, Ris J, Sunderland P, Stocker D. "Advanced Combustion via Microgravity Experiments - Burning Rate Emulator", NASA PSI Data Repository, Version 4, http://doi.org/10.60555/vb93-3y72 |
| PSI-21 | ACME CLD Flame | [10.60555/23e1-9950](https://doi.org/10.60555/23e1-9950) | CC0-1.0 | 22-Jan-2025 | Long MB, Smooke M, Stocker D. "Advanced Combustion via Microgravity Experiments / Coflow Laminar Diffusion Flame", NASA PSI Data Repository, Version 4, http://doi.org/10.60555/23e1-9950 |
| PSI-22 | ACME E-FIELD Flames | [10.60555/se5a-8c73](https://doi.org/10.60555/se5a-8c73) | CC0-1.0 | 08-May-2026 | Dunn-Rankin D, Stocker D, Chien A. "Advanced Combustion via Microgravity Experiments Electric-Field Effects on Laminar Diffusion Flames", NASA PSI Data Repository, Version 7, http://doi.org/10.60555/se5a-8c73 |
| PSI-23 | ACME s-Flame | [10.60555/k57n-p030](https://doi.org/10.60555/k57n-p030) | CC0-1.0 | 05-Jun-2025 | Law CK, Tse S, Stocker D. "Advanced Combustion via Microgravity Experiments-Structure and Response of Spherical Diffusion Flames", NASA PSI Data Repository, Version 4, http://doi.org/10.60555/k57n-p030 |
| PSI-25 | BASS-II | [10.60555/4qc4-de67](https://doi.org/10.60555/4qc4-de67) | CC0-1.0 | 24-Nov-2025 | Ferkul P, Fernandez-Pello C, Miller F, T'ien J, Bhattachjee S. "Burning and Suppression of Solids - II", NASA PSI Data Repository, Version 4, http://doi.org/10.60555/4qc4-de67 |
| PSI-26 | BASS | [10.60555/58h4-dy80](https://doi.org/10.60555/58h4-dy80) | CC0-1.0 | 19-Mar-2025 | Ferkul P, Takahashi F, T'ien J, Olson S. "Burning and Suppression of Solids", NASA PSI Data Repository, Version 4, http://doi.org/10.60555/58h4-dy80 |
| PSI-39 | CFI | [10.60555/m6pj-a914](https://doi.org/10.60555/m6pj-a914) | CC0-1.0 | 03-Jun-2025 | Williams F, Dryer F, Farouk T, Nayagam V, Dietrich D. "Cool Flames Investigation", NASA PSI Data Repository, Version 4, http://doi.org/10.60555/m6pj-a914 |
| PSI-47 | DAFT / DAFT-2 | [10.60555/ztgj-d202](https://doi.org/10.60555/ztgj-d202) | CC0-1.0 | 02-Jun-2025 | Urban DL, Fortenberry C. "Dust and Aerosol Measurement Feasibility Test / Dust and Aerosol Measurement Feasibility Test-2", NASA PSI Data Repository, Version 5, http://doi.org/10.60555/ztgj-d202 |
| PSI-60 | (sin acrónimo) | [10.60555/mzjm-yv57](https://doi.org/10.60555/mzjm-yv57) | CC0-1.0 | 30-Sep-2025 | Smooke MD, Long MB, Dietrich DL. "Computational and Experimental Analysis of SPICE Data Sets", NASA PSI Data Repository, Version 1, http://doi.org/10.60555/mzjm-yv57 |
| PSI-62 | (sin acrónimo) | [10.60555/e9xp-ex83](https://doi.org/10.60555/e9xp-ex83) | CC0-1.0 | 14-Nov-2025 | DesJardin P, Urban D. "Concurrent Flame Spread Modeling using Flamelet Generated Manifolds in Microgravity with Comparison to BASS Experiments using Two-Color Tomography", NASA PSI Data Repository, Version 1, http://doi.org/10.60555/e9xp-ex83 |
| PSI-68 | FLEX-2 | [10.60555/byp8-h018](https://doi.org/10.60555/byp8-h018) | CC0-1.0 | 25-Nov-2025 | Williams FA, Dryer F, Shaw B, Choi M, Nayagam V, Avedisian T, Dietrich D, Hicks M. "Flame Extinguishment Experiment - 2", NASA PSI Data Repository, Version 6, http://doi.org/10.60555/byp8-h018 |
| PSI-69 | FLEX | [10.60555/mbq8-0451](https://doi.org/10.60555/mbq8-0451) | CC0-1.0 | 06-Jun-2025 | Williams FA, Shaw BD, Hicks MC, Nayagam V, Choi MY, Dryer FL, Dietrich D. "Flame Extinguishment Experiment", NASA PSI Data Repository, Version 5, http://doi.org/10.60555/mbq8-0451 |
| PSI-77 | ISSI | [10.60555/dc58-7a75](https://doi.org/10.60555/dc58-7a75) | CC0-1.0 | 28-Mar-2025 | Grugel R, Louise L. "In Space Soldering Investigation", NASA PSI Data Repository, Version 4, http://doi.org/10.60555/dc58-7a75 |
| PSI-98 | SAFFIRE-I | [10.60555/0t15-1z43](https://doi.org/10.60555/0t15-1z43) | CC0-1.0 | 03-Jun-2025 | Urban DL. "Spacecraft Fire Safety Experiment-I", NASA PSI Data Repository, Version 4, http://doi.org/10.60555/0t15-1z43 |
| PSI-99 | SAFFIRE-II | [10.60555/2chp-m469](https://doi.org/10.60555/2chp-m469) | CC0-1.0 | 04-Jun-2025 | Urban DL, Ruff G. "Spacecraft Fire Experiment-II", NASA PSI Data Repository, Version 5, http://doi.org/10.60555/2chp-m469 |
| PSI-100 | SAFFIRE-III | [10.60555/040q-4h36](https://doi.org/10.60555/040q-4h36) | CC0-1.0 | 05-Jun-2025 | Urban DL. "Spacecraft Fire Experiment-III", NASA PSI Data Repository, Version 4, http://doi.org/10.60555/040q-4h36 |
| PSI-101 | SAME-R | [10.60555/2np7-jv14](https://doi.org/10.60555/2np7-jv14) | CC0-1.0 | 02-Jun-2025 | Urban D, Yuan Z, Yang JC, Cleary T, Mulholland GW, Fortenberry C. "Smoke Aerosol Measurement Experiment-Reflight", NASA PSI Data Repository, Version 4, http://doi.org/10.60555/2np7-jv14 |
| PSI-102 | SAME | [10.60555/gd4k-8h62](https://doi.org/10.60555/gd4k-8h62) | CC0-1.0 | 02-Jun-2025 | Urban D, Mulholland G, Cleary T, Yang J, Fortenberry C. "Smoke and Aerosol Measurement Experiment", NASA PSI Data Repository, Version 4, http://doi.org/10.60555/gd4k-8h62 |
| PSI-106 | SLICE | [10.60555/pm12-rg61](https://doi.org/10.60555/pm12-rg61) | CC0-1.0 | 06-Feb-2025 | Long M, Smooke MD, Takahashi F, Stocker D. "Structure and Liftoff In Combustion Experiment", NASA PSI Data Repository, Version 3, http://doi.org/10.60555/pm12-rg61 |
| PSI-107 | SPICE | [10.60555/9kbh-e962](https://doi.org/10.60555/9kbh-e962) | CC0-1.0 | 02-Jun-2025 | Urban D, Sunderland P. "Smoke Point In Co-flow Experiment", NASA PSI Data Repository, Version 4, http://doi.org/10.60555/9kbh-e962 |
| PSI-108 | STDCE-1 | [10.60555/j1z3-bw42](https://doi.org/10.60555/j1z3-bw42) | CC0-1.0 | 06-Jun-2025 | Ostrach S, Kamotani Y, Hall N. "Surface Tension Driven Convection Experiment-1", NASA PSI Data Repository, Version 4, http://doi.org/10.60555/j1z3-bw42 |
| PSI-115 | (sin acrónimo) | [10.60555/q0v5-1v28](https://doi.org/10.60555/q0v5-1v28) | CC0-1.0 | 02-Jun-2025 | Garrick S, Hicks M. "Utilization of the Smoke Aerosol Measurement Experiment Data for Advanced Modeling and Simulation of Smoke Generation in Micro-Gravity", NASA PSI Data Repository, Version 3, http://doi.org/10.60555/q0v5-1v28 |
| PSI-117 | (sin acrónimo) | [10.60555/gz0q-b577](https://doi.org/10.60555/gz0q-b577) | CC0-1.0 | 09-Jun-2026 | Farouk T, Hicks M. "Effect of External Thermo-Convective Perturbation on Cool Flame Dynamics: A Multidimensional Multi-Physics CFD Analysis", NASA PSI Data Repository, Version 2, http://doi.org/10.60555/gz0q-b577 |
| PSI-142 | (sin acrónimo) | [10.60555/80qf-vj95](https://doi.org/10.60555/80qf-vj95) | CC0-1.0 | 06-Mar-2025 | Ju Y, Reuter C, Dietrich D. "Quantitative Studies of Cool Flame Transitions at Radiation / Stretch Extinction Using Counterflow Flames", NASA PSI Data Repository, Version 2, http://doi.org/10.60555/80qf-vj95 |
| PSI-159 | ACME CFI-G | [10.60555/cyt1-kh64](https://doi.org/10.60555/cyt1-kh64) | CC0-1.0 | 20-Nov-2025 | Sunderland PB, Axelbaum RL, Williams F, Stocker DP. "Advanced Combustion via Microgravity Experiments / Cool Flames Investigation with Gases", NASA PSI Data Repository, Version 1, http://doi.org/10.60555/cyt1-kh64 |
| PSI-179 | ASE | [10.60555/pdgr-c961](https://doi.org/10.60555/pdgr-c961) | CC0-1.0 | 05-Jun-2025 | Meyer ME. "Aerosol Sampling Experiment", NASA PSI Data Repository, Version 1, http://doi.org/10.60555/pdgr-c961 |
| PSI-181 | (sin acrónimo) | [10.60555/td9e-cz97](https://doi.org/10.60555/td9e-cz97) | CC0-1.0 | 20-Aug-2025 | Pathak S, Napolitano RE, Kumar M, Falana S. "Structure and Properties of Pb-Sn and Pb-free Sn-Ag-Cu Solders Produced in Terrestrial vs. Microgravity Environments under Extremes of Elevated and Cryo Temperatures", NASA PSI Data Repository, Version 1, http://doi.org/10.60555/td9e-cz97 |
<!-- /TABLA:doi -->

Cita general del repositorio: NASA Physical Sciences Informatics (PSI), https://psi.nasa.gov, consultado el
13 de noviembre de 2026.
