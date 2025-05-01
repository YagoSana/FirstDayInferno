import Phaser from 'phaser';
import SpriteBase from '../spriteBase';
import Item from './item';
import DialogueBox from '../../scenes/conversation.js';

export default class bartender extends SpriteBase {
    constructor(scene, x, y) {
        super(scene, x, y, 'merchant'); // Usa el sprite que quieras
        this.play('idle-front-bartender');
        this.body.setImmovable(true);
        this.body.allowGravity = false;
        this.setScale(1.2);
        this.originalScaleX = 1.2;
        this.originalScaleY = 1.2;

        this.interactionRange = 60;
        this.itemsSpawned = false;

        this.scene.physics.add.collider(this, scene.player);

        // Para diálogo opcional
        this.dialogueBox = new DialogueBox(this.scene, this.x + 100, this.y + 200, 300, 'bartenderImg', 'Sánchez');

        this.frases = [
            "Todo en su sitio...",
            "¡Pilla lo que quieras, si tienes suelto!",
            "No se aceptan devoluciones, figura."
        ];

        this.scene.input.keyboard.on('keydown-E', () => {
            if (!this.isPlayerInRange()) return;

            if (this.dialogueActivo) {
                // Si ya hay diálogo abierto, cerrarlo
                this.dialogueBox.hide();
                this.dialogueActivo = false;
                return;
            }

            // Si no hay diálogo activo, abrimos uno nuevo
            if (!this.itemsSpawned) {
                this.spawnItems();
                this.itemsSpawned = true;
                this.dialogueBox.show("Mira a ver si te interesa algo...");
                this.dialogueActivo = true;
            } else {
                const frase = Phaser.Utils.Array.GetRandom(this.frases);
                this.dialogueBox.show(frase);
                this.dialogueActivo = true;
            }
        }, this);
    }

    isPlayerInRange() {
        return Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) <= this.interactionRange;
    }

    spawnItems() {
        const items = [
            { name: 'hamburguesa', price: 3 },
            { name: 'mini_tinto', price: 5 },
            { name: 'bumbo', price: 7 }
        ];

        this.spawnedItems = [];

        items.forEach((itemData, index) => {
            const offsetX = (index - 1) * 80; // distribuye a izquierda-centro-derecha
            const itemX = this.x + offsetX;
            const itemY = this.y + 100;

            const item = new ShopItem(this.scene, itemX, itemY, itemData.name, itemData.price);
            item.setBuyable(itemData.price)
            item.setLifetime(Infinity);
            this.spawnedItems.push(item);
        });
    }
}

// NUEVA CLASE para objetos de la tienda
class ShopItem extends Item {
    constructor(scene, x, y, texture, price) {
        super(scene, x, y, texture);

        this.price = price;
        this.scene = scene;

        // Mostrar el precio encima del objeto
        this.priceText = scene.add.text(this.x, this.y - 30, `${price} lereles`, {
            fontSize: '16px',
            fill: '#ffff00',
            fontFamily: 'monogram',
            backgroundColor: '#000000',
            padding: { x: 4, y: 2 }
        }).setOrigin(0.5).setDepth(this.depth + 1).setResolution(2);
    }
}
