// ===== SERVICE DATA =====
const serviceConfig = {
    cleaning: {
        emoji: '🧹',
        title: 'Cleaning Pros near you',
        subtitle: 'Browse verified cleaners in your city — read reviews, compare prices, and book instantly.',
        label: 'Cleaning',
        specialty: ['Home Cleaner', 'Deep Clean Specialist', 'Office Cleaner', 'Post-Renovation Cleaner'],
        tags: [['Top Pro'], ['New'], [], ['Top Pro'], []],
    },
    plumbing: {
        emoji: '🔧',
        title: 'Plumbing Pros near you',
        subtitle: 'Find experienced plumbers available today — leaks, installations, and everything in between.',
        label: 'Plumbing',
        specialty: ['Master Plumber', 'Pipe Specialist', 'Emergency Plumber', 'Installation Expert'],
        tags: [['Top Pro'], [], [], ['Top Pro'], []],
    },
    electricity: {
        emoji: '⚡',
        title: 'Electricians near you',
        subtitle: 'Certified electricians for wiring, installations, and repairs — safe and reliable.',
        label: 'Electrical',
        specialty: ['Certified Electrician', 'Wiring Specialist', 'Installation Expert', 'Emergency Electrician'],
        tags: [['Top Pro'], [], [], ['Top Pro'], []],
    },
    furniture: {
        emoji: '🪑',
        title: 'Furniture Assembly Pros near you',
        subtitle: 'Fast and careful furniture assembly — IKEA, flat-pack, and more.',
        label: 'Furniture Assembly',
        specialty: ['IKEA Specialist', 'Furniture Expert', 'Assembly Pro', 'Home Setup Specialist'],
        tags: [['New'], ['Top Pro'], [], [], ['Top Pro']],
    },
    painting: {
        emoji: '🖌️',
        title: 'Painters near you',
        subtitle: 'Professional painters for walls, rooms, and full apartments — clean finish guaranteed.',
        label: 'Painting',
        specialty: ['Interior Painter', 'Exterior Painter', 'Room Painter', 'Touch-up Specialist'],
        tags: [['Top Pro'], [], ['New'], ['Top Pro'], []],
    }
};

const moroccanNames = [
    { name: 'Fatima B.', avatar: 'F', city: 'Casablanca', bg: '#DBEAFE', color: '#1D4ED8' },
    { name: 'Youssef M.', avatar: 'Y', city: 'Rabat', bg: '#D1FAE5', color: '#065F46' },
    { name: 'Khalid O.', avatar: 'K', city: 'Marrakech', bg: '#FEF3C7', color: '#92400E' },
    { name: 'Amina R.', avatar: 'A', city: 'Casablanca', bg: '#FCE7F3', color: '#9D174D' },
    { name: 'Hassan E.', avatar: 'H', city: 'Fès', bg: '#E0E7FF', color: '#3730A3' },
    { name: 'Nadia S.', avatar: 'N', city: 'Tanger', bg: '#FEE2E2', color: '#991B1B' },
    { name: 'Omar T.', avatar: 'O', city: 'Agadir', bg: '#ECFDF5', color: '#064E3B' },
    { name: 'Samira L.', avatar: 'S', city: 'Casablanca', bg: '#F5F3FF', color: '#5B21B6' },
    { name: 'Rachid A.', avatar: 'R', city: 'Rabat', bg: '#FFF7ED', color: '#9A3412' },
    { name: 'Zineb B.', avatar: 'Z', city: 'Casablanca', bg: '#F0F9FF', color: '#0C4A6E' },
    { name: 'Mehdi K.', avatar: 'M', city: 'Marrakech', bg: '#FEFCE8', color: '#713F12' },
    { name: 'Laila H.', avatar: 'L', city: 'Tanger', bg: '#F0FDF4', color: '#14532D' },
];

