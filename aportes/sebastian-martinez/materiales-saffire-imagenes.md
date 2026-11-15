# Materiales, Saffire e imágenes: datos fuera de PSI

Proyecto: Flame in Freefall · NASA Space Apps Challenge 2026

Este documento complementa la tabla de materiales de PSI del MVP. Reúne qué datos existen fuera de PSI (sobre todo en la serie Saffire), dónde buscar lo que falta y de dónde obtener imágenes de cada material.

> Los puntos marcados **(verificar)** no se confirmaron del todo. Todo número que no venga de PSI debe mostrarse con la etiqueta **"Fuera de PSI"**, su referencia y, si aplica, el aviso de "resultados preliminares".

---

## 1. Hallazgo principal: acotar el titular a PSI

La frase "los sólidos nunca se probaron con aire de base lunar" es correcta **solo en PSI**. La serie Saffire (NASA Glenn) ya quemó materiales en órbita con condiciones de exploración.

- **ES (si Saffire IV–VI no están en PSI):** *En PSI, ningún sólido se probó con más de 22.7% de oxígeno en microgravedad. Saffire VI de NASA, fuera de PSI, quemó SIBAL y PMMA con 30-31%.*
- **EN:** *In PSI, no solid was tested above 22.7% oxygen in microgravity. NASA's Saffire VI (outside PSI) burned SIBAL and PMMA at 30-31% oxygen.*
- Cambiar "No data" por **"PSI no tiene datos"** en toda la tabla.
- Pendiente: buscar "Saffire IV", "V" y "VI" en PSI. Un resumen de 2017 indica que los datos de Saffire se publicarían en PSI: https://ntrs.nasa.gov/api/citations/20170002628/downloads/20170002628.pdf

## 2. Qué es Saffire

Spacecraft Fire Safety Demonstration (Saffire): experimentos de fuego a bordo de la nave de carga Cygnus, después de que sale de la ISS y antes de que reingrese. Se encienden de forma remota para no poner en riesgo a la tripulación.

| Experimento | Objetivo | Material | Notas |
|---|---|---|---|
| Saffire-I (marzo 2016) | Propagación de llama a gran escala | SIBAL, 40.6 × 94 cm | Quemó unos 400 s |
| Saffire-II (2016) | Límites de inflamabilidad con O₂ | 9 muestras de 5 × 29 cm: silicona, SIBAL, Nomex (con ignición de PMMA), PMMA plano y estructurado | O₂ cercano a 22% |
| Saffire-III (abril 2017) | Igual que Saffire-I, otro flujo | SIBAL | Quemó unos 320 s |
| Saffire-IV (2020) | Fuego grande en atmósferas de exploración | SIBAL | Más sensores y cuatro cámaras |
| Saffire-V (2021) | Idem | Jersey de algodón | |
| Saffire-VI (dic. 2023) | Combustibles gruesos, quemas largas, atmósferas de exploración | SIBAL, PMMA de 1 y 2 caras | Último de la serie |

- **SIBAL:** tela de 75% algodón y 25% fibra de vidrio (en masa).
- **PMMA:** el acrílico de las ventanas de las naves.
- Instrumentos de la serie: sensores de O₂, CO₂, concentración y diámetro de humo, y temperaturas. Saffire VI añade diagnósticos de campo lejano (filtro "smoke eater", monitor de productos de combustión y monitores de partículas, con detector de ionización).

## 3. Saffire IV a VI: condiciones y resultados preliminares

Fuente: presentación ICES 2024, NASA Glenn. Microgravedad a bordo de Cygnus.

| Prueba | Material | O₂ | Presión | Duración de quema |
|---|---|---|---|---|
| IV-1 | SIBAL | 22.0 % | 100 kPa | 130 s |
| V-2 | Jersey de algodón | 26.2 % | 70.7 kPa | 200 s |
| VI-2 | SIBAL | 31.0 % | 54.1 kPa (~7.8 psi) | 112 s |
| VI-3 | PMMA, 2 caras (1 cm) | 30.3 % | 54.6 kPa (~7.9 psi) | 780 s |
| VI-4 | PMMA, 1 cara (0.5 cm) | 28.8 % | 55.2 kPa (~8.0 psi) | 1200 s |

Productos de combustión (aumento sobre el ambiente de la nave):

| Prueba | CO₂ (ppm) | CO₂ (mmHg) | CO (ppm) |
|---|---|---|---|
| IV-1 SIBAL | 1,390 | 1.03 | 80 |
| V-2 Jersey | 2,360 | 1.26 | 83 |
| VI-2 SIBAL | 2,800 | 1.15 | 120 |
| VI-3 PMMA 2 caras | 8,539 | 3.51 | 308 |
| VI-4 PMMA 1 cara | 8,117 | 3.37 | 320 |

Límites de referencia que cita la presentación: CO₂ de 3 mmHg a 1 hora, CO de 425 ppm a 1 hora y de 100 ppm a 24 horas.

