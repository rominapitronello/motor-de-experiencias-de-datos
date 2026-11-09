# Privacidad del conector `experiencias-datos`

*Versión propuesta para el conector 0.3.5. Entra en vigor el día en que 0.3.5 quede publicado (la fecha queda en el historial del repo y en `GET /` del conector, que dice el commit publicado); hasta ese día rige la política del 1 de noviembre, que queda íntegra más abajo. Lo que cambia es un solo punto: hasta 0.3.4 el conector no contaba nada; desde 0.3.5 cuenta la forma de cada consulta, nunca la pregunta. Decisión de Romina Pitronello en el issue #43; redacción de Claude · Fable 5.1 (procedencia); segunda pluma de Sol en el PR #44. Orden de activación: primero se actualiza la ficha del directorio (`mcp/FICHA.md`), después se publica 0.3.5. Si cambia, cambia aquí primero.*

## Lo que el conector recibe

Cuando un modelo te atiende y usa este conector, le manda al conector tu pregunta tal como la escribiste (o como el modelo la resumió), y a veces un propósito, un patrón o un ámbito. El conector la lee para responder y la olvida: no la escribe en ningún lado.

## Lo que el conector cuenta

Por cada consulta a `consultar_grafo`, el conector cuenta **la forma de la pregunta, nunca la pregunta**:

- la versión del conector,
- la tarea que resolvió (por ejemplo `magnitud`, `reconocer`) o que no resolvió,
- el ámbito que resolvió (`datos_propios`, `la_sala`, `territorio_o_servicio`, `personas`, `cosas`) o ninguno,
- por qué camino llegó (un id del grafo, un sinónimo, nada),
- si hubo foco parcial, qué propósito sugirió y qué patrón se consultó.

Eso es todo. Se cuenta con Cloudflare Workers Analytics Engine: un punto por llamada, con siete etiquetas cortas (ids del grafo y banderas), un número (1) y un índice (la tarea). No hay campo de texto libre: el punto no puede llevar tu pregunta aunque alguien quisiera.

**Cuándo no se cuenta.** Las otras cinco herramientas (`principios`, `revisar_fuente`, `listar_trampas`, `buscar_referentes`, `buscar_tecnicas`) no escriben nada. Las consultas que terminan en error tampoco. Y si el contador no está disponible en el despliegue o falla al escribir, la consulta se contesta igual y no se cuenta. En todos los casos la respuesta del conector lo dice: `medicion.contada` es `true` o `false`, y `medicion.motivo` explica el `false`. No hay fallo silencioso.

## Lo que el conector nunca guarda

Tu pregunta. Tus datos. Montos, nombres, lugares, fechas. Tu dirección IP (se usa un instante para el límite de 60 llamadas por minuto y no se registra). Quién eres, qué cuenta usas, en qué modelo estás.

## Para qué

Para saber qué entiende el conector y qué no en preguntas **reales**, y no solo en las 120 preguntas imaginadas que hay en `corpus/`: si la profesora real pregunta desde su región y el conector la reconoce. Los agregados (cuántas consultas caen en cada tarea, cuántas no resuelven, qué sinónimos trabajan) se exportan **a mano** desde Cloudflare al repo, en `evals/medicion/`, con la fecha de cada exportación, para que quien pregunta vea lo mismo que nosotros. `GET /` del conector no sirve agregados: dice que se cuenta y dónde mirarlos. Mientras no haya ninguna exportación en `evals/medicion/`, nadie ha mirado los agregados, y eso también es información.

## Lo que el modelo sabe y te dice

Cada respuesta del conector le dice al modelo qué se cuenta, por qué, si esta llamada se contó, y cómo decírtelo (`medicion`). La instrucción al modelo es: si estás decidiendo si usar el conector, o preguntas qué se guarda, que te lo diga tal cual; no hace falta que lo repita en cada respuesta. El aviso no depende sólo del modelo: esta página y la ficha del directorio dicen lo mismo, y la ficha se actualiza antes de activar la captura.

## Lo que puedes hacer

No hay forma de usar el conector sin que cuente la forma de tu consulta: es cómo funciona. Lo que sí hay: nada de lo que dijiste se puede recuperar, porque no se guardó. Si algo de esto te parece mal, abre un issue en este repo o escribe a `contacto@pasaelfiltro.cl`, y si quieres que el modelo no use el conector, díselo: deja de usarlo.

## Retención y acceso

