import Phaser from 'phaser';
import Npc from './npc.js';

export default class WakeEnemy extends Npc {

  /**
   * Constructor de la Plataforma
   * @param {Phaser.Scene} scene Escena a la que pertenece la plataforma
   * @param {number} x Coordenada x
   * @param {number} y Coordenada y
   */

  constructor(scene, x, y, type, id) {
    super(scene, x, y, type); // Llamada al constructor de la clase base (Enemy)
    this.type = type;
    this.id = id;
    this.health = 3;
    this.speed = 100;
    this.stunCounter = 0;
    this.despierto = false;
    this.despertando = false;
    this.setScale(1.5);
    this.body.setSize(18, 16);
    this.body.setOffset(0, -6);
  }

  //sobreescribimos la funcion hitPlayer para que el enemigo no haga daño al jugador si esta dormido
  hitPlayer(enemy, player) {
    // Llamar a la función playerHurt del jugador cuando lo toca
    if (this.despierto) {
      this.stunCounter = 20;
      player.hurt();
    }
    else {
      if (!this.despertando) {
        setTimeout(() => {
          this.despierto = true;
        this.scene.numEnemies++;
        }, 800);
      }
      this.despertando = true;
    }
  }
  // Sobrescribimos la función preUpdate para agregar la lógica de ataque a distancia
  preUpdate(t, dt) {
    super.preUpdate(t, dt);
    if (this.health > 0) {
      if (this.stunCounter > 0) {
        this.stunCounter--;
        if (this.stunCounter > 20) {
          this.setTint(0xff0000);
        }
        this.body.setVelocity(0, 0);
      } else if (this.despierto) {
        if (this.anims.currentAnim && this.anims.currentAnim.key === `${this.type}_wake`) {
          this.body.setVelocity(0, 0);
        }
        else {
          this.play(`${this.type}_void`, true);
          this.scene.physics.moveToObject(this, this.scene.player, this.speed);
          if (this.body.velocity.x < 0) {
            this.flipX = true;
          }
          else {
            this.flipX = false;
          }
        }
        this.setTint(0xffffff);
      }
      else {
        this.play(`${this.type}_idle`, true);
        this.body.setVelocity(0, 0);
      }
    }

  }

  hitBullet(enemy, bullet) {
    //Enemigo muere
    if (this.despierto) {
      this.stunCounter = 30;
      this.health--;
      if (this.health <= 0) {
        this.body.setVelocity(0, 0);
        this.scene.numEnemiesBeaten++;
        this.body.enable = false;
        this.play("blood", true);
        this.once('animationcomplete', () => {
          this.scene.add.sprite(this.x, this.y, "blood").setVisible(true).setDepth(3).setFrame(12);
          this.destroy();
        });
        this.scene.game.global.gatosVivos = this.scene.game.global.gatosVivos.filter((id) => id !== this.id); // Eliminar el gato de la lista de gatos vivos
      }
    }
    else {
      this.despierto = true;
      this.play(`${this.type}_wake`, true);
      this.once('animationcomplete', () => {
        this.play(`${this.type}_void`, true);
      });
      this.scene.numEnemies++;
    }
    bullet.explode();
  }
}
