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

class SettingsManager {
    private currentMode: GameMode = GameModes.LITTLE_KID;
    private lionColor: LionColor = LionColors.RED;
    private difficulty: Difficulty = Difficulties.NORMAL;

    constructor() {
        const saved = localStorage.getItem('lion-lucky-run-settings');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.currentMode = data.mode || GameModes.LITTLE_KID;
                this.lionColor = data.lionColor || LionColors.RED;
                this.difficulty = data.difficulty || Difficulties.NORMAL;
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

    private save() {
        localStorage.setItem('lion-lucky-run-settings', JSON.stringify({
            mode: this.currentMode,
            lionColor: this.lionColor,
            difficulty: this.difficulty
        }));
    }
}

export const Settings = new SettingsManager();
