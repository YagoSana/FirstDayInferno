import Phaser from 'phaser';
import SpriteBase from '../spriteBase.js';
import ShopItem from './shopItem.js';

export default class Bartender extends SpriteBase {
    constructor(scene, x, y) {
        super(scene, x, y, 'merchant');

        this.scene = scene;
        this.play('idle-front-bartender');
        this.body.setImmovable(true);
        this.body.allowGravity = false;
        this.setScale(1.2);

        this.interactionRange = 60;
        this.itemsSpawned = false;
        this.dialogueActivo = false;
        this.playerIsNear = false;

        this.scene.physics.add.collider(this, scene.player);

        this.frases = [
            "Todo en su sitio...",
            "¡Pilla lo que quieras, si tienes suelto!",
            "No se aceptan devoluciones, figura."
        ];

        // Icono de tecla E
        this.eKeyIcon = scene.add.sprite(this.x, this.y - 20, 'key_E_action')
            .setVisible(false)
            .setDepth(20)
            .play('key_E_action');

        // Área de interacción invisible
        this.interactionArea = scene.add.circle(this.x, this.y, this.interactionRange, 0x000000, 0);
        scene.physics.add.existing(this.interactionArea);
        this.interactionArea.body.setAllowGravity(false);
        this.interactionArea.body.setImmovable(true);

        this.setupInteraction();
    }

    setupInteraction() {
        // Mostrar ícono E cuando el jugador está cerca
        this.scene.physics.add.overlap(this.interactionArea, this.scene.player, () => {
            this.playerIsNear = true;
            if (!this.dialogueActivo) {
                this.eKeyIcon.setPosition(this.x, this.y - 30).setVisible(true);
            }
        }, null, this);

        // Ocultar ícono si se aleja
        this.scene.physics.add.overlap(this.interactionArea, this.scene.player, () => {
            this.playerIsNear = Phaser.Math.Distance.Between(
                this.x, this.y,
                this.scene.player.x, this.scene.player.y
            ) <= this.interactionRange;

            if (!this.playerIsNear || this.dialogueActivo) {
                this.eKeyIcon.setVisible(false);
            }
        }, null, this);

        // Escucha la tecla E
        this.scene.input.keyboard.on('keydown-E', () => {
            if (!this.playerIsNear) return;

            if (this.dialogueActivo) {
                // Enviar evento a la escena de diálogo para que se cierre
                this.scene.events.emit('closeDialogue');
                return;
            }

            if (!this.itemsSpawned) {
                this.spawnItems();
                this.itemsSpawned = true;
                this.mostrarDialogo("Mira a ver si te interesa algo...");
            } else {
                const frase = Phaser.Utils.Array.GetRandom(this.frases);
                this.mostrarDialogo(frase);
            }
        }, this);
    }

    preUpdate() {
        this.playerIsNear = this.isPlayerInRange();
    }


    isPlayerInRange() {
        if (!this.scene || !this.scene.player) return false;
        return Phaser.Math.Distance.Between(
            this.x, this.y, 
            this.scene.player.x, this.scene.player.y
        ) <= this.interactionRange;
    }

    mostrarDialogo(frase) {
        this.dialogueActivo = true;
        this.eKeyIcon.setVisible(false);
        // Lanzamos la escena de diálogo con los parámetros necesarios
        this.scene.scene.launch('DialogueScene', {
            message: frase,
            speaker: 'Sánchez',
            portraitKey: 'bartender_talk',
            textSpeed: 35, // Velocidad del efecto de texto
            previousScene: this.scene.scene.key, // Pasar la escena actual
            onClose: () => {
                this.dialogueActivo = false;
                if (this.playerIsNear) {
                    this.eKeyIcon.setVisible(true);
                }
            }
        });

        this.scene.scene.bringToTop('DialogueScene');
    }

    spawnItems() {
        const items = [
            { name: 'hamburguesa', price: 3 },
            { name: 'mini_tinto', price: 5 },
            { name: 'bumbo', price: 7 }
        ];

        this.spawnedItems = [];

        items.forEach((itemData, index) => {
            const offsetX = (index - 1) * 80;
            const itemX = this.x + offsetX;
            const itemY = this.y + 100;

            const item = new ShopItem(this.scene, itemX, itemY, itemData.name, itemData.price);
            item.setItemHitBox(30, 30);
            item.setBuyable(itemData.price);
            item.setLifetime(Infinity);
            this.spawnedItems.push(item);
        });
    }
}

