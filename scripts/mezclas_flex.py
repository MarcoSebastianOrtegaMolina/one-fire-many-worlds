"""Atmosferas realmente usadas en FLEX y FLEX-2, segun los archivos de mezcla de sus datos crudos.

Cada vez que se preparo la camara quedo un archivo <ID>_Mixture.txt con la composicion medida del gas:
O2, He, CO2, N2, Xe, vapor de agua y vapores de combustible, en porcentaje. El ID lleva una serie, el dia
del ano y una letra R (por ejemplo A109R01).

Entrada:  data/raw/documentos/PSI-68/Raw Data/*_Mixture.txt   (FLEX-2)
          data/raw/documentos/PSI-69/Raw Data/*_Mixture.txt   (FLEX)
          Se bajan con: descargar_documentos.py --inv PSI-68 PSI-69 --categorias "Raw Data" --nombres "_Mixture.txt"
Salida:   data/extra/flex_mezclas.csv, una fila por archivo.

La presion no viene en esos archivos: sale de <ID>_Chamber_Readings.txt del mismo llenado, si se bajo
(--nombres "R01_Chamber_Readings" ... "R05_Chamber_Readings"). Es la mediana de los cuatro transductores
FCU_MP_PT de la camara, en psia.

Uso:  python scripts/mezclas_flex.py
"""
import csv
import datetime
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DOCS = RAIZ / "data" / "raw" / "documentos"
SALIDA = RAIZ / "data" / "extra" / "flex_mezclas.csv"
GASES = ["O2", "He", "CO2", "N2", "Xe", "H20"]


def pct(x):
    try:
        return float(str(x).strip().rstrip("%"))
    except ValueError:
        return None


