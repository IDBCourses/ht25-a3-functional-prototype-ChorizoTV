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
let player;
let enemies = [];
let lastKeyATime = 0;
let isGameWon = false;
let victoryAnimationProgress = 0;
let originalPos = {};
const VICTORY_ANIMATION_SPEED = 0.3;
const DOUBLE_TAP_DELAY = 300;


const ENEMY_SPAWNING_DATA = [
  { pos: new Vector(0.3, 0.6), type: "horizontal", speed: 0.4 },
  { pos: new Vector(0.5, 0.6), type: "vertical", speed: 0.4 },
  { pos: new Vector(0.7, 0.3), type: "horizontal", speed: 0.4 }
];

const COLOR_PLATE_SPAWNING_DATA = [
  { pos: new Vector(0.3, 0.9), color: PLATE_COLORS.RED },
  { pos: new Vector(0.7, 0.45), color: PLATE_COLORS.BLUE },
  { pos: new Vector(0.6, 0.15), color: PLATE_COLORS.YELLOW }
];


//----- CREATE FUNCTIONS 
function createColorPlates() {
  COLOR_PLATE_SPAWNING_DATA.forEach((plateData) => {
    colorPlates.push(new ColorPlate(plateData.pos, plateData.color));
  });
}

function createEnemyAtPos(data) {
  enemies.push(new Enemy(data.pos, data.type, data.speed));
}

//-------- KEYBOARD FUNCTIONS
/**
 * 
 * @param {KeyboardEvent} event 
 */
function onKeyDown(event) {
  if (event.code === "KeyK") player.isStopped = true;
  if (event.code === "KeyM") player.cycleDirection();

  if (event.code === "KeyA") {
    const currentTime = Date.now();
    const timeSinceLastTap = currentTime - lastKeyATime;
    if (timeSinceLastTap < DOUBLE_TAP_DELAY) {
      colorPlates.forEach(plate => {
        if (checkColorPlateCollision(plate)) {
          player.pickUpColor(plate.colorType);
        }
      });
    }
    lastKeyATime = currentTime;
  }
}

function onKeyUp(event) {
  if (event.code === "KeyK") {
    player.isStopped = false;
  }
}

//------- COLLISION CHECKERS 


function checkColorPlateCollision(plate) {
  let platePixPos = plate.convertPosToPix();

  let AXmin = platePixPos.x - plate.SIZE * 0.5;
  let AXmax = platePixPos.x + plate.SIZE * 0.5;
  let AYmin = platePixPos.y - plate.SIZE * 0.5;
  let AYmax = platePixPos.y + plate.SIZE * 0.5;

  let playerPixPos = player.convertPosToPixel();
  let BXmin = playerPixPos.x - player.SIZE * 0.5;
  let BXmax = playerPixPos.x + player.SIZE * 0.5;
  let BYmin = playerPixPos.y - player.SIZE * 0.5;
  let BYmax = playerPixPos.y + player.SIZE * 0.5;

  if (AXmin <= BXmax && AXmax >= BXmin && AYmin <= BYmax && AYmax >= BYmin) {
    return true;
  } else {
    return false;
  }
}

