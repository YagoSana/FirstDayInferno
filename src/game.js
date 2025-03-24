import Boot from './scenes/boot.js';
import MainMenu from './scenes/mainmenu.js';
import PauseMenu from './scenes/pauseMenu.js';
import End from './scenes/end.js';
import Level from './scenes/level.js';
import BibliotecaFDI from './scenes/FDI_scenes/bibliotecaFDI.js';
import PasilloFDI from './scenes/FDI_scenes/pasilloFDI.js';
import FDI_1 from './scenes/FDI_scenes/FDI_1.js';
import FDI_2 from './scenes/FDI_scenes/FDI_2.js';
import FDI_3 from './scenes/FDI_scenes/FDI_3.js';
import FDI_4 from './scenes/FDI_scenes/FDI_4.js';
import laboratorioFDI from './scenes/FDI_scenes/laboratorioFDI.js';
import SelectorNivel from './scenes/selectorNivel.js';

import Phaser from 'phaser';
import InformaticaManager from './scenes/FDI_scenes/informaticaManager.js';


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
    scene: [Boot, MainMenu, PauseMenu, SelectorNivel, InformaticaManager, PasilloFDI,FDI_1, FDI_2,FDI_3, FDI_4, BibliotecaFDI,laboratorioFDI, End],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    }
};

new Phaser.Game(config);
