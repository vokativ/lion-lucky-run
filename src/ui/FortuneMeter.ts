import Phaser from 'phaser';

export class FortuneMeter extends Phaser.GameObjects.Container {
    private bar: Phaser.GameObjects.Graphics;
    private background: Phaser.GameObjects.Graphics;
    private readonly BAR_WIDTH = 200;
    private readonly BAR_HEIGHT = 30;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        this.background = scene.add.graphics();
        this.background.fillStyle(0x000000, 0.5);
        this.background.fillRoundedRect(-2, -2, this.BAR_WIDTH + 4, this.BAR_HEIGHT + 4, 8);
        this.add(this.background);

        this.bar = scene.add.graphics();
        this.add(this.bar);

        scene.add.existing(this);
        this.updateBar(0);
    }

    updateBar(percent: number, isBursting: boolean = false, burstProgress: number = 0) {
        this.bar.clear();

        // Color logic
        let color = 0xffcc00; // Normal: Yellow/Gold
        if (isBursting) {
            // "Burning Rope" effect: Shift from Purple to Red as it expires
            const r = Phaser.Math.Linear(255, 255, 1 - burstProgress);
            const g = Phaser.Math.Linear(0, 100, burstProgress);
            const b = Phaser.Math.Linear(255, 0, burstProgress);
            color = Phaser.Display.Color.GetColor(r, g, b);
        }

        this.bar.fillStyle(color, 1);

        // Fill logic
        const displayPercent = isBursting ? burstProgress : percent;
        if (displayPercent > 0) {
            this.bar.fillRoundedRect(0, 0, this.BAR_WIDTH * displayPercent, this.BAR_HEIGHT, 6);
        }

        // Add glow during burst
        if (isBursting) {
            this.bar.lineStyle(2, 0xffffff, 1);
            this.bar.strokeRoundedRect(0, 0, this.BAR_WIDTH, this.BAR_HEIGHT, 6);
        }
    }
}
