import Phaser from 'phaser';

export class LionTail extends Phaser.GameObjects.Container {
    private segments: Phaser.GameObjects.Sprite[] = [];
    private history: { x: number, y: number }[] = [];
    private readonly MAX_SEGMENTS = 30;
    private readonly SEGMENT_SPACING = 6; // Frames or distance
    private target: Phaser.GameObjects.Sprite;
    private currentLength: number = 5; // Start short

    constructor(scene: Phaser.Scene, target: Phaser.GameObjects.Sprite) {
        super(scene, 0, 0);
        this.target = target;
        scene.add.existing(this);

        // Initialize max segments but hide unused ones
        // Use body_segment for middle parts, tail_segment only at the very end
        for (let i = 0; i < this.MAX_SEGMENTS; i++) {
            const segment = scene.add.sprite(target.x, target.y, 'body_segment');
            // Gradual scale down: start at 0.9 (close to head), end at 0.5
            const scale = 0.9 - (i / this.MAX_SEGMENTS) * 0.4;
            segment.setScale(scale);
            segment.setFlipX(true);
            segment.setVisible(false);
            this.segments.push(segment);
            scene.add.existing(segment);
            segment.setDepth(target.depth - 1);
        }
    }

    setLength(length: number) {
        this.currentLength = Phaser.Math.Clamp(length, 5, this.MAX_SEGMENTS);
    }

    setTint(color: number) {
        this.segments.forEach(s => s.setTint(color));
    }

    clearTint() {
        this.segments.forEach(s => s.clearTint());
    }

    private currentDirection: number = 1;
    private spacingFactor: number = 1.0;
    private lastTipIndex: number = -1;

    update(targetDirection: number = 1) {
        try {
            // Smoothly interpolate direction
            // Lerp factor 0.1 for smooth swing
            this.currentDirection = Phaser.Math.Linear(this.currentDirection, targetDirection, 0.1);

            // Record history
            this.history.unshift({ x: this.target.x, y: this.target.y });

            // Limit history
            const maxHistory = this.MAX_SEGMENTS * this.SEGMENT_SPACING + 1;
            if (this.history.length > maxHistory) {
                this.history.pop();
            }

            // DIAGONAL DETECTION & SPACING LOGIC
            // Check recent movement to determine if diagonal
            let isDiagonal = false;
            if (this.target.body) {
                const body = this.target.body as Phaser.Physics.Arcade.Body;
                if (Math.abs(body.velocity.x) > 20 && Math.abs(body.velocity.y) > 20) {
                    isDiagonal = true;
                }
            }

            // Smoothly interpolate spacing factor
            // Target: 0.3 if diagonal, 1.0 if not
            const targetSpacing = isDiagonal ? 0.3 : 1.0;
            if (!this.spacingFactor) this.spacingFactor = 1.0;
            this.spacingFactor = Phaser.Math.Linear(this.spacingFactor, targetSpacing, 0.1);

            // Update segments
            const BODY_OFFSET = 7 * this.spacingFactor;
            const TAIL_OFFSET = 14 * this.spacingFactor;

            for (let i = 0; i < this.segments.length; i++) {
                if (i < this.currentLength) {
                    const segment = this.segments[i];
                    if (!segment) continue;

                    segment.setVisible(true);

                    // Texture key: tail_segment ONLY for the last VISIBLE segment
                    const isFinalVisible = (i === this.currentLength - 1);
                    if (isFinalVisible && i !== this.lastTipIndex) {
                        segment.setTexture('tail_segment');
                        if (this.lastTipIndex >= 0 && this.segments[this.lastTipIndex]) {
                            this.segments[this.lastTipIndex].setTexture('body_segment');
                        }
                        this.lastTipIndex = i;
                    }

                    const index = (i + 1) * this.SEGMENT_SPACING;
                    if (index < this.history.length) {
                        const pos = this.history[index];

                        // Apply offset
                        // Base offset for all segments
                        let totalOffset = (i + 1) * BODY_OFFSET;

                        // If this is the tail tip, add extra gap
                        if (isFinalVisible) {
                            totalOffset += (TAIL_OFFSET - BODY_OFFSET);
                        }

                        // MODIFIED: Directional offset
                        // If direction is 1 (right), we subtract offset (segments lag left)
                        // If direction is -1 (left), we ADD offset (segments lag right)? 
                        // Actually:
                        // If moving RIGHT (x increasing), history has smaller x. 
                        // VisualX = pos.x - totalOffset. 
                        // Wait, history saves absolute positions of the HEAD.
                        // So `pos.x` is where the head WAS `index` frames ago.
                        // We shouldn't need manual offset subtraction if we are following history, 
                        // UNLESS the history is just the head's current position repeated?
                        // The original code was: `const visualX = pos.x - totalOffset;`
                        // This implies the tail is NOT following the track, but rather rigidly offset from the gathered history points?
                        // If history tracks (x, y), then `pos.x` IS the position where the head was.
                        // So simply placing the segment at `pos.x` should be enough to trail?
                        // The `totalOffset` usage suggests the user wanted to "stretch" it out artificially beyond just the time delay.
                        // If so, `totalOffset` simulates the physical length of the body chain.
                        // So:
                        // If moving Right: Head > Body. Body is to the Left. Offset should subtract.
                        // If moving Left: Head < Body. Body is to the Right. Offset should ADD.

                        const visualX = pos.x - (totalOffset * this.currentDirection);

                        segment.setPosition(visualX, pos.y);

                        // ROTATION LOGIC
                        let targetX = this.target.x;
                        let targetY = this.target.y;

                        if (i > 0) {
                            // Look at previous segment
                            const prev = this.segments[i - 1];
                            if (prev) {
                                targetX = prev.x;
                                targetY = prev.y;
                            }
                        } else {
                            // First segment looks at head
                            targetX = this.target.x;
                            targetY = this.target.y;
                        }

                        const targetAngle = Phaser.Math.Angle.Between(
                            visualX, pos.y,
                            targetX, targetY
                        );

                        // Smooth interp
                        const currentRotation = segment.rotation;
                        const newRotation = Phaser.Math.Angle.RotateTo(currentRotation, targetAngle, 0.1);

                        segment.setRotation(newRotation);

                    } else {
                        const last = this.history[this.history.length - 1];
                        if (last) {
                            // Keep the offset relative to the last known position
                            let totalOffset = (i + 1) * BODY_OFFSET;
                            if (isFinalVisible) {
                                totalOffset += (TAIL_OFFSET - BODY_OFFSET);
                            }
                            // Apply interpolated direction here too
                            const visualX = last.x - (totalOffset * this.currentDirection);
                            segment.setPosition(visualX, last.y);
                        }
                    }
                } else {
                    if (this.segments[i]) this.segments[i].setVisible(false);
                }
            }
        } catch (e) {
            console.error('LionTail update error:', e);
        }
    }

    // Cleanup
    destroy() {
        this.segments.forEach(s => s.destroy());
        super.destroy();
    }
}
