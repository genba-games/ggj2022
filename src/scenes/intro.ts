
import RataInicio from '../actors/rataInicio'

import { gameWidth, gameHeight } from '../utils'

export default class GameScene extends Phaser.Scene {
    private playerGroup: Phaser.GameObjects.Group;
    private gun: Phaser.GameObjects.Sprite;
    private rata: RataInicio;
    private curtain: Phaser.GameObjects.Rectangle;
    private catGroup: Phaser.GameObjects.Group;
    private crowdSound: Phaser.Sound.BaseSound;
    constructor() {
        super('IntroScene');
    }
    preload() {
        this.load.image('rata_disfrazada', 'assets/rata_disfrazada.png');
        this.load.image('quesito', 'assets/blue_cheese.png');
        this.load.image("gato_i", 'assets/gato_i.png')
        this.load.image("gato_d", 'assets/gato_d.png')

        this.load.image('map', 'assets/map.png');
        this.load.audio("click", 'assets/click.ogg')
        this.load.audio("crowd", 'assets/crowd.ogg')
        this.load.audio("enter", 'assets/enter.ogg')
    }

    init() {
        this.playerGroup = this.add.group({ runChildUpdate: true });
        this.catGroup = this.add.group();
    }

    create() {
        this.add.image(0, 0, 'map').setOrigin(0).setScale(1);

        this.rata = new RataInicio(this, 1000, 700, 'rata_disfrazada');
        this.playerGroup.add(this.rata)

        this.cameras.main.startFollow(this.rata)
        this.cameras.main.zoom = 1.5

        this.gun = this.add.sprite(1000, 400, 'quesito', 0)
        this.physics.world.enableBody(this.gun, 0);

        this.physics.add.overlap(
            this.playerGroup,
            this.gun,
            this.playerRevolverCallback,
            undefined,
            this
        );
        this.add.sprite(1253, 713, 'rata_disfrazada', 0)
        this.add.sprite(1356, 419, 'rata_disfrazada', 0)
        this.add.sprite(1249, 279, 'rata_disfrazada', 0)
        this.add.sprite(743, 566, 'rata_disfrazada', 0).flipX = true
        this.add.sprite(640, 493, 'rata_disfrazada', 0).flipX = true
        this.add.sprite(739, 292, 'rata_disfrazada', 0).flipX = true
        //probably should do this in a for
        this.catGroup.createMultiple({ key: 'gato_i', frame: 0, active: true, visible: true, repeat: 14, setXY: { x: 1900, y: 50, stepY: 70 }, max: 500 });
        this.catGroup.createMultiple({ key: 'gato_i', frame: 0, active: true, visible: true, repeat: 14, setXY: { x: 1800, y: 50, stepY: 70 }, max: 500 });
        this.catGroup.createMultiple({ key: 'gato_i', frame: 0, active: true, visible: true, repeat: 14, setXY: { x: 1700, y: 50, stepY: 70 }, max: 500 });
        this.catGroup.createMultiple({ key: 'gato_i', frame: 0, active: true, visible: true, repeat: 14, setXY: { x: 1600, y: 50, stepY: 70 }, max: 500 });
        this.catGroup.createMultiple({ key: 'gato_i', frame: 0, active: true, visible: true, repeat: 14, setXY: { x: 1500, y: 50, stepY: 70 }, max: 500 });
        this.catGroup.createMultiple({ key: 'gato_i', frame: 0, active: true, visible: true, repeat: 14, setXY: { x: 1400, y: 50, stepY: 70 }, max: 500 });
        this.catGroup.createMultiple({ key: 'gato_i', frame: 0, active: true, visible: true, repeat: 14, setXY: { x: 1300, y: 50, stepY: 70 }, max: 500 });
        this.catGroup.createMultiple({ key: 'gato_i', frame: 0, active: true, visible: true, repeat: 14, setXY: { x: 1200, y: 50, stepY: 70 }, max: 500 });
        //We should put some invisible walls

        this.catGroup.createMultiple({ key: 'gato_d', frame: 0, active: true, visible: true, repeat: 14, setXY: { x: 800, y: 50, stepY: 70 }, max: 500 });
        this.catGroup.createMultiple({ key: 'gato_d', frame: 0, active: true, visible: true, repeat: 14, setXY: { x: 700, y: 50, stepY: 70 }, max: 500 });
        this.catGroup.createMultiple({ key: 'gato_d', frame: 0, active: true, visible: true, repeat: 14, setXY: { x: 600, y: 50, stepY: 70 }, max: 500 });
        this.catGroup.createMultiple({ key: 'gato_d', frame: 0, active: true, visible: true, repeat: 14, setXY: { x: 500, y: 50, stepY: 70 }, max: 500 });
        this.catGroup.createMultiple({ key: 'gato_d', frame: 0, active: true, visible: true, repeat: 14, setXY: { x: 400, y: 50, stepY: 70 }, max: 500 });
        this.catGroup.createMultiple({ key: 'gato_d', frame: 0, active: true, visible: true, repeat: 14, setXY: { x: 300, y: 50, stepY: 70 }, max: 500 });
        this.catGroup.createMultiple({ key: 'gato_d', frame: 0, active: true, visible: true, repeat: 14, setXY: { x: 200, y: 50, stepY: 70 }, max: 500 });
        this.catGroup.createMultiple({ key: 'gato_d', frame: 0, active: true, visible: true, repeat: 14, setXY: { x: 100, y: 50, stepY: 70 }, max: 500 });

        this.curtain = this.add
            .rectangle(0, 0, gameWidth, gameHeight, 0)
            .setOrigin(0, 0)
            .setAlpha(0);
        this.crowdSound = this.sound.add('crowd');
        this.crowdSound.play({ volume: 0.2, loop: true });
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
                    this.crowdSound.stop('crowd');
                    this.sound.play('enter');
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