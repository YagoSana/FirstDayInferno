import Phaser from 'phaser';
import Bullet from '../projectiles/bullet.js';
import Npc from './npc.js';

export default class ChargedEnemy extends Npc {
  
  constructor(scene, x, y, type) {
    super(scene, x, y, type);
    this.type = type;
    this.attackCooldown = 0; 
    this.attackRange = 300;
    this.chargeTime = 2000;
    this.health = 6;
    this.speed = 0;
    this.stunCounter = 0;
    this.inmortal = false;
    this.isCharging = false;
    this.chargeProgress = 0;

    this.originalX = x;
    this.originalY = y;

    // Siempre reproducir server_static
    this.play('server_static');
  }

  preUpdate(t, dt){
    super.preUpdate(t, dt);
  }

  mypreUpdate(t, dt) {
    if (this.health > 0) {
      this.body.setVelocity(0, 0);

      if (!this.isCharging && this.attackCooldown <= 0) {
        this.startCharging();
      }

      if (this.isCharging) {
        this.chargeProgress += dt / this.chargeTime;
        if (this.chargeProgress > 1) this.chargeProgress = 1;

        // Tinte rojo progresivo
        const redIntensity = Phaser.Math.Linear(255, 100, this.chargeProgress);
        const color = Phaser.Display.Color.GetColor(255, redIntensity, redIntensity);
        this.setTint(color);

        // Escalado progresivo
        const scale = Phaser.Math.Linear(1, 1.3, this.chargeProgress);
        this.setScale(scale);

        // Vibración durante carga
        const intensity = 2;
        const offsetX = Phaser.Math.Between(-intensity, intensity);
        const offsetY = Phaser.Math.Between(-intensity, intensity);
        this.setPosition(this.originalX + offsetX, this.originalY + offsetY);

      } else {
        // Reset visual
        this.setTint(0xffffff);
        this.setScale(1);
        this.setPosition(this.originalX, this.originalY);
      }

      if (this.attackCooldown > 0) {
        this.attackCooldown -= dt;
      }
    }
  }

  startCharging() {
    this.isCharging = true;
    this.chargeProgress = 0;

    this.scene.time.delayedCall(this.chargeTime, () => {
      this.finishCharging();
    });
  }

  finishCharging() {
    this.isCharging = false;
    this.setTint(0xffffff);
    this.setScale(1);
    this.setPosition(this.originalX, this.originalY);

    this.shootAreaAttack();
    this.attackCooldown = 3000;
  }

  shootAreaAttack() {
    this.scene.tweens.add({
      targets: this,
      x: this.x + 3,
      duration: 80,
      yoyo: true,
      repeat: 3,
      ease: 'Sine.easeInOut'
    });

    const angleStep = (2 * Math.PI) / 8; // 8 balas en círculo
    for (let i = 0; i < 8; i++) {
      const angle = i * angleStep;
      const dirX = Math.cos(angle);
      const dirY = Math.sin(angle);
      new Bullet(this.scene, this.x, this.y, dirX, dirY, 0, 0, false, 'binaryBullet');
    }
  }

  hitBullet(enemy, bullet) {
    if (!this.inmortal && !this.invulnerable) {
      super.hitBullet(enemy, bullet);
    }
  }
}
