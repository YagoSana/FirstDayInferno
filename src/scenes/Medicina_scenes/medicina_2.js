import Player from "../../gameObjects/characters/player.js";
import SalaBase from "../../scenes/salaBase.js";
import Enemy from "../../gameObjects/enemies/enemy.js";
import rangedEnemy from "../../gameObjects/enemies/rangedEnemy.js";
import wakeEnemy from "../../gameObjects/enemies/wakeEnemy.js";
import Phaser from "phaser";
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

    this.enemyGroup = this.physics.add.group();
    this.bulletGroup = this.physics.add.group();
    this.enemyBulletGroup = this.physics.add.group();
    this.obstaculos = this.physics.add.staticGroup();

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

    this.player = new Player(this, this.xSpawn, this.ySpawn, this.playerStats);

    this.transitionZones = this.physics.add.group();
    let transitionLayer = map.getObjectLayer("transiciones");
    if (transitionLayer) {
      transitionLayer.objects.forEach((obj) => {
        const zone = this.transitionZones.create(obj.x, obj.y, null)
          .setSize(obj.width, obj.height)
          .setOrigin(0, 0)
          .setOffset(0, 0);
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

    // Librería
    this.libreriaZone = this.physics.add.group();
    let libreriaLayer = map.getObjectLayer("puerta");
    if (libreriaLayer) {
      libreriaLayer.objects.forEach((obj) => {
        const zone = this.libreriaZone.create(obj.x, obj.y - 49, "libreria")
          .setOrigin(0, 0)
          .setOffset(0, 32);
        zone.body.setSize(obj.width + 16, obj.height);
        zone.body.setOffset(0, 32);
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

    // Cámara
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;
    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;
    const zoom = 2;
    const boundX = -(screenWidth / zoom - mapWidth) / 2;

    this.cameras.main.setZoom(zoom);
    this.cameras.main.setBounds(boundX, 0, mapWidth, mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    // Colisiones
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

    // Capa oscura general
    this.darkOverlay = this.add.rectangle(
      0, 0,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0.4
    );
    this.darkOverlay.setOrigin(0, 0);
    this.darkOverlay.setScrollFactor(0);
    this.darkOverlay.setDepth(100);

    // Luz principal del jugador
    this.light = this.make.graphics();
    this.light.fillStyle(0xffffff, 1);
    this.light.fillCircle(0, 0, 40);
    this.lightMask = this.light.createGeometryMask();
    this.lightMask.setInvertAlpha(true);
    this.darkOverlay.setMask(this.lightMask);

    // Capa oscura para transición
    this.transitionDarkOverlay = this.add.rectangle(
      0, 0,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0.6
    );
    this.transitionDarkOverlay.setOrigin(0, 0);
    this.transitionDarkOverlay.setScrollFactor(0);
    this.transitionDarkOverlay.setDepth(101);

    // Luces en zonas de transición
    this.transitionLightGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    this.transitionMaskGraphics = this.make.graphics();
    this.transitionMask = this.transitionMaskGraphics.createGeometryMask();
    this.transitionMask.setInvertAlpha(true);
    this.transitionDarkOverlay.setMask(this.transitionMask);

    this.transitionLights = [];
    this.transitionZones.getChildren().forEach(zone => {
      const centerX = zone.x + zone.body.width / 2;
      const centerY = zone.y + zone.body.height / 2;
      this.transitionLights.push({ x: centerX, y: centerY, radius: 40 });
    });

    let spritesLayer = map.getObjectLayer("sprites");
    if (!this.status) {
      spritesLayer.objects.forEach(obj => {
        let type = obj.properties.find(p => p.name === "tipo")?.value;
        if (type === "enemy") {
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
              this.game.global.gatosVivos.push(obj.id);
              this.enemyGroup.add(new wakeEnemy(this, obj.x, obj.y, obj.name, obj.id));
              break;
          }
        }
      });
    } else {
      spritesLayer.objects.forEach(obj => {
        let type = obj.properties.find(p => p.name === "tipo")?.value;
        if (type === "enemy") {
          if (obj.name == "cat" && this.game.global.gatosVivos.includes(obj.id)) {
            this.enemyGroup.add(new wakeEnemy(this, obj.x, obj.y, obj.name, obj.id));
          } else {
            this.add.sprite(obj.x, obj.y, "blood").setVisible(true).setDepth(3).setFrame(12);
          }
        }
      });
    }
  }

  update(time, delta) {
  super.update?.(time, delta);
  this.updateLight();

  if (this.doorFireManager.fireCreated === false) {
    // Apaga efecto de luces de transición sin destruirlas
    this.transitionMaskGraphics.clear(); // Borra los círculos
    this.transitionDarkOverlay.clearMask(); // Oculta el efecto luminoso
  } else {
    // Restaura máscara y luces si los fuegos están activos
    this.transitionMaskGraphics.clear();
    this.transitionLights.forEach(light => {
      this.transitionMaskGraphics.fillStyle(0xffffff, 1);
      this.transitionMaskGraphics.fillCircle(light.x, light.y, light.radius);
    });
    this.transitionDarkOverlay.setMask(this.transitionMask); // Reactiva capa de luz
    this.transitionDarkOverlay.setVisible(true);
  }
}


  updateLight() {
    this.light.x = this.player.x;
    this.light.y = this.player.y;
  }



}
