// Certification JavaScript
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

let certificationData = null;

async function loadCertification() {
  try {
    const response = await fetch(`${API_URL}/certification/status`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        logout();
        return;
      }
      throw new Error('Failed to load certification');
    }

    const data = await response.json();
    
    if (!data.certified) {
      document.getElementById('loadingMessage').classList.add('hidden');
      document.getElementById('notCertifiedMessage').classList.remove('hidden');
      return;
    }
    
    certificationData = data;
    
    // Populate certification details
    document.getElementById('companyName').textContent = data.companyName;
    document.getElementById('companyNameDetail').textContent = data.companyName;
    
    // Get certificate details
    await loadCertificateDetails();
    
    // Show content
    document.getElementById('loadingMessage').classList.add('hidden');
    document.getElementById('certificationContent').classList.remove('hidden');
    
  } catch (error) {
    console.error('Error loading certification:', error);
    document.getElementById('loadingMessage').innerHTML = `
      <div class="alert alert-error">
        Failed to load certification. Please try refreshing.
      </div>
    `;
  }
}

async function loadCertificateDetails() {
  try {
    const response = await fetch(`${API_URL}/certification/certificate`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      document.getElementById('certificateNumber').textContent = data.certificateNumber;
      document.getElementById('certificateNumberDetail').textContent = data.certificateNumber;
      document.getElementById('certifiedDate').textContent = data.certifiedDate;
    }
  } catch (error) {
    console.error('Error loading certificate details:', error);
  }
}

async function downloadBadge() {
  try {
    const response = await fetch(`${API_URL}/certification/badge`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get badge URL');
    }

    const data = await response.json();
    
    // Open badge URL in new tab
    window.open(data.badgeUrl, '_blank');
    
  } catch (error) {
    console.error('Badge download error:', error);
    alert('Failed to download badge. Please try again.');
  }
}

async function generateCertificate() {
  try {
    const response = await fetch(`${API_URL}/certification/certificate`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get certificate data');
    }

    const data = await response.json();
    
    // Create a simple certificate HTML for printing/PDF
    const certificateHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Secure Funder Certificate - ${data.companyName}</title>
        <style>
          body {
            font-family: Georgia, serif;
            max-width: 800px;
            margin: 2rem auto;
            padding: 2rem;
            text-align: center;
          }
          .certificate {
            border: 10px solid #0052CC;
            padding: 3rem;
            background: #f9f9f9;
          }
          h1 {
            color: #0052CC;
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
          }
          .subtitle {
            font-size: 1.5rem;
            color: #666;
            margin-bottom: 2rem;
          }
          .company-name {
            font-size: 2rem;
            font-weight: bold;
            color: #000;
            margin: 2rem 0;
          }
          .details {
            margin-top: 2rem;
            font-size: 1rem;
            color: #666;
          }
          .signature {
            margin-top: 3rem;
            padding-top: 1rem;
            border-top: 2px solid #0052CC;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <h1>Certificate of Certification</h1>
          <div class="subtitle">Secure Funder™ Program</div>
          
          <p>This certifies that</p>
          
          <div class="company-name">${data.companyName}</div>
          
          <p>has successfully completed the requirements for certification as a</p>
          <p style="font-size: 1.25rem; font-weight: bold; color: #0052CC;">Secure Funder ${data.certificationYear}</p>
          
          <div class="details">
            <p>Certificate Number: ${data.certificateNumber}</p>
            <p>Date of Certification: ${data.certifiedDate}</p>
            <p>Valid Through: December 31, ${data.certificationYear}</p>
          </div>
          
          <div class="signature">
            <p><strong>Aquamark</strong></p>
            <p>www.aquamark.io</p>
          </div>
        </div>
        
        <p style="margin-top: 2rem; color: #666;">
          <button onclick="window.print()" style="padding: 0.75rem 2rem; background: #0052CC; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem;">
            Print Certificate
          </button>
        </p>
      </body>
      </html>
    `;
    
    // Open certificate in new window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(certificateHTML);
    printWindow.document.close();
    
  } catch (error) {
    console.error('Certificate generation error:', error);
    alert('Failed to generate certificate. Please try again.');
  }
}

// Load certification on page load
loadCertification();
