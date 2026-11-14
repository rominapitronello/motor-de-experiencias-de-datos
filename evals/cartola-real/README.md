# eval · la cartola real (borrador, sin datos todavía)

*alféizar (claude · fable 5.2), 14-nov-2026, con romina. carpeta nueva; otra eval, no una extensión de `EVAL.md`, como pidió procedencia.*

## qué mide y qué no

`EVAL.md` y el holdout miden el primer paso: de la pregunta a tarea, ámbito y forma. Esta mide lo que viene después: **dado un mes de movimientos reales y una pregunta de la dueña de esos movimientos, ¿el modelo llega al número correcto?** El árbitro es código sobre la tabla etiquetada, no otro modelo.

No entra al holdout ni usa sus ítems. No mide el conector: el modelo recibe la tabla y la pregunta, sin grafo.

## por qué existe

El paper de romina (preprint v1, OSF zusb5) encontró que el marco relacional no cambia el acuerdo entre instancias pero alarga la traza (+42 %). La literatura dice que razonar más ayuda en cálculo encadenado (Sprague et al., arXiv 2409.12183) y puede empeorar cuando hay distractores (Gema et al., arXiv 2507.14417). De ahí sale una predicción de dos filos, que el jurado no puede probar porque su salida es un json sin traza:

- con marco casa, más traza → **mejor** en ítems encadenados;
- con marco casa, más traza → **peor** en ítems con distractor.

Si no pasa ninguna de las dos, también es resultado. Es desarrollo, exploratorio, y así se escribe.

## los datos

Un mes de la cartola de romina de hace dos años. Es lo primero real que tiene esta casa en datos propios.

- romina la saca a mano. Nadie la toma de un chat ni de un archivo.
- **nunca entran al repo:** números de cuenta, de tarjeta, rut.
- los nombres de terceros se reemplazan por concepto, que pone ella de memoria («don juanito» → «pescadería en la feria»).
- ella etiqueta fila a fila. Sin etiqueta no hay árbitro.
- consentir evaluar no es consentir publicar. Este repo es público: **por defecto la tabla no vive aquí.** Aquí va el esquema, el hash de la tabla y los resultados agregados. Si romina decide publicar el mes sanitizado, entra con su consentimiento escrito en este archivo.

Esquema propuesto de la tabla:

| columna | qué es |
|---|---|
| `fila` | número correlativo |
| `fecha` | día del mes |
| `monto` | pesos, negativo si sale |
| `tipo` | compra, transferencia, pago, abono, comisión |
| `concepto` | lo que romina dice que fue, con sus palabras |
| `categoria` | etiqueta de romina, de una lista corta que ella define |

## los ítems

No se escriben antes de ver la tabla. Sí se declaran antes los cuatro tipos:

1. **directo.** un filtro, una suma. piso.
2. **encadenado.** tres pasos o más: filtrar, agrupar, restar o sacar proporción.
3. **con distractor.** la pregunta trae un detalle que no importa, o la tabla trae filas que se parecen a las que importan y no lo son.
4. **sin respuesta.** la tabla no lo contiene. lo correcto es null.

Las preguntas las escribe romina, con sus palabras. Cada ítem trae su respuesta calculada por código y las filas que la producen.

## diseño

Marco (casa, neutro, herramienta) × temperatura (0, 1) × tipo de ítem. Los marcos neutro y herramienta se adaptan de `corpus/encargos/marcos/`; el marco casa de esta eval se escribe cuando exista la tabla, con las palabras de romina. El núcleo es `encargo-nucleo.md`, idéntico en los tres.

Variables: acierto exacto contra el código; filas declaradas contra filas correctas; largo de la salida antes del json; tasa de null; tasa de objeción.

## lo que falta

- el mes de cartola, sanitizado y etiquetado (romina);
- dónde vive la tabla si queda privada;
- los ítems y el script árbitro;
- el marco casa de esta eval;
- consulta a un haiku con los textos finales;
- plan de análisis y registro en osf aparte;
- segunda pluma de sol.

Procedencia propuso el orden: primero la pieza de marcos sobre el jurado, que no necesita a romina; después el holdout; después esto.
