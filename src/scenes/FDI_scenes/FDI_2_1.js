import SalaBase from "../salaBase.js";
import Player from "../../gameObjects/characters/player.js";
import Enemy from "../../gameObjects/enemies/enemy.js";
import RangedEnemy from "../../gameObjects/enemies/rangedEnemy.js";
import Item from "../../gameObjects/items/item.js";
import turretEnemy from "../../gameObjects/enemies/turretEnemy.js"

export default class FDI_2_1 extends SalaBase {

    constructor(key) {
        super('FDI_2_1');
    }

    create(data){
        super.create(data);

        const map = this.make.tilemap({ key: 'FDI_2_1_TL' });

        // Cargar tilesets
        const tileset1 = map.addTilesetImage('Interiors_free_16x16', 'Interior');
        const tileset2 = map.addTilesetImage('Room_Builder_free_16x16', 'Muebles');
        const tileset3 = map.addTilesetImage('tileset_nuevo', 'Decorado');
        
        // Configurar capas normales
        const layer1 = map.createLayer('suelo', [tileset1, tileset2], 0, 0);
        const layer2 = map.createLayer('pared', [tileset1, tileset2, tileset3], 0, 0);
        const layer4 = map.createLayer('techo', [tileset1, tileset2], 0, 0);
        const layer5 = map.createLayer('sin colisiones', [tileset1, tileset2], 0, 0);
        
        // Cargar "objetos" como GameObjects personalizados
        this.breakableGroup = this.physics.add.group();
        const objectLayer = map.getObjectLayer('objetos');
        
   
        
        // Configurar colisiones normales
        layer2.setCollisionByExclusion([-1], true);
        layer4.setCollisionByExclusion([-1], true);
        
        // Agrupar balas, enemigos, etc.
        this.bulletGroup = this.physics.add.group();
        this.enemyGroup = this.physics.add.group();
        this.enemyBulletGroup = this.physics.add.group();
        this.transitionZones = this.physics.add.group();
        
        // Jugador
        this.player = new Player(this, this.xSpawn, this.ySpawn, data.playerStats);
        
        // Si no status, spawnea props (enemigos)
        if (!this.status) {
            this.spawnProps();
        } else {
            this.spawBlood();
        }
        
        // Colisiones
        this.physics.add.collider(this.player, layer2);
        this.physics.add.collider(this.enemyGroup, layer2);
        this.physics.add.collider(this.bulletGroup, layer2, this.onBulletCollision);
        this.physics.add.collider(this.enemyBulletGroup, layer2, this.onBulletCollision);
        
        this.physics.add.collider(this.player, layer4);
        this.physics.add.collider(this.enemyGroup, layer4);
        this.physics.add.collider(this.bulletGroup, layer4, this.onBulletCollision);
        this.physics.add.collider(this.enemyBulletGroup, layer4, this.onBulletCollision);
        
        // Ahora colisiones entre balas y breakableObjects
        this.physics.add.collider(this.bulletGroup, this.breakableGroup, (bullet, breakable) => {
            breakable.hitBullet(breakable, bullet);
        });
        
        // Camara
        this.physics.world.setBounds(0, 0, this.bound1, this.bound2);
        this.cameras.main.setBounds(0, -150, this.bound1, this.bound2);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setZoom(1.8);
        
        // Transiciones
        const transitionLayer = map.getObjectLayer("transiciones");
        transitionLayer.objects.forEach(obj => {
            const zone = this.transitionZones.create(obj.x, obj.y, null).setSize(obj.width, obj.height);
            zone.spawnRoom = obj.properties.find(p => p.name === "spawnRoom")?.value;
            zone.spawnX = obj.properties.find(p => p.name === "spawnX")?.value;
            zone.spawnY = obj.properties.find(p => p.name === "spawnY")?.value;
            zone.prev = "FDI_2_1";
        });
        this.transitionZones.setVisible(false);
        this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);
    }

    spawnProps(){
        this.numEnemies=2;
        this.enemyGroup.add(new turretEnemy(this, 750, 65, "nerd"));
        this.enemyGroup.add(new turretEnemy(this, 750, 95, "nerd"));
   
     
    }

    spawBlood(){
        this.add.sprite(100, 80, "blood").setVisible(true).setDepth(3).setFrame(12);
    }
}