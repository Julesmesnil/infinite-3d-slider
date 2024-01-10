import { Clock, Mesh, MeshStandardMaterial, PlaneGeometry, RepeatWrapping } from 'three'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'
import Experience from './Experience.js'

import fragment from './shaders/floor/frag.glsl'
import vertex from './shaders/floor/vert.glsl'

export default class Floor
{
    constructor()
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.clock = new Clock();

        this._createFloor()
    }
 
    _createFloor(){
        this._geometry = new PlaneGeometry( 50, 50, 32, 32);
        // this._material = new MeshStandardMaterial({ 
        //     color: 0x000d21, 
        //     fog: true,
        //     roughness: 0.5, 
        //     metalness: 0.2, 
        //     depthTest: true, 
        //     depthWrite: true,
        //  })
        // this._mesh = new Mesh( this._geometry, this._material );
        // this._mesh.rotation.x = -Math.PI / 2;
        // this._mesh.position.y = .2;
        // this.scene.add(this._mesh)

        this._customShader = Reflector.ReflectorShader;
        this._customShader.fragmentShader = fragment;
        this._customShader.vertexShader = vertex;

        this._dudvMap = this.resources.items.water;

        this._dudvMap.wrapS = this._dudvMap.wrapT = RepeatWrapping;

        this._customShader.uniforms.tDudv = { value: this._dudvMap };
        this._customShader.uniforms.uTime = { value: 0.0 };
        this._customShader.uniforms.fogColor = { value: this.scene.fog.color },
        this._customShader.uniforms.fogNear = { value: this.scene.fog.near },
        this._customShader.uniforms.fogFar = { value: this.scene.fog.far },

        this._groundReflector = new Reflector( this._geometry, {
            shader: this._customShader,
            clipBias: 0.003,
            textureWidth: this.config.width * window.devicePixelRatio,
            textureHeight: this.config.height * window.devicePixelRatio,
            color: 0x000000,
        } );
        this._groundReflector.material.fog = true;
        this._groundReflector.position.y = .5;
        this._groundReflector.rotation.x = - Math.PI / 2;
        this.scene.add( this._groundReflector );
    }

    resize()
    {
    }

    update()
    {
        this._groundReflector.material.uniforms.uTime.value = this.clock.getElapsedTime();
    }

    destroy()
    {
    }
}