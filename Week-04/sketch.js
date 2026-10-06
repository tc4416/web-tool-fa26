//Hw 04
//Adding CSS

let color;
let img;
let ditherType = "bayer";
window.usercolor = "crimson";
window.threshold = 80;
let canvasWidth = 1200;
let canvasHeight = 700;
let snaps = [];
let snaps_original=[]
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
  
  createCanvas(canvasWidth, canvasHeight).parent("p5");
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
  if (window.sizeChange == true && snaps.length == 0) {
    console.log(window.sizeChange);
    clearSnap();
    window.sizeChange = false;
    return;
  }

  background(255);
  clearRiso();
  // let dithered = ditherImage(
  //   snaps[playFrame % snapcount],
  //   ditherType,
  //   window.threshold
  // );
    let dithered = ditherImage(
    snaps_original[playFrame % snapcount],
    ditherType,
    window.threshold
  );
  color.image(dithered, canvasWidth/2, canvasHeight/2);
  drawRiso();
  playFrame++;
}

function takeSnap() {
  snapshot = video.get();
  snapshot.resize(gifX, gifY);
  snaps_original[snapcount]=snapshot

  let dithered = ditherImage(snapshot, ditherType, window.threshold);
 snaps[snapcount] = dithered;
  snapcount++;

  background(255);
  clearRiso();

  //arranging snaps
  let maxCols = floor(canvasWidth / gifX);
  let cols = min(snapcount, maxCols);
  let marginY = (canvasHeight - ceil(snapcount / cols) * gifX) / 2;

  for (let i = 0; i < snapcount; i++) {
    let row = floor(i / cols);
    let col = i % cols;
    let inThisRow = min(cols, snapcount - row * cols);
    let marginX = (canvasWidth - inThisRow * gifX) / 2;
    color.image(snaps[i], marginX + col * gifX, marginY + row * gifY);
  }

  drawRiso();
}

function makeGif() {
  if (snapcount <= 0) return;
  playFrame = 0;
  frameRate(10);
  color.imageMode(CENTER);
}

function saveFile() {
  saveGif("dithered", 3, { silent: true });
}
function clearSnap() {
  for (i = 0; i <= snapcount; i++) {
    snaps[i] = [];
        snaps_original[i] = [];
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
