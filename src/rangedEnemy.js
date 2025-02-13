import Enemy from './enemy'; // Importa la clase base
import Bullet from './bullet.js';

export default class RangedEnemy extends Enemy {
  
  constructor(scene, x, y) {
    super(scene, x, y, 'rangedenemy'); // Llamada al constructor de la clase base (Enemy)
    this.attackCooldown = 0; // Enfriamiento para disparar
    this.attackRange = 300; // Distancia máxima de ataque
    this.attackSpeed = 1000; // Enfriamiento entre disparos en milisegundos
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
    
    // Reducir el tiempo de cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown -= dt;
    }
  }

  // Función para disparar un proyectil
  shoot() {
    // Crear la bala desde la clase Bullet
    const dirX = this.scene.player.x > this.x ? 1 : -1; // Dirección en X (hacia el jugador)
    const dirY = 0; // No se mueve en Y (disparo horizontal)
    // Crear la bala usando la clase Bullet
    let bullet = new Bullet(this.scene, this.x, this.y, dirX, dirY, 0, 0); // Pasar las direcciones y velocidades
    this.scene.bulletGroup.add(bullet); // Añadir el proyectil al grupo de balas
  }
}
