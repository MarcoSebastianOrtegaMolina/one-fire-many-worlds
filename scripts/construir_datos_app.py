"""Convierte los CSV limpios en los datos que lee la plataforma (app/data/).

Entrada:  data/pruebas.csv, data/investigaciones.csv, data/clasificacion.csv, data/publicaciones.csv,
          data/extra/same_respuesta_detectores.csv, data/raw/tablas/PSI-99 (Saffire-II, 0 g contra 1 g)
Salida:   app/data/data.js    window.OFMW = {...}; se carga con <script>, asi la pagina abre sin servidor
          app/data/tests.csv  las mismas pruebas, en ingles, para descargar

La interfaz va en ingles: aqui se traducen las etiquetas que la limpieza dejo en espanol. Nada se
inventa: cada prueba conserva su tabla y su fila de origen. Los criterios de cada mundo son los de
scripts/cobertura.py y se comprueban contra data/cobertura.csv al final.

Uso:  python scripts/construir_datos_app.py
"""
import csv
import json
import re
import statistics
import sys
from collections import Counter, defaultdict
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SAL = RAIZ / "app" / "data"

# ---------------------------------------------------------------- traducciones
CLAVES = {
    "fin": "end", "tiempo final s": "final time (s)", "flujo cm s": "flow (cm/s)", "ancho cm": "width (cm)",
    "velocidad de propagacion mm s": "spread rate (mm/s)", "tiempo de quemado min": "burn time (min)",
    "lados ardiendo": "sides burning", "espesor mm": "thickness (mm)",
    "desenlace segun tabla 7 1": "outcome (report table 7.1)", "analisis completo": "full analysis",
    "tasa de quemado caliente mm2 s": "hot burning rate (mm2/s)", "tiempo de flama caliente s": "hot flame time (s)",
    "diametro de extincion caliente mm": "hot extinction diameter (mm)",
    "tasa de quemado fria mm2 s": "cool burning rate (mm2/s)",
    "diametro de extincion fria mm": "cool extinction diameter (mm)", "reigniciones": "reignitions",
    "tiempo de quemado s": "burn time (s)", "tasa de quemado": "burning rate",
    "diametro de extincion mm": "extinction diameter (mm)", "tiempo de quemado": "burn time",
    "largo quemado microgravedad": "burn length in microgravity",
    "propagacion microgravedad": "spread rate in microgravity",
    "diametro medio por conteo nm": "count mean diameter (nm)",
    "diametro de masa promedio nm": "diameter of average mass (nm)", "sigma g": "sigma g",
    "perdida de masa": "mass loss", "GMT flama apagada": "flame out (GMT)", "ignicion caliente": "hot ignition",
    "color": "color", "flama fria": "cool flame",
}
FRASES = [  # se aplican en orden a valores, formas, supresores y materiales
    ("se autoextinguio", "self-extinguished"), ("se corto el combustible", "fuel flow terminated"),
    ("con oscilaciones", "with oscillations"), ("con oscilacion", "with oscillation"),
    ("quemador plano poroso (el diametro no viene en esta tabla)", "flat porous burner (diameter not in this table)"),
    ("quemador de ", "burner, "), ("gota libre de ", "free droplet, "),
    ("gota sostenida en fibra de ", "fiber-supported droplet, "), ("gota de ", "droplet, "),
    (" de diametro inicial", " initial diameter"), ("boquilla de ", "nozzle, "),
    ("gota sostenida en fibra", "fiber-supported droplet"), ("gota libre", "free droplet"), ("gota", "droplet"),
    (" en la camara (Xf antes=", " in the chamber (Xf before="),
    (" en la camara (XC2H4 inicial=", " in the chamber (initial XC2H4="), (" en la camara", " in the chamber"),
    ("coflujo (por el titulo del experimento)", "coflow (per the experiment title)"),
    ("espesor=", "thickness="), ("largo=", "length="), ("ancho=", "width="),
    ("ninguno (solo ", "none (only "), ("la tabla no lo dice; el reporte final habla de", "not in the table; the final report mentions"),
    ("en el combustible y en la atmosfera", "in the fuel and in the atmosphere"),
    ("no dice con que se diluyo el combustible", "fuel diluent not stated"),
    ("en el oxidante del quemador", "in the burner oxidizer"), ("en el combustible", "in the fuel"),
    ("aplicado", "applied"), ("flamas de etileno y nitrogeno", "ethylene and nitrogen flames"),
    ("mezclas de propileno y nitrogeno", "propylene and nitrogen mixtures"),
    ("mezcla de etileno y nitrogeno", "ethylene and nitrogen mixture"),
    ("mezcla de metano y nitrogeno", "methane and nitrogen mixture"),
    ("flamas de metano y nitrogeno", "methane and nitrogen flames"), (" con N2", " with N2"),
    ("si", "yes"),
]
FAMILIAS = {
    "PMMA (acrilico)": "PMMA (acrylic)", "SIBAL (tela de algodon y fibra de vidrio)": "SIBAL (cotton-fiberglass fabric)",
    "silicon": "Silicone", "mecha de lampara (lampwick)": "Lampwick", "cera": "Wax",
    "no especificado en la tabla": "Not specified in the table", "PMMA (acrilico) + Nomex": "PMMA + Nomex",
    "Teflon": "Teflon", "Kapton": "Kapton", "Pyrell": "Pyrell", "Nomex": "Nomex", "Ultem": "Ultem",
}
FRENTES = {"prevención": "prevention", "detección": "detection", "supresión": "suppression",
           "supresión y ciencia básica": "suppression", "ciencia básica": "basic science",
           "detección (contexto)": "detection", "fuera de alcance": "out of scope"}
