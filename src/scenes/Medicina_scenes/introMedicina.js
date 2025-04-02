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

    const layer1 = map.createLayer("cesped", [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    const layer2 = map.createLayer("sombrasPropsConColision", [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    const layer3 = map.createLayer("suelo", [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    const layer4 = map.createLayer("sombrasArboles", [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    const layer5 = map.createLayer("propsSinColision", [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    const layer6 = map.createLayer("propsConColision", [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    const layer7 = map.createLayer("arboles", [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);

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
      const zone = this.transitionZones.create(obj.x, obj.y, null).setSize(obj.width, obj.height);
      zone.spawnRoom = obj.properties.find((p) => p.name === "spawnRoom")?.value;
      zone.spawnX = obj.properties.find((p) => p.name === "spawnX")?.value;
      zone.spawnY = obj.properties.find((p) => p.name === "spawnY")?.value;
      zone.prev = "introMedicina";
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
    const boundX = -(screenWidth / zoom - mapWidth) / 2;
    //const boundY = -(screenHeight / zoom - mapHeight) / 2;

    this.cameras.main.setZoom(zoom);
    this.cameras.main.setBounds(boundX, 0, map.widthInPixels, map.heightInPixels);

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Ajustar límites del mundo y cámara
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Añadir colisiones
    this.physics.add.collider(this.player, layer6);
    this.physics.add.collider(this.enemyGroup, layer6);
    this.physics.add.collider(this.player, this.troncos);
    this.physics.add.collider(this.bulletGroup, this.troncos, this.onBulletCollision);
    this.physics.add.collider(this.enemyBulletGroup, this.troncos, this.onBulletCollision);
    this.physics.add.collider(this.bulletGroup, layer6, this.onBulletCollision);
    this.physics.add.collider(this.enemyBulletGroup, layer6, this.onBulletCollision);
    // Crear una capa negra semitransparente
    this.darkOverlay = this.add.rectangle(
      0, 0,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0.7 // Opacidad (0 a 1)
    );
    this.darkOverlay.setOrigin(0, 0);
    this.darkOverlay.setScrollFactor(0); // Fijo en la cámara
    this.darkOverlay.setDepth(999); // Asegurar que está encima de todo
    // Crear un gráfico para la "luz"
    this.light = this.make.graphics();
    this.light.fillStyle(0xffffff, 1);
    this.light.fillCircle(0, 0, 30); // Radio de la luz

    // Crear una máscara con el círculo de luz
    this.lightMask = this.light.createGeometryMask();
    this.lightMask.setInvertAlpha(true); // Invertir la máscara para que solo esta zona sea visible

    // Aplicar la máscara a la capa oscura
    this.darkOverlay.setMask(this.lightMask);

    this.physics.add.collider(this.enemyGroup, this.troncos);
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

    // Verificar si todos los enemigos están muertos para activar/desactivar zonas de transición
    this.checkEnemies = () => {
      if (this.enemyGroup.countActive(true) === 0) {
        //this.transitionZones.setVisible(true);
        this.transitionZones.children.iterate((zone) => {
          zone.body.enable = true;
        });
        console.log("Todos los enemigos han sido derrotados. Zonas de transición activadas.");
      } else {
        this.transitionZones.setVisible(false);
        this.transitionZones.children.iterate((zone) => {
          zone.body.enable = false;
        });
        console.log("Enemigos restantes. Zonas de transición desactivadas.");
      }
    };

    // Llamar a la verificación cada vez que un enemigo muere
    this.enemyGroup.children.iterate((enemy) => {
      enemy.on("destroy", this.checkEnemies);
    });

    // Realizar una verificación inicial
    this.checkEnemies();
  }

  updateLight() {
    this.light.x = this.player.x;
    this.light.y = this.player.y;
  }
}
