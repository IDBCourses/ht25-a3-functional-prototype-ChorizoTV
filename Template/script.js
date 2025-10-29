/*
 * IDB Programming: Code Playground
 *
 */

import * as Util from "./util.js";
import { Vector } from "./vector.js";
import { Enemy } from "./enemies.js";
import { Player } from "./player.js";
import { Goal } from "./goal.js"; 
import { ColorPlate, PLATE_COLORS } from "./colorplates.js";


let lastTime = 0;
let deltaTime = 0;
let goal; 
let colorPlates = [];

let colorPlateData = [
  {pos: new Vector(0.3, 0.9), color: PLATE_COLORS.RED},
  {pos: new Vector(0.7, 0.45), color: PLATE_COLORS.BLUE},
  {pos: new Vector(0.6, 0.15), color: PLATE_COLORS.YELLOW}
];

function createColorPlates(){
  colorPlateData.forEach((plateData) => {
    colorPlates.push(new ColorPlate(plateData.pos, plateData.color));
  });
}
let enemies = [];
const enemyData = [
  {pos: new Vector(0.3, 0.6), type: "horizontal", speed:0.4},
  {pos: new Vector(0.5, 0.6), type: "vertical", speed:0.4},
  {pos:new Vector(0.7, 0.3), type: "horizontal", speed:0.4}
];

let player; 


function createEnemyAtPos(data) {
  enemies.push(new Enemy(data.pos, data.type, data.speed));
}

/**
 * 
 * @param {KeyboardEvent} event 
 */
function onKeyDown(event){
if (event.code === "KeyK") {
  player.isStopped = true;
}
if (event.code === "KeyM") {
  player.cycleDirection();
}
}

function onKeyUp(event){
if( event.code === "KeyK") {
  player.isStopped = false;
}
}

function checkGoalCollision(goal){
  let goalPixPos = goal.convertPosToPixel();

  let AXmin = goalPixPos.x - goal.SIZE * 0.5;
  let AXmax = goalPixPos.x + goal.SIZE * 0.5;
  let AYmin = goalPixPos.y - goal.SIZE * 0.5;
  let AYmax = goalPixPos.y + goal.SIZE * 0.5;

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
/**
 * Checking whether an enemy collides with a player using 
 * AABB intersection math https://dev.to/pratyush_mohanty_6b8f2749/the-math-behind-bounding-box-collision-detection-aabb-vs-obbseparate-axis-theorem-1gdn
 * @param {Enemy} enemy 
 * 
 */
function checkEnemyCollision(enemy){
  // enemy positions
  let enemyPixPos = enemy.convertPosToPixel(); // convert position to pixels because SIZE is in pixels
  // This creates a box around the enemy for collision detection
  // Example: If enemy is at (100,100) with SIZE=100:
  // Left=50, Right=150, Top=50, Bottom=150
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
      console.log("We have a collision! Resetting player position");
      player.resetPosition();
      let playerState = player.getRandomState();
      player.setState(playerState);
    }
  })

  if(checkGoalCollision(goal)){
    console.log("nice congrats!");
  }
  

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

    createColorPlates();
  enemyData.forEach(data => {
    createEnemyAtPos(data);
  });
  player = new Player(new Vector(0.7, 0.9));
  goal = new Goal(new Vector(0.3, 0.15));
  addEventListener("keydown", onKeyDown);
  addEventListener("keyup",onKeyUp); 

  lastTime = Date.now();
  window.requestAnimationFrame(loop);
}

setup(); 
