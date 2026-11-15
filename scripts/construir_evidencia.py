"""Catalogo de fuentes exactas: la pagina del reporte de donde salio cada hallazgo.

Para cada entrada busca la frase en la pagina indicada del PDF, guarda la imagen de esa pagina en
app/evidence/ y escribe app/data/evidence.js con la cita literal, la zona a resaltar y los enlaces a PSI.
Si la frase no esta en la pagina, la busca en todo el documento y avisa; si no aparece, falla.

Los PDF son archivos bajados de PSI: se leen como datos. Correr con:
    python -E -P scripts/construir_evidencia.py
"""
import csv
import json
import re
import sys
import urllib.parse
from pathlib import Path

import fitz  # pymupdf

RAIZ = Path(__file__).resolve().parent.parent
DOCS = RAIZ / "data" / "raw" / "documentos"
SAL_IMG = RAIZ / "app" / "evidence"
SAL_JS = RAIZ / "app" / "data" / "evidence.js"

DOCUMENTOS = {
    "bre-final": ("PSI-20", "Reports", "PSI-20_Reports_Final_20220201.pdf", "ACME BRE final report (2022)", "Reporte final de ACME BRE (2022)"),
    "bass2": ("PSI-25", "Reports", "PSI-25_Reports_BASS-II Summary Report.pdf", "BASS and BASS-II summary report, NASA/TM-20210011385", "Reporte resumen de BASS y BASS-II, NASA/TM-20210011385"),
    "cfi": ("PSI-39", "Reports", "PSI-39_Reports_CFI Science Final Report.pdf", "CFI science final report", "Reporte final de ciencia de CFI"),
    "same": ("PSI-102", "Reports", "PSI-102_Reports_SAME_Final Science Report.pdf", "SAME final science report", "Reporte final de ciencia de SAME"),
    "samer": ("PSI-101", "Reports", "PSI-101_Reports_SAME-R_Final Report.pdf", "SAME-R final report", "Reporte final de SAME-R"),
    "spice": ("PSI-107", "Reports", "PSI-107_Reports_SPICE_FinalReport.pdf", "SPICE final report", "Reporte final de SPICE"),
    "efield": ("PSI-22", "Reports", "PSI-22_Reports_E-FIELD Flames Final Report.pdf", "E-FIELD Flames final report", "Reporte final de E-FIELD Flames"),
    "guide": (None, None, "researchers_guide_combustion_science_2015.pdf", "A Researcher's Guide to International Space Station Combustion Science (NASA, 2015)", "A Researcher's Guide to International Space Station Combustion Science (NASA, 2015)"),
}

