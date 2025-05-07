import Phaser from 'phaser';
import SpriteBase from '../spriteBase';
import Item from './item';
import DialogueBox from '../../scenes/conversation.js';

export default class Merchant extends SpriteBase {
    constructor(scene, x, y) {
        super(scene, x, y, 'merchant');

        this.body.setImmovable(true);
        this.body.allowGravity = false;
        this.body.setSize(20, 10).setOffset(6, 0);
        this.setScale(1.2);
        this.originalScaleX = 1.2;
        this.originalScaleY = 1.2;

        this.interactionRange = 60;
        this.interactionArea = this.scene.add.circle(x, y, 40, 0x000000, 0);
        this.scene.physics.add.existing(this.interactionArea);
        this.interactionArea.body.setCircle(40);

        this.scene.physics.add.overlap(this.interactionArea, scene.player, this.showInteractionUI, null, this);
        this.scene.physics.add.collider(this, scene.player, this.hitPlayer, null, this);
        this.scene.physics.add.collider(this, scene.bulletGroup, this.hitBullet, null, this);
        this.scene.physics.add.collider(this, scene.enemyGroup);

        this.price = 0;
        this.maxBulletHits = 5;
        this.bulletHits = 0;
        this.isOperational = true;
        this.isInUse = false;
        this.useCooldown = 2000;
        this.lastUseTime = 0;
        this.itemsCleaned = false;

        const cam = this.scene.cameras.main;
        const boxWidth = 300;
        const marginBottom = 20;
        const dialogX = cam.centerX - boxWidth / 2;
        const dialogY = cam.y + cam.height - 100 - marginBottom;


        this.dialogueBox = new DialogueBox(this.scene, this.x + 100, this.y + 200, boxWidth, 'bartender-face', 'Sánchez');
        this.play('idle-front-bartender');

        this.interactionText = this.scene.add.text(0, this.y - 100, 'Comprar (3$)', this.createTextStyle())
            .setVisible(false).setDepth(25).setResolution(2);

        this.eKeyIcon = this.scene.add.sprite(0, 0, 'key_E_action')
            .setVisible(false).setDepth(20).play('key_E_action');

        this.bulletText = this.scene.add.text(this.x - 30, this.y - 40, 'Disparos: 0/5', this.createTextStyle('#ffff00', 14))
            .setVisible(false).setDepth(20).setResolution(2);

        this.noCoinsText = this.scene.add.text(this.x - 70, this.y - 40, 'Estás un poco pelao chaval, vuelve cuando tengas suelto', this.createTextStyle('#ff0000'))
            .setVisible(false).setDepth(30).setResolution(2);

        this.frases = [
            "¿Qué tal el bocata?",
            "Al final llegas tarde a clase.",
            "Tenía un agujero la cerveza.",
            "No se aceptan devoluciones, ¿eh?",
            "¡Vuelve pronto, artista!"
        ];

        this.modoHabla = false;
        this.dialogueActivo = false; // << NUEVO: Estado del diálogo activo

        this.scene.input.keyboard.on('keydown-E', () => {
            if (!this.isPlayerInRange()) return;

            if (this.dialogueActivo) {
                this.dialogueBox.hide();
                this.dialogueActivo = false;
                return;
            }

            if (this.modoHabla) {
                this.hablar();
            } else {
                this.purchaseItems();
            }
        }, this);
    }

    createTextStyle(color = '#ffffff', size = 16) {
        return {
            fontSize: `${size}px`,
            fill: color,
            fontFamily: 'monogram',
            backgroundColor: '#000000',
            padding: { x: 5, y: 4 }
        };
    }

    showInteractionUI() {
        if (!this.isOperational) return;

        if (this.scene.time.now - this.lastUseTime > this.useCooldown) {
            this.interactionText.setPosition(this.x - 50, this.y - 40).setVisible(true);
            this.eKeyIcon.setPosition(this.x, this.y - 30).setVisible(true);
            this.noCoinsText.setPosition(this.x - 70, this.y - 40);
        } else {
            this.hideInteractionUI();
        }
    }

