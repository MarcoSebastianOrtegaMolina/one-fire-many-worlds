"""Mapa de cobertura: que oxigeno, presion y flujo probo de verdad cada investigacion,
y cuantas filas caen en cada ambiente de referencia de RETO.md.

Entrada:  data/pruebas.csv        Salida: data/cobertura.csv  (y un resumen en pantalla)

Ambientes de RETO.md:
  traje espacial        100 % O2 a 4.3 psi
  Tierra, nivel del mar aire normal a 14.7 psi
  base lunar y rovers   30 % O2 o mas, a 10.2 psi o menos (esperado)

Criterios usados aqui (son eleccion nuestra, no del enunciado):
  "tipo Tierra"  O2 entre 19.5 y 23.5 %
  "O2 lunar"     O2 maximo de la fila >= 30 %
  "presion lunar" presion minima de la fila <= 11 psi. El enunciado dice 10.2 psi o menos; se usa 11
                 porque FLEX tiene 103 pruebas a 0.7 atm nominales (10.2 a 10.5 psi medidos) que un
                 corte exacto en 10.2 dejaria fuera por decimas. Tambien se da el conteo con el corte
                 exacto en 10.2.
  "tipo base lunar" las dos cosas a la vez, en la misma fila de prueba. En los renglones de matriz
                 (FLEX-2) la tabla da intervalos y no dice si se combinaron: van aparte, como "posible".
Solo cuentan como atmosfera las filas con oxigeno_referencia = atmosfera. En las flamas
inversas el oxigeno sale del quemador hacia una camara con combustible: se reportan aparte.
"""
import csv
from collections import defaultdict
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
PSI_LUNAR, PSI_EXACTO, O2_LUNAR = 11.0, 10.2, 30.0


def f(x):
    return float(x) if x not in ("", None) else None


def rng(vals):
    vals = [v for v in vals if v is not None]
    return ("%.1f" % min(vals), "%.1f" % max(vals)) if vals else ("", "")


