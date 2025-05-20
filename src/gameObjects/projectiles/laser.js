import Phaser from 'phaser';

export default class Laser extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
      super(scene, x, y, 10, 300, 0xff0000, 0.3); // rojo tenue
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.body.setAllowGravity(false);
      this.body.setImmovable(true);
      this.damageActive = false;
      this.setOrigin(0.5, 0); // centra en X, empieza desde arriba
      // Se activa tras 1 segundo
      scene.time.delayedCall(1000, () => {
        this.setFillStyle(0xff0000, 1); // rojo fuerte
        this.damageActive = true;
      });
      scene.time.delayedCall(2000, () => {
        this.destroy();
      });
    }
  }
  