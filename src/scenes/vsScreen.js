import Phaser from 'phaser';

export default class VSScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'VSScreen' });
    }

    init(data) {
        console.log('ENTRANDO A LA PANTALLA VS', data);
        this.bossKey = data.bossKey || 'bossMedicina';
        this.nextScene = data.nextScene;
        this.playerStats = data.playerStats;
        this.transitionData = data.transitionData; // Datos de transición
    }

    create() {
        this.scene.stop('GUI')
        // Configuración básica
        this.cameras.main.fadeIn(500, 0, 0, 0);

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Fondo oscuro
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000)
            .setOrigin(0, 0)
            .setDepth(0);

        // Configurar posición de los elementos
        const playerX = centerX - 270;
        const bossX = centerX + 280;
        const imagesY = centerY - 50;
        const textY = centerY + 180;

        // Imagen del jugador (izquierda)
        this.playerImage = this.add.image(playerX, imagesY + 50, 'vs_player')
            .setScale(4.3)
            .setAlpha(0)
            .setDepth(1);

        // Texto del jugador
        this.playerText = this.add.text(playerX, textY, 'PLAYER', {
            fontSize: '64px',
            fontFamily: 'monogram',
            color: '#0000FF', // Verde brillante
            stroke: '#0000FF',
            strokeThickness: 2
        }).setOrigin(0.5).setAlpha(0).setDepth(1).setResolution(2);

        // Imagen VS (centro)
        this.vsImage = this.add.image(centerX - 20, imagesY + 50, 'vs_text')
            .setScale(2)
            .setAlpha(0)
            .setDepth(1);

        // Imagen del boss (derecha)
        this.bossImage = this.add.image(bossX, imagesY, `vs_${this.bossKey}`)
            .setScale(4)
            .setAlpha(0)
            .setDepth(1);

        // Texto del boss
        this.bossText = this.add.text(bossX, textY, this.getBossName(this.bossKey), {
            fontSize: '64px',
            fontFamily: 'monogram',
            color: '#FF0000', // Rojo
            stroke: '#FF0000',
            strokeThickness: 2
        }).setOrigin(0.5).setAlpha(0).setDepth(1).setResolution(2);

        // Animación de entrada
        this.tweens.add({
            targets: this.playerImage,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });

        this.tweens.add({
            targets: this.vsImage,
            alpha: 1,
            duration: 500,
            delay: 300,
            ease: 'Power2'
        });

        this.tweens.add({
            targets: this.bossImage,
            alpha: 1,
            duration: 500,
            delay: 600,
            ease: 'Power2',
            onComplete: () => {
                // Mostrar textos después de que aparezcan las imágenes
                this.tweens.add({
                    targets: [this.playerText, this.bossText],
                    alpha: 1,
                    duration: 300,
                    ease: 'Power2'
                });

                // Configurar tecla para continuar
                this.continueKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
                this.canSkip = false;
                this.time.delayedCall(1000, () => {
                    this.canSkip = true;
                    // Texto para continuar (parpadeante)
                    this.continueText = this.add.text(centerX, this.cameras.main.height - 40, 'PULSA E PARA CONTINUAR', {
                        fontSize: '32px',
                        fontFamily: 'monogram',
                        color: '#FFFFFF',
                        stroke: '#000000',
                        strokeThickness: 3
                    }).setOrigin(0.5).setAlpha(0).setDepth(1).setResolution(2);

                    this.tweens.add({
                        targets: this.continueText,
                        alpha: 1,
                        duration: 1000,
                        yoyo: true,
                        repeat: -1
                    });
                });

            }
        });

        // Efecto de brillo en las imágenes
        this.playerImage.postFX.addGlow(0x0000FF, 2, 0, false, 0.1, 10);
        this.bossImage.postFX.addGlow(0xFF0000, 2, 0, false, 0.1, 10);
    }

    update() {
        if (this.canSkip && this.continueKey && Phaser.Input.Keyboard.JustDown(this.continueKey)) {
            // Fade out antes de cambiar
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                // IMPORTANTE: Usamos el manager para cambiar de sala correctamente
                if (this.transitionData && this.scene.get(this.nextScene)) {
                    this.scene.start(this.nextScene, {
                        playerStats: this.playerStats,
                        bossKey: this.bossKey,
                        // Pasamos los datos necesarios para el spawn
                        x: this.transitionData.spawnX,
                        y: this.transitionData.spawnY
                    });
                } else {
                    console.error('No se pudo realizar la transición correctamente');
                }
            });
        }
    }

    getBossName(bossKey) {
        const bossNames = {
            'bossMedicina': 'LA MUERTE',
            // Puedes añadir más bosses aquí
        };
        return bossNames[bossKey] || 'BOSS';
    }
}