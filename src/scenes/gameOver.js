import Phaser from "phaser";

export default class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'gameOver' });
        this.selectedButton = 0;
        this.buttons = [];
    }

    init(data) {
        this.deathData = data.deathData || { type: 'unknown', source: null };
    }

    create() {
        this.cleanupButtons();
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
        this.setupKeyboardControls();

        this.music.play();

        this.selectButton(0);
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
            this.add.image(centerX, centerY + 40, enemyImage)
                .setDisplaySize(100, 100) // Asegura tamaño 100x100
                .setOrigin(0.5)
                .setScale(2);
        }
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

    createButtons() {
        const centerX = this.cameras.main.centerX;
        const buttonY = this.cameras.main.height - 150;
        this.scale = 0.7;

        // Sonidos para los botones
        this.sonidoHover = this.sound.add('buttonHover');
        this.sonidoClick = this.sound.add('startgame');

        // Botón "Selector de Niveles"
        const buttonLevels = this.add.image(centerX - 150, buttonY + 30, 'button')
            .setScale(this.scale)
            .setInteractive({ useHandCursor: true });

        const buttonLevelsText = this.add.text(centerX - 150, buttonY + 20, "Niveles",
            {
                fontSize: '48px',
                fontFamily: 'monogram',
                color: '#ffffff'
            }
        ).setOrigin(0.5).setResolution(2);

        // Botón "Menú Principal"
        const buttonMenu = this.add.image(centerX + 150, buttonY + 30, 'button')
            .setScale(this.scale)
            .setInteractive({ useHandCursor: true });

        const buttonMenuText = this.add.text(centerX + 150, buttonY + 20, "Salir",
            {
                fontSize: '48px',
                fontFamily: 'monogram',
                color: '#ffffff'
            }
        ).setOrigin(0.5).setResolution(2);

        // Configurar botones para navegación por teclado
        this.buttons.push({
            bg: buttonLevels,
            text: buttonLevelsText,
            callback: () => {
                this.sonidoClick.play();
                this.scene.start('selectorNivel', { game_over: true });
            }
        });

        this.buttons.push({
            bg: buttonMenu,
            text: buttonMenuText,
            callback: () => {
                this.sonidoClick.play();
                this.scene.start('MainMenu');
            }
        });

        // Configurar eventos para ambos botones
        this.buttons.forEach((button, index) => {
            button.bg.on('pointerover', () => {
                this.selectButton(index);
                button.bg.setTexture('button_hover');
            });

            button.bg.on('pointerout', () => {
                if (this.selectedButton !== index) {
                    button.bg.setTexture('button');
                }
            });

            button.bg.on('pointerdown', button.callback);
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
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update() {
        // Navegación con A/D o flechas
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

    getEnemyDeathText(enemyType) {
        const texts = {
            'cucaracha': '¡Una cucaracha gigante te ha aplastado!',
            'nand': '¡Nand te ha superado en inteligencia!',
            'nerd': '¡El poder nerd te ha derrotado!',
            'zombie': '¡Un zombie te ha convertido en uno de ellos!',
            'turret': '¡La torreta te ha alcanzado!',
            'cat': 'Xdxdxdxdxxdxddxxddddx',
            'bossMedicina': 'Tu hora ha llegado antes de lo previsto',
            'printer': 'No se puede imprimir a color, me falta tinta',
            'skeleton': 'Con tu física y tu química, y tambien tu anatomía ...',
            'server': 'Paso 1: instala Eduroam, Paso 2: muere',
            'fisica': 'No se que diría uno de fisica ... Bazinga',
            'phantom': 'Tío, yo antes molaba. Ahora soy un balón ...',
        };
        return texts[enemyType] || '¡Un enemigo te ha derrotado!';
    }

    getEnemyDeathImage(enemyType) {
        return `${enemyType}_death` || 'default_death';
    }

    shutdown() {
        // Limpiar botones al cerrar la escena
        this.buttons.forEach(button => {
            button.bg.destroy();
            button.text.destroy();
        });
        this.buttons = [];
    }
}