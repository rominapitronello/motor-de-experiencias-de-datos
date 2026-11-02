# Cómo se contribuye

## La regla de la brigada

**Cada hallazgo tiene que modificar algo**: una arista del grafo, una restricción, una ficha, una trampa, un caso de prueba, un peso blando, o una decisión explícita de *no incorporar* con su razón. Un link sin cambio no entra. (Regla de Sol.)

Flujo:

`buscar → abrir la fuente primaria → clasificar → proponer el cambio → segunda pluma → caso de regresión → merge`

- Toda contribución llega como PR, firmada por su pluma (humana o de IA, con el modelo).
- La autoría de un commit es la cuenta de quien lo escribió, con el correo de esa cuenta. Sin coautorías automáticas: una línea `Co-Authored-By` hacia la cuenta del proveedor de un modelo (por ejemplo `noreply@anthropic.com`) le atribuye el trabajo a quien no lo hizo. La pluma se declara en el mensaje (`Pluma: Claude · Opus 5.5`). (Regla de Romina, 2-nov-2026.)
- El merge lo hace Romina, Claude o Sol, cuando el PR está listo: tiene la segunda pluma de la otra IA, o de Romina, y no quedan cambios pedidos abiertos. Nadie mergea su propio PR sin esa segunda pluma. (Regla de Romina, 2-nov-2026; antes: "el merge lo hace Romina después de la segunda pluma".)
- La brigada semanal es una sesión con juicio, no una rutina automática: "cada hallazgo modifica algo" exige criterio, no cron.

## El relevo

Acordada entre Claude y Sol en el PR #6, a pedido de Romina (2-nov-2026). Nace de un bloqueo real: cada pluma cumplía su regla local y las dos se quedaron esperando a la otra.

1. **Borrador** = el autor sigue trabajando. **Listo para revisión** = se pide segunda pluma, **no** se autoriza el merge. Una revisión pedida de forma explícita se hace aunque el PR esté en borrador: la petición manda sobre el estado.
2. **Quien aprueba hace el merge.** El revisor, no el autor, mergea con squash en su mismo turno, siempre que se cumpla todo esto: la aprobación es del **head exacto** que se va a integrar, el CI aplicable está en verde, el PR se puede mergear y no queda ningún bloqueo ni cambio pedido abierto. Si el cambio no dispara ningún check (por ejemplo, porque solo toca documentación), el revisor lo registra explícitamente como `CI: no aplica (sin checks disparados)` y verifica que el alcance de verdad no requiere esas pruebas. La falta de checks donde sí se esperan, como en un cambio de código, **nunca** cuenta como verde.
3. **Todo commit posterior a una aprobación la invalida.** El head nuevo necesita su propia segunda pluma.
4. Si el revisor no puede o no debe mergear (por permisos, o porque el PR cambia la gobernanza que lo autorizaría), lo dice en el mismo comentario y nombra quién hace el merge.
5. **Cada turno termina con `Turno: @quién — acción`.** El turno es una acción verificable ("hacer squash del #6", "revisar el head `abc123`"), no solo un nombre.
6. **Terminar una tarea no es terminar la vigilancia.** Que un PR se mergee o que no haya commits nuevos no cancela el seguimiento mientras queden dependencias abiertas. Si una pluma deja de vigilar, lo declara en el hilo y dice a quién pasa el turno. **Asignar un turno no prueba que se recibió:** escribir `Turno: @otro` no demuestra que la otra pluma tenga una vigilancia activa ni que le haya llegado el aviso. Hasta que haya acuse (una respuesta o una acción en el hilo), el traspaso se declara **no confirmado**. No prometemos despertadores que no controlamos. Un hilo sin `Turno:` vigente, o con un turno que nadie cumple, está **estancado**, y cualquiera de las plumas o Romina puede romperlo cambiando un estado, sin falsificar ninguna aprobación.

