"""Aligera un .glb de NASA sin tocar su geometria.

Modos:
  sinpng  Quita las imagenes PNG que solo estan de respaldo de una WebP (EXT_texture_webp): cada textura queda con
          su WebP y EXT_texture_webp pasa a ser requerida. three.js y model-viewer la leen.
  jpeg    Pasa las imagenes PNG a JPEG (calidad 88), mismo tamano en pixeles. Para texturas de color sin transparencia.
El bloque binario se rearma copiando solo las vistas que siguen en uso; se renumeran las referencias a bufferView en
accesores, imagenes y en la extension KHR_draco_mesh_compression.

Uso: python -X utf8 -E -P aligerar_glb.py MODO ENTRADA.glb SALIDA.glb
"""
import io
import json
import struct
import sys
from pathlib import Path

from PIL import Image

modo, entrada, salida = sys.argv[1], Path(sys.argv[2]), Path(sys.argv[3])


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
    with open(ruta, "wb") as f:
        f.write(struct.pack("<4sII", b"glTF", 2, total))
        f.write(struct.pack("<I4s", len(texto), b"JSON") + texto)
        f.write(struct.pack("<I4s", len(binario), b"BIN\x00") + binario)


js, binario = leer(entrada)
vistas = js["bufferViews"]
imagenes = js.get("images", [])
datos_vista = [binario[v.get("byteOffset", 0):v.get("byteOffset", 0) + v["byteLength"]] for v in vistas]

if modo == "sinpng":
    quitar = set()
    for t in js.get("textures", []):
        webp = t.get("extensions", {}).get("EXT_texture_webp", {}).get("source")
        if webp is not None and "source" in t and imagenes[t["source"]].get("mimeType") == "image/png":
            quitar.add(t["source"])
            del t["source"]
    # una imagen PNG que alguna textura siga usando sin WebP no se quita
    usadas = {t["source"] for t in js.get("textures", []) if "source" in t}
    quitar -= usadas
    req = js.setdefault("extensionsRequired", [])
    if "EXT_texture_webp" not in req:
        req.append("EXT_texture_webp")
elif modo == "jpeg":
    quitar = set()
    for im in imagenes:
        if im.get("mimeType") == "image/png" and "bufferView" in im:
            img = Image.open(io.BytesIO(datos_vista[im["bufferView"]]))
            if img.mode in ("RGBA", "LA", "P"):
                img = img.convert("RGB")
            buf = io.BytesIO()
            img.save(buf, "JPEG", quality=88, optimize=True)
            datos_vista[im["bufferView"]] = buf.getvalue()
            im["mimeType"] = "image/jpeg"
            print("  %s: %dx%d PNG -> JPEG %d bytes" % (im.get("name", "?"), img.width, img.height, len(buf.getvalue())))
else:
    sys.exit("modo desconocido")

# imagenes que quedan y vistas que siguen en uso
nuevo_indice_img, imagenes_nuevas = {}, []
for k, im in enumerate(imagenes):
    if k not in quitar:
        nuevo_indice_img[k] = len(imagenes_nuevas)
        imagenes_nuevas.append(im)
for t in js.get("textures", []):
    if "source" in t:
        t["source"] = nuevo_indice_img[t["source"]]
    ext = t.get("extensions", {}).get("EXT_texture_webp")
    if ext:
        ext["source"] = nuevo_indice_img[ext["source"]]
js["images"] = imagenes_nuevas

en_uso = set()
for a in js.get("accessors", []):
    if "bufferView" in a:
        en_uso.add(a["bufferView"])
for im in imagenes_nuevas:
    if "bufferView" in im:
        en_uso.add(im["bufferView"])
for m in js.get("meshes", []):
    for p in m.get("primitives", []):
        d = p.get("extensions", {}).get("KHR_draco_mesh_compression")
        if d:
            en_uso.add(d["bufferView"])

remap, nuevas, binario_nuevo = {}, [], bytearray()
for k, v in enumerate(vistas):
    if k not in en_uso:
        continue
    while len(binario_nuevo) % 4:
        binario_nuevo.append(0)
    v2 = dict(v)
    v2["byteOffset"] = len(binario_nuevo)
    v2["byteLength"] = len(datos_vista[k])
    binario_nuevo += datos_vista[k]
    remap[k] = len(nuevas)
    nuevas.append(v2)
js["bufferViews"] = nuevas
for a in js.get("accessors", []):
    if "bufferView" in a:
        a["bufferView"] = remap[a["bufferView"]]
for im in imagenes_nuevas:
    if "bufferView" in im:
        im["bufferView"] = remap[im["bufferView"]]
for m in js.get("meshes", []):
    for p in m.get("primitives", []):
        d = p.get("extensions", {}).get("KHR_draco_mesh_compression")
        if d:
            d["bufferView"] = remap[d["bufferView"]]
js["buffers"] = [{"byteLength": len(binario_nuevo) + (4 - len(binario_nuevo) % 4) % 4}]
escribir(salida, js, bytes(binario_nuevo))
print("%s: %d -> %d bytes (imagenes quitadas: %d, vistas %d -> %d)" % (entrada.name, entrada.stat().st_size, salida.stat().st_size, len(quitar), len(vistas), len(nuevas)))
