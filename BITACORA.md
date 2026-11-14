# Bitácora de avances

Qué se hizo, cuándo y dónde quedó. Lo más nuevo va arriba. Cada quien agrega su renglón cuando termina
algo, aunque sea chico.

**Cómo agregar una entrada:** abre este archivo en GitHub, toca el lápiz (Edit), escribe tu renglón en la
tabla del día y toca «Commit changes». No hace falta instalar nada.

## Sábado 14 de noviembre de 2026 (día del hackathon)

| Qué se hizo | Quién | Dónde quedó |
|---|---|---|
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
cada sitio. Así se ve que de la Estación se sabe casi todo, que para una base lunar hay 71 pruebas y ninguna
con telas o plásticos, y que del traje y de Marte no hay nada.

## Pendientes

- Encender la pregunta en vivo (falta la clave en Vercel).
- Que alguien lea las ocho pantallas en español y marque lo que suene raro.
- Cotejar a mano las cifras de la portada antes de presentar.
- Confirmar con la sede: criterios de los jueces, cómo se declara el uso de IA y si el repositorio tiene que
  ser público.
- Guion y diapositivas de la presentación.
