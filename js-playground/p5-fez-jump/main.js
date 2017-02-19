var renderer;
var scene;
var camera;

var sphere, worldSphere;
var texture;
var canvas = document.getElementById('defaultCanvas0');

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  camera.position.z = 15;
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x270000, 1.0);
}
