import Boot from './scenes/boot.js';
import MainMenu from './scenes/mainmenu.js';
import PauseMenu from './scenes/pauseMenu.js';
import End from './scenes/end.js';
import GUI from './scenes/gui.js';
import GameOver from './scenes/gameOver.js';
import DialogueBox from './scenes/conversation.js';

import FDI_1 from './scenes/FDI_scenes/FDI_1.js';
import FDI_2 from './scenes/FDI_scenes/FDI_2.js';
import FDI_3 from './scenes/FDI_scenes/FDI_3.js';
import FDI_4 from './scenes/FDI_scenes/FDI_4.js';
import FDI_5 from './scenes/FDI_scenes/FDI_5.js';
import FDI_6 from './scenes/FDI_scenes/FDI_6.js';
import FDI_2_1 from './scenes/FDI_scenes/FDI_2_1.js';
import FDI_2_2 from './scenes/FDI_scenes/FDI_2_2.js';
import FDI_2_3 from './scenes/FDI_scenes/FDI_2_3.js';

import SelectorNivel from './scenes/selectorNivel.js';

import Phaser from 'phaser';
import InformaticaManager from './scenes/FDI_scenes/informaticaManager.js';
import TutorialManager from './scenes/Tutorial_scenes/tutorialManager.js';
import Tutorial_1 from './scenes/Tutorial_scenes/tutorial_1.js';
import Tutorial_2 from './scenes/Tutorial_scenes/tutorial_2.js';
import Tutorial_3 from './scenes/Tutorial_scenes/tutorial_3.js';
import Tutorial_debug from './scenes/tutorial_debug.js';
import Tutorial_debug2 from './scenes/tutorial_debug2.js';
import MedicinaManager from './scenes/Medicina_scenes/medicinaManager.js';

import introMedicina from './scenes/Medicina_scenes/introMedicina.js'
import medicina_2 from './scenes/Medicina_scenes/medicina_2.js';
import medicina_3 from './scenes/Medicina_scenes/medicina_3.js';
import medicina_4 from './scenes/Medicina_scenes/medicina_4.js';
import medicina_5 from './scenes/Medicina_scenes/medicina_5.js';
import medicina_6 from './scenes/Medicina_scenes/medicina_6.js';

import ParaninfoManager from './scenes/Paraninfo_scenes/paraninfoManager.js';
import Paraninfo_1 from './scenes/Paraninfo_scenes/paraninfo_1.js';
import Paraninfo_2 from './scenes/Paraninfo_scenes/paraninfo_2.js';
import Paraninfo_3 from './scenes/Paraninfo_scenes/paraninfo_3.js';
import Paraninfo_secret from './scenes/Paraninfo_scenes/paraninfo_secret.js';

/**
 * Inicio del juego en Phaser. Creamos el archivo de configuración del juego y creamos
 * la clase Game de Phaser, encargada de crear e iniciar el juego.
 */
let config = {
    type: Phaser.AUTO,
    parent: 'juego',
    scale: {
        mode: Phaser.Scale.FIT,
        width: 1000,
        height: 562,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
        fullscreenTarget: 'game-container'

    },
    pixelArt: true,
    scene: [Boot, MainMenu, PauseMenu, SelectorNivel, GameOver, ParaninfoManager, Paraninfo_1, Paraninfo_2, Paraninfo_3, Paraninfo_secret, TutorialManager, Tutorial_1, Tutorial_2, Tutorial_3, Tutorial_debug, Tutorial_debug2, GUI, InformaticaManager, FDI_1, FDI_2, FDI_3, FDI_4, FDI_5, FDI_6, FDI_2_1, FDI_2_2, FDI_2_3, MedicinaManager, introMedicina, medicina_2, medicina_3, medicina_4, medicina_5, medicina_6, End],

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

new Phaser.Game(config);
