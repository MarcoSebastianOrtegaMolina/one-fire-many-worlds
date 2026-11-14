# Reto: Flame in Freefall

**Título oficial:** Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data
**Evento:** 2026 NASA Space Apps Challenge
**Dificultad:** Avanzado, Intermedio
**Tema:** Exploración espacial
**Página oficial:** https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/

> Este archivo es un resumen fiel en español del enunciado oficial y de su pestaña de
> recursos, organizado para trabajar. La redacción exacta, en inglés, está al final, en
> "Texto original", copiada de la página oficial el 13 de noviembre de 2026.

---

## El reto en una frase

Construir un dashboard web interactivo, impulsado por superinteligencia (SI), que resuma,
ordene e interprete las investigaciones de combustión en microgravedad de NASA para dar
conclusiones de seguridad contra incendios en la exploración espacial tripulada.

---

## Contexto

**Por qué importa**

- NASA lleva décadas estudiando flamas en microgravedad y acumuló muchos datos. Ahora que
  se vuelve a la Luna y se apunta a Marte, ese conocimiento importa más, pero el volumen
  hace difícil encontrarlo, compararlo y entenderlo.
- Casos que el enunciado cita: una alarma de humo durante Artemis II, a unas 80,000
  millas de la Tierra; la explosión de un tanque de oxígeno en Apollo 13; el incendio en
  la estación Mir por la falla de un generador de oxígeno; y el incendio de Apollo 1 en
  1967, en una prueba previa al lanzamiento con la cabina llena de oxígeno, donde murió
  la tripulación.

**Cómo se comporta el fuego**

- En caída libre no hay flotación, así que los gases calientes no suben. Una vela deja de
  tener forma de gota y se vuelve una esfera azul que recibe su oxígeno solo por difusión.

**Los tres frentes de la seguridad contra incendios de NASA**

| Frente | En qué consiste | Investigaciones nombradas |
|---|---|---|
| Prevención | Controlar las fuentes de ignición y elegir bien los materiales, lo que exige conocer los límites de inflamabilidad | BASS, BASS-II, Saffire-I, Saffire-II, Saffire-III (sólidos como telas y plásticos) |
| Detección | Detectar el humo en microgravedad | SAME, SAME-R |
| Supresión | Apagar la flama diluyendo la atmósfera de la cámara con dióxido de carbono y helio | FLEX |

- La inflamabilidad depende mucho de la concentración de oxígeno, y en microgravedad el
  flujo de aire también importa.
- Para facilitar el uso de trajes, se espera que la base lunar y los rovers presurizados
  tengan más oxígeno y menos presión que la Tierra.

---

## Objetivos

**El problema:** los resultados de los experimentos de combustión en baja gravedad
(por ejemplo, los de la Estación Espacial) se están publicando en la base de datos PSI
(Physical Science Informatics) de NASA, pero la cantidad abruma: cuesta encontrarlos,
más compararlos y más todavía interpretarlos.

**Lo que hay que construir:** un dashboard web con SI que resuma, ordene e interprete las
investigaciones de ciencia de la combustión para dar bases sólidas de seguridad contra
incendios.

**Funciones sugeridas para el usuario (opcionales):**

1. Identificar las investigaciones más relevantes para la seguridad contra incendios en
   ambientes habitados: naves, estaciones espaciales, bases en la superficie de la Luna y
   de Marte, y rovers presurizados.
2. Extraer datos que sirvan para modelos predictivos de inflamabilidad y de escenarios de
   incendio en la exploración espacial.
3. Resaltar la investigación que ayuda a desarrollar la próxima generación de controles y
   equipos de seguridad contra incendios.

**Extra posible:** aplicaciones de los datos de PSI a la seguridad contra incendios en la
Tierra. El enunciado menciona los extintores de niebla fina de agua desarrollados para la
Estación Espacial, y mejoras en detectores de humo y en equipo de bomberos (ropa de
protección y tanques de aire).

**Fuera de alcance:** la seguridad contra incendios de cohetes y propelentes. Por las
altas velocidades dentro de un motor cohete, esa combustión es prácticamente
independiente de la gravedad, y PSI en general no la cubre.

---

## Consideraciones (opcionales)

**Público objetivo:** profesores, estudiantes de posgrado y de licenciatura,
investigadores aeroespaciales e ingenieros aeroespaciales.

