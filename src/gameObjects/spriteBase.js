import Phaser from 'phaser'

/**
 * Clase que representa la base sobre la que se sitúan las estrellas que aparecen en el juego
 */
export default class SpriteBase extends Phaser.GameObjects.Sprite {
    /**
     * @param {Phaser.Scene} scene Escena a la que pertenece la base
     * @param {number} x Coordenada x
     * @param {number} y Coordenada y 
     */
    constructor(scene, x, y, spriteKey) {
        // console.log("Constructor de SpriteBase ejecutándose");
        super(scene, x, y, spriteKey);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setCollideWorldBounds();
    }
}
