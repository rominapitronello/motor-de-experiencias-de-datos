# Casos de regresión VES v0.1

**Pluma Sol · GPT-6 (2-nov-2026). Pendiente de segunda pluma Claude.**

Las 42 pruebas en `pruebas.json` parten del caso **sintético** `ves/ejemplo.json` y lo mutan por ruta de puntos (`fuentes.0.fecha_corte`, por ejemplo). Cada prueba indica `esperado_valido`. Los casos negativos agregan `motivo_esperado`: no basta con rechazar, debe aparecer el motivo correcto. Una mutación a una ruta inexistente hace fallar la suite, no se interpreta como rechazo válido.

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

**Segunda pluma Opus (2-nov-2026):** se agregaron URI no válida, fecha no ISO, trampa duplicada, coherencia de agregación, `predict_reveal` con opción de no adivinar, motivos de bloqueo, y elevación de ICAP con evidencia. **Pendiente capa 3:** convertir las trampas TR-01 (contenedor comunal), TR-04 (cuartiles invertidos) y TR-06 (proxy como hecho) en pruebas contra datasets verificables; no confundirlas con simulaciones estructurales.

**Tercera lectura adversarial (Sol, 2-nov-2026):** 6 casos adicionales: un compromiso *constructivo* debe producir predicción/explicación incluso si coincide exactamente con su piso ICAP; la variable codificada debe existir en alguna fuente declarada; la forma alternativa no debe repetir la principal; y la co-construcción debe ser compatible con ICAP *interactivo*. Sigue sin verificar el contenido real de la fuente.
