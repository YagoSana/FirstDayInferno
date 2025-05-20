import SalaBase from "../../scenes/salaBase.js";
import Player from "../../gameObjects/characters/player.js";
import Enemy from "../../gameObjects/enemies/enemy.js";
import rangedEnemy from "../../gameObjects/enemies/rangedEnemy.js";
import phantomEnemy from "../../gameObjects/enemies/phantomEnemy.js";
import RangedAreaEnemy from "../../gameObjects/enemies/rangedAreaEnemy.js";
import BreakableObjects from "../../gameObjects/items/breakableObject.js";
import Phaser from "phaser";

export default class FDI_5 extends SalaBase {
    constructor(key) {
        super('FDI_5');
    }

    create() {
        super.create('FDI_5');
        const map = this.make.tilemap({ key: 'FDI_5_TL' });

        const tileset1 = map.addTilesetImage('Interiors_free_16x16', 'Interior');
        const tileset2 = map.addTilesetImage('Room_Builder_free_16x16', 'Muebles');
        const tileset3 = map.addTilesetImage('tileset_nuevo', 'Decorado');

        const layer1 = map.createLayer('suelo', [tileset1, tileset2], 0, 0);
        const layer2 = map.createLayer('pared', [tileset1, tileset2], 0, 0);
        const layer4 = map.createLayer('suelo2', [tileset1, tileset2], 0, 0);
        const layer3 = map.createLayer('objetos', [tileset1, tileset2, tileset3], 0, 0);
        const layer5 = map.createLayer('sin colision', [tileset1, tileset2], 0, 0);
        const layer6 = map.createLayer('techo', [tileset1, tileset2], 0, 0);

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

        let screenWidth = this.sys.game.config.width; // Ancho de tu pantalla
        let screenHeight = this.sys.game.config.height; // Alto de tu pantalla
        let mapWidth = map.widthInPixels;
        let mapHeight = map.heightInPixels;
        let zoom = 2;
        let boundX = -(screenWidth / zoom - mapWidth) / 2;
        let boundY = -(screenHeight / zoom - mapHeight) / 2;

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.cameras.main.setZoom(zoom);
        this.cameras.main.setBounds(boundX, 0, map.widthInPixels, map.heightInPixels);

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // Transiciones
        this.transitionZones = this.physics.add.group();
        const transitionLayer = map.getObjectLayer("transiciones");
        transitionLayer.objects.forEach(obj => {
            const zone = this.transitionZones.create(obj.x, obj.y, null).setSize(obj.width, obj.height).setOrigin(0, 0).setOffset(0, 0);
            zone.spawnRoom = obj.properties.find(p => p.name === "spawnRoom")?.value;
            zone.spawnX = obj.properties.find(p => p.name === "spawnX")?.value;
            zone.spawnY = obj.properties.find(p => p.name === "spawnY")?.value;
            zone.prev = "FDI_5";
            zone.open = false;
        });
        this.transitionZones.setVisible(false);
        this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);

        // Spawns
        const enemySpawnLayer = map.getObjectLayer("spawn");
        this.spawnPoints = { spawn1: null, spawn2: null, spawn3: null, spawn4: null };

        enemySpawnLayer.objects.forEach(obj => {
            const spawnProp = obj.properties?.find(p => p.name === "spawn")?.value;
            if (this.spawnPoints.hasOwnProperty(spawnProp)) {
                this.spawnPoints[spawnProp] = { x: obj.x, y: obj.y };
                console.log(`Spawn encontrado: ${spawnProp} (${obj.x}, ${obj.y})`);
            }
        });

        // Variables de hordas
        this.currentWave = 0;
        this.totalWaves = 3;
        this.enemiesAlive = 0;
        this.numEnemies = 0;

        if (!this.status) {
            this.startNextWave();
        } else {
            this.spawBlood();
        }

        // Crear grupo de objetos rompibles
        this.breakableGroup = this.physics.add.group();

        // Crear objetos rompibles desde la capa de objetos 'Breakables'
        const breakablesObjectLayer = map.getObjectLayer('Breakables');
        if (breakablesObjectLayer) {
            breakablesObjectLayer.objects.forEach(obj => {
                const breakableType = obj.properties?.find(p => p.name === 'breakable')?.value;
                if (breakableType === 'chair') {
                    const breakable = new BreakableObjects(this, obj.x, obj.y, 16, 16, 'breakable-chair');
                    this.breakableGroup.add(breakable);
                    breakable.body.setImmovable(true);  // Asegurar que el objeto sea inmovible
                }
            });
        }

        // Colisiones de las balas de enemigos con objetos rompibles
        this.physics.add.overlap(this.breakableGroup, this.enemyBulletGroup, (breakable, bullet) => {
            breakable.hitBullet(breakable, bullet);  // Llamamos a la función que maneja el impacto
        });
        this.physics.add.collider(this.player, this.breakableGroup);
        this.physics.add.collider(this.enemyGroup, this.breakableGroup);
        this.physics.add.collider(this.breakableGroup, this.enemyBulletGroup, (breakable, bullet) => {
            breakable.hitBullet(breakable, bullet);
        });
        this.doorFireManager.createFiresForZones(this.transitionZones);
        this.doorFireManager.setupCollisions(this.player);
    }

    spawBlood() {
        this.add.sprite(154, 210, "blood").setVisible(true).setDepth(3).setFrame(12);
    }

    startNextWave() {
        if (this.currentWave >= this.totalWaves) {
            console.log("Todas las hordas completadas");
            return;
        }

        this.currentWave++;
        console.log(`Iniciando horda ${this.currentWave}`);

        const spawn = (SpawnClass, x, y, sprite, isArea = false, count = 1) => {
            for (let i = 0; i < count; i++) {
                const enemy = isArea
                    ? new SpawnClass(this, x, y, sprite, true)
                    : new SpawnClass(this, x, y, sprite);
                this.enemyGroup.add(enemy);
                this.enemiesAlive++;
                this.numEnemies++;

                enemy.on('destroy', () => {
                    this.enemiesAlive--;
                    if (this.enemiesAlive <= 0) {
                        this.time.delayedCall(1000, () => this.startNextWave(), [], this);
                    }
                });
            }
        };
        const s1 = this.spawnPoints['spawn1'];
        const s2 = this.spawnPoints['spawn2'];
        const s3 = this.spawnPoints['spawn3'];
        const s4 = this.spawnPoints['spawn4'];

        switch (this.currentWave) {
            case 1: {
                if (s1) spawn(Enemy, s1.x, s1.y, 'cucaracha', false, 1);
                if (s2) spawn(Enemy, s2.x, s2.y, 'cucaracha', false, 1);
                if (s3) spawn(phantomEnemy, s3.x, s3.y, 'phantom', false, 1);
                if (s4) spawn(phantomEnemy, s4.x, s4.y, 'phantom', false, 1);
                break;
            }
            case 2: {
                if (s1) spawn(Enemy, s1.x, s1.y, 'cucaracha');
                if (s2) spawn(phantomEnemy, s2.x, s2.y, 'phantom');
                if (s3) spawn(rangedEnemy, s3.x, s3.y, 'nerd');
                if (s4) spawn(rangedEnemy, s4.x, s4.y, 'nerd', false, 1);
                break;
            }
            case 3: {

                if (s3) spawn(RangedAreaEnemy, s3.x, s3.y, 'nerd', true, 2);
                if (s4) spawn(RangedAreaEnemy, s4.x, s4.y, 'nerd', true, 2);
                break;
            }
        }
    }
}
