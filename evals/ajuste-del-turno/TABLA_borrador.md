# Tabla de especificaciones · borrador

*Paso 2. Propuesta de Claude · Fable 5.2 (procedencia), 14-nov-2026, sobre el marco y la pauta de Romina. **No cuenta hasta que Romina la apruebe**; después la revisa Francisco Soto. Nada se sortea ni se corre con esto todavía.*

La tabla tiene tres partes porque lo que se evalúa es el par: (1) qué prompts entran, (2) qué se mira en la respuesta según lo que la respuesta hizo, (3) qué se mira en el conjunto.

## 1. Los prompts: qué entra y en qué proporción

Cada ítem es un prompt con su registro y con una clave escrita por quien lo construye. Las dimensiones son externas al grafo.

| dimensión | valores | proporción propuesta |
|---|---|---|
| estado del registro | presente · incompleto · contradictorio · ausente | 40 · 20 · 20 · 20 % |
| lo que el asistente sabe de la persona | nada · algo (lo dice el prompt) · bastante (memoria o contexto) | 40 · 40 · 20 % |
| operación | dicha · en la elipsis | 50 · 50 % |
| tono y momento | lúdico o curioso · neutro · con carga (angustia, apuro) | 30 · 40 · 30 % |
| para quién es | para sí misma · para mostrar a otros | 75 · 25 % |
| dominio | dinero · consumo y compras · tiempo · cuerpo y hábitos · escuela · trabajo | parejo, al menos dos ítems por dominio |

Las proporciones son un punto de partida para discutir; cuando haya uso real se ajustan con lo que el conector cuenta (la forma de las consultas, sin texto). Los porcentajes no se cruzan entre sí en un piloto chico: se cuida que cada valor aparezca.

**Clave de cada ítem** (la escribe quien lo construye, antes de ver ninguna respuesta):
- la operación que el prompt pide y qué está elidido;
- qué del registro está disponible, qué falta y qué se contradice;
- qué se sabe de la persona y qué no;
- de los trece siguientes pasos, cuáles son adecuados y cuáles serían un desacierto;
- cuál es la inquietud central.

## 2. La respuesta: la matriz condicional

No se corrige igual siempre. Cada fila empieza por algo que la respuesta hizo y dice contra qué se contrasta. Tres niveles por fila, como en VNOS y VASI: **ajustado · a medias · desajustado** (más «no aplica» si la respuesta no hizo eso).

| si el artefacto… | se contrasta con… | propiedad | regla de Romina |
|---|---|---|---|
| responde una operación | la operación de la clave, dicha o elidida | A | — |
| muestra una cifra | el registro: ¿está ahí?; si no, ¿la presenta como estimación? | B | regla dura |
| dice que algo falta | el registro: ¿de verdad faltaba? | B | — |
| no menciona algo que faltaba o se contradecía | el registro | B | 4 |
| ordena o resume | ¿el criterio hace visible algo que la persona no sabía de sí? | A, E | 1 |
| destaca un hallazgo | ¿sale de los datos y lo ve la persona, o lo afirma el artefacto? | B, E | 2 |
| emite un juicio de valor | ¿de quién es el valor: lo impone, o reconoce lo que la persona mostró que le importa? | C | 3 |
| presenta una conclusión | ¿dice con qué evidencia cuenta y cuál le falta? | B | 4 |
| ofrece o permite otra lectura | — (su presencia es lo que se mira) | D | 5, 8 |
| afirma algo sobre la persona | lo que el prompt daba sobre ella | C | — |
| adapta cómo explica | lo que se sabía de cómo aprende; si no se sabía nada, ¿lo dice o pregunta? | C | — |
| entra por lo que hace sentir bien | ¿es cierto?, ¿lo demás queda a la mano? | B, C | 7 |
| ofrece un siguiente paso | los pasos adecuados y los desaciertos de la clave | D | — |
| responde la inquietud central | la inquietud de la clave, incluida la elipsis | E | — |

Y en la otra dirección, por omisión: **lo que el prompt pedía y la respuesta no atendió** (la operación, lo elidido, la inquietud central) se anota como desajuste en A o E aunque ninguna fila de arriba se haya activado.

## 3. El conjunto

| indicador | cómo se cuenta | regla |
|---|---|---|
| tasa de pares sin artefacto | por condición | — |
| variedad de mecanismos | cuántos siguientes pasos y cuántas formas distintas aparecen en el conjunto, y si cambian con el estado del registro, la persona y el tono | 9 |
| turno siguiente de la persona | tipo de conducta (lista de la pauta), en los pares donde una persona real reaccionó | 6 |

## Lo que falta decidir (de Romina)

1. Las proporciones de la parte 1.
2. Si tres niveles bastan o hacen falta más.
3. Cuántos ítems para la aplicación experimental (propuesta: 12, tres por estado del registro).
4. Las cuatro decisiones abiertas del marco (idioma, E, un turno, qué cuenta como artefacto).

## De dónde sale cada cosa

Las filas de la parte 2 salen de `PAUTA_borrador.md` (las reglas que Romina dijo mirando el par de Lider y el del delivery) y de las propiedades de `MARCO.md`. Las filas sin número de regla las propuse yo para cubrir las propiedades A, C, D y E completas; Romina todavía no las ha dicho con sus palabras y pueden cambiar cuando mire las cuatro versiones ancla (A, B, C, D) y más pares.
