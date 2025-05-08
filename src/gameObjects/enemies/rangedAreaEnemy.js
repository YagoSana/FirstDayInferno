import Phaser from 'phaser';
import Bullet from '../projectiles/bullet.js';
import Npc from './npc.js';

export default class RangedAreaEnemy extends Npc {
  constructor(scene, x, y, type, key = false) {
    super(scene, x, y, type);
    this.type = type;
    this.attackCooldown = 0;
    this.attackRange = 200;
    this.attackSpeed = 3000;
    this.health = 4;
    this.speed = 90;
    this.stunCounter = 0;
    this.dropKey = key;
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);
  }

  mypreUpdate(t, dt) {
    if (this.health > 0) {
      if (this.anims.currentAnim && this.anims.currentAnim.key === `${this.type}_shoot`) {
        this.setTint(0xffffff);
      } else {
        this.setTint(0xffffff);
        this.play(`${this.type}_move`, true);
      }

      if (Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) <= this.attackRange) {
        this.body.setVelocity(0, 0);
        if (this.attackCooldown <= 0) {
          this.shoot();
          this.attackCooldown = this.attackSpeed;
        }
      } else {
        this.scene.physics.moveToObject(this, this.scene.player, this.speed);
        this.flipX = this.body.velocity.x >= 0;
      }

      if (this.attackCooldown > 0) {
        this.attackCooldown -= dt;
      }

      if (this.stunCounter > 0) {
        this.stunCounter--;
        if (this.stunCounter > 20) {
          this.setTint(0xff0000);
        }
      } else {
        this.setTint(0xffffff);
      }
    }
  }

  shoot() {
    this.play(`${this.type}_shoot`, true);
    this.once('animationcomplete', () => {
      this.play(`${this.type}_move`);
    });

    const angleStep = (2 * Math.PI) / 8; // Ocho balas en círculo
    for (let i = 0; i < 8; i++) {
      const angle = i * angleStep;
      const dirX = Math.cos(angle);
      const dirY = Math.sin(angle);
      new Bullet(this.scene, this.x, this.y, dirX, dirY, 0, 0, false, `${this.type}bullet`, this.type);
    }
  }
}
