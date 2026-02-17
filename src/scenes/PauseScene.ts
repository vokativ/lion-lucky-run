import Phaser from 'phaser';

export class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }

    create() {
        const { width, height } = this.scale;

        // Dim background
        this.add.rectangle(0, 0, width, height, 0x000000, 0.5).setOrigin(0);

        this.add.text(width / 2, height / 2 - 50, 'PAUSED', {
            fontSize: '64px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const resumeButton = this.add.text(width / 2, height / 2 + 50, 'RESUME', {
            fontSize: '42px',
            color: '#00ff00',
            backgroundColor: '#000000',
            padding: { x: 30, y: 15 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        const quitButton = this.add.text(width / 2, height / 2 + 140, 'QUIT', {
            fontSize: '42px',
            color: '#ff0000',
            backgroundColor: '#000000',
            padding: { x: 30, y: 15 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        resumeButton.on('pointerdown', () => this.resume());
        quitButton.on('pointerdown', () => this.quit());

        // Keyboard listeners for pause scene
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
