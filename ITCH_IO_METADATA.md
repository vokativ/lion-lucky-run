# 🏮 Itch.io Upload & Store Page Metadata Package

Complete metadata, copy-paste assets, tags, settings, descriptions, and styling guide for uploading **Lion Lucky Run** to [itch.io](https://itch.io).

---

## 📋 Quick Setup & Form Fields

| Field | Recommended Value |
| :--- | :--- |
| **Title** | `Lion Lucky Run 🏮 (A Lunar New Year Adventure)` |
| **Project URL** | `https://[your-username].itch.io/lion-lucky-run` |
| **Short Tagline** *(Max 140 chars)* | `Lead the Lucky Lion Dance train, dodge obstacles, collect festive fortune, and unleash the Golden Lucky Burst in this vibrant runner!` |
| **Classification** | **Games** |
| **Kind of project** | **HTML** *(You have a ZIP file containing index.html)* |
| **Release Status** | **Released** |
| **Pricing** | **$0 or donate** *(or No payments / Free)* |
| **Genre** | **Arcade / Action** |

---

## 🏷️ Topics & Search Tags

Copy-paste these tags into the **Tags** field on itch.io for maximum discoverability:

```text
Endless Runner, Arcade, Lunar New Year, Chinese New Year, Casual, Phaser, Phaser 3, HTML5, Browser, 2D, Singleplayer, Cute, Family Friendly, Fast-Paced, Touch-Friendly, Procedural Audio, Colorful, Addictive
```

### Categorization & Attributes:
- **Input Methods:** Keyboard, Touchscreen, Mouse
- **Accessibility:** Color-blind friendly high contrast, one-finger touch controls, pause anytime
- **Platforms:** Web (HTML5) - playable on Desktop, Mobile (iOS/Android), Chromebooks, and Tablets.
- **Languages:** English

---

## 🖼️ Upload Assets Checklist (Ready in `/media/itch/`)

All assets have been rendered to exact itch.io recommended aspect ratios and resolutions:

| Asset Type | File Path | Resolution | Description |
| :--- | :--- | :--- | :--- |
| **Cover Image (Standard)** | `media/itch/itch-cover.png` | `630 x 500 px` | Main browse card / thumbnail with 3D title & lion |
| **Cover Image (High-DPI @2x)** | `media/itch/itch-cover-2x.png` | `1260 x 1000 px` | Crisp retina cover image |
| **Banner Header** | `media/itch/itch-banner.png` | `960 x 400 px` | Game page top banner featuring the 4 Lion lineup |
| **Banner Header (@2x)** | `media/itch/itch-banner-2x.png` | `1920 x 800 px` | High-res game page top banner |
| **Game Avatar / Icon** | `media/itch/itch-avatar.png` | `500 x 500 px` | Square circular gold-bordered Lion badge |
| **Screenshot 1 (Action)** | `media/screenshots/screenshot-gameplay-action.png` | `1280 x 720 px` | Desktop gameplay with waving lion train & collectibles |
| **Screenshot 2 (Lucky Burst)** | `media/screenshots/screenshot-lucky-burst.png` | `1280 x 720 px` | Golden Lion invincibility super mode & rainbow sky |
| **Screenshot 3 (Menu & Customization)**| `media/screenshots/screenshot-menu-selection.png` | `1280 x 720 px` | Color selection (Red, Jade, Gold, Blue) & Speed mode |
| **Screenshot 4 (Results & Stickers)** | `media/screenshots/screenshot-results-stickers.png` | `1280 x 720 px` | Score record & festive sticker unlock collection |
| **Screenshot 5 (Cross-Platform)** | `media/screenshots/showcase-responsive-devices.png` | `1600 x 900 px` | Side-by-side desktop browser vs iPhone mobile framing |

---

## ⚙️ Embed / Viewport Configuration on Itch.io

Under the **Uploads** section:

1. Click **Upload files** and select `lion-lucky-run-itch.zip` (built via `npm run package:itch`).
2. Check the box: **"This file will be played in the browser"**.
3. Configure the viewport options:
   - **Embed type:** `Embed in page`
   - **Viewport dimensions:** `1280` px width × `720` px height
   - **Orientation:** Landscape
   - **Check:** `Automatically detect resolution / Responsive` (Phaser `Scale.FIT` dynamically scales to any screen)
   - **Check:** `Enable Fullscreen button`
   - **Check:** `Mobile friendly` (Touch & drag steering enabled)

---

## 📝 Full Store Page Description (Copy & Paste)

Copy the Markdown/Rich Text below directly into the Itch.io **Description** editor:

```markdown
# 🏮 Welcome to Lion Lucky Run!

Celebrate the joy, energy, and traditions of the **Lunar New Year** in this vibrant, fast-paced endless runner! Take control of a traditional Chinese Lion Dance troupe, wave your festive tail train, gather auspicious gifts, and unleash the legendary **Golden Lucky Burst**!

Playable instantly in any desktop or mobile browser with zero downloads required!

---

## 🌟 Key Features

* 🦁 **Dynamic Lion Train Mechanics:** Your lion grows an undulating, waving festival tail as you gather fortune. Steer smoothly through winding obstacle courses!
* 🎨 **4 Colorful Lion Dance Costumes:** Choose your favorite lion costume on the main menu:
  * 🔴 **Classic Lunar Red:** Traditional vibrancy and courage
  * 🟢 **Jade Green:** Harmony, prosperity, and peace
  * 🟡 **Imperial Golden:** Royalty, abundance, and wealth
  * 🔵 **Ocean Blue:** Serenity, wisdom, and strength
* ⭐ **"Lucky Burst" Invincibility Mode:** Fill your Fortune Meter to 100% to transform into the blazing **Golden Lion**! Blast through obstacles with sparkling golden trails and rainbow skies!
* 🧧 **Auspicious Collectibles:** Gather **Lucky Oranges (🍊)**, **Red Envelopes / Hongbao (🧧)**, **Festive Lanterns (🏮)**, and **Firecrackers (🧨)** to build your score and fortune.
* 🛡️ **Bouncy Grace Period & Stun:** Forgiving gameplay mechanics for all ages—if you hit a hazard with fortune in reserve, you bounce off with an invulnerability grace window rather than instant defeat.
* 🏆 **Festive Sticker Album:** Score 50+ points in a run to unlock festive collectible stickers (Lion Head, Lantern, Orange, Festival Drum, Firecracker, Gold Ingot).
* 🎵 **Zero-Asset Web Audio Synthesizer:** Features an ultra-lightweight procedural pentatonic chime and percussion synthesizer that creates festive Chinese New Year melodies on the fly!

---

## 🕹️ Controls

Play seamlessly with keyboard, mouse, or touchscreen:

### 💻 Desktop Keyboard & Mouse:
* **Arrow Keys (⬆️ ⬇️ ⬅️ ➡️) or WASD:** Move the Lion in all directions.
* **Mouse Drag / Click:** Lion smoothly glides toward your cursor.
* **P or ESC:** Pause / Resume game.
* **Q:** Return to Main Menu.
* **Sound Button (🔊 / 🔇):** Toggle audio on/off anytime.

### 📱 Touchscreen & Mobile:
* **Touch & Drag:** Simply press and slide your finger anywhere on the screen—the Lion will follow smoothly with intelligent boundary protection.
* **On-Screen Buttons:** Tap Pause (⏸), Quit (✕), or Sound (🔊) buttons in the top-right corner.

---

## 🏮 About the Lunar New Year Tradition

The **Lion Dance (舞獅)** is a centuries-old tradition performed during the Lunar New Year to bring good luck, prosperity, and happiness while chasing away bad spirits. Red envelopes (*Hongbao*) symbolize good fortune, oranges represent abundance, and firecrackers welcome the new year with celebration!

---

## 🛠️ Credits & Tech Stack

* **Game Engine:** [Phaser 3](https://phaser.io/)
* **Language & Build:** TypeScript, Vite
* **Audio:** Web Audio API Procedural Synthesizer
* **Open Source Repository:** [GitHub - vokativ/lion-lucky-run](https://github.com/vokativ/lion-lucky-run)
* **License:** MIT License
```

---

## 🎨 Itch.io Theme Colors (Copy Hex Codes)

Paste these hex color codes into your Itch.io **Edit Theme** panel to match the Lunar New Year palette:

* **Page Background:** `#1a0505` (Deep Crimson Dark)
* **Content Background:** `#2b0d0d` (Warm Maroon)
* **Text Color:** `#FFF8E7` (Silk Cream White)
* **Link Color:** `#FFD700` (Imperial Gold)
* **Link Hover Color:** `#FFA500` (Lucky Amber)
* **Button Background:** `#A11D1D` (Festive Red)
* **Button Text:** `#FFFFFF` (White)
* **Button Shadow / Accent:** `#FFD700` (Gold Border)

---

## 📣 First Release Devlog / Announcement Template

```markdown
# 🏮 Lion Lucky Run is Now Live! Celebrate Lunar New Year!

We're thrilled to announce the official release of **Lion Lucky Run** on itch.io!

Embark on a joyful endless runner journey celebrating Chinese New Year traditions. Steer your Lion troupe, collect oranges and red envelopes, customize your lion's colors, and blast through obstacles with the Golden Lucky Burst!

### What's included:
- 4 selectable Lion costumes (Red, Jade, Gold, Blue)
- 3 speed difficulty levels (Easy, Normal, Super Hard)
- Touch-friendly responsive controls for mobile and tablet browsers
- Web Audio procedural chime music
- Collectible sticker rewards & high score tracking

Jump in and play directly in your browser now! May your new year be filled with fortune, happiness, and high scores! 🧧🦁✨
```