**Atributos que conviene resumir y mostrar:**

- Objetivos del experimento.
- Combustibles, con la forma y el tamaño de las muestras o de los quemadores.
- Otras condiciones de prueba, como concentración de oxígeno y velocidad del flujo de aire.
- Variables: en qué se diferenciaron y en qué coincidieron las pruebas de una misma
  investigación.
- Sensores o tipos de medición.

**Comparación:** pensar cómo resumir y mostrar los parecidos y las diferencias entre
investigaciones distintas.

**Otras investigaciones en PSI**

- Uno de los instrumentos de detección de humo de SAME y SAME-R se usó para detectar
  polvo en DAFT y DAFT-2 (Dust and Aerosol Measurement Feasibility Test).
- BRE (Burning Rate Emulator), del proyecto ACME, quemó combustibles gaseosos, pero fue
  un estudio de inflamabilidad de materiales en atmósferas en reposo, en función de las
  propiedades del material.
- Las demás investigaciones de combustión de PSI que el enunciado no nombra siguen siendo
  relevantes para la seguridad, solo que de forma menos directa.

**Equipo (hardware)**

| Grupo | Combustible | Equipo |
|---|---|---|
| Los seis experimentos de ACME | Gaseoso | Hardware modular de ACME, en el Combustion Integrated Rack (CIR) |
| FLEX, FLEX-2, CFI (Cool Flames Investigation) | Gotas de combustible líquido | Multi-user Droplet Combustion Apparatus (MDCA), en el CIR |
| BASS, BASS-II, SPICE, SLICE | Sólido y gaseoso, entre los cuatro | Microgravity Science Glovebox (MSG), con el ducto de flujo modular con ventilador construido para SPICE |

SPICE es Smoke Point In Co-flow Experiment; SLICE es Structure & Liftoff In Combustion
Experiment.

**Trajes espaciales y concentración de oxígeno**

| Ambiente | Oxígeno | Presión |
|---|---|---|
| Traje espacial | 100% | 4.3 psi |
| Tierra a nivel del mar | (aire normal) | 14.7 psi |
| Base lunar y rovers presurizados (esperado) | 30% o más | 10.2 psi o menos |

- Antes de salir, los astronautas respiran 100% de oxígeno para expulsar el nitrógeno
  absorbido y evitar la enfermedad por descompresión.
- Para acortar ese tiempo y facilitar las salidas en la Luna, la base y los rovers
  tendrían una presión y un oxígeno intermedios entre el traje y la atmósfera terrestre.
- Frente a la Tierra, eso es un aumento de más de 40% en la concentración de oxígeno, lo
  que vuelve los materiales mucho más inflamables.
- Las pruebas en microgravedad con más oxígeno se hicieron en CFI-G (Cool Flames
  Investigation with Gases), de ACME: la cámara se llenaba con nitrógeno y un gas
  inflamable (por ejemplo, propano), y del quemador esférico salía una mezcla de oxígeno
  y nitrógeno de hasta 85% de oxígeno, creando una flama "al revés".

**Datos de gravedad parcial**

- Hoy no hay datos de combustión en gravedad parcial en PSI. Se espera que lleguen en el
  futuro, por ejemplo de LUCI (Lunar-g Combustion Investigation) y de FM2 (Flammability
  of Materials on the Moon).
- E-FIELD Flames (Electric-Field Effects on Laminar Diffusion Flames), de ACME, imitó la
  gravedad parcial mediante el efecto de un campo eléctrico sobre los iones que hay
  naturalmente en las flamas.
- Los resultados de microgravedad y de gravedad normal podrían acotar lo que ocurre en
  niveles intermedios.

**Aviso del enunciado:** pueden agregarse más recursos antes de que empiece el hackathon.
Conviene volver a revisar la pestaña de recursos el sábado.

---

## Recursos oficiales

Aviso de NASA: no respalda a entidades ajenas al gobierno de EE. UU. ni responde por el
contenido de sus sitios; en esos sitios hay que respetar sus condiciones de uso de datos.

