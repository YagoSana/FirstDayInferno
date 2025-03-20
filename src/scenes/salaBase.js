import Phaser from "phaser";
import Player from "../gameObjects/characters/player";
import Bullet from "../gameObjects/projectiles/bullet";

export default class SalaBase extends Phaser.Scene{

    constructor(key) {
        super({ key: key });
        this.player = null;
        this.manager = null;
    }

    init(data) {
        // Esto se ejecuta antes del create, puedes usarlo para pasar datos generales
        console.log('Datos recibidos en init:', data);
        this.managerKey = data.managerKey; // Para saber de qué manager estamos hablando
        this.playerStats = data.playerStats; // Para pasar datos del jugador
        this.xSpawn = data.x;
        this.ySpawn = data.y;
    }

    create() {
        this.manager = this.scene.get(this.managerKey);
        if(this.player){
            this.player.destroy();
        }
    }

    onBulletCollision(bullet, tile) {
        bullet.explode();
    }

    cambiarSala(player, zone) {
        if(!zone.spawnRoom || !this.player.canChangeRoom) return;
        this.player.canChangeRoom = false;
        this.manager.guardarPlayerStats(this.player.getStats());
        console.log(`DATOS DEL JUGADOR: ${this.player.getStats()}`);
        this.time.delayedCall(1000, () => {
            this.player.canChangeRoom = true;
        });
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.manager.cambiarSala(zone);
        });
    }
}