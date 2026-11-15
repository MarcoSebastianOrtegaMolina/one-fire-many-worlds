"""Catalogo de figuras: recorta las figuras de los reportes de PSI con su pie.

Para cada pie de figura ("Figure N" al inicio de un bloque de texto) junta las imagenes y los dibujos que
quedan arriba de el, hasta el parrafo anterior, recorta esa zona con el pie y la guarda en app/figures/.
Escribe app/data/figures.js con el pie literal, el documento, la pagina y los enlaces a PSI.

Solo entran documentos de NASA (reportes y la guia de 2015); la tesis de BRE queda fuera.
Los PDF son archivos bajados: se leen como datos. Correr con:
    python -E -P scripts/construir_figuras.py            arma todo
    python -E -P scripts/construir_figuras.py --hoja     ademas guarda una hoja de contacto para revisar
"""
import csv
import json
import re
import sys
import urllib.parse
from pathlib import Path

import pymupdf

RAIZ = Path(__file__).resolve().parent.parent
DOCS = RAIZ / "data" / "raw" / "documentos"
SAL_IMG = RAIZ / "app" / "figures"
SAL_JS = RAIZ / "app" / "data" / "figures.js"

# clave, investigaciones, carpeta de PSI, categoria, archivo, titulo (en, es), tope de figuras
DOCUMENTOS = [
    ("bre", ["PSI-20"], "PSI-20", "Reports", "PSI-20_Reports_Final_20220201.pdf", "ACME BRE final report (2022)", "Reporte final de ACME BRE (2022)", 14),
    ("bass2", ["PSI-25", "PSI-26"], "PSI-25", "Reports", "PSI-25_Reports_BASS-II Summary Report.pdf", "BASS and BASS-II summary report, NASA/TM-20210011385", "Reporte resumen de BASS y BASS-II, NASA/TM-20210011385", 18),
    ("cfi", ["PSI-39"], "PSI-39", "Reports", "PSI-39_Reports_CFI Science Final Report.pdf", "CFI science final report", "Reporte final de ciencia de CFI", 8),
    ("same", ["PSI-102"], "PSI-102", "Reports", "PSI-102_Reports_SAME_Final Science Report.pdf", "SAME final science report", "Reporte final de ciencia de SAME", 12),
    ("samer", ["PSI-101"], "PSI-101", "Reports", "PSI-101_Reports_SAME-R_Final Report.pdf", "SAME-R final report", "Reporte final de SAME-R", 8),
    ("spice", ["PSI-107"], "PSI-107", "Reports", "PSI-107_Reports_SPICE_FinalReport.pdf", "SPICE final report", "Reporte final de SPICE", 8),
    ("efield", ["PSI-22"], "PSI-22", "Reports", "PSI-22_Reports_E-FIELD Flames Final Report.pdf", "E-FIELD Flames final report", "Reporte final de E-FIELD Flames", 8),
    ("guide", [], None, None, "researchers_guide_combustion_science_2015.pdf", "A Researcher's Guide to International Space Station Combustion Science (NASA, 2015)", "A Researcher's Guide to International Space Station Combustion Science (NASA, 2015)", 14),
    # Un documento de contexto fuera de PSI lleva un noveno dato: su ficha en NASA. El articulo de SAME-2 (ICES 2012,
    # aporte de Marina) no entra: sus figuras 6, 7 y 8 son las mismas 6, 7 y 8 del reporte de SAME-R, ya incluidas.
]
GUIA = "https://www.nasa.gov/missions/station/a-researchers-guide-to-combustion-science/"
SOLO = {}            # clave de documento: numeros de figura que entran (vacio: entran todas las elegidas)

