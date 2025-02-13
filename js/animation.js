const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

canvas.style.position = "fixed";
canvas.style.bottom = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "150px";
canvas.style.pointerEvents = "none";
canvas.width = window.innerWidth;
canvas.height = 150;

const particles = [];

function createParticle() {
    return {
        x: Math.random() * canvas.width,
        y: canvas.height,
        size: Math.random() * 6 + 2,
        speedY: Math.random() * 3 + 2,
        alpha: 1,
    };
}

function updateParticles() {
    for (let i = 0; i < 5; i++) {
        particles.push(createParticle());
    }

    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.y -= p.speedY;
        p.alpha -= 0.02;

        if (p.alpha <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, ${Math.floor(100 + Math.random() * 155)}, 0, ${p.alpha})`;
        ctx.fill();
    }
}

function animate() {
    updateParticles();
    drawParticles();
    requestAnimationFrame(animate);
}

animate();
