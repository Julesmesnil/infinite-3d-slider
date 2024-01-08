import { PlaneGeometry, Mesh, Clock, ShaderMaterial, Vector2, DoubleSide, Color, ShaderChunk } from 'three'
import Experience from './Experience.js'

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
        this._material = null;
        this.clock = new Clock();
    
        this._createPlane()

        // Debug
        // if(this.debug)
        // {
        //     this.debugFolder = this.debug.addFolder('Plane')
        //     this.debugFolder.open()

        //     // change this.modes.debug.instance position and rotation
        //     this.debugFolder.add(this._material.uniforms.uFrequency.value, 'x').step(0.001).min(-10).max(10).name('Frequency x')
        //     this.debugFolder.add(this._material.uniforms.uFrequency.value, 'y').step(0.001).min(-10).max(10).name('Frequency y')
        // }
    }

    _createPlane(){

        this._geometry = new PlaneGeometry( 1.5, 1, 32, 32);
        // this._material = new ({ map: this.resources.items.lennaTexture })
        this._material = new ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uTexture: { value: this.resources.items.lennaTexture },
                uFrequency: { value: new Vector2(2, 2) },
                uVelocity: { value: this._velocity},
                uPositionZ: { value: 0 },
                fogColor: { value: this.scene.fog.color },
                fogNear: { value: this.scene.fog.near },
                fogFar: { value: this.scene.fog.far },
            },
            transparent: true,
            side: DoubleSide,
            fog: true,
            // create a vertex shader to apply a wave on the plane
            vertexShader: `
                varying vec2 vUv;
                varying float vElevation;
                uniform float uTime;
                uniform vec2 uFrequency;
                uniform float uVelocity;

                void main() {
                    vUv = uv;
                    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

                    float elevation = sin(uTime - position.x * uFrequency.x + position.y * uFrequency.y) * 0.1;
                    modelPosition.z += elevation / 3.;

                    vElevation = elevation;

                    vec4 viewPosition = viewMatrix * modelPosition;
                    vec4 projectedPosition = projectionMatrix * viewPosition;
    
                    gl_Position = projectedPosition;
                }
            `,

            
            fragmentShader: `
                varying vec2 vUv;
                varying float vElevation;
                uniform sampler2D uTexture;
                uniform float uPositionZ;
                uniform vec3 fogColor;
                uniform float fogNear;
                uniform float fogFar;

                void main() {
                    vec4 textureColor = texture2D(uTexture, vUv);
                    textureColor.rgb *= vElevation * 4.0 + 0.8;
                    gl_FragColor = textureColor;
                    gl_FragColor.a = uPositionZ;
                    #ifdef USE_FOG
                        #ifdef USE_LOGDEPTHBUF_EXT
                            float depth = gl_FragDepthEXT / gl_FragCoord.w;
                        #else
                            float depth = gl_FragCoord.z / gl_FragCoord.w;
                        #endif
                        float fogFactor = smoothstep( fogNear, fogFar, depth );
                        gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
                    #endif
                }
            `
        })

        for ( let i = 0; i < this._structureCount; i ++ ) 
        {
            this._plane = new Mesh(
                this._geometry,
                this._material.clone()
            )
            this.scene.add(this._plane) 

            this._planes.push(this._plane);

            this._plane.position.y = 2; 
            
            // si pair, place à gauche, si impair, place à droite
            if (i % 2 === 0) {
                this._plane.position.x = -.8;
            } else {
                this._plane.position.x = .8;
            }

            // place a plane at the center of each structure
            // this._plane.position.z = -(i * this._structureSize.z);
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

        this.setPositions()
        
    }

    destroy()
    {
    }
}