import Phaser from "phaser";
import Npc from './npc.js';

export default class PhantomEnemy extends Npc {
    constructor(scene, x, y, type, key = false){
        super(scene, x, y, type);
        this.type = type;
        this.dropKey = key;
        this.health = 5;
        this.stunCounter = 0;
        this.speed = 80;

        this.invisible = false;
        this.invisibleTimer = 0;
        this.invisibleCooldown = 5000; // cada 5 segundos se vuelve invisible
        this.invisibleDuration = 2000; // permanece invisible 2 segundos

        this.ghostAngle = 0;
this.ghostAngleTimer = 0;
this.ghostAngleDuration = 500;
    }

    preUpdate(t, dt){
        super.preUpdate(t, dt);
    }

    mypreUpdate(t, dt){
        if(this.health > 0){
            this.invisibleTimer += dt;
            if (!this.invisible && this.invisibleTimer >= this.invisibleCooldown) {
                this.invisible = true;
                this.invisibleTimer = 0;
            } else if (this.invisible && this.invisibleTimer >= this.invisibleDuration) {
                this.invisible = false;
                this.invisibleTimer = 0;
            }

            if(this.invisible){
                this.play(`${this.type}_invisible_move`, true);
                this.ghostAngleTimer += dt;
                if (this.ghostAngleTimer >= this.ghostAngleDuration) {
                    const angleToPlayer = Phaser.Math.Angle.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);
                    const randomOffset = Phaser.Math.FloatBetween(-Math.PI / 8, Math.PI / 8);
                    this.ghostAngle = angleToPlayer + randomOffset;
                    this.ghostAngleTimer = 0;
                }
                const vx = Math.cos(this.ghostAngle) * this.speed;
                const vy = Math.sin(this.ghostAngle) * this.speed;
                this.body.setVelocity(vx, vy);
            }else{
                this.play(`${this.type}`, true);
                this.scene.physics.moveToObject(this, this.scene.player, this.speed);
            }

            if(this.stunCounter>0){
                this.stunCounter--;
                if(this.stunCounter>20){
                    this.setTint(0xff0000);
                }      
            } else {
                this.setTint(0xffffff);
            }
        }
    }

    hitBullet(enemy, bullet){//Sobreescribo hitBullet (si esta invisible no le afectan las balas)
        if(!this.invisible){
            super.hitBullet(enemy, bullet);
        }else{
            bullet.disappear();
        }
    }

    //Ver si tengo que sobreescribir hitPlayer (se hace automatico??)
}