import Phaser from "phaser";

import platform from "../assets/sprites/platform.png";
import base from "../assets/sprites/base.png";
import item from "../assets/sprites/item.png";
import player from "../assets/sprites/player_idle.png";
import player_walking from "../assets/sprites/player_walking.png";
import player_shoot from "../assets/sprites/player_shoot.png";
import bullet from "../assets/sprites/bullet.png";
import enemy from "../assets/sprites/cucaracha.png";
import background from "../assets/sprites/background.png";
import rangedenemy from "../assets/sprites/arquero.png";
import puff from "../assets/sprites/puff.png";
import arrow from "../assets/sprites/arrow.png";

import mapa from "../assets/map/introMedicina.json";
import img_grass from "../assets/map/TX Tileset Grass.png";
import img_plantas from "../assets/map/TX Plant.png";
import img_props from "../assets/map/TX Props.png";
import img_sombras from "../assets/map/TX Shadow.png";
import img_sombra_plantas from "../assets/map/TX Shadow Plant.png";

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
    this.load.image("item", item);
    this.load.image("bullet", bullet);
    this.load.image("arrow", arrow);

    this.load.spritesheet("enemy", enemy, {
      frameWidth: 32, //cada frame tiene este ancho
      frameHeight: 32, //todos son 32 px de alto
    });
    // Con setPath podemos establecer el prefijo que se añadirá a todos los load que aparecen a continuación
    //this.load.setPath('assets/sprites/');

    this.load.spritesheet("rangedenemy", rangedenemy, {
      frameWidth: 32, //cada frame tiene este ancho
      frameHeight: 32, //todos son 32 px de alto
    });

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
    this.load.spritesheet("puff", puff, {
      frameWidth: 32,
      frameHeight: 32,
    });

    //this.load.image("background", background); // Carga la imagen del fondo

    this.load.tilemapTiledJSON("map", mapa); // Carga el mapa

    this.load.image("Grass", img_grass);
    this.load.image("Plantas", img_plantas);
    this.load.image("Props", img_props);
    this.load.image("Sombras", img_sombras);
    this.load.image("SombrasPlantas", img_sombra_plantas);


  }

  /**
   * Creación de la escena. En este caso, solo cambiamos a la escena que representa el
   * nivel del juego
   */
  create() {

    this.map = this.make.tilemap({
      key: "map",
      tileWidth: 32,
      tileHeight: 32,
    });

    const tileset1 = this.map.addTilesetImage('patronGrass', 'Grass');
    const tileset2 = this.map.addTilesetImage('patronPlantas', 'Plantas');
    const tileset3 = this.map.addTilesetImage('patronProps', 'Props');
    const tileset4 = this.map.addTilesetImage('patronSombras', 'Sombras');
    const tileset5 = this.map.addTilesetImage('patronSombrasPlantas', 'SombrasPlantas');

    const layer1 = this.map.createLayer('suelo', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    const layer2 = this.map.createLayer('cesped', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    const layer3 = this.map.createLayer('propsSinColision', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    const layer4 = this.map.createLayer('sombrasPropsConColision', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    const layer5 = this.map.createLayer('propsConColision', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    const layer6 = this.map.createLayer('arboles', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    const layer7 = this.map.createLayer('sombrasArboles', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    /*
    const layer8 = this.map.getObjectLayer('arbustos');
    const layer9 = this.map.getObjectLayer('piedras');
    const layer10 = this.map.getObjectLayer('sombrasPiedras');
    */


    layer1.setVisible(true);
    layer2.setVisible(true);
    layer3.setVisible(true);
    layer4.setVisible(true);
    layer5.setVisible(true);
    layer6.setVisible(true);
    layer7.setVisible(true);

    layer1.depth = 0;
    layer2.depth = 1;
    layer3.depth = 2;
    layer4.depth = 3;
    layer5.depth = 4;
    layer6.depth = 5;
    layer7.depth = 6;



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
      key: "cuca",
      frames: this.anims.generateFrameNames("enemy", {
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "move",
      frames: this.anims.generateFrameNames("rangedenemy", {
        start: 0,
        end: 15,
      }),
      frameRate: 16,
      repeat: -1,
    });

    this.anims.create({
      key: "bullet-puff",
      frames: this.anims.generateFrameNames("puff", { start: 0, end: 7 }),
      frameRate: 24,
      repeat: 0,
    });

    this.scene.start("level");
  }
}
