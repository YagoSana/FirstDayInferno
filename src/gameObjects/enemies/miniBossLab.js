import Phaser from "phaser";
import RangedEnemy from './rangedEnemy.js';
import Bullet from '../projectiles/bullet.js';

export default class MiniBoss extends RangedEnemy {
  constructor(scene, x, y, type = 'nerd') {
    super(scene, x, y, type); // Usa animaciones tipo 'nerd_move', 'nerd_shoot', etc.

    this.type = type;
    this.isInvulnerable = true;
    this.guardians = [];
    this.attackCooldown = 3000; // Intervalo entre ataques
    this.attackTimer = 0; // Temporizador de ataque
    this.teleportCooldown = 5000; // Enfriamiento de teletransporte
    this.teleportTimer = 0; // Temporizador de teletransporte
    this.attackPhase = 0; // Control de fase de ataque
    this.lastTeleport = 0;

    this.setTexture(this.type); // Asegura que el sprite sea correcto
    this.play(`${this.type}_move`, true);

    // Crear 2 guardianes
    this.spawnGuardians();

    // Estética de boss (opcional)
    this.setScale(1.5);
    this.setTint(0xffcc00); // Amarillo dorado para dar feeling de jefe

    this.health = 10; // Más vida que un enemigo normal
  }

  spawnGuardians() {
    const offsets = [-100, 100];
    offsets.forEach(offset => {
      const guardian = new RangedEnemy(this.scene, this.x + offset, this.y + 60, this.type);
      guardian.setScale(1); // Más pequeños que el miniboss
      this.scene.enemyGroup.add(guardian);
      this.guardians.push(guardian);
    });
  }

  preUpdate(time, delta) {
    this.attackTimer -= delta;
    this.teleportTimer -= delta;

    // Verificar si los guardianes siguen vivos
    this.guardians = this.guardians.filter(g => g.active);

    if (this.guardians.length === 0 && this.isInvulnerable) {
      this.isInvulnerable = false;
      this.clearTint(); // Quitar color de invulnerabilidad
    }

    // Si el miniboss es invulnerable, no hace nada
    if (this.isInvulnerable) {
      this.speed=0;
      this.play(`${this.type}_move`, true);
      return;
    }

    // Si el miniboss ya no está invulnerable, sigue al jugador y ataca
    super.preUpdate(time, delta);

    // Lógica de ataque según la fase
    if (this.attackTimer <= 0) {
      this.attackPhase++;
      if (this.attackPhase % 3 === 0) {
        this.performAoEAttack();
      } else {
        this.shoot();
      }
      this.attackTimer = this.attackCooldown;
    }

    // Lógica de teletransporte aleatorio para evitar que el jugador se quede cerca
    if (this.teleportTimer <= 0 && this.guardians.length > 0) {
      this.teleport();
      this.teleportTimer = this.teleportCooldown;
    }
  }

  // Ataque de área (AoE)
  performAoEAttack() {
    this.play(`${this.type}_shoot`, true); // Animación de ataque

    // Crear una explosión de proyectiles que se disparan en todas direcciones
    const numProjectiles = 8;
    const angleStep = 360 / numProjectiles;

    for (let i = 0; i < numProjectiles; i++) {
      const angle = angleStep * i;
      const dirX = Math.cos(Phaser.Math.DegToRad(angle));
      const dirY = Math.sin(Phaser.Math.DegToRad(angle));

      // Crear proyectiles que se disparan en diferentes direcciones
      new Bullet(this.scene, this.x, this.y, dirX, dirY, 0, 0, false, `${this.type}bullet`, this.type);
    }
  }

  // Teletransportarse a una nueva posición aleatoria cerca del jugador
  teleport() {
    const player = this.scene.player;
    const offsetX = Phaser.Math.Between(-200, 200);
    const offsetY = Phaser.Math.Between(-200, 200);
    this.setPosition(player.x + offsetX, player.y + offsetY);
    this.play(`${this.type}_move`, true);
  }

  // Sobrescribimos para evitar que reciba daño si aún es invulnerable
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
