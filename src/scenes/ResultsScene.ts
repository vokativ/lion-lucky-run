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

        this.add.text(width / 2, height / 4, 'Game Over', {
            fontSize: '64px',
            color: '#ff0000',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 3, `Score: ${this.score}`, {
            fontSize: '48px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Sticker Logic
        // Unlock a sticker if score > 50 (for testing)
        let newSticker: string | null = null;
        if (this.score >= 50) {
            newSticker = Stickers.unlockRandomSticker();
        }

        if (newSticker) {
            this.add.text(width / 2, height * 0.45, 'New Sticker Unlocked!', {
                fontSize: '32px',
                color: '#ffff00',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);

            // Show sticker placeholder (text or graphic)
            this.add.text(width / 2, height * 0.55, newSticker, {
                fontSize: '24px',
                color: '#00ff00'
            }).setOrigin(0.5);
        } else {
            const count = Stickers.getUnlockedStickers().length;
            const total = Stickers.getAllStickers().length;
            this.add.text(width / 2, height * 0.5, `Stickers: ${count}/${total}`, {
                fontSize: '24px',
                color: '#cccccc'
            }).setOrigin(0.5);
        }

        const restartButton = this.add.text(width / 2, height * 0.75, 'RESTART', {
            fontSize: '48px',
            color: '#00ff00',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        restartButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
