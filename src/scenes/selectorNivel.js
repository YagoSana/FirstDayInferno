import Phaser from "phaser";
import Player from "../gameObjects/characters/player.js";

//MAPA LOBBY ------------------------------------------------------

import lobby from "../../assets/map/lobby.json";

import metro_img from "../../assets/imgs/metro.png";

export default class SelectorNivel extends Phaser.Scene {
  constructor() {
    super({ key: 'selectorNivel' });
  }

  preload() {
    //this.load.image('selectorNivel', mapa);

    this.load.tilemapTiledJSON("lobby", lobby);
    this.load.image('metro_img', metro_img);
  }

  init(data) {
    console.log('Datos recibidos en init:', data);
    // Si los stats del jugador no están disponibles, asigna un valor predeterminado
    if (data && data.playerStats) {
      this.playerStats = data.playerStats;
    } else {
      this.playerStats = { health: 5, maxHealth: 5, coins: 0, keys: 0, equipedItem: null, itemSprite: null, speed: 100, shootCooldown: 500, doubleshoot: false, doorsLocked: { 'secretDoor': true, 'fdiDoor': true, 'medDoor': true, 'candado': true } }; // Valores predeterminados
    }
    this.medicinaBeaten = data.medicinaBeaten || false;
  }

  create(data) {

    this.sound.stopAll();
    this.sonidoEntrar = this.sound.add('entrarFacultad');

    const map = this.make.tilemap({ key: 'lobby' });
    const tileset1 = map.addTilesetImage("TX Tileset Grass", "Grass");
    const tileset2 = map.addTilesetImage("paraninfo", "Paraninfo");
    const tileset3 = map.addTilesetImage("Interiors_free_16x16", "Interior");
    const tileset4 = map.addTilesetImage("Room_Builder_free_16x16", "Muebles");


    const layer2 = map.createLayer('cesped', [tileset1, tileset2, tileset3, tileset4], 0, 0);
    const layer1 = map.createLayer('suelo', [tileset1, tileset2, tileset3, tileset4], 0, 0);
    const layer3 = map.createLayer('sin colision', [tileset1, tileset2, tileset3, tileset4], 0, 0);
    const layer4 = map.createLayer('objetos', [tileset1, tileset2, tileset3, tileset4], 0, 0);
    const layer5 = map.createLayer('bordes', [tileset1, tileset2, tileset3, tileset4], 0, 0);

    layer4.setCollisionByExclusion([-1], true);
    layer5.setCollisionByExclusion([-1], true);

    this.player = new Player(this, 550, 180, this.playerStats);//1170, 460

    this.add.image(528, 244, 'metro_img').setOrigin(0, 0).setDisplaySize(48, 32);

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
    this.invisibleZone = this.add.zone(85, 230, 150, 100).setOrigin(0, 0).setName("informaticaManager");
    this.invisibleZone.setInteractive(); // Hacerla interactiva para detectar overlaping

    this.invisibleZoneMedicina = this.add.zone(435, 35, 155, 70).setOrigin(0, 0).setName("medicinaManager");
    this.invisibleZoneMedicina.setInteractive(); // Hacerla interactiva para detectar overlaping

    this.invisibleZoneMetro = this.add.zone(520, 220, 70, 50).setOrigin(0, 0).setName("tutorialManager");
    this.invisibleZoneMetro.setInteractive(); // Hacerla interactiva para detectar overlaping

    this.invisibleZoneParaninfo = this.add.zone(180, 55, 120, 70).setOrigin(0, 0).setName("paraninfoManager");
    this.invisibleZoneParaninfo.setInteractive();

    //Zona invisible para tutorial del parry
    this.invisibleZoneLlamadaParry = this.add.zone(520, 180, 70, 100).setOrigin(0, 0).setName("conversacionParry");
    this.invisibleZoneParaninfo.setInteractive();
    this.llamada = this.sound.add('llamada');
    this.llamada.setVolume(0.5); // Ajusta el volumen según sea necesario

    this.physics.add.existing(this.invisibleZone); // Necesario para que funcione el overlap
    this.physics.add.existing(this.invisibleZoneMedicina);
    this.physics.add.existing(this.invisibleZoneMetro);
    this.physics.add.existing(this.invisibleZoneParaninfo);
    this.physics.add.existing(this.invisibleZoneLlamadaParry);

    this.invisibleZone.body.setAllowGravity(false);
    this.invisibleZone.body.setImmovable(true);

    this.invisibleZoneMedicina.body.setAllowGravity(false);
    this.invisibleZoneMedicina.body.setImmovable(true);

    this.invisibleZoneMetro.body.setAllowGravity(false);
    this.invisibleZoneMetro.body.setImmovable(true);

    this.invisibleZoneParaninfo.body.setAllowGravity(false);
    this.invisibleZoneParaninfo.body.setImmovable(true);

    this.invisibleZoneLlamadaParry.body.setAllowGravity(false);
    this.invisibleZoneLlamadaParry.body.setImmovable(true);

    // Detectar cuando el jugador entra en la colisión invisible
    this.physics.add.overlap(this.player, this.invisibleZone, this.onOverlap, null, this);
    if (!this.medicinaBeaten) {
      this.physics.add.overlap(this.player, this.invisibleZoneMedicina, this.onOverlap, null, this);
    }
    else {
      this.physics.add.collider(this.player, this.invisibleZoneMedicina, null, null, this);
    }
    this.physics.add.overlap(this.player, this.invisibleZoneMetro, this.onOverlap, null, this);
    this.physics.add.overlap(this.player, this.invisibleZoneParaninfo, this.onOverlap, null, this);

    this.physics.add.overlap(this.player, this.invisibleZoneLlamadaParry, this.onOverlapLlamada, null, this);


    let uiButtonsScene = this.scene.get('UIButtons');
    uiButtonsScene.updateConfig({
      position: {
        pause: { x: this.sys.game.config.width - 50, y: this.sys.game.config.height - 512 },
        mute: { x: this.sys.game.config.width - 120, y: this.sys.game.config.height - 512 },
        fullscreen: { x: this.sys.game.config.width - 50, y: this.sys.game.config.height - 50 }
      },
      scale: 1.6,
      canPause: true
    });
    uiButtonsScene.updateScene(this.scene.key, null);//le pasamos la key de la escena actual

    this.scene.launch('GUI', this.playerStats); // Lanzar la escena de la GUI
    this.scene.bringToTop('GUI');
  }

  onOverlap(player, zone) {
    const mundoDestino = zone.name; // O usa zone.id si prefieres
    console.log(`Jugador entró en la zona que va a ${mundoDestino}`);
    this.startWorld(mundoDestino);
  }

  onOverlapLlamada(player, zone) {
    zone.body.enable = false; // Desactivar la colisión para evitar múltiples llamadas
    this.llamada.play(); // Reproducir el sonido de llamada
    this.scene.pause('selectorNivel'); // Pausar la escena actual
    this.scene.launch('DialogueScene', {
      message: "Hey tio, estás de camino a la uni, no? Solo llamaba para recordarte que puedes evitar el daño de las balas de los enemigos pulsando la tecla 'F' en el momento justo. Sabrás si lo has hecho bien si te pones de color de verde o amarillo, además creo que tiene beneficios, mola verdad? ¡Suerte!",
      speaker: 'Colega',
      portraitKey: 'fdi_student1_talk',
      textSpeed: 35, // Velocidad del efecto de texto
      previousScene: this.scene.scene.key, // Pasar la escena actual
      onClose: () => {
        this.scene.resume('selectorNivel'); // Reanudar la escena actual
      }
    });

    this.scene.bringToTop('DialogueScene');
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
}