"""Convierte lo bajado de PSI (data/raw/) en dos tablas limpias:

  data/investigaciones.csv   una fila por investigacion (sale de la ficha y de la lista)
  data/pruebas.csv           una fila por prueba, muestra, dia de prueba o renglon de matriz

Regla: nada se inventa. Lo que la tabla original no trae queda vacio. Cada fila de
pruebas.csv dice de que archivo y de que registro salio (tabla_origen, fila_origen).
El mapeo columna por columna esta explicado en data/README.md.

Uso:  python scripts/limpiar_psi.py
"""
import csv
import datetime
import io
import json
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
RAW = RAIZ / "data" / "raw"
SALIDA = RAIZ / "data"

ATM_KPA, BAR_KPA, MMHG_KPA, PSI_KPA = 101.325, 100.0, 0.1333224, 6.894757

COLS = [
    "id_investigacion", "acronimo", "tabla_origen", "fila_origen", "nivel_fila", "id_prueba",
    "fecha", "fecha_original", "combustible_material", "material_familia", "tipo_combustible",
    "forma_tamano", "oxigeno_pct_min", "oxigeno_pct_max", "oxigeno_original", "oxigeno_referencia",
    "presion_original", "presion_kpa_min", "presion_kpa_max", "presion_psia_min", "presion_psia_max",
    "flujo_original", "flujo_cm_s_min", "flujo_cm_s_max", "flujo_direccion",
    "diluyente_supresor", "resultado", "notas", "duplicado_de_fila",
]

# Investigaciones que salieron en la busqueda pero no son de combustion (ver README).
FUERA = {"PSI-77": "soldadura en el espacio (ISSI); salio por la palabra 'flame'",
         "PSI-108": "conveccion por tension superficial (STDCE-1); fisica de fluidos",
         "PSI-181": "soldaduras Pb-Sn; ciencia de materiales",
         "PSI-179": "muestreo de aerosoles de cabina (ASE); no quema nada, pero toca deteccion"}

# La tabla de SAME-R da dia y mes sin ano. La ficha dice: "SAME-R flight tests were conducted
# from July 16, to September 9, 2010"; las fechas de la tabla van del 16-Jul al 9-Sep. main() lo comprueba.
ANIO_SAME_R = 2010
# La tabla de SPICE da el dia del ano sin ano. Su reporte de 30 dias (Reports de PSI-107, pag. 5) dice:
# "The SPICE module was brought to the ISS in 2008. It was operated in the MSG by various crew members
# in 2009", y menciona una limpieza el 15 de junio, que cae entre los dias 136 y 167 de la tabla.
ANIO_SPICE = 2009

MESES = {"jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6, "jul": 7, "aug": 8,
         "sep": 9, "oct": 10, "nov": 11, "dec": 12}


# ---------- utilidades ----------

def leer_tabla(ruta):
    b = ruta.read_bytes()
    try:
        t = b.decode("utf-8-sig")
    except UnicodeDecodeError:
        t = b.decode("cp1252")
    return [[c.strip().replace("\r", " ").replace("\n", " ") for c in f] for f in csv.reader(io.StringIO(t))]


def limpio(s):
    return re.sub(r"\s+", " ", str(s or "")).strip()


def numeros(texto):
    return [float(x) for x in re.findall(r"(?<![\w.])\d*\.?\d+", texto or "")]


def fmt(x):
    if x is None or x == "":
        return ""
    return ("%.4f" % x).rstrip("0").rstrip(".")


def rango(vals, factor=1.0):
    vals = [v * factor for v in vals]
    return (min(vals), max(vals)) if vals else (None, None)


def iso(a, m, d):
    try:
        return datetime.date(int(a), int(m), int(d)).isoformat()
    except (ValueError, TypeError):
        return ""


def mes(txt):
    t = limpio(txt).lower().rstrip(".")
    if t.isdigit():
        return int(t)
    return MESES.get(t[:3])


def fecha_mdy(txt):
    m = re.match(r"^(\d{1,2})/(\d{1,2})/(\d{4}|\d{2})$", limpio(txt))
    if not m:
        return ""
    anio = int(m.group(3))
    return iso(anio if anio > 99 else 2000 + anio, m.group(1), m.group(2))


def fecha_d_mon_yy(txt):
    m = re.match(r"^(\d{1,2})-([A-Za-z]{3})-(\d{2})$", limpio(txt))
    return iso(2000 + int(m.group(3)), MESES.get(m.group(2).lower()), m.group(1)) if m else ""


def fecha_yyddd(txt):
    """Formato YYDDD, documentado en las notas de las tablas de ACME (CLD, E-FIELD, s-Flame)."""
    m = re.match(r"^(\d{2})(\d{3})$", limpio(txt))
    if not m or not 1 <= int(m.group(2)) <= 366:
        return ""
    return (datetime.date(2000 + int(m.group(1)), 1, 1) + datetime.timedelta(days=int(m.group(2)) - 1)).isoformat()


FAMILIAS = [("sibal", "SIBAL (tela de algodon y fibra de vidrio)"), ("pmma", "PMMA (acrilico)"),
            ("nomex", "Nomex"), ("ultem", "Ultem"), ("wax", "cera"), ("candle", "cera"),
            ("silicone", "silicon"), ("teflon", "Teflon"), ("kapton", "Kapton"),
            ("lampwick", "mecha de lampara (lampwick)"), ("pyrell", "Pyrell"),
            ("dibutyl", "ftalato de dibutilo"), ("cotton", "SIBAL (tela de algodon y fibra de vidrio)")]


def familia(txt):
    t = (txt or "").lower()
    hallados = []
    for clave, nombre in FAMILIAS:
        if clave in t and nombre not in hallados:
            hallados.append(nombre)
    return " + ".join(hallados) if hallados else ("no especificado en la tabla" if t else "")


def flujo_de_display(txt):
    """Lecturas del anemometro del ducto ('Air display'), en cm/s segun el ReadMe de BASS-II:
    'Air display: flow speed measured in the duct in cm/s on the video display'.
    Se quita lo que va entre parentesis (son posiciones del potenciometro, no velocidades)."""
    sin_parentesis = re.sub(r"\([^)]*\)?", " ", txt or "")
    return numeros(sin_parentesis.replace("?", " "))


DOC_BASS = RAW / "documentos" / "PSI-26" / "Science Documents" / "PSI-26_Science Documents_As Run_Test Matrix.xlsx"


def cargar_matriz_bass():
    """Matriz 'as run' de BASS (documento cientifico de PSI-26): trae por prueba el oxigeno, la
    presion, la lectura del anemometro, el nitrogeno de supresion y las observaciones, que la
    tabla experimental no trae. Devuelve {numero de prueba as run: datos}."""
    if not DOC_BASS.exists():
        print("AVISO: falta %s; BASS queda sin condiciones (correr descargar_documentos.py)" % DOC_BASS.name)
        return {}
    try:
        import openpyxl
        import warnings
        warnings.simplefilter("ignore")
    except ImportError:
        print("AVISO: falta la libreria openpyxl; BASS queda sin condiciones")
        return {}
    wb = openpyxl.load_workbook(DOC_BASS, read_only=True, data_only=True)
    out = {}
    for hoja in ("2012", "2013"):
        filas = list(wb[hoja].iter_rows(values_only=True))
        cab = next(i for i, r in enumerate(filas) if r and any(str(c).strip() == "As run test no." for c in r if c))
        nombres = [limpio(c).lower() for c in filas[cab]]

        def col(frag):
            return next(i for i, c in enumerate(nombres) if frag in c)

        idx = {k: col(v) for k, v in {"asrun": "as run test no", "test": "test no.", "material": "material",
                                      "aire": "air display", "fan": "fan display", "gn2pot": "gn2 pot",
                                      "gn2": "gn2 display", "o2": "o2 % by volume", "p": "pressure, atm",
                                      "co2": "co2, mm hg", "obs": "test observations"}.items()}
        idx["test"] = next(i for i, c in enumerate(nombres) if c == "test no.")
        for n, r in enumerate(filas[cab + 1:], start=cab + 2):
            if not r or r[idx["asrun"]] is None:
                continue
            v = r[idx["asrun"]]
            clave = str(int(v)) if isinstance(v, (int, float)) else limpio(v)
            d = {k: ("" if r[i] is None else limpio(r[i])) for k, i in idx.items()}
            d["hoja"], d["fila"] = hoja, n
            out.setdefault(clave, d)
    return out


def fila_base(acc, acr, tabla, n, nivel):
    f = dict.fromkeys(COLS, "")
    f.update(id_investigacion=acc, acronimo=acr, tabla_origen=tabla, fila_origen=n, nivel_fila=nivel)
    return f


def pon_o2(f, vals, original, ref="atmosfera"):
    a, b = rango(vals)
    f["oxigeno_pct_min"], f["oxigeno_pct_max"] = fmt(a), fmt(b)
    f["oxigeno_original"] = original
    if original:
        f["oxigeno_referencia"] = ref