# Contrato D-1426 con app/js/materials.js. El material sale del pie literal de la figura (nombres de D.materials);
# el origen, del pie: "ground" si habla de gravedad normal o de un tunel en tierra sin mencionar la microgravedad, y
# "microgravity" en lo demas (orbita, avion o torre de caida). Las figuras de la guia de 2015 son fotos de experimentos.
MATERIAL_EN_PIE = [
    (re.compile(r"PMMA|polymethylmethacrylate|polymethyl methacrylate|acrylic", re.I), "PMMA (acrylic)"),
    (re.compile(r"SIBAL|cotton-fiberglass|cotton/fiberglass|cotton fiberglass", re.I), "SIBAL (cotton-fiberglass fabric)"),
    (re.compile(r"Kapton", re.I), "Kapton"),
    (re.compile(r"Teflon|PTFE", re.I), "Teflon"),
    (re.compile(r"silicone", re.I), "Silicone"),
    (re.compile(r"Pyrell", re.I), "Pyrell"),
    (re.compile(r"Nomex", re.I), "Nomex"),
    (re.compile(r"lamp ?wick", re.I), "Lampwick"),
    (re.compile(r"\bwax\b|candle", re.I), "Wax"),
    (re.compile(r"Ultem", re.I), "Ultem"),
]
TIERRA = re.compile(r"normal.gravity|\b1-?g\b|\bground\b|downward flame spread|flame tunnel|upward flow|narrow channel", re.I)
MICRO = re.compile(r"microgravity|low.gravity|\b0-?g\b|zero.gravity|\bISS\b|space station|orbit|BASS|Saffire|flight|drop", re.I)


# Imagenes que trajo el equipo (aportes/), contrato D-1426: entran con team, credit y su propio recorte en puntos
# del PDF (x0, y0, x1, y1), medido a mano de la imagen hasta donde empieza el pie. Las laminas de Saffire 2017 traen
# la insignia de NASA arriba a la izquierda: los recortes la dejan fuera (guia de marca de NASA).
CTX = RAIZ / "data" / "raw" / "contexto"
MEYER = ("Meyer_NASA-TM-2015-218891_NTRS-20160000940.pdf", "https://ntrs.nasa.gov/citations/20160000940",
         {"en": "Smoke from overheated spacecraft materials, NASA/TM-2015-218891 (ground tests)",
          "es": "Humo de materiales de nave sobrecalentados, NASA/TM-2015-218891 (pruebas en tierra)"},
         "Marit E. Meyer, NASA Glenn Research Center, NASA/TM-2015-218891 (2015), NTRS 20160000940. Work of the US Government, public use permitted. Contributed by Sebastián Martínez.")
SAF17 = ("Saffire_ASGSR-2017_NTRS-20180005168.pdf", "https://ntrs.nasa.gov/citations/20180005168",
         {"en": "Saffire: A Novel Approach to Study of Spacecraft Fire Safety Using Un-manned Spacecraft, ASGSR 2017 (NTRS 20180005168)",
          "es": "Saffire: A Novel Approach to Study of Spacecraft Fire Safety Using Un-manned Spacecraft, ASGSR 2017 (NTRS 20180005168)"},
         "Urban, Ferkul, Olson, Ruff and Easton, NASA Glenn Research Center, ASGSR 2017 slides, NTRS 20180005168. Public use permitted. Contributed by Sebastián Martínez.")
TM1991 = ("NASA-TM-105317_Friedman_Sacksteder_Urban_1991.pdf", "https://ntrs.nasa.gov/citations/19920004363",
          {"en": "Risks, Designs, and Research for Fire Safety in Spacecraft, NASA TM-105317 (1991)",
           "es": "Risks, Designs, and Research for Fire Safety in Spacecraft, NASA TM-105317 (1991)"},
          "Friedman, Sacksteder and Urban, NASA Lewis Research Center, NASA TM-105317 (1991), NTRS 19920004363. Work of the US Government, public use permitted. Contributed by Marina.")
KC135 = ("KC-135_parcial_Sacksteder_2003_NTRS-20040053567.pdf", "https://ntrs.nasa.gov/citations/20040053567",
         {"en": "Sacksteder and others, Upward and Downward Flame Spreading and Extinction in Partial Gravity Environments, NASA/CP-2003-212376/REV1, pp. 141-144 (2003)",
          "es": "Sacksteder y otros, Upward and Downward Flame Spreading and Extinction in Partial Gravity Environments, NASA/CP-2003-212376/REV1, págs. 141-144 (2003)"},
         "Sacksteder, Feier, Ferkul, Kumar and T'ien, NASA Glenn Research Center, National Center for Microgravity Research and Case Western Reserve University, NASA/CP-2003-212376/REV1 (2003), NTRS 20040053567. Work of the US Government, public use permitted. Contributed by Victor.")
