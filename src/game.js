import Boot from './scenes/boot.js';
import MainMenu from './scenes/mainmenu.js';
import PauseMenu from './scenes/pauseMenu.js';
import End from './scenes/end.js';
import Level from './scenes/level.js';
import CafeFDI from './scenes/cafeFDI.js';
import BibliotecaFDI from './scenes/bibliotecaFDI.js';
import PasilloFDI from './scenes/pasilloFDI.js';
import FDI_1 from './scenes/FDI_1.js';
import FDI_2 from './scenes/FDI_2.js';
import laboratorioFDI from './scenes/laboratorioFDI.js';
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
    scene: [Boot, MainMenu, PauseMenu, SelectorNivel, InformaticaManager, CafeFDI, PasilloFDI,FDI_1, FDI_2, BibliotecaFDI,laboratorioFDI, End],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    }
};

new Phaser.Game(config);
