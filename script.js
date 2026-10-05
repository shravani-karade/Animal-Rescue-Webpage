/* ==========================================================================
   RescuePaws 🐾 - Core JavaScript Application Logic
   ========================================================================== */

// Storage Keys for LocalStorage Persistence
const STORAGE_KEY_REPORTS = 'rescuepaws_reports_v1';
const STORAGE_KEY_ADOPTABLES = 'rescuepaws_adoptables_v1';
const STORAGE_KEY_REVIEWS = 'rescuepaws_reviews_v1';

// Seed initial reports if local storage is empty
const DEFAULT_REPORTS = [
  {
    id: 'rep-101',
    animalType: 'Dog',
    photoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    location: 'Andheri West, Near Station Road',
    urgency: 'Critical',
    description: 'Injured limb near busy junction. Limping and unable to cross the road safely.',
    reporterName: 'Amit Sharma',
    reporterContact: '9876543210',
    reportedDateStr: '5 Oct 2026',
    reportedTimeStr: '1:42 PM',
    status: 'Pending',
    rescuedDateStr: null,
    rescuedTimeStr: null
  },
  {
    id: 'rep-102',
    animalType: 'Cat',
    photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    location: 'Bandra Bandstand',
    urgency: 'Urgent',
    description: 'Small kitten trapped behind garden fence, crying for help.',
    reporterName: 'Priya Roy',
    reporterContact: '9812345678',
    reportedDateStr: '5 Oct 2026',
    reportedTimeStr: '10:15 AM',
    status: 'Rescued',
    rescuedDateStr: '5 Oct 2026',
    rescuedTimeStr: '12:30 PM'
  },
  {
    id: 'rep-103',
    animalType: 'Bird',
    photoUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80',
    location: 'Powai Lake Promenade',
    urgency: 'Normal',
    description: 'Pigeon entangled in kite string high on a low tree branch.',
    reporterName: 'Karan Malhotra',
    reporterContact: '9930044556',
    reportedDateStr: '4 Oct 2026',
    reportedTimeStr: '04:20 PM',
    status: 'Rescued',
    rescuedDateStr: '4 Oct 2026',
    rescuedTimeStr: '05:10 PM'
  }
];

// Seed initial adoptable animals
const DEFAULT_ADOPTABLES = [
  {
    id: 'adopt-1',
    name: 'Bruno',
    type: 'Dog',
    age: '2 Years',
    location: 'Mumbai Shelter',
    photoUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
    description: 'Friendly, fully vaccinated, and ready for adoption. Loves fetch and gentle with kids.'
  },
  {
    id: 'adopt-2',
    name: 'Luna',
    type: 'Cat',
    age: '1 Year',
    location: 'Bandra Foster',
    photoUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80',
    description: 'Calm, litter-trained kitten fully recovered from rescue. Loves lap cuddles.'
  }
];

// Seed initial platform reviews
const DEFAULT_REVIEWS = [
  {
    name: 'Ananya S.',
    rating: '5',
    text: '“The reporting process is simple and easy to understand.”'
  },
  {
    name: 'Rahul M.',
    rating: '5',
    text: '“Having rescue status and updates makes it easier to follow an animal’s journey.”'
  },
  {
    name: 'Dr. Sneha V. (Vet)',
    rating: '5',
    text: '“A simple idea that can help connect people with animal rescue support effectively.”'
  }
];

// Active State Variables
let reports = [];
let adoptables = [];
let reviews = [];

// Initialize Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  loadStoredData();
  setupEventListeners();
  renderAll();
});

// Load Data from LocalStorage or Load Defaults
function loadStoredData() {
  const savedReports = localStorage.getItem(STORAGE_KEY_REPORTS);
  reports = savedReports ? JSON.parse(savedReports) : DEFAULT_REPORTS;

  const savedAdoptables = localStorage.getItem(STORAGE_KEY_ADOPTABLES);
  adoptables = savedAdoptables ? JSON.parse(savedAdoptables) : DEFAULT_ADOPTABLES;

  const savedReviews = localStorage.getItem(STORAGE_KEY_REVIEWS);
  reviews = savedReviews ? JSON.parse(savedReviews) : DEFAULT_REVIEWS;

  saveState();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
  localStorage.setItem(STORAGE_KEY_ADOPTABLES, JSON.stringify(adoptables));
  localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
}

