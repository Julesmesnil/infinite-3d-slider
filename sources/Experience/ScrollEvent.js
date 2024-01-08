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

        this.scroll = 0;
        this.scrollTarget = 0;
        this.currentScroll = 0;
        this._scrollSpeed = 0.003;
        this.velocity = 0;

        this.scrollEvent();
        
        // debug
        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder('ScrollEvent')
            this.debugFolder.close()

            // change this.modes.debug.instance position and rotation
            this.debugFolder.add(this, '_scrollSpeed').step(0.001).min(0).max(0.01).name('Scroll Factor')
        }
    }

    scrollEvent()
    {
        window.addEventListener('mousewheel', (e) =>
        {
            this.scrollTarget = e.wheelDelta * 0.3;
        })
    }
 

    resize()
    {
    }

    update()
    {
        this.scroll += (this.scrollTarget - this.scroll) * 0.1;
        this.scroll *= 0.9;
        this.scrollTarget *= 0.9;
        this.currentScroll -= this.scroll * this._scrollSpeed;
        // console.log(this.scroll, 'scroll');
        // console.log(this.currentScroll, 'currentScroll');
        // console.log(this.scrollTarget, 'scrollTarget');
        if (this.scroll < 0) {
            this.velocity = -1;
        } else if (this.scroll > 1) {
            this.velocity = 1;
        } else {
            this.velocity = 0;
        }
    }

    destroy()
    {
    }
}