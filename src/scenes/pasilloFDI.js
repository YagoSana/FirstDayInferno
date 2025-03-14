import SalaBase from "./salaBase.js";
import Player from "../gameObjects/characters/player.js";
import Enemy from "../gameObjects/enemies/enemy.js";
import RangedEnemy from "../gameObjects/enemies/rangedEnemy.js";
import Item from "../gameObjects/items/item.js";


export default class PasilloFDI extends SalaBase {

    constructor(key) {
        super('pasilloFDI');
    }

    create(data){
        super.create(data);

        const map = this.make.tilemap({ key: 'pasillofdi' }); // Cargamos el mapa

        //Cargar tilesets
        const tileset1 = map.addTilesetImage('Interiors_free_16x16', 'Interior');
        const tileset2 = map.addTilesetImage('Room_Builder_free_16x16', 'Muebles');

        //Configurar capas
        const layer1 = map.createLayer('suelo', [tileset1, tileset2], 0, 0);
        const layer2 = map.createLayer('pared', [tileset1, tileset2], 0, 0);
        const layer3 = map.createLayer('objetos', [tileset1, tileset2], 0, 0);
        const layer4 = map.createLayer('techo', [tileset1, tileset2], 0, 0);
        const layer5 = map.createLayer('sin colision', [tileset1, tileset2], 0, 0);
        
        layer2.setCollisionByExclusion([-1], true);
        layer3.setCollisionByExclusion([-1], true);
        layer4.setCollisionByExclusion([-1], true); 

        this.bulletGroup = this.physics.add.group();
        this.enemyGroup = this.physics.add.group();
        this.enemyBulletGroup = this.physics.add.group();
        this.player = new Player(this, this.xSpawn, this.ySpawn, data.playerStats);//831, 240
        this.enemyGroup.add(new RangedEnemy(this, 100, 80, "nerd"));
        new Item(this, 600, 80, "moneda", false);
        new Item(this, 80, 80,"bumbo",true);

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

        //Camaras
        this.physics.world.setBounds(0, 0, this.bound1, this.bound2);
        this.cameras.main.setBounds(0, 0, this.bound1, this.bound2);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setZoom(1.8);
        
        this.transitionZones = this.physics.add.group();
        let transitionLayer = map.getObjectLayer("transiciones");
        transitionLayer.objects.forEach(obj => {
            const zone = this.transitionZones.create(obj.x, obj.y, null).setSize(obj.width, obj.height);
            zone.spawnRoom = obj.properties.find(p => p.name === "spawnRoom")?.value;
            zone.spawnX = obj.properties.find(p => p.name === "spawnX")?.value;
            zone.spawnY = obj.properties.find(p => p.name === "spawnY")?.value;
            zone.prev = "pasilloFDI";
        });
        this.transitionZones.setVisible(false);
        this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);
    }
}