const bios = [
    'Experienced professional with years of hands-on work across Casablanca. Clean, punctual, and reliable — your satisfaction is guaranteed.',
    'Certified and fully equipped. I take pride in quality work and treat every home like my own. Available 7 days a week.',
    'Trusted by hundreds of customers across Morocco. Fast response, competitive rates, and always on time.',
    'Passionate about delivering top-notch results. I bring all necessary tools and materials. No hidden fees.',
    'Dedicated professional focused on quality and customer satisfaction. Quick response to messages and bookings.',
];

function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generatePros(service) {
    // Pull from shared PROS_DB (pros-data.js) and add per-card display fields
    const matching = getProsByService(service);
    return matching.map(p => ({
        ...p,
        tags: p.isElite ? ['Top Pro'] : (p.jobs < 50 ? ['New'] : []),
        isTopPro: p.isElite,
        bio: p.about,
    })).sort((a, b) => b.rating - a.rating);
}

function tagClass(tag) {
    if (tag === 'Top Pro') return 'pro-tag top';
    if (tag === 'New')     return 'pro-tag new';
    return 'pro-tag';
}

function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let stars = '★'.repeat(full);
    if (half) stars += '½';
    return stars;
}

function buildCard(pro, isListView = false) {
    const listClass = isListView ? ' list-view' : '';
    return `
        <div class="pro-listing-card${listClass}" onclick="window.location.href='pro-profile.html?id=${pro.id}'">
            ${pro.isTopPro ? '<div class="top-pro-badge">🏆 Top Pro</div>' : ''}
            <div class="pro-card-avatar-area">
                <div class="pro-listing-avatar" style="background:${pro.avatarBg}; color:${pro.avatarColor}">
                    ${pro.avatar}
                </div>
                ${pro.isElite
                    ? '<div class="pro-elite-badge"><span>⭐</span> Elite Pro</div>'
                    : pro.idVerified ? '<div class="pro-verified-badge">✅ Verified</div>' : ''
                }
            </div>
            <div class="pro-card-body">
                <div class="pro-listing-name">${pro.name}</div>
                <div class="pro-listing-specialty">${pro.specialty} · ${pro.experience} yrs exp</div>
                <div class="pro-listing-rating">
                    <span class="stars">${renderStars(pro.rating)}</span>
                    <span class="rating-num">${pro.rating}</span>
                    <span class="rating-count">(${pro.reviews} reviews)</span>
                </div>
                <div class="pro-listing-tags">
                    ${pro.tags.map(t => `<span class="${tagClass(t)}">${t}</span>`).join('')}
                    ${pro.repliesFast ? '<span class="pro-tag fast-reply">⚡ Replies fast</span>' : ''}
                </div>
                <div class="pro-listing-bio">${pro.bio}</div>
                ${pro.isElite ? `<div class="elite-stats"><span>✅ ${pro.jobs} jobs done</span></div>` : ''}
            </div>
            <div class="pro-card-footer">
                <div>
                    <div class="pro-jobs-done">✅ ${pro.jobs} jobs done</div>
                    <div class="pro-city-tag">📍 ${pro.city}</div>
                </div>
                <a href="pro-profile.html?id=${pro.id}" class="btn btn-primary btn-book" onclick="event.stopPropagation()">
                    Get Quote
                </a>
            </div>
        </div>
    `;
}

// ===== STATE =====
let currentService = 'cleaning';
let allPros = [];
let visibleCount = 8;
let isListView = false;

function renderPros() {
    const grid = document.getElementById('prosGrid');

    if (allPros.length === 0) {
        grid.innerHTML = `
            <div class="no-pros-state">
                <div class="no-pros-emoji">🔍</div>
                <h3>No Pros found</h3>
                <p>We don't have any pros in this city for this service yet. Try a different city or service — or post a job and let Pros come to you.</p>
                <a href="post-job.html" class="btn btn-primary">Post a Job</a>
            </div>
        `;
        document.getElementById('listingsCount').textContent = 'No professionals match your filters';
        document.getElementById('loadMoreBtn').style.display = 'none';
        return;
    }

    grid.innerHTML = allPros.slice(0, visibleCount).map(p => buildCard(p, isListView)).join('');
    document.getElementById('listingsCount').textContent =
        `Showing ${Math.min(visibleCount, allPros.length)} of ${allPros.length} professionals`;

    const loadBtn = document.getElementById('loadMoreBtn');
    loadBtn.style.display = visibleCount >= allPros.length ? 'none' : 'inline-flex';
}