def main():
    filas = list(csv.DictReader(open(RAIZ / "data" / "pruebas.csv", encoding="utf-8-sig")))
    con_pruebas = {r["id_investigacion"] for r in filas if r["nivel_fila"] in ("prueba", "muestra")}
    grupos = defaultdict(list)
    for r in filas:
        if r["nivel_fila"] == "dia_de_prueba" and r["id_investigacion"] in con_pruebas:
            continue  # BRE: las mismas flamas ya estan una por una
        if r["nivel_fila"] == "dato_auxiliar" or r.get("duplicado_de_fila"):
            continue  # las filas repetidas de la tabla original no cuentan dos veces
        ref = "quemador" if r["oxigeno_referencia"].startswith("gas_del_quemador") else "atmosfera"
        grupos[(r["id_investigacion"], r["acronimo"], r["tipo_combustible"], ref)].append(r)

    cols = ["id_investigacion", "acronimo", "tipo_combustible", "oxigeno_referencia", "nivel_filas", "n_filas",
            "n_con_oxigeno", "o2_min_pct", "o2_max_pct", "n_con_presion", "presion_min_psia", "presion_max_psia",
            "n_con_flujo", "flujo_min_cm_s", "flujo_max_cm_s", "direcciones_de_flujo",
            "n_o2_tipo_tierra", "n_o2_entre_23_5_y_30", "n_o2_30_o_mas", "n_presion_11_o_menos",
            "n_presion_10_2_exacto_o_menos", "n_tipo_base_lunar", "n_tipo_base_lunar_corte_exacto",
            "n_tipo_base_lunar_posible_matriz", "n_o2_30_o_mas_sin_dato_de_presion"]
    salida = []
    for (acc, acr, tipo, ref), rs in sorted(grupos.items(), key=lambda k: (int(k[0][0].split("-")[1]), k[0][3])):
        o2 = [(f(r["oxigeno_pct_min"]), f(r["oxigeno_pct_max"])) for r in rs]
        pr = [(f(r["presion_psia_min"]), f(r["presion_psia_max"])) for r in rs]
        fl = [(f(r["flujo_cm_s_min"]), f(r["flujo_cm_s_max"])) for r in rs]
        o2a, o2b = rng([x for p in o2 for x in p])
        pa, pb = rng([x for p in pr for x in p])
        fa, fb = rng([x for p in fl for x in p])
        dirs = sorted({r["flujo_direccion"].split(" (")[0] for r in rs if r["flujo_direccion"]})
        es_matriz = [r["nivel_fila"].startswith("matriz") for r in rs]

        def cuenta_lunar(tope, matriz):
            return sum(1 for a, b, m in zip(o2, pr, es_matriz) if m == matriz and a[1] is not None
                       and a[1] >= O2_LUNAR and b[0] is not None and b[0] <= tope)

        lunar = cuenta_lunar(PSI_LUNAR, False)
        salida.append({
            "id_investigacion": acc, "acronimo": acr, "tipo_combustible": tipo, "oxigeno_referencia": ref,
            "nivel_filas": "; ".join(sorted({r["nivel_fila"] for r in rs})), "n_filas": len(rs),
            "n_con_oxigeno": sum(1 for a in o2 if a[0] is not None), "o2_min_pct": o2a, "o2_max_pct": o2b,
            "n_con_presion": sum(1 for a in pr if a[0] is not None), "presion_min_psia": pa, "presion_max_psia": pb,
            "n_con_flujo": sum(1 for a in fl if a[0] is not None), "flujo_min_cm_s": fa, "flujo_max_cm_s": fb,
            "direcciones_de_flujo": "; ".join(dirs),
            "n_o2_tipo_tierra": sum(1 for a in o2 if a[0] is not None and a[0] >= 19.5 and a[1] <= 23.5),
            "n_o2_entre_23_5_y_30": sum(1 for a in o2 if a[1] is not None and 23.5 < a[1] < O2_LUNAR),
            "n_o2_30_o_mas": sum(1 for a in o2 if a[1] is not None and a[1] >= O2_LUNAR),
            "n_presion_11_o_menos": sum(1 for b in pr if b[0] is not None and b[0] <= PSI_LUNAR),
            "n_presion_10_2_exacto_o_menos": sum(1 for b in pr if b[0] is not None and b[0] <= PSI_EXACTO),
            "n_tipo_base_lunar": lunar,
            "n_tipo_base_lunar_corte_exacto": cuenta_lunar(PSI_EXACTO, False),
            "n_tipo_base_lunar_posible_matriz": cuenta_lunar(PSI_LUNAR, True),
            "n_o2_30_o_mas_sin_dato_de_presion": sum(1 for a, b in zip(o2, pr) if a[1] is not None and a[1] >= O2_LUNAR and b[0] is None),
        })
    with open(RAIZ / "data" / "cobertura.csv", "w", newline="", encoding="utf-8-sig") as fh:
        w = csv.DictWriter(fh, fieldnames=cols, lineterminator="\n")
        w.writeheader()
        w.writerows(salida)

    print("%-8s %-14s %-8s %-9s %4s | %4s %5s-%-5s | %4s %5s-%-5s | %4s %5s-%-5s | T %4s  M %4s  L %4s  P %4s  BL %4s" % (
        "id", "acr", "tipo", "ref", "n", "nO2", "min", "max", "nP", "min", "max", "nF", "min", "max", "", "", "", "", ""))
    for s in salida:
        print("%-8s %-14s %-8s %-9s %4d | %4d %5s-%-5s | %4d %5s-%-5s | %4d %5s-%-5s | T %4d  M %4d  L %4d  P %4d  BL %4d" % (
            s["id_investigacion"], s["acronimo"][:14], s["tipo_combustible"][:8], s["oxigeno_referencia"], s["n_filas"],
            s["n_con_oxigeno"], s["o2_min_pct"], s["o2_max_pct"], s["n_con_presion"], s["presion_min_psia"],
            s["presion_max_psia"], s["n_con_flujo"], s["flujo_min_cm_s"], s["flujo_max_cm_s"],
            s["n_o2_tipo_tierra"], s["n_o2_entre_23_5_y_30"], s["n_o2_30_o_mas"], s["n_presion_11_o_menos"],
            s["n_tipo_base_lunar"]))
    print("T=O2 tipo Tierra  M=entre 23.5 y 30  L=O2>=30  P=presion<=11 psi  BL=O2>=30 y presion<=11 a la vez, sin renglones de matriz")

    # Totales por tipo de combustible (solo filas con oxigeno referido a la atmosfera)
    print("--- por tipo de combustible, atmosfera")
    for tipo in ("solido", "liquido", "gas"):
        ss = [s for s in salida if s["tipo_combustible"] == tipo and s["oxigeno_referencia"] == "atmosfera"]
        maxo2 = max([float(s["o2_max_pct"]) for s in ss if s["o2_max_pct"]] or [0])
        print("  %-8s filas=%d con_O2=%d O2_max=%.1f  >=30%%: %d  <=11psi: %d  base_lunar: %d" % (
            tipo, sum(s["n_filas"] for s in ss), sum(s["n_con_oxigeno"] for s in ss), maxo2,
            sum(s["n_o2_30_o_mas"] for s in ss), sum(s["n_presion_11_o_menos"] for s in ss),
            sum(s["n_tipo_base_lunar"] for s in ss)),
              "| corte exacto 10.2: %d | posible por matriz: %d" % (sum(s["n_tipo_base_lunar_corte_exacto"] for s in ss),
                                                                 sum(s["n_tipo_base_lunar_posible_matriz"] for s in ss)))
    # Detalle de las filas tipo base lunar
    print("--- filas tipo base lunar (O2>=30 y presion<=11 psi)")
    cuenta = defaultdict(list)
    for r in filas:
        if r.get("duplicado_de_fila"):
            continue
        a, p = f(r["oxigeno_pct_max"]), f(r["presion_psia_min"])
        if a is not None and p is not None and a >= O2_LUNAR and p <= PSI_LUNAR:
            cuenta[(r["id_investigacion"], r["acronimo"], r["oxigeno_referencia"][:9], r["nivel_fila"])].append((a, p, r["combustible_material"][:22]))
    for k, v in cuenta.items():
        print("  ", k, "n=%d" % len(v), "O2 %.0f-%.0f%%" % (min(x[0] for x in v), max(x[0] for x in v)),
              "P %.1f-%.1f psi" % (min(x[1] for x in v), max(x[1] for x in v)), sorted({x[2] for x in v})[:4])


if __name__ == "__main__":
    main()
