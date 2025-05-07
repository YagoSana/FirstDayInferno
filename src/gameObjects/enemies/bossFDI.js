import Phaser from 'phaser';
import Npc from './npc.js';
import Laser from '../projectiles/laser.js';

export default class BossFDI extends Npc {

  /**
   * Constructor de la Plataforma
   * @param {Phaser.Scene} scene Escena a la que pertenece la plataforma
   * @param {number} x Coordenada x
   * @param {number} y Coordenada y
   */

  constructor(scene, x, y, fase) {
    if (fase == 1) {
      super(scene, x, y, "bossFDIIdle");
      this.type = "bossFDIfase1";
    }
    else if (fase == 2) {
      super(scene, x, y, "bossFDIfase2");
      this.type = "bossFDIfase2";
    }
    this.scene = scene;
    this.fase = fase;
    this.maxHealth = 100;
    this.health = 100;
    this.speed = 50;
    this.stunCounter = 0;
    this.attackRange = 150; // Distancia máxima de ataque
    this.assaultCooldown = 5000; // Enfriamiento para embestida
    this.isAssaulting = false;
    this.assaultTime = 0;  // El tiempo de duración de la embestida
    this.assaultSpeed = 250; // Velocidad de la embestida (puedes ajustarla)
    this.assaultDirection = new Phaser.Math.Vector2(); // Dirección de la embestida
    this.setScale(0.3);
    this.body.setSize(1100, 300); // Tamaño del cuerpo del enemigo 
    this.puedeInvocar = true;
    this.dead = false;
    this.setDepth(999);
    this.initialX = x;
    this.initialY = y;
    this.ataqueLaserCooldown = 15000; // Enfriamiento para ataque de láser
    this.ataqueLaserTime = 0; // Tiempo de ataque de láser
  }

  // Sobrescribimos la función preUpdate para agregar la lógica de ataque a distancia


  preUpdate(t, dt) {
    super.preUpdate(t, dt);
  }

  mypreUpdate(t, dt) {
    if (!this.dead) {
      if (this.stunCounter > 0) {
        this.stunCounter--;
        if (this.stunCounter > 20) {
          this.setTint(0xff0000);
        }
      } else {
        this.setTint(0xffffff);
      }
      if (this.fase == 1) {
        this.play("bossFDIIdle", true);
        // Lanzar escena de barra de vida
        if (!this.scene.scene.isActive('BossHealthBarScene')) {
          console.log('BOSS BAR LANZADA');
          this.scene.scene.launch('BossHealthBarScene', {
            type: this.type,
            maxHealth: this.maxHealth,
            currentHealth: this.health
          });
          this.scene.scene.bringToTop('BossHealthBarScene');
        }
      }
      else if (this.fase == 2) {
        if (!this.scene.scene.isActive('BossHealthBarScene')) {
          console.log('BOSS BAR LANZADA');
          this.scene.scene.launch('BossHealthBarScene', {
            type: this.type,
            maxHealth: this.maxHealth,
            currentHealth: this.health
          });
          this.scene.scene.bringToTop('BossHealthBarScene');
        }
        const waveX = Math.sin(t * 0.0003 * 3) * 180; // izquierda-derecha
        const waveY = Math.cos(t * 0.0006 * 3 * 1.3) * 20;  // subida-bajada
        this.setX(this.initialX + waveX);
        this.setY(this.initialY + waveY);
        if (t - this.ataqueLaserTime > this.ataqueLaserCooldown) {
          if (!this.lastLaserTime) this.lastLaserTime = t;
          if (t - this.lastLaserTime > 400) {
            this.launchLaserAttack();
            this.lastLaserTime = t;
          }
          this.scene.time.delayedCall(3500, () => {
            this.ataqueLaserTime = t;
          });
        }
      }
    }
  }

  hitBullet(enemy, bullet) {
    //Enemigo muere
    this.stunCounter = 30;
    this.health--;
    this.speed += 10;

    console.log("escena", this.scene);
    // Emitir evento de cambio de salud
    this.scene.game.events.emit('bossHealthChanged', {
      currentHealth: this.health,
      maxHealth: this.maxHealth
    });

    if (this.health <= 0) {
      this.body.enable = false;
      this.body.setVelocity(0, 0);
      this.dead = true;
      if (this.fase == 1) {
        //dialogo y cambio sala
        this.scene.game.events.emit('bossDefeated');
        this.scene.scene.stop('BossHealthBarScene');
      }
      else if (this.fase == 2) {
        //animacion final
        this.scene.game.events.emit('bossDefeated');
        this.scene.scene.stop('BossHealthBarScene');
      }
    }
    bullet.explode();
  }

  launchLaserAttack() {
    const offsets = [-100, 0, 100];

    offsets.forEach((offsetX, i) => {
      const laser = new Laser(this.scene, this.x + offsetX, this.y + 10);
      this.scene.physics.add.existing(laser);
      this.scene.add.existing(laser);

      // Colisión
      this.scene.physics.add.overlap(this.scene.player, laser, (player, laser) => {
        if (laser.damageActive) {
          player.hurt();
        }
      });
    });
  }

}
