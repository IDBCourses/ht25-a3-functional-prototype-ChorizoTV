
// this is a two dimensional vector class, to simply vector math in my script (helper)



export class Vector {

  constructor(x=0.0, y=0.0){
    this.x = x;
    this.y = y;
  }
  // add x, y components of a vector
  add(x = 0.0, y = 0.0){
    this.x += x;
    this.y += y;
  }
  /**
   * add a vector to this vector
   * @param {Vector} vec 
   */
  add(vec){
    this.x += vec.x;
    this.y += vec.y;
  }
  /**
   * add two vectors together without modifying them 
   * 'static' means global
   * @param {Vector} a 
   * @param {Vector} b 
   * @returns 
   */
  static add(a, b){
    let v = new Vector(a.x + b.x, a.y + b.y);
    return v;
  }

  sub(x = 0.0, y = 0.0){
    this.x -= x;
    this.y -= y;
  }
  /**
   * 
   * @param {Vector} vec 
   */
  sub(vec){
    this.x -= vec.x;
    this.y -= vec.y;
  }
  /**
   * substracts two vectors together without modifying them 
   * @param {Vector} a 
   * @param {Vector} b 
   * @returns 
   */
  static sub(a,b){
    let v = new Vector(a.x - b.x, a.y - b.y);
    return v;
  }
  mult(d= 0.0){
    this.x *= d;
    this.y *= d;
  }
/**
 * scale a vector by parametar d (when you scale a number you multiply by
 * something making it bigger likewise when you scale a vector you make it
 * LONGER not ''move it'' around)
 * @param {Vector} a 
 * @param {number} d 
 * @returns 
 */
  static mult(a, d){
    let v = new Vector(a.x * d, a.y * d);
    return v; 
  }
  // avoid division by 0 
  div(d = 1.0){
    this.x /= d;
    this.y /= d;
  }
  /**
   * scale a vector by division, makes sure d is always 1 by default  
   * @param {Vector} a 
   * @param {number} d 
   * @returns 
   */
  static div(a,d = 1){
    let v = new Vector( a.x / d, a.y / d);
    return v;
  }
}