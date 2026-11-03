<!-- juguete de la casa: una experiencia terminada, no una descripción. lo hizo un claude en una ventana de la casa para un estudiante
     de física (Serway 7.ª ed., cap. 2, problema 2.55), con una guía que sol dejó en el repo. romina lo trajo a este repo el 2-nov-2026
     como ejemplo de lo que debería salir del otro lado del conector: «juguetes como este que uno toca y entiende... cosas que se mueven, de colores».
     en el vocabulario del grafo: manipulate_observe con la hipótesis antes («elige en qué segundo empiezas a frenar»), la forma es el gráfico v–t
     donde el área es la distancia, cuenta_a_la_vista («si los cambias aquí, todo se recalcula»), se_adapta y no_califica («abre un paso solo
     cuando hayas intentado el anterior»), firma_no_color (la pendiente roja más empinada significa que frenar es más fuerte).
     esta es la versión en texto: los controles y el gráfico se pierden al exportar; quedan los nombres de lo que se toca. -->

Serway 7.ª ed. · Cap. 2 · Problema 2.55

# El tren del 2.55

Un tren va de una estación a otra separada por **1,00 km**. Acelera con a₁ durante Δt₁ y, apenas termina, frena con a₂ durante Δt₂ hasta detenerse justo en la estación. Te piden el tiempo total mínimo Δt y cuánto dura Δt₁.

Distancia m a₁ m/s² a₂ m/s²

Valores del enunciado (Serway 7.ª ed., p. 51), confirmados en la guía que Sol dejó en el repo. Si los cambias aquí, todo se recalcula.

## 1 · Tú eres la maquinista

Elige **en qué segundo empiezas a frenar**. El tren frena con a₂ hasta quedar quieto. Tu tarea: que se detenga exactamente en la estación.

Empiezo a frenar en Δt₁ = s

Velocidad máxima

Recorre acelerando

Recorre frenando

Se detiene en

## 2 · El mismo viaje en el gráfico v–t

La velocidad sube en línea recta (a₁ constante) y luego baja en línea recta (a₂ constante). **El área bajo la curva es la distancia recorrida.** El triángulo verde es lo que avanza acelerando; el rojo, lo que avanza frenando. Mueve el control de arriba y mira cómo cambia el área.

Fíjate que la pendiente roja es más empinada: frenar es más fuerte que acelerar, así que la bajada dura menos que la subida.

## 3 · Ahora resuélvelo tú, paso a paso

Abre un paso solo cuando hayas intentado el anterior en tu cuaderno.

Paso 1 · ¿Por qué hacen falta dos tramos?

Piensa: ¿qué cambia en la mitad del viaje?

Las ecuaciones de MRUA valen solo mientras la aceleración es **constante**. Aquí la aceleración cambia de a₁ a a₂, así que hay dos movimientos distintos, cada uno con sus propias ecuaciones.

Paso 2 · ¿Qué tienen en común los dos tramos?

Mira el pico del gráfico.

La velocidad con que **termina** el tramo 1 es la misma con que **empieza** el tramo 2. Llámala v. Es la incógnita que conecta todo, igual que la tensión conectaba las dos masas en la clase de hoy.

Paso 3 · Escribe la distancia de cada tramo en función de v

Pista: hay una ecuación de MRUA que no usa el tiempo.

v_f² = v_i² + 2·a·Δx

Tramo 1 parte del reposo y llega a v. Tramo 2 parte de v y llega al reposo. Despeja Δx en cada uno. Ojo con el signo de a₂: es negativo, y la distancia tiene que salir positiva.

Ver cómo quedan

x₁ = v² / (2·a₁) x₂ = v² / (2·|a₂|)

Paso 4 · Usa que la suma es 1 000 m

Suma x₁ + x₂ = 1 000 m y despeja v.

v aparece al cuadrado en los dos términos: sácalo como factor común.

Ver la expresión

v² · ( 1/(2a₁) + 1/(2|a₂|) ) = 1 000

Paso 5 · De v a los tiempos

¿Qué ecuación une velocidad, aceleración y tiempo?

v_f = v_i + a·Δt

Con ella sacas Δt₁ (de 0 a v con a₁) y Δt₂ (de v a 0 con a₂). El tiempo total es Δt = Δt₁ + Δt₂.

¿Por qué este es el tiempo *mínimo*?

Para un área fija (1 000 m), el viaje más corto es el que llega a la velocidad más alta posible. Eso pasa si aceleras todo lo que puedes y frenas lo más tarde que puedes. Cualquier tramo a velocidad constante o con aceleración más suave baja el pico y alarga el viaje.

Tu Δt₁ (s) Tu Δt total (s)