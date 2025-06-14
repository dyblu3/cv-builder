// Global Variables
let cvData = {
    personal: {},
    education: [],
    experience: [],
    skills: [],
    certificates: [],
    languages: []
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadSavedData();
    updateProgress();
    setupEventListeners();
});

// Initialize Application
function initializeApp() {
    // Setup tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab + '-tab').classList.add('active');
            
            // Update preview if switching to preview tab
            if (targetTab === 'preview') {
                updatePreview();
            }
        });
    });
    
    // Setup theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
    
    themeToggle.addEventListener('click', toggleTheme);
    
    // Setup star ratings
    setupStarRatings();
    
    // Setup form field listeners for progress tracking
    setupProgressTracking();
}

// Theme Functions
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
}

function updateThemeButton(theme) {
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.textContent = theme === 'dark' ? '☀️ Mode Terang' : '🌙 Mode Gelap';
}

// Progress Tracking
function setupProgressTracking() {
    const form = document.getElementById('cvForm');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('input', updateProgress);
        input.addEventListener('change', updateProgress);
    });
}

function updateProgress() {
    const form = document.getElementById('cvForm');
    const requiredFields = form.querySelectorAll('input[required], textarea[required]');
    const allFields = form.querySelectorAll('input, textarea, select');
    
    let filledRequired = 0;
    let totalFilled = 0;
    
    // Count required fields
    requiredFields.forEach(field => {
        if (field.value.trim() !== '') {
            filledRequired++;
        }
    });
    
    // Count all fields
    allFields.forEach(field => {
        if (field.value.trim() !== '') {
            totalFilled++;
        }
    });
    
    // Calculate progress (weighted: 70% required, 30% optional)
    const requiredProgress = (filledRequired / requiredFields.length) * 70;
    const optionalProgress = (totalFilled / allFields.length) * 30;
    const totalProgress = Math.round(requiredProgress + optionalProgress);
    
    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressFill.style.width = totalProgress + '%';
    progressText.textContent = totalProgress + '% Lengkap';
}

// Star Rating System
function setupStarRatings() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('star')) {
            const starsContainer = e.target.parentElement;
            const rating = parseInt(e.target.getAttribute('data-value'));
            const stars = starsContainer.querySelectorAll('.star');
            
            // Update visual state
            stars.forEach((star, index) => {
                if (index < rating) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });
            
            // Store rating
            starsContainer.setAttribute('data-rating', rating);
        }
    });
}

// Dynamic Form Functions
function addEducation() {
    const container = document.getElementById('educationContainer');
    const newItem = document.createElement('div');
    newItem.className = 'education-item';
    newItem.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Nama Institusi</label>
                <input type="text" name="institution" class="education-field">
            </div>
            <div class="form-group">
                <label>Jurusan</label>
                <input type="text" name="major" class="education-field">
            </div>
            <div class="form-group">
                <label>Gelar</label>
                <input type="text" name="degree" class="education-field">
            </div>
            <div class="form-group">
                <label>Tahun Masuk</label>
                <input type="number" name="startYear" class="education-field" min="1950" max="2030">
            </div>
            <div class="form-group">
                <label>Tahun Lulus</label>
                <input type="number" name="endYear" class="education-field" min="1950" max="2030">
            </div>
            <div class="form-group">
                <label>IPK (opsional)</label>
                <input type="number" name="gpa" class="education-field" step="0.01" min="0" max="4">
            </div>
        </div>
        <button type="button" class="remove-btn" onclick="removeEducation(this)">❌ Hapus</button>
    `;
    container.appendChild(newItem);
    setupProgressTracking();
}

function removeEducation(button) {
    button.parentElement.remove();
    updateProgress();
}

function addExperience() {
    const container = document.getElementById('experienceContainer');
    const newItem = document.createElement('div');
    newItem.className = 'experience-item';
    newItem.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Nama Perusahaan</label>
                <input type="text" name="company" class="experience-field">
            </div>
            <div class="form-group">
                <label>Jabatan</label>
                <input type="text" name="position" class="experience-field">
            </div>
            <div class="form-group">
                <label>Tanggal Mulai</label>
                <input type="month" name="startDate" class="experience-field">
            </div>
            <div class="form-group">
                <label>Tanggal Selesai</label>
                <input type="month" name="endDate" class="experience-field">
                <label class="checkbox-label">
                    <input type="checkbox" name="current" class="current-job"> Masih bekerja
                </label>
            </div>
            <div class="form-group full-width">
                <label>Deskripsi Pekerjaan/Pencapaian</label>
                <textarea name="description" class="experience-field" rows="3" placeholder="Jelaskan tanggung jawab dan pencapaian Anda..."></textarea>
            </div>
        </div>
        <button type="button" class="remove-btn" onclick="removeExperience(this)">❌ Hapus</button>
    `;
    container.appendChild(newItem);
    setupProgressTracking();
}

