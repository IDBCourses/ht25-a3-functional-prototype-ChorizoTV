import * as Util from "./util.js";
import { Vector } from "./vector.js";


//class for enemies 

export class Enemy {
  SIZE = 100;
  SPEED = 1; 
  constructor(pos,offsetX) {
    // coordinates in 0-1
    this.pos = pos;
    this.thing = Util.createThing("enemy");
    this.init();
    this.acc = 0;
    this.offsetX = offsetX; 

  }

  init() {
    const pixPos = this.convertPosToPixel();
    Util.setColour(0, 100, 60, 1, this.thing);
    Util.setPositionPixels(pixPos.x, pixPos.y , this.thing);
    Util.setSize(this.SIZE, this.SIZE, this.thing);
    Util.setRoundedness(0, this.thing);
  }
  update(deltaTime) {
    // accumulates time by adding delta time every frame 
    this.acc += deltaTime;
    let sinY = Math.sin(this.acc * this.SPEED);
    let offsetX = this.offsetX * sinY;

    const pixPos = this.convertPosToPixel();
    Util.setRotation(0, this.thing);
    Util.setPositionPixels(pixPos.x + offsetX, pixPos.y, this.thing);

  }

  // always get the pixel coordinates even if window size changes AND offset to center 
  convertPosToPixel() {
    const halfSize = this.SIZE * 0.5;
    let px = this.pos.x * window.innerWidth - halfSize;
    let py = this.pos.y * window.innerHeight - halfSize;
    return new Vector(px, py);
  }
}