import './style.css';
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// create the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg')
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.set(-3, 0, 30);

if (camera.position.x < 120)
    console.log('camera can\'t be passed as a parameter');

const textureLoader = new THREE.TextureLoader();

// create light
const light = new THREE.PointLight({
    color: 0xffffff,
    intensity: 0.7,
    decay: 2
});

light.position.set(10, 5, 10);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);

scene.add(light, ambientLight);

// add moon

const moonTexture = textureLoader.load('moon.jpg');
const normalTexture = textureLoader.load('normal.jpg');

const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshPhongMaterial({
        map: moonTexture,
        normalMap: normalTexture,
    })
);

scene.add(moon);
moon.position.set(-5, 0, 30);

// add profiler for the addStar function

// stars
function addStar() {
    console.time();
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.8,
    });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill()
        .map(() => THREE.MathUtils.randFloatSpread(100));

    star.position.set(x, y, z);
    scene.add(star);
    console.timeEnd();
}

// efficient for loop
// faster than map
for (let i = 0; i <= 200; i++) {
    addStar();
}

// cube
const spaceShipMaterial = new THREE.MeshPhysicalMaterial({
    map: textureLoader.load('texture/Sci-fi_Floor_001_basecolor.jpg'),
    aoMap: textureLoader.load('texture/Sci-fi_Floor_001_ambientOcclusion.jpg'),
    normalMap: textureLoader.load('texture/Sci-fi_Floor_001_normal.jpg'),
    emissiveMap: textureLoader.load('texture/Sci-fi_Floor_001_emission.jpg'),
    metalnessMap: textureLoader.load('texture/Sci-fi_Floor_001_metallic.jpg'),
    roughnessMap: textureLoader.load('texture/Sci-fi_Floor_001_roughness.jpg'),
    displacementMap: textureLoader.load('texture/Sci-fi_Floor_001_height.jpg'),
});

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(10, 10, 10),
    spaceShipMaterial
);

cube.position.set(10, 10, 0);

scene.add(cube);

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(12, 4),
    spaceShipMaterial
);

torus.position.set(0, -10, -5);

scene.add(torus);

// background

scene.background = textureLoader.load('space.jpg');

// controls

const controls = new OrbitControls(camera, renderer.domElement);

// scroll animation

function moveCamera() {
    const top = document.body.getBoundingClientRect().top;

    camera.position.x = top * -0.002;
    camera.position.y = top * -0.002;
    camera.position.z = top * -0.01;
}

document.body.onscroll = moveCamera;

let angle = 0;

// render loop
function animate() {
    angle += 0.01;

    requestAnimationFrame(animate);

    moon.rotation.x += 0.005;
    moon.rotation.z += 0.005;

    cube.rotation.y -= 0.005;
    cube.rotation.z += 0.005;

    torus.rotation.x -= 0.005;
    torus.rotation.y -= 0.05;

    cube.position.x = torus.position.x + (25 * Math.cos(angle));
    cube.position.y = torus.position.y + (25 * Math.sin(angle));

    controls.update();
    renderer.render(scene, camera);
}

animate();
