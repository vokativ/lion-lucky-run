import Phaser from 'phaser';
import { Settings, LionColors, Difficulties } from '../storage/Settings';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const width = 1280;
        const height = 720;

        // Bouncy Title
        const title = this.add.text(width / 2, height * 0.25, 'Lion Train\nLucky Run!', {
            fontSize: '84px',
            color: '#fffb00',
            fontStyle: 'bold',
            stroke: '#ff8800',
            strokeThickness: 12,
            align: 'center'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: title,
            y: title.y - 15,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Lion Selection Label
        this.add.text(width / 2, height * 0.45, 'Choose Your Lion!', {
            fontSize: '36px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#44aaff',
            strokeThickness: 8
        }).setOrigin(0.5);

        const colors = [
            { key: LionColors.RED, texture: 'lion' },
            { key: LionColors.BLUE, texture: 'lion_blue' },
            { key: LionColors.JADE, texture: 'lion_jade' }
        ];

        let lionSprites: Phaser.GameObjects.Sprite[] = [];

        colors.forEach((c, index) => {
            const xPos = width / 2 + (index - 1) * 160;

            const sprite = this.add.sprite(xPos, height * 0.55, c.texture)
                .setScale(1.5)
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true });

            lionSprites.push(sprite);

            if (Settings.getColor() === c.key) {
                sprite.preFX?.addGlow(0xffffff, 4, 0, false, 0.1, 30);
                sprite.setScale(1.7); // Make selected slightly bigger
            }

            sprite.on('pointerdown', () => {
                Settings.setColor(c.key);
                colors.forEach((col, i) => {
                    lionSprites[i].preFX?.clear();
                    lionSprites[i].setScale(1.5);
                    if (Settings.getColor() === col.key) {
                        lionSprites[i].preFX?.addGlow(0xffffff, 4, 0, false, 0.1, 30);
                        lionSprites[i].setScale(1.7);
                    }
                });
            });
        });

        // Difficulty Label
        this.add.text(width / 2, height * 0.70, 'How Fast?', {
            fontSize: '36px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#ff44aa',
            strokeThickness: 8
        }).setOrigin(0.5);

        const difficulties = [
            { key: Difficulties.EASY, label: 'Easy Run', color: '#aaffaa', stroke: '#00aa00' },
            { key: Difficulties.NORMAL, label: 'Normal', color: '#ffffaa', stroke: '#aaaa00' },
            { key: Difficulties.SUPER_HARD, label: 'Super Fast!', color: '#ffaaaa', stroke: '#aa0000' }
        ];

        let diffTextObjects: Phaser.GameObjects.Text[] = [];

        difficulties.forEach((d, index) => {
            const xPos = width / 2 + (index - 1) * 220;
            const btn = this.add.text(xPos, height * 0.78, d.label, {
                fontSize: '32px',
                color: d.color,
                fontStyle: 'bold',
                stroke: d.stroke,
                strokeThickness: 8
            })
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true });

            diffTextObjects.push(btn);

            // Set initial state
            if (Settings.getDifficulty() === d.key) {
                btn.setScale(1.2);
                btn.preFX?.addGlow(0xffffff, 2, 0, false, 0.1, 20);
            }

            btn.on('pointerdown', () => {
                Settings.setDifficulty(d.key);
                diffTextObjects.forEach((t, i) => {
                    t.preFX?.clear();
                    t.setScale(1.0);
                    if (Settings.getDifficulty() === difficulties[i].key) {
                        t.setScale(1.2);
                        t.preFX?.addGlow(0xffffff, 2, 0, false, 0.1, 20);
                    }
                });
            });
        });

        // Giant Play Button
        const playButton = this.add.text(width / 2, height * 0.92, 'PLAY NOW!', {
            fontSize: '80px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#32cd32', // lime green stroke
            strokeThickness: 16,
            shadow: { offsetX: 0, offsetY: 8, color: '#005500', blur: 0, stroke: false, fill: true }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        // Pulse Play Button
        this.tweens.add({
            targets: playButton,
            scale: 1.1,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        playButton.on('pointerdown', () => {
            this.scale.startFullscreen();
            this.scene.start('GameScene');
        });
    }
}
