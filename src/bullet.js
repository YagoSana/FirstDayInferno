import Phaser from 'phaser';

export default class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, dirX, dirY, velocityX, velocityY) {
        super(scene, x, y, "bullet"); // Asegúrate de tener la imagen cargada en preload()
        scene.add.existing(this);
        scene.bulletGroup.add(this);
        scene.physics.add.existing(this);
        this.speed = 400; // Velocidad de la bala
        // Ajustar la velocidad según la dirección
        this.body.setVelocity(
            (dirX * this.speed) + velocityX * 0.5, // velocidad de la bala + inercia del jugador en el eje X
            (dirY * this.speed) + velocityY * 0.5 // velocidad de la bala + inercia del jugador en el eje Y
        );
        this.body.setAllowGravity(false);
        this.scene.physics.add.collider(this, scene.platformGroup, this.destroy, null, this);
        this.body.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        this.scene.physics.world.on('worldbounds', (body) => {
            if (body.gameObject === this) { // Verificar si es esta bala
                this.destroy();
            }
        });
    }
}
