import SalaBase from "../../scenes/salaBase.js";
import Player from "../../gameObjects/characters/player.js";
import BossFDI from "../../gameObjects/enemies/bossFDI.js";

export default class FDI_Boss_1 extends SalaBase {
    constructor(key) {
        super('FDI_Boss_1');
    }

    create() {
         super.create('FDI_Boss_1');
               const map = this.make.tilemap({ key: 'FDI_Boss_1_TL' });
       
               const tileset1 = map.addTilesetImage('Interiors_free_16x16', 'Interior');
               const tileset2 = map.addTilesetImage('Room_Builder_free_16x16', 'Muebles');
               const tileset3 = map.addTilesetImage('tileset_nuevo', 'Decorado');
       
               const layer1 = map.createLayer('suelo', [tileset1, tileset2, tileset3], 0, 0);
               const layer2 = map.createLayer('pared', [tileset1, tileset2, tileset3], 0, 0);
               const layer4 = map.createLayer('decoracion', [tileset1, tileset2, tileset3], 0, 0);
               const layer3 = map.createLayer('objetos', [tileset1, tileset2, tileset3], 0, 0);
               const layer5 = map.createLayer('sin colisiones', [tileset1, tileset2, tileset3], 0, 0);
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
       
               this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
               this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
               this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
               this.cameras.main.setZoom(1.8);
       
               // Transiciones
               this.transitionZones = this.physics.add.group();
               const transitionLayer = map.getObjectLayer("transiciones");
               transitionLayer.objects.forEach(obj => {
                   const zone = this.transitionZones.create(obj.x, obj.y, null).setSize(obj.width, obj.height).setOrigin(0, 0).setOffset(0, 0);
                   zone.spawnRoom = obj.properties.find(p => p.name === "spawnRoom")?.value;
                   zone.spawnX = obj.properties.find(p => p.name === "spawnX")?.value;
                   zone.spawnY = obj.properties.find(p => p.name === "spawnY")?.value;
                   zone.prev = "FDI_Boss_1";
                   zone.open = false;
               });
               this.transitionZones.setVisible(false);
               this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);
            }
}