EQUIPO = [
    # D-1440: las dos figuras del articulo del KC-135 (gravedad parcial en avion), recorte = la imagen de cada una
    ("kc135-p2-fig1", KC135, 2, "1", (309.7, 402, 540.1, 634.6),
     "Figure 1. Upward and downward flame spread rates for 2 cm wide samples burned in 27.6 kPa (4.0 psia) air at various gravity levels. Upward pointing symbols indicate upward spread; downward pointing symbols, downward spread. Open symbols indicate results of numerical simulations of flame spread. The inset shows results for 1 cm wide samples.",
     [], [], "partial"),
    ("kc135-p3-fig2", KC135, 3, "2", (310.5, 72, 540.1, 304.6),
     "Figure 2. Flammability boundaries for upward and downward spreading flames over 2 cm wide samples. Open and closed symbols indicate flammable and non- flammable conditions respectively. Crosses indicate observed extinctions occurring well after ignition. Downward pointing symbols indicate downward spread, upward pointing indicates upward spread.",
     [], [], "partial"),
    ("tm1991-p21-fig9", TM1991, 21, "9", (165, 88, 450, 316),
     "Figure 9.—Conceptual schematic of carbon dioxide fire-suppression system for Freedom",
     [], [], "history"),
    ("tm1991-p21-fig10", TM1991, 21, "10", (145, 412, 462, 650),
     "Figure 10.—Representation of fire-response logic for the Space Station Freedom",
     [], [], "history"),
    # id, documento, pagina, numero, recorte, pie, investigaciones, materiales, origen
    ("meyer-p17-fig8", MEYER, 17, "8", (72, 332.6, 539, 436),
     "Figure 8.—High resolution SEM images of Teflon smoke particles at 540 °C collected onto a carbon film TEM grid. (a) 250 nm to 1.5 μm diam. range. (b) 500 nm and 700 nm diam. (c) 700 nm diam.",
     [], ["Teflon"], "ground"),
    ("meyer-p20-fig15", MEYER, 20, "15", (188.6, 345.2, 423.4, 569.6),
     "Figure 15.—Teflon smoke particles collected with the SAME thermal precipitator on the ISS, showing vastly different morphology compared to WSTF samples (TEM, Philips Model CM20).",
     ["PSI-102"], ["Teflon"], "microgravity"),
    ("meyer-p21-fig16", MEYER, 21, "16", (79.6, 489.2, 532.1, 646),
     "Figure 16.—SEM images of Kapton smoke particles on the Al SEM stub. (a) At 540 °C are compact and either spherical or angular. (b) At 640 °C exhibit chain-like agglomerate structures, some doublets and longer chains are coated.",
     [], ["Kapton"], "ground"),
    ("meyer-p24-fig21", MEYER, 24, "21", (183, 72, 429, 306.7),
     "Figure 21.—Aged Kapton smoke particles collected with the SAME thermal precipitator on the ISS showing similar morphology to WSTF samples (TEM, Philips Model CM20).",
     ["PSI-102"], ["Kapton"], "microgravity"),
    ("meyer-p25-fig22", MEYER, 25, "22", (188.3, 72, 423.4, 233.3),
     "Figure 22.—SEM image showing spherical Nomex smoke particles in the 300 to 600 nm range and a large irregular particle (on the right), possibly char.",
     [], ["Nomex"], "ground"),
    ("meyer-p29-fig28", MEYER, 29, "28", (80.2, 72, 532, 207.9),
     "Figure 28.—Nomex fuel tests. (a) Nomex snips before heating (0.5 g fuel sample). (b) After heating, the Nomex snips became one or two compact pieces of char/ash, as shown in the remains of five different tests. (c) TEOM filters after mass concentration measurements of Nomex smoke particles show the characteristic yellowish color of brown carbon.",
     [], ["Nomex"], "ground"),
    ("saffire17-p14", SAF17, 14, "slide 14", (747.8, 87.5, 892.4, 381.2),
     "Slide 14, Saffire Layout: the Saffire II sample layout, with silicone (1-4), SIBAL (5 & 6), Nomex with PMMA ignition (7) and PMMA, flat and structured (8 & 9).",
     ["PSI-99"], ["Silicone", "SIBAL (cotton-fiberglass fabric)", "Nomex", "PMMA (acrylic)"], "microgravity"),
    ("saffire17-p16", SAF17, 16, "slide 16", (13.8, 76, 413.9, 502.4),
     "Slide 16, Saffire-I and III Results: sequence of concurrent flame images from Saffire-I (20 cm/s) and Saffire-III (25 cm/s). Each image is 40 s apart; Saffire-I burned for 400 s and Saffire-III for 320 s.",
     ["PSI-98", "PSI-100"], ["SIBAL (cotton-fiberglass fabric)"], "microgravity"),
    ("saffire17-p24", SAF17, 24, "slide 24", (532, 66.7, 773.9, 488.5),
     "Slide 24, Fuel characteristics (SIBAL fabric): 75% cotton, 25% fiberglass blend; simple weave pattern (60 x 40 threads per inch); cotton and fiberglass fibers intermingled; overall area density 18 mg/cm2.",
     ["PSI-98", "PSI-99", "PSI-100"], ["SIBAL (cotton-fiberglass fabric)"], "ground"),
]


