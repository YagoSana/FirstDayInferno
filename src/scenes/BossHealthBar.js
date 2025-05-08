import Phaser from 'phaser';

export default class BossHealthBarScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BossHealthBarScene' });
    }

    create(data) {
        // Elementos de la UI
        this.barFrame = null;
        this.healthFill = null;
        this.leftIcon = null;
        this.rightIcon = null;
        this.bossNameText = null;
        this.maxHealth = null;
        this.currentHealth = null;
        this.maxWidth = null;

        // Escuchar eventos del boss
        this.game.events.on('bossHealthChanged', this.updateHealth, this);
        this.game.events.on('bossDefeated', this.destroyBar, this);
        console.log('EVENTOS CREADOS?')
        this.createBossBar(data);
    }

    createBossBar(bossData) {
        console.log('CREANDO BOSS BAR', bossData);
        // Destruir elementos previos si existen
        this.destroyBar();

        // Configuración de posición (centro horizontal, parte inferior)
        const centerX = this.cameras.main.centerX;
        const yPos = this.cameras.main.height - 30;

        // Marco de la barra
        this.barFrame = this.add.image(centerX, yPos, 'boss_bar')
            .setScrollFactor(0)
            .setDepth(300)
            .setScale(5, 1)
            .setAlpha(0.8);

        // Iconos de calavera
        this.leftIcon = this.add.image(
            centerX - this.barFrame.displayWidth / 2 - 25,
            yPos,
            'boss_icon'
        ).setScrollFactor(0).setDepth(301).setScale(1.5);

        this.rightIcon = this.add.image(
            centerX + this.barFrame.displayWidth / 2 + 25,
            yPos,
            'boss_icon'
        ).setScrollFactor(0).setDepth(301).setScale(1.5);

        // Barra de salud (relleno rojo)
        this.healthFill = this.add.rectangle(
            centerX - this.barFrame.displayWidth / 2 + 10,
            yPos,
            0,
            20,
            0xff0000
        )
            .setOrigin(0, 0.5)
            .setScrollFactor(0)
            .setDepth(301);

        // Texto del nombre del boss
        this.bossNameText = this.add.text(
            centerX,
            yPos - 30,
            this.getBossName(bossData.type),
            {
                fontSize: '32px',
                fontFamily: 'monogram',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(301).setResolution(2);

        // Guardar datos iniciales
        this.maxHealth = bossData.maxHealth;
        this.currentHealth = bossData.currentHealth;
        this.maxWidth = this.barFrame.displayWidth - 20;

        this.animateBarFill();
    }

    animateBarFill() {
        // Configuración de la animación
        const duration = 1000; // 1 segundo de duración
        const startWidth = 0;
        const endWidth = this.maxWidth * (this.currentHealth / this.maxHealth);

        // Inicializar con ancho 0
        this.healthFill.width = startWidth;

        // Animación de llenado
        this.tweens.add({
            targets: this.healthFill,
            width: endWidth,
            duration: duration,
            ease: 'Power2',
            onUpdate: () => {
                // Cambiar color según el porcentaje actual durante la animación
                const currentPercent = this.healthFill.width / this.maxWidth;
                if (currentPercent < 0.3) {
                    this.healthFill.fillColor = 0xff3333;
                } else if (currentPercent < 0.6) {
                    this.healthFill.fillColor = 0xff9900;
                } else {
                    this.healthFill.fillColor = 0xff0000;
                }
            }
        });
    }

    updateHealth({ currentHealth }) {
        if (!this.healthFill) return;

        const previousHealth = this.currentHealth || 0;
        this.currentHealth = currentHealth;

        const healthPercent = this.currentHealth / this.maxHealth;
        const newWidth = this.maxWidth * healthPercent;

        // Animación suave del cambio de salud
        this.tweens.add({
            targets: this.healthFill,
            width: newWidth,
            duration: 300, // Animación más rápida para actualizaciones
            ease: 'Power1',
            onUpdate: () => {
                // Actualizar color durante la transición
                const currentPercent = this.healthFill.width / this.maxWidth;
                if (currentPercent < 0.3) {
                    this.healthFill.fillColor = 0xff3333;
                } else if (currentPercent < 0.6) {
                    this.healthFill.fillColor = 0xff9900;
                } else {
                    this.healthFill.fillColor = 0xff0000;
                }
            }
        });

        // Efecto visual cuando recibe daño
        if (currentHealth < previousHealth) {
            this.playDamageEffect();
        }
    }

    getBossName(bossType) {
        const names = {
            'bossMedicina': 'LA MUERTE',
            'bossFDIfase1': 'PROFESOR',
            'bossFDIfase2': '¿?QUIÉN ERES¿?'
            // Añadir más bosses aquí
        };
        return names[bossType] || bossType.toUpperCase();
    }

    playDamageEffect() {
        // Efecto de parpadeo
        this.tweens.add({
            targets: [this.healthFill, this.barFrame, this.leftIcon, this.rightIcon],
            alpha: 0.7,
            duration: 100,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
                this.healthFill.setAlpha(1);
                this.barFrame.setAlpha(0.8);
                this.leftIcon.setAlpha(1);
                this.rightIcon.setAlpha(1);
            }
        });

    }

    destroyBar() {
        if (this.barFrame) this.barFrame.destroy();
        if (this.healthFill) this.healthFill.destroy();
        if (this.leftIcon) this.leftIcon.destroy();
        if (this.rightIcon) this.rightIcon.destroy();
        if (this.bossNameText) this.bossNameText.destroy();
    }

    shutdown() {
        this.destroyBar();
        this.tweens.killTweensOf(this.healthFill);
        this.tweens.killTweensOf(this.barFrame);
        this.tweens.killTweensOf([this.leftIcon, this.rightIcon]);
        this.game.events.off('bossHealthChanged', this.updateHealth, this);
        this.game.events.off('bossDefeated', this.destroyBar, this);
    }
}