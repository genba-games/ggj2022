import { Base } from './base';

export class Crystal extends Base {
    constructor(params) {
        super(params);
        this.asset = "crystal";
        // this.setTint(0x32a881);
    }
}