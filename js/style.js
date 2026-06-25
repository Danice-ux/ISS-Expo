const dialogDiv = document.getElementById('dialog');
const message = "* *Coughs* Ugh... that was a rough landing. I mean at least the ship is still useable..I guess i should look around the plannet to check for supplies";
let index = 0;

function typeWriter() {
  if (index === 0) dialogDiv.innerHTML = "";
  
  if (index < message.length) {
    dialogDiv.innerHTML += message.charAt(index);
    index++;
    setTimeout(typeWriter, 40);
  }
}

window.addEventListener('DOMContentLoaded', typeWriter);