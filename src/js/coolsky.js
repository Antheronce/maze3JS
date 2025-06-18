import * as THREE from "three";
import { gsap } from "gsap/gsap-core";
import { Sky } from "three/examples/jsm/objects/Sky.js";


export class SkySystem{
    constructor(scene){
        this.scene = scene;   
        this.skyPalette = {
            sunset: { color: 0xFF7F50, lightIntensity: 0.8, lightPosition: new THREE.Vector3(0, 1, 0) },
            bloodmoon: { color: 0x8B0000, lightIntensity: 0.5, lightPosition: new THREE.Vector3(0, -0.5, 0) },
            eldenGold: { color: 0xF0E68C, lightIntensity: 1.2, lightPosition: new THREE.Vector3(0.5, 0.8, -0.3) },
            abyssal: { color: 0x191970, lightIntensity: 0.3, lightPosition: new THREE.Vector3(0, 0.2, -1)}
        };

       

        this.createSky(this.skyPalette.sunset); // takes chosen palette var and init sky
        this.createLight(true); // true / false arg for helper
    }


    createSky(Palette){
        this.sky = new Sky();
        this.sky.scale.setScalar(45000);
    

      // idk will do later, deleted previous stuff


        this.scene.add(this.sky);
        // rest of the code where I use the data from skyPalette (sunset currently) and do the animations
    }   

    createLight(lightHelper = false ){
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(this.ambientLight);
    
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        this.directionalLight.position.set(0,1,0);
        this.scene.add(this.directionalLight);
    
        if (lightHelper){
        const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
        this.scene.add(helper);
        }
      }


}