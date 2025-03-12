import Phaser from "phaser";
import Player from "../gameObjects/characters/player.js";
import Enemy from "../gameObjects/enemies/enemy.js";
import RangedEnemy from "../gameObjects/enemies/rangedEnemy.js";
import Item from "../gameObjects/items/item.js";

export default class SalaBase extends Phaser.Scene{

    constructor(key){
        super(key);
        //this.mapKey = "map";
    }
    create(data){
        /*
        const spawnX = data?.x ?? 500;
        const spawnY = data?.y ?? 250;

        if (data?.playerData) {
            this.player = new Player(this, spawnX, spawnY, data.playerData);
        } else {
            this.player = new Player(this, spawnX, spawnY);
        }

        this.transitionZones = this.physics.add.group();
        this.addTransitions();

        this.bulletGroup = this.physics.add.group();
        this.enemyGroup = this.physics.add.group();
        this.enemyBulletGroup = this.physics.add.group();
        
       //Camaras
       this.physics.world.setBounds(0, 0, this.bound1, this.bound2);
       this.cameras.main.setBounds(0, 0, this.bound1, this.bound2);
       this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
       this.cameras.main.setZoom(1.8);
        
        
        */
    }

    onBulletCollision(bullet, tile) {
        bullet.explode();
    }
    
    addTransitions(map, player, transitionZones){//No se usa
        let transitionLayer = map.getObjectLayer("transiciones");
        if(transitionLayer){
            console.log("hola, capa de transiciones");
            transitionLayer.objects.forEach(obj => {
                const zone = transitionZones.create(obj.x, obj.y, null).setSize(obj.width, obj.height);
                zone.spawnRoom = obj.properties.find(p => p.name === "spawnRoom")?.value;
                zone.spawnX = obj.properties.find(p => p.name === "spawnX")?.value;
                zone.spawnY = obj.properties.find(p => p.name === "spawnY")?.value;
            });
            
            //this.physics.add.overlap(player, transitionZones, this.changeRoom, null, this);
        }
    }

    changeRoom(player, zone){
        if(!zone.spawnRoom || !this.player.canChangeRoom) return;
        this.player.canChangeRoom = false;
        this.scene.switch(zone.spawnRoom, { x: zone.spawnX, y: zone.spawnY, playerData: {
            health: this.player.health,
            coins: this.player.coins,
            equippedItem: this.player.equippedItem,
            itenSprite: this.player.itemSprite,
            speed: this.player.speed,
            velocityX: this.player.body.velocity.x,  // Guarda la velocidad X
            velocityY: this.player.body.velocity.y   // Guarda la velocidad Y
        } });
        this.time.delayedCall(1000, () => {
            this.player.canChangeRoom = true;
        });
    }
}