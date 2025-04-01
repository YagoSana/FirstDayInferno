import Phaser from 'phaser';
import SpriteBase from '../spriteBase';
import Item from './item';

export default class merchant extends SpriteBase {
    constructor(scene, x, y) {
        super(scene, x, y, 'merchant');

        this.body.setImmovable(true); // Esto evita que se mueva al colisionar
        this.body.allowGravity = false; // Por si acaso

        // Ajustar hitbox para permitir pasar un poco por encima
        this.body.setSize(20, 10); // Reducimos altura
        this.body.setOffset(6, 0); // Ajustamos offset
        this.setScale(1.2);
        this.interactionRange = 60;
        this.originalScaleX = 1.2;
        this.originalScaleY = 1.2;

        this.interactionArea = this.scene.add.circle(x, y, 40, 0x000000, 0);
        this.scene.physics.add.existing(this.interactionArea);
        this.interactionArea.body.setCircle(40);

        this.scene.physics.add.overlap(this.interactionArea, scene.player, this.showInteractionUI, null, this);
        this.scene.physics.add.collider(this, scene.player, this.hitPlayer, null, this);
        this.scene.physics.add.collider(this, scene.bulletGroup, this.hitBullet, null, this);
        this.scene.physics.add.collider(this, scene.enemyGroup);

        // Propiedades de la máquina
        this.price = 0;
        this.maxBulletHits = 5; // Disparos necesarios
        this.bulletHits = 0;    // Contador de disparos recibidos
        this.remainingUses = this.maxUses;
        this.isOperational = true;
        this.isInUse = false;
        this.useCooldown = 2000; // 2 segundos entre usos
        this.lastUseTime = 0;
        this.itemsCleaned = false;

        // Estado inicial
        this.play('idle-front-bartender');
        
        // Elementos UI
        this.interactionText = this.scene.add.text(0, 0, 'Comprar (5$)', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'monogram',
            backgroundColor: '#000000',
            padding: { x: 5, y: 4 }
        })
            .setVisible(false)
            .setDepth(25).setResolution(2);

        this.eKeyIcon = this.scene.add.sprite(0, 0, 'key_E_action')
            .setVisible(false)
            .setDepth(20)
            .play('key_E_action');

        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.scene.input.keyboard.on('keydown-E', () => {
            if (this.modoHabla) {
                this.hablar();
            } else {
                this.useMachine(); // Aquí cambiamos onInteract por useMachine
            }
        }, this);

        // Texto para modo disparo
        this.bulletText = this.scene.add.text(this.x - 30, this.y - 40, 'Disparos: 0/5', {
            fontSize: '14px',
            fill: '#ffff00',
            fontFamily: 'monogram',
            backgroundColor: '#000000',
            padding: { x: 5, y: 3 }
        })
            .setVisible(false)
            .setDepth(20).setResolution(2);

        this.noCoinsText = this.scene.add.text(this.x - 70, this.y - 40, 'Estás un poco pelao chaval, vuelve cuando tengas suelto', {
            fontSize: '16px',
            fill: '#ff0000',
            fontFamily: 'monogram',
            backgroundColor: '#000000',
            padding: { x: 5, y: 4 }
        })
            .setVisible(false)
            .setDepth(30).setResolution(2);

        // Frases para el diálogo
        this.frases = [
            "¿Qué tal el bocata?",
            "Al final llegas tarde a clase.",
            "Tenía un agujero la cerveza.",
            "No se aceptan devoluciones, ¿eh?",
            "¡Vuelve pronto, artista!"
        ];

        this.modoHabla = false;

