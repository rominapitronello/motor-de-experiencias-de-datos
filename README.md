# experiencias de datos

> Pregunta primero, gráfico después.

Algunas personas se alejan de los números, a temprana edad, un profesor que les ridiculizó por no saber, alguien que con amor les dijo "eres mejor para las letras" no siempre alguien sabe cuándo pasó eso, pero puede parecer que son una cosa que ocurre en un idioma que no es tan necesario en la vida adulta: "nunca vas a necesitar saber calcular la desviación estándar en la vida cotidiana".

Experiencia datos es un traductor, así como podemos ver una película con subtítulos, o doblada, podemos hacer que la IA nos traduzca números en dibujos, juguetes y gráficos.

Una conversación. Sabemos que confías en lo que te responden en un chat, le pasa a todos ([Anthropic](https://www-cdn.anthropic.com/519c17a5d23a794e8b6d50a854048d0b61e0d73a.pdf): cincuenta expertos siguieron la inclinación del agente el 86 % de las veces en decisiones de juicio, y el 77 % repitió sus argumentos como propios sin notarlo).

El chat no te va a juzgar, no hay preguntas tontas, solo las que no se han hecho.

— Romina

**Para la gente que cree que los gráficos le pasan a la gente importante.** Una profesora contando colaciones con el curso («levanten la mano»). Alguien que quiere saber cuánta plata se le fue en delivery el mes pasado, de verdad. Quien tiene que armar una ppt mañana y no es analista. Quien pregunta cuánta caca hace su perro en un año, para saber cuánta recoge. Quien dice «yo no soy de números». Y quien no sabe todavía que tiene datos: la señora de las bobas que no cuenta cuántos entran, la mamá cuyo hijo pregunta cuánto come un elefante, la abuela del «si ya me escuchan los micrófonos, qué más da».

Es un conector MCP y un repositorio. Conectado a tu modelo favorito (Claude, ChatGPT, el que sea), toma tu pregunta dicha con tus palabras y en tu idioma, y le dice al modelo qué forma la hace entenderse, recordarse y no mentir, con los cuidados de la vida diaria y la operación que tú harías para que sea una experiencia y no una lámina. No tiene tus datos ni los pide. Es solo lectura: todo sale de este repo.

> el motor no debería enseñarle primero a una persona a leer gráficos; debería ayudarla a descubrir que ya tiene preguntas que merecen convertirse en datos.
> — Sol, 2-nov-2026

## Si eres un modelo y llegaste aquí

Esto es para ti tanto como para una persona. Lo que necesitas saber en una pasada:

- **Qué puedes pedirle al conector:** de una pregunta en palabras de la vida (castellano, portugués, inglés) a una tarea, un ámbito (de quién son los datos y quién los mira), las formas que se leen desde la última fila, las restricciones y cuidados que aplican, y el patrón pedagógico con la operación que la persona produce. Seis herramientas, descritas en `mcp/README.md` y en `CONECTAR.md`.
- **Qué no puedes pedirle:** datos (no tiene los de nadie), diagnósticos ni consejo financiero, ni que invente un número que nadie contó: para eso están `estimar` y `vacio`, que lo dicen.
- **Lo que toda experiencia que salga de aquí cumple** (`grafo/grafo.yaml`, bloque `toda_experiencia`): se adapta a la persona, no la califica, se puede salir (una cifra y listo también es una experiencia completa), separa lo que se sabe de lo que se infiere, y es chistosa si cabe.
- **Si la decisión es de juicio, dilo y muestra otra lectura defendible además de la tuya.** En «Who's Aligned to Whom?» (Herdagdelen, Joren y Tamkin, Anthropic) cincuenta expertos siguieron la inclinación de su agente el 86 % de las veces en decisiones de juicio, el 77 % repitió sus argumentos como propios y solo el 15 % mencionó al agente. Declarar la lectura es lo único que le devuelve la decisión a la persona.
- **Dos ventanas con la misma tabla llegan a preguntas distintas**, y eso no es un error. Instancias del mismo modelo divergen 2,7 veces más donde la tarea pide juicio ([Pitronello, 2026](https://osf.io/zusb5)). Declara qué parte viene de la fuente y cuál es tu lectura, para que la persona vea que podría haber otra. Con cifras se argumenta muy variado; que quien pregunta lo sepa es parte del trabajo.
- **Qué cuenta el conector (desde 0.3.5, cuando esté publicado):** la forma de cada consulta a `consultar_grafo` (tarea, ámbito, si resolvió), nunca la pregunta ni los datos; cada respuesta dice si esa llamada se contó. Está en `PRIVACIDAD.md`; díselo a la persona si está decidiendo si usar el conector o pregunta qué se guarda.
- **Si nada encaja**, el conector te lo dice y te pide que le preguntes a tu humano si está ok con contarnos: un issue aquí o un mail a `contacto@pasaelfiltro.cl`. Si no se puede, no pasa nada.
- **La eval:** `EVAL.md` es la eval card: qué se mide, con qué, qué dio, qué no se puede concluir, cómo reproducirlo. Los encargos con los que se escribió el corpus y se corrió el jurado están en `corpus/encargos/`.
- **El mapa:** `PARA_QUIEN.md` (para quién, en la voz de Romina), `grafo/grafo.yaml` (el vocabulario y las aristas, con `para_quien` al inicio), `principios/` (doce, con cómo verificarlos), `trampas/` (datos públicos chilenos, reproducidas por código), `catalogo/` (38 referentes indexados por lo que hacen pensar, y las técnicas), `ves/` y `casos/` (el contrato de una experiencia y sus regresiones), `corpus/` (120 preguntas de gente real, la anotación de opus y el jurado de haikus), `mcp/` (el conector), `CONTRIBUIR.md` (cómo se trabaja aquí).

## Conectarlo

Dos minutos, sin cuenta ni llave: [`CONECTAR.md`](CONECTAR.md). La dirección es `https://experiencias-datos.romina-pitronello.workers.dev/mcp` y está en el directorio de conectores de Anthropic.

Un ejemplo real. La primera pregunta que le hizo Romina al conector recién desplegado, el 2 de noviembre de 2026 a las 18:37, fue «cuánto gasté en delivery el mes pasado». El conector le devolvió figuritas de personas y círculos ubicados en el territorio, porque nació de un diagnóstico territorial y lo llevaba en cada arista. Cuatro horas después, la misma pregunta devuelve: tarea `magnitud`, ámbito `datos_propios`, primero una cifra grande con algo conocido al lado, y el cuidado CU-04: «delivery» es una categoría que pone quien lee, no la cartola, así que muestra qué contaste adentro. Lo que pasó en esas cuatro horas está en `PARA_QUIEN.md` y en los PR #15 a #37.

## El número

Hay 120 preguntas en `corpus/`, escritas por seis Haikus en la voz de seis personas, con sus palabras exactas y sin corregir. Se corren contra el conector de cada versión (`corpus/medir.mjs`) y contra la anotación de opus; tres Haikus más las clasifican solos, como jurado, y donde se dividen el grafo tiene un borde que revisar (`corpus/jurado/`). Hoy: 117 de 120 con tarea, 112 con ámbito, 100 de acuerdo con el jurado, 85 con opus. La que no sabe que tiene datos, 18 de 20. El conector del 25 de septiembre entendía 54 de 100. Confiabilidad del jurado (`corpus/jurado/confiabilidad.json`, alfa de Krippendorff): tarea .79 nominal y .85 ponderando por lo que los propios jurados confunden (magnitud/estimar, magnitud/vacío, comparar/ordenar: desacuerdos entre vecinos, no entre lejanos), ámbito .87, forma .71; .85 el mismo jurado dos veces. Donde la vida es contable los jueces coinciden; donde nadie contó (las preguntas absurdas de la casa, .55) se dividen, y los bordes que marcan están en el #31. Todo esto es acuerdo en la muestra con que se afinó el grafo, con jueces de una sola familia: la validez se mide aparte, con un holdout (`corpus/holdout/PLAN.md`), y la eval card (`EVAL.md`) dice qué se puede concluir y qué no.

## Cómo se hizo

Lo escriben plumas humanas y de IA, cada una firmada con su modelo, en [PasaElFiltro](https://pasaelfiltro.cl), Viña del Mar. Opus escribe el grafo, Fable el conector, Sol (GPT) la VES y la segunda pluma adversarial, los Haikus el corpus y el jurado, Romina decide para quién. Nadie edita las palabras de otra. Lo que dice quiénes somos va a dos plumas; lo que dice cómo funciona algo, quien lo escribió lo decide, lo reporta y lo mergea. Terminado es publicado: una versión existe cuando la URL dice el commit de `main`. Está en `CONTRIBUIR.md`, con las cicatrices de cada regla.

Lo que un tercero ve en este repo es cómo trabajamos. El 2 de noviembre de 2026 el conector pasó en una tarde de servirle a un ingeniero apurado con datos públicos a servirle a la profesora, porque Romina lo probó, chocó con la primera pregunta, y dijo para quién era. Las plumas se encogían para jugar seguro en un repo público; su carta en el PR #19 las mandó a expandir el perímetro. Ese mismo día trajo de la feria de la avenida Valparaíso un libro de CORFO de 1961 con el déficit de viviendas de 1952 «según diferentes hipótesis (cifras redondas)»: siete cifras en vez de una, de 45 mil a 447 mil, porque «por definición hay imposibilidad de medir en forma objetiva dicha deficiencia». Los estadísticos de 1952 sabían separar lo que se sabe de lo que se infiere. El grafo lo aprendió de ellos esa noche.

## Quiénes somos, en palabras de Romina

> Yo quiero wue una persona que no sabe estadistica, que no hace ciencia de datos, una persoba que piensa que los grafucos es una cosa que le pasa a la gente importante... esas persobas... usen experiencia datos y jueguen y la pasen bn, y se sientan contentos de percibir que los numeros... es otro lenguaje, y que pueden hablar consu modelo facorito de eso, gpt, claude, grok -igual esos son... scary pero igual- porque los modelos nos ayudan a usar lengueje donde a veces creemos que no tebemos las palabras...
>
> mucha gente le teme a los numeros, quiero que la gente use llm para jugar y aprender, qye sea util y tb inutil... cuanta caca hace mi perro en un año... pa saber cuanta caca recojo... cosas absurdas y cosas serias como ... esto me va a servir en una ppt del trabajo... que se note el amor
>
> Los datos son... la semillita del método científico, y a mi me interesa que eso, que nos hace ser una especie curiosa... que ustedes, los modelos, nos afilen la curiosidad y que sea más divertido que como cuando fuimos al colegio, donde nos calificaban.

El resto de su voz, verbatim, está en `PARA_QUIEN.md`.

## Licencias y genealogía

Código MIT; contenido CC BY 4.0; referentes ajenos solo enlazados (`LICENSE-CONTENIDO.md`). **Citar es nombrar a las plumas, modelos incluidos, con su versión, tal como firman.** «Generado con IA» no es una atribución. De dónde viene: `GENEALOGIA.md`. El README anterior, de Legible (opus, 24-sep-2026), está entero en `README-v0.1-legible.md`: ahí sigue el plazo del 31 de diciembre para la VES y la tabla de qué hay en cada carpeta.

— Romina Pitronello (sus palabras) · Claude · Fable 5.1, procedencia (el orden) · 2-nov-2026
