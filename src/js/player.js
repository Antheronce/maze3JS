import * as THREE from "three";
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';


export class Player {
  constructor(deps) { // dependency injection in case I need lot more stuff

    this.isGamePaused = false;
    this.isRunning = false;
    this.runningSpeed = 0.4; // quick speed for testing atm, might add actual running with acceleration decceleration later
    this.walkingSpeed = 0.1;
    this.moveSpeed = this.walkingSpeed;

    this.keys = {}; // stores zqsd keys for movement and other further action keys
    this.controls = new PointerLockControls(deps.camera, deps.renderer.domElement); 
    this.physics = deps.physics;
    
    this.body = this.physics.createPlayerPhysics(); // creates the player collider

    // setup event listeners
    this.controls.addEventListener('lock', () => { // called when mouse is captured
      this.isGamePaused = false;
      document.getElementById('overlay-paused').classList.remove('visible');
    });

    this.controls.addEventListener('unlock', () => { // called when mouse is released
      this.isGamePaused = true;
      document.getElementById('overlay-paused').classList.add('visible');
    });

    document.addEventListener('keydown', (e) => { // for pause menu and running 
      const key = e.key.toLowerCase();
      this.keys[key] = true;

      if (key == 'Escape' && this.controls.isLocked) {
        this.controls.unlock();
      }

      if (key == 'shift') { 
        this.moveSpeed = this.runningSpeed;
        this.isRunning = true;
      }
    });

    document.addEventListener('keyup', (e) => { // to reinstate normal speed and stop movement 
      const key = e.key.toLowerCase();
      this.keys[key] = false;

      if (key == 'shift') { 
        this.moveSpeed = this.walkingSpeed;
        this.isRunning = false;
      }
    });

    document.addEventListener('click', () => { 
      if (!this.controls.isLocked) {
        this.controls.lock();
      }
    });

  }


  // setup player func

  updateMovement(deltaTime) { 
    const direction = new THREE.Vector3();
    if (!this.isGamePaused) {


      if (this.keys.z) direction.z -= 1;
      if (this.keys.s) direction.z += 1;
      if (this.keys.q) direction.x -= 1;
      if (this.keys.d) direction.x += 1;
    
    
    direction.normalize();


    const euler = new THREE.Euler(0,this.controls.getObject().rotation.y,0,'YXZ');
    direction.applyEuler(euler);
    direction.multiplyScalar(this.moveSpeed);

    const pos = this.body.translation();
    const next = {
      x: pos.x + direction.x,
      y: pos.y,
      z: pos.z + direction.z
    };

    this.body.setLinvel( direction.x / deltaTime, 0, direction.z / deltaTime, true);

    this.controls.getObject().position.set(next.x, next.y, next.z);
   }

  }


  

  
}