function loadMore() {
    visibleCount += 4;
    renderPros();
}

function setView(view) {
    isListView = view === 'list';
    const grid = document.getElementById('prosGrid');
    grid.classList.toggle('list-view', isListView);
    document.getElementById('gridViewBtn').classList.toggle('active', !isListView);
    document.getElementById('listViewBtn').classList.toggle('active', isListView);
    renderPros();
}

function applyFilters() {
    const city      = document.getElementById('cityFilter').value;
    const sort      = document.getElementById('sortFilter').value;
    const minRating = parseFloat(document.querySelector('input[name="rating"]:checked')?.value || 0);
    const eliteOnly = document.getElementById('filterElite')?.checked;
    const verifiedOnly = document.getElementById('filterVerified')?.checked;

    let filtered = [...generatePros(currentService, 12)];

    if (city)         filtered = filtered.filter(p => p.city.toLowerCase() === city.toLowerCase());
    if (minRating)    filtered = filtered.filter(p => p.rating >= minRating);
    if (eliteOnly)    filtered = filtered.filter(p => p.isElite);
    if (verifiedOnly) filtered = filtered.filter(p => p.idVerified || p.isElite);

    if (sort === 'rating')  filtered.sort((a, b) => b.rating - a.rating);
    else if (sort === 'jobs')    filtered.sort((a, b) => b.jobs - a.jobs);
    else if (sort === 'reviews') filtered.sort((a, b) => b.reviews - a.reviews);

    allPros = filtered;
    visibleCount = 8;
    renderPros();
}

function resetFilters() {
    document.getElementById('cityFilter').value = '';
    document.getElementById('sortFilter').value = 'rating';
    document.getElementById('availFilter').value = '';
    document.querySelectorAll('input[name="rating"]')[0].checked = true;
    const fe = document.getElementById('filterElite');
    const fv = document.getElementById('filterVerified');
    if (fe) fe.checked = false;
    if (fv) fv.checked = false;
    allPros = generatePros(currentService, 12);
    visibleCount = 8;
    renderPros();
}

// ===== INIT =====
function init() {
    // Read service type + city from URL
    const params = new URLSearchParams(window.location.search);
    currentService = params.get('type') || 'cleaning';
    const cityParam = params.get('city');
    const config = serviceConfig[currentService] || serviceConfig.cleaning;

    // Update page content
    document.getElementById('heroEmoji').textContent = config.emoji;
    document.getElementById('heroTitle').textContent = config.title;
    document.getElementById('heroSubtitle').textContent = config.subtitle;
    document.getElementById('breadcrumbService').textContent = config.label;
    document.title = `${config.label} Pros near you — Brikol`;

    // Pre-fill the city filter if passed in URL
    if (cityParam) {
        const cityFilter = document.getElementById('cityFilter');
        if (cityFilter) {
            const match = Array.from(cityFilter.options).find(o => o.value === cityParam);
            if (match) cityFilter.value = cityParam;
        }
    }

    // Generate and render pros
    allPros = generatePros(currentService, 12);
    renderPros();

    // Apply city filter immediately if URL had one
    if (cityParam && typeof applyFilters === 'function') applyFilters();
}

init();

// Update service links on landing page
document.querySelectorAll('[data-service]').forEach(card => {
    card.addEventListener('click', () => {
        const type = card.dataset.service;
        window.location.href = `service.html?type=${type}`;
    });
});
