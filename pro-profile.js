// ===== DARK MODE =====
(function () {
    const saved = localStorage.getItem('brikol-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
})();

function updateLogos(theme) {
    document.querySelectorAll('img[src*="logo"]').forEach(img => {
        if (theme === 'dark') {
            img.src = img.src.replace('logo.svg', 'logo-dark.svg');
        } else {
            img.src = img.src.replace('logo-dark.svg', 'logo.svg');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.addEventListener('click', () => {
            const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('brikol-theme', next);
            updateLogos(next);
        });
    }
    updateLogos(document.documentElement.getAttribute('data-theme') || 'light');
});

// ===== MOCK PRO DATA =====
const pros = {
    default: {
        name: 'Fatima B.', firstName: 'Fatima',
        avatar: 'F', avatarBg: '#DBEAFE', avatarColor: '#1D4ED8',
        specialty: 'Home Cleaner', experience: 5, city: 'Casablanca',
        rating: 4.9, reviews: 124, jobs: 187,
        startingPrice: 120,
        isElite: true,
        idVerified: true,
        repliesFast: true,
        services: ['cleaning', 'deep'],
        tags: [],
        about: 'Experienced professional with years of hands-on work across Casablanca. Clean, punctual, and reliable — your satisfaction is guaranteed. I bring all my own equipment and use eco-friendly products upon request. Weekend bookings are available.',
        serviceType: 'cleaning',
    }
};

const serviceLabels = {
    cleaning: { emoji: '🧹', label: 'Home Cleaning' },
    deep:     { emoji: '🧹', label: 'Deep Cleaning' },
    plumbing: { emoji: '🔧', label: 'Plumbing' },
    electricity: { emoji: '⚡', label: 'Electrical' },
    furniture: { emoji: '🪑', label: 'Furniture Assembly' },
    painting: { emoji: '🖌️', label: 'Home Painting' },
};

const reviewTexts = [
    "Fatima was absolutely fantastic! On time, professional, and left my apartment spotless. Will definitely book again.",
    "Very thorough and efficient. She noticed details I hadn't even mentioned. Highly recommend!",
    "Great service, friendly and fast. My apartment looks brand new. 5 stars all the way.",
    "Booked for a deep clean before moving in. She did an incredible job, very worth it.",
    "Professional, polite, and very efficient. The apartment smells amazing. Thank you!",
    "Second time booking Fatima and she never disappoints. True professional.",
    "Showed up on time, brought her own supplies, and worked non-stop. Outstanding.",
    "Best cleaning service I've had in Casablanca. Already booked her for next month.",
];

const reviewerNames = [
    { name: 'Nadia R.',   city: 'Casablanca', avatar: 'N' },
    { name: 'Mehdi A.',   city: 'Rabat',       avatar: 'M' },
    { name: 'Sara E.',    city: 'Casablanca', avatar: 'S' },
    { name: 'Karim B.',   city: 'Marrakech',  avatar: 'K' },
    { name: 'Leila H.',   city: 'Casablanca', avatar: 'L' },
    { name: 'Omar T.',    city: 'Tanger',     avatar: 'O' },
    { name: 'Amine Z.',   city: 'Fès',        avatar: 'A' },
    { name: 'Yasmine S.', city: 'Casablanca', avatar: 'Y' },
];

const reviewDates = ['2 days ago', '1 week ago', '2 weeks ago', '3 weeks ago', '1 month ago', '1 month ago', '2 months ago', '2 months ago'];

// ===== RENDER PRO PROFILE =====
function renderProfile() {
    // Read id from URL — fall back to pro #1 if missing/invalid
    const params = new URLSearchParams(window.location.search);
    const proId = params.get('id');
    const pro = (typeof getProById === 'function' && getProById(proId)) || PROS_DB[0];

    // Derive display-only fields
    pro.tags = pro.tags || (pro.isElite ? ['Top Pro'] : (pro.jobs < 50 ? ['New'] : []));
    pro.serviceType = pro.serviceType || pro.mainService;

    // Update the global so helper functions (rating breakdown, reviews) have the right data
    pros.default = pro;
    document.title = `${pro.name} — Brikol`;

    // Avatar
    const avatar = document.getElementById('proAvatar');
    avatar.textContent = pro.avatar;
    avatar.style.background = pro.avatarBg;
    avatar.style.color = pro.avatarColor;

    // Header info
    document.getElementById('proName').textContent      = pro.name;
    document.getElementById('proSpecialty').textContent = `${pro.specialty} · ${pro.experience} yrs exp`;
    document.getElementById('proRating').textContent    = pro.rating;
    document.getElementById('proReviews').textContent   = `(${pro.reviews} reviews)`;
    document.getElementById('proJobs').textContent      = pro.jobs;
    document.getElementById('proAbout').textContent     = pro.about;
    document.getElementById('breadcrumbName').textContent = pro.name;

    // Location
    const locationEl = document.getElementById('proLocation');
    if (locationEl) {
        locationEl.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${pro.city}, Morocco
        `;
    }

    // Panel
    document.getElementById('panelProName').textContent = pro.firstName;

    // City label in form
    const proCity2 = document.getElementById('proCity2');
    if (proCity2) proCity2.textContent = pro.city;

    // Elite badge
    if (pro.isElite) document.getElementById('eliteBadge').style.display = 'inline-flex';

    // Tags — only show Verified if pro has submitted their ID
    const tagsEl = document.getElementById('proTags');
    const tags = [...pro.tags];
    if (pro.idVerified) tags.push('Verified');
    tagsEl.innerHTML = tags.map(t => {
        let cls = 'profile-tag';
        if (t === 'Verified') cls += ' verified';
        return `<span class="${cls}">${t}</span>`;
    }).join('');

    // Services banner
    const servicesEl = document.getElementById('proServices');
    servicesEl.innerHTML = pro.services.map(s => {
        const info = serviceLabels[s] || { emoji: '🔨', label: s };
        return `<a href="service.html?type=${s}" class="service-tag-pill">${info.emoji} ${info.label}</a>`;
    }).join('');

    // Rating breakdown
    renderRatingBreakdown(pro.rating);

    // Reviews
    renderReviews(4);

    // Breadcrumb service link
    document.getElementById('breadcrumbService').href = `service.html?type=${pro.serviceType}`;
    document.getElementById('breadcrumbService').textContent = serviceLabels[pro.serviceType]?.label || 'Service';
}

// ===== RATING BREAKDOWN =====
function renderRatingBreakdown(avg) {
    document.getElementById('ratingBig').textContent    = avg;
    document.getElementById('reviewCount').textContent  = `(${pros.default.reviews})`;

    const distribution = [
        { stars: 5, pct: 82 },
        { stars: 4, pct: 12 },
        { stars: 3, pct:  4 },
        { stars: 2, pct:  1 },
        { stars: 1, pct:  1 },
    ];

    const barsEl = document.getElementById('ratingBars');
    barsEl.innerHTML = distribution.map(d => `
        <div class="rating-bar-row">
            <span>${d.stars} ★</span>
            <div class="rating-bar-track">
                <div class="rating-bar-fill" style="width:${d.pct}%"></div>
            </div>
            <span class="rating-bar-count">${d.pct}%</span>
        </div>
    `).join('');
}

// ===== REVIEWS =====
let reviewsShown = 4;

function renderReviews(count) {
    const list = document.getElementById('reviewsList');
    const reviews = [];

    for (let i = 0; i < count; i++) {
        const reviewer = reviewerNames[i % reviewerNames.length];
        const stars = i < 5 ? 5 : 4;
        reviews.push(`
            <div class="review-card">
                <div class="review-header">
                    <div class="reviewer-avatar">${reviewer.avatar}</div>
                    <div class="reviewer-info">
                        <div class="reviewer-name">${reviewer.name}</div>
                        <div class="reviewer-meta">${reviewer.city} · ${reviewDates[i % reviewDates.length]}</div>
                    </div>
                    <div class="review-stars">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</div>
                </div>
                <p class="review-text">${reviewTexts[i % reviewTexts.length]}</p>
            </div>
        `);
    }

    list.innerHTML = reviews.join('');
    const loadBtn = document.getElementById('loadMoreReviews');
    if (loadBtn) loadBtn.style.display = reviewsShown >= pros.default.reviews ? 'none' : 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
    const loadBtn = document.getElementById('loadMoreReviews');
    if (loadBtn) loadBtn.addEventListener('click', () => {
        reviewsShown += 4;
        renderReviews(Math.min(reviewsShown, 8));
    });
});

// ===== DATE OPTION SELECTION =====
let selectedDate = 'today';

function selectDateOpt(el, value) {
    selectedDate = value;
    document.querySelectorAll('.date-opt').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
}

// ===== TEXTAREA CHAR COUNTER =====
document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('jobDescription');
    const counter  = document.getElementById('descCount');
    if (textarea && counter) {
        textarea.addEventListener('input', () => {
            counter.textContent = textarea.value.length;
            // Clear error on typing
            const err = document.getElementById('descError');
            if (err && textarea.value.trim().length > 0) err.textContent = '';
        });
    }
});

// ===== QUOTE FORM SUBMISSION =====
document.addEventListener('DOMContentLoaded', () => {
    const form    = document.getElementById('quoteForm');
    const success = document.getElementById('quoteSuccess');
    const sendBtn = document.getElementById('sendQuoteBtn');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const desc    = document.getElementById('jobDescription');
        const descErr = document.getElementById('descError');

        // Validate description
        if (!desc || desc.value.trim().length < 10) {
            if (descErr) descErr.textContent = 'Please describe your issue (at least 10 characters).';
            desc && desc.focus();
            return;
        }

        // Simulate sending
        sendBtn.disabled   = true;
        sendBtn.textContent = 'Sending…';

        setTimeout(() => {
            // Hide form fields, show success
            form.querySelectorAll('.book-field').forEach(f => f.style.display = 'none');
            sendBtn.style.display = 'none';
            if (success) success.style.display = 'flex';
        }, 900);
    });
});

// ===== SAVE / SHARE =====
function toggleSave(btn) {
    btn.classList.toggle('saved');
}

function sharePro() {
    if (navigator.share) {
        navigator.share({ title: 'Check out this Pro on Brikol', url: window.location.href });
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', renderProfile);
