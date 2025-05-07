import Phaser from 'phaser';
import Item from './item';

export default class ShopItem extends Item {
    constructor(scene, x, y, texture, price) {
        super(scene, x, y, texture);

        this.price = price;
        this.scene = scene;

        this.priceText = scene.add.text(this.x, this.y - 30, `${price} €`, {
            fontSize: '16px',
            fill: '#ffff00',
            fontFamily: 'monogram',
            backgroundColor: '#000000',
            padding: { x: 4, y: 2 }
        }).setOrigin(0.5).setDepth(this.depth + 1).setResolution(2);
    }
}
