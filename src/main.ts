import Phaser from 'phaser';
import { GameConfig } from './game/config';

const game = new Phaser.Game(GameConfig);
(window as unknown as { __PHASER_GAME__?: Phaser.Game }).__PHASER_GAME__ = game;
