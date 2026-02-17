export class StickerSystem {
    private unlockedStickers: Set<string>;
    private readonly STORAGE_KEY = 'lion-lucky-run-stickers';

    // Complete list of available stickers
    private readonly ALL_STICKERS = [
        'sticker_lion_head',
        'sticker_lantern',
        'sticker_orange',
        'sticker_drum',
        'sticker_firecracker',
        'sticker_gold_ingot'
    ];

    constructor() {
        this.unlockedStickers = new Set();
        this.load();
    }

    private load() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (Array.isArray(data)) {
                    this.unlockedStickers = new Set(data);
                }
            } catch (e) {
                console.error('Failed to load stickers', e);
            }
        }
    }

    private save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Array.from(this.unlockedStickers)));
    }

    unlockSticker(id: string) {
        if (!this.unlockedStickers.has(id)) {
            this.unlockedStickers.add(id);
            this.save();
            return true; // Newly unlocked
        }
        return false; // Already unlocked
    }

    unlockRandomSticker(): string | null {
        const locked = this.ALL_STICKERS.filter(id => !this.unlockedStickers.has(id));
        if (locked.length === 0) return null; // All collected

        const randomId = locked[Math.floor(Math.random() * locked.length)];
        this.unlockSticker(randomId);
        return randomId;
    }

    getUnlockedStickers(): string[] {
        return Array.from(this.unlockedStickers);
    }

    getAllStickers(): string[] {
        return this.ALL_STICKERS;
    }

    isUnlocked(id: string): boolean {
        return this.unlockedStickers.has(id);
    }
}

export const Stickers = new StickerSystem();
