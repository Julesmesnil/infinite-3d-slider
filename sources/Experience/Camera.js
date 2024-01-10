import { PerspectiveCamera } from 'three'
import Experience from './Experience.js'

export default class Camera
{
    constructor(_options)
    {
        // Options
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.targetElement = this.experience.targetElement
        this.scene = this.experience.scene

        this._mouse = this.experience.mouse
        this._mouseStrength = 0.2;

        // Set up
        this.mode = 'debug' // defaultCamera \ debugCamera

        this.setInstance()
        this.setModes()
    }

    setInstance()
    {
        // Set up
        this.instance = new PerspectiveCamera(80, this.config.width / this.config.height, 0.1, 150)
        this.instance.rotation.reorder('YXZ')

        this.scene.add(this.instance)
    }

    setModes()
    {
        this.modes = {}

        // Default
        this.modes.default = {}
        this.modes.default.instance = this.instance.clone()
        this.modes.default.instance.rotation.reorder('YXZ')
        

        // Debug
        this.modes.debug = {}
        this.modes.debug.instance = this.instance.clone()
        this.modes.debug.instance.rotation.reorder('YXZ')

        this.modes.debug.instance.position.set(0, 1.4, 0.3)

        // Debug
        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder('Camera')
            this.debugFolder.close()

            // change this.modes.debug.instance position and rotation
            this.debugFolder.add(this.modes.debug.instance.position, 'x').step(0.001).min(-10).max(10).name('Position x')
            this.debugFolder.add(this.modes.debug.instance.position, 'y').step(0.001).min(-10).max(10).name('Position y')
            this.debugFolder.add(this.modes.debug.instance.position, 'z').step(0.001).min(-10).max(10).name('Position z')
            this.debugFolder.add(this, '_mouseStrength').step(0.001).min(0).max(1).name('Mouse Strength')
        }
    }


    resize()
    {
        this.instance.aspect = this.config.width / this.config.height
        this.instance.updateProjectionMatrix()

        this.modes.default.instance.aspect = this.config.width / this.config.height
        this.modes.default.instance.updateProjectionMatrix()

        this.modes.debug.instance.aspect = this.config.width / this.config.height
        this.modes.debug.instance.updateProjectionMatrix()
    }

    update()
    {
        this._targetX = this._mouse.x * this._mouseStrength;
        this._targetY = this._mouse.y * this._mouseStrength;
        
        this.modes.debug.instance.position.x += 0.1 * (-this._targetX - this.modes.debug.instance.position.x);
        this.modes.debug.instance.rotation.y += 0.1 * (-this._targetX - this.modes.debug.instance.rotation.y);

        this.modes.debug.instance.rotation.x += 0.03 * (-this._targetY - this.modes.debug.instance.rotation.x);

        // Apply coordinates
        this.instance.position.copy(this.modes[this.mode].instance.position)
        this.instance.quaternion.copy(this.modes[this.mode].instance.quaternion)
        this.instance.updateMatrixWorld() // To be used in projection
    }

    destroy()
    {
        this.modes.debug.orbitControls.destroy()
    }
}
