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
    this.bulletHits = 0;
    this.body.setImmovable(true);
    this.body.allowGravity = false;
    this.health = 100;

    this.scene.physics.add.collider(this, scene.player);
    this.scene.physics.add.collider(this, scene.bulletGroup, this.hitBullet, null, this);

    // Área de interacción invisible
    this.interactionArea = scene.add.circle(x, y, this.interactionRange, 0x000000, 0);
    scene.physics.add.existing(this.interactionArea);
    this.interactionArea.body.setCircle(this.interactionRange);
    this.interactionArea.body.setAllowGravity(false);

    this.scene.physics.add.overlap(this.interactionArea, scene.player, this.handleInteractionRange, null, this);
    this.playerInRange = false;


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
      if (!this.playerInRange  || this.dialogueActivo) return;

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
    const frase = Phaser.Utils.Array.GetRandom(this.frases);
    this.dialogueActivo = true;
    this.eKeyIcon.setVisible(false);

    this.scene.scene.launch('DialogueScene', {
      message: frase,
      speaker: this.nombre,
      portraitKey: this.texture.key + '-face',
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
}
