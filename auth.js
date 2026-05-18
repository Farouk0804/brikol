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
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('brikol-theme', next);
            updateLogos(next);
        });
    }
    updateLogos(document.documentElement.getAttribute('data-theme') || 'light');
});

// ===== PASSWORD VISIBILITY TOGGLE =====
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.style.opacity = isPassword ? '1' : '0.5';
}

// ===== PASSWORD STRENGTH =====
function checkPasswordStrength(password, fillId, labelId) {
    const fill = document.getElementById(fillId);
    const label = document.getElementById(labelId);
    if (!fill || !label) return;

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
        { width: '0%',   color: '',          text: '' },
        { width: '25%',  color: '#EF4444',   text: 'Weak' },
        { width: '50%',  color: '#F59E0B',   text: 'Fair' },
        { width: '75%',  color: '#3B82F6',   text: 'Good' },
        { width: '100%', color: '#10B981',   text: 'Strong' },
    ];

    const level = password.length === 0 ? 0 : Math.max(1, strength);
    fill.style.width = levels[level].width;
    fill.style.background = levels[level].color;
    label.textContent = levels[level].text;
    label.style.color = levels[level].color;
}

// Hook up password strength meters
const passwordInput = document.getElementById('password');
if (passwordInput) {
    passwordInput.addEventListener('input', () =>
        checkPasswordStrength(passwordInput.value, 'strengthFill', 'strengthLabel')
    );
}

const proPasswordInput = document.getElementById('proPassword');
if (proPasswordInput) {
    proPasswordInput.addEventListener('input', () =>
        checkPasswordStrength(proPasswordInput.value, 'proStrengthFill', 'proStrengthLabel')
    );
}

// ===== BIO CHARACTER COUNT =====
const bioInput = document.getElementById('bio');
const bioCount = document.getElementById('bioCount');
if (bioInput && bioCount) {
    bioInput.addEventListener('input', () => {
        bioCount.textContent = bioInput.value.length;
    });
}

// ===== VALIDATION HELPERS =====
function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.add('error');
    if (error) error.textContent = message;
    return false;
}

function clearError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.remove('error');
    if (error) error.textContent = '';
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^[0-9\s\-\.]{8,15}$/.test(phone.trim());
}

// ===== CUSTOMER SIGNUP VALIDATION =====
const customerForm = document.getElementById('customerSignupForm');
if (customerForm) {
    customerForm.addEventListener('submit', e => {
        e.preventDefault();
        let valid = true;

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const city = document.getElementById('city').value;
        const password = document.getElementById('password').value;
        const terms = document.getElementById('terms').checked;

        // Clear all errors
        ['firstName','lastName','email','phone','city','password'].forEach(id => {
            clearError(id, id + 'Error');
        });
        document.getElementById('termsError').textContent = '';

        if (!firstName) valid = showError('firstName', 'firstNameError', 'First name is required');
        if (!lastName) valid = showError('lastName', 'lastNameError', 'Last name is required') && valid;
        if (!email) {
            valid = showError('email', 'emailError', 'Email is required') && valid;
        } else if (!validateEmail(email)) {
            valid = showError('email', 'emailError', 'Please enter a valid email') && valid;
        }
        if (!phone) {
            valid = showError('phone', 'phoneError', 'Phone number is required') && valid;
        } else if (!validatePhone(phone)) {
            valid = showError('phone', 'phoneError', 'Please enter a valid phone number') && valid;
        }
        if (!city) valid = showError('city', 'cityError', 'Please select your city') && valid;
        if (!password) {
            valid = showError('password', 'passwordError', 'Password is required') && valid;
        } else if (password.length < 8) {
            valid = showError('password', 'passwordError', 'Password must be at least 8 characters') && valid;
        }
        if (!terms) {
            document.getElementById('termsError').textContent = 'You must agree to the terms';
            valid = false;
        }

        if (valid) {
            const btn = document.getElementById('submitBtn');
            btn.textContent = 'Creating account...';
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                btn.textContent = '✓ Account created!';
                btn.style.background = '#10B981';
                localStorage.setItem('brikol-user', JSON.stringify({
                    name: `${firstName} ${lastName}`,
                    email: email,
                    role: 'customer',
                }));
                setTimeout(() => { window.location.href = 'dashboard-customer.html'; }, 800);
            }, 1500);
        }
    });
}

// ===== PRO SIGNUP: MULTI-STEP =====
let currentStep = 1;

