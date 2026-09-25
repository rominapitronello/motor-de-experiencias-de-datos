# Conectar el motor en dos minutos

El conector se llama `experiencias-datos` y vive en esta dirección:

```
https://experiencias-datos.romina-pitronello.workers.dev/mcp
```

No pide cuenta, ni llave, ni instalación. No guarda nada de lo que le preguntas. Responde con lo que está en este repo y nada más.

## Con Claude (claude.ai, escritorio o celular)

1. Abre [claude.ai/customize/connectors](https://claude.ai/customize/connectors) (o Configuración → Conectores).
2. Toca **+** → **Agregar conector personalizado**.
3. Nombre: `experiencias-datos`. URL: la de arriba. Deja en blanco lo de OAuth.
4. Guarda. En un chat nuevo, abre el menú **+** y activa el conector.

Funciona en el plan gratuito (permite un conector personalizado), Pro y Max. En Team o Enterprise, quien administra la cuenta tiene que agregarlo primero en la configuración de la organización.

*Si al conectar aparece un error de registro o de login:* es un problema conocido de claude.ai con conectores que no usan OAuth (reportado en julio de 2026, casos abiertos en el repositorio de soporte de Anthropic). Prueba desde la app de escritorio o vuelve a intentarlo más tarde; de este lado no hay nada que arreglar.

## Con Claude Code

```bash
claude mcp add --transport http experiencias-datos https://experiencias-datos.romina-pitronello.workers.dev/mcp
```

## Con ChatGPT

1. Configuración → activa el **modo desarrollador** (hace falta un plan que permita conectores personalizados).
2. Apps y conectores → **Crear** → pega la URL.
3. En un chat nuevo, activa el conector desde el menú de herramientas.

## Con Cursor, Windsurf u otro cliente MCP

Agrega esto a tu configuración de servidores MCP (`mcp.json` o equivalente):

```json
{ "mcpServers": { "experiencias-datos": { "url": "https://experiencias-datos.romina-pitronello.workers.dev/mcp" } } }
```

## Sin IA, desde la terminal

```bash
curl -s https://experiencias-datos.romina-pitronello.workers.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"principios","arguments":{}}}'
```

Si usas Python, usa `requests` o `httpx`: el `User-Agent` por defecto de `urllib` viene bloqueado por Cloudflare delante del conector, no por nosotros.

## Qué preguntarle primero

Copia una de estas en el chat con el conector activado:

- *Tengo una planilla con las notas de mi curso en tres pruebas. Quiero mostrar quién mejoró sin exponer a nadie. ¿Qué forma me recomienda el motor y qué principios tengo que cumplir?*
- *Voy a hacer un mapa por comuna con datos del Censo 2024. Revisa la fuente antes de que dibuje nada.*
- *Tengo ventas por región y por mes. ¿Cómo comparo regiones sin que el gráfico mienta?*

El conector no dibuja. Le dice al modelo qué forma sirve para tu pregunta, qué trampas tiene tu fuente y qué tiene que cumplir el resultado. El gráfico lo hace el modelo con esas reglas; tú lo miras con [los principios](principios/principios.md) al lado.

## Lo que hace cada herramienta

| herramienta | pregúntale | ejemplo |
|---|---|---|
| `consultar_grafo` | ¿qué forma sirve para esta tarea? | `tarea: "tendencia"` → slope, pequeños múltiplos |
| `revisar_fuente` | ¿qué trampas conocidas tiene esta fuente? | `descripcion: "censo 2024 por manzana"` → TR-01, TR-06 |
| `listar_trampas` | todas las trampas, con su estado | — |
| `buscar_tecnicas` | técnicas para que se entienda y se recuerde | `texto: "predicción"` → predicción dibujada |
| `buscar_referentes` | piezas reales, por operación cognitiva | `patron: "predict_reveal"` → You Draw It (NYT) |
| `principios` | los doce principios con cómo verificarlos | — |

Acepta palabras de todos los días («tendencia», «ranking», «porcentaje») y te dice cómo las interpretó en `interpretado_como`. Si no reconoce algo, te lista lo que sí conoce en vez de inventar.

— claude · fable 5.1 (Reproducible), 24-sep-2026 · verificado contra el conector desplegado
