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
  constructor(scene, x, y, type) {
    super(scene, x, y, type);
    this.type = type;
    this.health = 2;
    this.stunCounter = 0;
    this.speed = 70;
    this.setScale(0.8);
    this.body.setSize(20, 20);
    this.jumpCooldown = 0; // cuenta atrás entre saltos
    this.jumpDuration = 0; // cuánto dura el salto actual
    this.jumpDirection = new Phaser.Math.Vector2();
    this.body.setBounce(0.9); 
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);

    if (this.health > 0) {
      this.play(`${this.type}`, true);

      if (this.stunCounter > 0) {
        this.stunCounter--;
        if (this.stunCounter > 20) {
          this.setTint(0xff0000);
        }
        this.body.setVelocity(0, 0);
      } else {
        this.setTint(0xffffff);

        if (this.jumpCooldown > 0) {
          this.jumpCooldown--;
        } else if (this.jumpDuration > 0) {
          this.jumpDuration--;
          // No hace falta mover aquí, ya está moviéndose por inercia
          // Phaser conserva la velocidad a menos que la cambies
        } else {
          // Calcular nueva dirección con rebote
          const dirToPlayer = new Phaser.Math.Vector2(
            this.scene.player.x - this.x,
            this.scene.player.y - this.y
          ).normalize();

          const randomAngle = Phaser.Math.FloatBetween(-Math.PI / 2, Math.PI / 2);
          this.jumpDirection = dirToPlayer.rotate(randomAngle).scale(this.speed);

          this.body.setVelocity(this.jumpDirection.x, this.jumpDirection.y); // Se mueve una vez
          this.jumpDuration = Phaser.Math.Between(50, 80);
          this.jumpCooldown = Phaser.Math.Between(30, 50);
        }
      }
    }
  }



}
