"""Busca una expresion regular en el texto extraido de los documentos de PSI.

Uso:
  python scripts/buscar_texto.py "oxygen concentration" --inv PSI-26 --max 5
  python scripts/buscar_texto.py "psia|kPa" --cuenta          solo cuenta por documento
  python scripts/buscar_texto.py "fan setting" --cat "Science Documents" --ancho 300

Imprime la investigacion, el archivo, la pagina u hoja y el pasaje. No distingue mayusculas.
"""
import argparse
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
TEXTO = RAIZ / "data" / "raw" / "documentos_texto"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("patron")
    ap.add_argument("--inv", nargs="*", help="uno o varios PSI-N")
    ap.add_argument("--cat", help="fragmento del nombre de la categoria")
    ap.add_argument("--arch", help="fragmento del nombre del archivo")
    ap.add_argument("--max", type=int, default=3, help="pasajes por documento")
    ap.add_argument("--ancho", type=int, default=220, help="caracteres a cada lado")
    ap.add_argument("--cuenta", action="store_true")
    args = ap.parse_args()
    pat = re.compile(args.patron, re.I)

    total = 0
    for ruta in sorted(TEXTO.rglob("*.txt"), key=lambda p: (int(p.relative_to(TEXTO).parts[0].split("-")[1]), str(p))):
        rel = ruta.relative_to(TEXTO)
        if args.inv and rel.parts[0] not in args.inv:
            continue
        if args.cat and args.cat.lower() not in rel.parts[1].lower():
            continue
        if args.arch and args.arch.lower() not in rel.name.lower():
            continue
        t = ruta.read_text(encoding="utf-8")
        ms = list(pat.finditer(t))
        if not ms:
            continue
        total += len(ms)
        nombre = rel.name[:-4]
        if args.cuenta:
            print("%4d  %s | %s | %s" % (len(ms), rel.parts[0], rel.parts[1][:12], nombre[:90]))
            continue
        print("## %s | %s | %s  (%d coincidencias)" % (rel.parts[0], rel.parts[1], nombre[:100], len(ms)))
        ultimo = -10 ** 9
        mostrados = 0
        for m in ms:
            if m.start() - ultimo < args.ancho:
                continue
            ultimo = m.start()
            marcas = re.findall(r"===== (pagina \d+|hoja [^=]+|parte \d+) =====", t[:m.start()])
            lugar = marcas[-1].strip() if marcas else "inicio"
            frag = re.sub(r"\s+", " ", t[max(0, m.start() - args.ancho):m.end() + args.ancho])
            print("   [%s] ...%s..." % (lugar, frag))
            mostrados += 1
            if mostrados >= args.max:
                break
    print("total de coincidencias:", total)


if __name__ == "__main__":
    main()
