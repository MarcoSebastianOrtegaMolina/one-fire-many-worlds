# One Fire, Many Worlds

Proyecto del equipo **Hamác** para el NASA Space Apps Challenge 2026, reto *Flame in Freefall: SI-Powered
Fire Safety Insights from Microgravity Combustion Data*.

Una plataforma web que toma los experimentos de combustión en microgravedad del repositorio PSI de NASA y
responde, para cada lugar donde vivirá gente (la Estación, una base lunar, un traje, Marte o la Tierra), qué
se sabe para prevenir, detectar y apagar un incendio ahí, y qué falta por probar.

| Qué | Dónde |
|---|---|
| La plataforma (español e inglés) | https://one-fire-many-worlds.vercel.app/?lang=es |
| La propuesta y el avance, explicados para el equipo | https://hamac-avance.vercel.app/#propuesta |
| El análisis completo, con cada cifra y su origen | [INVESTIGACION.md](INVESTIGACION.md) |
| Lo que pide el reto, en español y con el texto original | [RETO.md](RETO.md) |

## Si nunca has usado GitHub

No necesitas instalar nada. Todo se puede hacer desde esta página:

1. **Subir lo que encontraste:** entra a [`aportes/`](aportes/), abre tu carpeta, toca **Add file**, luego
   **Upload files**, arrastra tus archivos y toca **Commit changes**.
2. **Anotar un avance:** abre [BITACORA.md](BITACORA.md), toca el lápiz y agrega tu renglón.
3. **Anotar una fuente nueva:** abre [FUENTES.md](FUENTES.md), toca el lápiz y llena la última tabla.

Lo demás de este archivo es para quien va a programar.

## Qué hay en cada carpeta

| Carpeta o archivo | Para qué sirve |
|---|---|
| `app/` | La plataforma: `index.html`, estilos y la lógica en `js/`. No usa librerías |
| `app/data/` | Los datos que lee la página. `data.js` y `tests.csv` los genera un script; `content.js` y `content.es.js` son los textos en inglés y en español |
| `api/ask.js` | La única función de servidor: responde preguntas con IA a partir de los datos del sitio |
| `data/` | Los datos limpios: `pruebas.csv` (una fila por prueba), `investigaciones.csv`, `clasificacion.csv` y otros. `data/README.md` dice de dónde salió cada columna |
| `scripts/` | Los scripts que bajan, limpian y verifican los datos |
| `equipo/avance.html` | La página de avance para el equipo |
| `aportes/` | Una carpeta por persona para subir hallazgos, documentos y notas |
| `FUENTES.md` | Todo lo que se consultó, con enlace y fecha |
| `BITACORA.md` | Qué se hizo cada día y dónde quedó |
| `INVESTIGACION.md` | La investigación: hallazgos, huecos, calidad de los datos y lo que no está verificado |

## Verla en tu computadora

No hace falta instalar nada. Abre `app/index.html` en el navegador, o sírvela así:

```bash
python -m http.server 8770 --directory app
```

y entra a `http://localhost:8770`. La caja de preguntas en vivo solo funciona en el sitio publicado; en
local se usan las respuestas guardadas.

## Cómo trabajar juntos

- En tu carpeta de `aportes/`, en `BITACORA.md` y en `FUENTES.md` puedes subir directo.
- En el código (`app/`, `api/`, `scripts/`) y en `data/` nadie sube directo a `main`: cada cambio va en una
  rama corta y entra por un pull request que revisa otra persona.
- Al fusionar se usa **merge commit**, no squash ni rebase, para poder volver a un commit concreto.
- Un archivo, un dueño a la vez: avisa en el grupo qué archivo vas a tocar.
- Quien no quiera usar la terminal puede editar los archivos de texto (`.md`) desde la página de GitHub.

## Dónde documentar

- **Textos de la plataforma:** `app/data/content.js` (inglés) y `app/data/content.es.js` (español). Cada
  afirmación tiene que salir de `INVESTIGACION.md`.
- **La investigación:** `INVESTIGACION.md`. Lo que es dato va separado de lo que es interpretación.
- **Hallazgos y documentos de cada quien:** su carpeta en `aportes/`.
- **Fuentes nuevas:** `FUENTES.md`. **Avances:** `BITACORA.md`.
- **Presentación y guion:** creen una carpeta `presentacion/` para eso.

## Reglas que no se rompen

- **Nada inventado.** Cada cifra sale de `data/` y se puede rastrear a un PSI-ID. Si algo no está verificado,
  se dice.
- **Nunca subir claves.** El archivo `.env` no va al repositorio; `.env.example` muestra qué variables hay,
  sin valores.
- **Los datos crudos de PSI (1.5 GB) no van al repositorio.** Se vuelven a bajar con
  `python scripts/descargar_psi.py` y `python scripts/descargar_documentos.py`.

## Si cambias los datos

```bash
python scripts/construir_datos_app.py
```

```bash
python scripts/verificar_cifras.py
```

El primero vuelve a generar `app/data/data.js` y `app/data/tests.csv`. El segundo comprueba que 18 cifras
clave de `INVESTIGACION.md` sigan saliendo de los datos.

## Publicar

El sitio se publica a mano desde la cuenta de Vercel del equipo; subir cambios a GitHub no lo actualiza
solo.

## Créditos y aviso

Datos: NASA Physical Sciences Informatics (PSI) Data Repository, descargados el 13 de noviembre de 2026.
Los resúmenes de la plataforma se escribieron con IA a partir de las fichas de PSI. Es un proyecto
estudiantil, sin relación oficial con NASA ni respaldo suyo.
