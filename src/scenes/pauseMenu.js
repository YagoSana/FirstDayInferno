import Phaser from 'phaser';

export default class PauseMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseMenu' });
        this.selectedButton = 0;
        this.buttons = [];
    }

    create(data) {
        this.cleanupButtons();
        this.scale = 0.7;
        this.previousScene = data.previousScene; // Guardar el nombre de la escena anterior
        console.log(`Escena actual: ${this.scene.key}`);
        this.sonidoHover = this.sound.add('buttonHover');
        this.sonidoSalir = this.sound.add('salirPausa');
        this.sound.pauseAll();
        //Configuracion del texto

        // Fondo semitransparente
        let background = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.5)
            .setOrigin(0, 0);

        let pause_bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'pause_bg')
            .setScale(this.scale + 0.5, this.scale + 0.7)
            .setAlpha(0.9);

        // Título
        this.add.text(this.cameras.main.width / 2, 150, 'PAUSA', {
            fontSize: '64px',
            color: '#c0cbdc',
            fontFamily: 'monogram',

        }).setOrigin(0.5);

        // Botones con estilo similar al main menu
        this.createCompleteButton('Reanudar', 0, () => this.resumeGame());
        this.createCompleteButton('Salir', 1, () => this.exitGame());

        // console.log(this.buttons);
        this.setupKeyboardControls();
        this.selectButton(0);
    }

    cleanupButtons() {
        // Destruir todos los botones existentes
        this.buttons.forEach(button => {
            if (button.bg) button.bg.destroy();
            if (button.text) button.text.destroy();
        });
        this.buttons = [];
        this.selectedButton = 0;

        // Limpiar otros elementos si existen
        if (this.background) this.background.destroy();
        if (this.title) this.title.destroy();
    }

    createCompleteButton(text, index, callback) {
        const xPos = this.cameras.main.width / 2;
        const yPos = 250 + (index * 125); // Más espacio entre botones verticales

        // Crear el fondo del botón
        const buttonBg = this.add.image(xPos, yPos, 'button')
            .setScale(this.scale)
            .setInteractive({ useHandCursor: true, pixelPerfect: true })
            .setDepth(1);

        // Crear el texto del botón
        const buttonText = this.add.text(xPos, yPos - 10, text, {
            fontSize: '48px',
            color: '#ffffff',
            fontFamily: 'monogram'
        }).setOrigin(0.5).setDepth(2);

        // Configurar eventos para el botón completo
        const buttonEvents = {
            pointerover: () => {
                this.selectButton(index);
                buttonBg.setTexture('button_hover').setScale(this.scale + 0.05);
                this.sonidoHover.play();
            },
            pointerout: () => {
                if (this.selectedButton !== index) {
                    buttonBg.setTexture('button').setScale(this.scale);
                    buttonText.setColor('#ffffff');
                }
            },
            pointerdown: () => {
                callback();
            }
        };

        buttonBg.on('pointerover', buttonEvents.pointerover);
        buttonBg.on('pointerout', buttonEvents.pointerout);
        buttonBg.on('pointerdown', buttonEvents.pointerdown);

        // Guardar referencias para la navegación por teclado
        this.buttons.push({
            bg: buttonBg,
            text: buttonText,
            callback: callback
        });
    }

    selectButton(index) {
        // Resetear todos los botones
        this.buttons.forEach((button) => {
            button.bg.setTexture('button').setScale(this.scale);
            button.text.setColor('#ffffff').setFontSize(48);
        });

        // Resaltar botón seleccionado
        const selected = this.buttons[index];
        selected.bg.setTexture('button_hover').setScale(this.scale + 0.05);
        selected.text.setColor('#FFF31B').setFontSize(52);

        this.sonidoHover.play();
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
            this.buttons[this.selectedButton].callback();
        }
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
        this.sound.stopAll();
        this.sonidoSalir.play();
        this.cleanupButtons();

        // Cerrar mapa si está abierto
        if (this.scene.isActive('MapMenu')) {
            this.scene.stop('MapMenu');
        }

        let uiButtons = this.scene.get('UIButtons');
            if(uiButtons){
                uiButtons.updateScene(this.previousScene, null);
            }

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

    shutdown() {
        this.cleanupButtons();
    }
}