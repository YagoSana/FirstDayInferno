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
        this.status = data.status;
    }

    create() {
        this.manager = this.scene.get(this.managerKey);
        if(this.player){
            this.player.destroy();
        }
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.completed = false;
        this.numEnemiesBeaten = 0;
        this.numEnemies = 0;
    }

    onBulletCollision(bullet, tile) {
        bullet.explode();
    }

    cambiarSala(player, zone) {
        if(!zone.spawnRoom || !this.player.canChangeRoom || !zone.open) return;
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

    update() {
        // Abrir el menú de pausa al presionar ESC
        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
          console.log(`Escena anterior: ${this.scene.key}`);
          this.scene.pause(); // Pausar la escena actual
          this.scene.launch('PauseMenu', { previousScene: this.scene.key }); // Lanzar la escena de pausa
          this.scene.bringToTop('PauseMenu'); // Asegurarse de que PauseMenu esté en la parte superior
        }
        if(this.numEnemiesBeaten == this.numEnemies){
            this.completed = true;
            this.transitionZones.getChildren().forEach(zone => {
                zone.open = true;
            });
        }
      }
}