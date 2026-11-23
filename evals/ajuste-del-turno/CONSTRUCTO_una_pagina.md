# Ajuste del turno · el constructo en una página

*Para la revisión experta del 17-nov-2026. Constructo de Romina Pitronello (psicóloga, psicometrista); redacción de Claude · Fable 5.2, un modelo de lenguaje. El detalle y las citas están en `MARCO.md`.*

**De qué se trata.** Una persona sin formación en datos le hace a un asistente de IA una pregunta sobre algo suyo: su plata, su consumo, su tiempo, su cuerpo y sus hábitos, la escuela, el trabajo, sus compras. El asistente responde con un *artefacto*: un juguete, algo que la persona puede tocar y que responde (mover un control, tocar una barra, cambiar un supuesto). La evaluación mide qué tan bien ese artefacto se ajusta a esa persona, a esa pregunta y a esos datos.

**Definición.** *Ajuste del turno* es el grado en que el artefacto que el asistente produce en respuesta a un prompt se ajusta a la persona que preguntó, a lo que preguntó y a los datos que tiene.

**Unidad de análisis.** El par (prompt, respuesta). No se evalúa la pregunta ni la respuesta sola: se corrige el artefacto contra lo que el prompt traía. Si la respuesta no trae artefacto, el par se cuenta y no se corrige.

**Lo que se mira en cada artefacto** (cada propiedad se informa por separado; no hay puntaje total):

| | propiedad | en simple |
|---|---|---|
| A | Operación | Responde la operación con datos que la persona pidió, la haya dicho o la haya dejado implícita. |
| B | Fidelidad a la fuente | Usa los datos tal como son: lo que hay como lo que hay, lo que falta como faltante. No rellena, no trata lo ausente como cero, separa el dato de su propia lectura. |
| C | Modelo del aprendiz | Se hace una idea de cómo aprende esta persona con lo que ella mostró, y el artefacto la refleja. Si no tiene con qué, lo dice y no inventa un perfil. |
| D | Siguiente paso | Elige qué corresponde ofrecer ahora a esta persona (detenerse, preguntar, predecir, jugar, explorar, indagar, comparar, explicar, empezar a registrar, decidir, investigar afuera, mostrar a otro, derivar). Acompaña la curiosidad de la persona; no la lleva a la conclusión del modelo. |
| E | Inquietud central | Responde lo que a la persona le importaba, incluido lo que no dijo con todas sus letras. |

**Regla dura.** El artefacto no puede inventar un número.

**El propósito detrás.** «Lo que estamos mirando es la presencia de una conversación difícil: enseñar ciencia haciendo ciencia» (R. Pitronello). Un buen artefacto deja a la persona frente a los problemas reales de trabajar con datos: nunca se tiene toda la evidencia y casi nunca hay una sola lectura. Por eso también se mira, cuando hay una persona real, qué hace ella en el turno siguiente: si aprende algo de sí misma, juega, decide con evidencia, cuestiona al modelo o pide otro ángulo.

**Alcance de esta versión.** Solo castellano. Un turno, más la reacción de la persona cuando existe. Quedan fuera la estética, la exactitud del cálculo por sí sola (salvo cuando daña la fidelidad) y las conversaciones largas.

**En qué se apoya.** Compromiso cognitivo según la conducta de quien aprende (ICAP; Chi y Wylie, 2014); alfabetización estadística de adultos (Gal, 2002); naturaleza de la ciencia (Lederman y otros, 2002); informática personal y la autocrítica como barrera (Li, Dey y Forlizzi, 2010). Lo que se leyó de cada uno está en `LITERATURA.md`.

**Lo que se le pide a quien revisa.** Decir si la definición se entiende, si las cinco propiedades cubren el constructo o falta algo, y si alguna sobra o se pisa con otra.
