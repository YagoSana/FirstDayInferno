import Phaser from "phaser";
import Player from "../gameObjects/characters/player";
import Bullet from "../gameObjects/projectiles/bullet";
import PauseController from "../controller/pauseController";
import DoorFireManager from "./doorFireManager";

export default class SalaBase extends Phaser.Scene {

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
        if (this.player) {
            this.player.destroy();
        }
        this.completed = false;
        this.numEnemiesBeaten = 0;
        this.numEnemies = 0;
        this.pauseController = new PauseController(this, { x: this.cameras.main.width - 250, y: 135, scale: 0.8 });
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.scene.stop('GUI');
        this.scene.launch('GUI', this.playerStats); // Lanzar la escena de la GUI
        this.scene.bringToTop('GUI');
        this.doorFireManager = new DoorFireManager(this);
        this.isDoorLocked = false;
    }


    onBulletCollision(bullet, tile) {
        bullet.explode();
    }

    cambiarSala(player, zone) {
        if (!zone.spawnRoom || !this.player.canChangeRoom || !zone.open) return;
        this.player.canChangeRoom = false;
        this.manager.guardarPlayerStats(this.player.getStats());
        this.time.delayedCall(1000, () => {
            this.player.canChangeRoom = true;
        });
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.manager.cambiarSala(zone);
        });
    }

    update() {
        // console.log("Numero de enemigos: ", this.numEnemies);
        // console.log("Numero de enemigos derrotados: ", this.numEnemiesBeaten);
        if(this.updateLight) {
            this.updateLight();
        }
        if(this.bossStatus){
            this.bossStatus();
        }
        // Abrir el menú de pausa al presionar ESC
        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.pauseController.togglePause();
        }
        if (this.numEnemiesBeaten == this.numEnemies) {
            this.completed = true;
            this.transitionZones.getChildren().forEach(zone => {
                zone.open = true;
            });
            this.doorFireManager.endFireAnimation();
        }
        if (this.numEnemiesBeaten < this.numEnemies) {
            this.transitionZones.getChildren().forEach(zone => {
                zone.open = false;
            });
            if(!this.doorFireManager.checkCreatedFire()){
                this.doorFireManager.createFiresForZones(this.transitionZones);
            }
        }
    }

    shutdown() {
        if (this.pauseController) {
            this.pauseController.destroy();
        }
    }
}