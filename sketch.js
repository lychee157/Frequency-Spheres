let textures = [];
let sounds = [];
let balls = [];
let font;
let started = false;

let textureFiles = [
  'Metal044B_1K-JPG_Displacement.jpg',
  'Metal051C_1K-JPG_Color.jpg',
  'Metal052C_1K-JPG_Color.jpg',
  'Metal053C_1K-JPG_Color.jpg',
  'Metal052C_1K-JPG_Roughness.jpg'
];

let soundFiles = [
  'ambient-pads-loop-296968.mp3',
  'ambient-soundscape-glitch-bells-276232.mp3',
  'ambient-soundscape-glitch-bells-276232 1.mp3',
  'ambient-soundscapes-007-space-atmosphere-304974.mp3',
  'ambient-soundz-364430.mp3'
];

function preload() {
  for (let file of textureFiles) {
    textures.push(loadImage(file));
  }
  for (let file of soundFiles) {
    sounds.push(loadSound(file));
  }
  font = loadFont('InstrumentSerif-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(font);
  textAlign(CENTER, CENTER);
  noStroke();

  let spacing = 200;
  let startX = -((textures.length - 1) * spacing) / 2;
  let y = 0;

  for (let i = 0; i < textures.length; i++) {
    let x = startX + i * spacing;
    balls.push(new Ball(x, y, textures[i], sounds[i]));
  }
}

function draw() {
  background(15);

  if (!started) return;

  ambientLight(60);
  let locX = mouseX - width / 2;
  let locY = mouseY - height / 2;
  pointLight(255, 255, 255, locX, locY, 100);

  let hoveredBall = balls.find(b => b.isHovered);

  for (let b of balls) {
    b.updateHover(mouseX, mouseY);
    b.display(hoveredBall);
  }
}

function mousePressed() {
  if (!started) {
    userStartAudio();
    started = true;
  }
}

class Ball {
  constructor(x, y, tex, sound) {
    this.x = x;
    this.y = y;
    this.tex = tex;
    this.sound = sound;
    this.r = 91;
    this.isHovered = false;
    this.wasHovered = false;
  }

  updateHover(mx, my) {
    let screenX = width / 2 + this.x;
    let screenY = height / 2 + this.y;
    let d = dist(mx, my, screenX, screenY);
    this.isHovered = d < this.r;

    if (this.isHovered && !this.wasHovered && this.sound && !this.sound.isPlaying()) {
      this.sound.setVolume(1.0);
      this.sound.play();
    }

    if (!this.isHovered && this.wasHovered && this.sound && this.sound.isPlaying()) {
      this.sound.setVolume(0.0, 0.8);
    }

    this.wasHovered = this.isHovered;
  }

  display(hoveredBall) {
    push();
    translate(this.x, this.y, 0);
    rotateY(frameCount * 0.005);
    rotateX(frameCount * 0.003);

    texture(this.tex);

    let isDimmed = hoveredBall && hoveredBall !== this;
    if (isDimmed) {
      specularMaterial(100);
      shininess(5);
    } else {
      specularMaterial(255);
      shininess(40);
    }

    let finalRadius = this.isHovered ? this.r + 10 : this.r;
    sphere(finalRadius, 64, 64);
    pop();
  }
}
