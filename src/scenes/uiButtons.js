import Phaser from 'phaser';
import SelectorNivel from './selectorNivel';

export default class UIButtons extends Phaser.Scene {
    constructor() {
        super({ key: 'UIButtons' });
    }

    init(config) {
        // Configuración por defecto
        this.defaultConfig = {
            position: {
                pause: { x: 950, y: 50 },
                mute: { x: 870, y: 50 },
                fullscreen: { x: 950, y: 500 }
            },
            scale: 1.6,
            canPause: true,
        };

        // Combinar configuración
        this.config = { ...this.defaultConfig, ...config };
        this.scale = this.config.scale || 1.6;
        this.canPause = this.config.canPause;
        this.previousScene = null;
        this.managerKey = null;

        // Inicializar estado desde el registro
        if (!this.registry.has('isMuted')) {
            this.registry.set('isMuted', false);
        }
        if (!this.registry.has('isFullscreen')) {
            this.registry.set('isFullscreen', false);
        }

        this.isMuted = this.registry.get('isMuted');
        this.isFullscreen = this.registry.get('isFullscreen');
        this.isMapShowed = this.registry.get('isMapShowed');
        this.canMap = false;
    }

    create() {
        this.sonidoHover = this.sound.add('buttonHover');
        // Crear botones
        this.createMuteButton();
        this.createFullscreenButton();

        if (this.canPause) {
            this.createPauseButton();
        }

        // this.setupKeyboardControls();
    }

    createPauseButton() {
        this.pauseButton = this.add.sprite(
            this.config.position.pause.x,
            this.config.position.pause.y,
            'boton_pausa'
        )
            .setScrollFactor(0)
            .setDepth(200)
            .setScale(this.scale)
            .setInteractive({ useHandCursor: true, pixelPerfect: true });

        this.setupButton(this.pauseButton, 'boton_pausa', 'boton_pausa_hover', () => {
            this.togglePause();
        });
    }

    createMuteButton() {
        let texture = this.isMuted ? 'boton_sonido' : 'boton_mute';
        let hoverTexture = this.isMuted ? 'boton_sonido_hover' : 'boton_mute_hover';

        this.muteButton = this.add.sprite(
            this.config.position.mute.x,
            this.config.position.mute.y,
            texture
        )
            .setScrollFactor(0)
            .setDepth(200)
            .setScale(this.scale)
            .setInteractive({ useHandCursor: true, pixelPerfect: true });

        // Guardar referencias de textura
        this.muteButton.normalTexture = texture;
        this.muteButton.hoverTexture = hoverTexture;

        this.setupButton(this.muteButton, texture, hoverTexture, () => {
            this.toggleMute();
        });
    }

    createFullscreenButton() {
        let texture = this.isFullscreen ? 'boton_fullscreen_not' : 'boton_fullscreen';

        this.fullscreenButton = this.add.sprite(
            this.config.position.fullscreen.x,
            this.config.position.fullscreen.y,
            texture
        )
            .setScrollFactor(0)
            .setDepth(200)
            .setScale(this.scale)
            .setInteractive({ useHandCursor: true });

        // Guardar referencias de textura
        this.fullscreenButton.normalTexture = texture;
        this.fullscreenButton.hoverTexture = texture;

        this.setupButton(this.fullscreenButton, texture, texture, () => {
            this.toggleFullscreen();
        });
    }

    setupButton(button, normalTex, hoverTex, callback) {
        button.on('pointerover', () => {
            button.setTexture(hoverTex);
            button.setScale(this.scale * 1.1);
            this.sonidoHover.play();
        });

        button.on('pointerout', () => {
            button.setTexture(normalTex);
            button.setScale(this.scale);
        });

        button.on('pointerdown', () => {
            callback();
            this.playButtonAnimation(button);
        });
    }

    setupKeyboardControls() {
        // Limpiar eventos anteriores si existen
        if (this.escKey) this.escKey.removeAllListeners();
        if (this.muteKey) this.muteKey.removeAllListeners();
        if (this.fullScreenKey) this.fullScreenKey.removeAllListeners();
        if (this.mapKey) this.mapKey.removeAllListeners();


        // Configurar teclas
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.muteKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
        this.fullScreenKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
        this.mapKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

        // Asignar eventos
        if (this.canPause) {
            this.escKey.on('down', () => {
                this.togglePause();
                this.playButtonAnimation(this.pauseButton);
            });
        }

        this.muteKey.on('down', () => {
            this.toggleMute();
            this.playButtonAnimation(this.muteButton);
        });

        this.fullScreenKey.on('down', () => {
            this.toggleFullscreen();
            this.playButtonAnimation(this.fullscreenButton);
        });

        // Abrir mapa al presionar M
        // console.log( "SETEO DE TECLAS M: ",this.managerKey);
        this.mapKey.on('down', () => {
            this.toggleMap(this.managerKey);
        });

    }