    hideInteractionUI() {
        this.interactionText.setVisible(false);
        this.eKeyIcon.setVisible(false);
        this.bulletText.setVisible(false);
        this.noCoinsText.setVisible(false);
    }

    isPlayerInRange() {
        if (!this.scene || !this.scene.player) return false; // Verifica si existen estas referencias
        return Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) <= this.interactionRange;
    }
    

    purchaseItems() {
        if (!this.isOperational || this.isInUse || (this.scene.time.now - this.lastUseTime <= this.useCooldown)) return;

        if (this.scene.player.canAfford(this.price)) {
            this.scene.player.spendCoins(this.price);
            this.isInUse = true;
            this.lastUseTime = this.scene.time.now;

            this.stretchMachine();
            this.dispenseItem();

            this.modoHabla = true;
          
            this.dialogueBox.show('Gracias por tu compra, figura.');
            this.dialogueActivo = true; 
        } else {
            this.noCoinsText.setVisible(true);
            this.shakeMachine();
        }
    }

    hablar() {
   
        const frase = Phaser.Utils.Array.GetRandom(this.frases);
        this.dialogueBox.show(frase);
        this.dialogueActivo = true; // << mantiene el diálogo activo
    }

    dispenseItem() {
        const items = ['hamburguesa', 'mini_tinto', 'bumbo'];
        const startY = this.y + 100;
        this.compraRealizada = 1;
        this.itemsCleaned = false;
        this.dispensedItems = [];

        items.forEach((itemName, index) => {
            const delay = index * 300;
            this.scene.time.delayedCall(delay, () => {
                const startX = this.x - 40 + (index *80);
                const offsetY = Phaser.Math.Between(30, 50);
                const endY = this.y + offsetY;
                const item = new Item(this.scene, startX, startY, itemName);
                item.setVisible(false).setDepth(this.depth + 10);
                this.dispensedItems.push(item);
                this.scene.sound.play('pop');

                this.scene.tweens.add({
                    targets: item,
                    alpha: { from: 0, to: 1 },
                    y: startY - 20,
                    duration: 400,
                    ease: 'Power2',
                    onStart: () => item.setVisible(true),
                    onComplete: () => {
                        this.scene.tweens.add({ targets: item, y: endY, duration: 0 });
                        item.on('destroy', () => this.handleDestroyedItems(item));
                    }
                });
            });
        });
    }

    handleDestroyedItems(pickedItem) {
        if (this.itemsCleaned) return;
        this.itemsCleaned = true;

        this.dispensedItems.forEach(item => {
            if (item !== pickedItem && item?.destroy) {
                const puff = this.scene.add.sprite(item.x, item.y, 'puff').setDepth(item.depth + 1).play('item-puff');
                this.scene.sound.play('explode');
                this.scene.time.delayedCall(200, () => { item.destroy(); puff.destroy(); });
            }
        });

        this.dispensedItems = [];
    }

    flashEffect() {
        if (!this.isOperational) return;
        this.setTint(0x737373);
        this.scene.time.delayedCall(300, () => this.setTint(this.originalTint ?? 0xffffff));
    }

    shakeMachine() {
        this.scene.tweens.add({ targets: this, x: this.x + 3, duration: 80, yoyo: true, repeat: 3, ease: 'Sine.easeInOut' });
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
        this.scene.tweens.add({ targets: this, y: this.y - 5, duration: 200, yoyo: true, repeat: 2 });
    }

    hitBullet(_, bullet) {
        bullet.explode();
        if (!this.isOperational) return;

        this.flashEffect();
        this.bulletHits++;
        this.bulletText.setText(`Disparos: ${this.bulletHits}/${this.maxBulletHits}`);

        if (this.bulletHits >= this.maxBulletHits) {
            this.bulletHits = 0;
            this.dispenseItem();
            this.disableMachine?.();
        }
    }
}
