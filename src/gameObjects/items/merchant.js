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

        // Rango de interacción independiente de la hitbox

        // Propiedades de la máquina
        this.price = 0;
        this.maxBulletHits = 5; // Disparos necesarios
        this.bulletHits = 0;    // Contador de disparos recibidos
        this.remainingUses = this.maxUses;
        this.isOperational = true;
        this.isInUse = false;
        this.useCooldown = 2000; // 2 segundos entre usos
        this.lastUseTime = 0;

        // Estado inicial
        this.play('idle-front');
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
    }



    showInteractionUI(machine, player) {
        if (this.isOperational) {
            // Guardar referencia en el jugador
            player.nearVendingMachine = this;

            //si la no maquina esta en uso
            if (this.scene.time.now - this.lastUseTime > this.useCooldown) {
                // Mostrar UI
                this.interactionText.setPosition(this.x - 100 / 2, this.y - 40);
                this.interactionText.setVisible(true);

                this.eKeyIcon.setPosition(this.x - 60, this.y - 30);
                this.eKeyIcon.setVisible(true);

                this.noCoinsText.setPosition(this.x - 70, this.y - 40);
            }
            else {
                this.hideInteractionUI();
            }
        }
    }

    hideInteractionUI() {
        // console.log("ocultando texto");
        this.interactionText.setVisible(false);
        this.eKeyIcon.setVisible(false);
        this.bulletText.setVisible(false);
        this.noCoinsText.setVisible(false)
    }

    useMachine() {
        if (this.isOperational || !this.isInUse || (this.scene.time.now - this.lastUseTime > this.useCooldown)) {
            if (this.scene.player.canAfford(this.price)) {
    
                this.scene.player.spendCoins(this.price);
    
                this.isInUse = true;
                this.lastUseTime = this.scene.time.now;
    
                this.stretchMachine();
                this.dispenseItem();
            }
            else {
                this.noCoinsText.setVisible(true);
                this.shakeMachine(); // Efecto de rechazo
            }
        }
    }
    


    dispenseItem() {
        const items = ['hamburguesa', 'mini_tinto', 'bumbo'];
        const startY = this.y + 30; // Justo debajo de la máquina
        this.compraRealizada = 1;

        this.dispensedItems = []; // Reiniciamos la lista de objetos

        items.forEach((itemName, index) => {
            const startX = this.x - 40 + (index * 40);
            const offsetY = Phaser.Math.Between(30, 50);
            const endY = this.y + offsetY;

            const item = new Item(this.scene, startX, startY, itemName);
            item.setVisible(false);
            item.setDepth(this.depth + 10);
            this.dispensedItems.push(item); // Guardamos el objeto en el array

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
                        duration: 1000,
                        ease: 'Bounce.out'
                    });

                    // Añadir detección de selección del objeto
                    this.scene.physics.add.overlap(item, this.scene.player, () => {
                        this.collectItem(item);
                    });
                }
            });
        });
    }

    collectItem(selectedItem) {
        // Ocultar todos los objetos
        this.dispensedItems.forEach(item => {
            if (item !== selectedItem) {
                item.destroy(); // Elimina los demás objetos
            }
        });

        this.dispensedItems = []; // Limpiar lista
    }
    
    

    flashEffect() {
        if (this.isOperational) {
            // Guardar el tintado original si es la primera vez
            if (this.originalTint === undefined) {
                this.originalTint = this.tint;
            }

            // Flash blanco
            this.setTint(0x737373);
            // console.log('flash effect');
            // Volver al color original después de 100ms
            this.scene.time.delayedCall(300, () => {
                if (this.isOperational) { // Verificar si el objeto existe
                    this.setTint(this.originalTint);
                }
            });
        }
    }

    // Nuevos métodos para efectos visuales:
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
        // Efecto de "estirarse" al usarla
        this.scene.tweens.add({
            targets: this,
            scaleX: this.originalScaleX * 0.9,
            scaleY: this.originalScaleY * 1.1,
            duration: 400,
            yoyo: true,
            ease: 'Back.easeOut'
        });

        // Pequeño shake vertical
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

    hitPlayer(machine, player) {
        // Puedes añadir lógica adicional aquí
        // Por ejemplo, un pequeño efecto de retroceso para el jugador
        player.body.setVelocityX(player.body.velocity.x * -0.5);
    }

    hitBullet(machine, bullet) {
        // Efecto visual
        // this.bulletText.setVisible(true);
        bullet.explode();
        if (this.isOperational) {
            this.flashEffect();
            // Incrementar contador
            this.bulletHits++;
            this.bulletText.setText(`Disparos: ${this.bulletHits}/${this.maxBulletHits}`);

            // Verificar si alcanzó el límite
            if (this.bulletHits >= this.maxBulletHits) {
                this.bulletHits = 0;
                this.dispenseItem();
                this.disableMachine();
            }

        }
    }

}