import Phaser from 'phaser';
import Bullet from '../projectiles/bullet.js';
import Npc from './npc.js';

export default class RangedEnemy extends Npc {
  
  /**
   * Constructor de la Plataforma
   * @param {Phaser.Scene} scene Escena a la que pertenece la plataforma
   * @param {number} x Coordenada x
   * @param {number} y Coordenada y
   */

  constructor(scene, x, y, type) {
    super(scene, x, y, type); // Llamada al constructor de la clase base (Enemy)
    this.type=type;
    this.attackCooldown = 0; // Enfriamiento para disparar
    this.attackRange = 180; // Distancia máxima de ataque
    this.attackSpeed = 2000; // Enfriamiento entre disparos en milisegundos
    this.health=4;
    this.speed = 70;
    this.stunCounter = 0;
  }

  // Sobrescribimos la función preUpdate para agregar la lógica de ataque a distancia
  preUpdate(t, dt) {
    super.preUpdate(t, dt); // Llamamos a la función preUpdate de la clase base
    if(this.health>0){
    if (this.anims.currentAnim && this.anims.currentAnim.key === `${this.type}_shoot`) {
      this.setTint(0xffffff);;
    }
    else{
      this.setTint(0xffffff);
      this.play(`${this.type}_move`, true);
    }
    // Si el enemigo está lejos del jugador, sigue al jugador
    if (Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) <= this.attackRange) {
      this.body.setVelocity(0,0);
        // Si el enemigo está cerca del jugador y no está en cooldown, dispara
      if (this.attackCooldown <= 0) {
        this.shoot();
        this.attackCooldown = this.attackSpeed;
      }
    }
    else{
      this.scene.physics.moveToObject(this, this.scene.player, this.speed);
      if(this.body.velocity.x < 0){
        this.flipX = false;
      }
      else{
        this.flipX = true;                 
      }
    }
    
    // Reducir el tiempo de cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown -= dt;
    }

    if(this.stunCounter>0){
      this.stunCounter--;
      if(this.stunCounter>20){
        this.setTint(0xff0000);
      }      
    } else {
      this.setTint(0xffffff);
    }
    }
  }

  // Función para disparar un proyectil
  shoot() {
    this.play(`${this.type}_shoot`, true);
    this.once('animationcomplete', () => {
      this.play(`${this.type}_move`);
    });
    // Calcular la dirección hacia el jugador
    const dirX = this.scene.player.x - this.x; // Diferencia en X entre el jugador y el enemigo
    const dirY = this.scene.player.y - this.y; // Diferencia en Y entre el jugador y el enemigo
    
    // Normalizar la dirección para que el proyectil tenga velocidad constante
    const magnitude = Math.sqrt(dirX * dirX + dirY * dirY); // Longitud del vector
    const normalizedDirX = dirX / magnitude; // Normalizar la dirección X
    const normalizedDirY = dirY / magnitude; // Normalizar la dirección Y

    if(dirX < 0){
      this.flipX = false;
    }
    else{
      this.flipX = true;                 
    }
    
    // Crear la bala usando la clase Bullet
    new Bullet(this.scene, this.x, this.y, normalizedDirX, normalizedDirY, 0, 0, false, `${this.type}bullet`, this.type); // Pasar las direcciones y velocidades
  }
}