# Imagenes sueltas de paginas de NASA que enlazo el equipo, bajadas a data/raw/contexto/imagenes/ con el visto bueno
# de Marco Sebastian (D-1430). Se reducen a la mitad y se guardan en JPEG. El pie es el de la pagina de NASA.
IMAGENES = [
    # id, archivo, pagina de origen, documento, numero, pie, investigaciones, materiales, origen, credito
    ("saffire4-pmma", "master_image_saffire-upsized.jpg",
     "https://www.nasa.gov/humans-in-space/the-flame-of-discovery-grows-as-saffire-sets-new-fires-in-space/",
     {"en": "The Flame of Discovery Grows as Saffire Sets New Fires in Space, NASA, May 20, 2020",
      "es": "The Flame of Discovery Grows as Saffire Sets New Fires in Space, NASA, 20 de mayo de 2020"},
     "photo",
     "Saffire IV: this edge view of Saffire's flame shows it developing over a one-centimeter thick sample of a plexiglass type material found on spacecraft. The blue color is typical of microgravity flames and moves from left to right at 20 cm per second.",
     [], ["PMMA (acrylic)"], "microgravity",
     "NASA (credit on the NASA page of May 20, 2020). Link provided by Sebastián Martínez."),
    ("sofie-gel-pmma", "R134346C-opposed-flow-air-0.5mmPMMA-1080p.png",
     "https://svs.gsfc.nasa.gov/31394/",
     {"en": "NASA Studies Fire in Microgravity, NASA Scientific Visualization Studio 31394, May 6, 2026",
      "es": "NASA Studies Fire in Microgravity, NASA Scientific Visualization Studio 31394, 6 de mayo de 2026"},
     "photo",
     "This image is from the Solid Fuel Ignition and Extinction (SoFIE) Growth and Extinction Limits (GEL) experiment aboard the space station. The page does not name the material; NASA's file name says opposed flow, air and 0.5 mm PMMA.",
     [], ["PMMA (acrylic)"], "microgravity",
     "NASA (SVS 31394, credit: NASA). Link provided by Sebastián Martínez."),
]


