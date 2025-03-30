import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// scene set up and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 1000 );
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.set(0, 0, 0);

// Background image load
const TextureLoader =  new THREE.TextureLoader();
const lakeBackground = TextureLoader.load("background_blur.png");
lakeBackground.colorSpace = THREE.SRGBColorSpace;
scene.background = lakeBackground;

// Animation set up
var mixer;
const clock = new THREE.Clock();

// Load axolotl glb (model)
const loader = new GLTFLoader();
let axolotl;
loader.load(
	'/axolotl_model.glb',
	function (gltf) {
		axolotl = gltf.scene;
		scene.add(axolotl)

		mixer = new THREE.AnimationMixer( axolotl );
		mixer.clipAction(gltf.animations[0]).play();
		axolotl.rotation.y = -0.8;
		axolotl.rotation.x = 0.1;
		axolotl.position.set(6, -1.5, -10);
	},
	function (xhr) {
		console.log((xhr.loaded / xhr.total * 100) + '% loaded');
	},
	// called when loading has errors
	function (error) {
		console.log('An error happened');
	}
);

// Axolotl Textures Initialization
const TextureBlack = TextureLoader.load('axolotl_tex_black.png');
TextureBlack.flipY = false;
TextureBlack.colorSpace = THREE.SRGBColorSpace;

const TexturePink = TextureLoader.load('axolotl_tex_pink.png');
TexturePink.flipY = false;
TexturePink.colorSpace = THREE.SRGBColorSpace;

const TexturePiebald = TextureLoader.load('axolotl_tex_piebald.png');
TexturePiebald.flipY = false;
TexturePiebald.colorSpace = THREE.SRGBColorSpace;

// Swaps texture colors via button press
const blackButton = document.getElementById('button_morphBlack');
blackButton.addEventListener("click", blackSwap);
function blackSwap(){
	axolotl.children[0].children[0].material.emissiveMap = TextureBlack;
}
const pinkButton = document.getElementById('button_morphPink');
pinkButton.addEventListener("click", pinkSwap);
function pinkSwap(){
	axolotl.children[0].children[0].material.emissiveMap = TexturePink;
}
const piebaldButton = document.getElementById('button_morphPiebald');
piebaldButton.addEventListener("click", PiebaldSwap);
function PiebaldSwap(){
	axolotl.children[0].children[0].material.emissiveMap = TexturePiebald;
}

document.body.appendChild(renderer.domElement);

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	mixer.update(clock.getDelta());
}

animate();