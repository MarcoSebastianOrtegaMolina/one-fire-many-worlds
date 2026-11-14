"""Rellena las tablas de INVESTIGACION.md y data/README.md a partir de los CSV.

Cada tabla vive entre dos marcas, por ejemplo:
    <!-- TABLA:investigaciones -->
    ...
    <!-- /TABLA:investigaciones -->
El script reemplaza lo que hay entre las marcas y no toca el resto del texto.
Asi ninguna cifra de esas tablas se copia a mano.

Uso:  python scripts/generar_tablas_md.py
"""
import csv
import json
import re
from collections import defaultdict
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DATA = RAIZ / "data"


def leer(nombre):
    return list(csv.DictReader(open(DATA / nombre, encoding="utf-8-sig")))


def num(acc):
    return int(acc.split("-")[1])


def tabla(cab, filas):
    out = ["| " + " | ".join(cab) + " |", "|" + "|".join("---" for _ in cab) + "|"]
    for f in filas:
        out.append("| " + " | ".join(str(x).replace("|", "/").replace("\n", " ") for x in f) + " |")
    return "\n".join(out)


def rango(a, b, n, unidad=""):
    if not n or n == "0":
        return "sin dato"
    return "%s a %s%s (%s)" % (a, b, unidad, n) if a != b else "%s%s (%s)" % (a, unidad, n)