    toggleMute() {
        this.isMuted = !this.isMuted;
        this.registry.set('isMuted', this.isMuted);
        this.sound.setMute(this.isMuted);

        // Actualizar texturas
        let newNormal = this.isMuted ? 'boton_sonido' : 'boton_mute';
        let newHover = this.isMuted ? 'boton_sonido_hover' : 'boton_mute_hover';


        this.muteButton.normalTexture = newNormal;
        this.muteButton.hoverTexture = newHover;

        this.muteButton.setTexture(this.isMuted ? 'boton_sonido' : 'boton_mute');

        this.setupButton(this.muteButton, newNormal, newHover, () => {
            this;
        });

        this.playButtonAnimation(this.muteButton);
    }

    toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen;
        this.registry.set('isFullscreen', this.isFullscreen);

        // Actualizar texturas
        let newTexture = this.isFullscreen ? 'boton_fullscreen_not' : 'boton_fullscreen';
        this.fullscreenButton.normalTexture = newTexture;
        this.fullscreenButton.hoverTexture = newTexture;

        this.fullscreenButton.setTexture(newTexture);

        this.setupButton(this.fullscreenButton, newTexture, newTexture, () => {
            this;
        });

        // Cambiar modo pantalla completa
        if (this.game.canvas.requestFullscreen) {
            this.isFullscreen
                ? this.game.canvas.requestFullscreen()
                : document.exitFullscreen();
        }
        this.playButtonAnimation(this.fullscreenButton);
    }

    togglePause() {
        if (this.scene.isPaused(this.previousScene)) {
            this.resumeGame();
        } else {
            this.pauseGame();
        }
        this.playButtonAnimation(this.pauseButton);
    }

    pauseGame() {
        this.scene.pause(this.previousScene);
        this.scene.pause('GUI');

        this.scene.launch('PauseMenu', {
            previousScene: this.previousScene
        });
        this.sound.pauseAll();
        this.scene.bringToTop('PauseMenu');
        this.scene.bringToTop('UIButtons');
    }

    resumeGame() {
        this.scene.resume(this.previousScene);
        // Reanudar escena GUI si existe
        this.scene.stop('PauseMenu');
        this.scene.resume('GUI');
        this.sound.resumeAll();
    }

    toggleMap(claveManager) {
        if(this.canMap){
          
            // console.log('toggleMap', this.scene.isPaused(this.previousScene));
            // console.log("SE MUESTRA EL MAPA?",this.isMapShowed);
            if (this.scene.isActive("MapMenu")) {
                this.quitMap();
            } else {
                this.showMap(claveManager);
            }
        }
    }

    showMap(claveManager) {
        // this.scene.pause(this.previousScene);
        // this.scene.pause('GUI');
        if (this.previousScene !== 'selectorNivel') {
            this.scene.launch('MapMenu', {
                previousScene: this.previousScene,
                claveMapa: claveManager
            });
            this.scene.bringToTop('MapMenu');
            this.scene.bringToTop('UIButtons');
        }
    }

    quitMap() {
        // this.scene.resume(this.previousScene);
        // this.scene.resume('GUI');
        this.scene.stop('MapMenu');
    }


    updateScene(key, managerKey) {
        this.previousScene = key;
        this.managerKey = managerKey;

        this.canMap = this.managerKey ? true : false;
        this.canMap = this.managerKey !== "tutorialManager" 

        // console.log("La escena: ", key, managerKey,this.canMap);
    }

    playButtonAnimation(button) {
        this.sonidoHover.play();
        this.tweens.add({
            targets: button,
            scale: this.scale * 1.2,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                button.scale = this.scale * 1.1;
            }
        });
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.scale = this.config.scale || 1.6;

        // Actualizar estado de pausa
        let previousCanPause = this.canPause;
        this.canPause = this.config.canPause;

        // console.log("SE PUEDE PAUSAR? :", this.canPause);

        // Manejar cambios en el botón de pausa
        if (this.canPause && !this.pauseButton) {
            this.createPauseButton();
        } else if (!this.canPause && this.pauseButton) {
            this.pauseButton.destroy();
            this.pauseButton = null;
        }

        // Actualizar botones existentes
        if (this.muteButton) {
            this.muteButton.setPosition(this.config.position.mute.x, this.config.position.mute.y);
            this.muteButton.setScale(this.scale);
        }

        if (this.fullscreenButton) {
            this.fullscreenButton.setPosition(this.config.position.fullscreen.x, this.config.position.fullscreen.y);
            this.fullscreenButton.setScale(this.scale);
        }

        if (this.pauseButton) {
            this.pauseButton.setPosition(this.config.position.pause.x, this.config.position.pause.y);
            this.pauseButton.setScale(this.scale);
        }

        this.setupKeyboardControls();
    }

}