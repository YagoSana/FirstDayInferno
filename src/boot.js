import Phaser from "phaser";

import platform from "../assets/sprites/platform.png";
import base from "../assets/sprites/base.png";
import star from "../assets/sprites/star.png";
import player from "../assets/sprites/player_idle.png";
import bullet from "../assets/sprites/bullet.png";
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
    this.load.image("star", star);
    this.load.image("bullet", bullet);

    // Con setPath podemos establecer el prefijo que se añadirá a todos los load que aparecen a continuación
    //this.load.setPath('assets/sprites/');

    this.load.spritesheet("player", player, {
      frameWidth: 18, //cada frame tiene este ancho
      frameHeight: 32, //todos son 32 px de alto
    });
  }

  /**
   * Creación de la escena. En este caso, solo cambiamos a la escena que representa el
   * nivel del juego
   */
  create() {
    this.anims.create({
      key: "idle-front",
      frames: this.anims.generateFrameNames("player", { frames: [0, 1, 2, 3, 4] }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "idle-back",
      frames: this.anims.generateFrameNames("player", { frames: [5,6,7,8,9]}),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "idle-left",
      frames: this.anims.generateFrameNames("player", { frames: [10,11,12,13,14]}),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "idle-right",
      frames: this.anims.generateFrameNames("player", { frames:[15,16,17,18,19]}),
      frameRate: 5,
      repeat: -1,
    });

    this.scene.start("level");
  }
}