def pon_presion(f, vals, original, a_kpa):
    a, b = rango(vals, a_kpa)
    f["presion_original"] = original
    f["presion_kpa_min"], f["presion_kpa_max"] = fmt(a), fmt(b)
    f["presion_psia_min"] = fmt(a / PSI_KPA) if a is not None else ""
    f["presion_psia_max"] = fmt(b / PSI_KPA) if b is not None else ""


def pon_flujo(f, vals, original, direccion=""):
    a, b = rango(vals)
    f["flujo_original"] = original
    f["flujo_cm_s_min"], f["flujo_cm_s_max"] = fmt(a), fmt(b)
    f["flujo_direccion"] = direccion


def pares(**kw):
    return "; ".join("%s=%s" % (k.replace("_", " "), v) for k, v in kw.items() if limpio(v))


# ---------- un mapeador por tabla ----------
# Cada funcion recibe (acc, acr, nombre_de_tabla, filas) y devuelve filas limpias.

def bass2(acc, acr, tabla, filas):
    out = []
    for n, r in enumerate(filas[1:], start=2):
        if not any(r):
            continue
        f = fila_base(acc, acr, tabla, n, "prueba")
        f["id_prueba"], f["fecha"], f["fecha_original"] = r[1], fecha_mdy(r[2]), r[2]
        f["combustible_material"], f["material_familia"], f["tipo_combustible"] = r[5], familia(r[5]), "solido"
        pon_o2(f, numeros(r[11]), r[11] + " % vol (inicial, calibrado)" if r[11] else "")
        if r[7] or r[8] or r[6]:
            pon_flujo(f, flujo_de_display(r[8]),
                      pares(Air_display_cm_s=r[8], Fan_display_voltaje_x10=r[7], Flow_restrictor=r[6]))
        f["notas"] = pares(PI=r[0], muestra=r[4], O2_final_pct=r[12], CO2_inicial_pct=r[13], CO2_final_pct=r[14],
                           CO_inicial_ppm=r[15], CO_final_ppm=r[16])
        ini, fin = numeros(r[11]), numeros(r[12])
        if "?" in r[8]:
            f["notas"] += "; la lectura de flujo trae un signo de duda en el original"
        if re.search(r"\(.*\d", r[8]):
            f["notas"] += "; la celda de flujo trae valores entre parentesis que no se usaron"
        if f["flujo_cm_s_max"] and float(f["flujo_cm_s_max"]) > 40:
            f["notas"] += "; AVISO: flujo mayor a 40 cm/s (la ficha dice 'hasta 40 cm/s'): revisar la celda original"
        if ini and fin and fin[0] - ini[0] > 5:
            f["notas"] += "; AVISO: el O2 final (%s) es mucho mayor que el inicial (%s): probable errata de la tabla" % (r[12], r[11])
        out.append(f)
    return out


def bass(acc, acr, tabla, filas):
    out = []
    for n, r in enumerate(filas[1:], start=2):
        if not any(r):
            continue
        f = fila_base(acc, acr, tabla, n, "prueba")
        f["id_prueba"], f["fecha"], f["fecha_original"] = r[3] or r[2], fecha_mdy(r[0]), r[0]
        f["combustible_material"], f["material_familia"], f["tipo_combustible"] = r[5], familia(r[5]), "solido"
        if re.search(r"opp", r[5].lower()):
            f["flujo_direccion"] = "opuesto (segun el texto del material)"
        f["notas"] = pares(muestra=r[4], prueba_segun_orden=r[2])
        d = MATRIZ_BASS.get(limpio(r[2]))
        if d:
            o2 = numeros(d["o2"])
            if o2:
                pon_o2(f, [o2[0] * 100 if o2[0] <= 1 else o2[0]], "O2 % by volume=" + d["o2"][:8])
            pr = numeros(d["p"])
            if pr:
                pon_presion(f, pr[:1], "%s atm" % d["p"][:6], ATM_KPA)
            if d["aire"] or d["fan"]:
                pon_flujo(f, flujo_de_display(d["aire"]),
                          pares(Air_display_cm_s=d["aire"], Fan_display_voltaje_x10=d["fan"]), f["flujo_direccion"])
            if re.search(r"\d", d["gn2"]):
                f["diluyente_supresor"] = "N2 aplicado (GN2 display=%s; GN2 pot=%s)" % (d["gn2"], d["gn2pot"])
            f["resultado"] = d["obs"][:600]
            aviso = "" if re.sub(r"[\W_]+", "", d["material"]).lower() == re.sub(r"[\W_]+", "", r[5]).lower() else \
                "; OJO: el material de la matriz es '%s'" % d["material"]
            f["notas"] += "; oxigeno, presion, flujo, N2 y observaciones salen del documento As Run_Test Matrix.xlsx " \
                          "(Science Documents de PSI-26), hoja %s, fila %s; CO2 mmHg=%s%s" % (d["hoja"], d["fila"], d["co2"], aviso)
        elif MATRIZ_BASS:
            f["notas"] += "; sin renglon en la matriz as run"
        out.append(f)
    return out


def saffire(acc, acr, tabla, filas):
    cab = [c.lower() for c in filas[0]]

    def col(*claves):
        for i, c in enumerate(cab):
            if all(k in c for k in claves):
                return i
        return None

    i_esp, i_lar, i_anc = col("thickness"), col("length"), col("width")
    i_fl, i_o2, i_dir = col("air flow"), col("percent o2"), col("direction")
    i_bt, i_ip, i_it = col("burn time"), col("ignition power"), col("ignition time")
    i_bl, i_sl = col("g burn length"), col("g spread length")
    notas_tabla = [r[0] for r in filas[1:] if r and r[0].lower().startswith("note")]
    out = []
    for n, r in enumerate(filas[1:], start=2):
        if not any(r) or r[0].lower().startswith("note"):
            continue
        if "flow vis" in r[1].lower():
            f = fila_base(acc, acr, tabla, n, "dato_auxiliar")
            f["id_prueba"], f["notas"] = r[0], r[1]
            out.append(f)
            continue
        f = fila_base(acc, acr, tabla, n, "muestra")
        f["id_prueba"] = r[0]
        f["combustible_material"], f["material_familia"], f["tipo_combustible"] = r[1], familia(r[1]), "solido"
        if acc == "PSI-100":  # las imagenes de S1 y S2 llevan sello del 2017-06-03, 21:11 a 21:14 GMT
            f["fecha"] = "2017-06-03"
            f["fecha_original"] = "no viene en la tabla; sale de SAFFIRE-III_MergeResult-raw_Final.xlsx"

        def con_unidad(i, unidad):
            v = r[i] if i is not None else ""
            return v if (not v or re.search(r"[a-zA-Z]", v)) else v + " " + unidad

        f["forma_tamano"] = pares(espesor=con_unidad(i_esp, "cm"), largo=con_unidad(i_lar, "cm"),
                                  ancho=con_unidad(i_anc, "cm"))
        if i_o2 is not None and r[i_o2]:
            pon_o2(f, numeros(r[i_o2]), r[i_o2] + " %")
        if i_fl is not None and r[i_fl]:
            pon_flujo(f, numeros(r[i_fl]), r[i_fl] if "cm" in r[i_fl] else r[i_fl] + " cm/s",
                      {"concurrent": "concurrente", "opposed": "opuesto"}.get(r[i_dir].lower(), r[i_dir]))
        res = {}
        if i_bt is not None:
            res["tiempo_de_quemado"] = con_unidad(i_bt, "s")
        if i_bl is not None:
            res["largo_quemado_microgravedad"] = r[i_bl]
        if i_sl is not None:
            res["propagacion_microgravedad"] = r[i_sl]
        f["resultado"] = pares(**res)
        f["notas"] = pares(potencia_de_ignicion=con_unidad(i_ip, "W") if i_ip is not None else "",
                           tiempo_de_ignicion=con_unidad(i_it, "s") if i_it is not None else "")
        if not r[1]:
            f["notas"] = (f["notas"] + "; material vacio en la tabla original").strip("; ")
        out.append(f)
    if notas_tabla and out:
        out[0]["notas"] = (out[0]["notas"] + "; notas de la tabla: " + " / ".join(notas_tabla)).strip("; ")
    return out


def same_r(acc, acr, tabla, filas):
    out = []
    for n, r in enumerate(filas[1:], start=2):
        if not any(r):
            continue
        f = fila_base(acc, acr, tabla, n, "prueba")
        f["id_prueba"] = r[1]
        m = re.match(r"^(\d{1,2})-([A-Za-z]{3})$", r[3])
        if m:
            f["fecha"] = iso(ANIO_SAME_R, MESES.get(m.group(2).lower()), m.group(1))
        f["fecha_original"] = r[3] + " (sin ano en la tabla; %d sale de la ficha)" % ANIO_SAME_R
        f["combustible_material"], f["material_familia"], f["tipo_combustible"] = r[0], familia(r[0]), "solido"
        pon_flujo(f, numeros(r[4]), r[4] + " cm/s (velocidad de entrada)")
        f["notas"] = pares(descripcion=r[2], Rt_R0=r[5], duracion_s=r[6], envejecimiento_primario_s=r[7],
                           mezclado_primario_s=r[8], envejecimiento_neto_s=r[9])
        out.append(f)
    return out


