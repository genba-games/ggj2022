
import RataInicio from '../actors/rataInicio'

import { gameWidth, gameHeight } from '../utils'

export default class GameScene extends Phaser.Scene {
    private playerGroup: Phaser.GameObjects.Group;
    private gun: Phaser.GameObjects.Sprite;
    private rata: RataInicio;
    private curtain: Phaser.GameObjects.Rectangle;
    constructor() {
        super('IntroScene');
    }
    preload() {
        this.load.image('rata_disfrazada', 'assets/rata_disfrazada.png');
        this.load.image('revolver', 'assets/revolver.png');
        this.load.image('revolver', 'assets/revolver.png');

        this.load.image('map', 'assets/map.png');
        this.load.audio("click", 'assets/click.ogg')
        this.load.audio("enter", 'assets/enter.ogg')
    }

    init() {
        this.playerGroup = this.add.group({ runChildUpdate: true });
    }

    create() {
        this.add.image(0, 0, 'map').setOrigin(0).setScale(1);

        this.rata = new RataInicio(this, 1000, 700, 'rata_disfrazada');
        this.playerGroup.add(this.rata)

        this.cameras.main.startFollow(this.rata)
        this.cameras.main.zoom = 1.5

        this.gun = this.add.sprite(1000, 400, 'revolver', 0).setScale(1.5);
        this.physics.world.enableBody(this.gun, 0);
        this.physics.add.overlap(
            this.playerGroup,
            this.gun,
            this.playerRevolverCallback,
            undefined,
            this
        );

        this.curtain = this.add
            .rectangle(0, 0, gameWidth, gameHeight, 0)
            .setOrigin(0, 0)
            .setAlpha(0);

    }

    playerRevolverCallback(player: any, revolver: any) {
        player.body.enable = false;
        const timeline = this.tweens
            .createTimeline()
            // Show curtain and change game
            .add({
                targets: this.curtain,
                alpha: 1,
                duration: 1000,
                ease: 'Sine.easeInOut',
                loop: 0,
                onStart: function () {
                    this.sound.play('enter')
                }.bind(this),
                onComplete: function () {
                    this.scene.transition({
                        target: 'GameScene',
                        duration: 1000
                    });
                }.bind(this)
            })
            .play();

    }
    update() {
        this.gun.rotation += 0.005;
    }
}