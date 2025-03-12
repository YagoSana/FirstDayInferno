import RangedEnemy from '../../rangedEnemy';

export default class Nerd extends RangedEnemy {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.setTexture('nerd');
    this.health = 1;
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);
    
    if (this.stunCounter <= 0) {
      this.scene.physics.moveToObject(this, this.scene.player, 200);
      this.play("nerd-move", true);
    }
  }

  shoot() {
    this.play("nerd-shoot", true);
    super.shoot();
  }
}
