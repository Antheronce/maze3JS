import * as THREE from "three";
import { createRenderer } from "./renderer.js";
import { World } from './world.js';
import { Player } from './player.js';
import { Physics } from './physics.js';
import { deltaTime } from "three/src/nodes/TSL.js";


async function init() {
    // Loading these before starting everything else, making it quicker + a loading screen instead of the boring black screen
    const [renderer] = await Promise.all([
        createRenderer()
    ]);

    
    const camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 1000); // need to fix resizing before putting it in separate file
    document.body.appendChild(renderer.domElement);

    // camera options 
    const spec = 10; // overhead view to look at the maze clearly
    const adventure = 1.8; // normal view
    camera.position.y = adventure;


    // window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });


    // init physics, world gen, player
    const physics = new Physics();
    const world = new World({height:10,width:10, physics}); // width  height and physics var containing physics world etc
    const player = new Player({camera, renderer, physics}); // arguments sent through a dependency variable just in case I need more stuff and its annoying

    // animation loop 
    function animate() {
    

        requestAnimationFrame(animate);
        physics.update();
        player.updateMovement(deltaTime); // trying to use deltatime for collision check
        renderer.render(world.scene, camera);
    }

    animate();
}

init();