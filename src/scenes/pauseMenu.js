import Phaser from 'phaser';

export default class PauseMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseMenu' });
    }

    create(data) {
        this.sonidoSalir = this.sound.add('salirPausa');
        this.sound.pauseAll();
        //Configuracion del texto
        let textConfig = {
            fontSize: '40px',
            color: '#ffffff',
            fontFamily: 'monogram'
        };

        this.previousScene = data.previousScene; // Guardar el nombre de la escena anterior
        console.log(`Escena actual: ${this.scene.key}`);


        // Fondo semitransparente
        const background = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.5)
            .setOrigin(0, 0);

        // Botón "Reanudar"
        const resumeButton = this.add.text(500, 200, 'Reanudar', textConfig)
            .setOrigin(0.5, 0.5)
            .setInteractive();

        // Botón "Salir"
        const exitButton = this.add.text(500, 300, 'Salir', textConfig)
            .setOrigin(0.5, 0.5)
            .setInteractive();

        // Eventos de los botones
        resumeButton.on('pointerdown', () => {
            this.sonidoSalir.play();
            this.sound.resumeAll(); // Reanudar el sonido
            this.scene.resume(this.previousScene); // Reanudar la escena anterior
            this.scene.stop(); // Cerrar la escena de pausa
        });

        exitButton.on('pointerdown', () => {
            this.sound.stopAll(); // Detener todos los sonidos
            this.sonidoSalir.play();
            if (this.previousScene === 'TutorialScene' || this.previousScene === 'selectorNivel') {
                this.scene.stop(this.previousScene); // Cerrar la escena actual
                this.scene.stop('GUI');
                this.scene.start('MainMenu'); // Ir al menú principal
            } else { // Si estás en un nivel
                this.scene.stop(this.previousScene); // Cerrar la escena actual
                this.scene.start('selectorNivel'); // Ir al selector de niveles
            }

            this.scene.stop(); // Cerrar la escena de pausa
        });

        // Escuchar la tecla ESC para cerrar el menú de pausa
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update() {
        // Cerrar el menú de pausa al presionar ESC
        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.sound.resumeAll(); // Reanudar el sonido
            this.scene.resume(this.previousScene); // Reanudar la escena anterior
            this.scene.stop(); // Cerrar la escena de pausa
        }
    }


}