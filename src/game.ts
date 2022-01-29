import 'phaser';
import GameScene from './scenes/game';
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
    scene: GameScene,
};

const game = new Phaser.Game(config);
