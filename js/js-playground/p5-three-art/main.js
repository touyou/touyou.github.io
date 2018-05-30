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
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  var directionalLightR = new THREE.DirectionalLight(0xff6633, 0.5);
  directionalLightR.position.set(1, 0, .25);
  scene.add(directionalLightR);

  var directionalLightL = new THREE.DirectionalLight(0xff6633, 0.5);
  directionalLightL.position.set(-1, 0, .25);
  scene.add(directionalLightL);

  var hemisphereLight = new THREE.HemisphereLight(0xD88D00, 0xD63600, 0.75);
  scene.add(hemisphereLight);

  document.body.appendChild(renderer.domElement);

  var geometry = new THREE.SphereGeometry(3, 16, 16);
  texture = new THREE.Texture(canvas);
  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    map: texture,
    side: THREE.DoubleSide
  });
  sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(0, 0, 0);
  sphere.rotation.y = -PI / 4 - 0.5;
  scene.add(sphere);

  var worldGeometry = new THREE.SphereGeometry(16, 12, 12);
  var worldMaterial = new THREE.MeshPhongMaterial({
    color: 0x863300,
    map: texture,
    side: THREE.DoubleSide
  });
  worldSphere = new THREE.Mesh(worldGeometry, worldMaterial);
  worldSphere.position.set(0, 0, 0);
  worldSphere.rotation.y = 2.5 * Math.PI;
  scene.add(worldSphere);

  render();
}

function render() {
  camera.position.x = map(sin(frameCount * 0.01), -1, 1, 1.5, -1.5);
  camera.position.z = map(cos(frameCount * 0.01), -1, 1, 15, 12);
  texture.needsUpdate = true;
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = init;
window.addEventListener('resize', handleResize, false);

var blobs = [];

var limitLeft = 0, limitRight = 0, limitTop = 0, limitBottom = 0;
var boxSize = 0;

function setup() {
  createCanvas(1024, 512, P2D);
  boxSize = 600;
  limitLeft = width / 2 - boxSize / 2;
  limitRight = width / 2 + boxSize / 2;
  limitTop = height / 2 - boxSize / 2;
  limitBottom = height / 2 + boxSize / 2;

  for (var i=0; i<100; i++) {
    blobs[i] = new Blob(width / 2, height / 2, random(20, 75));
  }
}

function draw() {
  background("#000000");

  fill(255, 15);
  rectMode(CENTER);
  rect(width / 2, height / 2, boxSize, boxSize);
  for (var i=0; i<blobs.length; i++) {
    blobs[i].displayOutline();
  }
  for (var i=0; i<blobs.length; i++) {
    blobs[i].display();
    blobs[i].update();
  }
}

function Blob(_x, _y, _sz) {
  this.x = _x;
  this.y = _y;
  this.sz = _sz;

  this.vx = random(-1.5, 1.5);
  this.vy = random(-1.5, 1.5);

  this.display = function () {
    noStroke();
    fill(0);
    ellipse(this.x, this.y, this.sz, this.sz);
  };

  this.displayOutline = function () {
    noStroke();
    fill(255);
    ellipse(this.x, this.y, this.sz+10, this.sz+10);
  };

  this.update = function () {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x > limitRight - this.sz / 2) {
      this.x = limitRight - this.sz / 2;
      this.vx *= -1.0;
    }
    if (this.x < limitLeft + this.sz / 2) {
      this.x = limitLeft + this.sz / 2;
      this.vx *= -1.0;
    }
    if (this.y > limitBottom - this.sz / 2) {
      this.y = limitBottom - this.sz / 2;
      this.vy *= -1.0;
    }
    if (this.y < limitTop + this.sz / 2) {
      this.y = limitTop + this.sz / 2;
      this.vy *= -1.0;
    }
  }
}
