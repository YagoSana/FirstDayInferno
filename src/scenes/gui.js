import Phaser from 'phaser';

export default class GUI extends Phaser.Scene {
    constructor() {
        super({ key: 'GUI' });
    }

    create(playerStats) {
        // Almacenar stats del jugador
        this.playerStats = playerStats;
        this.hearts = [];
        this.isPlayerHurt = false;
        this.itemKey = playerStats.equippedItem;


        // Configuración de posición
        this.depth = 200;
        this.margin = 20;
        this.gui_scale = 3;

        this.textConfig = {
            fontSize: '36px',
            color: '#ffffff',
            fontFamily: 'monogram'
        };

        // Crear marco de estado (background primero)
        this.statusBg = this.add.sprite(this.margin, this.margin, 'status_frame_background')
            .setOrigin(0)
            .setScrollFactor(0)
            .setDepth(this.depth + 1)
            .setTint(0x181425)
            .setScale(this.gui_scale);

        // Estado del player
        this.playerFrame = this.add.sprite(this.margin + 10, this.margin + 10, 'gui_player_idle')
            .setOrigin(0)
            .setScrollFactor(0)
            .setDepth(this.depth + 2)
            .setScale(2.43);
            

        if (this.itemKey) {
            this.playerFrame.play(`gui_${this.itemKey}_idle`);
        } else {
            this.playerFrame.play('gui_player_idle');
        }

        // Marco de estado principal
        this.statusFrame = this.add.sprite(this.margin, this.margin, 'status_frame')
            .setOrigin(0)
            .setScrollFactor(0)
            .setDepth(this.depth + 3)
            .setScale(this.gui_scale)
            .setAlpha(1);

        // Panel de stats del jugador (a la derecha del status frame)
        this.statsPanel = this.add.sprite(this.statusFrame.width * this.gui_scale + this.margin, this.margin, 'player_stats_gui')
            .setOrigin(0)
            .setScrollFactor(0)
            .setDepth(this.depth).setScale(this.gui_scale + 0.9, this.gui_scale)
            .setAlpha(1)
            .setAlpha(0.7);



        // Texto de estadísticas (en el panel de stats)
        this.createHearts(this.statsPanel);
        this.createCoins(this.statsPanel);
        this.createKeys(this.statsPanel);
        this.setupEventListeners();

        // Inicializar con valores actuales
        this.updateHearts(this.playerStats.health, this.playerStats.maxHealth);
        this.updateStats();
    }

    createHearts(statsPanel) {
        const heart_margin = 24;
        const heartSpacing = 22;
        const heartStartX = this.statsPanel.x + heart_margin;
        const heartStartY = this.statsPanel.y + heart_margin;

        this.hearts.forEach(h => h.destroy());
        this.hearts = [];

        for (let i = 0; i < this.playerStats.maxHealth; i++) {
            let heart = this.add.sprite(heartStartX + (i * heartSpacing), heartStartY,
                'gui_heart' // Textura normal
            )
                .setScrollFactor(0)
                .setDepth(this.depth + 1)
                .setScale(0.65);

            this.hearts.push(heart);
        }
    }

    createCoins(statsPanel) {
        const coin_margin = 30;
        const coinSpacing = 22;
        const coinStartX = this.statsPanel.x + coin_margin;
        const coinStartY = this.statsPanel.y + coin_margin + 42;

        let coin = this.add.sprite(coinStartX, coinStartY, 'coin-idle')
            .setScrollFactor(0)
            .setDepth(this.depth + 1)
            .setScale(0.8)
            .play('coin-idle')
            .stop();

        // Texto de monedas
        this.coinText = this.add.text(coin.x + 20, coinStartY - 16, this.playerStats.coins.toString(), this.textConfig)
            .setScrollFactor(0).setDepth(this.depth + 1).setResolution(2);
    }

    createKeys(statsPanel) {
        const key_margin = 105;
        const keySpacing = 22;
        const keyStartX = this.statsPanel.x + key_margin;
        const keyStartY = this.statsPanel.y + 72;

        let key = this.add.sprite(keyStartX, keyStartY, 'key-idle')
            .setScrollFactor(0)
            .setDepth(this.depth + 1)
            .setScale(0.8)
            .play('key-idle')
            .stop();

        // Texto de monedas
        this.keyText = this.add.text(key.x + 20, keyStartY - 16, this.playerStats.keys.toString(), this.textConfig)
            .setScrollFactor(0).setDepth(this.depth + 1).setResolution(2);
    }

    setupEventListeners() {
        this.game.events.on('healthChanged', ({ health, maxHealth }) => {
            // Si maxHealth cambió, recrear los corazones
            if (maxHealth && maxHealth !== this.playerStats.maxHealth) {
                this.playerStats.maxHealth = maxHealth;
                this.createHearts();
            }
            this.updateHearts(health, maxHealth || this.playerStats.maxHealth);
        });

        this.game.events.on('coinChanged', (coins) => {
            this.coinText.setText(coins);
        });

        this.game.events.on('keyChanged', (keys) => {
            this.keyText.setText(keys);
        });

        this.game.events.on('playerState', ({ item, state }) => {
            this.updatePlayerState(item, state);
        });


    }

    updatePlayerState(item, state) {

        if (this.isPlayerHurt) return; // Evitar superposición

        if (state === 'hurt') {
            this.isPlayerHurt = true;
            if (item) {
                this.playerFrame.play(`gui_${item}_hurt`);
            } else {
                this.playerFrame.play('gui_player_hurt');
            }

            // 2. Efecto de tint rojo en el fondo
            this.tweens.add({
                targets: this.statusBg,
                tint: 0xff0000,
                duration: 100,
                yoyo: true,
                repeat: 2, // Parpadeo 3 veces (inicial + 2 repeticiones)
                onComplete: () => {
                    this.statusBg.setTint(0x181425); // Restaurar color original
                }
            });

            // 3. Volver a animación normal después de 600ms (3 repeticiones a 2 fps)
            this.time.delayedCall(800, () => {

                if (item) {
                    this.playerFrame.play(`gui_${item}_idle`);
                } else {
                    this.playerFrame.play('gui_player_idle');
                }
                this.isPlayerHurt = false;
            });
        } else if (state === 'idle') {
            console.log(item);
            console.log(this.playerFrame);

            if (item) {
                this.playerFrame.play(`gui_${item}_idle`);
            } else {
                this.playerFrame.play('gui_player_idle');
            }
        }

    }

    updateHearts(health, maxHealth) {
        // Asegurarse de tener suficientes corazones
        while (this.hearts.length < maxHealth) {
            this.createHearts(); // Recargar corazones si no hay suficientes
        }

        // Actualizar cada corazón
        for (let i = 0; i < this.hearts.length; i++) {
            if (i < maxHealth) {
                this.hearts[i].setVisible(true);
                this.hearts[i].setTexture(i < health ? 'gui_heart' : 'gui_heart_empty');
            } else {
                this.hearts[i].setVisible(false);
            }
        }
    }

    updateStats() {
        // Actualizar cualquier otra estadística aquí
    }

    shutdown() {
        this.game.events.off('healthChanged');
        this.game.events.off('coinChanged');
    }
}