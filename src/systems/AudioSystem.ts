import Phaser from 'phaser';
import { Settings } from '../storage/Settings';

/**
 * AudioSystem
 *
 * Zero-external-asset Web Audio procedural synthesizer.
 * Generates joyful Chinese New Year chimes, bonks, fanfare bursts,
 * and game over sounds out of the box without requiring external mp3s.
 */
export class AudioSystem {
    private static audioCtx: AudioContext | null = null;
    private static unlocked: boolean = false;
    private bgmInterval?: number;
    private bgmNoteIndex: number = 0;

    constructor(_scene?: Phaser.Scene) {
        this.ensureAudioContext();
    }

    private static getContext(): AudioContext | null {
        if (!AudioSystem.audioCtx && typeof window !== 'undefined') {
            const win = window as typeof window & { webkitAudioContext?: typeof AudioContext };
            const AudioContextClass = win.AudioContext || win.webkitAudioContext;
            if (AudioContextClass) {
                AudioSystem.audioCtx = new AudioContextClass();
            }
        }
        return AudioSystem.audioCtx;
    }

    private ensureAudioContext() {
        if (typeof window === 'undefined') return;
        const unlock = () => {
            const ctx = AudioSystem.getContext();
            if (ctx && ctx.state === 'suspended') {
                ctx.resume();
            }
            AudioSystem.unlocked = true;
            window.removeEventListener('pointerdown', unlock);
            window.removeEventListener('keydown', unlock);
            window.removeEventListener('touchstart', unlock);
        };

        if (!AudioSystem.unlocked) {
            window.addEventListener('pointerdown', unlock, { once: true });
            window.addEventListener('keydown', unlock, { once: true });
            window.addEventListener('touchstart', unlock, { once: true });
        }
    }

    /**
     * Play a soft, warm, gentle pentatonic chime when collecting an item
     * (warm wooden marimba / soft celesta tone with low-pass filtering).
     */
    playCollect(pitchShift: number = 1.0) {
        if (!Settings.isSoundEnabled()) return;
        const ctx = AudioSystem.getContext();
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume();

        const now = ctx.currentTime;
        // Warm, pleasant pentatonic notes (G4, A4, C5, D5, E5)
        const notes = [392.00, 440.00, 523.25, 587.33, 659.25];
        const baseFreq = notes[Math.floor(Math.random() * notes.length)] * pitchShift;

        // Pure sine wave for smooth, velvety tone
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, now);

        // Low-pass filter to eliminate any harsh high-frequency sizzle
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, now);
        filter.Q.setValueAtTime(0.7, now);

        // Smooth mallet envelope with soft attack and smooth release
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.09, now + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.20);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.21);
    }

    /**
     * Play a bouncy cartoon "bonk" sound when hitting an obstacle with fortune.
     */
    playBonk() {
        if (!Settings.isSoundEnabled()) return;
        const ctx = AudioSystem.getContext();
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume();

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    /**
     * Play an exciting fanfare chord / chime when Lucky Burst activates.
     */
    playBurst() {
        if (!Settings.isSoundEnabled()) return;
        const ctx = AudioSystem.getContext();
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume();

        const now = ctx.currentTime;
        const arpeggio = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6

        arpeggio.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const noteTime = now + idx * 0.06;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, noteTime);

            gain.gain.setValueAtTime(0.2, noteTime);
            gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.4);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(noteTime);
            osc.stop(noteTime + 0.45);
        });
    }

    /**
     * Play a resonant low gong / chime on Game Over.
     */
    playGameOver() {
        if (!Settings.isSoundEnabled()) return;
        const ctx = AudioSystem.getContext();
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume();

        const now = ctx.currentTime;
        const gongFreqs = [196.00, 293.66, 392.00]; // G3, D4, G4 chord

        gongFreqs.forEach(freq => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.9, now + 1.2);

            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 1.2);
        });
    }

    /**
     * Play a quick UI click/tap feedback sound.
     */
    playButton() {
        if (!Settings.isSoundEnabled()) return;
        const ctx = AudioSystem.getContext();
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume();

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.06);
    }

    /**
     * Start gentle procedural festive background melody.
     */
    startBGM() {
        if (this.bgmInterval) return;
        if (!Settings.isSoundEnabled()) return;

        // Traditional Chinese Pentatonic Melody: G4, A4, C5, D5, E5, G5
        const melody = [
            392.00, 440.00, 523.25, 587.33, 659.25, 587.33, 523.25, 440.00,
            523.25, 659.25, 783.99, 659.25, 587.33, 523.25, 440.00, 392.00
        ];

        this.bgmNoteIndex = 0;
        this.bgmInterval = window.setInterval(() => {
            if (!Settings.isSoundEnabled()) return;
            const ctx = AudioSystem.getContext();
            if (!ctx || ctx.state === 'suspended') return;

            const now = ctx.currentTime;
            const freq = melody[this.bgmNoteIndex % melody.length];
            this.bgmNoteIndex++;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.04, now); // Soft background volume
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.3);
        }, 320);
    }

    /**
     * Stop background melody.
     */
    stopBGM() {
        if (this.bgmInterval) {
            clearInterval(this.bgmInterval);
            this.bgmInterval = undefined;
        }
    }

    /**
     * Generic SFX caller for compatibility.
     */
    playSFX(key: string) {
        if (key === 'collect' || key === 'sfx_collect') {
            this.playCollect();
        } else if (key === 'bonk' || key === 'sfx_bonk') {
            this.playBonk();
        } else if (key === 'burst' || key === 'sfx_burst') {
            this.playBurst();
        } else if (key === 'gameover' || key === 'sfx_gameover') {
            this.playGameOver();
        } else if (key === 'button' || key === 'click') {
            this.playButton();
        }
    }
}