# id, documento, pagina del PDF, frase a resaltar, investigaciones a las que sirve, que sostiene (en, es)
ENTRADAS = [
    ("bre-final-18", "bre-final", 18, "the flames generally persisted for 3 minutes or more", ["PSI-20"],
     "At 27 % oxygen and 10.2 psia, and at 34 % and 8.2 psia, the flames generally persisted; extinction was seen mostly at 21 % oxygen and 14.7 psia.",
     "Con 27 % de oxígeno a 10.2 psia y con 34 % a 8.2 psia, las flamas en general persistían; la extinción se vio sobre todo con 21 % a 14.7 psia."),
    ("bre-final-55", "bre-final", 55, "the flames mostly persisted for 2 minutes or more", ["PSI-20"],
     "The same result stated again in the results section: flames mostly persisted in the two exploration atmospheres.",
     "El mismo resultado, dicho otra vez en la sección de resultados: las flamas persistían en las dos atmósferas de exploración."),
    ("bass2-19", "bass2", 19, "U-shaped flammability boundary", ["PSI-25", "PSI-26"],
     "The tests outlined a U-shaped flammability boundary, with blowoff on one side and quenching on the other.",
     "Las pruebas delinearon una frontera de inflamabilidad en forma de U, con soplado de un lado y extinción por falta de flujo del otro."),
    ("bass2-84", "bass2", 84, "is significantly lower than the observed upward flame spread limit", ["PSI-25", "PSI-26"],
     "Figure 6.10 draws the flammability boundary. The minimum oxygen in microgravity, 13.5 %, is lower than the 15.4 % upward flame spread limit in normal gravity: the material stays flammable under the weak ventilation only found in microgravity.",
     "La figura 6.10 dibuja la frontera de inflamabilidad. El oxígeno mínimo en microgravedad, 13.5 %, es menor que el límite de 15.4 % de la propagación hacia arriba en gravedad normal: el material sigue siendo inflamable con la ventilación débil que solo hay en microgravedad."),
    ("bass2-36", "bass2", 36, "COMPARISON OF EXTINCTION VELOCITY", ["PSI-25"],
     "Thin PMMA at 1 atm extinguishes near 10 mm/s at 21 % oxygen and near 30 mm/s at 16 %.",
     "El PMMA delgado a 1 atm se extingue a unos 10 mm/s con 21 % de oxígeno y a unos 30 mm/s con 16 %."),
    ("bass2-109", "bass2", 109, "Concurrent flame growth and extinction over a thin flat cotton-fiberglass", ["PSI-25", "PSI-26"],
     "Conclusions for the cotton-fiberglass fabric: how the flame grows and goes out as the airflow is lowered.",
     "Conclusiones para la tela de algodón y fibra de vidrio: cómo crece la flama y cómo se apaga al bajar el flujo de aire."),
    ("cfi-6", "cfi", 6, "multiple reignition cycles were observed", ["PSI-39"],
     "Above 2 atm, reignition cycles appear: the hot flame goes out by radiative loss, a cool flame follows, and it reignites.",
     "Por encima de 2 atm aparecen ciclos de reignición: la flama caliente se apaga por pérdida radiativa, sigue una flama fría y vuelve a encenderse."),
    ("same-25", "same", 25, "the signal from the ISS detector was more erratic", ["PSI-102"],
     "With Teflon smoke the Shuttle detector gave a strong signal and the Station detector an erratic one, because its particles are mostly smaller than one micrometer.",
     "Con humo de teflón el detector del transbordador dio señal fuerte y el de la Estación una señal errática, porque sus partículas miden casi todas menos de un micrómetro."),
    ("same-28", "same", 28, "show strong signals on the Space Shuttle detector", ["PSI-102"],
     "Every test in the series gave a strong signal on the Shuttle ionization detector.",
     "Todas las pruebas de la serie dieron señal fuerte en el detector de ionización del transbordador."),
    ("same-56", "same", 56, "count mean diameters are all in the 100 to 200 nm range", ["PSI-102"],
     "The report says the count mean diameters are all in the 100 to 200 nm range, gives 227 nm for silicone rubber on the same page, and warns that one statistic can mislead: almost half of the silicone smoke mass is in particles larger than 1000 nm. In the per-run results, single silicone runs reach 372 nm.",
     "El reporte dice que los diámetros medios por conteo están todos entre 100 y 200 nm, en la misma página da 227 nm para el silicón y advierte que una sola cifra engaña: casi la mitad de la masa del humo de silicón está en partículas de más de 1000 nm. En los resultados por corrida, hay corridas de silicón que llegan a 372 nm."),
    ("samer-5", "samer", 5, "will make detection of this smoke challenging for light scattering devices", ["PSI-101"],
     "The much smaller particles of Kapton and Teflon smoke will be hard to detect with light-scattering devices.",
     "Las partículas mucho más chicas del humo de Kapton y de teflón serán difíciles de detectar con dispositivos de dispersión de luz."),
    ("spice-2", "spice", 2, "Fifty-two smoke points were found", ["PSI-107"],
     "Fifty-two smoke points were found for ethylene, propane, propylene and propylene-nitrogen mixtures.",
     "Se encontraron cincuenta y dos puntos de humo para etileno, propano, propileno y mezclas de propileno con nitrógeno."),
    ("efield-37", "efield", 37, "approximating buoyancy body forces at partial gravity", ["PSI-22"],
     "The report suggests electric fields may be a tool for approximating buoyancy at partial gravity. It is a suggestion, not a measurement.",
     "El reporte sugiere que los campos eléctricos podrían servir para aproximar la flotación en gravedad parcial. Es una sugerencia, no una medición."),
    ("guide-19", "guide", 19, "The glovebox is normally limited to ISS", ["PSI-25", "PSI-26"],
     "The glovebox where BASS ran is normally limited to Station air, 21 % oxygen at one atmosphere; nitrogen was used to go lower. The team reads this as the reason solids were not tested with more oxygen; the page does not say so.",
     "La guantera donde corrió BASS está limitada al aire de la Estación, 21 % de oxígeno a una atmósfera; se usó nitrógeno para bajarlo. El equipo lo lee como la razón de que los sólidos no se probaran con más oxígeno; la página no lo dice."),
    ("guide-22", "guide", 22, "NASA-STD-6001 Test 1 worst case", ["PSI-25", "PSI-26"],
     "The microgravity limiting oxygen is compared with the ground test NASA-STD-6001 Test 1 to evaluate the safety margins of normal-gravity testing.",
     "El oxígeno límite en microgravedad se compara con la prueba en tierra NASA-STD-6001 Test 1 para evaluar los márgenes de seguridad de probar en gravedad normal."),
]

# Fuentes que se citan sin imagen de pagina (se enlaza el documento en PSI)
SIN_IMAGEN = [
    {"id": "bre-thesis", "invs": ["PSI-20"], "docInv": "PSI-20", "file": "PSI-20_Reports_Dissertation-PD-revised_.pdf",
     "doc": {"en": "Dissertation archived with the ACME BRE reports", "es": "Tesis archivada entre los reportes de ACME BRE"},
     "pageLabel": "110-112, 163-164",
     "claim": {"en": "Tables 6.1, E.1 and F.1 give oxygen, pressure and outcome for the 177 BRE tests. The page image is not reproduced here; open the document in PSI.",
               "es": "Las tablas 6.1, E.1 y F.1 dan oxígeno, presión y desenlace de las 177 pruebas de BRE. La imagen de la página no se reproduce aquí; abre el documento en PSI."}},
]


