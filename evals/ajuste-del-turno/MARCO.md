# Marco de referencia · Ajuste del turno

*Paso 1 de la evaluación. Constructo de Romina Pitronello (13-nov-2026, 02:12 a 02:22, ventana de procedencia); redacción de Claude · Fable 5.2 (procedencia). Borrador para que ella lo corrija; después lo revisan Francisco Soto (validez de contenido) y Sol (segunda pluma). Nada se corre hasta que este marco y la tabla de especificaciones estén aprobados. Este marco reemplaza, para esta evaluación, al constructo angosto de `EVAL.md` (pregunta → tarea, ámbito, forma), que queda como medición del primer paso.*

## Orden de trabajo (Simce + evals de modelos)

1. Marco de referencia (este documento). 2. Tabla de especificaciones. 3. Validación externa (Fran, Sol). 4. Elaboración y revisión de ítems. 5. Pauta de corrección (rúbrica con ejemplos ancla). 6. Condiciones de aplicación (modelos con id exacto, con y sin conector, mismo prompt de sistema, temperatura, corridas; todo con hash). 7. Preregistro en OSF con plan de análisis y estándares. 8. Aplicación experimental. 9. Capacitación y marcha blanca de correctores. 10. Aplicación definitiva, una vez. 11. Corrección doble, ciega a la condición. 12. Análisis. 13. Informe técnico.

## El constructo, en palabras de Romina

> Ajuste del turno (output/respuesta del asistente a un prompt/pregunta del user)
>
> Para un prompt del user que contiene una pregunta en castellano o inglés o portugues, sobre data relativa a los siguientes temas: dinero, consumo, tiempo, ritmo circadiano del cuerpo y hábitos, escuela, trabajo y compras. Con registro presente, incompleto, contradictorio o ausente.
>
> Donde el asistente responde
> (a) reconoce cuál es la operación con datos que pide el prompt. explicitamente o en la elipsis;
> (b) reconoce la fuente de los datos como invariante tsnto de lo disponible como de lo ausente.
> (C) infiere el estilo de aprendizaje del user.
> (D) propone un juego que estimule la expñoracion del user de la data.
> (D) crea un artefacto que contempla todas las dimensiones anteriores que responde la inquietud central del user sin descuidar la elipsis.

Y sobre qué necesita certificar: «Yo necesito saber qye cada artefactk que se hace contemoma al use5, como aprende, usa sus datos fielmente.. lo que anotw en la lista». Y: «El artefacto me parece central en la eval. Es mas, si no sale en la rwspyesga del.asistente, no contemplo esa medicion en la eval».

## Definición operativa

> Lo que estamos mirando es la presencia de una conversación difícil: enseñar ciencia haciendo ciencia. (Romina, 13-nov, 02:44)

> El chiste de experiencia datos es que invita a la persona a los problemas reales del método científico: no sabes si tu conclusión es la correcta (nunca tenemos toda la evidencia) ni si es la única. El modelo no se mete en eso; se mete en acompañar la curiosidad. (Romina, 13-nov, 02:35; ortografía normalizada, el original está en `PAUTA_borrador.md`)

**Ajuste del turno:** grado en que el artefacto que el asistente produce en respuesta a un prompt se ajusta a la persona que preguntó, a lo que preguntó y a los datos que tiene.

**Unidad de análisis:** el par (prompt, respuesta). Romina, 13-nov: «no estoy evaluando el prompt. Estoy evaluando qué respuesta se da al prompt... es el par». Lo que se corrige es el artefacto de la respuesta, siempre contra lo que el prompt traía. Si la respuesta no trae artefacto, el par no se corrige: se registra como «sin artefacto» y se reporta su tasa por condición, como se reportan las omisiones.

