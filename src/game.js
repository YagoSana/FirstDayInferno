import End from './scenes/end.js';
import Level from './scenes/level.js';
import CafeFDI from './scenes/cafeFDI.js';
import BibliotecaFDI from './scenes/bibliotecaFDI.js';
import PasilloFDI from './scenes/pasilloFDI.js';
import SelectorNivel from './scenes/selectorNivel.js';
import Phaser from 'phaser';
import InformaticaManager from './scenes/informaticaManager.js';


/**
 * Inicio del juego en Phaser. Creamos el archivo de configuración del juego y creamos
 * la clase Game de Phaser, encargada de crear e iniciar el juego.
 */
let config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 500,
    parent: 'juego',
    scale: {
        //mode: Phaser.Scale.FIT,  
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    pixelArt: true,
    scene: [SelectorNivel, InformaticaManager, CafeFDI, PasilloFDI, BibliotecaFDI, End],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    }
};

new Phaser.Game(config);
