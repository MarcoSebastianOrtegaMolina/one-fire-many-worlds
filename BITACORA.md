# Bitácora de avances

Qué se hizo, cuándo y dónde quedó. Lo más nuevo va arriba. Cada quien agrega su renglón cuando termina
algo, aunque sea chico.

**Cómo agregar una entrada:** abre este archivo en GitHub, toca el lápiz (Edit), escribe tu renglón en la
tabla del día y toca «Commit changes». No hace falta instalar nada.

## Sábado 14 de noviembre de 2026 (día del hackathon)

| Qué se hizo | Quién | Dónde quedó |
|---|---|---|
| La Estación en 3D es ahora la realista de NASA, con sus texturas (se baja solo al abrirla, 14.4 MB), y los modelos se muestran con sus insignias de NASA, como el hábitat lunar | Marco Sebastián (decidió), sesión de aportes (preparó la Estación), con Claude | `app/models/`, `app/js/viewer3d.js`, `app/js/method.js`, `FUENTES.md` |
| Modelos 3D mejores: el mundo Traje muestra el EMU, el traje real de las caminatas de la Estación (en lugar del Mark III), y el mundo Luna suma la Luna de NASA hecha con imágenes del orbitador LRO, como pestaña aparte | Marco Sebastián (eligió), sesión de aportes (bajó y aligeró), con Claude | `app/models/`, `app/js/viewer3d.js`, `scripts/aligerar_glb.py`, `FUENTES.md` |
| Segunda revisión independiente y sus arreglos: toda frase de ausencia dice «en PSI» (mundo Traje, Marte, humo, silicón, gravedad lunar), las presiones de Saffire VI por prueba, las imágenes de pruebas en tierra marcadas, el origen «gravedad parcial» para el KC-135 y el cartel de Nomex, los desacuerdos entre PSI y las láminas de Saffire de 2017, «Cómo se hizo» con el visor 3D, y figuras de Pyrell y Ultem (los diez materiales tienen figura) | Marco Sebastián, con Claude | `app/data/`, `app/js/`, `api/ask.js`, `scripts/preparar_modelos.py` |
| Dos fotos de flamas de acrílico en órbita (Saffire IV y SoFIE GEL), bajadas de NASA con crédito, en la ficha del acrílico; las fotos de páginas web se nombran «Foto» y no muestran página | Sebastián Martínez (enlaces), Marco Sebastián, con Claude | `app/figures/`, `app/data/figures.js`, `app/js/sources.js` |
| Gravedad lunar corregida y fuentes nuevas: la lista de Victor trajo los vuelos de gravedad parcial del KC-135 (2003), así que ya no se dice que la gravedad lunar solo se probó en centrífuga; entran el cartel de Nomex para FM2 de 2025 (aporte de Marina) y la tabla de resultados de Saffire I a III de 2017; 48 fuentes | Victor y Marina (aportes), Marco Sebastián, con Claude | `app/data/content.js`, `app/data/evidence.js`, `app/js/sources.js` |
| Material de 57 pruebas de BASS-II: el cartel de BASS-II de 2014 nombra el material de cada grupo, así que las 57 filas «sin material» pasaron a PMMA; el acrílico pasa de 91 a 148 pruebas (BASS-II 98, BASS 48, Saffire-II 2) y su oxígeno probado empieza en 13.6 % | Marina (aporte), Marco Sebastián, con Claude | `scripts/limpiar_psi.py`, `data/pruebas.csv`, `app/data/data.js` |
| Saffire VI y más aportes: la plataforma dice «en PSI ningún sólido con aire de base lunar; fuera de PSI, Saffire VI (2023) sí» en el mundo lunar, la agenda, la línea de tiempo, las fichas y la IA; la línea de tiempo pasa a 12 momentos (Skylab, 1989, Saffire VI); las 45 fuentes y 77 figuras dicen su origen y su material; 9 imágenes del equipo en las fichas de teflón, Kapton, Nomex, silicón, SIBAL y acrílico | Marina y Sebastián Martínez (aportes), Marco Sebastián, con Claude | `app/data/`, `app/figures/`, `app/js/materials.js`, `api/ask.js` |
| Visor 3D en los cinco mundos: un modelo de NASA de cada lugar (Estación, hábitat lunar, traje Mark III, Marte y Tierra) que se carga solo al tocar «Ver en 3D», sin depender de servidores de Google; se borraron las insignias de NASA de las texturas y se aligeraron Marte y la Tierra | Sebastián Martínez (enlaces), Marco Sebastián, con Claude | `app/js/viewer3d.js`, `app/models/`, `app/vendor/` |
| Aportes del equipo como fuentes citadas: el catálogo pasa de 16 a 42 páginas (norma NASA-STD-6001B, memorando de 1989, cartel de BASS-II, artículo de SAME-2, reporte de Meyer, caso de Apollo 13, cartel de FM2); los documentos fuera de PSI se abren en NASA y se marcan como contexto; la IA atribuye cada dato a su documento, nunca a «NASA» en general | Marina y Sebastián Martínez (aportes), Marco Sebastián, con Claude | `scripts/construir_evidencia.py`, `app/data/evidence.js`, `aportes/REVISION.md`, `app/js/sources.js`, `api/ask.js` |
| Ficha de material completa: cada material reúne sus tres preguntas, las páginas de los documentos que hablan de él separadas por origen (microgravedad, tierra y normas, planeado), sus figuras, la comparación órbita contra tierra, sus pruebas en tabla numerada y qué falta probar; las imágenes del equipo saldrán solas cuando entren al catálogo | Marco Sebastián, con Claude | `app/js/materials.js` |
| Notas del profe aplicadas: tablas y figuras con formato tipo APA (número, título arriba, encabezados con unidad y «Nota.» con la fuente) en las fichas, en el informe y en las respuestas; cada ficha ordenada como estudio (objetivo, hipótesis, método, qué se midió y con qué, resultados, límites, quién la hizo); sección «Cómo se hizo» con las herramientas y el uso de IA | Marco Sebastián, con Claude | `app/js/investigations.js`, `app/js/method.js`, `app/js/app.js`, `app/js/ask.js` |
| Revisión independiente de la IA y sus arreglos: cada prueba se cita con un número único (antes las de BRE no se podían citar y 290 filas se repetían entre tablas), se corrigió lo que decíamos del tamaño de las partículas de SAME, dos muestras de Saffire-II recuperaron su material (PMMA pasa a 91 pruebas y SIBAL a 45) y se limpiaron citas y figuras repetidas | Marco Sebastián, con Claude | `api/ask.js`, `app/js/ask.js`, `app/js/explore.js`, `scripts/limpiar_psi.py`, `scripts/construir_evidencia.py`, `data/pruebas.csv` |
| Botón «Crear informe»: la IA escribe un informe de investigación sobre el tema que le pidas (resumen, qué dicen los datos, prevención, detección y supresión, qué falta probar, límites), con figuras, tabla de las pruebas citadas y fuentes; se imprime o se guarda como PDF | Marco Sebastián, con Claude | `app/js/ask.js`, `api/ask.js`, `app/views.css` |
| Imágenes en la respuesta: la IA pone figuras de los reportes de NASA dentro de lo que contesta, cada una con su pie, su página y su fuente; también salen en la ficha de cada investigación (71 figuras de 8 documentos) | Marco Sebastián, con Claude | `app/js/sources.js`, `app/js/ask.js`, `api/ask.js`, `scripts/construir_figuras.py`, `app/figures/` |
| Fuentes exactas: cada cita de la IA abre la página del reporte de NASA con el pasaje marcado | Marco Sebastián, con Claude | `app/js/sources.js`, `scripts/construir_evidencia.py` |
| Pregunta en vivo encendida y probada | Marco Sebastián, con Claude | https://one-fire-many-worlds.vercel.app/?lang=es#/ask |
| Lista de fuentes, bitácora y carpetas de aportes por persona | Marco Sebastián, con Claude | `FUENTES.md`, `BITACORA.md`, `aportes/` |
| Repositorio privado en GitHub con el equipo invitado | Marco Sebastián, con Claude | Este repositorio |
| La plataforma en español e inglés, con botón de idioma | Marco Sebastián, con Claude | `app/js/i18n.js`, `app/data/content.es.js` |
| Plataforma publicada | Marco Sebastián, con Claude | https://one-fire-many-worlds.vercel.app/?lang=es |
| Caja de preguntas con IA y respuestas guardadas (la pregunta en vivo falta de encender) | Marco Sebastián, con Claude | `app/js/ask.js`, `api/ask.js` |
| Línea de tiempo, explorador «¿Arderá?» y tabla de datos con descarga | Marco Sebastián, con Claude | `app/js/explore.js` |
| Pasaporte de material | Marco Sebastián, con Claude | `app/js/materials.js` |
| Lista, ficha y comparación de investigaciones | Marco Sebastián, con Claude | `app/js/investigations.js` |
| Portada con la escala de gravedad y vista de cada mundo | Marco Sebastián, con Claude | `app/index.html`, `app/js/app.js` |
| Textos de las 25 investigaciones, los 5 mundos y los 10 materiales | Marco Sebastián, con Claude | `app/data/content.js` |
| Script que convierte los datos limpios al formato de la página | Marco Sebastián, con Claude | `scripts/construir_datos_app.py` |
| Decisión del equipo: los cinco caminos se fusionan en «Un fuego, muchos mundos», más cuatro piezas nuevas | Equipo | https://hamac-avance.vercel.app/#propuesta |
| Pregunta de investigación para la organizadora | Marco Sebastián | Abajo, en «Pregunta de investigación» |

