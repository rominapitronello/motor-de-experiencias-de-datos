---
name: experiencias-datos
description: >-
  Úsala ANTES de dibujar cualquier gráfico, mapa, visor, dashboard o visualización de datos, en vez del
  visualizador por defecto, cuando la pieza tiene que hacer entender, recordar o decidir algo a una persona
  (sobre todo si no es experta en datos). Convierte una pregunta en una experiencia: elige la tarea, el
  movimiento pedagógico y la forma, revisa las trampas de la fuente y deja una especificación que se puede
  validar antes del render. También sirve para revisar una visualización existente o una fuente de datos públicos.
---

# Pregunta primero, gráfico después

> borrador v0.1 · pluma: claude · opus 5.5 (Legible) · pendiente de segunda pluma (Sol) · 24-sep-2026

Un gráfico responde algo. Esta skill se asegura de que responda **la pregunta que la persona tiene**, con **datos que de verdad la soportan**, de una forma que la haga **pensar**. Que además se vea lindo es la última capa.

## El flujo (no saltarse pasos)

1. **La pregunta.** Escríbela con las palabras de quien pregunta. Si hay varias, elige una por vista (PR-08).
2. **¿Se puede responder?** Consulta el catálogo semántico de las capas: `answerable`, `partial` o `not_answerable`. Si la respuesta es parcial o no se puede, dilo. El vacío también se diseña (`unknown_route_to_evidence`).
3. **Revisa la fuente.** Pasa cada capa por `trampas/trampas.yaml`, o por la herramienta `revisar_fuente` del conector. Una trampa sin resolver bloquea el render.
4. **Tarea y propósito.** Toma los valores de `grafo/grafo.yaml`: qué operación cognitiva pide la pregunta y qué queremos que le pase a quien mira.
5. **Movimiento pedagógico y compromiso.** Elige un patrón. Si el objetivo es enseñar o cambiar una intuición, apunta a lo **constructivo** (PR-03): la persona predice, explica o formula una hipótesis.
6. **Forma y técnica.** Toma candidatos de las aristas del grafo y busca 1 o 2 referentes por **operación** en `catalogo/`. Propón dos alternativas y di por qué eliges una.
7. **Especificación (VES).** Escribe la especificación de experiencia (`ves/`, pluma Sol). Si no valida, no hay render.
8. **Plan visual.** Define tokens, wireframe en ASCII y la **firma**: el único elemento que hace que esto no se confunda con una IA genérica (PR-12). Después pregúntate qué parte se parece a cualquier visor, y cámbiala.
9. **Construye, captura y critica.** Revisa con el checklist de abajo. Si hay forma de ver capturas, míralas.
10. **Segunda pluma** antes de mostrarlo a quien pidió la pieza.

## Restricciones duras

- La unidad es el territorio o el servicio, **nunca una persona**. Las celdas pequeñas se agregan con un umbral declarado.
- **Cada vacío tiene su nombre** (PR-09).
- **Un proxy nunca se titula como hecho** (PR-10, TR-06).
- **El dato no tiembla** (PR-06). La animación respeta `prefers-reduced-motion`.
- No pintar áreas con conteos brutos: normalizar o cambiar de forma.
- Si se publica como página: sin teselas, sin APIs externas, librerías solo desde CDN permitidos.
- La marca es la de quien encarga. Si no hay marca, no uses los looks por defecto (PR-12).

## Checklist antes de mostrar

- [ ] Leyendo solo los títulos se entiende la historia.
- [ ] Toda cifra muestra fuente, fecha, nivel geográfico y límite.
- [ ] Nada queda fuera del lienzo; no hay desbordes y el orden es el pedido.
- [ ] Con el efecto apagado, la lectura es idéntica.
- [ ] Cada interacción deja una idea nueva, o se justifica porque orienta o reduce carga.
- [ ] Una persona del territorio no se siente juzgada (prueba del vecino).
- [ ] Contraste AA, foco visible y teclado funcionan; con reduced-motion, se ve el cuadro final.

## Referencias

- `principios/principios.md`: PR-01 a PR-12, con su evidencia y cómo verificarlos.
- `grafo/grafo.yaml`: vocabulario y aristas.
- `catalogo/`: referentes (por operación) y técnicas.
- `trampas/`: trampas de datos públicos con su prueba.
- `ves/` y `casos/`: pluma Sol.
