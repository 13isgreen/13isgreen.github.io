// Heavily inspired from the algorithm created by Craig Reynolds
// as described by Conrad Parker in his blog:
// http://www.kfish.org/~conrad/boids/pseudocode.html

let flockSize = 50;
let flock = [];

let rule1DivFactor = 100;
let rule2Range = 35;
let rule2DivFactor = 60;
let rule3DivFactor = 50;
let rule4DivFactor = 200;

let speedLimit = 8;

class Bird {
    constructor() {
        this.r = createVector(random(0, windowHeight), random(0, windowHeight));
        this.v = createVector(0, 0);
    }

    // Teleport bird to opposite side if reached a border
    bound() {
        // Along right or left border
        if (this.r.x <= 0) {
            this.r.x = windowWidth;
        }
        else if (this.r.x >= windowWidth) {
            this.r.x = 0;
        }
        // Along top or bottom border
        if (this.r.y <= 0) {
            this.r.y = windowHeight;
        }
        else if (this.r.y >= windowHeight) {
            this.r.y = 0;
        }
    }

    // Stop birds from going too fast
    limitSpeed() {
        if (this.v.mag() > speedLimit) {
            this.v.setMag(speedLimit);
        }
    }

    update() {
        // Add vectors from each rule to the velocity vector of this bird
        this.v.add(rule1(this));
        this.v.add(rule2(this));
        this.v.add(rule3(this));
        this.v.add(rule4(this));

        // Limit speed, update position
        this.limitSpeed();
        this.r.add(this.v);

        // If out of bounds, teleport back
        this.bound();

        this.render();
    }

    render() {
        push();

        // Translate to bird, rotate according to velocity 
        translate(this.r.x, this.r.y);
        rotate(this.v.heading());

        // Render triangle
        translate(this.v.mag() - 10, 0);
        triangle(0, 5, 0, -5, 20, 0);

        pop();
    }
}

// Steer towards perceived center of mass
function rule1(b) {
    let v = createVector(0, 0);
    let nearby = 0;

    // Sum positions of close birds
    for (let i = 0; i < flock.length; i++) {
        // Ignore self
        if (!b.r.equals(flock[i].r)) {
            // Vector from b to flock[i]
            let d = p5.Vector.sub(flock[i].r, b.r);

            // If bird is within range, add its position.
            if (d.mag() < rule2Range) {
                v.add(flock[i].r);
                nearby++;
            }
        }
    }

    if (nearby == 0)
        return v;

    // Find average velocity of flock (minus self)
    v.div(nearby);

    // Subtract from current position to get vector pointing to average location
    v.sub(b.r);

    // Divide by factor (this smooths the transition to new position)
    v.div(rule1DivFactor);

    return v;
}

// Birds try to avoid each other
function rule2(b) {
    let c = createVector(0, 0);

    for (let i = 0; i < flock.length; i++) {
        // Ignore self
        if (!b.r.equals(flock[i].r)) {
            // Vector from  b to flock[i]
            let d = p5.Vector.sub(flock[i].r, b.r);

            // If other bird is within range, steer away
            if (d.mag() < rule2Range) {
                c = c.sub(d);
            }
        }
    }
    // Divide by factor to smooth transition.
    c.div(rule2DivFactor);

    return c;
}

// Birds match nearby velocities
function rule3(b) {
    let v = createVector(0, 0);
    let nearby = 0;

    for (let i = 0; i < flock.length; i++) {
        // Ignore self
        if (!b.r.equals(flock[i].r)) {
            let d = p5.Vector.sub(flock[i].r, b.r);
            if (d.mag() < rule2Range) {
                v.add(flock[i].v);
                nearby++;
            }
        }
    }
    if (nearby == 0)
        return v;

    // Find average velocity of flock
    v.div(nearby);

    // Subtract current velocity
    v.sub(b.v);

    // Divide by factor (this smooths the transition to the new velocity)
    v.div(rule3DivFactor);

    return v;
}

// Steer towards mouse position
function rule4(b) {
    // Get mouse position as p5.vec
    let m = createVector(mouseX, mouseY);

    // Vector from mouse to bird position
    let v = 5.Vector.sub(m, b.r);

    // Divide by factor (to smooth transition as always)
    v.div(rule4DivFactor);

    return v;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.parent("birds");

    for (let i = 0; i < flockSize; i++) {
        flock.push(new Bird());
    }

    frameRate(60);
    fill(color('#99999999'));
    noStroke();
}

function draw() {
    background(color('#131313'));
    flock.forEach(bird => bird.update());
}
