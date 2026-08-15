<p align="center">
  <img src="./media/itch/itch-banner.png" alt="Lion Train Lucky Run Banner" width="100%">
</p>

<h1 align="center">🏮 Lion Lucky Run - A Lunar New Year Adventure</h1>

<p align="center">
  <strong>An energetic, festive endless runner celebrating Chinese New Year traditions!</strong><br>
  Lead your Lion Dance troupe, collect auspicious treats, unleash the invincible Golden Lucky Burst, and collect lucky stickers!
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Phaser-3.90.0-blue.svg" alt="Phaser 3">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6.svg" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-7.3-646CFF.svg" alt="Vite">
  <img src="https://img.shields.io/badge/Platform-Web%20%7C%20Mobile%20%7C%20Desktop-orange.svg" alt="Platforms">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License">
  <img src="https://img.shields.io/badge/itch.io-Ready-fa5c5c.svg" alt="Itch.io Ready">
</p>

---

## 📱 Cross-Platform & Mobile Responsive

Playable seamlessly on **Desktop browsers, Chromebooks, iPads/tablets, and mobile smartphones (iOS / Android)** with intelligent viewport auto-scaling and dedicated touch-drag controls.

<p align="center">
  <img src="./media/screenshots/showcase-responsive-devices.png" alt="Desktop vs Mobile Viewport Preview" width="100%">
</p>

---

## 📸 In-Game Screenshots

<table align="center">
  <tr>
    <td width="50%" align="center">
      <strong>🎮 Action Gameplay & Lion Train</strong><br><br>
      <img src="./media/screenshots/screenshot-gameplay-action.png" alt="Gameplay Action" width="100%">
    </td>
    <td width="50%" align="center">
      <strong>⭐ "Lucky Burst" Invincibility Mode</strong><br><br>
      <img src="./media/screenshots/screenshot-lucky-burst.png" alt="Lucky Burst Mode" width="100%">
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <strong>🎨 Costume & Difficulty Selection</strong><br><br>
      <img src="./media/screenshots/screenshot-menu-selection.png" alt="Main Menu Selection" width="100%">
    </td>
    <td width="50%" align="center">
      <strong>🏆 Score Records & Sticker Rewards</strong><br><br>
      <img src="./media/screenshots/screenshot-results-stickers.png" alt="Results and Stickers" width="100%">
    </td>
  </tr>
</table>

---

## 🏮 About Chinese New Year (Lunar New Year)

**Chinese New Year** (or Lunar New Year) is one of the most celebrated holidays across Asia and worldwide, marking the start of a new lunisolar calendar year with wishes for prosperity, luck, and joy.

Key cultural symbols featured in **Lion Lucky Run**:
* 🦁 **The Lion Dance (舞獅):** Performers mimic lion movements in ornate costumes to bring blessings, good fortune, and ward off negative energies.
* 🧧 **Red Envelopes (Hongbao):** Red packets filled with lucky money given to express love, blessings, and prosperity.
* 🍊 **Lucky Oranges & Tangerines:** Auspicious fruits representing wealth and abundance (*orange* sounds like *gold* in Chinese).
* 🏮 **Festive Lanterns & Firecrackers:** Bright red lanterns illuminate paths of luck, while firecrackers welcome the new year with excitement!

---

## ✨ Features & Game Mechanics

1. 🐉 **Dynamic Inverse-Kinematics Lion Train:**
   * Your lion grows an organic waving body and tail as you collect fortune!
   * Distance-constrained trailing eliminates stretching and provides responsive turning.
2. 🎨 **4 Selectable Lion Costumes:**
   * 🔴 **Classic Red Lion** • 🟢 **Jade Green Lion** • 🟡 **Imperial Golden Lion** • 🔵 **Ocean Blue Lion**
3. ⭐ **"Lucky Burst" Super Mode:**
   * Collect items to fill your Fortune Meter to 100% and transform into the **Golden Lion**!
   * Smash invincibly through obstacles with glittering trail particles and rainbow backgrounds.
4. 🛡️ **Bouncy Grace Period Mechanics:**
   * Forgiving design for players of all ages—hitting an obstacle with fortune in reserve triggers a cartoon **"Bonk"** bounce and temporary invulnerability window rather than instant defeat.
5. 🏆 **Sticker Album & Persistent High Scores:**
   * Score 50+ points in a run to unlock festive stickers (🦁 Lion Head, 🏮 Lantern, 🍊 Orange, 🥁 Drum, 🧨 Firecracker, 🪙 Gold Ingot).
   * High scores and unlocked stickers persist across sessions with safe sandboxed localStorage fallbacks.