def main():
    inv = {r["id"]: r for r in leer("investigaciones.csv")}
    cla = {r["id"]: r for r in leer("clasificacion.csv")}
    cob = leer("cobertura.csv")
    manifest = json.loads((DATA / "raw" / "manifest.json").read_text(encoding="utf-8"))
    faltan = set(inv) - set(cla)
    if faltan:
        raise SystemExit("sin clasificar: %s" % sorted(faltan))

    orden_rel = {"alta": 0, "media": 1, "baja": 2, "no aplica": 3}

    def clave(acc):
        g = inv[acc]["grupo"]
        return (0 if g.startswith("combustion") else 1 if g.startswith("estudio") else 2,
                orden_rel.get(cla[acc]["relevancia_seguridad"], 9), num(acc))

    t = {}
    # --- investigaciones
    filas = []
    for acc in sorted(inv, key=clave):
        i, c = inv[acc], cla[acc]
        grupo = {"combustion_microgravedad": "vuelo", "estudio_en_tierra": "en tierra"}.get(i["grupo"], "fuera de alcance")
        nfil = "%s (%s)" % (i["n_filas_pruebas"], i["nivel_filas"].replace("_", " ")) if i["n_filas_pruebas"] != "0" else "sin tabla útil"
        filas.append(["[%s](%s)" % (acc, i["url"]), i["acronimo"] or "(sin acrónimo)", grupo, c["pilar_asignado"],
                      c["tipo_combustible"].split(" (")[0], c["equipo_normalizado"].split(" (la ficha")[0],
                      c["relevancia_seguridad"], nfil])
    t["investigaciones"] = tabla(["ID", "Acrónimo", "Grupo", "Pilar", "Combustible", "Equipo", "Relevancia", "Filas en pruebas.csv"], filas)

    # --- justificaciones
    filas = [[acc, inv[acc]["acronimo"] or "(sin acrónimo)", cla[acc]["origen_del_pilar"], cla[acc]["justificacion"]]
             for acc in sorted(inv, key=clave)]
    t["justificaciones"] = tabla(["ID", "Acrónimo", "De dónde sale el pilar", "Relevancia: dato e interpretación"], filas)

    # --- cobertura
    filas = []
    for c in cob:
        filas.append([c["id_investigacion"], c["acronimo"], c["tipo_combustible"].split(" (")[0],
                      "atmósfera" if c["oxigeno_referencia"] == "atmosfera" else "gas del quemador",
                      "%s (%s)" % (c["n_filas"], c["nivel_filas"].replace("_", " ")),
                      rango(c["o2_min_pct"], c["o2_max_pct"], c["n_con_oxigeno"], " %"),
                      rango(c["presion_min_psia"], c["presion_max_psia"], c["n_con_presion"], " psi"),
                      rango(c["flujo_min_cm_s"], c["flujo_max_cm_s"], c["n_con_flujo"], " cm/s"),
                      c["n_o2_30_o_mas"], c["n_presion_11_o_menos"], c["n_tipo_base_lunar"],
                      c["n_tipo_base_lunar_posible_matriz"]])
    t["cobertura"] = tabla(["ID", "Acrónimo", "Combustible", "El oxígeno es de", "Filas", "Oxígeno (filas con dato)",
                            "Presión (filas con dato)", "Flujo (filas con dato)", "O2 de 30 % o más",
                            "11 psi o menos", "Tipo base lunar", "Posible (matriz)"], filas)

    # --- cobertura por tipo de combustible
    filas = []
    for tipo in ("solido", "liquido", "gas"):
        ss = [c for c in cob if c["tipo_combustible"] == tipo and c["oxigeno_referencia"] == "atmosfera"]
        maxo2 = max([float(c["o2_max_pct"]) for c in ss if c["o2_max_pct"]] or [0])
        filas.append([{"solido": "sólido", "liquido": "líquido"}.get(tipo, tipo), sum(int(c["n_filas"]) for c in ss),
                      sum(int(c["n_con_oxigeno"]) for c in ss), "%.1f %%" % maxo2,
                      sum(int(c["n_o2_30_o_mas"]) for c in ss), sum(int(c["n_con_presion"]) for c in ss),
                      sum(int(c["n_presion_11_o_menos"]) for c in ss), sum(int(c["n_tipo_base_lunar"]) for c in ss),
                      sum(int(c["n_tipo_base_lunar_corte_exacto"]) for c in ss)])
    t["cobertura_tipo"] = tabla(["Combustible", "Filas", "Con oxígeno", "Oxígeno máximo", "Con 30 % o más",
                                 "Con presión", "Con 11 psi o menos", "Tipo base lunar (hasta 11 psi)",
                                 "Tipo base lunar (corte exacto 10.2 psi)"], filas)

    # --- DOI y cita
    filas = []
    for acc in sorted(inv, key=num):
        i = inv[acc]
        filas.append([acc, i["acronimo"] or "(sin acrónimo)", "[%s](https://doi.org/%s)" % (i["doi"], i["doi"]),
                      i["licencia"] or "no declara", i["fecha_modificacion"], i["cita_psi"]])
    t["doi"] = tabla(["ID", "Acrónimo", "DOI", "Licencia", "Ficha modificada",
                      "Cita, con la fórmula de \"Cite this Investigation\" del sitio"], filas)

    # --- archivos descargados
    por = defaultdict(lambda: [0, 0])
    docs = defaultdict(lambda: [0, 0])
    for rel, a in manifest["archivos"].items():
        partes = rel.split("/")
        por[partes[0]][0] += 1
        por[partes[0]][1] += a["bytes"]
        if partes[0] == "documentos":
            docs[partes[1]][0] += 1
            docs[partes[1]][1] += a["bytes"]
    fechas = sorted(a["fecha"] for a in manifest["archivos"].values())
    filas = [[k, v[0], "%.1f MB" % (v[1] / 1e6)] for k, v in sorted(por.items())]
    filas.append(["**total**", sum(v[0] for v in por.values()), "%.1f MB" % (sum(v[1] for v in por.values()) / 1e6)])
    t["archivos"] = tabla(["Carpeta de data/raw/", "Archivos", "Peso"], filas) + \
        "\n\nDescarga hecha entre %s y %s. Fallos registrados: %d." % (fechas[0], fechas[-1], len(manifest["fallos"]))
    # inventario completo (todo lo que no es dato crudo), bajado o no
    cat_corta = {"Science Documents": "ciencia", "Engineering Documents": "ingeniería", "Reference Data": "referencia",
                 "Reports": "reportes", "Presentations": "presentaciones", "Analyzed Data": "datos analizados",
                 "Calibration": "calibración"}
    hay = defaultdict(lambda: defaultdict(int))
    ruta_inv = DATA / "raw" / "inventario_archivos.csv"
    if ruta_inv.exists():
        for r in csv.DictReader(open(ruta_inv, encoding="utf-8")):
            if r["categoria"] in cat_corta:
                hay[r["id"]][cat_corta[r["categoria"]]] += 1
    filas = []
    for acc in sorted(inv, key=num):
        otros = ", ".join("%d de %s" % (n, c) for c, n in hay[acc].items() if c in ("presentaciones", "datos analizados", "calibración"))
        filas.append([acc, inv[acc]["acronimo"] or "(sin acrónimo)",
                      sum(hay[acc][c] for c in ("ciencia", "ingeniería", "referencia", "reportes")),
                      docs[acc][0] if acc in docs else 0,
                      "%.1f MB" % (docs[acc][1] / 1e6) if acc in docs else "",
                      otros or "nada"])
    t["documentos"] = tabla(["ID", "Acrónimo", "Documentos listados (ciencia, ingeniería, referencia y reportes)", "Bajados", "Peso",
                             "Sin bajar, de otras categorías"], filas)

    for ruta in (RAIZ / "INVESTIGACION.md", DATA / "README.md"):
        if not ruta.exists():
            print("no existe", ruta.name)
            continue
        txt = ruta.read_text(encoding="utf-8")
        for nombre, contenido in t.items():
            patron = re.compile(r"(<!-- TABLA:%s -->).*?(<!-- /TABLA:%s -->)" % (nombre, nombre), re.S)
            txt, n = patron.subn(lambda m: m.group(1) + "\n" + contenido + "\n" + m.group(2), txt)
            if n:
                print("%s: tabla '%s' actualizada" % (ruta.name, nombre))
        ruta.write_text(txt, encoding="utf-8", newline="\n")

    # comprobacion: las investigaciones futuras o ausentes no estan en la lista completa de PSI
    lista = json.loads((DATA / "raw" / "listas" / "todas.json").read_text(encoding="utf-8"))
    for termino in ("LUCI", "FM2", "SoFIE", "FLARE", "Lunar", "Moon"):
        hall = [h["_source"]["Accession"] for h in lista["hits"]["hits"]
                if re.search(r"\b%s\b" % termino, "%s %s" % (h["_source"].get("Acronym"), h["_source"].get("Title")), re.I)]
        print("en acronimo o titulo de las 133, '%s': %s" % (termino, hall or "ninguna"))


if __name__ == "__main__":
    main()
