import { gameWidth, gameHeight } from '../utils'

export default class GameScene extends Phaser.Scene {
    private gameover: Phaser.Sound.BaseSound;
    private applause: Phaser.Sound.BaseSound;
    private score: number;
    private retry: Phaser.GameObjects.Text
    constructor() {
        super('GameOverScene');
    }
    preload() {
        this.load.audio("chopin", 'assets/funeralmarch.ogg')
        this.load.audio("applause", 'assets/applause.ogg')
    }

    init(data) {
        this.score = data.score || 0;
        if (this.gameover != undefined) {
            this.gameover.stop()

        }
        if (this.applause != undefined) {
            this.applause.stop()
        }
    }

    create() {
        this.gameover = this.sound.add('chopin');
        this.gameover.play({ volume: 0.2, loop: true });
        this.applause = this.sound.add('applause');
        this.applause.play({ volume: 0.2, loop: true, delay: 10 });
        this.add.text(gameWidth / 2, (gameHeight / 2) - 100, 'GAME OVER', { fontFamily: 'Garamond', fontSize: '100px' }).setOrigin(0.5, 0.5);
        this.add.text(gameWidth / 2, (gameHeight / 2), `SCORE: ${this.score}`, { fontFamily: 'Garamond', fontSize: '100px' }).setOrigin(0.5, 0.5);
        this.retry = this.add.text(gameWidth / 2, (gameHeight / 2) + 100, `RETRY?`, { fontFamily: 'Garamond', fontSize: '100px' }).setOrigin(0.5, 0.5)
        this.retry.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.retry.width, this.retry.height), Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', function () {
                this.gameover.stop()
                this.applause.stop()
                this.game.sound.stopAll();
                this.scene.start('GameScene')
            }.bind(this));


    }

    update() {

    }
}