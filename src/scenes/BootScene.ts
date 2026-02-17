import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Load assets here
        this.load.setBaseURL('./');

        // Resolution detection
        const { width } = this.scale;
        let assetFolder = '4k'; // Force 4k for now since downscaling failed
        console.log('Forcing asset folder to 4k due to environment issues');

        // if (width > 3000) {
        //     assetFolder = '4k';
        // } else if (width > 1280) {
        //     assetFolder = 'laptop';
        // }

        console.log(`Detected width ${width}, loading assets from: ${assetFolder}`);

        const backgrounds = ['bg_sky', 'bg_forest', 'bg_rainbow', 'bg_singapore', 'bg_dragon', 'bg_legend'];
        backgrounds.forEach(bg => {
            const path = `assets/backgrounds/${assetFolder}/${bg}.png`;
            console.log(`Loading background: ${bg} from ${path}`);
            this.load.image(bg, path);
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