def same(acc, acr, tabla, filas):
    out = []
    for n, r in enumerate(filas[1:], start=2):
        if not any(r):
            continue
        f = fila_base(acc, acr, tabla, n, "muestra")
        f["id_prueba"] = r[0]
        f["combustible_material"], f["material_familia"] = r[1], familia(r[1])
        f["tipo_combustible"] = "liquido" if "dibutyl" in r[1].lower() else "solido"
        if r[2]:
            pon_flujo(f, numeros(r[2]), r[2] + " cm/s")
        f["notas"] = pares(perdida_de_peso_mg_min=r[3], envejecimiento_min=r[4])
        out.append(f)
    return out


def daft(acc, acr, tabla, filas):
    out = []
    for n, r in enumerate(filas[1:], start=2):
        if not any(r):
            continue
        f = fila_base(acc, acr, tabla, n, "sesion")
        f["id_prueba"], f["fecha_original"] = r[0], r[1]
        m = re.search(r"GMT (\d+) \((\d{4})\)", r[1])
        if m:
            f["fecha"] = (datetime.date(int(m.group(2)), 1, 1) + datetime.timedelta(days=int(m.group(1)) - 1)).isoformat()
        f["combustible_material"], f["tipo_combustible"] = r[3], "no aplica (polvo de prueba, sin combustion)"
        f["notas"] = pares(equipo=r[2], lugar_muestreado=r[4])
        out.append(f)
    return out


def spice(acc, acr, tabla, filas):
    out = []
    for n, r in enumerate(filas[1:], start=2):
        if not any(r):
            continue
        f = fila_base(acc, acr, tabla, n, "prueba")
        f["id_prueba"] = "GMT%s %s" % (r[0], r[1])
        if r[0].isdigit() and 1 <= int(r[0]) <= 366:
            f["fecha"] = (datetime.date(ANIO_SPICE, 1, 1) + datetime.timedelta(days=int(r[0]) - 1)).isoformat()
        f["fecha_original"] = "dia GMT %s (sin ano en la tabla; %d sale del reporte de 30 dias de SPICE)" % (r[0], ANIO_SPICE)
        f["combustible_material"], f["tipo_combustible"] = r[3], "gas"
        f["forma_tamano"] = "boquilla de %s mm" % r[4] if r[4] else ""
        if r[8]:
            pon_flujo(f, numeros(r[8]), r[8] + " cm/s (Air Rate)", "coflujo (por el titulo del experimento)")
        if re.search(r"\d+\s*%", r[3]):
            f["diluyente_supresor"] = "N2 (la tabla no lo dice; el reporte final habla de mezclas de propileno y nitrogeno)"
        f["resultado"] = pares(GMT_flama_apagada=r[2])
        f["notas"] = pares(combustible_sccm=r[5], combustible_mg_s=r[6], hidrocarburo_mg_s=r[7])
        out.append(f)
    return out


def slice_(acc, acr, tabla, filas):
    out = []
    for n, r in enumerate(filas[1:], start=2):
        if not any(r):
            continue
        f = fila_base(acc, acr, tabla, n, "dia_de_prueba")
        m = re.match(r"^(\d{4})-([A-Z]{3})-(\d{2})(.*)$", r[0])
        f["fecha"] = iso(m.group(1), MESES.get(m.group(2).lower()), m.group(3)) if m else ""
        f["fecha_original"] = r[0]
        f["id_prueba"] = f["fecha"] or r[0]
        f["combustible_material"], f["tipo_combustible"] = r[1], "gas"
        if "balance N2" in r[1]:
            f["diluyente_supresor"] = "N2 (en el combustible)"
        if m and limpio(m.group(4)):
            f["notas"] = "texto pegado a la fecha en la tabla original: " + limpio(m.group(4))
        out.append(f)
    return out


def flame_design_normal(acc, acr, tabla, filas):
    out = []
    for n, r in enumerate(filas[1:], start=2):
        if not any(r):
            continue
        f = fila_base(acc, acr, tabla, n, "prueba")
        f["id_prueba"], f["fecha_original"] = r[3], "dia de prueba %s" % r[1]
        f["combustible_material"], f["tipo_combustible"] = r[2], "gas"
        pon_o2(f, numeros(r[8]) and [numeros(r[8])[0] * 100], "XO2 (init)=" + r[8])
        pon_presion(f, numeros(r[10]), "pinit=%s atm" % r[10], ATM_KPA)
        x = numeros(r[4])
        if x and x[0] < 1:
            f["diluyente_supresor"] = "N2 en el combustible (Xfuel=%s)" % r[4]
        f["notas"] = pares(tipo_de_flama=r[0], mfuel_mg_s=r[5], mN2_mg_s=r[6], XO2_final=r[9], pfinal_atm=r[11],
                           Zst=r[13], Tad_K=r[14])
        out.append(f)
    return out


def flame_design_inversa(acc, acr, tabla, filas):
    out = []
    for n, r in enumerate(filas[1:], start=2):
        if not any(r):
            continue
        f = fila_base(acc, acr, tabla, n, "prueba")
        f["id_prueba"], f["fecha_original"] = r[2], "dia de prueba %s" % r[1]
        f["combustible_material"] = "C2H4 en la camara (XC2H4 inicial=%s)" % r[7]
        f["tipo_combustible"] = "gas"
        pon_o2(f, numeros(r[3]) and [numeros(r[3])[0] * 100], "XO2=" + r[3], "gas_del_quemador (flama inversa)")
        pon_presion(f, numeros(r[9]), "pinit=%s atm" % r[9], ATM_KPA)
        f["diluyente_supresor"] = "N2 en el oxidante del quemador"
        f["notas"] = pares(tipo_de_flama=r[0], mO2_mg_s=r[4], mN2_mg_s=r[5], XC2H4_final=r[8], pfinal_atm=r[10],
                           Zst=r[12], Tad_K=r[13])
        out.append(f)
    return out


def bre(acc, acr, tabla, filas):
    notas = " / ".join(r[7] for r in filas[1:] if len(r) > 7 and r[7])
    out = []
    for n, r in enumerate(filas[1:], start=2):
        if not any(r[:7]):
            continue
        f = fila_base(acc, acr, tabla, n, "dia_de_prueba")
        f["fecha"] = iso(r[0], mes(r[1]), r[2])
        f["fecha_original"] = "%s %s %s" % (r[0], r[1], r[2])
        f["id_prueba"] = f["fecha"] or f["fecha_original"]
        f["combustible_material"], f["tipo_combustible"] = r[4], "gas"
        f["forma_tamano"] = "quemador de %s mm" % r[3]
        vals = numeros(r[5])
        if vals and max(vals) > 100:
            pon_o2(f, [], r[5])
            f["notas"] = "oxigeno original '%s' fuera de escala (probable errata de formato); no se uso" % r[5]
        else:
            pon_o2(f, vals, r[5] + " % (concentraciones aproximadas de las flamas que encendieron)")
        f["diluyente_supresor"] = "N2 (en el oxidante, segun la nota de la tabla)"
        f["resultado"] = pares(flamas_encendidas=r[6])
        out.append(f)
    if out and notas:
        out[0]["notas"] = (out[0]["notas"] + "; notas de la tabla: " + notas).strip("; ")
    return out


def cld(acc, acr, tabla, filas):
    out = []
    for n, r in enumerate(filas[1:], start=2):
        if not any(r[:7]):
            continue
        f = fila_base(acc, acr, tabla, n, "dia_de_prueba")
        f["id_prueba"], f["fecha"], f["fecha_original"] = r[1], fecha_yyddd(r[1]), "Test Day " + r[1]
        f["combustible_material"], f["tipo_combustible"] = r[4], "gas"
        f["forma_tamano"] = "quemador de coflujo (por el nombre del experimento)"
        f["flujo_direccion"] = "coflujo (por el nombre del experimento)"
        f["resultado"] = pares(flamas_encendidas=r[6])
        f["notas"] = pares(tipo=r[0], Fuel_MFC=r[2], N2_MFC=r[3], rango_de_concentracion=r[5], nota=r[7] if len(r) > 7 else "")
        if re.search(r"CH5|N[3-9]", r[4]):
            f["notas"] += "; el texto del combustible trae una errata de autollenado"
        out.append(f)
    return out


def efield(acc, acr, tabla, filas):
    out, previa = [], None
    for n, r in enumerate(filas[1:], start=2):
        if not any(r):
            continue
        if not r[1]:  # renglon de continuacion: solo trae otra concentracion del mismo dia
            if previa is not None and r[7]:
                previa["combustible_material"] += "; tambien al " + r[7]
            continue
        f = fila_base(acc, acr, tabla, n, "dia_de_prueba")
        f["id_prueba"], f["fecha"] = r[1], iso(r[2], mes(r[3]), r[4])
        f["fecha_original"] = "Test Day " + r[1]
        f["combustible_material"] = "%s; concentracion usada %s" % (r[6], r[7])
        f["tipo_combustible"] = "gas"
        f["forma_tamano"] = "quemador de coflujo" if "coflow" in r[0].lower() else ("quemador de chorro de gas" if "gas-jet" in r[0].lower() else "")
        f["diluyente_supresor"] = "N2 (en el combustible, segun la nota de la tabla)"
        f["resultado"] = pares(flamas_encendidas=r[8])
        f["notas"] = pares(tipo=r[0], polaridad_de_la_malla=r[5], nota=r[9] if len(r) > 9 else "")
        out.append(f)
        previa = f
    return out


