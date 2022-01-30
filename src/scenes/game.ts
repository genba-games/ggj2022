
import Rata from '../actors/rata'
import Blaster from '../actors/blaster'
import Enemigo from '../actors/enemigo'
import { StoneBaseFactory, CrystalBaseFactory } from '../services/objectFactory'

export default class GameScene extends Phaser.Scene {
    private playerGroup: Phaser.GameObjects.Group;
    private enemyGroup: Phaser.GameObjects.Group;
    private objectGroup: Phaser.GameObjects.Group;
    private StoneBaseFactory: StoneBaseFactory;
    private CrystalBaseFactory: CrystalBaseFactory;
    private gun: Phaser.GameObjects.Sprite;
    private rata: Rata;
    private enemigo: Enemigo;
    private enemigo2: Enemigo;
    private enemigo3: Enemigo;
    private enemigo4: Enemigo;
    private playerBullets: Phaser.GameObjects.Group;
    private score: number
    constructor() {
        super('GameScene');
    }
    preload() {
        this.load.image('logo', 'assets/phaser3-logo.png');
        this.load.image('libs', 'assets/libs.png');
        this.load.image('map', 'assets/map.png');
        this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
        this.load.glsl('stars', 'assets/starfields.glsl.js');
        // rata_blanco_s
        this.load.image('rata', 'assets/rata_blanco_s.png');
        this.load.image('rataMala', 'assets/rata_mala.png');
        this.load.image('revolver', 'assets/revolver.png');
        this.load.image('bullit', 'assets/bullit.png');
        this.load.spritesheet('crystal', 'assets/crystal.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('rock', 'assets/rock.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('small_crystal', 'assets/small_crystal.png', { frameWidth: 16, frameHeight: 16 });


        this.load.audio("click", 'assets/click.ogg')
        this.load.audio("game_music", 'assets/hadamago.ogg')
    }

    init() {
        this.StoneBaseFactory = new StoneBaseFactory();
        this.CrystalBaseFactory = new CrystalBaseFactory();
        this.objectGroup = this.add.group({ maxSize: 20, runChildUpdate: true });
        this.playerGroup = this.add.group({ runChildUpdate: true });
        this.enemyGroup = this.add.group({ runChildUpdate: true });
        this.playerBullets = this.add.group({ maxSize: 6, runChildUpdate: true });

    }

    create() {
        this.score = 0;
        this.playerBullets.createMultiple({
            classType: Blaster,
            key: 'blaster',
            repeat: 25,
            active: true,
        });
        Phaser.Actions.SetXY(this.playerBullets.getChildren(), -100, -50);
        // this.setBounds(0, 0, 1280, 720);
        this.add.shader('RGB Shift Field', -700, -700, 4000, 2000).setOrigin(0);
        this.add.image(0, 0, 'map').setOrigin(0).setScale(1);

        this.rata = new Rata(this, 500, 500, 'rata', 'player', this.playerBullets);
        this.playerGroup.add(this.rata)

        this.enemigo = new Enemigo(this, 'rataMala', 'enemy', this.rata);
        this.enemigo2 = new Enemigo(this, 'rataMala', 'enemy', this.rata);
        this.enemigo3 = new Enemigo(this, 'rataMala', 'enemy', this.rata);
        this.enemigo4 = new Enemigo(this, 'rataMala', 'enemy', this.rata);
        this.enemyGroup.add(this.enemigo)
        this.enemyGroup.add(this.enemigo2)
        this.enemyGroup.add(this.enemigo3)
        this.enemyGroup.add(this.enemigo4)

        this.objectGroup.createMultiple({ key: 'rock', frame: 0, active: true, visible: true, setXY: { x: 20, y: 20, stepX: 32, stepY: 32 }, max: 10 });
        this.cameras.main.startFollow(this.rata)
        this.cameras.main.zoom = 1.5

        this.physics.add.overlap(
            this.playerGroup,
            this.enemyGroup,
            this.playerEnemyCallback,
            undefined,
            this
        );

        this.physics.add.overlap(
            this.playerGroup,
            this.playerBullets,
            this.playerBulletCallback,
            undefined,
            this
        );
        this.physics.add.overlap(
            this.playerBullets,
            this.enemyGroup,
            this.bulletEnemyCallback,
            undefined,
            this
        );

        this.events.on('enemyKill', this.updateScore, this);

        let gm = this.sound.play("game_music", { volume: 0.2 });

    }
    updateScore(score) {
        this.score += score
        console.log(`New score ${this.score}`)
    }
    playerEnemyCallback(player: any, enemy: Phaser.GameObjects.GameObject) {
        if (!enemy.active) return;
        player.hit();
    }
    playerBulletCallback(player: any, bullet: Phaser.GameObjects.GameObject) {
        if (!bullet.active) return;
        bullet.destroy();
    }
    bulletEnemyCallback(bullet: any, enemy: any) {
        if (!bullet.armed) return;
        enemy.hit();
        bullet.hit();
    }
    update() {

    }
}