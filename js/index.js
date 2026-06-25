import gsap from "https://esm.sh/gsap";
import * as THREE from "https://esm.sh/three";

// --- YOUR GSAP TITLE ANIMATIONS ---
gsap.from(".titlee", { 
  opacity: 0, 
  y: 20,
  duration: 1.5,
  stagger: 0.1, 
  ease: "power2.out"
});

gsap.to(".titlee", {
  y: -15,
  rotation: 0.01,
  force3D: true,
  duration: 2.5,
  stagger: 0.15, 
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"    
});


// --- THREE.JS CINEMATIC DEEP PURPLE SPINNING PLANET ENGINE ---
const container = document.getElementById('planet-3d-container');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5.5);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Root layout group to lower and tuck the planet cleanly on the bottom right
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
            // Static UV coordinates because the mesh itself will now physically rotate
            vec2 uv = vUv;
            
            float bandPattern = sin(uv.y * 30.0 + noise(uv * 6.0) * 0.6) * 0.5 + 0.5;
            float fineLines = sin(uv.y * 140.0) * 0.12;
            float combinedNoise = clamp(bandPattern + fineLines, 0.0, 1.0);

            // FIX: Rebalanced to deep, muted, moody space tones instead of bright neon
            vec3 darkIndigo  = vec3(0.05, 0.02, 0.12); // Midnight shadow purple
            vec3 deepPlum    = vec3(0.18, 0.08, 0.32); // Muted matte purple
            vec3 steelViolet = vec3(0.38, 0.24, 0.56); // Soft desaturated lavender bands
            
            vec3 baseColor = mix(darkIndigo, mix(deepPlum, steelViolet, combinedNoise), sin(uv.y * 3.14));

            vec3 normal = normalize(vNormal);
            vec3 lightDir = normalize(vec3(-4.0, 2.5, 3.5));
            float diff = max(dot(normal, lightDir), 0.0);

            // Subtle dark-side ambient tone
            vec3 ambient = vec3(0.03, 0.02, 0.06);
            vec3 diffuse = baseColor * diff * 1.5;
            
            // Soft atmospheric outer edge glow matching the dark palette
            vec3 viewDir = normalize(vViewPosition);
            float rim = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.5);
            vec3 rimColor = vec3(0.35, 0.22, 0.6) * rim * 0.4;

            gl_FragColor = vec4(ambient + diffuse + rimColor, 1.0);
        }
    `
});

const planetMesh = new THREE.Mesh(planetGeo, planetMat);
planetGroup.add(planetMesh);

// Generated subtle ring textures with a desaturated profile
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


// --- BACKGROUND 2D COSMIC PARTICLES ---
const spaceCanvas = document.getElementById('space-canvas');
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

// Global loop execution function
function animate() {
    requestAnimationFrame(animate);
    
    // FIX: Physically spin the mesh directly over time for flawless native hardware animation
    planetMesh.rotation.y += 0.0025; 
    ringMesh.rotation.z -= 0.0004; 
    
    renderer.render(scene, camera);

    ctxSpace.clearRect(0, 0, spaceCanvas.width, spaceCanvas.height);
    for (let p of particles) { p.update(); p.draw(); }
}

window.addEventListener('resize', () => {
    spaceCanvas.width = window.innerWidth; spaceCanvas.height = window.innerHeight;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

initParticles();
animate();