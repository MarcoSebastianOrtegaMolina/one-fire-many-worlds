# Fuentes consultadas

Todo lo que se buscó y se leyó para este proyecto, con su enlace, la fecha del documento y la fecha en que
se consultó. Si encuentras algo nuevo, agrégalo en la última tabla.

**Regla:** una fuente sin enlace y sin fecha no cuenta. Si el documento no muestra fecha, se escribe «sin
fecha visible».

## 1. Los datos (fuente primaria)

| Fuente | Enlace | Fecha | Para qué se usó |
|---|---|---|---|
| Repositorio PSI de NASA, área Combustion Science | https://psi.nasa.gov/physci/repo/search?q=combustion | Consultado el 13-nov-2026 | Todas las cifras del proyecto: 133 investigaciones, 24 de combustión, 2,199 pruebas |
| Ficha de cada investigación | `https://psi.nasa.gov/physci/repo/data/investigations/PSI-N` | Cada ficha trae su fecha de modificación; está en `data/investigaciones.csv` | Objetivos, equipo, DOI, cita |

Cómo se bajó y cómo se limpió está en [data/README.md](data/README.md). Los scripts están en `scripts/`.

## 2. Documentos de PSI de donde salieron resultados

Se localizaron por búsqueda dentro de cada documento, con su página. Ninguno se leyó completo.

| Investigación | Documento | Dónde | Qué se tomó |
|---|---|---|---|
| ACME BRE (PSI-20) | Reporte final, 2022 | Págs. 18 y 55 | Las flamas persisten con 27 % a 10.2 psia y con 34 % a 8.2 psia |
| ACME BRE (PSI-20) | Tesis archivada entre sus reportes | Tablas 6.1, E.1 y F.1; págs. 110 a 112, 163 y 164 | Oxígeno, presión y desenlace de 177 pruebas |
| ACME BRE (PSI-20) | BRE_data_interpretation | Pág. 4 | Las tres atmósferas de la primera ronda |
| BASS y BASS-II (PSI-26, PSI-25) | Reporte resumen NASA/TM-20210011385 | Págs. 19, 36 y 109; apéndice A | Frontera de inflamabilidad en U; observaciones por prueba de BASS-II |
| BASS (PSI-26) | As Run_Test Matrix.xlsx | Hojas de 2012 y 2013 | Oxígeno, presión, flujo y nitrógeno por prueba |
| CFI (PSI-39) | Reporte final | Págs. 6 y 9 | Ciclos de reignición por encima de 2 atm |
| CFI (PSI-39) | CFI_DataSummary_Spreadsheet_Jan2021.xlsx | Hojas Master Sheet y DATA | Resultados de 227 pruebas |
| SAME (PSI-102) | Reporte final | Págs. 25, 28 y 56 | Tamaños de partícula; respuesta de los detectores |
| SAME-R (PSI-101) | Reporte final | Pág. 5 | El humo de Kapton y de teflón será difícil de detectar |
| SAME-R (PSI-101) | Archivo de resultados (tabla del artículo ICES 2012) | Hoja «ICES 2012 Paper data table» | Diámetros de partícula por material |
| SAME y SAME-R | Hojas de datos analizados de los detectores | 125 hojas | Resumen de la señal del detector por material |
| SPICE (PSI-107) | Reporte final | Pág. 2 | 52 puntos de humo |
| E-FIELD Flames (PSI-22) | Reporte final | Pág. 37 | Sugerencia sobre gravedad parcial |
| FLEX (PSI-69) | Documento de descripción (FLEX DoD) | | Atmósferas de exploración |
| FLEX y FLEX-2 | Archivos de mezclas de gas | 124 llenados de FLEX-2 | Composición medida de cada atmósfera |
| Saffire-I, II y III | Telemetría (hojas de cálculo) | Hoja CygnusData | Presión y oxígeno de la cabina |
| SSCE | Reporte archivado en PSI-108 | | La excepción: papel con 35 y 50 % de oxígeno, sin datos |

## 3. Páginas de NASA y del reto

| Fuente | Enlace | Fecha del documento | Consultada | Para qué se usó |
|---|---|---|---|---|
| Enunciado del reto Flame in Freefall | https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/ | Sin fecha visible | 13-nov-2026 | Qué pide el reto. Texto completo en [RETO.md](RETO.md) |
| Pestaña de recursos del reto | Misma página, pestaña Resources | Sin fecha visible | 13-nov-2026 | Los diez recursos oficiales |
| Premios de Space Apps | https://www.spaceappschallenge.org/awards/ | Sin fecha visible | 13-nov-2026 | Los diez premios globales |
| NASA Combustion Science | https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/ | Actualizada el 4-sep-2025 | 13-nov-2026 | Contexto de las investigaciones. Se leyó por un resumen automático |
| A Researcher's Guide to ISS Combustion Science | https://www.nasa.gov/missions/station/a-researchers-guide-to-combustion-science/ | Octubre de 2015 | 13-nov-2026 | Por qué la guantera limita el oxígeno; flamas frías. Se leyó por búsqueda de pasajes |
| 25 Years Ago: Fire Aboard Space Station Mir | https://www.nasa.gov/history/25-years-ago-fire-aboard-space-station-mir/ | 23-feb-2022 | 14-nov-2026 | Línea de tiempo |
| Apollo 1 | https://sma.nasa.gov/sma-disciplines/accllp/apollo-1 | Sin fecha visible | 14-nov-2026 | Línea de tiempo |
| NASA Spinoff: Fire Detector | https://spinoff.nasa.gov/node/9407 | 1978 | 14-nov-2026 | Mundo Tierra: detector que distingue humo de polvo |
| NASA Spinoff: Fireman's Air Tanks | https://spinoff.nasa.gov/node/9582 | 1976 | 14-nov-2026 | Mundo Tierra: tanques de aire de bomberos |
| NASA Spinoff: New Technology for the Fire Attire | https://spinoff.nasa.gov/node/9918 | 1982 | 14-nov-2026 | Mundo Tierra: ropa de bomberos |

