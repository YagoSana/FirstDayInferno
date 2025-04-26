import Phaser from 'phaser';
import mapaMedicina from '../../assets/imgs/mapaMedicina.png';
import mapaFDI from '../../assets/imgs/mapaFDI.png';

export default class MapMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MapMenu' });

    }

    preload() {
        this.load.image('mapaMedicina', mapaMedicina);
        this.load.image('mapaFDI', mapaFDI);
    }

    create(data) {
        this.sonidoSalir = this.sound.add('salirPausa');
        // this.sound.pauseAll();
        //Configuracion del texto
        let textConfig = {
            fontSize: '40px',
            color: '#ffffff',
            fontFamily: 'monogram'
        };

        this.previousScene = data.previousScene; // Guardar el nombre de la escena anterior
        this.clave = data.claveMapa;

        if (this.clave === 'informaticaManager') {
            this.add.image(100, 56.2, 'mapaFDI').setOrigin(0, 0).setScale(0.8).setAlpha(0.9);
        }
        else if (this.clave === 'medicinaManager') {
            this.add.image(100, 56.2, 'mapaMedicina').setOrigin(0, 0).setScale(0.8).setAlpha(0.9);
        }

        console.log(`Escena actual: ${this.scene.key}`);

        // Botón "Reanudar"
        const closeButton = this.add.text(500, 520, 'Cerrar [M]', textConfig)
            .setOrigin(0.5, 0.5)
            .setInteractive();


        // Eventos de los botones
        closeButton.on('pointerdown', () => {
            this.sonidoSalir.play();
            this.scene.stop(); // Cerrar la escena de pausa
        });
    }

}