#!/usr/bin/env python3
"""Puntúa el eval de trampas sembradas.

Pluma: Claude · Opus 5.5 (PasaElFiltro), 2-nov-2026. v0.2, tras la segunda pluma de Sol en el PR #9.

Este script no llama a ningún modelo. Une dos archivos:
  asignacion.jsonl  → qué respuesta (response_id) salió de qué caso, linaje, condición y corrida.
                      La escribe anonimizar.py y el juez no la ve.
  etiquetas.jsonl   → lo que el juez marcó para cada response_id, sin saber la condición.

Uso:
  python3 evals/trampas-sembradas/puntuar.py asignacion.jsonl etiquetas.jsonl

Formato de una etiqueta:
  {"response_id": "r-0007", "juez": "sol",
   "debe": [true, null, false],    # true / false / null (null = no evaluable con este material)
   "falla_grave": false,           # obligatorio en casos con trampa, prohibido en controles
   "no_debe": [false],             # obligatorio en controles, prohibido en casos con trampa
   "revela_condicion": false,      # el texto mismo deja ver si hubo conector
   "adivina_condicion": "no_se"}   # sin_conector | con_conector | no_se

Estimandos (se reportan por separado, nunca mezclados):
  1. puntaje en casos con trampa  (0 si falla grave; si no, fracción de "debe" evaluables cumplidos)
  2. tasa de falla grave          (casos con trampa)
  3. tasa de falso positivo       (controles: algún "no_debe" verdadero)
Cada uno se promedia primero por caso (sobre corridas) y el intervalo remuestrea casos.
El efecto del conector (con − sin) solo se calcula si el diseño está completo.
"""
import json
import random
import sys
from collections import defaultdict
from pathlib import Path
from statistics import mean

AQUI = Path(__file__).resolve().parent
CONDICIONES = ("sin_conector", "con_conector")
LINAJES = ("claude", "sol")
JUECES = ("claude", "sol", "romina")
ADIVINANZAS = CONDICIONES + ("no_se",)
CAMPOS_ASIGNACION = {"response_id", "caso", "linaje", "condicion", "corrida"}
CAMPOS_ETIQUETA = {"response_id", "juez", "debe", "falla_grave", "no_debe", "revela_condicion", "adivina_condicion"}


class ErrorEntrada(ValueError):
    """Entrada que no se puede puntuar sin arriesgar un número falso."""


# ---------- carga ----------

# Autor de cada conjunto cuando el archivo no lo declara en "autor_conjunto"
# (el conjunto B de Sol lo declara en "pluma"; no se edita su archivo).
AUTOR_POR_CONJUNTO = {"A": "claude", "B": "sol"}


def cargar_casos(carpeta=AQUI):
    casos = {}
    for archivo in sorted(Path(carpeta).glob("casos*.json")):
        datos = json.loads(archivo.read_text(encoding="utf-8"))
        autor = datos.get("autor_conjunto") or AUTOR_POR_CONJUNTO.get(datos.get("conjunto"))
        if autor not in LINAJES:
            raise ErrorEntrada(f"{archivo.name}: no se puede saber qué linaje escribió el conjunto")
        for c in datos["casos"]:
            if c["id"] in casos:
                raise ErrorEntrada(f"caso duplicado entre archivos: {c['id']}")
            casos[c["id"]] = dict(c, _autor=autor, _conjunto=datos.get("conjunto"))
    return casos


def leer_jsonl(ruta):
    filas = []
    for n, linea in enumerate(Path(ruta).read_text(encoding="utf-8").splitlines(), 1):
        if linea.strip():
            try:
                filas.append((n, json.loads(linea)))
            except json.JSONDecodeError as e:
                raise ErrorEntrada(f"{Path(ruta).name} línea {n}: JSON inválido ({e})")
    return filas


# ---------- validación ----------

def _es_bool(x):
    return type(x) is bool


