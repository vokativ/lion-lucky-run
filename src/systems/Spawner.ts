import Phaser from 'phaser';
import { Settings, Difficulties } from '../storage/Settings';

/**
 * Spawner System
 *
 * Handles the generation of obstacles and collectibles.
 * Uses different patterns (Line, Stagger, Single) to create variety.
 */
export class Spawner {
    private scene: Phaser.Scene;
    private group: Phaser.Physics.Arcade.Group;
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.group = scene.physics.add.group();

        // Create placeholder textures
        this.createTextures();

        // Start spawning loops
        // Spawns a new pattern or item every 1.5 seconds
        scene.time.addEvent({
            delay: 1500,
            callback: this.spawnSequence,
            callbackScope: this,
            loop: true
        });

        // Calculate difficulty delay
        // Super Hard = 750
        // Normal = 2250 (3x less spawning)
        // Easy = 3000 (4x less spawning)
        let obsDelay: number;
        const diff = Settings.getDifficulty();
        if (diff === Difficulties.SUPER_HARD) obsDelay = 750;
        else if (diff === Difficulties.EASY) obsDelay = 3000;
        else obsDelay = 2250; // Defaults to NORMAL if not SUPER_HARD or EASY

        // 5x Obstacle Spawn Rate Event (modified by difficulty)
        scene.time.addEvent({
            delay: obsDelay,
            callback: this.spawnDedicatedObstacle,
            callbackScope: this,
            loop: true
        });
    }

    /**
     * Generates placeholder textures if assets are missing.
     * In a full game, these should be loaded in BootScene.
     */
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

    /**
     * Cleanup loop.
     * Removes objects that have moved off-screen to save memory.
     * Updates position of attached effects (glow).
     */
    update(_time: number, _delta: number) {
        const toDestroy: any[] = [];

        this.group.getChildren().forEach((child: any) => {
            if (!child.active) return;

            // Only pointlights (obstacles) need manual position updates now
            const glow = child.getData('glowPointLight') as Phaser.GameObjects.PointLight;
            if (glow) {
                glow.setPosition(child.x, child.y);
            }

            // Mark for destruction if off-screen (left side)
            if (child.x < -100) {
                toDestroy.push(child);
            }
        });

        toDestroy.forEach(child => child.destroy());
    }

    /**
     * Decides which pattern to spawn based on probability.
     */
    private spawnSequence() {
        const rand = Math.random();
        if (rand > 0.6) {
            this.spawnPattern('line'); // 40% chance for a line of items
        } else if (rand > 0.3) {
            this.spawnPattern('stagger'); // 30% chance for a zig-zag
        } else {
            this.spawnItem(); // 30% chance for a single item (mostly good items)
        }
    }

    private spawnDedicatedObstacle() {
        // Spawn 1-2 obstacles at a time to drastically increase presence
        const count = Math.random() > 0.5 ? 1 : 2;
        const { width, height } = this.scene.scale;

        for (let i = 0; i < count; i++) {
            const y = Phaser.Math.Between(50, height - 50);
            const texture = Phaser.Utils.Array.GetRandom(['ghost', 'stone']);
            const item = this.group.create(width + 50 + (i * 100), y, texture);

            item.setScale(texture === 'ghost' ? 0.12 : 0.2);
            item.body.updateFromGameObject();
            item.setDepth(10);

            this.addGlow(item, texture);
            item.setVelocityX(-200);
            item.setData('type', 'obstacle');
        }
    }

    /**
     * Spawns a group of good items in a specific formation.
     */
    private spawnPattern(pattern: 'line' | 'stagger') {
        const { width, height } = this.scene.scale;
        const count = 3;
        const spacing = 40;
        const startY = Phaser.Math.Between(100, height - 100);
        const texture = Phaser.Utils.Array.GetRandom(['orange', 'hongbao', 'lantern']);

        for (let i = 0; i < count; i++) {
            const y = pattern === 'line' ? startY : startY + (i % 2 === 0 ? spacing : -spacing);
            const item = this.group.create(width + 50 + (i * 60), y, texture);
            item.setScale(0.2); // Original scale
            item.body.updateFromGameObject();

            this.addGlow(item, texture); // Apply glow

            item.setVelocityX(-200);
            item.setData('type', 'collectible');
        }
    }

    private spawnItem() {
        const { width, height } = this.scene.scale;
        const y = Phaser.Math.Between(50, height - 50);

        // Vast majority are regular collectibles here, since obstacles have their own timer
        const type = Math.random() > 0.1 ? 'collectible' : 'obstacle';

        let texture = 'orange';
        if (type === 'collectible') {
            texture = Phaser.Utils.Array.GetRandom(['orange', 'hongbao', 'lantern']);
        } else {
            texture = Phaser.Utils.Array.GetRandom(['ghost', 'stone']);
        }

        const item = this.group.create(width + 50, y, texture);
        if (texture === 'ghost') {
            item.setScale(0.12); // Ghost is 256x256
        } else {
            item.setScale(0.2); // Other items are 256x256
        }
        item.body.updateFromGameObject(); // Update physics body size
        item.setDepth(10); // Ensure item is above glow

        this.addGlow(item, texture); // Apply glow

        item.setVelocityX(-200); // Move left
        item.setData('type', type);
    }

    private addGlow(item: Phaser.GameObjects.Sprite, texture: string) {
        // Prevent double glow
        if (item.getData('hasGlowMarker')) {
            return;
        }
        item.setData('hasGlowMarker', true);

        // Glow logic based on item type/texture
        const isBadItem = ['stone', 'ghost'].includes(texture);

        if (isBadItem) {
            // Menacing DARK red looping glow
            const glow = this.scene.add.pointlight(item.x, item.y, 0x8b0000, 35, 0.4);
            glow.setDepth(5); // Behind item
            item.setData('glowPointLight', glow);
            item.on('destroy', () => {
                glow.destroy();
            });

            // Pulsing glow animation
            this.scene.tweens.add({
                targets: glow,
                radius: 55,
                intensity: 0.8,
                duration: 700,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Floating obstacle animation
            this.scene.tweens.add({
                targets: item,
                y: item.y - 20,
                duration: 1200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        } else {
            // Golden aura for good items - preFX is much more reliable and won't get lost
            item.preFX?.addGlow(0xffd700, 3, 0, false, 0.1, 20);
        }
    }
}
