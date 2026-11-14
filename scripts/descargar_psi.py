"""Descarga del repositorio PSI de NASA (https://psi.nasa.gov) para el reto Flame in Freefall.

Baja y guarda TAL CUAL en data/raw/:
  listas/   la lista completa de investigaciones y las busquedas por termino
  fichas/   la ficha JSON de cada investigacion candidata (PSI-N.json)
  archivos/ el listado completo de archivos de cada investigacion (PSI-N.json)
  tablas/   las tablas experimentales (PSI-N/<nombre original>)
y deja data/raw/manifest.json con url, fecha, bytes y sha256 de cada archivo.

Reglas: una peticion por segundo como maximo, no vuelve a bajar lo que ya existe,
dos intentos por direccion y nada de datos crudos (videos, imagenes).

Uso:
  python scripts/descargar_psi.py                 todo
  python scripts/descargar_psi.py --solo-listas   solo listas y resumen de candidatas

Las direcciones son las que usa el propio sitio; no estan documentadas y pueden cambiar.
"""
import argparse
import datetime
import hashlib
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
RAW = RAIZ / "data" / "raw"
MANIFEST = RAW / "manifest.json"

BASE = "https://psi.nasa.gov/geode-py/ws"
URL_BUSQUEDA = BASE + "/repo/search"
URL_FICHA = BASE + "/repo/investigations/{acc}"
URL_TABLA = BASE + "/studies/{acc}/download"
URL_ARCHIVOS = BASE + "/files/v2"

UA = "Mozilla/5.0 (script de investigacion; descarga respetuosa, 1 peticion/s)"
PAUSA = 1.1  # segundos entre peticiones
INTENTOS = 2
TOPE_TABLA = 50 * 1024 * 1024  # una tabla experimental no deberia pesar mas que esto

# Terminos de busqueda: los del encargo mas cada acronimo que falta ubicar.
TERMINOS = [
    "combustion", "fire", "flame", "smoke", "aerosol", "flammability", "soot",
    "extinguishment", "droplet",
    "BASS", "FLEX", "DAFT", "ACME", "Saffire", "SAME", "SPICE", "SLICE", "CFI",
    "SoFIE", "FM2",
    # Terminos de auditoria (13-nov): no meten candidatas, solo sirven para comprobar que no
    # quedo fuera nada relevante para seguridad contra incendios en otras areas de PSI.
    "partial gravity", "lunar", "Moon", "Mars", "spacesuit", "exploration atmosphere", "ignition",
    "suppression", "extinguisher", "water mist", "oxygen", "pyrolysis", "battery", "lithium",
    "explosion", "burning", "spacecraft fire", "detector", "carbon monoxide", "toxic", "LUCI", "FLARE",
    "flammable", "fire safety", "smoldering", "wildfire",
]

_ultimo = [0.0]


def pedir(url):
    """GET con pausa global. Devuelve (estado, cuerpo, error)."""
    error = None
    for intento in range(1, INTENTOS + 1):
        espera = PAUSA - (time.time() - _ultimo[0])
        if espera > 0:
            time.sleep(espera)
        _ultimo[0] = time.time()
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=120) as r:
                return r.status, r.read(), None
        except urllib.error.HTTPError as e:
            error = "HTTP %s" % e.code
        except Exception as e:  # red caida, tiempo agotado, etc.
            error = "%s: %s" % (type(e).__name__, e)
        print("  intento %d fallo: %s" % (intento, error))
    return None, b"", error