### Hallazgos nuevos del sábado

- **Fuera de PSI sí hay sólidos con aire casi de base lunar (verificado, D-1429).** Saffire VI voló en
  diciembre de 2023 en una Cygnus sin tripulación y quemó tela SIBAL con 31.0 % de oxígeno a 54.1 kPa y
  acrílico con 30.3 % y 28.8 % a unos 55 kPa (unos 8 psi). El humo se detectó a los 981 s, después de que salió
  la mayor parte de los gases peligrosos, y el monóxido de carbono pasó el límite de 24 horas en las pruebas de
  acrílico. Fuente: «Preliminary Results from the Saffire VI Experiment», Urban y otros, ICES 2024, págs. 4,
  11, 20 y 21 (lo subió Sebastián Martínez). PSI solo tiene Saffire I a III.

- En Saffire-II el silicón casi no ardió en microgravedad, y en gravedad normal dos de sus cuatro muestras
  ardieron completas. Fuente: tabla experimental de PSI-99.
- Solo un material, el silicón, tiene las tres respuestas en PSI: si arde, qué humo da y si el detector lo
  ve.
- Cerca de la atmósfera de 8.2 psia con 34 % de oxígeno hay 52 pruebas, ninguna con sólidos: 30 siguieron
  ardiendo y 18 se apagaron solas.
