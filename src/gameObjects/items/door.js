import Phaser from 'phaser';
import SpriteBase from '../spriteBase';
import Item from './item';

export default class Door extends SpriteBase {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        if(key === "medDoor"){
            this.animation = 'medDoor-open';
            this.ini = 20;
            this.end = 37;
        }

        this.body.setImmovable(true);
        this.body.allowGravity = false;

        //Hitbox
        this.body.setSize(32, 32);
        this.body.setOffset(16, 0); 

        //Area interaccion -> cambiar?
        this.interactionArea = this.scene.add.circle(x, y, 30, 0x000000, 0);
        this.scene.physics.add.existing(this.interactionArea);
        this.interactionArea.body.setCircle(30);
        this.scene.physics.add.overlap(this.interactionArea, scene.player, this.showInteractionUI, null, this);

        //Colisiones -> when isLocked == false cambiar colisiones
        this.collider = this.scene.physics.add.collider(this, scene.player, this.hitPlayer, null, this);
        this.scene.physics.add.collider(this, scene.enemyGroup);
        this.scene.physics.add.collider(this, scene.bulletGroup, this.hitBullet, null, this);

        this.isLocked = true;
        this.bulletHits = 0;

        this.play(this.animation);
        this.stop();
        this.setFrame(this.ini);//Primer frame (puerta cerrada)

        this.interactionText = this.scene.add.text(0, 0, 'Abrir puerta', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'monogram',
            backgroundColor: '#000000',
            padding: { x: 5, y: 4 }
        })
            .setVisible(false)
            .setDepth(25).setResolution(2);

        this.eKeyIcon = this.scene.add.sprite(0, 0, 'key_E_action')
            .setVisible(false)
            .setDepth(20)
            .play('key_E_action');
        this.noKeyText = this.scene.add.text(this.x - 70, this.y - 40, '¡Necesitas una llave!', {
            fontSize: '16px',
            fill: '#ff0000',
            fontFamily: 'monogram',
            backgroundColor: '#000000',
            padding: { x: 5, y: 4 }
        })
            .setVisible(false)
            .setDepth(30).setResolution(2);
    }

    showInteractionUI(door, player){
        if(this.isLocked){
            player.nearDoor = this;
            this.interactionText.setPosition(this.x - 100 / 2, this.y - 33);
            this.interactionText.setVisible(true);

            this.eKeyIcon.setPosition(this.x - 60, this.y - 23);
            this.eKeyIcon.setVisible(true);

            this.noKeyText.setPosition(this.x - 70, this.y - 33);
        }else{
            this.hideInteractionUI();
        }
    }

    hideInteractionUI() {
        this.interactionText.setVisible(false);
        this.eKeyIcon.setVisible(false);
        this.noKeyText.setVisible(false)
    }

    unlock(){
        if(this.isLocked){
            if(this.scene.player.keys > 0){
                this.scene.player.spendKey(1);

                this.play(this.animation);
                this.once('animationcomplete', () => {
                    this.disableDoor();
                });
                this.collider.active = false; 
                this.scene.physics.world.removeCollider(this.collider);
            }else{
                this.noKeyText.setVisible(true);
            }
        }
    }

    disableDoor(){
        this.isLocked = false;
        this.stop();
        this.setFrame(this.end);//Ultimo frame (puerta abierta)
        //Quitar colisiones con jugador
        this.hideInteractionUI();
    }

    hitBullet(door, bullet){
        bullet.explode();
        if(this.isLocked && this.bulletHits < 3){
            this.bulletHits++;
            if(this.bulletHits === 3){
                const startX = this.x;
                        const startY = this.y + 10; // Justo debajo del centro
                
                        // Posición final (fuera de la máquina)
                        const offsetX = Phaser.Math.Between(-30, 30);
                        const offsetY = Phaser.Math.Between(30, 50);
                        const endX = this.x + offsetX;
                        const endY = this.y + offsetY;
                
                        // Crear el ítem en posición inicial (invisible)
                        const item = new Item(this.scene, endX, endY, 'corazon');
                        item.setVisible(false); // Comenzar invisible
                        item.setDepth(this.depth + 10); // Asegurar que esté sobre la máquina
                
                        // Animación de salida mejorada (sin sequence)
                        this.scene.tweens.add({
                            targets: item,
                            alpha: { from: 0, to: 1 },
                            y: startY - 20,
                            duration: 400,
                            ease: 'Power2',
                            onStart: () => item.setVisible(true),
                            onComplete: () => {
                                // Animación de caída con bounce
                                this.scene.tweens.add({
                                    targets: item,
                                    y: endY,
                                    duration: 1000,
                                    ease: 'Bounce.out'
                                });
                            }
                        });
            }
        }
    }

    hitPlayer(door, player) {
        player.body.setVelocityX(player.body.velocity.x * -0.5);
    }
}