Conclusiones de la presentación (preliminares):
- Fuegos de 1.5 a 3.2 kW en volúmenes libres de 17 a 19 m³.
- La temperatura solo subió de forma importante cerca del fuego.
- En las pruebas de PMMA, el CO superó el límite de 24 horas y el CO₂ superó el límite de 1 hora.
- El humo se detectó con claridad a los 981 s, cuando ya había ocurrido la mayor parte de la liberación de gases peligrosos.
- El mayor peligro para las personas es el humo y los gases, más que el calor.

Aclaraciones:
- La prueba VI-3 (PMMA) incluye mediciones de un detector de ionización y de material particulado. Las cifras están en gráficas que no pude leer como texto, y no vi tamaños de partícula.
- El resumen de Saffire VI menciona una muestra de Nomex de 7 cm, pero no aparece en la matriz de pruebas ejecutadas de la presentación **(verificar)**.
- Las columnas de calor liberado de esa tabla salían desordenadas en el texto. Usar solo las cifras de arriba o abrir el PDF.

## 4. Celdas vacías de PSI y dónde buscar

| Material | Falta en PSI | Fuente NASA fuera de PSI | Lo que confirmé |
|---|---|---|---|
| PMMA | Humo | Saffire VI | Mediciones de detector de ionización y partículas en VI-3. Sin cifras leídas. |
| SIBAL | Humo | Saffire IV y VI | Sensores de concentración y diámetro de humo. Sin cifras leídas. |
| Nomex | Humo | Saffire VI | Muestra mencionada en el resumen. Sin datos de humo. |
| Cera, Ultem | Humo | — | No encontré nada. |
| Kapton, Teflon, Lampwick, Pyrell | Quemado y oxígeno | MAPTIS y NASA-STD-6001 (gravedad normal) | Sé dónde está la información, pero no encontré cifras de esos cuatro. |

Pistas para Kapton, Teflon, Lampwick y Pyrell:
- NASA-STD-6001 indica que los datos de prueba se compilan en MAPTIS: https://ntrs.nasa.gov/citations/19990036744
- Boletines NESC con enlaces a reportes de MAPTIS (Test 1 a 8.2 psia): https://www.nasa.gov/centers-and-facilities/nesc/tb-26-04-webbings-for-use-in-elevated-oxygen-environments/
- Un plan de NASA de 2003 incluía aislamientos de Teflon, poliimida, silicona y PVC con muestreo de gases y partículas (era un plan, no resultados): https://ntrs.nasa.gov/api/citations/20040053602/downloads/20040053602.pdf

Cuidado: **Test 1 de NASA-STD-6001 es llama ascendente en gravedad normal.** No es comparable con las pruebas de microgravedad de PSI. Mostrar en columnas separadas.

Acceso: el hackatón da acceso a los datos abiertos de NASA, no a todo lo que NASA ha recolectado. No verifiqué si MAPTIS es público por completo.

## 5. Imágenes por material

| Material | Qué hay | Dónde |
|---|---|---|
| **SIBAL** | Saffire IV: tela ardiendo con puntos brillantes de carbón incandescente. Saffire-I: imágenes con destellos LED verdes para ver el humo, y foto del hardware. | https://nasa.gov/feature/glenn/2020/the-flame-of-discovery-grows-as-saffire-sets-new-fires-in-space · https://www.nasa.gov/feature/nasa-ignites-fire-experiment-aboard-space-cargo-ship/ |
| **PMMA** | Ficha de Saffire (descripción del acrílico). Diapositivas de Saffire VI con las muestras de 1 y 2 caras. Diapositivas de Saffire V con PMMA estructurado. | https://www.nasa.gov/wp-content/uploads/2025/07/spacecraft-fire-safety-demonstration-saffire.pdf · https://ntrs.nasa.gov/api/citations/20240007488/downloads/Saffire%20ICES%202024%20Saffire%20presentation072124small.pdf · https://ntrs.nasa.gov/api/citations/20210017780/downloads/Saffire%20ICES%202021%20Saffire%20Final%20presentation%20compressed.pdf |
| **Nomex** | Diagrama de la tarjeta de 9 muestras de Saffire-II (muestra 7: Nomex con ignición de PMMA). | https://ntrs.nasa.gov/api/citations/20180005168/downloads/20180005168.pdf · https://ntrs.nasa.gov/api/citations/20160010292/downloads/20160010292.pdf |
| **Silicona** | Mismo diagrama de Saffire-II (muestras 1 a 4). | Los dos PDF anteriores |
| **Cera** | Explicación de la llama de vela esférica en microgravedad. Imágenes de BASS en el glovebox. No verifiqué si SVS trae una foto de vela. | https://svs.gsfc.nasa.gov/31394 · https://blogs.nasa.gov/ISS_Science_Blog/?p=327 |
| **Kapton, Teflon, Lampwick, Pyrell** | No encontré fotos oficiales de esas muestras. | Carpetas "Reports" y "Representative Image(s)" de SAME y SAME-R en PSI: https://psi.nasa.gov/physci/repo/search?q=combustion |
| **Ultem** | No encontré fotos oficiales. | Carpetas de BASS y BASS-II en PSI. Si no hay, usar íconos propios. |

