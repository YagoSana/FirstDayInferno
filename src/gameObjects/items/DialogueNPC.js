import Phaser from 'phaser';
import SpriteBase from '../spriteBase.js';
import Item from './item.js';

export default class DialogueNPC extends SpriteBase {
  constructor(scene, x, y, spriteKey, nombre = 'NPC', frases = [], purchase, frasePurchase, purchaseCost, itemKey) {
    super(scene, x, y, spriteKey);
    this.spriteKey = spriteKey;
    this.scene = scene;
    this.nombre = nombre;
    this.frases = frases.length > 0 ? frases : ['...'];
    this.dialogueActivo = false;
    this.interactionRange = 40;
    this.bulletHits = 0;
    this.health = 100;
    this.purchase = purchase;
    this.frasePurchase = frasePurchase;
    this.purchaseCost = purchaseCost;
    this.itemKey = itemKey;

    this.body.setSize(12, 24);
    this.play({ key: spriteKey, randomFrame: true });
    this.setScale(1.2);

    // Recuperar el estado de compra desde localStorage

    // Asegurarse de que este NPC tiene un cuerpo físico y es inmóvil
    this.scene.physics.add.existing(this);  // Aseguramos que este NPC tiene física
    this.body.setImmovable(true);

    this.scene.physics.add.collider(this, scene.player);
    this.scene.physics.add.collider(this, scene.bulletGroup, this.hitBullet, null, this);

    // Área de interacción invisible
    this.interactionArea = scene.add.circle(x, y, this.interactionRange, 0x000000, 0);
    scene.physics.add.existing(this.interactionArea);
    this.interactionArea.body.setCircle(this.interactionRange);
    this.interactionArea.body.setAllowGravity(false);

    this.scene.physics.add.overlap(this.interactionArea, scene.player, this.handleInteractionRange, null, this);
    this.playerInRange = false;

    // Texto de interacción


    // Icono E opcional
    this.eKeyIcon = scene.add.sprite(x, y - 30, 'key_E_action')
      .setVisible(false)
      .setDepth(20)
      .play('key_E_action');


    this.setupInteraction();
  }

  setupInteraction() {
    // Escucha la tecla E
    this.scene.input.keyboard.on('keydown-E', () => {
      if (!this.playerInRange || this.dialogueActivo) return;

      this.hablar();
    }, this);
  }

  handleInteractionRange(area, player) {
    // Calculamos la distancia real cada frame mientras hay overlap
    const distance = Phaser.Math.Distance.Between(
      this.x, this.y,
      player.x, player.y
    );

    // Si está dentro del rango circular
    if (distance <= this.interactionRange) {
      if (!this.playerInRange && !this.dialogueActivo) {
        this.playerInRange = true;
        this.eKeyIcon.setPosition(this.x, this.y - 30).setVisible(true);
      }
    } else {
      // Si salió del rango circular
      if (this.playerInRange) {
        this.playerInRange = false;
        this.eKeyIcon.setVisible(false);
      }
    }
  }

  // Actualizamos en el game loop para detectar salidas
  update() {
    if (this.playerInRange && this.scene.player) {
      const distance = Phaser.Math.Distance.Between(
        this.x, this.y,
        this.scene.player.x, this.scene.player.y
      );

      if (distance > this.interactionRange) {
        this.playerInRange = false;
        this.eKeyIcon.setVisible(false);
      }
    }
  }

  isPlayerInRange() {
    return Phaser.Math.Distance.Between(
      this.x, this.y, this.scene.player.x, this.scene.player.y
    ) <= this.interactionRange;
  }

  showInteractionUI() {
    if (this.isPlayerInRange()) {

      this.eKeyIcon.setPosition(this.x, this.y - 30).setVisible(true);
    } else {
      // Si salió del rango circular
      if (this.playerInRange) {
        this.playerInRange = false;
        this.eKeyIcon.setVisible(false);
      }
    }
  }


  // Oculta la tecla E cuando el jugador sale del rango
  hideInteractionUI(area, player) {
    console.log('Saliendo de interactionRange');
    this.eKeyIcon.setVisible(false);
  }

  hitBullet(machine, bullet) {
    bullet.explode();


    this.bulletHits++;
    if (this.bulletHits >= this.health) {
      this.bulletHits = 0;
      this.destroy();

    }
  }

  hablar() {
    const player = this.scene.player;
    let frase = "";

    // Si el NPC vende algo
    if (this.purchase && !this.purchaseDone) {
      if (player.canAfford(this.purchaseCost)) {
        player.spendCoins(this.purchaseCost);
        this.purchaseDone = true;

        localStorage.setItem(`purchaseDone_${this.nombre}`, JSON.stringify(this.purchaseDone));

        frase = this.frasePurchase;
        this.dialogueActivo = true;
        this.purchase = false;

        this.dispenseItemEffect();
      } else {
        frase = "No tienes suficientes monedas...";
        this.dialogueActivo = true;
      }

      // Mostrar el diálogo ya sea por compra o por falta de monedas
      this.scene.scene.launch('DialogueScene', {
        message: frase,
        speaker: this.nombre,
        portraitKey: `${this.spriteKey}_talk`,
        textSpeed: 35,
        previousScene: this.scene.scene.key,
        onClose: () => {
          this.dialogueActivo = false;
          if (this.playerInRange) {
            this.eKeyIcon.setVisible(true);
          }
        }
      });

      this.scene.scene.bringToTop('DialogueScene');
      return;
    }

    // Diálogo normal si no hay compra
    frase = Phaser.Utils.Array.GetRandom(this.frases);
    this.dialogueActivo = true;
    this.eKeyIcon.setVisible(false);

    this.scene.scene.launch('DialogueScene', {
      message: frase,
      speaker: this.nombre,
      portraitKey: `${this.spriteKey}_talk`,
      textSpeed: 35,
      previousScene: this.scene.scene.key,
      onClose: () => {
        this.dialogueActivo = false;
        if (this.playerInRange) {
          this.eKeyIcon.setVisible(true);
        }
      }
    });

    this.scene.scene.bringToTop('DialogueScene');
  }


  dispenseItemEffect() {
    const item = new Item(this.scene, this.x, this.y + 100, this.itemKey);
    item.setVisible(false);
    item.setDepth(this.depth + 10);

    this.scene.tweens.add({
      targets: item,
      alpha: { from: 0, to: 1 },
      y: this.y - 40,
      duration: 400,
      ease: 'Power2',
      onStart: () => item.setVisible(true),
      onComplete: () => {
        this.scene.tweens.add({
          targets: item,
          y: this.y + 100,
          duration: 800,
          ease: 'Bounce.out'
        });
      }
    });

    const sound = this.scene.sound.add('pop', { volume: 0.5 });
    sound.play();
  }

  setInteractionRadius(newRadius) {
    this.interactionRange = newRadius;
    this.interactionArea.setRadius(newRadius);
    this.interactionArea.body.setCircle(newRadius);
  }
}
