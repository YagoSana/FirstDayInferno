import Item from "../gameObjects/items/item.js";
import Player from "../gameObjects/characters/player.js";
import Phaser from "phaser";
import Enemy from "../gameObjects/enemies/enemy.js";
import RangedEnemy from "../gameObjects/enemies/rangedEnemy.js";
import SalaBase from "../scenes/salaBase.js";
import WakeEnemy from "../gameObjects/enemies/wakeEnemy.js";
import AssaultEnemy from "../gameObjects/enemies/assaultEnemy.js";

/**
 * Escena principal del juego. La escena se compone de una serie de plataformas
 * sobre las que se sitúan las bases en las podrán aparecer las estrellas.
 * El juego comienza generando aleatoriamente una base sobre la que generar una estrella.
 * @abstract Cada vez que el jugador recoge la estrella, aparece una nueva en otra base.
 * El juego termina cuando el jugador ha recogido 10 estrellas.
 * @extends Phaser.Scene
 */
export default class medicina_2 extends SalaBase {
  /**
   * Constructor de la escena
   */
  constructor() {
    super('medicina_2');
  }

  /**
   * Creación de los elementos de la escena principal de juego
   */
  create() {
    super.create(this.data);

    var map = this.make.tilemap({ key: 'medicina_2' }); // Cargamos el mapa

    const tileset1 = map.addTilesetImage('Interior16', 'Interior');
    const tileset2 = map.addTilesetImage('ParedSuelo16', 'Muebles');

    console.log("Tileset cargados");

    const layer1 = map.createLayer('suelo', [tileset1, tileset2], 0, 0);
    const layer2 = map.createLayer('pared', [tileset1, tileset2], 0, 0);
    const layer3 = map.createLayer('bordes', [tileset1, tileset2], 0, 0);
    const layer4 = map.createLayer('objetos', [tileset1, tileset2], 0, 0);
    const layer5 = map.createLayer('sin colision', [tileset1, tileset2], 0, 0);

    layer2.setCollisionByExclusion([-1], true);
    layer3.setCollisionByExclusion([-1], true);
    layer4.setCollisionByExclusion([-1], true);

    
    this.transitionZones = this.physics.add.group();
    let transitionLayer = map.getObjectLayer("transiciones");
    transitionLayer.objects.forEach(obj => {
      const zone = this.transitionZones.create(obj.x, obj.y, null).setSize(obj.width, obj.height);
      zone.spawnRoom = obj.properties.find(p => p.name === "spawnRoom")?.value;
      zone.spawnX = obj.properties.find(p => p.name === "spawnX")?.value;
      zone.spawnY = obj.properties.find(p => p.name === "spawnY")?.value;
      zone.prev = "medicina_2";
    });
    this.transitionZones.setVisible(false);
    this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);

    console.log("Capas cargadas");

    this.player = new Player(this, this.xSpawn, this.ySpawn, this.playerStats);

    this.physics.world.setBounds(0, 0, 512, 320);
    this.stars = 10;
    this.bases = this.add.group();
    this.platformGroup = this.physics.add.staticGroup();
    this.bulletGroup = this.physics.add.group();
    this.enemyGroup = this.physics.add.group();
    this.enemyBulletGroup = this.physics.add.group();

    console.log("Grupos creados");

    this.cameras.main.setBounds(0, 0, 512, 320);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1); // Suavizado
    this.cameras.main.setZoom(1.8);
    this.physics.add.collider(this.player, layer5);

    console.log("Camara configurada");
    // Añadir colisión con el jugador
    this.physics.add.collider(this.player, layer2);
    this.physics.add.collider(this.player, layer3);
    this.physics.add.collider(this.player, layer4);

    console.log("Colisiones añadidas");

    this.physics.add.collider(this.enemyGroup, layer2);
    this.physics.add.collider(this.enemyGroup, layer3);
    this.physics.add.collider(this.enemyGroup, layer4);

    console.log("Colisiones enemigos añadidas");

    this.physics.add.collider(this.bulletGroup, layer2, this.onBulletCollision);
    this.physics.add.collider(this.bulletGroup, layer3, this.onBulletCollision);
    this.physics.add.collider(this.bulletGroup, layer4, this.onBulletCollision);

    console.log("Colisiones balas añadidas");

    this.physics.add.collider(this.enemyBulletGroup, layer2, this.onBulletCollision);
    this.physics.add.collider(this.enemyBulletGroup, layer3, this.onBulletCollision);
    this.physics.add.collider(this.enemyBulletGroup, layer4, this.onBulletCollision);

    console.log("Colisiones balas enemigos añadidas");

  }
}