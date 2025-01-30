export default class Explosion extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, direction) {
        super(scene,x,y,'explosion');
        this.on('animationcomplete-explode', function() {
            this.destroy();
        },
            this);
        this.explosionSound = this.scene.sound.add("explosion");
        this.explosionSound.play();
        this.play('explode');
    }
}