# First Day Inferno (Prototipo)

## 📌 Equipo de Desarrollo
- **Samuel Carrillo Menchero**
- **Alicia Grado Guerrero**
- **Washington Morocho Lema**
- **Javier Pasamontes Martín**
- **Yago Sanabria Gavín**

---

## 📝 1. Resumen

### 🎮 1.1 Descripción
*First Day Inferno* es un **Action RPG** en el que tomas el control de un estudiante de informática en su primer día de universidad. Tras salir del metro, descubre que su facultad ha desaparecido, obligándolo a atravesar diferentes facultades convertidas en mazmorras llenas de enemigos y desafíos. A medida que avanza, podrá recoger objetos y mejorar sus habilidades hasta llegar a su destino final.

### 🏹 1.2 Género
- **Action RPG**
- **Mazmorras / Exploración**

### 🏛️ 1.3 Ambientación
Eres "Pepito", un estudiante de primer año en la Universidad Complutense de Madrid (UCM). Tras salir del metro en Ciudad Universitaria, se encuentra con que la Facultad de Informática ha desaparecido. Para encontrarla, deberá superar una serie de desafíos en otras facultades, enfrentándose a jefes que poseen las pistas necesarias para llegar a su destino final.

### ⭐ 1.4 Features Principales
-   El jugador contará con las siguientes funciones:
    - [] Sistema de dialogos con interfaz y NPCS.
	 - [x] Movimiento multidireccional (Topdown).
	 - [x] Movimiento multidireccional (Topdown).
	 - [x] Disparo en 4 direcciones con inercia.
	 - [x] Podrá equiparse algunos ítems (ver más adelante).
 	 - [ ] Podrá hacer "parry" a las balas de los enemigos para curarse o recibir bonificaciones.
-   Habrá un **tutorial** que permitirá al jugador entender las mecánicas
-   Habrá distintas facultades con varias salas, salas secretas y una sala bloqueada en la que estará el Boss de ese nivel. Los niveles serán:
	 - [Depurando] **Facultad de Medicina** : 8 salas normales: de las cuales una es una tienda,  '1' con un mini boss (laboratorio) y   y 1 con un boss (a implementar aun)
	 - [Depurando] **Facultad de Informática** : 5 salas normales y 1 una de boss
    - [x] **Tutorial (metro)**: 3 salas a modo de tutorial

-   Las salas se bloquearán hasta que derrotes a todos los enemigos con algún elemento visual como llamas. Cuando el jugador entre en contacto con ello recibirá daño.
-   El jugador conservará las stats al cambiar de sala.
-   Los niveles contarán con los siguientes tipos de **enemigos**:
	- [x] **Enemigo a corta distancia** : Tienen un patrón de movimientos simple, y de vez en cuando siguen al jugador (Cucaracha, NAND).
	- [x] **Enemigo a larga distancia** : Siguen al jugador hasta ‘x’ punto, después dentro de un rango ‘y’ disparan al jugador a distancia (Nerd, Zombie).
 	- [x] **Enemigo despertable** : Está dormido y es inofensivo hasta que el jugador lo toca o lo ataca, que empezará a perseguirlo (Gato).
  	- [x] **Enemigo de embestida** : Tiene movimiento limitado pero si el jugador está a su alcance lo embiste con gran velocidad.
	- [x] **Enemigo torreta** : Enemigo estático que ataca a gran rango en una única dirección. Se coloca al final de los pasillos para jugar con mecánicas de esquive.
   	- [x] **Enemigo de disparo en área** : Dispara 8 balas en área y sigue al jugador hasta 'x'.
   	- [x] **MiniBoss informatica** : El enemigo permanece ináctivo y spawnea 2 guardianes (enemigos a larga distancia), en el momento en el que estos son derrotados se activa. Su movimiento es estático y varia entre ataques rápidos de una sola bala y otros mas lentos de varias.
   	- [En proceso] **Boss Informatica** : Boss de 2 fases, comienza siendo una profesora de la facultad (cualquier parecido con la realidad es pura coincidencia). Tras quitarle x vida se convierte en un ciborg. La primera base se basará en ataques a distancia variando entre ataques directos o rafagas en rango. La segunda fase invoca enemigos y ataca a melé.

    
