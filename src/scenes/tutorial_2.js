import SalaBase from "./salaBase.js";
import Player from "../gameObjects/characters/player.js";
import Enemy from "../gameObjects/enemies/enemy.js";

export default class Tutorial_2 extends SalaBase{
    constructor(key){
        super('tutorial_2');
    }
    
    create(){
        super.create('tutorial_2');

        const map = this.make.tilemap({key: 'tutorial_2'});

        //Cargar tilesets
        const tileset1 = map.addTilesetImage('Interiors_free_16x16', 'Interior');
        const tileset2 = map.addTilesetImage('Room_Builder_free_16x16', 'Muebles');

        //Configurar capas
        const layer1 = map.createLayer('suelo', [tileset1, tileset2], 0, 0);
        const layer2 = map.createLayer('pared', [tileset1, tileset2], 0, 0);
        const layer3 = map.createLayer('sin colision abajo', [tileset1, tileset2], 0, 0);
        const layer4 = map.createLayer('sin colision arriba', [tileset1, tileset2], 0, 0);
        const layer5 = map.createLayer('objetos', [tileset1, tileset2], 0, 0);
        const layer6 = map.createLayer('techo', [tileset1, tileset2], 0, 0);
        
        layer2.setCollisionByExclusion([-1], true);
        layer5.setCollisionByExclusion([-1], true);
        layer6.setCollisionByExclusion([-1], true);

        layer3.setDepth(10);

        this.bulletGroup = this.physics.add.group();
        this.enemyGroup = this.physics.add.group();
        this.player = new Player(this, this.xSpawn, this.ySpawn, this.playerStats);

        this.enemyGroup.add(new Enemy(this, 41, 84, "cucaracha"));

        //Colisiones
        this.physics.add.collider(this.player, layer2);
        this.physics.add.collider(this.bulletGroup, layer2, this.onBulletCollision);

        this.physics.add.collider(this.player, layer5);
        this.physics.add.collider(this.bulletGroup, layer5, this.onBulletCollision);

        this.physics.add.collider(this.player, layer6);
        this.physics.add.collider(this.bulletGroup, layer6, this.onBulletCollision);

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
            zone.prev = "tutorial_2";
        });
        this.transitionZones.setVisible(false);
        this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);
    }
}