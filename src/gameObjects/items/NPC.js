import Phaser from 'phaser';
import SpriteBase from '../spriteBase';
import Item from './item';
import DialogueBox from '../../scenes/conversation.js';

export default class NPC extends SpriteBase {
    constructor(scene, x, y) {
        super(scene, x, y, 'NPC');

        this.scene = scene;
        this.body.setImmovable(true);
        this.body.allowGravity = false;
        this.body.setSize(20, 10);
        this.body.setOffset(6, 0);
        this.setScale(1.2);
        this.originalScaleX = 1.2;
        this.originalScaleY = 1.2;
        this.bulletHits = 0;
        this.maxBulletHits = 3;


        this.hit_frases = [
            "¡Eh tronco, que tengo clase luego!",
            "No me pagan lo suficiente...",
            "¡Así no se trata a un funcionario!",
            "¿Quién te crees que soy, Terminator?",
            "¡Como me rompas las gafas te suspendo!"
        ];

        this.talk_frases = [
            "¿Necesitas ayuda con la práctica?",
            "Yo tampoco entiendo como funciona el maletín",
            "Al menos no doy FAL"
        ];

        this.dialogueActivo = false;
        this.objectGiven = false;
        this.interactionRange = 60;
        this.playerIsNear = false;

        this.play('teacher-front');

        this.eKeyIcon = this.scene.add.sprite(0, 0, 'key_E_action')
            .setPosition(this.x, this.y - 30)
            .setVisible(false)
            .setDepth(20)
            .play('key_E_action');

        this.setupPhysics();
        this.setupInteraction();
    }

    setupPhysics() {
        this.scene.physics.add.collider(this, this.scene.player, this.hitPlayer, null, this);
        if (this.scene.bulletGroup) {
            this.scene.physics.add.collider(this, this.scene.bulletGroup, this.hitBullet, null, this);
        }
        if (this.scene.enemyGroup) {
            this.scene.physics.add.collider(this, this.scene.enemyGroup);
        }
    }

    setupInteraction() {
        // Mostrar/ocultar ícono E
        this.scene.events.on('update', () => {
            this.playerIsNear = this.isPlayerInRange();
            this.eKeyIcon.setVisible(this.playerIsNear && !this.dialogueActivo);
            this.eKeyIcon.setPosition(this.x, this.y - 30);
        });

        // Escuchar tecla E
        this.scene.input.keyboard.on('keydown-E', () => {
            if (!this.playerIsNear) return;

            if (this.dialogueActivo) {
                this.scene.events.emit('closeDialogue');
                return;
            }

            this.iniciarDialogo();
        }, this);
    }

    isPlayerInRange() {
        if (!this.scene || !this.scene.player) return false;
        return Phaser.Math.Distance.Between(
            this.x, this.y,
            this.scene.player.x, this.scene.player.y
        ) <= this.interactionRange;
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
    }

    iniciarDialogo() {
        this.dialogueActivo = true;
        this.eKeyIcon.setVisible(false);

        // Mensaje especial si es la primera interacción
        if (!this.objectGiven) {
            this.mostrarDialogo("Esto es para ti, cuidao con él.");
            this.dispenseItem();
            this.objectGiven = true;
        } else {
            const frase = Phaser.Utils.Array.GetRandom(this.talk_frases);
            this.mostrarDialogo(frase);
        }
    }

    mostrarDialogo(frase) {
        this.dialogueActivo = true;
        this.eKeyIcon.setVisible(false);

        this.scene.scene.launch('DialogueScene', {
            message: frase,
            speaker: 'Borja',
            portraitKey: 'borja_talk',
            textSpeed: 35,
            previousScene: this.scene.scene.key,
            onClose: () => {
                this.dialogueActivo = false;
                if (this.isPlayerInRange()) {
                    this.eKeyIcon.setVisible(true);
                }
            }
        });

        this.scene.scene.bringToTop('DialogueScene');
    }

    dispenseItem() {
        const itemName = 'maletin';
        const startX = this.x;
        const startY = this.y + 10;
        const offsetX = Phaser.Math.Between(-30, 30);
        const offsetY = Phaser.Math.Between(30, 50);
        const endX = this.x + offsetX;
        const endY = this.y + offsetY;

        const item = new Item(this.scene, endX, endY, itemName);
        item.setVisible(false);
        item.setDepth(this.depth + 10);

        this.scene.tweens.add({
            targets: item,
            alpha: { from: 0, to: 1 },
            y: startY - 20,
            duration: 400,
            ease: 'Power2',
            onStart: () => item.setVisible(true),
            onComplete: () => {
                this.scene.tweens.add({ targets: item, y: endY, duration: 0 });
            }
        });
    }

    hitPlayer(machine, player) {
        player.body.setVelocityX(player.body.velocity.x * -0.5);
    }

    flashEffect() {
        if (this.isOperational) {
            if (this.originalTint === undefined) {
                this.originalTint = this.tint;
            }

            this.setTint(0x737373);

            this.scene.time.delayedCall(300, () => {
                if (this.isOperational) {
                    this.setTint(this.originalTint);
                }
            });
        }
    }

    hitBullet(machine, bullet) {
        bullet.explode();

        this.flashEffect();
        this.bulletHits++;

        // Mostrar frase solo si no hay diálogo activo
        if (!this.dialogueActivo) {
            const frase = Phaser.Utils.Array.GetRandom(this.hit_frases);
            this.mostrarDialogo(frase);
        }

        if (this.bulletHits >= this.maxBulletHits) {
            this.bulletHits = 0;
            this.destruirNPC();
        }
    }

    destruirNPC() {
        this.bulletHits = 0;
        const explosion = this.scene.add.sprite(this.x, this.y, 'fire_loop')
            .play('fire_loop')
            .setScale(2)
            .setDepth(50);

        this.scene.tweens.add({
            targets: explosion,
            alpha: 0,
            scale: 3,
            duration: 2000,
            ease: 'Cubic.easeOut',
            onComplete: () => explosion.destroy()
        });

        this.scene.tweens.add({
            targets: this,
            scale: 0,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                this.emit('npcDeath', this.x, this.y);
                this.destroy();
            }
        });
    }
}