RELEVANCIA = {"alta": "high", "media": "medium", "baja": "low", "no aplica": "n/a"}
TIPOS = {"solido": "solid", "liquido": "liquid", "gas": "gas"}
EQUIPOS = {"CIR (inserto ACME)": "CIR with the ACME insert", "CIR (MDCA)": "CIR with the MDCA droplet apparatus",
           "MSG": "Microgravity Science Glovebox (MSG)", "Cygnus": "Cygnus cargo vehicle",
           "sin equipo de vuelo (estudio en tierra)": "Ground study, no flight hardware"}
DIRECCIONES = {"opuesto": "opposed", "concurrente": "concurrent", "estancamiento": "stagnation",
               "coflujo": "coflow", "opuesto (segun el texto del material)": "opposed (per the material text)"}


def frases(texto):
    for viejo, nuevo in FRASES[:-1]:
        texto = texto.replace(viejo, nuevo)
    return texto


def f(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return None


def medio(a, b):
    a, b = f(a), f(b)
    if a is None and b is None:
        return None
    if a is None or b is None:
        return a if b is None else b
    return round((a + b) / 2, 2)


def leer(nombre):
    return list(csv.DictReader(open(RAIZ / "data" / nombre, encoding="utf-8-sig")))


def resultado_en(texto):
    """'clave=valor; clave=valor' con las claves traducidas. Devuelve (texto, dict)."""
    partes, d = [], {}
    for parte in texto.split("; "):
        if "=" in parte:
            k, v = parte.split("=", 1)
            k = CLAVES.get(k.strip(), k.strip())
            v = frases(v.strip())
            d[k] = v
            partes.append(k + ": " + v)
        elif parte.strip():
            partes.append(parte.strip())
    return "; ".join(partes), d


def desenlace(acr, d, crudo):
    """Clase de desenlace: out (se apago sola), burn (siguio ardiendo), none (no encendio o no propago), ''."""
    fin = d.get("end", "")
    if acr in ("ACME BRE", "ACME CFI-G"):
        return "out" if fin.startswith("SE") else "burn" if fin.startswith("FT") else ""
    if acr == "FLEX":
        return {"Extinction": "out", "Completion": "burn"}.get(fin, "")
    if acr == "BASS-II":
        o = d.get("outcome (report table 7.1)", "")
        if o in ("Quenched", "Blow-off"):
            return "out"
        if o in ("No ignition", "Reused, did not ignite"):
            return "none"
        if o == "No blowoff":
            return "burn"
        return ""
    if acr == "SAFFIRE-II":
        largo = d.get("burn length in microgravity", "")
        return "none" if largo.strip().startswith("~ 0") else "burn" if largo else ""
    return ""


def main():
    R = leer("pruebas.csv")
    U = [r for r in R if r["nivel_fila"] in ("prueba", "muestra") and not r["duplicado_de_fila"]]
    INV = {r["id"]: r for r in leer("investigaciones.csv")}
    CLA = {r["id"]: r for r in leer("clasificacion.csv")}
    PUB = Counter(r["id_investigacion"] for r in leer("publicaciones.csv"))

    # ------------------------------------------------------------ pruebas
    tests = []
    for n, r in enumerate(U):
        res, d = resultado_en(r["resultado"])
        fam = FAMILIAS.get(r["material_familia"], r["material_familia"])
        tests.append({
            "n": n, "inv": r["id_investigacion"], "acr": r["acronimo"], "id": r["id_prueba"], "date": r["fecha"],
            "type": TIPOS.get(r["tipo_combustible"].split(" ")[0], ""),
            "fuel": frases(r["combustible_material"]), "family": fam,
            "shape": frases(r["forma_tamano"]),
            "o2": medio(r["oxigeno_pct_min"], r["oxigeno_pct_max"]),
            "o2min": f(r["oxigeno_pct_min"]), "o2max": f(r["oxigeno_pct_max"]),
            "ref": "burner" if r["oxigeno_referencia"].startswith("gas_del_quemador") else "atmosphere",
            "p": medio(r["presion_psia_min"], r["presion_psia_max"]), "pmin": f(r["presion_psia_min"]),
            "flow": medio(r["flujo_cm_s_min"], r["flujo_cm_s_max"]),
            "dir": DIRECCIONES.get(r["flujo_direccion"], frases(r["flujo_direccion"])),
            "dil": frases(r["diluyente_supresor"]), "res": res, "out": desenlace(r["acronimo"], d, r["resultado"]),
            "src": r["tabla_origen"], "row": r["fila_origen"],
        })

    # ------------------------------------------------------------ mundos
    def en(t, o2a, o2b, pa, pb):
        return (t["ref"] == "atmosphere" and t["o2min"] is not None and t["pmin"] is not None
                and t["o2max"] >= o2a and t["o2min"] <= o2b and pa <= t["pmin"] <= pb)

    def cuenta(lista):
        return {"total": len(lista), "byType": dict(Counter(t["type"] for t in lista)),
                "byInv": dict(Counter(t["inv"] for t in lista))}

    luna = [t for t in tests if t["ref"] == "atmosphere" and t["o2max"] is not None and t["pmin"] is not None
            and t["o2max"] >= 30 and t["pmin"] <= 11]
    luna_exacto = [t for t in luna if t["pmin"] <= 10.2]
    estacion = [t for t in tests if en(t, 19.5, 23.5, 13.5, 16)]
    aire_sin_presion = [t for t in tests if t["ref"] == "atmosphere" and t["o2min"] is not None and t["pmin"] is None
                        and t["o2max"] >= 19.5 and t["o2min"] <= 23.5]
    traje = [t for t in tests if t["ref"] == "atmosphere" and t["o2max"] is not None and t["pmin"] is not None
             and t["o2max"] >= 95 and t["pmin"] <= 5]
    con_ambos = [t for t in tests if t["o2min"] is not None and t["pmin"] is not None]
    o2_atm = [t["o2max"] for t in tests if t["ref"] == "atmosphere" and t["o2max"] is not None]
    p_todas = [t["pmin"] for t in tests if t["pmin"] is not None]

    mundos = [
        {"id": "station", "name": "Station and spacecraft", "gravity": "microgravity", "g": 0,
         "air": "Earth-like air: about 21 % oxygen at 14.7 psi", "zone": {"o2": [19.5, 23.5], "p": [13.5, 16]},
         "near": cuenta(estacion), "nearNote": "Oxygen 19.5 to 23.5 % with pressure 13.5 to 16 psi",
         "extra": {"label": "Same oxygen, pressure not reported", "n": len(aire_sin_presion)}},
        {"id": "moon", "name": "Moon base and rover", "gravity": "1/6 of Earth gravity", "g": 0.165,
         "air": "30 % oxygen or more at 10.2 psi or less (expected)", "zone": {"o2": [30, 100], "p": [0, 11]},
         "near": cuenta(luna), "nearNote": "Oxygen 30 % or more with pressure 11 psi or less",
         "extra": {"label": "With the exact 10.2 psi cut", "n": len(luna_exacto)}},
        {"id": "suit", "name": "Spacesuit", "gravity": "depends on where it is worn", "g": None,
         "air": "100 % oxygen at 4.3 psi", "zone": {"o2": [95, 100], "p": [0, 5]},
         "near": cuenta(traje), "nearNote": "Oxygen 95 % or more with pressure 5 psi or less",
         "extra": {"label": "Highest ambient oxygen and lowest pressure ever tested",
                   "text": "%.0f %% and %.1f psi" % (max(o2_atm), min(p_todas))}},
        {"id": "mars", "name": "Mars habitat", "gravity": "about 3/8 of Earth gravity", "g": 0.38,
         "air": "Not specified in the challenge", "zone": None, "near": cuenta([]),
         "nearNote": "No partial-gravity combustion data exists in PSI",
         "extra": {"label": "Partial-gravity tests in PSI", "n": 0}},
        {"id": "earth", "name": "Earth", "gravity": "normal gravity", "g": 1,
         "air": "About 21 % oxygen at 14.7 psi", "zone": {"o2": [19.5, 23.5], "p": [13.5, 16]},
         "near": cuenta([]), "nearNote": "PSI holds flight data; normal-gravity results come from one paired test",
         "extra": {"label": "Samples burned in orbit and compared with normal gravity", "n": 0}},
    ]

    # Saffire-II: 0 g contra 1 g, de la tabla original
    pares = []
    tabla = next((RAIZ / "data" / "raw" / "tablas" / "PSI-99").glob("*.csv"))
    material = ""
    for fila in csv.DictReader(open(tabla, encoding="utf-8-sig")):
        k = {c.strip(): (v or "").strip() for c, v in fila.items() if c}
        if not re.match(r"\d-\d", k.get("Sample Number", "")):
            continue
        material = k.get("Material") or material
        cols = list(k)
        g0 = [c for c in cols if c.endswith("g Burn Length") and not c.startswith("1-g")][0]
        s0 = [c for c in cols if c.endswith("g Spread Length") and not c.startswith("1-g")][0]
        pares.append({"sample": k["Sample Number"], "material": material,
                      "thickness": k.get("Samle Thickness", ""), "flowDir": k.get("Flow Direction", ""),
                      "o2": k.get("Percent O2 (Note 1)", ""), "flow": k.get("Air Flow (cm/s)", ""),
                      "microBurn": k[g0], "microSpread": k[s0],
                      "normalBurn": k.get("1-g Burn Length", ""), "normalSpread": k.get("1-g Spread Rate", ""),
                      "src": tabla.name})
    mundos[4]["extra"]["n"] = len(pares)

    # ------------------------------------------------------------ investigaciones
    por_inv = defaultdict(list)
    for t in tests:
        por_inv[t["inv"]].append(t)

    def rango(vals, dec=1):
        vals = [v for v in vals if v is not None]
        return [round(min(vals), dec), round(max(vals), dec)] if vals else None

    invs = []
    for pid, c in CLA.items():
        i = INV[pid]
        ts = por_inv.get(pid, [])
        frente = FRENTES.get(c["pilar_asignado"], c["pilar_asignado"])
        if frente == "out of scope":
            continue
        varia = []
        for clave, nombre in (("fuel", "fuel or material"), ("o2", "oxygen"), ("p", "pressure"), ("flow", "airflow"),
                              ("dir", "flow direction"), ("dil", "diluent or suppressant"), ("shape", "shape and size")):
            if len({t[clave] for t in ts if t[clave] not in (None, "")}) > 1:
                varia.append(nombre)
        invs.append({
            "id": pid, "acr": i["acronimo"] or pid, "title": i["titulo"], "doi": i["doi"], "url": i["url"],
            "platform": i["plataforma"], "facility": i["equipo"], "start": i["fecha_inicio"][:4], "end": i["fecha_fin"][:4],
            "group": "ground study" if i["grupo"] == "estudio_en_tierra" else "flight",
            "objectives": i["objetivos"], "approach": i["enfoque"], "hypothesis": i["hipotesis"],
            "earth": i["beneficios_tierra"], "keywords": i["palabras_clave"], "related": i["investigaciones_relacionadas"],
            "hw": EQUIPOS.get(c["equipo_normalizado"], "Other hardware"), "front": frente, "relevance": RELEVANCIA.get(c["relevancia_seguridad"], ""),
            "fuelType": TIPOS.get(c["tipo_combustible"].replace("ó", "o").replace("í", "i").split(" ")[0], "other"),
            "tests": len(ts), "rowsInPsi": i["n_filas_pruebas"], "pubs": PUB.get(pid, 0), "cite": i["cita_psi"],
            "license": i["licencia"], "version": i["version_ficha"], "modified": i["fecha_modificacion"],
            "o2": rango([t["o2min"] for t in ts if t["ref"] == "atmosphere"] + [t["o2max"] for t in ts if t["ref"] == "atmosphere"]),
            "p": rango([t["pmin"] for t in ts]), "flow": rango([t["flow"] for t in ts]),
            "fuels": [k for k, _ in Counter(t["family"] or t["fuel"] for t in ts).most_common(8)],
            "measures": [k for k, _ in Counter(k.strip() for t in ts for k in re.findall(r"(?:^|; )([^:;]{3,48}): ", t["res"])).most_common(7)],
            "varied": varia, "outcomes": dict(Counter(t["out"] for t in ts if t["out"])),
            "nearMoon": sum(1 for t in luna if t["inv"] == pid), "nearStation": sum(1 for t in estacion if t["inv"] == pid),
        })
    invs.sort(key=lambda x: int(x["id"].split("-")[1]))

    # ------------------------------------------------------------ materiales
    det = defaultdict(list)
    for d in csv.DictReader(open(RAIZ / "data" / "extra" / "same_respuesta_detectores.csv", encoding="utf-8-sig")):
        v = f(d["iss_oscurecimiento_V_cambio"])
        if d["experimento"] == "SAME-R" and d["material"] and v is not None:
            det[d["material"]].append(abs(v))  # la senal de oscurecimiento baja con el humo: se guarda la magnitud
    mats = []
    fams = defaultdict(list)
    for t in tests:
        if t["type"] == "solid" and t["family"] and t["family"] not in ("Not specified in the table", "PMMA + Nomex"):
            fams[t["family"]].append(t)
    for fam, ts in sorted(fams.items(), key=lambda kv: -len(kv[1])):
        humo = [t for t in ts if t["acr"] in ("SAME", "SAME-R")]
        humo_r = [t for t in humo if t["acr"] == "SAME-R"]
        fuego = [t for t in ts if t["acr"] not in ("SAME", "SAME-R")]
        diam = []
        for t in humo_r:
            m = re.search(r"count mean diameter \(nm\): ([0-9.]+)", t["res"])
            if m:
                diam.append(float(m.group(1)))
        clave_det = fam if fam in det else {"Lampwick": "Lampwick"}.get(fam, fam)
        mats.append({
            "name": fam, "tests": len(ts), "byInv": dict(Counter(t["acr"] for t in ts)),
            "burn": {"tests": len(fuego), "o2": rango([t["o2"] for t in fuego]), "flow": rango([t["flow"] for t in fuego]),
                     "outcomes": dict(Counter(t["out"] for t in fuego if t["out"]))},
            "smoke": {"runs": len(humo), "withSize": len(diam),
                      "medianDiameterNm": int(statistics.median(diam)) if diam else None,
                      "detectorRuns": len(det.get(clave_det, [])),
                      "detectorMedianV": round(statistics.median(det[clave_det]), 3) if det.get(clave_det) else None},
        })

    resumen = {"tests": len(tests), "withO2AndPressure": len(con_ambos), "investigations": len(invs),
               "flight": sum(1 for i in invs if i["group"] == "flight"),
               "solidsMaxO2": max(t["o2max"] for t in tests if t["type"] == "solid" and t["o2max"] is not None),
               "years": [min(t["date"][:4] for t in tests if t["date"][:4].isdigit()),
                         max(t["date"][:4] for t in tests if t["date"][:4].isdigit())],
               "built": "2026-11-14", "source": "NASA PSI Data Repository, downloaded 2026-11-13"}

    datos = {"summary": resumen, "worlds": mundos, "gravityPairs": pares, "investigations": invs,
             "materials": mats, "tests": tests}
    SAL.mkdir(parents=True, exist_ok=True)
    cuerpo = json.dumps(datos, ensure_ascii=False, separators=(",", ":"))
    (SAL / "data.js").write_text("window.OFMW=" + cuerpo + ";\n", encoding="utf-8", newline="\n")
    cols = ["inv", "acr", "id", "date", "type", "fuel", "family", "shape", "o2min", "o2max", "ref", "pmin", "flow",
            "dir", "dil", "out", "res", "src", "row"]
    with open(SAL / "tests.csv", "w", encoding="utf-8", newline="") as fh:
        w = csv.writer(fh, lineterminator="\n")
        w.writerow(["investigation", "acronym", "test_id", "date", "fuel_type", "fuel_or_material", "material_family",
                    "shape_and_size", "oxygen_pct_min", "oxygen_pct_max", "oxygen_reference", "pressure_psia",
                    "flow_cm_s", "flow_direction", "diluent_or_suppressant", "outcome_class", "result",
                    "source_table", "source_row"])
        for t in tests:
            w.writerow(["" if t[c] is None else t[c] for c in cols])

    # ------------------------------------------------------------ comprobaciones contra cobertura.csv
    cob = leer("cobertura.csv")
    esperado = sum(int(r["n_tipo_base_lunar"] or 0) for r in cob if r["oxigeno_referencia"] == "atmosfera")
    exacto = sum(int(r["n_tipo_base_lunar_corte_exacto"] or 0) for r in cob if r["oxigeno_referencia"] == "atmosfera")
    fallas = []
    if len(luna) != esperado:
        fallas.append("tipo base lunar: %d aqui, %d en cobertura.csv" % (len(luna), esperado))
    if len(luna_exacto) != exacto:
        fallas.append("corte exacto: %d aqui, %d en cobertura.csv" % (len(luna_exacto), exacto))
    espanol = re.compile(r"\b(de|del|la|el|los|las|con|que|sin|segun|solo|ninguno|quemador|gota|mezcla)\b")
    restos = Counter()
    for t in tests:
        for campo in ("fuel", "shape", "dil", "dir"):
            if espanol.search(t[campo] or ""):
                restos[(campo, re.sub(r"[0-9.]+", "#", t[campo] or "")[:110])] += 1
        for k in re.findall(r"(?:^|; )([^:;]+): ", t["res"]):
            if espanol.search(k):
                restos[("res", k[:70])] += 1

    print("data.js: %.0f KB | pruebas %d | con O2 y presion %d | investigaciones %d | materiales %d"
          % (len(cuerpo.encode("utf-8")) / 1024, len(tests), len(con_ambos), len(invs), len(mats)))
    for m in mundos:
        print("  %-24s cerca=%-4s %s | %s" % (m["name"], m["near"]["total"], m["near"]["byType"], m["extra"]))
    print("  desenlaces:", dict(Counter(t["out"] or "(sin clase)" for t in tests)))
    print("  pares 0 g / 1 g:", len(pares))
    for m in mats:
        print("  material %-34s pruebas=%-3s humo=%s" % (m["name"], m["tests"], m["smoke"]))
    if restos:
        print("  TEXTO QUE PARECE ESPANOL (%d distintos):" % len(restos))
        for (campo, txt), n in restos.most_common(25):
            print("   ", campo, n, "|", txt)
    for x in fallas:
        print("  FALLA:", x)
    sys.exit(1 if fallas else 0)


if __name__ == "__main__":
    main()
