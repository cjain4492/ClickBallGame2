var lastTime = 0;

function requestMyAnimationFrame(callback, time) {
    var t = time || 16;
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, t - (currTime - lastTime));
    var id = window.setTimeout(function() {
        callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
}
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 20;
// canvas.style.width = canvas.width + "px";
// canvas.style.height = canvas.height + "px";
var circles = [];
var mouse = {
    x: 0,
    y: 0
}
var circleCreated = 0;
var score = 0;

function getCoordinates(x, y) {
    return "(" + x + ", " + y + ")";
}

function getRatio(n, d) {
    // prevent division by 0
    if (d === 0 || n === 0) {
        return 0;
    } else {
        return n / d;
    }
}
var theta = Math.random() * (2 * Math.PI);
var time = 0;

function Circle(x, y, d, s, c) {
    this.x = x;
    this.y = y;
    this.diameter = Math.round(d);
    this.radius = Math.round(d / 2);
    this.speed = s;
    this.color = c;
    this.deltaX = s * Math.cos(theta);
    this.deltaY = s * Math.sin(theta);
    this.drawnPosition = "";
    this.fill = function() {
        context.beginPath();
        context.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2, false);
        context.closePath();
        context.fill();
    }
    this.clear = function() {
        context.fillStyle = "#ffffff";
        this.fill();
    }
    this.draw = function() {
        if (this.drawnPosition !== getCoordinates(this.x, this.y)) {
            context.fillStyle = this.color;
            // if commented, the circle will be drawn if it is in the same position
            //this.drawnPosition = getCoordinates(this.x, this.y);
            this.fill();
        }
    }
    this.keepInBounds = function() {
        if (this.x < 0) {
            this.x = 100;
            this.deltaX *= -1;
        } else if (this.x + this.diameter > canvas.width) {
            this.x = canvas.width - this.diameter;
            this.deltaX *= -1;
        }
        if (this.y < 0) {
            this.y = 0;
            this.deltaY *= -1;
        } else if (this.y + this.diameter > canvas.height) {
            this.y = canvas.height - this.diameter;
            this.deltaY *= -1;
        }
    }
    this.followMouse = function() {
        this.x += this.deltaX;
        this.y += this.deltaY;
    }

}

function getRandomDecimal(min, max) {
    return Math.random() * (max - min) + min;
}

function getRoundedNum(min, max) {
    return Math.round(getRandomDecimal(min, max));
}

function getRandomColor() {
    // array of three colors
    var colors = [];
    // go through loop and add three integers between 0 and 255 (min and max color values)
    for (var i = 0; i < 3; i++) {
        colors[i] = getRoundedNum(0, 255);
    }
    // return rgb value (RED, GREEN, BLUE)
    return "rgb(" + colors[0] + "," + colors[1] + ", " + colors[2] + ")";
}

// speed of circle (how fast it moves)
var minSpeed = 2.5;

function createCircle(i) {
    // diameter of circle
    var minDiameter = 36;
    // var maxDiameter = 50;  for variable size circles
    var c = getRandomColor();
    // getRoundedNum returns a random integer and getRandomDecimal returns a random decimal
    var x = getRoundedNum(0, canvas.width);
    var y = getRoundedNum(0, canvas.height);
    // var d = getRoundedNum(minDiameter, maxDiameter);
    circles[i] = new Circle(x, y, minDiameter, minSpeed, c);
}

var maxCircles = 2;

function makeCircles() {

    for (var i = 0; i < maxCircles; i++) {
        createCircle(i);
    }
}

function drawCircles() {
    var ii = 0;
    for (var i = 0; ii < circles.length; i++) {
        if (circles[i]) {
            circles[i].draw();
            ii++;
        }
    }
}

function clearCircles() {
    var ii = 0;
    for (var i = 0; ii < circles.length; i++) {
        if (circles[i]) {
            circles[i].clear();
            ii++;
        }
    }
}

function updateCircles() {
    var ii = 0;
    for (var i = 0; ii < circles.length; i++) {
        if (circles[i]) {
            circles[i].keepInBounds();
            circles[i].followMouse();
            ii++;
        }
    }
}

function update() {
    requestMyAnimationFrame(update, 10);
    updateCircles();
}

function draw() {
    requestMyAnimationFrame(draw, 1000 / 60);
    context.clearRect(0, 0, canvas.width, canvas.height);
    time++;
    drawCircles();
    drawScore();
}

function handleError(e) {
    //e.preventDefault();
    //console.error("    ERROR    ------    " + e.message + "    ------    ERROR    ");
}

function drawScore() {
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText("Score: " + score, canvas.width / 2, 20);
}

window.addEventListener("load", function() {
    window.addEventListener("error", function(e) {
        handleError(e);
    });
    window.addEventListener("resize", function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    window.addEventListener("click", function(e) {
        var x1 = e.pageX;
        var y1 = e.pageY;
        for (var i = 0; i < circles.length; i++) {
            var circx = circles[i].x + circles[i].radius / 2;
            var circy = circles[i].y + circles[i].radius / 2;
            if (Math.pow(circx - x1, 2) + Math.pow(circy - y1, 2) <= Math.pow(circles[i].radius, 2)) {

                circles[i].x = getRoundedNum(0, canvas.width);
                circles[i].y = getRoundedNum(0, canvas.height);
                theta = Math.random() * (2 * Math.PI);
                circles[i].deltaX = circles[i].speed * Math.cos(theta);
                circles[i].deltaY = circles[i].speed * Math.sin(theta);
                if (time <= 50) { // less than 0.5 sec
                    score = score + 10;
                } else if (time > 50 && time <= 1000) { // less than 10 sec
                    score = score + Math.round(10 - (time - 100) / 100);
                } else {
                    score = score;
                }
                time = 0;
                if (score < 0) { //safety condition
                    score = 0;
                }
                circleCreated++;
                if (circleCreated % 5 == 0) {
                    maxCircles++;
                    makeCircles();
                    for (var i = 0; i < circles.length; i++) {
                        circles[i].speed += 1;
                        minSpeed += 1;
                    }
                }
                break;
            }
        }

    });

    makeCircles();
    update();
    draw();
});
var rbtn = document.getElementById("resetCanvas");
rbtn.addEventListener("click", function() {

    context.clearRect(0, 0, canvas.width, canvas.height);
    score = 0;
    maxCircles = 2;
    minSpeed = 2.5;
    circleCreated = 0;
    time = 0;
    clearCircles();

    makeCircles();
    update();
    draw();

});