import Phaser from 'phaser';
/**
 * Clase que representa las plataformas que aparecen en el escenario de juego.
 * Cada plataforma es responsable de crear la base que aparece sobre ella y en la 
 * que, durante el juego, puede aparecer una estrella
 */
export default class Enemy extends Phaser.GameObjects.Sprite {
  
  /**
   * Constructor de la Plataforma
   * @param {Phaser.Scene} scene Escena a la que pertenece la plataforma
   * @param {number} x Coordenada x
   * @param {number} y Coordenada y
   */
  constructor(scene, x, y){
    super(scene, x, y, 'enemy');
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.scene.physics.add.collider(this, scene.player, this.hitPlayer, null, this);
  }

  hitPlayer(enemy, player) {
    // Llamar a la función playerHurt del jugador cuando lo toca
    player.hurt();
    // Aquí puedes también destruir al enemigo o agregar otras acciones
    //enemy.destroy(); // Destruir el enemigo al colisionar (opcional)
  }
  
  preUpdate(t, dt) {
    super.preUpdate(t, dt);
    this.play(`cuca`, true);
  }

}
