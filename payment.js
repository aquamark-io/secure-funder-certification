// Payment JavaScript
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

// Check if coming back from Stripe
const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('session_id');

if (sessionId) {
  verifyPayment(sessionId);
} else {
  checkApplicationStatus();
}

async function checkApplicationStatus() {
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
    
    // Check if application is approved
    if (application.status !== 'approved' && application.status !== 'payment_pending') {
      document.getElementById('loadingMessage').classList.add('hidden');
      document.getElementById('notApprovedMessage').classList.remove('hidden');
      return;
    }
    
    // Check if already paid
    if (application.status === 'certified' || application.payment_completed_at) {
      window.location.href = '/certification';
      return;
    }
    
    // Show payment page
    document.getElementById('loadingMessage').classList.add('hidden');
    document.getElementById('paymentContent').classList.remove('hidden');
    
  } catch (error) {
    console.error('Error checking status:', error);
    document.getElementById('loadingMessage').innerHTML = `
      <div class="alert alert-error">
        Failed to load payment page. Please try refreshing.
      </div>
    `;
  }
}

async function createCheckout() {
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutText = document.getElementById('checkoutText');
  const checkoutSpinner = document.getElementById('checkoutSpinner');
  
  checkoutBtn.disabled = true;
  checkoutText.classList.add('hidden');
  checkoutSpinner.classList.remove('hidden');
  
  try {
    const response = await fetch(`${API_URL}/payment/create-checkout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to create checkout session');
    }
    
    const data = await response.json();
    
    // Redirect to Stripe checkout
    window.location.href = data.url;
    
  } catch (error) {
    console.error('Checkout error:', error);
    alert(`Failed to start checkout: ${error.message}`);
    checkoutBtn.disabled = false;
    checkoutText.classList.remove('hidden');
    checkoutSpinner.classList.add('hidden');
  }
}

async function verifyPayment(sessionId) {
  document.getElementById('loadingMessage').innerHTML = `
    <div class="loading" style="margin: 2rem auto;"></div>
    <p>Verifying your payment...</p>
  `;
  
  try {
    const response = await fetch(`${API_URL}/payment/verify/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Payment verification failed');
    }
    
    const data = await response.json();
    
    if (data.certified) {
      // Payment successful, redirect to certification page
      window.location.href = '/certification';
    } else {
      throw new Error('Payment not completed');
    }
    
  } catch (error) {
    console.error('Verification error:', error);
    document.getElementById('loadingMessage').innerHTML = `
      <div class="alert alert-error">
        <strong>Payment verification failed.</strong><br>
        If you completed payment, please contact us at support@aquamark.io
      </div>
      <p class="text-center mt-2">
        <a href="/dashboard" class="btn btn-primary">Return to Dashboard</a>
      </p>
    `;
  }
}
