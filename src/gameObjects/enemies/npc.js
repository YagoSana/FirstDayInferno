import Phaser from "phaser";
import SpriteBase from "../spriteBase.js";
import Item from "../items/item.js";

/**
 * Clase que representa la base sobre la que se sitúan las estrellas que aparecen en el juego
 */
export default class Npc extends SpriteBase {
  /**
   * @param {Phaser.Scene} scene Escena a la que pertenece la base
   * @param {number} x Coordenada x
   * @param {number} y Coordenada y
   */
  constructor(scene, x, y, spriteKey, key = false) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.spriteKey = spriteKey;
    this.scene.physics.add.collider(
      this,
      scene.player,
      this.hitPlayer,
      null,
      this
    );
    this.scene.physics.add.collider(
      this,
      scene.bulletGroup,
      this.hitBullet,
      null,
      this
    );
    this.scene.physics.add.collider(this, scene.enemyGroup);
    this.sonidoDropMoneda = this.scene.sound.add("enemigoSueltaMoneda");
    
    this.sonidoDying = this.scene.sound.add("dying");
    this.dropKey = key;
    this.isFrozen = false;
  }

  hitPlayer(enemy, player) {
    // Llamar a la función playerHurt del jugador cuando lo toca
    player.lastDamageSource = this.spriteKey;
    player.lastDamageType = "enemy";
    this.stunCounter = 20;
    player.hurt();
  }

  hitBullet(enemy, bullet) {
    console.log("vida: ", this.health);
    if (bullet.freeze && !this.isFrozen && this.health > 1) {
      this.freeze(2000); // 2 segundos
    }
    //Enemigo muere
    this.stunCounter = 30;
    this.health--;
    if (this.health <= 0) {
      this.sonidoDying.play();
      if (this.dropKey) {
        const key = new Item(this.scene, this.x, this.y, "llave");
      } else {
        if (Phaser.Math.Between(1, 100) <= 33) {
          this.dropCoin();
        }
      }
      this.scene.numEnemiesBeaten++;
      this.body.setVelocity(0, 0);
      this.body.enable = false;
      this.play("blood", true);
      this.once("animationcomplete", () => {
        this.scene.add
          .sprite(this.x, this.y, "blood")
          .setVisible(true)
          .setDepth(3)
          .setFrame(12);
        this.destroy();
      });
    }
    bullet.explode();
  }

  preUpdate(t, dt) {
    if (this.isFrozen && this.health > 0) {
      if (this.stunCounter > 0) {
        this.stunCounter--;
        this.setTint(0x00ffff);
      }
    } else {
      this.clearTint();
      super.preUpdate(t, dt);
      this.mypreUpdate(t, dt);
    }
  }

  dropCoin() {
    this.sonidoDropMoneda.play();
    const coin = new Item(this.scene, this.x, this.y, "moneda");
  }

  freeze(duration) {
    console.log("congelado! se mete en freeze");
    this.isFrozen = true;

    if (this.body) {
      this.body.setVelocity(0, 0);
      this.body.setImmovable(true);
    }

    this.scene.time.delayedCall(duration, () => {
      this.clearTint();
      this.isFrozen = false;
    });
    
    if (this.body) {
      this.body.setImmovable(false);
    }
  }
}
