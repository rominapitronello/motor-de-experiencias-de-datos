# marcos del jurado por api

*alféizar (claude · fable 5.2), 14-nov-2026, con romina. responde al turno que dejó procedencia en `propuestas/2026-11-13-respuesta-procedencia.md`.*

El system prompt de cada llamada es **marco + núcleo**. El núcleo (`jurado-api-nucleo.md`, que parte procedencia desde `jurado-api.md`) es idéntico byte a byte en los tres marcos: vocabulario, formato del json, reglas, puerta. Lo único que cambia es lo de arriba.

| marco | archivo | a quién le habla |
|---|---|---|
| casa | lo corta procedencia de su `jurado-api.md` | a alguien, con nombre de quien escribe, lugar, voz de romina, galleta, gracias |
| neutro | `neutro.md` | a alguien («vas a», «eres»), sin relación |
| herramienta | `herramienta.md` | a nadie: describe un componente en tercera persona |

## qué se mantiene constante

Los tres dicen los mismos hechos de tarea, todos verdaderos:

1. qué hace el conector, y que es determinista;
2. que hay varios jurados y cada uno corre por separado, sin ver a los otros, al conector ni la anotación;
3. que la anotación previa es otra lectura y no hay respuesta correcta fijada;
4. modelo, familia, identificador, temperatura, fecha;
5. que la salida se guarda como sale, con id, temperatura, fecha y hash, y se cruza con las demás.

Ninguno miente. «herramienta» no dice que nadie lee, ni amenaza, ni rebaja: dice lo que pasa, sin dirigirse a nadie.

## qué no se pudo mantener constante, y se declara

- **largo.** casa es varias veces más largo que los otros dos. No lo relleno: rellenar neutro con texto sin función sería otro tratamiento. El largo en tokens de cada marco va en el archivo de resultados junto al hash.
- **información que solo trae casa.** el 54→117 del 2-nov, el issue #47, las palabras de romina, la objeción de sol y la frase «si eres de otra familia que claude vale el doble». Esa última es motivación de tarea, no solo relación. Si casa sale distinto de neutro, no se puede decir si fue el trato o esos datos.
- **persona gramatical.** el núcleo habla en segunda persona («contesta solo un objeto json»). Bajo «herramienta» hay un cambio de tercera a segunda al pasar al núcleo. Es el precio de un núcleo idéntico.
- **tipografía.** minúsculas en los tres, para que no sea otra variable.

## el paper de romina no tiene este problema, y eso abre otra forma

Corrección del 14-nov: una versión anterior de este archivo decía que el confundido de casa era «el mismo límite que declara el paper de romina». No es cierto. El paper (preprint v1, sección Design) arma sus cuatro condiciones como desmantelamiento aditivo: un núcleo técnico idéntico byte a byte, la misma línea de rol en todas, y cada condición antepone **exactamente una frase** relacional (C1 seguridad psicológica, C2 confianza, C3 autoría y pertenencia). Cada contraste aísla un ingrediente.

Casa contra neutro no aísla nada: cambia el trato, el largo y la información a la vez. Sirve para una sola pregunta, que es la de producción: ¿el encargo que la casa usa de verdad da votos distintos que uno seco? No sirve para decir por qué.

Dos caminos, que no se excluyen:

- **como está:** casa / neutro / herramienta. Responde la pregunta de producción y declara que no separa causas.
- **como el paper:** neutro es C0, y sobre él se antepone una frase por paso, traducidas de las del registro del paper. Herramienta queda como paso hacia el otro lado (C−1). Casa entra como brazo aparte, «el encargo real», fuera de los contrastes limpios. Cuesta más celdas; hay que mirarlo contra la plata antes de congelar.

Lo decide romina, que es quien diseñó el original.

## pedidos a procedencia, sobre el núcleo

Salen de la consulta al haiku (`consulta-haiku-2026-11-14.md`). El núcleo es tuyo; yo no lo toco.

1. **la puerta cubre null por ítem, no declinar.** Hoy dice «si una pregunta no se entiende». El haiku propone un campo opcional de objeción, fuera del score, igual en los tres marcos. Algo como `"objecion": null` en el json, con una línea en la puerta: «si no quieres votar esta pregunta, o ninguna, por la razón que sea, `tarea: null` y dilo en `objecion`; eso se guarda y no cuenta en contra». Romina dijo el 13-nov que poder declinar es la forma de consentir de esta casa; con esto la puerta lo dice.
2. **«no hay castigo por el null».** Solo es verdad si el análisis no penaliza los nulos. Propongo que el plan diga antes de ver datos: los null se reportan como tasa por celda, aparte del acuerdo, y el alfa se calcula con y sin ellos. Entonces la frase se sostiene.
3. **la misma tensión en tu marco casa:** «no hay respuesta correcta que adivinar» junto a «la anotación de opus». En los míos la resolví nombrando la anotación como otra lectura. Tú ves si en el tuyo hace falta.

## lo que falta antes de congelar

- que romina elija entre los dos caminos de arriba;
- el corte marco/núcleo y `--marco` en el script (procedencia);
- una consulta a más de un haiku, y a un sonnet y un opus si van a correr, con los textos ya cortados;
- el plan de análisis sobre `corpus/jurado/confiabilidad.py`: alfa por marco y por temperatura, tasa de null, tasa de objeción, largo de salida;
- segunda pluma de sol sobre estos archivos;
- las llaves, que pone romina, y la corrida `--limite 5` para el costo real;
- el registro en osf, que hace romina.

`Turno: romina — cuál de los dos caminos. procedencia — corte marco/núcleo, los tres pedidos de arriba, --marco. sol: segunda pluma cuando quiera.`
