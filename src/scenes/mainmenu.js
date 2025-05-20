import Phaser from 'phaser';

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
        this.selectedButton = 0;
        this.buttons = [];
    }

    init(datos) {
        this.globals = datos.globals
    }

    create() {
        this.sound.stopAll();
        this.scale = 0.8;
        this.cleanupButtons();
        // Configurar fondo y título
        this.setupBackground();
        this.setupTitle();
        // Inicializar música y sonidos
        this.initSounds();

        // Creación de botones unificados
        this.createCompleteButton('Jugar', 0, () => this.changeScene("selectorNivel"));
        this.createCompleteButton('Tutorial', 1, () => this.changeScene("tutorialManager"));
        
        // console.log(this.buttons);

        // Configurar controles de teclado
        this.setupKeyboardControls();

        // Configurar UI
        this.setupUI();

        this.selectButton(1);
    }

    cleanupButtons() {
        // Destruir todos los botones existentes
        this.buttons.forEach(button => {
            if (button.bg) button.bg.destroy();
            if (button.text) button.text.destroy();
        });
        this.buttons = [];
        this.selectedButton = 0;
    }

    initSounds() {
        // Detener música anterior si existe
        if (this.musica) {
            this.musica.stop();
        }

        this.musica = this.sound.add('musicaMenu', {
            loop: true,
            volume: 0.5
        });
        this.sonidoHover = this.sound.add('buttonHover');
        this.sonidoEmpezar = this.sound.add('startgame');
        this.musica.play();
    }

    setupBackground() {
        this.bg = this.add.sprite(0, 0, 'Title_screen');
        this.bg.play('Title_screen');
        this.bg.displayHeight = this.sys.game.config.height;
        this.bg.scaleX = this.bg.scaleY;
        this.bg.x = this.sys.game.config.width / 2;
        this.bg.y = this.sys.game.config.height / 2;
    }

    setupTitle() {
        this.title = this.add.sprite(this.sys.game.config.width / 2, 120, 'title');
        this.title.setScale(2.5);

        let fxTitle = this.title.postFX.addGlow(0xff6d05, 0, 0, false, 0.1, 10);

        this.tweens.add({
            targets: fxTitle,
            duration: 3000,
            outerStrength: 8,
            yoyo: true,
            loop: -1,
            ease: 'sine.inout'
        });
    }

    createCompleteButton(text, index, callback) {
        let midleX = this.cameras.main.width / 2;
        let midleY = this.cameras.main.height / 2;
        let xPos = midleX - 260 + (index * 520);
        let yPos = midleY + 170;
        // console.log(xPos,yPos);

        // Crear el fondo del botón
        let buttonBg = this.add.image(xPos, yPos, 'button')
            .setScale(this.scale)
            .setInteractive({ useHandCursor: true, pixelPerfect: true });

        // Crear el texto del botón
        let buttonText = this.add.text(xPos, yPos - 10, text, {
            fontSize: '68px',
            color: '#ffffff',
            fontFamily: 'monogram'
        }).setOrigin(0.5);

        // Configurar eventos para el botón completo
        let buttonEvents = {
            pointerover: () => {
                this.selectButton(index);
                buttonBg.setTexture('button_hover').setScale(this.scale + 0.05);
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
            button.text.setColor('#ffffff').setFontSize(64);
        });

        // Resaltar botón seleccionado
        let selected = this.buttons[index];
        selected.bg.setTexture('button_hover').setScale(this.scale + 0.05);
        selected.text.setColor('#FFF31B').setFontSize(70);

        this.sonidoHover.play();
        this.selectedButton = index;
    }

    update() {
        // Navegación con A/D
        if (Phaser.Input.Keyboard.JustDown(this.keyA) || Phaser.Input.Keyboard.JustDown(this.keyLeft)) {
            this.selectButton(Math.max(0, this.selectedButton - 1));
        } else if (Phaser.Input.Keyboard.JustDown(this.keyD) || Phaser.Input.Keyboard.JustDown(this.keyRight)) {
            this.selectButton(Math.min(this.buttons.length - 1, this.selectedButton + 1));
        }

        // Confirmar con ENTER
        if (Phaser.Input.Keyboard.JustDown(this.keyEnter)) {
            this.buttons[this.selectedButton].callback();
        }
    }

    changeScene(newScene) {
        this.sonidoEmpezar.play();
        if (this.musica) {
            this.musica.stop(); // o this.musica.pause();
        }
        this.cleanupButtons();
        this.scene.start(newScene, { globals: this.globals });
    }

    shutdown() {
        // Limpieza adicional cuando la escena se apaga
        this.cleanupButtons();
        if (this.musica) {
            this.musica.stop();
        }
    }

    setupKeyboardControls() {
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    setupUI() {
        let uiButtonsScene = this.scene.get('UIButtons');
        if (uiButtonsScene) {
            uiButtonsScene.updateConfig({
                position: {
                    pause: { x: this.sys.game.config.width - 210, y: this.sys.game.config.height - 512 },
                    mute: { x: this.sys.game.config.width - 50, y: this.sys.game.config.height - 512 },
                    fullscreen: { x: this.sys.game.config.width - 50, y: this.sys.game.config.height - 50 }
                },
                scale: 2,
                canPause: false

            });
            this.scene.bringToTop('UIButtons');
        }
    }
}