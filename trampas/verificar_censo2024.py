"""
Reproduce las trampas VERIFICADO de trampas.yaml con fuentes oficiales del INE (Censo 2024).
Ejemplo público: comuna de Santiago (CUT 13101). Cambia CUT para probar otra comuna.

Uso:  pip install pandas geopandas pyarrow openpyxl && python verificar_censo2024.py
Descarga ~90 MB desde el bucket público del INE (bktdescargascenso2024).
Pluma: claude · opus 5.5 (Legible), 24-sep-2026. Pendiente de segunda pluma.
"""
import glob, hashlib, os, urllib.request, zipfile
import pandas as pd
import geopandas as gpd

INE = "https://storage.googleapis.com/bktdescargascenso2024"
CUT = "13101"  # Santiago
FUENTES = {
    "mz.zip": (f"{INE}/Datos_agregados/Base_manzana_entidad_CPV24.zip",
               "e21a0a0a13ee1108aa96da96fa608065a3abf2831e938422b5c9bc891d67b4d9"),
    "r13.zip": (f"{INE}/Cartografia/GEOPARQUET/Cartograf%C3%ADa_censo2024_R13.zip",
                "b6e20901d0be6124a8b96ce8a7f13402c1f63e7d23b1cbbd28dd4b589625aa44"),
    "dic.xlsx": (f"{INE}/Datos_agregados/diccionario_variables_glosas_censo2024.xlsx", None),
}


def bajar():
    for nombre, (url, sha) in FUENTES.items():
        if not os.path.exists(nombre):
            urllib.request.urlretrieve(url, nombre)
        h = hashlib.sha256(open(nombre, "rb").read()).hexdigest()
        aviso = "" if sha is None else (" · hash OK" if h == sha else " · HASH DISTINTO: la fuente cambió (ver TR-05)")
        print(f"{nombre}: {os.path.getsize(nombre)} bytes · sha256 {h[:12]}…{aviso}")
        if nombre.endswith(".zip"):
            zipfile.ZipFile(nombre).extractall(".")


def num(s):
    return pd.to_numeric(s, errors="coerce")


def main():
    bajar()
    base = pd.read_csv("Base_manzana_entidad_CPV24.csv", sep=None, engine="python",
                       encoding="utf-8-sig", dtype=str)
    mz = gpd.read_parquet(glob.glob("Cartograf*R13_Manzanas.parquet")[0])

    print("\nTR-01 · fila contenedor sin geometría")
    cont = base[base["CONTENEDOR_COMUNAL"] == "1"]
    print(f"  país: {len(cont)} filas contenedor · {int(num(cont.n_per).sum())} personas sin manzana")
    c = base[base["CUT"] == CUT]
    print(f"  CUT {CUT}: CSV n_per={int(num(c.n_per).sum())} · contenedor={int(num(c[c.CONTENEDOR_COMUNAL == '1'].n_per).sum())}"
          f" · geoparquet n_per={int(num(mz[mz.CUT.astype(str) == CUT].n_per).sum())}")

    print("\nTR-02 · la geometría no se llama geometry")
    print(f"  geometría activa del geoparquet: {mz.geometry.name}")

    print("\nTR-06 · proxy que se lee como hecho")
    dic = pd.read_excel("dic.xlsx", sheet_name=None)
    for hoja, df in dic.items():
        fila = df[df.astype(str).apply(lambda r: r.str.fullmatch("n_asistencia_basica").any(), axis=1)]
        if len(fila):
            print(f"  [{hoja}]", " | ".join(str(v) for v in fila.iloc[0].values if str(v) != "nan"))

    print("\nTR-07 · marcador de supresión")
    negativos = sum(int((num(base[col]) < 0).sum()) for col in base.columns[23:])
    print(f"  valores negativos en la base oficial: {negativos} (no hay -66)")
    for col in ["n_edad_0_5", "n_edad_6_13", "n_edad_14_17", "n_inmigrantes", "n_pueblos_orig", "n_viv_hacinadas"]:
        print(f"  '*' en {col}: {int((base[col] == '*').sum())}")


if __name__ == "__main__":
    main()
