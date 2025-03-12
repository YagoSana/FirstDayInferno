import Item from "../gameObjects/items/item.js";
import Player from "../gameObjects/characters/player.js";
import Phaser from "phaser";
import Enemy from "../gameObjects/enemies/enemy.js";
import RangedEnemy from "../gameObjects/enemies/rangedEnemy.js";
import SalaBase from "../scenes/salaBase.js";
import WakeEnemy from "../gameObjects/enemies/wakeEnemy.js";
import AssaultEnemy from "../gameObjects/enemies/assaultEnemy.js";

/**
 * Escena principal del juego. La escena se compone de una serie de plataformas
 * sobre las que se sitúan las bases en las podrán aparecer las estrellas.
 * El juego comienza generando aleatoriamente una base sobre la que generar una estrella.
 * @abstract Cada vez que el jugador recoge la estrella, aparece una nueva en otra base.
 * El juego termina cuando el jugador ha recogido 10 estrellas.
 * @extends Phaser.Scene
 */
export default class Level extends SalaBase {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: "level" });
    this.data = {};
    this.bound1 = 1024;
    this.bound2 = 640;
  }

  /**
   * Creación de los elementos de la escena principal de juego
   */
  create() {
    super.create(this.data);

    var map = this.make.tilemap({ key: 'map' }); // Cargamos el mapa

    const tileset1 = map.addTilesetImage('patronGrass', 'Grass');
    const tileset2 = map.addTilesetImage('patronPlantas', 'Plantas');
    const tileset3 = map.addTilesetImage('patronProps', 'Props');
    const tileset4 = map.addTilesetImage('patronSombras', 'Sombras');
    const tileset5 = map.addTilesetImage('patronSombrasPlantas', 'SombrasPlantas');

    const layer1 = map.createLayer('suelo', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    const layer2 = map.createLayer('cesped', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    const layer3 = map.createLayer('propsSinColision', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    const layer4 = map.createLayer('sombrasPropsConColision', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    const layer5 = map.createLayer('propsConColision', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    const layer6 = map.createLayer('arboles', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);
    const layer7 = map.createLayer('sombrasArboles', [tileset1, tileset2, tileset3, tileset4, tileset5], 0, 0);

    layer6.setDepth(10);
    layer5.setCollisionByExclusion([-1], true);

    // **Crear un grupo de colisiones invisibles**
    this.troncos = this.physics.add.staticGroup();

    let troncosLayer = map.getObjectLayer('colisionesObj');
    console.log("Capa de troncos:", troncosLayer);

    troncosLayer.objects.forEach(obj => {
        // Crear un objeto invisible con colisión
        let tronco = this.add.rectangle(
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
    

    

    
    this.physics.world.setBounds(0, 0, 1024, 640);
    this.stars = 10;
    this.bases = this.add.group();
    this.platformGroup = this.physics.add.staticGroup();
    this.bulletGroup = this.physics.add.group();
    this.enemyGroup = this.physics.add.group();
    this.enemyBulletGroup = this.physics.add.group();
    this.player = new Player(this, 500, 250);
    this.enemyGroup.add(new Enemy(this, 1000, 250, "cucaracha"));
    this.enemyGroup.add(new Enemy(this, 2000, 250, "cucaracha"));
    this.enemyGroup.add(new RangedEnemy(this, 1000, 500, "nerd"));
    this.enemyGroup.add(new WakeEnemy(this, 500, 200, "cat"));
    this.enemyGroup.add(new AssaultEnemy(this, 500, 500, "embestidaPlaceHolder"));
    this.cameras.main.setBounds(0, 0, 1024, 640);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1); // Suavizado
    this.cameras.main.setZoom(1.8);
    this.physics.add.collider(this.player, layer5);
    // Añadir colisión con el jugador
    this.physics.add.collider(this.player, this.troncos);
    this.physics.add.collider(this.enemyGroup, layer5);
    this.physics.add.collider(this.bulletGroup, this.troncos, this.onBulletCollision);
    this.physics.add.collider(this.enemyBulletGroup, this.troncos, this.onBulletCollision);
    this.physics.add.collider(this.bulletGroup, layer5, this.onBulletCollision);
    this.physics.add.collider(this.enemyBulletGroup, layer5, this.onBulletCollision);
    new Item(this, 200, 200,"hamburguesa",false);
    new Item(this, 600, 250, "moneda", false);
    new Item(this, 250, 200, "miniTinto", false);
    new Item(this, 700, 300,"bumbo",true);
  }
  /*

  onBulletCollision(bullet, tile) {
        bullet.explode();
  }

  /**
   * Genera una estrella en una de las bases del escenario
   * @param {Array<Base>} from Lista de bases sobre las que se puede crear una estrella
   * Si es null, entonces se crea aleatoriamente sobre cualquiera de las bases existentes
   */

  /**
   * Método que se ejecuta al coger una estrella. Se pasa la base
   * sobre la que estaba la estrella cogida para evitar repeticiones
   * @param {Base} base La base sobre la que estaba la estrella que se ha cogido
   */
}