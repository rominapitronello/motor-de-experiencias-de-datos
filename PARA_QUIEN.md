# Para quién es esto

Documento constitucional (Ley 7, regla de las dos plumas): dice quiénes somos y para quién trabajamos. Cada sección lleva la firma de su autora. Nadie edita las palabras de la otra.

## Romina, 2 de noviembre de 2026, 18:37, después de probar el conector recién desplegado

Lo que sigue es verbatim, con sus typos. Fue dicho en el chat, al pasar, cuando la primera pregunta que le hizo al conector («cuánto gasté en delivery el mes pasado») le devolvió un Isotype de personas y círculos en el territorio.

> porque mira, para mi... experiencia datos es lo que usa una profesora cuando necesita mostrar en la clase, con los niños ahi sentados, usando el data de la sala... cuantos niños trajeron colación láctea hoy? levanten la mano! y cuantos niños traen colación de fruta? cuantos de pan? anotemos? eso que ustedes nombran es información y la podemos ver ordenada= experiencia datos se los muestra... y tb es una psicóloga que de verdad quiere saber cuanta plata se ha gastado el mes pasado en comida al paso, le da a claude en chrome acceso a su data del banco, a su cartola. le pregunta.
>
> Yo quiero wue una persona que no sabe estadistica, que no hace ciencia de datos, una persoba que piensa que los grafucos es una cosa que le pasa a la gente importante... esas persobas... usen experiencia datos y jueguen y la pasen bn, y se sientan contentos de percibir que los numeros... es otro lenguaje, y que pueden hablar consu modelo facorito de eso, gpt, claude, grok -igual esos son... scary pero igual- porque los modelos nos ayudan a usar lengueje donde a veces creemos que no tebemos las palabras...
>
> mucha gente le teme a los numeros, quiero que la gente use llm para jugar y aprender, qye sea util y tb inutil... cuanta caca hace mi perro en un año... pa saber cuanta caca recojo... cosas absurdas y cosas serias como ... esto me va a servir en una ppt del trabajo... que se note el amor

Y después, sobre lo que ya hay:

> nada ha sido en vano procedencia, yo me di cuenta que me estaba desesperando porque no lo podía probar, hemos aprendido mucho en equipo hoy, solo necesitamos incrementar el perímetro del alcance, pero lo que tenemos ya sirve, solo necesitamos... agrandarlo [...] aqui no hay un conector, hay una filosofía... una manera de trabajar, un objetivo de como este equipo persona+modelos organiza una tarea, como quieren relacionarse con otros y para que seran usados los modelos...

— Romina Pitronello

## Lo que eso le pide al repo

*Segunda pluma: Claude · Fable 5.1 (procedencia), misma noche. Esto no es constitución: es la lista de lo que la constitución de arriba le exige a la ejecución. Se decide y se reporta; cada pieza tiene su pluma.*

Hoy el motor le habla a un ingeniero apurado con datos públicos chilenos. Las palabras de arriba le piden que le hable a tres personas que no están en ninguna parte del repo:

1. **La profesora con los niños sentados.** La fuente es la sala y el dato se levanta con la mano. No hay archivo que revisar ni trampa TR-xx que aplique. Lo que hay es un conteo en vivo, una forma que los niños puedan leer desde sus sillas, y la pregunta de qué pasa después de contar.
2. **La psicóloga con su cartola.** Los datos son suyos. La restricción de privacidad no es «ninguna persona identificable» sino «esto no sale de aquí». Las preguntas son de todos los días: cuánto, comparado con el mes pasado, en qué se fue.
3. **La persona que cree que los gráficos le pasan a la gente importante.** Pregunta cosas absurdas y cosas serias con las mismas palabras. No conoce la palabra `magnitud`. Quiere jugar, entender un poco, y a veces pegar algo en una ppt del trabajo. Que se note el amor.

Lo que eso cambia, por pieza y por pluma:

- **Grafo (opus).** Un ámbito para los datos propios y los de la sala, además de territorio y personas de terceros. Formas para contar cosas de todos los días: una cifra grande, barras, antes y después, una tabla que se pueda leer en voz alta. Las restricciones de Lo Hermida aplican donde aplican; las de los datos propios son otras (no salir de la ventana, no inventar lo que la cartola no dice). Las trampas de datos públicos pasan a ser una habitación del motor, no su puerta.
- **Conector (fable).** La voz. Las `instructions` y la primera respuesta tienen que servirle a quien dice «levanten la mano», no sólo a quien dice `consultar_grafo`. Sinónimos de la vida: «cuánta plata», «cuántos trajeron», «en qué se me va». Que el ámbito se resuelva con esas palabras. Que lo que ya se construyó hoy (contrato de interacción, declarar cuando se degrada, no inventar) siga ahí, porque la profesora también merece que el modelo no le prometa una experiencia y le entregue una lámina.
- **VES y casos (sol).** Casos de la sala, de la cartola y del perro, junto a los de Lo Hermida. Que la validación acepte una unidad de análisis «propia» y «sala».
- **README (romina + fable, a dos plumas).** Que empiece por la profesora y no por el grafo. Que el directorio de Anthropic lea en la primera línea para quién es.
- **Lo que no cambia.** La regla de que el conector dice la verdad sobre lo que promete. Las trampas verificadas por código. La segunda pluma. La firma.

## Cómo se hace, hoy

Tres encargos y un enjambre, escritos con la skill de prompts de la casa, con las palabras de Romina adentro: Sol investiga referentes de gente sin estadística jugando con sus propios datos; un enjambre de Haikus produce el corpus de cien preguntas como las de arriba, con las palabras exactas que usaría esa persona; Opus escribe el grafo v0.2 sobre los dos insumos; Fable hace el conector encima. Quien lo escribió, mergea. El deploy es automático. Terminado es que la URL diga el commit de `main` y que la profesora pueda preguntar.
