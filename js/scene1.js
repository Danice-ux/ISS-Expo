import gsap from "https://esm.sh/gsap";
import * as THREE from "https://esm.sh/three";

// --- GSAP TEXT BOX ANIMATIONS ---
gsap.from("#dialogue-box-container", {
    opacity: 0,
    y: 50,
    duration: 1.2,
    ease: "power3.out"
});


const dialogueTree = {
        scene1: {
        start: { speaker: "???", text: "Helloooooooo?? is this even connected-", next: "s1_02" },
        s1_02: { speaker: "Interstellar Space Saop HQ", text: "Lou? can you *bzzzt* hear- *bzzzt* me-", next: "s1_03" },
        s1_03: { speaker: "Lou", text: "Hold on dude youre cutting out too much-", next: "s1_04" },
        s1_04: { speaker: "Ship", text: "*CLANK-CHUGUMPH!* *Ssssssss...*", next: "s1_05" },
        s1_05: { speaker: "Lou", text: "Well that doesn't sound good...", next: "s1_06" },
        s1_06: { speaker: "System", text: "WARNING! WARNING! SPACESHIP HIT SOMETHING, FALLING TO NEAREST PLANNET.", next: "s1_07" },
        s1_07: { speaker: "Lou", text: "We're gonna crash land on Planet X!", next: "EVENT_LOAD_SCENE2" }
    },

    scene2: {
        start: { speaker: "System", text: "Impact complete. Damage on ship: minimal.", next: "s2_02" },
        s2_02: { speaker: "Lou", text: "*Coughs* Ugh... that was a rough landing. I mean at least the ship is still useable..", next: "s2_03" },
        s2_03: { speaker: "Lou", text: "I guess i should look around the plannet to check for supplies", next: "EVENT_LOAD_SCENE3" },

    },

    scene3: {
        start: { speaker: "Lou", text: "Wait a second..", next: "s3_01" },
        s3_01: { speaker: "Lou", text: "That looks like the soap fuel we used back at HQ!", next: "s3_02" },
        s3_02: { speaker: "Lou", text: "Let me swipe it so i can refuel-", next: "s3_03" },
        s3_03: { speaker: "???", text: "Looks like we have a little rat trying to steal?", next: "s3_04" },
        s3_04: { speaker: "Lou", text: "WAHHH DONT ATTACK ME", next: "s3_05" },
        s3_05: { speaker: "Cereus", text: "This piece of soap belongs to me.", next: "EVENT_LOAD_BOSS1" },
    },

    scene4: {
        start: { speaker: "Lou", text: "Okay, I survived that... but its not enough fuel to get me back to HQ..", next: "s4_02" },
        s4_02: { speaker: "Ship", text: "Detecting raw hyper-matter signatures on a neighboring celestial coordinate.", next: "s4_03" },
        s4_03: { speaker: "Lou", text: "Perfect. Let's patch the secondary boosters up and trace it over.", next: "EVENT_LOAD_SCENE5" }
    },

    scene5: {
        start: { speaker: "System", text: "Entering orbit of the green planet... (T_T)", next: "s5_02" },
        s5_02: { speaker: "Lou", text: "Wow, this place looks way different. Let's set down and look around.", next: "EVENT_LOAD_SCENE6" }
    },

    scene6: {
        start: { speaker: "Sketchy dude", text: "PSSSSSSSTTTTTTTTT......", next: "s6_02" },
        s6_02: { speaker: "Lou", text: "What the helly?", next: "s6_03" },
        s6_03: { speaker: "Sketchy dude", text: "I have goods that i think would.. interest you.. heh..", next: "s6_04" },
        s6_04: { speaker: "Lou", text: "Listen man i'm not interested in buying...", next: "s6_05" },
        s6_05: { speaker: "Sketchy dude", text: "Trust me.. you want this... YOU WANT BOOTES", next: "s6_06" },
        s6_06: { speaker: "Lou", text: "Alright man you need to calm down.", next: "s6_07" },
        s6_07: { speaker: "???", text: "Lou swiftly runs away from the sketchy dude...", next: "s6_03" },
    },

    scene7: {
        start: { speaker: "Yano", text: "Who dares enter my arena.", next: "s7_02" },
        s7_02: { speaker: "Lou", text: "I don't want any trouble i swear, I'm in need of some soap to fuel my ship to get home!", next: "s7_03" },
        s7_03: { speaker: "Yano", text: "Well too bad travellar, you are not leaving here alive.", next: "EVENT_LOAD_SCENE8" }
    },

    scene8: {
        start: { speaker: "Lou", text: "...", next: "s8_02" },
        s8_02: { speaker: "Lou", text: ".....", next: "s8_03" },
        s8_03: { speaker: "Lou", text: "You weren't supposed to get here.", next: "s8_04" },
        s8_04: { speaker: "Lou", text: "I wonder how you're being got it this far..", next: "s8_05" },
        s8_05: { speaker: "Lou", text: "Well i guess it doesn't matter anyways..", next: "s8_06" },
        s8_06: { speaker: "Lou", text: "I can take care of this.", next: "EVENT_LOAD_JUSTLOU" },
    }
};

