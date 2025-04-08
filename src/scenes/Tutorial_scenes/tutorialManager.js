import Phaser from "phaser";
import Player from "../../gameObjects/characters/player";

//ENEMIGOS
import cucaracha from "../../../assets/sprites/cucaracha.png";
import enemydeath from "../../../assets/sprites/enemy_death.png";


//MAPAS Y TILES
import tutorial_1 from "../../../assets/map/tutorial_1.json";
import tutorial_2 from "../../../assets/map/tutorial_2.json";
import tutorial_3 from "../../../assets/map/tutorial_3.json";
import tutorial_debug from "../../../assets/map/tutorial_debug.json";
import img_interior from "../../../assets/map/Interiors_free_16x16.png";
import img_muebles from "../../../assets/map/Room_Builder_free_16x16.png";

//ITEMS


export default class tutorialManager extends Phaser.Scene {
    constructor() {
        super({ key: "tutorialManager" });
    }

    init(data) {
        console.log('Datos recibidos en init:', data);
        // Si los stats del jugador no están disponibles, asigna un valor predeterminado
        if (data && data.playerStats) {
            this.playerStats = data.playerStats;
            this.isTutorial = false;
        } else {
            this.playerStats = { health: 5, maxHealth: 5, coins: 0, keys: 0, equipedItem: null, itemSprite: null, speed: 100, shootCooldown: 500, pantallazo: false, doubleshoot: false }; // Valores predeterminados
            this.isTutorial = true;
        }
    }

    preload() {
        //BARRA DE CARGA
        const { width, height } = this.cameras.main;

        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Cargando...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });

        this.load.spritesheet("cucaracha", cucaracha, {
            frameWidth: 32, //cada frame tiene este ancho
            frameHeight: 32, //todos son 32 px de alto
        });

        this.load.spritesheet("enemydeath", enemydeath, {
            frameWidth: 32, //cada frame tiene este ancho
            frameHeight: 32, //todos son 32 px de alto
        });

        this.load.image("Interior", img_interior);
        this.load.image("Muebles", img_muebles);

        this.load.tilemapTiledJSON("tutorial_1", tutorial_1);
        this.load.tilemapTiledJSON("tutorial_2", tutorial_2);
        this.load.tilemapTiledJSON("tutorial_3", tutorial_3);
        this.load.tilemapTiledJSON("tutorial_debug", tutorial_debug);
    }

    create() {
        this.anims.create({
            key: "cucaracha",
            frames: this.anims.generateFrameNames("cucaracha", {
                frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            }),
            frameRate: 20,
            repeat: -1,
        });

        this.anims.create({
            key: "enemydeath",
            frames: this.anims.generateFrameNames("enemydeath", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] }),
            frameRate: 24,
            repeat: 0,
        });

        this.mapStatus = new Map();
        this.mapStatus.set("tutorial_1", false);
        this.mapStatus.set("tutorial_3", false);
        if (this.isTutorial) {
            this.scene.start("tutorial_1", { x: 238, y: 155, playerStats: this.playerStats, managerKey: "tutorialManager", status: this.mapStatus.get("tutorial_1") });
        }
        else {
            this.scene.start("tutorial_3", { x: 120, y: 50, playerStats: this.playerStats, managerKey: "tutorialManager", status: this.mapStatus.get("tutorial_3") });
        }

    }

    cambiarSala(zone) {
        this.scene.sleep(zone.prev);
        this.mapStatus.set(zone.prev, true);
        console.log(this.mapStatus);
        if (!this.mapStatus.get(zone.spawnRoom)) {
            this.mapStatus.set(zone.spawnRoom, false);
        }
        this.scene.launch(zone.spawnRoom, { x: zone.spawnX, y: zone.spawnY, playerStats: this.playerStats, managerKey: "tutorialManager", status: this.mapStatus.get(zone.spawnRoom) });
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