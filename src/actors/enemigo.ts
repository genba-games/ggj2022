import 'phaser';
import { gameHeight, gameWidth } from '../utils';

export default class Rata extends Phaser.GameObjects.Sprite {
    protected score: number
    protected startTime: number
    protected hp: number
    protected hurt: boolean
    protected speed: number
    protected target: Phaser.GameObjects.Sprite;

    constructor(scene, texture, type, target) {
        let x = Phaser.Math.Between(gameHeight, 0);
        let y = Phaser.Math.Between(gameWidth, 0);
        super(scene, x, y, texture);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, 0);
        this.setData('type', type);

        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setCollideWorldBounds();
        }

        this.hp = 100;
        this.hurt = false;

        this.speed = 100;
        this.target = target

        // this.scene.tweens.add({
        //     targets: this,
        //     duration: 1000,
        //     ease: 'Linear',
        //     repeat: -1,
        //     x: target.x,
        //     y: target.y,
        //     // onComplete: () => {
        //     //     this.finished = true;
        //     // }
        // });
        // this.scene.physics.moveToObject(this, target, this.speed)
        // var path = new Phaser.Curves.Path();
        // var follower = this.scene.add.follower(path, target.x, target.y, texture);
        // follower.startFollow(1000);
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

    update(time, delta) {
        this.scene.physics.moveToObject(this, this.target, this.speed)


    }

}
