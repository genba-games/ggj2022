import 'phaser';

export default class RataInicio extends Phaser.GameObjects.Sprite {
    protected speed: number
    protected cursorKeys: {
        up: any,
        down: any,
        left: any,
        right: any,
        action: any,
        utility: any,
        die: any
    }

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, 0);

        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setCollideWorldBounds();
        }
        this.speed = 500;
        this.cursorKeys = {
            up: scene.input.keyboard.addKey('UP'),
            down: scene.input.keyboard.addKey('DOWN'),
            left: scene.input.keyboard.addKey('LEFT'),
            right: scene.input.keyboard.addKey('RIGHT'),
            action: scene.input.keyboard.addKey('SPACE'),
            utility: scene.input.keyboard.addKey('SHIFT'),
            die: scene.input.keyboard.addKey('CTRL')
        }
    }

    moveUp() {
        if (this.body.velocity instanceof Phaser.Math.Vector2) {
            this.body.velocity.setTo(0, -this.speed);
        }

    }

    moveDown() {
        if (this.body.velocity instanceof Phaser.Math.Vector2) {
            this.body.velocity.setTo(0, this.speed);
        }
    }

    moveLeft() {
        if (this.body.velocity instanceof Phaser.Math.Vector2) {

            this.body.velocity.setTo(-this.speed, 0);
        }
    }

    moveRight() {
        if (this.body.velocity instanceof Phaser.Math.Vector2) {

            this.body.velocity.setTo(this.speed, 0);
        }
    }

    moveRightUp() {
        if (this.body.velocity instanceof Phaser.Math.Vector2) {
            this.body.velocity.setToPolar(Phaser.Math.DegToRad(-45), this.speed);
        }

    }

    moveRightDown() {
        if (this.body.velocity instanceof Phaser.Math.Vector2) {
            this.body.velocity.setToPolar(Phaser.Math.DegToRad(45), this.speed);
        }

    }

    moveLeftUp() {
        if (this.body.velocity instanceof Phaser.Math.Vector2) {
            this.body.velocity.setToPolar(Phaser.Math.DegToRad(-135), this.speed);
        }

    }

    moveLeftDown() {
        if (this.body.velocity instanceof Phaser.Math.Vector2) {
            this.body.velocity.setToPolar(Phaser.Math.DegToRad(135), this.speed);
        }
    }


    stopX() {
        this.body.velocity.x = 0;
    }

    stopY() {
        this.body.velocity.y = 0;
    }

    stopMovement() {
        this.stopX();
        this.stopY();
    }


    update(time, delta) {
        if (this.cursorKeys.right.isDown && this.cursorKeys.left.isDown) {
            if (this.cursorKeys.up.isDown) {
                this.moveUp();
            } else if (this.cursorKeys.down.isDown) {
                this.moveDown();
            } else {
                this.stopX();
            }
        } else if (this.cursorKeys.right.isDown && this.cursorKeys.up.isDown) {
            this.moveRightUp();
        } else if (this.cursorKeys.right.isDown && this.cursorKeys.down.isDown) {
            this.moveRightDown();
        } else if (this.cursorKeys.left.isDown && this.cursorKeys.up.isDown) {
            this.moveLeftUp();
        } else if (this.cursorKeys.left.isDown && this.cursorKeys.down.isDown) {
            this.moveLeftDown();
        } else if (this.cursorKeys.up.isDown) {
            this.moveUp();
        } else if (this.cursorKeys.down.isDown) {
            this.moveDown();
        } else if (this.cursorKeys.left.isDown) {
            this.moveLeft();
        } else if (this.cursorKeys.right.isDown) {
            this.moveRight();
        } else {
            this.stopMovement();
        }
    }

}
