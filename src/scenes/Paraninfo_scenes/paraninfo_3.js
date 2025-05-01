import SalaBase from "../salaBase";
import Player from "../../gameObjects/characters/player";
import Door from "../../gameObjects/items/door.js";

export default class Paraninfo_3 extends SalaBase{
    constructor(key){
        super('paraninfo_3');
    }

    create(){
        super.create('paraninfo_3');

        const map = this.make.tilemap({ key: 'paraninfo_3' });

        const tileset1 = map.addTilesetImage('Interiors_free_16x16', 'Interior');
        const tileset2 = map.addTilesetImage('Room_Builder_free_16x16', 'Muebles');
        const tileset3= map.addTilesetImage('paraninfo', 'Paraninfo');

        const layer1 = map.createLayer('suelo', [tileset1, tileset2, tileset3], 0, 0);
        const layer2 = map.createLayer('pared', [tileset1, tileset2, tileset3], 0, 0);
        const layer3 = map.createLayer('objetos', [tileset1, tileset2, tileset3], 0, 0);
        const layer4 = map.createLayer('sin colision arriba', [tileset1, tileset2, tileset3], 0, 0);
        const layer5 = map.createLayer('sin colision abajo', [tileset1, tileset2, tileset3], 0, 0);
        const layer6 = map.createLayer('techo', [tileset1, tileset2, tileset3], 0, 0);

        layer5.setDepth(10);

        layer2.setCollisionByExclusion([-1], true);
        layer3.setCollisionByExclusion([-1], true);
        layer6.setCollisionByExclusion([-1], true);

        this.bulletGroup = this.physics.add.group();
        this.enemyGroup = this.physics.add.group();
        this.enemyBulletGroup = this.physics.add.group();
        this.player = new Player(this, this.xSpawn, this.ySpawn, this.playerStats);

        this.physics.add.collider(this.player, layer2);
        this.physics.add.collider(this.enemyGroup, layer3);
        this.physics.add.collider(this.bulletGroup, layer2, this.onBulletCollision);
        this.physics.add.collider(this.enemyBulletGroup, layer2, this.onBulletCollision);

        this.physics.add.collider(this.player, layer3);
        this.physics.add.collider(this.enemyGroup, layer3);
        this.physics.add.collider(this.bulletGroup, layer3, this.onBulletCollision);
        this.physics.add.collider(this.enemyBulletGroup, layer3, this.onBulletCollision);

        this.physics.add.collider(this.player, layer6);
        this.physics.add.collider(this.enemyGroup, layer6);
        this.physics.add.collider(this.bulletGroup, layer6, this.onBulletCollision);
        this.physics.add.collider(this.enemyBulletGroup, layer6, this.onBulletCollision);

        //Camaras
        const screenWidth = this.sys.game.config.width; // Ancho de tu pantalla
        const screenHeight = this.sys.game.config.height; // Alto de tu pantalla
        const mapWidth = map.widthInPixels;
        const mapHeight = map.heightInPixels;
        const zoom = 1.8;
        const boundX = -(screenWidth / zoom - mapWidth) / 2;
        const boundY = -(screenHeight / zoom - mapHeight) / 2;

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.cameras.main.setZoom(zoom);
        this.cameras.main.setBounds(boundX, boundY, map.widthInPixels, map.heightInPixels);

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        this.transitionZones = this.physics.add.group();
        let transitionLayer = map.getObjectLayer("transiciones");
        transitionLayer.objects.forEach(obj => {
            const zone = this.transitionZones.create(obj.x, obj.y, null)
            .setSize(obj.width, obj.height).setOrigin(0,0).setOffset(0, 0);

            zone.spawnRoom = obj.properties.find(p => p.name === "spawnRoom")?.value;
            zone.spawnX = obj.properties.find(p => p.name === "spawnX")?.value;
            zone.spawnY = obj.properties.find(p => p.name === "spawnY")?.value;
            zone.prev = "paraninfo_3";
        });
        this.transitionZones.setVisible(false);
        this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);

        //capa sprites, puerta, vending machine
        let spritesLayer = map.getObjectLayer("sprites");
        spritesLayer.objects.forEach(obj => {
            let type = obj.properties.find(p => p.name === "tipo")?.value;
            
            if(type === "door"){
                let locked2 = this.playerStats.doorsLocked['secretDoor'];
                new Door(this, obj.x, obj.y, 'secretDoor', locked2);
            }
        });
    }
}