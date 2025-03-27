import Player from "../../gameObjects/characters/player.js";
import SalaBase from "../../scenes/salaBase.js";
import Enemy from "../../gameObjects/enemies/enemy.js";
import Item from "../../gameObjects/items/item.js";

export default class medicina_5 extends SalaBase {
  /**
   * Constructor de la escena
   */
  constructor() {
    super('medicina_5');
  }

  /**
   * Creación de los elementos de la escena principal de juego
   */
  create() {
    super.create('medicina_5');

    const map = this.make.tilemap({ key: 'medicina_5' }); // Cargamos el mapa

    const tileset1 = map.addTilesetImage('Interiors_free_16x16', 'Interior');
    const tileset2 = map.addTilesetImage('Room_Builder_free_16x16', 'Muebles');

    console.log("Tileset cargados");

    const layer1 = map.createLayer('suelo', [tileset1, tileset2], 0, 0);
    const layer2 = map.createLayer('pared', [tileset1, tileset2], 0, 0);
    const layer3 = map.createLayer('techo', [tileset1, tileset2], 0, 0);
    const layer4 = map.createLayer('objetos', [tileset1, tileset2], 0, 0);
    const layer5 = map.createLayer('sin colision', [tileset1, tileset2], 0, 0);

    layer2.setCollisionByExclusion([-1], true);
    layer3.setCollisionByExclusion([-1], true);
    layer4.setCollisionByExclusion([-1], true);

    this.player = new Player(this, this.xSpawn, this.ySpawn, this.playerStats);

    this.transitionZones = this.physics.add.group();
    let transitionLayer = map.getObjectLayer("transiciones");
    transitionLayer.objects.forEach(obj => {
      const zone = this.transitionZones.create(obj.x, obj.y, null).setSize(obj.width, obj.height);
      zone.spawnRoom = obj.properties.find(p => p.name === "spawnRoom")?.value;
      zone.spawnX = obj.properties.find(p => p.name === "spawnX")?.value;
      zone.spawnY = obj.properties.find(p => p.name === "spawnY")?.value;
      zone.prev = "medicina_5";
    });
    this.transitionZones.setVisible(false);
    this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);

    console.log("Capas cargadas");

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.stars = 10;
    this.bases = this.add.group();
    this.platformGroup = this.physics.add.staticGroup();
    this.bulletGroup = this.physics.add.group();
    this.enemyGroup = this.physics.add.group();
    this.enemyBulletGroup = this.physics.add.group();

    console.log("Grupos creados");

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
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