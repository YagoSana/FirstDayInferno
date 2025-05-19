import Phaser from "phaser";
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
        this.game.events.on('bossDefeated', this.bossDefeated, this);
        this.manager = this.scene.get(this.managerKey);
        if (this.player) {
            this.player.destroy();
        }
        this.completed = false;
        this.numEnemiesBeaten = 0;
        this.numEnemies = 0;

        let uiButtonsScene = this.scene.get('UIButtons');
        uiButtonsScene.updateScene(this.scene.key, this.managerKey);//le pasamos la key de la escena actual

        this.scene.stop('GUI');
        this.scene.launch('GUI', this.playerStats); // Lanzar la escena de la GUI
        this.scene.bringToTop('GUI');
        this.doorFireManager = new DoorFireManager(this);
        this.isDoorLocked = false;
        // emisor de partículas para el parry
        this.emitterParry = this.add.particles(0, 0, 'spark', {
            speed: 100,             // Velocidad fija
            scale: { start: 1, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 500,         // 500ms de vida
            blendMode: 'ADD',      // Para que brillen
            gravityY: 100,         // Pequeña caída
            emitZone: {            // Pequeña área circular
                type: 'edge',
                source: new Phaser.Geom.Circle(0, 0, 2),
                quantity: 6
            },
            visible: false      // No visible por defecto
        }).setDepth(9999);         // Máxima profundidad
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
        //console.log("Numero de enemigos: ", this.numEnemies);
        //console.log("Numero de enemigos derrotados: ", this.numEnemiesBeaten);
        if (this.updateLight) {
            this.updateLight();
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
            if (!this.doorFireManager.checkCreatedFire()) {
                this.doorFireManager.createFiresForZones(this.transitionZones);
            }
        }
    }

    bossDefeated(texto) {
        this.manager.guardarPlayerStats(this.player.getStats());
        this.scene.pause(this.scene.key);
        this.scene.start('MessageScreen', {
            texto: texto,
            prevScene: this.scene.key, // medicina_6
            managerKey: this.managerKey
        });
    }

    shutdown() {
        if (this.uiController) {
            this.uiController.destroy();
        }
    }

    freezeScene() {
        this.physics.world.pause();
        this.scenePaused = true; // opcional para lógica condicional
    }

    unfreezeScene() {
        this.physics.world.resume();
        this.scenePaused = false;
    }

}