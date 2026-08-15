import Phaser from 'phaser';
import { LionTail } from './LionTail';
import { Settings } from '../storage/Settings';

/**
 * Player Entity (The Lion)
 *
 * Handles player movement, states (Bonked, Bursting), and visuals (Tail, Particles).
 *
 * Controls:
 * - Keyboard: Arrow keys directly set velocity.
 * - Touch/Mouse: Player moves towards the last touched position.
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
    private readonly SPEED = 320;
    private targetY: number;
    private targetX: number;
    private isBonked: boolean = false;
    private isBursting: boolean = false;
    private bonkTimer?: Phaser.Time.TimerEvent;
    private burstParticles?: Phaser.GameObjects.Particles.ParticleEmitter;
    private wasd?: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
    private pointerMoveHandler?: (pointer: Phaser.Input.Pointer) => void;
    private pointerDownHandler?: (pointer: Phaser.Input.Pointer) => void;
    private burstStartHandler?: () => void;
    private burstEndHandler?: () => void;

    // The lion's tail follows the head
    private tail!: LionTail;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        const color = Settings.getColor();
        const textureKey = color === 'red' ? 'lion' : `lion_${color}`;
        super(scene, x, y, textureKey);
        this.setTexture(textureKey);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setBodySize(40, 40);
        this.setDepth(10);

        this.targetY = y;
        this.targetX = x;

        this.tail = new LionTail(scene, this);

        // Setup particles for Lucky Burst
        if (!scene.textures.exists('sparkle')) {
            const g = scene.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0xffffff, 1);
            g.fillRect(0, 0, 4, 4);
            g.generateTexture('sparkle', 4, 4);
            g.destroy();
        }

        this.burstParticles = scene.add.particles(0, 0, 'sparkle', {
            speed: { min: 80, max: 200 },
            scale: { start: 1.5, end: 0 },
            tint: [0xffd700, 0xff8c00, 0xffffff],
            blendMode: 'ADD',
            lifespan: 600,
            frequency: -1,
            x: { min: -20, max: 20 },
            y: { min: -20, max: 20 }
        });
        this.burstParticles.startFollow(this);

        // WASD key controls
        if (scene.input.keyboard) {
            this.wasd = {
                W: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
                A: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
                S: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
                D: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            };
        }

        // Touch/Mouse Input Handling
        this.pointerMoveHandler = (pointer: Phaser.Input.Pointer) => {
            if (pointer.isDown && this.scene && this.scene.input && this.scene.input.hitTestPointer(pointer).length === 0) {
                this.targetY = pointer.y;
                this.targetX = pointer.x;
            }
        };
        this.pointerDownHandler = (pointer: Phaser.Input.Pointer) => {
            if (this.scene && this.scene.input && this.scene.input.hitTestPointer(pointer).length === 0) {
                this.targetY = pointer.y;
                this.targetX = pointer.x;
            }
        };

        scene.input.on('pointermove', this.pointerMoveHandler);
        scene.input.on('pointerdown', this.pointerDownHandler);

        // Burst events
        this.burstStartHandler = () => this.startBurst();
        this.burstEndHandler = () => this.stopBurst();
        scene.events.on('lucky-burst-start', this.burstStartHandler);
        scene.events.on('lucky-burst-end', this.burstEndHandler);
    }

    update(_time: number, _delta: number, cursors?: Phaser.Types.Input.Keyboard.CursorKeys, fortunePercent: number = 0, isSystemBursting: boolean = false) {
        try {
            // Sync burst state
            if (this.isBursting && !isSystemBursting) {
                this.stopBurst();
            } else if (!this.isBursting && isSystemBursting) {
                this.startBurst();
            }

            // Update tail
            if (this.tail) {
                const targetLen = 3 + Math.floor(fortunePercent * 11);
                this.tail.setLength(targetLen);
                this.tail.update(_time, this.isBursting);
            }

            if (this.isBursting) {
                this.setTexture('lion_golden');
                if (this.tail) {
                    this.tail.setToGolden();
                }
            }

            if (this.isBonked) {
                this.setVelocityX(-80);
                return;
            }

            // Keyboard input check
            const upKey = (cursors && cursors.up.isDown) || (this.wasd && this.wasd.W.isDown);
            const downKey = (cursors && cursors.down.isDown) || (this.wasd && this.wasd.S.isDown);
            const leftKey = (cursors && cursors.left.isDown) || (this.wasd && this.wasd.A.isDown);
            const rightKey = (cursors && cursors.right.isDown) || (this.wasd && this.wasd.D.isDown);

            let vx = 0;
            let vy = 0;
            const hasKeyboardInput = upKey || downKey || leftKey || rightKey;

            if (hasKeyboardInput) {
                if (upKey) vy -= this.SPEED;
                if (downKey) vy += this.SPEED;
                if (leftKey) vx -= this.SPEED;
                if (rightKey) vx += this.SPEED;

                // Normalize diagonal movement speed
                if (vx !== 0 && vy !== 0) {
                    vx *= 0.7071;
                    vy *= 0.7071;
                }

                this.setVelocity(vx, vy);
                this.targetX = this.x;
                this.targetY = this.y;
            } else {
                // Touch / Mouse targeting
                const dx = this.targetX - this.x;
                const dy = this.targetY - this.y;
                const dist = Math.hypot(dx, dy);

                if (dist > 8) {
                    const speed = Math.min(this.SPEED, dist * 8);
                    this.setVelocity((dx / dist) * speed, (dy / dist) * speed);
                } else {
                    this.setVelocity(0, 0);
                }
            }

            // Keep player safely within screen boundaries
            const screenW = this.scene.scale.width;
            const screenH = this.scene.scale.height;
            const clampedX = Phaser.Math.Clamp(this.x, 50, screenW - 50);
            const clampedY = Phaser.Math.Clamp(this.y, 45, screenH - 45);
            if (clampedX !== this.x || clampedY !== this.y) {
                this.setPosition(clampedX, clampedY);
            }
        } catch (e) {
            console.error('Player update error:', e);
        }
    }

    bonk() {
        if (this.isBonked || this.isBursting) return;

        this.isBonked = true;
        this.setAlpha(0.6);
        this.setTint(0xff3333);
        if (this.tail) {
            this.tail.setTint(0xff3333);
        }
        this.setVelocityY(0);

        if (this.bonkTimer) this.bonkTimer.remove();
        this.bonkTimer = this.scene.time.delayedCall(600, () => {
            this.isBonked = false;
            this.setAlpha(1);
            this.clearTint();
            if (this.tail) {
                this.tail.clearTint();
            }
        });

        this.scene.tweens.add({
            targets: this,
            x: Math.max(50, this.x - 30),
            duration: 200,
            ease: 'Power1',
            yoyo: true
        });
    }

    private startBurst() {
        this.isBursting = true;
        this.preFX?.clear();
        this.preFX?.addGlow(0xffd700, 4, 0, false, 0.1, 20);

        if (this.burstParticles && this.scene && this.scene.textures.exists('sparkle')) {
            this.burstParticles.setFrequency(35);
        }
    }

    private stopBurst() {
        this.isBursting = false;
        const color = Settings.getColor();
        this.setTexture(color === 'red' ? 'lion' : `lion_${color}`);
        this.preFX?.clear();
        this.clearTint();
        if (this.tail) {
            this.tail.restoreColor();
            this.tail.clearTint();
        }
        if (this.burstParticles) {
            this.burstParticles.setFrequency(-1);
        }
    }

    getIsBursting(): boolean {
        return this.isBursting;
    }

    getIsBonked(): boolean {
        return this.isBonked;
    }

    destroy(fromScene?: boolean) {
        if (this.bonkTimer) {
            this.bonkTimer.remove();
            this.bonkTimer = undefined;
        }
        if (this.scene) {
            if (this.pointerMoveHandler) this.scene.input.off('pointermove', this.pointerMoveHandler);
            if (this.pointerDownHandler) this.scene.input.off('pointerdown', this.pointerDownHandler);
            if (this.burstStartHandler) this.scene.events.off('lucky-burst-start', this.burstStartHandler);
            if (this.burstEndHandler) this.scene.events.off('lucky-burst-end', this.burstEndHandler);
        }
        if (this.burstParticles) {
            this.burstParticles.destroy();
        }
        if (this.tail) {
            this.tail.destroy();
        }
        super.destroy(fromScene);
    }
}
