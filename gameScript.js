var myGamePiece;
var speedPickup;
var pointPickups = [];
var dontPickups = [];
var gameTimer;
var myScore;

var noteTime = 0;
var pointCount = 0;

var cWidth = 1366;
var cHeight = 786;
var defaultSpeedModifier = 4;


function startGame() {
  myGamePiece = new component(30, 30, "red", cWidth * .5, cHeight * .5);
  dontPickups.push(new component(15, 15, "purple", Math.random() * cWidth, Math.random() * cHeight));
  speedPickup = new component(15, 15, "skyblue", Math.random() * cWidth, Math.random() * cHeight);
  gameTimer = new component("30px", "Consolas", "black", 280, 40, "text");
  myScore = new component("30px", "Consolas", "black", 40, 40, "text");
  myGameArea.start();
}


function component(width, height, color, x, y, type) {
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  if (type !== undefined) {
    this.type = type;
  }
  this.speedModifier = defaultSpeedModifier;
  this.update = function() {
    ctx = myGameArea.context;
    if (this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  this.newPos = function() {
    if ((this.x + this.speedX + this.width <= cWidth || this.x + this.width <= cWidth) && (this.x + this.speedX >= 0 || this.x >= 0)) {
      this.x += this.speedX;
    }
    if ((this.y + this.speedY + this.height <= cHeight || this.y + this.height <= cHeight) && (this.y + this.speedY >= 0 || this.y >= 0)) {
      this.y += this.speedY;
    }
  }
  this.respawn = function() {
    this.x = Math.random() * (cWidth - this.width);
    this.y = Math.random() * (cHeight - this.height);
    this.speedModifier = defaultSpeedModifier;
  }
  this.incSpeed = function() {
    this.speedModifier = defaultSpeedModifier * 2;
  }
  this.decSpeed = function() {
    this.speedModifier = defaultSpeedModifier;
  }
  this.crashWith = function(otherobj) {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) ||
      (mytop > otherbottom) ||
      (myright < otherleft) ||
      (myleft > otherright)) {
      crash = false;
    }
    return crash;
  }
}


var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = cWidth;
    this.canvas.height = cHeight;
    this.context = this.canvas.getContext("2d");
    this.frameNo = 0;
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
    window.addEventListener('keydown', function(e) {
      myGameArea.keys = (myGameArea.keys || []);
      myGameArea.keys[e.keyCode] = true;
    })
    window.addEventListener('keyup', function(e) {
      myGameArea.keys[e.keyCode] = false;
    })
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function() {
    clearInterval(this.interval);
  }
}


function updateGameArea() {
  for (i = 0; i < pointPickups.length; i += 1) {
    if (myGamePiece.crashWith(pointPickups[i])) {
      pointPickups[i].respawn();
      pointCount = pointCount + 1;
    }
  }
  for (i = 0; i < dontPickups.length; i += 1) {
    if (myGamePiece.crashWith(dontPickups[i])) {
      if (pointCount >= 10) {
        pointCount = pointCount - 10;
      }
      else {
        pointCount = 0;
      }
      myGamePiece.respawn();
    }
  }
  if (myGamePiece.crashWith(speedPickup)) {
    speedPickup.respawn();
    myGamePiece.incSpeed();
    noteTime = myGameArea.frameNo / 50;
    pointCount = pointCount + 1;
  }
  if (myGameArea.frameNo / 50 > noteTime + 5) {  //Five seconds of speed.
    myGamePiece.decSpeed();
  }
  myGameArea.clear();
  myGameArea.frameNo += 1;
  if (myGameArea.frameNo % 250 == 0) {
    if (Math.random() * 100 > 7) {
      pointPickups.push(new component(15, 15, "gold", Math.random() * (cWidth - 15), Math.random() * (cHeight - 15)));
    } else {
      dontPickups.push(new component(15, 15, "purple", Math.random() * (cWidth - 15), Math.random() * (cHeight - 15)));
    }
  }
  for (i = 0; i < pointPickups.length; i += 1) {
    // pointPickups[i].x += -1;  //Movement
    pointPickups[i].update();
  }
  for (i = 0; i < dontPickups.length; i += 1) {
    // pointPickups[i].x += -1;  //Movement
    dontPickups[i].update();
  }
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
  if (myGameArea.keys && myGameArea.keys[37]) { myGamePiece.speedX = -1 * myGamePiece.speedModifier; }
  if (myGameArea.keys && myGameArea.keys[39]) { myGamePiece.speedX = 1 * myGamePiece.speedModifier; }
  if (myGameArea.keys && myGameArea.keys[38]) { myGamePiece.speedY = -1 * myGamePiece.speedModifier; }
  if (myGameArea.keys && myGameArea.keys[40]) { myGamePiece.speedY = 1 * myGamePiece.speedModifier; }
  myGamePiece.newPos();
  myGamePiece.update();
  speedPickup.update();
  for (i = 0; i < pointPickups.length; i += 1) {
    pointPickups[i].update();
  }
  for (i = 0; i < dontPickups.length; i += 1) {
    dontPickups[i].update();
  }
  gameTimer.text = "Time: " + myGameArea.frameNo / 50;
  if ((myGameArea.frameNo / 50) >= 60) {
    myGameArea.stop();
  }
  gameTimer.update();
  myScore.text = "Score: " + pointCount;
  myScore.update();
  //}
}


startGame();