import Phaser from "phaser";

//MAPAS Y TILES ------------------------------------------------------
import introMedicina from "../../../assets/map/medicinaJson/introMedicina.json";
import medicina_2 from "../../../assets/map/medicinaJson/hallMedicina.json";
import medicina_3 from "../../../assets/map/medicinaJson/pasilloMedicina.json";
import medicina_4 from "../../../assets/map/medicinaJson/aulaMedicina.json";
import medicina_5 from "../../../assets/map/medicinaJson/pasillo2Medicina.json";
import medicina_6 from "../../../assets/map/medicinaJson/aulaFinalMedicina.json";

import img_interior from "../../../assets/map/Interiors_free_16x16.png";
import img_muebles from "../../../assets/map/Room_Builder_free_16x16.png";
import tileset_grass from "../../../assets/map/TX Tileset Grass.png";
import tileset_plantas from "../../../assets/map/TX Plant.png";
import tileset_props from "../../../assets/map/TX Props.png";
import tileset_sombras from "../../../assets/map/TX Shadow.png";
import tileset_sombra_plantas from "../../../assets/map/TX Shadow Plant.png";


export default class medicinaManager extends Phaser.Scene {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: "medicinaManager" });
  }

  init(data) {
    console.log('Datos recibidos en init:', data);
    // Si los stats del jugador no están disponibles, asigna un valor predeterminado
    if (data && data.playerStats) {
      this.playerStats = data.playerStats;
    } else {
      this.playerStats = { health: 3, coins: 0, equipedItem: null, itemSprite: null, speed: 100, shootCooldown: 500, doubleshoot: false  }; // Valores predeterminados
    }

    this.game.global = {gatosVivos: []};
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


    //TODO AÑADIR TILES?
    this.load.image("Interior", img_interior);
    this.load.image("Muebles", img_muebles);
    this.load.image("Grass", tileset_grass);
    this.load.image("Plantas", tileset_plantas);
    this.load.image("Props", tileset_props);
    this.load.image("Sombras", tileset_sombras);
    this.load.image("SombrasPlantas", tileset_sombra_plantas);

    //TODO AÑADIR TILEDJSON (MAPA)
    this.load.tilemapTiledJSON("introMedicina", introMedicina);
    this.load.tilemapTiledJSON("medicina_2", medicina_2);
    this.load.tilemapTiledJSON("medicina_3", medicina_3);
    this.load.tilemapTiledJSON("medicina_4", medicina_4);
    this.load.tilemapTiledJSON("medicina_5", medicina_5);
    this.load.tilemapTiledJSON("medicina_6", medicina_6);

  }

  create() {
    this.music = this.sound.add("facultadMedicinaOst", { volume: 0.5, loop: true });
    this.music.play();

   
    this.mapStatus = new Map();
    this.mapStatus.set("introMedicina", false);
    this.scene.start("introMedicina", { x: 320, y: 280, playerStats: this.playerStats, managerKey: "medicinaManager", status: this.mapStatus.get("introMedicina") });
  }


  cambiarSala(zone) {
    this.scene.stop(zone.prev);
    this.mapStatus.set(zone.prev, true);
    console.log(zone.spawnRoom);
    if (!this.mapStatus.get(zone.spawnRoom)) {
      this.mapStatus.set(zone.spawnRoom, false);
    }
    this.scene.start(zone.spawnRoom, {x: zone.spawnX, y: zone.spawnY, playerStats: this.playerStats, managerKey: "medicinaManager", status: this.mapStatus.get(zone.spawnRoom)});
    this.scene.launch('GUI', this.playerStats);
  }

  guardarPlayerStats(stats) {
    this.playerStats = stats;
    console.log("Player stats guardados:", this.playerStats);
  }

  volverAlLobby(sala) {
    this.mapStatus.set(sala, true);
    this.scene.stop(sala);
    this.scene.sleep('medicinaManager');
    this.scene.start('selectorNivel', {playerStats: this.playerStats});
  }

}
