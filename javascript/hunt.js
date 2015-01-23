// declaring variables
var canvas, ctx;
// birds
var birdsArray, birdNo, birdWidth, birdHeight, birdX, birdY, birdSpeed, birdImage;
// user
var cursorX, cursorY;
// score
var birdsShot, lives;

function clearCanvas() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
}

// initializing variables
function init() {
	birdsArray = [];
	birdNo = 10;
	birdWidth = 42;
	birdHeight = 29;
	birdX = 0;
	birdY = 0;
	birdSpeed = 3;
	birdsShot = 0;
	lives = 3;

	// add event listeners
	canvas.addEventListener("mousemove", trackPosition);
	canvas.addEventListener("mousedown", shoot);

	// loading bird image
	birdImage = new Image();
	birdImage.src = "pictures/bird.png";

	// loading birds to birdsArray
	for(var i = 0; i<birdNo; i++) {
		// place birds randomly
		birdX = (Math.random() * canvas.width + 5) + canvas.width;
		birdY = (Math.random() * 300) + 150;
		birdsArray.push([birdX,birdY,birdWidth,birdHeight]);
	}

	loop = setInterval(main, 25);
}

function update() {
	// bird movement
	for(var i = 0; i<birdNo; i++) {
		birdsArray[i][0] -= birdSpeed;
	}

	// bird leaves screen
	if(outOfBounds()) {
		lives--;
	}

	// game over
	if(lives == 0) {
		gameOver();
	}

	if(birdNo == 0 && birdsShot != 10) {
		gameOver();
	}

	// level complete
	if (birdsShot == 10) {
		complete();
	}
}

function draw() {
	// draw the birds
	for(var i = 0; i<birdNo; i++) {
		ctx.drawImage(birdImage,birdsArray[i][0],birdsArray[i][1]); // drawimage(img,x,y)
	}

	// draw the scores
	ctx.fillStyle = "rgb(255,255,255)"; // color
	ctx.font = "bold 20px VT323"; // font
	ctx.textAlign = "left";
	ctx.fillText("Lives: " + lives + " Birds Shot: " + birdsShot,32,32);
}

// track position of mouse
function trackPosition(e) {
	cursorX = e.clientX - ctx.canvas.offsetLeft;
	cursorY = e.clientY - ctx.canvas.offsetTop;
}

// check if bird leaves screen
function outOfBounds() {
	for(var i = 0; i<birdNo; i++) {
		if(birdsArray[i][0] + birdWidth < 0) {
			birdsArray.splice(i,1);
			birdNo--;
			return true;
		}
	}
}

// check if bird was hit
function birdHit() {
	for(var i = 0; i<birdNo; i++) {
		if((cursorX > birdsArray[i][0]) && (cursorX < birdsArray[i][0] + birdWidth) && (cursorY > birdsArray[i][1]) && (cursorY < birdsArray[i][1] + birdHeight)) {
			birdsArray.splice(i,1);
			birdNo--;
			return true;
		}
	}
}

// triggered on user mouse click
function shoot() {
	if((lives > 0) && birdHit()) {
		birdsShot++;
	}
	else {
		lives--;
	}
}

// main game loop
function main() {
	clearCanvas();
	update();
	draw();
}

function startScreen() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	ctx.font = "bold 22px VT323"; // font
	ctx.textAlign = "center";
	ctx.fillStyle = "white"; // color
	ctx.fillText("Click to Start!", canvas.width/2, canvas.height/2 - 10);
	ctx.font = "bold 17px VT323";
	ctx.fillText("Hit all 10 birds", canvas.width/2, (canvas.height/2 - 10) - 32);

	// add event listener for the start menu
	canvas.addEventListener("click", gameStart);
}

function complete() {
	clearCanvas();
	clearInterval(loop);
	ctx.font = "bold 30px VT323"; // font
	ctx.textAlign = "center";
	ctx.fillStyle = "rgb(254,204,33)"; // color yellow
	ctx.fillText("Level Complete!", canvas.width/2, canvas.height/2 - 10);
}

function gameOver() {
	clearCanvas();
	clearInterval(loop);
	canvas.removeEventListener("mousedown", shoot);

	ctx.font = "bold 30px VT323"; // font
	ctx.textAlign = "center";
	ctx.fillStyle = "rgb(246,71,71)"; // sunset orange
	ctx.strokeStyle = "rgba(1,1,1,0)";
	ctx.fillText("Game Over!", canvas.width/2, canvas.height/2 - 10);
	ctx.strokeRect((canvas.width/2 - 62),(canvas.height/2), 122, 30);
	ctx.fillText("Continue?", canvas.width/2, ((canvas.height/2) + 32) - 10);

	// add event listener for the continue button
	canvas.addEventListener("click", continueButton);
}

function gameStart() {
	canvas.removeEventListener("click", gameStart);
	init();
}

function continueButton() {
	if((cursorX > (canvas.width/2 - 62)) && (cursorX < (canvas.width/2 - 62) + 122) && (cursorY > (canvas.height/2 + 10)) && cursorY < ((canvas.height/2 + 10)+ 30)) {
		canvas.removeEventListener("click", continueButton);
		init();
	}
}