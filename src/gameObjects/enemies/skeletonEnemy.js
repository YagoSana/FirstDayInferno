import Phaser from 'phaser';
import Npc from './npc.js';

export default class SkeletonEnemy extends Npc {

  /**
   * Constructor de la Plataforma
   * @param {Phaser.Scene} scene Escena a la que pertenece la plataforma
   * @param {number} x Coordenada x
   * @param {number} y Coordenada y
   */

  constructor(scene, x, y, type, id) {
    super(scene, x, y, type); // Llamada al constructor de la clase base (Enemy)
    this.type = type;
    this.id = id;
    this.health = 3;
    this.speed = 80;
    this.stunCounter = 0;
    this.despierto = false;

    // Crear área de detección
    this.detectionRadius = 100;

    this.player = null;
  }

  setPlayer(player) {
    this.player = player;
  }

  // Sobrescribimos la función preUpdate para agregar la lógica de ataque a distancia
  preUpdate(t, dt){
    super.preUpdate(t, dt);
  }
  
  mypreUpdate(t, dt) {
    if(this.health > 0){
        if (!this.player) return;

        const distancia = Phaser.Math.Distance.Between(
            this.x, this.y,
            this.player.x, this.player.y
        );

        if (distancia <= this.detectionRadius) {
            this.despierto = true;
        } else {
            this.despierto = false;
        }

        if (this.despierto) {
            this.scene.physics.moveToObject(this, this.player, this.speed);
            this.play(`${this.type}_attack`, true);
        } else {
            this.body.setVelocity(0, 0);
            this.play(`${this.type}_idle`, true);
        }

    }
  }


}
