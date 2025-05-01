import RangedEnemy from './rangedEnemy.js';
import Bullet from '../projectiles/bullet.js';
import ChargedEnemy from './chargedEnemy.js';

export default class MiniBoss extends RangedEnemy {
  constructor(scene, x, y, type = 'nerd') {
    super(scene, x, y, type);

    this.type = type;
    this.isInvulnerable = true;
    this.guardians = [];
    this.guardiansWereAlive = true;

    this.attackCooldown = 3000;
    this.attackTimer = 0;
    this.teleportCooldown = 5000;
    this.teleportTimer = 0;
    this.guardianRespawnCooldown = 15000;
    this.guardianRespawnTimer = 0;
    this.attackPhase = 0;

    this.difficultyTimer = 0;
    this.difficultyInterval = 15000;

    this.setTexture(this.type);
    this.play(`${this.type}_move`, true);

    this.spawnGuardians();

    this.setScale(1.5);
    this.setTint(0xffcc00);

    this.health = 30;
  }

  spawnGuardians() {
    const offsets = [-100, 100];
    offsets.forEach(offset => {
      const guardian = new ChargedEnemy(this.scene, this.x + offset, this.y + 60, this.type);
      guardian.setScale(1);
      this.scene.enemyGroup.add(guardian);
      this.guardians.push(guardian);
    });

    this.isInvulnerable = true;
  this.setTint(0xffcc00);
  this.body.setVelocity(0, 0); // Detener movimiento
  this.play(`${this.type}_move`, true);
  }

  flashEffect() {
    if (this.active) {
      if (this.originalTint === undefined) {
        this.originalTint = this.tint;
      }

      this.setTint(0x737373);
      this.scene.time.delayedCall(600, () => {
        if (this.active) {
          this.setTint(this.originalTint);
        }
      });
    }
  }

  hitbullet(enemy, bullet) {
    this.flashEffect();
    super.hitBullet(enemy, bullet);
  }

  mypreUpdate(time, delta) {
    if (!this.active || this.destroyed) return;

    this.attackTimer -= delta;
    this.teleportTimer -= delta;
    this.guardianRespawnTimer -= delta;
    this.difficultyTimer += delta;

    // Actualizar guardianes activos
    this.guardians = this.guardians.filter(g => g && g.active);

    // Detectar muerte de ambos guardianes y comenzar el contador
    if (this.guardians.length === 0 && this.guardiansWereAlive) {
      this.guardianRespawnTimer = this.guardianRespawnCooldown;
      this.guardiansWereAlive = false;
    }

    // Reiniciar el flag si al menos uno está vivo
    if (this.guardians.length > 0) {
      this.guardiansWereAlive = true;
    }

    // Respawn si han muerto ambos y pasó el tiempo
    if (this.guardians.length === 0 && this.guardianRespawnTimer <= 0) {
      this.spawnGuardians();
    }

    // Pierde invulnerabilidad si ya no hay guardianes vivos
    if (this.guardians.length === 0 && this.isInvulnerable) {
      this.isInvulnerable = false;
      this.clearTint();
    }

    if (this.isInvulnerable) {
      this.speed = 0;
      this.play(`${this.type}_move`, true);
      return;
    }

    // Movimiento hacia el jugador
    if (
      this.scene && this.scene.player && this.active && !this.destroyed &&
      Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) > this.attackRange
    ) {
      this.scene.physics.moveToObject(this, this.scene.player, this.speed);
    } else {
      this.body.setVelocity(0, 0);
    }

    // Ataque por fases
    if (this.attackTimer <= 0) {
      this.attackPhase++;
      if (this.attackPhase % 5 === 0) {
        this.performAoEAttack();
      } else if (this.attackPhase % 2 === 0) {
        this.burstAttack();
      } else {
        this.shoot();
      }
      this.attackTimer = this.attackCooldown;
    }

    // Teletransporte si tiene guardianes
    if (this.teleportTimer <= 0 && this.guardians.length > 0) {
      this.teleport();
      this.teleportTimer = this.teleportCooldown;
    }

    // Incremento de dificultad progresiva
    if (this.difficultyTimer >= this.difficultyInterval) {
      this.difficultyTimer = 0;
      this.attackCooldown = Math.max(1000, this.attackCooldown - 200);
      this.teleportCooldown = Math.max(2000, this.teleportCooldown - 300);
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

  burstAttack() {
    this.play(`${this.type}_shoot`, true);
    for (let i = 0; i < 5; i++) {
      this.scene.time.delayedCall(i * 150, () => {
        if (!this.active) return;
        const dirX = Phaser.Math.Between(-1, 1);
        const dirY = Phaser.Math.Between(-1, 1);
        new Bullet(this.scene, this.x, this.y, dirX, dirY, 0, 0, false, `${this.type}bullet`, this.type);
      });
    }
  }

  shoot() {
    this.play(`${this.type}_shoot`, true);

    const player = this.scene.player;
    if (!player) return;

    const predictionTime = 300;
    const predictedX = player.x + player.body.velocity.x * (predictionTime / 1000);
    const predictedY = player.y + player.body.velocity.y * (predictionTime / 1000);

    const dir = new Phaser.Math.Vector2(predictedX - this.x, predictedY - this.y).normalize();
    new Bullet(this.scene, this.x, this.y, dir.x, dir.y, 0, 0, false, `${this.type}bullet`, this.type);
  }

  teleport() {
    const player = this.scene.player;
    if (!player) return;

    const offsetX = Phaser.Math.Between(-50, 50);
    const offsetY = Phaser.Math.Between(-50, 50);
    this.setPosition(player.x + offsetX, player.y + offsetY);
    this.play(`${this.type}_move`, true);
  }

  receiveBulletDamage(damage = 1) {
    if (this.isInvulnerable) return;

    this.health -= damage;
    if (this.health <= 0) {
      this.guardians.forEach(g => {
        if (g && g.active) g.destroy();
      });
      this.destroy();
    } else {
      this.setTint(0xff9999);
      this.scene.time.delayedCall(200, () => this.clearTint());
    }
  }
}