let currentNodeKey = "start";
let isTransitioningToPlanet = false;

const dialogueBox = document.getElementById("dialogue-box-container");
const speakerBox = document.getElementById("speaker-badge");
const textBox = document.getElementById("dialogue-text");
const advanceHint = document.getElementById("advance-hint");
const loadingScreen = document.getElementById("loading-screen");
const loadingProgress = document.getElementById("loading-progress");

function renderNode(nodeKey) {
    if (nodeKey === "end" || !dialogueTree[nodeKey]) {
        dialogueBox.classList.add("fade-out");
        isTransitioningToPlanet = true;
        
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.classList.remove("hidden");
                void loadingScreen.offsetWidth;
                loadingScreen.classList.add("visible");
                startLoadingSimulation();
            }
        }, 1200);
        return;
    }

    currentNodeKey = nodeKey;
    const node = dialogueTree[nodeKey];

    speakerBox.innerText = node.speaker;
    textBox.innerText = node.text;
}

function startLoadingSimulation() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 8 + 2;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                console.log("Loading Finished! Route to crash map.");
            }, 500);
        }
        if (loadingProgress) {
            loadingProgress.style.width = `${progress}%`;
        }
    }, 150);
}

export function handleExternalControllerInput(buttonValue) {
    if (isTransitioningToPlanet) return;

    const node = dialogueTree[currentNodeKey];
    if (node && buttonValue === "B") {
        if (node.next) {
            renderNode(node.next);
        }
    }
}


const container = document.getElementById('stage-3d-viewport');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5.5);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const planetGroup = new THREE.Group();
planetGroup.position.set(1.5, -0.6, 0);
scene.add(planetGroup);

