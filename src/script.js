import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { TetrahedronGeometry } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png')

/**
 * Geometry
 */

 const particleGeometry = new THREE.BufferGeometry(1, 32, 32)

const count = 60000

const positions = new Float32Array(count * 3)
//const colors = new Float32Array(count * 3)

for(let i=0; i<count * 3; i++)
{
    positions[i] = (Math.random() - 0.5) * 10
    //colors[i] = Math.random()
}



particleGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)

// particleGeometry.setAttribute(
//     'color',
//     new THREE.BufferAttribute(colors, 3)
// )
/**
 * particles
 */

const particleMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    color: new THREE.Color('#ff88cc'),
    transparent: true,
    alphaMap : particleTexture,
    //alphaTest : 0.001,
    //depthTest : false,
    depthWrite : false,
    blending : THREE.AdditiveBlending,
   // vertexColors : true
})

/**
 * Points
 */

const particles = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particles);



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    for(let i=0; i< count; i++)
    {
        const i3 = i*3

        const x = particleGeometry.attributes.position.array[i3]
        if(x == count)
        {
            x =0;
            z += 1;
        }

        
        const z = particleGeometry.attributes.position.array[i3+2]
        
        particleGeometry.attributes.position.array[i3 + 1] = multiWave(x, z, elapsedTime);
    }

    particleGeometry.attributes.position.needsUpdate = true
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

 function multiWave(x, z, t)
    {
        let my = Math.sin(Math.PI * ((0.2*x) + (0.1*z) + t));
         my += Math.sin(2* Math.PI * ((0.2*z) + t));
         my += Math.sin(Math.PI * ((x + z) * 0.2  + t));
        return my * (1.5 / 2.5);
    }

 function ripple(x, z, t)
    {
        let d = Math.abs(x * x + z * z) * 0.25;
        let ry = Math.sin(Math.PI * (2 * d - t));
        return ry / (1 + 2 * d);
    }



tick()