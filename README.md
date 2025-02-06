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

### ⭐ 1.4 Características Principales
- Explora diferentes facultades con ambientaciones únicas.
- Derrota enemigos y jefes finales para progresar.
- Descubre tiendas y salas secretas con mejoras para tu personaje.
- Estilo visual **pixel art** con ilustraciones estilo **cartoon**.

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
- **Ataque:** Apuntar con el ratón y disparar con **clic izquierdo**.
- **Disparo automático:** Mantener pulsado el botón de ataque.
- **Cooldown:** Controlado según el arma y mejoras.

### 📷 4.2 Cámara
- La cámara es **fija**, mostrando toda la habitación actual.

### 🏁 4.3 HUD
- **Vida del jugador**.
- **Inventario de objetos**.
- **Mapa accesible con la tecla M**.

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
- **Medicina:** Zombies con bata y esqueletos. **Jefe: Ayuso**.
- **Magisterio:** Enemigos similares. **Jefe: Ayuso**.
- **Filosofía:** Enemigos por definir.
- **Física:** Enemigos científicos. **Jefe: Bazinga**.
- **Informática:** Nerds y compuertas NAND. **Jefe final: Profesor de dos fases**.

### 🎁 5.3 Objetos
- **Collar de macarrones**
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
	Efecto. El código tiene un bug que hace que cada vez que disparas lances dos proyectiles.
	Beneficio. Lanzas dos proyectiles cada vez que disparas
	Desventaja. Cada proyectil tiene un 10% de posibilidades de fallar
Pantallazo azul
	Obtención. Se compra en la tienda
	Descripción. Actualizaste a Windows 11. Nadie sabe cómo funciona.
	Efecto. Tu disparo puede bloquear a los enemigos durante 1.5 segundos
	Beneficio. Los disparos tienen un 30% de bloquear al enemigo durante 1.5 segundos.
	Desventaja. Ninguna.


---

## 🎨 6. Estética y Contenido
*(Pendiente de Desarrollo)*

---

## 🎭 7. Experiencia de Juego
*(Pendiente de Desarrollo)*

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