# Recortes a mano de documentos de PSI para los materiales que no tenian figura (Pyrell y Ultem), pedidos por Marco
# Sebastian el 14-nov. Las micrografias de SAME-R no las detecta figuras_de (son fotos sin dibujo). Para Ultem no hay
# ninguna foto en PSI: lo unico que lo muestra es la matriz de pruebas de BASS; esa lamina esta girada en el PDF y
# entra completa (recorte None).
RECORTES_PSI = [
    # id, carpeta, categoria, archivo, titulo (en, es), pagina, numero, recorte, pie, investigaciones, materiales, origen
    ("samer-p7-fig11", "PSI-101", "Reports", "PSI-101_Reports_SAME-R_Final Report.pdf",
     ("SAME-R final report", "Reporte final de SAME-R"), 7, "11", (90, 543, 552, 678),
     "Figure 11: TEM images for Teflon (Run 56), Pyrell (Run 63), Lampwick (Run 54) and Kapton (Run 62).",
     ["PSI-101"], ["Teflon", "Pyrell", "Lampwick", "Kapton"], "microgravity"),
    ("samer-p8-fig12", "PSI-101", "Reports", "PSI-101_Reports_SAME-R_Final Report.pdf",
     ("SAME-R final report", "Reporte final de SAME-R"), 8, "12", (90, 140, 560, 276),
     "Figure 12: TEM images showing the effect of aging for Kapton (Run 62) and Pyrell (Run 63). From Left to right, unaged Kapton, aged Kapton, unaged Pyrell, aged Pyrell. The notable change is the elimination of the smallest particles.",
     ["PSI-101"], ["Kapton", "Pyrell"], "microgravity"),
    ("samer-p9-fig13", "PSI-101", "Reports", "PSI-101_Reports_SAME-R_Final Report.pdf",
     ("SAME-R final report", "Reporte final de SAME-R"), 9, "13", (76, 289, 546, 441),
     "Figure 13: TEM images showing the effect of flow for Pyrell and lampwick under 8 cm/s air flow and quiescent conditions.",
     ["PSI-101"], ["Pyrell", "Lampwick"], "microgravity"),
    ("bass-sar-p41", "PSI-26", "Engineering Documents", "PSI-26_Engineering Documents_BASS_SysAcceptanceReview.1.pdf",
     ("BASS system acceptance review", "Revisión de aceptación del sistema de BASS"), 41, "slide 41", None,
     "Slide 41, BASS Test Matrix: samples 16 and 17 are thin flat Ultem sheets, 2 cm wide, with 384 mg of fuel, planned at 30 and 50 cm/s. No photograph of the Ultem samples was found in PSI; in the as-run matrix one only smoked slightly without igniting and the other ignited briefly and went out after 4 seconds.",
     ["PSI-26"], ["Ultem"], "microgravity"),
]


# D-1440: a que mundos sirve cada figura. Por la clave del documento (inicio del id); lo que sale de pruebas en gravedad
# normal suma la Tierra. E-FIELD sugiere aproximar la gravedad parcial; BRE tiene flamas en aire de base lunar.
MUNDOS_FIG = {"bre": ["station", "moon"], "efield": ["station", "mars", "moon"], "guide": ["station", "earth"],
              "kc135": ["mars", "moon", "earth"], "tm1991": ["station"]}


def mundos_fig(fila):
    m = list(MUNDOS_FIG.get(fila["id"].split("-")[0], ["station"]))
    if fila.get("origin") == "ground" and "earth" not in m:
        m.append("earth")
    if fila.get("origin") == "ground" and fila["id"].startswith("meyer"):
        m = ["earth"]
    if "PSI-99" in fila.get("invs", []) and "earth" not in m:
        m.append("earth")
    assert m and all(x in ("station", "moon", "mars", "suit", "earth") for x in m), fila["id"]
    return m


def materiales_de(pie):
    return [nombre for patron, nombre in MATERIAL_EN_PIE if patron.search(pie)]


def origen_de(clave, pie):
    if TIERRA.search(pie) and not MICRO.search(pie):
        return "ground"
    return "microgravity"
# figuras que entran siempre, por su numero, y figuras cuyo pie sale ilegible (texto a dos columnas)
FORZAR = {"bass2": ["6.10", "6.9", "1.2", "2.20", "1.3"], "bre": ["15", "4"], "same": ["1", "11", "12"],
          "samer": ["6", "7", "8"], "guide": ["1", "8", "9", "11", "12", "13"]}
EXCLUIR = {("samer", "20"), ("samer", "21"), ("samer", "23"), ("bre", "2"), ("guide", "3")}
# paginas enteras fuera: figuras repetidas de otra pagina, graficas con rotulos encimados y fotos de camaras
EXCLUIR_PAG = {("same", 47), ("samer", 77), ("bre", 104), ("bre", 126), ("bre", 129), ("bre", 130), ("spice", 15),
               ("bre", 96), ("bre", 131), ("same", 56)}       # la misma figura ya entra por otra pagina (pp. 28, 31 y 27)
