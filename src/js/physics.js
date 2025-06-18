import * as RAPIER from '@dimforge/rapier3d';
import { deltaTime } from 'three/tsl';

export class Physics{
    constructor(){
    this.world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
    this.bodies = []; // to keep track of every physics bodies

    }


    createBody(desc, colliderDesc){ // idk how to use this lib bruuh
    }

    update(deltaTime){
        this.world.step(deltaTime);
    }


}


