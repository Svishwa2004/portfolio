/* =============================================
   MOTION ENGINE — smooth scroll, reveals,
   parallax, tilt, progress, entrance.
   Respects prefers-reduced-motion.
   ============================================= */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const navbar = document.getElementById('navbar');
const navDrawer = document.getElementById('navDrawer');
const navToggle = document.getElementById('navToggle');
const progressBar = document.getElementById('scrollProgress');
const toTop = document.getElementById('toTop');
const heroPortrait = document.querySelector('.hero-portrait');
const heroCopy = document.querySelector('.hero-copy');

/* ---------- Page entrance ---------- */
requestAnimationFrame(() => {
    requestAnimationFrame(() => document.body.classList.add('body-loaded'));
});

/* Portrait blur-up once the file is ready */
document.querySelectorAll('.hero-portrait img').forEach(img => {
    const done = () => img.classList.add('is-loaded');
    if (img.complete && img.naturalWidth > 0) done();
    else {
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
    }
});

/* =============================================
   MOBILE NAV DRAWER (kept global for inline onclick)
   ============================================= */
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

/* Collapse the drawer if the viewport grows past the mobile breakpoint */
window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeNav();
    cacheSectionTops();
});

/* =============================================
   SMOOTH ANCHOR SCROLL (eased, navbar-aware)
   ============================================= */
let smoothRaf = 0;
const rootEl = document.documentElement;

/* Always (re)load at the very top — never restore scroll position. */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
function jumpToTop() {
    const prev = rootEl.style.scrollBehavior;
    rootEl.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    rootEl.style.scrollBehavior = prev;
}
jumpToTop();
window.addEventListener('pageshow', jumpToTop);

function cancelSmooth() {
    if (smoothRaf) cancelAnimationFrame(smoothRaf);
    smoothRaf = 0;
    /* Hand smoothing back to CSS (keyboard/focus jumps still use it). */
    rootEl.style.scrollBehavior = '';
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function smoothScrollTo(targetY, onDone) {
    if (prefersReduced) {
        window.scrollTo(0, targetY);
        if (onDone) onDone();
        return;
    }
    cancelSmooth();
    const startY = window.scrollY;
    const dist = targetY - startY;
    if (Math.abs(dist) < 2) return;
    /* Short hops land quickly, long jumps get more time — capped. */
    const duration = Math.min(900, Math.max(450, 350 + Math.abs(dist) * 0.25));
    const start = performance.now();
    /* Take full control: behavior:'auto' does NOT override CSS — it
       inherits it — so the stylesheet's scroll-behavior:smooth would
       re-smooth every frame and fight this loop. Disable it meanwhile. */
    rootEl.style.scrollBehavior = 'auto';
    const step = now => {
        const t = Math.min((now - start) / duration, 1);
        window.scrollTo(0, startY + dist * easeOutCubic(t));
        if (t < 1) smoothRaf = requestAnimationFrame(step);
        else {
            cancelSmooth();
            if (onDone) onDone();
        }
    };
    smoothRaf = requestAnimationFrame(step);
}

/* User takes over -> stop auto-scroll */
['wheel', 'touchmove'].forEach(evt =>
    window.addEventListener(evt, cancelSmooth, { passive: true })
);

function anchorTargetY(el) {
    const navH = navbar ? navbar.offsetHeight : 72;
    const top = el.getBoundingClientRect().top + window.scrollY;
    return Math.max(top - navH - 12, 0);
}

/* Brief glow sweep on the section title you land on. */
function flashTitle(section) {
    if (prefersReduced) return;
    const title = section.querySelector ? section.querySelector('.section-title') : null;
    if (!title) return;
    title.classList.remove('arrived');
    void title.offsetWidth;
    title.classList.add('arrived');
    setTimeout(() => title.classList.remove('arrived'), 950);
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const id = link.getAttribute('href');
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        /* Micro tap pulse on the clicked link. */
        if (!prefersReduced) {
            link.classList.remove('tapped');
            void link.offsetWidth;
            link.classList.add('tapped');
            link.addEventListener('animationend', () => link.classList.remove('tapped'), { once: true });
        }
        if (navDrawer.classList.contains('open')) {
            /* Instant close — the 200ms fade would otherwise mask scroll start. */
            navDrawer.classList.add('no-anim');
            closeNav();
            requestAnimationFrame(() => requestAnimationFrame(() => navDrawer.classList.remove('no-anim')));
        }
        navbar.classList.remove('is-hidden');
        /* Destination content must be readable on arrival, not fade in late. */
        revealNow(target);
        smoothScrollTo(anchorTargetY(target), () => flashTitle(target));
        history.replaceState(null, '', id);
    });
});

if (toTop) {
    toTop.addEventListener('click', () => {
        navbar.classList.remove('is-hidden');
        smoothScrollTo(0);
    });
}

