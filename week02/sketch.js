//modified from 03 - Basic Dither by brain
//https://editor.p5js.org/brain/sketches/hU0ANATF-

let color;
let img;
let ditherType = "bayer";
window.usercolor = "crimson";
window.threshold = 80;
let canvasWidth = 500;
let canvasHeight = 500;
let snaps = [];
let snapcount = 0;
let playFrame = -1; //no snap count

let video;
let snapshot;

window.gifX = 120;
window.gifY = 90;
let gapX = 0;
let gapY = 0;

window.sizeChange = false;

function setup() {
  pixelDensity(1);
  createCanvas(canvasWidth, canvasHeight);
  color = new Riso(window.usercolor);

  //getting video capture
  //took reference from this sketch:https://editor.p5js.org/grape/sketches/SkRpWdtc7
  video = createCapture(VIDEO);
  video.size(canvasWidth, canvasHeight);
  video.size(320, 240);
  video.hide(); //hide camera
}

function draw() {
  if (playFrame == -1) return;
  if (window.sizeChange == true  && snaps.length > 0) {
    console.log(window.sizeChange);
    clearSnap();
    window.sizeChange = false;
    return;
  }

  background(255);
  clearRiso();
  let dithered = ditherImage(
    snaps[playFrame % snapcount],
    ditherType,
    window.threshold
  );
  color.image(dithered, 250, 250);
  drawRiso();
  playFrame++;
}

function takeSnap() {
  console.log(window.gifX, window.gifY);
  snapshot = video.get();
  snapshot.resize(gifX, gifY);
  snaps[snapcount] = snapshot;
  // img = snapshot;
  // snaps[snapcount] = img;
  // img.resize(gifX, gifY);
  //snap arrangement

  let colCount = floor(canvasWidth / gifX);
  let marginX = (canvasWidth - colCount * gifX) / 2;
  let col = snapcount % colCount;
  let row = floor(snapcount / colCount);

  clearRiso();
  let dithered = ditherImage(snapshot, ditherType, window.threshold);
  //snaps[snapcount] = dithered;

  color.image(dithered, marginX + col * gifX, row * gifY);
  drawRiso();
  snapcount++;
}

function makeGif() {
  if (snapcount <= 0) return;
  playFrame = 0;
  frameRate(10);
  color.imageMode(CENTER);
}

function saveFile() {
  saveGif("dithered", 3);
}
function clearSnap() {
  for (i = 0; i <= snapcount; i++) {
    snaps[i] = [];
  }
  playFrame = -1;
  snapcount = 0;
  background(255);
  color.imageMode(CORNER);
}

window.snap = takeSnap; //window.snap vs window.snap()
window.gif = makeGif;
window.file = saveFile;
window.reset = clearSnap;