def presion_de(acc, ident):
    """Mediana de los transductores de presion de la camara durante el llenado, en psia."""
    # el nombre guardado lleva o no el prefijo "PSI-N_Raw Data_", segun como lo liste PSI
    rutas = list((DOCS / acc / "Raw Data").glob("*%s_Chamber_Readings.txt" % ident))
    if not rutas:
        return ""
    ruta = rutas[0]
    lineas = list(csv.reader(open(ruta, encoding="utf-8", errors="replace")))
    if len(lineas) < 3:
        return ""
    medianas = []
    for j, nombre in enumerate(lineas[0]):
        if not re.match(r"FCU_MP_PT\d+", nombre):
            continue
        vals = []
        for r in lineas[1:]:
            try:
                vals.append(float(r[j]))
            except (ValueError, IndexError):
                pass
        if vals:
            medianas.append(sorted(vals)[len(vals) // 2])
    return "%.2f" % sorted(medianas)[len(medianas) // 2] if medianas else ""


def main():
    filas = []
    for acc, experimento in (("PSI-69", "FLEX"), ("PSI-68", "FLEX-2")):
        for ruta in sorted((DOCS / acc / "Raw Data").glob("*_Mixture.txt")):
            nombre = re.sub(r"^PSI-\d+_Raw Data_", "", ruta.name)
            ident = nombre.split("_Mixture")[0].strip()
            lineas = [r for r in csv.reader(open(ruta, encoding="utf-8", errors="replace")) if any(c.strip() for c in r)]
            if len(lineas) < 2:
                filas.append({"experimento": experimento, "id_investigacion": acc, "id_mezcla": ident, "archivo": nombre,
                              "notas": "archivo sin datos"})
                continue
            cab = [c.strip() for c in lineas[0]]
            for n, valores in enumerate(lineas[1:], start=1):
                d = dict(zip(cab, [c.strip() for c in valores]))
                fecha = ""
                m = re.match(r"^(\d{1,2})/(\d{1,2})/(\d{4})\s+(\d{1,2}):(\d{2})", d.get("Date/Time", ""))
                if m:
                    fecha = datetime.datetime(int(m.group(3)), int(m.group(1)), int(m.group(2)), int(m.group(4)), int(m.group(5))).isoformat(timespec="minutes")
                fila = {"experimento": experimento, "id_investigacion": acc, "id_mezcla": ident, "archivo": nombre,
                        "renglon": n, "fecha_hora": fecha, "fecha_original": d.get("Date/Time", "")}
                for g in GASES:
                    v = pct(d.get(g, ""))
                    fila[g.replace("H20", "H2O") + "_pct"] = "" if v is None else "%.3f" % v
                vapores = {k: pct(v) for k, v in d.items() if k not in GASES + ["Date/Time"]}
                fila["presion_psia"] = presion_de(acc, ident)
                fila["vapores_de_combustible_pct"] = "; ".join("%s=%.3f" % (k, v) for k, v in vapores.items() if v)
                filas.append(fila)
    cols = ["experimento", "id_investigacion", "id_mezcla", "renglon", "fecha_hora", "fecha_original", "O2_pct", "He_pct",
            "CO2_pct", "N2_pct", "Xe_pct", "H2O_pct", "presion_psia", "vapores_de_combustible_pct", "archivo", "notas"]
    with open(SALIDA, "w", newline="", encoding="utf-8-sig") as fh:
        w = csv.DictWriter(fh, fieldnames=cols, lineterminator="\n", restval="")
        w.writeheader()
        w.writerows(filas)
    for experimento in ("FLEX", "FLEX-2"):
        mias = [f for f in filas if f["experimento"] == experimento and f.get("O2_pct")]
        o2 = [float(f["O2_pct"]) for f in mias]
        if not o2:
            print(experimento, "sin mezclas con datos")
            continue
        bandas = {}
        for v in o2:
            k = "menos de 19" if v < 19 else "19 a 23" if v < 23 else "23 a 28" if v < 28 else "28 a 33" if v < 33 else "33 o mas"
            bandas[k] = bandas.get(k, 0) + 1
        dil = {g: sum(1 for f in mias if f.get(g + "_pct") and float(f[g + "_pct"]) > 2) for g in ("He", "CO2", "Xe")}
        fechas = sorted(f["fecha_hora"] for f in mias if f["fecha_hora"])
        print("%-7s mezclas con dato: %d (archivos: %d) | O2 de %.1f a %.1f %% | por banda: %s | con mas de 2 %% de: %s | fechas %s a %s" % (
            experimento, len(mias), len({f["archivo"] for f in filas if f["experimento"] == experimento}), min(o2), max(o2),
            bandas, dil, fechas[0][:10] if fechas else "", fechas[-1][:10] if fechas else ""))
        conp = [f for f in mias if f.get("presion_psia")]
        bp = {}
        for f in conp:
            v = float(f["presion_psia"])
            k = "menos de 9" if v < 9 else "9 a 11.5" if v < 11.5 else "11.5 a 16.5" if v < 16.5 else "mas de 16.5"
            bp[k] = bp.get(k, 0) + 1
        lunar = [f for f in conp if float(f["O2_pct"]) >= 30 and float(f["presion_psia"]) <= 11]
        print("        con presion: %d | por banda (psia): %s | con O2 de 30 %% o mas y 11 psia o menos: %d %s" % (
            len(conp), bp, len(lunar), [(f["id_mezcla"], f["O2_pct"], f["presion_psia"], "He " + f["He_pct"]) for f in lunar][:8]))
        print("        O2 de 30 % o mas:", [(f["id_mezcla"], f["fecha_hora"][:10], f["O2_pct"], f.get("presion_psia"), "He " + f["He_pct"]) for f in mias if float(f["O2_pct"]) >= 30])
        altas = sorted(mias, key=lambda f: -float(f["O2_pct"]))[:3]
        print("        las de mas oxigeno:", [(f["id_mezcla"], f["fecha_hora"][:10], f["O2_pct"], "He " + f["He_pct"], "N2 " + f["N2_pct"]) for f in altas])


if __name__ == "__main__":
    main()
