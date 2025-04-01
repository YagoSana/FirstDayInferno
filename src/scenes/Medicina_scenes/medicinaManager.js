import Phaser from "phaser";

//JUGADOR CON ITEMS ----------------------------------------------
import player_item_isaac from "../../../assets/sprites/player_item_isaac.png";

//BALAS --------------------------------------------------------
import zombiebullet from "../../../assets/sprites/pastilla.png";

//ENEMIGOS -----------------------------------------------------
import enemydeath from "../../../assets/sprites/enemy_death.png";
import cat_idle from "../../../assets/sprites/cat_idle.png";
import cat_void from "../../../assets/sprites/cat_void.png";
import cat_wake from "../../../assets/sprites/cat_wake.png";
import zombie_move from "../../../assets/sprites/zombie_move.png";
import zombie_shoot from "../../../assets/sprites/zombie_shoot.png";

//MAPAS Y TILES ------------------------------------------------------
import introMedicina from "../../../assets/map/introMedicina.json";
import medicina_2 from "../../../assets/map/hallMedicina.json";
import medicina_3 from "../../../assets/map/pasilloMedicina.json";
import medicina_4 from "../../../assets/map/aulaMedicina.json";
import medicina_5 from "../../../assets/map/pasillo2Medicina.json";
import medicina_6 from "../../../assets/map/aulaFinalMedicina.json";

import img_interior from "../../../assets/map/Interiors_free_16x16.png";
import img_muebles from "../../../assets/map/Room_Builder_free_16x16.png";
import tileset_grass from "../../../assets/map/TX Tileset Grass.png";
import tileset_plantas from "../../../assets/map/TX Plant.png";
import tileset_props from "../../../assets/map/TX Props.png";
import tileset_sombras from "../../../assets/map/TX Shadow.png";
import tileset_sombra_plantas from "../../../assets/map/TX Shadow Plant.png";


//ITEMS ----------------------------------------------------------
import hamburguesa from "../../../assets/sprites/hamburguesa.png";
import moneda from "../../../assets/sprites/coin_sheet.png";
import miniTinto from "../../../assets/sprites/miniTinto.png";
import bumbo from "../../../assets/sprites/uff_referencia.png";


/**
 * Escena para la precarga de los assets que se usarán en el juego.
 * Esta escena se puede mejorar añadiendo una imagen del juego y una
 * barra de progreso de carga de los assets
 * @see {@link https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/} como ejemplo
 * sobre cómo hacer una barra de progreso.
 */
export default class medicinaManager extends Phaser.Scene {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: "medicinaManager" });
  }

  init(data){
    this.playerStats = data.playerStats;
    console.log(this.playerStats);
  }

  /**
   * Carga de los assets del juego
   */
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
    //BARRA DE CARGA

    this.load.image("zombiebullet", zombiebullet);
    this.load.image("hamburguesa", hamburguesa);
    this.load.image("miniTinto", miniTinto);
    this.load.image("bumbo", bumbo);

    this.load.spritesheet("moneda", moneda, {
      frameWidth: 32, //cada frame tiene este ancho
      frameHeight: 32, //todos son 32 px de alto
    });

    this.load.spritesheet('zombie_move', zombie_move, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('zombie_shoot', zombie_shoot, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("enemydeath", enemydeath, {
      frameWidth: 32, //cada frame tiene este ancho
      frameHeight: 32, //todos son 32 px de alto
    });

    this.load.spritesheet("cat_idle", cat_idle, {
      frameWidth: 16,
      frameHeight: 8,
    });

    this.load.spritesheet("cat_void", cat_void, {
      frameWidth: 15,
      frameHeight: 16,
    });

    this.load.spritesheet("cat_wake", cat_wake, {
      frameWidth: 17,
      frameHeight: 11,
    });

    //TODO AÑADIR TILES?
    this.load.image("Interior", img_interior);
    this.load.image("Muebles", img_muebles);
    this.load.image("Grass", tileset_grass);
    this.load.image("Plantas", tileset_plantas);
    this.load.image("Props", tileset_props);
    this.load.image("Sombras", tileset_sombras);
    this.load.image("SombrasPlantas", tileset_sombra_plantas);

    //TODO AÑADIR TILEDJSON (MAPA)
    this.load.tilemapTiledJSON("introMedicina", introMedicina);
    this.load.tilemapTiledJSON("medicina_2", medicina_2);
    this.load.tilemapTiledJSON("medicina_3", medicina_3);
    this.load.tilemapTiledJSON("medicina_4", medicina_4);
    this.load.tilemapTiledJSON("medicina_5", medicina_5);
    this.load.tilemapTiledJSON("medicina_6", medicina_6);
    
    //items del player
    this.load.spritesheet("player_item_isaac", player_item_isaac,{
      frameWidth:32,
      frameHeight:32,
    });

  }

  /**
   * Creación de la escena. En este caso, solo cambiamos a la escena que representa el
   * nivel del juego
   */
  create() {
    this.music = this.sound.add("facultadMedicinaOst", { volume: 0.5, loop: true });
    this.music.play();

    this.anims.create({
      key: "coin-idle",
      frames: this.anims.generateFrameNames("moneda", { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "zombie_move",
      frames: this.anims.generateFrameNames("zombie_move", { frames: [0, 1, 2, 3] }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "zombie_shoot",
      frames: this.anims.generateFrameNames("zombie_shoot", { frames: [0, 1, 2, 3, 4] }),
      frameRate: 12,
      repeat: 0,
    });

    this.anims.create({
      key: "enemydeath",
      frames: this.anims.generateFrameNames("enemydeath", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] }),
      frameRate: 24,
      repeat: 0,
    });

    this.anims.create({
      key: "cat_idle",
      frames: this.anims.generateFrameNames("cat_idle", { frames: [0, 1, 2, 3] }),
      frameRate: 4,
      repeat: -1,
    });

    this.anims.create({
      key: "cat_void",
      frames: this.anims.generateFrameNames("cat_void", { frames: [0, 1, 2, 3, 4, 5] }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "cat_wake",
      frames: this.anims.generateFrameNames("cat_wake", { frames: [0, 1, 2, 3, 4, 5, 6, 7] }),
      frameRate: 12,
      repeat: 0,
    });

    this.mapStatus = new Map();
    this.mapStatus.set("introMedicina", false);
    this.scene.start("introMedicina", {x: 320, y: 290, playerStats: this.playerStats, managerKey: "medicinaManager", status: this.mapStatus.get("introMedicina")});  }
  

  cambiarSala(zone){
    this.scene.stop(zone.prev);
    this.mapStatus.set(zone.prev, true);
    console.log(zone.spawnRoom);
    if(!this.mapStatus.get(zone.spawnRoom)){
      this.mapStatus.set(zone.spawnRoom, false);
    }
    this.scene.start(zone.spawnRoom, {x: zone.spawnX, y: zone.spawnY, playerStats: this.playerStats, managerKey: "medicinaManager", status: this.mapStatus.get(zone.spawnRoom)});
    this.scene.launch('GUI', this.playerStats);
  }

  guardarPlayerStats(stats){
    this.playerStats = stats;
  }

  volverAlLobby(actualizarStats){
    this.scene.sleep('medicinaManager');
    this.scene.wake('selectorNivel');
    const selectorNivel = this.scene.get('selectorNivel');
    if(actualizarStats){
      selectorNivel.updatePlayerStats(this.playerStats);
    }
  }
}