const planetGeo = new THREE.SphereGeometry(0.85, 64, 64);
const planetMat = new THREE.ShaderMaterial({
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        float noise(in vec2 p) {
            return sin(p.x * 3.0 + sin(p.y * 4.0)) * cos(p.y * 3.0);
        }

        void main() {
            vec2 uv = vUv;
            float bandPattern = sin(uv.y * 30.0 + noise(uv * 6.0) * 0.6) * 0.5 + 0.5;
            float fineLines = sin(uv.y * 140.0) * 0.12;
            float combinedNoise = clamp(bandPattern + fineLines, 0.0, 1.0);

            vec3 darkIndigo  = vec3(0.05, 0.02, 0.12);
            vec3 deepPlum    = vec3(0.18, 0.08, 0.32);
            vec3 steelViolet = vec3(0.38, 0.24, 0.56);
            
            vec3 baseColor = mix(darkIndigo, mix(deepPlum, steelViolet, combinedNoise), sin(uv.y * 3.14));
            vec3 normal = normalize(vNormal);
            vec3 lightDir = normalize(vec3(-4.0, 2.5, 3.5));
            float diff = max(dot(normal, lightDir), 0.0);

            vec3 ambient = vec3(0.03, 0.02, 0.06);
            vec3 diffuse = baseColor * diff * 1.5;
            
            vec3 viewDir = normalize(vViewPosition);
            float rim = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.5);
            vec3 rimColor = vec3(0.35, 0.22, 0.6) * rim * 0.4;

            gl_FragColor = vec4(ambient + diffuse + rimColor, 1.0);
        }
    `
});

const planetMesh = new THREE.Mesh(planetGeo, planetMat);
planetGroup.add(planetMesh);

function generateRingTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 1;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 1024, 0);
    grad.addColorStop(0.0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.1, 'rgba(74, 45, 110, 0.08)');
    grad.addColorStop(0.3, 'rgba(125, 93, 166, 0.35)');
    grad.addColorStop(0.4, 'rgba(20, 10, 31, 0.6)'); 
    grad.addColorStop(0.45, 'rgba(0,0,0,0)');
    grad.addColorStop(0.55, 'rgba(146, 114, 189, 0.45)');
    grad.addColorStop(0.75, 'rgba(74, 45, 110, 0.15)');
    grad.addColorStop(1.0, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1);
    return new THREE.CanvasTexture(canvas);
}



const ringGeo = new THREE.RingGeometry(1.2, 2.4, 128);
const pos = ringGeo.attributes.position;
const v3 = new THREE.Vector3();
for (let i = 0; i < pos.count; i++){
    v3.fromBufferAttribute(pos, i);
    ringGeo.attributes.uv.setXY(i, v3.length() < 1.8 ? 0 : 1, 1);
}

const ringMat = new THREE.MeshBasicMaterial({
    map: generateRingTexture(),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
});
const ringMesh = new THREE.Mesh(ringGeo, ringMat);
ringMesh.rotation.x = Math.PI * 0.38;
ringMesh.rotation.y = Math.PI * 0.06;
planetGroup.add(ringMesh);


const spaceCanvas = document.createElement('canvas');
spaceCanvas.style.position = 'absolute';
spaceCanvas.style.top = '0'; spaceCanvas.style.left = '0';
spaceCanvas.style.width = '100%'; spaceCanvas.style.height = '100%';
spaceCanvas.style.zIndex = '1'; spaceCanvas.style.pointerEvents = 'none';
document.body.appendChild(spaceCanvas);
const ctxSpace = spaceCanvas.getContext('2d');
let particles = [];

class SpaceParticle {
    constructor() { this.reset(); this.y = Math.random() * spaceCanvas.height; }
    reset() {
        this.x = Math.random() * spaceCanvas.width;
        this.y = spaceCanvas.height + 10;
        this.size = Math.random() * 1.8 + 0.5;
        this.speedY = -(Math.random() * 0.25 + 0.05);
        this.speedX = (Math.random() - 0.5) * 0.1;
        this.alpha = Math.random() * 0.4 + 0.2;
        this.color = ['#A2D2FF', '#BDE0FE', '#FFC8DD', '#FFFFFF'][Math.floor(Math.random() * 4)];
    }
    update() {
        this.y += this.speedY; this.x += this.speedX;
        if (this.y < -10) this.reset();
    }
    draw() {
        ctxSpace.globalAlpha = this.alpha; ctxSpace.fillStyle = this.color;
        ctxSpace.beginPath(); ctxSpace.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctxSpace.fill();
    }
}

function initParticles() {
    spaceCanvas.width = window.innerWidth; spaceCanvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < 40; i++) particles.push(new SpaceParticle());
}


function animate() {
    requestAnimationFrame(animate);
    
    planetMesh.rotation.y += 0.0025; 
    ringMesh.rotation.z -= 0.0004; 
    
    if (isTransitioningToPlanet) {
        camera.position.z -= 0.04;
        planetGroup.position.x -= 0.01;
    }
    
    renderer.render(scene, camera);

    ctxSpace.clearRect(0, 0, spaceCanvas.width, spaceCanvas.height);
    for (let p of particles) { p.update(); p.draw(); }
}

window.addEventListener("keydown", (e) => {
    const key = e.key.toUpperCase();
    if (["A", "B", "X", "Y"].includes(key)) {
        handleExternalControllerInput(key);
    }
});

window.addEventListener('resize', () => {
    spaceCanvas.width = window.innerWidth; spaceCanvas.height = window.innerHeight;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

initParticles();
renderNode("start");
animate();