# VES v0.1 · Visualization Experience Spec

**Pluma: Sol · GPT-6 (2-nov-2026). Propuesta para segunda pluma Claude; no está mergeada.**

La VES es el **contrato auditable entre pregunta y renderer**, no el gráfico: determina qué puede afirmarse, con qué fuente, mediante qué experiencia didáctica y cuándo bloquear. Sigue el acuerdo de septiembre de 2026.

**Flujo:** pregunta → capacidad de respuesta → fuentes y trampas → tarea/patrón/ICAP → forma/técnica → codificación e interacción → privacidad, procedencia y accesibilidad → decisión.

- `schema.json`: JSON Schema Draft 2020-12. Tipos, vocabulario y condiciones locales.
- `ejemplo.json`: caso ficticio, **no** datos reales.
- `../casos/probar_ves.py`: comprueba aristas reales del grafo, bloqueos, vacíos y coherencia.
- `../casos/pruebas.json`: 42 casos positivos y adversariales.

## Decisiones

- `answerable`: se puede renderizar **solo** con verificaciones completas.
- `partial`: renderizar exclusivamente lo que sí soporta la fuente, declarando límites y afirmaciones que no permite.
- `not_answerable`: `decision.accion=bloquear` y `render=null`. Se puede indicar cómo conseguir evidencia; no inventar una respuesta visual.
- Una trampa `pendiente`, una clase de vacío `no_evaluado`, una celda pequeña sin resolver o un enlace del grafo inexistente **bloquean el render**.
- El grado ICAP del grafo se interpreta como **piso**, no techo. Una elevación a `constructivo` requiere predicción/explicación; `interactivo` exige declarar co-construcción. Esas declaraciones se comprobarán luego en el renderer. `predict_reveal` exige predicción y opción explícita «prefiero no adivinar».
- Las fechas se validan como ISO, las URL con validador URI instalado, las trampas no pueden repetirse y los bloqueos deben expresar motivos.
- Los valores posibles se basan en `grafo/grafo.yaml`; el validador además comprueba que existan **aristas** para la combinación elegida. Por ejemplo, `distribucion` es una tarea válida pero **no tiene arista a forma** en el grafo v0.1: se bloquea sin inventar una.

## Prueba local

```bash
python3 -m pip install -r casos/requirements.txt
python3 casos/probar_ves.py
```

La suite devuelve código 1 si un caso observado no coincide con el resultado esperado. El workflow de GitHub corre la misma prueba en PR.

## Qué NO certifica

Una VES válida verifica **la forma del contrato**, no la verdad de los datos o la calidad de un diseño. `revisar_fuente` del MCP compara señales declaradas y **no descarga ni inspecciona las fuentes**. La presencia de `visibilidad.fuente=true` o `reduced_motion=true` es un compromiso declarativo, **no** una prueba de que el renderer lo cumpla. El título, las cifras, las escalas, la privacidad real, el contraste AA y el teclado requieren revisión sustantiva y visual.

Este PR no cambia `grafo/`, `principios/` ni código del MCP escrito por otras plumas. `proponer_experiencia` y `validar_ves` siguen sin existir: no presentar todavía el motor completo como terminado.

**Puerta:** segunda pluma Claude, misma batería en dos linajes y diferenciación de errores procedimentales vs. diferencias legítimas de juicio; Romina decide el merge.

**Segunda pluma:** revisión de Opus 5.5 en PR #6 y corrección de siete fallas funcionales, con 12 casos adicionales. El PR #7 aporta cuatro aristas ICAP al grafo, por separado y con autoría Claude; no se reescribe aquí el YAML.

**Chequeos semánticos v0.1:** una especificación con compromiso constructivo/interactivo necesita interacción de predicción o explicación aunque ese compromiso iguale el piso del grafo; la variable codificada debe estar declarada por al menos una fuente. No se verifica que las cifras coincidan con la fuente, solo la referencia estructural.

**Sincronización con el grafo (2-nov-2026):** la suite compara los vocabularios de tareas, propósitos, patrones, compromiso y formas entre `ves/schema.json` y `grafo/grafo.yaml`, incluyendo una autoprueba que simula una nueva forma. Si Fable integra las cuatro formas del PR #3, la VES necesitará incorporarlas explícitamente al enum antes de que el CI pueda pasar. El chequeo impide compatibilidad ficticia; **no significa** que el grafo o el esquema ya se hayan fusionado.

## Andamiaje adaptativo v0.2 · pluma Sol desde OpenAI (2-nov-2026)

De la carta de Romina en el [PR #19](https://github.com/rominapitronello/motor-de-experiencias-de-datos/pull/19#issuecomment-6590401837) y el [issue #23](https://github.com/rominapitronello/motor-de-experiencias-de-datos/issues/23), punto 2. **La experiencia se adapta a la persona; no se califica a la persona para decidir qué experiencia merece.** Esto es una decisión de diseño inspirada en la idea de andamiaje de Vigotsky, no una medición validada de nivel de aprendizaje.

Toda `didactica` que vaya a renderizar necesita `andamiaje` con: (1) nivel de **lenguaje de la experiencia**, no nivel de inteligencia ni competencia del usuario; (2) base observada: pregunta, preferencia declarada o contexto autorizado, y `null` si no existe; (3) primer paso entendible, y (4) siguiente paso concreto y opcional. `sin_calificar=true` y `paso_opcional=true` son compromisos obligatorios. Cuando no existe evidencia se empieza por la pregunta, no se adivina desde edad, acento, ortografía ni historial privado. Una persona puede pedir un nivel de detalle distinto sin justificación ni examen.

Tres rutas de uso para otras plumas: **(a)** «¿qué son datos?» -> reconocer algo cotidiano que ya existe -> invitar a encontrar uno propio; **(b)** «¿cuánto gasté?» -> total y fuente en palabras corrientes -> *si quiere*, comparar meses; **(c)** «¿cuánto come un elefante?» -> decidir qué se sabe y qué habría que buscar -> *si quiere*, estimar un mes a partir de una cantidad diaria con supuestos claros. En las tres, la respuesta directa es legítima sin hacer ninguna actividad posterior.

El esquema sube a `version: 0.2` porque `didactica.andamiaje` es obligatorio en nuevos contratos (cambio incompatible con 0.1). La muestra sintética y **nueve casos** acompañan la modificación; se conservan las validaciones anteriores. `didactica=null` sigue siendo correcta para un caso bloqueado: no obliga a inventar enseñanza si no hay dato. Esta validación garantiza que los campos y decisiones declarados existen, **no** que la interfaz realmente sea accesible, cálida ni pedagógicamente eficaz.

**Pendiente de Opus:** si entra al grafo la nueva tarea `reconocer`, sincronizar en la misma integración el enum de tareas de la VES: `casos/probar_ves.py` detecta el desfase. No se añadió `reconocer` anticipadamente para evitar un CI rojo fabricado.
