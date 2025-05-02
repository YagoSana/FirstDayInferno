import Phaser from 'phaser'

import Background from "../../assets/imgs/metro_background.jpg";
import Button from "../../assets/imgs/boton_on.png";
import Button_hover from "../../assets/imgs/boton_hover.png";
import pause_bg from "../../assets/imgs/pause_bg.png";
import titulo from "../../assets/imgs/titulo.png";
import monogram from "../../fonts/monogram-extended.ttf";

//JUGADOR ------------------------------------------------------
import player from "../../assets/sprites/player_spritesheet.png";

//ENEMIGOS
import cucaracha from "../../assets/sprites/cucaracha.png";
import nand from "../../assets/sprites/nand.png";
import cat_idle from "../../assets/sprites/cat_idle.png";
import cat_void from "../../assets/sprites/cat_void.png";
import cat_wake from "../../assets/sprites/cat_wake.png";
import zombie_move from "../../assets/sprites/zombie_move.png";
import zombie_shoot from "../../assets/sprites/zombie_shoot.png";
import enemydeath from "../../assets/sprites/enemy_death.png";
import nerdmove from "../../assets/sprites/nerd-move.png";
import nerdshoot from "../../assets/sprites/nerd-shoot.png";
import printer from "../../assets/sprites/printer_spritesheet.png";
import skeleton from "../../assets/sprites/skeleton_spritesheet.png";
import phantom from "../../assets/sprites/phantom.png";

//CAMARERO
import camarero from "../../assets/sprites/bartender_front_iddle.png"

//PROFESOR
import borja from "../../assets/sprites/borja.png"
import borjaPortrait from "../../assets/sprites/borja_frontal_32x32.png";
import borjaMalvado from "../../assets/sprites/borja_malvado.png"

//NPCS 
import hippie from "../../assets/sprites/sprite_hippie_32x32.png"
import hippiePortrait from "../../assets/sprites/hippie.png"

//EXTRAS ------------------------------------------------------
import keyboard_keys from "../../assets/sprites/keys_spritesheet.png";
import puff from "../../assets/sprites/puff.png";
import tutorial_screen from "../../assets/sprites/tutorial_screen_spritesheet.png";
import blood from "../../assets/sprites/blood.png";
import fire from "../../assets/sprites/fire.png";
import parrySmoke from "../../assets/sprites/parrySmoke.png";
import spark from "../../assets/sprites/spark.png";

//ITEMS ------------------------------------------------------
import items from "../../assets/sprites/items_spritesheet.png";
import doors from "../../assets/sprites/doors_spritesheet.png";
import secretDoor from "../../assets/sprites/secretDoor_spritesheet.png";
import lock from "../../assets/sprites/lock.png";
import breakable_table from "../../assets/sprites/breakable_table.png";
import breakable_chair from "../../assets/sprites/breakable_chair.png";
import toilet from "../../assets/sprites/toilet.png"

//JUGADOR CON ITEMS ----------------------------------------------
import player_items from "../../assets/sprites/player_item.png";
import bullets from "../../assets/sprites/bullets_spritesheet.png";
import binaryBullet from "../../assets/sprites/binary-bullet.png";
import server from "../../assets/sprites/server.png";

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
import pop from '../../assets/music/pop.wav';
import explode from '../../assets/music/explode.wav';
import musicaGameOver from '../../assets/music/musicaGameOver.ogg';
import tutorialSonido from '../../assets/music/tutorialSonido.ogg';
import sonidoMaquina from '../../assets/music/sonidoMaquina.wav';
import sonidoParaninfo from '../../assets/music/paraninfo.mp3';
import flush from '../../assets/sounds/flush.mp3';

