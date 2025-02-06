import Phaser from 'phaser';
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
        this.score = 0;

        this.setScale(2);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        // Queremos que el jugador no se salga de los límites del mundo
        this.body.setCollideWorldBounds();
        this.speed = 300;
        this.body.setAllowGravity(false);
        // Esta label es la UI en la que pondremos la puntuación del jugador
        this.label = this.scene.add.text(10, 10, "", {fontSize: 20});
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.updateScore();
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
    }

    /**
     * El jugador ha recogido una estrella por lo que este método añade un punto y
     * actualiza la UI con la puntuación actual.
     */
    point() {
        this.score++;
        this.updateScore();
    }

    /**
     * Actualiza la UI con la puntuación actual
     */
    updateScore() {
        this.label.text = 'Score: ' + this.score;
    }

    /**
     * Métodos preUpdate de Phaser. En este caso solo se encarga del movimiento del jugador.
     * Como se puede ver, no se tratan las colisiones con las estrellas, ya que estas colisiones 
     * ya son gestionadas por la estrella (no gestionar las colisiones dos veces)
     * @override
     */
    preUpdate(t, dt) {
        super.preUpdate(t, dt);
    
        let velocityX = 0;
        let velocityY = 0;
    
        if (this.cursors.up.isDown) {
            velocityY = -this.speed;
            this.lastDirection = 'back';
        } else if (this.cursors.down.isDown) {
            velocityY = this.speed;
            this.lastDirection = 'front';
        }
    
        if (this.cursors.left.isDown) {
            velocityX = -this.speed;
            this.lastDirection = 'left';
        } else if (this.cursors.right.isDown) {
            velocityX = this.speed;
            this.lastDirection = 'right';
        }

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

        // Si no se mueve, aplicar la animación idle según la última dirección
        if (velocityX === 0 && velocityY === 0) {
            this.play(`idle-${this.lastDirection}`, true);
        }
    
        // Aplicar las velocidades al jugador
        this.body.setVelocity(velocityX, velocityY);
    }

    shoot(dirX, dirY) {
        console.log("Shooting");
        new Bullet(this.scene, this.x, this.y, dirX, dirY, this.body.velocity.x, this.body.velocity.y);
        this.lastShot = this.scene.time.now; // Registrar tiempo del disparo
    }
    

}
