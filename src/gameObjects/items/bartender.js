import Phaser from 'phaser';
import SpriteBase from '../spriteBase';
import Item from './item';
import DialogueBox from '../../scenes/conversation.js';

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

        // Caja de diálogo estilo DialogueNPC
        this.dialogueBox = new DialogueBox(this.scene, this.x + 100, this.y + 200, 300, 'bartenderImg', 'Sánchez');

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

        // Mostrar ícono E cuando el jugador está cerca
        this.scene.physics.add.overlap(this.interactionArea, this.scene.player, () => {
            if (!this.dialogueActivo) {
                this.eKeyIcon.setPosition(this.x, this.y - 30).setVisible(true);
            }
        });

        // Ocultar ícono si se aleja
        this.scene.events.on('update', () => {
            if (!this.isPlayerInRange() || this.dialogueActivo) {
                this.eKeyIcon.setVisible(false);
            }
        });

        // Escucha la tecla E
        this.scene.input.keyboard.on('keydown-E', () => {
            if (!this.isPlayerInRange()) return;

            if (this.dialogueActivo) {
                this.dialogueBox.hide();
                this.dialogueActivo = false;
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
        return Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) <= this.interactionRange;
    }

    mostrarDialogo(frase) {
        this.dialogueBox.show(frase);
        this.dialogueActivo = true;
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

class ShopItem extends Item {
    constructor(scene, x, y, texture, price) {
        super(scene, x, y, texture);

        this.price = price;
        this.scene = scene;

        this.priceText = scene.add.text(this.x, this.y - 30, `${price} lereles`, {
            fontSize: '16px',
            fill: '#ffff00',
            fontFamily: 'monogram',
            backgroundColor: '#000000',
            padding: { x: 4, y: 2 }
        }).setOrigin(0.5).setDepth(this.depth + 1).setResolution(2);
    }
}
