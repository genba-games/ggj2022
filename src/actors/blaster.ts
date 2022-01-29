export default class Blaster extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y,) {
        super(scene, x, y, 'bullit');
        this.setData('type', 'blaster');

        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setCollideWorldBounds();
        }

        // this.scene.anims.create({
        //     key: `pulse${this.asset}`,
        //     frames: this.scene.anims.generateFrameNumbers(this.asset, {
        //         frames: [3, 2, 1, 0, 1, 2, 3]
        //     }),
        //     frameRate: 12,
        //     repeat: -1
        // });
        // this.anims.play(`pulse${this.asset}`, false);
    }

    fire(gun) {
        this.setRotation(gun.rotation);
        this.setPosition(gun.x, gun.y);
        this.setActive(true);
        this.setVisible(true);
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.enable = true;
        }
    }

    update() {

        // Destroy when the bullet leaves the map?
        if (this.y < 0 || this.x < 0) this.destroy();
    }
}
