import Phaser from 'phaser';
import UIController from '../controller/UIController';

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    init(datos) {
        this.globals = datos.globals
        console.log("init");
        console.log(datos.globals);
    }

    create() {
        //musica
        this.musica = this.sound.add('musicaMenu', {
            loop: true,   // Que se repita en bucle
            volume: 0.5   // Volumen (0 a 1)
        });
        this.sonidoHover = this.sound.add('buttonHover');
        this.sonidoEmpezar = this.sound.add('startgame');
        this.musica.play();
        this.scale = 0.9;
        //musica
        let bg = this.add.sprite(0, 0, 'Title_screen');
        bg.play('Title_screen');
        bg.displayHeight = this.sys.game.config.height;
        bg.scaleX = bg.scaleY;
        bg.x = this.sys.game.config.width / 2;
        bg.y = this.sys.game.config.height / 2;

        let midleX = bg.x;
        let midleY = bg.y;
        let title = this.add.sprite(this.sys.game.config.width / 2, 120, 'title');
        title.setScale(2.5);

        const fxTitle = title.postFX.addGlow(0xff6d05, 0, 0, false, 0.1, 10);

        this.tweens.add({
            targets: fxTitle,
            duration: 3000,
            outerStrength: 8,
            yoyo: true,
            loop: -1,
            ease: 'sine.inout'
        });

        let buttonPlay = this.add.image(midleX - 260, midleY + 170, 'button');
        buttonPlay.setScale(this.scale);
        buttonPlay.setInteractive({ useHandCursor: true });
        var buttonText = this.add.text(buttonPlay.x - 65, buttonPlay.y - 40, "Jugar");
        buttonText.setFontSize(72);
        buttonText.setFontFamily('monogram').setResolution(2);

        buttonPlay.on('pointerover', () => { buttonPlay.setTexture('button_hover').setScale(this.scale + 0.05); this.sonidoHover.play(); });
        buttonPlay.on('pointerdown', this.changeScene.bind(this, "selectorNivel"));
        buttonPlay.on('pointerout', () => { buttonPlay.setTexture('button').setScale(this.scale); });

        let buttonTutorial = this.add.image(midleX + 260, midleY + 170, 'button');
        buttonTutorial.setScale(this.scale);
        buttonTutorial.setInteractive({ useHandCursor: true });
        var buttonTutorialText = this.add.text(buttonTutorial.x - 100, buttonTutorial.y - 40, "Tutorial");
        buttonTutorialText.setFontSize(72);
        buttonTutorialText.setFontFamily('monogram').setResolution(2);

        // Asignar eventos al botón "Tutorial"
        buttonTutorial.on('pointerover', () => { buttonTutorial.setTexture('button_hover').setScale(this.scale + 0.05); this.sonidoHover.play(); });
        buttonTutorial.on('pointerdown', this.changeScene.bind(this, "tutorialManager"));
        buttonTutorial.on('pointerout', () => { buttonTutorial.setTexture('button').setScale(this.scale); });

        this.uiController = new UIController(this, {
            position: {
                pause: { x: this.sys.game.config.width + 210, y: this.sys.game.config.height - 450 }, // Posiciones personalizadas
                mute: { x: this.sys.game.config.width - 50, y: this.sys.game.config.height - 510 },
                fullscreen: { x: this.sys.game.config.width - 50, y: this.sys.game.config.height - 50 }
            },
            scale: 2
        });

        this.uiController.toggleMute();
    }

    changeScene(newScene) {
        this.sonidoEmpezar.play();
        if (this.musica) {
            this.musica.stop(); // o this.musica.pause();
        }
        this.scene.start(newScene, { globals: this.globals });
    }
}