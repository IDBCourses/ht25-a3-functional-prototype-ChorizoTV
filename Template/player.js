import * as Util from "./util.js";
import {Vector} from "./vector.js"; 
import { setBoundaries } from "./boundaries.js";

const SPEED = 200;
export const PLAYER_STATE = {
  PURPLE: "purple",
  GREEN: "green",
  ORANGE: "orange"
};

export const PLAYER_COLORS = {
  [PLAYER_STATE.PURPLE]: {h:266, s: 100, l: 50, a: 1 },
  [PLAYER_STATE.GREEN] : {h:135, s: 76, l: 60, a: 1 },
  [PLAYER_STATE.ORANGE]: {h:24, s: 90, l: 60, a: 1 }
}
export class Player{
  SIZE = 100;
  halfSize = this.SIZE * 0.5;

  constructor(pos){
    // 'this' referes to THIS current object
    this.spawnPos = new Vector(pos.x, pos.y); //remember where the player starts
    this.pos = new Vector(pos.x, pos.y); // curr pos changes when player moves
    this.thing = Util.createThing("player"); 
    this.currentState = this.getRandomState();//pick a random color state when player starts
    this.init(); 
    this.vel = new Vector(0,0); //how fast and in what direction player is moving
    //track which keys are being pressed for movement 
    this.isKeyMDown = false;
    this.isKeyKDown = false;
    this.isKeyLDown = false;
  }

  //get random state from the three states
  getRandomState(){
    //put all possible states in a list
    const states = [PLAYER_STATE.PURPLE, PLAYER_STATE.GREEN, PLAYER_STATE.ORANGE];
    //pick random number: 0, 1, 2
    const randomIndex = Math.floor(Math.random() * states.length);
    //returns the chosen state
    return states[randomIndex];
  }

  
  getCurrentColor(){
    return PLAYER_COLORS[this.currentState];
  }

  init(){
    const pixPos = this.convertPosToPixel();
    const color = this.getCurrentColor();
    Util.setColour(color.h, color.s, color.l, color.a, this.thing);

    Util.setPositionPixels(pixPos.x, pixPos.y, this.thing);
    Util.setSize(this.SIZE, this.SIZE, this.thing);
    Util.setRoundedness(0, this.thing);
  }
  setState(newState){
    const color = this.getCurrentColor();
    Util.setColour(color.h, color.s, color.l, color.a, this.thing);

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



