import Phaser from 'phaser'

import Background from "../../assets/imgs/metro_background.jpg";
import Button from "../../assets/imgs/boton_on.png";
import Button_hover from "../../assets/imgs/boton_hover.png";
import titulo from "../../assets/imgs/titulo.png";
import monogram from "../../fonts/monogram-extended.ttf";

//JUGADOR ------------------------------------------------------
import player from "../../assets/sprites/player_spritesheet.png";

//EXTRAS ------------------------------------------------------
import paperbullet from "../../assets/sprites/bullet.png";
import puff from "../../assets/sprites/puff.png";


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
    super({ key: 'boot' });
  }

  loadFont(name, url) {
    let newFont = new FontFace(name, `url(${url})`);
    newFont.load().then(function (loaded) {
      document.fonts.add(loaded);
    }).catch(function (error) {
      return error;
    });
  }

  /**
   * Carga de los assets del juego
   */
  preload() {
    this.loadFont('monogram', monogram);
    this.load.image('background', Background);
    this.load.image('title', titulo);
    this.load.image('button', Button);
    this.load.image('button_hover', Button_hover)


    this.load.image("paperbullet", paperbullet);

    this.load.spritesheet("player", player, {
      frameWidth: 32, //cada frame tiene este ancho
      frameHeight: 32, //todos son 32 px de alto
    });

    this.load.spritesheet('puff', puff, {
      frameWidth: 32,
      frameHeight: 32,
    });

  }

  /**
   * Creación de la escena. En este caso, solo cambiamos a la escena que representa el
   * nivel del juego
   */
  create() {

    this.anims.create({
      key: "idle-front",
      frames: this.anims.generateFrameNames("player", {
        start: 0,
        end: 4,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "idle-back",
      frames: this.anims.generateFrameNames("player", {
        start: 5,
        end: 9,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "idle-left",
      frames: this.anims.generateFrameNames("player", {
        start: 10,
        end: 14,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "idle-right",
      frames: this.anims.generateFrameNames("player",{
        start: 15,
        end: 19,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "shoot-front",
      frames: this.anims.generateFrameNumbers("player", {
        start: 20,
        end: 24,
      }),
      frameRate: 12,
      repeat: 0,
    });

    this.anims.create({
      key: "shoot-back",
      frames: this.anims.generateFrameNumbers("player", {
        start: 25,
        end: 29,
      }),
      frameRate: 12,
      repeat: 0,
    });

    this.anims.create({
      key: "shoot-left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 30,
        end: 34,
      }),
      frameRate: 12,
      repeat: 0,
    });

    this.anims.create({
      key: "shoot-right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 35,
        end: 39,
      }),
      frameRate: 12,
      repeat: 0,
    });

    // Animaciones de caminar
    this.anims.create({
      key: "walk-front",
      frames: this.anims.generateFrameNumbers("player", {
        start: 40,
        end: 47,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-back",
      frames: this.anims.generateFrameNumbers("player", {
        start: 48,
        end: 55,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 56,
        end: 63,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 64,
        end: 71,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "player-death",
      frames: this.anims.generateFrameNumbers("player", {
        start: 72,
        end: 84,
      }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "bullet-puff",
      frames: this.anims.generateFrameNames("puff", { start: 0, end: 7 }),
      frameRate: 24,
      repeat: 0,
    });


    this.scene.start('MainMenu');
  }
}