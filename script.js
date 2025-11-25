// Double-click to enlarge and double-click again to shrink
const img = document.getElementById("flower1");

img.addEventListener("dblclick", function () {
  img.classList.toggle("big-image");
});
