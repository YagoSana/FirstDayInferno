import Phaser from 'phaser';
import Npc from './npc.js';

export default class BossMedicina extends Npc {
  
  /**
   * Constructor de la Plataforma
   * @param {Phaser.Scene} scene Escena a la que pertenece la plataforma
   * @param {number} x Coordenada x
   * @param {number} y Coordenada y
   */

  constructor(scene, x, y) {
    super(scene, x, y, "bossMedicinaIdle"); // Llamada al constructor de la clase base (Enemy)
    this.type="bossMedicinaIdle";
    this.health=20;
    this.speed = 50;
    this.stunCounter = 0;
    this.attackRange = 150; // Distancia máxima de ataque
    this.assaultCooldown = 5000; // Enfriamiento para embestida
    this.isAssaulting = false;
    this.assaultTime = 0;  // El tiempo de duración de la embestida
    this.assaultSpeed = 250; // Velocidad de la embestida (puedes ajustarla)
    this.assaultDirection = new Phaser.Math.Vector2(); // Dirección de la embestida
    this.introduction=false;
    this.setScale(1);
  }

  // Sobrescribimos la función preUpdate para agregar la lógica de ataque a distancia
  preUpdate(t, dt) {
    super.preUpdate(t, dt);
    if(!this.introduction){
      this.body.enable = false;
      this.playReverse("bossMedicinaDeath", true);
      this.introduction=true;
      this.scene.cameras.main.shake(800, 0.003);
      //this.scene.cameras.main.shake(100, 0.01);
      this.once('animationcomplete', () => {
        this.play("bossMedicinaIdle2", true);
        this.body.enable = true;
      });
    }
    if (this.health > 0) {
        if(this.body.velocity.x > 0){
          this.flipX = false; // Mirar a la derecha
        }
        else{
          this.flipX = true; // Mirar a la izquierda
        }
        if(!this.isAssaulting && this.anims.currentAnim.key != "bossMedicinaDeath"){
          this.play("bossMedicinaIdle2", true);
        }
        const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);

        if(this.stunCounter>0){
            this.stunCounter--;
            if(this.stunCounter>20){
              this.setTint(0xff0000);
            }      
          } else {
            this.setTint(0xffffff);
          }

        if (this.isAssaulting) {
            this.play("bossMedicinaAssault", true); // Cambia a la animación de embestida
            // Si está embistiendo, mueve al enemigo en la dirección calculada
            this.body.setVelocity(this.assaultDirection.x * this.assaultSpeed, this.assaultDirection.y * this.assaultSpeed);

            // Cuenta el tiempo que dura la embestida
            this.assaultTime -= dt;

            if (this.assaultTime <= 0) {
                // Si ha pasado el tiempo de la embestida, deja de embestir
                this.isAssaulting = false;
                this.body.setVelocity(0, 0);
                this.clearTint();
            }
        } else if (distanceToPlayer <= this.attackRange) {
            // Si el jugador está en rango y no está embistiendo
            if (this.assaultCooldown <= 0) {
                // Comienza la embestida
                this.isAssaulting = true;

                // Establece la dirección de la embestida (hacia la posición del jugador)
                const direction = new Phaser.Math.Vector2(this.scene.player.x - this.x, this.scene.player.y - this.y);
                direction.normalize(); // Normaliza para que tenga una magnitud de 1

                this.assaultDirection.set(direction.x, direction.y); // Dirección hacia el jugador
                this.assaultTime = 800; // Duración de la embestida en milisegundos (puedes cambiarlo)
                
                // Reinicia el cooldown de embestida
                this.assaultCooldown = 2000;

            }
        } else {
            // Si está fuera del rango de embestida, persigue al jugador normalmente
            this.scene.physics.moveToObject(this, this.scene.player, this.speed);
        }

        // Resta el cooldown con el tiempo
        if (this.assaultCooldown > 0) {
            this.assaultCooldown -= dt;
        }
    }
}


  hitBullet(enemy, bullet){
    //Enemigo muere
    this.stunCounter = 30;
    this.health--;
    this.speed+=10;
    if(this.health <= 0){
      this.body.setVelocity(0,0);
      this.play("bossMedicinaDeath", true);
      this.once('animationcomplete', () => {
        this.destroy();
      });
    }
    bullet.explode();
  }
}
