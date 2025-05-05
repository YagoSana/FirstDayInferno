import SalaBase from "../../scenes/salaBase.js";
import Player from "../../gameObjects/characters/player.js";
import Enemy from "../../gameObjects/enemies/enemy.js";
import Item from "../../gameObjects/items/item.js";
import LiterallyJustAToilet from "../../gameObjects/items/literallyJustAToilet.js";

export default class FDI_2_3 extends SalaBase {
    constructor(key) {
        super('FDI_2_3');
    }

    create() {
        super.create('FDI_2_3');
        const map = this.make.tilemap({ key: 'FDI_2_3_TL' }); // Cargamos el mapa

        // Cargar tilesets
        const tileset1 = map.addTilesetImage('Interiors_free_16x16', 'Interior');
        const tileset2 = map.addTilesetImage('Room_Builder_free_16x16', 'Muebles');
        const tileset3 = map.addTilesetImage('tileset_nuevo', 'Decorado');

        // Configurar capas
        const layer1 = map.createLayer('suelo', [tileset1, tileset2], 0, 0);
        const layer2 = map.createLayer('pared', [tileset1, tileset2, tileset3], 0, 0);
        const layer3 = map.createLayer('sin colision', [tileset1, tileset2, tileset3], 0, 0);
        const layer4 = map.createLayer('objetos', [tileset1, tileset2, tileset3], 0, 0);
        const layer6 = map.createLayer('techo', [tileset1, tileset2], 0, 0);

        // Configuración de capas y colisiones
        layer3.setDepth(0);
        layer2.setCollisionByExclusion([-1], true);
        layer4.setCollisionByExclusion([-1], true);
        layer6.setCollisionByExclusion([-1], true);

        // Crear grupo de objetos 'toilet' con físicas
        this.toilets = this.physics.add.group();

        // Definir las coordenadas x e y fuera del bloque condicional
        let toiletX = 0;
        let toiletY = 0;

        // Cargar los objetos 'toilet' desde la capa correspondiente
        const toiletLayer = map.getObjectLayer('toilet');
        if (toiletLayer && toiletLayer.objects.length > 0) {
            // Buscar el primer objeto en la capa de objetos 'toilet'
            const toiletObject = toiletLayer.objects[0];  // Aquí buscamos solo el primer objeto

            // Verificar que el objeto existe antes de continuar
            if (toiletObject) {
                // Guardar las coordenadas x e y del primer objeto encontrado
                toiletX = toiletObject.x;
                toiletY = toiletObject.y;
            }
        }

        // Crear el objeto del váter con las coordenadas obtenidas
        const toilet = new LiterallyJustAToilet(this, toiletX, toiletY, 32, 32, 'toilet');
        this.toilets.add(toilet);  // Añadir el objeto al grupo de físicas
        toilet.body.setImmovable(true);  // Hacer que el objeto sea inmovible, como los objetos rompibles

        // Crear grupos para enemigos, balas, etc.
        this.bulletGroup = this.physics.add.group();
        this.enemyGroup = this.physics.add.group();
        this.enemyBulletGroup = this.physics.add.group();
        this.player = new Player(this, this.xSpawn, this.ySpawn, this.playerStats);

        // Colisiones con las capas del mapa
        this.physics.add.collider(this.player, layer2);
        this.physics.add.collider(this.enemyGroup, layer2);
        this.physics.add.collider(this.bulletGroup, layer2, this.onBulletCollision);
        this.physics.add.collider(this.enemyBulletGroup, layer2, this.onBulletCollision);

        this.physics.add.collider(this.player, layer4);
        this.physics.add.collider(this.enemyGroup, layer4);
        this.physics.add.collider(this.bulletGroup, layer4, this.onBulletCollision);
        this.physics.add.collider(this.enemyBulletGroup, layer4, this.onBulletCollision);

        this.physics.add.collider(this.player, layer6);
        this.physics.add.collider(this.enemyGroup, layer6);
        this.physics.add.collider(this.bulletGroup, layer6, this.onBulletCollision);
        this.physics.add.collider(this.enemyBulletGroup, layer6, this.onBulletCollision);

        // Colisiones entre el grupo de objetos 'toilet' y el jugador
        this.physics.add.collider(this.player, this.toilets, this.onToiletInteraction, null, this);

        // Configuración de cámaras
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(-150, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setZoom(1.8);

        // Transiciones entre salas
        this.transitionZones = this.physics.add.group();
        let transitionLayer = map.getObjectLayer("transiciones");

        transitionLayer.objects.forEach(obj => {

            const zone = this.transitionZones.create(obj.x, obj.y, null).setSize(obj.width, obj.height).setOrigin(0, 0).setOffset(0, 0);
            zone.spawnRoom = obj.properties.find(p => p.name === "spawnRoom")?.value;
            zone.spawnX = obj.properties.find(p => p.name === "spawnX")?.value;
            zone.spawnY = obj.properties.find(p => p.name === "spawnY")?.value;
            zone.prev = "FDI_2_3";
            zone.open = false;
        });

        this.transitionZones.setVisible(false);
        this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);
        this.doorFireManager.createFiresForZones(this.transitionZones);
        this.doorFireManager.setupCollisions(this.player);
    }

    spawnProps() {

    }

    spawnBlood() {
        this.add.sprite(154, 210, "blood").setVisible(true).setDepth(3).setFrame(12);
    }
}