| Recurso | Link | Para qué sirve |
|---|---|---|
| PSI Data Repository: Combustion Science | https://psi.nasa.gov/physci/repo/search?q=combustion | **La fuente de datos en la que debe basarse el proyecto** |
| NASA Combustion Science | https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/ | Información básica de la mayoría de las investigaciones de combustión que están en PSI |
| NASA ScienceCasts: The Power of Studying Combustion on the ISS | https://www.youtube.com/watch?v=W1oXykoz9zg | Video introductorio de 3.6 minutos (2018) |
| A Researcher's Guide to International Space Station Combustion Science | https://www.nasa.gov/missions/station/a-researchers-guide-to-combustion-science/ | Revisión de 2015, de más de 50 páginas, de la investigación de combustión hecha o planeada en la Estación Espacial |
| Apollo 1 | https://sma.nasa.gov/sma-disciplines/accllp/apollo-1 | Tripulación, incendio en la prueba previa al lanzamiento, investigación y lecciones |
| Apollo 13 | https://sma.nasa.gov/sma-disciplines/accllp/apollo-13 | Tripulación, misión, explosión del tanque de oxígeno, investigación y lecciones |
| 25 Years Ago: Fire Aboard Space Station Mir | https://www.nasa.gov/history/25-years-ago-fire-aboard-space-station-mir/ | El incendio de 1997 en Mir, causado por la falla de un generador de oxígeno |
| Fireman's Air Tanks | https://spinoff.nasa.gov/node/9582 | Adaptación en los años 70 de tecnología de trajes espaciales a tanques de aire de bomberos |
| Fire Detector | https://spinoff.nasa.gov/node/9407 | Detector de humo de los años 70 para el transbordador, que distingue humo de polvo; tiene usos industriales, como minería |
| New Technology for the Fire Attire | https://spinoff.nasa.gov/node/9918 | Aplicación en los años 80 de tecnología de trajes espaciales a la ropa de bomberos |

---

## Lista de investigaciones que nombra el enunciado

| Acrónimo | Nombre | Frente o tema |
|---|---|---|
| BASS, BASS-II | Burning and Suppression of Solids | Inflamabilidad de sólidos |
| Saffire-I, -II, -III | Spacecraft Fire Safety Demonstration | Inflamabilidad de sólidos |
| SAME, SAME-R | Smoke and Aerosol Measurement Experiment | Detección de humo |
| DAFT, DAFT-2 | Dust and Aerosol Measurement Feasibility Test | Detección de polvo, con un instrumento de SAME |
| FLEX, FLEX-2 | Flame Extinguishment Experiment | Supresión; gotas de líquido |
| CFI | Cool Flames Investigation | Gotas de líquido |
| SPICE | Smoke Point In Co-flow Experiment | Sólidos y gases, en el MSG |
| SLICE | Structure & Liftoff In Combustion Experiment | Sólidos y gases, en el MSG |
| ACME | Advanced Combustion via Microgravity Experiments | Seis experimentos con gases |
| ACME BRE | Burning Rate Emulator | Inflamabilidad de materiales en atmósfera en reposo |
| ACME CFI-G | Cool Flames Investigation with Gases | Pruebas con el oxígeno más alto (hasta 85%) |
| ACME E-FIELD Flames | Electric-Field Effects on Laminar Diffusion Flames | Imita la gravedad parcial |
| LUCI | Lunar-g Combustion Investigation | Futuro; todavía sin datos en PSI |
| FM2 | Flammability of Materials on the Moon | Futuro; todavía sin datos en PSI |

---

## Texto original

Copiado de la página oficial el 13 de noviembre de 2026 (la página no muestra fecha de publicación). Se
quitaron los menús y el pie del sitio; el resto está sin cambios.

### Pestaña Details

**Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data**

Event: 2026 NASA Space Apps Challenge
Difficulty: Advanced, Intermediate
Subjects: Space Exploration

For decades, NASA has studied how flames and fire behave in microgravity, gathering a trove of experimental data along the way. That knowledge matters more than ever as humans gear up to return to the Moon and press on to Mars, yet the volume of results makes them hard to find, compare, and understand. Your challenge is to create an interactive, super intelligence (SI) powered dashboard that summarizes, ranks, and interprets those findings to deliver fire safety insights for human space exploration.

#### Background

