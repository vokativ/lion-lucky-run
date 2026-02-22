import Phaser from 'phaser';

export const GameModes = {
    LITTLE_KID: 'little_kid',
    BIG_KID: 'big_kid'
} as const;

export type GameMode = typeof GameModes[keyof typeof GameModes];

/**
 * FortuneSystem
 *
 * Manages the "Fortune" resource.
 * - Fortune acts like a combo/power meter.
 * - Collecting items fills the meter.
 * - Filling the meter triggers "Lucky Burst" (invincibility).
 * - Getting hit drains fortune (or ends game if 0).
 */
export class FortuneSystem {
    private scene: Phaser.Scene;
    private fortune: number = 0;
    private readonly MAX_FORTUNE = 100;
    private isBurstActive: boolean = false;
    private burstTimer?: Phaser.Time.TimerEvent;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    /**
     * Adds (or subtracts) fortune.
     * @param amount Amount to add. Can be negative.
     */
    addFortune(amount: number) {
        // Can't gain fortune while bursting (already maxed)
        if (this.isBurstActive) return;

        // Sonic logic: infinite negative amount clears fortune
        if (amount === -Infinity) {
            this.fortune = 0;
            return;
        }

        this.fortune = Phaser.Math.Clamp(this.fortune + amount, 0, this.MAX_FORTUNE);

        if (this.fortune >= this.MAX_FORTUNE) {
            this.startLuckyBurst();
        }
    }

    /**
     * Activates the Lucky Burst mode.
     * Emits event 'lucky-burst-start'.
     */
    private startLuckyBurst() {
        try {
            if (this.isBurstActive) return;

            this.isBurstActive = true;
            this.scene.events.emit('lucky-burst-start');

            // Burst duration (5 seconds)
            this.burstTimer = this.scene.time.delayedCall(5000, () => {
                this.stopLuckyBurst();
            });
        } catch (e) {
            console.error('Error starting lucky burst:', e);
        }
    }

    private stopLuckyBurst() {
        try {
            this.isBurstActive = false;
            // Safety Net: Leave 20% fortune so player doesn't die immediately if 0 items are near
            this.fortune = this.MAX_FORTUNE * 0.2;
            this.scene.events.emit('lucky-burst-end');
        } catch (e) {
            console.error('Error stopping lucky burst:', e);
        }
    }

    getBurstProgress(): number {
        if (!this.isBurstActive || !this.burstTimer) return 0;
        return (5000 - this.burstTimer.getElapsed()) / 5000;
    }

    getFortune() {
        return this.fortune;
    }

    getFortunePercent() {
        return this.fortune / this.MAX_FORTUNE;
    }

    isBursting() {
        return this.isBurstActive;
    }

    reset() {
        this.fortune = 0;
        this.isBurstActive = false;
        if (this.burstTimer) this.burstTimer.remove();
    }

    resetFortune() {
        this.reset();
    }
}
