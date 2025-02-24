import Phaser from 'phaser';
/**
 * Clase que representa las plataformas que aparecen en el escenario de juego.
 * Cada plataforma es responsable de crear la base que aparece sobre ella y en la 
 * que, durante el juego, puede aparecer una estrella
 */
export default class Item extends Phaser.GameObjects.Sprite {
  
  /**
   * Constructor de la Plataforma
   * @param {Phaser.Scene} scene Escena a la que pertenece la plataforma
   * @param {number} x Coordenada x
   * @param {number} y Coordenada y
   */
  constructor(scene, x, y){
    super(scene, x, y, 'item');
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.scene.physics.add.overlap(this, scene.player, this.pick, null, this);
  }

  pick(item, player) {
    // Llamar a la función playerHealthUp del jugador cuando lo toca
    player.healthUp();
    this.destroy();
  }
  
  preUpdate(t, dt) {
    super.preUpdate(t, dt);
  }

}
