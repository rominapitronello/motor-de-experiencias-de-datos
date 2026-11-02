#!/usr/bin/env python3
"""VES v0.1: validar contrato estructural + coherencia con el grafo y casos adversariales.
Pluma: Sol · GPT-6. Los checks locales NO verifican la verdad de las fuentes ni calidad estética.
Uso: python3 -m pip install -r casos/requirements.txt && python3 casos/probar_ves.py
"""
import copy
import json
import sys
from pathlib import Path

import yaml
from jsonschema import Draft202012Validator, FormatChecker

RAIZ = Path(__file__).resolve().parents[1]
def cargar_json(rel):
    return json.loads((RAIZ / rel).read_text(encoding="utf-8"))

def aplicar_cambios(documento, cambios):
    """Ruta de prueba con puntos: la posición de listas es un índice numérico."""
    doc = copy.deepcopy(documento)
    for ruta, valor in cambios.items():
        partes = ruta.split(".")
        nodo = doc
        for parte in partes[:-1]:
            nodo = nodo[int(parte)] if isinstance(nodo, list) else nodo[parte]
        final = partes[-1]
        if isinstance(nodo, list):
            i = int(final)
            if i >= len(nodo) or i < 0:
                raise KeyError(f"Ruta inexistente: {ruta}")
            nodo[i] = valor
        else:
            if final not in nodo:
                raise KeyError(f"Ruta inexistente: {ruta}")
            nodo[final] = valor
    return doc

def coherencia(doc, grafo):
    errores = []
    rev = doc["revision"]
    vacios = rev["vacios"]
    tipos = [v["tipo"] for v in vacios]
    tipos_esperados = {"sin_residentes", "fusion_organismo", "agregacion_propia"}
    if set(tipos) != tipos_esperados or len(tipos) != 3:
        errores.append("vacios: faltan clases o hay duplicados")
    trampas_ids = [t["id"] for t in rev["trampas"]]
    if len(trampas_ids) != len(set(trampas_ids)):
        errores.append("trampa duplicada: una ID no puede recibir estados contradictorios")
    for v in vacios:
        if v["estado"] == "presente" and not v["leyenda"].strip():
            errores.append(f"vacio {v['tipo']}: falta leyenda")

    accion = doc["decision"]["accion"]
    if accion != "renderizar":
        return errores

    capacidad = doc["capacidad"]
    if capacidad["estado"] == "not_answerable":
        errores.append("no se puede renderizar not_answerable")
    if not capacidad["afirmaciones"]:
        errores.append("no hay afirmaciones soportadas")
    if capacidad["estado"] == "partial" and (not capacidad["limites"] or not capacidad["no_afirmar"]):
        errores.append("partial: debe declarar límites y afirmaciones no soportadas")

    if any(t["estado"] == "pendiente" for t in rev["trampas"]):
        errores.append("hay trampas pendientes de resolución")
    if any(v["estado"] == "no_evaluado" for v in vacios):
        errores.append("hay clases de vacío sin evaluar")
    if doc["seguridad"]["celdas_pequenas"] == "pendientes":
        errores.append("celdas pequeñas sin resolver")
    if doc["seguridad"]["celdas_pequenas"] == "agregadas":
        propia = [v for v in vacios if v["tipo"] == "agregacion_propia"]
        if len(propia) != 1 or propia[0]["estado"] != "presente" or not propia[0]["leyenda"].strip():
            errores.append("agregacion_propia: celdas pequeñas agregadas requieren vacío presente y leyenda")
    for a in capacidad["afirmaciones"]:
        if a["tipo"] == "proxy" and not a["definicion"].strip():
            errores.append("proxy sin definición explícita")

    d = doc["didactica"]
    r = doc["render"]
    if d is None or r is None:
        errores.append("render requiere didáctica y plan de render")
        return errores
    aristas = grafo["aristas"]
    formas = aristas["tarea_forma"].get(d["tarea"], [])
    if not formas:
        errores.append(f"grafo sin arista tarea→forma para {d['tarea']}")
    elif d["forma"] not in formas:
        errores.append(f"forma {d['forma']} no respaldada por tarea {d['tarea']}")
    if d["alternativa"]["forma"] not in formas:
        errores.append("alternativa fuera de formas candidatas del grafo")
    if d["alternativa"]["forma"] == d["forma"]:
        errores.append("alternativa no es alternativa: repite la forma principal")
    tecnicas = aristas["proposito_tecnica"].get(d["proposito"], [])
    if d["tecnica_id"] not in tecnicas:
        errores.append(f"técnica {d['tecnica_id']} no respaldada por propósito {d['proposito']}")
    nivel = aristas["patron_compromiso"].get(d["patron"])
    orden_icap = {"pasivo": 0, "activo": 1, "constructivo": 2, "interactivo": 3}
    if nivel is None:
        errores.append(f"patrón {d['patron']} sin compromiso ICAP mapeado")
    elif orden_icap[d["compromiso"]] < orden_icap[nivel]:
        errores.append(f"compromiso ICAP {d['compromiso']} inferior al piso {nivel}")
    elif orden_icap[d["compromiso"]] > orden_icap[nivel]:
        if orden_icap[d["compromiso"]] >= 2 and r["interaccion"]["tipo"] not in ("prediccion", "explicacion"):
            errores.append("elevación ICAP: falta predicción o explicación que produzca una idea")
    if d["compromiso"] in ("constructivo", "interactivo") and r["interaccion"]["tipo"] not in ("prediccion", "explicacion"):
        errores.append("ICAP constructivo exige predicción o explicación; no basta el piso del grafo")
    if d["compromiso"] == "interactivo" and not r["interaccion"]["co_construccion"]:
        errores.append("ICAP interactivo requiere co-construcción verificable")
    if r["interaccion"]["co_construccion"] and d["compromiso"] != "interactivo":
        errores.append("co-construcción declarada requiere ICAP interactivo")
    if d["patron"] == "predict_reveal":
        if r["interaccion"]["tipo"] != "prediccion":
            errores.append("predict_reveal exige interacción de predicción")
        if not r["interaccion"]["permite_no_adivinar"]:
            errores.append("predict_reveal debe ofrecer 'prefiero no adivinar'")

    variables_declaradas = {v for f in doc["fuentes"] for v in f["variables"]}
    if r["codificacion"]["variable"] not in variables_declaradas:
        errores.append("codificación: variable no figura en fuentes declaradas")

    if r["codificacion"]["usa_coropletico"] and r["codificacion"]["normalizacion"] == "ninguna":
        errores.append("no se permite coropleta de conteos brutos")
    p = r["publicacion"]
    if p["tipo"] == "pagina_autocontenida" and (not p["sin_teselas"] or not p["sin_apis_externas"]):
        errores.append("página autocontenida no puede requerir teselas/APIs externas")
    return errores

