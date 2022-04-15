var count = 150;

function drawSquares() {
    for (var i = 0; i < count; i++) {
        var path = new Path.Rectangle({
            x: Math.floor(Math.random() * view.size.width - 10) + 10,
            y: Math.floor(Math.random() * view.size.height - 40) + 10,
            width: 15,
            height: 15,
            // fillColor: i % 2 === 0 ? "#B0FF92" : "#F2E863",
            fillColor: "#B0FF92",
            opacity: Math.random() * 0.5,
            scale: i / count
        })
    }
}
function onResize(event) {
    if (view.size.width <= 900) {
        count = 50;
    }
    else {
        count = 100;
    }
    project.clear();
    drawSquares();
}
function squaresInit() {
    var squares = project.activeLayer.children;
    for (var i = 0; i < squares.length; i++) {
        var currentColor = squares[i].strokeColor;
        squares[i].onMouseEnter = function (event) {
            this.opacity = 0.7;

        }
        squares[i].onMouseLeave = function (event) {
            this.opacity = 0.2;
        }
    }
}


// The onFrame function is called up to 60 times a second:
function onFrame(event) {
    // Run through the active layer's children list and change
    // the position of the placed symbols:
    for (var i = 0; i < count; i++) {
        var item = project.activeLayer.children[i];
        // Move the item 1/20th of its width to the right. This way
        // larger circles move faster than smaller circles:
        item.position.x += item.bounds.width / 20;

        // If the item has left the view on the right, move it back
        // to the left:
        if (item.bounds.left > view.size.width) {
            item.position.x = -item.bounds.width;
        }
    }
}