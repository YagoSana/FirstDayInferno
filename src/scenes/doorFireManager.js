export default class DoorFireManager {
    constructor(scene) {
        this.scene = scene;
        this.doorFires = scene.physics.add.group({
            immovable: true, // Importante para que no se muevan al colisionar
            allowGravity: false
        });
        this.fireColliders = []; // Para almacenar las colisiones
        this.fireCreated = false;
    }

    checkCreatedFire(transitionZones) {
        return this.fireCreated;
    }

    createFiresForZones(transitionZones) {
        this.doorFires.clear(true, true); // Limpiar fuegos existentes

        transitionZones.getChildren().forEach(zone => {
            const noFire = (zone.name == "noFire");
            const doorWidth = zone.body.width;
            const doorHeight = zone.body.height;
            const isVertical = doorHeight > doorWidth;
            // console.log("Dimensiones reales:", doorWidth, doorHeight, isVertical);
            let fireHeight = 32; // Tamaño de tu sprite de fuego
            let fireWidth = 32;
            let fireOverlap = 20; // Solapamiento entre fuegos (ajustable)
            // console.log(doorHeight, doorWidth, isVertical);

            if (!noFire) {
                if (isVertical) {
                    let segmentCount = Math.ceil(doorHeight / (fireHeight - fireOverlap));

                    for (let i = 0; i < segmentCount; i++) {
                        let yPos = zone.y + (i * (fireHeight - fireOverlap));
                        // console.log(yPos);
                        this.createFire(
                            zone.x + doorWidth / 2,
                            yPos + fireHeight / 2,
                            true
                        );
                    }
                } else {
                    let segmentCount = Math.ceil(doorWidth / (fireWidth - fireOverlap));

                    for (let i = 0; i < segmentCount; i++) {
                        let xPos = zone.x + (i * (fireWidth - fireOverlap));

                        this.createFire(
                            xPos + fireWidth / 2 - 8,
                            zone.y + doorHeight / 2,
                            false
                        );
                    }
                }
            }

        });
        this.fireCreated = true;

        this.startFireAnimation();
    }

    createFire(x, y, isVertical) {
        const fire = this.scene.add.sprite(x, y, 'fire')
            .setDepth(2);

        if (isVertical) {//esto es para que el sprite cuadre con la hitbox en vertical
            fire.setOrigin(0.5, 1);
        }

        // Añadir cuerpo de física
        this.scene.physics.add.existing(fire);
        let fireSize = 16;
        fire.body.setSize(fireSize, fireSize);

        if (!isVertical) { //esto es para que el sprite cuadre con la hitbox en horizontal
            fire.body.setOffset(fireSize / 2, fireSize);
        }

        this.doorFires.add(fire);
        return fire;
    }

    setupCollisions(player) {
        // Limpiar colisiones previas
        this.fireColliders.forEach(collider => collider.destroy());
        this.fireColliders = [];

        // Crear colisión entre fuego y jugador
        this.fireColliders.push(
            this.scene.physics.add.collider(player, this.doorFires, this.handleFireCollision, null, this)
        );
    }

    handleFireCollision(player, fire) {
        player.hurtByFire();
    }

    startFireAnimation() {
        this.doorFires.getChildren().forEach(fire => {
            fire.play('fire_start');
            fire.once('animationcomplete', (animation) => {
                if (animation.key === 'fire_start') {
                    fire.play('fire_loop');
                }
            });
        });
    }

    endFireAnimation() {
        const fires = this.doorFires.getChildren();

        fires.forEach(fire => {
            // Detener animaciones y físicas primero
            fire.anims.stop();
            if (fire.body) fire.body.enable = false;

            // Reproducir animación final
            fire.play('fire_end');

            // Destrucción segura
            fire.once('animationcomplete', () => {
                // Eliminar todos los listeners primero
                fire.removeAllListeners();

                // Destruir completamente
                if (fire.scene) {
                    fire.destroy();
                } else {
                    fire.setActive(false).setVisible(false);
                }
            }, this);
        });

        this.fireCreated = false;
        this.doorFires.clear(true, true);
    }
}