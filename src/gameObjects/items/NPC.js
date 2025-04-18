import Phaser from 'phaser';
import SpriteBase from '../spriteBase';
import Item from './item';
import DialogueBox from '../../scenes/conversation.js';

export default class NPC extends SpriteBase {
    constructor(scene, x, y) {
        super(scene, x, y, 'NPC');

        this.body.setImmovable(true);
        this.body.allowGravity = false;

        this.body.setSize(20, 10);
        this.body.setOffset(6, 0);
        this.setScale(1.2);
        this.interactionRange = 20;
        this.originalScaleX = 1.2;
        this.originalScaleY = 1.2;
        const cam = this.scene.cameras.main;
        const boxWidth = 300;
        const marginBottom = 20;
        const dialogX = cam.centerX - boxWidth / 2;
        const dialogY = cam.y + cam.height - 100 - marginBottom;

        this.dialogueBox = new DialogueBox(this.scene, this.x + 100, this.y + 200, boxWidth, 'borja-frontal', 'Borja');

        this.frases = [
            "¡Eh tronco, que tengo clase luego!",
            "¡Oye, que esto duele más de lo que parece!",
            "¡Así no se trata a un funcionario!",
            "¿Quién te crees que soy, Terminator?",
            "¡Como me rompas las gafas te suspendo!"
        ];
        this.dialogueActivo = false;

        this.interactionArea = this.scene.add.circle(x, y, 20, 0x000000, 0);
        this.scene.physics.add.existing(this.interactionArea);
        this.interactionArea.body.setCircle(20);

        this.scene.physics.add.overlap(this.interactionArea, scene.player, this.showInteractionUI, null, this);
        this.scene.physics.add.collider(this, scene.player, this.hitPlayer, null, this);
        this.scene.physics.add.collider(this, scene.bulletGroup, this.hitBullet, null, this);
        this.scene.physics.add.collider(this, scene.enemyGroup);

        this.objectGiven = false;
        this.maxBulletHits = 3;
        this.bulletHits = 0;
        this.maxUses = 3;
        this.remainingUses = this.maxUses;
        this.isOperational = true;
        this.isInUse = false;
        this.useCooldown = 2000;
        this.lastUseTime = 0;

        this.play('teacher-front');

        this.interactionText = this.scene.add.text(0, 0, 'Hola chaval, esto es para ti!', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'monogram',
            backgroundColor: '#000000',
            padding: { x: 5, y: 4 }
        }).setVisible(false).setDepth(25).setResolution(2);

        this.eKeyIcon = this.scene.add.sprite(0, 0, 'key_E_action')
            .setVisible(false)
            .setDepth(20)
            .play('key_E_action');

        this.bulletText = this.scene.add.text(this.x - 30, this.y - 40, 'Disparos: 0/5', {
            fontSize: '14px',
            fill: '#ffff00',
            fontFamily: 'monogram',
            backgroundColor: '#000000',
            padding: { x: 5, y: 3 }
        }).setVisible(false).setDepth(20).setResolution(2);
    }

    showInteractionUI(machine, player) {
        if (this.isOperational) {
            player.nearVendingMachine = this;

            if (this.scene.time.now - this.lastUseTime > this.useCooldown) {
                this.interactionText.setPosition(this.x - 100 / 2, this.y - 40);
                this.interactionText.setVisible(true);

                this.eKeyIcon.setPosition(this.x - 60, this.y - 30);
                this.eKeyIcon.setVisible(true);
            } else {
                this.hideInteractionUI();
            }
        }
    }

    hideInteractionUI() {
        this.interactionText.setVisible(false);
        this.eKeyIcon.setVisible(false);
    }

    useMachine() {
        if (!this.objectGiven) {
            this.objectGiven = true;
            this.scene.player.spendCoins(this.price);

            this.isInUse = true;
            this.lastUseTime = this.scene.time.now;
            this.remainingUses--;

            this.stretchMachine();
            this.dispenseItem();

            this.once('animationcomplete', () => {
                this.isInUse = false;

                if (this.remainingUses <= 0) {
                    this.disableMachine();
                } else {
                    this.play('teacher-front');
                    this.resetMachineScale();
                }
            });
        }
    }

    dispenseItem() {
        const items = ['maletin'];
        const randomItem = Phaser.Utils.Array.GetRandom(items);

        const startX = this.x;
        const startY = this.y + 10;

        const offsetX = Phaser.Math.Between(-30, 30);
        const offsetY = Phaser.Math.Between(30, 50);
        const endX = this.x + offsetX;
        const endY = this.y + offsetY;

        const item = new Item(this.scene, endX, endY, randomItem);
        item.setVisible(false);
        item.setDepth(this.depth + 10);

        this.scene.tweens.add({
            targets: item,
            alpha: { from: 0, to: 1 },
            y: startY - 20,
            duration: 400,
            ease: 'Power2',
            onStart: () => item.setVisible(true)
        });
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

    shakeMachine() {
        this.scene.tweens.add({
            targets: this,
            x: this.x + 3,
            duration: 80,
            yoyo: true,
            repeat: 3,
            ease: 'Sine.easeInOut'
        });
    }

    stretchMachine() {
        this.scene.tweens.add({
            targets: this,
            scaleX: this.originalScaleX * 0.9,
            scaleY: this.originalScaleY * 1.1,
            duration: 400,
            yoyo: true,
            ease: 'Back.easeOut'
        });

        this.scene.tweens.add({
            targets: this,
            y: this.y - 5,
            duration: 200,
            yoyo: true,
            repeat: 2
        });
    }

    resetMachineScale() {
        this.scene.tweens.add({
            targets: this,
            scaleX: this.originalScaleX,
            scaleY: this.originalScaleY,
            duration: 300,
            ease: 'Elastic.easeOut'
        });
    }

    disableMachine() {
        if (this.scene) {
            this.isOperational = false;

            this.stop();
            this.setFrame(18);
            this.setTint(0x737373);
            this.hideInteractionUI();

            this.scene.tweens.add({
                targets: this,
                scaleX: this.originalScaleX * 0.9,
                scaleY: this.originalScaleY * 0.9,
                angle: Phaser.Math.Between(-3, 3),
                duration: 500,
                ease: 'Bounce.easeOut'
            });
        }
    }

    resetMachine() {
        this.isOperational = true;
        this.remainingUses = this.maxUses;
        this.clearTint();
        this.setAlpha(1);
        this.play('teacher-front');
    }

    hitPlayer(machine, player) {
        player.body.setVelocityX(player.body.velocity.x * -0.5);
    }

    hitBullet(machine, bullet) {
        bullet.explode();
        if (this.isOperational) {
            this.flashEffect();
            this.bulletHits++;
            this.bulletText.setText(`Disparos: ${this.bulletHits}/${this.maxBulletHits}`);

            // Mostrar frase aleatoria
            const frase = Phaser.Utils.Array.GetRandom(this.frases);
            if (!this.dialogueActivo) {
                this.dialogueBox.show(frase);
                this.dialogueActivo = true;

                this.scene.time.delayedCall(3000, () => {
                    this.dialogueBox.hide();
                    this.dialogueActivo = false;
                });
            }

            if (this.bulletHits >= this.maxBulletHits) {
                this.bulletHits = 0;
                this.dispenseItem();
                this.disableMachine();
                this.emit('npcDeath', this.x, this.y);
                this.destroy();
            }
        }
    }
}
