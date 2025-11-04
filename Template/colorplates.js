import * as Util from "./util.js";
import { Vector } from "./vector.js";


//define available color options for color plates
export const PLATE_COLORS = {
  RED: {
    name: "red",
    h:360,
    s:70,
    l: 50,
    a: 1
  },
  BLUE: {
    name:"blue",
    h:240,
    s: 80,
    l: 50,
    a:1
  },
  YELLOW: {
    name: "yellow",
    h: 56,
    s: 90,
    l: 60,
    a: 1
  }
}


export class ColorPlate {
  SIZE = 60;
  halfSize = this.SIZE * 0.5;

  constructor(pos, colorType) {
    this.pos = pos;
    //store reference to the color definition (RED, BLUE, YELLOW)
    this.colorType = colorType;
    this.thing = Util.createThing("colorPlate");
    this.init();

  }
  //initializes the color plate's visual appearance and position
  init(){
  
    const pixPos = this.convertPosToPix();
    Util.setColour(
      this.colorType.h,
      this.colorType.s,
      this.colorType.l,
      this.colorType.a,
      this.thing
    );
    Util.setPositionPixels(pixPos.x, pixPos.y, this.thing);
    Util.setSize(this.SIZE, this.SIZE, this.thing);
    Util.setRoundedness(0, this.thing);

  }
  //converts normalised coordinates to pixel coordinates 
  //centers the plate by substracting halfSize from caluclated position 
  convertPosToPix(){
    let px = this.pos.x * window.innerWidth - this.halfSize;
    let py = this.pos.y * window.innerHeight - this.halfSize;
    return new Vector(px, py);
    }

  //updates the color plate's visual position on screen
  //used during smiley 
  update(){
    const pixPos = this.convertPosToPix()
    Util.setPositionPixels(pixPos.x, pixPos.y, this.thing);
  }
    
}