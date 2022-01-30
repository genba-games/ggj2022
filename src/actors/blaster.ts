export default class Blaster extends Phaser.GameObjects.Sprite {
    protected shot: boolean
    protected speed: number
    protected armed: boolean
    constructor(scene, x, y,) {
        super(scene, x, y, 'bullit');
        this.setData('type', 'blaster');
        this.active = true
        this.scene.physics.world.enableBody(this, 0);
        this.armed = true
        this.speed = 600;

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
        this.armed = true
        this.setRotation(gun.rotation);
        let x = gun.x
        let y = gun.y
        let d = 60
        if (gun.rotation > Math.PI / 4 * -1 && gun.rotation < Math.PI / 4) {
            x -= d
        } else if (gun.rotation > Math.PI / 4 && gun.rotation < (3 * Math.PI / 4)) {
            y -= d
        } else if (gun.rotation > (3 * Math.PI / 4) * -1 && gun.rotation < (Math.PI / 4) * -1) {
            y += d
        } else {
            x += d
        }
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.shot = true
        if (this.body.velocity instanceof Phaser.Math.Vector2) {
            this.body.velocity.setToPolar(this.rotation, this.speed * -1);
        }
    }
    hit() {
        this.armed = false
        this.stopMovement()
    }
    stopMovement() {
        if (this.body.velocity instanceof Phaser.Math.Vector2) {
            this.body.velocity.setTo(0, 0)
        }
    }
    update() {
        // Destroy when the bullet leaves the map?
        if (this.y < 0 || this.x < 0) this.destroy();
    }
}
