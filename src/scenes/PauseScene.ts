import Phaser from 'phaser';

export class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }

    create() {
        const width = 1280;
        const height = 720;

        this.add.rectangle(0, 0, width, height, 0x000000, 0.5).setOrigin(0);

        this.add.text(width / 2, height / 2 - 100, 'PAUSED', {
            fontSize: '80px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const resumeButton = this.add.text(width / 2, height / 2 + 40, 'RESUME', {
            fontSize: '52px',
            color: '#00ff00',
            backgroundColor: '#000000',
            padding: { x: 30, y: 15 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        const quitButton = this.add.text(width / 2, height / 2 + 150, 'QUIT', {
            fontSize: '52px',
            color: '#ff0000',
            backgroundColor: '#000000',
            padding: { x: 30, y: 15 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        resumeButton.on('pointerdown', () => this.resume());
        quitButton.on('pointerdown', () => this.quit());

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
