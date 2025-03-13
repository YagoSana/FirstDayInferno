import Phaser from "phaser";
import Player from "../gameObjects/characters/player.js";
//JUGADOR ------------------------------------------------------
import player from "../../assets/sprites/player_idle.png";
import player_walking from "../../assets/sprites/player_walking.png";
import player_shoot from "../../assets/sprites/player_shoot.png";
import player_death from "../../assets/sprites/player_death.png";
//MAPA LOBBY ------------------------------------------------------
import mapa from "../../assets/map/lobby.png";
//EXTRAS ------------------------------------------------------
import paperbullet from "../../assets/sprites/bullet.png";
import puff from "../../assets/sprites/puff.png";

export default class SelectorNivel extends Phaser.Scene {
  constructor() {
    super({ key: 'selectorNivel' });
  }

  preload() {
        this.load.image("paperbullet", paperbullet);
        this.load.image('selectorNivel', mapa);
        //this.load.image("Grass", img_grass);
        this.load.tilemapTiledJSON("selectorNivel", mapa); // Carga el mapa
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
        
        this.load.spritesheet("player_death", player_death, {
          frameWidth: 32,
          frameHeight: 32,
        });

        this.load.spritesheet('puff', puff, {
          frameWidth: 32,
          frameHeight: 32,
        });
  }

  init(data) {
      console.log('Datos recibidos en init:', data);
      // Si los stats del jugador no están disponibles, asigna un valor predeterminado
      if (data && data.playerStats) {
          this.playerStats = data.playerStats;
      } else {
          this.playerStats = { health: 3, coins: 0, equipedItem: null, itemSprite: null, speed: 100, shootCooldown: 500}; // Valores predeterminados
      }
  }

  create(){
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
      key: "bullet-puff",
      frames: this.anims.generateFrameNames("puff", { start: 0, end: 7 }),
      frameRate: 24,
      repeat: 0,
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
      key: "player-death",
      frames: this.anims.generateFrameNumbers("player_death", {
        start: 0,
        end: 10,
      }),
      frameRate: 10,
      repeat: 0,
    });
     
    /*
    const map = this.make.tilemap({ key: 'selectorNivel' });
    const tileset1 = map.addTilesetImage('patronesGeneralesGrass', 'Grass');
    const tileset2 = map.addTilesetImage('StoneGround', 'Grass');
    const layer1 = map.createLayer('suelo', [tileset1, tileset2], 0, 0);
    */
    this.add.image(0, 0, 'selectorNivel').setOrigin(0, 0);
    this.physics.world.setBounds(0, 0, 1280, 640);
    this.bulletGroup = this.physics.add.group();
    this.player = new Player(this, 1170, 460, this.playerStats);
    this.cameras.main.setBounds(0, 0, 1280, 640);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1); // Suavizado
    this.cameras.main.setZoom(1);
    // Crear la colisión invisible
    this.invisibleZone = this.add.zone(100, 580, 200, 200).setOrigin(0, 0).setName("informaticaManager");
    this.invisibleZone.setInteractive(); // Hacerla interactiva para detectar overlaping
    this.physics.add.existing(this.invisibleZone); // Necesario para que funcione el overlap
    this.invisibleZone.body.setAllowGravity(false);
    this.invisibleZone.body.setImmovable(true);
    // Detectar cuando el jugador entra en la colisión invisible
    this.physics.add.overlap(this.player, this.invisibleZone, this.onOverlap, null, this);
  }

  onOverlap(player, zone) {
    const mundoDestino = zone.name; // O usa zone.id si prefieres
    console.log(`Jugador entró en la zona que va a ${mundoDestino}`);
    this.startWorld(mundoDestino);
  }

  startWorld(worldName) {
    console.log(`Comienza el mundo: ${worldName}`);
    this.scene.start(worldName, { playerStats: this.playerStats });
  }
}