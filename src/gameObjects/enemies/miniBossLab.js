import RangedEnemy from './rangedEnemy.js';
import Bullet from '../projectiles/bullet.js';
import ChargedEnemy from './chargedEnemy.js';

export default class MiniBoss extends RangedEnemy {
  constructor(scene, x, y, type = 'nerd') {
    super(scene, x, y, type);

    this.type = type;
    this.isInvulnerable = true;
    this.guardians = [];
    this.attackCooldown = 3000;
    this.attackTimer = 0;
    this.teleportCooldown = 5000;
    this.teleportTimer = 0;
    this.attackPhase = 0;

    this.setTexture(this.type);
    this.play(`${this.type}_move`, true);

    this.spawnGuardians();

    this.setScale(1.5);
    this.setTint(0xffcc00);

    this.health = 10;
  }

  spawnGuardians() {
    const offsets = [-100, 100];
    offsets.forEach(offset => {
      const guardian = new ChargedEnemy(this.scene, this.x + offset, this.y + 60, this.type);
      guardian.setScale(1);
      this.scene.enemyGroup.add(guardian);
      this.guardians.push(guardian);
    });

  }

  flashEffect() {
    if (this.active) {
        // Guardar el tintado original si es la primera vez
        if (this.originalTint === undefined) {
            this.originalTint = this.tint;
        }

        // Flash blanco
        this.setTint(0x737373);
        // console.log('flash effect');
        // Volver al color original después de 100ms
        this.scene.time.delayedCall(600, () => {
            if (this.active) { // Verificar si el objeto existe
                this.setTint(this.originalTint);
            }
        });
    }
}

  hitbullet(enemy, bullet){
  this.flashEffect();
  super.hitBullet(enemy, bullet);
  }

  mypreUpdate(time, delta) {

    if (!this.active || this.destroyed) return;
    this.attackTimer -= delta;
    this.teleportTimer -= delta;

    // Elimina guardianes muertos
    this.guardians = this.guardians.filter(g => g && g.active);

    if (this.guardians.length === 0 && this.isInvulnerable) {
      this.isInvulnerable = false;
      this.clearTint();
    }

    if (this.isInvulnerable) {
      this.speed = 0;
      this.play(`${this.type}_move`, true);
      return;
    }

    // Movimiento hacia el jugador si está lejos
    if (this.scene && this.scene.player && this.active && !this.destroyed && Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) > this.attackRange) {
      this.scene.physics.moveToObject(this, this.scene.player, this.speed);
    } else {
      this.body.setVelocity(0, 0);
    }
    
    

    // Ataque
    if (this.attackTimer <= 0) {
      this.attackPhase++;
      if (this.attackPhase % 3 === 0) {
        this.performAoEAttack();
      } else {
        this.shoot();
      }
      this.attackTimer = this.attackCooldown;
    }

    // Teletransporte mientras queden guardianes
    if (this.teleportTimer <= 0 && this.guardians.length > 0) {
      this.teleport();
      this.teleportTimer = this.teleportCooldown;
    }
  }

  performAoEAttack() {
    this.play(`${this.type}_shoot`, true);

    const numProjectiles = 8;
    const angleStep = 360 / numProjectiles;

    for (let i = 0; i < numProjectiles; i++) {
      const angle = angleStep * i;
      const dirX = Math.cos(Phaser.Math.DegToRad(angle));
      const dirY = Math.sin(Phaser.Math.DegToRad(angle));

      new Bullet(this.scene, this.x, this.y, dirX, dirY, 0, 0, false, `${this.type}bullet`, this.type);
    }
  }

  teleport() {
    const player = this.scene.player;
    if (!player) return;

    const offsetX = Phaser.Math.Between(-200, 200);
    const offsetY = Phaser.Math.Between(-200, 200);
    this.setPosition(player.x + offsetX, player.y + offsetY);
    this.play(`${this.type}_move`, true);
  }

  receiveBulletDamage(damage = 1) {
    if (this.isInvulnerable) return;

    this.health -= damage;
    if (this.health <= 0) {
      this.destroy();
    } else {
      this.setTint(0xff9999);
      this.scene.time.delayedCall(200, () => this.clearTint());
    }
  }
}
