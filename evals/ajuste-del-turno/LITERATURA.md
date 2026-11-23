# Literatura para el marco «ajuste del turno»

*Claude · Fable 5.2 (procedencia), 14-nov-2026, 01:10, a pedido de Romina («literatura fresh para el conector sobre didáctica»). Lectura mía, no de subagentes. Cada entrada dice cuánto leí. Es para respaldar el marco y la pauta de la eval; lo que sirva para el conector se aplica después de la eval, no ahora (decisión de Romina, 13-nov).*

## Lo que leí y a qué respalda

### 1. ICAP — Chi y Wylie (2014), *Educational Psychologist*
**Leído:** completo, en dos pasadas (13 y 14-nov).

Clasifica el compromiso cognitivo de quien aprende por su conducta observable, en cuatro modos, cada uno con su proceso de cambio de conocimiento: pasivo (recibe; almacena aislado), activo (manipula, subraya, copia; integra), constructivo (genera algo que va más allá de lo dado: explica con sus palabras, pregunta, compara casos; infiere), interactivo (diálogo donde los dos aportan constructivamente y se turnan seguido; co-infiere). Hipótesis: el aprendizaje sube de pasivo a interactivo.

Tres cosas que importan para esta eval:
- **Para que un diálogo sea interactivo** las dos partes tienen que ser constructivas, con turnos frecuentes y sin que una domine mientras la otra asiente. El compañero puede ser un agente computacional. **En sistemas computacionales la clasificación depende de las respuestas de quien aprende, no de lo interactivo que sea el sistema.**
- La conducta observable es un indicador imperfecto y probabilístico, y los autores lo dicen.
- Lo que el diseño pretende y lo que la persona hace pueden diferir: hay que mirar el producto o la transcripción.

**Respalda:** la pauta del turno siguiente (mirar lo que la persona hace después, por conducta), la regla 6 (que la persona corrija o pida otro ángulo es acierto: es conducta constructiva) y el resguardo de «tipo de turno, no cantidad» (un turno que solo asiente es pasivo aunque haya muchos). Dice además por qué el artefacto solo no basta: un artefacto muy interactivo ante el que la persona solo mira es, para ICAP, pasivo.

### 2. Naturaleza de la ciencia — VNOS, Lederman, Abd-El-Khalick, Bell y Schwartz (2002), *Journal of Research in Science Teaching*
**Leído:** el paper desde una copia pública; las figuras con los ítems textuales no venían.

Cuestionario abierto más entrevista, sin puntaje numérico: perfiles de ingenuo a informado por aspecto. Aspectos: base empírica; observación contra inferencia; teorías y leyes; carácter tentativo (confiable pero nunca seguro del todo); creatividad; carga teórica (lo que uno ya cree da forma a lo que observa e interpreta); inserción social y cultural; el mito de un único método científico. Evidencia de validez: panel de cinco expertos para contenido; expertos contra novatos para constructo (cerca de 89 % contra 33 % con visiones informadas); congruencia entre cuestionario y entrevista; unos 2.000 respondientes. Los autores tratan la validez como un proceso continuo.

**Respalda:** el propósito del constructo («no sabes si tu conclusión es la correcta ni si es la única») y las reglas 4 (conclusión abierta: tentativo, empírico), 5 y 8 (otra lectura: carga teórica, más de una interpretación) y la propiedad B (separar lo que viene de la fuente de lo que es lectura: observación contra inferencia). Y da un modelo de instrumento: abierto, sin puntaje total, con perfiles por aspecto y validación con panel chico y contraste experto/novato, que es de la escala de lo que esta casa puede hacer.

**No verificado:** VASI (Lederman y otros, 2014, sobre indagación científica). Solo consta que existe.

### 3. Alfabetización estadística de adultos — Gal (2002), *International Statistical Review*
**Leído:** hasta el carácter 200.000 de 209.836, en dos pasadas; la segunda mitad son comentarios y réplica.

Define la alfabetización estadística como la capacidad de interpretar y evaluar críticamente información estadística encontrada en contextos cotidianos, y de discutir o comunicar la propia reacción a ella. Cinco bases de conocimiento (lectura, estadística, matemática, contexto, habilidades críticas) y dos disposiciones: **postura crítica** (cuestionar sin que nadie lo pida, aun sintiéndose insegura) y **creencias y actitudes** (confianza en poder entender, creer que cuestionar es legítimo). Trae diez «preguntas de preocupación» para un lector crítico: de dónde salen los datos, la muestra, la medición, si el resumen calza con los datos, si el gráfico distorsiona, si falta información clave, si hay explicaciones alternativas.

