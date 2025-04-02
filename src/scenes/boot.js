import Phaser from 'phaser'

import Background from "../../assets/imgs/metro_background.jpg";
import Button from "../../assets/imgs/boton_on.png";
import Button_hover from "../../assets/imgs/boton_hover.png";
import titulo from "../../assets/imgs/titulo.png";
import monogram from "../../fonts/monogram-extended.ttf";

//JUGADOR ------------------------------------------------------
import player from "../../assets/sprites/player_spritesheet.png";
//CAMAERO
import camarero from "../../assets/sprites/bartender_front_iddle.png";
//EXTRAS ------------------------------------------------------
import keyboard_keys from "../../assets/sprites/keys_spritesheet.png";
import paperbullet from "../../assets/sprites/bullet.png";
import puff from "../../assets/sprites/puff.png";
import tutorial_screen from "../../assets/sprites/tutorial_screen_spritesheet.png";
import blood from "../../assets/sprites/blood.png";

//ITEMS ------------------------------------------------------
import items from "../../assets/sprites/items_spritesheet.png";

//JUGADOR CON ITEMS ----------------------------------------------
import player_items from "../../assets/sprites/player_item.png";

//AUDIO ------------------------------------------------------
import musicaMenu from '../../assets/music/mainMenu.ogg';
import buttonHover from '../../assets/music/buttonHover.wav';
import startgame from '../../assets/music/startGame.wav';
import entrarFacultad from '../../assets/music/entrarFacultad.wav';
import salirPausa from '../../assets/music/salirPausa.wav';
import enemigoSueltaMoneda from '../../assets/music/enemigoSueltaMoneda.wav';
import disparaJugador from '../../assets/music/disparaJugador.wav';
import cogerMoneda from '../../assets/music/coin.wav';
import andarJugador from '../../assets/music/andarJugador.wav';
import facultadMedicinaOst from '../../assets/music/facultadMedicina.ogg';
//GUI ------------------------------------------------------
import vidaJugador from "../../assets/sprites/vidaPlayer.png";
import player_gui from "../../assets/sprites/gui_spritesheet.png";


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
    //AUDIO
    this.load.audio('musicaMenu', musicaMenu);
    this.load.audio('buttonHover', buttonHover);
    this.load.audio('startgame', startgame);
    this.load.audio('entrarFacultad', entrarFacultad);
    this.load.audio('salirPausa', salirPausa);
    this.load.audio('enemigoSueltaMoneda', enemigoSueltaMoneda);
    this.load.audio('disparaJugador', disparaJugador);
    this.load.audio('cogerMoneda', cogerMoneda);
    this.load.audio('andarJugador', andarJugador);
    this.load.audio('facultadMedicinaOst', facultadMedicinaOst);
    //AUDIO
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

    this.load.spritesheet("player_gui", player_gui, {
      frameWidth: 32, //cada frame tiene este ancho
      frameHeight: 32, //todos son 32 px de alto
    });

    this.load.spritesheet("player_gui_64", player_gui, {
      frameWidth: 64, //cada frame tiene este ancho
      frameHeight: 32, //todos son 32 px de alto
    });
    
    this.load.spritesheet("bartender", camarero, {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet('vidaJugador', vidaJugador, {
      frameWidth: 16,
      frameHeight: 16
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

    this.load.spritesheet("tutorial_screen", tutorial_screen, {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("blood", blood, {
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
      key: "idle-front-bartender",
      frames: this.anims.generateFrameNames("bartender", {
        start: 0,
        end: 2,
      }),
      frameRate: 5,
      repeat: -1,
    });

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
      key: "item-puff",
      frames: this.anims.generateFrameNames("puff", { start: 0, end: 7 }),
      frameRate: 10,
      repeat: 3,
    });
    
    this.anims.create({
      key: "key-idle",
      frames: this.anims.generateFrameNames("items", { start: 12, end: 17 }),
      frameRate: 6,
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
      repeat: 1,
    });

    this.anims.create({
      key: "tutorial_screen_1",
      frames: this.anims.generateFrameNames("tutorial_screen", { start: 0, end: 47 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "tutorial_screen_2",
      frames: this.anims.generateFrameNames("tutorial_screen", { start: 48, end: 95 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "blood",
      frames: this.anims.generateFrameNames("blood", { start: 0, end: 12 }),
      frameRate: 20,
      repeat: 0,
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

    //PLAYER GUI-----------------------------------------------------------
    this.textures.addSpriteSheet('boton_sonido', this.textures.get('player_gui').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 0
    });

    this.textures.addSpriteSheet('boton_sonido_hover', this.textures.get('player_gui').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 1
    });

    this.textures.addSpriteSheet('boton_pausa', this.textures.get('player_gui').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 2
    });

    this.textures.addSpriteSheet('boton_pausa_hover', this.textures.get('player_gui').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 3
    });

    this.textures.addSpriteSheet('status_frame', this.textures.get('player_gui').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 4
    });

    this.textures.addSpriteSheet('status_frame_background', this.textures.get('player_gui').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 5
    });

    this.textures.addSpriteSheet('player_stats_gui', this.textures.get('player_gui_64').getSourceImage(), {
      frameWidth: 64,
      frameHeight: 32,
      startFrame: 3
        });

    this.textures.addSpriteSheet('gui_heart', this.textures.get('player_gui').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 8
    });

    this.textures.addSpriteSheet('gui_heart_extra', this.textures.get('player_gui').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 9
    });

    this.textures.addSpriteSheet('gui_heart_empty', this.textures.get('player_gui').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 10
    });

    this.textures.addSpriteSheet('gui_heart_blank', this.textures.get('player_gui').getSourceImage(), {//para hacerle setTint
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 11
    });

    this.anims.create({
      key: "gui_player_idle",
      frames: this.anims.generateFrameNames("player_gui", { start: 12, end: 13 }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "gui_player_hurt",
      frames: this.anims.generateFrameNames("player_gui", { start: 14, end: 15 }),
      frameRate: 2,
      repeat: -1,
    });



    this.scene.start('MainMenu');
  }
}