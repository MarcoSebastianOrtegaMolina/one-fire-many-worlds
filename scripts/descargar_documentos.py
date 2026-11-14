"""Descarga los documentos de apoyo de cada investigacion de PSI (no datos crudos).

Lee el listado completo de archivos ya bajado en data/raw/archivos/PSI-N.json (lo que el sitio
muestra en "Data files and documents") y guarda en data/raw/documentos/PSI-N/<categoria>/ los
archivos de las categorias elegidas. Por omision: Science Documents, Engineering Documents y
Reference Data.

OJO: la primera version de este script leia el campo 'added' de la ficha. Ese campo solo trae
lo que cambio en la ultima version de la investigacion, no todos sus archivos; por eso FLEX,
FLEX-2, BRE, E-FIELD y Saffire-II parecian no tener documentos.

Se omiten, y quedan anotados en data/raw/documentos_omitidos.csv con su motivo:
  - videos e imagenes (son datos crudos);
  - archivos por encima del tope de tamano (--tope-mb para documentos, --tope-zip-mb para zip);
  - archivos restringidos, ocultos o inactivos.
Y data/raw/inventario_archivos.csv lista TODO lo que no es dato crudo, bajado o no.

Uso:
  python scripts/descargar_documentos.py --simular
  python scripts/descargar_documentos.py
  python scripts/descargar_documentos.py --categorias "Science Documents" "Reports"
"""
import argparse
import csv
import json
import sys
import urllib.parse
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import descargar_psi as base  # noqa: E402  (reutiliza pausa, manifest y reintentos)

CATEGORIAS = ["Science Documents", "Engineering Documents", "Reference Data"]
DOCUMENTO = {"pdf", "xlsx", "xls", "csv", "txt", "docx", "doc", "pptx", "ppt"}
MEDIA = {"mp4", "mov", "avi", "wmv", "jpg", "jpeg", "png", "tif", "tiff", "bmp", "gif"}
SIN_DETALLE = {"Raw Data"}  # demasiados archivos para listarlos uno por uno


def hojas(nodo, cat=None):
    for f in nodo.get("files") or []:
        c = cat or f.get("sortingCategory") or f.get("displayName")
        if f.get("directory") or f.get("files"):
            yield from hojas(f, c)
        else:
            yield c, f


def clasificar(f, nombre, tope, tope_zip):
    ext = nombre.rsplit(".", 1)[-1].lower() if "." in nombre else ""
    peso = f.get("bytes_size") or 0
    if f.get("restricted") or f.get("restrictedAccess") or f.get("visible") is False or f.get("status") != "active":
        return "restringido, oculto o inactivo"
    if ext in MEDIA:
        return "video o imagen"
    if ext == "zip":
        return None if peso <= tope_zip else "zip mayor al tope"
    if ext in DOCUMENTO:
        return None if peso <= tope else "documento mayor al tope"
    return "extension no prevista (.%s)" % ext


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--simular", action="store_true")
    ap.add_argument("--tope-mb", type=float, default=20.0)
    ap.add_argument("--tope-zip-mb", type=float, default=5.0)
    ap.add_argument("--categorias", nargs="+", default=CATEGORIAS)
    ap.add_argument("--inv", nargs="+", help="limita la descarga a estas investigaciones (PSI-N). Usarlo SIEMPRE "
                    "con --nombres: sin el, un patron como .xls baja archivos de todas las investigaciones")
    ap.add_argument("--nombres", nargs="+", help="baja solo los archivos cuyo nombre contiene alguno de estos "
                    "textos; permite sacar tablas chicas de Raw Data o Analyzed Data sin bajar la categoria entera")
    args = ap.parse_args()
    tope, tope_zip = args.tope_mb * 1e6, args.tope_zip_mb * 1e6

    m = base.cargar_manifest()
    bajar, omitir, inventario = [], [], []
    for ruta in sorted((base.RAW / "archivos").glob("*.json"), key=lambda p: base.num(p.stem)):
        acc = ruta.stem
        if args.inv and acc not in args.inv:
            continue
        arbol = json.loads(ruta.read_text(encoding="utf-8"))
        for cat, f in hojas(arbol):
            if cat in SIN_DETALLE and not args.nombres:
                continue
            nombre = (f.get("key") or "").rsplit("/", 1)[-1]
            fila = (acc, cat, nombre, f.get("bytes_size") or 0, f.get("version", 1))
            destino = base.RAW / "documentos" / acc / cat / base.nombre_seguro(nombre)
            if cat not in SIN_DETALLE:
                inventario.append(fila + (f.get("updated", ""), "si" if destino.exists() else "no"))
            if cat not in args.categorias:
                continue
            if args.nombres and not any(n.lower() in nombre.lower() for n in args.nombres):
                continue
            motivo = clasificar(f, nombre, tope, tope_zip)
            (omitir if motivo else bajar).append(fila + ((motivo,) if motivo else ()))

    print("categorias:", args.categorias)
    print("a bajar: %d archivos, %.1f MB" % (len(bajar), sum(f[3] for f in bajar) / 1e6))
    print("omitidos: %d archivos, %.1f MB" % (len(omitir), sum(f[3] for f in omitir) / 1e6))
    motivos = {}
    for f in omitir:
        motivos.setdefault(f[5], [0, 0])
        motivos[f[5]][0] += 1
        motivos[f[5]][1] += f[3]
    for k, v in motivos.items():
        print("   %-32s %4d  %8.1f MB" % (k, v[0], v[1] / 1e6))
    por_acc = {}
    for f in bajar:
        por_acc.setdefault(f[0], [0, 0])
        por_acc[f[0]][0] += 1
        por_acc[f[0]][1] += f[3]
    print("por investigacion:", {k: "%d/%.0fMB" % (v[0], v[1] / 1e6) for k, v in por_acc.items()})

    if set(args.categorias) == set(CATEGORIAS):  # el archivo de omitidos describe la corrida por omision
        with open(base.RAW / "documentos_omitidos.csv", "w", newline="", encoding="utf-8") as fh:
            w = csv.writer(fh, lineterminator="\n")
            w.writerow(["id", "categoria", "archivo", "bytes", "version", "motivo"])
            w.writerows(omitir)
    if args.simular:
        return

    cuenta = {"ya": 0, "ok": 0, "fallo": 0}
    for acc, cat, nombre, peso, version in bajar:
        q = urllib.parse.urlencode({"file": nombre, "version": version}, quote_via=urllib.parse.quote)
        destino = base.RAW / "documentos" / acc / cat / base.nombre_seguro(nombre)
        r = base.bajar(base.URL_TABLA.format(acc=acc) + "?" + q, destino, m,
                       {"nombre_original": nombre, "version": version, "bytes_declarados": peso, "categoria": cat})
        cuenta[r] += 1
        if r == "fallo":
            print("  FALLO %s | %s" % (acc, nombre))
    print("documentos:", cuenta)
    difieren = [k for k, v in m["archivos"].items()
                if k.startswith("documentos/") and v.get("bytes") != v.get("bytes_declarados")]
    print("con tamano distinto al declarado:", len(difieren), difieren[:5])

    if args.inv:
        return  # una corrida parcial no reescribe el inventario completo
    with open(base.RAW / "inventario_archivos.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh, lineterminator="\n")
        w.writerow(["id", "categoria", "archivo", "bytes", "version", "actualizado", "bajado"])
        for fila in inventario:
            destino = base.RAW / "documentos" / fila[0] / fila[1] / base.nombre_seguro(fila[2])
            w.writerow(fila[:6] + ("si" if destino.exists() else "no",))


if __name__ == "__main__":
    main()