-   Se podrá conseguir items por diferentes medios como:
	 - [x] Una **máquina expendedora**: tiene ‘x’ usos y dispensa un ítem aleatorio por uso con un coste ‘y’. En caso de no tener dinero se puede destruir y proporciona ‘x’ items al destruirse
	 - [x] Una **tienda en la cafetería**: tiene 1 único uso. Permite comprar por 5 monedas, invoca 3 objetos de los cuales al elegir uno elimina los demas.
    - [x] NPC del laboratorio. Te otorga el maletín tras 1 conversación. Al ser asesinado invoca al mini boss anteriormente mencionado.
    
-   Aparecerán una variedad de **items** con distintas funcionalidades que pueden tener un efecto positivo o negativo al jugador. Algunos se recogen automáticamente al pasar por encima, y otros contarán con una descripción para que el jugador los pueda recoger con la tecla ‘E’.
    
	-   Los **ítems automáticos** se obtienen al pasar por encima de ellos y proporcionan 1 unidad de ‘x’ atributo al jugador:

		 - [x] Moneda: proporciona 1 moneda al jugador.
		 - [x] Corazón: cura 1 de vida al jugador.
		 - [x] Llave: proporciona 1 llave al jugador, desbloquea salas secretas.

	-   Los **ítems manuales** se obtienen al recogerlos cuando el jugador pulse la tecla ‘E’ sobre ellos. Cuenta con una breve descripción  y cambian los stats del jugador.
    
		 - [x] Hamburguesa: sube 2 puntos de vida, si los controles están invertidos vuelven a la normalidad.
		 - [x] Mini de tinto: sube 4 puntos de vida, el jugador va 25% más lento.
		 - [x] Bono transporte: el jugador se mueve un 30% más rápido y el cooldown del disparo baja 150ms.
		 - [x] Código mal optimizado: el proyectil del jugador hace el doble de daño pero tiene un 20% de probabilidad de que se desvie.
		 - [x] Maletín laboratorio: sube 3 puntos de vida y el jugador va un 30% más lento.
		 - [x] Bolsa sospechosa: invierte los controles del disparo, las balas hacen el doble de daño.

	-   Los **ítems equipables** son items manuales, pero estos cambian la apariencia del jugador (los que no implementen objetos superpuestos se les añadirá efectos de partículas o color).

		- [x] Bumbo: cambia la apariencia del jugador y de las balas.
		- [ ] Pantallazo azul: cambia la apariencia del jugador y de las balas, las balas tienen un 30% de dejar congelado durante 2 segundos
            al enemigo (en desarrollo).
		- [ ] Collar de macarrones: cambia la apariencia del jugador y de las balas, el cooldown del disparo disminuye (en desarrollo).

-   La pantalla de GAME OVER será diferente en función de cómo ha perdido el jugador
    
-   Habrá cinemáticas o escenas de inicio y final
    
-   Habrá 2 finales, uno secreto y otro normal
  
-   El juego contará con sonidos acordes a las diferentes acciones y situaciones del mismo.

-   El juego contará con una banda sonora original para ambientar los diferentes escenarios y situaciones.

---

## 🎮 2. Gameplay

### 🎯 2.1 Objetivo del Juego
Supera todas las facultades derrotando a sus respectivos jefes hasta llegar a la Facultad de Informática. El juego finaliza tras derrotar al **jefe final** de la UCM.

### 🔄 2.2 Core Loops
- Cada nivel consta de un **mapa con salas conectadas**.
- Derrota enemigos para avanzar hasta la **sala final** del nivel.
- Encuentra **mejoras y objetos** en ciertas salas.

---

## ⚙️ 3. Mecánicas

### 🏃‍♂️ 3.1 Movimiento
El jugador puede desplazarse en **horizontal y vertical** por el mapa.

