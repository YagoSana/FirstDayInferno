import Item from './item.js';
import Player from './player.js';
import Phaser from 'phaser';
import Enemy from './enemy.js';
import RangedEnemy from './rangedEnemy.js';

/**
 * Escena principal del juego. La escena se compone de una serie de plataformas 
 * sobre las que se sitúan las bases en las podrán aparecer las estrellas. 
 * El juego comienza generando aleatoriamente una base sobre la que generar una estrella. 
 * @abstract Cada vez que el jugador recoge la estrella, aparece una nueva en otra base.
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

    /**
     * Creación de los elementos de la escena principal de juego
     */
    create() {
        this.add.image(2048 / 2, 1024 / 2, "background") // Centrado en (1024, 512)
    .setOrigin(0.5)
    .setScale(2); // Escalado al doble
        this.physics.world.setBounds(0, 0, 2048, 1024);
        this.stars = 10;
        this.bases = this.add.group();
        this.platformGroup = this.physics.add.staticGroup();
        this.bulletGroup = this.physics.add.group();
        this.enemyGroup = this.physics.add.group();
        this.enemyBulletGroup = this.physics.add.group();
        //this.platformGroup.add(new Platform(this, this.player, this.bases, 150, 350));
        //this.platformGroup.add(new Platform(this, this.player, this.bases, 850, 350));
        //this.platformGroup.add(new Platform(this, this.player, this.bases, 500, 200));
        //this.platformGroup.add(new Platform(this, this.player, this.bases, 150, 100));
        //this.platformGroup.add(new Platform(this, this.player, this.bases, 850, 100));
        this.player = new Player(this, 500, 250);
        //this.enemyGroup.add(new Enemy(this, 1000, 250));
        //this.enemyGroup.add(new Enemy(this, 2000, 250));
        this.enemyGroup.add(new RangedEnemy(this, 1000, 500));
        this.cameras.main.setBounds(0, 0, 2048, 1024);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1); // Suavizado
        new Item(this, 100, 100);
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
