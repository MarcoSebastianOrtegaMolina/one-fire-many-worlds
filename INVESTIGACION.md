# Investigación previa: Flame in Freefall

Versión del viernes 13 de noviembre de 2026, después de nueve vueltas de auditoría sobre la primera.
Responde a `RETO.md`. Todo sale de archivos guardados en `data/raw/`; el detalle de fuentes y de cómo se
limpió cada tabla está en [data/README.md](data/README.md). La sección 10 lista lo que la auditoría corrigió,
y `scripts/verificar_cifras.py` comprueba que las cifras de este documento siguen saliendo de los datos.

**Cómo leer este documento.** Cada afirmación lleva una de estas etiquetas cuando no es obvio de dónde sale:

- **Dato:** está en una tabla experimental, una ficha o un documento de PSI, y se rastrea por su PSI-ID.
- **Contexto:** lo dice una página o guía de NASA, no los datos de PSI.
- **Interpretación:** es lectura nuestra. Hay que revisarla antes de mostrarla a los jueces.

**Límite de esta revisión.** La hizo el mismo asistente que escribió la primera versión, atacando sus propias
conclusiones contra los datos crudos y los documentos. No la ha revisado nadie más: falta una revisión
independiente del equipo. Y describe sobre todo qué se probó; de lo que se encontró solo hay pasajes de los
reportes finales, con su página.

---

## 1. Resumen de hallazgos

**Qué hay en PSI.** PSI tiene 133 investigaciones; 24 son del área "Combustion Science": 19 de vuelo y 5
estudios en tierra que reutilizaron datos de PSI. Bajamos sus 28 fichas (las 24 más 4 de otras áreas que
salían en las búsquedas), 26 tablas experimentales y 738 documentos de apoyo, entre ellos 41 reportes finales, 9 tablas de telemetría y de resultados,
143 hojas de datos analizados de SAME y SAME-R (125 con las series de tiempo de sus detectores de humo) y
303 archivos de texto chicos de FLEX y FLEX-2 (mezclas de gas y lecturas de la cámara). De ahí salieron 2,348 filas en
`data/pruebas.csv`, de 19 investigaciones: 2,199 pruebas individuales distintas, 1,460 de ellas con oxígeno
y presión a la vez. Están todas las investigaciones que nombra `RETO.md` menos LUCI y FM2, que son futuras.

**No quedó nada fuera.** (Dato) 46 búsquedas en todo PSI (fuego, humo, ignición, supresión, oxígeno, Luna,
Marte, gravedad parcial, baterías y otras) no encontraron ninguna investigación relevante para incendios
fuera de esas 28.

**La hipótesis del equipo se confirma, y con más datos que en la primera versión.** (Dato)

- Ninguna prueba con sólidos de las que tienen datos en PSI se hizo por encima de 22.7 % de oxígeno. De 405 filas de sólidos, 263 traen
  oxígeno: BASS (16.1 a 22.7 %), BASS-II (13.6 a 22.2 %), Saffire-I (21.5 a 21.7 %), Saffire-II (21.5 a
  22.1 %) y Saffire-III (19.4 a 20.1 %). 111 de esas 263 están por debajo de 19.5 %: los experimentos bajaron el oxígeno, nunca lo subieron.
- La presión de los sólidos es siempre la de la cabina: 14.3 a 14.8 psi en BASS y 14.4 a 14.9 psi en las
  tres Saffire (de su telemetría). BASS-II, SAME y SAME-R no la traen.
- Las 142 filas de sólidos sin oxígeno son de humo (SAME-R 109, SAME 32), más una de BASS.
- Sí hay pruebas cerca de la atmósfera de la base lunar, pero no con sólidos: FLEX quemó 17 gotas de
  heptano y metanol con 30 a 34 % de oxígeno a 0.7 atm (10.3 a 10.5 psi medidos), ACME CFI-G hizo 20
  flamas de gas con 33 a 39 % de oxígeno a 7.3 psi, y ACME BRE hizo 34 con 30 a 39 % a entre 8.2 y 8.9 psi.

**Una excepción que hay que conocer.** (Dato) Entre los reportes de PSI-108, una investigación de fluidos,
está el de SSCE (Solid Surface Combustion Experiment), del transbordador: quemó papel delgado en
microgravedad con 35 % de oxígeno a 1 atm, y en vuelos anteriores con 50 % a 1 y 2 atm. PSI solo tiene ese
reporte: SSCE no es una investigación del repositorio ni tiene datos. Es oxígeno alto, pero a presión de la
Tierra o mayor, no la de una base lunar. Por eso el titular dice "de las que tienen datos en PSI".

**Por qué pasó.** (Contexto y dato) La guía de NASA de 2015 dice que la guantera MSG, donde corrieron BASS y
BASS-II, está limitada al aire de la Estación (21 % de oxígeno, 1 atm) y que solo se podía bajar el oxígeno
agregando nitrógeno. La ficha de BASS-II dice lo mismo y la matriz de pruebas de BASS lo muestra.

**Dos investigaciones sí se diseñaron pensando en atmósferas de exploración.** (Dato)

- **ACME BRE.** Su ficha y su documento de interpretación de datos nombran las tres atmósferas que NASA
  considera para misiones tripuladas: 14.7 psia con 21 % de oxígeno, 10.2 psia con 26.5 % y 8.2 psia con
  34 %. La primera ronda se centró en ellas. BRE usa gas para imitar cómo arde un material condensado. Su
  tabla experimental va por día y sin presión, pero una tesis archivada entre sus reportes trae 177 pruebas
  con oxígeno, presión y desenlace; ya están en `pruebas.csv`.
- **FLEX.** Su documento de descripción dice que cuantifica el efecto de posibles atmósferas de exploración
  sobre la supresión. De ahí sus 103 pruebas a 0.7 atm.

**Qué tan buenos son los datos por frente.**

| Frente | Lo mejor que hay | Límite principal |
|---|---|---|
| Prevención | BASS y BASS-II: 251 pruebas con material, 250 con oxígeno y 225 con flujo en cm/s, y casi todas con observaciones. BASS trae además presión; BASS-II, dirección del flujo en 120 pruebas, velocidad de propagación en 20 y desenlace en 20 | Oxígeno siempre de 22.7 % o menos; la mayoría de los resultados son texto libre |
| Detección | SAME y SAME-R: 154 corridas con material y flujo, 131 de ellas con tamaño de partícula | Sin oxígeno ni presión; los tamaños salen de un archivo de resultados, no de la tabla experimental |
| Supresión | FLEX: 274 pruebas con oxígeno, presión, CO2 o helio y desenlace. BASS: 7 pruebas con nitrógeno aplicado sobre sólidos | FLEX es solo gotas de dos líquidos; en BASS el efecto del nitrógeno está descrito en texto, no medido |

**Lo que encontraron las investigaciones.** (Dato, de sus reportes finales; no se leyeron completos)

- **BRE** (reporte final de 2022, págs. 18 y 55): las flamas se extinguían sobre todo con 21 % de oxígeno a
  14.7 psia. Con 27 % a 10.2 psia y con 34 % a 8.2 psia, en general persistían 2 o 3 minutos o más. Es el
  resultado más directo sobre atmósferas de exploración que hay en PSI. Los datos por prueba van en la misma
  dirección: a cerca de 14.7 psia con menos de 23 % de oxígeno, las 10 flamas se autoextinguieron; a cerca
  de 8.2 psia con 29.8 a 39.3 %, 25 de 36 siguieron ardiendo hasta que se cortó el combustible (8 se
  autoextinguieron y 3 no traen desenlace). A cerca de 10.2
  psia con 24 a 29 % el cuadro es menos claro: 19 de 27 se autoextinguieron, y la tabla da el tiempo que
  tardaron, que no revisamos.
- **BASS y BASS-II** (reporte resumen NASA/TM-20210011385, págs. 19, 36 y 109): la frontera de
  inflamabilidad tiene forma de U frente al flujo; la tela de algodón y fibra de vidrio se apaga al bajar el
  flujo a entre 1 y 5 cm/s; el PMMA delgado a 1 atm se extingue a unos 10 mm/s con 21 % de oxígeno y a unos
  30 mm/s con 16 %. (Contexto) La guía de 2015 añade que la prueba NASA-STD-6001 Test 1 no es conservadora:
  los materiales arden con menos oxígeno en microgravedad que en la Tierra.
- **CFI** (reporte final, págs. 6 y 9): por encima de unas 2 atm aparecen ciclos de reignición: la flama
  caliente se apaga por pérdida radiativa, queda una flama fría y vuelve a encenderse, hasta consumir la gota.
- **SAME** (reporte final, pág. 56): el reporte dice que los diámetros medios por conteo de las partículas de humo
  están entre 100 y 200 nm y, en la misma página, da 227 nm para el silicón; en los resultados por corrida hay
  corridas de silicón que llegan a 372 nm (corregido el 14-nov tras la revisión de la IA).
- **SAME-R** (archivo de resultados, tabla del artículo ICES 2012): con el humo recién hecho, el diámetro
  medio geométrico va de 42 nm (Kapton) a 149 nm (Pyrell); tras 720 s de envejecimiento va de 70 a 293 nm.
  Crece en cuatro de los cinco materiales y baja en el teflón. Por corrida (131 con dato), el diámetro
  medio por conteo va de 49 nm (una de Kapton) a 1,103 nm (una de silicón), con medianas por material de
  entre 110 y 361 nm.
- **SPICE** (reporte final, pág. 2): 52 puntos de humo para etileno, propano, propileno y mezclas de
  propileno con nitrógeno, con coflujo de 5.4 a 65 cm/s.
- **Detectores de humo.** (Dato, de los reportes finales de SAME y SAME-R) El detector de la Estación mide
  luz dispersada y es más sensible a partículas de más de un micrómetro; el del transbordador es de
  ionización. Con humo de silicón los dos dieron señal fuerte. Con humo de teflón, el del transbordador dio
  señal fuerte y el de la Estación una señal errática, porque casi todas sus partículas miden menos de un
  micrómetro (SAME, pág. 25). El del transbordador dio señal fuerte en todas las pruebas de SAME (pág. 28).
  El reporte de SAME-R (pág. 5) concluye que el humo de Kapton y de teflón será difícil de detectar con
  dispositivos de dispersión de luz, y que distinguirlo del polvo sin falsas alarmas pide un detector que
  mida más de un momento de la distribución de tamaños.
