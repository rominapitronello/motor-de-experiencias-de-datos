# motor de experiencias de datos

**Cómo convertir una pregunta en una experiencia con datos que se entienda, se recuerde y no mienta.**

Principios, un grafo pregunta→forma, un catálogo de referentes, trampas de datos públicos chilenos y un conector MCP. Escrito a varias plumas, humanas y de IA, en [PasaElFiltro](https://pasaelfiltro.cl).

> Pregunta primero, gráfico después.

## Por qué existe

Todo el mundo tiene un mapa. Poca gente tiene una historia. Y casi nadie revisa si el mapa suma lo mismo que el total oficial.

Este repo reúne lo que aprendimos al pensar visualizaciones de datos **como educadores y no como ingenieros**. Una buena visualización hace que quien la mira produzca una idea (una predicción, una explicación, una hipótesis) y la contraste con evidencia. Hacer clics no basta. Y ninguna estética salva un dato mal leído.

## Qué hay adentro

| carpeta | qué es | pluma | estado |
|---|---|---|---|
| `principios/` | 12 principios con su evidencia y cómo verificarlos, y una skill para Claude | claude (Legible) | borrador v0.1 |
| `grafo/` | vocabulario controlado y aristas: tarea → forma, propósito → técnica, patrón → compromiso | claude (Legible) | v0.1 |
| `catalogo/` | referentes indexados por operación cognitiva, y técnicas | claude (Legible), con aportes de Sol | v0.1 |
| `trampas/` | trampas de datos públicos, con prueba reproducible | claude (Legible), fable, Sol | v0.1 · 4 de 7 verificadas por código aquí |
| `ves/` | Visualization Experience Spec: el contrato entre la pregunta y el render | Sol | **pendiente** |
| `casos/` | casos de prueba para detectar si un cambio empeora el juicio | Sol | **pendiente** |
| `mcp/` | conector MCP `experiencias-datos`, sin estado ni llaves | claude (Legible) | v0.1 · prueba de humo en verde |

## Lo que todavía no es

"Motor" promete que algo corre. Hoy corren las trampas, el grafo como consulta y el conector que los expone. Todavía no existe la parte que elige la experiencia a partir de la pregunta: espera la VES y los casos corridos por dos linajes.

**Plazo propuesto** (lo decide Romina): si al 31 de diciembre de 2026 no hay una VES validada con casos corridos por Claude y por Sol, el nombre se revisa.

## Usarlo

- **Con Claude:** copia `principios/SKILL.md` como skill, o conecta el MCP (`mcp/README.md`).
- **Sin IA:** lee `principios/principios.md` y `trampas/trampas.yaml`. Sirven igual para una profe, un estudiante o un equipo de datos.

## Contribuir

Ver `CONTRIBUIR.md`. Regla corta: **cada hallazgo modifica algo**, cada afirmación lleva su estado, y ninguna pluma edita las palabras de otra.

## Licencias

Código MIT; contenido CC BY 4.0; referentes ajenos solo enlazados. Ver `LICENSE-CONTENIDO.md`.

## De dónde viene

Ver `GENEALOGIA.md`.
