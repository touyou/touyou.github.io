var d = 0;
var SPEED = 4;
var BAR_WIDTH = 25;
var MARGIN = 200;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  smooth();
}

// shadow
var saveX, saveY;

function draw() {
  background(128);
  drawBackgroundBorder();

  // object
  var z = (d % 180) / (90 / SPEED);
  if (z < 1) {
    drawDia();
    drawLeftBar();
    drawFrame();
    drawRightBar();
  } else if (z < 3) {
    drawLeftBar();
    drawFrame();
    drawDia();
    drawRightBar();
  } else if (z < 5) {
    drawLeftBar();
    drawFrame();
    drawRightBar();
    drawDia();
  } else if (z < 7) {
    drawLeftBar();
    drawFrame();
    drawDia();
    drawRightBar();
  } else if (z < 9) {
    drawDia();
    drawLeftBar();
    drawFrame();
    drawRightBar();
  }
  d += 0.5;
}

function drawDia() {
  var x = width / 2.0 + sin(radians(d)) * 30.0;
  var y = height / 2.0 + cos(radians(d * 2.0)) * 50.0;
  var s = abs(sin(radians(d))) * 500.0;

  if (d % 180 < 1) {
    saveX = x;
    saveY = y;
  }

  var rotation = radians(d * SPEED);

  // shadow
  fill(0, 128);
  noStroke();
  push();
  translate(saveX, saveY);
  rotate(rotation);
  rect(0, 0, s * 0.6, s / 10);
  pop();

  // object
  fill(255);
  stroke(0);
  strokeWeight(1);
  push();
  translate(x, y);
  rotate(rotation);
  rect(0, 0, s * 1.2, s / 5);
  ellipse(0, 0, s / 10, s / 10);

  // gap
  stroke(128);
  var w = abs(sin(radians(d)));
  noFill();
  strokeWeight(w * w * w * 5);
  stroke(0, 64);
  rect(0, 0, s / 10, s / 10);
  noFill();
  strokeWeight(w * w * w * 10);
  stroke(0, 32);
  rect(0, 0, s * 1.2, s / 5);
  ellipse(0, 0, s / 10, s / 10);
  pop();
}

function drawBackgroundBorder() {
  var slopeWeight = 5;
  strokeWeight(slopeWeight);
  stroke(192);
  var offset = d * SPEED % 10;
  var slopeLength = height / slopeWeight / 2;
  for (var i=0; i<slopeLength; i++) {
    line(0, i*2*slopeWeight+offset, width, i*2*slopeWeight+offset);
  }
}

function drawFrame() {
  noFill();
  strokeWeight(50);
  rect(width / 2, height / 2, width, height);
}

function drawLeftBar() {
  drawBar(MARGIN);
}

function drawRightBar() {
  drawBar(width - MARGIN);
}

function drawBar(position) {
  fill(0);
  stroke(0);
  strokeWeight(1);
  rect(position, height / 2, BAR_WIDTH, height);
}
