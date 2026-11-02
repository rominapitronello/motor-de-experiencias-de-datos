# Política de privacidad · conector experiencias-datos

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
