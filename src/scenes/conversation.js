import Phaser from 'phaser';

export default class DialogueBox {
    constructor(scene, x, y, width, imgKey, name) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.depth = 999;
        this.imgKey = imgKey;
        this.visible = false;
        this.name= name;
        this.gui_scale = 2;
        this.margin = 10;

        this.createUI();
    }

    createUI() {
        this.container = this.scene.add.container(this.x, this.y);
        this.container.setDepth(this.depth);
        this.container.setVisible(false);
        this.container.setScrollFactor(0);

        // Fondo del cuadro de diálogo
        this.bg = this.scene.add.rectangle(0, 0, this.width, 100, 0x000000, 0.7)
            .setOrigin(0)
            .setStrokeStyle(2, 0xffffff);

        // Marco de fondo del retrato
        this.statusBg = this.scene.add.sprite(this.margin, this.margin, 'status_frame_background')
            .setOrigin(0)
            .setTint(0x181425)
            .setScale(this.gui_scale);

        // Retrato
        this.portrait = this.scene.add.sprite(this.margin + 6, this.margin + 6, this.imgKey)
            .setOrigin(0)
            .setScale(1.7);

        // Marco decorativo del retrato
        this.statusFrame = this.scene.add.sprite(this.margin, this.margin, 'status_frame')
            .setOrigin(0)
            .setScale(this.gui_scale);

        // Calcular el inicio del texto justo después del retrato
        const portraitRight = this.portrait.x + this.portrait.displayWidth + this.margin;
        const textRightMargin = this.margin;

        // Texto con márgenes iguales a izquierda y derecha
        const wordWrapWidth = this.width - portraitRight;
        this.text = this.scene.add.text(portraitRight, this.margin, '', {
            fontSize: '14px',
            wordWrap: { width: wordWrapWidth },
            fontFamily: 'open-sans',
            color: '#ffffff'
        });

        // Icono de la tecla E (inicialmente invisible y colocado correctamente en show)
        this.eKeyIcon = this.scene.add.sprite(this.width-20, this.portrait.y+this.portrait.displayWidth+15, 'key_E_action')
             .setVisible(false)
             .setDepth(20)
             .setScale(1.1)
             .play('key_E_action');
        // Posición vertical justo debajo del retrato
const nameY = this.portrait.y + this.portrait.displayHeight + 4;
const nameWidth = this.portrait.displayWidth;

// Fondo del nombre
this.nameBg = this.scene.add.rectangle(this.portrait.x, nameY, nameWidth, 20, 0x181425, 0.7)
    .setOrigin(0)
    .setStrokeStyle(1, 0xffffff);

// Texto del nombre
this.nameText = this.scene.add.text(this.portrait.x + nameWidth / 2, nameY + 10, this.name, {
    fontSize: '14px',
    fontFamily: 'monogram',
    color: '#ffffff',
})
    .setOrigin(0.5)
    .setDepth(this.depth + 1);



        // Añadir todo al contenedor
        this.container.add([
            this.bg,
            this.statusBg,
            this.portrait,
            this.statusFrame,
            this.text,
            this.eKeyIcon,
            this.nameBg,
            this.nameText
        ]);
    }

    show(message, spriteKey = null, animationKey = null) {
     
        this.text.setText(message);
        if (animationKey) {
            this.portrait.play(animationKey);
        }

       
        this.eKeyIcon.setVisible(true);

        this.container.setVisible(true);
        this.visible = true;
        this.scene.freezeScene(); 
    }

    hide() {
      
        this.container.setVisible(false);
        this.eKeyIcon.setVisible(false);
        this.visible = false;

        if (this.portrait.anims) {
            this.portrait.stop();
        }
        this.scene.unfreezeScene();
    }
}
