import Phaser from 'phaser';
import Npc from './npc.js';
import Bullet from '../projectiles/bullet.js';
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
    }
    else if (fase == 2) {
      super(scene, x, y, "bossFDIfase2");
    }
    this.scene = scene;
    this.fase = fase;
    this.health = 50;
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
      }
      else if (this.fase == 2) {
        const waveX = Math.sin(t * 0.0003 * 3) * 180; // izquierda-derecha
        const waveY = Math.cos(t * 0.0006 * 3 * 1.3) * 20;  // subida-bajada
        this.setX(this.initialX + waveX);
        this.setY(this.initialY + waveY);
        if (!this.lastLaserTime) this.lastLaserTime = t;
        if (t - this.lastLaserTime > 400) {
          this.launchLaserAttack();
          this.lastLaserTime = t;
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

    if (this.health <= 0) {
      this.body.enable = false;
      this.body.setVelocity(0, 0);
      this.dead = true;
      if (this.fase == 1) {
        //dialogo y cambio sala
      }
      else if (this.fase == 2) {
        //animacion final
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
