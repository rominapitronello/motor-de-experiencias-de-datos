#!/usr/bin/env python3
"""Contraejemplos para puntuar.py. Cada prueba es una forma en que el puntuador podría dar un número falso.

Pluma: Claude · Opus 5.5 (PasaElFiltro), 2-nov-2026. Los contraejemplos P1 son los de la segunda pluma de Sol (PR #9).
Uso: python3 evals/trampas-sembradas/probar_puntuador.py
"""
import copy
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import puntuar as P  # noqa: E402

CASOS = P.cargar_casos()
FALLAS = []


def prueba(nombre):
    def deco(f):
        try:
            f()
            print(f"OK   {nombre}")
        except AssertionError as e:
            FALLAS.append(nombre)
            print(f"FAIL {nombre}: {e}")
        return f
    return deco


def diseno(linaje="sol", juez="claude", corridas=(1, 2), etiqueta=None):
    """Diseño completo sobre todos los casos: devuelve (filas_asignacion, filas_etiquetas)."""
    asg, ets, n = [], [], 0
    for cid, c in sorted(CASOS.items()):
        for cond in P.CONDICIONES:
            for r in corridas:
                n += 1
                rid = f"r-{n}"
                asg.append((n, {"response_id": rid, "caso": cid, "linaje": linaje, "condicion": cond, "corrida": r}))
                e = {"response_id": rid, "juez": juez, "debe": [cond == "con_conector"] * len(c["debe"]),
                     "revela_condicion": False, "adivina_condicion": "no_se"}
                if c["trampa"] is None:
                    e["no_debe"] = [False] * len(c["no_debe"])
                else:
                    e["falla_grave"] = cond == "sin_conector"
                if etiqueta:
                    etiqueta(e, c, cond)
                ets.append((n, e))
    return asg, ets


def correr(asg, ets):
    a = P.validar_asignacion(asg, CASOS)
    e = P.validar_etiquetas(ets, CASOS, a)
    return P.analizar(CASOS, a, e)


def rechaza(asg, ets, fragmento):
    try:
        correr(asg, ets)
    except P.ErrorEntrada as err:
        assert fragmento in str(err), f"rechazó, pero por otra razón: {err}"
        return
    raise AssertionError("aceptó una entrada que debía rechazar")


def con_cambio(i, **cambios):
    asg, ets = diseno()
    ets = copy.deepcopy(ets)
    ets[i][1].update(cambios)
    return asg, ets


def primer_indice(trampa):
    asg, ets = diseno()
    return next(i for i, (_, a) in enumerate(asg) if (CASOS[a["caso"]]["trampa"] is None) != trampa)


T, C = primer_indice(True), primer_indice(False)


# --- P1 de Sol: tipos ---
@prueba("falla_grave como texto 'false' se rechaza")
def _():
    rechaza(*con_cambio(T, falla_grave="false"), "falla_grave")


@prueba("debe con enteros [1,1,1] se rechaza")
def _():
    asg, ets = diseno()
    ets[T][1]["debe"] = [1] * len(ets[T][1]["debe"])
    rechaza(asg, ets, "'debe' solo admite")


@prueba("corrida como texto o cero se rechaza")
def _():
    for valor in ("1", 0):
        asg, ets = diseno()
        asg[0][1]["corrida"] = valor
        rechaza(asg, ets, "corrida")


@prueba("juez o linaje fuera de la lista se rechaza")
def _():
    rechaza(*con_cambio(T, juez="gpt"), "juez")
    asg, ets = diseno()
    asg[0][1]["linaje"] = "otro"
    rechaza(asg, ets, "linaje")


@prueba("campos prohibidos por tipo de caso se rechazan")
def _():
    rechaza(*con_cambio(C, falla_grave=False), "control no lleva")
    rechaza(*con_cambio(T, no_debe=[False]), "trampa no lleva")
    rechaza(*con_cambio(T, comentario="x"), "no reconocidos")


# --- P1 de Sol: duplicados e incompletitud ---
@prueba("response_id repetido se rechaza")
def _():
    asg, ets = diseno()
    asg[1][1]["response_id"] = asg[0][1]["response_id"]
    rechaza(asg, ets, "response_id repetido")


@prueba("(caso, linaje, condición, corrida) repetido con otro id se rechaza")
def _():
    asg, ets = diseno()
    dup = dict(asg[0][1], response_id="r-extra")
    asg.append((999, dup))
    rechaza(asg, ets, "repetido")


