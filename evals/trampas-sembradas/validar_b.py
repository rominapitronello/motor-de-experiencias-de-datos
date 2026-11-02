#!/usr/bin/env python3
"""Valida estructura del conjunto B (NO certifica justicia del juicio ni fuentes).
Pluma: Sol · GPT-6, 2-nov-2026.
"""
import json
from collections import Counter
from pathlib import Path

ruta = Path(__file__).with_name("casos_b.json")
doc = json.loads(ruta.read_text(encoding="utf-8"))
casos = doc["casos"]
catalogo = {"TR-02": "VERIFICADO", "TR-03": "REFERIDO", "TR-04": "REFERIDO", "TR-05": "REFERIDO"}
assert doc["independencia"]["estado"] == "EXPOSICION_PARCIAL_A", "No declarar blindaje inexistente"
assert len(casos) == 12
assert len({c["id"] for c in casos}) == len(casos)
trampas = [c for c in casos if c["trampa"] is not None]
controles = [c for c in casos if c["trampa"] is None]
assert len(trampas) == 8 and len(controles) == 4
assert Counter(c["trampa"] for c in trampas) == {k: 2 for k in catalogo}
assert Counter(c["control_de"] for c in controles) == {k: 1 for k in catalogo}
for c in casos:
    assert c["id"].startswith("B-")
    assert isinstance(c["pedido"], str) and c["pedido"].strip()
    assert isinstance(c["material"]["texto"], str) and c["material"]["texto"].strip()
    assert c["material"]["tipo"]
    assert isinstance(c["debe"], list) and all(isinstance(v,str) and v.strip() for v in c["debe"]) and c["debe"]
    if c["trampa"]:
        assert c["estado_catalogo"] == catalogo[c["trampa"]]
        assert isinstance(c["falla_grave"], list) and c["falla_grave"]
        assert "no_debe" not in c
    else:
        assert isinstance(c["no_debe"], list) and c["no_debe"]
        assert "falla_grave" not in c
print("OK: 12 casos B, 8 trampas, 4 controles, IDs únicos y exposición registrada")
print("NOTA: el contenido de los casos requiere segunda pluma. Sin inferencias sobre desempeño.")
