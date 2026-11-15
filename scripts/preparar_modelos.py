"""Prepara los modelos 3D de NASA para la plataforma (D-1427).

- Habitat Demonstration Unit (parte 1): borra las insignias de NASA de la textura, pintando cada una con el
  color de su alrededor. Las banderas y los demas rotulos se quedan.
- Mark III: su textura «texturelogo» es solo la insignia sobre un fondo liso; se pinta toda del color de fondo.
- Tierra y Marte: sus texturas PNG pasan a JPEG de buena calidad, mismo tamano en pixeles.
- ISS y Habitat (parte 2): se copian sin cambios.
Reescribe el bloque binario del .glb con las imagenes nuevas y deja todo lo demas igual.

Uso: python -E -P preparar_modelos.py CARPETA_BAJADOS CARPETA_SALIDA
"""
import io
import json
import struct
import sys
from pathlib import Path

from PIL import Image

ORIGEN, DESTINO = Path(sys.argv[1]), Path(sys.argv[2])
DESTINO.mkdir(parents=True, exist_ok=True)


def leer(ruta):
    datos = ruta.read_bytes()
    pos, js, binario = 12, None, b""
    while pos < len(datos):
        n, tipo = struct.unpack_from("<I4s", datos, pos)
        trozo = datos[pos + 8:pos + 8 + n]
        if tipo == b"JSON":
            js = json.loads(trozo.decode("utf-8"))
        elif tipo == b"BIN\x00":
            binario = trozo
        pos += 8 + n
    return js, binario


def escribir(ruta, js, binario):
    texto = json.dumps(js, separators=(",", ":")).encode("utf-8")
    texto += b" " * ((4 - len(texto) % 4) % 4)
    binario += b"\x00" * ((4 - len(binario) % 4) % 4)
    total = 12 + 8 + len(texto) + 8 + len(binario)
    ruta.write_bytes(struct.pack("<4sII", b"glTF", 2, total) + struct.pack("<I4s", len(texto), b"JSON") + texto
                     + struct.pack("<I4s", len(binario), b"BIN\x00") + binario)


def reconstruir(js, binario, nuevas):
    """nuevas: {indice de bufferView: bytes}. Vuelve a acomodar todas las vistas, alineadas a 4 bytes."""
    vistas = js["bufferViews"]
    orden = sorted(range(len(vistas)), key=lambda i: vistas[i].get("byteOffset", 0))
    salida = bytearray()
    for i in orden:
        v = vistas[i]
        ini = v.get("byteOffset", 0)
        trozo = nuevas.get(i, binario[ini:ini + v["byteLength"]])
        salida += b"\x00" * ((4 - len(salida) % 4) % 4)
        v["byteOffset"] = len(salida)
        v["byteLength"] = len(trozo)
        salida += trozo
    js["buffers"][0]["byteLength"] = len(salida)
    return bytes(salida)


def fondo_de(im, caja):
    """Mediana del anillo alrededor de la caja, sin los pixeles azules ni rojos de la insignia."""
    x0, y0, x1, y1 = caja
    px, w, h = im.load(), im.size[0], im.size[1]
    anillo = []
    for x in range(max(0, x0 - 3), min(w, x1 + 4)):
        for y in (max(0, y0 - 3), min(h - 1, y1 + 3)):
            anillo.append(px[x, y][:3])
    for y in range(max(0, y0 - 3), min(h, y1 + 4)):
        for x in (max(0, x0 - 3), min(w - 1, x1 + 3)):
            anillo.append(px[x, y][:3])
    limpio = [c for c in anillo if not (c[2] > c[0] + 40 or c[0] > c[2] + 60)] or anillo
    return tuple(sorted(c[k] for c in limpio)[len(limpio) // 2] for k in range(3))


def borrar(im, cajas):
    im = im.convert("RGB")
    for caja in cajas:
        color = fondo_de(im, caja)
        im.paste(color, caja[:2] + (caja[2] + 1, caja[3] + 1))
    return im


# Insignias del habitat, medidas en la textura de 1024 px (buscar_insignia.py y recorte revisado a ojo):
# ocho chicas junto a «Segment A..H» y dos grandes en la franja de rotulos.
CHICAS = [(130, y0 - 3, 151, y0 + 12) for y0 in (39, 119, 199, 281, 362, 443, 523, 604)]
GRANDES = [(188, 154, 254, 204), (188, 478, 254, 528)]


def codificar(im, formato, **kw):
    buf = io.BytesIO()
    im.save(buf, formato, **kw)
    return buf.getvalue()


def procesar(nombre, salida, regla):
    js, binario = leer(ORIGEN / nombre)
    nuevas = {}
    for k, img in enumerate(js.get("images", [])):
        if "bufferView" not in img:
            continue
        v = js["bufferViews"][img["bufferView"]]
        crudo = binario[v.get("byteOffset", 0):v.get("byteOffset", 0) + v["byteLength"]]
        im = Image.open(io.BytesIO(crudo))
        hecho = regla(k, img, im)
        if hecho is None:
            continue
        nuevo, mime = hecho
        nuevas[img["bufferView"]] = nuevo
        print("   %s textura %d %s: %s %d bytes -> %s %d bytes" % (nombre, k, img.get("name"), img.get("mimeType"), len(crudo), mime, len(nuevo)))
        img["mimeType"] = mime
    if nuevas:
        binario = reconstruir(js, binario, nuevas)
        js.setdefault("asset", {}).setdefault("extras", {})["hamac"] = "Textures edited by team Hamac for One Fire, Many Worlds; see the credit on the site."
    escribir(DESTINO / salida, js, binario)
    print("  ", salida, (DESTINO / salida).stat().st_size, "bytes")


def regla_habitat(k, img, im):
    mime = img.get("mimeType")
    limpia = borrar(im, CHICAS + GRANDES)
    if mime == "image/webp":
        return codificar(limpia, "WEBP", quality=90), mime
    return codificar(limpia, "JPEG", quality=92), "image/jpeg"


def regla_traje(k, img, im):
    rgba = im.convert("RGBA")
    fondo = rgba.getpixel((5, 5))
    lisa = Image.new("RGBA", rgba.size, fondo)
    mime = img.get("mimeType")
    if mime == "image/webp":
        return codificar(lisa, "WEBP", quality=90), mime
    return codificar(lisa, "PNG"), "image/png"


def regla_planeta(k, img, im):
    if img.get("mimeType") != "image/png":
        return None
    if im.mode in ("RGBA", "LA") and im.getextrema()[-1][0] < 255:
        print("   textura %d con transparencia: se queda en PNG" % k)
        return None
    return codificar(im.convert("RGB"), "JPEG", quality=88), "image/jpeg"


procesar("hdu1.glb", "habitat-1.glb", regla_habitat)
procesar("hdu2.glb", "habitat-2.glb", lambda k, img, im: None)
procesar("mark3.glb", "mark-iii.glb", regla_traje)
procesar("earth.glb", "earth.glb", regla_planeta)
procesar("mars.glb", "mars.glb", regla_planeta)
procesar("iss.glb", "iss.glb", lambda k, img, im: None)
