"""Exporta a CSV las hojas de calculo utiles que vienen entre los documentos de PSI.

Son datos que las tablas experimentales no traen. Salen tal cual a data/extra/, una hoja por
archivo, sin limpiar: sirven para consultar y para ampliar pruebas.csv despues.

  bass_asrun_2012.csv, bass_asrun_2013.csv   matriz 'as run' de BASS (PSI-26): oxigeno, presion,
                                             anemometro, nitrogeno y observaciones por prueba
  cfi_maestra.csv, cfi_datos.csv,            resumen de CFI (PSI-39): 227 pruebas con diametros de
  cfi_comentarios.csv, cfi_ignicion.csv      extincion, tasas de quemado y reigniciones
  bass2_calibracion_ventilador.csv           BASS-II (PSI-25): voltaje del ventilador contra cm/s

Necesita openpyxl. Los documentos son archivos descargados: correr con
    python -E -P scripts/exportar_hojas.py
"""
import csv
import warnings
from pathlib import Path

import openpyxl

RAIZ = Path(__file__).resolve().parent.parent
DOCS = RAIZ / "data" / "raw" / "documentos"
SALIDA = RAIZ / "data" / "extra"

HOJAS = [
    ("PSI-26/Science Documents/PSI-26_Science Documents_As Run_Test Matrix.xlsx", "2012", "bass_asrun_2012.csv"),
    ("PSI-26/Science Documents/PSI-26_Science Documents_As Run_Test Matrix.xlsx", "2013", "bass_asrun_2013.csv"),
    ("PSI-39/Science Documents/PSI-39_Science Documents_CFI_DataSummary_Spreadsheet_Jan2021.xlsx", "Master Sheet", "cfi_maestra.csv"),
    ("PSI-39/Science Documents/PSI-39_Science Documents_CFI_DataSummary_Spreadsheet_Jan2021.xlsx", "DATA", "cfi_datos.csv"),
    ("PSI-39/Science Documents/PSI-39_Science Documents_CFI_DataSummary_Spreadsheet_Jan2021.xlsx", "Comments", "cfi_comentarios.csv"),
    ("PSI-39/Science Documents/PSI-39_Science Documents_CFI_DataSummary_Spreadsheet_Jan2021.xlsx", "Igniter", "cfi_ignicion.csv"),
    ("PSI-25/Reference Data/PSI-25_Reference Data_Fan calibration data.xlsx", "Fan Calibration data", "bass2_calibracion_ventilador.csv"),
]


def main():
    warnings.simplefilter("ignore")
    SALIDA.mkdir(parents=True, exist_ok=True)
    libros = {}
    for rel, hoja, destino in HOJAS:
        ruta = DOCS / rel
        if not ruta.exists():
            print("falta %s (correr descargar_documentos.py)" % rel)
            continue
        if rel not in libros:
            libros[rel] = openpyxl.load_workbook(ruta, read_only=True, data_only=True)
        filas = [["" if c is None else str(c).replace("\r", " ").replace("\n", " ").strip() for c in f]
                 for f in libros[rel][hoja].iter_rows(values_only=True)]
        filas = [f for f in filas if any(f)]
        ancho = max(len(f) for f in filas)
        with open(SALIDA / destino, "w", newline="", encoding="utf-8-sig") as fh:
            w = csv.writer(fh, lineterminator="\n")
            w.writerow(["origen: %s | hoja: %s" % (rel, hoja)])
            for f in filas:
                w.writerow(f + [""] * (ancho - len(f)))
        print("%-34s %4d filas, %2d columnas" % (destino, len(filas), ancho))


if __name__ == "__main__":
    main()
