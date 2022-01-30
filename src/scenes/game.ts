
import Rata from '../actors/rata'
import Blaster from '../actors/blaster'
import Enemigo from '../actors/enemigo'
import { StoneBaseFactory, CrystalBaseFactory } from '../services/objectFactory'
import { gameHeight, gameWidth } from '../utils'

export default class GameScene extends Phaser.Scene {
    private playerGroup: Phaser.GameObjects.Group;
    private enemyGroup: Phaser.GameObjects.Group;
    private StoneBaseFactory: StoneBaseFactory;
    private CrystalBaseFactory: CrystalBaseFactory;
    private rata: Rata;
    private enemigo: Enemigo;
    private enemigo2: Enemigo;
    private enemigo3: Enemigo;
    private enemigo4: Enemigo;
    private playerBullets: Phaser.GameObjects.Group;
    private score: number
    private gameMusic: Phaser.Sound.BaseSound;
    private lastSpawnTime: number;
    private spawnDelay: number;
    private spawnedEnemies: number;
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
        this.load.image('rata_disfrazada', 'assets/rata_disfrazada.png');
        this.load.image('revolver', 'assets/revolver.png');
        this.load.image('bullit', 'assets/bullit.png');
        this.load.image("gato_i", 'assets/gato_i.png')
        this.load.image("gato_d", 'assets/gato_d.png')
        this.load.spritesheet('crystal', 'assets/crystal.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('rock', 'assets/rock.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('small_crystal', 'assets/small_crystal.png', { frameWidth: 16, frameHeight: 16 });


        this.load.audio("click", 'assets/click.ogg')
        this.load.audio("game_music", 'assets/hadamago.ogg')
    }

    init() {
        this.StoneBaseFactory = new StoneBaseFactory();
        this.CrystalBaseFactory = new CrystalBaseFactory();
        // this.objectGroup = this.add.group({ maxSize: 20, runChildUpdate: true });
        this.playerGroup = this.add.group({ runChildUpdate: true });
        this.enemyGroup = this.add.group({ maxSize: 6, runChildUpdate: true });
        this.playerBullets = this.add.group({ maxSize: 6, runChildUpdate: true });
        this.score = 0;
        this.lastSpawnTime = 0;
        this.spawnDelay = 100;
    }

    create() {


        // this.enemyGroup.createMultiple({
        //     classType: Enemigo,
        //     key: 'gato_i',
        //     repeat: 6,
        //     active: false,

        // });

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

        this.enemyGroup.add(new Enemigo(this, 'gato_i', 'enemy', this.rata));
        this.enemyGroup.add(new Enemigo(this, 'gato_i', 'enemy', this.rata));
        this.enemyGroup.add(new Enemigo(this, 'gato_i', 'enemy', this.rata));
        this.enemyGroup.add(new Enemigo(this, 'gato_i', 'enemy', this.rata));
        this.enemyGroup.add(new Enemigo(this, 'gato_i', 'enemy', this.rata));
        this.enemyGroup.add(new Enemigo(this, 'rataMala', 'enemy', this.rata));

        for (var i = 0; i < 20; i++) {
            let y = Phaser.Math.RND.between(0, gameHeight);
            let yc = Phaser.Math.RND.between(0, gameHeight);
            let x = Phaser.Math.RND.between(0, gameWidth);
            let xc = Phaser.Math.RND.between(0, gameWidth);

            this.StoneBaseFactory.create({ scene: this, x, y });
            this.CrystalBaseFactory.create({ scene: this, x: xc, y: yc });
        }
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


        this.gameMusic = this.sound.add("game_music", { volume: 0.2 });
        this.gameMusic.play({ volume: 0.2 });
        this.events.on('enemyKill', this.updateScore, this);
        this.events.on('playerDeath', this.endGame, this);

    }
    endGame() {
        this.gameMusic.stop();
        this.scene.start('GameOverScene', { score: this.score })
    }
    updateScore(score) {
        this.score += score
    }
    playerEnemyCallback(player: any, enemy: Phaser.GameObjects.GameObject) {
        //This conditional only exists because sometimes the tweens don't call their onComplete functions
        if (player.hurt === true && player.lastHurt + 110 < player.scene.time.now) player.hurt = false
        // don't hurt player if enemy is not active(garbage)
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
    update(time) {
        let available: Enemigo | null = this.enemyGroup.get();
        if (available && this.lastSpawnTime + this.spawnDelay < time) {
            this.spawnedEnemies += 1
            //spawn random
            let selector = Phaser.Math.RND.between(0, 10);
            if (selector < 2) {
                available.setTexture('rataMala');
                available.setBodySize(52, 58)
                // random collor would be nice
                // available.setTint(0xFF0000);
            } else if (selector === 3) {
                available.setTexture('rata_disfrazada');
                available.setBodySize(60, 57)
            } else if (selector < 7) {
                available.setTexture('gato_i');
                available.setBodySize(115, 90)
            }
            else if (selector < 11) {
                available.setTexture('gato_d');
                available.setBodySize(115, 90)
            }
            available.setPosition(Phaser.Math.RND.between(0, gameWidth), Phaser.Math.RND.between(0, gameHeight));
            available.enable()
            available.setTarget(this.rata)
            this.lastSpawnTime = time;
            //every n enemies spawned we should increase the pool 
            if (this.spawnedEnemies % 10 == 0) {
                this.enemyGroup.maxSize += 1;
            }
        }
    }
}