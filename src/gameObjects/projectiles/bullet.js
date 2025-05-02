import Phaser from 'phaser';
import SpriteBase from '../spriteBase';

export default class Bullet extends SpriteBase {
    constructor(scene, x, y, dirX, dirY, velocityX, velocityY, isPlayer, type, shooter) {
        super(scene, x, y, type);
        this.type = type;
        if (isPlayer) {
            scene.bulletGroup.add(this);
            this.speed = 200; // Velocidad de la bala
            this.setScale(0.35);
        };
        if (!isPlayer) {
            this.shooter = shooter;
            scene.enemyBulletGroup.add(this);
            this.speed = 200; // Velocidad de la bala
            this.scale = 1;

            console.log(type);

            switch (type) {
                case 'nerdbullet':
                    this.scale = 0.8;
                    break;
                case 'zombiebullet':
                    this.scale = 0.5;
                    break;
                case 'bossMedicinaBullet':
                    this.body.setSize(25, 25);
                    break;
                case 'binaryBullet':
                    this.scale = 0.8;
                    break;
            }
            this.setScale(this.scale);
            console.log(type);
            this.play(type, true);
            if (dirX < 0) {
                this.flipY = true;
                this.flipX = true;
            }
        };
        // Ajustar la velocidad según la dirección
        if ((dirX == 1 || dirX == -1) && velocityX != 0) {
            velocityX = 0;
        }
        if ((dirY == 1 || dirY == -1) && velocityY != 0) {
            velocityY = 0;
        }
        this.body.setVelocity(
            (dirX * this.speed) + velocityX * 0.7, // velocidad de la bala + inercia del jugador en el eje X
            (dirY * this.speed) + velocityY * 0.7 // velocidad de la bala + inercia del jugador en el eje Y
        );
        this.body.setAllowGravity(false);
        this.scene.physics.add.collider(this, scene.platformGroup, this.explode, null, this);
        this.body.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        const angle = Math.atan2(dirY, dirX); // Obtener el ángulo hacia el que apunta la bala
        this.setRotation(angle); // Establecer la rotación de la bala
        this.scene.physics.world.on('worldbounds', (body) => {
            if (body.gameObject === this) { // Verificar si es esta bala
                this.explode();
            }
        });
    }

    explode() {
        // Deshabilitar colisión y movimiento
        this.body.setVelocity(0, 0);
        this.body.enable = false;

        // Reproducir animación de explosión
        this.play("bullet-puff").setScale(0.7);

        // Esperar el tiempo de duración de la animación antes de destruir la bala
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.destroy();
        });
    }

    disappear(){
        this.body.setVelocity(0, 0);
        this.body.enable = false;
        this.destroy();
    }

    disparaOrbe(x, y){
        const velocidad = 200;
        this.scene.physics.moveTo(this, x, y, velocidad);
    }

    parry(){
         // Deshabilitar colisión y movimiento
         this.body.setVelocity(0, 0);
         this.body.enable = false;
 
         // Reproducir animación de explosión
         this.play("parrySmoke").setScale(0.7);
 
         // Esperar el tiempo de duración de la animación antes de destruir la bala
         this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
             this.destroy();
         });
    }
}
