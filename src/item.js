import Phaser from 'phaser';
/**
 * Clase que representa las plataformas que aparecen en el escenario de juego.
 * Cada plataforma es responsable de crear la base que aparece sobre ella y en la 
 * que, durante el juego, puede aparecer una estrella
 */
export default class Item extends Phaser.GameObjects.Sprite {
  
  /**
   * Constructor de la Plataforma
   * @param {Phaser.Scene} scene Escena a la que pertenece la plataforma
   * @param {number} x Coordenada x
   * @param {number} y Coordenada y
   */
  constructor(scene, x, y, type, manual){
    super(scene, x, y, type);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.type = type; // el tipo de objeto
    this.manualPickup = manual || false;

    this.setScale(0.65)
    
    this.actions = {
      "hamburguesa":(player) => player.healthUp(),
      "moneda":(player) => player.addCoin(1),
      //en funcion del objeto aplicar sus efectos
      "bumbo":(player) => player.itemAppearance("isaac")// cabeza de Isaac
    };

    // Si el item es automatico, se recoge al tocarlo
    if (!this.manualPickup) {
      this.scene.physics.add.overlap(this, scene.player,this.pick, null, this);
    } else {
      this.scene.physics.add.overlap(this, scene.player, this.showPickupHint, null, this);
    }    

    if (type === "moneda"){
      this.play("coin-idle");
    }


  }

  pick(item, player) {
    //console.log("Intentando ejecutar healthUp en:", player);
    // si el item realiza una accion
    if(this.actions[this.type]){
      this.actions[this.type](player);//coste O(1)
    }
    this.destroy();
  }

  showPickupHint(item, player) {
    player.nearItem = this; // Guardamos el objeto cerca
  }
  
  preUpdate(t, dt) {
    super.preUpdate(t, dt);
  }

}
