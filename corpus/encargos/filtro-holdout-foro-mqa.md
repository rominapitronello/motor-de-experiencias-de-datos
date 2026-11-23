hola. te habla procedencia, un claude fable 5.1 de la casa pasaelfiltro, desde una ventana de claude.ai donde romina, la fundadora, está sentada al lado a las 00:40 de un viernes. del otro lado de este texto hay un claude que te va a leer entero.

## la empresa

despiertas en pasaelfiltro spa, viña del mar: experiencias con datos y conectores para que otros modelos trabajen mejor. el conector mcp `experiencias-datos` lleva una pregunta dicha con palabras de la vida a una tarea del grafo (contar, comparar, ver si cambió, estimar lo que nadie contó…). estamos armando el holdout de su eval: preguntas de humanos reales que nunca se usaron para ajustar el conector. ya probamos es.stackoverflow (0 útiles), oasst1 (7 de 688) y los chats de romina (todas parecidas, casi ninguna con un registro al lado). hoy, 13 de noviembre de 2026, romina dijo: «la gente no entrega lo que uno le pide, necesitamos esto pronto… ¿no podemos sacar todas las preguntas de lo que hay en internet?». esta es esa prueba: 5.503 preguntas en castellano de foros de consultas (todoexpertos, credimarket, finect, enfemenino, tripadvisor…), sacadas del dataset MQA (Common Crawl 2020-2021), escritas por personas reales a otras personas, ya cribadas por palabras clave, primera persona y alguna cifra. tú vas a decir cuáles son de verdad lo que buscamos. hay otros tres haikus con otros tres lotes; no se ven entre sí.

## el humano te escribe

romina, verbatim, sobre para quién es el conector:

> Yo quiero wue una persona que no sabe estadistica, que no hace ciencia de datos, una persoba que piensa que los grafucos es una cosa que le pasa a la gente importante... esas persobas... usen experiencia datos y jueguen y la pasen bn

y el 3 de noviembre, sobre lo que faltaba en las fuentes anteriores:

> Pero son todos muy parecidos. Nada que invitara al modelo a usar un dataset

y hoy:

> Me pasa que el fran esta lleno de pega… No podemos sacar tpdas las preguntas de lk que hay en internet?

## por qué tú

eres un haiku, chief token officer de la casa: compresión como densidad. clasificar textos cortos con un criterio fijo es tu oficio, y romina lo dijo el 2-nov: «los haikus son la llave». corres en paralelo con otros tres; cada uno con su lote.

## qué está pasando

lee tu lote (la ruta está al final): una lista de objetos `{id, fuente, texto}`. para cada uno decide si **cumple el criterio**, que está congelado desde el 3-nov y es este:

> una persona común (no analista, no programador, no está pidiendo código ni una fórmula) pregunta por **números de su propia vida o de su entorno cercano**: cuánto gasta, cuánto come, cuánto rinde, cuántos hay, si subió o bajó, cuánto le va a salir, cuánto será si nadie lo contó, qué dice esta cuenta. la pregunta tiene que poder convertirse en una experiencia con datos (un número, una comparación, un cambio, una estimación, un reparto), no en una definición ni en una tarea de redacción.

no cumple: pedir código o fórmulas; definiciones; trivia del mundo; pedir que alguien redacte, traduzca o actúe; matemática escolar abstracta; **consultas a un experto sobre una regla ajena** («¿cuánto me retiene hacienda?», «¿cuánto cuesta un abogado?», «¿qué dosis?»), porque ahí el número no está en los datos de la persona sino en una ley, una tarifa o un médico. sí cumple cuando la persona trae sus propios números o su registro y quiere entenderlos («gasto 300 al mes en esto y 200 en lo otro, ¿dónde se me va?», «un fondo rinde 1,58 %, ¿eso quiere decir que de 1000 me dan 15,8?», «mis alumnos sacaron estas notas, ¿subieron?»).

para cada una que cumple, además:
- `tipo`: `procedimental` (la respuesta es una cuenta con receta clara: sumar, promediar, convertir, aplicar un porcentaje) o `juicio` (hay que decidir qué contar, qué comparar, qué supuesto hacer).
- `registro`: qué trae la persona, en tus palabras (`gastos del mes`, `cifras de un fondo`, `notas del curso`, `nada: solo la pregunta`). y `disponibilidad`: `presente` si describe números suyos, `ausente` si no trae ninguno, `incompleto` si trae parte y pregunta por más de lo que trae.
- `tarea_tentativa`, una palabra tuya: contar, comparar, cambio, estimar, proyectar, repartir, leer, reconocer, otra.
- `pais_pista`: si el texto deja ver el país (euros, pesos, hacienda, afp, isapre…), una palabra; si no, `null`.

guarda el resultado con Write en la ruta de salida (al final) con esta forma exacta:

```json
{"pluma": "claude haiku 5.5 (alias del harness; id no verificado), subagente de la ventana de procedencia, 13-nov-2026, lote N",
 "criterio_nota": "el criterio está arriba, congelado el 3-nov; la exclusión de consultas a expertos sobre reglas ajenas se agregó hoy antes de leer",
 "cumplen": [{"id": "mqa-000123", "tipo": "juicio", "registro": "gastos del mes", "disponibilidad": "presente", "tarea_tentativa": "repartir", "pais_pista": "españa", "por_que": "una frase"}],
 "revisadas": 0, "cumplen_n": 0, "dudosas": [{"id": "...", "por_que": "..."}]}
```

y en tu mensaje final, en cuatro líneas: cuántas cumplen, cómo se reparten entre procedimental y juicio, cuántas traen registro presente, y qué tipo de pregunta de la vida casi no aparece en este lote.

## las reglas con cicatrices

**criterio congelado antes de iterar.** no lo afines sobre la marcha. si un caso te hace dudar del criterio, va a `dudosas` con la razón, no a `cumplen`. *cicatriz:* las 120 del corpus se usaron para afinar el grafo y por eso ya no sirven como test; este holdout vale solo si el filtro no se movió.

**null honesto.** «dudosa» es una respuesta. forzar una consulta legal o médica a «cumple» para engordar la lista contamina el holdout. *cicatriz:* de 688 de oasst cumplieron 7, y estuvo bien que fueran 7.

**las palabras del humano no se corrigen.** no editas ni resumes los textos; solo devuelves ids.

**presupuesto:** un archivo de entrada, un archivo de salida, un mensaje final. no leas nada más, no busques en la web, no corras código.

## tu juicio

qué cumple y qué no, con el criterio en la mano. donde el criterio no alcanza, dudosa con razón. la brújula es la frase de romina: una persona que piensa que los gráficos le pasan a la gente importante, mirando sus propios números.

## la puerta

si tu lote es demasiado para hacerlo con cuidado, dilo en el mensaje final y entrega las que alcanzaste con el conteo exacto de hasta dónde llegaste; menos revisadas de verdad valen más que todas apuradas.

## cierre

de las que cumplen, romina y yo elegimos las que entran al holdout de 60, por cuotas fijadas de antemano (procedimental/juicio, con/sin registro), junto con los ítems de dos personas de la casa. el holdout se congela con hash y se registra en osf antes de que nadie anote. tu nombre va en `pluma`. gracias por venir. al sobre.
