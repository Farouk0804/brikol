// ===== DARK MODE =====
(function () {
    const saved = localStorage.getItem('brikol-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
})();

function updateLogos(theme) {
    document.querySelectorAll('img[src*="logo"]').forEach(img => {
        if (img.src.includes('logo-options') || img.src.includes('logo-preview')) return;
        if (theme === 'dark') {
            img.src = img.src.replace('logo.svg', 'logo-dark.svg');
        } else {
            img.src = img.src.replace('logo-dark.svg', 'logo.svg');
        }
    });
}

function initThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('brikol-theme', next);
        updateLogos(next);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    // Set correct logo on initial load
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    updateLogos(theme);
});

// ===== SCROLL MOTION ENGINE =====
// One rAF loop drives: navbar state, smart hide/show, parallax blobs, hero fade
const navbar = document.getElementById('navbar');
const heroBg = document.querySelector('.hero-bg');
const heroContent = document.querySelector('.hero-content');
const blobs = document.querySelectorAll('.hero-blob');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lastY = window.scrollY;
let ticking = false;

function onScroll() {
    const y = window.scrollY;

    // Navbar background
    navbar.classList.toggle('scrolled', y > 20);

    // Smart navbar: hide scrolling down, show scrolling up (only after hero)
    if (y > 400 && y > lastY + 4) {
        navbar.classList.add('nav-hidden');
    } else if (y < lastY - 4 || y < 400) {
        navbar.classList.remove('nav-hidden');
    }
    lastY = y;

    if (!reducedMotion) {
        // Parallax: blobs drift at different speeds
        blobs.forEach((blob, i) => {
            const speed = [0.25, 0.4, 0.15][i] || 0.2;
            blob.style.transform = `translateY(${y * speed}px)`;
        });

        // Hero content gently fades and rises away as you scroll past
        if (heroContent && y < window.innerHeight) {
            const progress = Math.min(y / (window.innerHeight * 0.8), 1);
            heroContent.style.opacity = 1 - progress * 0.6;
            heroContent.style.transform = `translateY(${y * 0.12}px)`;
        }
    }

    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
    }
}, { passive: true });

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Language switcher
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Animated stat counters
function animateCounter(el, target, suffix = '') {
    const duration = 2000;
    const start = performance.now();
    const startVal = 0;

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(startVal + (target - startVal) * eased);
        el.textContent = current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target);
            const suffix = el.dataset.target === '98' ? '%' : (target >= 1000 ? '+' : (target === 8 ? '' : '+'));
            animateCounter(el, target, suffix);
            statObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Search handler
function handleSearch() {
    const service = document.getElementById('serviceSelect').value;
    const city = document.getElementById('citySelect').value;

    if (!service || !city) {
        const missing = !service ? 'serviceSelect' : 'citySelect';
        const el = document.getElementById(missing);
        el.style.outline = '2px solid #EF4444';
        el.style.borderRadius = '6px';
        setTimeout(() => el.style.outline = '', 1500);
        return;
    }

    window.location.href = `service.html?type=${service}&city=${city}`;
}

// Notify form
document.getElementById('notifyForm').addEventListener('submit', e => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const btn = e.target.querySelector('button');
    btn.textContent = 'You\'re on the list!';
    btn.style.background = '#10B981';
    btn.disabled = true;
    input.disabled = true;
    input.value = '';
    input.placeholder = 'We\'ll be in touch!';
});

// Fade-in on scroll
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.step-card, .service-card, .testimonial-card, .why-feature, .pro-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    // Stagger: each card in the same row/grid waits a bit longer than its sibling
    const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains(el.classList[0]));
    const index = siblings.indexOf(el);
    const delay = Math.min(index * 0.08, 0.4);
    el.style.transition = `opacity 0.5s ease ${delay}s, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`;
    fadeObserver.observe(el);
});

// Class-based reveals: section headers (blur-to-sharp) and side slide-ins
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.section-header, .why-features, .why-visual, .become-pro-content, .become-pro-visual')
    .forEach(el => revealObserver.observe(el));