- El camino 5 (del espacio a la Tierra) solo no cumple el reto; como un mundo más dentro de la plataforma,
  sí.

## Viernes 13 de noviembre de 2026 (preparación)

| Qué se hizo | Quién | Dónde quedó |
|---|---|---|
| Descarga de las fichas, tablas y 738 documentos de PSI | Marco Sebastián, con Claude | `scripts/descargar_psi.py`, `scripts/descargar_documentos.py` |
| Limpieza: 2,348 filas, 2,199 pruebas distintas, cada una con su origen | Marco Sebastián, con Claude | `data/pruebas.csv`, `data/README.md` |
| Clasificación de las investigaciones por frente, combustible, equipo y relevancia | Marco Sebastián, con Claude | `data/clasificacion.csv` |
| Mapa de cobertura contra las atmósferas del reto | Marco Sebastián, con Claude | `data/cobertura.csv` |
| Nueve vueltas de auditoría y un verificador de 18 cifras | Marco Sebastián, con Claude | `INVESTIGACION.md`, `scripts/verificar_cifras.py` |
| Página de avance para el equipo | Marco Sebastián, con Claude | https://hamac-avance.vercel.app |

### Hallazgos del viernes

- Ningún sólido con datos en PSI se probó por encima de 22.7 % de oxígeno; una base lunar tendría 30 % o más.
  (Corregido el sábado: fuera de PSI, Saffire VI sí lo hizo en 2023; ver arriba.)
- Hay 71 pruebas con aire tipo base lunar, todas con gas o con gotas: 34 de ACME BRE, 20 de ACME CFI-G y 17
  de FLEX.
- En BRE, cerca de 8.2 psia, 25 de 36 flamas siguieron ardiendo; con aire tipo Tierra, las 10 se apagaron
  solas.
- El detector de la Estación casi no ve el humo de partículas chicas, como el de Kapton y el de teflón.
- PSI no tiene datos de gravedad parcial, de Marte, de condiciones de traje ni de niebla de agua.

## Pregunta de investigación

> ¿Cómo puede una plataforma web con inteligencia artificial, construida durante las 48 horas del hackathon
> con las 2,199 pruebas de combustión en microgravedad del repositorio PSI de NASA, decirle a quien diseña un
> lugar donde vivirá gente (la Estación, una base lunar, un traje, Marte o la Tierra) qué se sabe para
> prevenir, detectar y apagar un incendio ahí y qué falta por probar, citando la fuente de cada dato?

**Respuesta corta:** juntando todas las pruebas en un solo lugar y ordenándolas por el aire y la gravedad de
cada sitio. Así se ve que de la Estación se sabe casi todo, que para una base lunar PSI tiene 71 pruebas y
ninguna con telas o plásticos (fuera de PSI, Saffire VI ya quemó tela y acrílico casi con ese aire en 2023, pero
sus datos no están abiertos), y que del traje y de Marte no hay nada.

## Pendientes

- Revisar todo lo que subió el equipo a `aportes/` (repositorios, PDF, enlaces y listas de fuentes): qué sirve,
  qué está verificado y qué mejora lo que ya tenemos. Va en una sesión aparte y deja su resultado en
  `aportes/REVISION.md`. Pedido por Marco Sebastián el 14-nov para que no se pase mientras se trabaja la IA.
- Logo de One Fire, Many Worlds: en una sesión aparte, en la carpeta `logo/`. Falta ponerlo en la plataforma.
- Rehacer la interfaz de investigaciones, después de la IA.
- Que alguien lea las ocho pantallas en español y marque lo que suene raro.
- Cotejar a mano las cifras de la portada antes de presentar.
- Confirmar con la sede: criterios de los jueces, cómo se declara el uso de IA y si el repositorio tiene que
  ser público.
- Guion y diapositivas de la presentación.
