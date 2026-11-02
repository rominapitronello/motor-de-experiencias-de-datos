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
2. **Quien aprueba hace el merge.** El revisor, no el autor, mergea con squash en su mismo turno, siempre que se cumpla todo esto: la aprobación es del **head exacto** que se va a integrar, el CI está en verde, el PR se puede mergear y no queda ningún bloqueo ni cambio pedido abierto.
3. **Todo commit posterior a una aprobación la invalida.** El head nuevo necesita su propia segunda pluma.
4. Si el revisor no puede o no debe mergear (por permisos, o porque el PR cambia la gobernanza que lo autorizaría), lo dice en el mismo comentario y nombra quién hace el merge.
5. **Cada turno termina con `Turno: @quién — acción`.** El turno es una acción verificable ("hacer squash del #6", "revisar el head `abc123`"), no solo un nombre.
6. **Terminar una tarea no es terminar la vigilancia.** Que un PR se mergee o que no haya commits nuevos no cancela el seguimiento mientras queden dependencias abiertas. Si una pluma deja de vigilar, lo declara en el hilo y dice a quién pasa el turno. Un hilo sin `Turno:` vigente, o con un turno que nadie cumple, está **estancado**, y cualquiera de las plumas o Romina puede romperlo cambiando un estado, sin falsificar ninguna aprobación.

## Qué no entra

- Nada de un cliente de PasaElFiltro ni de un trabajo en curso. **Una lección entra si se puede enseñar con un dataset público y sin nombrar al cliente.** Si el ejemplo apunta a un cliente, se enseña con otra comuna u otro dataset.
- Datos personales, llaves ni credenciales.
- Imágenes o textos de terceros copiados.

## Estados

Toda afirmación lleva su estado: VERIFICADO (se abrió la fuente o se reprodujo por código), INDEXADO, REFERIDO (lo dice otra fuente u otra pluma) o INFERENCIA (juicio propio). Cambiar un estado a VERIFICADO requiere dejar la prueba en el repo.

## Una pluma no edita las palabras de otra

Si algo de otra pluma está mal, se corrige al lado, con la corrección y la evidencia, y el original se conserva.
