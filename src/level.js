import Jetpac from './jetpac.js';
import Fuel from './fuel.js';
import Spaceship from './spaceship.js';
import Enemy from './enemy.js';

/**
 * Escena principal del juego. La escena se compone de una serie de plataformas 
 * sobre las que se sitúan las bases en las podrán aparecer las estrellas. 
 * El juego comienza generando aleatoriamente una base sobre la que generar una estrella. 
 * Cada vez que el jugador recoge la estrella, aparece una nueva en otra base.
 * El juego termina cuando el jugador ha recogido 10 estrellas.
 * @extends Phaser.Scene
 */
export default class Level extends Phaser.Scene {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: 'level' });
  }

  init (datos) {
    if (datos.fuel) {
      this.fuelNeeded = datos.fuel;
    }
    if (datos.delay) {
      this.spawnDelay = datos.delay;
    }
  }

  /**
   * Creación de los elementos de la escena principal de juego
   */
  create() {
     this.player = new Jetpac(this, 60, 120);
     
     this.map = this.make.tilemap({ 
      key: 'tilemap', 
      tileWidth: 8, 
      tileHeight: 8 
    });
    const tileset = this.map.addTilesetImage('ground_ts', 'ground_ts');
    this.groundLayer =  this.map.createLayer('ground', tileset);
    this.groundLayer.setCollisionBetween(0, 999);
    this.physics.add.collider(this.player, this.groundLayer);
    this.physics.add.collider(new Fuel(this), this.groundLayer);

    this.enemies = this.add.group();
    this.time.addEvent( {
      delay: this.spawnDelay || 1000, 
      callback: ()=> this.spawnEnemy(),
      callbackScope: this,
      loop: true
    });

    this.physics.add.collider(this.enemies, this.groundLayer, (enemy, layer)=> enemy.explode());
    this.physics.add.collider(this.enemies, this.player, (enemy, player) => this.playerDeath(enemy, player));

    this.spaceship = new Spaceship(this,160, this.fuelNeeded || 3);
  }

  playerDeath(enemy, player) {
    enemy.explode();
    player.dead();
  }

  spawnEnemy() {
    this.enemies.add(new Enemy(this));
  }
}