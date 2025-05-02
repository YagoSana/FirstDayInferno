//Poner en el boot los paraninfos, y tambien tengo que poner en game las salas? mirar paraninfo_1 pq me faltaba algo mas creo, modificar el manager
import SalaBase from "../salaBase";
import Player from "../../gameObjects/characters/player";
import Enemy from "../../gameObjects/enemies/enemy";
import PhantomEnemy from "../../gameObjects/enemies/phantomEnemy";
import RangedEnemy from "../../gameObjects/enemies/rangedEnemy";

export default class Paraninfo_2 extends SalaBase{
    constructor(key){
        super('paraninfo_2');
    }

    create(){
        super.create('paraninfo_2');

        const map = this.make.tilemap({ key: 'paraninfo_2' });

        const tileset1 = map.addTilesetImage('Interiors_free_16x16', 'Interior');
        const tileset2 = map.addTilesetImage('Room_Builder_free_16x16', 'Muebles');
        const tileset3= map.addTilesetImage('paraninfo', 'Paraninfo');

        const layer1 = map.createLayer('suelo', [tileset1, tileset2, tileset3], 0, 0);
        const layer2 = map.createLayer('suelo2', [tileset1, tileset2, tileset3], 0, 0);
        const layer3 = map.createLayer('colision', [tileset1, tileset2, tileset3], 0, 0);
        const layer4 = map.createLayer('sin colision abajo', [tileset1, tileset2, tileset3], 0, 0);
        const layer5 = map.createLayer('colision enemigos', [tileset1, tileset2, tileset3], 0, 0);
        
        layer4.setDepth(10);

        layer3.setCollisionByExclusion([-1], true);
        layer5.setCollisionByExclusion([-1], true);

        this.bulletGroup = this.physics.add.group();
        this.enemyGroup = this.physics.add.group();
        this.enemyBulletGroup = this.physics.add.group();
        this.player = new Player(this, this.xSpawn, this.ySpawn, this.playerStats);

        //Poner colisiones de cada cosa (layer5 solo con enemigos)
        this.physics.add.collider(this.player, layer3);
        this.physics.add.collider(this.enemyGroup, layer3);
        this.physics.add.collider(this.bulletGroup, layer3, this.onBulletCollision);
        this.physics.add.collider(this.enemyBulletGroup, layer3, this.onBulletCollision);

        this.physics.add.collider(this.enemyGroup, layer5);
        this.physics.add.collider(this.enemyBulletGroup, layer5, this.onBulletCollision);

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
            zone.prev = "paraninfo_2";
        });
        this.transitionZones.setVisible(false);
        this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);
        
        //Capa sprites
        let spritesLayer = map.getObjectLayer("sprites");
        if(!this.status){
            spritesLayer.objects.forEach(obj => {
                let type = obj.properties.find(p => p.name === "tipo")?.value;
                
                if(obj.name === "cucaracha"){
                    this.numEnemies++
                    this.enemyGroup.add(new Enemy(this, obj.x, obj.y, obj.name));
                }else if(obj.name == "phantom"){
                    this.numEnemies++;
                    this.enemyGroup.add(new PhantomEnemy(this, obj.x, obj.y, obj.name, true));
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