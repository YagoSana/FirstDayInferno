import Phaser from 'phaser';
import Npc from './npc.js';
import Bullet from '../projectiles/bullet.js';

export default class BossFDI extends Npc {

  /**
   * Constructor de la Plataforma
   * @param {Phaser.Scene} scene Escena a la que pertenece la plataforma
   * @param {number} x Coordenada x
   * @param {number} y Coordenada y
   */

  constructor(scene, x, y, fase) {
    if(fase == 1){
        super(scene, x, y, "bossFDIIdle");
    }
    else if(fase == 2){
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
  }

  // Sobrescribimos la función preUpdate para agregar la lógica de ataque a distancia


  preUpdate(t, dt) {
    super.preUpdate(t, dt);
  }

  mypreUpdate(t, dt) {
    if(!this.dead){
        if(this.fase == 1){
            this.play("bossFDIIdle", true);
        }
        else if(this.fase == 2){

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
      if(this.fase == 1){
        //dialogo y cambio sala
      }
      else if(this.fase == 2){
        //animacion final
      }
    }
    bullet.explode();
  }
}
