import SalaBase from "../salaBase.js";
import Player from "../../gameObjects/characters/player.js";

export default class Tutorial_1 extends SalaBase {
    constructor(key) {
        super('tutorial_1');
    }

    create() {
        super.create('tutorial_1');

        const map = this.make.tilemap({ key: 'tutorial_1' });

        //Cargar tilesets
        const tileset1 = map.addTilesetImage('Interiors_free_16x16', 'Interior');
        const tileset2 = map.addTilesetImage('Room_Builder_free_16x16', 'Muebles');

        //Configurar capas
        const layer1 = map.createLayer('suelo', [tileset1, tileset2], 0, 0);
        const layer2 = map.createLayer('suelo2', [tileset1, tileset2], 0, 0);
        const layer3 = map.createLayer('pared sin colision', [tileset1, tileset2], 0, 0);
        const layer4 = map.createLayer('pared colision', [tileset1, tileset2], 0, 0);
        const layer5 = map.createLayer('sin colision encima', [tileset1, tileset2], 0, 0);
        const layer6 = map.createLayer('objetos', [tileset1, tileset2], 0, 0);
        const layer7 = map.createLayer('techo', [tileset1, tileset2], 0, 0);

        layer4.setCollisionByExclusion([-1], true);
        layer6.setCollisionByExclusion([-1], true);
        layer7.setCollisionByExclusion([-1], true);

        this.bulletGroup = this.physics.add.group();
        this.player = new Player(this, this.xSpawn, this.ySpawn, this.playerStats);


        //Colisiones
        this.physics.add.collider(this.player, layer4);
        this.physics.add.collider(this.bulletGroup, layer4, this.onBulletCollision);

        this.physics.add.collider(this.player, layer6);
        this.physics.add.collider(this.bulletGroup, layer6, this.onBulletCollision);

        this.physics.add.collider(this.player, layer7);
        this.physics.add.collider(this.bulletGroup, layer7, this.onBulletCollision);

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
            zone.prev = "tutorial_1";
        });
        this.transitionZones.setVisible(false);
        this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);

        let spritesLayer = map.getObjectLayer("sprites");
        spritesLayer.objects.forEach(obj => {
            let sprite = this.add.sprite(obj.x, obj.y, obj.name).setVisible(true).setDepth(0).play(obj.name);
            // Ajustar el origen si es necesario (Tiled usa esquina superior izquierda por defecto)
            sprite.setOrigin(0, 0); // Ajusta según tu necesidad
        });
    }
}