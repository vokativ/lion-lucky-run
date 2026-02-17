import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Spawner } from '../systems/Spawner';
import { FortuneSystem } from '../systems/FortuneSystem';
import { FortuneMeter } from '../ui/FortuneMeter';

export class GameScene extends Phaser.Scene {
    private player!: Player;
    private spawner!: Spawner;
    private fortuneSystem!: FortuneSystem;
    private fortuneMeter!: FortuneMeter;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private background!: Phaser.GameObjects.TileSprite;
    private backgroundKey: string = 'bg_sky';
    private pauseButton!: Phaser.GameObjects.Text;
    private quitButton!: Phaser.GameObjects.Text;

    constructor() {
        super('GameScene');
    }

    create() {
        const width = 1280;
        const height = 720;

        const backgrounds = ['bg_sky', 'bg_forest', 'bg_rainbow', 'bg_singapore', 'bg_dragon', 'bg_legend'];
        this.backgroundKey = Phaser.Utils.Array.GetRandom(backgrounds);

        this.background = this.add.tileSprite(0, 0, width, height, this.backgroundKey)
            .setOrigin(0)
            .setScrollFactor(0);

        const bgTexture = this.textures.get(this.backgroundKey).getSourceImage() as HTMLImageElement;
        const bgWidth = bgTexture ? bgTexture.width : 1280;
        const bgHeight = bgTexture ? bgTexture.height : 720;

        const scaleX = width / bgWidth;
        const scaleY = height / bgHeight;
        const scale = Math.max(scaleX, scaleY);

        this.background.setTileScale(scale, scale);
        this.background.setTilePosition(0, 0);

        this.fortuneSystem = new FortuneSystem(this);

        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
            this.input.keyboard.on('keydown-P', () => this.togglePause());
            this.input.keyboard.on('keydown-ESC', () => this.togglePause());
            this.input.keyboard.on('keydown-Q', () => this.quitGame());
        }

        this.player = new Player(this, 100, height / 2);
        this.spawner = new Spawner(this);

        this.scoreText = this.add.text(20, 20, 'Score: 0', {
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });

        this.fortuneMeter = new FortuneMeter(this, 20, 60);

        this.pauseButton = this.add.text(width - 20, 20, '⏸', {
            fontSize: '48px',
            backgroundColor: 'rgba(0,0,0,0.4)',
            padding: { x: 12, y: 8 }
        })
            .setOrigin(1, 0)
            .setScrollFactor(0)
            .setDepth(100)
            .setInteractive({ useHandCursor: true });

        this.quitButton = this.add.text(width - 20, 90, '✕', {
            fontSize: '48px',
            color: '#ff6666',
            backgroundColor: 'rgba(0,0,0,0.4)',
            padding: { x: 14, y: 8 }
        })
            .setOrigin(1, 0)
            .setScrollFactor(0)
            .setDepth(100)
            .setInteractive({ useHandCursor: true });

        this.pauseButton.on('pointerdown', () => {
            this.togglePause();
        });
        this.quitButton.on('pointerdown', () => {
            this.quitGame();
        });

        this.physics.add.overlap(this.player, this.spawner.getGroup(), this.handleCollision, undefined, this);

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    update(time: number, delta: number) {
        this.background.tilePositionX += 0.1 * delta;

        this.player.update(time, delta, this.cursors, this.fortuneSystem.getFortunePercent(), this.fortuneSystem.isBursting());
        this.spawner.update(time, delta);

        this.fortuneMeter.updateBar(
            this.fortuneSystem.getFortunePercent(),
            this.fortuneSystem.isBursting(),
            this.fortuneSystem.getBurstProgress()
        );
    }

    private handleCollision(_player: any, object: any) {
        if (!object.active) return;

        const type = object.getData('type');
        const texture = object.texture.key;

        if (type === 'collectible') {
            this.score += 10;
            this.scoreText.setText(`Score: ${this.score}`);
            this.fortuneSystem.addFortune(10);
            object.destroy();
        } else if (type === 'obstacle') {
            if (this.player.getIsBursting()) {
                console.log(`Destroying ${texture} during burst`);
                object.destroy();
            } else {
                if (this.fortuneSystem.getFortune() > 0) {
                    console.log('Surviving hit, resetting fortune');
                    this.player.bonk();
                    this.fortuneSystem.resetFortune();
                    object.destroy();
                } else {
                    console.log('Game Over triggered');
                    this.gameOver();
                }
            }
        }
    }

    private quitGame() {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('MenuScene');
        });
    }

    private togglePause() {
        this.scene.pause();
        this.scene.launch('PauseScene');
    }

    private gameOver() {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('ResultsScene', { score: this.score });
        });
    }
}
