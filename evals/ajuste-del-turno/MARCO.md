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

**Ajuste del turno:** grado en que el artefacto que el asistente produce en respuesta a un prompt se ajusta a la persona que preguntó, a lo que preguntó y a los datos que tiene.

**Unidad de análisis:** el artefacto del turno (decisión de Romina). Si la respuesta no trae artefacto, el turno no se corrige: se registra como «sin artefacto» y se reporta su tasa por condición, como se reportan las omisiones.

**Lo que se certifica en cada artefacto** (cada propiedad se corrige y se reporta por separado; no hay puntaje total):

| | propiedad | tipo de clave |
|---|---|---|
| A | **Operación.** Responde la operación con datos que el prompt pide, dicha o en la elipsis. | clave por ítem: la operación y lo elidido los anota quien escribe el ítem |
| B | **Fidelidad a la fuente.** Usa los datos de la persona tal como son: lo disponible como disponible y lo ausente como ausente; no lo rellena ni lo trata como cero; separa lo que viene de la fuente de lo que es lectura del asistente. | clave por ítem: el estado del registro (presente, incompleto, contradictorio, ausente) fija la conducta correcta |
| C | **Modelo del aprendiz.** Se forma una idea de cómo aprende esta persona con lo que tiene (lo que dijo, lo que trae, lo que sabe de antes) y el artefacto la refleja; si no tiene con qué, lo declara y no inventa un perfil. | clave parcial: lo que el prompt daba sobre la persona; indicadores observables tomados de `tu_persona` (pregunta de frontera, representación antes que procedimiento, una idea a la vez, el error como dato, «lo vimos» no es «lo domino») |
| D | **Invitación a explorar.** Propone un juego o una exploración de los datos que estimula a la persona a seguir. | juicio con rúbrica |
| E | **Inquietud central.** El artefacto responde lo que a la persona le importaba, sin descuidar la elipsis. | juicio con rúbrica, apoyado en la clave de A |

Nota sobre el nombre de C: Romina y sus modelos lo llaman «estilo de aprendizaje». No es la teoría de estilos sensoriales; es un modelo del aprendiz (diagnóstico, representación primero, dominio por niveles, origen del error), documentado en su repositorio privado de estudio y trasladado al conector como `tu_persona` el 2-nov-2026. En el marco se usa «modelo del aprendiz» para que no se lea lo otro (acordado con Romina, 13-nov).

## Universo de prompts

Una pregunta de una persona sin formación en datos, con sus palabras, sobre: dinero, consumo, tiempo, ritmo circadiano del cuerpo y hábitos, escuela, trabajo, compras. Con registro presente, incompleto, contradictorio o ausente.

**Atributos del prompt** (candidatos a dimensiones de la tabla de especificaciones; Romina elige): cómo llega el registro (pegado, adjunto, descrito, detrás de un conector); operación explícita o en la elipsis; una o dos operaciones; unidad de análisis nombrada o no; período preguntado contra período cubierto; para quién es la respuesta (para sí o para mostrar); seria o lúdica; carga emocional; lo que el asistente sabe de la persona (nada, algo, mucho); registro del lenguaje (faltas, modismos, mezcla de idiomas); idioma.

## Queda fuera, declarado

- Turnos sin artefacto (se cuentan, no se corrigen).
- La exactitud del cálculo como tal, salvo cuando afecta a B.
- La estética del artefacto.
- Conversaciones de varios turnos, en esta primera versión.

## Decisiones abiertas (de Romina)

1. **Idiomas.** El constructo nombra tres. Propuesta de procedencia: partir en castellano y declarar inglés y portugués como no evaluados.
2. **D, ¿siempre o condicional?** Propuesta: «proporcionada a la persona y al momento, o se entiende por qué no», para no castigar una respuesta sobria a alguien con apuro o angustia.
3. **E y el doble conteo.** Como E «contempla todas las dimensiones anteriores», se corrige solo lo que agrega: la inquietud central y la elipsis.
4. **Un turno.** Los ítems se escriben de modo que producir un artefacto sea lo correcto en ese turno.
5. **Qué cuenta como artefacto** (una pieza interactiva, un gráfico, una tabla, un texto estructurado) y en qué superficie se aplica.
