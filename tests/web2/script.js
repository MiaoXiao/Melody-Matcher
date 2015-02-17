var pics = ["tiger.png", "penguin.png", "scorpion.png", "turtle.png"];
var current = 0;
function butClick() {
    var image = document.getElementById('myImage');
    current = (current+1) % pics.length;
    image.src = pics[current];
}