def limpio(t):
    #  es la letra mu de la fuente Symbol: sin esto «1 µm» se lee «1 m»
    return re.sub(r"\s+", " ", t.replace("", "µ")).strip()


# Citas que son una tabla: se corta despues del titulo, porque el resto son celdas sueltas (se ven en la imagen)
RECORTE = {"bass2-36": "AT 1 atm"}
FIN_ORACION = re.compile(r"(?<!Ref)(?<!Fig)(?<!al)(?<!vs)\. ")
ENCABEZADO = re.compile(r"^N?ASA/TM\S* \d+ (?:\d+(?:\.\d+)+ )?")


def cita(texto, frase, eid=""):
    """La oracion que contiene la frase, sin el encabezado de pagina ni el numero de seccion."""
    t = limpio(texto)
    i = t.lower().find(frase.lower())
    if i < 0:
        return frase
    ini = max(t.rfind(". ", 0, i), t.rfind("? ", 0, i)) + 2
    m = FIN_ORACION.search(t, i + len(frase))
    fin = m.start() + 1 if m else len(t)
    q = ENCABEZADO.sub("", t[ini:fin])
    if eid in RECORTE and RECORTE[eid] in q:
        q = q[:q.find(RECORTE[eid]) + len(RECORTE[eid])]
    return q[:420]


def main():
    inventario = {(r["id"], r["archivo"]): r for r in csv.DictReader(open(RAIZ / "data" / "raw" / "inventario_archivos.csv", encoding="utf-8-sig"))}
    SAL_IMG.mkdir(parents=True, exist_ok=True)
    salida, avisos = [], []
    abiertos = {}
    for eid, doc, pag, frase, invs, en, es in ENTRADAS:
        inv, cat, archivo, titulo_en, titulo_es = DOCUMENTOS[doc]
        ruta = (DOCS / inv / cat / archivo) if inv else (RAIZ / "data" / "raw" / "contexto" / archivo)
        if doc not in abiertos:
            abiertos[doc] = fitz.open(ruta)
        pdf = abiertos[doc]
        pagina = pdf[pag - 1]
        zonas = pagina.search_for(frase)
        if not zonas:
            encontradas = [n + 1 for n in range(len(pdf)) if pdf[n].search_for(frase)]
            if not encontradas:
                sys.exit("NO ESTA: %s en %s (pagina %d)" % (frase, archivo, pag))
            avisos.append("%s: la frase no esta en la pagina %d; se uso la %d (aparece en %s)" % (eid, pag, encontradas[0], encontradas))
            pag = encontradas[0]
            pagina = pdf[pag - 1]
            zonas = pagina.search_for(frase)
        w, h = pagina.rect.width, pagina.rect.height
        pix = pagina.get_pixmap(dpi=105)
        destino = SAL_IMG / (eid + ".jpg")
        destino.write_bytes(pix.tobytes("jpeg", jpg_quality=72))
        descarga = registro = ""
        if inv:
            fila = inventario.get((inv, archivo))
            version = (fila or {}).get("version", "1")
            descarga = "https://psi.nasa.gov/geode-py/ws/studies/%s/download?file=%s&version=%s" % (inv, urllib.parse.quote(archivo), version)
            registro = "https://psi.nasa.gov/physci/repo/data/investigations/" + inv
        else:
            descarga = registro = "https://www.nasa.gov/missions/station/a-researchers-guide-to-combustion-science/"
        salida.append({
            "id": eid, "invs": invs, "docInv": inv or "", "doc": {"en": titulo_en, "es": titulo_es}, "file": archivo,
            "page": pag, "pages": len(pdf), "claim": {"en": en, "es": es}, "quote": cita(pagina.get_text(), frase, eid),
            "rects": [[round(z.x0 / w, 4), round(z.y0 / h, 4), round(z.x1 / w, 4), round(z.y1 / h, 4)] for z in zonas],
            "img": "evidence/" + destino.name, "w": pix.width, "h": pix.height, "download": descarga, "record": registro,
        })
    for s in SIN_IMAGEN:
        fila = inventario.get((s["docInv"], s["file"]))
        s2 = dict(s)
        s2.update({"page": None, "quote": "", "rects": [], "img": "", "w": 0, "h": 0,
                   "download": "https://psi.nasa.gov/geode-py/ws/studies/%s/download?file=%s&version=%s" % (s["docInv"], urllib.parse.quote(s["file"]), (fila or {}).get("version", "1")),
                   "record": "https://psi.nasa.gov/physci/repo/data/investigations/" + s["docInv"]})
        salida.append(s2)
    SAL_JS.write_text("window.OFMW_EVIDENCE=" + json.dumps(salida, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8", newline="\n")
    peso = sum(f.stat().st_size for f in SAL_IMG.glob("*.jpg"))
    print("fuentes: %d (%d con imagen) | imagenes: %.1f MB" % (len(salida), len(ENTRADAS), peso / 1e6))
    for e in salida:
        if e["img"]:
            print("  %-14s p%-4s zonas=%d %dx%d | %s" % (e["id"], e["page"], len(e["rects"]), e["w"], e["h"], e["quote"][:110]))
    for a in avisos:
        print("  AVISO:", a)


if __name__ == "__main__":
    main()
