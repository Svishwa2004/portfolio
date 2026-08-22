/* =============================================
   PAPER SPECKLE CANVAS
   Charcoal and amber flecks at low alpha so the
   canvas reads as print texture on the paper
   surface rather than a glowing particle mesh.
============================================= */
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let particles = [];
let mouse = { x: null, y: null };

const INK = '46, 48, 56';
const AMBER = '242, 171, 29';

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
        this.size    = Math.random() * 1.6 + 0.6;
        this.speedX  = (Math.random() - 0.5) * 0.24;
        this.speedY  = (Math.random() - 0.5) * 0.24;
        this.opacity = Math.random() * 0.28 + 0.08;
        this.rgb     = Math.random() > 0.68 ? AMBER : INK;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
        if (mouse.x !== null) {
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
        ctx.fillStyle = `rgba(${this.rgb}, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.floor(canvas.width * canvas.height / 12000);
    for (let i = 0; i < Math.min(count, 100); i++) {
        particles.push(new Particle());
    }
}

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx   = particles[i].x - particles[j].x;
            const dy   = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 96) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${INK}, ${(1 - dist / 96) * 0.07})`;
                ctx.lineWidth   = 0.6;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
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

if (!reduceMotion) {
    initParticles();
    animate();
}

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
const navDrawer = document.getElementById('navDrawer');
const navToggle = document.getElementById('navToggle');

function toggleNav() {
    const open = navDrawer.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
}

function closeNav() {
    navDrawer.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navDrawer.classList.contains('open')) {
        closeNav();
        navToggle.focus();
    }
});

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
   ACTIVE NAV LINK ON SCROLL
============================================= */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 120) current = section.id;
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
});
