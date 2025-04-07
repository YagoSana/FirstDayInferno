import Phaser from 'phaser';
import Bullet from '../projectiles/bullet.js';
import Npc from './npc.js';

export default class RangedEnemy extends Npc {
  
  constructor(scene, x, y, type) {
    super(scene, x, y, type);
    this.type = type;
    this.attackCooldown = 0; // Enfriamiento para disparar
    this.attackRange = 2000; // Distancia máxima de ataque
    this.attackSpeed = 4000; // Enfriamiento entre disparos en milisegundos
    this.health = 4;
    this.speed = 0;
    this.stunCounter = 0;
    this.shootDelay = 200; // Retraso entre disparos en milisegundos
    this.inmortal=true;
    this.guardiansLive=2;
    this.invulnerable=false;
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);

    if (this.health > 0) {
      if (this.anims.currentAnim && this.anims.currentAnim.key === `${this.type}_shoot`) {
        this.setTint(0xffffff);
      } else {
        this.setTint(0xffffff);
        this.play(`${this.type}_move`, true);

      } if (Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) <=300) {
        this.inmortal = false; // El enemigo deja de ser invencible cuando está en rango
      }
      else this.inmortal=true;
      // Si el enemigo está cerca del jugador y no está en cooldown, dispara
      if (Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) <= this.attackRange) {
        this.body.setVelocity(0, 0);

        // Si el enemigo está cerca del jugador y no está en cooldown, dispara
        if (this.attackCooldown <= 0) {
          this.shoot();  // Llamamos la función shoot para disparar las balas
          this.attackCooldown = this.attackSpeed;
        }
      } else {
        this.scene.physics.moveToObject(this, this.scene.player, this.speed);
        if (this.body.velocity.x < 0) {
          this.flipX = false;
        } else {
          this.flipX = true;
        }
      }
      
      // Reducir el tiempo de cooldown
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
// Sobrescribir hitBullet de la clase base
hitBullet(enemy, bullet){
    //Enemigo muere
    if(!this.inmortal && !this.invulnerable){
    this.stunCounter = 30;
    this.health--;
    if(this.health <= 0){
      if (Phaser.Math.Between(1, 100) <= 33) {
        this.dropCoin();
      }
      this.scene.numEnemiesBeaten++;
      this.body.setVelocity(0,0);
      this.body.enable = false;
      this.play("blood", true);
      this.once('animationcomplete', () => {
        this.scene.add.sprite(this.x, this.y, "blood").setVisible(true).setDepth(3).setFrame(12);
        this.destroy();
      });
    }
    
}
bullet.explode();
  }
  
  // Función para disparar 3 proyectiles en el eje X
  shoot() {
    this.play(`${this.type}_shoot`, true);
    this.once('animationcomplete', () => {
      this.play(`${this.type}_move`);
    });

    // Disparar balas constantemente en el eje X (hacia la derecha o izquierda)
    const direction = this.flipX ? 1 : -1;  // Verificamos si está mirando hacia la derecha o izquierda

    // Disparar 3 balas con un pequeño retraso entre ellas
    this.scene.time.delayedCall(0, () => {
      new Bullet(this.scene, this.x, this.y, direction, 0, 0, 0, false, `${this.type}bullet`);
    });
    this.scene.time.delayedCall(this.shootDelay, () => {
      new Bullet(this.scene, this.x, this.y, direction, 0, 0, 0, false, `${this.type}bullet`);
    });
    this.scene.time.delayedCall(this.shootDelay * 2, () => {
      new Bullet(this.scene, this.x, this.y, direction, 0, 0, 0, false, `${this.type}bullet`);
    });
    
  }

}
