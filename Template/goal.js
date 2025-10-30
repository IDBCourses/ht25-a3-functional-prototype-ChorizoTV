import * as Util from "./util.js";
import { Vector } from "./vector.js";
import { PLAYER_COLORS, PLAYER_STATE } from "./player.js";
import { PLATE_COLORS } from "./colorplates.js";


const goalDefaultColor = {h:0, s:0, l:90, a:1}; 


export class Goal {
  SIZE = 100;
  halfSize = this.SIZE * 0.5;
  constructor(pos) {
    this.pos = new Vector(pos.x, pos.y);
    this.thing = Util.createThing("goal");
    this.currentColor = null;
    this.colorSequence = [];
    this.init();

  }
  changeColor(newColor) {
    this.colorSequence.push(newColor);

    if (this.colorSequence.length === 1){
          this.currentColor = newColor;
    } else {
      this.currentColor =this.mixColors();
    }

    this.updateVisualColor();
    console.log(`goal changed color to: ${newColor.name}`);
    console.log(`Color sequence; ${this.colorSequence.map(c => c.name)}`);
  }

  mixColors(){
    const colorNames = this.colorSequence.map(color => color.name);

    if(colorNames.includes("red") && colorNames.includes("yellow")) {
      return PLAYER_COLORS[PLAYER_STATE.ORANGE];
    }
    if(colorNames.includes("red") && colorNames.includes("blue")) {
      return PLAYER_COLORS[PLAYER_STATE.PURPLE];
    }
    if(colorNames.includes("yellow") && colorNames.includes("blue")) {
      return PLAYER_COLORS[PLAYER_STATE.GREEN];}


     return this.colorSequence[this.colorSequence.length - 1];

  }


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
      Util.setColour(
        goalDefaultColor.h, 
        goalDefaultColor.s, 
        goalDefaultColor.l, 
        goalDefaultColor.a, 
        this.thing)
    }
  }
  init() {
    const pixPos = this.convertPosToPixel();
    this.updateVisualColor();
    Util.setSize(this.SIZE, this.SIZE, this.thing);
    Util.setPositionPixels(pixPos.x, pixPos.y, this.thing);
    Util.setRoundedness(0, this.thing);
  }

  convertPosToPixel() {
    let px = this.pos.x * window.innerWidth - this.halfSize;
    let py = this.pos.y * window.innerHeight - this.halfSize;
        return new Vector(px, py);

  }
  update(){
    const pixPos = this.convertPosToPixel()
    Util.setPositionPixels(pixPos.x, pixPos.y, this.thing);
  }
}