function removeExperience(button) {
    button.parentElement.remove();
    updateProgress();
}

function addSkill() {
    const container = document.getElementById('skillsContainer');
    const newItem = document.createElement('div');
    newItem.className = 'skill-item';
    newItem.innerHTML = `
        <div class="skill-input">
            <input type="text" name="skillName" class="skill-field" placeholder="Nama keahlian">
            <div class="rating">
                <span>Rating:</span>
                <div class="stars" data-rating="0">
                    <span class="star" data-value="1">⭐</span>
                    <span class="star" data-value="2">⭐</span>
                    <span class="star" data-value="3">⭐</span>
                    <span class="star" data-value="4">⭐</span>
                    <span class="star" data-value="5">⭐</span>
                </div>
            </div>
            <button type="button" class="remove-btn" onclick="removeSkill(this)">❌</button>
        </div>
    `;
    container.appendChild(newItem);
    setupProgressTracking();
}

function removeSkill(button) {
    button.parentElement.parentElement.remove();
    updateProgress();
}

function addCertificate() {
    const container = document.getElementById('certificatesContainer');
    const newItem = document.createElement('div');
    newItem.className = 'certificate-item';
    newItem.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Nama Kursus/Sertifikat</label>
                <input type="text" name="courseName" class="certificate-field">
            </div>
            <div class="form-group">
                <label>Lembaga</label>
                <input type="text" name="institution" class="certificate-field">
            </div>
            <div class="form-group">
                <label>Tahun</label>
                <input type="number" name="year" class="certificate-field" min="1950" max="2030">
            </div>
        </div>
        <button type="button" class="remove-btn" onclick="removeCertificate(this)">❌ Hapus</button>
    `;
    container.appendChild(newItem);
    setupProgressTracking();
}

function removeCertificate(button) {
    button.parentElement.remove();
    updateProgress();
}

function addLanguage() {
    const container = document.getElementById('languagesContainer');
    const newItem = document.createElement('div');
    newItem.className = 'language-item';
    newItem.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Nama Bahasa</label>
                <input type="text" name="languageName" class="language-field">
            </div>
            <div class="form-group">
                <label>Tingkat Kemahiran</label>
                <select name="proficiency" class="language-field">
                    <option value="">Pilih tingkat</option>
                    <option value="Pemula">Pemula</option>
                    <option value="Menengah">Menengah</option>
                    <option value="Mahir">Mahir</option>
                    <option value="Fasih">Fasih</option>
                    <option value="Native">Native</option>
                </select>
            </div>
        </div>
        <button type="button" class="remove-btn" onclick="removeLanguage(this)">❌ Hapus</button>
    `;
    container.appendChild(newItem);
    setupProgressTracking();
}

function removeLanguage(button) {
    button.parentElement.remove();
    updateProgress();
}

