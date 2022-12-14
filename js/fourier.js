let canvasSize = 700;
let theta = 0;
let sel;
let slide;
let wave = [];

let negIfOdd = i => (i % 2 == 0) ? 1 : -1;

// Coefficients for the wave
let c = {
    'Square': (i) => (4 / ((2 * i + 1) * PI)),
    'Sawtooth': (i) => 2 / (i + 1) * negIfOdd(i),
    'Triangle': (i) => (negIfOdd(i) * 8) / ((PI ** 2) * ((2 * i + 1) ** 2))
};

// Coefficients for theta
let cT = {
    'Square': (i) => (2 * i + 1),
    'Sawtooth': (i) => (i + 1),
    'Triangle': (i) => (2 * i + 1)
};

// These values scale so each wave has the same initial size
let sc = {
    'Square': 100,
    'Sawtooth': 63.5,
    'Triangle': 157
};

function setup() {
    let canvas = createCanvas(canvasSize, canvasSize);
    canvas.parent("displayCanvas");

    slide = createSlider(1, 50, 25, 1);
    slide.parent("sheet");

    sel = createSelect();
    sel.option('Square');
    sel.option('Sawtooth');
    sel.option('Triangle');
    sel.parent("sheet");

    noFill();
    stroke(255);
}

function draw() {
    background(color('#131313'));
    translate(canvasSize / 4, canvasSize / 2);

    let x, y;
    let x0 = 0, y0 = 0;

    for (let i = 0; i < slide.value(); i++) {
        // Get coefficients, scale value
        let co = c[sel.value()];
        let tCo = cT[sel.value()];
        let scl = sc[sel.value()];

        // Radius is the coefficient scaled
        let radius = scl * co(i);

        // Simple polar to cartesian
        x = radius * cos(tCo(i) * theta);
        y = radius * sin(tCo(i) * theta);

        // Draw circle centered at previous point
        stroke(color('#BBBBBB'), 70);
        ellipse(x0, y0, radius * 2, radius * 2);
        // Line from previous point to current point, update previous point information 
        line(x0, y0, x0 += x, y0 += y);
    }
    // Add final point to the wave-form
    wave.unshift([x0, y0]);

    stroke(color('#BBBBBB'), 100);
    line(x0, y0, 0, wave[0][1])

    // Draw wave-form
    stroke(color('#BBBBBB'));
    beginShape();
    for (let i = 0; i < wave.length; i++) {
        vertex(i, wave[i][1]);
    }
    endShape();

    // Cut-off to avoid unnecessary points
    while (wave.length > 600) {
        wave.pop();
    }

    theta += 0.03;
}