- **Lo mismo, visto en nuestro resumen de las hojas de detectores.** (Interpretación; coincide con lo
  anterior) En SAME-R, la señal de oscurecimiento del detector de la Estación cambia 0.006 V con Kapton (110
  nm de diámetro medio por conteo), 0.02 V con teflón (167 nm), 0.19 V con mecha de lámpara (176 nm), 0.24 V
  con Pyrell (301 nm) y 1.1 V con silicón (361 nm). Son medianas de un resumen grueso (ver sección 5). El
  canal del detector del transbordador no sirve como comprobación: en SAME recorre toda su escala (unos 5.2
  V) con los cinco materiales, y eso puede ser humo, saturación o un corte de señal.
- **CFI-G** (reporte final, pág. 23): se observaron por primera vez flamas frías de difusión esféricas
  quemando gases, aunque no fue fácil producirlas.
- **Flame Design** (reporte final, pág. 40): las flamas esféricas grandes crecen hasta extinguirse; las
  pequeñas tienden a un estado estable porque pierden menos calor por radiación.
- **s-Flame** (reporte final, págs. 30 y 31): diluir con helio desplaza los límites de extinción respecto
  de diluir con nitrógeno; se vio extinción radiativa, y extinción cinética con oxígeno reducido. El propio
  reporte dice que falta análisis.
- **E-FIELD Flames** (reporte final, pág. 37): los campos eléctricos estabilizan flamas débiles y podrían
  servir para aproximar las fuerzas de flotación de la gravedad parcial. Es una sugerencia, no una medición.

**Las tablas experimentales son un resumen pobre de lo que hay.** (Dato) Los documentos de cada
investigación traen más que su tabla: la matriz de BASS da condiciones por prueba que la tabla omite, y el
resumen de CFI trae 227 pruebas con resultados contra 87 filas en la tabla, y la presión de cada prueba
de BRE solo está en una tesis. Quien use solo las tablas
experimentales verá huecos que en realidad no existen.

**Huecos que sí son reales.** Gravedad parcial (ningún dato), sólidos con oxígeno por encima de 22.7 %
(ninguno), condiciones de traje (nada: el oxígeno ambiente máximo es 40 % y la presión mínima 6.2 psi),
Marte (nada) y niebla de agua (nada).

**Sugerencia de este análisis.** Construir el producto alrededor del mapa de cobertura (camino 1 de la
sección 6): es lo que los datos sostienen, responde a la consideración de trajes y oxígeno de `RETO.md` y
muestra un hallazgo propio en vez de solo resumir fichas. La sección 6 describe cinco caminos y la decisión
es del equipo.

---

## 2. Tabla de investigaciones

Pilar, combustible, equipo y relevancia vienen de `data/clasificacion.csv`. La relevancia es interpretación
nuestra; la justificación de cada una está en la segunda tabla. Las filas van ordenadas por grupo y relevancia.

