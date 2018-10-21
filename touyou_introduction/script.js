var bgm;
var randomFontSize = 60;

function preload() {
  // free music (c) TOYO (not me)
  bgm = loadSound('TOYO_Thereafter.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  textFont('Fjalla One');
  textAlign(CENTER);

  bgm.loop();
}

function draw() {
  colorMode(RGB);
  if (mouseIsPressed) {
    background(0, 50);
  } else {
    background(0);
  }
  colorMode(HSB, 100);
    
  textSize(450);
  fill(255, 255, 255, 10);
  text('Creativity', width / 2, height / 2);

  strokeWeight(3);
  stroke(175 * sin(frameCount / 50) + 180, 175 * tan(frameCount / 50) + 180, 50);
  noFill();
  beginShape();
  for (var i = 0; i < width; i += 50) {
    curveVertex(i, sin(i + frameCount / 50) * cos(i + frameCount / 10) * sin(i + frameCount / 100) * height / 2 + height / 3);
  }
  endShape();

  stroke(175 * cos(frameCount / 50) + 180, 175 * cos(frameCount / 50) + 180, 160);
  beginShape();
  for (var i = 0; i < width; i += 50) {
    curveVertex(i, cos(i + frameCount / 50) * cos(i + frameCount / 10) * sin(i + frameCount / 80) * height / 2 + height / 3 * 2);
  }
  endShape();

  stroke(175 * tan(frameCount / 50) + 180, 175 * cos(frameCount / 50) + 180, 190);
  beginShape();
  for (var i = 0; i < width; i += 50) {
    curveVertex(i, cos(i + frameCount / 50) * cos(i + frameCount / 10) * cos(i + frameCount / 80) * height / 2 + height / 2);
  }
  endShape();

  fill(175 * sin(frameCount / 50) + 180, 175 * cos(frameCount / 30) + 180, 255);
  noStroke();
  ellipse(mouseX, mouseY, sin(frameCount / 10) * 50 + 60);

  if (mouseIsPressed) {
    for (var i = 0; i < random(100); i++) {
      ellipse(random(width), random(height), random(30));
    }
  }

  fill(175 * cos(frameCount / 50) + 180, 175 * sin(frameCount / 50) + 180, 180);
  if (mouseIsPressed) {
    if (frameCount % 5 == 0) {
      randomFontSize = random(100);
    }
    textSize(randomFontSize);
    text('touyou', width / 2, height / 2);
    textSize(randomFontSize / 2);
    text('iOS/Android App Develop & UI/CG Research', width / 2, height / 2 + randomFontSize + 10);
  } else {
    textSize(60);
    text('touyou', width / 2, height / 2);
    textSize(30);
    text('iOS/Android App Develop & UI/CG Research', width / 2, height / 2 + 70);
  }
}