import Phaser from 'phaser';
import BreakableObject from './BreakableObject';

export default class LiterallyJustAToilet extends BreakableObject {
    constructor(scene, x, y, weight, height, sprite) {
        super(scene, x, y, weight, height, sprite);

        this.useCooldown = 2000;
        this.lastUseTime = 0;
        this.isInUse = false;
        this.interactionRange = 50;

        this.scene = scene;

        // Área de interacción invisible
        this.interactionArea = scene.add.circle(x + 16, y + 16, this.interactionRange, 0x000000, 0);
        scene.physics.add.existing(this.interactionArea);
        this.interactionArea.body.setAllowGravity(false);
        this.interactionArea.body.setImmovable(true);

        // Icono de la tecla E
        this.eKeyIcon = scene.add.sprite(x + 16, y - 16, 'key_E_action')
            .setVisible(false)
            .setDepth(20)
            .play('key_E_action');

        // Superposición para detectar al jugador
        scene.physics.add.overlap(this.interactionArea, scene.player, () => {
            this.playerIsNear = true;
        });

        // Tecla E
        this.scene.input.keyboard.on('keydown-E', () => {
            if (this.playerIsNear && !this.isInUse && scene.time.now - this.lastUseTime > this.useCooldown) {
                this.lastUseTime = scene.time.now;
                this.useToilet();
            }
        });
    }

    preUpdate() {
        const inRange = Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) <= this.interactionRange;

        if (inRange && !this.isInUse && this.scene.time.now - this.lastUseTime > this.useCooldown) {
            this.eKeyIcon.setVisible(true).setPosition(this.x + 16, this.y - 16);
            this.playerIsNear = true;
        } else {
            this.eKeyIcon.setVisible(false);
            this.playerIsNear = false;
        }
    }

    useToilet() {
        this.isInUse = true;
        this.eKeyIcon.setVisible(false);

        const cam = this.scene.cameras.main;
        const blackout = this.scene.add.graphics().setDepth(100);
        let radius = 0;

        const updateMask = () => {
            blackout.clear();
            blackout.fillStyle(0x000000);
            blackout.beginPath();
            blackout.arc(this.scene.player.x, this.scene.player.y, radius, 0, Math.PI * 2);
            blackout.fillPath();
        };

        this.scene.tweens.addCounter({
            from: 0,
            to: Math.max(cam.width, cam.height),
            duration: 600,
            ease: 'Sine.easeInOut',
            onUpdate: t => {
                radius = t.getValue();
                updateMask();
            },
            onComplete: () => {
                this.scene.sound.play('flush');

                this.scene.time.delayedCall(1500, () => {
                    this.scene.tweens.addCounter({
                        from: radius,
                        to: 0,
                        duration: 600,
                        ease: 'Sine.easeInOut',
                        onUpdate: t => {
                            radius = t.getValue();
                            updateMask();
                        },
                        onComplete: () => {
                            blackout.destroy();
                            this.isInUse = false;
                        }
                    });
                });
            }
        });
    }
}
