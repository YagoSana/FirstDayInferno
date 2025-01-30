import Level from "./level.js";
import Boot from "./boot.js";
import Menu from "./menu.js";
window.onload = ()=>{

const config = {
    type: Phaser.AUTO,
    scale: {
        width: 256,
        height: 192,
        zoom: 3,
        autoCenter: Phaser.Scale.Center.CENTER_HORIZONTALLY
    },
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 150
            },
            //debug: true
        }
    },
    scene: [ Boot, Menu, Level ]
};

new Phaser.Game(config);
};