"""Comprueba que las cifras escritas en INVESTIGACION.md siguen saliendo de los datos.

Recalcula cada cifra clave desde data/pruebas.csv y data/raw/manifest.json, arma la frase tal como
debe aparecer en el documento y dice si esta o no. Si los datos cambian y el texto no, aqui se ve.

Uso:  python scripts/verificar_cifras.py        (sale con codigo 1 si falta alguna frase)
"""
import collections
import csv
import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent


def f(x):
    return float(x) if x not in ("", None) else None


def fin(r):
    return r["resultado"].split(" ")[0].replace("fin=", "") or "sin dato"


def main():
    R = list(csv.DictReader(open(RAIZ / "data" / "pruebas.csv", encoding="utf-8-sig")))
    doc = re.sub(r"\s+", " ", (RAIZ / "INVESTIGACION.md").read_text(encoding="utf-8"))
    manifest = json.loads((RAIZ / "data" / "raw" / "manifest.json").read_text(encoding="utf-8"))

    unicas = [r for r in R if r["nivel_fila"] in ("prueba", "muestra") and not r["duplicado_de_fila"]]
    con_ambos = [r for r in unicas if r["oxigeno_pct_min"] and r["presion_psia_min"]]
    solidos = [r for r in R if r["tipo_combustible"] == "solido" and not r["duplicado_de_fila"] and r["nivel_fila"] != "dato_auxiliar"]
    sol_o2 = [r for r in solidos if r["oxigeno_pct_min"]]
    atm = [r for r in con_ambos if r["oxigeno_referencia"] == "atmosfera"]

    def lunar(o2, psi):
        return collections.Counter(r["acronimo"] for r in atm if f(r["oxigeno_pct_max"]) >= o2 and f(r["presion_psia_min"]) <= psi)

    l_exacto, l_11, l_265 = lunar(30, 10.2), lunar(30, 11), lunar(26.5, 11)
    bre = [r for r in unicas if r["id_investigacion"] == "PSI-20"]
    bre_82 = [r for r in bre if f(r["presion_psia_min"]) < 9.5]
    bre_102 = [r for r in bre if 9.5 <= f(r["presion_psia_min"]) < 11.5]
    bre_147 = [r for r in bre if f(r["presion_psia_min"]) >= 11.5 and f(r["oxigeno_pct_min"]) < 23]
    humo = [r for r in unicas if r["id_investigacion"] in ("PSI-101", "PSI-102") and r["nivel_fila"] == "prueba"]
    humo_tam = [r for r in humo if "diametro medio por conteo" in r["resultado"]]
    bass2 = [r for r in unicas if r["id_investigacion"] == "PSI-25"]
    dirs = collections.Counter(r["flujo_direccion"] for r in bass2)
    sin_o2 = collections.Counter(r["acronimo"] for r in solidos if not r["oxigeno_pct_min"])

    frases = [
        ("filas de pruebas.csv", "De ahí salieron {:,} filas".format(len(R))),
        ("pruebas distintas y con oxígeno y presión",
         "{:,} pruebas individuales distintas, {:,} de ellas con oxígeno".format(len(unicas), len(con_ambos))),
        ("sólidos con oxígeno", "De {} filas de sólidos, {} traen".format(len(solidos), len(sol_o2))),
        ("sólidos por debajo de 19.5 %", "{} de esas {} están por debajo de 19.5 %".format(
            sum(1 for r in sol_o2 if f(r["oxigeno_pct_min"]) < 19.5), len(sol_o2))),
        ("oxígeno máximo en sólidos", "por encima de {:.1f} % de oxígeno".format(max(f(r["oxigeno_pct_max"]) for r in sol_o2))),
        ("sólidos sin oxígeno", "Las {} filas de sólidos sin oxígeno son de humo (SAME-R {}, SAME {})".format(
            sum(sin_o2.values()), sin_o2["SAME-R"], sin_o2["SAME"])),
        ("sólidos con flujo", "Flujo en cm/s en {} de {} filas".format(sum(1 for r in solidos if r["flujo_cm_s_min"]), len(solidos))),
        ("tipo base lunar, corte exacto y 11 psi", "hay {} pruebas (BRE {}, CFI-G {}); con 11 psi, {}".format(
            sum(l_exacto.values()), l_exacto["ACME BRE"], l_exacto["ACME CFI-G"], sum(l_11.values()))),
        ("tipo base lunar con 26.5 %", "son {} (BRE {}, CFI-G {}, FLEX {})".format(
            sum(l_265.values()), l_265["ACME BRE"], l_265["ACME CFI-G"], l_265["FLEX"])),
        ("pruebas de BRE", "trae {} pruebas con oxígeno, presión y desenlace".format(len(bre))),
        ("BRE a 14.7 psia y poco oxígeno", "las {} flamas se autoextinguieron".format(sum(1 for r in bre_147 if fin(r) == "SE"))),
        ("BRE a 8.2 psia", "{} de {} siguieron ardiendo".format(sum(1 for r in bre_82 if fin(r) == "FT"), len(bre_82))),
        ("BRE a 10.2 psia", "{} de {} se autoextinguieron".format(sum(1 for r in bre_102 if fin(r) == "SE"), len(bre_102))),
        ("propuesta A", "Ahora {:,} pruebas traen".format(len(con_ambos))),
        ("corridas de humo", "{} corridas con material y flujo, {} de ellas con tamaño de partícula".format(len(humo), len(humo_tam))),
        ("dirección del flujo en BASS-II", "BASS-II ({} pruebas: {} opuesto, {} concurrente, {} estancamiento)".format(
            sum(1 for r in bass2 if r["flujo_direccion"]), dirs["opuesto"], dirs["concurrente"], dirs["estancamiento"])),
        ("resultados de BASS-II", "{} con observaciones, {} con dirección, {} con velocidad de propagación y {} con desenlace".format(
            sum(1 for r in bass2 if r["resultado"]), sum(1 for r in bass2 if r["flujo_direccion"]),
            sum(1 for r in bass2 if "velocidad de propagacion mm s=" in r["resultado"]),
            sum(1 for r in bass2 if "desenlace segun tabla 7 1=" in r["resultado"]))),
        ("documentos bajados", "y {} documentos de apoyo".format(sum(1 for k in manifest["archivos"] if k.startswith("documentos/")))),
    ]
    faltan = 0
    for nombre, frase in frases:
        esta = frase in doc
        faltan += 0 if esta else 1
        print("%-5s %-42s %s" % ("ok" if esta else "FALTA", nombre, frase))
    print("\n%d de %d frases coinciden con los datos." % (len(frases) - faltan, len(frases)))
    return 1 if faltan else 0


if __name__ == "__main__":
    sys.exit(main())
