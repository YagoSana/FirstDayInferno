# Arte

- Jetpac: 17x24
- Explosión: 24x17
- Enemigos: 16x14
- Los tiles son de 8x8 y el mapa es de 32x24 tiles en Tiled
- La fuente es se llama Pixeled dentro del juego

# Problemas detectados

- Si no se pone la animación antes de añadir las colisiones entonces el boundingbox no tiene el tamaño correcto.
- Hay que eliminar el impulso en el momento en el que la tecla Up no está pulsada
- En el pick, para hacer que el objeto fuel deje de moverse por física hay que quitarle la gravedad (son el setAllowGravity)

# Mínimos

- Que el fuel aparezca en la escena (puede ser sin gravedad) y que el jugador lo pueda recoger.