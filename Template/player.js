import * as Util from "./util.js";
import {Vector} from "./vector.js"; 
import { setBoundaries } from "./boundaries.js";

const SPEED = 200;

export class Player{
  SIZE = 100;
  halfSize = this.SIZE * 0.5;

  constructor(pos){
    // 'this' referes to THIS current object
    this.spawnPos = new Vector(pos.x, pos.y);
    this.pos = new Vector(pos.x, pos.y);
    this.thing = Util.createThing("player");
    this.init(); 
    this.vel = new Vector(0,0);

    this.isKeyMDown = false;
    this.isKeyKDown = false;
    this.isKeyLDown = false;
  }

  init(){
    const pixPos = this.convertPosToPixel();
    Util.setColour(200, 100, 60, 1, this.thing);
    Util.setPositionPixels(pixPos.x, pixPos.y, this.thing);
    Util.setSize(this.SIZE, this.SIZE, this.thing);
    Util.setRoundedness(0, this.thing);
  }
  
  resetPosition(){
    this.pos.x = this.spawnPos.x;
    this.pos.y = this.spawnPos.y;
  }
  setVel(){
    //resets the velocity to zero so we can calculate it 
    //from scratch (doesn't infinetly add to itself)
    //scales the movement to be time-based instead of frame-based
    this.vel = new Vector(0,0);

    if(this.isKeyMDown){
      let leftVel = new Vector (-1, 0);
      leftVel.mult(SPEED);
      this.vel.add(leftVel);
    }
     if(this.isKeyKDown){
      const upVel = new Vector (0, -1);
      upVel.mult(SPEED);
      this.vel.add(upVel)
    } 
    if(this.isKeyLDown){
      const rightVel = new Vector (1, 0);
      rightVel.mult(SPEED);
      this.vel.add(rightVel);
    }
  }


  update(deltaTime){

    this.setVel();
    this.vel.mult(deltaTime); //scale velocity by deltatime 
    let normalVel = this.convertPixelToNormal(this.vel); //converts this.vel to normalised
    this.pos.add(normalVel); //move position by velocity (smooth)
    const pixPos = this.convertPosToPixel();
    setBoundaries(this);
    // Vector.mult doesnt modify 'this.vel', it only returns
    // a new vector that is multiplied by deltaTime
    Util.setRotation(0, this.thing);
    Util.setPositionPixels(pixPos.x, pixPos.y, this.thing);

  }

  // converts 'this.pos' to pixel coordinates and returns them
  convertPosToPixel() {
    let px = this.pos.x * window.innerWidth - this.halfSize;
    let py = this.pos.y * window.innerHeight - this.halfSize;
    return new Vector(px, py);
  }
  // converts pixel coordinates to normal coordinates, which
  // range between 0-1 and returns them.
  convertPixelToNormal(vec){
    let nx = vec.x / window.innerWidth;
    let ny = vec.y / window.innerHeight;
    return new Vector(nx, ny);
  }
}



