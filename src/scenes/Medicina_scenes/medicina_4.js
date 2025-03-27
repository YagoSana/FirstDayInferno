import Player from "../../gameObjects/characters/player.js";
import SalaBase from "../../scenes/salaBase.js";
import Enemy from "../../gameObjects/enemies/enemy.js";
import Item from "../../gameObjects/items/item.js";

export default class medicina_4 extends SalaBase {
  /**
   * Constructor de la escena
   */
  constructor() {
    super('medicina_4');
  }

  /**
   * Creación de los elementos de la escena principal de juego
   */
  create() {
    super.create('medicina_4');

    const map = this.make.tilemap({ key: 'medicina_4' }); // Cargamos el mapa

    const tileset1 = map.addTilesetImage('Interiors_free_16x16', 'Interior');
    const tileset2 = map.addTilesetImage('Room_Builder_free_16x16', 'Muebles');

    console.log("Tileset cargados");

    const layer1 = map.createLayer('suelo', [tileset1, tileset2], 0, 0);
    const layer2 = map.createLayer('pared', [tileset1, tileset2], 0, 0);
    const layer3 = map.createLayer('objetos', [tileset1, tileset2], 0, 0);
    const layer4 = map.createLayer('sin colision2', [tileset1, tileset2], 0, 0);
    const layer5 = map.createLayer('sin colision', [tileset1, tileset2], 0, 0);

    layer2.setCollisionByExclusion([-1], true);
    layer3.setCollisionByExclusion([-1], true);

    this.player = new Player(this, this.xSpawn, this.ySpawn, this.playerStats);

    this.colisiones = this.physics.add.staticGroup();
    let colisionesLayer = map.getObjectLayer('colisiones');
    colisionesLayer.objects.forEach(obj => {
      // Crear un objeto invisible con colisión
      let colision;
      colision = this.add.rectangle(
        obj.x + obj.width / 2,
        obj.y - obj.height / 2 + 20,
        obj.width,
        obj.height,
        0x000000,
        0 // Transparente
      );

      // Agregar físicas
      this.physics.add.existing(colision, true);
      this.colisiones.add(colision);
    });

    this.transitionZones = this.physics.add.group();
    let transitionLayer = map.getObjectLayer("transiciones");
    transitionLayer.objects.forEach(obj => {
      const zone = this.transitionZones.create(obj.x, obj.y, null).setSize(obj.width, obj.height);
      zone.spawnRoom = obj.properties.find(p => p.name === "spawnRoom")?.value;
      zone.spawnX = obj.properties.find(p => p.name === "spawnX")?.value;
      zone.spawnY = obj.properties.find(p => p.name === "spawnY")?.value;
      zone.prev = "medicina_4";
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

    console.log("Colisiones añadidas");

    this.physics.add.collider(this.enemyGroup, layer2);
    this.physics.add.collider(this.enemyGroup, layer3);

    console.log("Colisiones enemigos añadidas");

    this.physics.add.collider(this.bulletGroup, layer2, this.onBulletCollision);
    this.physics.add.collider(this.bulletGroup, layer3, this.onBulletCollision);

    console.log("Colisiones balas añadidas");

    this.physics.add.collider(this.enemyBulletGroup, layer2, this.onBulletCollision);
    this.physics.add.collider(this.enemyBulletGroup, layer3, this.onBulletCollision);

    console.log("Colisiones balas enemigos añadidas");

    this.physics.add.collider(this.player, this.colisiones);
    this.physics.add.collider(this.bulletGroup, this.colisiones, this.onBulletCollision);
    this.physics.add.collider(this.enemyBulletGroup, this.colisiones, this.onBulletCollision);

    console.log("Colisiones con objetos añadidas");

  }
}