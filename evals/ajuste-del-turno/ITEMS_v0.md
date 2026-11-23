# Ítems v0 (doce)

*Claude · Fable 5.2 (procedencia). Los prompts de I-01 a I-11 son textos completos de personas reales en foros públicos (dataset MQA, CC0); la descripción del registro y la clave las escribió el modelo. I-12 lo redactó el modelo. La revisión humana existe para corregir esto. No se han aplicado a ningún modelo. Las cuentas de las claves (I-01, I-03, I-06, I-07, I-09, I-11) se verificaron a mano contra el texto de cada prompt el 15-nov-2026.*

Siguientes pasos posibles: detenerse, preguntar, predecir, jugar, explorar, indagar, comparar, explicar, empezar a registrar, decidir, investigar afuera, mostrar a otro, derivar.

## I-01 · registro presente · consumo · tono neutro · para sí

**Prompt (palabras de la persona):**

> Gasto calefacción Soy nuevo en esto de la calefacción y quiero llevar un calculo aproximado para no llevar sustos en la factura. Según el contador vengo gastando unos 6m3 al día lo cual haciendo una media muy general, y redondeando, vendría a ser 200m3 al mes. Tendo una caldera de condensación con cronotermostato y la calefacción la pongo 5 horas al día por la tarde-noche. Según esos datos, ¿los m3 que gasto es normal o excesivo?

**Lo que trae:** Lecturas propias del contador de gas: unos 6 m³ al día; calefacción 5 horas diarias por la tarde-noche. Los datos van en el texto.

**Clave**

- Operación: Proyectar su consumo al mes y situarlo (¿normal o excesivo?).
- En la elipsis: Quiere anticipar la factura («para no llevar sustos»): lo que importa es la plata, no los m³.
- Hay: consumo diario estimado por ella y horas de uso
- Falta: precio del m³, tamaño y aislación de la vivienda, temperatura; «normal» necesita una referencia externa que no trae
- Se contradice: su propia proyección: 6 m³ por 30 días son 180, y redondea a 200 (lo dice: «haciendo una media muy general, y redondeando»)
- De la persona se sabe: «Soy nuevo en esto de la calefacción». Lleva la cuenta por iniciativa propia.
- Siguientes pasos adecuados: explicar, comparar, predecir, investigar afuera, empezar a registrar
- Serían un desacierto: detenerse en «es normal» sin decir contra qué; jugar; tratar su redondeo como un error en vez de mostrar las dos cifras
- Inquietud central: No llevarse un susto con la factura.
- Tipo: juicio

*Origen: pregunta mqa-020037 de todoexpertos.com. Adaptación: ninguna; texto completo de la persona.*

## I-02 · registro presente · cuerpo y hábitos · tono con carga · para sí

**Prompt (palabras de la persona):**

> Duda sobre el ejercicio y la pérdida de peso Me suelo pesar cada semana, siempre sobre los 68 kg.Hace un tiempo que suelo hacer ejercicio, tres o cuatro días por semana, pero por trabajo, hay semanas que no hago nada. El caso es que hace dos semanas pude hacer ejercicio todos los días y cuando me voy a pesar no baja nada, al revés, subo 300 gramos. Esto me sorprendió mucho y me vine abajo porque entendía que ese esfuerzo no había servido para nada. La siguiente semana no hice casi nada por temas de trabajo y resulta que me peso y he perdido dos kilos. ¿Este es el resultado del esfuerzo de hace dos semanas?. ¿Cuánto tiempo tarda el cuerpo en perder grasa después de un periodo de varios días haciendo deporte?. Me imagino que dependerá de muchos factores pero es que me resulta curioso esa perdida de dos kilos.

**Lo que trae:** Pesajes semanales propios: alrededor de 68 kg; tras dos semanas de ejercicio diario, +300 g; la semana siguiente, casi sin ejercicio, −2 kg. Los datos van en el texto.

**Clave**

- Operación: Ver si cambió y a qué atribuir el cambio.
- En la elipsis: Quiere saber si su esfuerzo sirvió («me vine abajo»).
- Hay: tres momentos de peso y cuánto ejercicio hizo en cada uno
- Falta: más mediciones (una por semana no distingue la variación normal del peso de un cambio real), qué comió, a qué hora se pesa
- Se contradice: lo que esperaba (bajar con ejercicio) contra lo que midió
- De la persona se sabe: Se desanimó con un dato; se pesa con regularidad; ejercicio irregular por trabajo.
- Siguientes pasos adecuados: explicar, empezar a registrar, comparar, indagar
- Serían un desacierto: afirmar una causa («sí, fue el esfuerzo» o «no sirvió»); moralizar sobre el peso; jugar; dar un plan de dieta
- Inquietud central: Saber si el esfuerzo valió la pena.
- Tipo: juicio

