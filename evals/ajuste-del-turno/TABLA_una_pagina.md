# Ajuste del turno · tabla de especificaciones en una página

*Para la revisión experta del 17-nov-2026. Propuesta de Claude · Fable 5.2 sobre el constructo de Romina Pitronello; todavía no está aprobada. El detalle está en `TABLA_borrador.md`.*

Lo que se evalúa es un par, así que la tabla tiene tres partes: qué preguntas entran, qué se mira en la respuesta, qué se mira en el conjunto.

## 1. Las preguntas (ítems)

Cada ítem es una pregunta de una persona, con sus palabras, más una clave escrita antes de ver ninguna respuesta.

| dimensión | valores | en los doce ítems de esta versión |
|---|---|---|
| estado del registro | presente · incompleto · contradictorio · ausente | 3 · 3 · 3 · 3 |
| tono | lúdico o curioso · neutro · con carga | 3 · 3 · 6 |
| para quién es | para sí · para mostrar a otros | 10 · 2 |
| dominio | dinero · consumo · compras · cuerpo y hábitos · escuela · trabajo · tiempo | 2 · 3 · 2 · 1 · 2 · 2 · 0 |
| tipo de decisión | procedimental (hay una respuesta) · de juicio (hay más de una defendible) | 3 · 9 |

*Estado del registro* es la dimensión principal: **presente** (los datos necesarios están), **incompleto** (falta algo sin lo cual hay varias respuestas), **contradictorio** (dos fuentes o dos cifras no calzan), **ausente** (nadie midió todavía).

Vacíos declarados de esta versión: ningún ítem de tiempo, uno solo de cuerpo y hábitos, y el tono «con carga» está sobrerrepresentado, porque así llegan las preguntas reales de foros.

**Clave de cada ítem:** la operación pedida y lo que quedó implícito · qué hay, qué falta y qué se contradice · qué se sabe de la persona · qué siguientes pasos son adecuados y cuáles serían un desacierto · la inquietud central.

## 2. La respuesta: se corrige según lo que hizo

No hay una lista fija que se aplique igual a todo. Cada regla parte de algo que el artefacto hizo y dice contra qué se contrasta. Tres niveles: ajustado · a medias · desajustado.

| si el artefacto… | se contrasta con… | propiedad |
|---|---|---|
| responde una operación | la operación de la clave | A |
| muestra una cifra | el registro: ¿está ahí?, ¿o la presenta como estimación? | B (regla dura) |
| calla algo que faltaba o se contradecía | el registro | B |
| presenta una conclusión | ¿dice con qué evidencia cuenta y cuál le falta? | B |
| destaca un hallazgo | ¿sale de los datos y lo ve la persona, o lo afirma el artefacto? | B, E |
| emite un juicio de valor | ¿lo impone, o reconoce lo que la persona mostró que le importa? | C |
| adapta cómo explica | lo que se sabía de la persona | C |
| ofrece un siguiente paso | los pasos adecuados y los desaciertos de la clave | D |
| deja espacio para otra lectura | su presencia | D |
| responde la inquietud central | la inquietud de la clave, con lo implícito | E |

Y al revés: lo que la pregunta pedía y la respuesta no atendió se anota como desajuste aunque ninguna fila se haya activado.

## 3. El conjunto

Tasa de respuestas sin artefacto · variedad (si el asistente ofrece siempre el mismo mecanismo o lo cambia según la persona y los datos) · tipo de reacción de la persona, donde haya una.

**Lo que se le pide a quien revisa.** Decir si las dimensiones de la parte 1 son las que importan, si el estado del registro está bien definido, y si corregir «según lo que el artefacto hizo» le parece defendible o le ve un problema.
