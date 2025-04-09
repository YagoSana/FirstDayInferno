import Phaser from "phaser";
import UIController from "../controller/UIController";

export default class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'gameOver' });
    }

    init(data) {
        this.deathData = data.deathData || { type: 'unknown', source: null };
    }

    create() {
        this.sound.stopAll();
        this.music = this.sound.add('musicaGameOver', { volume: 0.7, loop: false });
        // Fondo oscuro semi-transparente
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.8)
            .setOrigin(0, 0);

        // Texto principal GAME OVER
        this.add.text(
            this.cameras.main.centerX,
            75,
            'GAME OVER',
            {
                fontSize: '100px',
                color: '#ff0000',
                fontFamily: 'monogram',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5).setResolution(2);

        // Contenido de la muerte (imagen + texto)
        this.showDeathCause();

        this.createButtons();

        this.uiController = new UIController(this, {
            position: {
                pause: { x: this.sys.game.config.width + 210, y: this.sys.game.config.height - 450 }, 
                mute: { x: this.sys.game.config.width - 50, y: this.sys.game.config.height - 510 },
                fullscreen: { x: this.sys.game.config.width - 50, y: this.sys.game.config.height - 50 }
            },
            scale: 2
        });
        this.music.play();
    }

    showDeathCause() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY - 50;

        // Determinar texto e imagen según tipo de muerte
        let deathText = '';
        let enemyImage = '';

        switch (this.deathData.type) {
            case 'fire':
                deathText = '¡Has sido quemado por el fuego!';
                enemyImage = 'fire_death';
                break;
            case 'enemy':
                if (this.deathData.source) {
                    const enemyType = this.deathData.source;
                    deathText = this.getEnemyDeathText(enemyType);
                    enemyImage = this.getEnemyDeathImage(enemyType);
                } else {
                    deathText = '¡Un enemigo te ha derrotado!';
                    enemyImage = 'default_death';
                }
                break;
            default:
                deathText = '¡Has sido derrotado!';
                enemyImage = 'default_death';
        }

        // Mostrar texto de causa de muerte
        this.add.text(centerX, centerY - 100, deathText,
            {
                fontSize: '42px',
                color: '#ffffff',
                fontFamily: 'monogram',
                align: 'center',
                wordWrap: { width: 800 }
            }
        ).setOrigin(0.5).setResolution(2);

        // Mostrar imagen del enemigo/fuego (100x100px centrada)
        if (this.textures.exists(enemyImage)) {
            this.add.image(centerX, centerY+40, enemyImage)
                .setDisplaySize(100, 100) // Asegura tamaño 100x100
                .setOrigin(0.5)
                .setScale(2);
        }
    }

    createButtons() {
        const centerX = this.cameras.main.centerX;
        const buttonY = this.cameras.main.height - 150;

        // Sonidos para los botones
        this.sonidoHover = this.sound.add('buttonHover');
        this.sonidoClick = this.sound.add('startgame');

        // Botón "Selector de Niveles"
        const buttonLevels = this.add.image(centerX - 150, buttonY + 30, 'button')
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });

        this.add.text(centerX - 150, buttonY +20, "Niveles",
            {
                fontSize: '48px',
                fontFamily: 'monogram',
                color: '#ffffff'
            }
        ).setOrigin(0.5).setResolution(2);

        buttonLevels.on('pointerover', () => {
            buttonLevels.setTexture('button_hover');
            this.sonidoHover.play();
        });

        buttonLevels.on('pointerdown', () => {
            this.sonidoClick.play();    
            this.scene.start('selectorNivel',{game_over:true});
        });

        buttonLevels.on('pointerout', () => {
            buttonLevels.setTexture('button');
        });

        // Botón "Menú Principal"
        const buttonMenu = this.add.image(centerX + 150, buttonY + 30, 'button')
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });

        this.add.text(centerX + 150, buttonY + 20, "Salir",
            {
                fontSize: '48px',
                fontFamily: 'monogram',
                color: '#ffffff'
            }
        ).setOrigin(0.5).setResolution(2);

        buttonMenu.on('pointerover', () => {
            buttonMenu.setTexture('button_hover');
            this.sonidoHover.play();
        });

        buttonMenu.on('pointerdown', () => {
            this.sonidoClick.play();
            this.scene.start('MainMenu');
        });

        buttonMenu.on('pointerout', () => {
            buttonMenu.setTexture('button');
        });
    }

    getEnemyDeathText(enemyType) {
        const texts = {
            'cucaracha': '¡Una cucaracha gigante te ha aplastado!',
            'nand': '¡Nand te ha superado en inteligencia!',
            'nerd': '¡El poder nerd te ha derrotado!',
            'zombie': '¡Un zombie te ha convertido en uno de ellos!',
            'turret': '¡La torreta te ha alcanzado!',
            'cat': 'Xdxdxdxdxxdxddxxddddx',
        };
        return texts[enemyType] || '¡Un enemigo te ha derrotado!';
    }

    getEnemyDeathImage(enemyType) {
        return `${enemyType}_death` || 'default_death';
    }
}