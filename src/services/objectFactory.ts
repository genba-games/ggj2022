import { Base } from '../actors/base';
import { Stone } from '../actors/stone';
import { Crystal } from '../actors/crystal';

export interface IBaseFactoryCreate {
    scene: Phaser.Scene;
    x: number;
    y: number;
}

export abstract class BaseFactory {
    constructor() { }

    protected logCreation(name: string): void {
        console.log(name + ' created! ');
    }

    protected abstract create(params: IBaseFactoryCreate): Base;
}

export class StoneBaseFactory extends BaseFactory {
    constructor() {
        super();
    }

    public create(params: IBaseFactoryCreate) {
        this.logCreation('Stone');
        return new Stone({
            scene: params.scene,
            x: params.x,
            y: params.y,
            key: 'enemy'
        });
    }
}

export class CrystalBaseFactory extends BaseFactory {
    constructor() {
        super();
    }

    public create(params: IBaseFactoryCreate) {
        this.logCreation('Crystal');
        return new Crystal({
            scene: params.scene,
            x: params.x,
            y: params.y,
            key: 'enemy'
        });
    }
}