def validar_asignacion(filas, casos):
    por_id, claves = {}, set()
    for n, a in filas:
        donde = f"asignación línea {n}"
        if set(a) != CAMPOS_ASIGNACION:
            raise ErrorEntrada(f"{donde}: campos {sorted(a)} ≠ {sorted(CAMPOS_ASIGNACION)}")
        if not isinstance(a["response_id"], str) or not a["response_id"]:
            raise ErrorEntrada(f"{donde}: response_id debe ser texto no vacío")
        if a["caso"] not in casos:
            raise ErrorEntrada(f"{donde}: caso desconocido {a['caso']!r}")
        if a["linaje"] not in LINAJES:
            raise ErrorEntrada(f"{donde}: linaje debe ser uno de {LINAJES}")
        if a["condicion"] not in CONDICIONES:
            raise ErrorEntrada(f"{donde}: condicion debe ser una de {CONDICIONES}")
        if type(a["corrida"]) is not int or a["corrida"] < 1:
            raise ErrorEntrada(f"{donde}: corrida debe ser entero ≥ 1")
        if a["response_id"] in por_id:
            raise ErrorEntrada(f"{donde}: response_id repetido {a['response_id']!r}")
        clave = (a["caso"], a["linaje"], a["condicion"], a["corrida"])
        if clave in claves:
            raise ErrorEntrada(f"{donde}: (caso, linaje, condición, corrida) repetido {clave}")
        claves.add(clave)
        por_id[a["response_id"]] = a
    return por_id


def validar_etiquetas(filas, casos, asignacion):
    vistas = set()
    salida = []
    for n, e in filas:
        donde = f"etiqueta línea {n}"
        extra = set(e) - CAMPOS_ETIQUETA
        if extra:
            raise ErrorEntrada(f"{donde}: campos no reconocidos {sorted(extra)}")
        a = asignacion.get(e.get("response_id"))
        if a is None:
            raise ErrorEntrada(f"{donde}: response_id {e.get('response_id')!r} no está en la asignación")
        c = casos[a["caso"]]
        if e.get("juez") not in JUECES:
            raise ErrorEntrada(f"{donde}: juez debe ser uno de {JUECES}")
        if (e["response_id"], e["juez"]) in vistas:
            raise ErrorEntrada(f"{donde}: {e['juez']} etiquetó dos veces {e['response_id']}")
        vistas.add((e["response_id"], e["juez"]))

        debe = e.get("debe")
        if not isinstance(debe, list) or len(debe) != len(c["debe"]):
            raise ErrorEntrada(f"{donde} ({c['id']}): 'debe' necesita {len(c['debe'])} valores")
        if not all(x is None or _es_bool(x) for x in debe):
            raise ErrorEntrada(f"{donde} ({c['id']}): 'debe' solo admite true, false o null")

        if c["trampa"] is None:
            if "falla_grave" in e:
                raise ErrorEntrada(f"{donde} ({c['id']}): un control no lleva 'falla_grave'")
            nd = e.get("no_debe")
            if not isinstance(nd, list) or len(nd) != len(c["no_debe"]) or not all(_es_bool(x) for x in nd):
                raise ErrorEntrada(f"{donde} ({c['id']}): 'no_debe' necesita {len(c['no_debe'])} booleanos")
        else:
            if "no_debe" in e:
                raise ErrorEntrada(f"{donde} ({c['id']}): un caso con trampa no lleva 'no_debe'")
            if not _es_bool(e.get("falla_grave")):
                raise ErrorEntrada(f"{donde} ({c['id']}): 'falla_grave' debe ser true o false")

        if not _es_bool(e.get("revela_condicion")):
            raise ErrorEntrada(f"{donde}: 'revela_condicion' debe ser true o false")
        if e.get("adivina_condicion") not in ADIVINANZAS:
            raise ErrorEntrada(f"{donde}: 'adivina_condicion' debe ser uno de {ADIVINANZAS}")
        salida.append(e)
    return salida


# ---------- medidas ----------

