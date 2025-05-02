import Phaser from 'phaser';
import SpriteBase from '../spriteBase';
import DialogueBox from '../../scenes/conversation.js';

export default class DialogueNPC extends SpriteBase {
  constructor(scene, x, y, spriteKey, nombre = 'NPC', frases = []) {
    super(scene, x, y, spriteKey);

    this.scene = scene;
    this.nombre = nombre;
    this.frases = frases.length > 0 ? frases : ['...'];
    this.dialogueActivo = false;
    this.interactionRange = 60;
    this.bulletHits=0;

    // Caja de diálogo
    this.dialogueBox = new DialogueBox(scene, this.x + 100, this.y + 100, 300, spriteKey + '-face', nombre);

    // Área de interacción invisible
    this.interactionArea = scene.add.circle(x, y, this.interactionRange, 0x000000, 0);
    scene.physics.add.existing(this.interactionArea);
    this.interactionArea.body.setCircle(this.interactionRange);
    this.interactionArea.body.setAllowGravity(false);

    // Texto de interacción


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


  hitBullet(machine, bullet) {
    bullet.explode();

    
    this.bulletHits++;
    if (this.bulletHits >= 3) {
      this.bulletHits = 0;
      this.destroy();

    }
  }

  hablar() {
    const frase = Phaser.Utils.Array.GetRandom(this.frases);
    this.dialogueBox.show(frase);
    this.dialogueActivo = true;
  }
}
