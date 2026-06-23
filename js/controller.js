const socket = io('https://serveriss.onrender.com/');
let pressedDirect = [];

document.addEventListener('pointerdown', () => {
    document.documentElement.requestFullscreen();
}, { once: true });

const direct = {
    right: "right",    
    left: "left",
    up: "up",
    down: "down"

}
const keys = {
    'ArrowLeft': direct.left,
    'ArrowRight': direct.right,
    'ArrowUp': direct.up,
    'ArrowDown': direct.down
}

const wasd = {
   'KeyA': direct.left,
   'KeyD': direct.right,
   'KeyW':direct.up,
   'KeyS':direct.down
}

//button read
document.querySelectorAll('button').forEach(button => {

const down = () => {
            const dir = button.value;

   if (dir && pressedDirect.indexOf(dir) === -1) {
      pressedDirect.unshift(dir)
            socket.emit('directData', pressedDirect);
   }
}

const up = () => {
        const dir = button.value;
        const index = pressedDirect.indexOf(dir);

        if (index > -1) {
      pressedDirect.splice(index, 1)
            socket.emit('directData', pressedDirect);
        }
}

    button.addEventListener('pointerdown', down);
    button.addEventListener('pointerup', up);
    button.addEventListener('pointercancel', up);
    button.addEventListener('pointerleave', up);

});

//direction keys voor keyboard
document.addEventListener("keydown", (e) => {
   const dir = keys[e.code];
   if (dir && pressedDirect.indexOf(dir) === -1) {
      pressedDirect.unshift(dir)
          socket.emit('directData', pressedDirect);
   }
})

document.addEventListener("keyup", (e) => {
   const dir = keys[e.code];
   const index = pressedDirect.indexOf(dir);
   if (index > -1) {
      pressedDirect.splice(index, 1)
          socket.emit('directData', pressedDirect);
   }
});

document.addEventListener("keydown", (e) => {
   const dir = wasd[e.code];
   if (dir && pressedDirect.indexOf(dir) === -1) {
      pressedDirect.unshift(dir)
            socket.emit('directData', pressedDirect);
   }
})

document.addEventListener("keyup", (e) => {
   const dir = wasd[e.code];
   const index = pressedDirect.indexOf(dir);
   if (index > -1) {
      pressedDirect.splice(index, 1)
            socket.emit('directData', pressedDirect);
   }
});

var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {

                let result = JSON.parse(this.responseText) ;
                console.log(result[1].message)
                document.addEventListener("keydown", (e) => {
   if( e.code == "KeyB"){
      let message = result[1].message;
      socket.emit('message', message)
   }
})
            }
        };
        xmlhttp.open("GET", "js/messages.json", true);
        xmlhttp.send();



