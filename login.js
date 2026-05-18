// Login form validation & submission
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        const errorBanner = document.getElementById('loginErrorBanner');

        // Reset errors
        emailError.textContent = '';
        passwordError.textContent = '';
        document.getElementById('email').classList.remove('error');
        document.getElementById('password').classList.remove('error');
        errorBanner.classList.remove('visible');

        let valid = true;

        if (!email) {
            emailError.textContent = 'Email is required';
            document.getElementById('email').classList.add('error');
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailError.textContent = 'Please enter a valid email';
            document.getElementById('email').classList.add('error');
            valid = false;
        }

        if (!password) {
            passwordError.textContent = 'Password is required';
            document.getElementById('password').classList.add('error');
            valid = false;
        }

        if (!valid) return;

        // Show loading state
        const btn = document.getElementById('loginBtn');
        btn.textContent = 'Logging in...';
        btn.disabled = true;

        // Simulate API call — replace with real auth later
        setTimeout(() => {
            // Simulate wrong password for demo
            const isValid = email.includes('@') && password.length >= 8;

            if (isValid) {
                btn.textContent = '✓ Logged in!';
                btn.style.background = '#10B981';
                // Save user state — in real app, role would come from backend
                const isPro = email.toLowerCase().includes('pro');
                localStorage.setItem('brikol-user', JSON.stringify({
                    name: isPro ? 'Fatima Benali' : email.split('@')[0].replace(/[._]/g, ' '),
                    email: email,
                    role: isPro ? 'pro' : 'customer',
                }));
                setTimeout(() => {
                    window.location.href = isPro ? 'dashboard-pro.html' : 'dashboard-customer.html';
                }, 600);
            } else {
                btn.textContent = 'Log in';
                btn.disabled = false;
                errorBanner.classList.add('visible');
                document.getElementById('password').classList.add('error');
                document.getElementById('password').value = '';
                document.getElementById('password').focus();
            }
        }, 1200);
    });
}

// Clear error banner when user starts typing again
['email', 'password'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', () => {
            document.getElementById('loginErrorBanner').classList.remove('visible');
        });
    }
});
