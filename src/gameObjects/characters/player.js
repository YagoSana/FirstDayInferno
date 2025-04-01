import Phaser from 'phaser';
import Bullet from '../projectiles/bullet.js';
import SpriteBase from '../spriteBase.js';

/**
 * Clase que representa el jugador del juego. El jugador se mueve por el mundo usando los cursores.
 * También almacena la puntuación o número de estrellas que ha recogido hasta el momento.
 */
export default class Player extends SpriteBase {

    /**
     * Constructor del jugador
     * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
     */
    constructor(scene, x, y, playerData = {}) {
        console.log("jugador", playerData);
        super(scene, x, y, 'player');
        this.body.setAllowGravity(false);
        this.health = playerData.health;
        this.maxHealth = playerData.maxHealth;
        this.coins = playerData.coins
        this.keys = playerData.keys;
        this.itemSprite = playerData.itemSprite; //Sprite del item visual
        this.equippedItem = playerData.equippedItem; // item que cambia apariencia
        this.equippedItemRow = playerData.equippedItemRow;
        if (this.equippedItem) {
            this.itemAppearance(this.equippedItem, this.equippedItemRow);
        }
        this.isShooting = false;
        this.depth = 5; // Asegura que el jugador este en la capa correcta
        this.setDepth(this.depth);
        this.speed = playerData.speed;
        this.body.setSize(12, 32);
        this.canChangeRoom = true;
        // Esta label es la UI en la que pondremos la puntuación del jugador
        this.label = this.scene.add.text(10, 10, "", { fontSize: 20 });
        this.label.setScrollFactor(0);
        this.label.setDepth(10);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.scene.physics.add.collider(this, scene.enemyBulletGroup, this.hurt, null, this);
        //this.scene.updateHealth(this.maxHealth, this.health);
        // Asignar controles de movimiento
        this.cursors = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.lastDirection = 'front'; // Por defecto, mirando al frente

        // Controles para disparar
        this.shootKeys = scene.input.keyboard.addKeys({
            shootUp: Phaser.Input.Keyboard.KeyCodes.UP,
            shootDown: Phaser.Input.Keyboard.KeyCodes.DOWN,
            shootLeft: Phaser.Input.Keyboard.KeyCodes.LEFT,
            shootRight: Phaser.Input.Keyboard.KeyCodes.RIGHT
        });

        this.lastShot = 0; // Tiempo del último disparo
        this.shootCooldown = playerData.shootCooldown; // En milisegundos
        this.damageCooldown = 200; // En milisegundos
        this.lastHurtTime = 0;  // Tiempo del último daño
        this.play("idle-front", true);

        //item
        this.nearItem = null; // item cercano que puede recogerse
        this.nearVendingMachine = null;
        this.pickupKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.sonidoDisparo = scene.sound.add('disparaJugador');
        this.sonidoAndar = scene.sound.add('andarJugador');
        this.sonidoMoneda = scene.sound.add('cogerMoneda');
        this.stepTimer = 0;
        this.stepInterval = 500; // o el valor que te mole para los pasos

    }

