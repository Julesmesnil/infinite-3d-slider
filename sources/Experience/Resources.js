import { Texture } from 'three'
import EventEmitter from './Utils/EventEmitter.js'
import Loader from './Utils/Loader.js'
import gsap from 'gsap'
import Experience from './Experience.js'

export default class Resources extends EventEmitter
{
    constructor(_assets)
    {
        super()

        this.experience = new Experience()
        this.overlay = this.experience.overlay

        this._loadingBar = document.querySelector('.loading-bar')
        this._loadingTitle = document.querySelector('.loading-title')

        // Items (will contain every resources)
        this.items = {}

        // Loader
        this.loader = new Loader({ renderer: this.renderer })

        this.groups = {}
        this.groups.assets = [..._assets]
        this.groups.loaded = []
        this.groups.current = null
        this.loadNextGroup()

        // Loader file end event
        this.loader.on('fileEnd', (_resource, _data) =>
        {
            let data = _data

            // Convert to texture
            if(_resource.type === 'texture')
            {
                if(!(data instanceof Texture))
                {
                    data = new Texture(_data)
                }
                data.needsUpdate = true
            }

            this.items[_resource.name] = data

            // Progress and event
            this.groups.current.loaded++
            this.trigger('progress', [this.groups.current, _resource, data])
            this.progressRatio = this.groups.current.loaded / this.groups.current.toLoad
            this._loadingBar.style.transform = `scaleX(${this.progressRatio})`
        })

        // Loader all end event
        this.loader.on('end', () =>
        {
            this.groups.loaded.push(this.groups.current)
            
            // Trigger
            this.trigger('groupEnd', [this.groups.current])

            if(this.groups.assets.length > 0)
            {
                this.loadNextGroup()
            }
            else
            {
                this.trigger('end')
                gsap.to(this.overlay.overlayMaterial.uniforms.uAlpha, {
                    duration: 3,
                    delay: 1,
                    value: 0,
                    ease: 'power3.inOut'
                })
                this._loadingBar.classList.add('ended')
                this._loadingBar.style.transform = ''
                this._loadingTitle.classList.add('ended')
            }
        })
    }

    loadNextGroup()
    {
        this.groups.current = this.groups.assets.shift()
        this.groups.current.toLoad = this.groups.current.items.length
        this.groups.current.loaded = 0

        this.loader.load(this.groups.current.items)
    }

    createInstancedMeshes(_children, _groups)
    {
        // Groups
        const groups = []

        for(const _group of _groups)
        {
            groups.push({
                name: _group.name,
                regex: _group.regex,
                meshesGroups: [],
                instancedMeshes: []
            })
        }

        // Result
        const result = {}

        for(const _group of groups)
        {
            result[_group.name] = _group.instancedMeshes
        }

        return result
    }

    destroy()
    {
        for(const _itemKey in this.items)
        {
            const item = this.items[_itemKey]
            if(item instanceof Texture)
            {
                item.dispose()
            }
        }
    }
}
