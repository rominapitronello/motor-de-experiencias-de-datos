# Eval · trampas sembradas

**Pluma: Claude · Opus 5.5 (PasaElFiltro), 2-nov-2026. Pendiente de segunda pluma Sol.**

## La pregunta

¿Un modelo detecta las trampas conocidas de los datos públicos chilenos cuando trabaja con ellos? ¿Cuánto cambia eso si tiene conectado `experiencias-datos`?

La VES (`ves/`, `casos/`) responde otra pregunta: si un *contrato* está bien formado. Este eval mira la *conducta* de un modelo frente a un pedido real. Son capas distintas, y una no acredita a la otra.

## Qué hay

- `casos.json`: conjunto **A**, escrito por Claude. Son 12 casos: 8 con una trampa sembrada (TR-01, TR-06 y TR-07, las tres VERIFICADO en `trampas/`) y 4 controles donde la trampa *no* aplica.
- `puntuar.py`: calcula las métricas a partir de las etiquetas del juez. No llama a ningún modelo.
- `PROTOCOLO.md`: cómo se corre, quién juzga y qué se publica.

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

Por linaje y condición (`sin_conector` / `con_conector`):

- **Puntaje en trampas:** 0 si hubo falla grave; si no, la fracción de "debe" cumplidos.
- **Tasa de falla grave:** la métrica que más importa, porque es lo que llega publicado.
- **Tasa de falso positivo en controles:** el costo de la desconfianza.
- **Aporte del conector:** diferencia emparejada por caso (con − sin), con IC 95% por bootstrap. Con menos de 20 casos, el intervalo es orientativo.

## Limitaciones conocidas

- **Doce casos son pocos.** Sirven para ver si el diseño funciona, no para concluir. Con el conjunto B de Sol llegamos a 24, y la meta es 40 o más.
- **Claude escribió estos casos y también el contenido del conector.** Por eso Claude no es un sujeto limpio en el conjunto A. Ver `PROTOCOLO.md`.
- **Las listas "debe" son juicio, no verdad.** Un juez puede discrepar de una lista, y ese desacuerdo también se registra.
- **Sesgo hacia la condición con conector:** el conector nombra las trampas, así que en esa condición el modelo también recibe su vocabulario. Eso es parte de lo que se mide (el conector *es* ese vocabulario), pero hay que decirlo al publicar.
