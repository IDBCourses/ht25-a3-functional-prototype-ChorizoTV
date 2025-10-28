import * as Util from "./util.js";
import {Vector} from "./vector.js"; 

const SPEED = 1;

export class Player{
  SIZE = 100;
  halfSize = this.SIZE * 0.5;

  constructor(pos){
    // 'this' referes to THIS current object
    this.pos = pos;
    this.thing = Util.createThing("player");
    this.init(); 
  }

  init(){
    const pixPos = this.convertPosToPixel();
    Util.setColour(200, 100, 60, 1, this.thing);
    Util.setPositionPixels(pixPos.x, pixPos.y, this.thing);
    Util.setSize(this.SIZE, this.SIZE, this.thing);
    Util.setRoundedness(0, this.thing);
  }

  moveLeft(){
    //0.016 is the time of one frame (assuming 1 second is 60 frames)
    this.pos.x -= SPEED * 0.01;
  }

  moveRight(){
    this.pos.x += SPEED * 0.01;
  }

  moveUp(){
    this.pos.y -= SPEED * 0.01;
  }

  updateTransform(){
    const pixPos = this.convertPosToPixel();
    Util.setRotation(0, this.thing);
    Util.setPositionPixels(pixPos.x, pixPos.y, this.thing);

  }

  convertPosToPixel() {
    let px = this.pos.x * window.innerWidth - this.halfSize;
    let py = this.pos.y * window.innerHeight - this.halfSize;
    return new Vector(px, py);
  }
}