**Dadas por el reto y todavía sin leer:** la página de Apollo 13
(https://sma.nasa.gov/sma-disciplines/accllp/apollo-13) y el video NASA ScienceCasts de 2018
(https://www.youtube.com/watch?v=W1oXykoz9zg).

**Buscadas y no encontradas:** los criterios de los jueces de la sede (la dirección
https://www.spaceappschallenge.org/2026/judging/ no existe).

## 4. Herramientas

| Herramienta | Para qué | Versión o fecha |
|---|---|---|
| Claude (Anthropic), en Claude Code | Escribir los scripts, limpiar los datos, la investigación, la plataforma y los resúmenes | 13 y 14-nov-2026 |
| SDK oficial de Anthropic para JavaScript | La caja de preguntas de la plataforma | 1.8.0 (npm, modificado el 10-nov-2026) |
| Vercel | Publicar la plataforma y la página del equipo | Consultada su documentación el 14-nov-2026; sin fecha visible |
| GitHub | Repositorio del equipo | Consultada su documentación el 13-nov-2026; sin fecha visible |
| impeccable | Dirección visual y revisión de diseño | 4.8.0 |
| model-viewer (Google, Apache-2.0) | Visor 3D de cada mundo; servido desde `app/vendor/model-viewer/4.4.0/` | 4.4.0, publicada el 9-oct-2026 (registro de npm, consultado el 14-nov-2026); integridad comprobada contra el registro |
| Decodificador Draco de three.js (MIT) | Abrir los modelos comprimidos sin pedir nada a servidores de Google; en `app/vendor/draco/0.187.0/` | three 0.187.0, publicada el 30-oct-2026 (registro de npm, consultado el 14-nov-2026) |

### Modelos 3D de NASA (uso educativo, con crédito y sin dar a entender respaldo)

| Mundo | Modelo | Enlace | Fecha del archivo | Cambios del equipo |
|---|---|---|---|---|
| Estación | International Space Station (ISS) (D) (IGOAL), realista y con texturas (D-1441, D-1443) | https://github.com/nasa/NASA-3D-Resources/tree/master/3D%20Models/International%20Space%20Station%20(ISS)%20(D)%20(IGOAL) | Último cambio de la carpeta el 20-mar-2025 (API de GitHub, consultada el 14-nov-2026) | Simplificada con gltf-transform 4.5.1 y texturas WebP de 512 px: 96 a 14.4 MB. Conserva sus insignias de NASA (D-1444) |
| Base lunar | Habitat Demonstration Unit, partes 1 y 2 | https://science.nasa.gov/3d-resources/habitat-demonstration-unit/ | 27-feb-2025 | Ninguno: se volvió al original con sus insignias (D-1444) |
| Traje | Extravehicular Mobility Unit (NASA/Michael D. Carbajal), el traje de las caminatas de la Estación (D-1441); reemplaza al Mark III | https://science.nasa.gov/3d-resources/extravehicular-mobility-unit/ | Archivo del 26-mar-2025; página actualizada el 16-jun-2025 | Se quitaron las copias PNG de respaldo de sus 3 texturas (quedan las WebP); 3.29 a 2.54 MB. Sus texturas no traen insignia de NASA |
| Base lunar | Moon 3D Models for Web, AR, and Animation, `moon_small.glb` (NASA's Goddard Space Flight Center, imágenes del orbitador LRO), pestaña «La Luna» | https://svs.gsfc.nasa.gov/14959/ | Publicado el 29-ene-2026; página actualizada el 1-abr-2026 | Textura de 4096 px de PNG a JPEG calidad 88, mismo tamaño en píxeles; 13.2 a 4.0 MB |
| Marte | Planet Mars, 3D Model (NASA/JPL-Caltech) | https://science.nasa.gov/resource/planet-mars-3d-model | Archivos del 8-mar-2024, según la página | Texturas recomprimidas a JPEG (4.0 a 0.7 MB) |
| Tierra | Earth with Clouds 3D Model (NASA VTAD) | https://science.nasa.gov/resource/earth-with-clouds-3d-model | Archivos del 9-sep-2023, según la página | Texturas recomprimidas a JPEG (18.9 a 2.4 MB) |

Los cambios los hacen `scripts/preparar_modelos.py` y `scripts/aligerar_glb.py` (usan Pillow; los modelos originales de NASA no se guardan en el repositorio).
Guía de uso: https://www.nasa.gov/nasa-brand-center/images-and-media/ (actualizada el 27-oct-2026).

Hay que declarar el uso de IA en la entrega. Cómo se declara está pendiente de confirmar con la sede.

## 5. Lo que agregó el equipo

Agrega aquí cada recurso nuevo, aunque todavía no esté revisado. Di con qué lo encontraste (Gemini, ChatGPT,
Google, un profesor) y si ya abriste la fuente original.

| Quién | Fecha | Qué es | Enlace | Fecha del documento | Con qué se encontró | ¿Se abrió la fuente original? | Para qué serviría |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

**Ojo con las respuestas de un asistente de IA:** no son una fuente. Si Gemini o ChatGPT dicen algo, hay que
abrir el documento que citan y comprobar que lo dice. Si no dan un enlace que abra, no se usa.
