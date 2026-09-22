console.log("hello world");

//-------they all do the same things -----------
//named function
// function printDrag(ev) {
//   console.log("mousemove named funtion");
// }
// document.body.addEventListener("mousemove", printDrag);

// //anonymous function
// document.body.addEventListener("mousemove", function (ev) {
//   console.log("mousemove anonymous");
// });

//anonymous arrow function
document.body.addEventListener("mousemove", (ev) => {
  //   console.log("mousemove anonymous arrow");
  //   console.log(ev.clientX, ev.clientY);

  //obbject destructuting syntax
  let { clientX, clientY } = ev;
  console.log(clientX, clientY);

  //use mouse xy as center of square
  let mySquare = document.getElementById("mySquare");
  mySquare.style.left = clientX -50 +"px";
  mySquare.style.top = clientY-50 + "px";
});
