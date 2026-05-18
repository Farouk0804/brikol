// ===== DARK MODE =====
(function () {
    const saved = localStorage.getItem('brikol-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
})();

// ===== STATE =====
let currentStep = 1;
const totalSteps = 4;

const jobData = {
    service: null,
    serviceLabel: null,
    description: '',
    photos: [],
    city: '',
    address: '',
    date: 'today',
    dateLabel: 'Today',
    budget: '',
    urgent: true,
};

const stepTitles = {
    1: { title: 'What service do you need?', sub: 'Choose a category and we\'ll match you with available Pros in your city.' },
    2: { title: 'Describe your job', sub: 'The more detail you give, the better and faster quotes you\'ll receive.' },
    3: { title: 'When & budget', sub: 'Tell Pros when you need the job done and how much you\'re thinking.' },
    4: { title: 'Review your request', sub: 'Everything look good? Post your job and wait for quotes.' },
};

// ===== STEP 1: SERVICE SELECTION =====
function selectService(el) {
    document.querySelectorAll('.service-choice').forEach(b => b.classList.remove('selected'));
    el.classList.add('selected');
    jobData.service = el.dataset.service;
    jobData.serviceLabel = el.querySelector('.service-choice-name').textContent;
    document.getElementById('error1').textContent = '';
}

// ===== STEP 2: PHOTOS =====
function handlePhotos(input) {
    const files = Array.from(input.files).slice(0, 5 - jobData.photos.length);
    files.forEach(file => {
        if (jobData.photos.length >= 5) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            jobData.photos.push(e.target.result);
            renderPhotos();
        };
        reader.readAsDataURL(file);
    });
    input.value = '';
}

function renderPhotos() {
    const container = document.getElementById('photoPreviews');
    container.innerHTML = jobData.photos.map((src, i) => `
        <div class="pj-photo-wrap">
            <img src="${src}" class="pj-photo-thumb" alt="Photo ${i + 1}">
            <div class="pj-photo-remove" onclick="removePhoto(${i})">✕</div>
        </div>
    `).join('');
}

function removePhoto(idx) {
    jobData.photos.splice(idx, 1);
    renderPhotos();
}

// ===== STEP 3: DATE & URGENCY =====
function selectDate(el, value) {
    document.querySelectorAll('.pj-date-opt').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    jobData.date = value;
    jobData.dateLabel = el.querySelector('.pj-date-name').textContent;
}

function selectUrgency(isUrgent) {
    jobData.urgent = isUrgent;
    document.getElementById('urgentYes').classList.toggle('active', isUrgent);
    document.getElementById('urgentNo').classList.toggle('active', !isUrgent);
}

// ===== CHAR COUNTER =====
document.addEventListener('DOMContentLoaded', () => {
    const ta = document.getElementById('jobDesc');
    const counter = document.getElementById('descCount');
    if (ta && counter) {
        ta.addEventListener('input', () => {
            counter.textContent = ta.value.length;
        });
    }
});

// ===== VALIDATION =====
function validateStep(step) {
    if (step === 1) {
        if (!jobData.service) {
            document.getElementById('error1').textContent = 'Please select a service to continue.';
            return false;
        }
    }
    if (step === 2) {
        const desc = document.getElementById('jobDesc').value.trim();
        const city = document.getElementById('jobCity').value;
        if (desc.length < 15) {
            document.getElementById('error2').textContent = 'Please describe your job in at least 15 characters.';
            return false;
        }
        if (!city) {
            document.getElementById('error2').textContent = 'Please select your city.';
            return false;
        }
        jobData.description = desc;
        jobData.city = city;
        jobData.address = document.getElementById('jobAddress').value.trim();
        document.getElementById('error2').textContent = '';
    }
    if (step === 3) {
        jobData.budget = document.getElementById('jobBudget').value;
    }
    return true;
}

// ===== STEP NAVIGATION =====
function nextStep() {
    if (!validateStep(currentStep)) return;

    if (currentStep === totalSteps) {
        submitJob();
        return;
    }

    currentStep++;
    updateUI();
}

function prevStep() {
    if (currentStep <= 1) return;
    currentStep--;
    updateUI();
}

function goToStep(step) {
    currentStep = step;
    updateUI();
}

function updateUI() {
    // Show/hide steps
    for (let i = 1; i <= totalSteps; i++) {
        const el = document.getElementById(`step${i}`);
        if (el) el.classList.toggle('hidden', i !== currentStep);
    }

    // Progress fill
    const fill = document.getElementById('progressFill');
    fill.style.width = `${(currentStep / totalSteps) * 100}%`;

    // Dots
    document.querySelectorAll('.pj-dot').forEach(dot => {
        const s = parseInt(dot.dataset.step);
        dot.classList.remove('active', 'done');
        if (s < currentStep) dot.classList.add('done');
        else if (s === currentStep) dot.classList.add('active');
    });

    // Step title & sub
    const info = stepTitles[currentStep];
    if (info) {
        document.getElementById('stepTitle').textContent = info.title;
        document.getElementById('stepSub').textContent = info.sub;
    }

    // Back button
    const backBtn = document.getElementById('backBtn');
    backBtn.style.visibility = currentStep > 1 ? 'visible' : 'hidden';

    // Next button label
    const nextBtn = document.getElementById('nextBtn');
    if (currentStep === totalSteps) {
        nextBtn.textContent = '🚀 Post My Job';
        nextBtn.style.background = '#16A34A';
    } else {
        nextBtn.textContent = 'Continue →';
        nextBtn.style.background = '';
    }

    // Populate review on step 4
    if (currentStep === 4) populateReview();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== REVIEW SUMMARY =====
function populateReview() {
    const serviceEmojis = {
        cleaning: '🧹', plumbing: '🔧', electricity: '⚡',
        furniture: '🪑', painting: '🖌️'
    };
    const emoji = serviceEmojis[jobData.service] || '🔨';

    document.getElementById('reviewService').textContent = `${emoji} ${jobData.serviceLabel}`;
    document.getElementById('reviewDesc').textContent = jobData.description || '—';

    const cityMap = {
        casablanca: 'Casablanca', rabat: 'Rabat', marrakech: 'Marrakech',
        fes: 'Fès', tanger: 'Tanger', agadir: 'Agadir', meknes: 'Meknès', oujda: 'Oujda'
    };
    const cityLabel = cityMap[jobData.city] || jobData.city;
    document.getElementById('reviewLocation').textContent =
        jobData.address ? `${cityLabel} — ${jobData.address}` : cityLabel;

    document.getElementById('reviewDate').textContent =
        jobData.dateLabel + (jobData.urgent ? ' · 🚨 Urgent' : '');

    document.getElementById('reviewBudget').textContent =
        jobData.budget ? `${jobData.budget} MAD` : 'Not specified — open to quotes';
}

// ===== SUBMIT =====
function submitJob() {
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.disabled = true;
    nextBtn.textContent = 'Posting…';

    // Simulate API call
    setTimeout(() => {
        // Hide all steps and nav
        for (let i = 1; i <= totalSteps; i++) {
            const el = document.getElementById(`step${i}`);
            if (el) el.classList.add('hidden');
        }
        document.getElementById('pjProgress').style.display = 'none';
        document.getElementById('pjNav').style.display = 'none';
        document.getElementById('pjHeader').style.display = 'none';

        // Show success
        const success = document.getElementById('stepSuccess');
        success.classList.remove('hidden');
        success.style.animation = 'stepIn 0.4s ease';
    }, 1000);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
});
