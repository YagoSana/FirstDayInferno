import Player from "../../gameObjects/characters/player.js";
import SalaBase from "../../scenes/salaBase.js";
import Enemy from "../../gameObjects/enemies/enemy.js";
import rangedEnemy from "../../gameObjects/enemies/rangedEnemy.js";
import wakeEnemy from "../../gameObjects/enemies/wakeEnemy.js";
import Item from "../../gameObjects/items/item.js";

export default class introMedicina extends SalaBase {
  constructor() {
    super("introMedicina");
  }

  create() {
    super.create("introMedicina");

    // Crear grupos correctamente SIN intentar limpiarlos antes
    this.enemyGroup = this.physics.add.group();
    this.bulletGroup = this.physics.add.group();
    this.enemyBulletGroup = this.physics.add.group();
    this.troncos = this.physics.add.staticGroup();

    console.log("Grupos de física inicializados");

    // Cargar el mapa y los tilesets
    const map = this.make.tilemap({ key: "introMedicina" });
    const tileset1 = map.addTilesetImage("TX Tileset Grass", "Grass");
    const tileset2 = map.addTilesetImage("TX Plant", "Plantas");
    const tileset3 = map.addTilesetImage("TX Props", "Props");
    const tileset4 = map.addTilesetImage("TX Shadow", "Sombras");
    const tileset5 = map.addTilesetImage("TX Shadow Plant", "SombrasPlantas");
    const tileset6 = map.addTilesetImage("Room_Builder_free_16x16", "Muebles");

    const layer8 = map.createLayer("bordes", [tileset1, tileset2, tileset3, tileset4, tileset5, tileset6], 0, 0);
    const layer1 = map.createLayer("cesped", [tileset1, tileset2, tileset3, tileset4, tileset5, tileset6], 0, 0);
    const layer2 = map.createLayer("sombrasPropsConColision", [tileset1, tileset2, tileset3, tileset4, tileset5, tileset6], 0, 0);
    const layer3 = map.createLayer("suelo", [tileset1, tileset2, tileset3, tileset4, tileset5, tileset6], 0, 0);
    const layer4 = map.createLayer("sombrasArboles", [tileset1, tileset2, tileset3, tileset4, tileset5, tileset6], 0, 0);
    const layer5 = map.createLayer("propsSinColision", [tileset1, tileset2, tileset3, tileset4, tileset5, tileset6], 0, 0);
    const layer6 = map.createLayer("propsConColision", [tileset1, tileset2, tileset3, tileset4, tileset5, tileset6], 0, 0);
    const layer7 = map.createLayer("arboles", [tileset1, tileset2, tileset3, tileset4, tileset5, tileset6], 0, 0);

    layer8.setCollisionByExclusion([-1], true);
    layer6.setCollisionByExclusion([-1], true);
    layer7.setDepth(10);

    // Inicializar jugador
    this.player = new Player(this, this.xSpawn, this.ySpawn, this.playerStats);

    // Crear troncos correctamente
    let troncosLayer = map.getObjectLayer("colisionesObj");
    troncosLayer.objects.forEach((obj) => {
      let tronco = this.add.rectangle(
        obj.x + obj.width / 2,
        obj.y - obj.height / 2 + 20,
        obj.width,
        obj.height,
        0x000000,
        0
      );
      this.physics.add.existing(tronco, true);
      this.troncos.add(tronco);
    });

    // Configurar transiciones entre salas
    this.transitionZones = this.physics.add.group();
    let transitionLayer = map.getObjectLayer("transiciones");
    transitionLayer.objects.forEach((obj) => {
      const zone = this.transitionZones.create(obj.x, obj.y, null).setSize(obj.width, obj.height).setOrigin(0, 0).setOffset(0, 0);
      zone.spawnRoom = obj.properties.find((p) => p.name === "spawnRoom")?.value;
      zone.spawnX = obj.properties.find((p) => p.name === "spawnX")?.value;
      zone.spawnY = obj.properties.find((p) => p.name === "spawnY")?.value;
      zone.prev = "introMedicina";
      zone.open = false; // Inicialmente cerrado
    });

    this.transitionZones.setVisible(false);
    this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);

    console.log("Capas y transiciones cargadas");
    //Camaras
    const screenWidth = this.sys.game.config.width; // Ancho de tu pantalla
    const screenHeight = this.sys.game.config.height; // Alto de tu pantalla
    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;
    const zoom = 1.8;
    //const boundX = -(screenWidth / zoom - mapWidth) / 2;
    //const boundY = -(screenHeight / zoom - mapHeight) / 2;

    this.cameras.main.setZoom(zoom);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Ajustar límites del mundo y cámara
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Añadir colisiones
    this.physics.add.collider(this.player, layer6);
    this.physics.add.collider(this.enemyGroup, layer6);
    this.physics.add.collider(this.enemyGroup, layer8);
    this.physics.add.collider(this.player, this.troncos);
    this.physics.add.collider(this.bulletGroup, this.troncos, this.onBulletCollision);
    this.physics.add.collider(this.enemyBulletGroup, this.troncos, this.onBulletCollision);
    this.physics.add.collider(this.bulletGroup, layer6, this.onBulletCollision);
    this.physics.add.collider(this.enemyBulletGroup, layer6, this.onBulletCollision);

    this.physics.add.collider(this.enemyGroup, this.troncos);

    this.doorFireManager.createFiresForZones(this.transitionZones);
    this.doorFireManager.setupCollisions(this.player);
    
    let spritesLayer = map.getObjectLayer("sprites");
    if (!this.status) {
      spritesLayer.objects.forEach(obj => {
        let type = obj.properties.find(p => p.name === "tipo")?.value;
        if (type === "enemy") {
          this.numEnemies++;
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
    else {
      spritesLayer.objects.forEach(obj => {
        let type = obj.properties.find(p => p.name === "tipo")?.value;
        if (type === "enemy") {
          this.add.sprite(obj.x, obj.y, "blood").setVisible(true).setDepth(3).setFrame(12);
        }
      });
    }
  }
}
