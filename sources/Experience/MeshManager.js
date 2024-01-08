import { Mesh, MeshStandardMaterial, ShaderMaterial } from 'three'
import Experience from './Experience.js'

export default class MeshManager
{
    constructor(meshs)
    {
        this._models = meshs;
        this._model = null;
        this._meshs = [];
        this._mesh = null;
        this._experience = new Experience()
        this._config = this._experience.config
        this._scene = this._experience.scene
        this._debug = this._experience.debug
        this._structure = this._experience.structure
        this._scrollEvent = this._experience.scrollEvent
        this.count = 12
        this.size = 3;
        this._meshRotation = 0.01;

        this._structureSize = this._structure.size;
        this._structureCount = this._structure.count;

        this._createMeshs()

        // debug
        if(this._debug)
        {
            this.debugFolder = this._debug.addFolder('MeshManager')
            this.debugFolder.close()

            // change this.modes.debug.instance position and rotation
            this.debugFolder.add(this, '_meshRotation').step(0.001).min(0).max(0.2).name('Rotation Speed')
        }
    }


    _createMeshs() 
    {
        this._material = new MeshStandardMaterial({ 
            color: 0x211400, 
            fog: true, 
            roughness: 0.5, 
            metalness: 0.2, 
            depthTest: true, 
            depthWrite: true,
            transparent: true,
        })

        for ( let i = 0; i < this._models.length; i ++ )
        {
            this._model = this._models[i]
            this._geometry = this._model.geometry

            this._mesh = new Mesh( 
                this._geometry, 
                this._material.clone(),
            )

            this._scene.add(this._mesh)

            this._mesh.position.y = 2;
            this._mesh.position.x = .8;

            this._mesh.scale.set(.4, .4, .4);

            this._meshs.push(this._mesh);

        }

    }

    setPosition()
    {
        for ( let i = 0; i < this._meshs.length; i ++ )
        {
            this._meshs[i].position.z = this._structurePositions[i * 4];
            // this._meshs[i].material.uniforms.uPositionZ.value = Math.abs(this._structurePositions[i * 4]);
        }                
    }

    setOpacity()
    {
        for ( let i = 0; i < this._meshs.length; i ++ )
        {
            this._meshs[i].material.opacity = Math.abs(this._structurePositions[i * 4] * 0.8);
        }                
    }

    resize()
    {
    }

    update()
    {
        this._structurePositions = this._structure.positions;
        this.setPosition()
        this.setOpacity()
        this._meshs.forEach(mesh => {
            mesh.rotation.y += this._meshRotation;
            mesh.rotation.x += this._meshRotation;

        });

    }

    destroy()
    {
    }
}