6. 🎵 **Procedural Web Audio Synthesizer:**
   * Zero external audio files required! Built-in Web Audio synthesis generates authentic pentatonic chimes, celebratory fanfares, and cartoon bounce sounds on the fly.

---

## 🕹️ Controls

| Platform | Controls |
| :--- | :--- |
| **Desktop Keyboard** | **Arrow Keys (⬆️ ⬇️ ⬅️ ➡️)** or **WASD** to move smoothly in all directions |
| **Desktop Mouse** | **Click & Drag / Move:** Lion glides toward your cursor position |
| **Mobile / Touchscreen** | **Touch & Drag:** Slide your finger anywhere on screen to steer with guardrails |
| **Hotkeys** | **P / ESC** = Pause / Resume • **Q** = Quit to Main Menu • **🔊** = Audio Toggle |

---

## 📦 Itch.io Store Assets & Upload Guide

A complete, ready-to-upload store package with pre-rendered assets and store metadata is included:

* 📄 **Store Listing Guide:** See [`ITCH_IO_METADATA.md`](./ITCH_IO_METADATA.md) for tags, descriptions, category settings, and theme hex colors.
* 🖼️ **Visual Assets (`/media/itch/`):**
  * `itch-cover.png` (`630x500`) & `itch-cover-2x.png` (`1260x1000` @2x)
  * `itch-banner.png` (`960x400`) & `itch-banner-2x.png` (`1920x800` @2x)
  * `itch-avatar.png` (`500x500` Icon)
  * `itch-showcase-responsive.png` (`1600x900`)

### Packaging for Itch.io:

```bash
# 1. Build and package the production zip
npm run package:itch

# Output generated: lion-lucky-run-itch.zip (~1.3 MB)
```

1. Create or open your game project on [itch.io](https://itch.io/game/new).
2. Set **Kind of project** to `HTML`.
3. Upload `lion-lucky-run-itch.zip` and check **"This file will be played in the browser"**.
4. Set Viewport dimensions to `1280 x 720`, enable **Fullscreen**, and check **Mobile friendly**.
5. Upload cover and banner art from `media/itch/`, paste the description from [`ITCH_IO_METADATA.md`](./ITCH_IO_METADATA.md), and publish!

---

## 🛠️ Local Development & Scripts

```bash
# Install dependencies
npm install

# Start local development server (Vite)
npm run dev

# Run production build
npm run build

# Preview production build locally
npm run preview

# Generate production zip for itch.io
npm run package:itch

# Automated marketing screenshot capture via headless browser
node scripts/capture_game_screens.mjs

# Re-render composite marketing graphics and itch covers
python3 scripts/build_marketing_assets.py
```

---

## 📁 Project Structure

```text
lion-lucky-run/
├── index.html                   # Entry point with responsive viewport canvas
├── vite.config.ts               # Vite configuration (relative base './' for itch.io)
├── ITCH_IO_METADATA.md          # Complete itch.io listing metadata & store guide
├── media/
│   ├── itch/                    # Itch.io store assets (cover, banner, avatar)
│   │   ├── itch-cover.png       # 630x500 Cover art
│   │   ├── itch-cover-2x.png    # 1260x1000 Retina cover art
│   │   ├── itch-banner.png      # 960x400 Header banner
│   │   ├── itch-banner-2x.png   # 1920x800 Header banner
│   │   └── itch-avatar.png      # 500x500 Game avatar / icon
│   └── screenshots/             # In-game captures & responsive showcase
│       ├── screenshot-gameplay-action.png
│       ├── screenshot-lucky-burst.png
│       ├── screenshot-menu-selection.png
│       ├── screenshot-results-stickers.png
│       ├── screenshot-mobile-portrait.png
│       ├── screenshot-mobile-landscape.png
│       └── showcase-responsive-devices.png
├── scripts/
│   ├── capture_game_screens.mjs # Headless Chrome screenshot automation
│   └── build_marketing_assets.py# Marketing asset compositor (Pillow)
├── src/
│   ├── main.ts                  # Phaser initialization
│   ├── game/config.ts           # Game canvas resolution (1280x720 Scale.FIT)
│   ├── entities/                # Player, LionTail (IK trailing physics)
│   ├── scenes/                  # Boot, Menu, Game, Pause, Results scenes
│   ├── systems/                 # Spawner, Fortune, Stickers, Audio synthesizer
│   ├── storage/                 # Sandboxed iframe-safe settings & high scores
│   └── ui/                      # FortuneMeter HUD component
└── public/assets/               # Game sprites, backgrounds, audio
```

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).
