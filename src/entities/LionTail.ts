import Phaser from 'phaser';
import { Settings } from '../storage/Settings';

/**
 * LionTail Entity
 *
 * Implements distance-constrained inverse kinematics chain trailing
 * (the standard model used in Snake / Worm / Dragon games).
 *
 * Properties:
 * - Strict constant distance constraint (D = 18px): eliminates gaps/stretching at any speed.
 * - Organic curvature on turns with smooth rotational alignment.
 * - Proper z-ordering and seamless scale overlapping.
 * - Zero per-frame memory allocations (O(N) with N <= 25).
 */
export class LionTail extends Phaser.GameObjects.Container {
    private segments: Phaser.GameObjects.Sprite[] = [];
    private spine: { x: number; y: number; angle: number }[] = [];
    private readonly MAX_SEGMENTS = 20;
    private readonly SEGMENT_DISTANCE = 32; // Distance between spine vertebrae
    private target: Phaser.GameObjects.Sprite;
    private currentLength: number = 4;

    private bodyKey: string = 'body_segment';
    private tailKey: string = 'tail_segment';
    private isGolden: boolean = false;
    private lastTipIndex: number = -1;

    constructor(scene: Phaser.Scene, target: Phaser.GameObjects.Sprite) {
        super(scene, 0, 0);
        this.target = target;
        scene.add.existing(this);

        this.updateBaseKeys();

        // Initialize spine points and segment sprites
        for (let i = 0; i < this.MAX_SEGMENTS; i++) {
            const initX = target.x - (i + 1) * this.SEGMENT_DISTANCE;
            const initY = target.y;
            this.spine.push({ x: initX, y: initY, angle: 0 });

            const segment = scene.add.sprite(initX, initY, this.bodyKey);
            segment.setOrigin(0.5, 0.5);
            segment.setScale(0.92);
            segment.setFlipX(true);
            segment.setVisible(false);
            segment.setDepth(target.depth - (i + 1));
            this.segments.push(segment);
            scene.add.existing(segment);
        }
    }

    setLength(length: number) {
        this.currentLength = Phaser.Math.Clamp(length, 3, this.MAX_SEGMENTS);
    }

    private updateBaseKeys() {
        const color = Settings.getColor();
        this.bodyKey = color === 'red' ? 'body_segment' : `body_segment_${color}`;
        this.tailKey = color === 'red' ? 'tail_segment' : `tail_segment_${color}`;
    }

    setToGolden() {
        this.isGolden = true;
        this.updateTextures();
    }

    restoreColor() {
        this.isGolden = false;
        this.updateBaseKeys();
        this.updateTextures();
    }

    private updateTextures() {
        const tipIndex = this.currentLength - 1;
        this.segments.forEach((s, i) => {
            const isTip = (i === tipIndex);
            if (this.isGolden) {
                s.setTexture(isTip ? 'tail_segment_golden' : 'body_segment_golden');
            } else {
                s.setTexture(isTip ? this.tailKey : this.bodyKey);
            }
            const taper = 0.94 - (i / this.MAX_SEGMENTS) * 0.08;
            s.setScale(isTip ? 0.88 : taper);
        });
        this.lastTipIndex = tipIndex;
    }

    setTint(color: number) {
        this.segments.forEach(s => s.setTint(color));
    }

    clearTint() {
        this.segments.forEach(s => s.clearTint());
    }

    /**
     * Update segment positions with distance constraints layered with
     * continuous flowing flight waves (billowing silk in the wind).
     */
    update(time: number = 0, isBursting: boolean = false) {
        try {
            const count = this.currentLength;
            const tipIndex = count - 1;

            if (tipIndex !== this.lastTipIndex) {
                this.updateTextures();
            }

            // 1. KINEMATIC SPINE UPDATE (Zero gaps / constant distance)
            // Segment 0 follows the player target (head)
            if (count > 0 && this.spine[0]) {
                const s0 = this.spine[0];
                const dx = this.target.x - s0.x;
                const dy = this.target.y - s0.y;
                const dist = Math.hypot(dx, dy);

                if (dist > this.SEGMENT_DISTANCE) {
                    const factor = this.SEGMENT_DISTANCE / dist;
                    s0.x = this.target.x - dx * factor;
                    s0.y = this.target.y - dy * factor;
                }

                const targetAngle = Math.atan2(dy, dx);
                s0.angle = Phaser.Math.Angle.RotateTo(s0.angle, targetAngle, 0.15);
            }

            // Subsequent spine joints follow the joint ahead
            for (let i = 1; i < count; i++) {
                const prev = this.spine[i - 1];
                const curr = this.spine[i];
                if (!prev || !curr) continue;

                const dx = prev.x - curr.x;
                const dy = prev.y - curr.y;
                const dist = Math.hypot(dx, dy);

                if (dist > this.SEGMENT_DISTANCE) {
                    const factor = this.SEGMENT_DISTANCE / dist;
                    curr.x = prev.x - dx * factor;
                    curr.y = prev.y - dy * factor;
                }

                const targetAngle = Math.atan2(dy, dx);
                curr.angle = Phaser.Math.Angle.RotateTo(curr.angle, targetAngle, 0.15);
            }

            // 2. FLOWING SILK FLIGHT WAVE LAYER (Organic continuous motion even when idle)
            const t = time / 1000;
            const waveFreq = isBursting ? 7.5 : 4.4; // Faster flutter during lucky burst

            for (let i = 0; i < count; i++) {
                const sp = this.spine[i];
                const sprite = this.segments[i];
                if (!sp || !sprite) continue;

                sprite.setVisible(true);

                // Traveling sine wave down the dragon spine
                const wavePhase = t * waveFreq - (i + 1) * 0.52;
                const waveAmp = 3.5 + (i / count) * 8.0; // Ampler ripple towards the tail
                const displacement = Math.sin(wavePhase) * waveAmp;

                // Apply displacement perpendicular to spine heading
                const normalX = -Math.sin(sp.angle) * displacement;
                const normalY = Math.cos(sp.angle) * displacement;

                sprite.setPosition(sp.x + normalX, sp.y + normalY);

                // Add gentle harmonic rotation to simulate billowing silk
                const rotWave = Math.cos(wavePhase) * 0.10;
                sprite.setRotation(sp.angle + rotWave);
            }

            // Hide remaining unused segments
            const lastVisible = this.spine[tipIndex];
            for (let i = count; i < this.segments.length; i++) {
                const unused = this.segments[i];
                if (!unused) continue;
                unused.setVisible(false);
                if (lastVisible) {
                    unused.setPosition(lastVisible.x, lastVisible.y);
                    unused.setRotation(lastVisible.angle);
                }
            }
        } catch (e) {
            console.error('LionTail update error:', e);
        }
    }

    destroy(fromScene?: boolean) {
        this.segments.forEach(s => {
            if (s && s.active) s.destroy();
        });
        this.segments = [];
        this.spine = [];
        super.destroy(fromScene);
    }
}
