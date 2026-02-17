import Phaser from 'phaser';
import { Stickers } from '../systems/StickerSystem';

export class ResultsScene extends Phaser.Scene {
    private score: number = 0;

    constructor() {
        super('ResultsScene');
    }

    init(data: { score: number }) {
        this.score = data.score || 0;
    }

    create() {
        const { width, height } = this.scale;
        const baseSize = Math.min(width, height);

        const titleSize = Math.max(40, Math.round(baseSize * 0.1));
        const scoreSize = Math.max(32, Math.round(baseSize * 0.08));
        const infoSize = Math.max(20, Math.round(baseSize * 0.05));
        const buttonSize = Math.max(32, Math.round(baseSize * 0.08));
        const padX = Math.round(baseSize * 0.05);
        const padY = Math.round(baseSize * 0.025);

        this.add.text(width / 2, height * 0.2, 'Game Over', {
            fontSize: `${titleSize}px`,
            color: '#ff0000',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: Math.round(titleSize * 0.1)
        }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.32, `Score: ${this.score}`, {
            fontSize: `${scoreSize}px`,
            color: '#ffffff'
        }).setOrigin(0.5);

        let newSticker: string | null = null;
        if (this.score >= 50) {
            newSticker = Stickers.unlockRandomSticker();
        }

        if (newSticker) {
            this.add.text(width / 2, height * 0.45, 'New Sticker Unlocked!', {
                fontSize: `${infoSize}px`,
                color: '#ffff00',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);

            this.add.text(width / 2, height * 0.55, newSticker, {
                fontSize: `${infoSize}px`,
                color: '#00ff00'
            }).setOrigin(0.5);
        } else {
            const count = Stickers.getUnlockedStickers().length;
            const total = Stickers.getAllStickers().length;
            this.add.text(width / 2, height * 0.5, `Stickers: ${count}/${total}`, {
                fontSize: `${infoSize}px`,
                color: '#cccccc'
            }).setOrigin(0.5);
        }

        const restartButton = this.add.text(width / 2, height * 0.72, 'RESTART', {
            fontSize: `${buttonSize}px`,
            color: '#00ff00',
            backgroundColor: '#000000',
            padding: { x: padX, y: padY }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        restartButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
