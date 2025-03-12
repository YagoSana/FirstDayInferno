import Phaser from "phaser";

import platform from "../../assets/sprites/platform.png";
import base from "../../assets/sprites/base.png";
//JUGADOR ------------------------------------------------------
import player from "../../assets/sprites/player_idle.png";
import player_walking from "../../assets/sprites/player_walking.png";
import player_shoot from "../../assets/sprites/player_shoot.png";
import player_death from "../../assets/sprites/player_death.png";

//JUGADOR CON ITEMS ----------------------------------------------
import player_item_isaac from "../../assets/sprites/player_item_isaac.png";

//BALAS --------------------------------------------------------
import paperbullet from "../../assets/sprites/bullet.png";
import puff from "../../assets/sprites/puff.png";
import arrow from "../../assets/sprites/arrow.png";
import nerdbullet from "../../assets/sprites/nerd-bullet.png";
import zombiebullet from "../../assets/sprites/pastilla.png";

//ENEMIGOS -----------------------------------------------------
import cucaracha from "../../assets/sprites/cucaracha.png";
import nerdmove from "../../assets/sprites/nerd-move.png";
import nerdshoot from "../../assets/sprites/nerd-shoot.png";
import enemydeath from "../../assets/sprites/enemy_death.png";
import cat_idle from "../../assets/sprites/cat_idle.png";
import cat_void from "../../assets/sprites/cat_void.png";
import cat_wake from "../../assets/sprites/cat_wake.png";
import zombie_move from "../../assets/sprites/zombie_move.png";
import zombie_shoot from "../../assets/sprites/zombie_shoot.png";
import embestidaPlaceHolder from "../../assets/sprites/embestidaPlaceHolder.png";

//MAPAS Y TILES ------------------------------------------------------
import mapa from "../../assets/map/introMedicina.json";
import img_grass from "../../assets/map/TX Tileset Grass.png";
import img_plantas from "../../assets/map/TX Plant.png";
import img_props from "../../assets/map/TX Props.png";
import img_sombras from "../../assets/map/TX Shadow.png";
import img_sombra_plantas from "../../assets/map/TX Shadow Plant.png";
import bibliofdi from "../../assets/map/biblioteca.json";
import cafefdi from "../../assets/map/cafe.json";
import pasillofdi from "../../assets/map/pasillo.json";
import img_interior from "../../assets/map/Interiors_free_16x16.png";
import img_muebles from "../../assets/map/Room_Builder_free_16x16.png";

//ITEMS ----------------------------------------------------------
import hamburguesa from "../../assets/sprites/hamburguesa.png";
import moneda from "../../assets/sprites/coin_sheet.png";
import miniTinto from "../../assets/sprites/miniTinto.png";
import bumbo from "../../assets/sprites/uff_referencia.png";


/**
 * Escena para la precarga de los assets que se usarán en el juego.
 * Esta escena se puede mejorar añadiendo una imagen del juego y una
 * barra de progreso de carga de los assets
 * @see {@link https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/} como ejemplo
 * sobre cómo hacer una barra de progreso.
 */
export default class Boot extends Phaser.Scene {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: "boot" });
  }

  /**
   * Carga de los assets del juego
   */
  preload() {


    this.load.image("platform", platform);
    this.load.image("base", base);
    this.load.image("paperbullet", paperbullet);
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

    this.load.spritesheet("player", player, {
      frameWidth: 18, //cada frame tiene este ancho
      frameHeight: 32, //todos son 32 px de alto
    });

    this.load.spritesheet("player_walk", player_walking, {
      frameWidth: 18,
      frameHeight: 32,
    });

    this.load.spritesheet("player_shoot", player_shoot, {
      frameWidth: 20,
      frameHeight: 32,
    });

    this.load.spritesheet("player_death", player_death, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('puff', puff, {
      frameWidth: 32,
      frameHeight: 32,
    });

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

    this.load.tilemapTiledJSON("map", mapa); // Carga el mapa

    //TODO AÑADIR TILEDJSON (MAPA)
    this.load.tilemapTiledJSON("bibliotecafdi", bibliofdi);
    this.load.tilemapTiledJSON("cafefdi", cafefdi);
    this.load.tilemapTiledJSON("pasillofdi", pasillofdi);

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
      key: "idle-front",
      frames: this.anims.generateFrameNames("player", {
        frames: [0, 1, 2, 3, 4],
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "idle-back",
      frames: this.anims.generateFrameNames("player", {
        frames: [5, 6, 7, 8, 9],
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "idle-left",
      frames: this.anims.generateFrameNames("player", {
        frames: [10, 11, 12, 13, 14],
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "idle-right",
      frames: this.anims.generateFrameNames("player", {
        frames: [15, 16, 17, 18, 19],
      }),
      frameRate: 5,
      repeat: -1,
    });

    // Animaciones de caminar
    this.anims.create({
      key: "walk-front",
      frames: this.anims.generateFrameNumbers("player_walk", {
        start: 0,
        end: 7,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-back",
      frames: this.anims.generateFrameNumbers("player_walk", {
        start: 8,
        end: 15,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-left",
      frames: this.anims.generateFrameNumbers("player_walk", {
        start: 16,
        end: 23,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers("player_walk", {
        start: 24,
        end: 31,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "shoot-front",
      frames: this.anims.generateFrameNumbers("player_shoot", {
        start: 0,
        end: 4,
      }),
      frameRate: 12,
      repeat: 0,
    });

    this.anims.create({
      key: "shoot-back",
      frames: this.anims.generateFrameNumbers("player_shoot", {
        start: 5,
        end: 9,
      }),
      frameRate: 12,
      repeat: 0,
    });

    this.anims.create({
      key: "shoot-left",
      frames: this.anims.generateFrameNumbers("player_shoot", {
        start: 10,
        end: 14,
      }),
      frameRate: 12,
      repeat: 0,
    });

    this.anims.create({
      key: "shoot-right",
      frames: this.anims.generateFrameNumbers("player_shoot", {
        start: 15,
        end: 19,
      }),
      frameRate: 12,
      repeat: 0,
    });

    this.anims.create({
      key: "player-death",
      frames: this.anims.generateFrameNumbers("player_death", {
        start: 0,
        end: 10,
      }),
      frameRate: 10,
      repeat: 0,
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
      key: "bullet-puff",
      frames: this.anims.generateFrameNames("puff", { start: 0, end: 7 }),
      frameRate: 24,
      repeat: 0,
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

    this.scene.start("cafeFDI", {x: 408, y: 78});
  }
}
