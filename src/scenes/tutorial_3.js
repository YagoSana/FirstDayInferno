import SalaBase from "./salaBase.js";
import Player from "../gameObjects/characters/player.js";

export default class Tutorial_3 extends SalaBase {
    constructor(key) {
        super('tutorial_3');
    }

    create() {
        super.create('tutorial_3');

        const map = this.make.tilemap({ key: 'tutorial_3' });

        //Cargar tilesets
        const tileset1 = map.addTilesetImage('Interiors_free_16x16', 'Interior');
        const tileset2 = map.addTilesetImage('Room_Builder_free_16x16', 'Muebles');

        //Configurar capas
        const layer1 = map.createLayer('suelo', [tileset1, tileset2], 0, 0);
        const layer2 = map.createLayer('pared sin colision', [tileset1, tileset2], 0, 0);
        const layer3 = map.createLayer('pared con colision', [tileset1, tileset2], 0, 0);
        const layer4 = map.createLayer('sin colision', [tileset1, tileset2], 0, 0);
        const layer5 = map.createLayer('techo', [tileset1, tileset2], 0, 0);

        layer3.setCollisionByExclusion([-1], true);
        layer5.setCollisionByExclusion([-1], true);

        this.bulletGroup = this.physics.add.group();
        this.player = new Player(this, this.xSpawn, this.ySpawn, this.playerStats);

        //Colisiones
        this.physics.add.collider(this.player, layer3);
        this.physics.add.collider(this.bulletGroup, layer3, this.onBulletCollision);

        this.physics.add.collider(this.player, layer5);
        this.physics.add.collider(this.bulletGroup, layer5, this.onBulletCollision);

        //Camaras
        const screenWidth = this.sys.game.config.width; // Ancho de tu pantalla
        const screenHeight = this.sys.game.config.height; // Alto de tu pantalla
        const mapWidth = map.widthInPixels;
        const mapHeight = map.heightInPixels;
        const zoom = 1.8;
        const boundX = -(screenWidth / zoom - mapWidth) / 2;
        const boundY = -(screenHeight / zoom - mapHeight) / 2;

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.cameras.main.setZoom(zoom);
        this.cameras.main.setBounds(boundX, boundY, map.widthInPixels, map.heightInPixels);

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        this.transitionZones = this.physics.add.group();
        let transitionLayer = map.getObjectLayer("transiciones");
        transitionLayer.objects.forEach(obj => {
            const zone = this.transitionZones.create(obj.x, obj.y, null).setSize(obj.width, obj.height);
            zone.spawnRoom = obj.properties.find(p => p.name === "spawnRoom")?.value;
            zone.spawnX = obj.properties.find(p => p.name === "spawnX")?.value;
            zone.spawnY = obj.properties.find(p => p.name === "spawnY")?.value;
            zone.prev = "tutorial_3";
        });
        this.transitionZones.setVisible(false);
        this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);
    }
}