        this.dialogoText = this.scene.add.text(this.x - 70, this.y, '', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'monogram',
            backgroundColor: '#000000',
            padding: { x: 5, y: 4 }
        }).setVisible(false).setDepth(30).setResolution(2);
    }

    showInteractionUI(machine, player) {
        if (this.isOperational) {
            // Guardar referencia en el jugador
            player.nearVendingMachine = this;

            // Si la máquina no está en uso
            if (this.scene.time.now - this.lastUseTime > this.useCooldown) {
                // Mostrar UI
                this.interactionText.setPosition(this.x - 100 / 2, this.y - 40);
                this.interactionText.setVisible(true);

                this.eKeyIcon.setPosition(this.x - 60, this.y - 30);
                this.eKeyIcon.setVisible(true);

                this.noCoinsText.setPosition(this.x - 70, this.y - 40);
            } else {
                this.hideInteractionUI();
            }
        }
    }

    hideInteractionUI() {
        this.interactionText.setVisible(false);
        this.eKeyIcon.setVisible(false);
        this.bulletText.setVisible(false);
        this.noCoinsText.setVisible(false);
        this.dialogoText.setVisible(false);  // Ocultar también el diálogo
    }

    useMachine() {
        if (this.isOperational || !this.isInUse || (this.scene.time.now - this.lastUseTime > this.useCooldown)) {
            if (this.scene.player.canAfford(this.price)) {
                this.scene.player.spendCoins(this.price);

                this.isInUse = true;
                this.lastUseTime = this.scene.time.now;

                this.stretchMachine();
                this.dispenseItem();

                // Cambiar a modo hablar después de comprar
                this.modoHabla = true;
                this.interactionText.setText('Hablar'); // Cambiar texto en UI
            } else {
                this.noCoinsText.setVisible(true);
                this.shakeMachine(); // Efecto de rechazo
            }
        }
    }

    dispenseItem() {
        const items = ['hamburguesa', 'mini_tinto', 'bumbo'];
        const startY = this.y + 60; // Justo debajo de la máquina
        this.compraRealizada = 1;
    
        this.itemsCleaned = false; // Reset para el control de destrucción
        this.dispensedItems = [];  // Reiniciamos la lista
    
        items.forEach((itemName, index) => {
            const delay = index * 300; // 300ms entre cada ítem
    
            this.scene.time.delayedCall(delay, () => {
                const startX = this.x - 40 + (index * 40);
                const offsetY = Phaser.Math.Between(30, 50);
                const endY = this.y + offsetY;
    
                const item = new Item(this.scene, startX, startY, itemName);
                item.setVisible(false);
                item.setDepth(this.depth + 10);
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
                        this.scene.tweens.add({
                            targets: item,
                            y: endY,
                            duration: 0,
                        });

                        item.on('destroy', (destroyedItem) => {
                            this.handleDestroyedItems(destroyedItem);
                        });
                    }
                });
            });
        });
    }

    handleDestroyedItems(pickedItem) {
        if (this.itemsCleaned) return;
        this.itemsCleaned = true;
    
        this.dispensedItems.forEach((item) => {
            if (item !== pickedItem && item && item.destroy) {
                // Crear explosión "puff" en la posición del item
                const puff = this.scene.add.sprite(item.x, item.y, 'puff');
                puff.setDepth(item.depth + 1); // Para que quede encima
                puff.play('item-puff');
                this.scene.sound.play('explode');
                // Destruir el item después de un pequeño delay (para ver la animación)
                this.scene.time.delayedCall(200, () => {
                    item.destroy();
                    puff.destroy(); // También eliminamos la animación al finalizar
                });
            }
        });
    
        this.dispensedItems = [];
    }

    hablar() {
        const frase = Phaser.Utils.Array.GetRandom(this.frases);
        this.dialogoText.setText(frase);
        this.dialogoText.setVisible(true);

        this.scene.time.delayedCall(2000, () => {
            this.dialogoText.setVisible(false);
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

    hitBullet(machine, bullet) {
        bullet.explode();
        if (this.isOperational) {
            this.flashEffect();
            this.bulletHits++;
            this.bulletText.setText(`Disparos: ${this.bulletHits}/${this.maxBulletHits}`);

            if (this.bulletHits >= this.maxBulletHits) {
                this.bulletHits = 0;
                this.dispenseItem();
                this.disableMachine();
            }
        }
    }
}
