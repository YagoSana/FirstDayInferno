import Phaser from "phaser";

//ENEMIGOS
import enemydeath from "../../../assets/sprites/enemy_death.png";

import paraninfo_1 from "../../../assets/map/paraninfo_1.json";
import paraninfo_2 from "../../../assets/map/paraninfo_2.json";
import paraninfo_3 from "../../../assets/map/paraninfo_3.json";
import paraninfo_secret from "../../../assets/map/paraninfo_secret.json";

export default class ParaninfoManager extends Phaser.Scene {
    constructor(){
        super({key: "paraninfoManager"});
    }

    init(data){
        if (data && data.playerStats) {
            this.playerStats = data.playerStats;
        } else {
            this.playerStats = { health: 5, maxHealth: 5, coins: 0, keys: 0, equipedItem: null, itemSprite: null, speed: 100, shootCooldown: 500, doubleshoot: false, doorsLocked: { 'secretDoor': true, 'fdiDoor': true, 'medDoor': true, 'candado': true } }; // Valores predeterminados
        }
    }

    preload(){
                //BARRA DE CARGA
        const { width, height } = this.cameras.main;

        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0xff6d05, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
        progressBar.setDepth(100);

        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Cargando...',
            style: {
                fontFamily: 'monogram',
                color: '#FFF33F',
                fontSize: '36px'

            }
        });
        loadingText.setOrigin(0.5, 0.5);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xFFF33F, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });

        //Meter nuevo enemigo

        this.load.spritesheet("enemydeath", enemydeath, {
            frameWidth: 32, //cada frame tiene este ancho
            frameHeight: 32, //todos son 32 px de alto
        });

        this.load.tilemapTiledJSON("paraninfo_1", paraninfo_1);
        this.load.tilemapTiledJSON("paraninfo_2", paraninfo_2);
        this.load.tilemapTiledJSON("paraninfo_3", paraninfo_3);
        this.load.tilemapTiledJSON("paraninfo_secret", paraninfo_secret);
    }

    create(){
        this.music = this.sound.add("sonidoParaninfo", { volume: 0.5, loop: true });
        this.music.play();

        //Meter animacion nuevo enemigo

        this.anims.create({
            key: "enemydeath",
            frames: this.anims.generateFrameNames("enemydeath", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] }),
            frameRate: 24,
            repeat: 0,
        });

        this.mapStatus = new Map();
        this.mapStatus.set("paraninfo_1", false);
        this.scene.start("paraninfo_1", {x: 175, y: 429, playerStats: this.playerStats, managerKey: "paraninfoManager", status: this.mapStatus.get("paraninfo_1")});
    }

    cambiarSala(zone){
        this.scene.sleep(zone.prev);
        this.mapStatus.set(zone.prev, true);
        console.log(this.mapStatus);
        if (!this.mapStatus.get(zone.spawnRoom)) {
            this.mapStatus.set(zone.spawnRoom, false);
        }
        this.scene.launch(zone.spawnRoom, { x: zone.spawnX, y: zone.spawnY, playerStats: this.playerStats, managerKey: "paraninfoManager", status: this.mapStatus.get(zone.spawnRoom) });
    }

    guardarPlayerStats(stats) {
        this.playerStats = stats;
    }

    volverAlLobby(actualizarStats) {
        this.scene.sleep('tutorialManager');
        this.scene.wake('selectorNivel');
        const selectorNivel = this.scene.get('selectorNivel');
        if (actualizarStats) {
            selectorNivel.updatePlayerStats(this.playerStats);
        }
    }
}
