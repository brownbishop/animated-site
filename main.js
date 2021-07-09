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

// stars
function addStar() {
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
}

for (let i = 0; i <= 200; i++) {
    addStar();
}

// cube

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(10, 10, 10),
    new THREE.MeshPhysicalMaterial({
        map: textureLoader.load('texture/Sci-fi_Floor_001_basecolor.jpg'),
        aoMap: textureLoader.load('texture/Sci-fi_Floor_001_ambientOcclusion.jpg'),
        normalMap: textureLoader.load('texture/Sci-fi_Floor_001_normal.jpg'),
        emissiveMap: textureLoader.load('texture/Sci-fi_Floor_001_emission.jpg'),
        metalnessMap: textureLoader.load('texture/Sci-fi_Floor_001_metallic.jpg'),
        roughnessMap: textureLoader.load('texture/Sci-fi_Floor_001_roughness.jpg'),
        displacementMap: textureLoader.load('texture/Sci-fi_Floor_001_height.jpg'),
    })
);

cube.position.set(10, 10, 0);

scene.add(cube);

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

// render loop
function animate() {
    requestAnimationFrame(animate);

    moon.rotation.x += 0.005;
    moon.rotation.z += 0.005;

    cube.rotation.y -= 0.005;
    cube.rotation.z += 0.005;

    cube.position.x += 0.005;

    if (cube.position.x >= 10)
        cube.position.x = -5;

    controls.update();
    renderer.render(scene, camera);
}

animate();
