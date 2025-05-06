import SalaBase from "./salaBase.js";
import Player from "../gameObjects/characters/player.js";
import Item from "../gameObjects/items/item.js";
import VendingMachine from "../gameObjects/items/vendingMachine.js";
import Bartender from "../gameObjects/items/bartender.js";
import DialogueNPC from "../gameObjects/items/DialogueNPC.js";

export default class Tutorial_debug extends SalaBase {
    constructor(key) {
        super('tutorial_debug');
    }

    create() {
        super.create('tutorial_debug');

        const map = this.make.tilemap({ key: 'tutorial_debug' });

        //Cargar tilesets
        const tileset1 = map.addTilesetImage('Interiors_free_16x16', 'Interior');
        const tileset2 = map.addTilesetImage('Room_Builder_free_16x16', 'Muebles');

        //Configurar capas
        const layer1 = map.createLayer('suelo', [tileset1, tileset2], 0, 0);
        const layer2 = map.createLayer('pared', [tileset1, tileset2], 0, 0);

        layer2.setCollisionByExclusion([-1], true);

        this.bulletGroup = this.physics.add.group();
        this.player = new Player(this, this.xSpawn, this.ySpawn, this.playerStats);

        //Colisiones
        this.physics.add.collider(this.player, layer2);
        this.physics.add.collider(this.bulletGroup, layer2, this.onBulletCollision);

        //Camaras
        const screenWidth = this.sys.game.config.width; // Ancho de tu pantalla
        const screenHeight = this.sys.game.config.height; // Alto de tu pantalla
        const mapWidth = map.widthInPixels;
        const mapHeight = map.heightInPixels;
        const zoom = 2;
        const boundX = -(screenWidth / zoom - mapWidth) / 2;
        const boundY = -(screenHeight / zoom - mapHeight) / 2;
        console.log("BoundX calculado:", Math.round(boundX));


        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.cameras.main.setZoom(zoom);
        this.cameras.main.setBounds(boundX, 0, map.widthInPixels, map.heightInPixels);

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);


        this.transitionZones = this.physics.add.group();
        let transitionLayer = map.getObjectLayer("transiciones");
        transitionLayer.objects.forEach(obj => {
            const zone = this.transitionZones.create(obj.x, obj.y, null)
                .setSize(obj.width, obj.height).setOrigin(0, 0).setOffset(0, 0);
            zone.spawnRoom = obj.properties.find(p => p.name === "spawnRoom")?.value;
            zone.spawnX = obj.properties.find(p => p.name === "spawnX")?.value;
            zone.spawnY = obj.properties.find(p => p.name === "spawnY")?.value;
            zone.prev = "tutorial_debug";
        });
        this.transitionZones.setVisible(false);
        this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);


        const frasesCoche = [
            "Kuchau",
            "Brrrrrrr",
            "(sonidos de coche y tal)",
        ];

        let spritesLayer = map.getObjectLayer("sprites");
        spritesLayer.objects.forEach(obj => {
            let type = obj.properties.find(p => p.name === "tipo")?.value;
            // console.log(`Tipo del objeto de tiled ${type}`);
            if (type === "util") {
                let vm = new VendingMachine(this, obj.x, obj.y);
            }
            else if (type === "item") {
                let it = new Item(this, obj.x, obj.y, obj.name);
            }
            else if (type === "merchant") {
                let car = new DialogueNPC(this, obj.x, obj.y + 32, 'car', 'coche', frasesCoche, false, " ", 0, 'tinto');
            }
        });

        // new Item(this, 200, 200, "hamburguesa");
    }
}