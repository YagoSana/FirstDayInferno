import Phaser from 'phaser';
import Npc from './npc.js';

export default class WakeEnemy extends Npc {
  
  /**
   * Constructor de la Plataforma
   * @param {Phaser.Scene} scene Escena a la que pertenece la plataforma
   * @param {number} x Coordenada x
   * @param {number} y Coordenada y
   */

  constructor(scene, x, y, type) {
    super(scene, x, y, type); // Llamada al constructor de la clase base (Enemy)
    this.type=type;
    this.health=3;
    this.speed = 110;
    this.stunCounter = 0;
    this.despierto=false;
    this.setScale(1.5);
    this.body.setSize(18, 16);
    this.body.setOffset(0, 0);
  }

  // Sobrescribimos la función preUpdate para agregar la lógica de ataque a distancia
  preUpdate(t, dt) {
        super.preUpdate(t, dt);
        if(this.health>0){
            if(this.stunCounter>0){
                this.stunCounter--;
                if(this.stunCounter>20){
                    this.setTint(0xff0000);
                }      
                this.body.setVelocity(0, 0);
            } else if(this.despierto){
                if(this.anims.currentAnim && this.anims.currentAnim.key === `${this.type}_wake`){
                  this.body.setVelocity(0, 0);
                }
                else{
                  this.play(`${this.type}_void`, true);
                  this.scene.physics.moveToObject(this, this.scene.player, this.speed);
                  if(this.body.velocity.x < 0){
                      this.flipX = true;
                  }
                  else{
                    this.flipX = false;                 
                  }
                }
                this.setTint(0xffffff);
            }
            else{
                this.play(`${this.type}_idle`, true);
                this.body.setVelocity(0, 0);
            }
        }

  }

  hitBullet(enemy, bullet){
    //Enemigo muere
    if(this.despierto){
      this.stunCounter = 30;
      this.health--;
      if(this.health <= 0){
        this.body.setVelocity(0,0);
        this.play("enemydeath", true);
        this.once('animationcomplete', () => {
          this.destroy();
        });
      }
    }
    else{
      this.despierto = true;
      this.play(`${this.type}_wake`, true);
      this.once('animationcomplete', () => {
          this.play(`${this.type}_void`, true);
      });
    }
    bullet.explode();
  }
}
