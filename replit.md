# Lion Lucky Run

## Overview
A Phaser 3 endless runner game built with TypeScript and Vite.

## Project Architecture
- **Framework**: Phaser 3.90 (WebGL game framework)
- **Build Tool**: Vite 7.x
- **Language**: TypeScript
- **Port**: 5000 (dev server)

### Directory Structure
- `src/` - TypeScript source code
  - `entities/` - Game entities (Player, LionTail)
  - `scenes/` - Phaser scenes (Boot, Menu, Game, Pause, Results)
  - `systems/` - Game systems (Audio, Fortune, Spawner, Sticker)
  - `storage/` - Settings/persistence
  - `ui/` - UI components (FortuneMeter)
  - `game/` - Game config
- `public/assets/` - Game assets (sprites, backgrounds, audio)
- `scripts/` - Utility scripts

## Recent Changes
- 2026-02-17: Added on-screen Pause/Quit touch buttons to GameScene, mobile fullscreen scaling (EXPAND mode), resize handler, viewport meta updates
- 2026-02-17: Initial Replit setup, added vite.config.ts for port 5000 and host 0.0.0.0
