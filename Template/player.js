import * as Util from "./util.js";
import { Vector } from "./vector.js";
import { setBoundaries } from "./boundaries.js";

const SPEED = 250;


//define all player color states with their visual properties
export const PLAYER_COLORS = {
  PURPLE: {
    name: "purple",
    h: 266, s: 100, l: 50, a: 1
  },
  GREEN: {
    name: "green",
     h: 135, s: 76, l: 60, a: 1
  },
  ORANGE: {
    name: "orange",
     h: 24, s: 90, l: 60, a: 1
  }
}
export class Player {
  SIZE = 100;
  halfSize = this.SIZE * 0.5;
  headIndicatorSize = 50; 
  headIndicatorHalfSize = this.headIndicatorSize * 0.5;

  constructor(pos) {
    // 'this' referes to THIS current object
    this.spawnPos = new Vector(pos.x, pos.y); //remember where the player starts
    this.pos = new Vector(pos.x, pos.y); // curr pos changes when player moves
    this.thing = Util.createThing("player");
    this.currentState = this.getRandomState();//pick a random color state when player starts
    this.movementStates = [ "up", "right", "down", "left" ];
    this.currentDirectionIndex = 0;
    this.isStopped = false;

    this.headIndicator = Util.createThing("headIndicator")
    this.init();
  }

  //get random state from the three states
  getRandomState() {
    //array of all possible color states
    const states = [ PLAYER_COLORS.PURPLE, PLAYER_COLORS.GREEN, PLAYER_COLORS.ORANGE ];
    //pick random number: 0-2
    const randomIndex = Math.floor(Math.random() * states.length);
    //returns the chosen state
    return states[ randomIndex ];
  }

  getCurrentColor() {
    return this.currentState;
  }

  //updates color state and visual color of the player
  //used when player needs to change colors (after collision reset)
  setState(newState) {
    this.currentState = newState;
    Util.setColour(newState.h, newState.s, newState.l, newState.a, this.thing);
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
    Util.setSize(this.headIndicatorSize, this.headIndicatorSize, this.headIndicator);
    Util.setRoundedness(1, this.headIndicator);
    
    //position the head indicator based on initual direction
    this.updateHeadPos();
  }


  // updates the main player body position outside the movement system (used for victory animation)
  updateBodyPos(){
    const pixPos = this.convertPosToPixel();
    Util.setPositionPixels(pixPos.x, pixPos.y, this.thing);
  }
  
  //updates head indicator position relative to player based current 
  //direction
  updateHeadPos() {
    const pixPos = this.convertPosToPixel();
    const direction = this.movementStates[ this.currentDirectionIndex ];

    let headX = pixPos.x;
    let headY = pixPos.y;

    switch (direction) {
      case "up":
        headX += this.halfSize - this.headIndicatorHalfSize;
        headY -= this.headIndicatorHalfSize;
        break;
      case "right":
        headX += this.SIZE - this.headIndicatorHalfSize;
        headY += this.halfSize  - this.headIndicatorHalfSize;
        break;
      case "down":
        headX += this.halfSize  - this.headIndicatorHalfSize;
        headY += this.SIZE - this.headIndicatorHalfSize;
        break;
      case "left":
        headX -= this.headIndicatorHalfSize;
        headY += this.halfSize - this.headIndicatorHalfSize;
        break;
    }

    //apply the calculated position to the head indicator element
    Util.setPositionPixels(headX, headY, this.headIndicator);
  }

  //cycles through movement directions in sequence (up -> right -> down -> left)
  cycleDirection() {
    this.currentDirectionIndex = (this.currentDirectionIndex + 1) % 4; // % wrap around tool, when a number 
    // reaches the limit it jumps back to the start

    const directions = ["up", "right", "down", "left"];
    console.log(`Player is facing: ${directions[this.currentDirectionIndex]}`);

    
    //updates head indicator pos to reflect new direction
    this.updateHeadPos();
  }

  //resets player position to original spawn point
  resetPosition() {
    this.pos.x = this.spawnPos.x;
    this.pos.y = this.spawnPos.y;
  }

  //main update method called each frame, handles movement and visual updates
  update(deltaTime) {
    if (!this.isStopped) {
      const direction = this.movementStates[ this.currentDirectionIndex ];
      //calculate movement distance based on speed and time since last frame
      //converts "pixel per second" to "pixels per frame"
      let moveAmount = SPEED * deltaTime;

      //update oosition based on current direction
      //movement amount are normalised by screen dimensions for consistent speed
      //across resolutions 
      switch (direction) {
        case "up":
          this.pos.y -= moveAmount / window.innerHeight;
          break; //on computer screens the origin is 0,0 is the top 
          // left and Y inscreases as you go down
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

    //ensures player stays within screen boundries 
    setBoundaries(this);

    //update visual position of player's body
    const pixPos = this.convertPosToPixel();
    // Util.setRotation(0, this.thing); (trauma from last project)
    Util.setPositionPixels(pixPos.x, pixPos.y, this.thing);
    //update head indicator position to match new player position
    this.updateHeadPos()

  }

  // converts 'this.pos' to pixel coordinates and returns them
  convertPosToPixel() {
    let px = this.pos.x * window.innerWidth - this.halfSize;
    let py = this.pos.y * window.innerHeight - this.halfSize;
    return new Vector(px, py);
  }
  
}



