import SalaBase from "../salaBase";
import Player from "../../gameObjects/characters/player";
import VendingMachine from "../../gameObjects/items/vendingMachine";

export default class Paraninfo_secret extends SalaBase{
    constructor(key){
        super('paraninfo_secret');
    }

    create(){
        super.create('paraninfo_secret');

        const map = this.make.tilemap({ key: 'paraninfo_secret' });

        const tileset2 = map.addTilesetImage('Room_Builder_free_16x16', 'Muebles');

        const layer1 = map.createLayer('suelo', [tileset2], 0, 0);
        const layer2 = map.createLayer('pared', [tileset2], 0, 0);
        const layer3 = map.createLayer('sin colision', [tileset2], 0, 0);
        const layer4 = map.createLayer('techo', [tileset2], 0, 0);

        layer2.setCollisionByExclusion([-1], true);
        layer4.setCollisionByExclusion([-1], true);

        this.bulletGroup = this.physics.add.group();
        this.enemyGroup = this.physics.add.group();
        this.enemyBulletGroup = this.physics.add.group();
        this.player = new Player(this, this.xSpawn, this.ySpawn, this.playerStats);

        this.physics.add.collider(this.player, layer2);
        this.physics.add.collider(this.enemyGroup, layer2);
        this.physics.add.collider(this.bulletGroup, layer2, this.onBulletCollision);
        this.physics.add.collider(this.enemyBulletGroup, layer2, this.onBulletCollision);

        this.physics.add.collider(this.player, layer4);
        this.physics.add.collider(this.enemyGroup, layer4);
        this.physics.add.collider(this.bulletGroup, layer4, this.onBulletCollision);
        this.physics.add.collider(this.enemyBulletGroup, layer4, this.onBulletCollision);

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
            zone.prev = "paraninfo_secret";
        });
        this.transitionZones.setVisible(false);
        this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);
         
        let spritesLayer = map.getObjectLayer("sprites");
        spritesLayer.objects.forEach(obj => {
            let type = obj.properties.find(p => p.name === "tipo")?.value;
            if (type === "item") {
                let vm = new VendingMachine(this, obj.x, obj.y);
                if (this.status) {
                    vm.disableMachine();
                }
            }
        });
    }
}