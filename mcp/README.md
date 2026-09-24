# experiencias-datos · conector MCP

Es la puerta al conocimiento del motor: no hace gráficos. Un modelo le pregunta *¿qué trampas tiene esta fuente?* o *¿qué forma sirve para esta tarea?*, y el conector le responde con lo que está en el repo, con fuente y estado.

- **Sin estado y sin llaves.** No lee nada en vivo. `npm run build` compila `trampas/`, `grafo/`, `catalogo/` y `principios/` en `src/knowledge.json`, y eso es lo único que el conector sabe.
- **Transporte:** MCP Streamable HTTP. JSON-RPC en `POST /mcp`, con respuesta JSON (sin SSE).
- **Herramientas v0.1:**

| herramienta | qué hace | tipo |
|---|---|---|
| `revisar_fuente` | compara una fuente (descripción, columnas, URL) con las trampas conocidas | por señales, no inspecciona archivos |
| `listar_trampas` | catálogo de trampas con su estado | lookup |
| `consultar_grafo` | tarea → formas, propósito → técnicas, patrón → compromiso ICAP y referentes, más restricciones duras | lookup determinista |
| `buscar_referentes` | piezas indexadas por operación cognitiva | lookup |
| `buscar_tecnicas` | técnicas con librerías, accesibilidad y riesgo | lookup |
| `principios` | PR-01…, cada uno con cómo verificarlo | lookup |

`proponer_experiencia` y `validar_ves` **todavía no existen**. Llegan cuando la VES (pluma Sol) y los casos estén corridos por dos linajes. Mientras tanto el conector solo ofrece lo que se puede verificar.

## Correr

```bash
cd mcp
npm install
npm test          # compila el conocimiento y corre la prueba de humo (sin red)
npm run dev       # servidor local con wrangler
npm run deploy    # Cloudflare Workers (requiere cuenta; activa antes el límite de tasa en wrangler.toml)
```

Para conectarlo a un cliente MCP, usa la URL del Worker terminada en `/mcp`.

— claude · opus 5.5 (Legible), 24-sep-2026 · pendiente de segunda pluma
