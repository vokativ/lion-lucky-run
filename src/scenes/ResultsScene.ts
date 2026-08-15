import Phaser from 'phaser';
import { Stickers } from '../systems/StickerSystem';
import { Settings } from '../storage/Settings';
import { AudioSystem } from '../systems/AudioSystem';

const STICKER_NAMES: Record<string, string> = {
    sticker_lion_head: 'Lion Head 🦁',
    sticker_lantern: 'Festive Lantern 🏮',
    sticker_orange: 'Lucky Orange 🍊',
    sticker_drum: 'Festival Drum 🥁',
    sticker_firecracker: 'Firecracker 🧨',
    sticker_gold_ingot: 'Gold Ingot 🪙'
};

export class ResultsScene extends Phaser.Scene {
    private score: number = 0;
    private audioSystem!: AudioSystem;

    constructor() {
        super('ResultsScene');
    }

    init(data: { score?: number }) {
        this.score = data.score || 0;
    }

    create() {
        const width = 1280;
        const height = 720;

        this.audioSystem = new AudioSystem(this);
        this.add.image(width / 2, height / 2, 'bg_sky').setDisplaySize(width, height).setAlpha(0.6);
        const bestScore = Settings.getHighScore();
        const isNewRecord = this.score > 0 && this.score >= bestScore;

        this.add.text(width / 2, height * 0.16, 'Game Over', {
            fontSize: '76px',
            color: '#ff3333',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.30, `Score: ${this.score}`, {
            fontSize: '56px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);

        if (isNewRecord) {
            const recordBadge = this.add.text(width / 2, height * 0.40, '✨ NEW BEST RECORD! ✨', {
                fontSize: '32px',
                color: '#ffd700',
                fontStyle: 'bold',
                stroke: '#8b0000',
                strokeThickness: 6
            }).setOrigin(0.5);

            this.tweens.add({
                targets: recordBadge,
                scale: 1.1,
                duration: 600,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        } else {
            this.add.text(width / 2, height * 0.40, `Best Score: ${bestScore}`, {
                fontSize: '30px',
                color: '#ffd700',
                fontStyle: 'bold'
            }).setOrigin(0.5);
        }

        let newSticker: string | null = null;
        if (this.score >= 50) {
            newSticker = Stickers.unlockRandomSticker();
        }

        if (newSticker) {
            const stickerLabel = STICKER_NAMES[newSticker] || newSticker;
            this.add.text(width / 2, height * 0.52, '🎁 New Sticker Unlocked!', {
                fontSize: '32px',
                color: '#55ff55',
                stroke: '#004400',
                strokeThickness: 5,
                fontStyle: 'bold'
            }).setOrigin(0.5);

            this.add.text(width / 2, height * 0.61, stickerLabel, {
                fontSize: '36px',
                color: '#ffffff',
                backgroundColor: '#000000aa',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5);
        } else {
            const count = Stickers.getUnlockedStickers().length;
            const total = Stickers.getAllStickers().length;
            this.add.text(width / 2, height * 0.55, `Stickers Collected: ${count}/${total}`, {
                fontSize: '28px',
                color: '#e0e0e0',
                backgroundColor: '#00000066',
                padding: { x: 16, y: 8 }
            }).setOrigin(0.5);
        }

        // Play Again Button
        const restartButton = this.add.text(width / 2 - 170, height * 0.80, 'PLAY AGAIN', {
            fontSize: '44px',
            color: '#ffffff',
            fontStyle: 'bold',
            backgroundColor: '#2b9348',
            padding: { x: 30, y: 16 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        // Menu Button
        const menuButton = this.add.text(width / 2 + 170, height * 0.80, 'MAIN MENU', {
            fontSize: '44px',
            color: '#ffffff',
            fontStyle: 'bold',
            backgroundColor: '#0077b6',
            padding: { x: 30, y: 16 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        restartButton.on('pointerdown', () => {
            this.audioSystem.playButton();
            this.scene.start('GameScene');
        });

        menuButton.on('pointerdown', () => {
            this.audioSystem.playButton();
            this.scene.start('MenuScene');
        });
    }
}
