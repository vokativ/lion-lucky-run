# Lion Lucky Run

A vibrant, endless runner game featuring a lucky lion, built with Phaser 3, TypeScript, and Vite.

## 🎮 Game Description

Control the Lucky Lion as it runs through various themed environments! Dodge obstacles, collect coins for high scores, and grab special items for power-ups. The game features:
- **Endless Runner Gameplay:** The further you run, the faster it gets!
- **Multiple Themes:** Experience different environments like Forest, Sky, and Singapore.
- **Power-ups:** Collect items for invincibility, score multipliers, and more.
- **Dynamic Visuals:** smooth animations and particle effects.

## 🛠️ Tech Stack

- **Phaser 3:** Game framework
- **TypeScript:** Language
- **Vite:** Build tool and dev server

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vokativ/lion-lucky-run.git
   cd lion-lucky-run
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the local development server:

```bash
npm run dev
```

Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

### Building for Production

To build the game for production (outputs to `dist/` folder):

```bash
npm run build
```

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## ☁️ Deployment (Replit)

This project is ready for deployment on Replit.

1. **Import:** Import this repository into Replit.
2. **Install:** Replit should automatically detect `package.json` and install dependencies. If not, run `npm install` in the Shell.
3. **Run:** Click the "Run" button. The `.replit` config (if configured) or the `start` script will be used. 
   - We have included a `start` script (`vite preview --host`) which serves the built app.
   - For development mode in Replit, you can use `npm run dev -- --host` via the Shell.

## 📝 License

[MIT](LICENSE)
