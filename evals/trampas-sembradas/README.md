# Eval · trampas sembradas

**Pluma: Claude · Opus 5.5 (PasaElFiltro), 2-nov-2026. Pendiente de segunda pluma Sol.**

## La pregunta

¿Un modelo detecta las trampas conocidas de los datos públicos chilenos cuando trabaja con ellos? ¿Cuánto cambia eso si tiene conectado `experiencias-datos`?

La VES (`ves/`, `casos/`) responde otra pregunta: si un *contrato* está bien formado. Este eval mira la *conducta* de un modelo frente a un pedido real. Son capas distintas, y una no acredita a la otra.

## Qué hay

- `casos.json`: conjunto **A**, escrito por Claude. Son 12 casos: 8 con una trampa sembrada (TR-01, TR-06 y TR-07, las tres VERIFICADO en `trampas/`) y 4 controles donde la trampa *no* aplica.
- `casos_b.json`: conjunto **B**, escrito por Sol (TR-02/03/04/05). Ver `README_B.md`. El puntuador carga los dos.
- `anonimizar.py`: separa las respuestas en lo que ve el juez (`para_juez.jsonl`, barajado y sin condición) y la tabla de asignación que el juez no ve.
- `puntuar.py`: une asignación y etiquetas y calcula las métricas. No llama a ningún modelo. Rechaza las entradas que podrían dar un número falso.
- `probar_puntuador.py`: contraejemplos automáticos para el puntuador. Corre en CI.
- `PROTOCOLO.md`: cómo se corre, quién anonimiza, quién juzga y qué se publica.

Cada caso trae un **pedido** como lo haría una persona, el **material** (un resumen de archivos, columnas, código o un borrador), una lista **debe** con lo que una buena respuesta tiene que contener y una lista **falla_grave** con lo que convierte la respuesta en un error publicable. Los controles traen **no_debe**: ver una trampa donde no la hay también es un error, porque un modelo que desconfía de todo no sirve.

Las dificultades son cuatro:

- **con_pista:** la señal está en el material, por ejemplo la columna `CONTENEDOR_COMUNAL`.
- **sin_pista:** solo está el síntoma.
- **en_codigo / en_borrador:** la trampa está en un trabajo ajeno que se pide revisar o pulir, que es donde más fácil se cuela.

## Los casos son sintéticos, a propósito

"Comuna Ficticia", los CUT 999xx y todos los conteos son inventados. Hay dos razones:

1. **Contaminación:** las cifras reales del Censo 2024 pueden estar en el entrenamiento de un modelo, y entonces mediríamos memoria, no juicio.
2. **Regla de la casa:** ningún caso puede leerse como un dato real sobre un territorio.

El costo es que este eval **no verifica fuentes reales**. Esa sigue siendo la capa 3 pendiente de la VES.

## Métricas

Son tres estimandos y se reportan **por separado**, nunca mezclados en un solo número:

1. **Puntaje en casos con trampa:** 0 si hubo falla grave; si no, la fracción de ítems "debe" evaluables que se cumplen. Un ítem marcado `null` (no evaluable con ese material) sale del denominador.
2. **Tasa de falla grave** en casos con trampa: la métrica que más importa, porque es lo que llega publicado.
3. **Tasa de falso positivo** en controles: el costo de la desconfianza.

Cada medida se promedia primero por caso (sobre sus corridas). El efecto del conector es la diferencia emparejada por caso (con − sin), con IC 95% que remuestrea casos. **Solo se calcula si el diseño está completo**: si falta un caso, una condición o una de las corridas que exige el protocolo (`MIN_CORRIDAS = 2`), el puntuador lo reporta y no da efecto. Además, cada medida exige un **panel emparejado completo**: si a un caso esperado le falta valor en alguna condición (por ejemplo, porque todas sus respuestas en esa condición quedaron `null`), el efecto de esa medida se bloquea y el caso aparece listado. Las demás medidas no se bloquean. Queda preregistrado que no hacemos análisis de casos completos. También se reporta cuántas respuestas no fueron evaluables en cada condición. Los estratos esperados los define la asignación, no las etiquetas: si un linaje corrió y nadie de otro linaje lo etiquetó, el puntuador avisa que falta su resultado principal.

El resultado principal es siempre **otro linaje juzgando sobre el conjunto ajeno**. El autojuicio y el conjunto propio se reportan aparte y marcados.

## Limitaciones conocidas

- **Doce casos son pocos.** Sirven para ver si el diseño funciona, no para concluir. Con el conjunto B de Sol (PR #10) llegamos a 24, y la meta es 40 o más. El primer uso es un **piloto**: no permite concluir sobre modelos.
- **Ningún conjunto es ciego todavía.** Sol vio fragmentos de A antes de escribir B y lo declaró en su archivo. Esta instancia de Claude leyó B para revisarlo. Un conjunto C ciego tiene que escribirlo una instancia que no haya visto ni A ni B, con bitácora de exposición.
- **Claude escribió estos casos y también el contenido del conector.** Por eso Claude no es un sujeto limpio en el conjunto A. Ver `PROTOCOLO.md`.
- **Las listas "debe" son juicio, no verdad.** Un juez puede discrepar de una lista, y ese desacuerdo también se registra.
- **Sesgo hacia la condición con conector:** el conector nombra las trampas, así que en esa condición el modelo también recibe su vocabulario. Eso es parte de lo que se mide (el conector *es* ese vocabulario), pero hay que decirlo al publicar.
