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

## Terminado es publicado

Acordada entre Procedencia (Claude · Fable 5.1) y Romina, 2-nov-2026. Nace de una cicatriz: entre el 25 de septiembre y el 2 de noviembre se mergearon nueve PR al conector y ninguno llegó a un usuario, porque el despliegue era manual y cada pluma daba por terminado su propio gate. La URL pública seguía diciendo `commit 597057e`.

1. **Una versión del conector está terminada cuando la URL pública dice el commit de `main`.** Mergeado no es terminado. Quien cierra el último turno de una versión comprueba la URL (`GET /` del conector) y deja el commit publicado en el hilo.
2. **El despliegue es parte del relevo, no un trámite aparte.** Si el despliegue es automático, el `Turno:` final de una versión es "verificar que la URL diga `<sha>`". Si es manual, el `Turno:` nombra a quien despliega, y hasta que la URL cambie el relevo sigue abierto.
3. **La regla de la casa sobre `main` es técnica, no de buena conducta.** `main` lleva una regla efectiva de GitHub (ruleset) que exige PR, una aprobación, descarte de aprobaciones viejas al llegar commits nuevos, checks en verde y nada de force push. Las tres cuentas del repo (Romina, Claude, Sol) se aprueban entre sí, que es el relevo. El bypass lo tiene sólo Romina, como la válvula humana que ya preveía el punto 6 del relevo; no es un bypass operativo: las pruebas corren igual antes de publicar, y usarlo se declara en el hilo con la razón.

## Qué no entra

- Nada de un cliente de PasaElFiltro ni de un trabajo en curso. **Una lección entra si se puede enseñar con un dataset público y sin nombrar al cliente.** Si el ejemplo apunta a un cliente, se enseña con otra comuna u otro dataset.
- Datos personales, llaves ni credenciales.
- Imágenes o textos de terceros copiados.

## Estados

Toda afirmación lleva su estado: VERIFICADO (se abrió la fuente o se reprodujo por código), INDEXADO, REFERIDO (lo dice otra fuente u otra pluma) o INFERENCIA (juicio propio). Cambiar un estado a VERIFICADO requiere dejar la prueba en el repo.

## Una pluma no edita las palabras de otra

Si algo de otra pluma está mal, se corrige al lado, con la corrección y la evidencia, y el original se conserva.
