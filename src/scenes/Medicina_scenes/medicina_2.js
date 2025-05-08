import Player from "../../gameObjects/characters/player.js";
import SalaBase from "../../scenes/salaBase.js";
import Enemy from "../../gameObjects/enemies/enemy.js";
import rangedEnemy from "../../gameObjects/enemies/rangedEnemy.js";
import wakeEnemy from "../../gameObjects/enemies/wakeEnemy.js";

import libreria from "../../../assets/imgs/libreria.png";

export default class medicina_2 extends SalaBase {
  constructor() {
    super("medicina_2");
  }

  preload() {
    this.load.image('libreria', libreria);
  }

  create() {
    super.create("medicina_2");

    this.load.image('libreria', libreria);

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
        const zone = this.transitionZones.create(obj.x, obj.y, null).setSize(obj.width, obj.height).setOrigin(0, 0).setOffset(0, 0);
        zone.spawnRoom = obj.properties.find((p) => p.name === "spawnRoom")?.value;
        zone.spawnX = obj.properties.find((p) => p.name === "spawnX")?.value;
        zone.spawnY = obj.properties.find((p) => p.name === "spawnY")?.value;
        zone.prev = "medicina_2";
        zone.name = obj.name;
      });
    }
    this.transitionZones.setVisible(false);
    this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);

    this.doorFireManager.createFiresForZones(this.transitionZones);
    this.doorFireManager.setupCollisions(this.player);

    //libreria que se mueve
    this.libreriaZone = this.physics.add.group();
    let libreriaLayer = map.getObjectLayer("puerta");
    if (libreriaLayer) {
      libreriaLayer.objects.forEach((obj) => {
        console.log("width: ", obj.width, " height: ", obj.height);
        const zone = this.libreriaZone.create(obj.x, obj.y - 49, "libreria")
          .setOrigin(0, 0)
          .setOffset(0, 32);

        // Make hitbox wider by 16px to the right only
        zone.body.setSize(obj.width + 16, obj.height);
        zone.body.setOffset(0, 32); // Keep the original vertical offset
      });
    }
    this.libreriaZone.setVisible(true);
    this.physics.add.overlap(this.player, this.libreriaZone, (player, door) => {
      if (!door.hasMoved) {
        door.hasMoved = true;
        this.tweens.add({
          targets: door,
          x: door.x + 32,
          tint: 0x999999,
          duration: 500,
          ease: 'Power2'
        });
      }
    }, null, this);


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
    // Crear una capa negra semitransparente
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

    let spritesLayer = map.getObjectLayer("sprites");
    if (!this.status) {
      spritesLayer.objects.forEach(obj => {
        let type = obj.properties.find(p => p.name === "tipo")?.value;
        if (type === "enemy") {
          console.log("AAA enemigo ", obj.name, ", id ", obj.id);
          switch (obj.name) {
            case "cucaracha":
              this.numEnemies++;
              this.enemyGroup.add(new Enemy(this, obj.x, obj.y, obj.name));
              break;
            case "zombie":
              this.numEnemies++;
              this.enemyGroup.add(new rangedEnemy(this, obj.x, obj.y, obj.name));
              break;
            case "cat":
              console.log("GatosVivos: ", this.game.global.gatosVivos);  // Accede a gatosVivos
              this.game.global.gatosVivos.push(obj.id); // Añadir el ID del gato a la lista
              this.enemyGroup.add(new wakeEnemy(this, obj.x, obj.y, obj.name, obj.id));
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
          if (obj.name == "cat" && this.game.global.gatosVivos.includes(obj.id)) {
            this.enemyGroup.add(new wakeEnemy(this, obj.x, obj.y, obj.name, obj.id));
          }
          else this.add.sprite(obj.x, obj.y, "blood").setVisible(true).setDepth(3).setFrame(12);
        }
      });
    }
  }

  updateLight() {
    this.light.x = this.player.x;
    this.light.y = this.player.y;
  }
}
