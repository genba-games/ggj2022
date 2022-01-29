export class Base extends Phaser.GameObjects.Sprite {
    protected extendedProperty: number;
    protected asset: string;

    constructor(params) {
        super(params.scene, params.x, params.y, params.key);
        this.scene.add.existing(this);
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setCollideWorldBounds();
        }
        // this.initImage();
    }

    // private initImage(): void {
    //     this.setScale(2);
    //     this.setOrigin(0.5, 0.5);
    // }
}