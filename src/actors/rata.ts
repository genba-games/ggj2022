import 'phaser';
const HPY = 30;
const HPX = 20;
export default class Rata extends Phaser.GameObjects.Sprite {
    protected score: number
    protected startTime: number
    protected hp: number
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
    protected bulletGroup: Phaser.GameObjects.Group
    protected gun: Phaser.GameObjects.Sprite
    protected modifiers: {
        gunRotation: number
    }
    protected hurtFlicker: Phaser.Tweens.Tween;
    protected hurtInvulnerability: Phaser.Tweens.Tween;
    protected healthBar: Phaser.GameObjects.Graphics;
    public hurt: boolean
    public lastHurt: number;

    constructor(scene, x, y, texture, type, bulletGroup) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, 0);
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setCollideWorldBounds();
        }
        this.setData('type', type);

        this.cursorKeys = {
            up: scene.input.keyboard.addKey('UP'),
            down: scene.input.keyboard.addKey('DOWN'),
            left: scene.input.keyboard.addKey('LEFT'),
            right: scene.input.keyboard.addKey('RIGHT'),
            action: scene.input.keyboard.addKey('SPACE'),
            utility: scene.input.keyboard.addKey('SHIFT'),
            die: scene.input.keyboard.addKey('CTRL')
        }

        this.hurtFlicker = this.scene.tweens
            .add({
                targets: this,
                alpha: { from: 1, to: 0 },
                yoyo: true,
                ease: 'Linear',
                duration: 100,
                repeat: 10,
                onComplete: () => {
                    // This re-enables the player to be hurt again
                    this.hurt = false;
                },
                onCompleteScope: this
            })
            .stop();
        this.hurtInvulnerability = this.scene.tweens
            .add({
                targets: this,
                alpha: { from: 1, to: 0 },
                yoyo: true,
                ease: 'Linear',
                duration: 100,
                repeat: 75, //75 * 100ms * 2yoyo is around 15 seconds
                onComplete: () => {
                    // This re-enables the player to be hurt again SOMETIMES
                    this.hurt = false;
                },
                onCompleteScope: this
            })
            .stop();


        // this.scale = 0.25;
        this.score = 0;
        this.startTime = Date.now();
        this.hp = 100;
        this.hurt = false;

        this.speed = 300;
        this.setData('score', 0);
        this.setData('shotDelay', 200);
        this.setData('hp', 100);
        this.setData('shotTimer', this.getData('shotDelay'));
        this.setData('effect', 'default');
        this.setData('bulletSound', 'pew');

        this.bulletGroup = bulletGroup;
        this.gun = this.scene.add.sprite(this.x, this.y, 'revolver', 0).setOrigin(2, 0).setScale(1.5);

        this.modifiers = { gunRotation: 1 }
        //make 3 bars
        this.healthBar = this.makeBar(this.x, this.y, 0x2ecc71);
        // this.rata.
        this.setBarValue(this.healthBar, 100);


    }
    makeBar(x: number, y: number, color: number) {
        //draw the bar
        let bar = this.scene.add.graphics({ x: x - HPX, y: y + HPY });

        //color the bar
        bar.fillStyle(color, 1);

        //fill the bar with a rectangle
        bar.fillRect(0, 0, 30, 5);
        //return the bar
        return bar;
    }
    setBarValue(bar: Phaser.GameObjects.Graphics, percentage: number) {
        //scale the bar
        bar.setScale(percentage / 100, 1);
    }


    /**
     * Enables this actor. An enabled actor is rendered and updated every frame.
     * Called to recycle a previously disabled actor.
     */
    enable() {
        this.setActive(true);
        this.setVisible(true);
    }

    /**
     * Disables this actor. A disabled actor is not rendered or updated.
     * Called to be able to recycle an actor in the future.
     */
    disable() {
        //Stupid solution for recycling enemies and hitboxes to get out
        this.setActive(false);
        this.setVisible(false);
        // I needed to add this for items, for some reason it failed, SOMETIMES
        // OPTIMIZE THIS
        if (this.scene) this.scene.tweens.killTweensOf(this);
    }

    hit() {
        if (this.hurt || this.hurtFlicker.isPlaying()) return;
        // this would look neater on the tween onStart
        // but something happened and couldn't make it work
        this.hurtFlicker.play();
        this.hurt = true;
        this.hp -= 10;
        if (this.hp <= 0) {
            this.kill();
        }
        this.setData('hp', this.hp);
        this.setBarValue(this.healthBar, this.hp);
        this.lastHurt = this.scene.time.now
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
    moveRight() {
        this.flipX = true
        if (this.body.velocity instanceof Phaser.Math.Vector2) {

            this.body.velocity.setTo(this.speed, 0);
        }
    }

    moveRightUp() {
        this.flipX = true
        if (this.body.velocity instanceof Phaser.Math.Vector2) {
            this.body.velocity.setToPolar(Phaser.Math.DegToRad(-45), this.speed);
        }

    }

    moveRightDown() {
        this.flipX = true
        if (this.body.velocity instanceof Phaser.Math.Vector2) {
            this.body.velocity.setToPolar(Phaser.Math.DegToRad(45), this.speed);
        }


    }
    moveLeft() {
        this.flipX = false
        if (this.body.velocity instanceof Phaser.Math.Vector2) {

            this.body.velocity.setTo(-this.speed, 0);
        }
    }
    moveLeftUp() {
        this.flipX = false
        if (this.body.velocity instanceof Phaser.Math.Vector2) {
            this.body.velocity.setToPolar(Phaser.Math.DegToRad(-135), this.speed);
        }

    }

    moveLeftDown() {
        this.flipX = false
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


    // This will call the death transition and send the highscore data
    kill() {
        this.gun.visible = false;
        this.healthBar.visible = false;
        this.hurt = false;
        // Here we should play the explosion or equivalent
        this.visible = false;
        // const data = {
        //     score: this.score,
        //     enemies: this.enemiesKilled,
        //     startTime: this.startTime
        // };
        this.scene.events.emit('playerDeath');
    }

    fire() {
        if (this.getData('shotTimer') >= this.getData('shotDelay') && this.visible === true) {
            // Here we should check the effect and change the firing
            // const blasterY = this.y - 55;

            // const spacing = 25;
            //we should get the gun orientation here
            let ab = this.bulletGroup.get()
            if (ab) {
                this.scene.sound.play('shoot')
                ab.fire(this.gun)
            } else {
                this.scene.sound.play("click");
            }
            // soundManager.play(this.getData('bulletSound'), true);
            this.setData('shotTimer', 0);
        }
    }

    update(time, delta) {
        //"children" movement, this should be fixed with a container or group
        this.gun.rotation += 0.01 * this.modifiers.gunRotation;
        this.gun.setPosition(this.x, this.y)
        this.healthBar.setPosition(this.x - HPX, this.y + HPY)

        // Movement
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

        // Update the shot timer
        this.setData('shotTimer', this.getData('shotTimer') + delta);
        if (this.cursorKeys.action.isDown || this.cursorKeys.utility.isDown) {
            this.fire();
        }
        if (this.cursorKeys.die.isDown && this.cursorKeys.utility.isDown) {
            this.kill();
        }
    }

}