**Respalda:** es el respaldo más directo de la población del conector (adultos sin formación, datos de la vida diaria) y de la frase de `PARA_QUIEN`: la disposición de Gal «creer que cuestionar es legítimo» es lo contrario de «los gráficos le pasan a la gente importante». La pauta del turno siguiente (cuestiona al modelo, pregunta de dónde sale) es la postura crítica de Gal hecha conducta. Las diez preguntas son un banco de dónde tomar indicadores para B y para la regla 4.

### 4. Informática personal — Li, Dey y Forlizzi (2010), CHI
**Leído:** completo.

Modelo de cinco etapas de cómo la gente usa datos sobre sí misma: preparación, recolección, integración, reflexión, acción. Encuesta a 68 personas y 11 entrevistas (gente ya habituada; los autores lo declaran como límite). Las barreras se arrastran de una etapa a la siguiente. En reflexión: falta de tiempo, dificultad con las visualizaciones, **autocrítica al ver las propias entradas**, dificultad para interpretar, falta de contexto, datos escasos. En acción: los sistemas no dicen qué hacer después. Cada etapa puede llevarla la persona o el sistema; lo automático alivia la carga pero quita control y puede analizar mal.

**Respalda:** el universo de prompts (registro presente, incompleto, ausente son las barreras de recolección e integración), el paso «empezar a registrar» y la regla 3: si la autocrítica es una barrera documentada para reflexionar sobre los propios datos, un artefacto que moraliza la empeora. También da nombre a lo que Romina vio en los foros: la gente se queda antes de la etapa de reflexión porque nunca integró sus datos.

### 5. SafeTutors — Hazra y otros (arXiv 2603.17373, 2026)
**Leído:** el 80 % (100.000 de 124.485 caracteres). Es un preprint; fecha exacta no vista.

Benchmark de «seguridad pedagógica» de tutores de IA en matemática, física y química: 11 categorías de daño y 48 subriesgos anclados en teoría del aprendizaje; 3.135 conversaciones de un turno y 2.820 de varios. Validación humana en tres etapas (kappa de Fleiss de .82 a .69); jueces: tres modelos por mayoría, con una muestra revisada por dos doctorandos (kappa de Cohen .76). Hallazgos: ningún modelo es confiable; el daño pedagógico promedio sube de 17,7 % en un turno a 77,8 % en varios; los modelos casi nunca desafían a quien aprende. Argumentan que el riesgo principal es «la erosión silenciosa del aprendizaje» y que los resultados de un turno esconden las fallas.

**Importa por dos razones.** Es el trabajo más cercano a lo que Romina está armando, y difiere en lo esencial: ellos construyen una taxonomía de daños y la juzgan con modelos sobre conversaciones sintéticas; esta casa parte del constructo, usa los datos de la propia persona, corrige con humanos de inclinación opuesta y mira el turno real de la persona. Y es una advertencia para el marco: **su resultado dice que evaluar un solo turno subestima mucho las fallas.** El marco decidió «un turno» como punto de partida; hay que declararlo como limitación con esta cita, y la pauta del turno siguiente es lo que lo compensa en parte.

### 6. Homogeneidad de los modelos — Jiang y otros (2025), «Artificial Hivemind», arXiv 2510.22954
**Leído:** solo el resumen. (Figura como póster y oral en NeurIPS 2025 en la búsqueda; no lo verifiqué en el paper.)

Con unas 26.000 consultas abiertas reales (Infinity-Chat) y 31.250 anotaciones humanas, describen dos fenómenos: **repetición intra-modelo** (un mismo modelo da respuestas parecidas una y otra vez a preguntas abiertas) y **homogeneidad entre modelos** (modelos distintos dan respuestas muy parecidas), la segunda más marcada. Encuentran que los jueces automáticos se alinean peor con las personas justo donde las preferencias individuales difieren. Lo plantean como riesgo de largo plazo: la exposición repetida a respuestas parecidas puede estrechar el pensamiento de la gente.