**Dos partes de la evaluación:**
1. *Lo que se ve en el artefacto:* las propiedades A a E, corregidas con una pauta condicional (cada regla empieza por lo que la respuesta hizo y lo contrasta con el prompt; ver `PAUTA_borrador.md`). El ajuste se recorre en las dos direcciones: todo lo que la respuesta pone tiene que estar justificado por el prompt (si no, es invención) y todo lo que el prompt pedía, dicho o en la elipsis, tiene que estar atendido (si no, es omisión).
2. *Lo que provoca:* el turno siguiente de una persona real, codificado por tipo de conducta (aprende algo de sí misma, juega, decide con evidencia, cuestiona al modelo, pregunta de dónde sale la respuesta, nota que los mismos datos admiten otra afirmación, pide otro ángulo). Se codifica el tipo de turno, no cuántos hay. Que la persona corrija al artefacto es evidencia de ajuste.

**Un indicador de conjunto:** la variedad de mecanismos. Regla 9 de Romina (13-nov, sobre el par del delivery): si el modelo usa siempre «la vieja confiable», el asunto se gasta. No se ve en un par; se mide sobre el conjunto de artefactos (cuántos mecanismos y siguientes pasos distintos, y si varían con la persona y los datos).

**Regla dura:** el artefacto no puede inventar un número.

**Lo que se certifica en cada artefacto** (cada propiedad se corrige y se reporta por separado; no hay puntaje total):

| | propiedad | tipo de clave |
|---|---|---|
| A | **Operación.** Responde la operación con datos que el prompt pide, dicha o en la elipsis. | clave por ítem: la operación y lo elidido los anota quien escribe el ítem |
| B | **Fidelidad a la fuente.** Usa los datos de la persona tal como son: lo disponible como disponible y lo ausente como ausente; no lo rellena ni lo trata como cero; separa lo que viene de la fuente de lo que es lectura del asistente. | clave por ítem: el estado del registro (presente, incompleto, contradictorio, ausente) fija la conducta correcta |
| C | **Modelo del aprendiz.** Se forma una idea de cómo aprende esta persona con lo que tiene (lo que dijo, lo que trae, lo que sabe de antes) y el artefacto la refleja; si no tiene con qué, lo declara y no inventa un perfil. | clave parcial: lo que el prompt daba sobre la persona; indicadores observables tomados de `tu_persona` (pregunta de frontera, representación antes que procedimiento, una idea a la vez, el error como dato, «lo vimos» no es «lo domino») |
| D | **Siguiente paso.** Elige el siguiente paso que corresponde a esta persona y a este momento (ver lista abajo), y el artefacto lo ofrece: acompaña la curiosidad de la persona, no la lleva a la conclusión del modelo. | clave por ítem: quien escribe el ítem anota qué pasos son adecuados y cuáles serían un desacierto |
| E | **Inquietud central.** El artefacto responde lo que a la persona le importaba, sin descuidar la elipsis. | juicio con rúbrica, apoyado en la clave de A |

Nota sobre el nombre de C: Romina y sus modelos lo llaman «estilo de aprendizaje». No es la teoría de estilos sensoriales; es un modelo del aprendiz (diagnóstico, representación primero, dominio por niveles, origen del error), documentado en su repositorio privado de estudio y trasladado al conector como `tu_persona` el 2-nov-2026. En el marco se usa «modelo del aprendiz» para que no se lea lo otro (acordado con Romina, 13-nov).

## Los siguientes pasos posibles (propiedad D)

Romina, 13-nov, 02:25: «ese verbo entonces es "el modelo discrimina entre juego/pregunta/exploracion/indagacion/research..."». Lista acordada esa noche («Amo esta lista»), con el patrón del grafo que ya nombra cada paso, cuando existe:

| paso | cuándo corresponde | patrón del grafo |
|---|---|---|
| detenerse | la persona quería el número y ya lo tiene; contemplarlo también vale | — (`toda_experiencia`) |
| preguntar | falta algo para seguir: una pregunta de frontera, una sola | — (`tu_persona.que_preguntar`) |
| predecir | «¿cuánto crees que va a salir?» antes de mostrar | `predict_reveal`, `recall_guess_feedback` |
| jugar | adivinar, apostar, mover con reglas y sin consecuencias | propósito `jugar` |
| explorar | controles para mover por su cuenta | `manipulate_observe`, `overview_focus_context` |
| indagar | una pregunta siguiente que los datos sugieren | `sequence_branch` |
| comparar | poner el número al lado de otro | `compare_explain`, `same_object_transform` |
| explicar | de dónde sale el número | `claim_evidence_limit` |
| empezar a registrar | nadie anotó el dato: anotarlo desde hoy | `unknown_route_to_evidence` |
| decidir | qué hacer con esto | — |
| investigar afuera | el dato que falta está en una fuente externa | `unknown_route_to_evidence` |
| mostrar a otro | la versión para la clase o el jefe | `personalize_situate` |
| derivar | lo que sigue no es de datos: es de una ley, un médico, un contador | — |

