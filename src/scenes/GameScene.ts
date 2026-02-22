import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Spawner } from '../systems/Spawner';
import { FortuneSystem } from '../systems/FortuneSystem';
import { FortuneMeter } from '../ui/FortuneMeter';

/**
 * GameScene
 *
 * The main gameplay scene where the endless runner action happens.
 * It manages:
 * - The player entity (Lion)
 * - Spawning obstacles and collectibles (Spawner)
 * - The fortune/score system
 * - Background scrolling and parallax effects
 * - Input handling (Pause, Quit)
 * - Collision detection
 */
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
    private isGameOver: boolean = false;

    constructor() {
        super('GameScene');
    }

    /**
     * Initialize the game scene.
     * Sets up the background, player, spawner, UI, and input listeners.
     */
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

        const btnSize = 70;

        const pauseBg = this.add.rectangle(width - 20 - btnSize / 2, 20 + btnSize / 2, btnSize, btnSize, 0x000000, 0.5)
            .setScrollFactor(0)
            .setDepth(100)
            .setInteractive({ useHandCursor: true });
        this.add.text(width - 20 - btnSize / 2, 20 + btnSize / 2, '| |', {
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#ffffff',
        })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(101);

        const quitBg = this.add.rectangle(width - 20 - btnSize / 2, 20 + btnSize + 10 + btnSize / 2, btnSize, btnSize, 0x000000, 0.5)
            .setScrollFactor(0)
            .setDepth(100)
            .setInteractive({ useHandCursor: true });
        this.add.text(width - 20 - btnSize / 2, 20 + btnSize + 10 + btnSize / 2, 'X', {
            fontSize: '36px',
            fontStyle: 'bold',
            color: '#ff6666',
        })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(101);

        pauseBg.on('pointerdown', () => {
            this.togglePause();
        });
        quitBg.on('pointerdown', () => {
            this.quitGame();
        });

        this.physics.add.overlap(this.player, this.spawner.getGroup(), this.handleCollision, undefined, this);

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    /**
     * Game Loop.
     * Updates game objects every frame.
     * @param time Current time in milliseconds
     * @param delta Time elapsed since last frame in milliseconds
     */
    update(time: number, delta: number) {
        // Scroll background to create the illusion of forward movement
        this.background.tilePositionX += 0.1 * delta;

        // Update player logic (movement, animation, fortune effects)
        this.player.update(time, delta, this.cursors, this.fortuneSystem.getFortunePercent(), this.fortuneSystem.isBursting());

        // Update spawner (manage obstacle/item lifecycle)
        this.spawner.update(time, delta);

        // Update UI
        this.fortuneMeter.updateBar(
            this.fortuneSystem.getFortunePercent(),
            this.fortuneSystem.isBursting(),
            this.fortuneSystem.getBurstProgress()
        );
    }

    /**
     * Handle collisions between the player and spawned objects.
     * @param _player The player object (unused here as we know it's the player)
     * @param object The object collided with (collectible or obstacle)
     */
    private handleCollision(_player: any, object: any) {
        if (!object.active) return;
        if (this.isGameOver) return;

        const type = object.getData('type');

        if (type === 'collectible') {
            // Good Item: Increase score and fortune
            this.score += 10;
            this.scoreText.setText(`Score: ${this.score}`);
            this.fortuneSystem.addFortune(10);
            object.destroy();
        } else if (type === 'obstacle') {
            // Bad Item: Check if invincible
            if (this.player.getIsBursting()) {
                // Invincible: Destroy obstacle safely
                object.destroy();
            } else {
                // Vulnerable: Check fortune buffer
                if (this.fortuneSystem.getFortune() > 0) {
                    // Has Fortune: Lose it all but survive ("Bonk")
                    this.player.bonk();
                    this.fortuneSystem.resetFortune();
                    object.destroy();
                } else {
                    // No Fortune: Game Over
                    this.isGameOver = true;
                    object.destroy();
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
        this.isGameOver = true;
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('ResultsScene', { score: this.score });
        });
    }
}
