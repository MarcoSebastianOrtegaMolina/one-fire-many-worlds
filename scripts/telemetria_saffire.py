"""Saca de los datos crudos y analizados de PSI dos cosas que las tablas experimentales no traen:

  data/extra/saffire_ambiente.csv           presion de cabina de las tres Saffire y oxigeno de Saffire-III,
                                            con minimo, mediana y maximo de cada sensor
  data/extra/same_r_tamanos_particula.csv   tamanos de particula del humo por material (SAME y SAME-R)

Fuentes (se bajan con descargar_documentos.py --categorias "Raw Data" "Analyzed Data" --nombres ...):
  PSI-98, 99, 100   "... Telemetry Data ... .xlsx", hoja CygnusData, columnas "PCM Press ... (psi)"
  PSI-100           "Saffire III Sample N Sensors.xlsx", hoja Calibrated Data, columnas O2 y Ambient Pressure
  PSI-101           "SAME, SAME-R_Results.xlsx", hojas "ICES 2012 Paper data table" e "IAASS Paper data table"

En la telemetria muchas celdas de presion vienen vacias o en cero; solo cuentan los valores entre 1 y 30 psi.
Necesita openpyxl. Correr con   python -E -P scripts/telemetria_saffire.py   (tarda uno o dos minutos).
"""
import csv
import re
import statistics
import warnings
from pathlib import Path

import openpyxl

RAIZ = Path(__file__).resolve().parent.parent
DOCS = RAIZ / "data" / "raw" / "documentos"
SALIDA = RAIZ / "data" / "extra"


def es_num(x):
    return isinstance(x, (int, float)) and not isinstance(x, bool)


def columnas(ws, patron, minimo_texto=3):
    """Devuelve (iterador ya colocado tras el encabezado, {indice: nombre}) de las columnas que casan."""
    it = ws.iter_rows(values_only=True)
    for i, f in enumerate(it):
        if f and sum(1 for c in f if isinstance(c, str)) >= minimo_texto:
            cab = [str(c).replace("\n", " ").strip() if c is not None else "" for c in f]
            return it, {j: c for j, c in enumerate(cab) if re.search(patron, c)}
        if i > 20:
            break
    return it, {}


def resumen(ws, patron, valido):
    it, cols = columnas(ws, patron)
    vals = {j: [] for j in cols}
    for f in it:
        for j in cols:
            if j < len(f) and es_num(f[j]) and valido(f[j]):
                vals[j].append(f[j])
    return [(cols[j], len(v), min(v), statistics.median(v), max(v)) for j, v in vals.items() if v]


def main():
    warnings.simplefilter("ignore")
    SALIDA.mkdir(parents=True, exist_ok=True)
    filas = []
    for acc in ("PSI-98", "PSI-99", "PSI-100"):
        for ruta in sorted((DOCS / acc / "Raw Data").glob("*Telemetry Data*.xlsx")):
            if "1 Hz" in ruta.name:
                continue
            wb = openpyxl.load_workbook(ruta, read_only=True, data_only=True)
            for nombre, n, a, med, b in resumen(wb["CygnusData"], r"^PCM Press(?!/)", lambda x: 1 < x < 30):
                filas.append([acc, "todas", "presion_psi", nombre, n, "%.3f" % a, "%.3f" % med, "%.3f" % b, ruta.name, "CygnusData"])
    for ruta in sorted((DOCS / "PSI-100" / "Raw Data").glob("*Sample * Sensors.xlsx")):
        muestra = "S" + re.search(r"Sample (\d)", ruta.name).group(1)
        wb = openpyxl.load_workbook(ruta, read_only=True, data_only=True)
        for nombre, n, a, med, b in resumen(wb["Calibrated Data"], r"^(O2|Ambient Pressure)$", lambda x: 1 < x < 30):
            var = "oxigeno_pct" if nombre == "O2" else "presion_psi"
            filas.append(["PSI-100", muestra, var, nombre, n, "%.3f" % a, "%.3f" % med, "%.3f" % b, ruta.name, "Calibrated Data"])
    with open(SALIDA / "saffire_ambiente.csv", "w", newline="", encoding="utf-8-sig") as fh:
        w = csv.writer(fh, lineterminator="\n")
        w.writerow(["id_investigacion", "muestra", "variable", "sensor", "n_valores", "minimo", "mediana", "maximo", "archivo", "hoja"])
        w.writerows(filas)
    print("saffire_ambiente.csv: %d renglones" % len(filas))
    for f in filas:
        print("  %-8s %-6s %-12s %-24s n=%-6s %s a %s (mediana %s)" % (f[0], f[1], f[2], f[3][:24], f[4], f[5], f[7], f[6]))

    ruta = next(iter((DOCS / "PSI-101" / "Analyzed Data").glob("*SAME-R_Results.xlsx")), None)
    if not ruta:
        print("falta el archivo de resultados de SAME-R")
        return
    wb = openpyxl.load_workbook(ruta, read_only=True, data_only=True)
    out = []
    for hoja in ("ICES 2012 Paper data table", "IAASS Paper data table"):
        for n, f in enumerate(wb[hoja].iter_rows(values_only=True), start=1):
            f = list(f) + [None] * 20
            # el bloque de la derecha trae: material, condicion, y tres diametros en nm con su sigma
            if isinstance(f[10], str) and isinstance(f[11], str) and all(es_num(f[k]) for k in (16, 17, 18, 19)):
                out.append([f[10].strip(), f[11].strip(), "%.1f" % f[16], "%.1f" % f[17], "%.1f" % f[18], "%.2f" % f[19], hoja, n])
    with open(SALIDA / "same_r_tamanos_particula.csv", "w", newline="", encoding="utf-8-sig") as fh:
        w = csv.writer(fh, lineterminator="\n")
        w.writerow(["material", "condicion", "diametro_medio_geometrico_nm", "diametro_medio_aritmetico_nm",
                    "diametro_de_masa_promedio_nm", "sigma_g", "hoja", "fila"])
        w.writerows(out)
    print("same_r_tamanos_particula.csv: %d renglones (origen: %s)" % (len(out), ruta.name))


if __name__ == "__main__":
    main()
