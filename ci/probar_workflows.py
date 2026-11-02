#!/usr/bin/env python3
"""Pruebas de las condiciones de seguridad del despliegue del conector.

Pluma: Claude · Opus 5.5 (PasaElFiltro), 2-nov-2026, tras la segunda pluma de Sol en el #13:
un cambio que da despliegue automático no puede quedar con "CI: no aplica".
actionlint revisa la sintaxis; este archivo revisa lo que actionlint no sabe: qué tiene que ser
verdad para que nada sin revisión llegue a producción, y que la comprobación final de verdad reintente.

Uso: python3 ci/probar_workflows.py
"""
import os
import stat
import subprocess
import sys
import tempfile
from pathlib import Path

import yaml

RAIZ = Path(__file__).resolve().parents[1]
WF = RAIZ / ".github" / "workflows"
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


def cargar(nombre):
    doc = yaml.safe_load((WF / nombre).read_text(encoding="utf-8"))
    doc["on"] = doc.pop(True, doc.get("on"))  # yaml lee la clave `on` como True
    return doc


DEPLOY = cargar("mcp-deploy.yml")
JOB = DEPLOY["jobs"]["deploy"]
PASOS = JOB["steps"]


def indice(texto):
    for i, p in enumerate(PASOS):
        if texto in (p.get("name", "") + " " + p.get("run", "")):
            return i
    raise AssertionError(f"no hay un paso con «{texto}»")


@prueba("solo publica desde main y desde este repo (también el despacho manual)")
def _():
    cond = JOB.get("if", "")
    assert "github.ref == 'refs/heads/main'" in cond, f"falta el gate de ref: {cond!r}"
    assert "github.repository == 'rominapitronello/motor-de-experiencias-de-datos'" in cond, "falta el gate de repo"
    assert "||" not in cond, "una disyunción en el gate podría abrirlo"


@prueba("los disparadores son solo push a main y despacho manual")
def _():
    on = DEPLOY["on"]
    assert set(on) == {"push", "workflow_dispatch"}, f"disparadores: {sorted(on)}"
    assert on["push"]["branches"] == ["main"], on["push"]["branches"]


@prueba("ningún workflow usa pull_request_target (correría código ajeno con secretos)")
def _():
    for archivo in sorted(WF.glob("*.yml")):
        on = cargar(archivo.name)["on"]
        claves = set(on) if isinstance(on, dict) else set(on if isinstance(on, list) else [on])
        assert "pull_request_target" not in claves, archivo.name


@prueba("permisos mínimos y despliegues en serie")
def _():
    assert JOB["permissions"] == {"contents": "read"}, JOB["permissions"]
    assert DEPLOY["concurrency"]["cancel-in-progress"] is False


@prueba("las pruebas van antes de la comprobación de punta, y esa antes de publicar y verificar")
def _():
    orden = [indice("probar_ves.py"), indice("npm test"), indice("punta de main"),
             indice("wrangler deploy"), indice("comprobar el commit publicado")]
    assert orden == sorted(orden), f"orden de pasos: {orden}"


@prueba("publicar y verificar dependen de que el commit siga siendo la punta de main")
def _():
    for texto in ("wrangler deploy", "comprobar el commit publicado"):
        assert PASOS[indice(texto)].get("if") == "steps.punta.outputs.publicar == 'si'", texto


@prueba("los secretos solo entran como env de los pasos que los necesitan")
def _():
    con_secretos = [p.get("name", "?") for p in PASOS if "secrets." in yaml.safe_dump(p)]
    assert con_secretos == ["faltan secretos de cloudflare", "publicar en cloudflare"], con_secretos
    for p in PASOS:
        assert "secrets." not in p.get("run", ""), f"secreto dentro de run en «{p.get('name')}»"


def correr_verificacion(respuestas):
    """Ejecuta el script real del paso de verificación con un curl y un sleep falsos."""
    script = PASOS[indice("comprobar el commit publicado")]["run"]
    corto = subprocess.check_output(["git", "rev-parse", "--short", "HEAD"], cwd=RAIZ, text=True).strip()
    with tempfile.TemporaryDirectory() as d:
        cola = Path(d) / "respuestas"
        cola.write_text("\n".join(respuestas), encoding="utf-8")
        curl = Path(d) / "curl"
        curl.write_text(
            "#!/usr/bin/env bash\n"
            f"cola={cola}\n"
            'linea="$(head -n1 "$cola")"; tail -n +2 "$cola" > "$cola.t"; mv "$cola.t" "$cola"\n'
            'if [ "$linea" = "FALLA" ] || [ -z "$linea" ]; then exit 7; fi\n'
            'printf "experiencias-datos · conector MCP\\nconocimiento: commit %s, construido hoy\\n" '
            f'"${{linea/HEAD/{corto}}}"\n',
            encoding="utf-8")
        dormir = Path(d) / "sleep"
        dormir.write_text("#!/usr/bin/env bash\nexit 0\n", encoding="utf-8")
        for f in (curl, dormir):
            f.chmod(f.stat().st_mode | stat.S_IEXEC)
        env = dict(os.environ, PATH=f"{d}:{os.environ['PATH']}")
        r = subprocess.run(["bash", "-e", "-c", script], cwd=RAIZ, env=env, capture_output=True, text=True)
        return r.returncode, r.stdout + r.stderr


@prueba("la verificación reintenta cuando curl falla y pasa cuando aparece el commit")
def _():
    codigo, salida = correr_verificacion(["FALLA", "FALLA", "597057e", "HEAD"])
    assert codigo == 0, salida
    assert salida.count("no respondió") == 2 and "publicado: commit" in salida, salida


@prueba("la verificación falla si el commit nunca aparece en 6 intentos")
def _():
    codigo, salida = correr_verificacion(["FALLA"] + ["597057e"] * 8)
    assert codigo != 0, salida
    assert "después de 6 intentos" in salida, salida


print(f"\n{'todas las pruebas pasan' if not FALLAS else f'{len(FALLAS)} prueba(s) fallan'}")
sys.exit(1 if FALLAS else 0)
