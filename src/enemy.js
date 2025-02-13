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
    this.stunCounter = 0;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.scene.physics.add.collider(this, scene.player, this.hitPlayer, null, this);
    this.scene.physics.add.collider(this, scene.bulletGroup, this.hitBullet, null, this);
    this.scene.physics.add.collider(this, scene.enemyGroup);
  }

  hitPlayer(enemy, player) {
    // Llamar a la función playerHurt del jugador cuando lo toca
    player.hurt();
  }

  hitBullet(enemy, bullet){
    //Enemigo muere
    this.stunCounter = 30;
    this.health--;
    if(this.health <= 0){
      this.setTint(0xff0000);
      this.destroy();
    }
    bullet.destroy();
  }
  
  preUpdate(t, dt) {
    super.preUpdate(t, dt);
    this.play(`cuca`, true);
    if(this.stunCounter>0){
      this.stunCounter--;
      this.setTint(0xff0000);
      this.body.setVelocity(0, 0);
    } else {
      this.scene.physics.moveToObject(this, this.scene.player, 120);
      this.setTint(0xffffff);
    }
  }

}