function nextStep(step) {
    if (step === 2 && !validateStep1()) return;
    if (step === 3 && !validateStep2()) return;

    // Hide current
    document.getElementById('step' + currentStep).classList.remove('active');

    // Mark current step as completed in indicator
    const prevStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (prevStepEl) {
        prevStepEl.classList.remove('active');
        prevStepEl.classList.add('completed');
        prevStepEl.querySelector('.step-dot').textContent = '✓';
    }

    // Mark connector as completed
    const lines = document.querySelectorAll('.steps-line');
    if (currentStep <= lines.length) {
        lines[currentStep - 1].classList.add('completed');
    }

    currentStep = step;

    // Show new step
    document.getElementById('step' + currentStep).classList.add('active');

    const newStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (newStepEl) newStepEl.classList.add('active');

    // Scroll to top of form
    document.querySelector('.auth-form-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function prevStep(step) {
    document.getElementById('step' + currentStep).classList.remove('active');

    const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (currentStepEl) {
        currentStepEl.classList.remove('active');
        currentStepEl.classList.remove('completed');
        currentStepEl.querySelector('.step-dot').textContent = currentStep;
    }

    // Undo connector
    const lines = document.querySelectorAll('.steps-line');
    if (step <= lines.length) {
        lines[step - 1].classList.remove('completed');
    }

    currentStep = step;
    document.getElementById('step' + currentStep).classList.add('active');

    const prevStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (prevStepEl) prevStepEl.classList.add('active');
}

function validateStep1() {
    let valid = true;

    const firstName = document.getElementById('proFirstName')?.value.trim();
    const lastName = document.getElementById('proLastName')?.value.trim();
    const email = document.getElementById('proEmail')?.value.trim();
    const phone = document.getElementById('proPhone')?.value.trim();
    const city = document.getElementById('proCity')?.value;
    const password = document.getElementById('proPassword')?.value;

    ['proFirstName','proLastName','proEmail','proPhone','proCity','proPassword'].forEach(id => {
        clearError(id, id + 'Error');
    });

    if (!firstName) valid = showError('proFirstName', 'proFirstNameError', 'First name is required');
    if (!lastName) valid = showError('proLastName', 'proLastNameError', 'Last name is required') && valid;
    if (!email) {
        valid = showError('proEmail', 'proEmailError', 'Email is required') && valid;
    } else if (!validateEmail(email)) {
        valid = showError('proEmail', 'proEmailError', 'Please enter a valid email') && valid;
    }
    if (!phone) {
        valid = showError('proPhone', 'proPhoneError', 'Phone number is required') && valid;
    } else if (!validatePhone(phone)) {
        valid = showError('proPhone', 'proPhoneError', 'Please enter a valid phone number') && valid;
    }
    if (!city) valid = showError('proCity', 'proCityError', 'Please select your city') && valid;
    if (!password) {
        valid = showError('proPassword', 'proPasswordError', 'Password is required') && valid;
    } else if (password.length < 8) {
        valid = showError('proPassword', 'proPasswordError', 'At least 8 characters required') && valid;
    }

    return valid;
}

function validateStep2() {
    let valid = true;
    const checkedServices = document.querySelectorAll('input[name="services"]:checked');
    const experience = document.getElementById('experience')?.value;

    document.getElementById('servicesError').textContent = '';
    clearError('experience', 'experienceError');

    if (checkedServices.length === 0) {
        document.getElementById('servicesError').textContent = 'Please select at least one service';
        valid = false;
    }
    if (!experience) {
        valid = showError('experience', 'experienceError', 'Please select your experience level') && valid;
    }

    return valid;
}

// ===== PRO FORM SUBMIT =====
const proForm = document.getElementById('proSignupForm');
if (proForm) {
    proForm.addEventListener('submit', e => {
        e.preventDefault();

        const terms = document.getElementById('proTerms').checked;
        document.getElementById('proTermsError').textContent = '';

        if (!terms) {
            document.getElementById('proTermsError').textContent = 'You must agree to the terms';
            return;
        }

        const btn = document.getElementById('proSubmitBtn');
        btn.textContent = 'Submitting...';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = '✓ Application submitted!';
            btn.style.background = '#10B981';

            // Show success message
            const form = document.querySelector('.auth-form-container');
            const successMsg = document.createElement('div');
            successMsg.style.cssText = `
                background: #F0FDF4; border: 1px solid #86EFAC; border-radius: 12px;
                padding: 20px; text-align: center; margin-top: 16px; color: #166534;
            `;
            successMsg.innerHTML = `
                <div style="font-size:2rem; margin-bottom:8px">🎉</div>
                <strong>Application received!</strong>
                <p style="font-size:0.9rem; margin-top:6px; color:#15803D">We'll review your profile and get back to you within 24 hours.</p>
            `;
            form.appendChild(successMsg);
            const proFirst = document.getElementById('proFirstName')?.value.trim() || 'Pro';
            const proLast  = document.getElementById('proLastName')?.value.trim() || '';
            const proEmail = document.getElementById('proEmail')?.value.trim() || '';
            localStorage.setItem('brikol-user', JSON.stringify({
                name: `${proFirst} ${proLast}`.trim(),
                email: proEmail,
                role: 'pro',
            }));
            setTimeout(() => { window.location.href = 'dashboard-pro.html'; }, 2000);
        }, 1500);
    });
}

// ===== FILE UPLOAD HANDLER =====
function handleFileUpload(input, boxId, labelId) {
    const file = input.files[0];
    const box = document.getElementById(boxId);
    const label = document.getElementById(labelId);

    if (file) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        if (file.size > 5 * 1024 * 1024) {
            alert('File is too large. Maximum size is 5MB.');
            return;
        }
        label.textContent = `✓ ${file.name} (${sizeMB}MB)`;
        box.classList.add('uploaded');
    }
}

// ===== REAL-TIME VALIDATION =====
['firstName','lastName','email','phone','city','password',
 'proFirstName','proLastName','proEmail','proPhone','proCity','proPassword'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', () => {
            if (el.classList.contains('error')) {
                el.classList.remove('error');
                const errorEl = document.getElementById(id + 'Error');
                if (errorEl) errorEl.textContent = '';
            }
        });
    }
});
