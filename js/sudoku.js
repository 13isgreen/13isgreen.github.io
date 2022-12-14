let boardLength = 9;
let canvasSize = 700;
let squareSize = canvasSize / boardLength;
let solving = false;
let begin = false;

let board = [[5, 3, 4, 6, 7, 0, 9, 1, 0],
[0, 0, 2, 0, 9, 0, 0, 0, 0],
[0, 9, 0, 0, 4, 2, 0, 6, 0],
[8, 0, 0, 0, 6, 0, 0, 0, 3],
[4, 0, 0, 8, 0, 3, 0, 0, 1],
[7, 0, 0, 0, 2, 0, 0, 0, 6],
[0, 6, 0, 0, 0, 0, 2, 8, 0],
[0, 0, 0, 4, 1, 9, 0, 0, 5],
[0, 0, 0, 0, 8, 0, 0, 7, 9]];

function drawSquare(x, y) {
    let value = board[y][x];

    // Clear square
    fill(255);
    rectMode(CORNER);
    rect(x * squareSize, y * squareSize, squareSize);

    if (value == 0) {
        return;
    }

    // Draw number (if non-zero)
    fill(0);
    rectMode(CENTER);
    text(value.toString(), x * squareSize + squareSize / 2, y * squareSize + squareSize / 2 + 2);
}

function isValid(x, y, key) {
    // Check current row and column
    for (let i = 0; i < boardLength; i++) {
        if (i != y) {
            if (board[x][i] == key) {
                return false;
            }
        }
        if (i != x) {
            if (board[i][y] == key) {
                return false;
            }
        }
    }

    let subX = Math.floor(x / 3), subY = Math.floor(y / 3);

    // Checks the subgrid that the given x,y falls inside.
    for (let i = subX * 3; i < subX * 3 + 3; i++) {
        for (let j = subY * 3; j < subY * 3 + 3; j++) {
            if (board[i][j] == key && x != i && y != j) {
                return false;
            }
        }
    }

    return true;
}

// Finds the first empty square on the board.
function nextSquare() {
    for (let row = 0; row < boardLength; row++) {
        for (let col = 0; col < boardLength; col++) {
            if (board[row][col] == 0) {
                return [row, col];
            }
        }
    }

    return false;
}

// Checks if the board is full of numbers.
function full() {
    for (let i = 0; i < boardLength; i++) {
        for (let j = 0; j < boardLength; j++) {
            if (board[i][j] == 0) {
                return false;
            }
        }
    }

    return true;
}

//  
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function solve(row, col) {
    // If the current board is invalid, go back and try another one.
    if (!isValid(row, col, board[row][col])) {
        return false;
    }

    // If the board is full, it must be complete.
    if (full()) {
        return true;
    }

    // Finds next non-zero square.
    let next = nextSquare();
    let nextRow = next[0], nextCol = next[1];

    // Try each possibility and recursively call to the next square.
    for (let i = 1; i < 10; i++) {
        board[nextRow][nextCol] = i;

        // Artificially slow down the program to make the drawing visible.
        await sleep(1);

        if (await solve(nextRow, nextCol)) {
            return true;
        }

        board[nextRow][nextCol] = 0;
    }

    return false;
}

// Changes the global letiable "board" to the given option.
function selectPuzzle() {
    if (solving) {
        return;
    }

    // Selector values are in the form of "PUZZLE #N"
    // This piece of code gets N and stores it in num.
    let num = mySelect.value();
    num = parseInt(num.substr(num.length - 1));

    switch (num) {
        case 1:
            board = [[5, 3, 4, 6, 7, 0, 9, 1, 0],
            [0, 0, 2, 0, 9, 0, 0, 0, 0],
            [0, 9, 0, 0, 4, 2, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]];
            break;
        case 2:
            board = [[3, 0, 0, 8, 0, 1, 0, 0, 2],
            [2, 0, 1, 0, 3, 0, 6, 0, 4],
            [0, 0, 0, 2, 0, 4, 0, 0, 0],
            [8, 0, 9, 0, 0, 0, 0, 0, 0],
            [0, 6, 0, 0, 0, 0, 0, 0, 0],
            [7, 0, 2, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 5, 0, 9, 0, 0, 0],
            [9, 0, 4, 0, 8, 0, 7, 0, 5],
            [6, 0, 0, 1, 0, 7, 0, 0, 3]];
           break;
        case 3:
            board = [[6, 0, 9, 0, 0, 4, 0, 0, 1],
            [8, 0, 0, 0, 5, 0, 0, 0, 0],
            [0, 3, 5, 1, 0, 9, 0, 0, 8],
            [0, 0, 8, 0, 0, 0, 0, 0, 4],
            [0, 5, 0, 0, 0, 0, 0, 3, 0],
            [4, 0, 0, 0, 7, 0, 0, 5, 2],
            [0, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 1, 0, 4, 0, 0, 0, 0],
            [7, 6, 0, 0, 3, 0, 0, 0, 0]];
            break;
        case 4:
            board = [[1, 0, 0, 0, 0, 9, 0, 0, 0],
            [5, 6, 0, 0, 1, 7, 0, 3, 9],
            [0, 0, 8, 6, 0, 0, 1, 0, 4],
            [6, 0, 9, 0, 0, 0, 0, 0, 0],
            [3, 8, 0, 0, 2, 0, 0, 7, 6],
            [0, 0, 0, 0, 0, 0, 2, 0, 8],
            [4, 0, 5, 0, 0, 1, 6, 0, 0],
            [2, 1, 0, 8, 5, 0, 0, 4, 3],
            [0, 0, 0, 3, 0, 0, 0, 0, 1]];

            break;
        case 5:
            board = [[1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            break;
    }
}

function startSolve() {
    begin = true;
}

function setup() {
    let canvas = createCanvas(canvasSize, canvasSize);
    canvas.parent("displayCanvas");

    mySelect = createSelect();
    mySelect.option('Puzzle #1');
    mySelect.option('Puzzle #2');
    mySelect.option('Puzzle #3');
    mySelect.option('Puzzle #4');
    mySelect.option('Puzzle #5');
    mySelect.changed(selectPuzzle);

    mySelect.parent("sheet");

    myStart = createButton("Start");
    myStart.mousePressed(startSolve);

    myStart.parent("sheet");

    textSize(40);
    textAlign(CENTER, CENTER);

    for (let row = 0; row < boardLength; row++) {
        for (let col = 0; col < boardLength; col++) {
            drawSquare(row, col);
        }
    }
}

function draw() {
    background(0);

    // Toggle start 
    if (begin) {
        solve(0, 0);
        begin = false;
        solving = true;
    }

    // Draw board repeatedly
    for (let row = 0; row < boardLength; row++) {
        for (let col = 0; col < boardLength; col++) {
            drawSquare(row, col);
        }
    }

    // Draws subgrid lines.
    strokeWeight(4);
    for (let i = 1; i <= 2; i++) {
        line(squareSize * 3 * i, 0, squareSize * 3 * i, canvasSize);
        line(0, squareSize * 3 * i, canvasSize, squareSize * 3 * i);
    }
    strokeWeight(1);
} 