// Setup Application Event Listeners
function setupEventListeners() {
  // Navigation Menu Toggle for Mobile
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  // Smooth Menu Dismiss on Mobile
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('open'));
  });

  // Animal Report Submission
  const reportForm = document.getElementById('rescueReportForm');
  if (reportForm) {
    reportForm.addEventListener('submit', handleNewReport);
  }

  // Search & Filter Events
  document.getElementById('searchInput')?.addEventListener('input', renderReports);
  document.getElementById('filterStatus')?.addEventListener('change', renderReports);
  document.getElementById('filterUrgency')?.addEventListener('change', renderReports);

  // Adoption Modal Dismiss Events
  document.getElementById('closeAdoptionModal')?.addEventListener('click', closeAdoptionModal);
  window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('adoptionModal')) {
      closeAdoptionModal();
    }
  });

  // Adoption Application Submit
  document.getElementById('adoptionForm')?.addEventListener('submit', handleAdoptionSubmit);

  // Review Submit Form
  document.getElementById('reviewForm')?.addEventListener('submit', handleReviewSubmit);
}

// Render All Dynamic Sections
function renderAll() {
  renderStats();
  renderReports();
  renderAdoptables();
  renderReviews();
}

// 📊 Calculate & Render Statistics
function renderStats() {
  const total = reports.length;
  const urgentCount = reports.filter(r => r.urgency === 'Critical' || r.urgency === 'Urgent').length;
  const rescuedCount = reports.filter(r => r.status === 'Rescued').length;
  const adoptedCount = adoptables.length;

  document.getElementById('statTotal').innerText = total;
  document.getElementById('statUrgent').innerText = urgentCount;
  document.getElementById('statRescued').innerText = rescuedCount;
  document.getElementById('statAdopted').innerText = adoptedCount;
}

