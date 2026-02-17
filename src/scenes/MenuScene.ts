import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        this.buildLayout();
        this.scale.on('resize', this.handleResize, this);
    }

    private handleResize() {
        this.children.removeAll(true);
        this.buildLayout();
    }

    private buildLayout() {
        const { width, height } = this.scale;
        const baseSize = Math.min(width, height);

        const titleSize = Math.max(32, Math.round(baseSize * 0.08));
        const buttonSize = Math.max(48, Math.round(baseSize * 0.12));
        const padX = Math.round(baseSize * 0.06);
        const padY = Math.round(baseSize * 0.03);

        this.cameras.main.setSize(width, height);

        this.add.text(width / 2, height * 0.35, 'Lion Train\nLucky Run', {
            fontSize: `${titleSize}px`,
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: Math.round(titleSize * 0.12),
            align: 'center'
        }).setOrigin(0.5);

        const playButton = this.add.text(width / 2, height * 0.55, 'PLAY', {
            fontSize: `${buttonSize}px`,
            color: '#00ff00',
            fontStyle: 'bold',
            backgroundColor: '#000000',
            padding: { x: padX, y: padY }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        playButton.on('pointerdown', () => {
            this.scale.startFullscreen();
            this.scene.start('GameScene');
        });
    }

    shutdown() {
        this.scale.off('resize', this.handleResize, this);
    }
}
