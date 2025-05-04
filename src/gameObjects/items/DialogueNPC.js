import Phaser from 'phaser';
import SpriteBase from '../spriteBase';
import DialogueBox from '../../scenes/conversation.js';
import Item from './item';

export default class DialogueNPC extends SpriteBase {
  constructor(scene, x, y, spriteKey, nombre = 'NPC', frases = [], purchase, frasePurchase, purchaseCost, itemKey) {
    super(scene, x, y, spriteKey);

    this.scene = scene;
    this.nombre = nombre;
    this.frases = frases.length > 0 ? frases : ['...'];
    this.dialogueActivo = false;
    this.interactionRange = 40;
    this.bulletHits = 0;
    this.purchase = purchase;
    this.frasePurchase = frasePurchase;
    this.purchaseCost = purchaseCost;
    this.itemKey = itemKey;
    this.purchaseDone = false;

    // Asegurarse de que este NPC tiene un cuerpo físico y es inmóvil
    this.scene.physics.add.existing(this);  // Aseguramos que este NPC tiene física
    this.body.setImmovable(true);  // Hacemos que no se mueva al colisionar
    // Caja de diálogo
    const centerX = scene.cameras.main.width / 2;
    const centerY = scene.cameras.main.height / 2;
    this.dialogueBox = new DialogueBox(scene, centerX - 150, centerY, 300, spriteKey + '-face', nombre);

    // Área de interacción invisible
    this.interactionArea = scene.add.circle(x, y, this.interactionRange, 0x000000, 0);
    scene.physics.add.existing(this.interactionArea);
    this.interactionArea.body.setCircle(this.interactionRange);
    this.interactionArea.body.setAllowGravity(false);

    // Icono E opcional
    this.eKeyIcon = scene.add.sprite(x, y - 30, 'key_E_action')
      .setVisible(false)
      .setDepth(20)
      .play('key_E_action');

    // Comprobar cercanía
    scene.physics.add.overlap(this.interactionArea, scene.player, this.showInteractionUI, null, this);

    // Entrada de teclado
    scene.input.keyboard.on('keydown-E', () => {
      if (!this.isPlayerInRange()) return;

      if (this.dialogueActivo) {
        this.dialogueBox.hide();
        this.dialogueActivo = false;
      } else {
        this.hablar();
      }
    });
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
      this.eKeyIcon.setVisible(false);
    }
  }

  hitBullet(bullet) {
    bullet.explode();
    this.bulletHits++;
    if (this.bulletHits >= 3) {
      this.bulletHits = 0;
      this.destroy();
    }
  }

  hablar() {
    const player = this.scene.player;

    // Si el NPC vende algo
    if (this.purchase && !this.purchaseDone) {
      // Verificar si el jugador puede pagar
      if (player.canAfford(this.purchaseCost)) {
        // Cobrar
        player.spendCoins(this.purchaseCost);
        this.purchaseDone = true;

        // Mostrar diálogo de compra exitosa
        this.dialogueBox.show(this.frasePurchase);
        this.dialogueActivo = true;

        // Dispensar el objeto
        this.dispenseItemEffect();

      } else {
        this.dialogueBox.show("No tienes suficientes monedas...");
        this.dialogueActivo = true;
      }

      return; // Evita mostrar frases normales
    }

    // Mostrar diálogo normal
    const frase = Phaser.Utils.Array.GetRandom(this.frases);
    this.dialogueBox.show(frase);
    this.dialogueActivo = true;
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
