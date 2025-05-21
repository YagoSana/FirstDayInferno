import Phaser from 'phaser';
import Npc from './npc.js';
import Laser from '../projectiles/laser.js';
import Bullet from '../projectiles/bullet.js';

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
    this.ataqueInvocacionCooldown = 20000; // Enfriamiento para invocación de enemigos
    this.ataqueVacioCooldown = 2000; // Enfriamiento para ataque vacío
    this.ataqueLaserTime = 0; // Tiempo de ataque de láser
    this.ataqueVacioTime = 0; // Tiempo de ataque vacío
    //this.sonidoDying = this.scene.sound.add("whooshFDI");
  }

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
      if (this.fase == 2) {
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
        if (t - this.ataqueVacioTime > this.ataqueVacioCooldown) {
          this.ataqueVacioTime = t;
          let vacio = new Bullet(this.scene, this.x, this.y, 0, 0, 0, 0, false, "bossFDIBullet", "bossFDI");
          this.scene.enemyBulletGroup.add(vacio);
          vacio.disparaVacio();
        }
      }
    }
  }

  hitBullet(enemy, bullet) {
    this.stunCounter = 30;
    this.health--;
    this.speed += 10;
    console.log("escena", this.scene);
    this.scene.game.events.emit('bossHealthChanged', {
      currentHealth: this.health,
      maxHealth: this.maxHealth
    });

    if (this.health <= 0) {
      //this.sonidoDying.play();
      this.scene.cameras.main.fadeOut(3000, 0, 0, 0);
      this.body.enable = false;
      this.body.setVelocity(0, 0);
      this.dead = true;
      if (this.fase == 2) {
        //final
        this.scene.game.events.emit('bossDefeated', "Esto no ha hecho \n más que empezar... \n Los mayores horrores \n jamás presenciados \n te esperan en la carrera...");
        this.scene.scene.stop('BossHealthBarScene');
      }
    }
    bullet.explode();
  }

  launchLaserAttack() {
    const offsets = [-100, 0, 100];

    offsets.forEach((offsetX, i) => {
      const laser = new Laser(this.scene, this.x + offsetX, this.y + 10);
      this.scene.sound.play('laserFDI', { volume: 0.7 });
      this.scene.physics.add.existing(laser);
      this.scene.add.existing(laser);
      this.scene.physics.add.overlap(this.scene.player, laser, (player, laser) => {
        if (laser.damageActive) {
          player.hurt();
        }
      });
    });
  }

}
