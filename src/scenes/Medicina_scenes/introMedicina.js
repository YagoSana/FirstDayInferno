import Player from "../../gameObjects/characters/player.js";
import SalaBase from "../../scenes/salaBase.js";
import Enemy from "../../gameObjects/enemies/enemy.js";
import Item from "../../gameObjects/items/item.js";

export default class introMedicina extends SalaBase {
  /**
   * Constructor de la escena
   */
  constructor() {
    super("introMedicina");
  }

  /**
   * Creación de los elementos de la escena principal de juego
   */
  create() {
    super.create('introMedicina');

    var map = this.make.tilemap({ key: 'introMedicina' }); // Cargamos el mapa

    const tileset1 = map.addTilesetImage('TX Tileset Grass', 'Grass');
    const tileset2 = map.addTilesetImage('TX Plant', 'Plantas');
    const tileset3 = map.addTilesetImage('TX Props', 'Props');
    const tileset4 = map.addTilesetImage('TX Shadow', 'Sombras');
    const tileset5 = map.addTilesetImage('TX Shadow Plant', 'SombrasPlantas');

    console.log("Tileset cargados");

    const layer1 = map.createLayer('cesped', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    const layer2 = map.createLayer('sombrasPropsConColision', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    const layer3 = map.createLayer('suelo', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    const layer4 = map.createLayer('sombrasArboles', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    const layer5 = map.createLayer('propsSinColision', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    const layer6 = map.createLayer('propsConColision', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    const layer7 = map.createLayer('arboles', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);

    console.log("Capas cargadas");
    layer6.setCollisionByExclusion([-1], true);
    layer7.setDepth(10);

    this.player = new Player(this, this.xSpawn, this.ySpawn, this.playerStats);

    this.troncos = this.physics.add.staticGroup();
    let troncosLayer = map.getObjectLayer('colisionesObj');
    troncosLayer.objects.forEach(obj => {
      // Crear un objeto invisible con colisión
      let tronco;
      tronco = this.add.rectangle(
        obj.x + obj.width / 2,
        obj.y - obj.height / 2 + 20,
        obj.width,
        obj.height,
        0x000000,
        0 // Transparente
      );

      // Agregar físicas
      this.physics.add.existing(tronco, true);
      this.troncos.add(tronco);
    });

    this.transitionZones = this.physics.add.group();
    let transitionLayer = map.getObjectLayer("transiciones");
    transitionLayer.objects.forEach(obj => {
      const zone = this.transitionZones.create(obj.x, obj.y, null).setSize(obj.width, obj.height);
      zone.spawnRoom = obj.properties.find(p => p.name === "spawnRoom")?.value;
      zone.spawnX = obj.properties.find(p => p.name === "spawnX")?.value;
      zone.spawnY = obj.properties.find(p => p.name === "spawnY")?.value;
      zone.prev = "introMedicina";
    });
    this.transitionZones.setVisible(false);
    this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);


    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.platformGroup = this.physics.add.staticGroup();
    this.bulletGroup = this.physics.add.group();
    this.enemyGroup = this.physics.add.group();
    this.enemyBulletGroup = this.physics.add.group();

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1); // Suavizado
    this.cameras.main.setZoom(1.8);

    // Añadir colisión con el jugador
    this.physics.add.collider(this.player, layer5);
    this.physics.add.collider(this.player, this.troncos);
    this.physics.add.collider(this.player, layer6);
    this.physics.add.collider(this.enemyGroup, layer6);
    this.physics.add.collider(this.bulletGroup, this.troncos, this.onBulletCollision);
    this.physics.add.collider(this.enemyBulletGroup, this.troncos, this.onBulletCollision);
    this.physics.add.collider(this.bulletGroup, layer6, this.onBulletCollision);
    this.physics.add.collider(this.enemyBulletGroup, layer6, this.onBulletCollision);
  }
}