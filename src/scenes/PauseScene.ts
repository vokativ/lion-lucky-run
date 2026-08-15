import Phaser from 'phaser';
import { AudioSystem } from '../systems/AudioSystem';
import { Settings } from '../storage/Settings';

export class PauseScene extends Phaser.Scene {
    private audioSystem!: AudioSystem;

    constructor() {
        super('PauseScene');
    }

    create() {
        const width = 1280;
        const height = 720;

        this.audioSystem = new AudioSystem(this);

        this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0);

        this.add.text(width / 2, height / 2 - 120, 'PAUSED', {
            fontSize: '76px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        // Sound toggle
        const soundBtn = this.add.text(width / 2, height / 2 - 30, `Sound: ${Settings.isSoundEnabled() ? 'ON 🔊' : 'OFF 🔇'}`, {
            fontSize: '32px',
            color: '#ffd700',
            backgroundColor: '#00000088',
            padding: { x: 20, y: 8 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        soundBtn.on('pointerdown', () => {
            const enabled = Settings.toggleSound();
            soundBtn.setText(`Sound: ${enabled ? 'ON 🔊' : 'OFF 🔇'}`);
            if (enabled) {
                this.audioSystem.playButton();
            }
        });

        const resumeButton = this.add.text(width / 2 - 130, height / 2 + 80, 'RESUME', {
            fontSize: '44px',
            color: '#ffffff',
            backgroundColor: '#2b9348',
            padding: { x: 26, y: 14 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        const quitButton = this.add.text(width / 2 + 130, height / 2 + 80, 'QUIT', {
            fontSize: '44px',
            color: '#ffffff',
            backgroundColor: '#d62828',
            padding: { x: 26, y: 14 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        resumeButton.on('pointerdown', () => {
            this.audioSystem.playButton();
            this.resume();
        });

        quitButton.on('pointerdown', () => {
            this.audioSystem.playButton();
            this.quit();
        });

        if (this.input.keyboard) {
            this.input.keyboard.once('keydown-P', () => this.resume());
            this.input.keyboard.once('keydown-ESC', () => this.resume());
            this.input.keyboard.once('keydown-Q', () => this.quit());
        }
    }

    private resume() {
        this.scene.resume('GameScene');
        this.scene.stop();
    }

    private quit() {
        this.scene.stop('GameScene');
        this.scene.start('MenuScene');
        this.scene.stop();
    }
}
