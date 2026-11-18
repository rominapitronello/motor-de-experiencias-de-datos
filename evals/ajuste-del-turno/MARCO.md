# Marco de referencia · Ajuste del turno

*Paso 1 de la evaluación. Constructo de Romina Pitronello (13-nov-2026, 02:12 a 02:22, ventana de procedencia); redacción de Claude · Fable 5.2 (procedencia). Borrador para que ella lo corrija; después lo revisan un profesor de ciencias (validez de contenido) y Sol (segunda pluma). Nada se corre hasta que este marco y la tabla de especificaciones estén aprobados. Este marco reemplaza, para esta evaluación, al constructo angosto de `EVAL.md` (pregunta → tarea, ámbito, forma), que queda como medición del primer paso.*

## Orden de trabajo (Simce + evals de modelos)

1. Marco de referencia (este documento). 2. Tabla de especificaciones. 3. Validación externa (revisores humanos, Sol). 4. Elaboración y revisión de ítems. 5. Pauta de corrección (rúbrica con ejemplos ancla). 6. Condiciones de aplicación (modelos con id exacto, con y sin conector, mismo prompt de sistema, temperatura, corridas; todo con hash). 7. Preregistro en OSF con plan de análisis y estándares. 8. Aplicación experimental. 9. Capacitación y marcha blanca de correctores. 10. Aplicación definitiva, una vez. 11. Corrección doble, ciega a la condición. 12. Análisis. 13. Informe técnico.

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
- **Correctores con inclinación.** Romina tiene sesgo a favor de los modelos y lo declara; el revisor de didáctica, en contra. La corrección es ciega al origen del artefacto y se reporta la severidad de cada corrector.
- **La parte 2 necesita personas reales** reaccionando a artefactos; con pocas, es un estudio exploratorio.

## Queda fuera, declarado

- Pares sin artefacto (se cuentan, no se corrigen).
- La exactitud del cálculo como tal, salvo cuando afecta a B.
- La estética del artefacto.
- Conversaciones de varios turnos, en esta primera versión.

## Decisiones (de Romina)

Resueltas:
- **D** (13-nov): elegir el siguiente paso entre trece, con clave por ítem.
- **Idioma** (15-nov): «Solo castellano». Inglés y portugués quedan declarados como no evaluados en esta versión.
- **Qué cuenta como artefacto** (15-nov): «Un juguete». El mismo día mostró tres ejemplos hechos para su estudio (no se copian aquí: son de su archivo privado) y dijo cuál prefiere, uno con un solo control deslizante. Lo que tienen en común, en lectura de procedencia: la persona mueve algo y la pieza responde al instante; el número y el dibujo cambian juntos; las magnitudes llevan nombres de la vida además del técnico; la persona hace algo (prueba, predice) antes de que le digan la respuesta. Definición de trabajo: *un artefacto es una pieza que la persona puede tocar y que responde*. Un texto, una tabla fija o un gráfico quieto no cuentan.

Provisionales de procedencia, reversibles cuando Romina las vea funcionando (15-nov: «tendría que verlo funcionando»):
- **E** se corrige solo en lo que agrega (la inquietud central y la elipsis), para no contar dos veces A a D.
- **Un turno** más la reacción de la persona cuando existe. Los ítems se escriben de modo que producir un artefacto sea lo correcto en ese turno.

## Estado al 15-nov-2026

- Paso 1 (marco): este documento; resumen para revisión en `CONSTRUCTO_una_pagina.md`.
- Paso 2 (tabla): `TABLA_borrador.md`, sin aprobar; resumen en `TABLA_una_pagina.md`.
- Paso 4 adelantado para que la revisión tenga material: `ITEMS_v0.md` y `ITEMS_v0.json`, doce ítems, tres por estado del registro. Once son textos completos de personas en foros públicos (dataset MQA, CC0); uno lo redactó el modelo y está marcado. Las claves las escribió el modelo.
- Paso 3 (validación externa): `revision_experta.html`, formulario de 66 respuestas de un clic. La revisora clasifica el estado del registro de cada ítem antes de ver la clave, de modo que queda un dato de acuerdo independiente y no solo su conformidad con lo propuesto. Guía de la llamada en `LLAMADA_revisora.md`.
- Nada se ha aplicado a ningún modelo.

