import Phaser from 'phaser';
import SpriteBase from '../spriteBase';
import Item from './item';

export default class breakableObject extends Item {
    /*
    Clase que define a un objeto rompible.
    */
    constructor(scene, x, y) {
        super(scene, x, y, 'BreakableObject');

        this.maxBulletHits = 3; // Disparos necesarios para destruirse
        this.bulletHits = 0;   
        this.isBroken = false;

        // (Opcional) Texto para debug o UI
        this.bulletText = scene.add.text(x, y - 30, '', {
            fontSize: '12px',
            color: '#ffffff'
        }).setOrigin(0.5);
    }

    hitBullet(object, bullet) {
        bullet.explode();
        if (this.isOperational) {
            this.bulletHits++;
            this.updateDamageEffect(); // Mostrar daño visual

            // Actualizar texto de daño (si quieres quitarlo, comenta esta línea)
            this.bulletText.setText(`Disparos: ${this.bulletHits}/${this.maxBulletHits}`);

            // Verificar si alcanzó el límite para romperse
            if (this.bulletHits >= this.maxBulletHits) {
                this.breakObject();
            }
        }
    }

    updateDamageEffect() {
        const damageRatio = this.bulletHits / this.maxBulletHits;

        // Aplicar tinte progresivo según el daño
        if (damageRatio < 0.34) {
            this.setTint(0xffffff); // Sin daño
        } else if (damageRatio < 0.67) {
            this.setTint(0xffff66); // Amarillo (daño leve)
        } else {
            this.setTint(0xff6666); // Rojo (daño crítico)
        }

        // Efecto de parpadeo breve
        this.scene.tweens.add({
            targets: this,
            alpha: 0.5,
            duration: 50,
            yoyo: true,
            repeat: 0
        });
    }

    breakObject() {
        this.isBroken = true;
        this.bulletHits = 0;

        this.emit('ObjectBroken', this.x, this.y);

        // (Opcional) Efecto de partículas al romperse
        this.spawnBreakParticles();

        this.bulletText.destroy(); // Eliminar el texto de disparos
        this.destroy();
    }

    spawnBreakParticles() {
        const particles = this.scene.add.particles('flares'); // Usa un sprite de partículas, asegúrate de tenerlo cargado

        const emitter = particles.createEmitter({
            frame: 'red',
            x: this.x,
            y: this.y,
            speed: { min: -100, max: 100 },
            angle: { min: 0, max: 360 },
            lifespan: 500,
            quantity: 10,
            scale: { start: 0.5, end: 0 },
            on: false
        });

        emitter.explode(10, this.x, this.y);
    }
}
