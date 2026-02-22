import Phaser from 'phaser';

export class Spawner {
    private scene: Phaser.Scene;
    private group: Phaser.Physics.Arcade.Group;
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.group = scene.physics.add.group();

        // Create placeholder textures
        this.createTextures();

        // Start spawning loop
        scene.time.addEvent({
            delay: 1500, // every 1.5s
            callback: this.spawnSequence,
            callbackScope: this,
            loop: true
        });
    }

    private createTextures() {
        /**
         * ASSET REPLACEMENT:
         * All textures generated here are placeholders. 
         * Replace the Graphics code below with `this.scene.load.image` or `this.scene.load.spritesheet` 
         * in BootScene.ts and use those keys here instead.
         */
        // const { scene } = this;
        // Orange (Existing)
        // if (!scene.textures.exists('orange')) {
        //     const g = scene.make.graphics({ x: 0, y: 0 });
        //     g.fillStyle(0xffa500, 1);
        //     g.fillCircle(15, 15, 15);
        //     g.generateTexture('orange', 30, 30);
        // }
        // Hongbao (Red Envelope)
        // if (!scene.textures.exists('hongbao')) {
        //     const g = scene.make.graphics({ x: 0, y: 0 });
        //     g.fillStyle(0xff0000, 1);
        //     g.fillRect(5, 0, 20, 30);
        //     g.fillStyle(0xffff00, 1);
        //     g.fillCircle(15, 10, 3); // Gold symbol
        //     g.generateTexture('hongbao', 30, 30);
        // }
        // Lantern
        // if (!scene.textures.exists('lantern')) {
        //     const g = scene.make.graphics({ x: 0, y: 0 });
        //     g.fillStyle(0xcc0000, 1);
        //     g.fillEllipse(15, 15, 12, 15);
        //     g.fillStyle(0xffd700, 1);
        //     g.fillRect(10, 0, 10, 3); // top
        //     g.fillRect(10, 27, 10, 3); // bottom
        //     g.generateTexture('lantern', 30, 30);
        // }
        // Bubble (Obstacle) - Blue/Clear
        // if (!scene.textures.exists('bubble')) {
        //     const g = scene.make.graphics({ x: 0, y: 0 });
        //     g.lineStyle(2, 0x88ccff, 0.8);
        //     g.strokeCircle(15, 15, 12);
        //     g.fillStyle(0xffffff, 0.3);
        //     g.fillCircle(10, 10, 4);
        //     g.generateTexture('bubble', 30, 30);
        // }
        // Triangle Obstacle (Existing)
        // if (!scene.textures.exists('obstacle')) {
        //     const g = scene.make.graphics({ x: 0, y: 0 });
        //     g.fillStyle(0x888888, 1);
        //     g.fillTriangle(15, 0, 30, 30, 0, 30);
        //     g.generateTexture('obstacle', 30, 30);
        // }
    }

    getGroup() {
        return this.group;
    }

    update(_time: number, _delta: number) {
        const toDestroy: any[] = [];

        this.group.getChildren().forEach((child: any) => {
            if (!child.active) return;

            const glow = child.getData('glow') as Phaser.GameObjects.PointLight;
            if (glow) {
                glow.setPosition(child.x, child.y);
            }

            if (child.x < -100) {
                toDestroy.push(child);
            }
        });

        toDestroy.forEach(child => child.destroy());
    }

    private spawnSequence() {
        const rand = Math.random();
        if (rand > 0.7) {
            this.spawnPattern('line');
        } else if (rand > 0.5) {
            this.spawnPattern('stagger');
        } else {
            this.spawnItem();
        }
    }

    private spawnPattern(pattern: 'line' | 'stagger') {
        const { width, height } = this.scene.scale;
        const count = 3;
        const spacing = 40;
        const startY = Phaser.Math.Between(100, height - 100);
        const texture = Phaser.Utils.Array.GetRandom(['orange', 'hongbao', 'lantern']);

        for (let i = 0; i < count; i++) {
            const y = pattern === 'line' ? startY : startY + (i % 2 === 0 ? spacing : -spacing);
            const item = this.group.create(width + 50 + (i * 60), y, texture);
            item.setScale(0.2); // All items are high-res 256x256 now
            item.body.updateFromGameObject();

            this.addGlow(item, texture); // Apply glow

            item.setVelocityX(-200);
            item.setData('type', 'collectible');
        }
    }

    private spawnItem() {
        const { width, height } = this.scene.scale;
        const y = Phaser.Math.Between(50, height - 50);
        const type = Math.random() > 0.4 ? 'collectible' : 'obstacle';

        let texture = 'orange';
        if (type === 'collectible') {
            texture = Phaser.Utils.Array.GetRandom(['orange', 'hongbao', 'lantern']);
        } else {
            texture = Phaser.Utils.Array.GetRandom(['ghost', 'stone']);
        }

        const item = this.group.create(width + 50, y, texture);
        if (texture === 'ghost') {
            item.setScale(0.12); // Ghost is 256x256, so 0.12 makes it approx 30px
        } else {
            item.setScale(0.2); // All items are high-res 256x256 now
        }
        item.body.updateFromGameObject(); // Update physics body size
        // if (texture === 'stone') { ... } // No longer needed as all are scaled
        item.setDepth(10); // Ensure item is above glow

        this.addGlow(item, texture); // Apply glow

        item.setVelocityX(-200); // Move left
        item.setData('type', type);
    }

    private addGlow(item: Phaser.GameObjects.Sprite, texture: string) {
        // Prevent double glow
        if (item.getData('glow')) {
            return;
        }

        // Glow logic based on item type/texture
        const isBadItem = ['stone', 'ghost'].includes(texture);

        if (isBadItem) {
            // Poisonous green glow for obstacles - very subtle
            const glow = this.scene.add.pointlight(item.x, item.y, 0x00ff00, 32, 0.1);
            glow.setDepth(5); // Behind item
            item.setData('glow', glow);
            item.on('destroy', () => {
                glow.destroy();
            });
        } else {
            // Golden glow for good items - optimized for overlapping patterns
            const glow = this.scene.add.pointlight(item.x, item.y, 0xffd700, 32, 0.15);
            glow.setDepth(5); // Behind item
            item.setData('glow', glow);
            item.on('destroy', () => {
                glow.destroy();
            });
        }
    }
}
