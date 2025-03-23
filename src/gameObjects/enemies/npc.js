import Phaser from 'phaser'
import SpriteBase from '../spriteBase.js';

/**
 * Clase que representa la base sobre la que se sitúan las estrellas que aparecen en el juego
 */
export default class Npc extends SpriteBase {   
    /**
     * @param {Phaser.Scene} scene Escena a la que pertenece la base
     * @param {number} x Coordenada x
     * @param {number} y Coordenada y 
     */
    constructor(scene, x, y, spriteKey) {
        super(scene, x, y, spriteKey);
        this.scene = scene;
        this.scene.physics.add.collider(this, scene.player, this.hitPlayer, null, this);
        this.scene.physics.add.collider(this, scene.bulletGroup, this.hitBullet, null, this);
        this.scene.physics.add.collider(this, scene.enemyGroup);
    }

    hitPlayer(enemy, player) {
        // Llamar a la función playerHurt del jugador cuando lo toca
        this.stunCounter=20;
        player.hurt();
    }
    
    hitBullet(enemy, bullet){
        //Enemigo muere
        this.stunCounter = 30;
        this.health--;
        if(this.health <= 0){
          this.scene.numEnemiesBeaten++;
          this.body.setVelocity(0,0);
          this.play("enemydeath", true);
          this.once('animationcomplete', () => {
            this.destroy();
          });
        }
        bullet.explode();
      }

      preUpdate(t, dt) {
        super.preUpdate(t, dt);
    }
}
