"""Resume como respondio cada detector de humo en cada corrida de SAME y SAME-R.

Entrada:  data/raw/documentos/PSI-101/Analyzed Data/*.xls  (SAME-R, 2010)
          data/raw/documentos/PSI-102/Analyzed Data/*.xls  (SAME, 2007)
          Cada hoja trae una lectura por segundo de: detector de humo de la Estacion (oscurecimiento y
          dispersion, en volts), detector del transbordador (volts), dos detectores de ionizacion (volts),
          P-Trak (particulas por cc) y DustTrak A y B (mg/m3).
Salida:   data/extra/same_respuesta_detectores.csv, una fila por archivo, con la linea de base (mediana de
          las primeras 20 lecturas), el pico (la lectura en el percentil 99 de alejamiento de la base, sin
          contar ceros exactos, que son cortes de senal) y el cambio (pico menos base).

El dia, la corrida y el material salen del NOMBRE del archivo; hay archivos promediados o repetidos de la
misma corrida, y el nombre lo dice. NO ES UN RESULTADO CIENTIFICO NI ESTA VALIDADO: es un resumen grueso
para saber que archivos mirar. Varios canales se saturan (el P-Trak, por ejemplo) y en SAME-R algunos
instrumentos cambiaron respecto de SAME, asi que las cifras de los dos vuelos no son comparables sin leer
sus reportes finales.

Necesita xlrd (en scripts/_vendor). Correr con   python -E -P scripts/detectores_same.py   (tarda unos minutos).
"""
import csv
import re
import statistics
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "_vendor"))
import xlrd  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
DOCS = RAIZ / "data" / "raw" / "documentos"
SALIDA = RAIZ / "data" / "extra" / "same_respuesta_detectores.csv"

DETECTORES = [("ISSDetectorObscuration", "iss_oscurecimiento_V"), ("ISSDetectorScatter", "iss_dispersion_V"),
              ("STSDetector", "sts_V"), ("IonDetectorA", "ion_a_V"), ("IonDetectorB", "ion_b_V"),
              ("PTrak", "ptrak_pt_cc"), ("DustTrakAMeasurement", "dusttrak_a_mg_m3"),
              ("DustTrakBMeasurement", "dusttrak_b_mg_m3")]
MATERIALES = [("silicon", "Silicone"), ("teflon", "Teflon"), ("kapton", "Kapton"), ("lampwick", "Lampwick"),
              ("pyrell", "Pyrell"), ("dbp", "DBP")]


def del_nombre(acc, nombre):
    base = re.sub(r"^PSI-\d+_Analyzed Data_", "", nombre)
    material = next((m for clave, m in MATERIALES if clave in base.lower()), "")
    if acc == "PSI-101":
        m = re.match(r"^(\d{4})_(\d+)_\d+_[A-Za-z]+_run(\d+)", base)
        return ("SAME-R", m.group(2), m.group(3), material) if m else ("SAME-R", "", "", material)
    dia = re.search(r"GMT\s*(\d{3})", base)
    corrida = re.search(r"[Rr]un\s*(\d+)", base) or re.search(r"(?:silicon|teflon|kapton|lampwick|dbp|test)\s*(\d+)", base, re.I)
    return "SAME", dia.group(1) if dia else "", corrida.group(1) if corrida else "", material


def resumen_hoja(hoja):
    cab = None
    for i in range(min(5, hoja.nrows)):
        fila = [str(c) for c in hoja.row_values(i)]
        if any(c.startswith("ISSDetectorObscuration") for c in fila):
            cab = (i, fila)
            break
    if not cab:
        return None
    i0, nombres = cab
    out = {}
    for prefijo, salida in DETECTORES:
        j = next((k for k, c in enumerate(nombres) if c.startswith(prefijo)), None)
        if j is None:
            continue
        vals = [v for v in hoja.col_values(j, i0 + 1) if isinstance(v, (int, float))]
        if len(vals) < 30:
            continue
        base = statistics.median(vals[:20])
        if abs(base) > 0.5:
            vals = [v for v in vals if v != 0]  # un cero exacto en un canal con base alta es un corte de senal, no humo
        # el pico es la lectura en el percentil 99 de alejamiento de la base: asi una lectura suelta no manda
        orden = sorted(vals, key=lambda v: abs(v - base))
        pico = orden[min(len(orden) - 1, int(0.99 * len(orden)))]
        out[salida] = (base, pico, pico - base, len(vals))
    return out


def main():
    cols = ["experimento", "id_investigacion", "dia_gmt", "corrida", "material", "archivo", "hoja", "n_lecturas"]
    for _, s in DETECTORES:
        cols += [s + "_base", s + "_pico", s + "_cambio"]
    filas, fallos = [], []
    for acc in ("PSI-102", "PSI-101"):
        for ruta in sorted((DOCS / acc / "Analyzed Data").glob("*.xls")):
            experimento, dia, corrida, material = del_nombre(acc, ruta.name)
            try:
                wb = xlrd.open_workbook(str(ruta), on_demand=True)
                res, nombre_hoja = None, ""
                for nombre_hoja in wb.sheet_names():
                    res = resumen_hoja(wb.sheet_by_name(nombre_hoja))
                    if res:
                        break
                wb.release_resources()
            except Exception as e:  # un archivo danado no detiene a los demas
                fallos.append((ruta.name, type(e).__name__))
                continue
            if not res:
                fallos.append((ruta.name, "sin columnas de detectores"))
                continue
            fila = {"experimento": experimento, "id_investigacion": acc, "dia_gmt": dia, "corrida": corrida,
                    "material": material, "archivo": re.sub(r"^PSI-\d+_Analyzed Data_", "", ruta.name),
                    "hoja": nombre_hoja, "n_lecturas": max(v[3] for v in res.values())}
            for s, (base, pico, cambio, _) in res.items():
                fila[s + "_base"], fila[s + "_pico"], fila[s + "_cambio"] = "%.5g" % base, "%.5g" % pico, "%.5g" % cambio
            filas.append(fila)
    with open(SALIDA, "w", newline="", encoding="utf-8-sig") as fh:
        w = csv.DictWriter(fh, fieldnames=cols, lineterminator="\n")
        w.writeheader()
        w.writerows(filas)
    print("archivos resumidos: %d | sin resumen: %d %s" % (len(filas), len(fallos), fallos[:6]))
    for experimento in ("SAME", "SAME-R"):
        mias = [f for f in filas if f["experimento"] == experimento]
        print(experimento, "archivos:", len(mias), "| con corrida:", sum(1 for f in mias if f["corrida"]),
              "| corridas distintas:", len({f["corrida"] for f in mias if f["corrida"]}),
              "| sin material:", sum(1 for f in mias if not f["material"]))
        for _, s in DETECTORES:
            por = {}
            for f in mias:
                if f.get(s + "_cambio") and f["material"]:
                    por.setdefault(f["material"], []).append(abs(float(f[s + "_cambio"])))
            if por:
                print("   %-22s mediana del cambio absoluto por material: %s" % (
                    s, {k: "%.3g (%d)" % (statistics.median(v), len(v)) for k, v in sorted(por.items())}))


if __name__ == "__main__":
    main()