def sflame(acc, acr, tabla, filas):
    out = []
    for n, r in enumerate(filas[1:], start=2):
        if not any(r):
            continue
        f = fila_base(acc, acr, tabla, n, "dia_de_prueba")
        f["id_prueba"], f["fecha"] = r[1], iso(r[2], mes(r[3]), r[4])
        f["fecha_original"] = "Test Day " + r[1]
        f["combustible_material"], f["tipo_combustible"] = r[6], "gas"
        pon_o2(f, [float(x) for x in re.findall(r"(\d+(?:\.\d+)?)\s*%", r[5])], r[5])
        pon_presion(f, [1.0], "~1 atm (nota de la tabla)", ATM_KPA)
        m = re.search(r"with (He|N\d)", r[5])
        if m:
            gas = m.group(1)
            f["diluyente_supresor"] = "He" if gas == "He" else "N2"
            if gas not in ("He", "N2"):
                f["notas"] = "la atmosfera original dice '%s' (errata de autollenado de N2)" % gas
        f["resultado"] = pares(flamas_encendidas=r[7])
        f["notas"] = (f["notas"] + "; " + pares(tipo=r[0], nota=r[8] if len(r) > 8 else "")).strip("; ")
        out.append(f)
    return out


def cfig_normal(acc, acr, tabla, filas):
    out = []
    for n, r in enumerate(filas[1:], start=2):
        if not any(r):
            continue
        f = fila_base(acc, acr, tabla, n, "prueba")
        f["id_prueba"], f["fecha_original"] = r[3], "dia de prueba %s" % r[1]
        f["combustible_material"], f["tipo_combustible"] = r[2], "gas"
        pon_o2(f, numeros(r[5]) and [numeros(r[5])[0] * 100], "XO2 before test=" + r[5])
        pon_presion(f, numeros(r[7]), "approx p=%s bar" % r[7], BAR_KPA)
        if re.search(r"\d+\s*%", r[2]):
            f["diluyente_supresor"] = "no dice con que se diluyo el combustible"
        f["resultado"] = pares(ignicion_caliente=r[13], tiempo_de_quemado_s=r[14], fin=r[15], flama_fria=r[4])
        f["notas"] = pares(tipo_de_flama=r[0], XO2_after=r[6], Xf=r[8], mHC_mg_s=r[9], TFP=r[10], Tad_K=r[11],
                           Zst=r[12], T_max_quemador_C=r[16], comentario=r[17] if len(r) > 17 else "")
        out.append(f)
    return out


def cfig_inversa(acc, acr, tabla, filas):
    out = []
    for n, r in enumerate(filas[1:], start=2):
        if not any(r):
            continue
        f = fila_base(acc, acr, tabla, n, "prueba")
        f["id_prueba"], f["fecha_original"] = r[3], "dia de prueba %s" % r[1]
        f["combustible_material"] = "%s en la camara (Xf antes=%s)" % (r[2], r[4])
        f["tipo_combustible"] = "gas"
        pon_o2(f, numeros(r[7]) and [numeros(r[7])[0] * 100], "XO2=" + r[7], "gas_del_quemador (flama inversa)")
        pon_presion(f, numeros(r[6]), "approx p=%s bar" % r[6], BAR_KPA)
        f["resultado"] = pares(ignicion_caliente=r[13], tiempo_de_quemado_s=r[14], fin=r[15], color=r[18])
        f["notas"] = pares(tipo_de_flama=r[0], Xf_despues=r[5], HC_mg_s=r[8], O2_mg_s=r[9], TFP=r[10], Tad_K=r[11],
                           Zst=r[12], T_max_quemador_C=r[16], comentario=r[19] if len(r) > 19 else "")
        out.append(f)
    return out


def cfi(acc, acr, tabla, filas):
    out = []
    for n, r in enumerate(filas[1:], start=2):
        if not any(r):
            continue
        f = fila_base(acc, acr, tabla, n, "prueba")
        f["id_prueba"], f["fecha"], f["fecha_original"] = r[0], fecha_d_mon_yy(r[1]), r[1]
        f["combustible_material"], f["tipo_combustible"] = r[9], "liquido"
        f["forma_tamano"] = "gota" + (" sostenida en fibra" if r[8].lower() == "yes" else (" libre" if r[8].lower() == "no" else ""))
        pon_o2(f, numeros(r[5]) and [numeros(r[5])[0] * 100], "fraccion de O2=" + r[5])
        pon_presion(f, numeros(r[4]), r[4], ATM_KPA)
        he = numeros(r[7])
        f["diluyente_supresor"] = ("He=%s; N2=%s" % (r[7], r[6])) if he and he[0] > 0 else "N2=%s" % r[6]
        f["notas"] = pares(CIR=r[3], hora_local=r[2])
        out.append(f)
    return out


def flex2(acc, acr, tabla, filas):
    out = []
    for n, r in enumerate(filas[1:], start=2):
        if not any(r):
            continue
        f = fila_base(acc, acr, tabla, n, "matriz_por_combustible")
        f["id_prueba"] = "matriz-%d" % (n - 1)
        f["combustible_material"], f["tipo_combustible"] = r[0], "liquido"
        f["forma_tamano"] = "gota de %s mm de diametro inicial" % r[1]
        pon_o2(f, [v * 100 for v in numeros(r[3])], "fraccion molar de O2: " + r[3])
        pon_presion(f, numeros(r[4]), r[4] + " atm", ATM_KPA)
        pon_flujo(f, numeros(r[6]), r[6] + " cm/s")
        f["diluyente_supresor"] = "N2 o He (" + r[2] + ")"
        f["notas"] = "renglon de matriz: da intervalos por combustible, no pruebas individuales; temperatura %s C" % r[5] + \
                     "; las mezclas medidas en la camara estan en data/extra/flex_mezclas.csv: llegan a 39.7 % de O2 " \
                     "(con helio) y ninguna tiene 30 % o mas a 11 psia o menos"
        out.append(f)
    return out


def flex(acc, acr, tabla, filas):
    out = []
    for n, r in enumerate(filas[1:], start=2):
        if not any(r):
            continue
        f = fila_base(acc, acr, tabla, n, "prueba")
        f["id_prueba"], f["fecha"], f["fecha_original"] = r[1] or r[0], fecha_mdy(r[2]), r[2]
        f["combustible_material"], f["tipo_combustible"] = r[4], "liquido"
        d = numeros(r[10])
        f["forma_tamano"] = "gota de %s mm de diametro inicial" % r[10] if d else "gota"
        pon_o2(f, numeros(r[6]) and [numeros(r[6])[0] * 100], "fraccion molar de O=" + r[6])
        p = numeros(r[5])
        presion_invalida = bool(p) and p[0] <= 0
        pon_presion(f, [] if presion_invalida else p, r[5] + " mmHg", MMHG_KPA)
        dil = []
        for nombre, v in (("CO2", r[8]), ("He", r[9])):
            x = numeros(v)
            if x and x[0] > 0:
                dil.append("%s=%s" % (nombre, v))
        f["diluyente_supresor"] = "; ".join(dil) if dil else "ninguno (solo N2=%s)" % r[7]
        f["resultado"] = pares(fin=r[14], diametro_de_extincion_mm=r[11] if numeros(r[11]) else "",
                               tasa_de_quemado=r[12], tiempo_de_quemado_s=r[13])
        suma = sum(numeros(x)[0] for x in (r[6], r[7], r[8], r[9]) if numeros(x))
        f["notas"] = pares(numero_FLEX=r[0], GMT=r[3], N2=r[7])
        if abs(suma - 1.0) > 0.011:
            f["notas"] += "; las fracciones O+N+CO+He suman %.2f" % suma
        if presion_invalida:
            f["notas"] += "; presion original %s mmHg no es fisicamente posible: no se uso" % r[5]
        out.append(f)
    return out


DOC_CFI = RAW / "documentos" / "PSI-39" / "Science Documents" / "PSI-39_Science Documents_CFI_DataSummary_Spreadsheet_Jan2021.xlsx"


