import Phaser from 'phaser';
import { Settings, LionColors, Difficulties } from '../storage/Settings';
import { AudioSystem } from '../systems/AudioSystem';

export class MenuScene extends Phaser.Scene {
    private audioSystem!: AudioSystem;

    constructor() {
        super('MenuScene');
    }

    create() {
        const width = 1280;
        const height = 720;

        this.audioSystem = new AudioSystem(this);
        this.add.image(width / 2, height / 2, 'bg_sky').setDisplaySize(width, height).setAlpha(0.6);
        // Sound toggle button in top corner
        const soundBtn = this.add.text(width - 40, 40, Settings.isSoundEnabled() ? '🔊' : '🔇', {
            fontSize: '32px',
        })
            .setOrigin(1, 0)
            .setInteractive({ useHandCursor: true });

        soundBtn.on('pointerdown', () => {
            const enabled = Settings.toggleSound();
            soundBtn.setText(enabled ? '🔊' : '🔇');
            if (enabled) {
                this.audioSystem.playButton();
            }
        });

        // Bouncy Title
        const title = this.add.text(width / 2, height * 0.18, 'Lion Train\nLucky Run! 🏮', {
            fontSize: '76px',
            color: '#fffb00',
            fontStyle: 'bold',
            stroke: '#d62828',
            strokeThickness: 12,
            align: 'center',
            shadow: { offsetX: 0, offsetY: 6, color: '#6a040f', blur: 0, stroke: true, fill: true }
        }).setOrigin(0.5);

        this.tweens.add({
            targets: title,
            y: title.y - 10,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Best Score Badge
        const bestScore = Settings.getHighScore();
        this.add.text(width / 2, height * 0.35, `🏆 Best Score: ${bestScore}`, {
            fontSize: '28px',
            color: '#ffffff',
            fontStyle: 'bold',
            backgroundColor: '#00000088',
            padding: { x: 20, y: 8 }
        }).setOrigin(0.5);

        // Lion Selection Label
        this.add.text(width / 2, height * 0.44, 'Choose Your Lion!', {
            fontSize: '32px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#0077b6',
            strokeThickness: 6
        }).setOrigin(0.5);

        const colors = [
            { key: LionColors.RED, texture: 'lion', label: 'Red' },
            { key: LionColors.BLUE, texture: 'lion_blue', label: 'Blue' },
            { key: LionColors.JADE, texture: 'lion_jade', label: 'Jade' },
            { key: LionColors.GOLDEN, texture: 'lion_golden', label: 'Gold' }
        ];

        const lionSprites: Phaser.GameObjects.Sprite[] = [];

        const applyLionSelectionStyle = (selectedKey: string) => {
            colors.forEach((col, i) => {
                lionSprites[i].preFX?.clear();
                lionSprites[i].setScale(1.3);
                if (selectedKey === col.key) {
                    lionSprites[i].preFX?.addGlow(0xffffff, 4, 0, false, 0.1, 25);
                    lionSprites[i].setScale(1.55);
                }
            });
        };

        colors.forEach((c, index) => {
            const xPos = width / 2 + (index - 1.5) * 140;

            const sprite = this.add.sprite(xPos, height * 0.54, c.texture)
                .setScale(1.3)
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true });

            lionSprites.push(sprite);

            sprite.on('pointerdown', () => {
                this.audioSystem.playButton();
                Settings.setColor(c.key);
                applyLionSelectionStyle(c.key);
            });
        });

        applyLionSelectionStyle(Settings.getColor());

        // Difficulty Label
        this.add.text(width / 2, height * 0.67, 'How Fast?', {
            fontSize: '30px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#7209b7',
            strokeThickness: 6
        }).setOrigin(0.5);

        const difficulties = [
            { key: Difficulties.EASY, label: 'Easy Run', color: '#aaffaa', stroke: '#008800' },
            { key: Difficulties.NORMAL, label: 'Normal', color: '#ffffaa', stroke: '#aa8800' },
            { key: Difficulties.SUPER_HARD, label: 'Super Fast!', color: '#ffaaaa', stroke: '#aa0000' }
        ];

        const diffTextObjects: Phaser.GameObjects.Text[] = [];

        const applyDiffSelectionStyle = (selectedKey: string) => {
            difficulties.forEach((diff, i) => {
                const t = diffTextObjects[i];
                t.preFX?.clear();
                t.setScale(1.0);
                if (selectedKey === diff.key) {
                    t.setScale(1.15);
                    t.preFX?.addGlow(0xffffff, 2, 0, false, 0.1, 15);
                }
            });
        };

        difficulties.forEach((d, index) => {
            const xPos = width / 2 + (index - 1) * 220;
            const btn = this.add.text(xPos, height * 0.75, d.label, {
                fontSize: '28px',
                color: d.color,
                fontStyle: 'bold',
                stroke: d.stroke,
                strokeThickness: 7
            })
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true });

            diffTextObjects.push(btn);

            btn.on('pointerdown', () => {
                this.audioSystem.playButton();
                Settings.setDifficulty(d.key);
                applyDiffSelectionStyle(d.key);
            });
        });

        applyDiffSelectionStyle(Settings.getDifficulty());

        // Giant Play Button
        const playButton = this.add.text(width / 2, height * 0.89, 'PLAY NOW!', {
            fontSize: '72px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#2b9348',
            strokeThickness: 14,
            shadow: { offsetX: 0, offsetY: 6, color: '#004b23', blur: 0, stroke: false, fill: true }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.tweens.add({
            targets: playButton,
            scale: 1.08,
            duration: 700,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        playButton.on('pointerdown', () => {
            this.audioSystem.playButton();
            if (this.scale.fullscreen && this.scale.fullscreen.available && !this.scale.isFullscreen) {
                try {
                    this.scale.startFullscreen();
                } catch (e) {
                    console.warn('Fullscreen not allowed in iframe', e);
                }
            }
            this.scene.start('GameScene');
        });

        // Auto-start for headless QA if URL has ?autostart=1
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('autostart') === '1') {
                this.time.delayedCall(400, () => {
                    this.scene.start('GameScene');
                });
            }
        }
    }
}
