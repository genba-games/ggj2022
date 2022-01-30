import 'phaser';
import GameScene from './scenes/game';
import IntroScene from './scenes/intro';
import GameOverScene from './scenes/gameover';
import { gameWidth, gameHeight } from './utils'


const config = {
    type: Phaser.AUTO,
    backgroundColor: '#0',
    width: gameWidth,
    height: gameHeight,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },
    scene: [IntroScene, GameScene, GameOverScene],
    // scene: [GameScene],
};

const game = new Phaser.Game(config);
