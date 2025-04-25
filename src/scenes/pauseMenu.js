import Phaser from 'phaser';

export default class PauseMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseMenu' });
        this.selectedButton = 0;
        this.buttons = [];
    }

    create(data) {
        this.cleanupButtons();
        this.previousScene = data.previousScene; // Guardar el nombre de la escena anterior
        console.log(`Escena actual: ${this.scene.key}`);
        this.sonidoSalir = this.sound.add('salirPausa');
        this.sound.pauseAll();
        //Configuracion del texto
        let textConfig = {
            fontSize: '40px',
            color: '#ffffff',
            fontFamily: 'monogram'
        };

        // Fondo semitransparente
        let background = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.5)
            .setOrigin(0, 0);

        // Título
        this.add.text(this.cameras.main.width / 2, 150, 'PAUSA', {
            fontSize: '64px',
            color: '#ffffff',
            fontFamily: 'monogram'
        }).setOrigin(0.5);

        // Botones con estilo similar al main menu
        this.createButton('Reanudar', 0, () => this.resumeGame());
        this.createButton('Salir', 1, () => this.exitGame());

        // console.log(this.buttons);

        this.setupKeyboardControls();
    }

    cleanupButtons() {
        // Destruir todos los botones existentes
        this.buttons.forEach(button => {
            if (button) button.destroy();
        });
        this.buttons = [];
        this.selectedButton = 0;
        
        // Limpiar otros elementos si existen
        if (this.background) this.background.destroy();
        if (this.title) this.title.destroy();
    }

    createButton(text, index, callback) {
        let button = this.add.text(
            this.cameras.main.width / 2,
            300 + (index * 100),
            text,
            {
                fontSize: '48px',
                color: '#ffffff',
                fontFamily: 'monogram'
            }
        )
            .setOrigin(0.5)
            .setInteractive();

        button.on('pointerover', () => {
            this.selectButton(index);
        });

        button.on('pointerdown', callback);

        this.buttons.push(button);
    }

    selectButton(index) {
        // Resetear todos los botones
        this.buttons.forEach(button => {
            button.setColor('#ffffff');
            button.setScale(1);
        });

        // Resaltar botón seleccionado
        this.buttons[index].setColor('#ff0');
        this.buttons[index].setScale(1.1);

        this.selectedButton = index;
    }

    setupKeyboardControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update() {
        // Navegación con W/S
        if (Phaser.Input.Keyboard.JustDown(this.keyW) || Phaser.Input.Keyboard.JustDown(this.keyUp)) {
            this.selectButton(Math.max(0, this.selectedButton - 1));
        } else if (Phaser.Input.Keyboard.JustDown(this.keyS) || Phaser.Input.Keyboard.JustDown(this.keyDown)) {
            this.selectButton(Math.min(this.buttons.length - 1, this.selectedButton + 1));
        }

        // Confirmar con ENTER
        if (Phaser.Input.Keyboard.JustDown(this.keyEnter)) {
            this.buttons[this.selectedButton].emit('pointerdown');
        }
        // else if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {
        //     this.resumeGame();
        // }
    }

    resumeGame() {
        this.sonidoSalir.play();
        this.sound.resumeAll(); // Reanudar el sonido
        this.scene.resume(this.previousScene); // Reanudar la escena anterior
        this.scene.resume('GUI');
        this.cleanupButtons();
        this.scene.stop(); // Cerrar la escena de pausa
    }

    exitGame() {
        this.sonidoSalir.play();
        this.sound.stopAll();
        this.cleanupButtons();

        if (this.previousScene === 'selectorNivel') {
            this.scene.stop(this.previousScene);
            this.scene.stop('GUI');
            this.scene.start('MainMenu');
        } else {
            this.scene.stop(this.previousScene);
            this.scene.start('selectorNivel');
        }
        this.buttons = [];
        this.scene.stop();
    }

    destroy() {
        Object.values(this.buttons).forEach(button => button.destroy());
    }
}