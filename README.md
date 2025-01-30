## First Day Inferno s(Prototipo)

# Equipo de desarrollo: 
- Samuel Carrillo Menchero
- Yago Sanabria Gavín
- Alicia Grado Guerrero
- Javier Pasamontes Martín 
- Washington Morocho Lema 

1.- Resumen
1.1.-Descripción
First Day Inferno es un action RPG en el que manejas a un estudiante de informática nuevo en búsqueda de su facultad. Durante su aventura personal irá pasando por distintas facultades que compondrán una especie de mazmorras, en las que el objetivo será derrotar al jefe final.
Durante el camino podrás recoger objetos e ir mejorando tu personaje.

1.2	Género
Action RPG. Videojuego de mazmorras/exploración.

1.3	Setting
“Pepito” es un estudiante de primer año recién ingresado en la facultad de informática de la UCM, tras salir del metro en ciudad universitaria, se encuentra con que la facultad no está donde esperaba, sino que deberá recorrer un arduo camino lleno de obstáculos, peligros y recompensas para lograr su objetivo de llegar a clase, recorriendo las distintas facultades de la universidad y enfrentando temibles jefes que tienen las pistas que necesita para llegar a la facultad. 

1.4	Características principales
-	Mueve a Pepito por las salas para ir avanzando entre ellas y llegar al objetivo.
-	Ataca a los enemigos con lo que puedas para librarte de ellos y conseguir recompensas.
-	Varios escenarios con diversas ambientaciones.
-	Visita tiendas y salas secretas para mejorar a Pepito.
- 	Estilo visual pixel art acompañado de ilustraciones estilo cartoon.

2	Gameplay
2.1	Objetivo del juego
El objetivo del juego es recorrer todas las facultades derrotando a los jefes propios de cada una para poder avanzar.
El juego acaba tras llegar a la facultad de informática y derrotar al último jefe.

2.2	Core loops
El jugador en cada nivel, tendrá un mapa basado en salas consecutivas en el que deberá derrotar enemigos para avanzar de sala hasta llegar a la sala final que da paso al siguiente nivel.
Cada sala puede ofrecer opciones de mejora, curación, etc… al jugador.
  

3	Mecánicas

3.1	Movimiento 
El jugador se puede mover en horizontal y en vertical por el mapa.
 
3.2	Disparo
El personaje puede disparar para dañar a los enemigos, este disparo será afectado por los distintos potenciadores que podrá encontrar a lo largo de la aventura, modificando su daño y velocidad de disparo.

3.3	Modificación del personaje con objetos
En cada sala el personaje puede obtener items que modificarán (no necesariamente positivamente) los diferentes parámetros del mismo, daño del disparo, velocidad de disparo, vida, velocidad de movimiento. Estas mejoras pueden implicar cambios estéticos en los disparos y en el personaje.

3.4	Recoger objetos
Cuando el personaje pasa por encima de un objeto este lo recoge directamente. Al recogerlo muestra una ventana con la descripción del objeto y las estadísticas que aporta.

