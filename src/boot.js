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

  /**
   * Carga de los assets del juego
   */
  preload() {
    // Con setPath podemos establecer el prefijo que se añadirá a todos los load que aparecen a continuación
    this.load.setPath('assets/');
    this.load.spritesheet('jetpac', 'sprites/jetpac.png', { frameWidth: 17, frameHeight: 24 });
    this.load.tilemapTiledJSON('tilemap', 'map/tilemap.json');
    this.load.image('ground_ts', 'sprites/tileset.png');
    this.load.image('fuel', 'sprites/fuel.png');
    this.load.image('spaceship', 'sprites/spaceship.png');
    this.load.spritesheet('meteor', 'sprites/meteor.png', { frameWidth: 16, frameHeight: 14 });
    this.load.spritesheet('explosion', 'sprites/explosion.png', { frameWidth: 24, frameHeight: 17 });
    this.load.audio("explosion", "sounds/explosion.wav");
    this.load.audio("win", "sounds/win.wav");
    this.load.audio("lose", "sounds/lose.wav");
    this.load.audio("pick", "sounds/pick.wav");
    this.load.audio("drop", "sounds/drop.wav");
  }

  /**
   * Creación de la escena. En este caso, solo cambiamos a la escena que representa el
   * nivel del juego
   */
  create() {
    this.anims.create({
      key: 'jetpac_idle',
      frames: this.anims.generateFrameNames('jetpac', { start: 4, end: 4 }),
      frameRate: 0,
      repeat: 0
    });

    this.anims.create({
      key: 'jetpac_walk',
      frames: this.anims.generateFrameNames('jetpac', { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'jetpac_fly',
      frames: this.anims.generateFrameNames('jetpac', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'meteor_move',
      frames: this.anims.generateFrameNames('meteor', { start: 0, end: 1 }),
      frameRate: 3,
      repeat: -1
    });

    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNames('explosion', { start: 0, end: 2 }),
      frameRate: 6,
    });
    this.scene.start('menu');
  }


}