import { PlaneGeometry, Mesh, Clock, ShaderMaterial, Vector2, DoubleSide, Color, ShaderChunk } from 'three'
import Experience from './Experience.js'

import fragment from './shaders/plane/frag.glsl'
import vertex from './shaders/plane/vert.glsl'

const PARAMS = {
    frequencyX: 2,
    frequencyY: 2
}

export default class Plane
{
    constructor()
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.structure = this.experience.structure
        this._scrollEvent = this.experience.scrollEvent
        
        this._velocity = null;
        
        this._structureSize = this.structure.size;
        this._structureCount = this.structure.count;
        
        this._planes = [];
        this._textures = [];
        this._material = null;
        this.clock = new Clock();
        
        this._createPlane()
        
        // Debug
        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder('Plane')
            this.debugFolder.close()
            
            // change this.modes.debug.instance position and rotation
            
            const updatePlanes = () =>
            {
                this._planes.forEach(p => {
                    p.material.uniforms.uFrequency.value = new Vector2(PARAMS.frequencyX, PARAMS.frequencyY)
                })
            }

            this.debugFolder.add(PARAMS, 'frequencyX').step(0.001).min(-10).max(10).name('Frequency X').onChange(updatePlanes)
            
            this.debugFolder.add(PARAMS, 'frequencyY').step(0.001).min(-10).max(10).name('Frequency Y').onChange(updatePlanes)
        }
    }
    
    _createPlane(){
        
        this._geometry = new PlaneGeometry( 1.5, 1.1, 32, 32);
        this._material = new ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uTexture: { value: this.resources.items.lennaTexture },
                uFrequency: { value: new Vector2(2, 2) },
                uVelocity: { value: this._scrollEvent.velocity },
                uPositionZ: { value: 0 },
                fogColor: { value: this.scene.fog.color },
                fogNear: { value: this.scene.fog.near },
                fogFar: { value: this.scene.fog.far },
            },
            transparent: true,
            side: DoubleSide,
            fog: true,
            // create a vertex shader to apply a wave on the plane
            vertexShader: vertex,
            fragmentShader: fragment
        })
        
        for ( let i = 0; i < this._structureCount; i ++ ) 
        {
            this._plane = new Mesh(
                this._geometry,
                this._material.clone()
                )
                this.scene.add(this._plane) 
                
                this._planes.push(this._plane);
                
                this._plane.position.y = 1.5; 
                this._plane.material.uniforms.uTexture.value = this.resources.items['paint' + (i + 1)];

                
                // si pair, place à gauche, si impair, place à droite
                if (i % 2 === 0) {
                    this._plane.position.x = -.8;
                } else {
                    this._plane.position.x = .8;
                }
            }
            
        }
        
        setPositions()
        {
            for ( let i = 0; i < this._planes.length; i ++ ) 
            {
                // place a plane at the center of each structure
                this._planes[i].position.z = this._structurePositions[i];
                this._planes[i].material.uniforms.uPositionZ.value = Math.abs(this._structurePositions[i]);
                this._planes[i].material.uniforms.uTime.value = this.clock.getElapsedTime();
            }
        }
        
        resize()
        {
        }
        
        update()
        {
            this._structurePositions = this.structure.positions;
            this._velocity = this._scrollEvent.velocity;
            
            this._planes.forEach(p => {
                p.material.uniforms.uVelocity.value = this._scrollEvent.velocity
            })

            this.setPositions()       
        }
        
        destroy()
        {
        }
    }