<!-- TABLA:investigaciones -->
| ID | Acrónimo | Grupo | Pilar | Combustible | Equipo | Relevancia | Filas en pruebas.csv |
|---|---|---|---|---|---|---|---|
| [PSI-20](https://psi.nasa.gov/physci/repo/data/investigations/PSI-20) | ACME BRE | vuelo | prevención | gas | CIR (inserto ACME) | alta | 195 (dia de prueba; prueba) |
| [PSI-25](https://psi.nasa.gov/physci/repo/data/investigations/PSI-25) | BASS-II | vuelo | prevención | sólido | MSG | alta | 129 (prueba) |
| [PSI-26](https://psi.nasa.gov/physci/repo/data/investigations/PSI-26) | BASS | vuelo | prevención | sólido | MSG | alta | 122 (prueba) |
| [PSI-69](https://psi.nasa.gov/physci/repo/data/investigations/PSI-69) | FLEX | vuelo | supresión | líquido | CIR (MDCA) | alta | 274 (prueba) |
| [PSI-98](https://psi.nasa.gov/physci/repo/data/investigations/PSI-98) | SAFFIRE-I | vuelo | prevención | sólido | Cygnus | alta | 4 (dato auxiliar; muestra) |
| [PSI-99](https://psi.nasa.gov/physci/repo/data/investigations/PSI-99) | SAFFIRE-II | vuelo | prevención | sólido | Cygnus | alta | 11 (dato auxiliar; muestra) |
| [PSI-100](https://psi.nasa.gov/physci/repo/data/investigations/PSI-100) | SAFFIRE-III | vuelo | prevención | sólido | Cygnus | alta | 2 (muestra) |
| [PSI-101](https://psi.nasa.gov/physci/repo/data/investigations/PSI-101) | SAME-R | vuelo | detección | sólido | otro | alta | 109 (prueba) |
| [PSI-102](https://psi.nasa.gov/physci/repo/data/investigations/PSI-102) | SAME | vuelo | detección | sólido y un líquido | otro | alta | 53 (muestra; prueba) |
| [PSI-159](https://psi.nasa.gov/physci/repo/data/investigations/PSI-159) | ACME CFI-G | vuelo | ciencia básica | gas | CIR (inserto ACME) | alta | 333 (prueba) |
| [PSI-10](https://psi.nasa.gov/physci/repo/data/investigations/PSI-10) | ACME/Flame Design | vuelo | ciencia básica | gas | CIR (inserto ACME) | media | 327 (prueba) |
| [PSI-22](https://psi.nasa.gov/physci/repo/data/investigations/PSI-22) | ACME E-FIELD Flames | vuelo | ciencia básica | gas | CIR (inserto ACME) | media | 21 (dia de prueba) |
| [PSI-23](https://psi.nasa.gov/physci/repo/data/investigations/PSI-23) | ACME s-Flame | vuelo | ciencia básica | gas | CIR (inserto ACME) | media | 18 (dia de prueba) |
| [PSI-39](https://psi.nasa.gov/physci/repo/data/investigations/PSI-39) | CFI | vuelo | ciencia básica | líquido | CIR (MDCA) | media | 227 (prueba) |
| [PSI-47](https://psi.nasa.gov/physci/repo/data/investigations/PSI-47) | DAFT / DAFT-2 | vuelo | detección | no aplica | otro (P-Trak; DustTrak) | media | 2 (sesion) |
| [PSI-68](https://psi.nasa.gov/physci/repo/data/investigations/PSI-68) | FLEX-2 | vuelo | supresión y ciencia básica | líquido | CIR (MDCA) | media | 8 (matriz por combustible) |
| [PSI-107](https://psi.nasa.gov/physci/repo/data/investigations/PSI-107) | SPICE | vuelo | ciencia básica | gas | MSG | media | 469 (prueba) |
| [PSI-21](https://psi.nasa.gov/physci/repo/data/investigations/PSI-21) | ACME CLD Flame | vuelo | ciencia básica | gas | CIR (inserto ACME) | baja | 32 (dia de prueba) |
| [PSI-106](https://psi.nasa.gov/physci/repo/data/investigations/PSI-106) | SLICE | vuelo | ciencia básica | gas | MSG | baja | 12 (dia de prueba) |
| [PSI-62](https://psi.nasa.gov/physci/repo/data/investigations/PSI-62) | (sin acrónimo) | en tierra | prevención | sólido | sin equipo de vuelo (estudio en tierra) | media | sin tabla útil |
| [PSI-115](https://psi.nasa.gov/physci/repo/data/investigations/PSI-115) | (sin acrónimo) | en tierra | detección | sólido | sin equipo de vuelo (estudio en tierra) | media | sin tabla útil |
| [PSI-117](https://psi.nasa.gov/physci/repo/data/investigations/PSI-117) | (sin acrónimo) | en tierra | ciencia básica | líquido | sin equipo de vuelo (estudio en tierra) | media | sin tabla útil |
| [PSI-142](https://psi.nasa.gov/physci/repo/data/investigations/PSI-142) | (sin acrónimo) | en tierra | ciencia básica | líquido | sin equipo de vuelo (estudio en tierra) | media | sin tabla útil |
| [PSI-60](https://psi.nasa.gov/physci/repo/data/investigations/PSI-60) | (sin acrónimo) | en tierra | ciencia básica | gas | sin equipo de vuelo (estudio en tierra) | baja | sin tabla útil |
| [PSI-179](https://psi.nasa.gov/physci/repo/data/investigations/PSI-179) | ASE | fuera de alcance | detección (contexto) | no aplica | otro (muestreadores de aerosol) | baja | sin tabla útil |
| [PSI-77](https://psi.nasa.gov/physci/repo/data/investigations/PSI-77) | ISSI | fuera de alcance | fuera de alcance | no aplica | otro | no aplica | sin tabla útil |
| [PSI-108](https://psi.nasa.gov/physci/repo/data/investigations/PSI-108) | STDCE-1 | fuera de alcance | fuera de alcance | no aplica | otro | no aplica | sin tabla útil |
| [PSI-181](https://psi.nasa.gov/physci/repo/data/investigations/PSI-181) | (sin acrónimo) | fuera de alcance | fuera de alcance | no aplica | sin equipo de vuelo (estudio en tierra) | no aplica | sin tabla útil |
<!-- /TABLA:investigaciones -->

### Justificación de cada clasificación

<!-- TABLA:justificaciones -->
| ID | Acrónimo | De dónde sale el pilar | Relevancia: dato e interpretación |
|---|---|---|---|
| PSI-20 | ACME BRE | RETO.md y ficha | Dato: la ficha dice que examina las atmósferas consideradas por NASA para misiones tripuladas (14.7 psia con 21 % de O2; 10.2 psia con 26.5 %; 8.2 psia con 34 %) y la tabla lista 21, 25, 26.5, 34 y 40 % de O2. Su documento BRE_data_interpretation (pág. 4) confirma que la primera ronda se centró en esas tres atmósferas y que la segunda fue casi toda a 14.7 psia, a menudo con 40 % de O2. La presión de cada prueba no está en la tabla experimental, pero una tesis archivada entre sus reportes trae 177 pruebas con oxígeno, presión y desenlace (ya integradas): 34 con 30 a 39 % de O2 a entre 8.2 y 8.9 psi. Resultado (reporte final de 2022, págs. 18 y 55): las flamas se extinguían sobre todo con 21 % de O2 a 14.7 psia; con 27 % a 10.2 psia y con 34 % a 8.2 psia en general persistían 2 o 3 minutos o más. Interpretación: es el puente más directo entre flamas de gas y la inflamabilidad de sólidos en atmósferas de exploración. |
| PSI-25 | BASS-II | RETO.md y ficha (subárea Spacecraft Fire Safety) | Dato: 129 pruebas con oxígeno medido (13.6 a 22.2 %) y 123 con flujo en cm/s (su ReadMe define Air display como velocidad en el ducto); su reporte resumen da además observaciones de 126 pruebas, dirección del flujo de 120, velocidad de propagación de 20 y desenlace de 20 (ya integrados); la ficha dice que el oxígeno se varió por debajo de 21 % agregando nitrógeno. Interpretación: es la mejor base de datos de sólidos en PSI y la que muestra el hueco hacia arriba de 22 %. |
| PSI-26 | BASS | RETO.md y ficha (subárea Spacecraft Fire Safety) | Dato: 122 pruebas. La tabla experimental solo trae fecha y material, pero su documento As Run_Test Matrix.xlsx da por prueba oxígeno (16.1 a 22.7 %), presión (14.3 a 14.8 psi), flujo (0 a 44 cm/s), nitrógeno de supresión (7 pruebas) y observaciones; ya está integrado en pruebas.csv. Interpretación: muy relevante por objetivo (cuestiona la prueba NASA-STD-6001 Test 1) y es la única con supresión sobre sólidos. |
| PSI-69 | FLEX | RETO.md y ficha | Dato: 274 pruebas con oxígeno, presión, supresor (CO2 o He) y desenlace (extinción, disrupción o combustión completa); 103 a 0.7 atm nominales y 17 de ellas con 30 a 34 % de O2. Su documento FLEX DoD dice que el experimento cuantifica el efecto de posibles atmósferas de exploración sobre la supresión. Interpretación: es la única investigación con supresores y, además, la única con pruebas individuales de combustible condensado cerca de la atmósfera de la base lunar. |
| PSI-98 | SAFFIRE-I | RETO.md y ficha | Dato: 2 muestras de 40.6 por 94 cm, flujo de 20 cm/s, 21.5 a 21.7 % de O2. Interpretación: es el fuego más grande quemado a propósito en el espacio; pocos puntos, pero a escala real. |
| PSI-99 | SAFFIRE-II | RETO.md y ficha | Dato: 9 muestras con resultado en microgravedad y en gravedad normal lado a lado (largo quemado y velocidad de propagación), a 20 cm/s y 21.5 a 22.1 % de O2. Interpretación: la mejor comparación directa 0 g contra 1 g por material. |
| PSI-100 | SAFFIRE-III | RETO.md y ficha | Dato: 2 muestras a 30 cm/s según la tabla de PSI; la tabla no trae oxígeno ni resultado, pero sus sensores (datos crudos) dan 19.4 a 20.1 % de O2 y 14.4 a 14.5 psi. Salvedad del 14-nov: las láminas de Saffire de NASA de 2017 (NTRS 20180005168, págs. 30 y 31) dan 25 cm/s y los resultados que faltan en la tabla (300 s de flama concurrente a 2.3 mm/s y 60 s de flama opuesta a 0.98 mm/s). Interpretación: relevante por escala; casi sin datos en la tabla. |
| PSI-101 | SAME-R | RETO.md y ficha | Dato: 109 pruebas (106 ya con tamaño de partícula por corrida) con material, velocidad de entrada (0 a 8.1 cm/s) y tiempos de envejecimiento del humo; sin oxígeno. Resultado (archivo de resultados, tabla del artículo ICES 2012): diámetro medio geométrico de 42 a 149 nm con el humo recién hecho y de 70 a 293 nm tras 720 s. Su reporte final (pág. 5) concluye que el humo de Kapton y de teflón será difícil de detectar con dispositivos de dispersión de luz y que hace falta medir más de un momento de la distribución de tamaños. También aclara que fueron 67 corridas y que las 109 filas cuentan aparte los envejecimientos secundarios. Interpretación: es la base para diseñar detectores de humo en microgravedad. |
| PSI-102 | SAME | RETO.md y ficha | Dato: tabla de 8 renglones; solo 4 traen condiciones y los otros remiten a ellas. El archivo de resultados trae sus 45 corridas de 2007 (ya integradas), 25 con tamaño de partícula. Resultado (reporte final, pág. 56): el reporte dice que los diámetros medios por conteo están todos entre 100 y 200 nm y en la misma página da 227 nm para el silicón; en los resultados por corrida hay corridas que llegan a 372 nm. El reporte (págs. 25 y 28) dice que el detector del transbordador (ionización) dio señal fuerte en todas las pruebas y que el de la Estación (dispersión de luz) fue errático con humo de teflón, de partículas menores de un micrómetro. Interpretación: misma relevancia que SAME-R con muchos menos datos en la tabla. |
| PSI-159 | ACME CFI-G | RETO.md y ficha | Dato: 333 pruebas con oxígeno, presión y desenlace; 20 flamas normales con 33 a 39 % de O2 en la cámara a 7.3 psi; en las flamas inversas el oxidante del quemador llega a 85 % de O2. Interpretación: es la investigación con más pruebas individuales en condiciones tipo base lunar, aunque con gas y no con materiales. |
| PSI-10 | ACME/Flame Design | interpretación (objetivos de la ficha: límites de hollín y de extinción de flamas esféricas) | Interpretación: no estudia materiales, pero es de las pocas con pruebas individuales que traen oxígeno y presión juntos (327 filas; atmósfera de 19.8 a 40 % de O2) y límites de extinción, útiles para modelos. |
| PSI-22 | ACME E-FIELD Flames | RETO.md y ficha | Dato: RETO.md la señala como la única que imitó gravedad parcial. La ficha dice que no se hizo para aplicaciones espaciales. Su reporte final (pág. 37) dice que los campos eléctricos podrían servir para aproximar las fuerzas de flotación de la gravedad parcial; es una sugerencia, no una medición. Interpretación: relevante solo como aproximación al hueco de gravedad parcial; la tabla no trae voltajes ni oxígeno. |
| PSI-23 | ACME s-Flame | interpretación (objetivos de la ficha: estructura y extinción de flamas esféricas) | Dato: días de prueba con 21 y 30 % de O2 a cerca de 1 atm, diluidos con N2 o He. Interpretación: aporta extinción con helio a 30 % de O2, pero por día y no por prueba. |
| PSI-39 | CFI | interpretación (objetivos de la ficha: flamas frías de gotas) | Dato: la tabla trae 87 filas (79 pruebas distintas; 8 están repetidas) con 17 y 21 % de O2 entre 0.5 y 5 atm, algunas con helio. Su documento CFI_DataSummary trae 227 pruebas con resultados (diámetros de extinción caliente y fría, tasas de quemado, reigniciones), ya integrado en pruebas.csv. Resultado (reporte final, págs. 6 y 9): por encima de unas 2 atm aparecen ciclos de reignición: la flama caliente se apaga, queda una flama fría y vuelve a encenderse. Interpretación: las flamas frías importan para seguridad porque una gota puede seguir reaccionando después de apagarse la flama visible; eso lo dice la guía de NASA de 2015 sobre FLEX, no esta tabla. |
| PSI-47 | DAFT / DAFT-2 | RETO.md y ficha | Dato: 2 sesiones de 2005 que probaron el contador de partículas P-Trak en microgravedad. Interpretación: relevante para distinguir humo de polvo en un detector; aporta muy pocos datos. |
| PSI-68 | FLEX-2 | interpretación (la ficha la pone en Spacecraft Fire Safety pero su objetivo habla de combustores) | Dato: la tabla es una matriz por combustible con intervalos (17 a 30 % de O2; 0.5 a 3 atm; flujo de 0.1 a 5 cm/s), no pruebas individuales. Las mezclas medidas en su cámara (124 llenados; data/extra/flex_mezclas.csv) van de 16.6 a 39.7 % de O2 entre 7.4 y 45.2 psia, y ninguna tiene 30 % o más a 11 psia o menos; la más cercana es 29.3 % con helio a 7.65 psia. Interpretación: no cubre condiciones tipo base lunar; sí aporta oxígeno alto con helio a 1 y 3 atm. |
| PSI-107 | SPICE | interpretación (objetivos de la ficha: punto de humo; la ficha la pone en Fire Safety) | Dato: 469 filas (435 distintas; 34 repetidas) con boquilla, gasto de combustible y velocidad de aire (0.3 a 85 cm/s); sin oxígeno. La ficha dice que se estudiaron 526 flamas y el reporte de 30 días habla de 263 puntos de prueba. Resultado (reporte final): 52 puntos de humo para etileno, propano, propileno y mezclas de propileno con nitrógeno. Las pruebas son de 2009. Interpretación: el punto de humo indica cuánto hollín produce un combustible, útil para detección y para radiación de la flama. |
| PSI-21 | ACME CLD Flame | interpretación (objetivos de la ficha: flamas de coflujo diluidas para validar modelos) | Interpretación: sirve para validar modelos de flamas cerca de la extinción; la tabla no trae oxígeno ni presión ni flujo. |
| PSI-106 | SLICE | interpretación (objetivos de la ficha: estructura y despegue de flamas laminares) | Dato: 12 días de prueba con el combustible del día; sin oxígeno ni flujo. Interpretación: ciencia de flamas para validar modelos. |
| PSI-62 | (sin acrónimo) | interpretación (objetivos de la ficha: modelo de propagación concurrente de flama) | Estudio en tierra que modela la propagación de flama sobre sólidos con datos de BASS. Interpretación: es el ejemplo de la función 2 de RETO.md (datos para modelos predictivos). Sin tabla experimental. |
| PSI-115 | (sin acrónimo) | interpretación (objetivos de la ficha: simulación del crecimiento del humo con datos de SAME) | Estudio en tierra que simula cómo cambia el humo con la gravedad. Sin tabla experimental. |
| PSI-117 | (sin acrónimo) | interpretación (objetivos de la ficha: perturbaciones sobre flamas frías con datos de FLEX) | Estudio en tierra sobre flamas frías de gotas con datos de FLEX. Sin tabla experimental. |
| PSI-142 | (sin acrónimo) | interpretación (objetivos de la ficha: límites de inflamabilidad con datos de FLEX) | Estudio en tierra. Su tabla es un índice de figuras de artículos, no una lista de pruebas. |
| PSI-60 | (sin acrónimo) | interpretación (objetivos de la ficha: hollín en flamas de SPICE) | Estudio en tierra que reanaliza SPICE (PSI-107). Sin tabla experimental. |
| PSI-179 | ASE | interpretación (la ficha describe muestreo de partículas en el aire de la Estación) | No es del área de combustión. Interpretación: describe el polvo y las partículas de fondo de la cabina, que es contra lo que un detector de humo tiene que distinguir. Sin tabla experimental. |
| PSI-77 | ISSI | interpretación (la ficha es de soldadura) | Salió en la búsqueda por la palabra flame. No es combustión. |
| PSI-108 | STDCE-1 | interpretación (la ficha es de física de fluidos) | Salió en la búsqueda combustion. Es convección por tensión superficial. |
| PSI-181 | (sin acrónimo) | interpretación (la ficha es de soldaduras) | Salió en la búsqueda combustion. Es ciencia de materiales. |
<!-- /TABLA:justificaciones -->

### Verificación de los identificadores que traía el equipo

- Confirmados: BASS-II (PSI-25), Saffire-I, II y III (PSI-98, 99, 100), SAME (PSI-102), SAME-R (PSI-101),
  FLEX-2 (PSI-68), CFI (PSI-39), SPICE (PSI-107), SLICE (PSI-106), ACME BRE (PSI-20), CFI-G (PSI-159),
  E-FIELD Flames (PSI-22), CLD Flame (PSI-21) y Flame Design (PSI-10).
- Los que estaban por confirmar: PSI-26 es BASS, PSI-69 es FLEX y PSI-23 es ACME s-Flame, la sexta de ACME.
- DAFT y DAFT-2 son una sola entrada: PSI-47.
- Estudios en tierra que reutilizan datos de PSI: PSI-60 (de SPICE), PSI-62 (de BASS y BASS-II), PSI-115
  (de SAME), PSI-117 y PSI-142 (de FLEX).
- Fuera de alcance: PSI-108 (física de fluidos), PSI-181 y PSI-77 (soldadura). PSI-179 (ASE) no es de
  combustión, pero mide las partículas del aire de la cabina; queda marcada aparte.
- SoFIE, FM2, LUCI y FLARE no existen en PSI como investigación: no aparecen en el acrónimo ni en el título
  de ninguna de las 133, y buscar "LUCI" o "FLARE" da cero resultados. SoFIE solo se menciona dentro de la
  ficha de BASS-II.

---

## 3. Mapa de cobertura

### Ambientes de referencia (de `RETO.md`)

| Ambiente | Oxígeno | Presión |
|---|---|---|
| Traje espacial | 100 % | 4.3 psi |
| Tierra a nivel del mar | aire normal (21 %) | 14.7 psi |
| Base lunar y rovers presurizados (esperado) | 30 % o más | 10.2 psi o menos |

### Criterios que usamos (son elección nuestra)

- **Oxígeno de 30 % o más:** el oxígeno máximo de la fila llega a 30 %.
- **11 psi o menos:** el enunciado dice 10.2. Usamos 11 porque FLEX tiene 103 pruebas a 0.7 atm nominales
  que midieron entre 10.2 y 10.5 psi; un corte exacto las dejaría fuera por décimas. La tabla por combustible
  da también el conteo con el corte exacto.
- **Tipo base lunar:** las dos condiciones en la misma prueba.
- **Posible (matriz):** la tabla de FLEX-2 da intervalos por combustible y no dice qué combinaciones se
  quemaron. Sus mezclas medidas lo aclaran (124 llenados de la cámara, 106 con presión): ninguna tiene 30 %
  o más de oxígeno a 11 psia o menos. La más cercana es 29.3 % de oxígeno, con helio, a 7.65 psia.
- **El oxígeno es de la atmósfera o del quemador:** en las flamas inversas de Flame Design y CFI-G el
  oxígeno sale del quemador hacia una cámara con combustible y nitrógeno. No es la atmósfera que respiraría
  una tripulación, así que va en filas aparte. (Dato: el documento de requisitos de Flame Design dice que la
  flama inversa se obtiene dando oxidante al chorro central, y que así se alcanza más oxígeno porque la
  cámara, llena de nitrógeno, no llega a tener oxígeno alto.)
- **Filas repetidas:** 35 filas son copias exactas de otra en su tabla original; no se cuentan dos veces.
- **BRE:** se cuentan sus 177 pruebas individuales, no sus 18 días de prueba, que son las mismas flamas.

**Qué tan sensible es el resultado al criterio.** (Dato) Con 30 % de oxígeno o más y el corte exacto de 10.2
psi hay 54 pruebas (BRE 34, CFI-G 20); con 11 psi, 71 (se suman 17 de FLEX). Con 26.5 % o más, que es la
atmósfera de 10.2 psia de BRE, y 11 psi, son 88 (BRE 51, CFI-G 20, FLEX 17).

### Por tipo de combustible (solo filas donde el oxígeno es el de la atmósfera)

<!-- TABLA:cobertura_tipo -->
| Combustible | Filas | Con oxígeno | Oxígeno máximo | Con 30 % o más | Con presión | Con 11 psi o menos | Tipo base lunar (hasta 11 psi) | Tipo base lunar (corte exacto 10.2 psi) |
|---|---|---|---|---|---|---|---|---|
| sólido | 405 | 263 | 22.7 % | 0 | 134 | 0 | 0 | 0 |
| líquido | 530 | 509 | 34.0 % | 32 | 508 | 130 | 17 | 0 |
| gas | 1080 | 581 | 40.0 % | 366 | 581 | 88 | 54 | 54 |
<!-- /TABLA:cobertura_tipo -->

### Por investigación

Entre paréntesis, cuántas filas traen ese dato. Archivo completo: `data/cobertura.csv`.

<!-- TABLA:cobertura -->
| ID | Acrónimo | Combustible | El oxígeno es de | Filas | Oxígeno (filas con dato) | Presión (filas con dato) | Flujo (filas con dato) | O2 de 30 % o más | 11 psi o menos | Tipo base lunar | Posible (matriz) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| PSI-10 | ACME/Flame Design | gas | atmósfera | 207 (prueba) | 19.8 a 40.0 % (207) | 13.7 a 19.1 psi (207) | sin dato | 131 | 0 | 0 | 0 |
| PSI-10 | ACME/Flame Design | gas | gas del quemador | 120 (prueba) | 21.2 a 85.0 % (109) | 6.2 a 44.2 psi (120) | sin dato | 91 | 27 | 18 | 0 |
| PSI-20 | ACME BRE | gas | atmósfera | 177 (prueba) | 18.4 a 40.0 % (177) | 8.2 a 15.7 psi (177) | sin dato | 112 | 63 | 34 | 0 |
| PSI-21 | ACME CLD Flame | gas | atmósfera | 32 (dia de prueba) | sin dato | sin dato | sin dato | 0 | 0 | 0 | 0 |
| PSI-22 | ACME E-FIELD Flames | gas | atmósfera | 20 (dia de prueba) | sin dato | sin dato | sin dato | 0 | 0 | 0 | 0 |
| PSI-23 | ACME s-Flame | gas | atmósfera | 18 (dia de prueba) | 21.0 a 30.0 % (18) | 14.7 psi (18) | sin dato | 8 | 0 | 0 | 0 |
| PSI-25 | BASS-II | solido | atmósfera | 129 (prueba) | 13.6 a 22.2 % (129) | sin dato | 0.0 a 53.0 cm/s (123) | 0 | 0 | 0 | 0 |
| PSI-26 | BASS | solido | atmósfera | 122 (prueba) | 16.1 a 22.7 % (121) | 14.3 a 14.8 psi (121) | 0.0 a 44.0 cm/s (102) | 0 | 0 | 0 | 0 |
| PSI-39 | CFI | liquido | atmósfera | 227 (prueba) | 17.0 a 21.0 % (227) | 7.3 a 73.5 psi (227) | sin dato | 0 | 19 | 0 | 0 |
| PSI-47 | DAFT / DAFT-2 | no aplica | atmósfera | 2 (sesion) | sin dato | sin dato | sin dato | 0 | 0 | 0 | 0 |
| PSI-68 | FLEX-2 | liquido | atmósfera | 8 (matriz por combustible) | 17.0 a 30.0 % (8) | 7.3 a 44.1 psi (8) | 0.1 a 5.0 cm/s (8) | 8 | 8 | 0 | 8 |
| PSI-69 | FLEX | liquido | atmósfera | 274 (prueba) | 12.0 a 34.0 % (274) | 10.2 a 44.9 psi (273) | sin dato | 24 | 103 | 17 | 0 |
| PSI-98 | SAFFIRE-I | solido | atmósfera | 2 (muestra) | 21.5 a 21.7 % (2) | 14.5 psi (2) | 20.0 cm/s (2) | 0 | 0 | 0 | 0 |
| PSI-99 | SAFFIRE-II | solido | atmósfera | 9 (muestra) | 21.5 a 22.1 % (9) | 14.5 a 14.9 psi (9) | 20.0 cm/s (9) | 0 | 0 | 0 | 0 |
| PSI-100 | SAFFIRE-III | solido | atmósfera | 2 (muestra) | 19.4 a 20.1 % (2) | 14.4 a 14.5 psi (2) | 30.0 cm/s (2) | 0 | 0 | 0 | 0 |
| PSI-101 | SAME-R | solido | atmósfera | 109 (prueba) | sin dato | sin dato | 0.0 a 8.1 cm/s (109) | 0 | 0 | 0 | 0 |
| PSI-102 | SAME | solido | atmósfera | 32 (muestra; prueba) | sin dato | sin dato | 2.0 a 10.0 cm/s (29) | 0 | 0 | 0 | 0 |
| PSI-102 | SAME | liquido | atmósfera | 21 (muestra; prueba) | sin dato | sin dato | 2.0 a 8.0 cm/s (20) | 0 | 0 | 0 | 0 |
| PSI-106 | SLICE | gas | atmósfera | 12 (dia de prueba) | sin dato | sin dato | sin dato | 0 | 0 | 0 | 0 |
| PSI-107 | SPICE | gas | atmósfera | 435 (prueba) | sin dato | sin dato | 0.3 a 85.3 cm/s (415) | 0 | 0 | 0 | 0 |
| PSI-159 | ACME CFI-G | gas | atmósfera | 179 (prueba) | 18.0 a 40.0 % (179) | 7.3 a 44.1 psi (179) | sin dato | 115 | 25 | 20 | 0 |
| PSI-159 | ACME CFI-G | gas | gas del quemador | 154 (prueba) | 12.0 a 85.0 % (154) | 7.2 a 48.0 psi (154) | sin dato | 115 | 40 | 28 | 0 |
<!-- /TABLA:cobertura -->

### Lectura

**Sólidos.** (Dato) Oxígeno máximo de 22.7 %. Presión en BASS (14.3 a 14.8 psi) y en las tres Saffire (14.4 a 14.9 psi). Flujo en cm/s en 376
de 405 filas: BASS (0 a 44), BASS-II (0 a 53, con tres lecturas por encima de 40 que hay que revisar),
Saffire (20 y 30), SAME (2 a 10) y SAME-R (0 a 8.1). Dirección del flujo en BASS-II (120 pruebas: 67 opuesto, 38 concurrente, 15 estancamiento), en Saffire y en 3 filas de BASS.

**Líquidos.** (Dato) FLEX cubre de 12 a 34 % de oxígeno y de 0.7 a 3 atm. Las 17 pruebas con 30 a 34 % a
0.7 atm no llevaban supresor y terminaron en disrupción (15) o en combustión completa (2), ninguna en
extinción. CFI se quedó en 17 y 21 % de oxígeno, entre 0.5 y 5 atm. FLEX-2, según las
mezclas medidas en su cámara, usó de 16.6 a 39.7 % de oxígeno entre 7.4 y 45.2 psia: hasta 29.9 % con
nitrógeno y lo demás con helio. Lo más común fue 21 % a 1 atm (43 de 106 llenados con presión).

**Gases.** (Dato) Son los que más oxígeno probaron. En la atmósfera de la cámara: Flame Design hasta 40 %
(131 pruebas con 30 % o más, todas a 13.7 psi o más), CFI-G hasta 40 % (115 con 30 % o más; 20 de ellas a
7.3 psi), BRE hasta 40 % (177 pruebas entre 8.2 y 15.7 psi; 34 de ellas tipo base lunar) y s-Flame hasta 30 % a
cerca de 1 atm.

**Traje espacial.** (Dato) Sin cobertura. Ninguna fila tiene oxígeno ambiente por encima de 40 %, y la
presión más baja es 6.2 psi.

**Veredicto de la hipótesis.** Confirmada: los sólidos se probaron con oxígeno igual o inferior al de la
Tierra (263 filas con dato, ninguna por encima de 22.7 %). Matizada en un sentido: los datos cercanos a la
base lunar existen, pero con gotas de líquido (FLEX) y con gas (CFI-G y BRE).

**Una cuenta que conviene tener a la mano.** (Interpretación, es aritmética) 30 % de 10.2 psi son 3.06 psi
de oxígeno; 21 % de 14.7 psi son 3.09 psi. La cantidad de oxígeno es casi la misma: lo que cambia es que hay
menos nitrógeno que absorba calor. `RETO.md` lo expresa como un aumento de más de 40 % en la concentración.

---

## 4. Huecos

Cada hueco dice hasta dónde se comprobó: en las tablas, en las fichas, en los documentos bajados o en todo PSI.

### Lo que `RETO.md` menciona y PSI no tiene

1. **Gravedad parcial.** Ningún dato. Comprobado en todo PSI: las búsquedas "partial gravity", "lunar",
   "Moon" y "Mars" solo devuelven investigaciones de otras áreas y a FLEX, que lo menciona de paso. LUCI y
   FM2 no están. E-FIELD Flames la imitó con un campo eléctrico de hasta 10 kV (dato de sus documentos),
   pero su tabla solo trae combustible, polaridad y flamas encendidas por día; los voltajes de cada prueba
   están en los datos crudos.
2. **Bases en Marte.** Nada sobre gravedad de Marte ni sobre atmósferas de hábitat marciano.
3. **Condiciones de traje.** Nada cerca de 100 % de oxígeno a 4.3 psi. La búsqueda "spacesuit" da cero.
4. **Extintores de niebla de agua.** `RETO.md` los cita como beneficio en la Tierra. Las búsquedas "water
   mist" y "extinguisher" dan cero en todo PSI. Los supresores con datos son CO2 y helio (FLEX) y nitrógeno (BASS).

### Otros vacíos reales

5. **Sólidos con más de 22.7 % de oxígeno.** Es el hueco central. Lo único que hay es el reporte de SSCE
   archivado en PSI-108 (35 y 50 % de oxígeno, a 1 atm o más), sin datos. (Contexto) La guía de 2015 describe SoFIE
   como el experimento pensado para medir inflamabilidad de sólidos en función de oxígeno, presión y flujo;
   la página de Combustion Science de NASA lo da por vigente. No está en PSI.
6. **Presión de BASS-II, SAME y SAME-R.** No la traen ni en tabla ni en documentos. El reporte de BASS-II
   usa 1 atm en sus cálculos.
7. **Oxígeno medido por sensor en Saffire-I y II.** La tabla da un valor derivado del CO2 (nota 1 de
   Saffire-II). Sus hojas de sensores por muestra (12 a 33 MB cada una) no se bajaron.
8. **Oxígeno y presión de las pruebas de humo.** SAME y SAME-R no los traen. Los tamaños de partícula por
   corrida ya están integrados (131 corridas). Las series de tiempo de cada instrumento (detectores de humo
   de la Estación y del transbordador, detectores de ionización, P-Trak y DustTrak, una lectura por
   segundo) están bajadas en 125 hojas .xls y resumidas, una fila por archivo, en
   `data/extra/same_respuesta_detectores.csv` (123 archivos). El resumen es grueso y no está validado.
9. **Resultados de prevención en forma de número.** BASS y BASS-II traen observaciones en texto libre (ya
   integradas). En número solo hay velocidad de propagación de 20 pruebas de BASS-II y desenlace de otras 20. Los
   límites de inflamabilidad están en figuras del reporte y en los artículos, no en tablas.
10. **Atmósfera de cada prueba de FLEX-2.** Se conocen las 124 mezclas con que se llenó la cámara, pero no
    cuál le tocó a cada una de sus más de 700 pruebas; habría que cruzarlas por fecha con el archivo de cada
    prueba (unos 9 MB, sin bajar). En BRE ya están las tres tablas de la tesis (etileno,
    metano y quemador de 50 mm); 3 renglones no se pudieron leer.
11. **Supresores.** La ficha de FLEX habla de SF6 y la guía de 2015 de xenón; la tabla solo trae CO2 y helio.
12. **Materiales.** Pocos y repetidos: PMMA, tela SIBAL, Nomex, cera, silicón, Ultem, Teflon, Kapton, mecha
    de lámpara y Pyrell. No aparecen cables, espumas ni telas actuales de traje. Las búsquedas "battery" y
    "lithium" no devuelven nada de combustión.
13. **Estudios en tierra.** Cuatro de cinco no tienen tabla, y la de PSI-142 es un índice de figuras.

### Vacíos que eran aparentes y ya no lo son

Estos figuraban como huecos en la primera versión. Estaban en los documentos, no en las tablas.

| Antes parecía que faltaba | Dónde estaba | Estado |
|---|---|---|
| Oxígeno, presión y flujo de las 122 pruebas de BASS | Matriz "As Run" de BASS (documento científico de PSI-26) | Integrado en `pruebas.csv` |
| Supresión sobre sólidos | La misma matriz: 7 pruebas con nitrógeno aplicado, y la ficha de BASS lo declara como objetivo | Integrado |
| Flujo de BASS-II en cm/s | Su ReadMe define "Air display" como velocidad en el ducto, en cm/s | Integrado (123 de 129 pruebas) |
| Dirección del flujo y resultados de BASS-II | Apéndice A y tablas 5.1 y 7.1 de su reporte resumen (NASA/TM-20210011385) | Integrado (126 pruebas) |
| Resultados de CFI | Resumen de datos de CFI: 227 pruebas con diámetros de extinción, tasas de quemado y reigniciones | Integrado (227 pruebas) |
| Presión y desenlace por prueba de BRE | Tablas 6.1, E.1 y F.1 de la tesis archivada entre sus reportes (págs. 110 a 112, 163 y 164) | Integrado (177 pruebas) |
| Documentos de FLEX, FLEX-2, BRE, E-FIELD y Saffire-II | El campo `added` de la ficha no es la lista de archivos; el sitio la da con otra llamada | Bajados |
| Año de las pruebas de SAME-R | Su ficha: del 16 de julio al 9 de septiembre de 2010 | Integrado |
| Fecha de Saffire-III | Sellos de tiempo de su archivo de imágenes: 3 de junio de 2017 | Integrado |
| Qué atmósferas usó FLEX-2 de verdad | Archivos de mezcla de sus datos crudos: composición medida en 124 llenados y presión en 106 | Exportado a `data/extra/flex_mezclas.csv` |
| Presión de las tres Saffire y oxígeno de Saffire-III | Telemetría de Cygnus y sensores por muestra, en sus datos crudos | Integrado (13 muestras) |
| Tamaños de partícula del humo | Archivo de resultados de SAME y SAME-R, en sus datos analizados | Integrado por corrida (131) y exportado por material a `data/extra/` |
| Corridas de SAME | El mismo archivo: 45 corridas de 2007, que su tabla experimental resume en 8 muestras | Integradas como filas nuevas |
| Texto de "Cite this Investigation" | El sitio lo arma con una fórmula fija, leída de su código | Generado para las 28 |

### Lo que existe en PSI y no bajamos

| Categoría | Archivos | Peso | Por qué importa |
|---|---|---|---|
| Presentations | 134 | 3.0 GB | Revisiones de diseño y de ciencia |
| Analyzed Data | 2,190 | 31.8 GB | Datos ya procesados. De aquí solo se bajaron las hojas de SAME y SAME-R |
| Calibration | 183 | 9.9 GB | Solo FLEX y FLEX-2 |
| Raw Data | 65,994 | 14 TB | Videos, imágenes y sensores |

De "Raw Data" y "Analyzed Data" se bajaron solo tablas, ningún video ni imagen: 9 chicas (92 MB) con la
telemetría de las tres Saffire, los sensores por muestra de Saffire-III y el archivo de resultados de SAME
y SAME-R; las 125 hojas .xls de datos analizados de SAME y SAME-R (683 MB), que se leen con la librería
xlrd, instalada dentro del proyecto; y 303 archivos de texto de FLEX y FLEX-2 (4.4 MB) con la mezcla de gas
y las lecturas de presión de cada llenado de la cámara.

Además, de los 338 documentos de las tres categorías elegidas se bajaron 242: 91 se omitieron por tamaño o
por ser video, y 5 entradas del listado (4 archivos distintos) dieron error 404. De los 43 reportes se
bajaron 41: los dos que dieron error 404 son el reporte final de BASS y una copia del de SPICE archivada en
PSI-26 (el de SPICE sí está en PSI-107). De los 283 documentos, 204 tienen texto; 69 son PDF escaneados
(casi todos planos), 6 están en formatos viejos (.doc y .ppt) que no se pudieron leer y 4 zip dieron error. `data/raw/inventario_archivos.csv`
lista todo.

---

## 5. Problemas de calidad de los datos

Tratados en `scripts/limpiar_psi.py` y explicados en `data/README.md`. Nada se corrigió en silencio: lo
dudoso quedó vacío o marcado en la columna `notas`.

### De la plataforma

| Problema | Qué hicimos |
|---|---|
| La búsqueda reporta 26 resultados y entrega 25 por página | Se pide con `size=500` |
| El campo `added` de la ficha parece la lista de archivos y no lo es: solo trae lo que cambió en la última versión | Se usa la llamada con la que el sitio lista los archivos |
| 5 entradas del listado (4 archivos distintos) dan error 404: el mismo PDF en las tres Saffire y uno de E-FIELD | Anotado en `manifest.json` |
| Un documento de BRE pesa distinto a lo declarado | Anotado; no se usó |

### De las tablas, en general

| Problema | Qué hicimos |
|---|---|
| Cada tabla tiene columnas, unidades y nivel de detalle distintos: prueba, día de pruebas o renglón de matriz | Un mapeador por tabla; columna `nivel_fila` |
| La tabla experimental omite datos que sí están en los documentos (BASS, CFI, BRE) | Los tres integrados; cada fila dice de qué documento sale |
| Filas repetidas: 34 en SPICE y 1 en E-FIELD. La tabla de CFI traía 8 más; ya no cuentan porque CFI sale de su resumen | Columna `duplicado_de_fila`; no cuentan en la cobertura |
| Las tablas de BRE se leyeron del texto de un PDF | Las 177 se cotejaron con una segunda lectura por posición de las palabras, renglón por renglón: 176 coinciden en oxígeno, presión y condición final. La otra (20339A0) aparece en dos tablas con distinto redondeo (0.3752 y 0.38; 1.055 y 1.06 bar). 9 renglones incompletos se conservan marcados y 3 se descartaron |
| En BRE, algunas pruebas aparecen en dos tablas de la tesis | Se queda la primera aparición; no se duplican |
| El resumen de CFI trae 44 pruebas con farnesano y fechas desde 2011, que la tabla experimental y la ficha no mencionan | Se conservan como vienen. Interpretación: pueden ser de una campaña anterior con el mismo equipo |
| SAME-R trae 109 filas y la ficha dice 66 puntos de prueba | Resuelto: el reporte final dice que fueron 67 corridas y que las 109 filas cuentan aparte los envejecimientos secundarios |
| SPICE trae 469 filas (435 distintas); la ficha dice 526 flamas y el reporte de 30 días, 263 puntos de prueba | Sin resolver |
| BASS-II trae 129 filas y su reporte dice 126 pruebas | Resuelto: las tres que no están en el reporte (O20, O21 y O22) son posteriores; las otras 126 coinciden una por una |
| Los identificadores de prueba se repiten en SPICE, CFI y BASS | La llave es `tabla_origen` más `fila_origen` |

### Por investigación

| Dónde | Problema | Qué hicimos |
|---|---|---|
| FLEX | Encabezados sin subíndices: "O", "N", "CO", "He" | "CO" se tomó como CO2. Apoyo: la ficha habla de CO2, las fracciones suman 1 en 268 de 274 filas, y la combinación de 21 % de oxígeno con 70 % de "CO" (9 filas) es la de una figura de la guía de NASA que dice dióxido de carbono |
| FLEX | Una presión de 0 mmHg y 6 filas donde las fracciones suman 0.98 | Presión vacía con nota |
| FLEX | Fechas con año de 2 y de 4 dígitos; archivo en cp1252 | Se leen los dos formatos |
| FLEX-2 | La tabla experimental dice oxígeno de 17 a 30 %. Las mezclas medidas llegan a 39.7 %, siempre con helio por encima de 30 % | La tabla se conserva como viene; cada renglón remite a las mezclas medidas |
| FLEX-2 | 18 de los 124 llenados no tienen archivo de presión, y 13 de ellos repiten la misma composición | Sin presión en el CSV |
| FLEX | Sus 31 archivos de mezcla son de 2013 y 2014, posteriores a las 274 pruebas de su tabla (2009 a 2011) | Exportados aparte; no se cruzaron con la tabla |
| BASS | Una fecha "6/29/`12" y otra del año 2103 | Fecha vacía con nota |
| BASS | En 3 pruebas el material de la tabla no coincide con el de la matriz | Marcado con "OJO" en `notas` |
| BASS, BASS-II | Material, forma y tamaño en una sola celda de texto libre, con erratas | Se conserva el texto; `material_familia` solo cuando el texto nombra el material. El 14-nov, con el cartel de BASS-II de 2014 (NTRS 20160000593), las 57 filas de BASS-II sin material pasaron a PMMA; quedan 31 como "no especificado", todas de BASS |
| BASS-II | Dos pruebas con oxígeno final de 39.1 y 40.4 % partiendo de 20 % | Marcadas con "AVISO"; probable errata |
| BASS-II | El anemómetro responde en un minuto (lo dice su ReadMe); 10 celdas mezclan velocidades y posiciones del potenciómetro, y 3 dan más de 40 cm/s | Marcadas en `notas` |
| BASS-II | El sensor de oxígeno estaba descalibrado y se corrigió con un desplazamiento fijo (lo dice su ReadMe) | Se usa el valor calibrado de la tabla |
| ACME BRE | Oxígeno "3400%" y "2100%" en dos filas | Sin valor numérico, con nota |
| ACME s-Flame, CLD Flame | Erratas de autollenado de Excel: "N3" a "N6", "CH5" | Diluyente tomado como N2, con nota |
| ACME E-FIELD | 11 renglones de continuación | Se pegan al día anterior |
| ACME CFI-G | 861 filas vacías; "Yes", "yes", "No", "no" y "flash" mezclados | Se omiten las vacías; el texto se conserva |
| Flame Design | 11 flamas inversas con oxígeno "RAMP" o "LOW O2" | Sin valor numérico |
| Flame Design, CFI-G | Sin fecha. El identificador lleva año y día (el ReadMe de BRE explica el formato AADDDX# para ACME) | Fecha vacía: el ReadMe es de BRE, no de estas dos |
| Saffire | Unidades dentro del valor, "037 mm" por 0.37, dos materiales vacíos, notas al pie como filas | Texto conservado; el material vacío no se rellenó |
| Saffire-I y III | Largo y ancho de la muestra intercambiados entre las dos tablas | Se conserva lo que dice cada una |
| Saffire-II | La ficha dice 20 o 30 cm/s; la tabla, 20 en las nueve muestras | Sin resolver |
| Saffire | En la telemetría, la mayoría de las celdas de presión vienen vacías o en cero | Solo cuentan los valores entre 1 y 30 psi |
| Saffire-III | La presión de la cabina de Cygnus (13.95 a 14.06 psi) y la del sensor del experimento (14.40 a 14.50 psi) difieren en 0.4 psi | Se usa la del experimento; las dos están en `data/extra/saffire_ambiente.csv` |
| SAME-R | Las dos tablas de tamaños de partícula del archivo de resultados (artículos ICES e IAASS) dan valores algo distintos | Se exportan las dos, con una columna que dice de cuál es cada renglón |
| SAME | 4 de 8 renglones dicen "same conditions as 1-4" | Sin condiciones numéricas en esos 4 |
| SAME, SAME-R | En las hojas de detectores varios canales se saturan (la dispersión se queda en 6.07 V, el P-Trak en su tope) y hay cortes de señal que aparecen como ceros | El resumen ignora los ceros y usa el percentil 99 en lugar del máximo; aun así es solo orientativo |
| SAME-R | El número de corrida del nombre de cada hoja de detectores no siempre casa con la tabla: de 69 archivos, 19 difieren en el día o en el material | No se unieron por corrida; el resumen va por archivo y por material |
| SAME, SAME-R | Los instrumentos cambiaron entre los dos vuelos (en SAME-R el canal del detector del transbordador queda en cero) | Las cifras de los dos vuelos no se comparan entre sí |
| SAME, SAME-R | En la primera versión de esta lectura se dijo que el detector de ionización seguía el mismo orden que el de la Estación | Era una mezcla de canales: los reportes dicen que el detector de ionización del transbordador dio señal fuerte con todos los materiales. Corregido |
| SPICE | Fecha sin año | Resuelto: el reporte de 30 días dice que se operó en 2009; se usa ese año con el día GMT de la tabla |
| SPICE | La tabla no dice con qué se diluyó el propileno | El reporte final habla de mezclas de propileno y nitrógeno; anotado en la fila |
| SLICE | Texto pegado a la fecha | La fecha se separa |
| Fichas | Saffire-I con fechas 2001 a 2008 (las de SAME); Saffire-III con el texto de Saffire-I; PSI-106, 107 y 159 sin fechas; PSI-10 sin licencia | Se conserva lo que dice la ficha |
| Fichas | La de CFI-G menciona n-pentano y su tabla no lo trae | Anotado |

---

## 6. Cinco caminos de producto para 13 horas

Los cinco salen de los mismos datos y no se excluyen: uno puede ser la pantalla principal y tomar piezas de
los otros. Los tres primeros son las propuestas A, B y C de la primera versión. Los caminos 4 y 5 salieron
al releer el enunciado el 13 de noviembre: el reto sugiere tres funciones y un extra, y las propuestas
anteriores no cubrían la función 3 (equipo de nueva generación) ni el extra (aplicaciones en la Tierra). La
página del equipo (`equipo/avance.html`) presenta los cinco parejos, sin recomendar ninguno.

### 1. Hábitat seguro: "¿Hay datos para tu hábitat?" (antes propuesta A)

- **Qué ve el usuario.** Un plano de oxígeno contra presión con los tres ambientes de `RETO.md` y las tres
  atmósferas de BRE marcadas, y cada prueba como un punto, con color por tipo de combustible y filtro por
  frente. El usuario elige un ambiente (Estación, base lunar, rover, traje) y el tablero le dice cuántas
  pruebas hay cerca, de qué investigaciones, con qué combustibles y qué falta. Al tocar un punto se abre la
  ficha de la investigación con su resumen hecho por IA y su cita. Un panel de huecos dice lo que no existe.
- **Qué pregunta de `RETO.md` responde.** La función 1 (qué investigaciones importan para naves, bases
  lunares y rovers), la consideración de trajes y oxígeno, y la de gravedad parcial.
- **Por qué es factible.** Los datos ya están: `pruebas.csv` y `cobertura.csv`. Ahora 1,460 pruebas traen
  oxígeno y presión juntos, de 9 investigaciones (BASS, las tres Saffire, BRE, FLEX, CFI, CFI-G y Flame Design).
- **Riesgo.** Las pruebas sin presión hay que mostrarlas en una franja de "sin presión reportada" para que
  no parezca que no existen.

### 2. El asesor que responde: comparador con preguntas a los datos (antes propuesta B)

- **Qué ve el usuario.** Una lista ordenada por relevancia para seguridad, con filtros por frente,
  combustible y equipo. Elige dos o tres y las ve lado a lado con los atributos que pide `RETO.md`:
  objetivos, combustibles con forma y tamaño, condiciones, qué varió entre pruebas y qué se midió. Abajo,
  una caja de preguntas cuyas respuestas citan el PSI-ID y la fila.
- **Qué pregunta responde.** La función 1, la función 3 y la consideración de comparación entre investigaciones.
- **Por qué es factible.** `investigaciones.csv`, `clasificacion.csv` y `publicaciones.csv` (382 artículos)
  ya tienen los atributos, y hay 54 millones de caracteres de texto de documentos para alimentar las respuestas.
- **Riesgo.** Es lo que harán casi todos los equipos. Y el orden por relevancia es interpretación: hay que
  enseñar la justificación junto a cada puesto.

### 3. Datos listos para predecir: banco de datos con explorador de extinción (antes propuesta C)

- **Qué ve el usuario.** La tabla de pruebas con unidades unificadas, filtrable y descargable en CSV y JSON,
  y tres vistas ya armadas: en FLEX, concentración de CO2 o helio contra desenlace; en CFI, diámetros de
  extinción y tasas de quemado contra presión; en Saffire-II, cada material en microgravedad contra gravedad
  normal. La IA explica cada columna y avisa de sus límites.
- **Qué pregunta responde.** La función 2 (datos para modelos predictivos) y la función 3 por la supresión.
- **Por qué es factible.** Es la tabla que ya existe más unas gráficas.
- **Riesgo.** Luce menos en un pitch de tres minutos.

### 4. Equipo de nueva generación: "¿Qué detector, qué extintor y qué materiales hacen falta?"

- **Qué ve el usuario.** Los tres frentes del enunciado (prevenir, detectar y apagar), y en cada uno lo que
  los experimentos ya enseñaron y lo que le falta al equipo de hoy. En detectar, cada material con el tamaño
  de sus partículas de humo y la respuesta del detector; en apagar, las gotas de FLEX con CO2 o helio contra
  su desenlace; en prevenir, las pruebas de BASS y BASS-II con su oxígeno y su flujo.
- **Qué pregunta responde.** La función 3 (investigación que ayuda a desarrollar la próxima generación de
  controles y equipos), que ninguna propuesta de la primera versión cubría como producto.
- **Por qué es factible.** Ya hay una lección que mostrar: según los reportes de SAME y SAME-R, el detector
  de la Estación responde poco al humo de partículas chicas, como el de Kapton y el de teflón. Los tamaños
  están por corrida en `pruebas.csv` y el resumen de detectores en `data/extra/same_respuesta_detectores.csv`.
  Para apagar están las 274 pruebas de FLEX y las 7 de BASS con nitrógeno.
- **Riesgo.** PSI no tiene ninguna prueba con niebla de agua ni con materiales actuales (cables, espumas,
  baterías). Las corridas de humo no traen oxígeno ni presión. Y nuestro resumen de detectores es grueso
  (percentil 99 de la señal): sirve para ordenar materiales, no para dar un umbral.

### 5. Del espacio a la Tierra: "¿De qué sirve esto aquí?"

- **Qué ve el usuario.** Las lecciones del fuego en microgravedad contadas para la Tierra: las tecnologías
  de NASA que ya pasaron a bomberos e industria, enlazadas con lo que los experimentos dicen sobre humo y
  extinción.
- **Qué pregunta responde.** El extra del enunciado sobre aplicaciones en la Tierra: extintores de niebla
  fina de agua, detección de humo y equipo de bomberos.
- **Por qué es factible.** Solo en parte. `RETO.md` da tres páginas de NASA Spinoff como recurso (tanques de
  aire, un detector que distingue humo de polvo y se usa en minería, y ropa de bomberos), y los hallazgos de
  humo y extinción de esta investigación sirven de puente.
- **Riesgo.** Es más narración que datos. PSI casi no tiene nada de la Tierra, las tres páginas de Spinoff
  no se han leído, y DAFT y DAFT-2, que midieron polvo con un instrumento de SAME, no se trabajaron. Hay que
  cuidar no afirmar nada que los datos no sostengan.

### A qué premio apunta cada camino

Space Apps da diez premios globales (https://www.spaceappschallenge.org/awards/, leída el 13 de noviembre de
2026; sin fecha visible). La relación con cada camino es interpretación nuestra, no un dato del reto. Los
criterios de los jueces de la sede no se pudieron leer (sección 9).

| Camino | Premios a los que apunta |
|---|---|
| 1. Hábitat seguro | Best Use of Science; Best Mission Concept |
| 2. El asesor que responde | Best Use of Technology; Best Use of Data |
| 3. Datos listos para predecir | Best Use of Data; Best Use of Science |
| 4. Equipo de nueva generación | Galactic Impact; Best Mission Concept |
| 5. Del espacio a la Tierra | Local Impact; Best Use of Storytelling; Most Inspirational |

### Cómo combinarlos

Una combinación posible, que es sugerencia de este análisis y no una decisión: el camino 1 como pantalla
principal; del 2, la ficha por investigación y la caja de preguntas; del 3, el botón de descarga y la vista
de FLEX si sobra tiempo; del 4, el panel de detectores como segunda historia. El equipo elige el sábado.
Orden sugerido para esa combinación:

| Horas | Qué |
|---|---|
| 10:30 a 12:30 | Esqueleto, carga de los CSV como JSON, plano de oxígeno contra presión con los ambientes |
| 13:30 a 16:00 | Filtros, selector de ambiente, panel de huecos, franja de "sin presión reportada" |
| 16:00 a 18:30 | Ficha por investigación con resúmenes generados una vez; caja de preguntas |
| 18:30 a 20:00 | Estados de carga y error, celular, datos del peor caso, demo de punta a punta |
| Domingo 8:00 a 10:00 | Solo correcciones |

---

## 7. Arquitectura sugerida

Sin versiones ni nombres de librerías: hoy no se verificó ninguna y es decisión del equipo (sección 8).

```
data/raw/  ->  scripts/limpiar_psi.py  ->  data/*.csv  ->  (paso de build)  ->  JSON para la página
                                                                 |
                                              resúmenes generados una vez y guardados
                                              (un archivo por investigación, con modelo y fecha)

navegador  <->  página web (gráficas, filtros, fichas; lee solo JSON ya hecho)
navegador   ->  función en el servidor  ->  API de Claude      (solo la caja de preguntas)
                (lee la clave de .env)
```

- **Página.** Estática, con los datos ya convertidos a JSON. Funciona sin la API: si se cae el wifi de la
  sede, el mapa, los filtros y las fichas siguen andando.
- **Resúmenes.** Un script los genera una sola vez por investigación a partir de su ficha y de sus filas de
  `pruebas.csv`, y los guarda en el repositorio junto con el modelo, la fecha y el texto que se le envió.
  Cada resumen se revisa a mano contra la ficha antes de la demo.
- **Caja de preguntas.** Lo único en vivo. Una función en el servidor recibe la pregunta, arma el contexto
  con las filas, las fichas y los pasajes de documentos relevantes (`scripts/buscar_texto.py` ya los
  encuentra) y llama a la API de Claude. La respuesta debe citar PSI-ID y fila o documento, y decir "no está
  en los datos" cuando no esté. Límite de longitud por respuesta y de preguntas por minuto.
- **Clave.** Solo en `.env`, solo en el servidor. `.env` ya está en `.gitignore`.
- **Cada pieza externa detrás de una interfaz.** Un solo archivo llama a la API, para poder cambiar de
  modelo sin tocar la página.
- **Reparto de modelos.** El de `RESUMEN_HACKATHON.md`: Sonnet para resumir, Opus para ordenar e
  interpretar, Fable solo si hace falta. No se verificó hoy contra la documentación.

---

## 8. Preguntas abiertas para el equipo

1. **Qué camino se construye.** ¿Cuál de los cinco es la pantalla principal y qué piezas se toman de los
   otros? Va junto con a quién le hablamos primero: ingenieros, estudiantes, investigadores o gente de la
   Tierra.
2. **Tecnología de la página y dónde se despliega.** Hay que decidirlo y verificar versiones el sábado
   temprano. ¿La demo corre en una laptop o tiene que estar en internet para los jueces?
3. **El corte de presión.** ¿Usamos "11 psi o menos" para contar las pruebas de FLEX a 0.7 atm como cercanas
   a la base lunar, o el corte exacto de 10.2 psi del enunciado? Con el corte exacto, FLEX no cuenta.
4. **Flamas inversas.** ¿Mostramos el 85 % de oxígeno de CFI-G como "la prueba con más oxígeno", como hace
   `RETO.md`, o aparte, porque ese oxígeno sale del quemador y no es la atmósfera?
5. **Leer a fondo los reportes finales.** Ya están bajados (41) y se sacaron los resultados principales por
   búsqueda. ¿Alguien del equipo lee completos los de BRE, BASS-II y SAME antes del pitch?
6. **Cotejar las cifras de BRE.** Sus 177 pruebas salen del texto de un PDF (tres tablas de una tesis) y ya
   se cotejaron con una segunda lectura automática (176 coinciden). ¿Alguien mira a ojo las páginas 110 a
   112, 163 y 164 antes del pitch, al menos las de 8.2 y 10.2 psia?
7. **Estudios en tierra y PSI-179.** ¿Entran al tablero, marcados aparte, o se dejan fuera?
8. **Quién revisa.** Los resúmenes de IA contra las fichas, y este documento contra los datos.
9. **Idioma de la interfaz y del pitch.** El envío global suele ir en inglés; no lo confirmamos.
10. **Documentos en el repositorio.** `data/raw/` pesa cerca de 1.5 GB. ¿Se sube a GitHub o se ignora y
    cada quien corre los scripts?
11. Siguen pendientes de `RESUMEN_HACKATHON.md`: qué se permite adelantar antes del sábado (hoy se
    escribieron scripts de descarga, limpieza y búsqueda), cómo se declara el uso de IA y si se puede
    trabajar desde casa el sábado en la noche.
12. `RETO.md` avisa que NASA puede agregar recursos antes del sábado. La pestaña de recursos se volvió a
    mirar el 13 de noviembre y sigue con los mismos diez enlaces; conviene mirarla otra vez el sábado.
13. **Con qué criterios califican los jueces de la sede.** No los encontramos en el sitio; hay que
    preguntarlo al llegar.

---

## 9. Lo que no se pudo verificar

- **La cita oficial contra la página.** El texto de "Cite this Investigation" se generó con la fórmula del
  código del sitio (`main.5216219a85b99359.js`, leído el 13 de noviembre de 2026). No se comparó con la
  página ya dibujada. Para comprobarlo: abrir https://psi.nasa.gov/physci/repo/data/investigations/PSI-25,
  pulsar "Cite this Investigation" y comparar con la fila de PSI-25 en `data/README.md`.
- **El enunciado literal.** `RETO.md` es un resumen en español. El 13 de noviembre se cotejó con el texto
  literal de la página oficial y coincide en los datos; el texto original quedó guardado al final de `RETO.md`.
- **Los criterios de los jueces de la sede.** No se encontraron: la dirección
  https://www.spaceappschallenge.org/2026/judging/ no existe. Solo se leyeron los diez premios globales.
- **La presión de BASS-II, SAME y SAME-R.** Que la guantera trabaja a 1 atm lo dice la guía de
  2015; BASS lo confirma con 0.97 a 1.01 atm.
- **Qué atmósfera tuvo cada prueba de FLEX-2.** Se conocen las mezclas de los llenados, no su reparto por
  prueba. Tampoco se sabe si los 124 archivos de mezcla cubren todos los llenados que hubo.
- **La tabla de BRE.** Se leyó del texto extraído de un PDF, no de un archivo de datos. Las 177 pruebas se
  cotejaron con una segunda lectura del PDF por posición de las palabras (176 coinciden; la otra aparece en
  dos tablas con distinto redondeo). Las dos lecturas son automáticas: nadie las ha mirado a ojo completas.
- **Los documentos.** Se buscó en ellos por palabras; no se leyeron completos. 79 no tienen texto legible.
- **El reporte final de BASS.** Está en el listado de PSI y da error 404.
- **El apéndice de BASS-II.** Se leyó por la posición de las palabras en el PDF. Cada fila se comprobó contra
  el oxígeno de la tabla experimental (126 de 126 coinciden), pero el texto de las observaciones no se revisó
  a ojo y puede traer palabras de la columna vecina.
- **Las páginas de contexto.** La de Combustion Science (https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/,
  actualizada el 4 de septiembre de 2025, hace 14 meses) se leyó a través de un resumen automático. La
  Researcher's Guide (https://www.nasa.gov/missions/station/a-researchers-guide-to-combustion-science/,
  edición de octubre de 2015, hace 11 años) se leyó por búsqueda de pasajes en su PDF; está guardada en
  `data/raw/contexto/`. Las dos se usaron solo como contexto.
- **Los resultados de las investigaciones.** Los de la sección 1 salen de pasajes de los reportes finales,
  con su página; no se leyó ningún reporte completo ni ninguno de los 382 artículos de
  `data/publicaciones.csv`. Antes de citarlos en el pitch hay que leer la página indicada.
- **Una revisión independiente.** Ver la nota del principio.

---

## 10. Qué corrigió la auditoría respecto a la primera versión

| La primera versión decía | Lo correcto |
|---|---|
| Siete investigaciones de vuelo no listan documentos, entre ellas FLEX | Falso. Se leía un campo que no es la lista de archivos. De las de vuelo, solo CLD Flame y SLICE no tienen documentos |
| Hay 157 documentos de apoyo | Hay 338 en las tres categorías; se bajaron 242 |
| El máximo de oxígeno en sólidos es 22.2 % | Es 22.7 % (BASS, cuyo oxígeno no se había encontrado) |
| 140 de 380 filas de sólidos traen oxígeno | 261 de 380 |
| Ninguna tabla de sólidos trae presión | BASS sí, en su matriz: 14.3 a 14.8 psi |
| BASS-II da el flujo en unidades del ventilador | "Air display" es velocidad en cm/s; el voltaje del ventilador es "Fan display" |
| No hay supresión sobre sólidos | BASS aplicó nitrógeno en 7 pruebas |
| El texto de cita no se pudo obtener | Se obtuvo la fórmula del sitio y se generó para las 28 |
| CFI tiene 87 pruebas; SPICE, 469 | 79 y 435 distintas; el resto son filas repetidas. El resumen de CFI trae 227 |
| Los caracteres raros de las fichas eran un problema de los datos | Era la consola al imprimir; las fichas están bien |
| El documento describe qué se probó, no qué se encontró | Los reportes finales traen resultados; los principales están en la sección 1 |
| Ningún sólido se probó con oxígeno alto | Ninguno con datos en PSI. Hay un reporte de SSCE (35 y 50 % de oxígeno) archivado en PSI-108 |
| SPICE no tiene año; SAME-R no cuadra con su ficha | SPICE es de 2009; las 109 filas de SAME-R son 67 corridas más sus envejecimientos secundarios |
| BRE va por día y sin presión | Hay 177 pruebas con oxígeno, presión y desenlace en una tesis archivada entre sus reportes; 34 son tipo base lunar |
| Los tamaños de partícula solo están por material | Están por corrida: 131 corridas de SAME y SAME-R con su diámetro medio |
| FLEX-2 pudo quemar gotas en condiciones tipo base lunar | Sus mezclas medidas dicen que no: ninguna tiene 30 % o más de oxígeno a 11 psia o menos. Sí llegó a 39.7 % de oxígeno, con helio, a 1 y 3 atm |
| BASS-II no trae resultado ni dirección del flujo | Su reporte resumen los trae por prueba: 126 con observaciones, 120 con dirección, 20 con velocidad de propagación y 20 con desenlace |
| Los resultados de CFI quedan exportados aparte | Integrados: `pruebas.csv` trae las 227 pruebas de CFI con sus resultados |
| Saffire no trae presión y Saffire-III no trae oxígeno | Salen de su telemetría: 14.4 a 14.9 psi en las tres, y 19.4 a 20.1 % de oxígeno en Saffire-III |
| No hay tamaños de partícula del humo | Los hay por material, en el archivo de resultados de SAME y SAME-R |
| Tres propuestas de producto cubren lo que sugiere el reto | No cubrían la función 3 (equipo de nueva generación) ni el extra de la Tierra. Ahora son cinco caminos |

---

## Anexo: cómo reproducir

```
python scripts/descargar_psi.py               listas, fichas, listados de archivos y tablas
python scripts/descargar_documentos.py        documentos de apoyo
python -E -P scripts/extraer_texto.py         texto de los documentos, para buscar en ellos
python -E -P scripts/exportar_hojas.py        hojas útiles a data/extra/
python -E -P scripts/telemetria_saffire.py    presión de Saffire y tamaños de partícula de SAME, a data/extra/
python -E -P scripts/detectores_same.py       respuesta de cada detector de humo por archivo, a data/extra/
python scripts/mezclas_flex.py                atmósferas medidas en la cámara de FLEX y FLEX-2, a data/extra/
python scripts/limpiar_psi.py                 investigaciones.csv, pruebas.csv y publicaciones.csv
python scripts/cobertura.py                   cobertura.csv
python scripts/generar_tablas_md.py           rellena las tablas de este documento y de data/README.md
python scripts/buscar_texto.py "patrón" --inv PSI-26      busca en los documentos
```

`limpiar_psi.py`, `exportar_hojas.py` y `telemetria_saffire.py` necesitan la librería openpyxl. Para leer
los .xls viejos se instaló xlrd 2.0.2 dentro del proyecto, en `scripts/_vendor/` (fuera de git):
`python -m pip install --target scripts/_vendor xlrd==2.0.2`. `verificar_cifras.py` comprueba que las cifras
de este documento siguen saliendo de los datos.

Documentos por investigación:

<!-- TABLA:documentos -->
| ID | Acrónimo | Documentos listados (ciencia, ingeniería, referencia y reportes) | Bajados | Peso | Sin bajar, de otras categorías |
|---|---|---|---|---|---|
| PSI-10 | ACME/Flame Design | 7 | 7 | 14.7 MB | nada |
| PSI-20 | ACME BRE | 49 | 40 | 141.8 MB | 13 de presentaciones |
| PSI-21 | ACME CLD Flame | 0 | 0 |  | nada |
| PSI-22 | ACME E-FIELD Flames | 50 | 38 | 104.2 MB | 32 de presentaciones |
| PSI-23 | ACME s-Flame | 88 | 29 | 79.7 MB | 17 de presentaciones |
| PSI-25 | BASS-II | 7 | 7 | 52.4 MB | nada |
| PSI-26 | BASS | 31 | 29 | 23.7 MB | 6 de presentaciones |
| PSI-39 | CFI | 5 | 5 | 17.0 MB | 32 de datos analizados, 2 de presentaciones |
| PSI-47 | DAFT / DAFT-2 | 9 | 9 | 21.9 MB | 3 de presentaciones, 12 de datos analizados |
| PSI-60 | (sin acrónimo) | 0 | 0 |  | nada |
| PSI-62 | (sin acrónimo) | 0 | 0 |  | nada |
| PSI-68 | FLEX-2 | 10 | 251 | 14.2 MB | 63 de calibración |
| PSI-69 | FLEX | 5 | 67 | 6.7 MB | 4 de presentaciones, 120 de calibración |
| PSI-77 | ISSI | 3 | 3 | 42.1 MB | nada |
| PSI-98 | SAFFIRE-I | 6 | 6 | 15.6 MB | nada |
| PSI-99 | SAFFIRE-II | 6 | 5 | 42.6 MB | 3 de presentaciones |
| PSI-100 | SAFFIRE-III | 7 | 11 | 59.6 MB | 3 de presentaciones |
| PSI-101 | SAME-R | 29 | 113 | 486.7 MB | 4 de presentaciones, 86 de datos analizados |
| PSI-102 | SAME | 34 | 88 | 248.6 MB | 63 de datos analizados, 6 de presentaciones |
| PSI-106 | SLICE | 0 | 0 |  | nada |
| PSI-107 | SPICE | 9 | 9 | 10.6 MB | 5 de presentaciones |
| PSI-108 | STDCE-1 | 12 | 12 | 38.5 MB | 4 de datos analizados |
| PSI-115 | (sin acrónimo) | 2 | 2 | 10.7 MB | 44 de datos analizados |
| PSI-117 | (sin acrónimo) | 1 | 1 | 8.1 MB | 4 de presentaciones, 10 de datos analizados |
| PSI-142 | (sin acrónimo) | 0 | 0 |  | 1 de datos analizados |
| PSI-159 | ACME CFI-G | 2 | 2 | 11.4 MB | nada |
| PSI-179 | ASE | 7 | 2 | 22.6 MB | 12 de presentaciones, 1911 de datos analizados |
| PSI-181 | (sin acrónimo) | 2 | 2 | 17.1 MB | 27 de datos analizados, 20 de presentaciones |
<!-- /TABLA:documentos -->