// Data Collection Functions
function collectFormData() {
    // Personal Data
    cvData.personal = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        birthDate: document.getElementById('birthDate').value,
        linkedin: document.getElementById('linkedin').value,
        github: document.getElementById('github').value
    };
    
    // Education Data
    cvData.education = [];
    const educationItems = document.querySelectorAll('.education-item');
    educationItems.forEach(item => {
        const education = {
            institution: item.querySelector('input[name="institution"]').value,
            major: item.querySelector('input[name="major"]').value,
            degree: item.querySelector('input[name="degree"]').value,
            startYear: item.querySelector('input[name="startYear"]').value,
            endYear: item.querySelector('input[name="endYear"]').value,
            gpa: item.querySelector('input[name="gpa"]').value
        };
        if (education.institution || education.major || education.degree) {
            cvData.education.push(education);
        }
    });
    
    // Experience Data
    cvData.experience = [];
    const experienceItems = document.querySelectorAll('.experience-item');
    experienceItems.forEach(item => {
        const experience = {
            company: item.querySelector('input[name="company"]').value,
            position: item.querySelector('input[name="position"]').value,
            startDate: item.querySelector('input[name="startDate"]').value,
            endDate: item.querySelector('input[name="endDate"]').value,
            current: item.querySelector('input[name="current"]').checked,
            description: item.querySelector('textarea[name="description"]').value
        };
        if (experience.company || experience.position) {
            cvData.experience.push(experience);
        }
    });
    
    // Skills Data
    cvData.skills = [];
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        const skillName = item.querySelector('input[name="skillName"]').value;
        const rating = item.querySelector('.stars').getAttribute('data-rating');
        if (skillName) {
            cvData.skills.push({
                name: skillName,
                rating: parseInt(rating) || 0
            });
        }
    });
    
    // Certificates Data
    cvData.certificates = [];
    const certificateItems = document.querySelectorAll('.certificate-item');
    certificateItems.forEach(item => {
        const certificate = {
            courseName: item.querySelector('input[name="courseName"]').value,
            institution: item.querySelector('input[name="institution"]').value,
            year: item.querySelector('input[name="year"]').value
        };
        if (certificate.courseName || certificate.institution) {
            cvData.certificates.push(certificate);
        }
    });
    
    // Languages Data
    cvData.languages = [];
    const languageItems = document.querySelectorAll('.language-item');
    languageItems.forEach(item => {
        const language = {
            name: item.querySelector('input[name="languageName"]').value,
            proficiency: item.querySelector('select[name="proficiency"]').value
        };
        if (language.name && language.proficiency) {
            cvData.languages.push(language);
        }
    });
    
    return cvData;
}

// Data Storage Functions
function saveData() {
    collectFormData();
    localStorage.setItem('cvBuilderData', JSON.stringify(cvData));
    
    // Show success message
    const saveBtn = document.querySelector('.btn-save');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = '✅ Data Tersimpan!';
    saveBtn.style.background = '#059669';
    
    setTimeout(() => {
        saveBtn.textContent = originalText;
        saveBtn.style.background = '';
    }, 2000);
    
    updateProgress();
}

function loadSavedData() {
    const savedData = localStorage.getItem('cvBuilderData');
    if (savedData) {
        cvData = JSON.parse(savedData);
        populateForm();
    }
}

function populateForm() {
    // Populate personal data
    if (cvData.personal) {
        Object.keys(cvData.personal).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = cvData.personal[key] || '';
            }
        });
    }
    
    // Populate education
    if (cvData.education && cvData.education.length > 0) {
        const container = document.getElementById('educationContainer');
        container.innerHTML = '';
        cvData.education.forEach(edu => {
            addEducation();
            const lastItem = container.lastElementChild;
            lastItem.querySelector('input[name="institution"]').value = edu.institution || '';
            lastItem.querySelector('input[name="major"]').value = edu.major || '';
            lastItem.querySelector('input[name="degree"]').value = edu.degree || '';
            lastItem.querySelector('input[name="startYear"]').value = edu.startYear || '';
            lastItem.querySelector('input[name="endYear"]').value = edu.endYear || '';
            lastItem.querySelector('input[name="gpa"]').value = edu.gpa || '';
        });
    }
    
    // Populate experience
    if (cvData.experience && cvData.experience.length > 0) {
        const container = document.getElementById('experienceContainer');
        container.innerHTML = '';
        cvData.experience.forEach(exp => {
            addExperience();
            const lastItem = container.lastElementChild;
            lastItem.querySelector('input[name="company"]').value = exp.company || '';
            lastItem.querySelector('input[name="position"]').value = exp.position || '';
            lastItem.querySelector('input[name="startDate"]').value = exp.startDate || '';
            lastItem.querySelector('input[name="endDate"]').value = exp.endDate || '';
            lastItem.querySelector('input[name="current"]').checked = exp.current || false;
            lastItem.querySelector('textarea[name="description"]').value = exp.description || '';
        });
    }
    
    // Populate skills
    if (cvData.skills && cvData.skills.length > 0) {
        const container = document.getElementById('skillsContainer');
        container.innerHTML = '';
        cvData.skills.forEach(skill => {
            addSkill();
            const lastItem = container.lastElementChild;
            lastItem.querySelector('input[name="skillName"]').value = skill.name || '';
            const stars = lastItem.querySelector('.stars');
            stars.setAttribute('data-rating', skill.rating || 0);
            const starElements = stars.querySelectorAll('.star');
            starElements.forEach((star, index) => {
                if (index < skill.rating) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });
        });
    }
    
    // Populate certificates
    if (cvData.certificates && cvData.certificates.length > 0) {
        const container = document.getElementById('certificatesContainer');
        container.innerHTML = '';
        cvData.certificates.forEach(cert => {
            addCertificate();
            const lastItem = container.lastElementChild;
            lastItem.querySelector('input[name="courseName"]').value = cert.courseName || '';
            lastItem.querySelector('input[name="institution"]').value = cert.institution || '';
            lastItem.querySelector('input[name="year"]').value = cert.year || '';
        });
    }
    
    // Populate languages
    if (cvData.languages && cvData.languages.length > 0) {
        const container = document.getElementById('languagesContainer');
        container.innerHTML = '';
        cvData.languages.forEach(lang => {
            addLanguage();
            const lastItem = container.lastElementChild;
            lastItem.querySelector('input[name="languageName"]').value = lang.name || '';
            lastItem.querySelector('select[name="proficiency"]').value = lang.proficiency || '';
        });
    }
}