### 🔫 3.2 Disparo
- El personaje ataca a distancia con disparos modificables mediante **potenciadores**.

### 🎒 3.3 Modificación del Personaje
- Los **objetos recogidos** alteran estadísticas como **daño, velocidad y vida**.
- Algunas mejoras pueden cambiar **la apariencia de los disparos o del personaje**.

### 📦 3.4 Recoger Objetos
- Los objetos se recogen automáticamente al pisarlos.
- Se muestra una ventana con **su descripción y efectos**.

### 🔑 3.5 Uso de Llaves
- Cada jefe derrotado otorga un **trozo de llave**.
- La llave completa se usa para **desbloquear la Facultad de Informática**.

### ❤️ 3.6 Sistema de Vida
- El jugador comienza con una barra de **corazones**.
- Al recibir daño, los corazones se reducen.
- Al perder toda la vida, el jugador **reinicia la facultad actual**.

### 🛒 3.7 Comprar
- En la tienda se pueden adquirir objetos a cambio de **monedas**.

### 💰 3.8 Conseguir Monedas
- Se obtienen al derrotar enemigos o al recogerlas en el escenario.

---

## 🖥️ 4. Interfaz

### 🎮 4.1 Controles
- **Movimiento:** W, A, S, D.
- **Ataque:** Flechas del teclado para la direccion del disparo.
- **Disparo automático:** Mantener pulsado el botón de ataque.
- **Cooldown:** Controlado según el arma y mejoras.

### 📷 4.2 Cámara
- La cámara es **fija**, mostrando toda la habitación actual.

### 🏁 4.3 HUD
- **Vida del jugador**.
- **Inventario de objetos**.
- **Mapa accesible con la tecla M**. (WIP)

### 📜 4.4 Menús
- **Menú de Pausa:** Permite reanudar o salir del nivel.
- **Menú de Tienda:** Accesible en la sala de comercio.

---

## 🌍 5. Mundo del Juego

### 🎭 5.1 Personajes
#### 👤 Personaje Principal
- **Pepito:** Estudiante de informática perdido en la universidad.

#### 👹 Enemigos
- **Súbditos:** Enemigos básicos con diferentes patrones de ataque.
- **Jefes:** Poseen **múltiples fases** y dejan caer **trozos de llave** al ser derrotados.

### 🔥 5.2 Facultades y Enemigos
- **Medicina:** Zombies con bata y esqueletos. **Jefe: zombie especial**. Para hito 3 boss especial
- **Magisterio:** Enemigos similares. **Jefe: ???**.
- **Filosofía:** Enemigos por definir.
- **Física:** Enemigos científicos. **Jefe: Bazinga**.
- **Informática:** Nerds y compuertas NAND. **Jefe final: Profesor de dos fases**.

## 🎁 5.3 Objetos  

### 📌 **Collar de macarrones**  
   - **🛠 Obtención:**  Obtenido tras vencer al boss de la Facultad de Magisterio.  
   - **📜 Descripción:**  Creado con esfuerzo y sudor por un estudiante de magisterio como proyecto de TFG.  
   - **✨ Efecto:**  El personaje cambia su proyectil a un cacho de plastilina.  
   - **✅ Beneficio:**  Aumenta la velocidad de disparo.  
   - **❌ Desventaja:**  Ninguna.  

### 📌 **Bolsa con contenido sospechoso**  
   - **🛠 Obtención:**  Obtenida tras vencer al boss de la Facultad de Filosofía.  
   - **📜 Descripción:**  Contiene unas hojas verdes secas. Su olor te evoca recuerdos del sur de Madrid.  
   - **✨ Efecto:**  El personaje cambia su proyectil a bolas de humo.  
   - **✅ Beneficio:**  Tu ataque aumenta al doble.  
   - **❌ Desventaja:**  Se invierten los controles de disparo.  

