import { InstancedMesh, MeshStandardMaterial, Object3D } from 'three'
import Experience from './Experience.js'

import getSize from './Utils/getObjectSize.js'

export default class Structure
{
    constructor(mesh)
    {
        this._model = mesh
        this._mesh = null
        this._experience = new Experience()
        this._config = this._experience.config
        this._scene = this._experience.scene
        this._scrollEvent = this._experience.scrollEvent
        this._dummy = new Object3D();
        this.count = 12
        this.size = null
        this.positions = []

        this._createInstances()
    }


    _createInstances() 
    {
        this._geometry = this._model.geometry
        this._material = new MeshStandardMaterial({ 
            color: 0x000d21, 
            fog: true,
            roughness: 0.5, 
            metalness: 0.2, 
            depthTest: true, 
            depthWrite: true,
         })

        this._mesh = new InstancedMesh( 
            this._geometry, 
            this._material,
            this.count
        )

        this._scene.add(this._mesh)

        this.size = getSize(this._model)
    }

    setPosition(scroll)
    {
        this.positions = []
        for ( let i = 0; i < this._mesh.count; i ++ ) 
        {
            this._dummy.position.z = -(i * this.size.z) + scroll % (this.size.z * this.count);
            
            // put the last one at the end of the first one
            if (this._dummy.position.z > 0) {
                this._dummy.position.z = this._dummy.position.z - (this.size.z * this.count)
            }

            // put the first one at the beginning of the last one
            if (this._dummy.position.z < -(this.size.z * this.count)) {
                this._dummy.position.z = this._dummy.position.z + (this.size.z * this.count)
            }
            
            this._dummy.updateMatrix();

            this.positions.push(this._dummy.position.z)
            
            this._mesh.setMatrixAt( i, this._dummy.matrix );
        }
        
        this._mesh.instanceMatrix.needsUpdate = true;
    }

    resize()
    {
    }

    update()
    {
        this._scroll = this._scrollEvent.currentScroll
        this.setPosition(this._scroll)
    }

    destroy()
    {
    }
}