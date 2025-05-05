import Phaser from 'phaser';

export default class MessageScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'MessageScreen' });
    }

    init(data) {
        console.log('ENTRANDO A LA PANTALLA DE MENSAJE', data);
        this.texto = data.texto;
        this.prevScene = data.prevScene;
        this.managerKey = data.managerKey; // Para saber de qué manager estamos hablando
    }

    create() {
        this.scene.stop('GUI')
        // Configuración básica
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.manager = this.scene.get(this.managerKey);

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Fondo oscuro
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000)
            .setOrigin(0, 0)
            .setDepth(0);

        // Texto
        this.playerText = this.add.text(centerX, centerY, this.texto, {
            fontSize: '64px',
            fontFamily: 'monogram',
            color: '#FFFFFF', // Verde brillante
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setAlpha(1).setDepth(1).setResolution(2);

        // Configurar tecla para continuar
        this.continueKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.canSkip = false;
        this.time.delayedCall(1000, () => {
            this.canSkip = true;
            // Texto para continuar (parpadeante)
            this.continueText = this.add.text(centerX, this.cameras.main.height - 40, 'PULSA E PARA CONTINUAR', {
                fontSize: '32px',
                fontFamily: 'monogram',
                color: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5).setAlpha(0).setDepth(1).setResolution(2);

            this.tweens.add({
                targets: this.continueText,
                alpha: 1,
                duration: 1000,
                yoyo: true,
                repeat: -1
            });
        });
    }

    update() {
        if (this.canSkip && this.continueKey && Phaser.Input.Keyboard.JustDown(this.continueKey)) {
            // Fade out antes de cambiar
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                // IMPORTANTE: Usamos el manager para cambiar de sala correctamente
                this.manager.volverAlLobby(this.prevScene);
                this.scene.stop('MessageScreen');
            });
        }
    }
}