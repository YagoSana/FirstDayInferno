import Phaser from 'phaser';

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
        //musica
        let bg = this.add.image(0, 0, 'background');
        bg.displayHeight = this.sys.game.config.height;
        bg.scaleX = bg.scaleY;
        bg.x = this.sys.game.config.width / 2;
        bg.y = this.sys.game.config.height / 2;
        bg.setTint(0xd1d1d1);

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



        // var title  = this.add.text(220, 80, "The Game");
        // title.setFontSize(60);
        // title.setFill('#fff');
        // title.setScrollFactor(0);
        // title.setFontFamily('monogram');

        let buttonPlay = this.add.image(300, 330, 'button');
        buttonPlay.setScale(0.8);
        buttonPlay.setInteractive({ useHandCursor: true });
        var buttonText = this.add.text(240, 300, "Jugar");
        buttonText.setFontSize(64);
        buttonText.setFontFamily('monogram')
        // buttonPlay.on('pointerover', () => { buttonPlay.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000); } );
        // buttonPlay.on('pointerdown',this.changeScene.bind(this, "selectorNivel"));
        // buttonPlay.on('pointerout',() => {buttonPlay.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);});
        buttonPlay.on('pointerover', () => { buttonPlay.setTexture('button_hover'); this.sonidoHover.play(); });
        buttonPlay.on('pointerdown', this.changeScene.bind(this, "selectorNivel"));
        buttonPlay.on('pointerout', () => { buttonPlay.setTexture('button'); });

        let buttonTutorial = this.add.image(700, 330, 'button');
        buttonTutorial.setScale(0.8);
        buttonTutorial.setInteractive({ useHandCursor: true });
        var buttonTutorialText = this.add.text(610, 300, "Tutorial");
        buttonTutorialText.setFontSize(64);
        buttonTutorialText.setFontFamily('monogram');

        // Asignar eventos al botón "Tutorial"
        buttonTutorial.on('pointerover', () => { buttonTutorial.setTexture('button_hover'); this.sonidoHover.play();});
        buttonTutorial.on('pointerdown', this.changeScene.bind(this, "selectorNivel"));
        buttonTutorial.on('pointerout', () => { buttonTutorial.setTexture('button'); });
    }

    changeScene(newScene) {
        this.sonidoEmpezar.play();
        if (this.musica) {
            this.musica.stop(); // o this.musica.pause();
        }
        this.scene.start(newScene, { globals: this.globals });
    }
}