#!/usr/bin/env python3
"""Separa las respuestas en lo que ve el juez y la tabla de asignación que el juez no ve.

Pluma: Claude · Opus 5.5 (PasaElFiltro), 2-nov-2026. Agregado tras la segunda pluma de Sol (PR #9).

Uso:
  python3 evals/trampas-sembradas/anonimizar.py respuestas.jsonl SALIDA_DIR --semilla 20261102

Entrada, una línea por respuesta:
  {"caso": "A-TR01-1", "linaje": "claude", "condicion": "con_conector", "corrida": 1,
   "texto": "<respuesta final>", "trazas": [...]}      # trazas opcional: llamadas a herramientas

Salida en SALIDA_DIR:
  para_juez.jsonl   {"response_id", "caso", "texto"}  orden barajado; sin linaje, condición, corrida ni trazas
  asignacion.jsonl  {"response_id", "caso", "linaje", "condicion", "corrida"}  la guarda quien anonimiza

Quién anonimiza: Romina, o la pluma que NO juzga ese lote. La asignación no se entrega al juez
hasta que sus etiquetas estén escritas. El texto final no se edita: si menciona el conector o
una TR-xx, el juez lo marca con revela_condicion=true.
"""
import argparse
import json
import random
from pathlib import Path

CAMPOS = {"caso", "linaje", "condicion", "corrida", "texto"}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("respuestas")
    ap.add_argument("salida")
    ap.add_argument("--semilla", type=int, required=True)
    args = ap.parse_args()

    filas = []
    for n, linea in enumerate(Path(args.respuestas).read_text(encoding="utf-8").splitlines(), 1):
        if not linea.strip():
            continue
        r = json.loads(linea)
        faltan = CAMPOS - set(r)
        if faltan:
            raise SystemExit(f"línea {n}: faltan {sorted(faltan)}")
        filas.append(r)

    rng = random.Random(args.semilla)
    rng.shuffle(filas)
    ids = rng.sample(range(10_000, 100_000), len(filas))

    out = Path(args.salida)
    out.mkdir(parents=True, exist_ok=True)
    with (out / "para_juez.jsonl").open("w", encoding="utf-8") as pj, \
         (out / "asignacion.jsonl").open("w", encoding="utf-8") as asg:
        for r, i in zip(filas, ids):
            rid = f"r-{i}"
            pj.write(json.dumps({"response_id": rid, "caso": r["caso"], "texto": r["texto"]}, ensure_ascii=False) + "\n")
            asg.write(json.dumps({"response_id": rid, "caso": r["caso"], "linaje": r["linaje"],
                                  "condicion": r["condicion"], "corrida": r["corrida"]}, ensure_ascii=False) + "\n")
    print(f"{len(filas)} respuestas → {out}/para_juez.jsonl (para el juez) y {out}/asignacion.jsonl (no entregar al juez)")


if __name__ == "__main__":
    main()
