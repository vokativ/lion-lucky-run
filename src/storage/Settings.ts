export const GameModes = {
    LITTLE_KID: 'little_kid',
    BIG_KID: 'big_kid'
} as const;

export type GameMode = typeof GameModes[keyof typeof GameModes];

export const LionColors = {
    RED: 'red',
    BLUE: 'blue',
    GOLDEN: 'golden',
    JADE: 'jade'
} as const;

export type LionColor = typeof LionColors[keyof typeof LionColors];

export const Difficulties = {
    EASY: 'easy',
    NORMAL: 'normal',
    SUPER_HARD: 'super_hard'
} as const;

export type Difficulty = typeof Difficulties[keyof typeof Difficulties];

function safeGetItem(key: string): string | null {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            return window.localStorage.getItem(key);
        }
    } catch (e) {
        console.warn('Storage read restricted, falling back to memory', e);
    }
    return null;
}

function safeSetItem(key: string, value: string): void {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem(key, value);
        }
    } catch (e) {
        console.warn('Storage write restricted', e);
    }
}

class SettingsManager {
    private currentMode: GameMode = GameModes.LITTLE_KID;
    private lionColor: LionColor = LionColors.RED;
    private difficulty: Difficulty = Difficulties.NORMAL;
    private highScore: number = 0;
    private soundEnabled: boolean = true;

    constructor() {
        const saved = safeGetItem('lion-lucky-run-settings');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.currentMode = data.mode || GameModes.LITTLE_KID;
                this.lionColor = data.lionColor || LionColors.RED;
                this.difficulty = data.difficulty || Difficulties.NORMAL;
                this.highScore = typeof data.highScore === 'number' ? data.highScore : 0;
                this.soundEnabled = typeof data.soundEnabled === 'boolean' ? data.soundEnabled : true;
            } catch (e) {
                console.error('Failed to parse settings', e);
            }
        }
    }

    getMode(): GameMode {
        return this.currentMode;
    }

    setMode(mode: GameMode) {
        this.currentMode = mode;
        this.save();
    }

    getColor(): LionColor {
        return this.lionColor;
    }

    setColor(color: LionColor) {
        this.lionColor = color;
        this.save();
    }

    getDifficulty(): Difficulty {
        return this.difficulty;
    }

    setDifficulty(diff: Difficulty) {
        this.difficulty = diff;
        this.save();
    }

    getHighScore(): number {
        return this.highScore;
    }

    setHighScore(score: number): boolean {
        if (score > this.highScore) {
            this.highScore = score;
            this.save();
            return true; // New record
        }
        return false;
    }

    isSoundEnabled(): boolean {
        return this.soundEnabled;
    }

    setSoundEnabled(enabled: boolean) {
        this.soundEnabled = enabled;
        this.save();
    }

    toggleSound(): boolean {
        this.soundEnabled = !this.soundEnabled;
        this.save();
        return this.soundEnabled;
    }

    private save() {
        safeSetItem('lion-lucky-run-settings', JSON.stringify({
            mode: this.currentMode,
            lionColor: this.lionColor,
            difficulty: this.difficulty,
            highScore: this.highScore,
            soundEnabled: this.soundEnabled
        }));
    }
}

export const Settings = new SettingsManager();
