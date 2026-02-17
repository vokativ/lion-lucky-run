import Phaser from 'phaser';

export class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }

    create() {
        const { width, height } = this.scale;
        const baseSize = Math.min(width, height);

        const titleSize = Math.max(40, Math.round(baseSize * 0.1));
        const buttonSize = Math.max(32, Math.round(baseSize * 0.07));
        const padX = Math.round(baseSize * 0.05);
        const padY = Math.round(baseSize * 0.025);
        const spacing = Math.round(baseSize * 0.15);

        this.add.rectangle(0, 0, width, height, 0x000000, 0.5).setOrigin(0);

        this.add.text(width / 2, height / 2 - spacing, 'PAUSED', {
            fontSize: `${titleSize}px`,
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const resumeButton = this.add.text(width / 2, height / 2 + spacing * 0.3, 'RESUME', {
            fontSize: `${buttonSize}px`,
            color: '#00ff00',
            backgroundColor: '#000000',
            padding: { x: padX, y: padY }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        const quitButton = this.add.text(width / 2, height / 2 + spacing * 1.2, 'QUIT', {
            fontSize: `${buttonSize}px`,
            color: '#ff0000',
            backgroundColor: '#000000',
            padding: { x: padX, y: padY }
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
