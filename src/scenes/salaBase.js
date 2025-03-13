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
        this.managerKey = data.managerKey; // Para saber de qué manager estamos hablando
        this.playerData = data.playerData; // Para pasar datos del jugador
    }

    create() {
        this.manager = this.scene.get(this.managerKey);
        // Crear el player
        this.player = new Player(this, 100, 100, this.playerData);
    }

    onBulletCollision(bullet, tile) {
        bullet.explode();
    }
    
    cambiarSala(nivel) {
        this.manager.guardarPlayerStats(this.player.getStats());
        this.manager.cambiarSala(nivel);
    }
}