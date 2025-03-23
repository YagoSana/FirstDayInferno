import Phaser from 'phaser'

import Background from "../../assets/imgs/metro_background.jpg";
import Button from "../../assets/imgs/boton_on.png";
import Button_hover from "../../assets/imgs/boton_hover.png";
import titulo from "../../assets/imgs/titulo.png";
import monogram from "../../fonts/monogram-extended.ttf";

//JUGADOR ------------------------------------------------------
import player from "../../assets/sprites/player_spritesheet.png";

//EXTRAS ------------------------------------------------------
import keyboard_keys from "../../assets/sprites/keys_spritesheet.png";
import paperbullet from "../../assets/sprites/bullet.png";
import puff from "../../assets/sprites/puff.png";

//ITEMS ------------------------------------------------------
import items from "../../assets/sprites/items_spritesheet.png";

//JUGADOR CON ITEMS ----------------------------------------------
import player_items from "../../assets/sprites/player_item.png";

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


    this.load.spritesheet('items', items, {
      frameWidth: 32,
      frameHeight: 32,
    });

    //items del player
    this.load.spritesheet("player_items", player_items, {
      frameWidth: 32,
      frameHeight: 32,
    });

    //sprites de teclas con animacion
    this.load.spritesheet("keyboard_keys", keyboard_keys, {
      frameWidth: 16,
      frameHeight: 16,
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
      frames: this.anims.generateFrameNames("player", {
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

    this.anims.create({
      key: "key_E_action",
      frames: this.anims.generateFrameNames("keyboard_keys", { start: 16, end: 19 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "heart-idle",
      frames: this.anims.generateFrameNames("items", { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "coin-idle",
      frames: this.anims.generateFrameNames("items", { start: 6, end: 11 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "key-idle",
      frames: this.anims.generateFrameNames("items", { start: 12, end: 17 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "vm-idle",
      frames: this.anims.generateFrameNames("items", { start: 18, end: 23 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "vm-using",
      frames: this.anims.generateFrameNames("items", { start: 24, end: 29 }),
      frameRate: 8,
      repeat: -1,
    });

    
    // 🔹 Crear texturas individuales a partir del spritesheet (sin función)
    this.textures.addSpriteSheet('bumbo', this.textures.get('items').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 30
    });

    this.textures.addSpriteSheet('pantallazo_azul', this.textures.get('items').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 31
    });

    this.textures.addSpriteSheet('mini_tinto', this.textures.get('items').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 32
    });

    this.textures.addSpriteSheet('hamburguesa', this.textures.get('items').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 33
    });

    this.textures.addSpriteSheet('collar_macarrones', this.textures.get('items').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 34
    });

    this.textures.addSpriteSheet('bono', this.textures.get('items').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 35
    });

    this.textures.addSpriteSheet('codigo', this.textures.get('items').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 36
    });

    this.textures.addSpriteSheet('maletin', this.textures.get('items').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 37
    });

    this.textures.addSpriteSheet('bolsa_sospechosa', this.textures.get('items').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 38
    });

    this.scene.start('MainMenu');
  }
}