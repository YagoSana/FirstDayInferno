import SalaBase from "../salaBase.js";
import Player from "../../gameObjects/characters/player.js";
import Enemy from "../../gameObjects/enemies/enemy.js";
import RangedEnemy from "../../gameObjects/enemies/rangedEnemy.js";
import Item from "../../gameObjects/items/item.js";
import NPC from "../../gameObjects/items/NPC.js";
import turretEnemy from "../../gameObjects/enemies/turretEnemy.js";
import miniBossLab from "../../gameObjects/enemies/miniBossLab.js";
import BreakableObjects from "../../gameObjects/items/BreakableObject.js";

export default class FDI_2_2 extends SalaBase {
    constructor(key) {
        super('FDI_2_2');
    }

    create(data) {
        super.create(data);

        const map = this.make.tilemap({ key: 'FDI_2_2_TL' });

        const tileset1 = map.addTilesetImage('Interiors_free_16x16', 'Interior');
        const tileset2 = map.addTilesetImage('Room_Builder_free_16x16', 'Muebles');

        const layer1 = map.createLayer('suelo', [tileset1, tileset2], 0, 0);
        const layer2 = map.createLayer('pared', [tileset1, tileset2], 0, 0);
        const layer3 = map.createLayer('sin colision', [tileset1, tileset2], 0, 0);
        const layer4 = map.createLayer('objetos', [tileset1, tileset2], 0, 0);
        const layer5 = map.createLayer('objetos2', [tileset1, tileset2], 0, 0);
        const layer6 = map.createLayer('techo', [tileset1, tileset2], 0, 0);

        layer2.setCollisionByExclusion([-1], true);
        layer4.setCollisionByExclusion([-1], true);
        layer5.setCollisionByExclusion([-1], true);
        layer6.setCollisionByExclusion([-1], true);

        // Crear grupo de objetos rompibles
        this.breakableGroup = this.physics.add.group();

    ;

        // Crear objetos rompibles desde la capa de objetos 'Breakables'
        const breakablesObjectLayer = map.getObjectLayer('Breakables');
        if (breakablesObjectLayer) {
            breakablesObjectLayer.objects.forEach(obj => {
                const breakableType = obj.properties?.find(p => p.name === 'breakable')?.value;
                if (breakableType === 'table') {
                    const breakable = new BreakableObjects(this, obj.x, obj.y, 112, 25,'breakable-table');
                    this.breakableGroup.add(breakable);
                    breakable.body.setImmovable(true);  // Asegurar que el objeto sea inmovible
                }

                if (breakableType === 'chair') {
                    const breakable = new BreakableObjects(this, obj.x, obj.y, 16,16,'breakable-chair');
                    this.breakableGroup.add(breakable);
                    breakable.body.setImmovable(true);  // Asegurar que el objeto sea inmovible
                }


                
            });
        }

        this.bulletGroup = this.physics.add.group();
        this.enemyGroup = this.physics.add.group();
        this.enemyBulletGroup = this.physics.add.group();
        this.player = new Player(this, this.xSpawn, this.ySpawn, data.playerStats);

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


        this.physics.add.collider(this.player, this.breakableGroup);
        this.physics.add.collider(this.enemyGroup, this.breakableGroup);
        this.physics.add.collider(this.breakableGroup, this.enemyBulletGroup, (breakable, bullet) => {
            breakable.hitBullet(breakable, bullet);
        });
        

        const teacher = new NPC(this, 255, 104);
        teacher.on('npcDeath', (x, y) => {
            const boss = new miniBossLab(this, x, y, "nerd");
            boss.invulnerable = true;
            boss.setTint(0x999999);
            this.enemyGroup.add(boss);
            this.numEnemies = 3;
        });

        this.physics.world.setBounds(0, 0, this.bound1, this.bound2);
        this.cameras.main.setBounds(-100, 0, this.bound1, this.bound2);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setZoom(1.8);

        this.transitionZones = this.physics.add.group();
        let transitionLayer = map.getObjectLayer("Transiciones");
        transitionLayer.objects.forEach(obj => {
            const zone = this.transitionZones.create(obj.x, obj.y, null).setSize(obj.width, obj.height).setOrigin(0, 0).setOffset(0, 0);
            zone.spawnRoom = obj.properties.find(p => p.name === "spawnRoom")?.value;
            zone.spawnX = obj.properties.find(p => p.name === "spawnX")?.value;
            zone.spawnY = obj.properties.find(p => p.name === "spawnY")?.value;
            zone.prev = "FDI_2_2";
        });
        this.transitionZones.setVisible(false);
        this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);
    }

}
