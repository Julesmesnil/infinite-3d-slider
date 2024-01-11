import { Mesh, PlaneGeometry, ShaderMaterial } from 'three'
import Experience from './Experience.js'

export default class Overlay
{
    constructor()
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this._createOverlay()
    }
 
    _createOverlay(){
        this._overlayGeometry = new PlaneGeometry(2, 2, 1, 1);
        this.overlayMaterial = new ShaderMaterial({
            transparent: true,
            uniforms: {
                uAlpha: { value: 0.5 }
            },
            vertexShader: `
                void main()
                {
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uAlpha;
                void main()
                {
                    gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
                }
            `
        });
        this._overlay = new Mesh(this._overlayGeometry, this.overlayMaterial);
        this._overlay.position.set(0, 1, 0);
        this.scene.add(this._overlay);
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