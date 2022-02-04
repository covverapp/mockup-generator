import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
const gui = new dat.GUI();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const baseMockupTexture = textureLoader.load("shirt.jpg");
const colorTexture = textureLoader.load("printfile.png");
const heightTexture = textureLoader.load("map.png");
const ambientOcclusionTexture = textureLoader.load("map.png");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */

const material = new THREE.MeshStandardMaterial({ map: colorTexture });
material.aoMap = ambientOcclusionTexture;
material.displacementMap = heightTexture;
material.displacementScale = 0.5;
material.transparent = true;

gui.add(material, "displacementScale", 0, 1, 0.0001);

const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1, 1, 100, 100),
  material
);
scene.add(plane);

const baseMockup = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(3, 3, 100, 100),
  new THREE.MeshStandardMaterial({ map: baseMockupTexture })
);
scene.add(baseMockup);
baseMockup.geometry.x = 2;
baseMockup.geometry.y = 200;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  100,
  sizes.width / sizes.height,
  0.2,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // sphere.rotation.y = 0.1 * elapsedTime;
  // torus.rotation.y = 0.1 * elapsedTime;
  //   plane.rotation.y = 0.1 * elapsedTime;

  // sphere.rotation.x = 0.15 * elapsedTime;
  // torus.rotation.x = 0.15 * elapsedTime;
  //   plane.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