function checkGoalCollision(goal) {
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

  if (AXmin <= BXmax && AXmax >= BXmin && AYmin <= BYmax && AYmax >= BYmin) {
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
function checkEnemyCollision(enemy) {
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

  if (AXmin <= BXmax && AXmax >= BXmin && AYmin <= BYmax && AYmax >= BYmin) {
    return true;
  } else {
    return false;
  }

}


//------- VICTORY FUNCTIONS 


//begins victory and saves the current position (from this original position
//it lerps into a smiley face)
function startVictory() {
  isGameWon = true;
  victoryAnimationProgress = 0;

  originalPos.player = new Vector(player.pos.x, player.pos.y);
  originalPos.goal = new Vector(goal.pos.x, goal.pos.y);
  originalPos.plates = colorPlates.map(plate => new Vector(plate.pos.x, plate.pos.y));
  originalPos.enemies = enemies.map(enemy => new Vector(enemy.pos.x, enemy.pos.y));


  console.log("VICTORY!");
}

//this is the placements of all the objects into a smiley position.
function getVictoryPos() {
  return {
    player: new Vector(0.4, 0.2),
    goal: new Vector(0.6, 0.2),
    plate1: new Vector(0.7, 0.5),
    plate2: new Vector(0.3, 0.5),
    plate3: new Vector(0.5, 0.5),
    enemy1: new Vector(0.4, 0.7),
    enemy2: new Vector(0.5, 0.75),
    enemy3: new Vector(0.6, 0.7)
  };
}

//updates the victory animation each frame
function updateVictoryAnimation(deltaTime) {
  if (!isGameWon) return;

  //update the progress of the animation 
  victoryAnimationProgress += deltaTime * VICTORY_ANIMATION_SPEED;
  victoryAnimationProgress = Math.min(victoryAnimationProgress, 1); // we only want to run this once 
   //if VAP < 1 (it chooses VAP)

  //positions for the smiley face 
  const victoryPositions = getVictoryPos();
  const t = victoryAnimationProgress;

  //lerping the current positions in the game to smiley positions 
  player.pos.x = lerp(originalPos.player.x, victoryPositions.player.x, t);
  player.pos.y = lerp(originalPos.player.y, victoryPositions.player.y, t);
  player.updateHeadPos();
  player.updateBodyPos();

  goal.pos.x = lerp(originalPos.goal.x, victoryPositions.goal.x, t);
  goal.pos.y = lerp(originalPos.goal.y, victoryPositions.goal.y, t);
  goal.update();


  // loop over every color plate...
  colorPlates.forEach((plate, index) => {
    // ... and get the plate key
    const plateKey = `plate${ index + 1 }`;

    // if we have an element in the array...
    if (victoryPositions[ plateKey ]) {
      // ... lerp the plate to the smiling position
      plate.pos.x = lerp(originalPos.plates[ index ].x, victoryPositions[ plateKey ].x, t);
      plate.pos.y = lerp(originalPos.plates[ index ].y, victoryPositions[ plateKey ].y, t);
      plate.update();
    }
  });

  // loop over every enemy...
  enemies.forEach((enemy, index) => {
    // ... and get the enemy key
    const enemyKey = `enemy${ index + 1 }`;

    // if we have an element in the array...
    if (victoryPositions[ enemyKey ]) {
      // ... lerp the plate to the smiling position
      enemy.pos.x = lerp(originalPos.enemies[ index ].x, victoryPositions[ enemyKey ].x, t);
      enemy.pos.y = lerp(originalPos.enemies[ index ].y, victoryPositions[ enemyKey ].y, t);
      enemy.update();
    }
  });
}



//--------- HELPER FUNCTIONS 

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

function lerp(start, end, t) {
  return start + (end - start) * t;

}

//-------------- CORE 

function loop() {
  calculateDeltaTime();


  if (!isGameWon) {

    enemies.forEach(enemy => {
      enemy.updateMovement(deltaTime);
    });

    const previousPos = new Vector(player.pos.x, player.pos.y);
    player.update(deltaTime);

    // check if enemy collides with player
    enemies.forEach(enemy => {
      if (checkEnemyCollision(enemy)) {
        // we have a collision here !
        console.log("We have a collision! Resetting player position");
        player.resetPosition();

        player.currentDirectionIndex = 0; //0 = up in movementStates
        player.updateHeadPos(); //update the head indicator 
        let playerState = player.getRandomState();
        player.setState(playerState);

        goal.currentColor = null;
        goal.colorSequence = [];
        goal.updateVisualColor();
        console.log("goal reset to default!");
      }
    });

    if (checkGoalCollision(goal)) {
      if (goal.currentColor && goal.currentColor.h === player.getCurrentColor().h) {
        console.log("Colors match! you win");
        if (!isGameWon) {
          startVictory();
        }
      } else {
        console.log("colors don't match! try again");
        player.pos.x = previousPos.x;
        player.pos.y = previousPos.y;
      }
    }
    colorPlates.forEach((plate, index) => {
      if (checkColorPlateCollision(plate)) {
        console.log(`player is touching color plate ${ index }, ${ plate.colorType.name }`);
      }
    });


  }
  updateVictoryAnimation(deltaTime);
  window.requestAnimationFrame(loop);

}


function setup() {

  createColorPlates();

  ENEMY_SPAWNING_DATA.forEach(data => {
    createEnemyAtPos(data);
  });

  goal = new Goal(new Vector(0.3, 0.15));

  player = new Player(new Vector(0.7, 0.9), goal);
  addEventListener("keydown", onKeyDown);
  addEventListener("keyup", onKeyUp);

  lastTime = Date.now();
  window.requestAnimationFrame(loop);
}

setup(); 
