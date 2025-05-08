import SalaBase from "../../scenes/salaBase.js";
import Player from "../../gameObjects/characters/player.js";
import TurretEnemy from "../../gameObjects/enemies/turretEnemy.js";
export default class FDI_2 extends SalaBase {

    constructor(key) {
        super('FDI_2');
    }

    create(){
        super.create('FDI_2');
        const map = this.make.tilemap({ key: 'FDI_2_TL' }); // Cargamos el mapa
        //Cargar tilesets
        const tileset1 = map.addTilesetImage('Interiors_free_16x16', 'Interior');
        const tileset2 = map.addTilesetImage('Room_Builder_free_16x16', 'Muebles');

        //Configurar capas
        const layer1 = map.createLayer('suelo', [tileset1, tileset2], 0, 0);
        const layer2 = map.createLayer('suelo2', [tileset1, tileset2], 0, 0);
        const layer3 = map.createLayer('pared', [tileset1, tileset2], 0, 0);
        const layer4 = map.createLayer('objetos', [tileset1, tileset2], 0, 0);
        const layer5 = map.createLayer('sin colisiones', [tileset1, tileset2], 0, 0);
        const layer6 = map.createLayer('techo', [tileset1, tileset2], 0, 0);
        
       
        
        layer5.setDepth(10);

        layer3.setCollisionByExclusion([-1], true);
        layer4.setCollisionByExclusion([-1], true);
        layer6.setCollisionByExclusion([-1], true);

        this.bulletGroup = this.physics.add.group();
        this.enemyGroup = this.physics.add.group();
        this.enemyBulletGroup = this.physics.add.group();
        this.player = new Player(this, this.xSpawn, this.ySpawn, this.playerStats);
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
        this.cameras.main.setBounds(0, -100, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setZoom(1.8);

        if(!this.status){
            this.spawnProps();
        }
        else{
            this.spawnBlood();
        }
        
        this.transitionZones = this.physics.add.group();
        let transitionLayer = map.getObjectLayer("transiciones");
        
        transitionLayer.objects.forEach(obj => {
            const zone = this.transitionZones.create(obj.x, obj.y, null).setSize(obj.width, obj.height).setOrigin(0, 0).setOffset(0, 0);
            zone.spawnRoom = obj.properties.find(p => p.name === "spawnRoom")?.value;
            zone.spawnX = obj.properties.find(p => p.name === "spawnX")?.value;
            zone.spawnY = obj.properties.find(p => p.name === "spawnY")?.value;
            zone.prev = "FDI_2";
            zone.open = false;
        });
        
        this.transitionZones.setVisible(false);
        this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);
        this.doorFireManager.createFiresForZones(this.transitionZones);
        this.doorFireManager.setupCollisions(this.player);
    }

    spawnProps(){
       // this.enemyGroup.add(new RangedEnemy(this, 700, 80, "nerd"));
       // this.enemyGroup.add(new Enemy(this, 200, 80, "cucaracha"));
      this.numEnemies=3;
      this.enemyGroup.add(new TurretEnemy(this, 750, 65, "printer"));
      this.enemyGroup.add(new TurretEnemy(this, 750, 95, "printer"));
      this.enemyGroup.add(new TurretEnemy(this, 750, 125, "printer"));
   
    
      // Ahora aplicamos el retraso en el disparo para cada enemigo
      this.enemyGroup.getChildren().forEach((enemy, index) => {
        // Aquí le damos a cada enemigo un retraso escalonado para empezar a disparar
        enemy.attackCooldown = index * 1100; // 1000 ms de diferencia entre cada uno (ajustable)
      });
        }
    
    spawnBlood(){
       
    }
}