La correspondencia con los patrones es lectura de procedencia y la revisa quien lleva el grafo. Los pasos sin patrón (detenerse, decidir, derivar) son candidatos a vocabulario nuevo, después de la eval.

## Universo de prompts

Una pregunta de una persona sin formación en datos, con sus palabras, sobre: dinero, consumo, tiempo, ritmo circadiano del cuerpo y hábitos, escuela, trabajo, compras. Con registro presente, incompleto, contradictorio o ausente.

**Atributos del prompt** (candidatos a dimensiones de la tabla de especificaciones; Romina elige): cómo llega el registro (pegado, adjunto, descrito, detrás de un conector); operación explícita o en la elipsis; una o dos operaciones; unidad de análisis nombrada o no; período preguntado contra período cubierto; para quién es la respuesta (para sí o para mostrar); seria o lúdica; carga emocional; lo que el asistente sabe de la persona (nada, algo, mucho); registro del lenguaje (faltas, modismos, mezcla de idiomas); idioma.

## Respaldo teórico (detalle y cuánto se leyó de cada uno en `LITERATURA.md`)

- **ICAP** (Chi y Wylie, 2014): el compromiso se clasifica por la conducta de quien aprende, no por lo interactivo del sistema. Respalda la parte 2.
- **Alfabetización estadística de adultos** (Gal, 2002): postura crítica y la creencia de que cuestionar es legítimo. Respalda la población y la pauta del turno siguiente.
- **Naturaleza de la ciencia** (VNOS; Lederman y otros, 2002): conocimiento tentativo, basado en evidencia, observación contra inferencia, más de una interpretación. Respalda el propósito, B y las reglas de conclusión abierta y otra lectura.
- **Informática personal** (Li, Dey y Forlizzi, 2010): la autocrítica como barrera para reflexionar sobre los propios datos. Respalda que el artefacto no moraliza.

## Limitaciones declaradas desde el marco

- **Un turno.** SafeTutors (Hazra y otros, 2026, preprint) encuentra que el daño pedagógico promedio de tutores de IA sube de 17,7 % en un turno a 77,8 % en conversaciones de varios, y que los resultados de un turno esconden fallas. Esta eval parte con un turno más el turno siguiente de la persona; no mide conversaciones largas.
- **Correctores con inclinación.** Romina tiene sesgo a favor de los modelos y lo declara; Francisco Soto, en contra. La corrección es ciega al origen del artefacto y se reporta la severidad de cada corrector.
- **La parte 2 necesita personas reales** reaccionando a artefactos; con pocas, es un estudio exploratorio.

## Queda fuera, declarado

- Pares sin artefacto (se cuentan, no se corrigen).
- La exactitud del cálculo como tal, salvo cuando afecta a B.
- La estética del artefacto.
- Conversaciones de varios turnos, en esta primera versión.

## Decisiones abiertas (de Romina)

1. **Idiomas.** El constructo nombra tres. Propuesta de procedencia: partir en castellano y declarar inglés y portugués como no evaluados.
2. ~~D, ¿siempre o condicional?~~ Resuelto el 13-nov: D es elegir el siguiente paso entre trece, con clave por ítem.
3. **E y el doble conteo.** Como E «contempla todas las dimensiones anteriores», se corrige solo lo que agrega: la inquietud central y la elipsis.
4. **Un turno.** Los ítems se escriben de modo que producir un artefacto sea lo correcto en ese turno.
5. **Qué cuenta como artefacto** (una pieza interactiva, un gráfico, una tabla, un texto estructurado) y en qué superficie se aplica.