PIE = re.compile(r"^\s*(Figure|Fig\.)\s*(\d+(?:\.\d+)*)\s*[\.:\-—–]", re.I)
CLAVE = re.compile(r"flam|extinc|quench|blowoff|blow-off|smoke|detector|particle|oxygen|spread|ignit|burn|fire|droplet|soot|candle|microgravity|suppress", re.I)


def limpio(t):
    return re.sub(r"\s+", " ", t).strip()


def figuras_de(pdf):
    """Devuelve (pagina, numero, pie, clip) por cada figura con algo dibujado arriba de su pie."""
    out = []
    for n in range(len(pdf)):
        pag = pdf[n]
        ancho, alto = pag.rect.width, pag.rect.height
        bloques = [b for b in pag.get_text("blocks") if b[6] == 0 and b[4].strip()]
        graf = [pymupdf.Rect(i["bbox"]) for i in pag.get_image_info()]
        for d in pag.get_drawings():
            r = pymupdf.Rect(d["rect"])
            # fuera los adornos pegados a la orilla de la pagina (la guia trae un cuadro rojo en cada una)
            if r.width > 4 and r.height > 4 and r.width < ancho * 0.98 and r.x0 > 2 and r.x1 < ancho - 2:
                graf.append(r)
        for b in bloques:
            m = PIE.match(b[4])
            if not m:
                continue
            pie = pymupdf.Rect(b[:4])
            pie.y1 = min(pie.y1, pie.y0 + 46)      # solo las primeras lineas: el bloque a veces arrastra el parrafo siguiente
            # el pie como texto: completo aunque el PDF lo parta en un bloque por renglon, y solo el pie
            texto, ultimo = limpio(b[4]), pymupdf.Rect(b[:4])
            while not texto.endswith(".") and len(texto) < 320:
                sigue = [o for o in bloques if ultimo.y1 - 3 <= o[1] <= ultimo.y1 + 7 and o[0] < ultimo.x1 and o[2] > ultimo.x0 and not PIE.match(o[4])]
                if not sigue:
                    break
                o = min(sigue, key=lambda o: o[1])
                texto, ultimo = texto + " " + limpio(o[4]), pymupdf.Rect(o[:4])
            repite = re.search(r"\s(?:In\s+)?(?:Figure|Fig\.)\s*" + re.escape(m.group(2)) + r"\b", texto[12:])
            if repite:                              # el parrafo de abajo empieza citando la misma figura
                texto = texto[:12 + repite.start()]
                texto = re.sub(r"(?<=\))\s+[A-Z][^.]*$", "", texto)      # y la oracion que quedo empezada
            corte = texto.find(". ", 50)
            texto = texto[:corte + 1] if 0 < corte < 300 else texto[:300]
            # limite superior: el parrafo ancho mas cercano arriba del pie
            tope = 36
            for o in bloques:
                r = pymupdf.Rect(o[:4])
                if r.y1 <= pie.y0 - 2 and r.width > ancho * 0.55 and len(o[4]) > 180 and not PIE.match(o[4]):
                    tope = max(tope, r.y1)
                # ni el pie de otra figura que este arriba en la misma columna: cada figura sale sola
                if o is not b and PIE.match(o[4]) and r.y0 < pie.y0 - 2 and r.x0 < pie.x1 and r.x1 > pie.x0:
                    tope = max(tope, min(r.y1, r.y0 + 46))
            arriba = [g for g in graf if g.y1 <= pie.y0 + 8 and g.y0 >= tope - 4]
            if not arriba:
                continue
            zona = pymupdf.Rect(arriba[0])
            for g in arriba[1:]:
                zona |= g
            if zona.width < 110 or zona.height < 50:
                continue
            # el recorte llega hasta donde empieza el pie (asi entran los rotulos de los ejes) y no lo incluye:
            # el pie va como texto en la pagina, completo, y no cortado dentro de la imagen
            clip = pymupdf.Rect(min(zona.x0, pie.x0), zona.y0, max(zona.x1, pie.x1), pie.y0)
            orilla = 3 if ancho < 450 else 8          # en la guia el texto de la otra columna queda a 5 pt de la imagen
            clip += (-orilla, -orilla, orilla, 0)     # abajo termina justo donde empieza el pie: ni un renglon cortado
            clip &= pag.rect
            out.append((n + 1, m.group(2), texto, clip))
    return out