def integrar_cfi(pruebas, acr):
    """El resumen de datos de CFI (documento cientifico de PSI-39) trae 227 pruebas, con resultados;
    la tabla experimental trae 87 filas (79 distintas) y solo condiciones. Si el documento esta, las
    filas de CFI salen de el y se anota cuales estaban tambien en la tabla. Devuelve (filas, resumen)."""
    if not DOC_CFI.exists():
        return pruebas, "AVISO: falta el resumen de CFI; se usa la tabla experimental"
    try:
        import openpyxl
        import warnings
        warnings.simplefilter("ignore")
    except ImportError:
        return pruebas, "AVISO: falta openpyxl; CFI se queda con la tabla experimental"
    wb = openpyxl.load_workbook(DOC_CFI, read_only=True, data_only=True)

    def hoja(nombre):
        filas = [["" if c is None else limpio(c) for c in f] for f in wb[nombre].iter_rows(values_only=True)]
        return [f for f in filas if any(f)]

    def clave(v):
        return str(int(float(v))) if re.match(r"^\d+(\.0)?$", v) else v

    maestra = hoja("Master Sheet")
    datos = {clave(f[0]): f for f in hoja("DATA")[1:]}
    comentarios = {clave(f[0]): (f[1] if len(f) > 1 else "") for f in hoja("Comments")[1:]}
    de_tabla = {}
    for f in pruebas:
        if f["id_investigacion"] == "PSI-39" and not f["duplicado_de_fila"]:
            de_tabla.setdefault(f["id_prueba"], f)
    nombre = "documento: " + DOC_CFI.name.replace("PSI-39_Science Documents_", "") + " (hojas Master Sheet y DATA)"
    nuevas, distintas = [], 0
    for n, r in enumerate(maestra[1:], start=2):
        r = r + [""] * (10 - len(r))
        f = fila_base("PSI-39", acr, nombre, n, "prueba")
        f["id_prueba"] = clave(r[0])
        f["fecha"], f["fecha_original"] = r[1][:10] if re.match(r"^\d{4}-\d{2}-\d{2}", r[1]) else "", r[1][:10]
        f["combustible_material"], f["tipo_combustible"] = r[9], "liquido"
        d = datos.get(f["id_prueba"], [])
        d = d + [""] * (20 - len(d))
        f["forma_tamano"] = "gota" + (" sostenida en fibra" if r[8].lower() == "yes" else (" libre" if r[8].lower() == "no" else "")) + \
                            (" de %s mm de diametro inicial" % d[1] if numeros(d[1]) else "")
        pon_o2(f, numeros(r[5]) and [numeros(r[5])[0] * 100], "fraccion de O2=" + r[5])
        pon_presion(f, numeros(r[4])[:1], r[4], ATM_KPA)
        he = numeros(r[7])
        f["diluyente_supresor"] = ("He=%s; N2=%s" % (r[7], r[6])) if he and he[0] > 0 else "N2=%s" % r[6]
        f["resultado"] = pares(diametro_de_extincion_caliente_mm=d[2], tasa_de_quemado_caliente_mm2_s=d[3],
                               tasa_de_quemado_fria_mm2_s=d[4], diametro_de_extincion_fria_mm=d[5],
                               reigniciones=d[7], tiempo_de_flama_caliente_s=d[9], analisis_completo=d[19])
        f["notas"] = pares(CIR=r[3], hora_local=r[2], comentario=comentarios.get(f["id_prueba"], "")[:300])
        vieja = de_tabla.get(f["id_prueba"])
        if vieja:
            iguales = vieja["oxigeno_pct_min"] == f["oxigeno_pct_min"] and vieja["presion_kpa_min"] == f["presion_kpa_min"]
            f["notas"] += "; tambien esta en la tabla experimental (fila %s)%s" % (
                vieja["fila_origen"], "" if iguales else ", con oxigeno o presion distintos")
            distintas += 0 if iguales else 1
        else:
            f["notas"] += "; no esta en la tabla experimental"
        nuevas.append(f)
    ids = {f["id_prueba"] for f in nuevas}
    faltan = sorted(k for k in de_tabla if k not in ids)
    resto = [f for f in pruebas if f["id_investigacion"] != "PSI-39" or f["id_prueba"] in faltan]
    resumen = "CFI: %d pruebas del documento (%d con resultado); de la tabla: %d distintas, %d tambien en el documento, " \
              "%d con condiciones distintas, %d solo en la tabla" % (
                  len(nuevas), sum(1 for f in nuevas if f["resultado"]), len(de_tabla), len(de_tabla) - len(faltan), distintas, len(faltan))
    return resto + nuevas, resumen


TXT_BRE = RAW / "documentos_texto" / "PSI-20" / "Reports" / "PSI-20_Reports_Dissertation-PD-revised_.pdf.txt"
# Tablas de la tesis archivada en los reportes de PSI-20. En la 6.1 el orden de columnas es
# XO2 antes, XO2 despues, dhc, p, ...; en las E.1 y F.1 es dhc, XO2 antes, XO2 despues, p, flujo, t. osc., t. ext.
TABLAS_BRE = {
    "110": ("6.1", "C2H4 con N2 (flamas de etileno y nitrogeno)", "quemador plano poroso (el diametro no viene en esta tabla)"),
    "111": ("6.1", "C2H4 con N2 (flamas de etileno y nitrogeno)", "quemador plano poroso (el diametro no viene en esta tabla)"),
    "112": ("6.1", "C2H4 con N2 (flamas de etileno y nitrogeno)", "quemador plano poroso (el diametro no viene en esta tabla)"),
    "163": ("E.1", "CH4 con N2 (mezcla de metano y nitrogeno)", "quemador de 25 mm"),
    "164": ("F.1", "C2H4 con N2 (mezcla de etileno y nitrogeno)", "quemador de 50 mm"),
}
FINALES_BRE = {"SE": "se autoextinguio", "FT": "se corto el combustible", "FTO": "se corto el combustible, con oscilaciones"}


def pruebas_bre(acr):
    """La tabla experimental de BRE va por dia y no trae presion. La tesis archivada en los reportes de
    PSI-20 da por prueba el oxigeno, la presion (bar) y la condicion final (SE se autoextinguio, FT se
    corto el combustible, FTO se corto con oscilaciones). Se lee del texto extraido del PDF.
    Un renglon sin oxigeno o presion legibles se descarta; uno sin condicion final se conserva, marcado."""
    if not TXT_BRE.exists():
        return [], "AVISO: falta el texto de la tesis de BRE (correr extraer_texto.py); BRE queda por dia"
    partes = re.split(r"\n===== pagina (\d+) =====\n", TXT_BRE.read_text(encoding="utf-8"))
    out, descartadas, incompletas, vistos = [], 0, 0, set()
    for i in range(1, len(partes), 2):
        if partes[i] not in TABLAS_BRE:
            continue
        tabla, combustible, quemador = TABLAS_BRE[partes[i]]
        pagina = partes[i + 1]
        ids = list(re.finditer(r"\b((?:19|20|21)\d{3})([A-Z]\d)(-\d)?(?![\w.])", pagina))
        for k, m in enumerate(ids):
            fin = ids[k + 1].start() if k + 1 < len(ids) else len(pagina)
            segmento = pagina[m.end():fin]
            ident = m.group(1) + m.group(2) + (m.group(3) or "")
            fichas_t = re.findall(r"FTO|FT|SE|\d*\.?\d+|(?<![\w.])-(?![\w.])", segmento)
            cond = next((j for j, x in enumerate(fichas_t) if x in FINALES_BRE), None)
            v = fichas_t[:cond] if cond is not None else fichas_t
            try:
                if tabla == "6.1":
                    xo2, xo2_fin = float(v[0]), v[1]
                    sin_dhc = float(v[2]) <= 1.3  # la celda de dhc viene vacia en algunos renglones
                    presion, dhc = float(v[2] if sin_dhc else v[3]), ("" if sin_dhc else v[2])
                    completo = cond == 12 or (sin_dhc and cond == 11)
                    t_final = v[-1] if completo else ""
                else:
                    dhc, xo2, xo2_fin, presion = v[0], float(v[1]), v[2], float(v[3])
                    completo = cond is not None and cond >= 7
                    t_final = v[6] if completo else ""
            except (ValueError, IndexError):
                descartadas += 1
                continue
            try:
                despues_ok = 0.1 <= float(xo2_fin) <= 0.6
            except ValueError:
                despues_ok = xo2_fin == "-"
            if "not useful" in segmento or ident in vistos or not despues_ok or not (0.1 <= xo2 <= 0.6 and 0.3 <= presion <= 1.3):
                descartadas += 1
                continue
            vistos.add(ident)
            f = fila_base("PSI-20", acr, "documento: Dissertation-PD-revised_.pdf (Reports), tabla " + tabla, "pagina " + partes[i], "prueba")
            f["id_prueba"] = ident
            f["fecha"] = fecha_yyddd(m.group(1))
            f["fecha_original"] = "del identificador (formato AADDDX#, segun el ReadMe de BRE)"
            f["combustible_material"], f["tipo_combustible"], f["forma_tamano"] = combustible, "gas", quemador
            pon_o2(f, [xo2 * 100], "XO2 before test=" + (v[0] if tabla == "6.1" else v[1]))
            pon_presion(f, [presion], "p=%s bar" % ("%g" % presion), BAR_KPA)
            f["diluyente_supresor"] = "N2 (en el combustible y en la atmosfera)"
            if cond is not None:
                f["resultado"] = pares(fin=fichas_t[cond] + " (" + FINALES_BRE[fichas_t[cond]] + ")",
                                       tiempo_final_s=t_final if t_final != "-" else "")
            f["notas"] = pares(XO2_despues=xo2_fin, dhc_kJ_g=dhc) + "; leido del texto del PDF: comprobar contra la pagina antes de citar"
            if not completo:
                incompletas += 1
                f["notas"] += "; renglon incompleto en la tabla original" + ("" if cond is not None else " (sin condicion final)")
            out.append(f)
    por_tabla = {}
    for f in out:
        por_tabla[f["tabla_origen"][-3:]] = por_tabla.get(f["tabla_origen"][-3:], 0) + 1
    return out, "BRE: %d pruebas leidas de la tesis %s; %d con renglon incompleto; %d renglones descartados" % (
        len(out), por_tabla, incompletas, descartadas)


