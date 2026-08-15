import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Spawner } from '../systems/Spawner';
import { FortuneSystem } from '../systems/FortuneSystem';
import { FortuneMeter } from '../ui/FortuneMeter';
import { AudioSystem } from '../systems/AudioSystem';
import { Settings } from '../storage/Settings';
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
    private audioSystem!: AudioSystem;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private highScoreText!: Phaser.GameObjects.Text;
    private soundBtnText!: Phaser.GameObjects.Text;
    private background!: Phaser.GameObjects.TileSprite;
    private backgroundKey: string = 'bg_sky';
    private isGameOver: boolean = false;
    private isTransitioning: boolean = false;

    constructor() {
        super('GameScene');
    }

    init() {
        this.score = 0;
        this.isGameOver = false;
        this.isTransitioning = false;
    }

    create() {
        const width = 1280;
        const height = 720;

        this.score = 0;
        this.isGameOver = false;
        this.isTransitioning = false;

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

        this.audioSystem = new AudioSystem(this);
        this.audioSystem.startBGM();

        this.fortuneSystem = new FortuneSystem(this);

        this.events.on('lucky-burst-start', () => {
            this.audioSystem.playBurst();
        });

        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
            this.input.keyboard.on('keydown-P', () => this.togglePause());
            this.input.keyboard.on('keydown-ESC', () => this.togglePause());
            this.input.keyboard.on('keydown-Q', () => this.quitGame());
        }

        this.player = new Player(this, 120, height / 2);
        this.spawner = new Spawner(this);

        this.scoreText = this.add.text(25, 20, 'Score: 0', {
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            fontStyle: 'bold'
        }).setDepth(100);

        const bestScore = Settings.getHighScore();
        this.highScoreText = this.add.text(25, 58, `Best: ${bestScore}`, {
            fontSize: '22px',
            color: '#ffd700',
            stroke: '#000000',
            strokeThickness: 4,
            fontStyle: 'bold'
        }).setDepth(100);

        this.fortuneMeter = new FortuneMeter(this, 25, 95);
        this.fortuneMeter.setDepth(100);

        const btnSize = 58;
        const btnRightMargin = 25;

        // Sound toggle button
        const soundBtnX = width - btnRightMargin - btnSize * 2.5;
        const soundBg = this.add.rectangle(soundBtnX, 25 + btnSize / 2, btnSize, btnSize, 0x000000, 0.5)
            .setScrollFactor(0)
            .setDepth(100)
            .setInteractive({ useHandCursor: true });
        this.soundBtnText = this.add.text(soundBtnX, 25 + btnSize / 2, Settings.isSoundEnabled() ? '🔊' : '🔇', {
            fontSize: '28px',
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101);

        soundBg.on('pointerdown', () => {
            const enabled = Settings.toggleSound();
            this.soundBtnText.setText(enabled ? '🔊' : '🔇');
            if (enabled) {
                this.audioSystem.playButton();
                this.audioSystem.startBGM();
            } else {
                this.audioSystem.stopBGM();
            }
        });

        // Pause button
        const pauseBtnX = width - btnRightMargin - btnSize * 1.3;
        const pauseBg = this.add.rectangle(pauseBtnX, 25 + btnSize / 2, btnSize, btnSize, 0x000000, 0.5)
            .setScrollFactor(0)
            .setDepth(100)
            .setInteractive({ useHandCursor: true });
        this.add.text(pauseBtnX, 25 + btnSize / 2, '⏸', {
            fontSize: '26px',
            color: '#ffffff',
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101);

        pauseBg.on('pointerdown', () => {
            this.audioSystem.playButton();
            this.togglePause();
        });

        // Quit button
        const quitBtnX = width - btnRightMargin - btnSize / 2;
        const quitBg = this.add.rectangle(quitBtnX, 25 + btnSize / 2, btnSize, btnSize, 0x000000, 0.5)
            .setScrollFactor(0)
            .setDepth(100)
            .setInteractive({ useHandCursor: true });
        this.add.text(quitBtnX, 25 + btnSize / 2, '✕', {
            fontSize: '28px',
            fontStyle: 'bold',
            color: '#ff6666',
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101);

        quitBg.on('pointerdown', () => {
            this.audioSystem.playButton();
            this.quitGame();
        });

        this.physics.add.overlap(this.player, this.spawner.getGroup(), this.handleCollision, undefined, this);

        this.cameras.main.fadeIn(400, 0, 0, 0);
    }

    update(time: number, delta: number) {
        if (this.isGameOver) return;

        this.background.tilePositionX += 0.12 * delta;
        this.player.update(time, delta, this.cursors, this.fortuneSystem.getFortunePercent(), this.fortuneSystem.isBursting());
        this.spawner.update(time, delta);

        this.fortuneMeter.updateBar(
            this.fortuneSystem.getFortunePercent(),
            this.fortuneSystem.isBursting(),
            this.fortuneSystem.getBurstProgress()
        );
    }

    private handleCollision: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
        _player,
        object
    ) => {
        if (!object || !(object instanceof Phaser.GameObjects.GameObject) || !object.active) return;
        if (this.isGameOver || this.isTransitioning) return;

        const item = object as Phaser.Physics.Arcade.Sprite;
        const type = item.getData('type');

        if (type === 'collectible') {
            this.score += 10;
            this.scoreText.setText(`Score: ${this.score}`);
            const best = Math.max(Settings.getHighScore(), this.score);
            this.highScoreText.setText(`Best: ${best}`);
            this.fortuneSystem.addFortune(10);
            this.audioSystem.playCollect();
            this.tweens.killTweensOf(object);
            object.destroy();
        } else if (type === 'obstacle') {
            if (this.player.getIsBursting()) {
                this.audioSystem.playCollect(1.3);
                this.tweens.killTweensOf(object);
                object.destroy();
            } else if (this.player.getIsBonked()) {
                // In grace period after bonk: clear obstacle without lethal damage
                this.tweens.killTweensOf(object);
                object.destroy();
            } else {
                if (this.fortuneSystem.getFortune() > 0) {
                    this.player.bonk();
                    this.fortuneSystem.resetFortune();
                    this.audioSystem.playBonk();
                    this.tweens.killTweensOf(object);
                    object.destroy();
                } else {
                    this.isGameOver = true;
                    this.tweens.killTweensOf(object);
                    object.destroy();
                    this.gameOver();
                }
            }
        }
    };

    private quitGame() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.audioSystem.stopBGM();
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.cleanupScene();
            this.scene.start('MenuScene');
        });
    }

    private togglePause() {
        if (this.isGameOver || this.isTransitioning) return;
        this.scene.pause();
        this.scene.launch('PauseScene');
    }

    private gameOver() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.isGameOver = true;
        this.audioSystem.stopBGM();
        this.audioSystem.playGameOver();

        Settings.setHighScore(this.score);

        this.cameras.main.fadeOut(600, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.cleanupScene();
            this.scene.start('ResultsScene', { score: this.score });
        });
    }

    private cleanupScene() {
        if (this.spawner) {
            this.spawner.destroy();
        }
        if (this.audioSystem) {
            this.audioSystem.stopBGM();
        }
    }
}
