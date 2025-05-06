import SalaBase from "../../scenes/salaBase.js";
import Player from "../../gameObjects/characters/player.js";
import Enemy from "../../gameObjects/enemies/enemy.js";
import Item from "../../gameObjects/items/item.js";
import DialogueNPC from "../../gameObjects/items/DialogueNPC.js";

export default class FDI_1 extends SalaBase {

    constructor(key) {
        super('FDI_1');
    }

    create() {
        super.create('FDI_1');

        const map = this.make.tilemap({ key: 'FDI_1_TL' }); // Cargamos el mapa
        
        // Cargar los sonidos
        this.engineSound = this.sound.add('motorSound', { loop: true, volume: 0 });

        // Empezar a reproducir el sonido
        this.engineSound.play();

        // Cargar tilesets
        const tileset1 = map.addTilesetImage('Interiors_free_16x16', 'Interior');
        const tileset2 = map.addTilesetImage('Room_Builder_free_16x16', 'Muebles');
        const tileset3 = map.addTilesetImage('tileset_nuevo', 'Decorado');
        const tileset4 = map.addTilesetImage("TX Tileset Grass", "Grass");

        //Configurar capas
        const layer1 = map.createLayer('suelo', [tileset1, tileset2, tileset4], 0, 0);
        const layer2 = map.createLayer('pared', [tileset1, tileset2], 0, 0);
        const layer3 = map.createLayer('objetos', [tileset1, tileset2, tileset3], 0, 0);
        const layer4 = map.createLayer('sin colision', [tileset1, tileset2, tileset3], 0, 0);
        const layer5 = map.createLayer('techo', [tileset1, tileset2], 0, 0);

        layer4.setDepth(10);

        layer2.setCollisionByExclusion([-1], true);
        layer3.setCollisionByExclusion([-1], true);
        layer5.setCollisionByExclusion([-1], true);

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
        this.physics.add.collider(this.player, layer5);
        this.physics.add.collider(this.enemyGroup, layer5);
        this.physics.add.collider(this.bulletGroup, layer5, this.onBulletCollision);
        this.physics.add.collider(this.enemyBulletGroup, layer5, this.onBulletCollision);

        //Camaras
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setZoom(1.8);

        if (!this.status) {
            this.spawnProps();
        }
        else {
            this.spawnBlood();
        }
        
        this.transitionZones = this.physics.add.group();
        let transitionLayer = map.getObjectLayer("transiciones");

        transitionLayer.objects.forEach(obj => {
            const zone = this.transitionZones.create(obj.x, obj.y, null).setSize(obj.width, obj.height).setOrigin(0, 0).setOffset(0, 0);
            zone.spawnRoom = obj.properties.find(p => p.name === "spawnRoom")?.value;
            zone.spawnX = obj.properties.find(p => p.name === "spawnX")?.value;
            zone.spawnY = obj.properties.find(p => p.name === "spawnY")?.value;
            zone.prev = "FDI_1";
            zone.open = false;
        });

        this.transitionZones.setVisible(false);
        this.physics.add.overlap(this.player, this.transitionZones, this.cambiarSala, null, this);

        const frasesFilosoficas = [
            "Si pregunta la poli yo no te he dado nada.",
            "Pienso, luego me da ansiedad.",
            "¿Y si esta cerveza no existe?",
            "El verdadero examen es el que nos hace la vida.",
            "No suspendo, exploro caminos alternativos."
        ];

        const frasesEstudiante = [
            "Estoy en una relación estable… con mi compilador.",
            "Dicen que tengo ‘carácter’, pero solo uso strings.",
            "No sudo, hago overclock.",
            "Bombardeen FAL",
            "Bebo para olvidar que existe algoritmia"
        ];

        const frasesVendedor = [
            "Clases hay muchas, sangriadas, de vez en cuando",
            "Ni siquiera estudio aquí",
            "2 lereles el mini",
            "Lo del coche ha sido histórico",
            "Se me ha olvidado traer el tequifresi"
        ];

        const frasesCoche = [
            "Kuchau",
            "Brrrrrrr",
            "(sonidos de coche y tal)",
        ];

        // NPCs
        this.npcGroup = this.physics.add.group();

        const spawnLayer = map.getObjectLayer('npcs');
        if (spawnLayer) {
            spawnLayer.objects.forEach(obj => {
                const spawnType = obj.properties?.find(p => p.name === 'npc')?.value;
                if (spawnType === 'seller') {
                    let seller = new DialogueNPC(this, obj.x, obj.y, 'seller', 'Vendedor', frasesVendedor, true, "Un mini para el chaval", 0, "mini_tinto");
                    this.npcGroup.add(seller);
                    seller.body.setImmovable(true);
                }
                else if (spawnType === 'hippie') {
                    let hippie = new DialogueNPC(this, obj.x + 20, obj.y, 'hippie', 'Estudiante', frasesFilosoficas, true, "Para que te relajes un poco", 0, "bolsa_sospechosa");
                    this.npcGroup.add(hippie);
                }
                else if (spawnType === 'fdi_student') {
                    let student = new DialogueNPC(this, obj.x + 80, obj.y, 'fdi_student', 'Estudiante', frasesEstudiante, false, " ", 0, 'mini_tinto');
                    this.npcGroup.add(student);
                }
                else if (spawnType === 'crashed_car') {
                    let car = new DialogueNPC(this, obj.x , obj.y + 32, 'car', 'coche', frasesCoche,  false, " ", 0, 'tinto');
                    this.npcGroup.add(car);
                }
            });
        }

        this.npcGroup.children.iterate((npc) => {
            if (npc.body) {
                npc.body.setImmovable(true);
            }
        });
        
        this.physics.add.collider(this.player, this.npcGroup);
        this.physics.add.collider(this.bulletGroup, this.npcGroup,  this.onBulletCollision);

        // Rango de interacción con el coche
        this.time.addEvent({
            delay: 100, // Cada 100 ms
            callback: this.updateEngineSoundVolume,
            callbackScope: this,
            loop: true
        });
    }

    updateEngineSoundVolume() {
        // Encuentra el coche en el grupo
        let car = this.npcGroup.getChildren().find(npc => npc.nombre === 'coche');
        if (car) {
            // Calcula la distancia entre el jugador y el coche
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, car.x, car.y);

            // Rango de distancia para cambiar el volumen (ajusta estos valores)
            const maxDistance = 300;  // Distancia máxima para volumen completo
            const minDistance = 50;   // Distancia mínima para volumen más bajo

            // Normaliza la distancia
            let normalizedDistance = Phaser.Math.Clamp((distance - minDistance) / (maxDistance - minDistance), 0, 1);

            // Ajusta el volumen inversamente proporcional a la distancia
            this.engineSound.setVolume(1 - normalizedDistance);
        }
    }

    spawnProps() {
        // Función para generar otros objetos
    }

    spawnBlood() {
        this.add.sprite(154, 210, "blood").setVisible(true).setDepth(3).setFrame(12);
    }
}
