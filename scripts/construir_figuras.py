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
]
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
    for clave, invs, carpeta, cat, archivo, en, es, tope in DOCUMENTOS:
        ruta = (DOCS / carpeta / cat / archivo) if carpeta else (RAIZ / "data" / "raw" / "contexto" / archivo)
        pdf = pymupdf.open(ruta)
        todas = figuras_de(pdf)
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
                descarga = registro = "https://www.nasa.gov/missions/station/a-researchers-guide-to-combustion-science/"
            salida.append({"id": fid, "invs": invs, "doc": {"en": en, "es": es}, "page": pag, "number": num, "caption": pie,
                           "img": "figures/" + destino.name, "w": pix.width, "h": pix.height, "download": descarga, "record": registro})
            miniaturas.append((fid, destino))
        print("%-7s figuras con dibujo: %-3d elegidas: %d" % (clave, len(todas), len(elegidas)))
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