def ambiente_saffire(pruebas):
    """Presion de cabina de las tres Saffire y oxigeno de Saffire-III, que sus tablas no traen. Salen de
    la telemetria (datos crudos), resumida por telemetria_saffire.py en data/extra/saffire_ambiente.csv.
    Se pone el intervalo minimo-maximo medido durante el experimento."""
    ruta = SALIDA / "extra" / "saffire_ambiente.csv"
    if not ruta.exists():
        return "AVISO: falta data/extra/saffire_ambiente.csv (correr telemetria_saffire.py); Saffire queda sin presion"
    datos = list(csv.DictReader(open(ruta, encoding="utf-8-sig")))
    n = 0
    for f in pruebas:
        acc = f["id_investigacion"]
        if acc not in ("PSI-98", "PSI-99", "PSI-100") or f["nivel_fila"] != "muestra":
            continue
        propias = [d for d in datos if d["id_investigacion"] == acc and d["muestra"] == f["id_prueba"]]
        generales = [d for d in datos if d["id_investigacion"] == acc and d["muestra"] == "todas"]
        pres = [d for d in propias if d["variable"] == "presion_psi"] or [d for d in generales if d["variable"] == "presion_psi"]
        if pres and not f["presion_kpa_min"]:
            a, b = min(float(d["minimo"]) for d in pres), max(float(d["maximo"]) for d in pres)
            pon_presion(f, [a, b], "%.2f a %.2f psi (%s)" % (a, b, "; ".join(sorted({d["sensor"] for d in pres}))), PSI_KPA)
            f["notas"] = (f["notas"] + "; la presion sale de la telemetria: %s, hoja %s" % (pres[0]["archivo"], pres[0]["hoja"])).strip("; ")
            n += 1
        oxi = [d for d in propias if d["variable"] == "oxigeno_pct"]
        if oxi and not f["oxigeno_pct_min"]:
            a, b = float(oxi[0]["minimo"]), float(oxi[0]["maximo"])
            pon_o2(f, [a, b], "%.1f a %.1f %% (mediana %.1f; sensor O2 de la muestra)" % (a, b, float(oxi[0]["mediana"])))
            f["notas"] += "; el oxigeno sale de %s, hoja %s" % (oxi[0]["archivo"], oxi[0]["hoja"])
    return "Saffire: %d muestras con presion tomada de la telemetria" % n


DOC_SAME = RAW / "documentos" / "PSI-101" / "Analyzed Data" / "PSI-101_Analyzed Data_SAME, SAME-R_Results.xlsx"


def resultados_same(pruebas, acr_same):
    """El archivo de resultados de SAME y SAME-R (datos analizados de PSI-101) trae, por corrida, los
    tamanos de particula del humo: diametro medio por conteo (M1/M0), diametro de masa promedio y sigma g.
    La columna 'Flight' dice de cual es: 1 = SAME, 2 = SAME-R.
    - SAME-R: se anade el resultado a las filas de su tabla, unidas por el numero de prueba.
    - SAME: su tabla experimental solo lista 8 muestras; las corridas salen de este archivo como filas nuevas."""
    if not DOC_SAME.exists():
        return pruebas, "AVISO: falta el archivo de resultados de SAME y SAME-R; quedan sin tamanos de particula"
    try:
        import openpyxl
        import warnings
        warnings.simplefilter("ignore")
    except ImportError:
        return pruebas, "AVISO: falta openpyxl; SAME y SAME-R quedan sin tamanos de particula"
    wb = openpyxl.load_workbook(DOC_SAME, read_only=True, data_only=True)
    corridas = {}
    for ws in wb.worksheets:
        if "Paper" in ws.title:
            continue
        cab = None
        for n, f in enumerate(ws.iter_rows(values_only=True), start=1):
            f = list(f) + [None] * 90
            if cab is None:
                if limpio(f[6]) == "SAME #":
                    cab = n
                continue
            vuelo, numero = limpio(f[0]), limpio(f[6])
            if vuelo not in ("1", "2") or not numero:
                continue
            numero = str(int(float(numero))) if re.match(r"^\d+(\.0)?$", numero) else numero
            cmd, dam = f[69], f[70]
            d = {"vuelo": vuelo, "numero": numero, "material": limpio(f[2]), "descripcion": limpio(f[7]),
                 "fecha": f[9].date().isoformat() if hasattr(f[9], "date") else "", "gmt": limpio(f[8]),
                 "velocidad": limpio(f[13]), "rt_r0": limpio(f[14]), "duracion": limpio(f[15]),
                 "perdida_de_masa": limpio(f[46]),
                 "cmd_nm": "%.0f" % (cmd * 1000) if isinstance(cmd, (int, float)) and 0 < cmd < 5 else "",
                 "dam_nm": "%.0f" % (dam * 1000) if isinstance(dam, (int, float)) and 0 < dam < 5 else "",
                 "sigma_g": "%.2f" % f[72] if isinstance(f[72], (int, float)) and 1 <= f[72] < 10 else "",
                 "hoja": ws.title, "fila": n}
            clave = (vuelo, numero)
            if clave not in corridas or (d["dam_nm"] and not corridas[clave]["dam_nm"]):
                corridas[clave] = d

    def resultado(d):
        return pares(diametro_medio_por_conteo_nm=d["cmd_nm"], diametro_de_masa_promedio_nm=d["dam_nm"],
                     sigma_g=d["sigma_g"], perdida_de_masa=d["perdida_de_masa"])

    origen = "documento: SAME, SAME-R_Results.xlsx (Analyzed Data de PSI-101)"
    unidas = 0
    for f in pruebas:
        if f["id_investigacion"] != "PSI-101":
            continue
        d = corridas.get(("2", f["id_prueba"]))
        if d and resultado(d):
            f["resultado"] = resultado(d)
            f["notas"] += "; el resultado sale del %s, hoja %s, fila %s" % (origen, d["hoja"], d["fila"])
            unidas += 1
    nuevas = []
    for (vuelo, numero), d in sorted(corridas.items(), key=lambda kv: (kv[1]["fecha"], kv[0][1])):
        if vuelo != "1":
            continue
        f = fila_base("PSI-102", acr_same, origen + ", hoja " + d["hoja"], d["fila"], "prueba")
        f["id_prueba"], f["fecha"], f["fecha_original"] = numero, d["fecha"], ("dia GMT " + d["gmt"]) if d["gmt"] else ""
        f["combustible_material"], f["material_familia"] = d["material"], familia(d["material"])
        f["tipo_combustible"] = "liquido" if d["material"].lower().startswith(("dbp", "dibutyl")) else "solido"
        if numeros(d["velocidad"]):
            pon_flujo(f, numeros(d["velocidad"])[:1], d["velocidad"] + " cm/s (velocidad de entrada)")
        f["resultado"] = resultado(d)
        f["notas"] = pares(descripcion=d["descripcion"], Rt_R0=d["rt_r0"], duracion_s=d["duracion"]) + "; no esta en la tabla experimental de SAME"
        nuevas.append(f)
    con = sum(1 for f in nuevas if "diametro" in f["resultado"])
    return pruebas + nuevas, "SAME-R: %d de sus filas recibieron resultado; SAME: %d corridas nuevas del archivo de resultados (%d con tamano de particula); corridas en el archivo: %d" % (
        unidas, len(nuevas), con, len(corridas))


PDF_BASS2 = RAW / "documentos" / "PSI-25" / "Reports" / "PSI-25_Reports_BASS-II Summary Report.pdf"
TXT_BASS2 = RAW / "documentos_texto" / "PSI-25" / "Reports" / "PSI-25_Reports_BASS-II Summary Report.pdf.txt"
# Columnas del apendice A del reporte (NASA/TM-20210011385, pags. 111 a 121), por posicion horizontal en la pagina.
COLS_BASS2 = {"direccion": (301, 358), "gn2": (526, 547), "o2_ini": (772, 805), "obs": (972, 1224)}
DIRECCIONES = {"opposed": "opuesto", "concurrent": "concurrente", "stagnation": "estancamiento", "wake": "estela"}


