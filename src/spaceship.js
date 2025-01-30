export default class Spaceship extends Phaser.GameObjects.Sprite {
    constructor (scene, x, fuelNeeded) {
        super(scene, x, scene.game.config.height-8, 'spaceship');
        this.setOrigin(0.5,1);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.scene.physics.add.overlap(this, this.scene.player, (me, thePlayer) => this.onCollision(me, thePlayer));
        this.fuelNeeded = fuelNeeded;
        this.currentFuel = 0;
        this.setDepth(0);

        this.body.moves=false;
        this.hud = this.scene.add.text(this.x, this.y-this.height-10, `${this.currentFuel}/${this.fuelNeeded}`, { fontFamily: 'Pixeled', fontSize: 8, color: '#ffffff' });
        this.hud.setOrigin(0.5, 0.5).setAlign("center");
        this.winSound = this.scene.sound.add("win");
        
    }

    onCollision(me, thePlayer) {
        if (thePlayer.isCarryingFuel()) {
            
            this.currentFuel++;
            this.hud.text = `${this.currentFuel}/${this.fuelNeeded}`;
            thePlayer.dropFuel(this.fuelNeeded !== this.currentFuel);
            if (this.fuelNeeded === this.currentFuel) {
                this.hud.setVisible(false);
                let tween = this.scene.tweens.add({
                    targets: [ this ],
                    y: -10,
                    duration: 1000,
                    ease: 'Sine.easeOutIn',
                    
                });
                this.winSound.play();
                tween.on('complete', function (){
                     me.scene.scene.start('menu');
                });
            }
        }
    }

}