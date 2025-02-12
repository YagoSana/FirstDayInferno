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
    this.health = 2;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.scene.physics.add.collider(this, scene.player, this.hitPlayer, null, this);
    this.scene.physics.add.collider(this, scene.bulletGroup, this.hitBullet, null, this);
  }

  hitPlayer(enemy, player) {
    // Llamar a la función playerHurt del jugador cuando lo toca
    player.hurt();
  }

  hitBullet(enemy, bullet){
    //Enemigo muere
    this.health--;
    if(this.health <= 0){
      this.destroy();
    }
    bullet.destroy();
  }
  
  preUpdate(t, dt) {
    super.preUpdate(t, dt);
    this.play(`cuca`, true);
    this.scene.physics.moveToObject(this, this.scene.player, 120);
  }

}
