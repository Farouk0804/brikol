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

// ===== TAB NAVIGATION =====
const tabTitles = {
    jobs: 'My Jobs',
    quotes: 'Quotes',
    history: 'History',
    profile: 'My Profile',
};

function showTab(tabId, navEl) {
    // Hide all tabs
    document.querySelectorAll('.dash-tab').forEach(t => t.classList.add('hidden'));
    // Show selected
    document.getElementById(`tab-${tabId}`).classList.remove('hidden');

    // Update nav active state
    document.querySelectorAll('.dash-nav-item').forEach(n => n.classList.remove('active'));
    if (navEl) navEl.classList.add('active');

    // Update topbar title
    document.getElementById('topbarTitle').textContent = tabTitles[tabId] || tabId;

    // Close sidebar on mobile
    closeSidebar();
}

// ===== SIDEBAR TOGGLE (mobile) =====
function toggleSidebar() {
    const sidebar  = document.getElementById('dashSidebar');
    const overlay  = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('visible');
}

function closeSidebar() {
    document.getElementById('dashSidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('visible');
}

// ===== JOB EXPAND / COLLAPSE =====
function toggleJob(jobId, btn) {
    const panel = document.getElementById(`${jobId}-quotes`);
    if (!panel) return;
    const isOpen = panel.classList.contains('open');
    panel.classList.toggle('open', !isOpen);
    btn.classList.toggle('open', !isOpen);
    btn.childNodes[0].textContent = isOpen ? 'View quotes ' : 'Hide quotes ';
}

// ===== ACCEPT QUOTE =====
function acceptQuote(btn, jobId) {
    const quoteItem = btn.closest('.quote-item');
    const allQuotes = quoteItem.closest('.quotes-list').querySelectorAll('.quote-item');
    const proName   = quoteItem.querySelector('.quote-pro-name').childNodes[0].textContent.trim();
    const price     = quoteItem.querySelector('.quote-price').textContent.trim();

    // Mark accepted / declined
    allQuotes.forEach(q => {
        if (q === quoteItem) {
            q.classList.add('accepted');
            q.querySelector('.quote-actions').innerHTML = '<span style="font-size:0.82rem;font-weight:700;color:#16A34A;">✅ Accepted</span>';
        } else {
            q.classList.add('declined');
        }
    });

    // Update job card status
    const jobCard = document.getElementById(jobId);
    if (jobCard) {
        const statusEl = jobCard.querySelector('.job-status');
        if (statusEl) {
            statusEl.className = 'job-status inprogress';
            statusEl.textContent = '🔄 In progress';
        }

        // Add in-progress bar
        const existingBar = jobCard.querySelector('.job-inprogress-bar');
        if (!existingBar) {
            const bar = document.createElement('div');
            bar.className = 'job-inprogress-bar';
            bar.innerHTML = `
                <div class="inprogress-info">
                    Coordinate with ${proName} to confirm timing and details
                </div>
                <div class="inprogress-contact">
                    <a href="tel:+212600000000" class="btn-contact btn-call" title="Call ${proName}">📞</a>
                    <a href="https://wa.me/212600000000" class="btn-contact btn-whatsapp-sm" target="_blank" title="WhatsApp ${proName}">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.505A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.028-1.381l-.36-.214-3.732.887.934-3.618-.235-.372A9.818 9.818 0 112 12c0-5.427 4.373-9.818 9.818-9.818 5.427 0 9.818 4.391 9.818 9.818 0 5.427-4.391 9.818-9.818 9.818z"/></svg>
                    </a>
                    <span class="inprogress-price">${price} agreed</span>
                </div>
            `;
            jobCard.querySelector('.job-quotes-panel').after(bar);
        }
    }
}

// ===== DECLINE QUOTE =====
function declineQuote(btn) {
    const quoteItem = btn.closest('.quote-item');
    quoteItem.classList.add('declined');
    btn.closest('.quote-actions').innerHTML = '<span style="font-size:0.78rem;color:#94A3B8;">Declined</span>';
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
