import Phaser from 'phaser';
import { GameConfig } from './game/config';

new Phaser.Game(GameConfig);

// Handle "Immersive Mode" hints for mobile browsers if needed
// For now, Phaser's Scale Manager handles most of it.
