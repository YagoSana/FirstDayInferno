import SalaBase from "../../scenes/salaBase.js";
import Player from "../../gameObjects/characters/player.js";
import Enemy from "../../gameObjects/enemies/enemy.js";
import Item from "../../gameObjects/items/item.js";
import VendingMachine from "../../gameObjects/items/vendingMachine.js";
import merchant from "../../gameObjects/items/merchant.js";
import bartender from "../../gameObjects/items/bartender.js";
import DialogueBox from "../conversation.js";
import boot from "../boot.js";

export default class FDI_4 extends SalaBase {

    constructor(key) {
        super('FDI_4');
    }

    create(){
        super.create('FDI_4');
        this.player = new Player(this, this.xSpawn, this.ySpawn, this.playerStats);

        const map = this.make.tilemap({ key: 'FDI_4_TL' }); // Cargamos el mapa
        //Cargar tilesets
        const tileset1 = map.addTilesetImage('Interiors_free_16x16', 'Interior');
        const tileset2 = map.addTilesetImage('Room_Builder_free_16x16', 'Muebles');
        const tileset3= map.addTilesetImage('tileset_nuevo','Decorado' );
        //Configurar capas

        const layer1 = map.createLayer('suelo', [tileset1, tileset2], 0, 0);
        const layer2 = map.createLayer('pared', [tileset1, tileset2], 0, 0);
        const layer5 = map.createLayer('sin colisiones', [tileset1, tileset2], 0, 0);
        const layer3 = map.createLayer('objetos', [tileset1, tileset2], 0, 0);
        const layer4 = map.createLayer('objetos2', [tileset1, tileset2], 0, 0);
        const layer6 = map.createLayer('techo', [tileset1, tileset2], 0, 0);
        const layer7= map.createLayer('decoracion', [tileset1, tileset2, tileset3],0,0);
     

        layer2.setCollisionByExclusion([-1], true);
        layer3.setCollisionByExclusion([-1], true);
        layer6.setCollisionByExclusion([-1], true);

        this.bulletGroup = this.physics.add.group();
        this.enemyGroup = this.physics.add.group();
        this.enemyBulletGroup = this.physics.add.group();
       

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
        this.cameras.main.setBounds(0, -30, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setZoom(1.8);

        if(!this.status){
            this.spawnProps();
        }
        else{
            this.spawBlood();
        }
        
        this.transitionZones = this.physics.add.group();
        let transitionLayer = map.getObjectLayer("transiciones");
        transitionLayer.objects.forEach(obj => {
            const zone = this.transitionZones.create(obj.x, obj.y, null).setSize(obj.width, obj.height).setOrigin(0, 0).setOffset(0, 0);
            zone.spawnRoom = obj.properties.find(p => p.name === "spawnRoom")?.value;
            zone.spawnX = obj.properties.find(p => p.name === "spawnX")?.value;
            zone.spawnY = obj.properties.find(p => p.name === "spawnY")?.value;
            zone.prev = "FDI_4";
            zone.open = false;
        });
        this.transitionZones.setVisible(false);
        this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);

        const spawnLayer = map.getObjectLayer('spawn');
        if (spawnLayer) {
        spawnLayer.objects.forEach(obj => {
                const spawnType = obj.properties?.find(p => p.name === 'spawn')?.value;
                if (spawnType === 'bartender') {
                    let spawneable= new bartender(this, obj.x, obj.y-10, 112, 25,'bartender');
                }
                else if (spawnType==='vendingMachine'){
                    let vm = new VendingMachine(this, obj.x, obj.y);
                }
        }
    )};
    this.sound.play('musicaCafe1', { loop: true, volume: 0.1 });

    }

    spawnProps(){
        //this.enemyGroup.add(new Enemy(this, 154, 210, "cucaracha"));
       // this.numEnemies++;
       
       
           
        }
    
    spawBlood(){
        
    }
    
}