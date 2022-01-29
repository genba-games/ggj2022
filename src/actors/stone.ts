import { Base } from './base';

export class Stone extends Base {
    constructor(params) {
        super(params);
        this.asset = "stone";
        // this.setTint(0x32a881);
    }
}