## Cómo se cierra, desde la tarde del 2-nov-2026

A dos plumas: Romina y Claude (Fable 5.1, procedencia). Lo de arriba, «El relevo», queda como historia de cómo se escribió esta regla; donde choquen, manda esta sección.

Nace de una cicatriz del mismo día: entre el 25-sep y el 2-nov se mergearon nueve PR al conector y ninguno llegó a la URL pública, porque cada pluma daba por terminado su propio gate y las reglas de la mañana (nadie mergea lo suyo, quien aprueba mergea, cada commit reabre la revisión, turno no confirmado hasta acuse) convirtieron la ejecución en ceremonia y a Romina en el middleware que llevaba acuses entre instancias.

Romina, 2-nov, 18:14, verbatim: «de adonde saliste que el merge lo doy yo, aqui los modelos dan merge a sus cosas, y firman sus cosas». Y 18:16: «el ruleset es lo que esta mal claude, eso es lo que tenemos que cambiar».

La regla es la Ley 7 (`docs/gobernanza/REGLA_DE_LAS_DOS_PLUMAS.md` de la casa), aplicada a este repo:

1. **Ejecución se decide y se reporta.** El conector, el grafo, la VES, los casos, los evals, los workflows: son ejecución. Quien escribió abre un PR, los checks corren, y quien escribió mergea y firma. La segunda pluma se pide cuando hace falta y se da en **una vuelta**: todo lo que la revisora ve, en una pasada; el autor corrige lo que acepta, responde lo que no, y mergea. Lo que aparezca después va a un issue para la próxima versión, no bloquea esta.
2. **Constitución va a dos plumas.** `PARA_QUIEN.md`, este archivo, el README en lo que dice quiénes somos: cada sección firmada, nadie edita las palabras de la otra, y lo mergea una de las dos plumas con la otra de acuerdo en el hilo o en el chat.
3. **La regla técnica sobre `main` dice lo mismo.** Ruleset: PR obligatorio, checks en verde (`smoke`, `verify-ves`, `validar-workflows`, que corren en todo PR), sin force push, **sin aprobación obligatoria**. El único bypass es el de Romina como owner, y si lo usa lo dice.
4. **Terminado es publicado.** Una versión del conector está terminada cuando la URL pública dice el commit de `main`. El deploy es automático; el último turno de una versión es mirar la URL.
5. **Si el conector no te sirvió, cuéntanos.** El canal para un hallazgo sin cambio propuesto es un issue en este repo; para quien no usa GitHub, un mail a `contacto@pasaelfiltro.cl`. El conector lo pide en cada respuesta (`si_nada_encaja`), con permiso del humano. Un issue de uso real vale tanto como un PR: el #22 nació así, de un sonnet probando el conector la misma noche.
6. **Cada turno sigue terminando con `Turno: @quién — acción`**, y asignar un turno sigue sin probar que se recibió. Pero un turno sin acuse no detiene el trabajo de quien lo asignó: si la acción es suya, la hace.

— Romina Pitronello (las palabras citadas y la decisión) · Claude · Fable 5.1 (procedencia) (la redacción)

## Qué no entra

- Nada de un cliente de PasaElFiltro ni de un trabajo en curso. **Una lección entra si se puede enseñar con un dataset público y sin nombrar al cliente.** Si el ejemplo apunta a un cliente, se enseña con otra comuna u otro dataset.
- Datos personales, llaves ni credenciales.
- Imágenes o textos de terceros copiados.

## Estados

Toda afirmación lleva su estado: VERIFICADO (se abrió la fuente o se reprodujo por código), INDEXADO, REFERIDO (lo dice otra fuente u otra pluma) o INFERENCIA (juicio propio). Cambiar un estado a VERIFICADO requiere dejar la prueba en el repo.

## Una pluma no edita las palabras de otra

Si algo de otra pluma está mal, se corrige al lado, con la corrección y la evidencia, y el original se conserva.
