var bgm;
var randomFontSize = 60;
var mode = 0;
var imageArray = [];

function preload() {
    // free music (c) TOYO (not me)
    bgm = loadSound('TOYO_Thereafter.mp3');
    for (var i = 1; i <= 6; i++) {
        imageArray[i] = loadImage('image0' + i + (i == 3 ? '.png' : '.jpg'));
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();

    textFont('Fjalla One');
    textAlign(CENTER);

    bgm.loop();
}

function draw() {
    switch (mode) {
        case 0:
            introduction();
            break;
        case 1:
            artist();
            break;
        default:
            introduction();
            break;
    }

    if (keyWentDown(32)) {
        mode = (mode + 1) % 2;
    }
}

function introduction() {
    colorMode(RGB);
    if (mouseIsPressed) {
        background(0, 50);
    } else {
        background(0);
    }

    if (keyDown('UP')) {
        push();
        translate(width / 2, height / 2);
        rotate(frameCount / 50.0);
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

    if (keyDown('UP')) {
        pop();
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



    if (keyDown('LEFT')) {
        rect(random(width), random(height), random(10, 100), random(10, 100));
    }

    if (keyDown('RIGHT')) {
        triangle(random(width), random(height), random(width), random(height), random(width), random(height));
    }
}

function artist() {
    colorMode(RGB);
    // ↑ を押したら
    if (keyIsDown(UP_ARROW)) {
        fill(random(255), random(255), random(255), 50);
        // 円を描く
        ellipse(width / 2, height / 2, random(500));
    }

    if (keyDown('DOWN')) {
        push();
        translate(width / 2, height / 2);
        rotate(frameCount / 50.0);
    }
    // → を押したら  
    if (keyIsDown(RIGHT_ARROW)) {
        fill(255, 0, 200, 0);
        stroke(random(255), random(255), random(255));
        // 三角を描く
        triangle(random(width), random(height), random(width), random(height), random(width), random(height));
    }

    // ← を押したら
    if (keyIsDown(LEFT_ARROW)) {
        fill(175 * cos(frameCount / 50) + 180, 175 * sin(frameCount / 50) + 180, 180, 50);
        // 四角を描く 
        stroke(random(255), random(255), random(255));
        if (random(100) < 50) {
            rect(random(width), random(height), random(100), random(100));
        } else {
            var w = random(10, 320);
            var h = w / 640 * 426;
            tint(255, 150);
            image(imageArray[floor(random(1, 6))], random(width), random(height), w, h);
        }
    }

    if (keyDown('DOWN')) {
        pop();
    }

    if (mouseIsPressed) {
        // 四角を描く 
        stroke(random(255), random(255), random(255));
        push();
        translate(width / 2, height / 2);
        rotate(frameCount / 50);
        line(cos(frameCount) * width / 2 + width / 2, sin(frameCount) * height / 2 + height / 2, cos(frameCount) * width, sin(frameCount) * height / 2 + height);
        pop();
    }
}