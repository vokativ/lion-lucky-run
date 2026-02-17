import Phaser from 'phaser';

export class AudioSystem {
    private scene: Phaser.Scene;
    private bgm?: Phaser.Sound.BaseSound;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    playBGM(key: string) {
        if (this.scene.sound.get(key)) {
            this.bgm = this.scene.sound.add(key, { loop: true, volume: 0.5 });
            this.bgm.play();
        } else {
            console.warn(`BGM ${key} not found`);
        }
    }

    stopBGM() {
        if (this.bgm) {
            this.bgm.stop();
        }
    }

    playSFX(key: string, volume: number = 1.0) {
        if (this.scene.sound.get(key)) {
            this.scene.sound.play(key, { volume });
        } else {
            // Fallback for demo if no audio files
            console.log(`[SFX Playback] ${key}`);
        }
    }
}
