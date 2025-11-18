// Dashboard JavaScript
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : 'https://secure-funder-api.onrender.com/api';

// Check authentication
if (!isAuthenticated()) {
  window.location.href = '/login';
}

// Display user email
const user = getUserInfo();
if (user) {
  document.getElementById('userEmail').textContent = user.email;
}

// Load application status
async function loadDashboard() {
  try {
    const response = await fetch(`${API_URL}/application`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        logout();
        return;
      }
      throw new Error('Failed to load application');
    }

    const application = await response.json();
    
    // Hide loading, show content
    document.getElementById('loadingMessage').classList.add('hidden');
    document.getElementById('dashboardContent').classList.remove('hidden');
    
    // Update status badge
    updateStatusBadge(application.status);
    
    // Update progress steps
    updateProgressSteps(application.status);
    
    // Show status-specific message
    showStatusMessage(application.status);
    
  } catch (error) {
    console.error('Error loading dashboard:', error);
    document.getElementById('loadingMessage').innerHTML = `
      <div class="alert alert-error">
        Failed to load application. Please try refreshing the page.
      </div>
    `;
  }
}

function updateStatusBadge(status) {
  const badge = document.getElementById('statusBadge');
  const continueBtn = document.getElementById('continueBtn');
  
  let displayStatus = status;
  let badgeClass = 'status-draft';
  
  switch(status) {
    case 'draft':
      displayStatus = 'Draft';
      badgeClass = 'status-draft';
      continueBtn.classList.remove('hidden');
      continueBtn.textContent = 'Continue Application';
      continueBtn.onclick = () => window.location.href = '/application';
      break;
    case 'submitted':
    case 'under_review':
      displayStatus = 'Under Review';
      badgeClass = 'status-under_review';
      break;
    case 'approved':
      displayStatus = 'Approved - Payment Required';
      badgeClass = 'status-approved';
      continueBtn.classList.remove('hidden');
      continueBtn.textContent = 'Proceed to Payment';
      continueBtn.onclick = () => window.location.href = '/payment';
      break;
    case 'rejected':
      displayStatus = 'Rejected';
      badgeClass = 'status-rejected';
      break;
    case 'certified':
      displayStatus = 'Certified';
      badgeClass = 'status-certified';
      continueBtn.classList.remove('hidden');
      continueBtn.textContent = 'View Certification';
      continueBtn.classList.add('btn-success');
      continueBtn.onclick = () => window.location.href = '/certification';
      break;
  }
  
  badge.textContent = displayStatus;
  badge.className = `status-badge ${badgeClass}`;
}

function updateProgressSteps(status) {
  // Reset all steps
  document.querySelectorAll('.step').forEach(step => {
    step.classList.remove('active', 'completed');
  });
  
  const stepApplication = document.getElementById('step-application');
  const stepReview = document.getElementById('step-review');
  const stepPayment = document.getElementById('step-payment');
  const stepCertification = document.getElementById('step-certification');
  
  switch(status) {
    case 'draft':
      stepApplication.classList.add('active');
      break;
    case 'submitted':
    case 'under_review':
      stepApplication.classList.add('completed');
      stepReview.classList.add('active');
      break;
    case 'approved':
      stepApplication.classList.add('completed');
      stepReview.classList.add('completed');
      stepPayment.classList.add('active');
      break;
    case 'rejected':
      stepApplication.classList.add('completed');
      stepReview.classList.add('completed');
      break;
    case 'certified':
      stepApplication.classList.add('completed');
      stepReview.classList.add('completed');
      stepPayment.classList.add('completed');
      stepCertification.classList.add('active');
      break;
  }
}

function showStatusMessage(status) {
  const messageDiv = document.getElementById('statusMessage');
  
  let messageHTML = '';
  
  switch(status) {
    case 'draft':
      messageHTML = `
        <div class="card">
          <h3>Complete Your Application</h3>
          <p class="text-medium mb-2">Your application is in draft status. Complete all three parts to submit for review:</p>
          <ul style="margin-left: 1.5rem; margin-bottom: 1rem;">
            <li>Part 1: Business Legitimacy</li>
            <li>Part 2: Technical Safeguards</li>
            <li>Part 3: Ethical Conduct</li>
          </ul>
          <p class="text-medium">Your progress is automatically saved as you work.</p>
        </div>
      `;
      break;
    case 'submitted':
    case 'under_review':
      messageHTML = `
        <div class="card">
          <h3>Application Under Review</h3>
          <p class="text-medium">Our team is reviewing your application. This typically takes 2-3 business days.</p>
          <p class="text-medium mt-2">We'll update your status once the review is complete.</p>
        </div>
      `;
      break;
    case 'approved':
      messageHTML = `
        <div class="card">
          <div class="alert alert-success">
            <strong>Congratulations!</strong> Your application has been approved.
          </div>
          <h3>Next Step: Payment</h3>
          <p class="text-medium mb-2">To complete your certification, please proceed to payment:</p>
          <ul style="margin-left: 1.5rem; margin-bottom: 1rem;">
            <li><strong>Certification Fee:</strong> $3,499 (one-time annual fee)</li>
            <li><strong>Valid for:</strong> Calendar year 2026</li>
            <li><strong>Includes:</strong> Digital badge, certificate, and directory listing</li>
          </ul>
        </div>
      `;
      break;
    case 'rejected':
      messageHTML = `
        <div class="card">
          <div class="alert alert-error">
            Your application was not approved at this time.
          </div>
          <p class="text-medium">Please contact us at <a href="mailto:support@aquamark.io">support@aquamark.io</a> for more information.</p>
        </div>
      `;
      break;
    case 'certified':
      messageHTML = `
        <div class="card">
          <div class="alert alert-success">
            <strong>You are certified!</strong> Welcome to the Secure Funder program.
          </div>
          <h3>Your Certification</h3>
          <p class="text-medium mb-2">You can now:</p>
          <ul style="margin-left: 1.5rem; margin-bottom: 1rem;">
            <li>Download your digital badge</li>
            <li>Download your certificate</li>
            <li>Access watermarking API integration</li>
            <li>Be listed in the Secure Funder directory</li>
          </ul>
        </div>
      `;
      break;
  }
  
  messageDiv.innerHTML = messageHTML;
}

// Load dashboard on page load
loadDashboard();