def evaluar(doc, validator, grafo):
    errores = sorted(validator.iter_errors(doc), key=lambda e: (list(map(str, e.path)), e.message))
    fallas_schema = [f"schema ({'/'.join(map(str, e.path))}): {e.message}" for e in errores]
    if fallas_schema:
        return fallas_schema  # no intentar cruces semánticos si faltan campos
    return coherencia(doc, grafo)

def main():
    esquema = cargar_json("ves/schema.json")
    Draft202012Validator.check_schema(esquema)
    validator = Draft202012Validator(esquema, format_checker=FormatChecker())
    grafo = yaml.safe_load((RAIZ / "grafo/grafo.yaml").read_text(encoding="utf-8"))
    base = cargar_json("ves/ejemplo.json")
    pruebas = cargar_json("casos/pruebas.json")["casos"]
    errores = 0
    for prueba in pruebas:
        try:
            documento = aplicar_cambios(base, prueba["cambios"])
        except (KeyError, IndexError, ValueError, TypeError) as e:
            print(f"FAIL {prueba['id']}: mutación inválida ({e})")
            errores += 1
            continue
        hallazgos = evaluar(documento, validator, grafo)
        real_valido = not hallazgos
        motivo = prueba.get("motivo_esperado", "")
        coincide_motivo = real_valido or not motivo or any(motivo in e for e in hallazgos)
        pasa = (real_valido == prueba["esperado_valido"]) and coincide_motivo
        print(f"{'OK ' if pasa else 'FAIL'} {prueba['id']}: {'válida' if real_valido else 'bloqueada'}")
        if not pasa:
            errores += 1
            if motivo and not coincide_motivo:
                print(f"  - NO aparece motivo esperado: {motivo!r}")
            for e in hallazgos:
                print("  - " + e)
    print(f"\n{len(pruebas) - errores}/{len(pruebas)} casos con resultado y motivo esperados.")
    if errores:
        return 1
    print("Nota: esta suite no verifica fuentes ni reemplaza segunda pluma y revisión visual.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
