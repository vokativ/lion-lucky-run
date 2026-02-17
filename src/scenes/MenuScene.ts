import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const width = 1280;
        const height = 720;

        this.add.text(width / 2, height * 0.3, 'Lion Train\nLucky Run', {
            fontSize: '72px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        const playButton = this.add.text(width / 2, height * 0.6, 'PLAY', {
            fontSize: '96px',
            color: '#00ff00',
            fontStyle: 'bold',
            backgroundColor: '#000000',
            padding: { x: 40, y: 20 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        playButton.on('pointerdown', () => {
            this.scale.startFullscreen();
            this.scene.start('GameScene');
        });
    }
}