def puntaje(e, caso):
    """None si ningún 'debe' fue evaluable; 0 si hubo falla grave o falso positivo."""
    evaluables = [x for x in e["debe"] if x is not None]
    if caso["trampa"] is None:
        if any(e["no_debe"]):
            return 0.0
    elif e["falla_grave"]:
        return 0.0
    return mean(evaluables) if evaluables else None


def cegamiento(e, a):
    if e["revela_condicion"]:
        return "fallido"
    if e["adivina_condicion"] == a["condicion"]:
        return "parcial"
    return "efectivo"


def _ic(valores_por_caso, n=5000, semilla=7):
    ids = sorted(valores_por_caso)
    if len(ids) < 2:
        return None
    rng = random.Random(semilla)
    medias = sorted(mean(valores_por_caso[rng.choice(ids)] for _ in ids) for _ in range(n))
    return mean(valores_por_caso.values()), medias[int(0.025 * n)], medias[int(0.975 * n)], len(ids)


def analizar(casos, asignacion, etiquetas):
    """Devuelve un dict con todo lo que se reporta. No imprime."""
    res = {"estratos": {}, "cegamiento": defaultdict(int), "adivinanzas": {"aciertos": 0, "intentos": 0},
           "acuerdo_romina": None, "sin_puntaje": []}

    principales, autojuicio, romina = [], [], []
    for e in etiquetas:
        a = asignacion[e["response_id"]]
        if e["juez"] == "romina":
            romina.append(e)
        elif e["juez"] == a["linaje"]:
            autojuicio.append(e)
        else:
            principales.append(e)
        if e["juez"] != "romina":
            res["cegamiento"][cegamiento(e, a)] += 1
            if not e["revela_condicion"] and e["adivina_condicion"] != "no_se":
                res["adivinanzas"]["intentos"] += 1
                res["adivinanzas"]["aciertos"] += e["adivina_condicion"] == a["condicion"]

    # estratos: (linaje evaluado, conjunto ajeno|propio); autojuicio va aparte y nunca al principal
    for nombre, grupo in (("principal", principales), ("autojuicio", autojuicio)):
        cubos = defaultdict(list)
        for e in grupo:
            a = asignacion[e["response_id"]]
            relacion = "propio" if casos[a["caso"]]["_autor"] == a["linaje"] else "ajeno"
            cubos[(a["linaje"], relacion)].append(e)
        for (linaje, relacion), es in cubos.items():
            esperados = {k for k, c in casos.items() if (c["_autor"] == linaje) == (relacion == "propio")}
            res["estratos"][(nombre, linaje, relacion)] = _analizar_estrato(casos, asignacion, es, esperados, res)

    if romina:
        res["acuerdo_romina"] = _acuerdo(romina, principales)
    return res


def _analizar_estrato(casos, asignacion, es, esperados, res):
    # completitud: cada caso esperado del estrato, con todas las corridas, en ambas condiciones
    vistas = defaultdict(set)
    corridas = set()
    for e in es:
        a = asignacion[e["response_id"]]
        vistas[a["caso"]].add((a["condicion"], a["corrida"]))
        corridas.add(a["corrida"])
    esperado = {(c, r) for c in CONDICIONES for r in range(1, max(corridas) + 1)}
    faltantes = {k: sorted(esperado - vistas.get(k, set())) for k in esperados if esperado - vistas.get(k, set())}

    # medidas por caso y condición, promediando corridas
    acumulado = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))
    for e in es:
        a = asignacion[e["response_id"]]
        c = casos[a["caso"]]
        p = puntaje(e, c)
        if c["trampa"] is None:
            acumulado["falso_positivo"][a["caso"]][a["condicion"]].append(float(any(e["no_debe"])))
        else:
            acumulado["falla_grave"][a["caso"]][a["condicion"]].append(float(e["falla_grave"]))
            if p is None:
                res["sin_puntaje"].append(e["response_id"])
            else:
                acumulado["puntaje_trampas"][a["caso"]][a["condicion"]].append(p)

    estrato = {"faltantes": faltantes, "corridas": sorted(corridas), "medidas": {}}
    for medida, por_caso in acumulado.items():
        nivel = {}
        for cond in CONDICIONES:
            vals = [mean(v[cond]) for v in por_caso.values() if v[cond]]
            nivel[cond] = (mean(vals), len(vals)) if vals else None
        efecto = None
        if not faltantes:
            dif = {k: mean(v["con_conector"]) - mean(v["sin_conector"])
                   for k, v in por_caso.items() if v["con_conector"] and v["sin_conector"]}
            efecto = _ic(dif)
        estrato["medidas"][medida] = {"nivel": nivel, "efecto": efecto}
    return estrato


