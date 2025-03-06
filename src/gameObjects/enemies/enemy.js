import Phaser from 'phaser';
import Npc from './npc';
/**
 * Clase que representa las plataformas que aparecen en el escenario de juego.
 * Cada plataforma es responsable de crear la base que aparece sobre ella y en la 
 * que, durante el juego, puede aparecer una estrella
 */
export default class Enemy extends Npc {
  
  /**
   * Constructor de la Plataforma
   * @param {Phaser.Scene} scene Escena a la que pertenece la plataforma
   * @param {number} x Coordenada x
   * @param {number} y Coordenada y
   */
  constructor(scene, x, y, type){
    super(scene, x, y, type);
    this.type = type;
    this.health = 2;
    this.stunCounter = 0;
    this.speed = 100;
    this.setScale(0.8);
    this.body.setSize(20, 20);
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);
    if(this.health>0){
      this.play(`${this.type}`, true);
    if(this.stunCounter>0){
      this.stunCounter--;
      if(this.stunCounter>20){
        this.setTint(0xff0000);
      }      
      this.body.setVelocity(0, 0);
    } else {
      this.scene.physics.moveToObject(this, this.scene.player, this.speed);
      this.setTint(0xffffff);
    }
    }
  }

}
