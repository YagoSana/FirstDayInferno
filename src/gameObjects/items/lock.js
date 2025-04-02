import Phaser from 'phaser';
import SpriteBase from '../spriteBase';
import Item from './item';

export default class Lock extends SpriteBase {
    constructor(scene, x, y){
        super(scene, x, y, 'lock');//VER ESTO

        this.body.setImmovable(true); // Esto evita que se mueva al colisionar
        this.body.allowGravity = false; // Por si acaso

        //Hitbox

        //Area interaccion -> cambiar?
        this.interactionArea = this.scene.add.circle(x, y, 30, 0x000000, 0);
        this.scene.physics.add.existing(this.interactionArea);
        this.interactionArea.body.setCircle(30);
        this.scene.physics.add.overlap(this.interactionArea, scene.player, this.showInteractionUI, null, this);

        //Colisiones
        this.physics.add.collider(this.player, layer2);
        this.physics.add.collider(scene.enemyGroup, layer2);
        this.physics.add.collider(scene.bulletGroup, layer2, this.onBulletCollision);
        this.physics.add.collider(scene.enemyBulletGroup, layer2, this.onBulletCollision);

        this.isLocked = true;

        this.play('lock-idle');//Poner animacion normal candado

        this.interactionText = this.scene.add.text(0, 0, 'Abrir candado', {
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
            player.nearLock = this;
            this.interactionText.setPosition(this.x - 100 / 2, this.y - 40);
            this.interactionText.setVisible(true);

            this.eKeyIcon.setPosition(this.x - 60, this.y - 30);
            this.eKeyIcon.setVisible(true);

            this.noKeyText.setPosition(this.x - 70, this.y - 40);
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
            if(this.scene.player.hasKey){
                this.scene.player.spendKey();

                this.play('lock-using');
                this.once('animationcomplete', () => {
                    this.disableLock();
                });
            }else{
                this.noKeyText.setVisible(true);
                this.shakeLock();
            }
        }
    }

    shakeLock(){
        this.scene.tweens.add({
            targets: this,
            x: this.x + 3,
            duration: 80,
            yoyo: true,
            repeat: 3,
            ease: 'Sine.easeInOut'
        });
    }

    disableLock(){
        this.isLocked = false;
        this.stop();
        //this.setFrame();//Frame inicial del idle
        //this.setTint(0x737373);
        this.hideInteractionUI();
    }

    onBulletCollision(){

    }
}