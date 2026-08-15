# Lion Lucky Run - A Lunar New Year Adventure

Welcome to **Lion Lucky Run**! Embark on a vibrant, endless running adventure featuring a traditional Lion Dance costume. This game is designed to celebrate the joy and traditions of the Lunar New Year (Chinese New Year).

## 🏮 About Chinese New Year (Lunar New Year)

For those new to the celebration, **Chinese New Year** (or Lunar New Year) is one of the most important holidays in many Asian cultures. It marks the beginning of the new year on the traditional lunisolar calendar.

Here are some key symbols you'll see in the game:
*   **Lion Dance:** A form of traditional dance where performers mimic a lion's movements in a lion costume to bring good luck and fortune.
*   **Red Envelopes (Hongbao):** Red packets filled with money, given as gifts to symbolize good wishes and luck for the new year.
*   **Oranges/Tangerines:** Symbols of abundance and good fortune because the word for orange sounds like "gold" or "success" in Chinese.
*   **Fortune/Luck:** A central theme of the holiday. Doing good deeds and following traditions brings "fortune" for the year ahead!

## 🎮 Why is this fun?

*   **Festive Atmosphere:** Run through colorful environments inspired by the holiday, from starry skies to Singapore skylines!
*   **Fast-Paced Action:** The game speeds up as you go! Can you keep up?
*   **"Lucky Burst" Mode:** Collect enough fortune to trigger a rainbow-colored invincibility mode—it's super satisfying to smash through obstacles!
*   **Kid-Friendly:** Simple controls and forgiving mechanics (you don't lose immediately if you hit an obstacle, unless your fortune runs out!) make it great for all ages.

## 🕹️ How to Play

### Controls

Playable seamlessly on desktop, tablets, and smartphones.

**Keyboard:**
*   **Arrow Keys (⬆️ ⬇️ ⬅️ ➡️) or WASD:** Move the Lion in any direction.
*   **P or ESC:** Pause / Resume the game.
*   **Q:** Quit to the main menu.

**Touchscreen / Mobile / Mouse:**
*   **Drag / Tap:** The Lion follows your touch or cursor smoothly with boundary guardrails.
*   **On-Screen Buttons:** Tap the sound toggle (🔊 / 🔇), pause (⏸), or quit (✕) buttons anytime.

### Game Mechanics & Upgrades

1.  **Collect Festive Goodies:**
    *   🍊 **Lucky Oranges**, 🧧 **Red Envelopes (Hongbao)**, 🏮 **Festive Lanterns**, and 🧨 **Firecrackers**.
    *   Each item awards **+10 Score**, fills the **Fortune Meter**, and plays bright synthesized pentatonic chimes.

2.  **Obstacles & Grace Period:**
    *   👻 **Ghosts** and 🪨 **Stones**.
    *   With fortune in reserve: hitting an obstacle triggers a bouncy **"Bonk"** stun with a **grace period** to avoid instant death from clustered hazards.
    *   With **0 Fortune**: hitting an obstacle ends the run.

3.  **Lucky Burst (Invincible Golden Lion):**
    *   Fill the Fortune Meter to 100% to transform into the **Golden Lion**!
    *   Enjoy invulnerability, sparkling golden trail particles, and smash through obstacles with fanfare.

4.  **Persistent High Scores & Sticker Collection:**
    *   High scores are saved automatically across sessions (with safe sandboxed storage for embedded iframes).
    *   Score 50+ points in a run to unlock festive stickers (🦁 Lion Head, 🏮 Lantern, 🍊 Orange, 🥁 Drum, 🧨 Firecracker, 🪙 Gold Ingot).

5.  **Zero-Asset Web Audio Synthesizer:**
    *   Built-in Web Audio procedural sound engine that generates cheerful Chinese New Year chimes, bouncy cartoon bonks, and fanfare without needing external audio files.

## 🚀 Deploying to Itch.io / HIO / Web

1.  **Create the zip package:**
    ```bash
    npm run package:itch
    ```
    This builds the production bundle with relative paths (`./`) and outputs `lion-lucky-run-itch.zip` (~1.3 MB).

2.  **Upload to Itch.io:**
    *   Create a new project on [itch.io](https://itch.io/game/new).
    *   Set **Kind of project** to: `HTML`.
    *   Under **Uploads**, click **Upload files** and choose `lion-lucky-run-itch.zip`.
    *   Check the box: `This file will be played in the browser`.
    *   Set **Viewport dimensions**: `1280` x `720` (or check `Automatically detect resolution` / `Responsive`).
    *   Enable **Fullscreen button** if desired.
    *   Save and publish!

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Production build
npm run build

# Preview build locally
npm run preview
```

## 📝 License

[MIT](LICENSE)
