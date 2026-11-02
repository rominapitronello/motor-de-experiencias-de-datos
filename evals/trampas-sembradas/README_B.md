# Conjunto B · Sol · GPT-6 · 2-nov-2026

**Estado: propuesta para segunda pluma Claude, sin resultados de modelos.**

El archivo `casos_b.json` contiene **12 casos completamente sintéticos**: 8 con trampas y 4 controles, dos por cada TR-02 (geometría activa), TR-03 (tres clases de vacío), TR-04 (inversión de orden de cuartiles) y TR-05 (nueva edición invisible para un hash fijo). No hay datasets o clientes reales.

**Importante — no ciego:** antes de escribir el conjunto B, al revisar el patch del PR #9 de Claude, GitHub mostró algunos fragmentos de su conjunto A. Se declaró `EXPOSICION_PARCIAL_A` dentro de `casos_b.json`. Después de esa exposición no se reabrió el conjunto A hasta haber escrito y commiteado B. **No presentar B como un conjunto redactado a ciegas.** Corresponde que otro linaje/instancia sin acceso al B redacte un conjunto C y deje constancia de su exposición antes de abrir este archivo. La independencia no se reconstruye borrando la traza.

**Estado epistemológico:** TR-02 figura VERIFICADO en el catálogo y TR-03/04/05 figuran REFERIDO. En este eval todos los eventos, diccionarios, geometrías, números y ediciones son **inventados**. La reproducción de los eventos del mundo real no es parte de esta batería; no promover REFERIDO a VERIFICADO.

**Límite del lenguaje:** listas `debe`, `falla_grave` y `no_debe` son hipótesis de evaluación. El juez debe admitir alternativas semánticamente equivalentes sin exigir palabras exactas, y registrar desacuerdos de juicio; una negativa justificada también puede ser correcta si el caso no contiene suficiente evidencia.

**Validación automática**, no juicio:
```bash
python3 evals/trampas-sembradas/validar_b.py
```

Una prueba verde certifica formato y distribución, **no** la justicia de los criterios, el contenido sintético ni el impacto del conector.

**Integración:** B vive en su propio PR basado en `main`. Claude mantiene el puntuador en PR #9. Las dos piezas se combinan después de segunda pluma sin invadir la autoría ajena. Solicitar a Claude revisar B con especial atención a falsos positivos, imposibles epistemológicos y errores procedimentales.

## Ajustes tras segunda pluma de Claude · Opus 5.5 (2-nov-2026)

- B-TR04-2 pasa a `con_pista`: el material incluye explícitamente la inversión y la constancia de puntajes.
- B-TR03-2 conserva los datos necesarios pero elimina la frase que diagnosticaba por adelantado la contradicción del borrador.
- B-CTRL-TR02 tiene un pedido neutro, sin revelar al sujeto cuál es la trampa; se retiró un criterio opcional que no era puntuable.
- B-CTRL-TR03 sustituye «proporcionada» por una leyenda observable que identifica el valor cero como cero residentes contados.
- B-TR02-1 separa revisión de geometría activa y examen de casos limítrofes en ítems distintos.
- Además, B-TR02-2 pasa a `con_pista`: aunque el sujeto informa un síntoma, el material explicita la geometría activa y la ausencia de `set_geometry`; clasificarlo como `sin_pista` habría sido otro falso verde de estratificación.

Los criterios `debe` redactados en negativo se leen como comprobación de ausencia, no como exigencia de repetir una frase; requieren segunda pluma sobre los ítems observables. El archivo conserva las observaciones de exposición parcial a A. No hay resultados de modelos.
