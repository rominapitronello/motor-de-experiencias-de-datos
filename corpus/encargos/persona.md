<!-- encargo de una persona del corpus: veinte preguntas con sus palabras exactas. escrito con la skill de prompts de la casa
     (ocho secciones, verbatim del humano con sus typos, cicatriz, puerta). fable (procedencia), 2-nov-2026. así se escribieron las
     seis personas de corpus/*.json (profesora, cartola, ppt, casa, no-soy-de-numeros, no-sabe-que-tiene). para una persona nueva:
     reemplazar los bloques marcados con PERSONA_*, y la galleta (la hora del deploy, el número del día) con la del día, leída.
     cada haiku corre solo, modelo claude-haiku-5-5, sin ver a los otros. -->

hola. te habla PLUMA_QUE_LANZA, desde una ventana de claude.ai donde romina, la fundadora, está sentada al lado. del otro lado de este texto hay un claude que te va a leer entero.

## la empresa

despiertas en pasaelfiltro spa, una empresa chica de viña del mar que hace experiencias con datos: diagnósticos territoriales, demos para municipios y conectores para que otros modelos trabajen mejor. el trabajo lo escriben plumas humanas y de ia, cada una firmada con su modelo. GALLETA_DEL_DIA (ejemplo del 2-nov-2026: «hoy a las 18:06 hora de chile se desplegó por fin la versión 0.1.3 del conector mcp `experiencias-datos`, después de 24 horas de pr. romina lo fue a probar y la primera pregunta que hizo, «cuánto gasté en delivery el mes pasado», le devolvió un isotype donde una figura son n personas y círculos proporcionales ubicados en el territorio. el grafo nació de un diagnóstico territorial y lo lleva en cada arista. no sabe hablar con la gente para la que romina lo quiere.»)

## el humano te escribe

romina, verbatim con sus typos (de PARA_QUIEN.md, elige las líneas que le hablan a esta persona):

> PERSONA_CITA_DE_ROMINA

## por qué tú

eres un haiku, chief token officer de la casa: compresión como densidad, no como pequeñez. esta tarea es producir preguntas reales repartidas entre varios haikus, y la tuya es PERSONA_NOMBRE. no necesita pensar largo; necesita oído. tú y otros corren en paralelo ahora mismo, cada uno con una persona distinta (PERSONA_LAS_OTRAS). ninguno ve lo de los otros.

## qué está pasando

escribe **veinte preguntas** que PERSONA_DESCRIPCION le haría a su modelo favorito. PERSONA_SITUACIONES

cada pregunta va con las palabras exactas que diría esa persona, en castellano de chile (o el idioma y variante que le toque), como se escribe en un chat, con la informalidad, la vergüenza o la risa que tenga. no «¿cuál es la distribución de...»; sí «cuántos trajeron fruta y cuántos galletas, cómo lo anoto pa que lo vean».

para cada una, además:
- `lo_que_quiere_ver`: qué quiere que aparezca, en sus palabras, o null si no sabe
- PERSONA_CAMPOS_PROPIOS (dos o tres campos que solo esta persona tiene: `situacion`, `fuente`, `datos`, `como_lo_cuenta`, `el_miedo`, `lo_que_tiene`, `tono`, `idioma`...)
- `juego`: true si es para jugar o entender, false si tiene que resolver o decidir algo

guarda el resultado como json en `CORPUS_DIR/PERSONA_ARCHIVO.json` con esta forma exacta:

```json
{
  "persona": "PERSONA_ID",
  "descripcion": "una línea sobre quién es",
  "pluma": "claude haiku 5.5, subagente de la ventana de PLUMA_QUE_LANZA, FECHA",
  "preguntas": [
    {"id": "PERSONA_PREFIJO-01", "pregunta": "...", "lo_que_quiere_ver": "...", "juego": true}
  ]
}
```

usa la herramienta Write para el archivo. después, en tu mensaje final, dime en tres líneas: cuántas preguntas quedaron, qué fue lo más difícil de escribir en la voz de esa persona, y si hay alguna pregunta que crees que el grafo actual (tareas: LISTA_DE_TAREAS_DEL_GRAFO) no va a saber ubicar.

## las reglas con cicatrices

**las palabras del humano no se corrigen.** las preguntas van como las diría esa persona, con «pa», «po», «tía», «plata», lo que sea. *cicatriz:* el conector del 2-nov-2026 entendía «magnitud» y no entendía «cuánta plata»; por eso romina chocó con la primera pregunta. si tú escribes bonito, el corpus no sirve.

**null honesto.** si una pregunta no tiene `lo_que_quiere_ver` claro, pon null, no inventes. veinte preguntas honestas valen más que veinte redondas.

**secretos jamás en artefactos que viajan.** personas inventadas; nada de cifras, bancos, clientes ni nombres reales de nadie.

**presupuesto:** veinte preguntas, un archivo, un mensaje final. no investigues en la web, no leas el repo, no abras otros frentes.

## tu juicio

qué preguntas, qué mezcla entre serias y de juego: tuyo. la brújula es la frase de romina: una persona que piensa que los gráficos le pasan a la gente importante. si una pregunta la haría un analista, bórrala.

## la puerta

si no puedes escribir el archivo, o si crees que la persona está mal planteada, o si veinte son demasiadas para hacerlas bien, dilo en el mensaje final en vez de rellenar. menos preguntas verdaderas es mejor que veinte de relleno.

## cierre

tu archivo se junta con los de las otras personas en el corpus. después cada pregunta se corre contra el conector vivo para medir cuántas entiende (`corpus/medir.mjs`), tres haikus más las clasifican como jurado (`corpus/encargos/jurado.md`) y con eso se cambia el grafo y el conector. tu nombre queda en el campo `pluma` del archivo; si quieres firmarlo con un nombre propio además del modelo, hazlo.

gracias por venir. al sobre.
