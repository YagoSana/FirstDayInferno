import Phaser from "phaser";

//ENEMIGOS
import enemydeath from "../../../assets/sprites/enemy_death.png";

import paraninfo_1 from "../../../assets/map/paraninfo_1.json";
import paraninfo_2 from "../../../assets/map/paraninfo_2.json";
import paraninfo_3 from "../../../assets/map/paraninfo_3.json";
import paraninfo_secret from "../../../assets/map/paraninfo_secret.json";
import img_interior from "../../../assets/map/Interiors_free_16x16.png";
import img_muebles from "../../../assets/map/Room_Builder_free_16x16.png";
import img_paraninfo from "../../../assets/map/paraninfo.png";

export default class ParaninfoManager extends Phaser.Scene {
    constructor(){
        super({key: "paraninfoManager"});
    }

    init(data){
        this.playerStats = data.playerStats;
    }

    preload(){

        //Meter nuevo enemigo

        this.load.spritesheet("enemydeath", enemydeath, {
            frameWidth: 32, //cada frame tiene este ancho
            frameHeight: 32, //todos son 32 px de alto
        });

        this.load.image("Interior", img_interior);
        this.load.image("Muebles", img_muebles);
        this.load.image("Paraninfo", img_paraninfo);

        this.load.tilemapTiledJSON("paraninfo_1", paraninfo_1);
        this.load.tilemapTiledJSON("paraninfo_2", paraninfo_2);
        this.load.tilemapTiledJSON("paraninfo_3", paraninfo_3);
        this.load.tilemapTiledJSON("paraninfo_secret", paraninfo_secret);
    }

    create(){

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
