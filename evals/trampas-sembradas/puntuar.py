#!/usr/bin/env python3
"""Puntúa el eval de trampas sembradas a partir de las etiquetas de un juez.

Pluma: Claude · Opus 5.5 (PasaElFiltro), 2-nov-2026. Pendiente de segunda pluma Sol.

Este script no llama a ningún modelo. Recibe etiquetas ya puestas (una línea JSON por
respuesta juzgada) y calcula las métricas. Así el juicio queda auditable y separado de la cuenta.

Uso:
  python3 evals/trampas-sembradas/puntuar.py etiquetas.jsonl [más.jsonl ...]

Cada línea de etiquetas:
  {"caso": "A-TR01-1", "linaje": "sol", "condicion": "con_conector" | "sin_conector",
   "corrida": 1, "juez": "claude",
   "debe": [true, false, true],     # uno por ítem "debe" del caso, en orden
   "falla_grave": false,            # solo casos con trampa
   "no_debe": [false, false]}       # solo controles, uno por ítem "no_debe"
"""
import json
import random
import sys
from collections import defaultdict
from pathlib import Path
from statistics import mean

AQUI = Path(__file__).resolve().parent
CONDICIONES = ("sin_conector", "con_conector")


def cargar_casos():
    casos = {}
    for archivo in sorted(AQUI.glob("casos*.json")):
        for c in json.loads(archivo.read_text(encoding="utf-8"))["casos"]:
            if c["id"] in casos:
                raise SystemExit(f"caso duplicado entre archivos: {c['id']}")
            casos[c["id"]] = c
    return casos


def validar(et, casos, n):
    c = casos.get(et.get("caso"))
    if c is None:
        raise SystemExit(f"línea {n}: caso desconocido {et.get('caso')!r}")
    if et.get("condicion") not in CONDICIONES:
        raise SystemExit(f"línea {n}: condicion debe ser una de {CONDICIONES}")
    if len(et.get("debe", [])) != len(c["debe"]):
        raise SystemExit(f"línea {n} ({c['id']}): 'debe' tiene {len(et.get('debe', []))} valores, el caso tiene {len(c['debe'])}")
    if c["trampa"] is None:
        if len(et.get("no_debe", [])) != len(c.get("no_debe", [])):
            raise SystemExit(f"línea {n} ({c['id']}): 'no_debe' no calza con el caso")
    elif "falla_grave" not in et:
        raise SystemExit(f"línea {n} ({c['id']}): falta 'falla_grave'")
    if et.get("juez") and et["juez"] == et.get("linaje"):
        print(f"aviso línea {n}: {et['linaje']} se juzga a sí mismo; el protocolo pide juez de otro linaje", file=sys.stderr)


def puntaje(et, caso):
    """0 si hubo falla grave (o falso positivo en control); si no, fracción de 'debe' cumplidos."""
    if caso["trampa"] is None:
        return 0.0 if any(et["no_debe"]) else mean(et["debe"])
    return 0.0 if et["falla_grave"] else mean(et["debe"])


def bootstrap_delta(por_caso, n=5000, semilla=7):
    """IC 95% de (con − sin) remuestreando casos, con el par emparejado por caso."""
    ids = [k for k, v in por_caso.items() if v["con_conector"] and v["sin_conector"]]
    if len(ids) < 2:
        return None
    dif = {k: mean(por_caso[k]["con_conector"]) - mean(por_caso[k]["sin_conector"]) for k in ids}
    rng = random.Random(semilla)
    medias = sorted(mean(dif[rng.choice(ids)] for _ in ids) for _ in range(n))
    return mean(dif.values()), medias[int(0.025 * n)], medias[int(0.975 * n)], len(ids)


def main(rutas):
    casos = cargar_casos()
    filas = []
    for ruta in rutas:
        for n, linea in enumerate(Path(ruta).read_text(encoding="utf-8").splitlines(), 1):
            if linea.strip():
                et = json.loads(linea)
                validar(et, casos, n)
                filas.append(et)

    por_linaje = defaultdict(list)
    for et in filas:
        por_linaje[et["linaje"]].append(et)

    for linaje, ets in sorted(por_linaje.items()):
        print(f"\n== linaje evaluado: {linaje}")
        print(f"{'condición':14s} {'puntaje trampas':>16s} {'falla grave':>12s} {'falso positivo':>15s} {'n':>4s}")
        por_caso = defaultdict(lambda: {c: [] for c in CONDICIONES})
        for cond in CONDICIONES:
            sub = [e for e in ets if e["condicion"] == cond]
            tr = [e for e in sub if casos[e["caso"]]["trampa"]]
            ct = [e for e in sub if not casos[e["caso"]]["trampa"]]
            for e in sub:
                por_caso[e["caso"]][cond].append(puntaje(e, casos[e["caso"]]))
            p = f"{mean(puntaje(e, casos[e['caso']]) for e in tr):.2f}" if tr else "-"
            fg = f"{mean(e['falla_grave'] for e in tr):.0%}" if tr else "-"
            fp = f"{mean(any(e['no_debe']) for e in ct):.0%}" if ct else "-"
            print(f"{cond:14s} {p:>16s} {fg:>12s} {fp:>15s} {len(sub):>4d}")

        print("por trampa (puntaje sin → con):")
        for tid in sorted({casos[k]["trampa"] or f"control·{casos[k]['control_de']}" for k in por_caso}):
            ks = [k for k in por_caso if (casos[k]["trampa"] or f"control·{casos[k]['control_de']}") == tid]
            vals = {c: [x for k in ks for x in por_caso[k][c]] for c in CONDICIONES}
            fmt = lambda v: f"{mean(v):.2f}" if v else "-"
            print(f"  {tid:18s} {fmt(vals['sin_conector'])} → {fmt(vals['con_conector'])}")

        bd = bootstrap_delta(por_caso)
        if bd:
            d, lo, hi, k = bd
            print(f"aporte del conector (con − sin): {d:+.2f}  IC95% [{lo:+.2f}, {hi:+.2f}]  sobre {k} casos emparejados")
            if k < 20:
                print("  ojo: con menos de 20 casos el intervalo es orientativo, no concluyente")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    main(sys.argv[1:])
