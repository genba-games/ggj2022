import { Base } from './base';

export class Crystal extends Base {
    constructor(scene, x, y) {
        super(scene, x, y, "crystal");
        this.asset = "crystal";
        // this.setTint(0x32a881);
    }
}