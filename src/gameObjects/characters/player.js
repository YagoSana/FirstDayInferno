import Phaser from 'phaser';
import Bullet from '../projectiles/bullet.js';
import SpriteBase from '../spriteBase.js';
import FreezeBullet from '../projectiles/freezeBullet.js';

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
        this.doubleshoot = playerData.doubleshoot;
        this.doorsLocked = playerData.doorsLocked;
        this.playerTint = 0xffffff;
        this.bulletType = 'paperbullet';
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
        this.damageCooldown = 1000; // En milisegundos
        this.lastHurtTime = 0;  // Tiempo del último daño
        this.play("idle-front", true);

        //que enemigo dio al jugador
        this.lastDamageSource = null; // 'fire' o referencia al enemigo
        this.lastDamageType = null;   // 'enemy' | 'fire' | etc.

        //item
        this.nearItem = null; // item cercano que puede recogerse
        this.nearVendingMachine = null;
        this.nearDoor = null;
        this.pickupKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.sonidoDisparo = scene.sound.add('disparaJugador');
        this.sonidoAndar = scene.sound.add('andarJugador');
        this.sonidoMoneda = scene.sound.add('cogerMoneda');
        this.stepTimer = 0;
        this.stepInterval = 500;
        this.originalShootCooldown = this.shootCooldown; // cooldown original
        this.powerupTimer = false; // Temporizador para el powerup de parry
        this.rapidFireDuration = 3000; // 3 segundos de disparo rápido
        this.rapidFireActive = false;
        this.originalShootCooldown = this.shootCooldown; // Guardamos el cooldown original
        this.parryKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.lastParryTime = 0;
        this.parryWindow = 100; // en milisegundos, margen para hacer un parry perfecto
        this.isParrying = false;
        this.canParry = true;
        this.parryCooldown = 1000; // en milisegundos, cooldown del parry
        this.emitter = this.scene.emitterParry; // Emitter para el efecto de parry
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
                let x = 0, y = 0;

                if (this.shootKeys.shootUp.isDown) y = -1;
                else if (this.shootKeys.shootDown.isDown) y = 1;
                else if (this.shootKeys.shootLeft.isDown) x = -1;
                else if (this.shootKeys.shootRight.isDown) x = 1;

                if (x !== 0 || y !== 0) {
                    if (this.invertirDisparo) {
                        x = -x;
                        y = -y;
                    }
                    this.shoot(x, y);
                }
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

            // Normalizar velocidad en diagonal
            let speedMagnitude = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
            if (speedMagnitude > maxSpeed) {
                let scale = maxSpeed / speedMagnitude;
                velocityX *= scale;
                velocityY *= scale;
            }

            if (!this.isShooting && !this.isParrying) {
                if (velocityX === 0 && velocityY === 0) {
                    this.play(`idle-${this.lastDirection}`, true);
                } else {
                    this.anims.play(newAnimation, true);
                }
            }

            this.body.setVelocity(velocityX, velocityY);

            if (this.scene.time.now > this.lastHurtTime + this.damageCooldown) {
                this.setTint(this.playerTint);
                if (this.itemSprite) {
                    this.itemSprite.setTint(0xffffff);
                }
            }

            if (this.nearVendingMachine) {
                if (Phaser.Input.Keyboard.JustDown(this.pickupKey)) {
                    if (!this.nearVendingMachine.isInUse) {
                        this.nearVendingMachine.useMachine();
                    }
                }

                if (!this.nearVendingMachine.scene || !this.scene.physics.overlap(this, this.nearVendingMachine.interactionArea)) {
                    this.nearVendingMachine.hideInteractionUI();
                    this.nearVendingMachine = null;
                }

            }

            if (this.nearDoor) {
                if (Phaser.Input.Keyboard.JustDown(this.pickupKey)) {
                    this.nearDoor.unlock();
                }

                if (!this.nearDoor.scene || !this.scene.physics.overlap(this, this.nearDoor.interactionArea)) {
                    this.nearDoor.hideInteractionUI();
                    this.nearDoor = null;
                }
            }

            if (this.nearItem) {
                if (!this.nearItem.scene || !this.scene.physics.overlap(this, this.nearItem)) {
                    this.nearItem.hidePickupHint();
                    this.nearItem = null;
                }
                else if (Phaser.Input.Keyboard.JustDown(this.pickupKey)) {
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

                let frameIndex = this.equippedItemRow * 8;
                if (this.isShooting) {
                    frameIndex += 4;
                }

                const directionIndex = {
                    "front": 0,
                    "back": 1,
                    "left": 2,
                    "right": 3
                }[this.lastDirection] || 0;

                const newFrame = frameIndex + directionIndex;
                if (this.itemSprite.frame.name !== newFrame && !this.isShooting) {
                    this.itemSprite.setFrame(newFrame);
                }
            }

            // Añadir el cooldown al parry
            if (Phaser.Input.Keyboard.JustDown(this.parryKey)) {
                this.parryAction();
            }

        } else {
            if (this.itemSprite) {
                this.itemSprite.destroy();
            }
            this.body.setVelocity(0, 0);
            this.setTint(0xffffff);
            this.body.enable = false; 
        }
    }

    parryAction() {
        if (this.scene.time.now > this.lastParryTime + this.parryCooldown) {
            this.isParrying = true;
            this.lastParryTime = this.scene.time.now; // Actualiza el último tiempo del parry
            this.setTintFill(0x00ffff); // Cambia el color del jugador al parry

            let parryAnimation = '';
            if (this.anims.currentAnim.key == 'idle-back' || this.anims.currentAnim.key == 'walk-back' || this.anims.currentAnim.key == 'shoot-back') {
                parryAnimation = 'shoot-back';
            } else if (this.anims.currentAnim.key == 'idle-front' || this.anims.currentAnim.key == 'walk-front' || this.anims.currentAnim.key == 'shoot-front') {
                parryAnimation = 'shoot-front';
            } else if (this.anims.currentAnim.key == 'idle-left' || this.anims.currentAnim.key == 'walk-left' || this.anims.currentAnim.key == 'shoot-left') {
                parryAnimation = 'shoot-left';
            } else if (this.anims.currentAnim.key == 'idle-right' || this.anims.currentAnim.key == 'walk-right' || this.anims.currentAnim.key == 'shoot-right') {
                parryAnimation = 'shoot-right';
            }

            this.play(parryAnimation, true); // Reproduce la animación de parry

            // Desactivar el parry después de unos frames
            this.scene.time.delayedCall(200, () => {
                this.isParrying = false;
                this.clearTint(); // Vuelve al color original
            });
        }
    }


    //Cambia la apariencia del jugador con un item
    itemAppearance(itemKey, spriteRow) {
        const spriteKey = `player_items`;
        if (spriteRow != -1){
            this.equippedItemRow = spriteRow;
        }

        this.setTint(0xffffff);

        if (this.itemSprite) {
            this.itemSprite.destroy(); // Elimina el sprite anterior si ya hay uno
        }

        let currentBullet = 'paperbullet';

        switch (itemKey) {
            case 'bumbo':
                currentBullet = 'bumbo_bullet';
                this.playerTint = 0xe6c5c7;
                break;

            case 'pantallazo_azul':
                currentBullet = 'pantallazo_azul_bullet';
                this.playerTint = 0x66ccff;
                this.pantallazo = true;
                break;

            case 'collar_macarrones':
                currentBullet = 'dough_bullet';
                this.changeCooldown(100);
                break;
            case 'bolsa_sospechosa':
                currentBullet = 'smoke_bullet';
                this.invertir(true);
                this.doDoubleshoot(true);
                break;

            default:
                currentBullet = 'paperbullet';
                this.playerTint = 0xffffff;
        }

        this.setTintFill(this.playerTint);

        this.bulletType = currentBullet;

        // Crea el nuevo sprite del ítem sobre el jugador
        this.itemSprite = this.scene.add.sprite(this.x, this.y, spriteKey);
        this.depth = 5; // Asegura que el jugador este en la capa correcta
        this.itemSprite.depth = this.depth + 1; // Asegura que esté sobre el jugador
        this.itemSprite.setDepth(this.itemSprite.depth); // Asegura que esté sobre el jugador
        console.log(`Item ${itemKey}: equipado en fila ${spriteRow + 1}`);
        // console.log("jugador", this.depth);

        this.equippedItem = itemKey; // Guarda el ítem equipado
        this.scene.game.events.emit('playerState', { item: this.equippedItem, state: 'idle' });

        console.log(`Item ${this.equippedItem}: equipado`);
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

        let fallo = Phaser.Math.Between(1, 100) <= 20;
        let desvio = fallo ? 0.5 : 0;

        for (let i = 0; i < (this.doubleshoot ? 2 : 1); i++) {
            console.log("disparando", this.doubleshoot);
            if (this.pantallazo) {
                new FreezeBullet(this.scene, this.x, this.y, (this.doubleshoot ? dirX + desvio : dirX), (this.doubleshoot ? dirY + desvio : dirY), this.body.velocity.x, this.body.velocity.y);
            } else {
                new Bullet(this.scene, this.x, this.y, ((this.doubleshoot && !this.invertirDisparo) ? dirX + desvio : dirX), (this.doubleshoot ? dirY + desvio : dirY), this.body.velocity.x, this.body.velocity.y, true, this.bulletType);
            }
        }
        //new Bullet(this.scene, this.x, this.y, dirX, dirY, this.body.velocity.x, this.body.velocity.y, true, "paperbullet");
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
        const currentTime = this.scene.time.now;
        // ✅ Si está en modo parry, evitamos el daño
        if (this.isParrying) {
            const tiempoDesdeParry = currentTime - this.lastParryTime;

            if (tiempoDesdeParry <= this.parryWindow) {
                // parry perfecto
                if (this.health < this.maxHealth) {
                    this.health++; // Recupera vida
                    this.scene.game.events.emit('healthChanged', { health: this.health, maxHealth: this.maxHealth });
                }
                // Efecto visual de parry
                this.setTintFill(0xFFFF00); // amarillo
                this.setAlpha(1);
                // Al hacer parry
                this.emitter.setPosition(this.x, this.y); // Ajusta Y para que salga más arriba del jugador
                this.emitter.setVisible(true); // Asegúrate de que el emisor esté visible
                this.emitter.explode(5); // Emite 15 partículas
                console.log("Parry perfecto");
            } else {
                // parry normal
                this.activateNormalParryBoost(); // Define este método en tu clase
                // Efecto visual de parry
                this.setTintFill(0x00FF00); // verde
                this.setAlpha(1);
                // Al hacer parry
                this.emitter.setPosition(this.x, this.y); // Ajusta Y para que salga más arriba del jugador
                this.emitter.setVisible(true); // Asegúrate de que el emisor esté visible
                this.emitter.explode(5); // Emite 15 partículas
                console.log("Parry normal");
            }
            this.scene.tweens.add({
                targets: this,
                alpha: { from: 1, to: 0.5 },
                yoyo: true,
                repeat: 5,
                duration: 100,
                onComplete: () => {
                    this.clearTint();
                    this.setAlpha(1);
                }
            });

            if (this.itemSprite) {
                this.itemSprite.setTint(0xFFFF00);
                this.scene.tweens.add({
                    targets: this.itemSprite,
                    alpha: { from: 1, to: 0.5 },
                    yoyo: true,
                    repeat: 5,
                    duration: 100,
                    onComplete: () => {
                        this.itemSprite.clearTint();
                        this.itemSprite.setAlpha(1);
                    }
                });
            }
            if (bullet) {
                bullet.parry();
            }
            this.lastHurtTime = currentTime;
            this.isParrying = false; // Desactiva el parry después de usarlo
            return; // No se recibe daño
        }
        //recibe daño
        if (currentTime - this.lastHurtTime >= this.damageCooldown) {
            this.scene.cameras.main.shake(200, 0.002);
            this.setTint(0xff0000);
            if (this.itemSprite) this.itemSprite.setTint(0xff0000);

            if (bullet && bullet.shooter) {
                this.lastDamageSource = bullet.shooter;
                this.lastDamageType = 'enemy';
            }

            this.health--;
            this.scene.game.events.emit('healthChanged', { health: this.health, maxHealth: this.maxHealth });
            this.scene.game.events.emit('playerState', { item: this.equippedItem, state: 'hurt' });

            this.lastHurtTime = currentTime;

            // Parpadeo
            let blinkDuration = 1000;
            let blinkInterval = 100;
            let blinkCount = Math.floor(blinkDuration / blinkInterval);
            let isVisible = true;

            const blinkEvent = this.scene.time.addEvent({
                delay: blinkInterval,
                callback: () => {
                    isVisible = !isVisible;
                    const alpha = isVisible ? 1 : 0.5;
                    this.setAlpha(alpha);
                    if (this.itemSprite) this.itemSprite.setAlpha(alpha);

                    if (--blinkCount <= 0) {
                        blinkEvent.destroy();
                        this.setAlpha(1);
                        if (this.itemSprite) this.itemSprite.setAlpha(1);
                    }
                },
                callbackScope: this,
                loop: true
            });

            if (this.health <= 0) {
                this.play("player-death", true);
                this.once('animationcomplete', () => {
                    this.scene.scene.stop('GUI');
                    if (this.scene.scene.isActive('MapMenu')) {
                        this.scene.scene.stop('MapMenu');
                    }
                    this.scene.scene.start('gameOver', {
                        deathData: {
                            type: this.lastDamageType,
                            source: this.lastDamageSource
                        }
                    });
                });
            }
        }

        if (bullet) {
            bullet.explode();
        }
    }


    hurtByFire() {
        this.lastDamageSource = 'fire';
        this.lastDamageType = 'fire';
        const currentTime = this.scene.time.now; // Obtiene el tiempo actual en milisegundos
        if (currentTime - this.lastHurtTime >= this.damageCooldown) {
            this.scene.cameras.main.shake(200, 0.002);
            this.setTint(0xff0000);
            if (this.itemSprite) {
                this.itemSprite.setTint(0xff0000);
            }
            this.health--; // Reducir vida
            this.scene.game.events.emit('healthChanged', { health: this.health, maxHealth: this.maxHealth });
            this.scene.game.events.emit('playerState', { item: this.equippedItem, state: 'hurt' });

            this.lastHurtTime = currentTime; // Actualizar el último tiempo de daño

            // Efecto de parpadeo (sin usar this.blinkTimer)
            let blinkDuration = 1000; // 1 segundo de parpadeo
            let blinkInterval = 100; // Cada 100ms cambia la visibilidad
            let blinkCount = Math.floor(blinkDuration / blinkInterval);
            let isVisible = true;

            const blinkEvent = this.scene.time.addEvent({
                delay: blinkInterval,
                callback: () => {
                    isVisible = !isVisible;
                    const alpha = isVisible ? 1 : 0.5;
                    this.setAlpha(alpha);
                    if (this.itemSprite) this.itemSprite.setAlpha(alpha);

                    if (--blinkCount <= 0) {
                        blinkEvent.destroy();
                        this.setAlpha(1);
                        if (this.itemSprite) this.itemSprite.setAlpha(1);
                    }
                },
                callbackScope: this,
                loop: true
            });

            if (this.health <= 0) {
                this.play("player-death", true);
                this.once('animationcomplete', () => {
                    this.scene.scene.stop('GUI');
                    this.scene.scene.start('gameOver', {
                        deathData: {
                            type: this.lastDamageType,
                            source: this.lastDamageSource
                        }
                    });
                });
            }
        }
    }

    changeHealth(p, modifyMax) {
        if (modifyMax) {
            while (p > 0 && this.maxHealth < 10) {
                if (this.health == this.maxHealth) {
                    this.maxHealth++;
                }
                this.health++;
                p--;
                console.log(this.maxHealth);
                console.log(this.health);
            }
        } else {
            this.health = (this.health + p > this.maxHealth) ? this.maxHealth : this.health + p;
        }
        this.scene.game.events.emit('healthChanged', { health: this.health, maxHealth: this.maxHealth });
        this.scene.game.events.emit('playerState', { item: this.equippedItem, state: 'good' });
    }

    beNormal(){
        this.playerTint = 0xffffff;
        if (this.itemSprite) {
            this.itemAppearance(null, -1);
            this.itemSprite.destroy();
        }
        console.log("this.equipedItem", this.equippedItem);
        console.log("this.itemSprite", this.itemSprite);
        this.bulletType = 'paperbullet';
        this.doDoubleshoot(false);
        this.doFreeze(false);
        this.invertir(false);
        this.speed = 100;
        this.shootCooldown = 500;
    }

    openDoor(key){
        this.doorsLocked[key] = false;
    }

    changeSpeed(p) {
        if(this.speed < 169){
            this.speed *= p;
        }
    }

    changeCooldown(p) {
        if(this.shootCooldown > 350){
            this.shootCooldown += p; // En milisegundos
            this.originalShootCooldown = this.shootCooldown;
        }
    }

    doDoubleshoot(p) {
        this.doubleshoot = p;
    }

    doFreeze(p) {
        this.pantallazo = p;
    }

    maxHealthUp() {
        this.maxHealth++;
        //this.scene.updateHealth(this.maxHealth, this.health);
    }

    invertir(p) {
        this.invertirDisparo = p;
    }

    pickKey(p) {
        this.keys += p;
        this.scene.game.events.emit('keyChanged', this.keys);
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

    spendKey(p) {
        this.keys -= p;
        this.scene.game.events.emit('keyChanged', this.keys);
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
            shootCooldown: this.shootCooldown,
            doubleshoot: this.doubleshoot,
            doorsLocked: this.doorsLocked
        };
    }

    activateNormalParryBoost(duration = 3000, boostFactor = 0.5) {
        // Evita aplicar múltiples boosts superpuestos
        if (!this.powerupTimer) {
        this.shootCooldown *= boostFactor; // Reduce el cooldown (más velocidad)
        this.powerupTimer = true; // Activa el temporizador del powerup
        this.scene.time.delayedCall(duration, () => {
            this.shootCooldown = this.originalShootCooldown;
            this.powerupTimer = false
        });

        console.log("Parry normal: velocidad de disparo aumentada temporalmente");
        }
    }

    activatePerfectParryEffect() {
        if (this.health < this.maxHealth) {
            this.health++;
            this.scene.updateHealth(this.maxHealth, this.health); // si tienes este método en la escena
            console.log("Parry perfecto: vida restaurada");
        } else {
            console.log("Parry perfecto: ya tienes la vida al máximo");
        }
    }

}
