// dialogueScene.js
import Phaser from 'phaser';

export default class DialogueScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DialogueScene' });
        this.textSpeed = 30; // caracteres por segundo
        this.currentChar = 0;
        this.fullMessage = '';
        this.displayedMessage = '';
        this.timerEvent = null;
        this.isTextComplete = false;
        this.previousScene = null;
    }

    init(data) {
        this.fullMessage = data.message || '...';
        this.speaker = data.speaker || 'NPC';
        this.portraitKey = data.portraitKey || 'default-portrait';
        this.animationKey = data.animationKey;
        this.onClose = data.onClose;
        this.textSpeed = data.textSpeed || 30; // Permite personalizar la velocidad
        this.previousScene = data.previousScene;
    }

    create(data) {
        // Configuración basada en la cámara
        this.scale = 0.8;
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        const width = 900;
        const height = 200;

        let dialogueY = centerY + 50;
        this.scene.bringToTop('UIButtons');

        // Fondo semitransparente
        this.bg = this.add.rectangle(centerX, dialogueY + 100, width, height, 0x000000, 0.7)
            .setOrigin(0.5)
            .setStrokeStyle(6, 0x5a6988);

        this.statusBg = this.add.sprite(centerX - width/ 2 + 10, dialogueY + 10, 'status_frame_background')
            .setOrigin(0)
            .setTint(0x181425)
            .setScale(5);

        // Marco decorativo del retrato
        this.statusFrame = this.add.sprite(centerX - width / 2 + 10, dialogueY + 10, 'status_frame')
            .setOrigin(0)
            .setScale(5);

        // Retrato
        if (this.textures.exists(this.portraitKey)) {
            this.portrait = this.add.sprite(
                centerX - width / 2 + 25,
                dialogueY + 25,
                this.portraitKey
            ).setOrigin(0).setScale(4);

            if (this.animationKey) {
                this.portrait.play(this.animationKey);
            }
        }

        this.eKeyIcon = this.add.sprite(width + 10, centerY + height + 10, 'key_E_action')
            .setVisible(true).setScale(3)
            .play('key_E_action');

        // Texto del mensaje (inicialmente vacío)
        this.text = this.add.text(
            this.portrait ? this.portrait.x + this.portrait.displayWidth + 40 : centerX - width / 2 + 40,
            dialogueY + 30,
            '',
            {
                fontSize: '32px',
                fontFamily: 'monogram',
                color: '#ffffff',
                wordWrap: { width: width - 60 - (this.portrait ? this.portrait.displayWidth : 0) }
            }
        ).setResolution(2);

        // Nombre del hablante
        if (this.speaker) {
            this.nameText = this.add.text(
                this.portrait ? this.portrait.x + this.portrait.displayWidth / 2 : centerX - width / 2 + 30,
                this.portrait ? this.portrait.y + this.portrait.displayHeight + 10 : centerY - height / 2 + 10,
                this.speaker,
                {
                    fontSize: '32px',
                    fontFamily: 'monogram',
                    color: '#ffffff',
                    backgroundColor: '#181425'
                }
            ).setOrigin(0.5, 0).setResolution(2);
        }

        // Iniciar efecto de escritura
        this.startTextAnimation();

        // Pausar la escena del juego al abrir diálogo
        console.log('ESCENA DEL DIALOGO ', this.previousScene);
        if (this.scene.isActive(this.previousScene)) {
            this.scene.pause(this.previousScene);
        }

        // Configurar entrada para avanzar/cerrar
        this.input.keyboard.on('keydown-E', this.handleInput, this);
        this.input.on('closeDialogue', this.closeDialog, this);
    }

    startTextAnimation() {
        this.isTextComplete = false;
        this.currentChar = 0;
        this.displayedMessage = '';
        this.text.setText('');

        // Calculamos el intervalo entre caracteres en milisegundos
        const delay = 1000 / this.textSpeed;

        this.timerEvent = this.time.addEvent({
            delay: delay,
            callback: this.addNextChar,
            callbackScope: this,
            loop: true
        });
    }

    addNextChar() {
        this.displayedMessage += this.fullMessage[this.currentChar];
        this.text.setText(this.displayedMessage);

        // Efecto de sonido opcional (descomenta si tienes un sonido adecuado)
        // this.sound.play('text_sound', { volume: 0.1 });

        this.currentChar++;

        if (this.currentChar >= this.fullMessage.length) {
            this.completeText();
        }
    }

    completeText() {
        if (this.timerEvent) {
            this.timerEvent.destroy();
            this.timerEvent = null;
        }
        this.isTextComplete = true;
        this.text.setText(this.fullMessage); // Asegura que todo el texto esté visible
    }

    handleInput() {
        if (!this.isTextComplete) {
            // Si el texto no ha terminado, completarlo inmediatamente
            this.completeText();
        } else {
            // Si el texto está completo, cerrar el diálogo
            this.closeDialog();
        }
    }

    closeDialog() {
        if (this.timerEvent) {
            this.timerEvent.destroy();
        }

        this.input.keyboard.off('keydown-E', this.handleInput);
        this.events.off('closeDialogue', this.closeDialog);

        if (this.onClose) {
            this.onClose();
        }

        // Reanudar la escena del juego al cerrar diálogo
        if (this.previousScene && this.scene.isPaused(this.previousScene)) {
            this.scene.resume(this.previousScene);
        }
        this.scene.stop();
    }
}