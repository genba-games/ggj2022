import { gameWidth, gameHeight } from '../utils'

export default class GameScene extends Phaser.Scene {
    private gameover: Phaser.Sound.BaseSound;
    private applause: Phaser.Sound.BaseSound;
    private score: number;
    constructor() {
        super('GameOverScene');
    }
    preload() {
        this.load.audio("chopin", 'assets/funeralmarch.ogg')
        this.load.audio("applause", 'assets/applause.ogg')
    }

    init(data) {
        this.score = data.score || 0;
    }

    create() {
        this.gameover = this.sound.add('chopin');
        this.gameover.play({ volume: 0.2, loop: true });
        this.applause = this.sound.add('applause');
        this.applause.play({ volume: 0.2, loop: true, delay: 10 });
        this.add.text(gameWidth / 2, (gameHeight / 2) - 100, 'GAME OVER', { fontFamily: 'Garamond', fontSize: '100px' }).setOrigin(0.5, 0.5);
        this.add.text(gameWidth / 2, (gameHeight / 2), `SCORE: ${this.score}`, { fontFamily: 'Garamond', fontSize: '100px' }).setOrigin(0.5, 0.5);
    }

    update() {

    }
}