import Phaser from 'phaser';
export default class DialogueBox {
    constructor(scene, x, y, width) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.depth = 999;

        this.visible = false;

        this.createUI();
    }

    createUI() {
        // Fondo del cuadro de diálogo
        this.bg = this.scene.add.rectangle(this.x, this.y, this.width, 100, 0x000000, 0.7)
            .setOrigin(0)
            .setScrollFactor(0)
            .setDepth(this.depth)
            .setStrokeStyle(2, 0xffffff)
            .setVisible(false);

        // Imagen del personaje
        this.portrait = this.scene.add.image(this.x + 10, this.y + 10, null)
            .setOrigin(0)
            .setScrollFactor(0)
            .setDepth(this.depth + 1)
            .setVisible(false)
            .setDisplaySize(64, 64);

        // Texto del diálogo
        this.text = this.scene.add.text(this.x + 80, this.y + 10, '', {
            fontSize: '20px',
            wordWrap: { width: this.width - 90 },
            fontFamily: 'monogram',
            color: '#ffffff'
        })
            .setScrollFactor(0)
            .setDepth(this.depth + 1)
            .setVisible(false);
    }

    show(message, portraitKey) {
        this.text.setText(message);
        this.portrait.setTexture(portraitKey);

        this.bg.setVisible(true);
        this.portrait.setVisible(true);
        this.text.setVisible(true);

        this.visible = true;
    }

    hide() {
        this.bg.setVisible(false);
        this.portrait.setVisible(false);
        this.text.setVisible(false);

        this.visible = false;
    }
}
