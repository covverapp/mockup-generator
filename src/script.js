import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

function addTextCanvas(text) {
  var width = 1024,
    height = 512;
  var canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff00f";
  ctx.fillRect(0, 0, width, height);
  ctx.font = 64 + 'px " bold';
  ctx.fillStyle = "#000000";
  ctx.fillText(text, 10, 60);
  return canvas;
}

const scene = new THREE.Scene();
const canvas = document.querySelector("canvas.webgl");
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const loader = new STLLoader();
loader.load(
  "map.stl",
  function (geometry) {
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        // map: new THREE.CanvasTexture(addTextCanvas("Covver")),
        map: new THREE.TextureLoader().load("logo.jpeg"),
      })
    );
    scene.add(mesh);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log(error);
  }
);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, canvas);

const geometry = new THREE.CylinderGeometry(10, 10, 32, 16);
const materials = [
  new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(addTextCanvas("Covver")),
  }), // top
  new THREE.MeshBasicMaterial({ color: "blue" }), // right
  new THREE.MeshBasicMaterial({ color: "yellow" }), // left
];
const cube = new THREE.Mesh(geometry, materials);
// scene.add(cube);

camera.position.z = 50;
scene.background = new THREE.Color(0xffffff);

let index = 0;

function animate() {
  if (index === 0) {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    /*
    console.log("WTF");
    console.log(canvas.toDataURL);
    const img = canvas.toDataURL("image/png");
    console.log(img);
    var png = img.split(",")[1];
    console.log(png);
    console.log(
      convertDataUrlToBlob(img)
        .text()
        .then((res) => console.log(res))
    );
    */

    controls.update();
  }
}

function convertDataUrlToBlob(dataUrl) {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  console.log(u8arr);
  return new Blob([u8arr], "blah".png, { type: mime });
}

/**
fs.writeFileSync("test.png", img, function (err) {
  if (err) {
    return console.log("error");
  }
});
*/
animate();