3.5	Usar llave (abrir puerta)
El personaje usa la llave adquirida a lo largo de las distintas facultades para poder abrir la puerta y combatir contra el final boss. (cada vez que derrotas a un boss recibes un trozo de llave, al combatir contra el último, si lo derrota, tendrá todos los trozos de llave y abrir con ella la puerta final.

3.6	Sistema de vida
El jugador inicia la partida con una barra de vidas (en forma de corazones) cada vez que recibe el ataque de un enemigo su vida baja dependiendo del daño del ataque. Cuando se queda sin corazones se hace reset de la facultad en la que este y vuelve a aparecer en el mundo principal.

3.7	Comprar
El personaje usa sus monedas para comprar alguno de los objetos de la tienda, las monedas se gastan y tendrá el objeto comprado en su inventario, más tarde decide cuando usar el objeto.

3.8	Conseguir moneda
El jugador conseguirá monedas cuando mate a enemigos (no siempre recibirá monedas por esto) o cuando las recoja (ya que habrá a lo largo del mapa), sirven para usarlas en la tienda.

4	Interfaz
4.1	Controles
●	Movimiento Izquierda / Derecha / Arriba / Abajo: Mueve a Pepito en todas direcciones con la pulsación de las teclas W-A-S-D.
●	Ataque: con el cursor del ratón se apunta en la dirección deseada y al hacer click del botón 1 se dispara un proyectil en dicha dirección. Si se mantiene apretado el botón de ataque, el jugador disparará automáticamente constantemente. Al disparar existe un “cooldown” para que el jugador no abuse de los ataques y aumente la dificultad, dependiendo del arma/objetos que posea el jugador, el cooldown será mayor o menor.
 
4.2	Cámara
La cámara es fija y muestra todo el nivel de juego (la habitación actual).
4.3	HUD
El HUD contiene información sobre:
-	La cantidad de vida que le quedan al jugador.
-	Los objetos que tiene el jugador.
-	Icono de mapa que al clickar o presionar la tecla M se abre el mapa.

4.4	Menús
El juego tiene 2 menús diferentes, el de pausa y la tienda.
-	Menú de pausa: se para el juego, se puede reanudar o salir del nivel
-	Menú de tienda: al entrar en la habitación de tienda (única) aparece el menú de compra y venta de objetos.
 
5	Mundo del juego
5.1	Personajes
5.1.1	Personaje principal
El personaje principal de la historia es un estudiante de informática, un/una estudiante de la facultad de informática que no conoce el camino a su facultad.
5.1.2	Enemigos
Dentro de cada facultad hay dos tipos de enemigos: los súbditos y bosses. El comportamiento es similar:
Los súbditos disparan o atacan al contacto, dependiendo de la facultad en la que te encuentres tendrán un tipo de disparo u otro.
El ataque de los bosses es ___, el boss tendrá una barra de vida y cuando llegue a la mitad el jefe se enfadará y su ataque y movimiento cambiará siendo más agresivo.
Cuando el boss muere suelta un cacho de mapa de la facultad de informática o algo parecido que te ayudará con el final boss de la FDI.
Si el jugador recibe un disparo de algún enemigo su barra de vida disminuirá, dependiendo del enemigo del que haya recibido el ataque.
Cuando la barra de vida llega a su fin el personaje muere, suelta un objeto, y abre la puerta para salir de la facultad.
      -	Los enemigos aparecen en posiciones aleatorias al entrar a la sala.
Los enemigos por cada facultad serán:
-Medicina.
	Estética: True lab. (Undertale).
	Enemigos base: Zombies con bata y esqueletos.
	Jefe: Ayuso.
-Magisterio.
Estética: Chiki Park.
	Enemigos base: Zombies con bata y esqueletos.
	Jefe: Ayuso.
-Filosofía.
-Física.
-Informática.
	Estética. Salas de la facultad: Cafetería, labs…
Enemigos. nerds y NANDS. Boss final: Profesor con 2 fase (cualquier parecido con la realidad es pura coincidencia).
5.2	Objetos
Los objetos podrán ser comprados u obtenidos tras vencer a los distintos jefes o enemigos.
5.2.1 Objetos obtenibles
Collar de macarrones
Obtención: Obtenido tras vencer al boss de la Facultad de Magisterio.
Descripción: Creado con esfuerzo y sudor por un estudiante de magisterio como proyecto de TFG.
Efecto: El personaje cambia su proyectil a un cacho de plastilina.
Beneficio: Aumenta la velocidad de disparo.
Desventaja: Reduce el daño causado.
Bolsa con contenido sospechoso. 
Obtención. Obtenida tras vencer al boss de la Facultad de Filosofía.
Descripción. Contiene unas hojas verdes secas. Su olor te evoca recuerdos del sur de Madrid.
Efecto. El personaje cambia su proyectil a bolas de humo.
Beneficio. Tu ataque aumenta al doble.
Desventaja. Se invierten los controles.
Uff Referencia. 
Obtención. Derrota a un enemigo especial.
Descripción. Te recuerda a otro juego que ya has jugado… 
Efecto. El personaje ahora dispara lágrimas.
Beneficio. Más daño. 
Desventaja. No tiene.
Algoritmo VA
Obtención. Llega a la Facultad de Informática.
Descripción. Algoritmo forjado en las profundidades de uno de los laboratorios de la facultad de informática. Contiene la esencia de un estudiante de informática con depresión.
Efecto. El personaje dispara en binario.
Beneficio. Las balas rebotan en la pared y hacen más daño.
Desventaja. El nombre evoca sentimientos traumáticos y te baja la velocidad.
Bono Transporte. 
Obtención. Aparece en las tiendas.
Descripción. Bono joven de transporte de la comunidad de Madrid. ¡Gracias Pedrito!
Efecto. El personaje dispara y se mueve más rápido.
Beneficio. Más velocidad de disparo y más velocidad de movimiento. 
Desventaja. No tiene.
Bazinga.
	Obtención. Se consigue tras vencer al boss de la facultad de física.
	Descripción. Jaja. Bazinga.
	Efecto. El personaje obtiene una camiseta de flash. Dispara protones.
	Beneficio. Los proyectiles explotan.
	Desventaja. Menos daño.
Mano en garra
	Obtención. Se consigue tras vencer al boss de la facultad de medicina.
	Descripción. Suena a ataque de videojuego pero es una condición médica.
	Efecto. El personaje pierde un brazo.
	Beneficio. Haces más daño.
	Desventaja. Atacas a melé
Hamburguesa de pollo
	Obtención. Se compra en la tienda.
	Descripción. Fabricado por Sánchez y Andrés, puedes notar el sabor a parrilla (y a sus manos).
	Efecto. Nada físico.
	Beneficio. Te otorga un corazón extra.
	Desventaja. Ninguna.
Moneda. 
Es una moneda. Sirve para comprar.
Mini de tinto
	Obtención. Se compra en la tienda.
	Descripción. Brebaje místico realizado con los mejores vinos.
	Efecto. Te mueves más lento (bastante).
	Beneficio. Te otorga dos corazones extra.
	Desventaja. Ninguna.
Maletín de laboratorio
	Obtención. Se compra en la tienda.
	Descripción. Maletín que contiene una placa en su interior. Nadie sabe cómo      funciona.
	Efecto. Te mueves más lento pero obtienes más escudo.
	Beneficio. Los golpes de los enemigos te hacen menos daño.
	Desventaja. Tu velocidad de movimiento baja.
Código mal optimizado
	Obtención. Se compra en la tienda
	Descripción. Código que a veces funciona mal, ha dado time limit en el juez.
	Efecto. El código tiene un bug que hace cada vez que disparas lances dos proyectiles.
	Beneficio. Lanzas dos proyectiles cada vez que disparas
	Desventaja. Cada proyectil tiene un 10% de posibilidades de fallar
Pantallazo azul
	Obtención. Se compra en la tienda
	Descripción. Maletín que contiene una placa en su interior. Nadie sabe cómo funciona.
	Efecto. Tu disparo puede bloquear a los enemigos durante 1.5 segundos
	Beneficio. Los disparos tienen un 30% de bloquear al enemigo durante 1.5 segundos.
	Desventaja. Ninguna.

5.3	Niveles
Todos los “mundos” (facultades) son similares, contienen varias habitaciones y/o pasillos donde se encuentran los enemigos y al final del mundo se encuentra el jefe final.

6	Estética y contenido
NOTA SOBRE EL EJEMPLO: Me salto esta parte 
7	Experiencia de juego
TODO
8	Producción
8.1	Planificación (roadmap)
TODO
9	Referencias
Estas son las referencias usadas para entender este documento. En realidad, deberían ser referencias a otros videojuegos que inspiran el diseño.
●	The Binding of Isaac Wiki | Fandom: Controles, ataque, enemigos.
●	The Legend of Zelda (videojuego) - Wikipedia, la enciclopedia libre: Diseño de niveles y mapa.
●	Nuclear Throne Wiki | Fandom: Estilo visual.

