"""Saca el texto de los documentos bajados de PSI para poder buscar en ellos sin abrirlos.

Entrada:  data/raw/documentos/PSI-N/<categoria>/<archivo>
Salida:   data/raw/documentos_texto/PSI-N/<categoria>/<archivo>.txt   (una marca por pagina u hoja)
          data/raw/documentos_texto/indice.csv   (archivo, tipo, paginas, caracteres, estado)

Soporta pdf (pymupdf), docx y pptx (leyendo su XML), xlsx (openpyxl si esta), xls (xlrd si esta),
txt y csv. De un zip procesa los documentos que trae dentro. Un PDF escaneado no tiene texto:
queda anotado como "sin capa de texto" (no se hace OCR).

Los documentos son archivos descargados: correr con   python -E -P scripts/extraer_texto.py
No repite los que ya tienen su .txt.
"""
import csv
import io
import re
import sys
import zipfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / "data" / "raw" / "documentos"
DESTINO = RAIZ / "data" / "raw" / "documentos_texto"

try:
    import pymupdf
except ImportError:  # versiones viejas
    import fitz as pymupdf
try:
    import openpyxl
except ImportError:
    openpyxl = None
sys.path.insert(0, str(Path(__file__).resolve().parent / "_vendor"))  # xlrd se instala ahi, dentro del proyecto
try:
    import xlrd
except ImportError:
    xlrd = None


def de_pdf(datos):
    doc = pymupdf.open(stream=datos, filetype="pdf")
    partes = ["\n===== pagina %d =====\n%s" % (i, p.get_text()) for i, p in enumerate(doc, 1)]
    return "".join(partes), len(doc)


def de_xml_office(datos, patron, etiqueta_parrafo):
    z = zipfile.ZipFile(io.BytesIO(datos))
    nombres = sorted((n for n in z.namelist() if re.match(patron, n)),
                     key=lambda n: [int(x) for x in re.findall(r"\d+", n)] or [0])
    partes = []
    for i, n in enumerate(nombres, 1):
        xml = z.read(n).decode("utf-8", "replace")
        xml = re.sub(r"</%s>" % etiqueta_parrafo, "\n", xml)
        xml = re.sub(r"<w:tab/>|</w:tc>|</a:tc>", "\t", xml)
        txt = re.sub(r"<[^>]+>", "", xml)
        for a, b in (("&amp;", "&"), ("&lt;", "<"), ("&gt;", ">"), ("&quot;", '"'), ("&apos;", "'")):
            txt = txt.replace(a, b)
        partes.append("\n===== parte %d =====\n%s" % (i, txt))
    return "".join(partes), len(nombres)


def de_xlsx(datos):
    if not openpyxl:
        return None, 0
    wb = openpyxl.load_workbook(io.BytesIO(datos), read_only=True, data_only=True)
    partes = []
    for hoja in wb.worksheets:
        filas = []
        for fila in hoja.iter_rows(values_only=True):
            if any(c is not None for c in fila):
                filas.append("\t".join("" if c is None else str(c) for c in fila))
        partes.append("\n===== hoja %s =====\n%s" % (hoja.title, "\n".join(filas)))
    return "".join(partes), len(wb.worksheets)


def de_xls(datos):
    if not xlrd:
        return None, 0
    wb = xlrd.open_workbook(file_contents=datos)
    partes = []
    for hoja in wb.sheets():
        filas = ["\t".join(str(c) for c in hoja.row_values(i)) for i in range(hoja.nrows)]
        partes.append("\n===== hoja %s =====\n%s" % (hoja.name, "\n".join(filas)))
    return "".join(partes), wb.nsheets


def extraer(nombre, datos):
    """Devuelve (texto, unidades, estado)."""
    ext = nombre.rsplit(".", 1)[-1].lower() if "." in nombre else ""
    try:
        if ext == "pdf":
            t, n = de_pdf(datos)
        elif ext == "docx":
            t, n = de_xml_office(datos, r"word/document\.xml$", "w:p")
        elif ext == "pptx":
            t, n = de_xml_office(datos, r"ppt/slides/slide\d+\.xml$", "a:p")
        elif ext == "xlsx":
            t, n = de_xlsx(datos)
        elif ext == "xls":
            t, n = de_xls(datos)
        elif ext in ("txt", "csv"):
            try:
                t, n = datos.decode("utf-8-sig"), 1
            except UnicodeDecodeError:
                t, n = datos.decode("cp1252", "replace"), 1
        elif ext == "zip":
            z = zipfile.ZipFile(io.BytesIO(datos))
            partes, n = [], 0
            for info in z.infolist():
                if info.is_dir() or info.file_size > 60e6:
                    continue
                sub, _, est = extraer(info.filename, z.read(info))
                partes.append("\n########## dentro del zip: %s (%s) ##########\n%s" % (info.filename, est, sub or ""))
                n += 1
            return "".join(partes), n, "zip con %d archivos" % n
        else:
            return "", 0, "formato sin lector (.%s)" % ext
    except Exception as e:  # un archivo danado no detiene a los demas
        return "", 0, "error: %s" % type(e).__name__
    if t is None:
        return "", 0, "falta la libreria para .%s" % ext
    utiles = len(re.sub(r"\s|=====.*?=====", "", t))
    if ext == "pdf" and utiles < 40 * max(n, 1):
        return t, n, "sin capa de texto (escaneado)"
    return t, n, "ok"


def main():
    indice = []
    for ruta in sorted(ORIGEN.rglob("*")):
        if not ruta.is_file():
            continue
        rel = ruta.relative_to(ORIGEN)
        if rel.parts[1] in ("Raw Data", "Analyzed Data"):
            continue  # tablas de telemetria: son enormes y se leen con telemetria_saffire.py
        salida = DESTINO / rel.parent / (rel.name + ".txt")
        previo = salida.read_text(encoding="utf-8") if salida.exists() else ""
        if previo and not (previo.startswith("# estado: falta la libreria") and xlrd):
            t = previo
            estado = t.split("\n", 1)[0].replace("# estado: ", "")
            n = t.count("\n===== ")
        else:
            t, n, estado = extraer(ruta.name, ruta.read_bytes())
            t = "# estado: %s\n%s" % (estado, t)
            salida.parent.mkdir(parents=True, exist_ok=True)
            salida.write_text(t, encoding="utf-8", newline="\n")
        indice.append([rel.parts[0], rel.parts[1], ruta.name, ruta.suffix.lower().lstrip("."), ruta.stat().st_size, n,
                       len(t), estado])
    with open(DESTINO / "indice.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh, lineterminator="\n")
        w.writerow(["id", "categoria", "archivo", "tipo", "bytes", "paginas_u_hojas", "caracteres", "estado"])
        w.writerows(indice)
    resumen = {}
    for f in indice:
        clave = f[7].split(":")[0] if f[7].startswith("error") else re.sub(r"\d+", "N", f[7])
        resumen[clave] = resumen.get(clave, 0) + 1
    print("documentos: %d | caracteres: %.1f millones" % (len(indice), sum(f[6] for f in indice) / 1e6))
    print("por estado:", resumen)
    print("librerias: openpyxl=%s xlrd=%s" % (bool(openpyxl), bool(xlrd)))


if __name__ == "__main__":
    sys.exit(main())
