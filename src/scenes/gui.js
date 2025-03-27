import Phaser from 'phaser';
import Player from '../gameObjects/characters/player.js';

export default class GUI extends Phaser.Scene {
    constructor() {
        super({ key: 'GUI', active: true }); // La UI siempre está activa
    }

    create(player) {
        // Obtener referencia al jugador desde la escena del juego
        // Arreglo para los corazones
        this.player = player;
        this.hearts = [];
        const heartSpacing = 40;
        const totalHearts = Math.ceil(this.player.maxHealth / 2); // Cada corazón representa 2 de vida
        const centerX = this.cameras.main.width / 2 - (totalHearts * heartSpacing) / 2;
        const heartY = 20;

        // Crear los corazones en pantalla
        for (let i = 0; i < totalHearts; i++) {
            let heart = this.add.image(centerX + i * heartSpacing, heartY, 'vidaJugador', 0)
                .setScrollFactor(0).setScale(2) // No se mueve con la cámara
                .setDepth(100); // Siempre encima del mapa
            this.hearts.push(heart);
        }

        // Crear el sprite de la moneda y el texto de contador
        this.coinSprite = this.add.sprite(20, 80, 'coin-idle')  // Asume que tienes un sprite de la moneda
            .setScrollFactor(0)
            .setScale(1) // Ajusta el tamaño de la moneda según lo necesites  // Para asegurarse de que se vea sobre otras cosas
            .play('coin-idle')  // Asume que tienes una animación de moneda
            .setDepth(100);

        // Crear un texto que muestre el número de monedas junto al sprite
        this.coinText = this.add.text(50, 60, this.player.coins, { // Posiciona el texto cerca del sprite de la moneda
            fontSize: '40px',
            color: '#ffffff',
            fontFamily: 'monogram'
        })
        .setScrollFactor(0)
        .setDepth(100);  // Asegúrate de que esté encima

        // Actualizar corazones al iniciar para reflejar la vida actual
        //this.update();
    }

    update() {  
        let health = this.player.health;
        for (let i = 0; i < this.hearts.length; i++) {
            if (health >= (i + 1) * 2) {
                this.hearts[i].setFrame(0); // Corazón lleno
            } else if (health === (i * 2) + 1) {
                this.hearts[i].setFrame(1); // Medio corazón
            } else {
                this.hearts[i].setFrame(2); // Corazón vacío
            }
        }
        // Actualizar el contador de monedas
        this.coinText.setText(this.player.coins);
    }
}
