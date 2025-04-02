import Phaser from "phaser";
import Player from "../gameObjects/characters/player.js";
import PauseController from "../controller/pauseController.js";

//MAPA LOBBY ------------------------------------------------------
import mapa from "../../assets/map/lobby.png";


export default class SelectorNivel extends Phaser.Scene {
  constructor() {
    super({ key: 'selectorNivel' });
  }

  preload() {
    this.load.image('selectorNivel', mapa);
    this.load.tilemapTiledJSON("selectorNivel", mapa); // Carga el mapa
  }

  init(data) {
    console.log('Datos recibidos en init:', data);
    // Si los stats del jugador no están disponibles, asigna un valor predeterminado
    if (data && data.playerStats) {
      this.playerStats = data.playerStats;
    } else {
      this.playerStats = { health: 5, maxHealth: 5, coins: 0, keys:0, equipedItem: null, itemSprite: null, speed: 100, shootCooldown: 500 }; // Valores predeterminados
    }
  }

  create() {
    this.sonidoEntrar = this.sound.add('entrarFacultad');
    /*
    const map = this.make.tilemap({ key: 'selectorNivel' });
    const tileset1 = map.addTilesetImage('patronesGeneralesGrass', 'Grass');
    const tileset2 = map.addTilesetImage('StoneGround', 'Grass');
    const layer1 = map.createLayer('suelo', [tileset1, tileset2], 0, 0);
    */
    this.add.image(0, 0, 'selectorNivel').setOrigin(0, 0);
    this.physics.world.setBounds(0, 0, 1280, 640);
    this.bulletGroup = this.physics.add.group();
    this.player = new Player(this, 100, 450, this.playerStats);//1170, 460,
    this.cameras.main.setBounds(0, 0, 1280, 640);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1); // Suavizado
    this.cameras.main.setZoom(1.1);
    // Crear la colisión invisible
    this.invisibleZone = this.add.zone(100, 580, 200, 200).setOrigin(0, 0).setName("informaticaManager");
    this.invisibleZone.setInteractive(); // Hacerla interactiva para detectar overlaping

    this.invisibleZoneMedicina = this.add.zone(950, 0, 180, 80).setOrigin(0, 0).setName("medicinaManager");
    this.invisibleZoneMedicina.setInteractive(); // Hacerla interactiva para detectar overlaping

    this.physics.add.existing(this.invisibleZone); // Necesario para que funcione el overlap
    this.physics.add.existing(this.invisibleZoneMedicina); // Necesario para que funcione el overlap

    this.invisibleZone.body.setAllowGravity(false);
    this.invisibleZone.body.setImmovable(true);

    this.invisibleZoneMedicina.body.setAllowGravity(false);
    this.invisibleZoneMedicina.body.setImmovable(true);

    // Detectar cuando el jugador entra en la colisión invisible
    this.physics.add.overlap(this.player, this.invisibleZone, this.onOverlap, null, this);
    this.physics.add.overlap(this.player, this.invisibleZoneMedicina, this.onOverlap, null, this);
    this.pauseController = new PauseController(this, { x: this.cameras.main.width - 80, y: 60, scale: 1.3 });
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
      this.pauseController.togglePause();
    }
  }

  shutdown() {
    if (this.pauseController) {
      this.pauseController.destroy();
    }
  }
}