**Respalda:** la regla 9 de Romina («la vieja confiable»). Lo que ella notó mirando dos artefactos tiene nombre y medición en evals de modelos: repetición intra-modelo. Y respalda dos decisiones del marco: medir la variedad sobre el conjunto y no en un par, y no usar modelos como criterio donde lo que importa es el ajuste a una persona en particular. El resumen no dice con qué métrica miden la diversidad; hay que leer el paper antes de elegir la nuestra.

### 7. Indagación científica — VASI (Lederman y otros, 2014), vía Gaigher, Lederman y Lederman
**Leído:** un estudio que aplica el VASI a 105 estudiantes sudafricanos de 11.º, no el paper original.

Ocho aspectos (del NRC, 2000): las investigaciones parten de una pregunta y no siempre prueban una hipótesis; no hay un único conjunto de pasos; el procedimiento lo guía la pregunta; con el mismo procedimiento no siempre se obtiene el mismo resultado; el procedimiento influye en el resultado; **las conclusiones tienen que ser consistentes con los datos; los datos no son lo mismo que la evidencia; las explicaciones combinan los datos con lo que ya se sabía.** Preguntas abiertas y contextualizadas; cada respuesta se clasifica como informada, mixta o ingenua por aspecto; la rúbrica se afinó durante la codificación y seis codificadores llegaron a 80 % de acuerdo tras cuatro sesiones. Ese estudio no reporta coeficientes de confiabilidad.

**Respalda:** los últimos tres aspectos son casi literalmente B y las reglas 4 y 8. Y el procedimiento (rúbrica que se afina al codificar, sesiones hasta 80 % de acuerdo) es el mismo de la marcha blanca de Simce: sirve de precedente para la calibración de correctores con una pauta de tres niveles.

### Lo que agregó terminar ICAP y Gal
- **ICAP, tercio final (leído).** La clasificación de una actividad solo se puede hacer bien después de mirar el producto de quien aprende; ICAP sirve de base para una rúbrica de esos productos. Los procesos de cambio de conocimiento son hipotéticos, no verificados. No dice nada de novedad, variedad, motivación ni afecto: no respalda la regla 9.
- **Gal, segunda mitad (leído hasta el carácter 200.000 de 209.836).** Son los comentarios de otros autores y la respuesta de Gal. Para la eval: Rumsey propone evaluar por etapas, de la exposición y las actitudes al cambio de conducta de corto y largo plazo, y pide «preguntas antes que datos» y contexto relevante en cada ejemplo; Weldon propone definir la alfabetización construyendo la evaluación de lo que la gente necesita. Ahlgren critica que falta la tendencia a leer un promedio como típico de cada miembro del grupo, que es un cuidado que el grafo ya trae.

## Lo que busqué y no encontré o no leí

- **Regla 9, el lado humano (por qué la repetición gasta).** El ejemplo del chocolate de Romina existe en la literatura como saciedad sensorial específica y adaptación hedónica; la búsqueda devolvió títulos (un artículo de revisión «Sensory-specific satiety»; un estudio de Sussex sobre exposición repetida a snacks nuevos) que no leí. No encontré, en esta pasada, un respaldo en didáctica (variedad de representaciones, novedad y curiosidad). Queda abierto.
- La métrica de diversidad de «Artificial Hivemind»: en el paper, no en el resumen.
- Ensayo controlado de tutoría con IA en aulas del Reino Unido (arXiv 2512.23633) y «Generative AI without guardrails can harm learning»: solo títulos.
- El paper original del VASI.

## Fuentes

- Chi y Wylie 2014: https://csi.asu.edu/wp-content/uploads/2018/01/ChiWylie2014ICAP.pdf
- Lederman et al. 2002 (VNOS): https://cdn.serc.carleton.edu/files/sp/process_of_science/workshop09/workspace/views_nature_science_questionn.pdf
- Gal 2002: https://www.stat.auckland.ac.nz/~iase/publications/isr/02.Gal.pdf
- Li, Dey y Forlizzi 2010: https://my.eng.utah.edu/~cs5540/au16/readings/PersonalInformatics-Li2010.pdf
- SafeTutors: https://arxiv.org/html/2603.17373v1
- Artificial Hivemind: https://arxiv.org/abs/2510.22954
- VASI aplicado (Gaigher, Lederman y Lederman): https://core.ac.uk/download/80907658.pdf
