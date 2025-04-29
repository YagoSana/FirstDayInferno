import Phaser from "phaser";


//MAPAS Y TILES ------------------------------------------------------
import img_grass from "../../../assets/map/TX Tileset Grass.png";
import img_plantas from "../../../assets/map/TX Plant.png";
import img_props from "../../../assets/map/TX Props.png";
import img_sombras from "../../../assets/map/TX Shadow.png";
import img_sombra_plantas from "../../../assets/map/TX Shadow Plant.png";

import FDI_1_TL from "../../../assets/map/exterior.json";
import FDI_2_TL from "../../../assets/map/pasillo_plantaBaja.json"
import FDI_3_TL from "../../../assets/map/entrada.json";
import FDI_4_TL from "../../../assets/map/cafe.json";
import FDI_5_TL from "../../../assets/map/salon_actos.json";
import FDI_6_TL from "../../../assets/map/biblioteca.json";
import FDI_2_1_TL from "../../../assets/map/pasillo.json";
import FDI_2_2_TL from "../../../assets/map/laboratorio.json";
import FDI_2_3_TL from "../../../assets/map/baño.json";

import img_interior from "../../../assets/map/Interiors_free_16x16.png";
import img_muebles from "../../../assets/map/Room_Builder_free_16x16.png";
import img_FDI from "../../../assets/map/tileset_nuevo.png";

/**
 * Escena para la precarga de los assets que se usarán en el juego.
 * Esta escena se puede mejorar añadiendo una imagen del juego y una
 * barra de progreso de carga de los assets
 * @see {@link https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/} como ejemplo
 * sobre cómo hacer una barra de progreso.
 */
export default class informaticaManager extends Phaser.Scene {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: "informaticaManager" });
  }

  init(data){
    this.playerStats = data.playerStats;
    console.log(this.playerStats);
  }

  /**
   * Carga de los assets del juego
   */
  preload() {

    //BARRA DE CARGA
    const { width, height } = this.cameras.main;

    let progressBar = this.add.graphics();
    let progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Cargando...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });
    //BARRA DE CARGA

    // Con setPath podemos establecer el prefijo que se añadirá a todos los load que aparecen a continuación
    //this.load.setPath('assets/sprites/');


    this.load.image("Grass", img_grass);
    this.load.image("Plantas", img_plantas);
    this.load.image("Props", img_props);
    this.load.image("Sombras", img_sombras);
    this.load.image("SombrasPlantas", img_sombra_plantas);

    //TODO AÑADIR TILES?
    this.load.image("Interior", img_interior);
    this.load.image("Muebles", img_muebles);
    this.load.image("Decorado", img_FDI);

    //TODO AÑADIR TILEDJSON (MAPA)
    this.load.tilemapTiledJSON("FDI_2_TL", FDI_2_TL);
    this.load.tilemapTiledJSON("FDI_1_TL", FDI_1_TL);
    this.load.tilemapTiledJSON("FDI_3_TL", FDI_3_TL);
    this.load.tilemapTiledJSON("FDI_4_TL", FDI_4_TL);
    this.load.tilemapTiledJSON("FDI_5_TL", FDI_5_TL);
    this.load.tilemapTiledJSON("FDI_6_TL", FDI_6_TL);
    this.load.tilemapTiledJSON("FDI_2_1_TL", FDI_2_1_TL);
    this.load.tilemapTiledJSON("FDI_2_2_TL", FDI_2_2_TL);
    this.load.tilemapTiledJSON("FDI_2_3_TL", FDI_2_3_TL);

  }

  /**
   * Creación de la escena. En este caso, solo cambiamos a la escena que representa el
   * nivel del juego
   */
  create() {
    this.mapStatus = new Map();
    this.mapStatus.set("FDI_1", false);
    this.scene.start("FDI_1", {x: 360, y:150, playerStats: this.playerStats, managerKey: "informaticaManager", status: this.mapStatus.get("FDI_1")});  
  } //358 170

  cambiarSala(zone){
    this.scene.stop(zone.prev);
    this.mapStatus.set(zone.prev, true);
    console.log(this.mapStatus);
    if(!this.mapStatus.get(zone.spawnRoom)){
      this.mapStatus.set(zone.spawnRoom, false);
    }
    this.scene.start(zone.spawnRoom, {x: zone.spawnX, y: zone.spawnY, playerStats: this.playerStats, managerKey: "informaticaManager", status: this.mapStatus.get(zone.spawnRoom)});
    this.scene.launch('GUI', this.playerStats); // Lanzar la escena de la GUI
  }

  guardarPlayerStats(stats){
    this.playerStats = stats;
  }

  volverAlLobby(actualizarStats){
    this.scene.sleep('informaticaManager');
    this.scene.wake('selectorNivel');
    const selectorNivel = this.scene.get('selectorNivel');
    if(actualizarStats){
      selectorNivel.updatePlayerStats(this.playerStats);
    }
  }
}
