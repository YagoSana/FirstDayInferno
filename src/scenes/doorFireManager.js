export default class DoorFireManager {
    constructor(scene) {
        this.scene = scene;
        this.doorFires = scene.physics.add.group({
            immovable: true, // Importante para que no se muevan al colisionar
            allowGravity: false
        });
        this.fireColliders = []; // Para almacenar las colisiones
    }

    createFiresForZones(transitionZones) {
        this.doorFires.clear(true, true); // Limpiar fuegos existentes

        transitionZones.getChildren().forEach(zone => {
            const doorWidth = zone.body.width;
            const doorHeight = zone.body.height;
            const isVertical = doorHeight > doorWidth;
            // console.log("Dimensiones reales:", doorWidth, doorHeight, isVertical);

            const fireHeight = 32; // Tamaño de tu sprite de fuego
            const fireOverlap = 8; // Solapamiento entre fuegos (ajustable)
            // console.log(doorHeight, doorWidth, isVertical);

            if (isVertical) {
                // PUERTAS VERTICALES (ej. 16x48)
                const segmentHeight = 32; // Altura por segmento de fuego
                const overlap = 20; // Solapamiento entre segmentos
                const segmentCount = Math.ceil(doorHeight / (segmentHeight - overlap));
    
                for (let i = 0; i < segmentCount; i++) {
                    const yPos = zone.y + (i * (segmentHeight - overlap));
                    // console.log(yPos);
                    this.createFire(
                        zone.x + doorWidth/2,
                        yPos + segmentHeight/2,
                        true
                    );
                }
            } else {
                // PUERTAS HORIZONTALES
                const segmentWidth = 16;
                for (let i = 0; i < Math.ceil(doorWidth / segmentWidth); i++) {
                    this.createFire(
                        zone.x + (i * segmentWidth),
                        zone.y + doorHeight/2,
                        false
                    );
                }
            }
    
  
        });

        this.startFireAnimation();
    }

    createFire(x, y, isVertical) {
        const fire = this.scene.add.sprite(x, y, 'fire')
            .setDepth(10)
            .setOrigin(0.5,1);

              // Añadir cuerpo de física
        this.scene.physics.add.existing(fire);
        fire.body.setSize(
            isVertical ? 16 : 16,  // Ancho del cuerpo de colisión
            isVertical ? 16 : 16   // Alto del cuerpo de colisión
        );
        
        this.doorFires.add(fire);
        return fire;
    }

    setupCollisions(player) {
        // Limpiar colisiones previas
        this.fireColliders.forEach(collider => collider.destroy());
        this.fireColliders = [];

        // Crear colisión entre fuego y jugador
        this.fireColliders.push(
            this.scene.physics.add.collider(
                player,
                this.doorFires,
                this.handleFireCollision,
                null,
                this
            )
        );
    }

    // handleFireCollision(player, fire) {
    //     // Efecto cuando el jugador toca el fuego
    //     player.takeDamage(1); // Ejemplo: quitar 1 de vida
    //     // Puedes añadir efectos visuales/sonidos aquí
    // }

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

        this.doorFires.clear(true, true);
    }
}