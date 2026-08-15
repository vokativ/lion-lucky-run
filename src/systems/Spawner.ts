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
    private spawnTimer?: Phaser.Time.TimerEvent;
    private obstacleTimer?: Phaser.Time.TimerEvent;
    private baseSpeed: number = -220;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.group = scene.physics.add.group();

        const diff = Settings.getDifficulty();
        if (diff === Difficulties.SUPER_HARD) {
            this.baseSpeed = -280;
        } else if (diff === Difficulties.EASY) {
            this.baseSpeed = -180;
        } else {
            this.baseSpeed = -220;
        }

        // Regular collectibles spawn loop
        this.spawnTimer = scene.time.addEvent({
            delay: 1400,
            callback: this.spawnSequence,
            callbackScope: this,
            loop: true
        });

        let obsDelay = 2200;
        if (diff === Difficulties.SUPER_HARD) obsDelay = 900;
        else if (diff === Difficulties.EASY) obsDelay = 3200;

        this.obstacleTimer = scene.time.addEvent({
            delay: obsDelay,
            callback: this.spawnDedicatedObstacle,
            callbackScope: this,
            loop: true
        });
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
        const toDestroy: Phaser.GameObjects.GameObject[] = [];

        this.group.getChildren().forEach((child: Phaser.GameObjects.GameObject) => {
            if (!child.active) return;
            const sprite = child as Phaser.Physics.Arcade.Sprite;
            if (sprite.x < -80) {
                toDestroy.push(sprite);
            }
        });

        toDestroy.forEach(child => {
            this.scene.tweens.killTweensOf(child);
            child.destroy();
        });
    }

    private spawnSequence() {
        const rand = Math.random();
        if (rand > 0.6) {
            this.spawnPattern('line');
        } else if (rand > 0.3) {
            this.spawnPattern('stagger');
        } else {
            this.spawnItem();
        }
    }

    private spawnDedicatedObstacle() {
        const count = Math.random() > 0.6 ? 2 : 1;
        const { width, height } = this.scene.scale;

        for (let i = 0; i < count; i++) {
            const y = Phaser.Math.Between(70, height - 70);
            const texture = Phaser.Utils.Array.GetRandom(['ghost', 'stone']);
            const item = this.group.create(width + 60 + (i * 110), y, texture) as Phaser.Physics.Arcade.Sprite;

            item.setScale(texture === 'ghost' ? 0.13 : 0.2);
            item.body?.updateFromGameObject();
            item.setDepth(10);

            this.addGlow(item, texture);
            item.setVelocityX(this.baseSpeed * 1.05);
            item.setData('type', 'obstacle');
        }
    }

    private spawnPattern(pattern: 'line' | 'stagger') {
        const { width, height } = this.scene.scale;
        const count = 3;
        const spacing = 45;
        const startY = Phaser.Math.Between(100, height - 100);
        const texture = Phaser.Utils.Array.GetRandom(['orange', 'hongbao', 'lantern', 'firecracker']);

        for (let i = 0; i < count; i++) {
            const y = pattern === 'line' ? startY : startY + (i % 2 === 0 ? spacing : -spacing);
            const item = this.group.create(width + 50 + (i * 65), y, texture) as Phaser.Physics.Arcade.Sprite;
            item.setScale(0.2);
            item.body?.updateFromGameObject();

            this.addGlow(item, texture);
            item.setVelocityX(this.baseSpeed);
            item.setData('type', 'collectible');
        }
    }

    private spawnItem() {
        const { width, height } = this.scene.scale;
        const y = Phaser.Math.Between(60, height - 60);
        const type = Math.random() > 0.15 ? 'collectible' : 'obstacle';

        let texture = 'orange';
        if (type === 'collectible') {
            texture = Phaser.Utils.Array.GetRandom(['orange', 'hongbao', 'lantern', 'firecracker']);
        } else {
            texture = Phaser.Utils.Array.GetRandom(['ghost', 'stone']);
        }

        const item = this.group.create(width + 50, y, texture) as Phaser.Physics.Arcade.Sprite;
        item.setScale(texture === 'ghost' ? 0.13 : 0.2);
        item.body?.updateFromGameObject();
        item.setDepth(10);

        this.addGlow(item, texture);
        item.setVelocityX(type === 'obstacle' ? this.baseSpeed * 1.05 : this.baseSpeed);
        item.setData('type', type);
    }

    private addGlow(item: Phaser.Physics.Arcade.Sprite, texture: string) {
        if (item.getData('hasGlowMarker')) return;
        item.setData('hasGlowMarker', true);

        const isBadItem = ['stone', 'ghost'].includes(texture);

        if (isBadItem) {
            item.preFX?.addGlow(0xff2200, 3, 0, false, 0.1, 15);
            this.scene.tweens.add({
                targets: item,
                y: item.y - 15,
                duration: 900,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        } else {
            item.preFX?.addGlow(0xffd700, 3, 0, false, 0.1, 15);
            this.scene.tweens.add({
                targets: item,
                y: item.y - 8,
                duration: 700,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    destroy() {
        if (this.spawnTimer) {
            this.spawnTimer.remove();
            this.spawnTimer = undefined;
        }
        if (this.obstacleTimer) {
            this.obstacleTimer.remove();
            this.obstacleTimer = undefined;
        }
        this.group.getChildren().forEach(child => {
            this.scene.tweens.killTweensOf(child);
        });
        this.group.clear(true, true);
    }
}
