import Phaser from 'phaser';
import { LionTail } from './LionTail';
import { Settings } from '../storage/Settings';

export class Player extends Phaser.Physics.Arcade.Sprite {
    private readonly SPEED = 300;
    private targetY: number;
    private targetX: number; // ADDED: Track X target for pointer
    private isBonked: boolean = false;
    private isBursting: boolean = false;
    private bonkTimer?: Phaser.Time.TimerEvent;
    private burstParticles?: Phaser.GameObjects.Particles.ParticleEmitter;

    // New property
    private tail!: LionTail;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        // Init with appropriate color
        const color = Settings.getColor();
        const textureKey = color === 'red' ? 'lion' : `lion_${color}`;
        super(scene, x, y, textureKey);
        this.setTexture(textureKey);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setBodySize(30, 30);
        this.setDepth(10); // Ensure head is above tail

        this.targetY = y;
        this.targetX = x; // ADDED: Init targetX

        // Initialize Tail
        this.tail = new LionTail(scene, this);

        // Setup particles for Lucky Burst
        if (!scene.textures.exists('sparkle')) {
            const g = scene.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0xffffff, 1);
            g.fillRect(0, 0, 4, 4);
            g.generateTexture('sparkle', 4, 4);
        }

        this.burstParticles = scene.add.particles(0, 0, 'sparkle', {
            speed: { min: 100, max: 250 },
            scale: { start: 1.5, end: 0 },
            tint: [0xffd700, 0xffaa00, 0xffffff], // Golden sparkles
            blendMode: 'ADD',
            lifespan: 800,
            frequency: -1, // Don't emit by default
            x: { min: -40, max: 40 },
            y: { min: -40, max: 40 }
        });
        this.burstParticles.startFollow(this);

        scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (pointer.isDown && this.scene.input.hitTestPointer(pointer).length === 0) {
                this.targetY = pointer.y;
                this.targetX = pointer.x;
            }
        });
        scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (this.scene.input.hitTestPointer(pointer).length === 0) {
                this.targetY = pointer.y;
                this.targetX = pointer.x;
            }
        });

        // Listen for burst events
        scene.events.on('lucky-burst-start', () => this.startBurst());
        scene.events.on('lucky-burst-end', () => this.stopBurst());
    }

    update(_time: number, _delta: number, cursors?: Phaser.Types.Input.Keyboard.CursorKeys, fortunePercent: number = 0, isSystemBursting: boolean = false) {
        try {
            // STATE SYNC SAFETY CHECK
            // If the system says we are not bursting, but player thinks we are, FORCE STOP.
            // This fixes the issue where rainbow tint persists after burst.
            if (this.isBursting && !isSystemBursting) {
                this.stopBurst();
            } else if (!this.isBursting && isSystemBursting) {
                this.startBurst();
            }

            // Update tail length based on fortune
            if (this.tail) {
                // Min 2, Max 20. 
                // fortunePercent is 0-1.
                const targetLen = 2 + Math.floor(fortunePercent * 18);
                this.tail.setLength(targetLen);

                // Determine direction based on velocity
                // If moving left (neg velocity), direction is -1. Else 1.
                const direction = (this.body?.velocity.x ?? 0) < -5 ? -1 : 1;
                this.tail.update(direction);
            }

            // Golden glow effect during burst
            if (this.isBursting) {
                // Ensure texture is golden during burst, instead of tinting
                this.setTexture('lion_golden');
                if (this.tail) {
                    this.tail.setToGolden();
                }
            }

            if (this.isBonked) {
                this.setVelocityX(-100); // Drift back during bonk
                return;
            }

            this.setVelocityX(0);

            // Keyboard
            if (cursors) {
                if (cursors.up.isDown) {
                    this.setVelocityY(-this.SPEED);
                    this.targetY = this.y;
                } else if (cursors.down.isDown) {
                    this.setVelocityY(this.SPEED);
                    this.targetY = this.y;
                } else {
                    // Touch/Mouse Constant Speed Follow
                    // Y-AXIS
                    const distY = this.targetY - this.y;
                    if (Math.abs(distY) > 10) {
                        // Move at constant speed towards target
                        const dirY = Math.sign(distY);
                        this.setVelocityY(dirY * this.SPEED);
                    } else {
                        // Snap/Stop if close
                        this.setVelocityY(0);
                    }

                    // X-AXIS
                    const distX = this.targetX - this.x;
                    if (Math.abs(distX) > 10) {
                        // Move at constant speed towards target
                        const dirX = Math.sign(distX);
                        this.setVelocityX(dirX * this.SPEED);
                    } else {
                        // Snap/Stop if close
                        this.setVelocityX(0);
                    }
                }

                // Keyboard overrides
                if (cursors.left.isDown) {
                    this.setVelocityX(-this.SPEED); // REMOVED 0.5 multiplier
                    this.targetX = this.x; // Sync target to prevent lerp conflict
                } else if (cursors.right.isDown) {
                    this.setVelocityX(this.SPEED); // REMOVED 0.5 multiplier (already was 1.0 equivalent effectively, but keeping consistent)
                    this.targetX = this.x;
                }
            }
        } catch (e) {
            console.error('Player update error:', e);
        }
    }

    bonk() {
        if (this.isBonked || this.isBursting) return;

        this.isBonked = true;
        this.setAlpha(0.5);
        this.setTint(0xff0000);
        if (this.tail) {
            this.tail.setTint(0xff0000);
        }
        this.setVelocityY(0);

        if (this.bonkTimer) this.bonkTimer.remove();
        this.bonkTimer = this.scene.time.delayedCall(500, () => {
            this.isBonked = false;
            this.setAlpha(1);
            this.clearTint();
            if (this.tail) {
                this.tail.clearTint();
            }
        });

        // Bounce back slightly
        this.scene.tweens.add({
            targets: this,
            x: this.x - 20,
            duration: 200,
            ease: 'Power1',
            yoyo: true
        });
    }

    private startBurst() {
        this.isBursting = true;

        // Add native Phaser glow to the player
        this.preFX?.clear();
        this.preFX?.addGlow(0xffd700, 4, 0, false, 0.1, 30);

        if (this.burstParticles && this.scene && this.scene.textures.exists('sparkle')) {
            this.burstParticles.setFrequency(40); // 1 particle every 40ms (~25 per second) instead of 200/s
        }
    }

    private stopBurst() {
        this.isBursting = false;

        // Revert texture to the selected color setting
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

    getIsBursting() {
        return this.isBursting;
    }
}
