import Player from "../../gameObjects/characters/player.js";
import SalaBase from "../../scenes/salaBase.js";
import Enemy from "../../gameObjects/enemies/enemy.js";
import rangedEnemy from "../../gameObjects/enemies/rangedEnemy.js";
import wakeEnemy from "../../gameObjects/enemies/wakeEnemy.js";
import Door from "../../gameObjects/items/door.js";
import Phaser from "phaser";
import libreria from "../../../assets/imgs/libreria.png";

export default class medicina_5 extends SalaBase {
  constructor() {
    super("medicina_5");
  }

  preload() {
    this.load.image('libreria', libreria);
  }

  create() {
    super.create("medicina_5");

    console.log("Sala 5 de medicina inicializada");
    this.load.image('libreria', libreria);

    // Inicialización de grupos
    this.enemyGroup = this.physics.add.group();
    this.bulletGroup = this.physics.add.group();
    this.enemyBulletGroup = this.physics.add.group();
    this.troncos = this.physics.add.staticGroup();

    console.log("Grupos de física inicializados");

    // Cargar el mapa y los tilesets
    const map = this.make.tilemap({ key: "medicina_5" });
    const tileset1 = map.addTilesetImage("Interiors_free_16x16", "Interior");
    const tileset2 = map.addTilesetImage("Room_Builder_free_16x16", "Muebles");

    console.log("Tilesets cargados");

    // Crear capas del mapa
    const layer1 = map.createLayer("suelo", [tileset1, tileset2], 0, 0);
    const layer2 = map.createLayer("pared", [tileset1, tileset2], 0, 0);
    const layer3 = map.createLayer("techo", [tileset1, tileset2], 0, 0);
    const layer4 = map.createLayer("objetos", [tileset1, tileset2], 0, 0);
    const layer5 = map.createLayer("sin colision", [tileset1, tileset2], 0, 0);

    console.log("Capas creadas");

    // Configurar colisiones
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
        zone.prev = "medicina_5";
        zone.name = obj.name;
        //solo para la sala del boss
        zone.isBossTransition = obj.properties.find((p) => p.name === "isBossTransition")?.value || false;
        zone.bossKey = obj.properties.find((p) => p.name === "bossKey")?.value || "bossMedicina";
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
    const boundY = -(screenHeight / zoom - mapHeight) / 2;
    console.log("boundX: ", boundX);
    console.log("boundY: ", boundY);

    this.cameras.main.setZoom(zoom);
    this.cameras.main.setBounds(boundX, boundY, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Ajustar límites del mundo y cámara
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    console.log("Cámara configurada");

    // Añadir colisiones
    this.physics.add.collider(this.player, layer2);
    this.physics.add.collider(this.player, layer3);
    this.physics.add.collider(this.player, layer4);

    console.log("Colisiones del jugador configuradas");

    this.physics.add.collider(this.enemyGroup, layer2);
    this.physics.add.collider(this.enemyGroup, layer3);
    this.physics.add.collider(this.enemyGroup, layer4);

    console.log("Colisiones enemigos configuradas");

    this.physics.add.collider(this.bulletGroup, layer2, this.onBulletCollision);
    this.physics.add.collider(this.bulletGroup, layer3, this.onBulletCollision);
    this.physics.add.collider(this.bulletGroup, layer4, this.onBulletCollision);

    console.log("Colisiones de balas configuradas");

    this.physics.add.collider(this.enemyBulletGroup, layer2, this.onBulletCollision);
    this.physics.add.collider(this.enemyBulletGroup, layer3, this.onBulletCollision);
    this.physics.add.collider(this.enemyBulletGroup, layer4, this.onBulletCollision);

    console.log("Colisiones de balas enemigas configuradas");
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

     // Capa oscura para transición
    this.transitionDarkOverlay = this.add.rectangle(
      0, 0,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0.2
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

    let spritesLayer = map.getObjectLayer("sprites");
    if (!this.status) {
      spritesLayer.objects.forEach(obj => {
        let type = obj.properties.find(p => p.name === "tipo")?.value;
        console.log(`Tipo del objeto de tiled ${type}`);
        if (type === "enemy") {
          switch (obj.name) {
            case "cucaracha":
              this.numEnemies++;
              this.enemyGroup.add(new Enemy(this, obj.x, obj.y, "nand"));
              break;
            case "zombie":
              this.numEnemies++;
              this.enemyGroup.add(new rangedEnemy(this, obj.x, obj.y, obj.name, true));
              break;
            case "cat":
              console.log("GatosVivos: ", this.game.global.gatosVivos);  // Accede a gatosVivos
              this.game.global.gatosVivos.push(obj.id); // Añadir el ID del gato a la lista
              this.enemyGroup.add(new wakeEnemy(this, obj.x, obj.y, obj.name, obj.id));
              break;
            default:
              console.log("Tipo de enemigo no reconocido:", obj.name);
          }
        } else if (type === "door") {
          let locked3 = this.playerStats.doorsLocked['medDoor'];
          new Door(this, obj.x, obj.y, 'medDoor', locked3);
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
        } else if (type === "door"){
          let locked3 = this.playerStats.doorsLocked['medDoor'];
          new Door(this, obj.x, obj.y, 'medDoor', locked3);
        }
      });
    }
  }

  cambiarSala(player, zone) {
    if (!zone.spawnRoom || !this.player.canChangeRoom || !zone.open) return;
    
    this.player.canChangeRoom = false;
    this.manager.guardarPlayerStats(this.player.getStats());
    
    this.time.delayedCall(1000, () => {
        this.player.canChangeRoom = true;
    });
    
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
        if (zone.isBossTransition) {
            // Si es transición al jefe, mostramos VS screen
            this.scene.stop();
            this.scene.start('VSScreen', {
                bossKey: zone.bossKey,
                nextScene: zone.spawnRoom, // medicina_6
                playerStats: this.player.getStats(),
                transitionData: zone,
                managerKey: this.managerKey
            });
        } else {
            // Transición normal, vamos directamente a la otra sala
            this.scene.stop();
            this.manager.cambiarSala(zone);
        }
    });
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