/* =============================================
   SCROLL HUB — one rAF-throttled scroll handler
   ============================================= */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
let ticking = false;
let lastY = window.scrollY;

/* Cache section offsets — reading offsetTop every scroll frame
   forces a synchronous layout each time (scroll jank). */
let sectionTops = [];
function cacheSectionTops() {
    sectionTops = Array.prototype.map.call(sections, s => ({ id: s.id, top: s.offsetTop }));
}
cacheSectionTops();
window.addEventListener('load', cacheSectionTops);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(cacheSectionTops);

function syncActiveLink(y) {
    const de = document.documentElement;
    const atBottom = window.innerHeight + y >= de.scrollHeight - 2;
    let current = '';
    for (let i = 0; i < sectionTops.length; i++) {
        if (y >= sectionTops[i].top - 160) current = sectionTops[i].id;
    }
    if (atBottom && sections.length) current = sections[sections.length - 1].id;
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}

function onScrollFrame() {
    ticking = false;
    const y = window.scrollY;
    const goingDown = y > lastY;

    /* Navbar state + hide on scroll down */
    navbar.classList.toggle('scrolled', y > 30);
    if (!prefersReduced && !navDrawer.classList.contains('open')) {
        navbar.classList.toggle('is-hidden', goingDown && y > 320);
    } else {
        navbar.classList.remove('is-hidden');
    }
    lastY = y;

    /* Progress bar */
    if (progressBar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(y / max, 1) : 0;
        progressBar.style.transform = 'scaleX(' + p + ')';
    }

    /* Back-to-top */
    if (toTop) toTop.classList.toggle('show', y > 640);

    /* Hero parallax + gentle fade */
    if (!prefersReduced && heroPortrait && y < window.innerHeight * 1.2) {
        heroPortrait.style.transform = 'translate3d(0,' + y * 0.07 + 'px,0)';
        if (heroCopy) {
            heroCopy.style.transform = 'translate3d(0,' + y * -0.04 + 'px,0)';
            heroCopy.style.opacity = String(Math.max(1 - y / (window.innerHeight * 1.1), 0.25));
        }
    }

    syncActiveLink(y);
}

function requestScrollFrame() {
    if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScrollFrame);
    }
}
window.addEventListener('scroll', requestScrollFrame, { passive: true });
onScrollFrame();

/* =============================================
   SCROLL REVEAL
   ============================================= */
const reveals = document.querySelectorAll('.reveal');
let revealObserver = null;

/* Make a section's content visible immediately (used on nav jumps
   so the destination is readable the moment scrolling lands). */
function revealNow(root) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('.reveal:not(.visible)').forEach(el => {
        el.classList.add('visible');
        if (revealObserver) revealObserver.unobserve(el);
    });
}

if (prefersReduced || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('visible'));
} else {
    revealObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    reveals.forEach(el => revealObserver.observe(el));

    /* Safety net: only rescue elements already in view,
       never force hidden below-fold content visible. */
    setTimeout(() => {
        reveals.forEach(el => {
            if (el.classList.contains('visible')) return;
            const r = el.getBoundingClientRect();
            if (r.top < window.innerHeight && r.bottom > 0) {
                el.classList.add('visible');
                revealObserver.unobserve(el);
            }
        });
    }, 2000);
}

/* =============================================
   THEME TOGGLE — dark / light, persisted
   (initial theme is set pre-paint in <head>)
   ============================================= */
const themeToggle = document.getElementById('themeToggle');
const themeMeta = document.getElementById('themeColor');

function applyTheme(theme) {
    const t = theme === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = t;
    try {
        localStorage.setItem('sv-theme', t);
    } catch (e) { /* storage unavailable — theme still applies */ }
    if (themeMeta) themeMeta.setAttribute('content', t === 'light' ? '#f5f6fa' : '#0a0a12');
    if (themeToggle) {
        const isLight = t === 'light';
        themeToggle.setAttribute('aria-pressed', String(isLight));
        themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
        themeToggle.setAttribute('title', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
    });
}
/* Sync button label / meta with the pre-paint theme */
applyTheme(document.documentElement.dataset.theme);

/* =============================================
   WORK-CARD TILT + GLARE (fine pointers only)
   ============================================= */
if (!prefersReduced && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.work-card').forEach(card => {
        let raf = 0;

        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const rx = (0.5 - py) * 8;
                const ry = (px - 0.5) * 10;
                card.style.transform =
                    'translateY(-4px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
                card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
                card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
                card.classList.add('is-tilting');
            });
        });

        card.addEventListener('mouseleave', () => {
            if (raf) cancelAnimationFrame(raf);
            card.classList.remove('is-tilting');
            card.style.transform = '';
        });
    });
}
