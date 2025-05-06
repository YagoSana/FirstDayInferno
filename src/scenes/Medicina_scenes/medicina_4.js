import Player from "../../gameObjects/characters/player.js";
import SalaBase from "../../scenes/salaBase.js";
import Enemy from "../../gameObjects/enemies/enemy.js";
import rangedEnemy from "../../gameObjects/enemies/rangedEnemy.js";
import wakeEnemy from "../../gameObjects/enemies/wakeEnemy.js";
import skeletonEnemy from "../../gameObjects/enemies/skeletonEnemy.js";
import Item from "../../gameObjects/items/item.js";

export default class medicina_4 extends SalaBase {
  constructor() {
    super("medicina_4");
  }

  create() {
    super.create("medicina_4");

    console.log("Sala 4 de medicina inicializada");

    // Inicialización de grupos de colisiones y enemigos
    this.enemyGroup = this.physics.add.group();
    this.bulletGroup = this.physics.add.group();
    this.enemyBulletGroup = this.physics.add.group();
    this.colisiones = this.physics.add.staticGroup();

    console.log("Grupos de física inicializados");

    // Cargar el mapa y los tilesets
    const map = this.make.tilemap({ key: "medicina_4" });
    const tileset1 = map.addTilesetImage("Interiors_free_16x16", "Interior");
    const tileset2 = map.addTilesetImage("Room_Builder_free_16x16", "Muebles");

    console.log("Tilesets cargados");

    // Crear capas del mapa
    const layer1 = map.createLayer("suelo", [tileset1, tileset2], 0, 0);
    const layer2 = map.createLayer("pared", [tileset1, tileset2], 0, 0);
    const layer3 = map.createLayer("objetos", [tileset1, tileset2], 0, 0);
    const layer4 = map.createLayer("sin colision2", [tileset1, tileset2], 0, 0);
    const layer5 = map.createLayer("sin colision", [tileset1, tileset2], 0, 0);

    console.log("Capas creadas");

    // Configurar colisiones
    layer2.setCollisionByExclusion([-1], true);
    layer3.setCollisionByExclusion([-1], true);

    // Inicializar jugador
    this.player = new Player(this, this.xSpawn, this.ySpawn, this.playerStats);

    // Crear colisiones personalizadas desde la capa de objetos
    let colisionesLayer = map.getObjectLayer("colisiones");
    if (colisionesLayer) {
      colisionesLayer.objects.forEach((obj) => {
        let colision = this.add.rectangle(
          obj.x,
          obj.y,
          obj.width,
          obj.height,
          0x000000,
          0 // Transparente
        ).setOrigin(0,0);
        this.physics.add.existing(colision, true);

        this.colisiones.add(colision);
      });
    }

    // Configurar transiciones entre salas
    this.transitionZones = this.physics.add.group();
    let transitionLayer = map.getObjectLayer("transiciones");
    if (transitionLayer) {
      transitionLayer.objects.forEach((obj) => {
        const zone = this.transitionZones.create(obj.x, obj.y, null).setSize(obj.width, obj.height).setOrigin(0, 0).setOffset(0, 0);
        zone.spawnRoom = obj.properties.find((p) => p.name === "spawnRoom")?.value;
        zone.spawnX = obj.properties.find((p) => p.name === "spawnX")?.value;
        zone.spawnY = obj.properties.find((p) => p.name === "spawnY")?.value;
        zone.prev = "medicina_4";
      });
    }

    this.transitionZones.setVisible(false);
    this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);

    console.log("Capas y transiciones cargadas");

    //Camaras
    const screenWidth = this.sys.game.config.width; // Ancho de tu pantalla
    const screenHeight = this.sys.game.config.height; // Alto de tu pantalla
    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;
    const zoom = 2;
    const boundX = -(screenWidth / zoom - mapWidth) / 2;
    //const boundY = -(screenHeight / zoom - mapHeight) / 2;

    this.cameras.main.setZoom(zoom);
    this.cameras.main.setBounds(boundX, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Ajustar límites del mundo y cámara
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);


    console.log("Cámara configurada");

    // Añadir colisiones
    this.physics.add.collider(this.player, layer2);
    this.physics.add.collider(this.player, layer3);
    this.physics.add.collider(this.player, this.colisiones);

    console.log("Colisiones del jugador configuradas");

    this.physics.add.collider(this.enemyGroup, layer2);
    this.physics.add.collider(this.enemyGroup, layer3);

    console.log("Colisiones enemigos configuradas");

    this.physics.add.collider(this.bulletGroup, layer2, this.onBulletCollision);
    this.physics.add.collider(this.bulletGroup, layer3, this.onBulletCollision);

    console.log("Colisiones de balas configuradas");

    //this.physics.add.collider(this.enemyBulletGroup, layer2, this.onBulletCollision);
    this.physics.add.collider(this.enemyBulletGroup, layer3, this.onBulletCollision);
    this.physics.add.collider(this.enemyBulletGroup, this.colisiones, this.onBulletCollision);

    this.physics.add.collider(this.enemyGroup, this.colisiones);

    console.log("Colisiones de balas enemigas configuradas");// Crear una capa negra semitransparente
    this.darkOverlay = this.add.rectangle(
      0, 0,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0.4 // Opacidad (0 a 1)
    );
    this.darkOverlay.setOrigin(0, 0);
    this.darkOverlay.setScrollFactor(0); // Fijo en la cámara
    this.darkOverlay.setDepth(100); // Asegurar que está encima de todo
    // Crear un gráfico para la "luz"
    this.light = this.make.graphics();
    this.light.fillStyle(0xffffff, 1);
    this.light.fillCircle(0, 0, 40); // Radio de la luz

    // Crear una máscara con el círculo de luz
    this.lightMask = this.light.createGeometryMask();
    this.lightMask.setInvertAlpha(true); // Invertir la máscara para que solo esta zona sea visible

    // Aplicar la máscara a la capa oscura
    this.darkOverlay.setMask(this.lightMask);

    this.doorFireManager.createFiresForZones(this.transitionZones);
    this.doorFireManager.setupCollisions(this.player);

    let spritesLayer = map.getObjectLayer("sprites");
    if (!this.status) {
      spritesLayer.objects.forEach(obj => {
        let type = obj.properties.find(p => p.name === "tipo")?.value;
        console.log(`Tipo del objeto de tiled ${type}`);
        if (type === "enemy") {
          this.numEnemies++;
          switch (obj.name) {
            case "cucaracha":
              const skeleton = new skeletonEnemy(this, obj.x, obj.y, "skeleton")
              this.enemyGroup.add(skeleton);
              skeleton.setPlayer(this.player);
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
        console.log(`Tipo del objeto de tiled ${type}`);
        if (type === "enemy") {
          this.add.sprite(obj.x, obj.y, "blood").setVisible(true).setDepth(3).setFrame(12);
        }
      });
    }
  }

  updateLight() {
    this.light.x = this.player.x;
    this.light.y = this.player.y;
  }
}
