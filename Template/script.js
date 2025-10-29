/*
 * IDB Programming: Code Playground
 *
 */

import * as Util from "./util.js";
import { Vector } from "./vector.js";
import { Enemy } from "./enemies.js";
import { Player } from "./player.js";

let lastTime = 0;
let deltaTime = 0;


let enemies = [];
const enemyPositions = [
  new Vector(0.3, 0.9),
  new Vector(0.5, 0.6),
  new Vector(0.7, 0.3)
];
let player; 

function createEnemyAtPos(v) {
  enemies.push(new Enemy(new Vector(v.x, v.y)));
}

/**
 * 
 * @param {KeyboardEvent} event 
 */
function onKeyDown(event){
  //console.log(`Keycode pressed: ${event.code}`);
  if( event.code === "KeyM") {
    player.isKeyMDown = true;
  };
  if( event.code === "KeyK"){
    player.isKeyKDown = true;
  };
  if( event.code === "KeyL"){
    player.isKeyLDown = true;
  };
}

function onKeyUp(event){
  //console.log(`Keycode pressed: ${event.code}`);
  if( event.code === "KeyM") {
    player.isKeyMDown = false;
  };
  if( event.code === "KeyK"){
    player.isKeyKDown = false;
  };
  if( event.code === "KeyL"){
    player.isKeyLDown = false;
  };
}

/**
 * Checking whether an enemy collides with a player using 
 * AABB intersection math https://dev.to/pratyush_mohanty_6b8f2749/the-math-behind-bounding-box-collision-detection-aabb-vs-obbseparate-axis-theorem-1gdn
 * @param {Enemy} enemy 
 * 
 */
function checkEnemyCollision(enemy){
  // enemy positions
  let enemyPixPos = enemy.convertPosToPixel(); // convert position to pixels because SIZE is in pixels
  let AXmin = enemyPixPos.x - enemy.SIZE * 0.5;
  let AXmax = enemyPixPos.x + enemy.SIZE * 0.5;
  let AYmin = enemyPixPos.y - enemy.SIZE * 0.5;
  let AYmax = enemyPixPos.y + enemy.SIZE * 0.5;

  // player positions
  let playerPixPos = player.convertPosToPixel(); 
  let BXmin = playerPixPos.x - player.SIZE * 0.5;
  let BXmax = playerPixPos.x + player.SIZE * 0.5;
  let BYmin = playerPixPos.y - player.SIZE * 0.5;
  let BYmax = playerPixPos.y + player.SIZE * 0.5;

  if(AXmin <= BXmax && AXmax >= BXmin && AYmin <= BYmax && AYmax >= BYmin){
    return true;
  } else {
    return false;
  }
    
}
function loop() {

  
  calculateDeltaTime(); 

  enemies.forEach(enemy => {
    enemy.update(deltaTime);
  });
  player.update(deltaTime); 

  // check if enemy collides with player
  enemies.forEach(enemy => {
    if(checkEnemyCollision(enemy)){
      // we have a collision here !
      console.log("We have a collision");
    }
  })

  window.requestAnimationFrame(loop);
}


//calculating delta time. Imagine somebody is running on the sprint 100m sprint and you have a 
  // precise watch. so as soon as they touch 1m mark you write down the right time on your watch 
  //then you wait until you pass 2m mark and you write down that time stamp
  //and with that info you can calculate how long it took for the sprinter to go from 1m to 2m mark. 
  //and this is delta time.
function calculateDeltaTime() {
  let currentTime = Date.now();
  deltaTime = currentTime - lastTime;
  deltaTime /= 1000;
  lastTime = currentTime;
}

function setup() {

  enemyPositions.forEach(pos => {
    createEnemyAtPos(pos);
  });
  player = new Player(new Vector(0.7, 0.9));

  addEventListener("keydown", onKeyDown);
  addEventListener("keyup",onKeyUp); 

  lastTime = Date.now();
  window.requestAnimationFrame(loop);
}

setup(); 
