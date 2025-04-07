import Phaser from 'phaser';

export default class UIController {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.buttons = {};
        this.defaultConfig = {
            position: {
                pause: { x: 1000, y: 50 },
                mute: { x: 950, y: 50 },
                fullscreen: { x: 900, y: 50 }
            },
            scale: 1
        };
        this.config = config || this.defaultConfig;
        this.depth = 200;

        console.log(this.config);

        // Inicializar el registro si no existe
        if (!this.scene.game.registry.has('isMuted')) {
            this.scene.game.registry.set('isMuted', false);
        }
        if (!this.scene.game.registry.has('isFullscreen')) {
            this.scene.game.registry.set('isFullscreen', false);
        }

        // Obtener estado actual
        this.isMuted = this.scene.game.registry.get('isMuted');
        this.isFullscreen = this.scene.game.registry.get('isFullscreen');

        this.createButtons();
    }

    createButtons() {
        // Botón de Pausa
        this.addButton('pause', 'boton_pausa', 'boton_pausa_hover', () => {
            this.togglePause();
        });

        // Botón de Mute
        this.addButton('mute', this.isMuted ? 'boton_sonido' : 'boton_mute', this.isMuted ? 'boton_sonido_hover' : 'boton_mute_hover', () => {
            this.toggleMute();
        });

        // Botón de Pantalla Completa
        this.addButton('fullscreen', this.isFullscreen ? 'boton_fullscreen_not' : 'boton_fullscreen',
            'boton_fullscreen', () => {
                this.toggleFullscreen();
            });
    }

    addButton(key, texture, hoverTexture, callback) {
        const pos = this.config.position[key];

        this.buttons[key] = this.scene.add.sprite(pos.x, pos.y, texture)
            .setScrollFactor(0)
            .setDepth(this.depth)
            .setScale(this.config.scale)
            .setInteractive();

        this.buttons[key].on('pointerover', () => {
            let hoverTex = hoverTexture;

            if (key === 'fullscreen') {
                hoverTex = this.isFullscreen ? 'boton_fullscreen_not' : 'boton_fullscreen';
            }

            if (key === 'mute') {
                hoverTex = this.isMuted ? 'boton_sonido_hover' : 'boton_mute_hover';
            }

            this.buttons[key].setTexture(hoverTex);
            this.buttons[key].setScale(this.config.scale * 1.1);
        });

        this.buttons[key].on('pointerout', () => {
            let normalTex = texture;

            if (key === 'fullscreen') {
                normalTex = this.isFullscreen ? 'boton_fullscreen_not' : 'boton_fullscreen';
            }

            if (key === 'mute') {
                normalTex = this.isMuted ? 'boton_sonido' : 'boton_mute';
            }

            this.buttons[key].setTexture(normalTex);
            this.buttons[key].setScale(this.config.scale);
        });

        this.buttons[key].on('pointerdown', callback);
    }

    togglePause() {
        if (this.scene.scene.isPaused()) {
            this.resumeGame();
        } else {
            this.pauseGame();
        }
    }

    pauseGame() {
        this.scene.scene.pause();
        this.scene.scene.pause('GUI');

        this.scene.scene.launch('PauseMenu', {
            previousScene: this.scene.scene.key
        });
        this.scene.scene.bringToTop('PauseMenu');

        // Efecto visual
        this.playButtonAnimation('pause');
    }

    resumeGame() {
        this.scene.scene.resume();
        // Reanudar escena GUI si existe
        this.scene.scene.stop('PauseMenu');
        // Efecto visual
        this.playButtonAnimation('pause');
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.scene.game.registry.set('isMuted', this.isMuted);
        this.scene.sound.setMute(this.isMuted);

        // Cambiar la textura actual, los hover ya se controlan con el estado
        this.buttons.mute.setTexture(this.isMuted ? 'boton_sonido' : 'boton_mute');

        this.playButtonAnimation('mute');
    }

    toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen;
        this.scene.game.registry.set('isFullscreen', this.isFullscreen);


        // Cambiar texturas del botón fullscreen
        this.buttons.fullscreen.setTexture(this.isFullscreen ? 'boton_fullscreen_not' : 'boton_fullscreen');

        // Actualizar hover
        this.buttons.fullscreen.on('pointerout', () => {
            this.buttons.fullscreen.setTexture(this.isFullscreen ? 'boton_fullscreen_not' : 'boton_fullscreen');
        });

        if (this.scene.game.canvas.requestFullscreen) {
            this.isFullscreen
                ? this.scene.game.canvas.requestFullscreen()
                : document.exitFullscreen();
        }
        this.playButtonAnimation('fullscreen');
    }

    playButtonAnimation(buttonKey) {
        this.scene.tweens.add({
            targets: this.buttons[buttonKey],
            scale: this.config.scale * 1.2,
            duration: 100,
            yoyo: true
        });
    }

    destroy() {
        Object.values(this.buttons).forEach(button => button.destroy());
    }
}