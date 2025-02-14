import Phaser, { GameObjects } from 'phaser';
import Bullet from './bullet.js';

/**
 * Clase que representa el jugador del juego. El jugador se mueve por el mundo usando los cursores.
 * También almacena la puntuación o número de estrellas que ha recogido hasta el momento.
 */
export default class Player extends Phaser.GameObjects.Sprite {

    /**
     * Constructor del jugador
     * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
     */
    constructor(scene, x, y) {
        super(scene, x, y, 'player');	
        this.health = 3;
        this.setScale(2);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        // Queremos que el jugador no se salga de los límites del mundo
        this.body.setCollideWorldBounds();
        this.speed = 180;
        this.body.setAllowGravity(false);
        // Esta label es la UI en la que pondremos la puntuación del jugador
        this.label = this.scene.add.text(10, 10, "", {fontSize: 20});
        this.label.setScrollFactor(0);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.scene.physics.add.collider(this, scene.enemyBulletGroup, this.hurt, null, this);
        this.updateHealth();
        // Asignar controles de movimiento
        this.cursors = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.lastDirection = 'front'; // Por defecto, mirando al frente

        // Controles para disparar
        this.shootKeys = scene.input.keyboard.addKeys({
            shootUp: Phaser.Input.Keyboard.KeyCodes.UP,
            shootDown: Phaser.Input.Keyboard.KeyCodes.DOWN,
            shootLeft: Phaser.Input.Keyboard.KeyCodes.LEFT,
            shootRight: Phaser.Input.Keyboard.KeyCodes.RIGHT
        });

        this.lastShot = 0; // Tiempo del último disparo
        this.shootCooldown = 500; // En milisegundos
        this.damageCooldown = 500; // En milisegundos
        this.lastHurtTime = 0;  // Tiempo del último daño
    }

    /**
     * El jugador ha recogido una estrella por lo que este método añade un punto y
     * actualiza la UI con la puntuación actual.
     */

    /**
     * Actualiza la UI con la puntuación actual
     */
    updateHealth() {
        this.label.text = 'Health: ' + this.health;
        this.label.setDepth(10);
    }

    /**
     * Métodos preUpdate de Phaser. En este caso solo se encarga del movimiento del jugador.
     * Como se puede ver, no se tratan las colisiones con las estrellas, ya que estas colisiones 
     * ya son gestionadas por la estrella (no gestionar las colisiones dos veces)
     * @override
     */
    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        // Manejo de disparo
        if (t > this.lastShot + this.shootCooldown) {
            if (this.shootKeys.shootUp.isDown) 
                this.shoot(0, -1);
            else if (this.shootKeys.shootDown.isDown) 
                this.shoot(0, 1);
            else if (this.shootKeys.shootLeft.isDown) 
                this.shoot(-1, 0);
            else if (this.shootKeys.shootRight.isDown) 
                this.shoot(1, 0);
        }
        let acceleration = 300; // Aceleración en px/s²
    let deceleration = 600; // Desaceleración en px/s²
    let maxSpeed = this.speed; // Velocidad máxima permitida

    let velocityX = this.body.velocity.x;
    let velocityY = this.body.velocity.y;

    let newAnimation = `idle-${this.lastDirection}`; // Animación por defecto

    if (this.cursors.up.isDown) {
        velocityY = Phaser.Math.Clamp(velocityY - acceleration * (dt / 1000), -maxSpeed, maxSpeed);
        this.lastDirection = 'back';
        newAnimation = "walk-back";
    } else if (this.cursors.down.isDown) {
        velocityY = Phaser.Math.Clamp(velocityY + acceleration * (dt / 1000), -maxSpeed, maxSpeed);
        this.lastDirection = 'front';
        newAnimation = "walk-front";
    } else {
        // Aplicar desaceleración progresiva cuando no se mueve
        velocityY = Phaser.Math.Clamp(velocityY - Math.sign(velocityY) * deceleration * (dt / 1000), -maxSpeed, maxSpeed);
        if (Math.abs(velocityY) < 10) velocityY = 0;
    }

    if (this.cursors.left.isDown) {
        velocityX = Phaser.Math.Clamp(velocityX - acceleration * (dt / 1000), -maxSpeed, maxSpeed);
        this.lastDirection = 'left';
        newAnimation = "walk-left";
    } else if (this.cursors.right.isDown) {
        velocityX = Phaser.Math.Clamp(velocityX + acceleration * (dt / 1000), -maxSpeed, maxSpeed);
        this.lastDirection = 'right';
        newAnimation = "walk-right";
    } else {
        velocityX = Phaser.Math.Clamp(velocityX - Math.sign(velocityX) * deceleration * (dt / 1000), -maxSpeed, maxSpeed);
        if (Math.abs(velocityX) < 10) velocityX = 0;
    }

    if (velocityX === 0 && velocityY === 0) {
        if (!this.anims.currentAnim || !this.anims.currentAnim.key.startsWith('shoot')) {
            this.play(`idle-${this.lastDirection}`, true);
        }
    } else {
        if (!this.anims.currentAnim || !this.anims.currentAnim.key.startsWith('shoot')) {
            this.anims.play(newAnimation, true);
        }
    }

    this.body.setVelocity(velocityX, velocityY);

    if (this.scene.time.now > this.lastHurtTime + this.damageCooldown) {
        this.setTint(0xffffff);
    }
    }

    shoot(dirX, dirY) {
        console.log("Shooting");
         // Verificar si ya está en cooldown
        if (this.scene.time.now < this.lastShot + this.shootCooldown) return;

         // Determinar la dirección del disparo
        let shootAnimation = '';
        if (dirY === -1) {
            shootAnimation = 'shoot-back';
        } else if (dirY === 1) {
            shootAnimation = 'shoot-front';
        } else if (dirX === -1) {
            shootAnimation = 'shoot-left';
        } else if (dirX === 1) {
            shootAnimation = 'shoot-right';
        }

        console.log(`disparando hacia: ${shootAnimation}`);

        // Guardar la animación actual para volver a ella después del disparo
        const currentAnimation = `idle-${this.lastDirection}`;

        // Reproducir la animación de disparo
        this.play(shootAnimation);

        new Bullet(this.scene, this.x, this.y, dirX, dirY, this.body.velocity.x, this.body.velocity.y, true);
        this.lastShot = this.scene.time.now; // Registrar tiempo del disparo

         // Volver a la animación anterior después de que termine la animación de disparo
        this.once('animationcomplete', () => {
            this.play(currentAnimation);
        });
    }

    /**
     * El jugador ha sido dañado por un enemigo
     */
    hurt(player, bullet) {
        // Verificamos si el cooldown ha pasado desde el último daño
        const currentTime = this.scene.time.now; // Obtiene el tiempo actual en milisegundos
        if (currentTime - this.lastHurtTime >= this.damageCooldown) {
            this.setTint(0xff0000);
          this.health--; // Reducir vida
          this.lastHurtTime = currentTime; // Actualizar el último tiempo de daño
    
          if (this.health <= 0) {
            this.scene.scene.start('end'); // Finalizar el juego si la vida llega a 0
          }
    
          this.updateHealth();
        }
        if(bullet){
            bullet.explode();
        }
      }
    
    healthUp(){
        this.health++;
        this.updateHealth();
    }

}
