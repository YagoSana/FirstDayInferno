import Phaser from 'phaser';
import SpriteBase from '../spriteBase';
import Item from './item';
import DialogueBox from '../../scenes/conversation.js';

export default class NPC extends SpriteBase {
    constructor(scene, x, y) {
        super(scene, x, y, 'NPC');

        this.body.setImmovable(true);
        this.body.allowGravity = false;
        this.body.setSize(20, 10);
        this.body.setOffset(6, 0);
        this.setScale(1.2);
        this.originalScaleX = 1.2;
        this.originalScaleY = 1.2;
        this.bulletHits = 0;
        this.maxBulletHits = 3;

        this.dialogueBox = new DialogueBox(this.scene, this.x + 100, this.y + 200, 300, 'borjaPortrait', 'Borja');

        this.hit_frases = [
            "¡Eh tronco, que tengo clase luego!",
            "No me pagan lo suficiente...",
            "¡Así no se trata a un funcionario!",
            "¿Quién te crees que soy, Terminator?",
            "¡Como me rompas las gafas te suspendo!"
        ];

        this.talk_frases = [
            "¿Necesitas ayuda con la práctica?",
            "Yo tampoco entiendo como funciona el maletín",
            "Al menos no doy FAL"
        ];

        this.dialogueActivo = false;
        this.objectGiven = false;
        this.modoHabla = true;
        this.interactionRange = 60;

        // Cola de diálogo
        this.dialogueQueue = [];
        this.dialogueIndex = 0;

        this.scene.physics.add.collider(this, scene.player, this.hitPlayer, null, this);
        this.scene.physics.add.collider(this, scene.bulletGroup, this.hitBullet, null, this);
        this.scene.physics.add.collider(this, scene.enemyGroup);

        this.play('teacher-front');

        this.eKeyIcon = this.scene.add.sprite(0, 0, 'key_E_action')
            .setPosition(this.x, this.y - 30)
            .setVisible(false)
            .setDepth(20)
            .play('key_E_action');

        // Mostrar ícono si estás cerca
        this.scene.physics.add.overlap(
            this,
            this.scene.player,
            () => {
                if (!this.dialogueActivo) {
                    this.eKeyIcon.setPosition(this.x, this.y - 30);
                    this.eKeyIcon.setVisible(true);
                }
            },
            null,
            this
        );

        // Ocultar ícono si te alejas
        this.scene.events.on('update', () => {
            if (!this.isPlayerInRange() || this.dialogueActivo===true) {
                this.eKeyIcon.setVisible(false);
            } else {
                this.eKeyIcon.setVisible(true);
            }
        });

        // ACCION DE HABLAR (PULSAR LA E)
        this.scene.input.keyboard.on('keydown-E', () => {
            if (!this.isPlayerInRange() && !this.dialogueActivo) return;
            if(!this.dialogueActivo){
            const fraseAleatoria = Phaser.Utils.Array.GetRandom(this.talk_frases);
            this.hablar(fraseAleatoria);
            }
            else {
                this.dialogueBox.hide();
                this.dialogueActivo = false;
            }
        });
    }

    isPlayerInRange() {
        if (!this.scene || !this.scene.player || !this.scene.player.x || !this.x) return false;
        return Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) <= this.interactionRange;
    }

    hablar(frase) {
        if (!this.dialogueActivo) {
            // Primera vez que se activa el diálogo
            if (!this.objectGiven) {
                this.dialogueBox.show("Esto es para ti, cuidao con él.");
                this.objectGiven = true;
                this.dispenseItem(); // Puedes mover esto al final del diálogo si prefieres
            }
            this.dialogueActivo = true;
            this.dialogueBox.show(frase);
        } 
    }

    dispenseItem() {
        const itemName = 'maletin';
        const startX = this.x;
        const startY = this.y + 10;
        const offsetX = Phaser.Math.Between(-30, 30);
        const offsetY = Phaser.Math.Between(30, 50);
        const endX = this.x + offsetX;
        const endY = this.y + offsetY;

        const item = new Item(this.scene, endX, endY, itemName);
        item.setVisible(false);
        item.setDepth(this.depth + 10);

        this.scene.tweens.add({
            targets: item,
            alpha: { from: 0, to: 1 },
            y: startY - 20,
            duration: 400,
            ease: 'Power2',
            onStart: () => item.setVisible(true),
            onComplete: () => {
                this.scene.tweens.add({ targets: item, y: endY, duration: 0 });
            }
        });
    }

    hitPlayer(machine, player) {
        player.body.setVelocityX(player.body.velocity.x * -0.5);
    }

    flashEffect() {
        if (this.isOperational) {
            if (this.originalTint === undefined) {
                this.originalTint = this.tint;
            }

            this.setTint(0x737373);

            this.scene.time.delayedCall(300, () => {
                if (this.isOperational) {
                    this.setTint(this.originalTint);
                }
            });
        }
    }

    hitBullet(machine, bullet) {
        bullet.explode();
    
        this.flashEffect();
        this.bulletHits++;
    
        // Mostrar frase solo si no hay diálogo activo
        if (!this.dialogueActivo) {
            let frase = "...";
            if (this.bulletHits != this.maxBulletHits) {
                frase = Phaser.Utils.Array.GetRandom(this.hit_frases);
            }
    
            this.dialogueBox.show(frase);
            this.dialogueActivo = true;
        }
    
        if (this.bulletHits >= this.maxBulletHits) {
            this.bulletHits = 0;
        
            // Mostrar sprite animado de la explosión
            const explosion = this.scene.add.sprite(this.x, this.y, 'fire_loop');
            explosion.play('fire_loop'); // Asegúrate de que esté cargada como animación
            explosion.setScale(2);
            explosion.setDepth(50);
        
            // Fade-out bonito
            this.scene.tweens.add({
                targets: explosion,
                alpha: 0,
                scale: 3,
                duration: 2000,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    explosion.destroy();
                }
            });
        
            // Tween del NPC antes de destruirlo
            this.scene.tweens.add({
                targets: this,
                scale: 0,
                alpha: 0,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                    this.emit('npcDeath', this.x, this.y);
                    this.destroy();
                }
            });
        }
        
        
}
}