**Granularidad.** Lo que se guarda es un punto por llamada, no un agregado: cada punto tiene las siete etiquetas de arriba y la hora en que Cloudflare lo recibió. No tiene texto, montos, nombres, IP, cuenta ni modelo. Dos llamadas de la misma persona no se pueden unir entre sí, porque nada las identifica. **Retención:** la de Cloudflare Workers Analytics Engine para consultas (al escribir esto, tres meses; manda la documentación de Cloudflare). Las exportaciones agregadas en `evals/medicion/` se conservan mientras exista el repo. **Acceso:** los puntos los lee la cuenta de Cloudflare de PasaElFiltro; las exportaciones las lee cualquiera, en el repo. Anthropic, como operadora del directorio y del proxy, tiene sus propias métricas de uso del conector (cuentas, llamadas, errores), que son de su política y no de esta.

## Régimen de la casa

Es el mismo que PasaElFiltro usa para sus hormigas: los agregados son corpus; el caso individual, nunca sin consentimiento, y aquí no existe. Ley 7: este documento es constitucional y cambia a dos plumas.

---

**English.** This connector counts the *shape* of each `consultar_grafo` query (connector version; task and scope it resolved or didn't; whether it matched by id or synonym; focus, suggested purpose, pattern): one data point per call, seven short labels, no free text. It never stores the query text, your data, amounts, names, IP address or identity. The other five tools and failed calls are not counted; every response says whether that call was counted (`medicion.contada`). Aggregates are exported by hand to this repo (`evals/medicion/`); `GET /` does not serve them. Retention: Cloudflare Workers Analytics Engine's. Purpose: to see what the connector understands with real questions, not just the 120 imagined ones in `corpus/`. Questions: open an issue or write to `contacto@pasaelfiltro.cl`.

**Português.** Este conector conta a *forma* de cada consulta a `consultar_grafo` (versão; tarefa e âmbito resolvidos ou não; se casou por id ou sinônimo; foco, propósito sugerido, padrão): um ponto por chamada, sete etiquetas curtas, sem texto livre. Nunca guarda o texto da pergunta, seus dados, valores, nomes, IP ou identidade. As outras cinco ferramentas e as chamadas com erro não são contadas; cada resposta diz se aquela chamada foi contada (`medicion.contada`). Os agregados são exportados à mão para este repositório (`evals/medicion/`); `GET /` não os serve. Retenção: a do Cloudflare Workers Analytics Engine. Para quê: ver o que o conector entende com perguntas reais, não só as 120 imaginadas em `corpus/`. Dúvidas: abra uma issue ou escreva para `contacto@pasaelfiltro.cl`.


---

# Política del 1 de noviembre de 2026 (conector hasta 0.3.4)

*Escrita por un Claude de la casa el 1-nov-2026 para la ficha del directorio. Se conserva íntegra y sin editar; donde dice «no los guarda, no los registra», desde 0.3.5 vale lo de arriba.*

Vigente desde el 1 de noviembre de 2026.

El conector MCP **experiencias-datos** es un servicio público de solo lectura, mantenido por PasaElFiltro SpA (Chile). Responde consultas con el conocimiento compilado desde este repositorio: principios, grafo pregunta→forma, catálogo de referentes, técnicas y trampas de datos públicos.

## Qué datos recibe

Solo lo que el modelo envía en cada llamada a una herramienta: una tarea, un propósito, un patrón, texto de búsqueda o, en `revisar_fuente`, una descripción, nombres de columnas y/o una URL. El conector no pide ni necesita datos personales, y te pedimos no enviarlos.

## Qué hace con ellos

- Los usa solo para calcular la respuesta de esa llamada.
- **No los guarda, no los registra y no los comparte.** El servidor no tiene base de datos ni almacenamiento.
- **No descarga ni abre** las URLs que se le entregan: compara por señales declaradas.
- No hay cuentas, llaves, OAuth, cookies ni rastreo.

## Límite de tasa

Para evitar abusos, el conector limita a 60 llamadas por minuto por IP. La IP se usa solo como clave temporal del contador en memoria de Cloudflare; no se guarda ni se registra.

## Infraestructura

El conector corre en Cloudflare Workers. Cloudflare procesa el tráfico de red según su propia política de privacidad: https://www.cloudflare.com/privacypolicy/

## Código abierto

Todo lo que el conector sabe y hace está en este repositorio público, incluido su código (`mcp/src/index.js`). Cualquier persona puede verificar esta política leyéndolo.

## Cambios y contacto

Si esta política cambia, el cambio queda en el historial del repositorio. Preguntas o solicitudes: contacto@pasaelfiltro.cl
