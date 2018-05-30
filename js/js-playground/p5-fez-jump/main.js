var interval;
var grid = 40;
var posX;
var posY;
var w = 15;
var h =15;
var colors = {
    1: '#ffffff',
    2: '#e3ecda',
    3: '#b9c7a5',
    4: '#db0006',
    5: '#a70007',
    6: '#feb325',
    7: '#01000a',
    8: '#000000',
    9: '#e27b68'
  };
var pixelArt = [
0,0,0,6,4,4,0,0,0,0,0,0,0,
0,0,6,5,4,4,0,0,0,0,0,0,0,
0,0,0,5,4,4,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,
0,3,2,1,1,1,1,1,1,1,1,1,0,
3,2,2,1,1,1,1,1,1,1,1,1,1,
3,2,1,7,1,1,1,1,1,1,1,7,1,
3,2,1,1,1,1,8,8,8,8,1,1,1,
3,2,1,1,1,1,9,9,8,8,1,1,1,
3,2,2,1,1,1,1,1,8,1,1,1,1,
0,3,3,2,1,1,1,1,1,1,1,1,0,
0,0,0,0,3,3,2,1,2,0,0,0,0,
0,3,1,1,2,1,1,1,1,3,3,0,0,
0,0,3,1,1,1,1,1,1,3,0,0,0,
0,0,0,3,1,1,1,1,1,0,0,0,0,
0,0,0,3,2,1,1,1,1,0,0,0,0,
0,0,0,3,2,1,1,1,1,0,0,0,0,
0,0,0,3,2,3,3,2,3,0,0,0,0,
0,0,3,2,0,0,2,3,0,0,0,0,0];

function setup() {
  createCanvas(450, 330);
  strokeWeight(0);

  interval = setInterval(function () {
    if (grid > 13) {
      grid--;
    } else {
      stopInterval();
    }
  }, 10);
}

function stopInterval() {
  clearInterval(interval);
}

function draw() {
  background('#67cdfd')
  posX = 50;
  posY = 0;
  for (var i=0; i<=pixelArt.length; i++) {
    posX += w;
    if (i % grid == 0) {
      posX = 50;
      posY += h;
    }

    if (pixelArt[i] > 0) {
      fill(colors[pixelArt[i]]);
      rect(posX, posY, w, h);
    }
  }
}
