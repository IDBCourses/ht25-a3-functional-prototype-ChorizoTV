import * as Util from "./util.js";
import { Vector } from "./vector.js";
import { setBoundaries, BOUNDARIES } from "./boundaries.js";


//class for enemies 

export class Enemy {
  SIZE = 100;
  constructor(pos,movementType, speed = 1) {
    // coordinates in 0-1
    this.pos = pos;
    this.thing = Util.createThing("enemy");
    this.init();
    this.movementType = movementType;
    this.speed = speed; 
    this.directionX = 1; //moving side to side 
    this.directionY = 1; // moving top to bottom
  }

  init() {
    const pixPos = this.convertPosToPixel();
    Util.setColour(330, 100, 50, 1, this.thing);
    Util.setPositionPixels(pixPos.x, pixPos.y , this.thing);
    Util.setSize(this.SIZE, this.SIZE, this.thing);
    Util.setRoundedness(0, this.thing);
  }

  update(){
    const pixPos = this.convertPosToPixel();
    Util.setPositionPixels(pixPos.x, pixPos.y, this.thing);
  }


  updateMovement(deltaTime) {
  
    if(this.movementType === "horizontal") {
      //horizontal movement
      /**
       * this.speed = how many units the enemy moves per second
       * deltaTime = how many seconds have passed since last frame
       * moveAmount = how many units to move right now
       */
      let moveAmount = this.speed * deltaTime; //calculate distance to move this frame
      this.pos.x += moveAmount * this.directionX;
      //if enemy hits the wall it flips direction
      if(this.pos.x <= BOUNDARIES.left || this.pos.x >= BOUNDARIES.right){
        this.directionX *= -1;
      }
    } else if (this.movementType === "vertical") {
      //vertical movement
      let moveAmount = this.speed * deltaTime;
      this.pos.y += moveAmount * this.directionY; //How far should the enemy move in this frame
      //flips direction when enemy hits the wall
      if(this.pos.y <= BOUNDARIES.top || this.pos.y >= BOUNDARIES.bottom) {
        this.directionY *= -1;
      }
    }

    setBoundaries(this); 
    this.update();
  }

  

  // always get the pixel coordinates even if window size changes AND offset to center 
  convertPosToPixel() {
    const halfSize = this.SIZE * 0.5;
    let px = this.pos.x * window.innerWidth - halfSize;
    let py = this.pos.y * window.innerHeight - halfSize;
    return new Vector(px, py);
  }
}