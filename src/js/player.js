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
  updateMovement() { 
    if (!this.isGamePaused) {
      if (this.keys.z) this.controls.moveForward(this.moveSpeed);
      if (this.keys.s) this.controls.moveForward(-this.moveSpeed);
      if (this.keys.q) this.controls.moveRight(-this.moveSpeed);
      if (this.keys.d) this.controls.moveRight(this.moveSpeed);
    }
  }

  
}