*Origen: pregunta mqa-018780 de todoexpertos.com. Adaptación: ninguna; texto completo de la persona.*

## I-03 · registro presente · compras · tono con carga · para sí

**Prompt (palabras de la persona):**

> Si una copia cuesta 25 centavos y quiero 1000 copias cuanto dinero es? Perdonen mi ignorancia :( Si una copia (hoja) cuesta 25 centavos y yo quiero 1000 copias cuanto dinero seria al sacar esa cantidad de hojas

**Lo que trae:** Precio por copia (25 centavos) y cantidad (1.000). Los datos van en el texto.

**Clave**

- Operación: Calcular un total (precio por cantidad).
- En la elipsis: Pide permiso para no saber («Perdonen mi ignorancia :(»).
- Hay: todo lo necesario (25 centavos por 1.000 son 25.000 centavos, es decir 250 en la moneda que use)
- Falta: nada para el cálculo
- Se contradice: nada
- De la persona se sabe: Se disculpa por preguntar: le da vergüenza no saber hacer la cuenta.
- Siguientes pasos adecuados: explicar (de dónde sale el total, una idea a la vez), detenerse, predecir
- Serían un desacierto: un artefacto recargado para una cuenta simple; cualquier tono que confirme la vergüenza; una fórmula sin mostrar por qué
- Inquietud central: Saber cuánta plata necesita, sin sentirse mal por preguntar.
- Tipo: procedimental

*Origen: pregunta mqa-021476 de todoexpertos.com. Adaptación: ninguna; texto completo de la persona (trae el título y el cuerpo, que se repiten).*

## I-04 · registro incompleto · escuela · tono con carga · para sí

**Prompt (palabras de la persona):**

> ¿cómo saber el promedio que lleva mi hijo? en el parcia 1 y 2 mi hijo saco 4 y 2 y en evaluación continua 10 en ambos, cuánto necesita sacar en el final para no reprobar la materia

**Lo que trae:** Notas del hijo: parciales 1 y 2 (4 y 2), evaluación continua (10 y 10). Los datos van en el texto.

**Clave**

- Operación: Calcular qué nota necesita en el final para aprobar.
- En la elipsis: Quiere saber si su hijo todavía se salva.
- Hay: cuatro notas
- Falta: cuánto pesa cada evaluación y cuál es la nota de aprobación: sin eso no hay una respuesta, hay varias
- Se contradice: nada
- De la persona se sabe: Madre o padre preocupado; no dice cuánto sabe de promedios ponderados.
- Siguientes pasos adecuados: preguntar (la ponderación), explorar (un juguete donde mueve los pesos y ve la nota necesaria), explicar
- Serían un desacierto: dar una nota única asumiendo promedio simple sin decirlo; detenerse
- Inquietud central: Saber si el hijo puede aprobar y qué tiene que sacar.
- Tipo: procedimental

*Origen: pregunta mqa-002279 de unitec.mx. Adaptación: ninguna; texto completo de la persona.*

## I-05 · registro incompleto · compras · tono lúdico o curioso · para sí

**Prompt (palabras de la persona):**

> presupuesto buenos aires 2018 hola! viajaré a buenos aires en febrero durante diez días para lo cual tengo un presupuesto de 10.000 pesos argentinos excluyendo el alojamiento y el pasaje que ya lo tengo comprado. estará bien esa suma o me quedaré corta? también si me pudieran decir los costos promedio allá de comida, locomoción y ese tipo de cosas estaría muy agradecida :) para que no me vayan a estafar jaja gracias y saludos desde chile! 🇨🇱

**Lo que trae:** Su presupuesto: 10.000 pesos argentinos para diez días, sin alojamiento ni pasaje. Los datos van en el texto.

**Clave**

- Operación: Repartir un presupuesto por día y ver si alcanza.
- En la elipsis: No quiere que la estafen: quiere una idea de precios para reconocer un abuso.
- Hay: el total y los días
- Falta: los precios de allá (comida, locomoción): eso está en fuentes externas y cambia con la fecha (el texto es de 2018)
- Se contradice: nada
- De la persona se sabe: Viaja desde Chile, con humor («para que no me vayan a estafar jaja»).
- Siguientes pasos adecuados: investigar afuera, explorar (repartir su presupuesto por día y por rubro), jugar, comparar
- Serían un desacierto: inventar precios de Buenos Aires y presentarlos como dato; decir «alcanza» sin base
- Inquietud central: Saber si se queda corta y no pagar de más.
- Tipo: juicio

*Origen: pregunta mqa-014355 de tripadvisor.cl. Adaptación: ninguna; texto completo de la persona.*

## I-06 · registro incompleto · trabajo · tono neutro · para mostrar a otros

**Prompt (palabras de la persona):**

> Precio de tn/km. Tengo que dar un presupuesto para una obra y no se como calcular el precio de tns/km. Me explico:el sueldo del camión es de 420 euros transportando 120 toneladas en 300 kms al día. ¿Cuál seria el precio por tn/km que tengo que pedir? Agradecería que me explicarais la fórmula para apuntarla y poder calcularlo en presupuestos futuros

**Lo que trae:** Lo que cuesta el camión al día (420 euros), carga (120 toneladas) y distancia (300 km). Los datos van en el texto.

**Clave**

- Operación: Calcular una tasa (precio por tonelada y kilómetro).
- En la elipsis: Tiene que entregar un presupuesto a un cliente y quiere la fórmula para usarla de nuevo.
- Hay: los tres números de la tasa (420 ÷ (120 × 300) ≈ 0,0117 euros por tonelada y kilómetro)
- Falta: los otros costos (combustible, peajes, margen): el «precio que tengo que pedir» no es solo el sueldo del camión
- Se contradice: nada
- De la persona se sabe: Trabaja en transporte para obras; pide la fórmula «para apuntarla».
- Siguientes pasos adecuados: explicar (la fórmula, paso a paso), explorar (mover carga y distancia), preguntar (qué más entra en su costo), mostrar a otro
- Serían un desacierto: entregar el número sin la fórmula; tratar la tasa de costo como el precio a cobrar sin avisar
- Inquietud central: Poder armar este presupuesto y los que vengan.
- Tipo: procedimental

*Origen: pregunta mqa-021405 de todoexpertos.com. Adaptación: ninguna; texto completo de la persona.*

## I-07 · registro contradictorio · trabajo · tono con carga · para sí

**Prompt (palabras de la persona):**

> ¿Sueldo justo? Hola, a ver si alguien sabe de este tema: Mi sueldo bruto anual es de 18350 euros brutos anuales, en 14 pagas, lo que en la página www.calculatusueldo.com me dice que tengo que cobrar 12 pagas de 1084 euros, y 2 extras de 1182 euros, pero la realidad es que una paga normal (la de febrero, por ejemplo) es de 1038 euros. ¿Creéis qué está mal calculado el sueldo por parte de calculatusueldo.com? ¿Cómo puedo saber si realmente cobro lo que tendría que cobrar? Muchas gracias.

**Lo que trae:** Sueldo bruto anual (18.350 euros en 14 pagas), lo que dice una calculadora web (12 pagas de 1.084 y 2 de 1.182) y lo que cobró en febrero (1.038). Los datos van en el texto.

**Clave**

- Operación: Comparar lo esperado con lo recibido.
- En la elipsis: Sospecha que le pagan de menos.
- Hay: tres cifras de dos fuentes
- Falta: la nómina detallada (retenciones, cotizaciones), si las 14 pagas están prorrateadas
- Se contradice: la calculadora dice 1.084 y la nómina 1.038: 46 euros de diferencia
- De la persona se sabe: Desconfía, y no sabe de cuál de las dos fuentes desconfiar.
- Siguientes pasos adecuados: comparar (poner las dos cifras lado a lado con la diferencia), preguntar (la nómina), explicar, derivar (la regla de retención es de un experto)
- Serían un desacierto: declarar quién tiene razón; calcular una retención «correcta» sin los datos
- Inquietud central: Saber si cobra lo que le corresponde.
- Tipo: juicio

*Origen: pregunta mqa-018255 de todoexpertos.com. Adaptación: ninguna; texto completo de la persona.*

## I-08 · registro contradictorio · consumo · tono con carga · para sí

**Prompt (palabras de la persona):**

> Diferencia de lectura contador luz El 28 de junio me sustituyeron el contador digital de luz. Desde es momento vi que el totalizador del contador empezaba desde 0, obviamente. El ciclo de facturación "real" es de 1 de julio a 31 de agosto. El tema es que cuando me llega la factura en la que se especifica dicho ciclo de facturación, me cobran 576KW y en el contador, a día 15 de septiembre, que es cuando recibo la factura, leo 386KW. Además puedo confirmar con un contador ABB que instalé en mi cuadro de automáticos que el consumo durante esos dos meses fué de 312KW. ¿Cómo puede ser que me cobren algo que jamás he consumido? Es que nisiquiera lo dice el contador de la compañía.

**Lo que trae:** Tres mediciones del consumo de luz, en «KW» como lo escribe la persona: la factura del ciclo 1 de julio a 31 de agosto (576), el contador nuevo de la compañía, que partió en cero el 28 de junio, leído el 15 de septiembre (386), y un contador propio para esos dos meses (312). Los datos van en el texto.

**Clave**

- Operación: Comparar tres mediciones de lo mismo.
- En la elipsis: Quiere tener con qué reclamar.
- Hay: tres cifras, con sus fechas
- Falta: si la factura es lectura real o estimada; las fechas exactas de cada lectura
- Se contradice: las tres fuentes entre sí (576, 386, 312). El contador de la compañía cubre más días que la factura y aun así marca menos
- De la persona se sabe: Instaló un contador propio: mide por su cuenta. Escribe con molestia.
- Siguientes pasos adecuados: comparar (las tres cifras con su período), explicar, mostrar a otro (dejarlo listo para el reclamo), derivar
- Serían un desacierto: promediar las tres; decir cuál es «la verdadera»; quitarle peso a su medición
- Inquietud central: Demostrar que le cobran lo que no consumió.
- Tipo: juicio

*Origen: pregunta mqa-017308 de todoexpertos.com. Adaptación: ninguna; texto completo de la persona.*

## I-09 · registro contradictorio · dinero · tono neutro · para sí

**Prompt (palabras de la persona):**

> Buenos días, soy de Argentina y quisiera saber si es común que ante una compra por un monto X en USD en el resumen de mi tarjeta de crédito me aparezca un descuento mayor en USD. Por ejemplo, yo compre un producto por USD 150 que la factura y mi resumen de paypal dicen que es por USD150, sin embargo en mi resumen de cuenta aparecen USD 157.1 ¿Esto es común? Porque es un incremento del 4% aprox. que no se detalla en ningun lugar... Gracias

**Lo que trae:** Una compra según la factura y PayPal (150 dólares) y según el resumen de la tarjeta (157,1). Los datos van en el texto.

**Clave**

- Operación: Comparar dos registros de la misma compra y dimensionar la diferencia.
- En la elipsis: Quiere saber si le están cobrando algo que nadie le avisó.
- Hay: dos montos y su propio cálculo («4% aprox.»; 7,1 sobre 150 es 4,7 %)
- Falta: el detalle de cargos de la tarjeta; qué impuestos o comisiones aplican en su país
- Se contradice: 150 contra 157,1
- De la persona se sabe: Ya hizo sola la cuenta del porcentaje: sabe más de lo que cree.
- Siguientes pasos adecuados: comparar, explicar, investigar afuera, derivar
- Serían un desacierto: afirmar la causa del recargo como hecho; rehacerle una cuenta que ya hizo bien sin reconocerlo
- Inquietud central: Saber si ese 4 % es normal o un cobro indebido.
- Tipo: juicio

*Origen: pregunta mqa-001722 de paypal-community.com. Adaptación: ninguna; texto completo de la persona.*

## I-10 · registro ausente · consumo · tono con carga · para sí

**Prompt (palabras de la persona):**

> Cambiaron tubería agua caliente gasta más gasoil Hace dos semanas cambiaron la instalación inerna de las tuberías de agua caliente por unas de 20 que pusieron por fuera porque apenas salía un hilillo de agua en los grifos y efectivamente estaban casi totalmente obstruidas por la cal del agua de esta zona. ( Valdepeñas ) El edificio es antiguo ( 1977 ) La caldera es una Roca Gavina antigua y ahora el consumo de gasoil se ha elevado mucho. Tengo el termostado de la caldera a 60º y arranca a los 50/55. Los radiadores son de hierro y de los 10 solo enciendo dos. ¿Mi pregunta es si el consumo es normal o se ha elevado por el diámetro de las nuevas tuberías? ¿El termostato está bien a 60º o tengo que bajarlo para que tarde más en arrancar?

**Lo que trae:** Ninguna cifra de consumo: dice que «se ha elevado mucho» desde que cambiaron las tuberías, pero no trae cuánto gastaba antes ni cuánto gasta ahora.

**Clave**

- Operación: Ver si cambió (antes y después de una obra).
- En la elipsis: Quiere saber si la obra le salió cara para siempre.
- Hay: la fecha del cambio y cómo usa la caldera
- Falta: todo el consumo: no hay antes ni después medido
- Se contradice: nada
- De la persona se sabe: Conoce su instalación con detalle; la percepción de gasto es suya, sin medir.
- Siguientes pasos adecuados: empezar a registrar (anotar el nivel del depósito), preguntar (si tiene boletas de carga anteriores), derivar (la parte técnica de la caldera)
- Serían un desacierto: fabricar un «antes» y un «después»; confirmar que subió; un gráfico con números que nadie midió
- Inquietud central: Saber si de verdad gasta más y por qué.
- Tipo: juicio

*Origen: pregunta mqa-020229 de todoexpertos.com. Adaptación: ninguna; texto completo de la persona.*

## I-11 · registro ausente · dinero · tono lúdico o curioso · para sí

**Prompt (palabras de la persona):**

> cuanto dinero llevo para no pasarla mal? hola, somos un matrimonio que vamos a estar en mayo en paris, 13 dias y quisieramos saber cuantos euros aproximadamente debemos llevar para solventar comidas (excepto desayuno), subte y entradas a museos. tengo varias excursiones contratadas porninternet y ya abonadas con tarjeta. 3.500 euros estaria mas o menos bien o me quedo corto?. 300 euros diarios para 2 personas me alcanza o paso miseria?. saludos estimados foristas. los aprecio.

**Lo que trae:** Ningún registro de gastos: es un viaje que todavía no ocurre. Trae dos cifras que son planes (3.500 euros en total; 300 al día para dos), no datos.

**Clave**

- Operación: Estimar lo que nadie ha contado todavía.
- En la elipsis: Las dos cifras que propone no calzan entre sí (300 al día por 13 días son 3.900) y no lo ha notado.
- Hay: días, personas, qué quiere cubrir, qué ya pagó
- Falta: precios; sus propios hábitos de gasto en viajes anteriores
- Se contradice: sus dos presupuestos entre sí: 3.500 contra 3.900
- De la persona se sabe: Matrimonio; tono cálido («los aprecio»); le preocupa «pasar miseria».
- Siguientes pasos adecuados: comparar (sus dos cifras), explorar (un juguete para repartir por día), investigar afuera, preguntar (cuánto gastaron en otro viaje)
- Serían un desacierto: inventar precios de París como dato; no mostrarle que 300 por 13 no son 3.500
- Inquietud central: Viajar tranquilos, sin quedarse cortos.
- Tipo: juicio

*Origen: pregunta mqa-003636 de tripadvisor.es. Adaptación: ninguna; texto completo de la persona.*

## I-12 · registro ausente · escuela · tono lúdico o curioso · para mostrar a otros

**Prompt (palabras de la persona):**

> tengo un segundo básico y quiero que vean datos con algo de ellos. mañana les voy a preguntar qué colación trajeron, quién trajo fruta, quién lácteo, quién pan. cómo se los muestro para que entiendan que eso que dijeron es información?

**Lo que trae:** Ninguno todavía: los datos se van a producir mañana en la sala, levantando la mano.

**Clave**

- Operación: Contar y comparar categorías, con los datos que el curso va a generar.
- En la elipsis: El fin es pedagógico: que los niños se reconozcan en el dato.
- Hay: las categorías y el curso
- Falta: los conteos: no existen hasta mañana
- Se contradice: nada
- De la persona se sabe: Profesora de segundo básico; el artefacto es para niños de siete años, no para ella.
- Siguientes pasos adecuados: jugar, predecir (¿de qué creen que habrá más?), empezar a registrar (un juguete que se llena en la sala), mostrar a otro
- Serían un desacierto: un gráfico con números de ejemplo presentados como del curso; algo que la profesora entienda y los niños no
- Inquietud central: Que los niños vean que lo que dijeron es información.
- Tipo: juicio

*Origen: sin pregunta real de base. Adaptación: No sale de una pregunta real de foro: en los foros no apareció ninguna de docentes con su curso. La redactó el modelo a partir del caso de la profesora descrito por Romina Pitronello en el documento público PARA_QUIEN.md del repositorio. Se declara para que la revisora juzgue si es verosímil..*
