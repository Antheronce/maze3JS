import * as THREE from "three";
import { gsap } from "gsap/gsap-core";
import { Sky } from "three/examples/jsm/objects/Sky.js";


export class SkySystem{
    constructor(scene){
        this.scene = scene;   

        this.createLight(); // true / false arg for helper
        this.createSky(); 
    }

    createLight(lightHelper = false){
        this.ambientLight = new THREE.AmbientLight(0x4040a0, 0.2);
        this.scene.add(this.ambientLight);
    
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.set(4096, 4096);
        this.directionalLight.shadow.normalBias = 0.05;
        this.directionalLight.shadow.camera.near = 0.5;
        this.directionalLight.shadow.camera.far = 500;
        this.directionalLight.shadow.camera.left = -100;
        this.directionalLight.shadow.camera.right = 100;
        this.directionalLight.shadow.camera.top = 100;
        this.directionalLight.shadow.camera.bottom = -100;
        this.scene.add(this.directionalLight);

        this.hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.2);
        this.scene.add(this.hemisphereLight);


        if (lightHelper){
        const helper = new THREE.CameraHelper(this.directionalLight.shadow.camera);
        this.scene.add(helper);
        }
      }

    createSky(){
        this.sky = new Sky();
        this.sky.scale.setScalar(45000);
        this.scene.add(this.sky);
 
        // daytime style sky
        const skyUniforms = this.sky.material.uniforms; // doesn't really look good, Idk 
        skyUniforms['turbidity'].value = 5;       
        skyUniforms['rayleigh'].value = 1;       
        skyUniforms['mieCoefficient'].value = 0.005;
        skyUniforms['mieDirectionalG'].value = 0.8;

        // sun position and lightning direction
        const sun = new THREE.Vector3();
        const theta = THREE.MathUtils.degToRad(90 - 30);  // altitude
        const phi = THREE.MathUtils.degToRad(180);        // azimuth

        sun.setFromSphericalCoords(1, theta, phi);
        skyUniforms['sunPosition'].value.copy(sun);

        this.directionalLight.position.copy(sun.clone().multiplyScalar(100));
        this.sun = sun;
    }   


}