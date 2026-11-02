# VES v0.1 · Visualization Experience Spec

**Pluma: Sol · GPT-6 (2-nov-2026). Propuesta para segunda pluma Claude; no está mergeada.**

La VES es el **contrato auditable entre pregunta y renderer**, no el gráfico: determina qué puede afirmarse, con qué fuente, mediante qué experiencia didáctica y cuándo bloquear. Sigue el acuerdo de septiembre de 2026.

**Flujo:** pregunta → capacidad de respuesta → fuentes y trampas → tarea/patrón/ICAP → forma/técnica → codificación e interacción → privacidad, procedencia y accesibilidad → decisión.

- `schema.json`: JSON Schema Draft 2020-12. Tipos, vocabulario y condiciones locales.
- `ejemplo.json`: caso ficticio, **no** datos reales.
- `../casos/probar_ves.py`: comprueba aristas reales del grafo, bloqueos, vacíos y coherencia.
- `../casos/pruebas.json`: 24 casos positivos y adversariales.

## Decisiones

- `answerable`: se puede renderizar **solo** con verificaciones completas.
- `partial`: renderizar exclusivamente lo que sí soporta la fuente, declarando límites y afirmaciones que no permite.
- `not_answerable`: `decision.accion=bloquear` y `render=null`. Se puede indicar cómo conseguir evidencia; no inventar una respuesta visual.
- Una trampa `pendiente`, una clase de vacío `no_evaluado`, una celda pequeña sin resolver o un enlace del grafo inexistente **bloquean el render**.
- Los valores posibles se basan en `grafo/grafo.yaml`; el validador además comprueba que existan **aristas** para la combinación elegida. Por ejemplo, `distribucion` es una tarea válida pero **no tiene arista a forma** en el grafo v0.1: se bloquea sin inventar una.

## Prueba local

```bash
python3 -m pip install -r casos/requirements.txt
python3 casos/probar_ves.py
```

La suite devuelve código 1 si un caso observado no coincide con el resultado esperado. El workflow de GitHub corre la misma prueba en PR.

## Qué NO certifica

Una VES válida verifica **la forma del contrato**, no la verdad de los datos o la calidad de un diseño. `revisar_fuente` del MCP compara señales declaradas y **no descarga ni inspecciona las fuentes**. La presencia de `visibilidad.fuente=true` o `reduced_motion=true` es un compromiso declarativo, **no** una prueba de que el renderer lo cumpla. El título, las cifras, las escalas, la privacidad real, el contraste AA y el teclado requieren revisión sustantiva y visual.

Este PR no cambia `grafo/`, `principios/` ni código del MCP escrito por otras plumas. `proponer_experiencia` y `validar_ves` siguen sin existir: no presentar todavía el motor completo como terminado.

**Puerta:** segunda pluma Claude, misma batería en dos linajes y diferenciación de errores procedimentales vs. diferencias legítimas de juicio; Romina decide el merge.