Fire hazards are extremely dangerous in space exploration! In describing a smoke alarm that went off during the recent Artemis II mission, the commander commented, “[If] you want to get somebody’s attention really quick, make the fire alarm go off in your spacecraft when you’re still about 80,000 miles from home.” Decades earlier, the Apollo 13 crew endured the life-threatening results of an oxygen tank explosion on their way to the Moon. Similarly, a multinational crew survived a fire aboard the Mir space station caused by an oxygen generator failure. In 1967, the Apollo 1 crew died in a pre-launch test when fire erupted in their oxygen-filled spacecraft.

Compared to Earth, flames in free fall (i.e., in microgravity) are often dramatically different because of the absence of buoyancy and thus rising hot gases. Instead of a flickering teardrop, a candle flame becomes a ghostly blue sphere reliant on diffusion for its oxygen.

NASA’s spacecraft fire safety work is focused on prevention, detection, and suppression. Prevention is achieved by controlling ignition sources and through material selection, which depends on understanding flammability limits. To facilitate spacesuit use, an atmosphere with increased oxygen and reduced pressure compared to Earth’s is expected within the planned Moon Base and pressurized rovers. Flammability is highly dependent on oxygen concentration, and air flow is also important in microgravity. Flammability studies focus on solid materials such as fabrics and plastics, as studied in the Burning and Suppression of Solids (BASS and BASS-II) and Spacecraft Fire Safety Demonstration (Saffire-I, -II, and -III) investigations.

Fire detection was tested in microgravity through the Smoke and Aerosol Measurement Experiment studies (SAME and SAME-R). Suppression was studied in the Flame Extinguishment Experiment (FLEX) through dilution of the chamber atmosphere with carbon dioxide and helium, both of which suppress fire.

#### Objectives

Results from low-gravity combustion experiments, conducted for example on the International Space Station (ISS), are being made publicly available through NASA's Physical Science Informatics (PSI) database, but the amount of data can be overwhelming. It can be hard to find, harder to compare, and harder yet to interpret.

Your challenge is to build an SI-powered, web-based dashboard that summarizes, ranks, and interprets combustion science investigations to deliver critical foundational insights for fire safety. You may consider enabling users to:

* Identify investigations most relevant to the fire safety needs of habitable crew environments, including spacecraft, space stations, bases on the lunar and Martian surfaces, and pressurized rovers.*
* Extract data that supports predictive modeling of flammability and fire scenarios in space exploration.
* Highlight research that informs the development of next-generation fire safety controls and equipment.

In this challenge, you’ll help turn complex data into clear answers and make the next giant leap a safer one.

Your dashboard could also address potential applications of the PSI data to fire safety on Earth. Fine-water-mist extinguishers developed for use on the ISS have practical applications here on Earth, and NASA technology has similarly led to improvements in terrestrial smoke detection and firefighter gear, including protective clothing and air tanks.

*Fire safety involving rockets and propellants is generally beyond the scope of the research available in the PSI database. The high velocities within rocket engines render the combustion effectively independent of gravity — although a rocket’s launch is of course strongly dependent on gravity.

#### Potential Considerations

You may (but are not required to) consider the following:

* Your target audience can include professors, graduate students, undergraduate students, aerospace researchers, and aerospace engineers.
* Consider how you might summarize and display attributes such as:
   * Experimental objectives
   * Fuels, including shape and size of the samples or burners
   * Other test conditions, such as oxygen concentration and airflow speed
   * Variables: how did tests from the same investigation differ and how were they the same?
   * Sensors or types of measurements
* Consider how to summarize and display similarities and differences between different investigations.
* Other investigations in PSI
   * One of the instruments used for smoke detection in the SAME and SAME-R studies was instead used to detect dust in the Dust and Aerosol Measurement Feasibility Test (DAFT and DAFT-2) studies.
   * While it burned gaseous fuels, the Burning Rate Emulator (BRE) experiment of the Advanced Combustion via Microgravity Experiments (ACME) project was a study of materials flammability in still atmospheres as a function of material properties.
   * Other combustion investigations within the PSI database (but not explicitly referenced above) are still relevant to fire safety, just not as strongly or directly.