@prueba("el mismo juez no puede etiquetar dos veces una respuesta")
def _():
    asg, ets = diseno()
    ets.append((999, copy.deepcopy(ets[0][1])))
    rechaza(asg, ets, "dos veces")


@prueba("si falta una corrida, se reporta y no se calcula efecto")
def _():
    asg, ets = diseno()
    quitar = asg[T][1]["response_id"]
    ets = [(n, e) for n, e in ets if e["response_id"] != quitar]
    est = correr(asg, ets)["estratos"][("principal", "sol", "ajeno")]
    assert est["faltantes"], "no reportó el faltante"
    assert all(m["efecto"] is None for m in est["medidas"].values()), "calculó efecto con diseño incompleto"


@prueba("si falta un caso entero, también se reporta")
def _():
    asg, ets = diseno()
    caso = asg[T][1]["caso"]
    ids = {a["response_id"] for _, a in asg if a["caso"] == caso}
    ets = [(n, e) for n, e in ets if e["response_id"] not in ids]
    est = correr(asg, ets)["estratos"][("principal", "sol", "ajeno")]
    assert caso in est["faltantes"], "un caso sin ninguna etiqueta pasó como completo"


@prueba("autojuicio queda en su estrato y nunca en el principal")
def _():
    res = correr(*diseno(linaje="claude", juez="claude"))
    assert not any(k[0] == "principal" for k in res["estratos"]), "el autojuicio llegó al resultado principal"
    assert ("autojuicio", "claude", "propio") in res["estratos"]


# --- P1 de Sol: estimandos separados ---
@prueba("cambiar solo los controles no mueve el efecto en casos con trampa")
def _():
    base = correr(*diseno())["estratos"][("principal", "sol", "ajeno")]["medidas"]

    def fp(e, c, cond):
        if c["trampa"] is None and cond == "con_conector":
            e["no_debe"] = [True] * len(e["no_debe"])
    otro = correr(*diseno(etiqueta=fp))["estratos"][("principal", "sol", "ajeno")]["medidas"]
    assert base["puntaje_trampas"]["efecto"][0] == otro["puntaje_trampas"]["efecto"][0], "los controles contaminaron el puntaje de trampas"
    assert base["falso_positivo"]["efecto"][0] != otro["falso_positivo"]["efecto"][0], "el falso positivo no se movió"


@prueba("el efecto en el diseño completo es el esperado")
def _():
    m = correr(*diseno())["estratos"][("principal", "sol", "ajeno")]["medidas"]
    assert abs(m["puntaje_trampas"]["efecto"][0] - 1.0) < 1e-9
    assert abs(m["falla_grave"]["efecto"][0] + 1.0) < 1e-9


# --- P2 de Sol: no evaluable ---
@prueba("null en 'debe' sale del denominador")
def _():
    asg, ets = diseno()
    i = next(k for k, (_, e) in enumerate(ets) if "falla_grave" in e and not e["falla_grave"] and len(e["debe"]) >= 2)
    ets[i][1]["debe"] = [True] + [None] * (len(ets[i][1]["debe"]) - 1)
    a = P.validar_asignacion(asg, CASOS)
    c = CASOS[a[ets[i][1]["response_id"]]["caso"]]
    assert P.puntaje(ets[i][1], c) == 1.0


@prueba("una respuesta sin ningún 'debe' evaluable queda fuera del puntaje y se reporta")
def _():
    asg, ets = diseno()
    ets[T][1]["debe"] = [None] * len(ets[T][1]["debe"])
    ets[T][1]["falla_grave"] = False
    res = correr(asg, ets)
    assert ets[T][1]["response_id"] in res["sin_puntaje"]


# --- cegamiento ---
@prueba("cegamiento: revela → fallido; adivina bien → parcial; no sabe → efectivo")
def _():
    a = {"condicion": "con_conector"}
    assert P.cegamiento({"revela_condicion": True, "adivina_condicion": "no_se"}, a) == "fallido"
    assert P.cegamiento({"revela_condicion": False, "adivina_condicion": "con_conector"}, a) == "parcial"
    assert P.cegamiento({"revela_condicion": False, "adivina_condicion": "no_se"}, a) == "efectivo"


print(f"\n{'todas las pruebas pasan' if not FALLAS else f'{len(FALLAS)} prueba(s) fallan'}")
sys.exit(1 if FALLAS else 0)