def reporte_bass2(pruebas):
    """El reporte resumen de BASS-II trae lo que su tabla experimental no trae:
    - Apendice A (pags. 111 a 121): direccion del flujo y observaciones de cada prueba. Se lee por la
      posicion de las palabras en la pagina; una fila solo se usa si su oxigeno inicial coincide con el
      de la tabla experimental (asi se comprueba que la fila es la correcta).
    - Tabla 5.1 (pag. 65): velocidad de propagacion y tiempo de quemado de 20 pruebas (M1 a M20).
    - Tabla 7.1 (pag. 104): desenlace de las pruebas con tela SIBAL en flujo concurrente (T1 a T29)."""
    mias = {f["id_prueba"]: f for f in pruebas if f["id_investigacion"] == "PSI-25"}
    avisos = []
    con_obs = con_dir = 0
    try:
        import pymupdf
    except ImportError:
        pymupdf = None
        avisos.append("falta pymupdf: BASS-II queda sin direccion ni observaciones")
    if pymupdf and PDF_BASS2.exists():
        doc = pymupdf.open(PDF_BASS2)
        for npag in range(111, 122):
            palabras = doc[npag - 1].get_text("words")
            ids = sorted((w for w in palabras if w[4] in mias and 164 <= w[0] <= 190), key=lambda w: w[1])
            for k, w in enumerate(ids):
                y0, y1 = w[1] - 3, (ids[k + 1][1] - 3 if k + 1 < len(ids) else 745)
                banda = [q for q in palabras if y0 <= q[1] < y1]
                d = {}
                for nombre, (a, b) in COLS_BASS2.items():
                    d[nombre] = " ".join(q[4] for q in sorted((q for q in banda if a <= q[0] < b), key=lambda q: (round(q[1]), q[0])))
                f = mias[w[4]]
                o2 = numeros(d["o2_ini"])
                if not o2 or not f["oxigeno_pct_min"] or abs(o2[0] - float(f["oxigeno_pct_min"])) > 0.051 or "apendice A" in f["notas"]:
                    continue
                primera = d["direccion"].split(" ")[0].lower() if d["direccion"] else ""
                if primera in DIRECCIONES:
                    f["flujo_direccion"] = DIRECCIONES[primera]
                    con_dir += 1
                if d["obs"]:
                    f["resultado"] = d["obs"][:600]
                    con_obs += 1
                f["notas"] += "; direccion del flujo y observaciones salen del apendice A del reporte resumen de BASS-II " \
                              "(NASA/TM-20210011385), pagina %d" % npag
    elif pymupdf:
        avisos.append("falta el PDF del reporte de BASS-II (correr descargar_documentos.py --categorias Reports)")

    con_51 = con_71 = 0
    if TXT_BASS2.exists():
        partes = re.split(r"\n===== pagina (\d+) =====\n", TXT_BASS2.read_text(encoding="utf-8"))
        pag = {partes[i]: [x.strip() for x in partes[i + 1].split("\n") if x.strip()] for i in range(1, len(partes), 2)}
        lineas = pag.get("65", []) + pag.get("66", [])
        for i, x in enumerate(lineas):
            if re.match(r"^M\d+$", x) and x in mias and i + 8 < len(lineas) and "tabla 5.1" not in mias[x]["notas"]:
                c = lineas[i + 1:i + 9]  # espesor, ancho, lados, velocidad, propagacion, tiempo, O2 inicial, O2 final
                if not (numeros(c[0]) and numeros(c[6])):
                    continue
                f = mias[x]
                f["resultado"] = (pares(velocidad_de_propagacion_mm_s=c[4], tiempo_de_quemado_min=c[5],
                                        flujo_cm_s=c[3], lados_ardiendo=c[2], espesor_mm=c[0], ancho_cm=c[1])
                                  + ("; " + f["resultado"] if f["resultado"] else ""))[:900]
                f["notas"] += "; velocidad de propagacion y tiempo de quemado salen de la tabla 5.1 del mismo reporte, pagina 65"
                con_51 += 1
        lineas = pag.get("104", []) + pag.get("105", [])
        for i, x in enumerate(lineas):
            m = re.match(r"^GMT\d+-(T\d+[a-c]?)$", x)
            if m and m.group(1) in mias and i + 4 < len(lineas) and "tabla 7.1" not in mias[m.group(1)]["notas"]:
                c = lineas[i + 1:i + 5]  # ancho, flujo, O2, comentario
                f = mias[m.group(1)]
                comentario = "" if re.match(r"^-+$|^BASS|^NASA|^GMT\d", c[3]) else c[3]  # guiones, pie de pagina u otra fila
                f["resultado"] = (pares(desenlace_segun_tabla_7_1=comentario, flujo_cm_s=c[1], ancho_cm=c[0])
                                  + ("; " + f["resultado"] if f["resultado"] else ""))[:900]
                f["notas"] += "; el desenlace sale de la tabla 7.1 del mismo reporte, pagina 104"
                con_71 += 1
    else:
        avisos.append("falta el texto del reporte de BASS-II (correr extraer_texto.py)")
    return "BASS-II: %d pruebas con observaciones y %d con direccion del flujo (apendice A); %d con velocidad de " \
           "propagacion (tabla 5.1); %d con desenlace (tabla 7.1)%s" % (
               con_obs, con_dir, con_51, con_71, ("; AVISO: " + "; ".join(avisos)) if avisos else "")


MATRIZ_BASS = cargar_matriz_bass()

MAPEO = [  # (id, fragmento del nombre del archivo, funcion)
    ("PSI-10", "Normal Flame", flame_design_normal), ("PSI-10", "Inverse Flame", flame_design_inversa),
    ("PSI-20", "ACME BRE", bre), ("PSI-21", "CLD Flame", cld), ("PSI-22", "E-FIELD", efield),
    ("PSI-23", "s-Flame", sflame), ("PSI-25", "BASS-II", bass2), ("PSI-26", "BASS", bass),
    ("PSI-39", "CFI", cfi), ("PSI-47", "DAFT", daft), ("PSI-68", "Flex2", flex2), ("PSI-69", "FLEX", flex),
    ("PSI-98", "SAFFIRE", saffire), ("PSI-99", "SAFFIRE", saffire), ("PSI-100", "SAFFIRE", saffire),
    ("PSI-101", "SAME-R", same_r), ("PSI-102", "SAME", same), ("PSI-106", "Slice", slice_),
    ("PSI-107", "Spice", spice), ("PSI-159", "Normal Flames", cfig_normal), ("PSI-159", "Inverse Flames", cfig_inversa),
]
# Tablas que se bajaron pero no entran a pruebas.csv, con su razon.
NO_MAPEADAS = {"PSI-77": "soldadura, no combustion", "PSI-108": "fisica de fluidos, no combustion",
               "PSI-181": "ciencia de materiales, no combustion",
               "PSI-142": "es un indice de figuras de articulos, no una lista de pruebas"}


def num(acc):
    return int(re.search(r"(\d+)$", acc).group(1))


ORDEN_ROLES = ["principal investigator (pi)", "co-investigator (co-i)", "project scientist",
               ("submitter", "investigation role"), "data curation role", "methodology role",
               "formal analysis role", "visualization role", "validation role", "software role",
               "writing original draft role", "writing review and editing role", "resources role",
               "funding acquisition role"]


def cita_psi(d):
    """Reproduce la formula con la que el sitio de PSI arma 'Cite this Investigation'
    (funciones getCitation y sortPeople de main.5216219a85b99359.js, leido el 2026-11-13):
    autores ordenados por rol, como 'Apellido N', y luego titulo, repositorio, version y DOI."""
    grupos = [[] for _ in range(len(ORDEN_ROLES) + 1)]
    for c in d.get("contacts") or []:
        roles = [limpio(r.get("annotationValue")).lower() for r in c.get("roles") or []]
        puesto = len(ORDEN_ROLES)
        for i, rol in enumerate(ORDEN_ROLES):
            opciones = rol if isinstance(rol, tuple) else (rol,)
            if any(o in roles for o in opciones):
                puesto = i
                break
        grupos[puesto].append(c)
    autores = []
    for c in [x for g in grupos for x in g]:
        nombre, medio = c.get("firstName") or "", c.get("midInitials") or ""
        if not nombre:
            continue
        autores.append("%s %s%s" % (c.get("lastName") or "", nombre[0], medio[0] if medio else ""))
    if not autores or not d.get("title"):
        return ""
    return '%s. "%s", NASA PSI Data Repository%s, %s' % (
        ", ".join(autores), d["title"], ", Version %s" % d["version"] if d.get("version") else "",
        "http://doi.org/" + d["doi"] if d.get("doi") else "")


