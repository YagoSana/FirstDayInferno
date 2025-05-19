import SalaBase from "../salaBase.js";
import Player from "../../gameObjects/characters/player.js";
import RangedEnemy from "../../gameObjects/enemies/rangedEnemy.js";
import Phaser from "phaser";

export default class FDI_6 extends SalaBase {

    constructor(key) {
        super('FDI_6');
    }

    create(){
        super.create('FDI_6');

        const map = this.make.tilemap({ key: 'FDI_6_TL' });

        //Cargar tilesets
        const tileset1 = map.addTilesetImage('Interiors_free_16x16', 'Interior');
        const tileset2 = map.addTilesetImage('Room_Builder_free_16x16', 'Muebles');

        //Configurar capas
        const layer1 = map.createLayer('suelo', [tileset1, tileset2], 0, 0);
        const layer2 = map.createLayer('pared', [tileset1, tileset2], 0, 0);
        const layer3 = map.createLayer('objetos', [tileset1, tileset2], 0, 0);
        const layer4 = map.createLayer('sin colision detras', [tileset1, tileset2], 0, 0);
        const layer5 = map.createLayer('sin colision', [tileset1, tileset2], 0, 0);
        const layer6 = map.createLayer('techo', [tileset1, tileset2], 0, 0);
        
        layer2.setCollisionByExclusion([-1], true);
        layer3.setCollisionByExclusion([-1], true);
        layer6.setCollisionByExclusion([-1], true);

        
        layer3.setDepth(10);
        layer5.setDepth(10);
        layer6.setDepth(11);


        this.bulletGroup = this.physics.add.group();
        this.enemyGroup = this.physics.add.group();
        this.enemyBulletGroup = this.physics.add.group();
        this.player = new Player(this, this.xSpawn, this.ySpawn, this.playerStats);//865, 195
        if(!this.status){
            this.spawnProps();
        }
        else{
            this.spawBlood();
        }
        //Colisiones
        this.physics.add.collider(this.player, layer2);
        this.physics.add.collider(this.enemyGroup, layer2);
        this.physics.add.collider(this.bulletGroup, layer2, this.onBulletCollision);
        this.physics.add.collider(this.enemyBulletGroup, layer2, this.onBulletCollision);

        this.physics.add.collider(this.player, layer3);
        this.physics.add.collider(this.enemyGroup, layer3);
        this.physics.add.collider(this.bulletGroup, layer3, this.onBulletCollision);
        this.physics.add.collider(this.enemyBulletGroup, layer3, this.onBulletCollision);

        this.physics.add.collider(this.player, layer4);
        this.physics.add.collider(this.enemyGroup, layer4);
        this.physics.add.collider(this.bulletGroup, layer4, this.onBulletCollision);
        this.physics.add.collider(this.enemyBulletGroup, layer4, this.onBulletCollision);

        this.physics.add.collider(this.player, layer6);
        this.physics.add.collider(this.enemyGroup, layer6);
        this.physics.add.collider(this.bulletGroup, layer6, this.onBulletCollision);
        this.physics.add.collider(this.enemyBulletGroup, layer6, this.onBulletCollision);

        //Camaras
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setZoom(1.8);

        this.transitionZones = this.physics.add.group();
        let transitionLayer = map.getObjectLayer("transiciones");
        transitionLayer.objects.forEach(obj => {
            const zone = this.transitionZones.create(obj.x, obj.y, null).setSize(obj.width, obj.height);
            zone.spawnRoom = obj.properties.find(p => p.name === "spawnRoom")?.value;
            zone.spawnX = obj.properties.find(p => p.name === "spawnX")?.value;
            zone.spawnY = obj.properties.find(p => p.name === "spawnY")?.value;
            zone.prev = "FDI_6";
            zone.open = false;
        });
        this.transitionZones.setVisible(false);
        this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);
        this.doorFireManager.createFiresForZones(this.transitionZones);
        this.doorFireManager.setupCollisions(this.player);
    }

    spawnProps(){
        //this.enemyGroup.add(new WakeEnemy(this, 100, 240, "cat"));
        this.enemyGroup.add(new RangedEnemy(this, 100, 240, "zombie", ));
        this.numEnemies++;
        this.enemyGroup.add(new RangedEnemy(this, 300, 200, "zombie"));
        this.numEnemies++;
    }

    spawBlood(){
        this.add.sprite(100, 240, "blood").setVisible(true).setDepth(3).setFrame(12);
        this.add.sprite(300, 200, "blood").setVisible(true).setDepth(3).setFrame(12);
    }
}