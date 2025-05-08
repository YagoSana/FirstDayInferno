import SalaBase from "../salaBase";
import Player from "../../gameObjects/characters/player";
import Enemy from "../../gameObjects/enemies/enemy";
import Phaser from "phaser";

export default class Paraninfo_1 extends SalaBase {
    constructor(key){
        super('paraninfo_1');
    }

    create(){
        super.create('paraninfo_1');

        const map = this.make.tilemap({ key: 'paraninfo_1' });

        const tileset1 = map.addTilesetImage('Interiors_free_16x16', 'Interior');
        const tileset2 = map.addTilesetImage('Room_Builder_free_16x16', 'Muebles');
        const tileset3= map.addTilesetImage('paraninfo', 'Paraninfo');

        const layer1 = map.createLayer('suelo', [tileset1, tileset2, tileset3], 0, 0);
        const layer2 = map.createLayer('suelo2', [tileset1, tileset2, tileset3], 0, 0);
        const layer3 = map.createLayer('sin colision abajo', [tileset1, tileset2, tileset3], 0, 0);
        const layer4 = map.createLayer('sin colision arriba', [tileset1, tileset2, tileset3], 0, 0);
        const layer5 = map.createLayer('pared', [tileset1, tileset2, tileset3], 0, 0);
        const layer6 = map.createLayer('colision', [tileset1, tileset2, tileset3], 0, 0);
        const layer7 = map.createLayer('colision enemigos', [tileset1, tileset2, tileset3], 0, 0);

        layer5.setCollisionByExclusion([-1], true);
        layer6.setCollisionByExclusion([-1], true);
        layer7.setCollisionByExclusion([-1], true);

        layer3.setDepth(10);

        this.bulletGroup = this.physics.add.group();
        this.enemyGroup = this.physics.add.group();
        this.enemyBulletGroup = this.physics.add.group();
        this.player = new Player(this, this.xSpawn, this.ySpawn, this.playerStats);

        this.physics.add.collider(this.player, layer5);
        this.physics.add.collider(this.enemyGroup, layer5);
        this.physics.add.collider(this.bulletGroup, layer5, this.onBulletCollision);
        this.physics.add.collider(this.enemyBulletGroup, layer5, this.onBulletCollision);

        this.physics.add.collider(this.player, layer6);
        this.physics.add.collider(this.enemyGroup, layer6);
        this.physics.add.collider(this.bulletGroup, layer6, this.onBulletCollision);
        this.physics.add.collider(this.enemyBulletGroup, layer6, this.onBulletCollision);

        this.physics.add.collider(this.player, layer7);
        this.physics.add.collider(this.enemyGroup, layer7);
        this.physics.add.collider(this.bulletGroup, layer7, this.onBulletCollision);
        this.physics.add.collider(this.enemyBulletGroup, layer7, this.onBulletCollision);

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
        let transitionLayer = map.getObjectLayer("transiciones");
        transitionLayer.objects.forEach(obj => {
            const zone = this.transitionZones.create(obj.x, obj.y, null)
            .setSize(obj.width, obj.height).setOrigin(0,0).setOffset(0, 0);

            zone.spawnRoom = obj.properties.find(p => p.name === "spawnRoom")?.value;
            zone.spawnX = obj.properties.find(p => p.name === "spawnX")?.value;
            zone.spawnY = obj.properties.find(p => p.name === "spawnY")?.value;
            zone.prev = "paraninfo_1";
        });
        this.transitionZones.setVisible(false);
        this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);
        
        let spritesLayer = map.getObjectLayer("sprites");
        if(!this.status){
            spritesLayer.objects.forEach(obj => {
                let type = obj.properties.find(p => p.name === "tipo")?.value;
                
                if(type === "enemy"){
                    this.numEnemies++
                    this.enemyGroup.add(new Enemy(this, obj.x, obj.y, obj.name));
                }
            });
        } else {
            spritesLayer.objects.forEach(obj => {
                let type = obj.properties.find(p => p.name === "tipo")?.value;
                console.log(`Tipo del objeto de tiled ${type}`);

                if (type === "asset") {
                    let sprite = this.add.sprite(obj.x, obj.y, obj.name).setVisible(true).setDepth(3).play(obj.name);
                    sprite.setOrigin(0, 0); // Ajusta según tu necesidad
                }
                else if (type === "enemy") {
                    this.add.sprite(obj.x, obj.y, "blood").setVisible(true).setDepth(3).setFrame(12);
                }
            });
        }
    }
}