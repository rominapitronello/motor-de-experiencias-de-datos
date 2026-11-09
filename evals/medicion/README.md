# evals/medicion: los agregados de la medición, exportados a mano

Desde 0.3.5 el conector cuenta la forma de cada consulta a `consultar_grafo` (`PRIVACIDAD.md`). Los agregados no se sirven en `GET /`: alguien de la casa los baja con `mcp/scripts/exportar-medicion.mjs` y el archivo queda aquí con la fecha en el nombre. Si esta carpeta solo tiene este README, nadie ha mirado los agregados todavía, y eso también es información.

El script está sin probar contra Cloudflare hasta que exista el token (`CF_ANALYTICS_TOKEN`, permiso de lectura de analytics; lo pone Romina).
