export default class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, direction) {
        super(scene,x,y,'bullet');
        this.speed = 200;
        this.direction = direction;
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);
        this.body.setVelocity(direction.x*this.speed, direction.y*this.speed);
        let dir = new Phaser.Math.Vector2(direction.x, direction.y);
        this.setAngle(dir.angle()*Phaser.Math.RAD_TO_DEG);

        this.scene.physics.add.overlap(this, this.scene.enemies, (bullet, enemy) => { enemy.damage(); bullet.destroy(); });
    }

    preUpdate (t, dt) {
        super.preUpdate(t,dt);
        
    }
}