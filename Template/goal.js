import * as Util from "./util.js";
import { Vector } from "./vector.js";

export class Goal {
  SIZE = 100;
  halfSize = this.SIZE * 0.5;
  constructor(pos) {
    this.pos = new Vector(pos.x, pos.y);
    this.thing = Util.createThing("goal");
    this.init()
  }

  init() {
    const pixPos = this.convertPosToPixel();
    Util.setColour(0, 0, 90, 1, this.thing);
    Util.setSize(this.SIZE, this.SIZE, this.thing);
    Util.setPositionPixels(pixPos.x, pixPos.y, this.thing);
    Util.setRoundedness(0, this.thing);
  }

  convertPosToPixel() {
    let px = this.pos.x * window.innerWidth - this.halfSize;
    let py = this.pos.y * window.innerHeight - this.halfSize;
        return new Vector(px, py);

  }
}