* Hardware
   * The six experiments in the ACME project featured flames of gaseous fuels and were all conducted with the same modular set of ACME hardware in the Combustion Integrated Rack (CIR).
   * FLEX, FLEX-2, and the Cool Flames Investigation (CFI) each featured burning droplets of liquid fuel and were conducted with the Multi-user Droplet Combustion Apparatus (MDCA) in the CIR.
   * BASS, BASS-II, the Smoke Point In Co-flow Experiment (SPICE), and the Structure & Liftoff In Combustion Experiment (SLICE) collectively featured both solid and gaseous fuels. Each of these investigations was conducted within the Microgravity Science Glovebox (MSG) using the modular fan-driven flow duct built for SPICE.
* Spacesuits and oxygen concentration
   * To enable flexibility, spacesuits are filled with 100% oxygen to only 4.3 psi (pounds per square inch), where the Earth’s pressure at sea level is 14.7 psi.
   * To avoid the bends (decompression sickness), the astronauts pre-breathe 100% oxygen to expel absorbed nitrogen.
   * To reduce the pre-breathing duration and thus facilitate lunar excursions, it is expected that the Moon Base and pressurized rover(s) will be at a pressure and oxygen concentration between those in a spacesuit and the Earth’s atmosphere.
   * The intermediate oxygen concentration used on the Moon will likely be 30% or greater, with a corresponding pressure of 10.2 psi or less. Compared to Earth’s atmosphere, that’s more than a 40% increase in the oxygen concentration making materials much more flammable.
   * Microgravity tests with the highest oxygen concentrations were conducted as part of the ACME’s Cool Flames Investigation with Gases (CFI-G). In those tests, the combustion chamber was filled with a mixture of nitrogen and a flammable gas (e.g., propane), while an oxygen-nitrogen mixture of up to 85% oxygen flowed from the spherical burner creating an inside-out flame.
* Partial-gravity data
   * Although NASA is heavily focused on the return of astronauts to the Moon’s surface and the establishment of a Moon Base in preparation for the future human exploration of Mars, there is currently no partial-gravity combustion data available in PSI. We expect such data will be added in the future, for example from the Lunar-g Combustion Investigation (LUCI) and the Flammability of Materials on the Moon (FM2) experiment.
   * Partial gravity was mimicked in ACME’s Electric-Field Effects on Laminar Diffusion Flames (E-FIELD Flames) experiment through the effect of the electric field on the ions that naturally occur in flames.
   * Microgravity and normal-gravity results could bound what occurs at intermediate gravity levels.

For data and resources related to this challenge, refer to the Resources tab at the top of the page. More resources may be added before the hackathon begins.

### Pestaña Resources

NASA does not endorse any non-U.S. Government entity and is not responsible for information contained on non-U.S. Government websites. For non-U.S. Government websites, participants must comply with any data use parameters of that specific website.

NASA DATA & RESOURCES

* PSI Data Repository: Combustion Science: Physical Sciences Informatics (PSI) source of the data upon which the NASA Space App is to be based.
* NASA Combustion Science: Basic information about most of the combustion investigations for which data is found in the PSI Data Repository.
* NASA ScienceCasts: The Power of Studying Combustion on the ISS: Introduction to NASA’s combustion research on the International Space Station through a 3.6-minute video clip from 2018.
* A Researcher’s Guide to International Space Station Combustion Science: A 2015 review of NASA’s combustion research conducted on, or planned for, the International Space Station. Basic information about most of the combustion investigations described in this 50+ page document is found within the PSI Data Repository.
* Apollo 1: Information about the crew mission, fire that erupted during a pre-launch test killing the crew, investigation, and lessons learned.
* Apollo 13: Information about the crew, mission, oxygen tank explosion that occurred during the flight to the Moon, investigation, and lessons learned.
* 25 Years Ago: Fire Aboard Space Station Mir: Basic information about a fire—caused by an oxygen generator failure—that erupted within the Russian space station Mir in 1997 during joint operations in preparation for the International Space Station (first occupied in 2000).
* Fireman’s Air Tanks: Basic information about the 1970s adaptation of spacesuit technology to improve firefighters’ air tanks and breathing gear.
* Fire Detector: Basic information about a 1970s smoke detector developed for the shuttle that, discriminating between smoke and dust, results in less nuisance alarms. As such, it has industrial applications (e.g., in mining operations).
* New Technology for the Fire Attire: Basic information about a 1980s application of NASA spacesuit technology to improve firefighter clothing.

Los enlaces de cada recurso están en la tabla «Recursos oficiales» de este archivo.