    /**
     * Métodos preUpdate de Phaser. En este caso solo se encarga del movimiento del jugador.
     * Como se puede ver, no se tratan las colisiones con las estrellas, ya que estas colisiones 
     * ya son gestionadas por la estrella (no gestionar las colisiones dos veces)
     * @override
     */
    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        if (this.anims.currentAnim.key != 'player-death') {
            // Manejo de disparo
            if (t > this.lastShot + this.shootCooldown) {
                if (this.shootKeys.shootUp.isDown)
                    this.shoot(0, -1);
                else if (this.shootKeys.shootDown.isDown)
                    this.shoot(0, 1);
                else if (this.shootKeys.shootLeft.isDown)
                    this.shoot(-1, 0);
                else if (this.shootKeys.shootRight.isDown)
                    this.shoot(1, 0);
            }
            let acceleration = 400; // Aceleración en px/s²
            let deceleration = 450; // Desaceleración en px/s²
            let maxSpeed = this.speed; // Velocidad máxima permitida

            let velocityX = this.body.velocity.x;
            let velocityY = this.body.velocity.y;

            let newAnimation = `idle-${this.lastDirection}`; // Animación por defecto

            if (this.cursors.up.isDown) {
                velocityY = Phaser.Math.Clamp(velocityY - acceleration * (dt / 1000), -maxSpeed, maxSpeed);
                this.lastDirection = 'back';
                newAnimation = "walk-back";
            } else if (this.cursors.down.isDown) {
                velocityY = Phaser.Math.Clamp(velocityY + acceleration * (dt / 1000), -maxSpeed, maxSpeed);
                this.lastDirection = 'front';
                newAnimation = "walk-front";
            } else {
                // Aplicar desaceleración progresiva cuando no se mueve
                velocityY = Phaser.Math.Clamp(velocityY - Math.sign(velocityY) * deceleration * (dt / 1000), -maxSpeed, maxSpeed);
                if (Math.abs(velocityY) < 10) velocityY = 0;
            }

            if (this.cursors.left.isDown) {
                velocityX = Phaser.Math.Clamp(velocityX - acceleration * (dt / 1000), -maxSpeed, maxSpeed);
                this.lastDirection = 'left';
                newAnimation = "walk-left";
            } else if (this.cursors.right.isDown) {
                velocityX = Phaser.Math.Clamp(velocityX + acceleration * (dt / 1000), -maxSpeed, maxSpeed);
                this.lastDirection = 'right';
                newAnimation = "walk-right";
            } else {
                velocityX = Phaser.Math.Clamp(velocityX - Math.sign(velocityX) * deceleration * (dt / 1000), -maxSpeed, maxSpeed);
                if (Math.abs(velocityX) < 10) velocityX = 0;
            }

            // Control del sonido de pasos
            if (velocityX !== 0 || velocityY !== 0) {
                this.stepTimer -= dt;

                if (this.stepTimer <= 0) {
                    this.sonidoAndar.play();
                    this.stepTimer = this.stepInterval;
                }
            } else {
                this.stepTimer = 0;
            }

            // 🔹 Normalizar velocidad en diagonal
            let speedMagnitude = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
            if (speedMagnitude > maxSpeed) {
                let scale = maxSpeed / speedMagnitude;
                velocityX *= scale;
                velocityY *= scale;
            }


            if (!this.isShooting) {
                if (velocityX === 0 && velocityY === 0) {
                    this.play(`idle-${this.lastDirection}`, true);
                } else {
                    this.anims.play(newAnimation, true);
                }
            }

            this.body.setVelocity(velocityX, velocityY);

            if (this.scene.time.now > this.lastHurtTime + this.damageCooldown) {
                this.setTint(0xffffff);
                if (this.itemSprite) {
                    this.itemSprite.setTint(0xffffff);
                }
            }

            if (this.nearVendingMachine) {
                if (Phaser.Input.Keyboard.JustDown(this.pickupKey)) {// Interacción con tecla E
                    if (!this.nearVendingMachine.isInUse) {
                        this.nearVendingMachine.useMachine();
                    }
                }

                // Verificar si el jugador se alejó de la máquina
                if (!this.nearVendingMachine.scene || !this.scene.physics.overlap(this, this.nearVendingMachine.interactionArea)) {
                    this.nearVendingMachine.hideInteractionUI();
                    this.nearVendingMachine = null;
                }

            }

            // Verificar si el jugador se alejó del objeto
            if (this.nearItem) {
                // Verificar si el ítem todavía existe
                if (!this.nearItem.scene || !this.scene.physics.overlap(this, this.nearItem)) {
                    this.nearItem.hidePickupHint(); // Ocultar la información del objeto
                    this.nearItem = null; // Limpiar nearItem
                }
                else if (Phaser.Input.Keyboard.JustDown(this.pickupKey)) { // Si el jugador esta cerca de un item y pulsa 'E' lo recoge
                    const itemToPick = this.nearItem;
                    this.nearItem = null;

                    if (itemToPick.pick) {
                        itemToPick.pick(this, this);
                    }
                }

            }

            // ACTUALIZAR EL SPRITE DEL ITEM SOLO SI HAY UN ITEM EQUIPADO
            if (this.itemSprite) {
                let lerpFactor = 1; // Ajusta este valor para hacer el movimiento más suave
                this.itemSprite.x = Phaser.Math.Linear(this.itemSprite.x, this.x, lerpFactor);
                this.itemSprite.y = Phaser.Math.Linear(this.itemSprite.y, this.y, lerpFactor);


                let frameIndex = this.equippedItemRow * 8; // 🆕 Calculamos la fila
                if (this.isShooting) {
                    frameIndex += 4; // Los últimos 4 frames son de disparo
                }

                const directionIndex = {
                    "front": 0,
                    "back": 1,
                    "left": 2,
                    "right": 3
                }[this.lastDirection] || 0;

                const newFrame = frameIndex + directionIndex;
                if (this.itemSprite.frame.name !== newFrame && !this.isShooting) {
                    // console.log(`newframe: ${newFrame}`);
                    this.itemSprite.setFrame(newFrame);
                }
            }
        }
        else {
            if (this.itemSprite) {
                this.itemSprite.destroy(); // Elimina el sprite anterior si ya hay uno
            }
            this.body.setVelocity(0, 0);
            this.setTint(0xffffff);
        }
    }

    //Cambia la apariencia del jugador con un item
    itemAppearance(itemKey, spriteRow) {
        const spriteKey = `player_items`;
        this.equippedItemRow = spriteRow;

        if (this.itemSprite) {
            this.itemSprite.destroy(); // Elimina el sprite anterior si ya hay uno
        }
        // Crea el nuevo sprite del ítem sobre el jugador
        this.itemSprite = this.scene.add.sprite(this.x, this.y, spriteKey);
        this.depth = 5; // Asegura que el jugador este en la capa correcta
        this.itemSprite.depth = this.depth + 1; // Asegura que esté sobre el jugador
        this.itemSprite.setDepth(this.itemSprite.depth); // Asegura que esté sobre el jugador
        console.log(`Item ${itemKey}: equipado en fila ${spriteRow + 1}`);
        // console.log("jugador", this.depth);

        this.equippedItem = itemKey; // Guarda el ítem equipado
        this.scene.game.events.emit('playerState', { item: this.equippedItem, state: 'idle' });

        // console.log(`Item ${this.equippedItem}: equipado`);
    }

    shoot(dirX, dirY) {
        this.sonidoDisparo.play();
        // Verificar si ya está en cooldown
        if (this.scene.time.now < this.lastShot + this.shootCooldown) return;

        // Bloquea la animación de movimiento mientras dispara
        this.isShooting = true;

        // Determinar la dirección del disparo
        let shootAnimation = '';
        let newDirection = this.lastDirection; // Guardamos la dirección actual para restaurarla

        if (dirY === -1) {
            shootAnimation = 'shoot-back';
            newDirection = 'back';
        } else if (dirY === 1) {
            shootAnimation = 'shoot-front';
            newDirection = 'front';
        } else if (dirX === -1) {
            shootAnimation = 'shoot-left';
            newDirection = 'left';
        } else if (dirX === 1) {
            shootAnimation = 'shoot-right';
            newDirection = 'right';
        }

        // console.log(`disparando hacia: ${shootAnimation}`);

        this.lastDirection = newDirection;

        // Guardar la animación actual para volver a ella después del disparo
        const currentAnimation = `idle-${this.lastDirection}`;

        // Reproducir la animación de disparo
        this.play(shootAnimation);

        if (this.itemSprite) {
            const shootFrame = (this.equippedItemRow * 8) + 4 + {
                "front": 0,
                "back": 1,
                "left": 2,
                "right": 3
            }[this.lastDirection];

            // console.log(`ShootFrame: ${shootFrame}`)
            this.itemSprite.setFrame(shootFrame);
        }

        new Bullet(this.scene, this.x, this.y, dirX, dirY, this.body.velocity.x, this.body.velocity.y, true, "paperbullet");
        this.lastShot = this.scene.time.now; // Registrar tiempo del disparo

        // Volver a la animación anterior después de que termine la animación de disparo
        this.once('animationcomplete', () => {
            this.isShooting = false;
            this.play(currentAnimation);
        });
    }

    /**
     * El jugador ha sido dañado por un enemigo
     */
    hurt(player, bullet) {
        // Verificamos si el cooldown ha pasado desde el último daño
        const currentTime = this.scene.time.now; // Obtiene el tiempo actual en milisegundos
        if (currentTime - this.lastHurtTime >= this.damageCooldown) {
            this.setTint(0xff0000);
            if (this.itemSprite) {
                this.itemSprite.setTint(0xff0000);
            }

            this.health--; // Reducir vida
            this.scene.game.events.emit('healthChanged', { health: this.health, maxHealth: this.maxHealth });
            this.scene.game.events.emit('playerState', { item: this.equippedItem, state: 'hurt' });

            this.lastHurtTime = currentTime; // Actualizar el último tiempo de daño

            if (this.health <= 0) {
                this.play("player-death", true);
                this.once('animationcomplete', () => {
                    this.scene.scene.start('end'); // Finalizar el juego si la vida llega a 0
                });
            }

            //this.scene.updateHealth(this.maxHealth, this.health);
        }
        if (bullet) {
            bullet.explode();
        }
    }

    healthUp() {
        this.health++;
        this.scene.game.events.emit('healthChanged', { health: this.health, maxHealth: this.maxHealth });
        this.scene.game.events.emit('playerState', { item: this.equippedItem, state: 'good' });

        //this.scene.updateHealth(this.maxHealth, this.health);
    }

    maxHealthUp() {
        this.maxHealth++;
        //this.scene.updateHealth(this.maxHealth, this.health);
    }

    addCoin(amount) {
        this.coins += amount;
        console.log(`Monedas: ${this.coins}€`);
        this.scene.game.events.emit('coinChanged', this.coins);
        this.sonidoMoneda.play();
    }

    canAfford(price) {
        return this.coins >= price;
    }

    spendCoins(amount) {
        let ok = false;
        if (this.canAfford(amount)) {
            ok = true;
            this.coins -= amount;
        }
        console.log(`Monedas: ${this.coins}€`);
        this.scene.game.events.emit('coinChanged', this.coins);
        return ok;
    }

    slowDown() {
        this.speed /= 2;
    }

    getStats() {
        return {
            health: this.health,
            maxHealth: this.maxHealth,
            coins: this.coins,
            keys: this.keys,
            equippedItem: this.equippedItem,
            equippedItemRow: this.equippedItemRow,
            itemSprite: this.itemSprite,
            speed: this.speed,
            shootCooldown: this.shootCooldown
        };
    }
}
