import SalaBase from "../../scenes/salaBase.js";
import Player from "../../gameObjects/characters/player.js";
import VendingMachine from "../../gameObjects/items/vendingMachine.js";
import Bartender from "../../gameObjects/items/bartender.js";
import Phaser from "phaser";

export default class FDI_4 extends SalaBase {

    constructor(key) {
        super('FDI_4');
    }

    create() {
        super.create('FDI_4');

        const map = this.make.tilemap({ key: 'FDI_4_TL' });
        const tileset1 = map.addTilesetImage('Interiors_free_16x16', 'Interior');
        const tileset2 = map.addTilesetImage('Room_Builder_free_16x16', 'Muebles');
        const tileset3 = map.addTilesetImage('tileset_nuevo', 'Decorado');

        const layer1 = map.createLayer('suelo', [tileset1, tileset2, tileset3], 0, 0);
        const layer2 = map.createLayer('pared', [tileset1, tileset2, tileset3], 0, 0);
      
        const layer3 = map.createLayer('objetos', [tileset1, tileset2, tileset3], 0, 0);
        const layer4 = map.createLayer('objetos2', [tileset1, tileset2, tileset3], 0, 0);
          const layer5 = map.createLayer('sin colisiones', [tileset1, tileset2, tileset3], 0, 0);
        const layer6 = map.createLayer('techo', [tileset1, tileset2, tileset3], 0, 0);
        const layer7 = map.createLayer('decoracion', [tileset1, tileset2, tileset3], 0, 0);

        layer2.setCollisionByExclusion([-1], true);
        layer3.setCollisionByExclusion([-1], true);
        layer6.setCollisionByExclusion([-1], true);
        layer4.setCollisionByExclusion([-1], true);

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

    //Camaras
    const screenWidth = this.sys.game.config.width; // Ancho de tu pantalla
    const screenHeight = this.sys.game.config.height; // Alto de tu pantalla
    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;
    const zoom = 2;
    const boundX = -(screenWidth / zoom - mapWidth) / 2;
    const boundY = -(screenHeight / zoom - mapHeight) / 2;

    console.log(boundX,boundY);

    this.cameras.main.setZoom(zoom);
    this.cameras.main.setBounds(boundX, boundY, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Ajustar límites del mundo y cámara
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);


        if (!this.status) {
            this.spawnProps();
        } else {
            this.spawnBlood();
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
        this.physics.add.overlap(this.player, this.transitionZones, (player, zone) => {
            if (this.currentMusic) {
                this.currentMusic.stop();
                this.currentMusic.destroy();
                this.currentMusic = null;
            }
            this.cambiarSala(player, zone);
        }, null, this);

        const spawnLayer = map.getObjectLayer('spawn');
        if (spawnLayer) {
            spawnLayer.objects.forEach(obj => {
                const spawnType = obj.properties?.find(p => p.name === 'spawn')?.value;
                if (spawnType === 'bartender') {
                    let spawneable = new Bartender(this, obj.x, obj.y - 10, 'bartender');
                }
                else if (spawnType === 'vendingMachine') {
                    let vm = new VendingMachine(this, obj.x, obj.y);
                }
            }
            )
        };

        // Música aleatoria sin repetición inmediata
        const musicTracks = ['musicaCafe1', 'musicaCafe2', 'musicaCafe3', 'musicaCafe4'];
        let previousTrack = null;

        const playRandomMusic = () => {
            const options = musicTracks.filter(track => track !== previousTrack);
            const chosen = Phaser.Utils.Array.GetRandom(options);
            previousTrack = chosen;

            this.currentMusic = this.sound.add(chosen, { volume: 0.1 });
            this.currentMusic.play();

            this.currentMusic.once('complete', () => {
                this.currentMusic.destroy();
                this.currentMusic = null;
                playRandomMusic();
            });
        };

        playRandomMusic();
    }

    spawnProps() {
        // this.enemyGroup.add(new Enemy(this, 154, 210, "cucaracha"));
        // this.numEnemies++;
    }

    spawnBlood() {
        // ...
    }
}
