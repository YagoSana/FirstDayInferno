import SalaBase from "../salaBase.js";
import Player from "../../gameObjects/characters/player.js";
import turretEnemy from "../../gameObjects/enemies/turretEnemy.js"
import Door from "../../gameObjects/items/door.js";
import Phaser from "phaser";

export default class FDI_2_1 extends SalaBase {

    constructor(key) {
        super('FDI_2_1');
    }

    create(data) {
        super.create(data);

        const map = this.make.tilemap({ key: 'FDI_2_1_TL' });

        // Cargar tilesets
        const tileset1 = map.addTilesetImage('Interiors_free_16x16', 'Interior');
        const tileset2 = map.addTilesetImage('Room_Builder_free_16x16', 'Muebles');
        const tileset3 = map.addTilesetImage('tileset_nuevo', 'Decorado');


        // Configurar capas normales
        const layer1 = map.createLayer('suelo', [tileset1, tileset2], 0, 0);
        const layer2 = map.createLayer('pared', [tileset1, tileset2, tileset3], 0, 0);
        const layer3 = map.createLayer('objetos', [tileset1, tileset2, tileset3], 0, 0);
        const layer4 = map.createLayer('techo', [tileset1, tileset2], 0, 0);
        const layer5 = map.createLayer('sin colisiones', [tileset1, tileset2], 0, 0);





        // Configurar colisiones normales
        layer2.setCollisionByExclusion([-1], true);
        layer4.setCollisionByExclusion([-1], true);
        layer3.setCollisionByExclusion([-1], true);

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

        this.physics.add.collider(this.player, layer3);
        this.physics.add.collider(this.enemyGroup, layer3);
        this.physics.add.collider(this.bulletGroup, layer3, this.onBulletCollision);
        this.physics.add.collider(this.enemyBulletGroup, layer3, this.onBulletCollision);

        this.physics.add.collider(this.player, layer4);
        this.physics.add.collider(this.enemyGroup, layer4);
        this.physics.add.collider(this.bulletGroup, layer4, this.onBulletCollision);
        this.physics.add.collider(this.enemyBulletGroup, layer4, this.onBulletCollision);

        // Ahora colisiones entre balas y breakableObjects

        // Camara
        let screenWidth = this.sys.game.config.width; // Ancho de tu pantalla
        let screenHeight = this.sys.game.config.height; // Alto de tu pantalla
        let mapWidth = map.widthInPixels;
        let mapHeight = map.heightInPixels;
        let zoom = 2;
        let boundX = -(screenWidth / zoom - mapWidth) / 2;
        let boundY = -(screenHeight / zoom - mapHeight) / 2;

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.cameras.main.setZoom(zoom);
        this.cameras.main.setBounds(0, boundY - 20, map.widthInPixels, map.heightInPixels);

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // Transiciones
        const transitionLayer = map.getObjectLayer("transiciones");
        transitionLayer.objects.forEach(obj => {
            const zone = this.transitionZones.create(obj.x, obj.y, null).setSize(obj.width, obj.height).setOrigin(0, 0).setOffset(0, 0);
            zone.spawnRoom = obj.properties.find(p => p.name === "spawnRoom")?.value;
            zone.spawnX = obj.properties.find(p => p.name === "spawnX")?.value;
            zone.spawnY = obj.properties.find(p => p.name === "spawnY")?.value;
            zone.prev = "FDI_2_1";
            //solo para la sala del boss
            zone.isBossTransition = obj.properties.find((p) => p.name === "isBossTransition")?.value || false;
            zone.bossKey = obj.properties.find((p) => p.name === "bossKey")?.value || "bossFDI";
        });
        this.transitionZones.setVisible(false);
        this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);

        let spritesLayer = map.getObjectLayer("sprites");
        spritesLayer.objects.forEach(obj => {
            let type = obj.properties.find(p => p.name === "tipo")?.value;
            if (type === "door") {
                let locked = this.playerStats.doorsLocked['fdiDoor'];
                new Door(this, obj.x, obj.y, 'fdiDoor', locked);
            }
        });
        this.doorFireManager.createFiresForZones(this.transitionZones);
        this.doorFireManager.setupCollisions(this.player);
    }

    cambiarSala(player, zone) {
        if (!zone.spawnRoom || !this.player.canChangeRoom || !zone.open) return;

        this.player.canChangeRoom = false;
        this.manager.guardarPlayerStats(this.player.getStats());

        this.time.delayedCall(1000, () => {
            this.player.canChangeRoom = true;
        });

        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            if (zone.isBossTransition) {
                // Si es transición al jefe, mostramos VS screen
                this.scene.stop();
                this.scene.start('VSScreen', {
                    bossKey: zone.bossKey,
                    nextScene: zone.spawnRoom, // medicina_6
                    playerStats: this.player.getStats(),
                    transitionData: zone,
                    managerKey: this.managerKey
                });
            } else {
                // Transición normal, vamos directamente a la otra sala
                this.scene.stop();
                this.manager.cambiarSala(zone);
            }
        });
    }

    spawnProps() {
        this.numEnemies = 2;
        this.enemyGroup.add(new turretEnemy(this, 750, 65, "printer"));
        this.enemyGroup.add(new turretEnemy(this, 750, 95, "printer"));


    }

    spawBlood() {
        this.add.sprite(100, 80, "blood").setVisible(true).setDepth(3).setFrame(12);
    }
}