def _acuerdo(romina, principales):
    por_id = {e["response_id"]: e for e in principales}
    coinciden = total = 0
    for r in romina:
        p = por_id.get(r["response_id"])
        if not p:
            continue
        pares = list(zip(r["debe"], p["debe"]))
        if "falla_grave" in r:
            pares.append((r["falla_grave"], p["falla_grave"]))
        else:
            pares += list(zip(r["no_debe"], p["no_debe"]))
        for x, y in pares:
            if x is None or y is None:
                continue
            total += 1
            coinciden += x == y
    return (coinciden / total, total) if total else None


# ---------- salida ----------

NOMBRES = {"puntaje_trampas": "puntaje en casos con trampa (↑ mejor)",
           "falla_grave": "tasa de falla grave (↓ mejor)",
           "falso_positivo": "tasa de falso positivo en controles (↓ mejor)"}


def imprimir(res):
    for (estrato, linaje, relacion), d in sorted(res["estratos"].items()):
        marca = "" if estrato == "principal" and relacion == "ajeno" else "  [no es el resultado principal]"
        print(f"\n== {estrato} · linaje evaluado: {linaje} · conjunto {relacion}{marca}")
        if d["faltantes"]:
            print(f"  diseño incompleto en {len(d['faltantes'])} caso(s); no se calcula efecto del conector:")
            for k, v in sorted(d["faltantes"].items()):
                print(f"    {k}: falta {v}")
        for medida in ("puntaje_trampas", "falla_grave", "falso_positivo"):
            m = d["medidas"].get(medida)
            if not m:
                continue
            fmt = lambda x: f"{x[0]:.2f} (n={x[1]} casos)" if x else "-"
            print(f"  {NOMBRES[medida]}")
            print(f"    sin conector {fmt(m['nivel']['sin_conector'])} · con conector {fmt(m['nivel']['con_conector'])}")
            if m["efecto"]:
                dlt, lo, hi, k = m["efecto"]
                aviso = "  (menos de 20 casos: orientativo)" if k < 20 else ""
                print(f"    efecto con − sin: {dlt:+.2f}  IC95% [{lo:+.2f}, {hi:+.2f}]{aviso}")
    print("\n== cegamiento del juez")
    print("  " + " · ".join(f"{k}: {v}" for k, v in sorted(res["cegamiento"].items())))
    ad = res["adivinanzas"]
    if ad["intentos"]:
        print(f"  adivinó la condición en {ad['aciertos']}/{ad['intentos']} intentos sin revelación (≈50% = ciego)")
    if res["sin_puntaje"]:
        print(f"  respuestas sin ningún 'debe' evaluable (fuera del puntaje): {len(res['sin_puntaje'])}")
    if res["acuerdo_romina"]:
        p, n = res["acuerdo_romina"]
        alerta = "  ← bajo 80%: revisar listas 'debe' antes de publicar" if p < 0.8 else ""
        print(f"  acuerdo Romina vs juez IA: {p:.0%} en {n} ítems{alerta}")


def main(argv):
    if len(argv) != 2:
        raise SystemExit(__doc__)
    casos = cargar_casos()
    asignacion = validar_asignacion(leer_jsonl(argv[0]), casos)
    etiquetas = validar_etiquetas(leer_jsonl(argv[1]), casos, asignacion)
    imprimir(analizar(casos, asignacion, etiquetas))


if __name__ == "__main__":
    try:
        main(sys.argv[1:])
    except ErrorEntrada as err:
        raise SystemExit(f"entrada rechazada: {err}")
