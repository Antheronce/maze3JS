let physicWorld;

export async function initPhysics() { // loads the physic world
    const RAPIER = await import('@dimforge/rapier3d');
    physicWorld = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
    return physicWorld;
}
