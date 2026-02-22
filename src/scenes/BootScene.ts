import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Load assets here
        this.load.setBaseURL('./');

        // Loading progress bar
        const cx = this.cameras.main.width / 2;
        const cy = this.cameras.main.height / 2;
        const barW = 400;
        const barH = 28;

        this.add.rectangle(cx, cy, barW + 4, barH + 4, 0x000000, 0.6);
        const fill = this.add.rectangle(cx - barW / 2, cy, 0, barH, 0xffd700).setOrigin(0, 0.5);
        const label = this.add.text(cx, cy - 36, 'Loading...', {
            fontSize: '26px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
        }).setOrigin(0.5);

        this.load.on('progress', (v: number) => { fill.width = barW * v; });
        this.load.on('complete', () => { fill.destroy(); label.destroy(); });

        const assetFolder = '4k';

        const backgrounds = ['bg_sky', 'bg_forest', 'bg_rainbow', 'bg_singapore', 'bg_dragon', 'bg_legend'];
        backgrounds.forEach(bg => {
            this.load.image(bg, `assets/backgrounds/${assetFolder}/${bg}.png`);
        });

        // Sprites
        this.load.image('lion', 'assets/sprites/lion.png');
        this.load.image('tail_segment', 'assets/sprites/tail_segment.png');
        this.load.image('orange', 'assets/sprites/orange.png');
        this.load.image('hongbao', 'assets/sprites/hongbao.png');
        this.load.image('lantern', 'assets/sprites/lantern.png');
        this.load.image('ghost', 'assets/sprites/ghost.png');
        this.load.image('stone', 'assets/sprites/stone.png');
        this.load.image('body_segment', 'assets/sprites/body_segment.png');

        // Audio (Assuming these exist or will be added)
        // this.load.audio('bgm_main', 'assets/audio/bgm_main.mp3');
        // this.load.audio('sfx_collect', 'assets/audio/collect.mp3');
        // this.load.audio('sfx_bonk', 'assets/audio/bonk.mp3');
        // this.load.audio('sfx_burst', 'assets/audio/burst.mp3');
        // this.load.audio('sfx_gameover', 'assets/audio/gameover.mp3');

        this.cameras.main.setBackgroundColor('#87CEEB'); // Sky blue
    }

    create() {
        this.scene.start('MenuScene');
    }
}
