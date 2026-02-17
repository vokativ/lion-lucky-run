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
        const width = 1280;
        const height = 720;

        this.add.text(width / 2, height * 0.2, 'Game Over', {
            fontSize: '80px',
            color: '#ff0000',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.35, `Score: ${this.score}`, {
            fontSize: '56px',
            color: '#ffffff'
        }).setOrigin(0.5);

        let newSticker: string | null = null;
        if (this.score >= 50) {
            newSticker = Stickers.unlockRandomSticker();
        }

        if (newSticker) {
            this.add.text(width / 2, height * 0.5, 'New Sticker Unlocked!', {
                fontSize: '36px',
                color: '#ffff00',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);

            this.add.text(width / 2, height * 0.6, newSticker, {
                fontSize: '28px',
                color: '#00ff00'
            }).setOrigin(0.5);
        } else {
            const count = Stickers.getUnlockedStickers().length;
            const total = Stickers.getAllStickers().length;
            this.add.text(width / 2, height * 0.52, `Stickers: ${count}/${total}`, {
                fontSize: '32px',
                color: '#cccccc'
            }).setOrigin(0.5);
        }

        const restartButton = this.add.text(width / 2, height * 0.78, 'RESTART', {
            fontSize: '56px',
            color: '#00ff00',
            backgroundColor: '#000000',
            padding: { x: 30, y: 15 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        restartButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
