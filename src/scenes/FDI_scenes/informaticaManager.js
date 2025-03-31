import Phaser from "phaser";

//JUGADOR CON ITEMS ----------------------------------------------
import player_item_isaac from "../../../assets/sprites/player_item_isaac.png";

//BALAS --------------------------------------------------------
import arrow from "../../../assets/sprites/arrow.png";
import nerdbullet from "../../../assets/sprites/nerd-bullet.png";
import zombiebullet from "../../../assets/sprites/pastilla.png";

//ENEMIGOS -----------------------------------------------------
import cucaracha from "../../../assets/sprites/cucaracha.png";
import nerdmove from "../../../assets/sprites/nerd-move.png";
import nerdshoot from "../../../assets/sprites/nerd-shoot.png";
import enemydeath from "../../../assets/sprites/enemy_death.png";
import cat_idle from "../../../assets/sprites/cat_idle.png";
import cat_void from "../../../assets/sprites/cat_void.png";
import cat_wake from "../../../assets/sprites/cat_wake.png";
import zombie_move from "../../../assets/sprites/zombie_move.png";
import zombie_shoot from "../../../assets/sprites/zombie_shoot.png";
import embestidaPlaceHolder from "../../../assets/sprites/embestidaPlaceHolder.png";

//MAPAS Y TILES ------------------------------------------------------
import img_grass from "../../../assets/map/TX Tileset Grass.png";
import img_plantas from "../../../assets/map/TX Plant.png";
import img_props from "../../../assets/map/TX Props.png";
import img_sombras from "../../../assets/map/TX Shadow.png";
import img_sombra_plantas from "../../../assets/map/TX Shadow Plant.png";



import pasillofdi from "../../../assets/map/pasillo.json";
import FDI_1_TL from "../../../assets/map/exterior.json";
import FDI_2_TL from "../../../assets/map/pasillo_plantaBaja.json"
import FDI_3_TL from "../../../assets/map/entrada.json";
import FDI_4_TL from "../../../assets/map/cafe.json";
import FDI_5_TL from "../../../assets/map/salon_actos.json";
import FDI_6_TL from "../../../assets/map/biblioteca.json";

import img_interior from "../../../assets/map/Interiors_free_16x16.png";
import img_muebles from "../../../assets/map/Room_Builder_free_16x16.png";

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
export default class informaticaManager extends Phaser.Scene {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: "informaticaManager" });
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
    this.load.image("arrow", arrow);
    this.load.image("embestidaPlaceHolder", embestidaPlaceHolder);
    this.load.image("hamburguesa", hamburguesa);
    this.load.image("miniTinto", miniTinto);
    this.load.image("bumbo", bumbo);

    this.load.spritesheet("moneda", moneda, {
      frameWidth: 32, //cada frame tiene este ancho
      frameHeight: 32, //todos son 32 px de alto
    });

    this.load.spritesheet("cucaracha", cucaracha, {
      frameWidth: 32, //cada frame tiene este ancho
      frameHeight: 32, //todos son 32 px de alto
    });
    // Con setPath podemos establecer el prefijo que se añadirá a todos los load que aparecen a continuación
    //this.load.setPath('assets/sprites/');

    this.load.spritesheet('nerdmove', nerdmove, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('nerdshoot', nerdshoot, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('zombie_move', zombie_move, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('zombie_shoot', zombie_shoot, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("nerdbullet", nerdbullet, {
      frameWidth: 32, //cada frame tiene este ancho
      frameHeight: 24, //todos son 32 px de alto
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

    this.load.image("Grass", img_grass);
    this.load.image("Plantas", img_plantas);
    this.load.image("Props", img_props);
    this.load.image("Sombras", img_sombras);
    this.load.image("SombrasPlantas", img_sombra_plantas);

    //TODO AÑADIR TILES?
    this.load.image("Interior", img_interior);
    this.load.image("Muebles", img_muebles);

    //TODO AÑADIR TILEDJSON (MAPA)

    this.load.tilemapTiledJSON("pasillofdi", pasillofdi);
    this.load.tilemapTiledJSON("FDI_2_TL", FDI_2_TL);
    this.load.tilemapTiledJSON("FDI_1_TL", FDI_1_TL);
    this.load.tilemapTiledJSON("FDI_3_TL", FDI_3_TL);
    this.load.tilemapTiledJSON("FDI_4_TL", FDI_4_TL);
    this.load.tilemapTiledJSON("FDI_5_TL", FDI_5_TL);
    this.load.tilemapTiledJSON("FDI_6_TL", FDI_6_TL);
   

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

    this.anims.create({
      key: "coin-idle",
      frames: this.anims.generateFrameNames("moneda", { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "cucaracha",
      frames: this.anims.generateFrameNames("cucaracha", {
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "nerd_move",
      frames: this.anims.generateFrameNames("nerdmove", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "nerd_shoot",
      frames: this.anims.generateFrameNames("nerdshoot", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] }),
      frameRate: 12,
      repeat: 0,
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
      key: "nerdbullet",
      frames: this.anims.generateFrameNames("nerdbullet", { frames: [0, 1, 2, 3] }),
      frameRate: 8,
      repeat: -1,
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
    this.mapStatus.set("FDI_1", false);
    this.scene.start("FDI_1", {x: 442, y: 375, playerStats: this.playerStats, managerKey: "informaticaManager", status: this.mapStatus.get("FDI_1")});  
  }
    
  cambiarSala(zone){
    this.scene.stop(zone.prev);
    this.mapStatus.set(zone.prev, true);
    console.log(this.mapStatus);
    if(!this.mapStatus.get(zone.spawnRoom)){
      this.mapStatus.set(zone.spawnRoom, false);
    }
    this.scene.start(zone.spawnRoom, {x: zone.spawnX, y: zone.spawnY, playerStats: this.playerStats, managerKey: "informaticaManager", status: this.mapStatus.get(zone.spawnRoom)});
    this.scene.launch('GUI', this.playerStats); // Lanzar la escena de la GUI
  }

  guardarPlayerStats(stats){
    this.playerStats = stats;
  }

  volverAlLobby(actualizarStats){
    this.scene.sleep('informaticaManager');
    this.scene.wake('selectorNivel');
    const selectorNivel = this.scene.get('selectorNivel');
    if(actualizarStats){
      selectorNivel.updatePlayerStats(this.playerStats);
    }
  }
}