### 📌 **Uff Referencia**  
   - **🛠 Obtención:**  Derrota a un enemigo especial.  
   - **📜 Descripción:**  Te recuerda a otro juego que ya has jugado…  
   - **✨ Efecto:**  El personaje ahora dispara lágrimas.  
   - **✅ Beneficio:**  No tiene.  
   - **❌ Desventaja:** No tiene.  

### 📌 **Bono Transporte**  
   - **🛠 Obtención:**  Aparece en las tiendas.  
   - **📜 Descripción:**  Bono joven de transporte de la Comunidad de Madrid. ¡Gracias Pedrito!  
   - **✨ Efecto:**  El personaje dispara y se mueve más rápido.  
   - **✅ Beneficio:**  Más velocidad de disparo y más velocidad de movimiento.  
   - **❌ Desventaja:**  No tiene.  

### 📌 **Hamburguesa de pollo**  
   - **🛠 Obtención:**  Se compra en la tienda.  
   - **📜 Descripción:**  Fabricado por Sánchez y Andrés, puedes notar el sabor a parrilla (y a sus manos).  
   - **✨ Efecto:**  Nada físico.  
   - **✅ Beneficio:**  Te otorga dos corazón extra.  
   - **❌ Desventaja:**  Ninguna.  

### 📌 **Moneda**  
   - Es una moneda. Sirve para comprar.  

### 📌 **Mini de tinto**  
   - **🛠 Obtención:**  Se compra en la tienda.  
   - **📜 Descripción:**  Brebaje místico realizado con los mejores vinos.  
   - **✨ Efecto:**  Te mueves más lento (bastante).  
   - **✅ Beneficio:**  Te otorga cuatro corazones extra.  
   - **❌ Desventaja:**  Te mueves más lento.  

### 📌 **Maletín de laboratorio**  
   - **🛠 Obtención:**  Se compra en la tienda.  
   - **📜 Descripción:**  Maletín que contiene una placa en su interior. Nadie sabe cómo funciona.  
   - **✨ Efecto:**  Te mueves más lento pero obtienes más vida.  
   - **✅ Beneficio:**  Te otorga 3 corazones extra.  
   - **❌ Desventaja:**  Tu velocidad de movimiento baja.  

### 📌 **Código mal optimizado**  
   - **🛠 Obtención:**  Se compra en la tienda.  
   - **📜 Descripción:**  Código que a veces funciona mal, ha dado *time limit* en el juez.  
   - **✨ Efecto:**  El código tiene un bug que hace que los proyectiles hagan el doble de daño.  
   - **✅ Beneficio:**  Los proyectiles hacen el doble de daño.  
   - **❌ Desventaja:**  Cada proyectil tiene un 20% de posibilidades de fallar.  

### 📌 **Pantallazo azul**  
   - **🛠 Obtención:**  Se compra en la tienda.  
   - **📜 Descripción:**  Actualizaste a Windows 11. Nadie sabe cómo funciona.  
   - **✨ Efecto:**  Tu disparo puede bloquear a los enemigos durante 2 segundos.  
   - **✅ Beneficio:**  Los disparos tienen un 30% de bloquear al enemigo durante 2 segundos.  
   - **❌ Desventaja:**  Ninguna.  

---

## 🎨 6. Estética y Contenido
Estética pixel art inspirada en los juegos de 32 bits e inspiración cartoon con diferentes ambientaciones en los distintos niveles, siguiendo la linea estética mencionada pero cambiando elementos para lograr diferentes ambientes.

---

## 🎭 7. Experiencia de Juego
La experiencia debe ser dinámica, sencilla y requerirá poco esfuerzo para entender pero será dificil de masterizar.

---

## 📅 8. Producción

### 📍 8.1 Planificación (Roadmap)
*(Pendiente de Desarrollo)*

---

## 📚 9. Referencias
- **The Binding of Isaac** → Controles, ataque, enemigos.
- **The Legend of Zelda** → Diseño de niveles y exploración.
- **Nuclear Throne** → Estilo visual y gameplay.

---

🎮 **¡Prepárate para la aventura universitaria más desafiante y absurda jamás creada!** 🚀
