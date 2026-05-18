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

// ===== NAVBAR SCROLL =====
// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
});

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
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    fadeObserver.observe(el);
});
