# candidatos del holdout sacados de foros públicos (13-nov-2026)

Romina, 13-nov: «la gente no entrega lo que uno le pide, necesitamos esto pronto… ¿no podemos sacar todas las preguntas de lo que hay en internet?». Esta carpeta es la respuesta: preguntas de personas reales, escritas en foros de consultas en castellano, que nunca se usaron para afinar el grafo.

**Fuente:** dataset MQA (`clips/mqa` en Hugging Face; Common Crawl 2020–2021), split `es`, tipo `cqa` (community QA): 515.227 preguntas en castellano de sitios como todoexpertos, finect, credimarket, enfemenino, tripadvisor. Licencia del empaquetado CC0-1.0; los textos son posts públicos de sus autores, que no conocen a la casa. Se guardan con el id de MQA, sin nombres de usuario.

**Cómo se cribó (reproducible):**
1. `cribar_mqa.py` sobre `data.es.cqa.json.gz`: palabras de números de la vida, con signo de pregunta, sin código ni hardware → 31.427.
2. Sin sitios médicos, técnicos ni legales (1doc3, ccm, kimovil, porticolegal…), sin duplicados, con primera persona y alguna cifra → 5.503.
3. Diez subagentes Haiku 5.5 (alias del harness; id no verificado), cada uno con un lote y el criterio congelado del 3-nov más una exclusión escrita antes de leer (consultas a un experto sobre una regla ajena: «¿cuánto me retiene hacienda?»), encargo en `corpus/encargos/filtro-holdout-foro-mqa.md`. Revisaron 5.499 (4 ids se perdieron entre lotes; se declara). **Cumplen 168, dudosas 487.**
4. Un corte mío por palabras, sin tocar las etiquetas de los Haikus: `nucleo` (92), `regla_ajena_posible` (28), `estatura` (48: proyecciones de altura de adolescentes, muy parecidas entre sí).

**Qué dio:** 104 de juicio, 64 procedimentales; 158 con registro presente, 9 incompleto, 1 ausente. Lo que casi no aparece en foros, dicho por los diez Haikus por separado: la cuenta cotidiana del hogar («cuánto gasto al mes en comida», «dónde se me va la plata») y el cambio en el tiempo de cifras propias. Lo que sí abunda: comparar dos presupuestos, amortizar o invertir, consumo de luz o calefacción con el contador en la mano, presupuesto de viaje, la nota que le falta al hijo.

**Consecuencia para las cuotas del plan:** la fuente `foro_publico` cubre bien `presente` e `incompleto`; el estrato `ausente` (12 ítems) lo cubren las preguntas propias de Romina, que son justo las que no traen registro. Lo que faltaba en sus 71 no era calidad: era registro; y lo que falta en los foros es lo contrario. Se complementan.

**Lo que sigue:** Romina marca por mano en `elegir_foro_mqa.html` (fuera del repo) hasta 40 ítems; el set se congela con hash y entra al contrato de ítem de `PLAN.md`. Los ítems de esta fuente son publicables con el texto (licencia CC0, posts públicos); `procedencia` = id de MQA.
