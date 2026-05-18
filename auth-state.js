// ===== SHARED AUTH STATE =====
// Runs on every public page (index, service, pro-profile, post-job)
// Reads brikol-user from localStorage and swaps nav buttons accordingly.

(function () {
    const user = getCurrentUser();
    if (!user) return; // not logged in — leave Log in / Sign up buttons as-is
    renderLoggedInNav(user);
})();

function getCurrentUser() {
    try {
        const raw = localStorage.getItem('brikol-user');
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
}

function setCurrentUser(user) {
    localStorage.setItem('brikol-user', JSON.stringify(user));
}

function logoutUser() {
    localStorage.removeItem('brikol-user');
    window.location.href = 'index.html';
}

function renderLoggedInNav(user) {
    const dashboardLink = user.role === 'pro' ? 'dashboard-pro.html' : 'dashboard-customer.html';
    const firstName = user.name.split(' ')[0];
    const initial = firstName.charAt(0).toUpperCase();
    const roleLabel = user.role === 'pro' ? 'Pro account' : 'Customer';

    const userMenuHTML = `
        <div class="user-menu" id="userMenu">
            <button class="user-menu-btn" onclick="toggleUserMenu(event)">
                <div class="user-menu-avatar">${initial}</div>
                <span class="user-menu-name">${firstName}</span>
                <svg class="user-menu-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="user-menu-dropdown hidden" id="userMenuDropdown">
                <div class="user-menu-header">
                    <div class="user-menu-avatar lg">${initial}</div>
                    <div>
                        <div class="user-menu-fullname">${user.name}</div>
                        <div class="user-menu-role">${roleLabel}</div>
                    </div>
                </div>
                <a href="${dashboardLink}" class="user-menu-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                    My Dashboard
                </a>
                ${user.role === 'pro' ? `
                    <a href="pro-profile.html" class="user-menu-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        My Public Profile
                    </a>
                ` : `
                    <a href="post-job.html" class="user-menu-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Post a Job
                    </a>
                `}
                <div class="user-menu-divider"></div>
                <button class="user-menu-item logout" onclick="logoutUser()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Log out
                </button>
            </div>
        </div>
    `;

    // Desktop nav
    document.querySelectorAll('.nav-actions').forEach(navActions => {
        navActions.querySelectorAll('a.btn-ghost, a.btn-primary').forEach(btn => {
            if (btn.textContent.trim().match(/Log in|Sign up/i)) btn.remove();
        });
        navActions.insertAdjacentHTML('beforeend', userMenuHTML);
    });

    // Mobile menu
    document.querySelectorAll('.mobile-actions').forEach(mobile => {
        mobile.innerHTML = `
            <a href="${dashboardLink}" class="btn btn-primary">My Dashboard</a>
            <button class="btn btn-ghost" onclick="logoutUser()">Log out</button>
        `;
    });
}

function toggleUserMenu(e) {
    e.stopPropagation();
    document.getElementById('userMenuDropdown').classList.toggle('hidden');
}

// Close dropdown on outside click
document.addEventListener('click', (e) => {
    const menu = document.getElementById('userMenu');
    if (menu && !menu.contains(e.target)) {
        const dropdown = document.getElementById('userMenuDropdown');
        if (dropdown) dropdown.classList.add('hidden');
    }
});
