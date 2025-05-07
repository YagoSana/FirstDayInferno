import Phaser from 'phaser';
import Bullet from "./bullet";

export default class FreezeBullet extends Bullet {
    constructor(scene, x, y, dirX, dirY, velocityX, velocityY){//Solo pueden ser lanzadas por player y habra un tipo
        super(scene, x, y, dirX, dirY, velocityX, velocityY, true, "pantallazo_azul_bullet");
        this.freeze = true;
    }
}