def main():
    hoja = "--hoja" in sys.argv
    inventario = {(r["id"], r["archivo"]): r for r in csv.DictReader(open(RAIZ / "data" / "raw" / "inventario_archivos.csv", encoding="utf-8-sig"))}
    SAL_IMG.mkdir(parents=True, exist_ok=True)
    for viejo in SAL_IMG.glob("*.jpg"):
        viejo.unlink()
    salida, miniaturas = [], []
    for doc in DOCUMENTOS:
        clave, invs, carpeta, cat, archivo, en, es, tope = doc[:8]
        enlace = doc[8] if len(doc) > 8 else GUIA
        ruta = (DOCS / carpeta / cat / archivo) if carpeta else (RAIZ / "data" / "raw" / "contexto" / archivo)
        pdf = pymupdf.open(ruta)
        todas = figuras_de(pdf)
        if clave in SOLO:
            todas = [f for f in todas if f[1] in SOLO[clave]]
        # una por pie distinto; fuera las de pie ilegible; solo las que hablan de fuego, humo o extincion
        vistos, utiles = set(), []
        for f in todas:
            huella = f[2][:60].lower()
            if huella in vistos or (clave, f[1]) in EXCLUIR or (clave, f[0]) in EXCLUIR_PAG or not CLAVE.search(f[2]):
                continue
            vistos.add(huella)
            utiles.append(f)
        forzadas = [f for f in utiles if f[1] in FORZAR.get(clave, [])]
        resto = [f for f in utiles if f not in forzadas]
        cupo = max(0, tope - len(forzadas))
        if len(resto) > cupo:               # repartidas a lo largo del documento, no solo las primeras
            paso = len(resto) / cupo if cupo else 0
            resto = [resto[int(k * paso)] for k in range(cupo)]
        elegidas = sorted(forzadas + resto, key=lambda f: f[0])
        for pag, num, pie, clip in elegidas:
            # la guia es de pagina chica: se saca a mas resolucion para que sus figuras no queden diminutas
            pix = pdf[pag - 1].get_pixmap(dpi=190 if pdf[pag - 1].rect.width < 450 else 125, clip=clip)
            if pix.width < 260 or pix.height < 140:
                continue
            fid = "%s-p%d-fig%s" % (clave, pag, num.replace(".", "-"))
            destino = SAL_IMG / (fid + ".jpg")
            destino.write_bytes(pix.tobytes("jpeg", jpg_quality=74))
            if carpeta:
                fila = inventario.get((carpeta, archivo))
                descarga = "https://psi.nasa.gov/geode-py/ws/studies/%s/download?file=%s&version=%s" % (carpeta, urllib.parse.quote(archivo), (fila or {}).get("version", "1"))
                registro = "https://psi.nasa.gov/physci/repo/data/investigations/" + carpeta
            else:
                descarga = registro = enlace
            fila = {"id": fid, "invs": invs, "doc": {"en": en, "es": es}, "page": pag, "number": num, "caption": pie,
                    "img": "figures/" + destino.name, "w": pix.width, "h": pix.height, "download": descarga, "record": registro,
                    "origin": origen_de(clave, pie)}
            mats = materiales_de(pie)
            if mats:
                fila["materials"] = mats
            salida.append(fila)
            miniaturas.append((fid, destino))
        print("%-7s figuras con dibujo: %-3d elegidas: %d" % (clave, len(todas), len(elegidas)))
    abiertos = {}
    for fid, (archivo, enlace, titulo, credito), pag, num, recorte, pie, invs, mats, origen in EQUIPO:
        if archivo not in abiertos:
            abiertos[archivo] = pymupdf.open(CTX / archivo)
        pagina = abiertos[archivo][pag - 1]
        clip = pymupdf.Rect(*recorte) & pagina.rect
        pix = pagina.get_pixmap(dpi=150 if clip.width < 300 else 125, clip=clip)
        destino = SAL_IMG / (fid + ".jpg")
        destino.write_bytes(pix.tobytes("jpeg", jpg_quality=78))
        salida.append({"id": fid, "invs": invs, "doc": titulo, "page": pag, "number": num, "caption": pie,
                       "img": "figures/" + destino.name, "w": pix.width, "h": pix.height, "download": enlace, "record": enlace,
                       "origin": origen, "materials": mats, "team": True, "credit": credito})
        miniaturas.append((fid, destino))
    print("equipo  figuras: %d" % len(EQUIPO))
    for fid, archivo, enlace, titulo, num, pie, invs, mats, origen, credito in IMAGENES:
        pix = pymupdf.Pixmap(str(CTX / "imagenes" / archivo))
        if pix.alpha:
            pix = pymupdf.Pixmap(pix, 0)            # sin canal alfa: JPEG no lo admite
        if pix.width > 1300:
            pix.shrink(1)                            # a la mitad: una imagen de 1920 px queda en 960
        destino = SAL_IMG / (fid + ".jpg")
        destino.write_bytes(pix.tobytes("jpeg", jpg_quality=80))
        salida.append({"id": fid, "invs": invs, "doc": titulo, "page": None, "number": num, "caption": pie,
                       "img": "figures/" + destino.name, "w": pix.width, "h": pix.height, "download": enlace, "record": enlace,
                       "origin": origen, "materials": mats, "team": True, "credit": credito})
        miniaturas.append((fid, destino))
    print("imagenes de paginas de NASA: %d" % len(IMAGENES))
    for fid, carpeta, cat, archivo, (en, es), pag, num, recorte, pie, invs, mats, origen in RECORTES_PSI:
        if archivo not in abiertos:
            abiertos[archivo] = pymupdf.open(DOCS / carpeta / cat / archivo)
        pagina = abiertos[archivo][pag - 1]
        if recorte:
            pix = pagina.get_pixmap(dpi=150, clip=pymupdf.Rect(*recorte) & pagina.rect)
        else:
            pix = pagina.get_pixmap(dpi=110)
        destino = SAL_IMG / (fid + ".jpg")
        destino.write_bytes(pix.tobytes("jpeg", jpg_quality=78))
        fila_inv = inventario.get((carpeta, archivo))
        descarga = "https://psi.nasa.gov/geode-py/ws/studies/%s/download?file=%s&version=%s" % (carpeta, urllib.parse.quote(archivo), (fila_inv or {}).get("version", "1"))
        salida.append({"id": fid, "invs": invs, "doc": {"en": en, "es": es}, "page": pag, "number": num, "caption": pie,
                       "img": "figures/" + destino.name, "w": pix.width, "h": pix.height, "download": descarga,
                       "record": "https://psi.nasa.gov/physci/repo/data/investigations/" + carpeta,
                       "origin": origen, "materials": mats})
        miniaturas.append((fid, destino))
    print("recortes de PSI: %d" % len(RECORTES_PSI))
    for f in salida:
        f["worlds"] = mundos_fig(f)
    SAL_JS.write_text("window.OFMW_FIGURES=" + json.dumps(salida, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8", newline="\n")
    peso = sum(f.stat().st_size for f in SAL_IMG.glob("*.jpg"))
    print("total: %d figuras | %.1f MB" % (len(salida), peso / 1e6))
    for f in salida:
        print("  %-16s p%-4s %4dx%-4d %s" % (f["id"], f["page"], f["w"], f["h"], f["caption"][:92]))
    if hoja:
        # hoja de contacto: miniaturas en una cuadricula, para revisar los recortes de un vistazo
        cols, lado = 8, 150
        filas = (len(miniaturas) + cols - 1) // cols
        doc = pymupdf.open()
        pagina = doc.new_page(width=cols * lado, height=filas * (lado + 14))
        for k, (fid, ruta) in enumerate(miniaturas):
            x, y = (k % cols) * lado, (k // cols) * (lado + 14)
            pagina.insert_image(pymupdf.Rect(x + 3, y + 3, x + lado - 3, y + lado - 3), filename=str(ruta), keep_proportion=True)
            pagina.insert_text((x + 4, y + lado + 9), fid, fontsize=7)
        destino = Path(sys.argv[sys.argv.index("--hoja") + 1])
        destino.write_bytes(pagina.get_pixmap(dpi=96).tobytes("png"))
        print("hoja de contacto:", destino)


if __name__ == "__main__":
    main()
