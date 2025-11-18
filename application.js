<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application - Secure Funder Certification</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div class="header">
    <a href="/dashboard" class="logo">Aquamark</a>
    <div class="nav-links">
      <a href="/dashboard">Dashboard</a>
      <span id="userEmail"></span>
      <button class="btn-logout" onclick="logout()">Logout</button>
    </div>
  </div>

  <div class="container">
    <h1 class="mb-3">Secure Funder Certification Application</h1>

    <div id="loadingMessage" class="card text-center">
      <div class="loading" style="margin: 2rem auto;"></div>
      <p>Loading application...</p>
    </div>

    <div id="applicationForm" class="hidden">
      <div class="alert alert-info mb-3">
        <strong>Auto-save enabled:</strong> Your progress is automatically saved as you fill out the form.
      </div>

      <div id="errorMessage" class="alert alert-error hidden"></div>
      <div id="successMessage" class="alert alert-success hidden"></div>

      <!-- Part 1: Business Legitimacy -->
      <div class="card">
        <h2 class="card-title">Part 1: Business Legitimacy</h2>

        <div class="form-group">
          <label class="form-label" for="legalBusinessName">Legal Business Name *</label>
          <input type="text" id="legalBusinessName" class="form-input" required>
        </div>

        <div class="form-group">
          <label class="form-label" for="dba">DBA (Doing Business As)</label>
          <input type="text" id="dba" class="form-input">
        </div>

        <div class="form-group">
          <label class="form-label" for="ein">EIN Number *</label>
          <input type="text" id="ein" class="form-input" required>
        </div>

        <div class="form-group">
          <label class="form-label" for="primaryAddress">Primary Address *</label>
          <textarea id="primaryAddress" class="form-textarea" required></textarea>
        </div>

        <div class="form-group">
          <label class="form-label" for="stateOfIncorporation">State of Incorporation *</label>
          <select id="stateOfIncorporation" class="form-select" required>
            <option value="">Select a state</option>
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <option value="AZ">Arizona</option>
            <option value="AR">Arkansas</option>
            <option value="CA">California</option>
            <option value="CO">Colorado</option>
            <option value="CT">Connecticut</option>
            <option value="DE">Delaware</option>
            <option value="FL">Florida</option>
            <option value="GA">Georgia</option>
            <option value="HI">Hawaii</option>
            <option value="ID">Idaho</option>
            <option value="IL">Illinois</option>
            <option value="IN">Indiana</option>
            <option value="IA">Iowa</option>
            <option value="KS">Kansas</option>
            <option value="KY">Kentucky</option>
            <option value="LA">Louisiana</option>
            <option value="ME">Maine</option>
            <option value="MD">Maryland</option>
            <option value="MA">Massachusetts</option>
            <option value="MI">Michigan</option>
            <option value="MN">Minnesota</option>
            <option value="MS">Mississippi</option>
            <option value="MO">Missouri</option>
            <option value="MT">Montana</option>
            <option value="NE">Nebraska</option>
            <option value="NV">Nevada</option>
            <option value="NH">New Hampshire</option>
            <option value="NJ">New Jersey</option>
            <option value="NM">New Mexico</option>
            <option value="NY">New York</option>
            <option value="NC">North Carolina</option>
            <option value="ND">North Dakota</option>
            <option value="OH">Ohio</option>
            <option value="OK">Oklahoma</option>
            <option value="OR">Oregon</option>
            <option value="PA">Pennsylvania</option>
            <option value="RI">Rhode Island</option>
            <option value="SC">South Carolina</option>
            <option value="SD">South Dakota</option>
            <option value="TN">Tennessee</option>
            <option value="TX">Texas</option>
            <option value="UT">Utah</option>
            <option value="VT">Vermont</option>
            <option value="VA">Virginia</option>
            <option value="WA">Washington</option>
            <option value="WV">West Virginia</option>
            <option value="WI">Wisconsin</option>
            <option value="WY">Wyoming</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="website">Website *</label>
          <input type="url" id="website" class="form-input" placeholder="https://" required>
        </div>

        <div class="form-group">
          <label class="form-label" for="socialMediaProfiles">Social Media Profiles</label>
          <textarea id="socialMediaProfiles" class="form-textarea" placeholder="LinkedIn, Twitter, etc."></textarea>
          <span class="form-hint">One per line or comma-separated</span>
        </div>

        <div class="form-group">
          <label class="form-label">Business Liability Insurance *</label>
          <div class="file-upload-area" onclick="document.getElementById('liabilityInsurance').click()">
            <p>Click to upload or drag and drop</p>
            <p class="form-hint">PDF, JPG, or PNG (Max 10MB) - Redactions allowed</p>
          </div>
          <input type="file" id="liabilityInsurance" class="hidden" accept=".pdf,.jpg,.jpeg,.png" onchange="handleFileUpload('liability_insurance', this)">
          <ul id="liabilityInsurance-list" class="file-list"></ul>
        </div>

        <div class="form-group">
          <label class="form-label">States You DO NOT Lend In</label>
          <div id="excludedStates" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.5rem; margin-top: 0.5rem;">
            <!-- Restricted states only -->
            <label><input type="checkbox" class="form-checkbox" name="excludedState" value="CA"> California</label>
            <label><input type="checkbox" class="form-checkbox" name="excludedState" value="CT"> Connecticut</label>
            <label><input type="checkbox" class="form-checkbox" name="excludedState" value="FL"> Florida</label>
            <label><input type="checkbox" class="form-checkbox" name="excludedState" value="GA"> Georgia</label>
            <label><input type="checkbox" class="form-checkbox" name="excludedState" value="LA"> Louisiana</label>
            <label><input type="checkbox" class="form-checkbox" name="excludedState" value="MO"> Missouri</label>
            <label><input type="checkbox" class="form-checkbox" name="excludedState" value="ND"> North Dakota</label>
            <label><input type="checkbox" class="form-checkbox" name="excludedState" value="NY"> New York</label>
            <label><input type="checkbox" class="form-checkbox" name="excludedState" value="TX"> Texas</label>
            <label><input type="checkbox" class="form-checkbox" name="excludedState" value="UT"> Utah</label>
          </div>
        </div>

        <div id="licensingSection" class="hidden">
          <div class="alert alert-info">
            You've indicated you lend in states requiring licensing/registration. Please provide details:
          </div>

          <div class="form-group">
            <label class="form-label" for="stateLicensingNotes">License Numbers & Notes</label>
            <textarea id="stateLicensingNotes" class="form-textarea" placeholder="State: License Number&#10;State: License Number"></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Supporting Documents (Optional)</label>
            <div class="file-upload-area" onclick="document.getElementById('stateLicensingDocs').click()">
              <p>Click to upload license documentation</p>
              <p class="form-hint">PDF, JPG, or PNG (Max 10MB)</p>
            </div>
            <input type="file" id="stateLicensingDocs" class="hidden" accept=".pdf,.jpg,.jpeg,.png" onchange="handleFileUpload('state_licensing_docs', this)">
            <ul id="stateLicensingDocs-list" class="file-list"></ul>
          </div>
        </div>
      </div>

      <!-- Part 2: Technical Safeguards -->
      <div class="card">
        <h2 class="card-title">Part 2: Technical Safeguards</h2>

        <div class="form-group">
          <label class="form-label">CRM Role-Based Access Controls *</label>
          <p class="form-hint mb-2">Screenshot showing role-based access controls in your CRM</p>
          <div class="file-upload-area" onclick="document.getElementById('crmScreenshot').click()">
            <p>Click to upload screenshot</p>
            <p class="form-hint">PDF, JPG, or PNG (Max 10MB)</p>
          </div>
          <input type="file" id="crmScreenshot" class="hidden" accept=".pdf,.jpg,.jpeg,.png" onchange="handleFileUpload('crm_screenshot', this)">
          <ul id="crmScreenshot-list" class="file-list"></ul>
        </div>

        <div class="form-group">
          <label class="form-label">Workstation Security Policy *</label>
          <div class="file-upload-area" onclick="document.getElementById('workstationPolicy').click()">
            <p>Click to upload policy document</p>
            <p class="form-hint">PDF, DOC, or DOCX (Max 10MB)</p>
          </div>
          <input type="file" id="workstationPolicy" class="hidden" accept=".pdf,.doc,.docx" onchange="handleFileUpload('workstation_policy', this)">
          <ul id="workstationPolicy-list" class="file-list"></ul>
        </div>

        <div class="form-group">
          <label class="form-label">Offboarding/Access Removal Policy *</label>
          <div class="file-upload-area" onclick="document.getElementById('offboardingPolicy').click()">
            <p>Click to upload policy/checklist</p>
            <p class="form-hint">PDF, DOC, or DOCX (Max 10MB)</p>
          </div>
          <input type="file" id="offboardingPolicy" class="hidden" accept=".pdf,.doc,.docx" onchange="handleFileUpload('offboarding_policy', this)">
          <ul id="offboardingPolicy-list" class="file-list"></ul>
        </div>

        <div class="form-group">
          <label>
            <input type="checkbox" id="watermarkingAgreement" class="form-checkbox">
            I agree to implement Aquamark's watermarking API within 60 days of certification *
          </label>
          <p class="form-hint mt-1">API documentation: <a href="https://www.aquamark.io/funder-api" target="_blank">https://www.aquamark.io/funder-api</a></p>
        </div>
      </div>

      <!-- Part 3: Ethical Conduct -->
      <div class="card">
        <h2 class="card-title">Part 3: Ethical Conduct</h2>

        <div class="form-group">
          <label>
            <input type="checkbox" id="backgroundCheckAttestation" class="form-checkbox">
            I attest that we complete background checks on all employees *
          </label>
        </div>

        <div class="form-group">
          <label class="form-label">Background Check Authorization Document *</label>
          <p class="form-hint mb-2">Upload the authorization form you provide to employees</p>
          <div class="file-upload-area" onclick="document.getElementById('backgroundCheckAuth').click()">
            <p>Click to upload authorization document</p>
            <p class="form-hint">PDF, DOC, or DOCX (Max 10MB)</p>
          </div>
          <input type="file" id="backgroundCheckAuth" class="hidden" accept=".pdf,.doc,.docx" onchange="handleFileUpload('background_check_authorization', this)">
          <ul id="backgroundCheckAuth-list" class="file-list"></ul>
        </div>

        <div class="form-group">
          <label>
            <input type="checkbox" id="bpoOffshoreAttestation" class="form-checkbox">
            If we use BPO or offshore services, we verify they also conduct background checks
          </label>
        </div>

        <div class="form-group">
          <label class="form-label" for="bpoOffshoreNotes">BPO/Offshore Services Notes (if applicable)</label>
          <textarea id="bpoOffshoreNotes" class="form-textarea" placeholder="Describe your BPO/offshore arrangements and background check verification"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Company Code of Conduct *</label>
          <div class="file-upload-area" onclick="document.getElementById('codeOfConduct').click()">
            <p>Click to upload code of conduct</p>
            <p class="form-hint">PDF, DOC, or DOCX (Max 10MB)</p>
          </div>
          <input type="file" id="codeOfConduct" class="hidden" accept=".pdf,.doc,.docx" onchange="handleFileUpload('code_of_conduct', this)">
          <ul id="codeOfConduct-list" class="file-list"></ul>
        </div>

        <div class="form-group">
          <label class="form-label">Underwriting Guidelines (All Products) *</label>
          <div class="file-upload-area" onclick="document.getElementById('underwritingGuidelines').click()">
            <p>Click to upload underwriting guidelines</p>
            <p class="form-hint">PDF, DOC, or DOCX (Max 10MB)</p>
          </div>
          <input type="file" id="underwritingGuidelines" class="hidden" accept=".pdf,.doc,.docx" onchange="handleFileUpload('underwriting_guidelines', this)">
          <ul id="underwritingGuidelines-list" class="file-list"></ul>
        </div>

        <div class="form-group">
          <label class="form-label">Fee Schedule *</label>
          <div class="file-upload-area" onclick="document.getElementById('feeSchedule').click()">
            <p>Click to upload fee schedule</p>
            <p class="form-hint">PDF, DOC, or DOCX (Max 10MB)</p>
          </div>
          <input type="file" id="feeSchedule" class="hidden" accept=".pdf,.doc,.docx" onchange="handleFileUpload('fee_schedule', this)">
          <ul id="feeSchedule-list" class="file-list"></ul>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="card">
        <div class="alert alert-info mb-3">
          <strong>Before submitting:</strong> Review all sections to ensure completeness. Once submitted, you cannot edit your application.
        </div>
        
        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <button type="button" class="btn btn-secondary" onclick="window.location.href='/dashboard'">Save & Return to Dashboard</button>
          <button type="button" id="submitBtn" class="btn btn-primary" onclick="submitApplication()">Submit Application</button>
        </div>
      </div>
    </div>
  </div>

  <script src="/auth.js"></script>
  <script src="/application.js"></script>
</body>
</html>