function resetData() {
    if (confirm('Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.')) {
        localStorage.removeItem('cvBuilderData');
        cvData = {
            personal: {},
            education: [],
            experience: [],
            skills: [],
            certificates: [],
            languages: []
        };
        
        // Reset form
        document.getElementById('cvForm').reset();
        
        // Reset dynamic sections to single item
        document.getElementById('educationContainer').innerHTML = document.querySelector('.education-item').outerHTML;
        document.getElementById('experienceContainer').innerHTML = document.querySelector('.experience-item').outerHTML;
        document.getElementById('skillsContainer').innerHTML = document.querySelector('.skill-item').outerHTML;
        document.getElementById('certificatesContainer').innerHTML = document.querySelector('.certificate-item').outerHTML;
        document.getElementById('languagesContainer').innerHTML = document.querySelector('.language-item').outerHTML;
        
        // Reset star ratings
        document.querySelectorAll('.stars').forEach(stars => {
            stars.setAttribute('data-rating', '0');
            stars.querySelectorAll('.star').forEach(star => star.classList.remove('active'));
        });
        
        updateProgress();
        
        // Show success message
        const resetBtn = document.querySelector('.btn-reset');
        const originalText = resetBtn.textContent;
        resetBtn.textContent = '✅ Data Dihapus!';
        
        setTimeout(() => {
            resetBtn.textContent = originalText;
        }, 2000);
    }
}

