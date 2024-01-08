import { RectAreaLight } from 'three'
import Experience from './Experience.js'

export default class Lights
{
    constructor()
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this._createLight()
    }

   _createLight(){
    this.lights = {}

    // // Ambient light
    // this.lights.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    // this.scene.add(this.lights.ambientLight);

    // // Directional light
    // this.lights.directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    // this.lights.directionalLight.position.set(0, 1, 0);
    // this.scene.add(this.lights.directionalLight);

    // RectAreaLight
    this.lights.rectAreaLight = new RectAreaLight(0xffffff, 10, 5, 10);
    this.lights.rectAreaLight.position.set(0, 2, 0);
    this.lights.rectAreaLight.lookAt(0, 2, 0);
    this.scene.add(this.lights.rectAreaLight);
    }
 

    resize()
    {
    }

    update()
    {
    }

    destroy()
    {
    }
}