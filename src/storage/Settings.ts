export const GameModes = {
    LITTLE_KID: 'little_kid',
    BIG_KID: 'big_kid'
} as const;

export type GameMode = typeof GameModes[keyof typeof GameModes];

class SettingsManager {
    private currentMode: GameMode = GameModes.LITTLE_KID;

    constructor() {
        const saved = localStorage.getItem('lion-lucky-run-settings');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.currentMode = data.mode || GameModes.LITTLE_KID;
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

    private save() {
        localStorage.setItem('lion-lucky-run-settings', JSON.stringify({
            mode: this.currentMode
        }));
    }
}

export const Settings = new SettingsManager();