// CV Preview Functions
function updatePreview() {
    collectFormData();
    const previewContainer = document.getElementById('cvPreview');
    
    let html = '';
    
    // Header with personal info
    if (cvData.personal.fullName) {
        html += `<h1>${cvData.personal.fullName}</h1>`;
    }
    
    // Contact information
    html += '<div class="contact-info">';
    if (cvData.personal.email) html += `<p>Email: ${cvData.personal.email}</p>`;
    if (cvData.personal.phone) html += `<p>Telepon: ${cvData.personal.phone}</p>`;
    if (cvData.personal.address) html += `<p>Alamat: ${cvData.personal.address}</p>`;
    if (cvData.personal.linkedin) html += `<p>LinkedIn: ${cvData.personal.linkedin}</p>`;
    if (cvData.personal.github) html += `<p>GitHub: ${cvData.personal.github}</p>`;
    html += '</div>';
    
    // Education section
    if (cvData.education.length > 0) {
        html += '<div class="section"><h2>PENDIDIKAN</h2>';
        cvData.education.forEach(edu => {
            if (edu.institution || edu.major || edu.degree) {
                html += '<div class="item">';
                html += '<div class="item-header">';
                html += '<div>';
                if (edu.degree && edu.major) {
                    html += `<div class="item-title">${edu.degree} - ${edu.major}</div>`;
                } else if (edu.degree) {
                    html += `<div class="item-title">${edu.degree}</div>`;
                } else if (edu.major) {
                    html += `<div class="item-title">${edu.major}</div>`;
                }
                if (edu.institution) {
                    html += `<div class="item-subtitle">${edu.institution}</div>`;
                }
                html += '</div>';
                html += '<div class="item-date">';
                if (edu.startYear && edu.endYear) {
                    html += `${edu.startYear} - ${edu.endYear}`;
                } else if (edu.endYear) {
                    html += `${edu.endYear}`;
                }
                html += '</div>';
                html += '</div>';
                if (edu.gpa) {
                    html += `<p>IPK: ${edu.gpa}</p>`;
                }
                html += '</div>';
            }
        });
        html += '</div>';
    }
    
    // Experience section
    if (cvData.experience.length > 0) {
        html += '<div class="section"><h2>PENGALAMAN KERJA</h2>';
        cvData.experience.forEach(exp => {
            if (exp.company || exp.position) {
                html += '<div class="item">';
                html += '<div class="item-header">';
                html += '<div>';
                if (exp.position) {
                    html += `<div class="item-title">${exp.position}</div>`;
                }
                if (exp.company) {
                    html += `<div class="item-subtitle">${exp.company}</div>`;
                }
                html += '</div>';
                html += '<div class="item-date">';
                if (exp.startDate) {
                    const startDate = new Date(exp.startDate + '-01');
                    const startMonth = startDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
                    html += startMonth;
                    
                    if (exp.current) {
                        html += ' - Sekarang';
                    } else if (exp.endDate) {
                        const endDate = new Date(exp.endDate + '-01');
                        const endMonth = endDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
                        html += ` - ${endMonth}`;
                    }
                }
                html += '</div>';
                html += '</div>';
                if (exp.description) {
                    html += `<p>${exp.description}</p>`;
                }
                html += '</div>';
            }
        });
        html += '</div>';
    }
    
    // Skills section
    if (cvData.skills.length > 0) {
        html += '<div class="section"><h2>KEAHLIAN</h2>';
        html += '<div class="skills-grid">';
        cvData.skills.forEach(skill => {
            if (skill.name) {
                const stars = '★'.repeat(skill.rating) + '☆'.repeat(5 - skill.rating);
                html += `<div class="skill-item">`;
                html += `<span>${skill.name}</span>`;
                html += `<span class="skill-rating">${stars}</span>`;
                html += `</div>`;
            }
        });
        html += '</div></div>';
    }
    
    // Certificates section
    if (cvData.certificates.length > 0) {
        html += '<div class="section"><h2>SERTIFIKAT & KURSUS</h2>';
        cvData.certificates.forEach(cert => {
            if (cert.courseName || cert.institution) {
                html += '<div class="item">';
                html += '<div class="item-header">';
                html += '<div>';
                if (cert.courseName) {
                    html += `<div class="item-title">${cert.courseName}</div>`;
                }
                if (cert.institution) {
                    html += `<div class="item-subtitle">${cert.institution}</div>`;
                }
                html += '</div>';
                if (cert.year) {
                    html += `<div class="item-date">${cert.year}</div>`;
                }
                html += '</div>';
                html += '</div>';
            }
        });
        html += '</div>';
    }
    
    // Languages section
    if (cvData.languages.length > 0) {
        html += '<div class="section"><h2>BAHASA</h2>';
        cvData.languages.forEach(lang => {
            if (lang.name && lang.proficiency) {
                html += `<p><strong>${lang.name}:</strong> ${lang.proficiency}</p>`;
            }
        });
        html += '</div>';
    }
    
    previewContainer.innerHTML = html;
}

// PDF Export Function
function downloadPDF() {
    const element = document.getElementById('cvPreview');
    const opt = {
        margin: 1,
        filename: `CV_${cvData.personal.fullName || 'CV'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    // Show loading state
    const downloadBtn = document.querySelector('.btn-primary');
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<span class="loading"></span> Membuat PDF...';
    downloadBtn.disabled = true;
    
    html2pdf().set(opt).from(element).save().then(() => {
        // Reset button
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
    }).catch((error) => {
        console.error('Error generating PDF:', error);
        downloadBtn.innerHTML = '❌ Error';
        setTimeout(() => {
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
        }, 2000);
    });
}

// Event Listeners Setup
function setupEventListeners() {
    // Auto-save on form changes
    const form = document.getElementById('cvForm');
    let saveTimeout;
    
    form.addEventListener('input', () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            collectFormData();
            localStorage.setItem('cvBuilderData', JSON.stringify(cvData));
        }, 1000); // Auto-save after 1 second of inactivity
    });
    
    // Handle current job checkbox
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('current-job')) {
            const endDateInput = e.target.closest('.form-group').querySelector('input[name="endDate"]');
            if (e.target.checked) {
                endDateInput.disabled = true;
                endDateInput.value = '';
            } else {
                endDateInput.disabled = false;
            }
        }
    });
}

