# Audio Assets Guide

This directory should contain the audio files for the game. Currently, audio is disabled in the code to prevent crashes due to missing files.

## Required Files

The following files are expected by `src/scenes/BootScene.ts`:

- `bgm_main.mp3`: Main background music (looping).
- `collect.mp3`: Sound effect for collecting an item (Orange, Hongbao, Lantern).
- `bonk.mp3`: Sound effect for hitting an obstacle with fortune (Sonic mechanics).
- `burst.mp3`: Sound effect for filling the Fortune Meter and starting Lucky Burst.
- `gameover.mp3`: Sound effect for game over.

## How to Re-enable Audio

Once you have added the files above, follow these steps to re-enable audio:

1. **Uncomment Load Calls** in `src/scenes/BootScene.ts`:
   ```typescript
   // Find and uncomment these lines:
   this.load.audio('bgm_main', 'assets/audio/bgm_main.mp3');
   this.load.audio('sfx_collect', 'assets/audio/collect.mp3');
   // ... rest of the files
   ```

2. **Uncomment Initialization** in `src/scenes/GameScene.ts`:
   ```typescript
   // In create() method:
   this.audioSystem = new AudioSystem(this);
   this.audioSystem.playBGM('bgm_main');
   ```

3. **Uncomment Playback Calls** in `src/scenes/GameScene.ts`:
   ```typescript
   // Search for '.audioSystem.playSFX' and uncomment those lines.
   ```

## Audio System class

The `src/systems/AudioSystem.ts` handles the volume and playback logic. It is already fully implemented and ready to use once assets are present.
