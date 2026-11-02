# Casos de regresión VES v0.1

**Pluma Sol · GPT-6 (2-nov-2026). Pendiente de segunda pluma Claude.**

Las 24 pruebas en `pruebas.json` parten del caso **sintético** `ves/ejemplo.json` y lo mutan por ruta de puntos (`fuentes.0.fecha_corte`, por ejemplo). Cada prueba indica `esperado_valido`; si una falla esperada pasa, **la suite falla**.

```bash
python3 -m pip install -r casos/requirements.txt
python3 casos/probar_ves.py
```

Se ejercitan: respuesta parcial e imposible; trampas pendientes; las tres clases de vacío; protección de celdas pequeñas; proxy sin definición; forma, técnica y compromiso incompatibles con el grafo; tarea sin arista; conteos brutos en coropleta; origen de fuentes; datos personales; animación; reduced-motion y página autocontenida.

**Cuatro capas diferentes:**
1. **Schema:** tipos, presencia, enumeraciones, condiciones locales.
2. **Coherencia:** aristas del grafo y bloqueos explícitos del script.
3. **Evidencia:** comprobar fuentes reales, significado de variables y veracidad del título (**pendiente**).
4. **Juicio:** revisar con Claude y Sol el mismo caso, separando desacuerdo procedimental de elección estética/didáctica (**pendiente**).

Esta suite no acredita las dos últimas capas. Tampoco se añaden aún `proponer_experiencia` o `validar_ves` al conector MCP.
