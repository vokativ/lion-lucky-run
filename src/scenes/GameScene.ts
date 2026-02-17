import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Spawner } from '../systems/Spawner';
import { FortuneSystem } from '../systems/FortuneSystem';
import { FortuneMeter } from '../ui/FortuneMeter';
// import { AudioSystem } from '../systems/AudioSystem';

export class GameScene extends Phaser.Scene {
    private player!: Player;
    private spawner!: Spawner;
    private fortuneSystem!: FortuneSystem;
    private fortuneMeter!: FortuneMeter;
    // private audioSystem!: AudioSystem; // TODO: re-enable when audio is added
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
        const { width, height } = this.scale;

        // Select a random background
        const backgrounds = ['bg_sky', 'bg_forest', 'bg_rainbow', 'bg_singapore', 'bg_dragon', 'bg_legend'];
        this.backgroundKey = Phaser.Utils.Array.GetRandom(backgrounds);

        // Background (Parallax)
        this.background = this.add.tileSprite(0, 0, width, height, this.backgroundKey)
            .setOrigin(0)
            .setScrollFactor(0);

        // Scale background to "cover" screen correctly
        const bgTexture = this.textures.get(this.backgroundKey).getSourceImage() as HTMLImageElement;
        const bgWidth = bgTexture ? bgTexture.width : 1280;
        const bgHeight = bgTexture ? bgTexture.height : 720;

        const scaleX = width / bgWidth;
        const scaleY = height / bgHeight;
        const scale = Math.max(scaleX, scaleY);

        this.background.setTileScale(scale, scale);

        // Center the background if needed (though tileSprite usually covers 0,0)
        // Ensure the tilePosition is reset to avoid "jumps" if key changed
        this.background.setTilePosition(0, 0);

        // Systems
        this.fortuneSystem = new FortuneSystem(this);
        // this.audioSystem = new AudioSystem(this);
        // this.audioSystem.playBGM('bgm_main');

        // Inputs
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();

            // Pause/Quit shortcuts
            this.input.keyboard.on('keydown-P', () => this.togglePause());
            this.input.keyboard.on('keydown-ESC', () => this.togglePause());
            this.input.keyboard.on('keydown-Q', () => this.quitGame());
        }

        // Entities
        this.player = new Player(this, 100, height / 2);
        this.spawner = new Spawner(this);

        // UI
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

        // Collisions
        this.physics.add.overlap(this.player, this.spawner.getGroup(), this.handleCollision, undefined, this);

        // Events
        // this.events.on('lucky-burst-start', () => this.audioSystem.playSFX('sfx_burst'));

        this.scale.on('resize', this.handleResize, this);

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    private handleResize(gameSize: Phaser.Structs.Size) {
        const width = gameSize.width;
        const height = gameSize.height;

        this.cameras.main.setSize(width, height);

        this.background.setSize(width, height);
        const bgTexture = this.textures.get(this.backgroundKey).getSourceImage() as HTMLImageElement;
        const bgWidth = bgTexture ? bgTexture.width : 1280;
        const bgHeight = bgTexture ? bgTexture.height : 720;
        const scaleX = width / bgWidth;
        const scaleY = height / bgHeight;
        this.background.setTileScale(Math.max(scaleX, scaleY), Math.max(scaleX, scaleY));

        this.pauseButton.setPosition(width - 20, 20);
        this.quitButton.setPosition(width - 20, 90);
    }

    update(time: number, delta: number) {
        // Scroll background (Parallax)
        // Base speed 2px per frame at 60fps (approx 0.12px per ms)
        this.background.tilePositionX += 0.1 * delta;

        this.player.update(time, delta, this.cursors, this.fortuneSystem.getFortunePercent(), this.fortuneSystem.isBursting());
        this.spawner.update(time, delta);

        // Update UI
        this.fortuneMeter.updateBar(
            this.fortuneSystem.getFortunePercent(),
            this.fortuneSystem.isBursting(),
            this.fortuneSystem.getBurstProgress()
        );
    }

    private handleCollision(_player: any, object: any) {
        if (!object.active) return; // Prevent double collision if already processed

        const type = object.getData('type');
        const texture = object.texture.key;

        // console.log(`Collision with ${type} (${texture}) - Bursting: ${this.player.getIsBursting()}`);

        if (type === 'collectible') {
            this.score += 10;
            this.scoreText.setText(`Score: ${this.score}`);
            this.fortuneSystem.addFortune(10);
            // this.audioSystem.playSFX('sfx_collect');
            object.destroy();
        } else if (type === 'obstacle') {
            if (this.player.getIsBursting()) {
                // Destroy obstacle during burst
                console.log(`Destroying ${texture} during burst`);
                object.destroy();
            } else {
                // Sonic Mechanics:
                // If fortune > 0, lose all fortune (survive).
                // If fortune == 0, Game Over.

                if (this.fortuneSystem.getFortune() > 0) {
                    // Survive but lose fortune
                    console.log('Surviving hit, resetting fortune');
                    this.player.bonk();
                    this.fortuneSystem.resetFortune();
                    // this.audioSystem.playSFX('sfx_bonk');
                    object.destroy();
                } else {
                    // Game Over
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
        // this.audioSystem.playSFX('sfx_gameover');
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('ResultsScene', { score: this.score });
        });
    }
}
