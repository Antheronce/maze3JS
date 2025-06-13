import * as THREE from "three";
import { Player } from './player.js';
import { World } from './world.js';


const camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// camera options 
const spec = 10;
const adventure = 1.8;
camera.position.y = adventure;

// window resize 
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// init world gen and player
const world = new World();
const player = new Player(camera, renderer);

// animation loop
function animate() {
  requestAnimationFrame(animate);
  player.updateMovement();
  renderer.render(world.scene, camera);
}

animate();