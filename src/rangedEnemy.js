import Enemy from './enemy'; // Importa la clase base
import Bullet from './bullet.js';

export default class RangedEnemy extends Enemy {
  
  constructor(scene, x, y) {
    super(scene, x, y, 'rangedenemy'); // Llamada al constructor de la clase base (Enemy)
    this.attackCooldown = 0; // Enfriamiento para disparar
    this.attackRange = 300; // Distancia máxima de ataque
    this.attackSpeed = 1000; // Enfriamiento entre disparos en milisegundos
    this.health=4;
    this.speed = 90;
    this.setScale(2);
  }

  // Sobrescribimos la función preUpdate para agregar la lógica de ataque a distancia
  preUpdate(t, dt) {
    super.preUpdate(t, dt); // Llamamos a la función preUpdate de la clase base
    this.play(`move`, true);
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
    }
    
    // Reducir el tiempo de cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown -= dt;
    }
  }

  // Función para disparar un proyectil
  shoot() {
    // Calcular la dirección hacia el jugador
    const dirX = this.scene.player.x - this.x; // Diferencia en X entre el jugador y el enemigo
    const dirY = this.scene.player.y - this.y; // Diferencia en Y entre el jugador y el enemigo
    
    // Normalizar la dirección para que el proyectil tenga velocidad constante
    const magnitude = Math.sqrt(dirX * dirX + dirY * dirY); // Longitud del vector
    const normalizedDirX = dirX / magnitude; // Normalizar la dirección X
    const normalizedDirY = dirY / magnitude; // Normalizar la dirección Y
    
    // Crear la bala usando la clase Bullet
    new Bullet(this.scene, this.x, this.y, normalizedDirX, normalizedDirY, 0, 0, false); // Pasar las direcciones y velocidades
}
}
