const socket = io('https://serveriss.onrender.com/');

const lou = document.querySelector(".character");
const map = document.querySelector(".map");
const direct = {
    right: "right",    
    left: "left",
    up: "up",
    down: "down"

}


socket.on('directData', (data) => {
     pressedDirect = data;
});

const speed = 1;
//lou starts here
let x = 140; 
let y = 160;
let camera_x = x;
let camera_y = y;
let pressedDirect= [] 
let vY = 0;       
// const gravity = 0.5; 
const placeLou = () => {
    const pixelSize = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--pixel-size'));



const direction = pressedDirect[0];
if (direction) {
   if (direction === direct.right) {x += speed;}
   if (direction === direct.left) {x -= speed;}
   if (direction === direct.up) {y -= speed;}
   if (direction === direct.down) {y += speed;}
   //jump 
    // if (vY === 0 && (direction === direct.right || direction === direct.left)) {
    //     lou.setAttribute("facing", direction);
    // }
    lou.setAttribute("facing", pressedDirect);

}

lou.setAttribute("walking", direction ? "true" : "false");


// const louRect = {
//     left: x,
//     right: x + 16
//    //  bottom: y + 32 
// };


// if (y >= 151) { 
//     y = 151; 
//     vY = 0; 
// }


const leftLimit = -10;
const rightLimit = 300;
const topLimit = -10;
const bottomLimit = 260;
if (x < leftLimit) { x = leftLimit; }
if (x > rightLimit) { x = rightLimit; }
if (y < topLimit) { y = topLimit; }
if (y > bottomLimit) { y = bottomLimit; }

const CAMERA_LEFT_OFFSET_PX = 1;
const CAMERA_TOP_OFFSET_PX = 15;


// console.log('x:'+ x); 
// console.log ("y:"+ y);
//213 513
const camera_transform_left = -x*pixelSize+(pixelSize * CAMERA_LEFT_OFFSET_PX);
const camera_transform_top = 0;
// map.style.transform = `translate3d( ${camera_transform_left}px, ${camera_transform_top}px, 0 )`;
lou.style.transform = `translate3d( ${x*pixelSize}px, ${y*pixelSize}px, 0 )`;
}
//Set up the game loop
let previousMs;
const stepTime = 1 / 60;
const tick = (timestampMs) => {
   if (previousMs === undefined) {
      previousMs = timestampMs;
   }
   let delta = (timestampMs - previousMs) / 1000;
   while (delta >= stepTime) {
      placeLou();
      delta -= stepTime;
   }
   previousMs = timestampMs - delta * 1000;


   requestAnimationFrame(tick);
}
requestAnimationFrame(tick); 


/* Direction key state */
// document.addEventListener("keydown", (e) => {
//    const dir = keys[e.code];
//    if (dir && pressedDirect.indexOf(dir) === -1) {
//       pressedDirect.unshift(dir)
//    }
// })

// document.addEventListener("keyup", (e) => {
//    const dir = keys[e.code];
//    const index = pressedDirect.indexOf(dir);
//    if (index > -1) {
//       pressedDirect.splice(index, 1)
//    }
// });

// document.addEventListener("keydown", (e) => {
//    const dir = wasd[e.code];
//    if (dir && pressedDirect.indexOf(dir) === -1) {
//       pressedDirect.unshift(dir)
//    }
// })

// document.addEventListener("keyup", (e) => {
//    const dir = wasd[e.code];
//    const index = pressedDirect.indexOf(dir);
//    if (index > -1) {
//       pressedDirect.splice(index, 1)
//    }
// });