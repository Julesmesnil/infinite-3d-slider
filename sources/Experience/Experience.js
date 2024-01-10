import { Color, Fog, Scene } from 'three'
import GUI from 'lil-gui'

import Time from './Utils/Time.js'
import Sizes from './Utils/Sizes.js'
import Stats from './Utils/Stats.js'

import Resources from './Resources.js'
import Renderer from './Renderer.js'
import Camera from './Camera.js'
import Lights from './Lights.js'
import Structure from './Structure.js'
import Plane from './Plane.js'
import Floor from './Floor.js'
import MeshManager from './MeshManager.js'

import ScrollEvent from './ScrollEvent.js'

import assets from './assets.js'

export default class Experience
{
    static instance

    constructor(_options = {})
    {
        if(Experience.instance)
        {
            return Experience.instance
        }
        Experience.instance = this

        // Options
        this.targetElement = _options.targetElement

        if(!this.targetElement)
        {
            console.warn('Missing \'targetElement\' property')
            return
        }

        this.mouse = {
            x: 0,
            y: 0
        }

        this.time = new Time()
        this.sizes = new Sizes()
        this.meshs = []
        this.setConfig()
        this.setDebug()
        this.setStats()
        this.setScene()
        this.setCamera()
        this.setLights()
        this.setRenderer()
        this.setResources()
        this.setScrollEvent()

        this.resources.on('groupEnd', (_group) =>
        {
            this.resources.items.model.scene.traverse((_child) => {
                if (_child.name === "structure") {
                    this.setStructure(_child)
                }

                if (_child.name === "monkey" || _child.name === "sphere" || _child.name === "taurus") {
                    this.meshs.push(_child)
                }
            })
            this.setPlane()
            this.setFloor()
            this.setMeshManager(this.meshs)
        })

        this.sizes.on('resize', () =>
        {
            this.resize()
        })

        this.update()
    }

    setConfig()
    {
        this.config = {}
    
        // Debug
        this.config.debug = window.location.hash === '#debug'

        // Pixel ratio
        this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

        // Width and height
        const boundings = this.targetElement.getBoundingClientRect()
        this.config.width = boundings.width
        this.config.height = boundings.height || window.innerHeight
    }

    setDebug()
    {
        if(this.config.debug)
        {
            this.debug = new GUI()
        }
    }

    setStats()
    {
        if(this.config.debug)
        {
            this.stats = new Stats(true)
        }
    }
    
    setScene()
    {
        this.scene = new Scene()
        this.scene.background = new Color('#000d21');
        this.scene.fog = new Fog( 0x000d21, 1, 9 );

        // Debug
        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder('Fog')
            this.debugFolder.close()

            this.debugFolder.add(this.scene.fog, 'near').step(0.001).min(0).max(10).name('Near')
            this.debugFolder.add(this.scene.fog, 'far').step(0.001).min(5).max(20).name('Far')
            this.debugFolder.addColor(this.scene.fog, 'color').name('Color')
        }
    }

    setCamera()
    {
        this.camera = new Camera()
    }

    setLights()
    {
        this.lights = new Lights()
    }

    setRenderer()
    {
        this.renderer = new Renderer({ rendererInstance: this.rendererInstance })

        this.targetElement.appendChild(this.renderer.instance.domElement)
    }

    setResources()
    {
        this.resources = new Resources(assets)
    }

    setStructure(mesh)
    {
        this.structure = new Structure(mesh)
    }
    setPlane()
    {
        this.plane = new Plane()
    }
    setFloor()
    {
        this.floor = new Floor()
    }
    setMeshManager(mesh)
    {
        this.meshManager = new MeshManager(mesh)
    }

    setScrollEvent()
    {
        this.scrollEvent = new ScrollEvent()
    }

    setMouseMoveEvent()
    {
        window.addEventListener('mousemove', (e) =>
        {
            this.mouse.x = e.clientX / this.config.width - 0.5
            this.mouse.y = e.clientY / this.config.height - 0.5
        })
    }

    update()
    {
        if(this.stats)
            this.stats.update()
        
        this.camera.update()

        if(this.structure)
            this.structure.update()

        if(this.plane)
            this.plane.update()

        if(this.floor)
            this.floor.update()

        if(this.meshManager)
            this.meshManager.update()

        if(this.scrollEvent)
            this.scrollEvent.update()
        
        if(this.renderer)
            this.renderer.update()

        this.setMouseMoveEvent()
        


        window.requestAnimationFrame(() =>
        {
            this.update()
        })
    }

    resize()
    {
        // Config
        const boundings = this.targetElement.getBoundingClientRect()
        this.config.width = boundings.width
        this.config.height = boundings.height

        this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

        if(this.camera)
            this.camera.resize()

        if(this.renderer)
            this.renderer.resize()

    }

    destroy()
    {
        
    }
}
