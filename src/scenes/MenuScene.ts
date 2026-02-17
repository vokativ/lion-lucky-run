import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const { width, height } = this.scale;

        this.add.text(width / 2, height / 3, 'Lion Train Lucky Run', {
            fontSize: '48px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        const playButton = this.add.text(width / 2, height / 2, 'PLAY', {
            fontSize: '64px',
            color: '#00ff00',
            fontStyle: 'bold',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        playButton.on('pointerdown', () => {
            this.scale.startFullscreen();
            this.scene.start('GameScene');
        });

        // Handle fullscreen fallback or "immersive" hints if needed
    }
}
