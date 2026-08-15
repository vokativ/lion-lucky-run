import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        const cx = this.cameras.main.width / 2;
        const cy = this.cameras.main.height / 2;
        const barW = 400;
        const barH = 28;

        const bgRect = this.add.rectangle(cx, cy, barW + 4, barH + 4, 0x000000, 0.6);
        const fill = this.add.rectangle(cx - barW / 2, cy, 0, barH, 0xffd700).setOrigin(0, 0.5);
        const label = this.add.text(cx, cy - 36, 'Loading...', {
            fontSize: '26px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
        }).setOrigin(0.5);

        this.load.on('progress', (v: number) => { fill.width = barW * v; });
        this.load.on('complete', () => {
            bgRect.destroy();
            fill.destroy();
            label.destroy();
        });

        this.load.setPath('assets/');

        const backgrounds = ['bg_sky', 'bg_forest', 'bg_rainbow', 'bg_singapore', 'bg_dragon', 'bg_legend'];
        backgrounds.forEach(bg => {
            this.load.image(bg, `backgrounds/4k/${bg}.png`);
        });

        // Sprites
        this.load.image('lion', 'sprites/lion.png');
        this.load.image('lion_blue', 'sprites/lion_blue.png');
        this.load.image('lion_golden', 'sprites/lion_golden.png');
        this.load.image('lion_jade', 'sprites/lion_jade.png');

        this.load.image('body_segment', 'sprites/body_segment.png');
        this.load.image('body_segment_blue', 'sprites/body_segment_blue.png');
        this.load.image('body_segment_golden', 'sprites/body_segment_golden.png');
        this.load.image('body_segment_jade', 'sprites/body_segment_jade.png');

        this.load.image('tail_segment', 'sprites/tail_segment.png');
        this.load.image('tail_segment_blue', 'sprites/tail_segment_blue.png');
        this.load.image('tail_segment_golden', 'sprites/tail_segment_golden.png');
        this.load.image('tail_segment_jade', 'sprites/tail_segment_jade.png');

        this.load.image('orange', 'sprites/orange.png');
        this.load.image('hongbao', 'sprites/hongbao.png');
        this.load.image('lantern', 'sprites/lantern.png');
        this.load.image('firecracker', 'sprites/firecracker.png');
        this.load.image('ghost', 'sprites/ghost.png');
        this.load.image('stone', 'sprites/stone.png');

        this.cameras.main.setBackgroundColor('#87CEEB');
    }

    create() {
        this.children.removeAll(true);
        this.scene.start('MenuScene');
    }
}
