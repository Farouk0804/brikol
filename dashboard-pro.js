// ===== DARK MODE =====
(function () {
    const saved = localStorage.getItem('brikol-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
})();

// ===== THEME TOGGLE + LOGO SWAP =====
function updateLogos(theme) {
    document.querySelectorAll('img[src*="logo"]').forEach(img => {
        if (theme === 'dark') {
            img.src = img.src.replace('logo.svg', 'logo-dark.svg');
        } else {
            img.src = img.src.replace('logo-dark.svg', 'logo.svg');
        }
    });
}

function toggleTheme() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('brikol-theme', next);
    updateLogos(next);
}

// ===== PRO PROFILE DATA =====
const proProfile = {
    name: 'Fatima B.',
    services: ['cleaning'], // services this pro offers
};

// ===== TAB NAVIGATION =====
const tabTitles = {
    jobs:     'Available Jobs',
    quotes:   'My Quotes',
    active:   'Active Jobs',
    earnings: 'Earnings',
    profile:  'My Profile',
};

function showTab(tabId, navEl) {
    document.querySelectorAll('.dash-tab').forEach(t => t.classList.add('hidden'));
    document.getElementById(`tab-${tabId}`).classList.remove('hidden');
    document.querySelectorAll('.dash-nav-item').forEach(n => n.classList.remove('active'));
    if (navEl) navEl.classList.add('active');
    document.getElementById('topbarTitle').textContent = tabTitles[tabId] || tabId;
    closeSidebar();
}

// ===== SIDEBAR TOGGLE (mobile) =====
function toggleSidebar() {
    document.getElementById('dashSidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('visible');
}

function closeSidebar() {
    document.getElementById('dashSidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('visible');
}

// ===== JOB MATCHING =====
function initJobMatching() {
    // 1. Filter dropdown: only show services the pro offers
    const select = document.getElementById('filterService');
    Array.from(select.options).forEach(opt => {
        if (opt.value && !proProfile.services.includes(opt.value)) {
            opt.remove();
        }
    });

    // 2. Apply initial match on page load
    applyJobFilters();

    // 3. Wire up filter changes
    document.getElementById('filterService').addEventListener('change', applyJobFilters);
    document.getElementById('filterCity').addEventListener('change', applyJobFilters);

    // 4. Wire up profile service checkboxes so changes update matching live
    document.querySelectorAll('.service-check input').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            proProfile.services = Array.from(
                document.querySelectorAll('.service-check input:checked')
            ).map(cb => cb.closest('.service-check').dataset.service);
            rebuildServiceFilter();
            applyJobFilters();
        });
    });
}

function rebuildServiceFilter() {
    const allOptions = [
        { value: 'cleaning',    label: '🧹 Cleaning' },
        { value: 'plumbing',    label: '🔧 Plumbing' },
        { value: 'electricity', label: '⚡ Electrical' },
        { value: 'furniture',   label: '🪑 Furniture' },
        { value: 'painting',    label: '🖌️ Painting' },
    ];
    const select = document.getElementById('filterService');
    const current = select.value;
    select.innerHTML = '<option value="">All my services</option>';
    allOptions.forEach(opt => {
        if (proProfile.services.includes(opt.value)) {
            const o = document.createElement('option');
            o.value = opt.value;
            o.textContent = opt.label;
            if (opt.value === current) o.selected = true;
            select.appendChild(o);
        }
    });
}

function applyJobFilters() {
    const service = document.getElementById('filterService').value;
    const city    = document.getElementById('filterCity').value;
    const cards   = document.querySelectorAll('.avail-job-card');
    let visible   = 0;

    cards.forEach(card => {
        const matchesProServices = proProfile.services.includes(card.dataset.service);
        const matchService = !service || card.dataset.service === service;
        const matchCity    = !city    || card.dataset.city    === city;
        const show = matchesProServices && matchService && matchCity;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
    });

    // Update counter
    document.querySelector('#tab-jobs .tab-count').textContent = `${visible} near you`;

    // Show/hide empty state
    let emptyState = document.getElementById('jobsEmptyState');
    if (visible === 0) {
        if (!emptyState) {
            emptyState = document.createElement('div');
            emptyState.id = 'jobsEmptyState';
            emptyState.style.cssText = `
                text-align:center; padding:60px 20px; color:var(--gray-400);
            `;
            emptyState.innerHTML = `
                <div style="font-size:2.5rem;margin-bottom:12px">📭</div>
                <div style="font-weight:700;font-size:1rem;color:var(--dark);margin-bottom:6px">No jobs match your filters</div>
                <div style="font-size:0.875rem">Try adjusting your filters or add more services in My Profile.</div>
            `;
            document.querySelector('.available-jobs-list').after(emptyState);
        }
        emptyState.style.display = '';
    } else if (emptyState) {
        emptyState.style.display = 'none';
    }
}

// ===== ONLINE TOGGLE =====
function toggleOnline() {
    const btn = document.getElementById('onlineToggle');
    const dot = document.getElementById('onlineDot');
    const label = document.getElementById('onlineLabel');
    const isActive = btn.classList.toggle('active');
    dot.classList.toggle('active', isActive);
    label.textContent = isActive ? 'Available for jobs' : 'Not available';
}

// ===== QUOTE MODAL =====
function openQuoteModal(btn, jobTitle) {
    document.getElementById('modalJobTitle').textContent = jobTitle;
    document.getElementById('quotePrice').value = '';
    document.getElementById('quoteMessage').value = '';
    document.getElementById('quoteModal').classList.remove('hidden');
    document.getElementById('quotePrice').focus();
    btn.dataset.origin = 'open';
}

function closeQuoteModal() {
    document.getElementById('quoteModal').classList.add('hidden');
}

function submitQuote() {
    const price = document.getElementById('quotePrice').value.trim();
    if (!price) {
        document.getElementById('quotePrice').focus();
        document.getElementById('quotePrice').style.borderColor = '#EF4444';
        setTimeout(() => document.getElementById('quotePrice').style.borderColor = '', 1500);
        return;
    }

    closeQuoteModal();

    // Show success toast
    showToast(`Quote of ${price} MAD sent successfully!`);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    initJobMatching();
    document.getElementById('quoteModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeQuoteModal();
    });
});

// ===== TOAST =====
function showToast(message) {
    const existing = document.getElementById('proToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'proToast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
        background: #16A34A; color: white;
        padding: 12px 24px; border-radius: 100px;
        font-size: 0.875rem; font-weight: 700;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        z-index: 9999; animation: toastIn 0.3s ease;
    `;

    const style = document.createElement('style');
    style.textContent = `@keyframes toastIn { from { opacity:0; transform:translateX(-50%) translateY(10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`;
    document.head.appendChild(style);
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ===== NOTIFICATIONS =====
function toggleNotifications() {
    const dropdown = document.getElementById('notifDropdown');
    dropdown.classList.toggle('hidden');
}

function markRead(item) {
    item.classList.remove('unread');
    const dot = item.querySelector('.notif-dot');
    if (dot) dot.remove();
    updateBadge();
}

function markAllRead() {
    document.querySelectorAll('.notif-item.unread').forEach(item => {
        item.classList.remove('unread');
        const dot = item.querySelector('.notif-dot');
        if (dot) dot.remove();
    });
    updateBadge();
}

function updateBadge() {
    const count = document.querySelectorAll('.notif-item.unread').length;
    const badge = document.getElementById('notifBadge');
    badge.textContent = count > 0 ? count : '';
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const wrap = document.getElementById('notifWrap');
    if (wrap && !wrap.contains(e.target)) {
        document.getElementById('notifDropdown').classList.add('hidden');
    }
});