//GUI ------------------------------------------------------
import mainMenu from "../../assets/sprites/mainmenu.png";
import player_gui from "../../assets/sprites/gui_spritesheet.png";
import game_over_screen from "../../assets/sprites/enemy_game_over.png";
import bartenderImg from "../../assets/sprites/camarero.png";
//BOSS MEDICINA ------------------------------------------------------
import bossMedicinaIdle from "../../assets/sprites/bossMedicinaIdle.png";
import bossMedicinaIdle2 from "../../assets/sprites/bossMedicinaIdle2.png";
import bossMedicinaAssault from "../../assets/sprites/bossMedicinaAssault.png";
import bossMedicinaDeath from "../../assets/sprites/bossMedicinaDeath.png";
import bossMedicinaEspecial from "../../assets/sprites/bossMedicinaEspecial.png";
import bossMedicinaDisparo from "../../assets/sprites/bossMedicinaDisparo.png";
import bossMedicinaBullet from "../../assets/sprites/bossMedicinaBullet.png";
import bossMedicinaBulletAppear from "../../assets/sprites/bossMedicinaBulletAppear.png";
import bossMedicinaBulletDestroy from "../../assets/sprites/bossMedicinaDestroy.png";

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
    this.load.audio('pop', pop);
    this.load.audio('explode', explode);
    this.load.audio('musicaGameOver', musicaGameOver);
    this.load.audio('tutorialSonido', tutorialSonido);
    this.load.audio('sonidoMaquina', sonidoMaquina);
    this.load.audio('sonidoParaninfo', sonidoParaninfo);
    this.load.audio('flush', flush);
    //AUDIO
    this.loadFont('monogram', monogram);
    this.load.image('background', Background);
    this.load.image('title', titulo);
    this.load.image('button', Button);
    this.load.image('button_hover', Button_hover)
    this.load.image('pause_bg', pause_bg)
    this.load.image('spark', spark);
    //BOSS MEDICINA
    this.load.spritesheet("bossMedicinaIdle", bossMedicinaIdle, {
      frameWidth: 100,
      frameHeight: 100,
    });
    this.load.spritesheet("bossMedicinaIdle2", bossMedicinaIdle2, {
      frameWidth: 100,
      frameHeight: 100,
    });

    this.load.spritesheet("bossMedicinaAssault", bossMedicinaAssault, {
      frameWidth: 100,
      frameHeight: 100,
    });
    this.load.spritesheet("bossMedicinaDeath", bossMedicinaDeath, {
      frameWidth: 100,
      frameHeight: 100,
    });
    this.load.spritesheet("bossMedicinaEspecial", bossMedicinaEspecial, {
      frameWidth: 100,
      frameHeight: 100,
    });
    this.load.spritesheet("bossMedicinaDisparo", bossMedicinaDisparo, {
      frameWidth: 100,
      frameHeight: 100,
    });
    this.load.spritesheet("bossMedicinaBullet", bossMedicinaBullet, {
      frameWidth: 50,
      frameHeight: 50,
    });
    this.load.spritesheet("bossMedicinaBulletAppear", bossMedicinaBulletAppear, {
      frameWidth: 50,
      frameHeight: 50,
    });
    this.load.spritesheet("bossMedicinaBulletDestroy", bossMedicinaBulletDestroy, {
      frameWidth: 50,
      frameHeight: 50,
    });
    //BOSS MEDICINA

    this.load.spritesheet("parrySmoke", parrySmoke, {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("hippie", hippie, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("hippie-face", hippiePortrait,{
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("borja", borja, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("borjaMalvado", borjaMalvado, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("borjaPortrait", borjaPortrait, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("server", server, {
      frameWidth: 32,
      frameHeight: 64,
    });
    this.load.spritesheet("toilet", toilet, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("bartenderImg", bartenderImg, {
      frameWidth: 32,
      frameHeight: 32,
    });

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

    this.load.spritesheet('puff', puff, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('items', items, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('doors', doors, {
      frameWidth: 64,
      frameHeight: 32,
    });

    this.load.spritesheet('secretDoor', secretDoor,{
      frameWidth: 32,
      frameHeight: 39,
    });

    this.load.spritesheet('lock', lock,{
      frameWidth: 16,
      frameHeigth: 16,
    })

    this.load.spritesheet('breakable-table', breakable_table, {
      frameWidth: 112,
      frameHeight: 25,
    });

    this.load.spritesheet('breakable-chair', breakable_chair, {
      frameWidth: 112,
      frameHeight: 25,
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

    this.load.spritesheet("fire", fire, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("game_over_screen", game_over_screen, {
      frameWidth: 100,
      frameHeight: 100,
    });

    this.load.spritesheet('bullets', bullets, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('binaryBullet', binaryBullet, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("main_menu", mainMenu, {
      frameWidth: 192,
      frameHeight: 108,
    });

    this.load.spritesheet("cucaracha", cucaracha, {
      frameWidth: 32, //cada frame tiene este ancho
      frameHeight: 32, //todos son 32 px de alto
    });

    this.load.spritesheet("nand", nand, {
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

    this.load.spritesheet('nerdmove', nerdmove, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('nerdshoot', nerdshoot, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('skeleton', skeleton, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('phantom', phantom, {
      frameWidth: 22,
      frameHeight: 22,
    });

    this.load.spritesheet('printer', printer, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("enemydeath", enemydeath, {
      frameWidth: 32, //cada frame tiene este ancho
      frameHeight: 32, //todos son 32 px de alto
    });
  }

  /**
   * Creación de la escena. En este caso, solo cambiamos a la escena que representa el
   * nivel del juego
   */


  create() {
    //BOSS MEDICINA
    this.anims.create({
      key: "bossMedicinaIdle",
      frames: this.anims.generateFrameNames("bossMedicinaIdle", {
        start: 0,
        end: 3,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "bossMedicinaIdle2",
      frames: this.anims.generateFrameNames("bossMedicinaIdle2", {
        start: 0,
        end: 7,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "bossMedicinaAssault",
      frames: this.anims.generateFrameNames("bossMedicinaAssault", {
        start: 0,
        end: 12,
      }),
      frameRate: 8,
      repeat: 0,
    });

    this.anims.create({
      key: "hippie",
      frames: this.anims.generateFrameNames("hippie", {
        start: 0,
        end: 0,
      }),
      frameRate: 8,
      repeat: 1,
    });

    this.anims.create({
      key: "bossMedicinaEspecial",
      frames: this.anims.generateFrameNames("bossMedicinaEspecial", {
        start: 0,
        end: 11,
      }),
      frameRate: 8,
      repeat: 1,
    });

    this.anims.create({
      key: "bossMedicinaDisparo",
      frames: this.anims.generateFrameNames("bossMedicinaDisparo", {
        start: 0,
        end: 4,
      }),
      frameRate: 8,
      repeat: 0,
    });

    this.anims.create({
      key: "bossMedicinaDeath",
      frames: this.anims.generateFrameNames("bossMedicinaDeath", {
        start: 0,
        end: 17,
      }),
      frameRate: 8,
      repeat: 0,
    });

    this.anims.create({
      key: "bossMedicinaBulletDestroy",
      frames: this.anims.generateFrameNames("bossMedicinaBulletDestroy", {
        start: 0,
        end: 4,
      }),
      frameRate: 8,
      repeat: 0,
    });

    this.anims.create({
      key: "bossMedicinaBulletAppear",
      frames: this.anims.generateFrameNames("bossMedicinaBulletAppear", {
        start: 0,
        end: 5,
      }),
      frameRate: 8,
      repeat: 0,
    });

    this.anims.create({
      key: "bossMedicinaBullet",
      frames: this.anims.generateFrameNames("bossMedicinaBullet", {
        start: 0,
        end: 3,
      }),
      frameRate: 8,
      repeat: -1,
    });
    //BOSS MEDICINA

    this.anims.create({
      key: "teacher-front",
      frames: this.anims.generateFrameNames("borja", {
        start: 0,
        end: 0,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "borja-malvado",
      frames: this.anims.generateFrameNames("borjaMalvado", {
        start: 0,
        end: 0,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "borjaPortrait",
      frames: this.anims.generateFrameNames("teacher_face", {
        start: 0,
        end: 0,
      }),
      frameRate: 5,
      repeat: -1,
    });


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
      key: "bartender-face",
      frames: this.anims.generateFrameNames("bartenderImg", {
        start: 0,
        end: 0,
      }),
      frameRate: 5,
      repeat: -1,
    });

    //ENEMIGOS-------------------------------------------------------------------

    this.tutorialSonido = this.sound.add("tutorialSonido", { volume: 0.5, loop: true });
    this.anims.create({
      key: "cucaracha",
      frames: this.anims.generateFrameNames("cucaracha", {
        start: 0,
        end: 9,
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "nand",
      frames: this.anims.generateFrameNames("nand", {
        start: 0,
        end: 9,
      }),
      frameRate: 14,
      repeat: -1,
    });

    this.anims.create({
      key: "zombie_move",
      frames: this.anims.generateFrameNames("zombie_move", {
        start: 0,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "zombie_shoot",
      frames: this.anims.generateFrameNames("zombie_shoot", {
        start: 0,
        end: 4,
      }),
      frameRate: 12,
      repeat: 0,
    });

    this.anims.create({
      key: "cat_idle",
      frames: this.anims.generateFrameNames("cat_idle", {
        start: 0,
        end: 3,
      }),
      frameRate: 4,
      repeat: -1,
    });

    this.anims.create({
      key: "cat_void",
      frames: this.anims.generateFrameNames("cat_void", {
        start: 0,
        end: 5,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "cat_wake",
      frames: this.anims.generateFrameNames("cat_wake", {
        start: 0,
        end: 7,
      }),
      frameRate: 12,
      repeat: 0,
    });

    this.anims.create({
      key: "nerd_move",
      frames: this.anims.generateFrameNames("nerdmove", {
        start: 0,
        end: 9,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "nerd_shoot",
      frames: this.anims.generateFrameNames("nerdshoot", {
        start: 0,
        end: 9,
      }),
      frameRate: 12,
      repeat: 0,
    });

    this.anims.create({
      key: "printer_idle",
      frames: this.anims.generateFrameNames("printer", {
        start: 0,
        end: 5,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "printer_attack",
      frames: this.anims.generateFrameNames("printer", {
        start: 6,
        end: 11,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "skeleton_idle",
      frames: this.anims.generateFrameNames("skeleton", {
        start: 0,
        end: 3,
      }),
      frameRate: 6,
      repeat: 0,
    });

    this.anims.create({
      key: "skeleton_attack",
      frames: this.anims.generateFrameNames("skeleton", {
        start: 4,
        end: 9,
      }),
      frameRate: 8,
      repeat: 0,
    });

    this.anims.create({
      key: "phantom",
      frames: this.anims.generateFrameNames("phantom", {
        start: 0,
        end: 4,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: "phantom_invisible_move",
      frames: this.anims.generateFrameNames("phantom", {
        start: 5,
        end: 9,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: "enemydeath",
      frames: this.anims.generateFrameNames("enemydeath", {
        start: 0,
        end: 9,
      }),
      frameRate: 24,
      repeat: 0,
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
      key: "lock-open",
      frames: this.anims.generateFrameNames("lock", { start: 0, end: 7 }),
      frameRate: 8,//ver framerate
      repeat: 0,
    });

    this.anims.create({
      key: "fdiDoor-open",
      frames: this.anims.generateFrameNames("doors", { start: 0, end: 18 }),
      frameRate: 13,
      repeat: 0,
    });

    this.anims.create({
      key: "medDoor-open",
      frames: this.anims.generateFrameNames("doors", { start: 20, end: 37 }),
      frameRate: 12,
      repeat: 0,
    });

    this.anims.create({
      key: "secretDoor-open",
      frames: this.anims.generateFrameNames("secretDoor", { start: 0, end: 7 }),
      frameRate: 12,
      repeat: 0,
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

    this.anims.create({
      key: "Title_screen",
      frames: this.anims.generateFrameNames("main_menu", { start: 0, end: 23 }),
      frameRate: 8,
      repeat: -1,
    });


    //Crear texturas individuales a partir del spritesheet
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

    this.textures.addSpriteSheet('boton_fullscreen', this.textures.get('player_gui').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 12
    });

    this.textures.addSpriteSheet('boton_fullscreen_not', this.textures.get('player_gui').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 13
    });

    this.textures.addSpriteSheet('boton_mute', this.textures.get('player_gui').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 14
    });

    this.textures.addSpriteSheet('boton_mute_hover', this.textures.get('player_gui').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 15
    });

    this.anims.create({
      key: "server_static",
      frames: this.anims.generateFrameNames("server", { start: 0, end: 0 }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "gui_player_idle",
      frames: this.anims.generateFrameNames("player_gui", { start: 16, end: 17 }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "gui_player_hurt",
      frames: this.anims.generateFrameNames("player_gui", { start: 18, end: 19 }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "gui_bumbo_idle",
      frames: this.anims.generateFrameNames("player_gui", { start: 20, end: 21 }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "gui_bumbo_hurt",
      frames: this.anims.generateFrameNames("player_gui", { start: 22, end: 23 }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "gui_pantallazo_azul_idle",
      frames: this.anims.generateFrameNames("player_gui", { start: 24, end: 25 }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "gui_pantallazo_azul_hurt",
      frames: this.anims.generateFrameNames("player_gui", { start: 26, end: 27 }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "gui_collar_macarrones_idle",
      frames: this.anims.generateFrameNames("player_gui", { start: 28, end: 29 }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "gui_collar_macarrones_hurt",
      frames: this.anims.generateFrameNames("player_gui", { start: 30, end: 31 }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "gui_bolsa_sospechosa_idle",
      frames: this.anims.generateFrameNames("player_gui", { start: 32, end: 33 }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "gui_bolsa_sospechosa_hurt",
      frames: this.anims.generateFrameNames("player_gui", { start: 34, end: 35 }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "fire_start",
      frames: this.anims.generateFrameNames("fire", { start: 0, end: 3 }),
      frameRate: 8,
      repeat: 1,
    });

    this.anims.create({
      key: "fire_loop",
      frames: this.anims.generateFrameNames("fire", { start: 4, end: 11 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "fire_end",
      frames: this.anims.generateFrameNames("fire", { start: 12, end: 16 }),
      frameRate: 8,
      repeat: 1,
    });

    this.textures.addSpriteSheet('default_death', this.textures.get('game_over_screen').getSourceImage(), {
      frameWidth: 100,
      frameHeight: 100,
      startFrame: 0
    });

    this.textures.addSpriteSheet('cucaracha_death', this.textures.get('game_over_screen').getSourceImage(), {
      frameWidth: 100,
      frameHeight: 100,
      startFrame: 1
    });

    this.textures.addSpriteSheet('cat_death', this.textures.get('game_over_screen').getSourceImage(), {
      frameWidth: 100,
      frameHeight: 100,
      startFrame: 2
    });

    this.textures.addSpriteSheet('nerd_death', this.textures.get('game_over_screen').getSourceImage(), {
      frameWidth: 100,
      frameHeight: 100,
      startFrame: 3
    });

    this.textures.addSpriteSheet('zombie_death', this.textures.get('game_over_screen').getSourceImage(), {
      frameWidth: 100,
      frameHeight: 100,
      startFrame: 4
    });

    this.textures.addSpriteSheet('fire_death', this.textures.get('game_over_screen').getSourceImage(), {
      frameWidth: 100,
      frameHeight: 100,
      startFrame: 5
    });

    this.textures.addSpriteSheet('uncanny_cat', this.textures.get('game_over_screen').getSourceImage(), {
      frameWidth: 100,
      frameHeight: 100,
      startFrame: 8
    });

    this.textures.addSpriteSheet('paperbullet', this.textures.get('bullets').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 0
    });

    this.textures.addSpriteSheet('binaryBullet', this.textures.get('binayBullet').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 0
    });

    this.textures.addSpriteSheet('zombiebullet', this.textures.get('bullets').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 1
    });

    this.textures.addSpriteSheet('bumbo_bullet', this.textures.get('bullets').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 2
    });

    this.textures.addSpriteSheet('pantallazo_azul_bullet', this.textures.get('bullets').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 3
    });

    this.textures.addSpriteSheet('dough_bullet', this.textures.get('bullets').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 8
    });

    this.textures.addSpriteSheet('smoke_bullet', this.textures.get('bullets').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 9
    });

    this.anims.create({
      key: "nerdbullet",
      frames: this.anims.generateFrameNames("bullets", { start: 4, end: 7 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "parrySmoke",
      frames: this.anims.generateFrameNames("parrySmoke", { start: 0, end: 5 }),
      frameRate: 8,
      repeat: 0,
    });
    this.scene.start('UIButtons');
    this.scene.start('MainMenu');
  }
}