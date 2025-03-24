import Phaser from 'phaser';
import SpriteBase from '../spriteBase';
import Item from './item';

export default class VendingMachine extends SpriteBase {
    constructor(scene, x, y) {
        super(scene, x, y, 'vending_machine');

        this.body.setImmovable(true); // Esto evita que se mueva al colisionar
        this.body.allowGravity = false; // Por si acaso

        // Ajustar hitbox para permitir pasar un poco por encima
        this.body.setSize(20, 10); // Reducimos altura
        this.body.setOffset(6, 0); // Ajustamos offset
        this.setScale(1.2);
        this.interactionRange = 60;

        this.interactionArea = this.scene.add.circle(x, y, 20, 0x000000, 0);
        this.scene.physics.add.existing(this.interactionArea);
        this.interactionArea.body.setCircle(20);


        this.scene.physics.add.overlap(this.interactionArea, scene.player, this.showInteractionUI, null, this);

        this.scene.physics.add.collider(this, scene.player, this.hitPlayer, null, this);
        this.scene.physics.add.collider(this, scene.bulletGroup, this.hitBullet, null, this);
        this.scene.physics.add.collider(this, scene.enemyGroup);

        // Rango de interacción independiente de la hitbox

        // Propiedades de la máquina
        this.maxBulletHits = 5; // Disparos necesarios
        this.bulletHits = 0;    // Contador de disparos recibidos
        this.maxUses = 3;
        this.remainingUses = this.maxUses;
        this.isOperational = true;
        this.isInUse = false;
        this.useCooldown = 2000; // 2 segundos entre usos
        this.lastUseTime = 0;

        // Estado inicial
        this.play('vm-idle');
        // Elementos UI
        this.interactionText = this.scene.add.text(0, 0, 'Insertar moneda', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'monogram',
            backgroundColor: '#000000',
            padding: { x: 5, y: 4 }
        })
            .setVisible(false)
            .setDepth(100).setResolution(2);

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
    }

    preupdate() {
        // Verificar si el jugador se alejó
        if (this.scene.player.nearVendingMachine !== this) {
            this.hideInteractionUI();
        }

    }

    showInteractionUI(machine, player) {
        if (this.isOperational) {
            // Guardar referencia en el jugador
            player.nearVendingMachine = this;
            // Mostrar UI
            this.interactionText.setPosition(this.x - 100 / 2, this.y - 40);
            this.interactionText.setVisible(true);

            this.eKeyIcon.setPosition(this.x - 60, this.y - 30);
            this.eKeyIcon.setVisible(true);
        }
    }

    hideInteractionUI() {
        this.interactionText.setVisible(false);
        this.eKeyIcon.setVisible(false);
    }

    useMachine() {
        if (!this.isOperational || this.isInUse ||
            (this.scene.time.now - this.lastUseTime < this.useCooldown)) return;

        this.isInUse = true;
        this.lastUseTime = this.scene.time.now;
        this.remainingUses--;

        // Animación de uso
        this.play('vm-using');
        this.once('animationcomplete', () => {
            this.isInUse = false;

            // Soltar objeto
            this.dispenseItem();

            // Verificar si se agotaron los usos
            if (this.remainingUses <= 0) {
                this.disableMachine();
            } else {
                this.play('vm-idle');
            }
        });
    }

    dispenseItem() {
        // Crear un objeto aleatorio cerca de la máquina
        const items = ['hamburguesa', 'mini_tinto', 'bumbo'];
        const randomItem = Phaser.Utils.Array.GetRandom(items);

        // Posición inicial (dentro de la máquina)
        const startX = this.x;
        const startY = this.y + 10; // Justo debajo del centro

        // Posición final (fuera de la máquina)
        const offsetX = Phaser.Math.Between(-30, 30);
        const offsetY = Phaser.Math.Between(30, 50);
        const endX = this.x + offsetX;
        const endY = this.y + offsetY;

        // Crear el ítem en posición inicial (invisible)
        const item = new Item(this.scene, endX, endY, randomItem);
        item.setVisible(false); // Comenzar invisible
        item.setDepth(this.depth + 10); // Asegurar que esté sobre la máquina

        // Animación de salida mejorada (sin sequence)
        this.scene.tweens.add({
            targets: item,
            alpha: { from: 0, to: 1 },
            y: startY - 20,
            duration: 400,
            ease: 'Power2',
            onStart: () => item.setVisible(true),
            onComplete: () => {
                // Animación de caída con bounce
                this.scene.tweens.add({
                    targets: item,
                    y: endY,
                    duration: 1000,
                    ease: 'Bounce.out'
                });
            }
        });
    }

    flashEffect() {
        if (this.isOperational) {
            // Guardar el tintado original si es la primera vez
            if (this.originalTint === undefined) {
                this.originalTint = this.tint;
            }

            // Flash blanco
            this.setTint(0x737373);
            console.log('flash effect');
            // Volver al color original después de 100ms
            this.scene.time.delayedCall(300, () => {
                if (this.isOperational) { // Verificar si el objeto existe
                    this.setTint(this.originalTint);
                }
            });
        }
    }

    disableMachine() {
        if (this.scene) {
            this.isOperational = false;

            this.stop(); // Detener animación
            this.setFrame(18); // Frame inicial de idle
            // Aplicar tintado oscuro permanente
            this.setTint(0x737373); // Usamos setTintFill para forzar el color
            this.hideInteractionUI();
            console.log('maquina deshabilitada')

        }

    }

    resetMachine() {
        this.isOperational = true;
        this.remainingUses = this.maxUses;
        this.clearTint();
        this.setAlpha(1); // Asegurar que esté totalmente visible
        this.play('vm-idle');
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