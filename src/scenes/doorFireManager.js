export default class DoorFireManager {
    constructor(scene) {
        this.scene = scene;
        this.doorFires = scene.physics.add.group();
    }

    createFiresForZones(transitionZones) {
        this.doorFires.clear(true, true); // Limpiar fuegos existentes

        transitionZones.getChildren().forEach(zone => {
            const { width: doorWidth, height: doorHeight, x, y } = zone;
            const isVertical = doorHeight > doorWidth;
            const fireSize = 16; // Tamaño de tu sprite de fuego
            const fireCount = isVertical 
                ? Math.ceil(doorHeight / fireSize) 
                : Math.ceil(doorWidth / fireSize);

            for (let i = 0; i < fireCount; i++) {
                const posX = isVertical ? x + doorWidth/2 : x + i * fireSize;
                const posY = isVertical ? y + i * fireSize : y + doorHeight/2;
                
                const fire = this.scene.add.sprite(posX, posY, 'fire')
                    .setDepth(10)
                    .setOrigin(isVertical ? 0.5 : 0, isVertical ? 0 : 0.5);

                this.doorFires.add(fire);
            }
        });

        this.startFireAnimation();
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
        this.doorFires.getChildren().forEach(fire => {
            fire.play('fire_end');
            // fire.setVisible(false);
            
            fire.once('animationcomplete', () => {
                fire.destroy();
            });
        });
    }

    destroy() {
        this.doorFires.clear(true, true);
    }
}