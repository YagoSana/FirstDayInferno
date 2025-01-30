export default class Jetpac extends Phaser.GameObjects.Container {
    constructor(scene, x, y, sprite) {
        super(scene, x, y);
        this.sprite = new Phaser.GameObjects.Sprite(scene,0,0,sprite);
        this.add(this.sprite);
        this.setDepth(10);
        this.scene.add.existing(this);
        this.sprite.play('jetpac_idle');
        this.setSize(this.sprite.width, this.sprite.height);
        this.scene.physics.add.existing(this);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.fire = this.scene.input.keyboard.addKey('Z');  
        
        this.speed = 50;
        this.fuelItem = null;
        this.pickSound = this.scene.sound.add("pick");
        this.dropSound = this.scene.sound.add("drop");
        this.deadSound = this.scene.sound.add("lose");
        this.deadSound.once("complete", ()=> this.scene.scene.start('menu'));

    }
    
    preUpdate(t,dt) {
        this.sprite.preUpdate(t,dt);
        this.playAnimation();
        let dir = 0;
        if (this.cursors.up.isDown){
            this.body.setAccelerationY(-300);
        } else {
            this.body.setAccelerationY(0);
        }
        if (this.cursors.left.isDown) {
            this.isMoving = true;
            this.sprite.flipX = true;
            dir=-1;
        }
        else if (this.cursors.right.isDown) {
            this.isMoving = true;
            this.sprite.flipX = false;
            dir = 1;
        } else {
            this.isMoving = false;
        }

        // Toroidal
        this.body.setVelocity(dir *this.speed, this.body.velocity.y);
        if (this.x <=0){
            this.setPosition(this.scene.game.config.width, this.y);
        }

        if (this.x >this.scene.game.config.width){
            this.setPosition(0, this.y);
        }

    }
    
    playAnimation() {
        if (this.body.onFloor()) {
            if (this.isMoving) {
                this.sprite.play('jetpac_walk', true);
            } else {
                this.sprite.play('jetpac_idle', true);
            }
        } else {
            this.sprite.play('jetpac_fly', true);
        }
    }

    isCarryingFuel() {
        return this.fuelItem!==null;
    }
    pickFuel(fuelItem) {
        this.fuelItem = fuelItem;
        this.add(this.fuelItem);
        this.fuelItem.setPosition(0,0);
        this.pickSound.play();
    }

    dropFuel(hasToRespawn) {
        this.remove(this.fuelItem);
        this.fuelItem.setVisible(false);
        if (hasToRespawn) {
            this.fuelItem.respawn();
        } else {
            this.setVisible(false);
            this.body.setEnable(false);
        }
        this.fuelItem = null;
        this.dropSound.play();
    }

    dead() {
        this.setVisible(false);
        this.setActive(false);
        this.deadSound.play();
    }
}