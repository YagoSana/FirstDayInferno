import Phaser from "phaser";
import Player from "../gameObjects/characters/player.js";
import PauseController from "../controller/pauseController.js";
import UIController from "../controller/UIController.js";

//MAPA LOBBY ------------------------------------------------------
import metro from "../../assets/imgs/LobbyMETRO.png";
import fdi from "../../assets/imgs/LobbyFDI.png";
import medicina from "../../assets/imgs/LobbyMEDICINA.png";

import lobby from "../../assets/map/lobby.json";
import tileset_grass from "../../assets/map/TX Tileset Grass.png";

export default class SelectorNivel extends Phaser.Scene {
  constructor() {
    super({ key: 'selectorNivel' });
  }

  preload() {
    //this.load.image('selectorNivel', mapa);
    this.load.image("Grass", tileset_grass);
    this.load.tilemapTiledJSON("lobby", lobby);
    this.load.image('metro', metro);
    this.load.image('medicina', medicina);
    this.load.image('fdi', fdi);
  }

  init(data) {
    console.log('Datos recibidos en init:', data);
    // Si los stats del jugador no están disponibles, asigna un valor predeterminado
    if (data && data.playerStats) {
      this.playerStats = data.playerStats;
    } else {
      this.playerStats = { health: 5, maxHealth: 5, coins: 0, keys: 0, equipedItem: null, itemSprite: null, speed: 100, shootCooldown: 500 }; // Valores predeterminados
    }
  }

  create(data) {

    this.sound.stopAll();

    this.sonidoEntrar = this.sound.add('entrarFacultad');

    const map = this.make.tilemap({ key: 'lobby' });
    const tileset1 = map.addTilesetImage("TX Tileset Grass", "Grass");

    
    const layer2 = map.createLayer('cesped', [tileset1], 0, 0);
    const layer1 = map.createLayer('suelo', [tileset1], 0, 0);

    this.player = new Player(this, 550, 180, this.playerStats);//1170, 460,

    let spritesLayer = map.getObjectLayer("objetos");
    spritesLayer.objects.forEach(obj => {
      if (obj.name == "metro") {
        this.add.image(504, 210, 'metro').setOrigin(0, 0).setDisplaySize(100, 70);
      }
      else if (obj.name == "medicina") {
        this.add.image(390, 0, 'medicina').setOrigin(0, 0).setDisplaySize(150, 79);        
      }
      else if (obj.name == "fdi") {
        this.add.image(65, 238, 'fdi').setOrigin(0, 0).setDisplaySize(231, 98);
      }
    });

    console.log("capas creadas");

    //Camaras
    const screenWidth = this.sys.game.config.width; // Ancho de tu pantalla
    const screenHeight = this.sys.game.config.height; // Alto de tu pantalla
    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;
    const zoom = 1.5;
    const boundX = -(screenWidth / zoom - mapWidth) / 2;
    const boundY = -(screenHeight / zoom - mapHeight) / 2;

    this.cameras.main.setZoom(zoom);
    this.cameras.main.setBounds(boundX, boundY, map.widthInPixels, map.heightInPixels);

    this.cameras.main.fadeIn(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.manager.cambiarSala(zone);
    });

    this.bulletGroup = this.physics.add.group();

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);


    // Crear la colisión invisible
    this.invisibleZone = this.add.zone(70, 250, 150, 80).setOrigin(0, 0).setName("informaticaManager");
    this.invisibleZone.setInteractive(); // Hacerla interactiva para detectar overlaping

    this.invisibleZoneMedicina = this.add.zone(400, 0, 130, 70).setOrigin(0, 0).setName("medicinaManager");
    this.invisibleZoneMedicina.setInteractive(); // Hacerla interactiva para detectar overlaping

    this.invisibleZoneMetro = this.add.zone(520, 220, 70, 50).setOrigin(0, 0).setName("tutorialManager");
    this.invisibleZoneMetro.setInteractive(); // Hacerla interactiva para detectar overlaping

    this.physics.add.existing(this.invisibleZone); // Necesario para que funcione el overlap
    this.physics.add.existing(this.invisibleZoneMedicina);
    this.physics.add.existing(this.invisibleZoneMetro);

    this.invisibleZone.body.setAllowGravity(false);
    this.invisibleZone.body.setImmovable(true);

    this.invisibleZoneMedicina.body.setAllowGravity(false);
    this.invisibleZoneMedicina.body.setImmovable(true);

    this.invisibleZoneMetro.body.setAllowGravity(false);
    this.invisibleZoneMetro.body.setImmovable(true);

    // Detectar cuando el jugador entra en la colisión invisible
    this.physics.add.overlap(this.player, this.invisibleZone, this.onOverlap, null, this);
    this.physics.add.overlap(this.player, this.invisibleZoneMedicina, this.onOverlap, null, this);
    this.physics.add.overlap(this.player, this.invisibleZoneMetro, this.onOverlap, null, this);

    // this.pauseController = new PauseController(this, { x: 790, y: 120, scale: 1 });
    this.uiController = new UIController(this, {
      position: {
        pause: { x: this.sys.game.config.width - 210, y: this.sys.game.config.height - 435 }, // Posiciones personalizadas
        mute: { x: this.sys.game.config.width - 250, y: this.sys.game.config.height - 435 },
        fullscreen: { x: this.sys.game.config.width - 205, y: this.sys.game.config.height - 125 }
      },
      scale: 1
    });
    // Escuchar la tecla ESC
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.scene.launch('GUI', this.playerStats); // Lanzar la escena de la GUI
    this.scene.bringToTop('GUI');
  }

  onOverlap(player, zone) {
    const mundoDestino = zone.name; // O usa zone.id si prefieres
    console.log(`Jugador entró en la zona que va a ${mundoDestino}`);
    this.startWorld(mundoDestino);
  }

  startWorld(worldName) {
    this.sonidoEntrar.play();
    console.log(`Comienza el mundo: ${worldName}`);
    this.scene.sleep('selectorNivel');
    this.scene.launch(worldName, { playerStats: this.playerStats, prev: 'selectorNivel' });
    this.scene.launch('GUI', this.playerStats); // Lanzar la escena de la GUI
  }

  updatePlayerStats(newStats) {
    this.playerStats = newStats;
    if (this.player) {
      this.player.updateStats(newStats);
    }
  }

  update() {
    // Abrir el menú de pausa al presionar ESC
    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      this.uiController.togglePause();
    }
  }

  shutdown() {
    if (this.uiController) {
      this.uiController.destroy();
    }
  }
}