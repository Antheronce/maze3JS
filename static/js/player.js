import * as THREE from "three";
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export class Player {
  constructor(camera, renderer) {

    this.isGamePaused = false;
    this.isRunning = false;
    this.runningSpeed = 0.4; // just for testing 
    this.walkingSpeed = 0.1;
    this.moveSpeed = this.walkingSpeed;

    this.keys = {}; // stores zqsd keys for movement and other further action keys
    this.controls = new PointerLockControls(camera, renderer.domElement); 
  
    
    // setup event listeners
    this.controls.addEventListener('lock', () => { // called when mouse is captured
      this.isGamePaused = false;
      document.getElementById('overlay-paused').classList.remove('visible');
    });

    this.controls.addEventListener('unlock', () => { // called when mouse is released
      this.isGamePaused = true;
      document.getElementById('overlay-paused').classList.add('visible');
    });

    document.addEventListener('keydown', (e) => { 
      const key = e.key.toLowerCase();
      this.keys[key] = true;

      if (key == 'Escape' && this.controls.isLocked) {
        this.controls.unlock();
      }

      if (key == 'shift') { // if shift is pressed, changes speed to running
        this.moveSpeed = this.runningSpeed;
        this.isRunning = true;
      }
    });

    document.addEventListener('keyup', (e) => { 
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