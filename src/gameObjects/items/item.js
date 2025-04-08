import Phaser from 'phaser';
import SpriteBase from '../spriteBase';

const DEFAULT_SIZE = 0.65;
const HOVER_SIZE = 0.8;
const ITEM_RANGE = 60;
const LIFETIME = 30000;
const COLOR_GLOW = 0xb55088;
const BG_COLOR = '#000000';
const TEXT_COLOR = '#ffffff';

export default class Item extends SpriteBase {
  constructor(scene, x, y, type) {

    super(scene, x, y, type);
    this.type = type; // el tipo de objeto
    this.name = this.getItemName(type);
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
      "hamburguesa": (player) => {
        player.changeHealth(2, true);
        player.invertir(false);
      },
      "moneda": (player) => player.addCoin(1),
      "mini_tinto": (player) => {
        player.changeHealth(4, true);
        player.changeSpeed(0.75);
      },
      "llave": (player) => player.pickKey(1),
      "bumbo": (player) => player.itemAppearance("bumbo", 0), // cabeza de Isaac
      "pantallazo_azul": (player) => player.itemAppearance("pantallazo_azul", 1), // cabeza de Isaac

      "bono": (player) => {
        player.changeSpeed(1.3);
        player.changeCooldown(-150);//TODO VER ESTO
      },
      "codigo": (player) => player.doDoubleshoot(true),
      "corazon": (player) => player.changeHealth(1, false),
      "maletin": (player) => {
        player.changeSpeed(0.70);
        player.changeHealth(3, true);
      },
      "bolsa_sospechosa": (player) => {
        player.invertir(true);
        player.doDoubleshoot(true);
      }
    };

    // Texto del nombre del objeto encima del jugador
    this.itemNameText = this.scene.add.text(0, 0, '', {
      fontSize: '16px',
      fill: TEXT_COLOR,
      fontFamily: 'monogram',
      backgroundColor: BG_COLOR,
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
      padding: { x: 10, y: 5 },
      align: 'center'
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

  // Formatea el nombre del ítem para mostrarlo bonito
  getItemName(type) {
    const itemNames = {
      "bumbo": "Bumbo",
      "hamburguesa": "Hamburguesa",
      "mini_tinto": "Mini de Tinto",
      "bono": "Bono Transporte",
      "codigo": "Codigo Compilado",
      "pantallazo_azul": "Pantallazo Azul",
      "collar_macarrones": "Collar de Macarrones",
      "maletin": "Maletin del Lab",
      "bolsa_sospechosa": "Bolsa Sospechosa",
      "corazon": "Corazon",
      // Añade más mapeos según necesites
    };

    // Si existe en el mapeo, lo usamos, sino formateamos automáticamente
    return itemNames[type] || '???';
  }

  getDescription() {
    const descriptions = {
      "hamburguesa": {
        description: "Recuperas 2 puntos de salud.",
        effect: "Salud +2"
      },
      "mini_tinto": {
        description: "Un pequeño trago de energía, pero te ralentiza temporalmente.",
        effect: "Salud +4, Velocidad -25%"
      },
      "bumbo": {
        description: "Me parece que ya lo has visto antes...",
        effect: "Cambia tu apariencia"
      },
      "bono": {
        description: "Bono joven de transporte de la comunidad de Madrid. ¡Gracias Pedrito!",
        effect: "Cooldown -150ms, Velocidad +30%"
      },
      "codigo": {
        description: "Código que a veces funciona mal, ha dado time limit en el juez.",
        effect: "Tus disparos hacen el doble de daño, 20% de probabilidades de que la bala se desvie."
      },
      "pantallazo_azul": {
        description: "Actualizaste a Windows 11. Nadie sabe cómo funciona.",
        effect: "Tu disparo puede bloquear a los enemigos durante 2 segundos."
      },
      "collar_macarrones": {
        description: "Creado con esfuerzo y sudor por un estudiante de magisterio como proyecto de TFG.",
        effect: "El personaje cambia su proyectil a un cacho de plastilina."
      },
      "maletin": {
        description: "Maletín que contiene una placa en su interior. Nadie sabe cómo funciona.",
        effect: "+3 de salud, -30% de velocidad."
      },
      "bolsa_sospechosa": {
        description: "Contiene unas hojas verdes secas. Su olor te evoca recuerdos del sur de Madrid.",
        effect: "Disparo invertidos y 20% de desvio pero los proyectiles hacen el doble de daño"
      },

    };

    const itemInfo = descriptions[this.type] || {
      description: "Un objeto misterioso.",
      effect: "???"
    };

    return `${itemInfo.description}\n[Efecto: ${itemInfo.effect}]`;
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

    this.setGlow(COLOR_GLOW, 3);

    // Mostrar el nombre del objeto encima del jugador
    this.itemNameText.setText(this.name);
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
      this.scene.cameras.main.height - 160
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
    this.scene.player.nearItem = null;

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
    // 1. Ocultar los elementos UI inmediatamente
    if (this.itemNameText && !this.itemNameText.destroyed) {
      this.itemNameText.setVisible(false);
    }

    if (this.eKeyAnimation && !this.eKeyAnimation.destroyed) {
      this.eKeyAnimation.setVisible(false);
    }

    if (this.descriptionText && !this.descriptionText.destroyed) {
      this.descriptionText.setVisible(false);
    }

    // 2. Limpiar la referencia del jugador
    if (this.scene && this.scene.player && this.scene.player.nearItem === this) {
      this.scene.player.nearItem = null;
    }

    // 3. Desactivar el glow de forma segura
    if (this.glowEffect && this.postFX) {
      this.postFX.remove(this.glowEffect);
      this.glowEffect = null;
    }

    this.setAlpha(1);
    let blinkCount = 0;
    const maxBlinks = 6;
    const sceneRef = this.scene; // Guardamos la referencia al scene

    const blink = () => {
        sceneRef.tweens.add({  // Usamos sceneRef en lugar de this.scene
            targets: this,
            alpha: this.alpha === 1 ? 0 : 1,
            duration: 500,
            onComplete: () => {
                blinkCount++;
                if (blinkCount < maxBlinks * 2) {
                    blink();
                } else {
                    this.destroy();
                }
            }
        });
    };

    blink();
  }

  pick(item, player) {
    if (this.actions[this.type]) {
      this.actions[this.type](player); // Aplicar el efecto del objeto
    }
    if (this.manualPickup) {
      this.hidePickupHint();
    }
    this.destroy();
  }
}