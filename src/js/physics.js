import * as RAPIER from '@dimforge/rapier3d';

export class Physics{
    constructor(){
    this.world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
    this.bodies = []; // to keep track of every physics bodies

    }


    createWorldPhysics(x,y,z,sx,sy,sz){ // position and size
        const bodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(x,y,z);
        const body = this.world.createRigidBody(bodyDesc);
        const colliderDesc = RAPIER.ColliderDesc.cuboid(sx/2, sy/2, sz/2);

        this.world.createCollider(colliderDesc,body);
        this.bodies.push(body); // adds newly created body to bodies array
    }

    createPlayerPhysics(x = 0,y = 1.8 ,z = 0, radius = 0.4, height = 1.8){ // to creates capsule-shaped collider for player
        const bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x,y,z);
        const body = this.world.createRigidBody(bodyDesc);
        const colliderDesc = RAPIER.ColliderDesc.capsule(height/2 - radius, radius).setTranslation(0,height/2,0);
    
        this.world.createCollider(colliderDesc,body);
        return body;
    }


    update(deltaTime){
        this.world.step();
    }
}


