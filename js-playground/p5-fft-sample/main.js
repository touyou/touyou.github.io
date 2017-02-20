var specSize;
var volume;

var img, sound;

function preload() {
  sound = loadSound("../../res/sample_bgm.mp3");
  img = loadImage("../../res/illumination_img.png");
}

function setup() {
  var cnv = createCanvas(800, 600);
  cnv.mouseClicked(togglePlay);
  fft = new p5.FFT();
  sound.amp(0.2);
}

function draw() {
  background(0);
  stroke("#ffffff");
  image(img, 0, 0, width, height);

  var spectrum = fft.analyze();
  noStroke();
  for (var i=0; i<spectrum.length; i++) {
    var h = map(i, 0, spectrum.length, 0, 360);
    volume = spectrum[i];
    var ellipse_width = volume * (h / 8);

    if (h >= 0 && h <= 360 && ellipse_width >= 10) {
      var x = random(0, 800);
      for (var w=ellipse_width / 10; w > 0; w -= 2) {
        fill(255, 30);
        ellipse(x, h+510, w, w);
      }
    }

    var w = map(i, 0, spectrum.length, 0, width);
    line(w, height, w, height - volume * 5);
  }
}

function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}
