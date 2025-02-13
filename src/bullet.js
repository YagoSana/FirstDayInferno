import Phaser from 'phaser';

export default class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, dirX, dirY, velocityX, velocityY, isPlayer) {
        super(scene, x, y, "bullet"); // Asegúrate de tener la imagen cargada en preload()
        scene.add.existing(this);
        scene.physics.add.existing(this);
        if(isPlayer){
            scene.bulletGroup.add(this);
            this.speed = 400; // Velocidad de la bala
        };
        if(!isPlayer){
            scene.enemyBulletGroup.add(this);
            this.speed = 200; // Velocidad de la bala
        };
        // Ajustar la velocidad según la dirección
        if(dirX==1&&velocityX!=0){
            velocityX=0;
        }
        if(dirY==1&&velocityY!=0){
            velocityY=0;
        }
        this.body.setVelocity(
            (dirX * this.speed) + velocityX * 0.7, // velocidad de la bala + inercia del jugador en el eje X
            (dirY * this.speed) + velocityY * 0.7 // velocidad de la bala + inercia del jugador en el eje Y
        );
        this.body.setAllowGravity(false);
        this.scene.physics.add.collider(this, scene.platformGroup, this.explode, null, this);
        this.body.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
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
        this.play("bullet-puff");
        
        // Esperar el tiempo de duración de la animación antes de destruir la bala
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.destroy();
        });
    }
}
