import 'phaser';

export default class Demo extends Phaser.Scene {
    constructor() {
        super('demo');
    }

    preload() {
        this.load.image('logo', 'assets/phaser3-logo.png');
        this.load.image('libs', 'assets/libs.png');
        this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
        this.load.glsl('stars', 'assets/starfields.glsl.js');
    }

    create() {
        this.add.shader('RGB Shift Field', 0, 0, 600, 900).setOrigin(0);

        this.add.shader('Plasma', 0, 412, 800, 172).setOrigin(0);

        this.add.image(320, 400, 'libs').setScale(0.5);

        const logo = this.add.image(320, 70, 'logo');

        this.tweens.add({
            targets: logo,
            y: 350,
            duration: 1500,
            ease: 'Sine.inOut',
            yoyo: true,
            repeat: -1
        })
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: 600,
    height: 900,
    scene: Demo
};

const game = new Phaser.Game(config);