def main():
    lista = json.loads((RAW / "listas" / "todas.json").read_text(encoding="utf-8"))
    de_lista = {h["_source"]["Accession"]: h["_source"] for h in lista["hits"]["hits"]}
    manifest = json.loads((RAW / "manifest.json").read_text(encoding="utf-8"))

    fichas = {}
    for ruta in (RAW / "fichas").glob("*.json"):
        d = json.loads(ruta.read_text(encoding="utf-8"))
        fichas[d["accession"]] = d

    # ---- pruebas.csv
    pruebas, usadas = [], set()
    for acc, frag, fn in MAPEO:
        rutas = [p for p in (RAW / "tablas" / acc).glob("*") if frag in p.name]
        if len(rutas) != 1:
            raise SystemExit("esperaba una tabla para %s/%s y halle %d" % (acc, frag, len(rutas)))
        usadas.add(rutas[0])
        acr = limpio(fichas[acc].get("investigationAcronym"))
        pruebas.extend(fn(acc, acr, rutas[0].name, leer_tabla(rutas[0])))
    sobrantes = [p for p in (RAW / "tablas").glob("*/*") if p not in usadas and p.parent.name not in NO_MAPEADAS]
    if sobrantes:
        raise SystemExit("tablas sin mapear: %s" % sobrantes)
    if "September 9, 2010" not in limpio(fichas["PSI-101"].get("approach")) + limpio(fichas["PSI-101"].get("objective")):
        raise SystemExit("la ficha de SAME-R ya no dice el ano 2010: revisar ANIO_SAME_R")
    vistos = {}
    for f in pruebas:  # filas identicas en todo menos en el numero de fila
        clave = tuple(f[c] for c in COLS if c not in ("fila_origen", "duplicado_de_fila"))
        if clave in vistos:
            f["duplicado_de_fila"] = vistos[clave]
        else:
            vistos[clave] = f["fila_origen"]
    pruebas, resumen_cfi = integrar_cfi(pruebas, limpio(fichas["PSI-39"].get("investigationAcronym")))
    print(resumen_cfi)
    print(reporte_bass2(pruebas))
    print(ambiente_saffire(pruebas))
    pruebas, resumen_same = resultados_same(pruebas, limpio(fichas["PSI-102"].get("investigationAcronym")))
    print(resumen_same)
    filas_bre, resumen_bre = pruebas_bre(limpio(fichas["PSI-20"].get("investigationAcronym")))
    pruebas.extend(filas_bre)
    print(resumen_bre)
    orden = {a: i for i, a in enumerate(sorted(fichas, key=num))}
    pruebas.sort(key=lambda f: orden[f["id_investigacion"]])  # el orden es estable: conserva el de cada tabla
    hoy = datetime.date.today().isoformat()
    for f in pruebas:  # una fecha futura es una errata de la tabla original
        if f["fecha"] and f["fecha"] > hoy:
            f["notas"] = (f["notas"] + "; fecha original '%s' imposible (futura): no se uso" % f["fecha_original"]).strip("; ")
            f["fecha"] = ""
    with open(SALIDA / "pruebas.csv", "w", newline="", encoding="utf-8-sig") as fh:
        w = csv.DictWriter(fh, fieldnames=COLS, lineterminator="\n")
        w.writeheader()
        w.writerows(pruebas)

    # ---- investigaciones.csv
    cols_inv = ["id", "acronimo", "titulo", "grupo", "doi", "area", "subarea", "tipo_proyecto", "plataforma",
                "equipo", "fecha_inicio", "fecha_fin", "fecha_publicacion", "investigadores", "objetivos",
                "enfoque", "hipotesis", "beneficios_tierra", "investigaciones_relacionadas", "palabras_clave",
                "n_tablas", "n_filas_pruebas", "nivel_filas", "n_pruebas_individuales", "n_flamas_encendidas",
                "n_publicaciones", "tamano_total_gb", "licencia", "version_ficha", "fecha_modificacion",
                "fecha_descarga", "url", "url_api", "cita_psi"]
    inv = []
    for acc in sorted(fichas, key=num):
        d, s = fichas[acc], de_lista.get(acc, {})
        mias = [p for p in pruebas if p["id_investigacion"] == acc]
        niveles = sorted({p["nivel_fila"] for p in mias})
        flamas = [numeros(re.search(r"flamas encendidas=([^;]*)", p["resultado"]).group(1))
                  for p in mias if "flamas encendidas=" in p["resultado"]]
        if acc in FUERA:
            grupo = "fuera_de_alcance: " + FUERA[acc]
        elif "ground" in limpio(d.get("projectType")).lower():
            grupo = "estudio_en_tierra"
        else:
            grupo = "combustion_microgravedad"
        personas = "; ".join(limpio("%s %s" % (c.get("firstName", ""), c.get("lastName", ""))) +
                             (" (%s)" % ", ".join(r.get("annotationValue", "") for r in c.get("roles", []))
                              if c.get("roles") else "") for c in d.get("contacts") or [])

        def fecha_mdY(t):
            m = re.match(r"^(\d{2})-(\d{2})-(\d{4})$", limpio(t))
            return iso(m.group(3), m.group(1), m.group(2)) if m else limpio(t)

        inv.append({
            "id": acc, "acronimo": limpio(d.get("investigationAcronym")), "titulo": limpio(d.get("title")),
            "grupo": grupo, "doi": limpio(d.get("doi")), "area": limpio(d.get("researchArea")),
            "subarea": limpio(d.get("subResearchArea")), "tipo_proyecto": limpio(d.get("projectType")),
            "plataforma": limpio(d.get("flightProgram")), "equipo": limpio(d.get("experimentHardware")),
            "fecha_inicio": fecha_mdY(d.get("investigationStartDate")),
            "fecha_fin": fecha_mdY(d.get("investigationEndDate")),
            "fecha_publicacion": limpio(d.get("releaseDate")), "investigadores": personas,
            "objetivos": limpio(d.get("objective")), "enfoque": limpio(d.get("approach")),
            "hipotesis": limpio(d.get("hypothesis")), "beneficios_tierra": limpio(d.get("researchImpacts")),
            "investigaciones_relacionadas": limpio(d.get("related_glds")),
            "palabras_clave": "; ".join(k for k in (limpio(x) for x in re.split(r"\s{3,}", str(s.get("Keywords", "")))) if k),
            "n_tablas": len(d.get("experimentalTable") or []), "n_filas_pruebas": len(mias),
            "nivel_filas": "; ".join(niveles),
            "n_pruebas_individuales": sum(1 for p in mias if p["nivel_fila"] in ("prueba", "muestra")),
            "n_flamas_encendidas": fmt(sum(v[0] for v in flamas if v)) if flamas else "",
            "n_publicaciones": len(d.get("publications") or []),
            "tamano_total_gb": "%.1f" % ((d.get("totalFileSize") or 0) / 1e9),
            "licencia": limpio(d.get("licenseIdentifier")), "version_ficha": d.get("version"),
            "fecha_modificacion": limpio(d.get("modifiedDate")),
            "fecha_descarga": manifest["archivos"].get("fichas/%s.json" % acc, {}).get("fecha", "")[:10],
            "url": "https://psi.nasa.gov/physci/repo/data/investigations/" + acc,
            "url_api": "https://psi.nasa.gov/geode-py/ws/repo/investigations/" + acc,
            "cita_psi": cita_psi(d),
        })
    with open(SALIDA / "investigaciones.csv", "w", newline="", encoding="utf-8-sig") as fh:
        w = csv.DictWriter(fh, fieldnames=cols_inv, lineterminator="\n")
        w.writeheader()
        w.writerows(inv)

    # ---- publicaciones.csv
    pubs = []
    for acc in sorted(fichas, key=num):
        for pub in fichas[acc].get("publications") or []:
            estado = pub.get("status")
            pubs.append({"id_investigacion": acc, "acronimo": limpio(fichas[acc].get("investigationAcronym")),
                         "titulo": limpio(pub.get("title")), "autores": limpio(pub.get("authorList")),
                         "doi": limpio(pub.get("doi")), "pubmed_id": limpio(pub.get("pubMedID")),
                         "estado": limpio(estado.get("annotationValue")) if isinstance(estado, dict) else limpio(estado)})
    with open(SALIDA / "publicaciones.csv", "w", newline="", encoding="utf-8-sig") as fh:
        w = csv.DictWriter(fh, fieldnames=list(pubs[0].keys()), lineterminator="\n")
        w.writeheader()
        w.writerows(pubs)
    print("publicaciones.csv: %d filas (%d con DOI); filas duplicadas en pruebas.csv: %d" % (
        len(pubs), sum(1 for x in pubs if x["doi"]), sum(1 for f in pruebas if f["duplicado_de_fila"])))

    # ---- resumen en pantalla
    print("investigaciones.csv: %d filas | pruebas.csv: %d filas" % (len(inv), len(pruebas)))
    print("%-8s %-20s %5s %5s %5s %5s %5s  %s" % ("id", "acronimo", "filas", "O2", "pres", "flujo", "fecha", "nivel"))
    for i in inv:
        mias = [p for p in pruebas if p["id_investigacion"] == i["id"]]
        if not mias:
            continue
        print("%-8s %-20s %5d %5d %5d %5d %5d  %s" % (
            i["id"], i["acronimo"][:20], len(mias), sum(1 for p in mias if p["oxigeno_pct_min"]),
            sum(1 for p in mias if p["presion_kpa_min"]), sum(1 for p in mias if p["flujo_cm_s_min"]),
            sum(1 for p in mias if p["fecha"]), i["nivel_filas"]))


if __name__ == "__main__":
    main()
