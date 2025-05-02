import Phaser from 'phaser';
import SpriteBase from '../spriteBase';

export default class BreakableObject extends SpriteBase {
  /*
  Clase que define a un objeto rompible.
  */
  constructor(scene, x, y, weight, height, sprite) {
    super(scene, x, y, sprite);

    this.maxBulletHits = 2; // Disparos necesarios para destruirse
    this.bulletHits = 0;
    this.isBroken = false;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0, 0); // para que x, y coincidan con la esquina superior izquierda
    this.body.setAllowGravity(false); // No afectado por la gravedad
    this.body.setVelocity(0, 0); // Estático
    this.body.setSize(weight, height); // cuerpo físico de 224x50 (ajustado a la imagen)

    // (Opcional) Texto para debug o UI
    this.bulletText = scene.add.text(x, y - 30, '', {
      fontSize: '12px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.crackGraphics = scene.add.graphics().setDepth(1).setVisible(false);


  }


  hitBullet(machine, bullet) {
    // Efecto visual
    // this.bulletText.setVisible(true);
    bullet.explode();

    this.flashEffect();
    // Incrementar contador
    this.bulletHits++;
    if(this.bulletHits===1){
      this.setTint(0xffcc00); // naranja: casi roto
    }
    // Verificar si alcanzó el límite
    if (this.bulletHits >= this.maxBulletHits) {
      this.bulletHits = 0;
      this.destroy();
    }
  }

  flashEffect() {
    if (this.isOperational) {
      // Guardar el tintado original si es la primera vez
      if (this.originalTint === undefined) {
        this.originalTint = this.tint;
      }

      // Flash blanco
      this.setTint(0x737373);
      // console.log('flash effect');
      // Volver al color original después de 100ms
      this.scene.time.delayedCall(300, () => {
        if (this.isOperational) { // Verificar si el objeto existe
          this.setTint(this.originalTint);
        }
      });
    }
  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    // Aquí no hay movimiento, solo mantenemos el objeto estático.
  }

  updateDamageEffect() {
    const damageRatio = this.bulletHits / this.maxBulletHits;

    // Aplicar tinte progresivo según el daño
    if (damageRatio < 0.34) {
      this.setTint(0xffffff); // Sin daño
    } else if (damageRatio < 0.67) {
      this.setTint(0xffff66); // Amarillo (daño leve)
    } else {
      this.setTint(0xff6666); // Rojo (daño crítico)
    }

    // Efecto de parpadeo breve al recibir daño
    this.scene.tweens.add({
      targets: this,
      alpha: 0.5,
      duration: 50,
      yoyo: true,
      repeat: 0
    });
  }

  breakObject() {
    this.isBroken = true;
    this.bulletHits = 0;

    this.emit('ObjectBroken', this.x, this.y); // Emitir un evento cuando el objeto se rompa

    // Efecto de partículas al romperse
    this.spawnBreakParticles();

    this.bulletText.destroy(); // Eliminar el texto de disparos
    this.destroy(); // Destruir el objeto
  }

  spawnBreakParticles() {
    const particles = this.scene.add.particles('flares'); // Asegúrate de tener el sprite 'flares' cargado

    const emitter = particles.createEmitter({
      frame: 'red', // Usamos el frame 'red' para las partículas, asegúrate de que esté disponible
      x: this.x,
      y: this.y,
      speed: { min: -100, max: 100 },
      angle: { min: 0, max: 360 },
      lifespan: 500,
      quantity: 10,
      scale: { start: 0.5, end: 0 },
      on: false
    });

    emitter.explode(10, this.x, this.y);
  }
}
