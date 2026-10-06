console.log("color", window.usercolor);

let thresholdSlider = document.getElementById("threshold");
let snapButton = document.getElementById("snap");
let makeButton = document.getElementById("makeGif");
let saveButton = document.getElementById("saveFile");
let resetButton = document.getElementById("reset");
let sizeSelect = document.getElementById("sizeSelect");

thresholdSlider.addEventListener("input", () => {
  let thresholdSliderValue = thresholdSlider.value;
  console.log(thresholdSliderValue);
  window.threshold = thresholdSliderValue;
});

snapButton.addEventListener("click", (ev) => {
  console.log("snap clicked");
  sizeSelect.disabled=true;
  makeButton.disabled=false;
  window.snap();
});

makeButton.addEventListener("click", () => {
  console.log("make gif");
  window.makeGif();
  snapButton.disabled=true;
  saveButton.disabled=false;
  resetButton.disabled = false;
thresholdSlider.disabled=false;

});

saveButton.addEventListener("click", () => {
  console.log("save gif");
  window.saveFile();
});

resetButton.addEventListener("click", () => {
  console.log("reset");
  window.reset();
    sizeSelect.disabled=false;
    snapButton.disabled=false;
    thresholdSlider.disabled=true;

  
});

sizeSelect.addEventListener("change", () => {
  //console.log(sizeSelect.value);
  window.sizeChange = true;
  if (sizeSelect.value == "120x90") {
    window.gifX = 120;
    window.gifY = 90;
  } else if (sizeSelect.value == "160x120") {
    window.gifX = 160;
    window.gifY = 120;
  } else if (sizeSelect.value == "200x150") {
    window.gifX = 200;
    window.gifY = 150;
  } else if (sizeSelect.value == "240x180") {
    window.gifX = 240;
    window.gifY = 180;
  } else if (sizeSelect.value == "280x210") {
    window.gifX = 280;
    window.gifY = 210;
  } else {
    window.gifX = 320;
    window.gifY = 240;
  }
});
