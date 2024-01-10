import { MathUtils } from 'three'
import Experience from './Experience.js'

export default class ScrollEvent
{
    constructor()
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        this.target = 0
        this.current = 0
        this.speed = 0.05
        this.factor = 0.005
        this.velocity = 0

        this.scrollEvent()
        
        // debug
        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder('ScrollEvent')
            this.debugFolder.close()

            // change this.modes.debug.instance position and rotation
            this.debugFolder.add(this, 'factor').step(0.001).min(0).max(0.01).name('Scroll Factor')
        }
    }

    scrollEvent()
    {
        window.addEventListener('mousewheel', (e) =>
        {
            this.target += e.deltaY * this.factor;
        })
    }
 

    resize()
    {
    }

    update()
    {
        this.velocity = this.current - this.target;
        this.current = MathUtils.lerp(this.current, this.target, this.speed);
    }

    destroy()
    {
    }
}