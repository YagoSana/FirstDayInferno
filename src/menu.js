
/**
 * Escena principal del juego. La escena se compone de una serie de plataformas 
 * sobre las que se sitúan las bases en las podrán aparecer las estrellas. 
 * El juego comienza generando aleatoriamente una base sobre la que generar una estrella. 
 * Cada vez que el jugador recoge la estrella, aparece una nueva en otra base.
 * El juego termina cuando el jugador ha recogido 10 estrellas.
 * @extends Phaser.Scene
 */
export default class Menu extends Phaser.Scene {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: 'menu' });
  }

  /**
   * Creación de los elementos de la escena principal de juego
   */
  create() {
    this.titulo = this.add.text(this.game.config.width/2, this.game.config.height/2-50, "JetPac", { fontFamily: 'Pixeled, monospace', fontSize: 32, color: '#ffffff' });
    this.titulo.setOrigin(0.5, 0.5).setAlign("center");

    this.crearBoton(this.game.config.height/2, "Fácil",2, 2000);
    this.crearBoton(this.game.config.height/2+25, "Intermedio",3, 1000);
    this.crearBoton(this.game.config.height/2+50, "Difícil",5,500);
  
  }

  crearBoton(y, texto, fuelValue, delay) {
    let button = this.add.text(this.game.config.width/2, y, texto, { fontFamily: 'Pixeled, monospace', fontSize: 16, color: '#ffffff' });
    button.setOrigin(0.5, 0.5).setAlign("center");
    button.setInteractive();
    button.on("pointerdown", ()=> this.scene.start("level", { fuel: fuelValue, delay: delay }));
    return button;
  }
}