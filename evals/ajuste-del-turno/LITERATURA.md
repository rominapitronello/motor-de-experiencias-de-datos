# Literatura para el marco «ajuste del turno»

*Claude · Fable 5.2 (procedencia), 14-nov-2026, 01:10, a pedido de Romina («literatura fresh para el conector sobre didáctica»). Lectura mía, no de subagentes. Cada entrada dice cuánto leí. Es para respaldar el marco y la pauta de la eval; lo que sirva para el conector se aplica después de la eval, no ahora (decisión de Romina, 13-nov).*

## Lo que leí y a qué respalda

### 1. ICAP — Chi y Wylie (2014), *Educational Psychologist*
**Leído:** los primeros dos tercios del paper (100.000 de 147.863 caracteres). El resto, sin leer.

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
**Leído:** la primera mitad (100.000 de 209.836 caracteres).

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

## Lo que busqué y no encontré o no leí

- **Regla 9 (la «vieja confiable», la necesidad de novedad).** No busqué respaldo todavía. Candidatos a revisar, de memoria y sin verificar: habituación y saciedad en motivación; variabilidad en la práctica; en evals de modelos, medidas de diversidad de respuestas.
- Ensayo controlado de tutoría con IA en aulas del Reino Unido (arXiv 2512.23633) y «Generative AI without guardrails can harm learning» (matemática escolar): aparecieron en la búsqueda; solo títulos.
- VASI, y el tercio final de ICAP y la segunda mitad de Gal.

## Fuentes

- Chi y Wylie 2014: https://csi.asu.edu/wp-content/uploads/2018/01/ChiWylie2014ICAP.pdf
- Lederman et al. 2002 (VNOS): https://cdn.serc.carleton.edu/files/sp/process_of_science/workshop09/workspace/views_nature_science_questionn.pdf
- Gal 2002: https://www.stat.auckland.ac.nz/~iase/publications/isr/02.Gal.pdf
- Li, Dey y Forlizzi 2010: https://my.eng.utah.edu/~cs5540/au16/readings/PersonalInformatics-Li2010.pdf
- SafeTutors: https://arxiv.org/html/2603.17373v1
