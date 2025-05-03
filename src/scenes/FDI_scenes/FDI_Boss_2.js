//Poner en el boot los paraninfos, y tambien tengo que poner en game las salas? mirar paraninfo_1 pq me faltaba algo mas creo, modificar el manager
import SalaBase from "../salaBase";
import Player from "../../gameObjects/characters/player";

export default class FDI_Boss_2 extends SalaBase{
    constructor(key){
        super('FDI_Boss_2');
    }

    create(){
        super.create('FDI_Boss_2');

        const map = this.make.tilemap({ key: 'FDI_Boss_2' });

        const tileset1= map.addTilesetImage('paraninfo', 'Paraninfo');

        const layer1 = map.createLayer('suelo', [tileset1], 0, 0);
        const layer2 = map.createLayer('colision enemigos', [tileset1], 0, 0);

        layer2.setCollisionByExclusion([-1], true);

        this.bulletGroup = this.physics.add.group();
        this.enemyGroup = this.physics.add.group();
        this.enemyBulletGroup = this.physics.add.group();
        this.player = new Player(this, this.xSpawn, this.ySpawn, this.playerStats);

        this.physics.add.collider(this.enemyGroup, layer2);
        this.physics.add.collider(this.enemyBulletGroup, layer2, this.onBulletCollision);

        //Camaras
        const screenWidth = this.sys.game.config.width; // Ancho de tu pantalla
        const screenHeight = this.sys.game.config.height; // Alto de tu pantalla
        const mapWidth = map.widthInPixels;
        const mapHeight = map.heightInPixels;
        const zoom = 1.8;
        const boundX = -(screenWidth / zoom - mapWidth) / 2;
        
        this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
        this.cameras.main.setBounds(boundX, 0, mapWidth, mapHeight);

        this.cameras.main.setZoom(zoom);

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        this.transitionZones = this.physics.add.group();
    }
}