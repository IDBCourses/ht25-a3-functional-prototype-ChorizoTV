import * as Util from "./util.js";
import { Vector } from "./vector.js";
import { PLAYER_COLORS, PLAYER_STATE } from "./player.js";
import { PLATE_COLORS } from "./colorplates.js";

//writing all values out incase of wanting to change the color 
const goalDefaultColor = {h:0, s:0, l:90, a:1}; 


export class Goal {
  SIZE = 100;
  halfSize = this.SIZE * 0.5;
  constructor(pos) {
    this.pos = new Vector(pos.x, pos.y);
    this.thing = Util.createThing("goal");
    this.currentColor = null; //leaving an empty array to track the sequence applied to the goal
    this.colorSequence = [];
    this.init();

  }


  //function to change the goal's color when it interacts with color plates
  changeColor(newColor) {
    //add the new color to the end of the color sequence 
    this.colorSequence.push(newColor);

    //limit the color sequence to only remember the last 2 colors
    //if we have more than 2 colors it keeps only the last 2 using slice(-2)
    if(this.colorSequence.length > 2){
      this.colorSequence = this.colorSequence.slice(-2);
    }

    //sets the first picked up color as the color of the goal
    if (this.colorSequence.length === 1){
          this.currentColor = newColor;
    } else {
      this.currentColor =this.mixColors();
    }

    this.updateVisualColor();
    console.log(`goal changed color to: ${newColor.name}`);
    console.log(`Color sequence; ${this.colorSequence.map(c => c.name)}`);
  }

  //function to mix two colors and return the resulting mixed colors
  mixColors(){

const hasRed = this.colorSequence.includes(PLATE_COLORS.RED);
const hasYellow = this.colorSequence.includes(PLATE_COLORS.YELLOW);
const hasBlue = this.colorSequence.includes(PLATE_COLORS.BLUE);

if(hasRed && hasYellow) return PLAYER_COLORS[PLAYER_STATE.ORANGE];
if(hasBlue && hasYellow) return PLAYER_COLORS[PLAYER_STATE.GREEN];
if(hasRed && hasBlue) return PLAYER_COLORS[PLAYER_STATE.PURPLE];

    //keeps the most recent color as base so we can still mix 
     return this.colorSequence[this.colorSequence.length - 1]; //-1 because array indexes start at 0

  }



// function to update the visual color for the goal 
  updateVisualColor(){

    if(this.currentColor) {
      Util.setColour(
        this.currentColor.h,
        this.currentColor.s,
        this.currentColor.l,
        this.currentColor.a,
        this.thing
      );
    } else {
      //if no current color (null), it's gray
      Util.setColour(
        goalDefaultColor.h, 
        goalDefaultColor.s, 
        goalDefaultColor.l, 
        goalDefaultColor.a, 
        this.thing)
    }
  }
  //initialization, called once when the goal is first created
  init() {
    //convert the normalised position(0-1) to actual pixel coordinates
    //goal is always in the same relative position
    const pixPos = this.convertPosToPixel();

    //this will show the current color or default gray if no color picked up
    this.updateVisualColor();
    Util.setSize(this.SIZE, this.SIZE, this.thing);
    Util.setPositionPixels(pixPos.x, pixPos.y, this.thing); //needed for AABB
    Util.setRoundedness(0, this.thing);
  }

  //convert normlaised coordinates (0-1) to actual pixel coordinates
  //this makes the game responsive to different screen sizes 
  convertPosToPixel() {
    let px = this.pos.x * window.innerWidth - this.halfSize;
    let py = this.pos.y * window.innerHeight - this.halfSize;
        return new Vector(px, py); // return as vector object

  }

  //updates visual position based on current position
  //used during victory animation to smoothly transition to new position
  update(){
    const pixPos = this.convertPosToPixel()
    Util.setPositionPixels(pixPos.x, pixPos.y, this.thing);
  }
}