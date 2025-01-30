import Explosion from "./explosion.js";
export default class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        let y = Phaser.Math.RND.between(0,150);
        let x = Phaser.Math.RND.pick([0, scene.game.config.width]);
        super(scene, x, y);
        let v = new Phaser.Math.Vector2(0,1);
        v.rotate(Phaser.Math.RND.rotation()/2);
        v.scale(50);
        this.scene.add.existing(this);
        this.play('meteor_move');
        this.scene.physics.add.existing(this);
        this.body.setVelocity(v.x, v.y);
        this.body.setAllowGravity(false); 
        this.setRotation(v.angle());
    }

    preUpdate(t,dt) {
        super.preUpdate(t,dt);
        if (this.x <=0){
            this.setPosition(this.scene.game.config.width, this.y);
        }

        if (this.x >this.scene.game.config.width){
            this.setPosition(0, this.y);
        }
    }

    explode() {
        this.scene.add.existing(new Explosion(this.scene, this.x, this.y));
        this.destroy();
    }

    

}