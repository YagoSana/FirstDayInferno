import Phaser from 'phaser';
import SpriteBase from '../spriteBase';

const DEFAULT_SIZE = 0.65;
const HOVER_SIZE = 0.8;
const ITEM_RANGE = 80;
const LIFETIME = 100000;
const COLOR_GLOW = 0x2ce8f5;
const BG_COLOR = '#000000';
const TEXT_COLOR = '#ffffff';

export default class Item extends SpriteBase {
  constructor(scene, x, y, type) {

    super(scene, x, y, type);
    this.type = type; // el tipo de objeto
    this.manualPickup = !(type === 'moneda' || type === 'corazon' || type === 'llave');
    // Tiempo de vida del objeto
    this.lifetime = LIFETIME; // 100 segundos
    this.startTime = this.scene.time.now;

    this.setScale(DEFAULT_SIZE);
    this.setDepth(10);

    if (this.manualPickup) {// si es un item que se equipa
      this.body.setSize(ITEM_RANGE, ITEM_RANGE); // Ajusta el tamaño de la hitbox
      this.levitateTween = this.levitate();// Efecto de levitación
    }

    // Acciones de los objetos
    this.actions = {
      "hamburguesa": (player) => player.healthUp(),
      "moneda": (player) => player.addCoin(1),
      "mini_tinto": (player) => {
        player.healthUp();
        player.healthUp();
        player.slowDown();
      },
      "bumbo": (player) => player.itemAppearance("isaac", 0) // cabeza de Isaac
    };

    // Texto del nombre del objeto encima del jugador
    this.itemNameText = this.scene.add.text(0, 0, '', {
      fontSize: '16px',
      fill: TEXT_COLOR,
      fontFamily: 'monogram',
      backgroundColor:BG_COLOR,
      padding: { x: 5, y: 2 }
    }).setVisible(false).setDepth(100).setResolution(2); // Asegurar que esté por encima del jugador

    // Animación de la tecla E
    this.eKeyAnimation = this.scene.add.sprite(0, 0, 'key_E_action').setVisible(false).setDepth(100);
    this.eKeyAnimation.setScale(1.1);
    this.eKeyAnimation.play('key_E_action'); // Reproducir la animación

    // Descripción del objeto en la parte inferior de la pantalla
    this.descriptionText = this.scene.add.text(0, 0, '', {
      fontSize: '16px',
      fill: TEXT_COLOR,
      fontFamily: 'monogram',
      backgroundColor: BG_COLOR,
      padding: { x: 10, y: 5 }
    }).setVisible(false).setDepth(100).setScrollFactor(0).setResolution(2); // Fijo en la cámara

    // Si el item es automático, se recoge al tocarlo
    if (!this.manualPickup) {
      this.scene.physics.add.overlap(this, scene.player, this.pick, null, this);
    } else {
      this.scene.physics.add.overlap(this, scene.player, this.showPickupHint, null, this);
    }
    //animaciones de objetos que se recogen solos
    if (type === "moneda") {
      this.play("coin-idle");
    }
    if (type === "corazon") {
      this.play("heart-idle");
    }
    if (type === "llave") {
      this.play("key-idle");
    }

    this.glowEffect = null; // Referencia al efecto de glow
  }

  getDescription() {
    // Descripciones de los objetos
    const descriptions = {
      "hamburguesa": "Hamburguesa: Recupera 1 punto de salud.",
      "mini_tinto": "Mini de Tinto: Recupera 2 puntos de salud, pero te ralentiza.",
      "bumbo": "Bumbo: Me parece que ya lo has visto antes ..."
    };
    return descriptions[this.type] || "???: Objeto desconocido.";
  }

  levitate() {
    // Efecto de levitación con tween
    return this.scene.tweens.add({
      targets: this,
      y: this.y - 5,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  showPickupHint(item, player) {
    player.nearItem = this; // Guardamos el objeto cerca

    // Detener la levitación y agrandar el objeto
    this.levitateTween.pause(); // Pausar el tween de levitación

    this.setScale(HOVER_SIZE);

    this.setGlow(COLOR_GLOW, 5);

    // Mostrar el nombre del objeto encima del jugador
    this.itemNameText.setText(this.type);
    this.itemNameText.setPosition(player.x - this.itemNameText.width / 2, player.y - 40);
    this.itemNameText.setVisible(true);

    // Mostrar la animación de la tecla E
    this.eKeyAnimation.setPosition(player.x - this.itemNameText.width / 2 - 10, player.y - 30);
    this.eKeyAnimation.setVisible(true);

    // Mostrar la descripción en la parte inferior de la pantalla
    this.descriptionText.setText(this.getDescription());
    const camera = this.scene.cameras.main;

    this.descriptionText.setPosition(
      this.scene.cameras.main.centerX - this.descriptionText.width / 2,
      this.scene.cameras.main.height - 150
    );
    this.descriptionText.setVisible(true);
  }

  hidePickupHint() {
    // Restaurar el objeto a su estado normal
    this.clearGlow(); // Quitar el glow

    // Ocultar el nombre del objeto y la animación de la tecla E
    this.itemNameText.setVisible(false);
    this.eKeyAnimation.setVisible(false);

    // Ocultar la descripción
    this.descriptionText.setVisible(false);

    // Restaurar la levitación y el tamaño original
    this.levitateTween.resume(); // Reanudar el tween de levitación
    this.setScale(DEFAULT_SIZE);

  }

  setGlow(color, intensity) {
    // Aplicar efecto de glow solo si no está ya aplicado
    if (!this.glowEffect) {
      this.glowEffect = this.postFX.addGlow(color, intensity);
    }
  }

  clearGlow() {
    // Quitar el efecto de glow si está aplicado
    if (this.glowEffect) {
      this.postFX.remove(this.glowEffect);
      this.glowEffect = null;
    }
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);
    // console.log(`Tiempo actual: ${this.scene.time.now}, Tiempo de inicio: ${this.startTime}, Tiempo de vida: ${this.lifetime}`);

    // Verificar si el jugador se alejó del objeto
    if (this.manualPickup && this.scene.player.nearItem !== this) {
      this.hidePickupHint();
    }

    // Verificar si el objeto debe desaparecer
    if (this.scene.time.now - this.startTime > this.lifetime) {
      // console.log(`El objeto ${this.type} ha alcanzado su tiempo de vida.`);
      this.warnBeforeDestroy();
    }
  }

  warnBeforeDestroy() {
    // Advertir antes de destruir el objeto (parpadeo)
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.destroy();
      }
    });
  }

  pick(item, player) {
    if (this.actions[this.type]) {
      this.actions[this.type](player); // Aplicar el efecto del objeto
    }
    if(this.manualPickup){
      this.hidePickupHint();
    }
    this.destroy();
  }
}