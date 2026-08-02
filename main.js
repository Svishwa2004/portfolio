/* =============================================
   PARTICLE CANVAS
============================================= */
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => { resize(); initParticles(); });
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
resize();

class Particle {
    constructor() { this.reset(); }

    reset() {
        this.x       = Math.random() * canvas.width;
        this.y       = Math.random() * canvas.height;
        this.size    = Math.random() * 1.5 + 0.5;
        this.speedX  = (Math.random() - 0.5) * 0.3;
        this.speedY  = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color   = Math.random() > 0.5 ? '#6366f1' : '#06b6d4';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
        if (mouse.x) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                this.x -= dx * 0.01;
                this.y -= dy * 0.01;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle   = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function initParticles() {
    particles = [];
    const count = Math.floor(canvas.width * canvas.height / 10000);
    for (let i = 0; i < Math.min(count, 120); i++) {
        particles.push(new Particle());
    }
}

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx   = particles[i].x - particles[j].x;
            const dy   = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.beginPath();
                ctx.strokeStyle  = '#6366f1';
                ctx.globalAlpha  = (1 - dist / 100) * 0.12;
                ctx.lineWidth    = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
}

initParticles();
animate();

/* =============================================
   NAVBAR SCROLL EFFECT
============================================= */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
});

/* =============================================
   MOBILE NAV TOGGLE
============================================= */
function toggleNav() {
    document.getElementById('navDrawer').classList.toggle('open');
}

function closeNav() {
    document.getElementById('navDrawer').classList.remove('open');
}

/* =============================================
   SCROLL REVEAL
============================================= */
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
reveals.forEach(el => revealObserver.observe(el));

/* =============================================
   FEATURED PROJECT RESPONSIVE LAYOUT
============================================= */
function handleFeaturedLayout() {
    const inner = document.querySelector('.project-feat-inner');
    if (!inner) return;
    inner.style.gridTemplateColumns = window.innerWidth < 700 ? '1fr' : '1fr 1fr';
}
window.addEventListener('resize', handleFeaturedLayout);
handleFeaturedLayout();

/* =============================================
   ACTIVE NAV LINK ON SCROLL
============================================= */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a:not(.nav-cta)');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 120) current = section.id;
    });
    navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === '#' + current
            ? 'var(--text-primary)'
            : '';
    });
});
