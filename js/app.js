const socket = io('https://serveriss.onrender.com/');

const lou = document.querySelector(".character");
const map = document.querySelector("#border");
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
let x = 150; 
let y = 140;
let camera_x = x;
let camera_y = y;
let pressedDirect= [] 
let vY = 0;       
const placeLou = () => {
    const pixelSize = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--pixel-size'));



const direction = pressedDirect[0];
if (direction) {
   if (direction === direct.right) {x += speed;}
   if (direction === direct.left) {x -= speed;}
   if (direction === direct.up) {y -= speed;}
   if (direction === direct.down) {y += speed;}
    lou.setAttribute("facing", pressedDirect);

}

lou.setAttribute("walking", direction ? "true" : "false");



const leftLimit = 7;
const rightLimit = 815;
const topLimit = 7;
const bottomLimit = 497;
if (x < leftLimit) { x = leftLimit; }
if (x > rightLimit) { x = rightLimit; }
if (y < topLimit) { y = topLimit; }
if (y > bottomLimit) { y = bottomLimit; }

const CAMERA_LEFT_OFFSET_PX = 140;
const CAMERA_TOP_OFFSET_PX = 120;


// console.log('x:'+ x); 
// console.log ("y:"+ y);
//213 513
const camera_transform_left = -x*pixelSize+(pixelSize * CAMERA_LEFT_OFFSET_PX);
const camera_transform_top = -y*pixelSize+(pixelSize * CAMERA_TOP_OFFSET_PX);
map.style.transform = `translate3d( ${camera_transform_left}px, ${camera_transform_top}px, 0 )`;
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

//Level 2
function level2() {
   x=100;
   y=200;
   document.getElementById("border").style.backgroundImage = "url('../media/grass.png')";
}
function level3(){
   document.getElementById("border").style.backgroundImage = "url('../media/grass.png')";
}


   socket.on('message', message => {
     if (x == 7 || x == 815 || y == 7 || y == 497){ 
      alert(message);
     }
   })
   