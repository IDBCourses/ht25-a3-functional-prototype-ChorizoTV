import * as Util from "./util.js";
import { Vector } from "./vector.js";
import { setBoundaries } from "./boundaries.js";
import { Goal } from "./goal.js";
import { ColorPlate } from "./colorplates.js";

const SPEED = 250;


export const PLAYER_STATE = {
  PURPLE: "purple",
  GREEN: "green",
  ORANGE: "orange"
};

export const PLAYER_COLORS = {
  [ PLAYER_STATE.PURPLE ]: { h: 266, s: 100, l: 50, a: 1 },
  [ PLAYER_STATE.GREEN ]: { h: 135, s: 76, l: 60, a: 1 },
  [ PLAYER_STATE.ORANGE ]: { h: 24, s: 90, l: 60, a: 1 }
}
export class Player {
  SIZE = 100;
  halfSize = this.SIZE * 0.5;

  constructor(pos, goalRef) {
    // 'this' referes to THIS current object
    this.spawnPos = new Vector(pos.x, pos.y); //remember where the player starts
    this.pos = new Vector(pos.x, pos.y); // curr pos changes when player moves
    this.thing = Util.createThing("player");
    this.currentState = this.getRandomState();//pick a random color state when player starts
    this.goal = goalRef;

    this.movementStates = [ "up", "right", "down", "left" ];
    this.currentDirectionIndex = 0;
    this.isStopped = false;

    this.headIndicator = Util.createThing("headIndicator")
    this.init();

    this.isKeyKDown = false;

  }

    pickUpColor(color) {
      console.log(`player picked up color: ${color.name}`);
      this.goal.changeColor(color);
    }

  //get random state from the three states
  getRandomState() {
    //put all possible states in a list
    const states = [ PLAYER_STATE.PURPLE, PLAYER_STATE.GREEN, PLAYER_STATE.ORANGE ];
    //pick random number: 0, 1, 2
    const randomIndex = Math.floor(Math.random() * states.length);
    //returns the chosen state
    return states[ randomIndex ];
  }


  getCurrentColor() {
    return PLAYER_COLORS[ this.currentState ];
  }

  init() {
    const pixPos = this.convertPosToPixel();
    const color = this.getCurrentColor();

    //main body
    Util.setColour(color.h, color.s, color.l, color.a, this.thing);
    Util.setPositionPixels(pixPos.x, pixPos.y, this.thing);
    Util.setSize(this.SIZE, this.SIZE, this.thing);
    Util.setRoundedness(0, this.thing);
    //head indicator
    Util.setColour(59, 100, 50, 1, this.headIndicator);
    Util.setSize(50, 50, this.headIndicator);
    Util.setRoundedness(1, this.headIndicator);

    this.updateHeadPos();
  }

  updateBodyPos(){
    const pixPos = this.convertPosToPixel();
    Util.setPositionPixels(pixPos.x, pixPos.y, this.thing);
  }

  updateHeadPos() {
    const pixPos = this.convertPosToPixel();
    const direction = this.movementStates[ this.currentDirectionIndex ];

    let headX = pixPos.x;
    let headY = pixPos.y;

    switch (direction) {
      case "up":
        headX += this.SIZE / 2 - 25;
        headY -= 20;
        break;
      case "right":
        headX += this.SIZE - 20;
        headY += this.SIZE / 2 - 25;
        break;
      case "down":
        headX += this.SIZE / 2 - 25;
        headY += this.SIZE - 20;
        break;
      case "left":
        headX -= 20;
        headY += this.SIZE / 2 - 25;
        break;
    }
    Util.setPositionPixels(headX, headY, this.headIndicator);

  }

  cycleDirection() {
    this.currentDirectionIndex = (this.currentDirectionIndex + 1) % 4;
    this.updateHeadPos();
  }

  setState(newState) {
    this.currentState = newState;
    const color = this.getCurrentColor();
    Util.setColour(color.h, color.s, color.l, color.a, this.thing);

  }
  resetPosition() {
    this.pos.x = this.spawnPos.x;
    this.pos.y = this.spawnPos.y;
  }
  setVel() {
    //resets the velocity to zero so we can calculate it 
    //from scratch (doesn't infinetly add to itself)
    //scales the movement to be time-based instead of frame-based
    this.vel = new Vector(0, 0);

    if (this.isKeyMDown) {
      let leftVel = new Vector(-1, 0);
      leftVel.mult(SPEED);
      this.vel.add(leftVel);
    }
    if (this.isKeyKDown) {
      const upVel = new Vector(0, -1);
      upVel.mult(SPEED);
      this.vel.add(upVel)
    }
    if (this.isKeyLDown) {
      const rightVel = new Vector(1, 0);
      rightVel.mult(SPEED);
      this.vel.add(rightVel);
    }
  }


  update(deltaTime) {
    if (!this.isStopped) {
      const direction = this.movementStates[ this.currentDirectionIndex ];
      let moveAmount = SPEED * deltaTime;

      switch (direction) {
        case "up":
          this.pos.y -= moveAmount / window.innerHeight;
          break;
        case "right":
          this.pos.x += moveAmount / window.innerWidth;
          break;
        case "down":
          this.pos.y += moveAmount / window.innerHeight;
          break;
        case "left":
          this.pos.x -= moveAmount / window.innerWidth;
          break;
      }
    }

    setBoundaries(this);

    const pixPos = this.convertPosToPixel();
    Util.setRotation(0, this.thing);
    Util.setPositionPixels(pixPos.x, pixPos.y, this.thing);
    this.updateHeadPos()

  }

  // converts 'this.pos' to pixel coordinates and returns them
  convertPosToPixel() {
    let px = this.pos.x * window.innerWidth - this.halfSize;
    let py = this.pos.y * window.innerHeight - this.halfSize;
    return new Vector(px, py);
  }
  // converts pixel coordinates to normal coordinates, which
  // range between 0-1 and returns them.
  convertPixelToNormal(vec) {
    let nx = vec.x / window.innerWidth;
    let ny = vec.y / window.innerHeight;
    return new Vector(nx, ny);
  }
}



