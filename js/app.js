const socket = io('https://serveriss.onrender.com/');

const lou = document.querySelector(".character");
const map = document.querySelector("#border");
let dia = document.getElementById("dialog");
const direct = {
    right: "right",    
    left: "left",
    up: "up",
    down: "down"

}

let gameState = {
    level: 1,
    inBattle: false,
    bossesDefeated: 0
};

let BATTLE_ZONE = {
    x: 364,
    y: 87,
    radius: 10
};

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

if (x == 350){
    
}


const leftLimit = 7;
const rightLimit = 815;
const topLimit = 7;
const bottomLimit = 182;
if (x < leftLimit) { x = leftLimit; }
if (x > rightLimit) { x = rightLimit; }
if (y < topLimit) { y = topLimit; }
if (y > bottomLimit) { y = bottomLimit; }

const CAMERA_LEFT_OFFSET_PX = 140;
const CAMERA_TOP_OFFSET_PX = 120;


console.log('x:'+ x); 
console.log ("y:"+ y);
//213 513
const camera_transform_left = -x*pixelSize+(pixelSize * CAMERA_LEFT_OFFSET_PX);
const camera_transform_top = -y*pixelSize+(pixelSize * CAMERA_TOP_OFFSET_PX);
map.style.transform = `translate3d( ${camera_transform_left}px, ${camera_transform_top}px, 0 )`;
lou.style.transform = `translate3d( ${x*pixelSize}px, ${y*pixelSize}px, 0 )`;

checkBattleTrigger();
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

//battle
function checkBattleTrigger() {
    if (gameState.inBattle) return;

    const dx = x - BATTLE_ZONE.x;
    const dy = y - BATTLE_ZONE.y;

    const dist = Math.sqrt(dx * dx + dy * dy);


    if (dist < BATTLE_ZONE.radius) {
        startBattle();
    }
}

function unlockLevel(level) {
    console.log("Unlocking level:", level);

    if (level === 2) {
        level2();
    }  
    else {
        console.log("No more levels to unlock");
    }
}

function resetBattle() {
    console.log("Before reset:", window.enemy.hp, window.enemy.maxHp);

    if (gameState.level === 2) {
        window.enemy.hp = 3000;
        window.enemy.maxHp = 3000;
    } else {
        window.enemy.hp = 1000;
        window.enemy.maxHp = 1000;
    }

    console.log("After reset:", window.enemy.hp, window.enemy.maxHp);

    window.updateBattleUI();

    document.getElementById("battle").style.display = "none";
    map.style.display = "block";
}

async function startBattle() {

    gameState.inBattle = true;

    if (gameState.level === 2) {
    window.enemy.hp = 3000;
    window.enemy.maxHp = 3000;
    } else {
        window.enemy.hp = 300;
        window.enemy.maxHp = 300;
    }

window.resetBattleState();

    window.resetBattleState()


    const battle = document.getElementById("battle");
    battle.style.display = "block";
    map.style.display = "none";

    await window.cardsReady;

    console.log("sending cards:", window.hand);

    socket.emit("battleStart", window.hand);



    if (!gameState.boss1IntroShown) {
        gameState.boss1IntroShown = true;

        document.getElementById('dialog').innerHTML =
            "oh no! this weird alien(?) wants to fight with you for all your soap!";

        const dialog = document.getElementById('dialog');
        dialog.style.display = "block";

        setTimeout(() => {
            dialog.style.display = "none";
        }, 8000);
    }
}

function endBattle(win) {
    console.log("endBattle called", win);

    gameState.inBattle = false;
    resetBattle();
    document.getElementById("battle").style.display = "none";
    map.style.display = "block";

    console.log("map display:", map.style.display);

    if (win) {
        gameState.bossesDefeated++;
        unlockLevel(gameState.bossesDefeated + 1);
    }

}
    window.endBattle = endBattle;

//Level 2
function level2() {
    gameState.level = 2;
    x = 100;
    y = 200;
    document.getElementById("border").style.backgroundImage = "url('../media/grass.png')";
            map.style.display = "block"
            document.getElementById('dirt').style.display = "none"
            document.getElementById('market').style.display = "none"
    BATTLE_ZONE = {
    x: 7,
    y: 180,
    radius: 20
    };

    


window.enemy.hp = 3000;
window.enemy.maxHp = 3000;
window.updateBattleUI();


if (x >500 && x < 600){
    unlockBootes();
}

}
window.onload = function() {
    dia.innerHTML = "Damn. i crashed my ship and i've run out of my soap fuel! <br> i really need to get over to planet Ogobolo.. <br> hey is that some dirt on this clean planet?"

            dia.style.display = "block";

            setTimeout(() => {
                dia.style.display = "none";
            }, 10000);
};


   socket.on('message', message => {
     if (x == 7 || x == 815 || y == 7 || y == 497){ 
      alert(message);
     }
   })

//    socket.on("cardPlayed", (cardFunction) => {

//     if (!gameState.inBattle) return;

//     const index = window.hand.findIndex(
//         card => card.function === cardFunction
//     );

//     if (index !== -1) {
//         window.playCard(index);
//     }
// });
   