Imágenes generales de flamas y hardware:
- SVS 31394, "NASA Studies Fire in Microgravity" (SoFIE, tela delgada ardiendo, hasta 3840×2160): https://svs.gsfc.nasa.gov/31394/
- Llama esférica con hollín (Flame Design, CIR): https://www.nasa.gov/image-article/studying-flames-microgravity/
- Cool Flames (CFI-G) y foto dentro del CIR: https://www.nasa.gov/mission_pages/station/research/news/Cool_Flames_First_for_ISS
- Inserto ACME del CIR: https://science.nasa.gov/image-detail/amf-grc-2016-c-05051/
- Comparación de llama de Saffire-I con una de BASS: ver el resumen de Saffire de 2017 (enlace en la sección 1).

Cómo obtenerlas:
1. Páginas de NASA: descargar desde la propia página y copiar el crédito ("Credits: NASA").
2. PDF de NTRS: extraer figuras con `pdfimages -png archivo.pdf salida/` o con capturas. **Revisar el crédito de cada figura**, porque algunas son de terceros (universidades o socios).
3. Biblioteca de imágenes de NASA: https://images.nasa.gov, con términos como "Saffire", "Spacecraft Fire Experiment" o "Combustion Integrated Rack" **(verificar; no la abrí)**.
4. Sin imagen oficial: ilustración propia sencilla (SVG o ícono). Cuenta como trabajo original.
5. Pautas de uso: https://www.nasa.gov/nasa-brand-center/images-and-media/ (sin sugerir respaldo de NASA ni usar su logo).

## 6. Textos sugeridos para el MVP

Celda de humo del PMMA:
- **EN:** *PSI has no smoke data for PMMA. NASA's Saffire VI experiment, outside PSI, measured smoke from burning PMMA (ICES 2024).*
- **ES:** *PSI no tiene datos de humo del PMMA. El experimento Saffire VI de NASA, fuera de PSI, midió el humo del PMMA (ICES 2024).*

Etiqueta para cualquier cifra ajena a PSI:
- **EN:** *Outside PSI · Preliminary · Source: [reference]*
- **ES:** *Fuera de PSI · Preliminar · Fuente: [referencia]*

## 7. Referencias

1. Urban et al., *Preliminary Results from the Saffire VI Experiment*, ICES 2024 (NASA Glenn). Presentación: https://ntrs.nasa.gov/api/citations/20240007488/downloads/Saffire%20ICES%202024%20Saffire%20presentation072124small.pdf · Resumen: https://ntrs.nasa.gov/citations/20240002981
2. *Fire Safety Implications of Preliminary Results from Saffire IV and V*, ICES 2021: https://ntrs.nasa.gov/api/citations/20210017780/downloads/Saffire%20ICES%202021%20Saffire%20Final%20presentation%20compressed.pdf
3. Resumen de Saffire I-III y plan de IV-VI (2017): https://ntrs.nasa.gov/api/citations/20170002628/downloads/20170002628.pdf
4. Saffire-I, II y III, resultados y muestras (2018): https://ntrs.nasa.gov/api/citations/20180005168/downloads/20180005168.pdf
5. Saffire-II, selección de muestras (2016): https://ntrs.nasa.gov/api/citations/20160010292/downloads/20160010292.pdf
6. Ficha del proyecto Saffire: https://www.nasa.gov/wp-content/uploads/2025/07/spacecraft-fire-safety-demonstration-saffire.pdf
7. Artículo de NASA sobre Saffire IV: https://nasa.gov/feature/glenn/2020/the-flame-of-discovery-grows-as-saffire-sets-new-fires-in-space
8. Artículo de NASA sobre Saffire-I: https://www.nasa.gov/feature/nasa-ignites-fire-experiment-aboard-space-cargo-ship/
9. NASA-STD-6001 en NTRS: https://ntrs.nasa.gov/citations/19990036744
10. NTRS OpenAPI: https://ntrs.nasa.gov/api/openapi/

Listar todo recurso externo en el campo de referencias de la entrega.

## 8. Pendientes

- [ ] Buscar Saffire IV, V y VI en PSI y fijar el titular definitivo.
- [ ] Leer los artículos de Saffire IV y V en NTRS para buscar cifras de humo.
- [ ] Aclarar la nota de Pyrell del MVP (149 nm frente a 301 nm en la tabla, y silicona de 361 nm).
- [ ] Revisar el crédito de cada imagen extraída de NTRS.
- [ ] Confirmar si el resumen de Saffire VI incluye Nomex en las pruebas ejecutadas.
