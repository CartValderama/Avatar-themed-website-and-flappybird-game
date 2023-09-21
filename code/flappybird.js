//board
let board;
let boardWidth = 320;
let boardHeight = 600;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

//bird coodinate
let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//game physics
let velocityX = -2; //pipes moving left
let velocityY = 0; //bird jump
let gravity = 0.4; //bird gravity

//game status
let gameOver = false;
let score = 0;

//gamestart condition
let count = 0;
let startMovement = false;

//audio
let die = new Audio('audio/die.mp3');
let wing = new Audio('audio/wing.mp3');
let point = new Audio('audio/point.mp3');
let theme = new Audio('audio/avatarslove.mp3');

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //load image
    birdImg = new Image();
    birdImg.src = "pics/appa.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }   

    topPipeImg = new Image();
    topPipeImg.src = "pics/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "pics/bottompipe.png";

    
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);
    document.addEventListener("keydown", startGame);
    document.addEventListener("keydown", restart);

    //starting message
    context.fillStyle = "black";
    context.font = "bold 20px sans-serif";
    context.fillText("Press Enter to start", 90, boardHeight/1.9);
}


function startGame(e){
    if(e.code == "Enter" && count === 0){
        count += 1;
        requestAnimationFrame(update);
        theme.play();
        startMovement = true;
    }
}

function restart(e){
    //reset game
    if(gameOver){
        if(e.code == "Enter"){
            bird.y = birdY;
            pipeArray = []; 
            score = 0;
            gameOver = false;
            theme.play()
        }
    }
}

function moveBird(e) {
    if(!gameOver){
        if(startMovement){
            if(e.code == "KeyW") {
                //jump
                wing.play()
                velocityY = -6;
            }            
        }

    }
}

function update(){
    requestAnimationFrame(update);

    if(gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0); 
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    //stops the game when bird falls
    if(bird.y > boardHeight) {
        gameOver = true;
    }

    //pipes
    for (let i=0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            point.play();
            score += 0.5;
            pipe.passed = true;
        }

        //stops the game when bird hit pipe
        if(detectCollision(bird, pipe)){
            die.play();
            gameOver = true;
            theme.pause();
        }
    }

    //clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    //score
    context.fillStyle = "black";
    context.font = "bold 45px georgia";
    context.fillText(score, 20, 40);

    //gameover text
    if(gameOver){
        context.font = "bold 20px sans-serif";
        context.fillText("Game Over", 110, boardHeight/2);
        context.fillText("Press Enter to play again", 45, boardHeight/2 + 35);
        theme.pause();
    }
}

function placePipes() {
    if(gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(bottomPipe);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}