// 🔎 Render Rescue Reports List
function renderReports() {
  const container = document.getElementById('reportsContainer');
  if (!container) return;

  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const statusFilter = document.getElementById('filterStatus').value;
  const urgencyFilter = document.getElementById('filterUrgency').value;

  const filtered = reports.filter(item => {
    const matchesQuery = item.animalType.toLowerCase().includes(query) || 
                         item.location.toLowerCase().includes(query) ||
                         item.description.toLowerCase().includes(query);
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'ALL' || item.urgency === urgencyFilter;

    return matchesQuery && matchesStatus && matchesUrgency;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <p style="font-size: 1.1rem; font-weight: 600;">No rescue reports match your search criteria.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const defaultImg = item.animalType === 'Cat' 
      ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80'
      : item.animalType === 'Bird'
      ? 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80'
      : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';

    const imageSrc = item.photoUrl && item.photoUrl.trim() !== '' ? item.photoUrl : defaultImg;

    return `
      <div class="report-card">
        <div class="card-img-wrap">
          <img src="${imageSrc}" alt="${item.animalType}" onerror="this.src='${defaultImg}'" />
          <span class="badge badge-urgency ${item.urgency}">🚨 ${item.urgency}</span>
        </div>
        <div class="card-body">
          <div class="card-title">
            <h3>🐾 ${item.animalType}</h3>
            <span class="status-indicator ${item.status}">
              ${item.status === 'Rescued' ? '🟢 RESCUED' : '🔴 Pending'}
            </span>
          </div>
          <div class="card-location">📍 ${escapeHtml(item.location)}</div>
          <div class="card-desc">${escapeHtml(item.description)}</div>

          <div class="card-timestamps">
            <div class="timestamp-item">📅 <strong>Reported:</strong> ${item.reportedDateStr}</div>
            <div class="timestamp-item">🕐 <strong>Reported at:</strong> ${item.reportedTimeStr}</div>
            ${
              item.status === 'Rescued' 
                ? `<div class="timestamp-item" style="color: var(--urgency-normal); font-weight:700; margin-top:6px;">
                     <strong>Rescued on:</strong> ${item.rescuedDateStr} <br/>
                    <strong>Rescued at:</strong> ${item.rescuedTimeStr}
                   </div>`
                : ''
            }
          </div>

          <div class="card-footer">
            ${
              item.status === 'Pending'
                ? `<button class="btn btn-rescue" onclick="markAsRescued('${item.id}')">Mark as Rescued ✅</button>`
                : `<button class="btn btn-secondary" style="width:100%; opacity:0.85;" onclick="quickMoveToAdopt('${escapeHtml(item.animalType)}', '${escapeHtml(item.location)}')">List for Adoption </button>`
            }
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 🚨 Handle New Report Creation with Auto Timestamp
function handleNewReport(e) {
  e.preventDefault();

  const animalType = document.getElementById('animalType').value;
  const urgency = document.getElementById('urgency').value;
  const location = document.getElementById('location').value;
  const photoUrl = document.getElementById('photoUrl').value;
  const reporterName = document.getElementById('reporterName').value;
  const reporterContact = document.getElementById('reporterContact').value;
  const description = document.getElementById('description').value;

  // Auto Generate Current Timestamp using ES6 Date
  const now = new Date();
  const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
  
  const reportedDateStr = now.toLocaleDateString('en-GB', dateOptions); // e.g., "5 Oct 2026"
  const reportedTimeStr = now.toLocaleTimeString('en-US', timeOptions); // e.g., "1:42 PM"

  const newReport = {
    id: 'rep-' + Date.now(),
    animalType,
    urgency,
    location,
    photoUrl,
    reporterName,
    reporterContact,
    description,
    reportedDateStr,
    reportedTimeStr,
    status: 'Pending',
    rescuedDateStr: null,
    rescuedTimeStr: null
  };

  reports.unshift(newReport);
  saveState();
  renderAll();

  // Reset form and notify user
  document.getElementById('rescueReportForm').reset();
  showToast('Rescue report created successfully!');

  // Smooth scroll down to reports list
  document.getElementById('reports-section')?.scrollIntoView({ behavior: 'smooth' });
}

// 🟢 Mark Report as Rescued with Auto Rescue Date/Time
function markAsRescued(id) {
  const report = reports.find(r => r.id === id);
  if (!report) return;

  const now = new Date();
  const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };

  report.status = 'Rescued';
  report.rescuedDateStr = now.toLocaleDateString('en-GB', dateOptions);
  report.rescuedTimeStr = now.toLocaleTimeString('en-US', timeOptions);

  saveState();
  renderAll();
  showToast(' Animal status updated to RESCUED!');
}

// ❤️ Render Adoptable Animals Cards
function renderAdoptables() {
  const container = document.getElementById('adoptablesContainer');
  if (!container) return;

  container.innerHTML = adoptables.map(item => `
    <div class="report-card">
      <div class="card-img-wrap">
        <img src="${item.photoUrl}" alt="${item.name}" />
      </div>
      <div class="card-body">
        <div class="card-title">
          <h3>🐕 ${escapeHtml(item.name)}</h3>
          <span class="status-indicator Rescued">Looking for a home</span>
        </div>
        <div class="card-location">📍 ${escapeHtml(item.location)} • Age: ${escapeHtml(item.age)}</div>
        <div class="card-desc">${escapeHtml(item.description)}</div>
        <button class="btn btn-primary btn-block" onclick="openAdoptionModal('${escapeHtml(item.name)}')">Interested in Adoption </button>
      </div>
    </div>
  `).join('');
}

// Quick Add Rescued Pet into Adoption List
function quickMoveToAdopt(type, location) {
  const name = prompt(`Enter a name for this rescued ${type}:`, 'Buddy');
  if (!name || name.trim() === '') return;

  const newAdoptable = {
    id: 'adopt-' + Date.now(),
    name: name.trim(),
    type: type,
    age: 'Ready for Home',
    location: location,
    photoUrl: type === 'Cat' 
      ? 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80' 
      : 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
    description: `Rescued ${type} looking for a permanent loving home.`
  };

  adoptables.unshift(newAdoptable);
  saveState();
  renderAll();
  showToast(` ${name} added to Adoption List!`);
  document.getElementById('adopt-section')?.scrollIntoView({ behavior: 'smooth' });
}

// Adoption Modal Handlers
function openAdoptionModal(petName) {
  const modal = document.getElementById('adoptionModal');
  const petNameInput = document.getElementById('adoptPetName');
  const subHeading = document.getElementById('adoptionModalSub');

  if (modal && petNameInput && subHeading) {
    petNameInput.value = petName;
    subHeading.innerText = `Express interest in adopting ${petName}`;
    modal.style.display = 'flex';
  }
}

function closeAdoptionModal() {
  const modal = document.getElementById('adoptionModal');
  const form = document.getElementById('adoptionForm');
  if (modal) modal.style.display = 'none';
  if (form) form.reset();
}

function handleAdoptionSubmit(e) {
  e.preventDefault();
  const petName = document.getElementById('adoptPetName').value;
  const applicantName = document.getElementById('applicantName').value;

  closeAdoptionModal();
  showToast(` Thank you ${applicantName}! Inquiry for ${petName} submitted.`);
}

// ⭐ Render Reviews
function renderReviews() {
  const container = document.getElementById('reviewsContainer');
  if (!container) return;

  container.innerHTML = reviews.map(rev => `
    <div class="review-card">
      <div class="review-stars">${'⭐'.repeat(parseInt(rev.rating))}</div>
      <p>${escapeHtml(rev.text)}</p>
      <div class="review-author">— ${escapeHtml(rev.name)}</div>
    </div>
  `).join('');
}

// Handle Review Submission
function handleReviewSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('reviewerName').value;
  const rating = document.getElementById('reviewerRating').value;
  const text = document.getElementById('reviewerText').value;

  reviews.unshift({ name, rating, text });
  saveState();
  renderReviews();

  document.getElementById('reviewForm').reset();
  showToast('⭐ Thank you for your feedback!');
}

// Notification Toast Helper
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.innerText = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// Security Helper: Escape HTML string to prevent XSS
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, (m) => {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m];
  });
}