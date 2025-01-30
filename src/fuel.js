export default class Fuel extends Phaser.GameObjects.Sprite {
    constructor (scene) {
        let offset = 10;
        let x = Phaser.Math.RND.between(0+offset, scene.game.config.width-offset);
        let y = Phaser.Math.RND.between(0+offset, scene.game.config.height-offset);
        super(scene, x, y, 'fuel');
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.scene.physics.add.overlap(this, this.scene.player, (me, thePlayer) => this.onCollision(me, thePlayer));
        this.picked = false;
        
    }

    onCollision(me, thePlayer) {
        if (!this.picked){
            thePlayer.pickFuel(this);
            this.picked = true;
            this.body.setAllowGravity(false);
            
        }
    }

    respawn() {
        this.picked = false;
        this.setVisible(true);
        let x = Phaser.Math.RND.integerInRange(0+this.width, this.scene.game.config.width-this.width);
        this.setPosition(x,0);
        this.body.setAllowGravity(true);
    }
}