import Phaser from 'phaser';
import Npc from './npc.js';

export default class WakeEnemy extends Npc {
  constructor(scene, x, y, type, id) {
    super(scene, x, y, type);
    this.type = type;
    this.id = id;
    this.health = 3;
    this.speed = 100;
    this.stunCounter = 0;
    this.despierto = false;
    this.despertando = false;
    this.path = null;
    this.nextTile = null;
    this.pathTimer = 0;
    this.setScale(1.5);
    this.body.setSize(18, 16);
    this.body.setOffset(0, -6);
  }

  hitPlayer(enemy, player) {
    if (this.despierto) {
      this.stunCounter = 20;
      player.lastDamageSource = this.spriteKey;
      player.lastDamageType = 'enemy';
      player.hurt();
    } else if (!this.despertando) {
      this.despertando = true;
      this.play(`${this.type}_wake`, true);
      this.once('animationcomplete', () => {
        this.despierto = true;
        this.scene.numEnemies++;
        this.play(`${this.type}_void`, true);
      });
    }
  }

  hitBullet(enemy, bullet) {
    if (this.despierto) {
      this.stunCounter = 5;
      this.health--;
      if (this.health <= 0) {
        this.body.setVelocity(0, 0);
        this.body.enable = false;
        this.scene.numEnemiesBeaten++;
        this.play("blood", true);
        this.once('animationcomplete', () => {
          this.scene.add.sprite(this.x, this.y, "blood").setVisible(true).setDepth(3).setFrame(12);
          this.destroy();
        });
        this.scene.game.global.gatosVivos = this.scene.game.global.gatosVivos.filter(id => id !== this.id);
      }
    } else {
      this.despierto = true;
      this.play(`${this.type}_wake`, true);
      this.once('animationcomplete', () => {
        this.play(`${this.type}_void`, true);
      });
      this.scene.numEnemies++;
    }
    bullet.explode();
  }

  hasLineOfSight() {
    const ray = new Phaser.Geom.Line(this.x, this.y, this.scene.player.x, this.scene.player.y);
    const tiles = this.scene.map.getTilesWithinShape(
      ray,
      { isColliding: true },
      'bordes' // Capa con colisión
    );
    return tiles.length === 0;
  }

  calculatePath() {
    const tileSize = this.scene.map.tileWidth;
    const startX = Math.floor(this.x / tileSize);
    const startY = Math.floor(this.y / tileSize);
    const endX = Math.floor(this.scene.player.x / tileSize);
    const endY = Math.floor(this.scene.player.y / tileSize);

    const grid = [];
    const walkables = [];

    for (let y = 0; y < this.scene.map.height; y++) {
      const row = [];
      for (let x = 0; x < this.scene.map.width; x++) {
        const tile = this.scene.map.getTileAt(x, y, true, 'bordes');
        if (tile && tile.collides) {
          row.push(1);
        } else {
          row.push(0);
          walkables.push(0);
        }
      }
      grid.push(row);
    }

    this.scene.finder.setGrid(grid);
    this.scene.finder.setAcceptableTiles(walkables);
    this.scene.finder.enableDiagonals();

    this.scene.finder.findPath(startX, startY, endX, endY, path => {
      if (path && path.length > 1) {
        path.shift();
        this.path = path;
        this.nextTile = path[0];
      } else {
        this.path = null;
        this.nextTile = null;
      }
    });

    this.scene.finder.calculate();
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);

    if (this.health <= 0) return;

    if (this.stunCounter > 0) {
      this.stunCounter--;
      this.setTint(0xff0000);
      this.body.setVelocity(0, 0);
      return;
    } else {
      this.setTint(0xffffff);
    }

    if (!this.despierto) {
      this.play(`${this.type}_idle`, true);
      this.body.setVelocity(0, 0);
      return;
    }

    // Si tiene línea de visión → lo persigue directamente
    if (this.hasLineOfSight()) {
      this.path = null;
      this.nextTile = null;
      this.scene.physics.moveToObject(this, this.scene.player, this.speed);
    } else {
      // Calcular ruta cada X ms
      if (t > this.pathTimer + 500) {
        this.pathTimer = t;
        this.calculatePath();
      }

      if (this.path && this.nextTile) {
        const tileSize = this.scene.map.tileWidth;
        const targetX = this.nextTile.x * tileSize + tileSize / 2;
        const targetY = this.nextTile.y * tileSize + tileSize / 2;

        this.scene.physics.moveTo(this, targetX, targetY, this.speed);

        const dist = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY);
        if (dist < 4) {
          this.path.shift();
          this.nextTile = this.path[0];
        }
      } else {
        this.body.setVelocity(0, 0);
      }
    }

    // Animación y flip
    if (this.body.velocity.length() > 0) {
      this.play(`${this.type}_void`, true);
      this.flipX = this.body.velocity.x < 0;
    }
  }
}
