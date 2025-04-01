import Player from "../../gameObjects/characters/player.js";
import SalaBase from "../../scenes/salaBase.js";
import Enemy from "../../gameObjects/enemies/enemy.js";
import rangedEnemy from "../../gameObjects/enemies/rangedEnemy.js";
import wakeEnemy from "../../gameObjects/enemies/wakeEnemy.js";
import Item from "../../gameObjects/items/item.js";

export default class medicina_2 extends SalaBase {
  constructor() {
    super("medicina_2");
  }

  create() {
    super.create("medicina_2");

    // Crear grupos correctamente
    this.enemyGroup = this.physics.add.group();
    this.bulletGroup = this.physics.add.group();
    this.enemyBulletGroup = this.physics.add.group();
    this.obstaculos = this.physics.add.staticGroup();

    console.log("Grupos de física inicializados");

    // Cargar el mapa y los tilesets
    const map = this.make.tilemap({ key: "medicina_2" });
    const tileset1 = map.addTilesetImage("Interior16", "Interior");
    const tileset2 = map.addTilesetImage("ParedSuelo16", "Muebles");

    const layer1 = map.createLayer("suelo", [tileset1, tileset2], 0, 0);
    const layer2 = map.createLayer("pared", [tileset1, tileset2], 0, 0);
    const layer3 = map.createLayer("bordes", [tileset1, tileset2], 0, 0);
    const layer4 = map.createLayer("objetos", [tileset1, tileset2], 0, 0);
    const layer5 = map.createLayer("sin colision", [tileset1, tileset2], 0, 0);

    layer2.setCollisionByExclusion([-1], true);
    layer3.setCollisionByExclusion([-1], true);
    layer4.setCollisionByExclusion([-1], true);

    // Inicializar jugador
    this.player = new Player(this, this.xSpawn, this.ySpawn, this.playerStats);

    // Configurar transiciones entre salas
    this.transitionZones = this.physics.add.group();
    let transitionLayer = map.getObjectLayer("transiciones");
    if (transitionLayer) {
      transitionLayer.objects.forEach((obj) => {
        const zone = this.transitionZones.create(obj.x, obj.y, null).setSize(obj.width, obj.height);
        zone.spawnRoom = obj.properties.find((p) => p.name === "spawnRoom")?.value;
        zone.spawnX = obj.properties.find((p) => p.name === "spawnX")?.value;
        zone.spawnY = obj.properties.find((p) => p.name === "spawnY")?.value;
        zone.prev = "medicina_2";
      });
    }
    this.transitionZones.setVisible(false);
    this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);

    console.log("Capas y transiciones cargadas");

    // Ajustar límites del mundo y cámara
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(1.8);

    // Añadir colisiones
    this.physics.add.collider(this.player, layer2);
    this.physics.add.collider(this.player, layer3);
    this.physics.add.collider(this.player, layer4);
    this.physics.add.collider(this.player, this.obstaculos);

    this.physics.add.collider(this.enemyGroup, layer2);
    this.physics.add.collider(this.enemyGroup, layer3);
    this.physics.add.collider(this.enemyGroup, layer4);
    this.physics.add.collider(this.enemyGroup, this.obstaculos);

    this.physics.add.collider(this.bulletGroup, layer2, this.onBulletCollision);
    this.physics.add.collider(this.bulletGroup, layer3, this.onBulletCollision);
    this.physics.add.collider(this.bulletGroup, layer4, this.onBulletCollision);
    this.physics.add.collider(this.bulletGroup, this.obstaculos, this.onBulletCollision);

    this.physics.add.collider(this.enemyBulletGroup, layer2, this.onBulletCollision);
    this.physics.add.collider(this.enemyBulletGroup, layer3, this.onBulletCollision);
    this.physics.add.collider(this.enemyBulletGroup, layer4, this.onBulletCollision);
    this.physics.add.collider(this.enemyBulletGroup, this.obstaculos, this.onBulletCollision);

    console.log("Colisiones añadidas correctamente");
    let spritesLayer = map.getObjectLayer("sprites");
    spritesLayer.objects.forEach(obj => {
      let type = obj.properties.find(p => p.name === "tipo")?.value;
      console.log(`Tipo del objeto de tiled ${type}`);
      if (type === "enemy") {
        switch (obj.name) {
          case "cucaracha":
            this.enemyGroup.add(new Enemy(this, obj.x, obj.y, obj.name));
            break;
          case "zombie":
            this.enemyGroup.add(new rangedEnemy(this, obj.x, obj.y, obj.name));
            break;
          case "cat":
            this.enemyGroup.add(new wakeEnemy(this, obj.x, obj.y, obj.name));
            break;
          default:
            console.log("Tipo de enemigo no reconocido:", obj.name);
        }
      }
    });
  }
}