def pedir_post(url, cuerpo):
    """POST con JSON, con la misma pausa y reintentos que pedir()."""
    error = None
    for intento in range(1, INTENTOS + 1):
        espera = PAUSA - (time.time() - _ultimo[0])
        if espera > 0:
            time.sleep(espera)
        _ultimo[0] = time.time()
        try:
            req = urllib.request.Request(url, data=json.dumps(cuerpo).encode("utf-8"), method="POST",
                                         headers={"User-Agent": UA, "Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=180) as r:
                return r.status, r.read(), None
        except urllib.error.HTTPError as e:
            error = "HTTP %s" % e.code
        except Exception as e:
            error = "%s: %s" % (type(e).__name__, e)
        print("  intento %d fallo: %s" % (intento, error))
    return None, b"", error


def bajar_listado(acc, version, m):
    """Listado completo de archivos de una investigacion (lo que el sitio muestra en
    'Data files and documents'). OJO: el campo 'added' de la ficha NO es este listado; solo
    trae lo que cambio en la ultima version."""
    destino = RAW / "archivos" / (acc + ".json")
    rel = destino.relative_to(RAW).as_posix()
    if destino.exists() and destino.stat().st_size > 0:
        return "ya"
    cuerpo = {"folder": "", "fileType": "study", "studyId": acc, "version": version}
    estado, datos, error = pedir_post(URL_ARCHIVOS, cuerpo)
    if estado != 200 or not datos:
        m["fallos"][rel] = {"url": URL_ARCHIVOS, "cuerpo": cuerpo, "error": error or "estado %s" % estado, "fecha": ahora()}
        guardar_manifest(m)
        return "fallo"
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_bytes(datos)
    m["fallos"].pop(rel, None)
    m["archivos"][rel] = {"url": URL_ARCHIVOS, "metodo": "POST", "cuerpo": cuerpo, "fecha": ahora(),
                          "bytes": len(datos), "sha256": hashlib.sha256(datos).hexdigest()}
    guardar_manifest(m)
    return "ok"


def cargar_manifest():
    if MANIFEST.exists():
        return json.loads(MANIFEST.read_text(encoding="utf-8"))
    return {"archivos": {}, "fallos": {}}


def guardar_manifest(m):
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(m, ensure_ascii=False, indent=1), encoding="utf-8")


def bajar(url, destino, m, extra=None):
    """Baja url a destino si no existe. Devuelve 'ya', 'ok' o 'fallo'."""
    rel = destino.relative_to(RAW).as_posix()
    if destino.exists() and destino.stat().st_size > 0:
        return "ya"
    estado, cuerpo, error = pedir(url)
    if estado != 200 or not cuerpo:
        m["fallos"][rel] = {"url": url, "error": error or "estado %s, %d bytes" % (estado, len(cuerpo)),
                            "fecha": ahora()}
        guardar_manifest(m)
        return "fallo"
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_bytes(cuerpo)
    m["fallos"].pop(rel, None)
    m["archivos"][rel] = {"url": url, "fecha": ahora(), "bytes": len(cuerpo),
                          "sha256": hashlib.sha256(cuerpo).hexdigest()}
    if extra:
        m["archivos"][rel].update(extra)
    guardar_manifest(m)
    return "ok"


def ahora():
    return datetime.datetime.now().astimezone().isoformat(timespec="seconds")


def nombre_seguro(nombre):
    """Windows no admite ciertos caracteres en nombres de archivo."""
    return re.sub(r'[<>:"/\\|?*]', "_", nombre)


def leer_hits(ruta):
    d = json.loads(ruta.read_text(encoding="utf-8"))
    hits = d.get("hits", {})
    total = hits.get("total")
    if isinstance(total, dict):
        total = total.get("value")
    return total, [h.get("_source", {}) for h in hits.get("hits", [])]


def fase_listas(m):
    print("== Listas")
    fallos = []
    consultas = [("todas", "")] + [("busqueda_" + t, t) for t in TERMINOS]
    resultado = {}
    for nombre, termino in consultas:
        q = urllib.parse.urlencode({"term": termino, "source": "psi", "type": "investigation", "size": "500"})
        destino = RAW / "listas" / (nombre + ".json")
        r = bajar(URL_BUSQUEDA + "?" + q, destino, m, {"termino": termino})
        if r == "fallo":
            fallos.append(nombre)
            continue
        total, hits = leer_hits(destino)
        completa = (total == len(hits))
        print("  %-24s %s  total=%s recibidos=%d%s" % (nombre, r, total, len(hits),
                                                       "" if completa else "  INCOMPLETA"))
        if not completa:
            fallos.append(nombre + " (incompleta: %s de %s)" % (len(hits), total))
        resultado[nombre] = hits
    return resultado, fallos


# Solo estos terminos meten a la lista una investigacion de otra area. Los acronimos no:
# "SAME", "BASS", "FLEX" o "droplet" coinciden con palabras comunes y traen ruido (probado).
TEMATICOS = {"combustion", "fire", "flame", "smoke", "aerosol", "flammability", "soot", "extinguishment"}


def elegir_candidatas(listas):
    """Candidata = area 'Combustion Science' en la lista completa, o sale en una busqueda tematica.

    De las busquedas por acronimo solo se anota el motivo en las que ya son candidatas."""
    cand = {}
    for s in listas.get("todas", []):
        acc = s.get("Accession")
        if acc and "combustion" in str(s.get("Research Area", "")).lower():
            cand.setdefault(acc, {"area": s.get("Research Area"), "acronimo": s.get("Acronym"), "motivos": []})
            cand[acc]["motivos"].append("area")
    orden = sorted((n for n in listas if n != "todas"),
                   key=lambda n: n.replace("busqueda_", "") not in TEMATICOS)
    for nombre in orden:
        termino = nombre.replace("busqueda_", "")
        for s in listas[nombre]:
            acc = s.get("Accession")
            if not acc:
                continue
            if termino in TEMATICOS:
                cand.setdefault(acc, {"area": s.get("Research Area"), "acronimo": s.get("Acronym"), "motivos": []})
            if acc in cand:
                cand[acc]["motivos"].append(termino)
    return cand


def num(acc):
    mm = re.search(r"(\d+)$", acc)
    return int(mm.group(1)) if mm else 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--solo-listas", action="store_true")
    args = ap.parse_args()

    m = cargar_manifest()
    listas, fallos_listas = fase_listas(m)
    cand = elegir_candidatas(listas)
    (RAW / "candidatas.json").write_text(json.dumps(cand, ensure_ascii=False, indent=1), encoding="utf-8")

    areas = {}
    for s in listas.get("todas", []):
        areas[s.get("Research Area")] = areas.get(s.get("Research Area"), 0) + 1
    print("== Areas en la lista completa:", areas)
    print("== Candidatas: %d" % len(cand))
    for acc in sorted(cand, key=num):
        c = cand[acc]
        print("  %-8s %-22s %-28s %s" % (acc, (c["acronimo"] or "")[:22], (c["area"] or "")[:28], ",".join(c["motivos"])))
    if args.solo_listas:
        return

    print("== Fichas")
    cuenta = {"ya": 0, "ok": 0, "fallo": 0}
    for acc in sorted(cand, key=num):
        r = bajar(URL_FICHA.format(acc=acc), RAW / "fichas" / (acc + ".json"), m)
        cuenta[r] += 1
    print("  fichas:", cuenta)

    print("== Listado completo de archivos")
    cuenta_a = {"ya": 0, "ok": 0, "fallo": 0}
    for acc in sorted(cand, key=num):
        ruta = RAW / "fichas" / (acc + ".json")
        if not ruta.exists():
            continue
        version = json.loads(ruta.read_text(encoding="utf-8")).get("version")
        cuenta_a[bajar_listado(acc, version, m)] += 1
    print("  listados:", cuenta_a)

    print("== Tablas experimentales")
    cuenta_t = {"ya": 0, "ok": 0, "fallo": 0, "omitida": 0}
    sin_tabla = []
    for acc in sorted(cand, key=num):
        ruta = RAW / "fichas" / (acc + ".json")
        if not ruta.exists():
            continue
        ficha = json.loads(ruta.read_text(encoding="utf-8"))
        tablas = ficha.get("experimentalTable") or []
        if not tablas:
            sin_tabla.append(acc)
            continue
        for t in tablas:
            nombre = t.get("file_name")
            if not nombre:
                continue
            if (t.get("file_size") or 0) > TOPE_TABLA:
                print("  %s: omitida por tamano (%s bytes): %s" % (acc, t.get("file_size"), nombre))
                cuenta_t["omitida"] += 1
                continue
            q = urllib.parse.urlencode({"file": nombre, "version": t.get("version", 1)}, quote_via=urllib.parse.quote)
            destino = RAW / "tablas" / acc / nombre_seguro(nombre)
            r = bajar(URL_TABLA.format(acc=acc) + "?" + q, destino, m,
                      {"nombre_original": nombre, "version": t.get("version"), "bytes_declarados": t.get("file_size")})
            cuenta_t[r] += 1
            if r == "fallo":
                print("  %s: FALLO %s" % (acc, nombre))
    print("  tablas:", cuenta_t)
    print("  sin tabla experimental en la ficha:", sin_tabla)

    print("== Resumen")
    print("  listas con problema:", fallos_listas)
    print("  fallos registrados:", list(m["fallos"].keys()))
    print("  archivos en manifest:", len(m["archivos"]))


if __name__ == "__main__":
    sys.exit(main())
