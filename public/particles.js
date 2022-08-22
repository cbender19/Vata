const PARTICLE_COUNT = 180;
const PARTICLE_RADIUS = 1.5;
const MAX_VELOCITY = 0.3;
const PAIR_THRESH = 60;

function init() {
    // window.location.reload();

    window.canvas = document.getElementById('particles');
    window.ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.mouse = {
        x: 0,
        y: 0
    }
    document.addEventListener('mousemove', (e) => {
        var bounds = canvas.getBoundingClientRect();

        window.mouse.x = (e.clientX - bounds.left);
        window.mouse.y = (e.clientY - bounds.top);
    });
    window.addEventListener('resize', resizeCanvas, true);

    window.particles = [];

    for(let i = 0; i < PARTICLE_COUNT; i++) {
        var randPX = getRandomInt(0, canvas.width);
        var randPY = getRandomInt(0, canvas.height);
        var randVX = getRandom(-MAX_VELOCITY, MAX_VELOCITY);
        var randVY = getRandom(-MAX_VELOCITY, MAX_VELOCITY);

        particles.push(new Particle(randPX, randPY, randVX, randVY, PARTICLE_RADIUS));
    }

    requestAnimationFrame(draw);
}

function resizeCanvas() {
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    init();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#121212";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(let i = 0; i < PARTICLE_COUNT; i++) {
        particles[i].update();
        particles[i].checkOthers(particles);
        particles[i].checkMouse();
        particles[i].display();
    }

    requestAnimationFrame(draw);
}

class Particle {
    constructor(pX, pY, vX, vY, rad) {
        this.position = {
            x: pX,
            y: pY
        };

        this.velocity = {
            x: vX,
            y: vY
        };

        this.color = ["#ffcd45", "#40f9ff"][[Math.floor(Math.random() * 2)]];
        this.radius = rad;
        this.grayscaleColor = ["#555555", "#666666", "#777777", "#888888", "#999999", "#aaaaaa"][[Math.floor(Math.random() * 6)]];
        this.mouseColor = this.grayscaleColor;
    }

    checkEdge() {
        if(this.position.y < 0){
            this.position.y = canvas.height;
        }
        if(this.position.y > canvas.height){
            this.position.y = 0;
        }
        if(this.position.x < 0){
            this.position.x = canvas.width;
        }
        if(this.position.x > canvas.width){
            this.position.x = 0;
        }
    }

    checkOthers(others) {
        var BRIGHT_COEFFICIENT = 1.0;

        for(let i = 0; i < others.length; i++) {
            if(this != others[i]) {
                // calculate distance
                var a = this.position.x - others[i].position.x, b = this.position.y - others[i].position.y;
                var dist = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
                if(dist < PAIR_THRESH) {
                    let rgba = hexToRGB(this.grayscaleColor, Math.abs((dist != 0 ? dist / (PAIR_THRESH * BRIGHT_COEFFICIENT) : 0) - 1).toFixed(2));
                    this.drawLine(others[i].position, 1, rgba);
                }
            }
        }
    }

    checkMouse() {
        var MOUSE_THRESH = 150;
        var BRIGHT_COEFFICIENT = 0.9;

        var a = this.position.x - mouse.x, b = this.position.y - mouse.y;
        var dist = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        if(dist < MOUSE_THRESH) {
            let rgba = hexToRGB(this.mouseColor, Math.abs((dist != 0 ? dist / (MOUSE_THRESH * BRIGHT_COEFFICIENT) : 0) - 1).toFixed(2));
            this.drawLine(mouse, 1, rgba);
        }
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.checkEdge();
    }

    drawLine(point, size=1, color=this.lineColor)
    {
        ctx.strokeStyle = color;
        ctx.lineWidth = size;

        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
    }

    display() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

    }
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandom(min, max)
{
    return Number((Math.random() * (max - min) + min).toFixed(4));
}

function hexToRGB(hex, alpha=0) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha >= 0) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}