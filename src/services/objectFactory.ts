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
        this.logCreation('rock');
        return new Stone(params.scene, params.x, params.y);
    }
}

export class CrystalBaseFactory extends BaseFactory {
    constructor() {
        super();
    }

    public create(params: IBaseFactoryCreate) {
        this.logCreation('crystal');
        return new Crystal(params.scene, params.x, params.y);
    }
}
