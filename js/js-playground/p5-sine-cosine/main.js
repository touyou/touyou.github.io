function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(0);

  /* ライトの設定 */
  var locY = (mouseY / height - 0.5) * (-2);
  var locX = (mouseX / width - 0.5) * 2;

  ambientLight(100, 80, 80);
  pointLight(200, 200, 200, locX, locY, 0);

  rotateY(frameCount * 0.0001);
  orbitControl();

  for (var j=0; j<10; j++) {
    push();
    for (var i=0; i<100; i++) {
      translate(sin(frameCount * 0.01 + j) * 200, sin(frameCount * 0.001 + j) * 300, i * 0.1);
      rotateZ(frameCount * 0.002);
      push();
      sphere(2, 10, 100);
      pop();
    }
    pop();
  }
}