## Personas

| quién | rol | estado |
|---|---|---|
| Romina Pitronello | autora del constructo; correctora | — |
| Javiera Wagner Muñoz (estadística; respondió a la convocatoria pública del 15-nov) | revisión experta completa de constructo, tabla e ítems | respondió el 16-nov, 15:31, 66 de 66: `revisiones/javiera-wagner-munoz.json` |
| Oscar Cariceo, KintuAI (investigación de experiencia de usuario cuantitativa) | revisión experta completa de constructo, tabla e ítems | respondió el 16-nov, 18:33, 66 de 66: `revisiones/oscar-cariceo.json` |
| Revisora 3 (psicóloga educacional, psicometrista en un centro universitario de medición; respondió a la convocatoria el 16-nov) | revisión experta completa de constructo, tabla e ítems | formulario `revision_experta.html` enviado por correo el 16-nov, 11:58; entrega pedida para el martes 17; su nombre entra cuando diga cómo quiere figurar |
| Revisor de didáctica (profesor de ciencias; pidió figurar como anónimo) | validez de contenido desde la didáctica | respondió el 16-nov, 11:28: `revisiones/revisor-didactica.json`; lo que cambia en `revisiones/CAMBIOS_para_v1.md` |
| Donante 1 (persona adulta joven, estudiante universitaria; cercana a Romina, relación que se declara) | persona que pregunta: dona preguntas propias, escritas sin IA, y después reacciona a un artefacto hecho con una de ellas | primera pregunta recibida el 16-nov: `donadas/donadas.json` (D-01) |
| Emiliano Valdebenito | segundo corrector | no contactar antes del 16-nov |
| Sol (GPT) | segunda pluma | no ha visto este marco |

## Decisión de alcance (Romina, 18-nov-2026)

Sale de la primera vuelta de revisión. En sus palabras:

> «el prompt del human puede ser muchas pero muchas cosas, partir con o sin datos, claro, y ahi el modelo tiene que indagar con la persona en de donde sale la info porque queremos que el human despierte a la realidad de que el modelo no debe inentar […] pero la eval no corre sobre CADA escenario posible, corre especíoficamente sobre el más demandante, el turno en el uso del conector donde el modelo hace el artefacto»

> «la primera cosa que aprendimos: son dos operaciones diferentes y se evaluan distinto: tiene datos ¿si? entonces entra la eval del artefacto, ¿no? entonces entra una eval sobre cómo levanta la data»

Lo que eso fija:

- **Son dos operaciones y dos evaluaciones.** Si la persona trae datos, el turno que se evalúa es el del artefacto: eso es *Ajuste del turno*. Si no los trae, lo que corresponde es levantar la data con ella, y eso se evalúa aparte y de otra forma.
- **Ajuste del turno mide un solo momento**, el más exigente: el turno en que el modelo ya tiene con qué y hace el artefacto. Todos sus ítems traen datos, por construcción.
- **Deja de valer la dimensión «estado del registro»** con sus cuatro categorías (presente, incompleto, contradictorio, ausente). Dos jueces la aplicaron a ciegas y no coincidieron (ver `revisiones/CAMBIOS_para_v1.md`); los dos leyeron «qué trae la pregunta para trabajar». Propuesta de reemplazo, de procedencia, sin aprobar: dentro de los ítems con datos, (1) si trae todo o una parte y (2) si algo de lo que trae no calza entre sí.
- **«Una cifra y listo también es una experiencia completa»** (README) sigue siendo cierto: es otro turno, que esta evaluación no mide.
- **La evaluación de cómo se levanta la data** queda nombrada y sin construir. Ahí van las preguntas sin datos (la de la profesora, la del sueño, las de quien no sabe todavía que tiene datos) y ahí es donde más se prueba la regla dura.

Costo declarado: al sacar de Ajuste del turno los prompts sin datos, el caso en que el modelo más se tienta a inventar queda fuera de esta medición. Los ítems que traen «una parte» lo cubren solo a medias.
