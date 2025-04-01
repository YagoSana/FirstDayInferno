import Phaser from 'phaser';

export default class PauseController {
    constructor(scene, config = {}) {
        this.scene = scene;

        this.config = config || {
            x: 1000 - 50,
            y: 50,
            scale: 1,
        };

        this.depth = 200;
        this.texture = 'boton_pausa';
        this.hoverTexture = 'boton_pausa_hover';
        
        this.isPaused = false;
        this.createButton();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Sincronizar estado con eventos reales
        this.scene.events.on('pause', () => this.isPaused = true);
        this.scene.events.on('resume', () => this.isPaused = false);
        
        // Limpiar al destruir
        this.scene.events.on('destroy', () => {
            this.scene.events.off('pause');
            this.scene.events.off('resume');
        });
    }

    createButton() {
        // Crear botón de pausa
        this.button = this.scene.add.sprite(
            this.config.x,
            this.config.y,
            this.texture
        )
        .setScrollFactor(0)
        .setDepth(this.depth)
        .setScale(this.config.scale)
        .setInteractive();

        // Efectos hover
        this.button.on('pointerover', () => {
            this.button.setTexture(this.hoverTexture);
            this.button.setScale(this.config.scale * 1.1);
        });

        this.button.on('pointerout', () => {
            this.button.setTexture(this.texture);
            this.button.setScale(this.config.scale);
        });

        // Acción al hacer click
        this.button.on('pointerdown', () => {
            this.togglePause();
        });
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
        this.scene.scene.launch('PauseMenu', {
            previousScene: this.scene.scene.key
        });
        this.scene.scene.bringToTop('PauseMenu');
        
        // Efecto visual
        this.playButtonAnimation(0.9);
    }

    resumeGame() {
        this.scene.scene.resume();
        this.scene.scene.stop('PauseMenu');        
        // Efecto visual
        this.playButtonAnimation(1.2);
    }

    playButtonAnimation(scaleFactor) {
        this.scene.tweens.add({
            targets: this.button,
            scale: this.config.scale * scaleFactor,
            duration: 100,
            yoyo: true
        });
    }

    destroy() {
        this.button.destroy();
    }
}