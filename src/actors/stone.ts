import { Base } from './base';

export class Stone extends Base {
    constructor(scene, x, y) {
        super(scene, x, y, "rock");
        this.asset = "rock";
        // this.setTint(0x32a881);
    }
}