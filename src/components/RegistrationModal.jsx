import React, { useState } from 'react';
import { 
  X, ShieldCheck, AlertCircle, CheckCircle, Fingerprint, 
  User, Calendar, Phone, Mail, MapPin, Heart, FileText, 
  Users, Building, AlertTriangle, Shield 
} from 'lucide-react';
import { 
  formatAadhaar, isValidAadhaar, calculateAge, 
  generateVitalTraceId, maskAadhaar 
} from '../utils/helpers';
import { POPULAR_GOVT_SCHEMES, POPULAR_INSURERS, COMMON_TPAS } from '../data/initialData';

export default function RegistrationModal({ isOpen, onClose, onRegister, existingProfiles }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '',
    email: '',
    address: '',
    aadhaarNumber: '',
    isMinorManual: false,
    // Guardian details for minor
    guardianName: '',
    guardianRelation: 'Father',
    guardianAadhaar: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianConsentSigned: true,
    // Initial Scheme (optional)
    includeScheme: false,
    schemeName: 'Ayushman Bharat - PM-JAY',
    schemeCategory: 'Central',
    schemeBeneficiaryId: '',
    // Initial Mediclaim (optional)
    includeMediclaim: false,
    policyType: 'Organizational / Corporate Mediclaim',
    employerName: '',
    insuranceCompany: 'Star Health & Allied Insurance Co Ltd',
    tpaName: 'Medi Assist Healthcare TPA',
    policyNumber: '',
    sumInsured: 500000,
    // Initial Allergy & Medication (optional)
    primaryAllergy: '',
    currentMedication: ''
  });

  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
  const [generatedMockOtp, setGeneratedMockOtp] = useState('');
  const [guardianOtpSent, setGuardianOtpSent] = useState(false);
  const [guardianOtpVerified, setGuardianOtpVerified] = useState(false);
  const [formError, setFormError] = useState('');

  // Determine if patient is minor
  const calculatedAge = formData.dob ? calculateAge(formData.dob) : null;
  const isMinor = (calculatedAge !== null && calculatedAge < 18) || formData.isMinorManual;

  const handleAadhaarChange = (e) => {
    const formatted = formatAadhaar(e.target.value);
    setFormData(prev => ({ ...prev, aadhaarNumber: formatted }));
    setIsAadhaarVerified(false);
    setOtpSent(false);
    setFormError('');
  };

  const handleGuardianAadhaarChange = (e) => {
    const formatted = formatAadhaar(e.target.value);
    setFormData(prev => ({ ...prev, guardianAadhaar: formatted }));
    setGuardianOtpVerified(false);
    setGuardianOtpSent(false);
  };

  const handleSendAadhaarOtp = () => {
    if (!isValidAadhaar(formData.aadhaarNumber)) {
      setFormError('Please enter a valid 12-digit Aadhaar Card number.');
      return;
    }

    // Check duplicate Aadhaar across existing profiles
    const cleanCurrent = formData.aadhaarNumber.replace(/\s+/g, '');
    const duplicate = existingProfiles.find(
      p => p.aadhaarNumber.replace(/\s+/g, '') === cleanCurrent
    );

    if (duplicate) {
      setFormError(`Aadhaar already registered to: ${duplicate.fullName} (${duplicate.vitalTraceId}). Aadhaar must be unique!`);
      return;
    }

    setFormError('');
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedMockOtp(mockOtp);
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (enteredOtp === generatedMockOtp || enteredOtp === '123456') {
      setIsAadhaarVerified(true);
      setFormError('');
    } else {
      setFormError('Invalid OTP! Please enter the 6-digit simulation code shown.');
    }
  };

  const handleVerifyGuardianOtp = () => {
    setGuardianOtpVerified(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.fullName.trim()) {
      setFormError('Full Name is required.');
      return;
    }
    if (!formData.dob) {
      setFormError('Date of Birth is required.');
      return;
    }
    if (!isValidAadhaar(formData.aadhaarNumber)) {
      setFormError('A valid 12-digit Aadhaar number is required.');
      return;
    }
    if (!isAadhaarVerified) {
      setFormError('Please verify Aadhaar with the OTP verification simulation.');
      return;
    }

    // Check duplicate Aadhaar once more
    const cleanCurrent = formData.aadhaarNumber.replace(/\s+/g, '');
    const duplicate = existingProfiles.find(
      p => p.aadhaarNumber.replace(/\s+/g, '') === cleanCurrent
    );
    if (duplicate) {
      setFormError(`Aadhaar is already registered to ${duplicate.fullName}. Uniqueness is strictly enforced.`);
      return;
    }

    // Validate Minor requirements
    if (isMinor) {
      if (!formData.guardianName.trim()) {
        setFormError('For minor patients, Parent / Guardian Name is required.');
        return;
      }
      if (!formData.guardianAadhaar || !isValidAadhaar(formData.guardianAadhaar)) {
        setFormError('Parent / Guardian 12-digit Aadhaar number is required for minors.');
        return;
      }
    }

    const newId = `vt-user-${Date.now()}`;
    const newVitalTraceId = generateVitalTraceId();

    // Build government schemes array
    const govtSchemes = [];
    if (formData.includeScheme && formData.schemeBeneficiaryId) {
      govtSchemes.push({
        id: `sch-${Date.now()}`,
        category: formData.schemeCategory,
        schemeName: formData.schemeName,
        beneficiaryId: formData.schemeBeneficiaryId,
        state: formData.schemeCategory === 'State' ? 'State Specified' : 'Central Govt',
        familyHeadName: isMinor ? formData.guardianName : formData.fullName,
        cashlessCoverageLimit: 500000,
        availableBalance: 500000,
        status: 'Active & Verified',
        empanelledHospitalsCount: 28000,
        cardIssuedDate: new Date().toISOString().split('T')[0],
        lastCashlessClaim: 'None'
      });
    }

    // Build mediclaim array
    const mediclaimPolicies = [];
    if (formData.includeMediclaim && formData.policyNumber) {
      mediclaimPolicies.push({
        id: `med-${Date.now()}`,
        policyType: formData.policyType,
        employerName: formData.policyType.includes('Corporate') ? (formData.employerName || 'Organization') : 'Individual',
        employeeId: formData.policyType.includes('Corporate') ? 'EMP-REG-01' : 'N/A',
        insuranceCompany: formData.insuranceCompany,
        tpaName: formData.tpaName,
        policyNumber: formData.policyNumber,
        tpaMemberId: `TPA-MEM-${Math.floor(100000 + Math.random() * 900000)}`,
        sumInsured: Number(formData.sumInsured) || 500000,
        cashlessBalanceAvailable: Number(formData.sumInsured) || 500000,
        validFrom: new Date().toISOString().split('T')[0],
        validTill: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        cashlessDeskHelpline: '1800-102-4477',
        status: 'Active Cashless Approved',
        coPay: '0%',
        roomRentCap: 'Single Standard AC'
      });
    }

    // Build allergies array
    const allergies = [];
    if (formData.primaryAllergy.trim()) {
      allergies.push({
        id: `all-${Date.now()}`,
        substance: formData.primaryAllergy,
        severity: 'HIGH ALERT (Severe)',
        reaction: 'Allergic reaction recorded at registration',
        diagnosedBy: 'Reported by Patient/Guardian',
        dateRecorded: new Date().toISOString().split('T')[0]
      });
    }

    // Build medications array
    const medications = [];
    if (formData.currentMedication.trim()) {
      medications.push({
        id: `med-reg-${Date.now()}`,
        medicineName: formData.currentMedication,
        dosage: 'As prescribed',
        condition: 'Ongoing medical therapy',
        prescribedHospital: 'Registered Clinic',
        doctorName: 'Attending Physician',
        startDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      });
    }

    const newProfile = {
      id: newId,
      vitalTraceId: newVitalTraceId,
      fullName: formData.fullName.trim(),
      dob: formData.dob,
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      phone: formData.phone || (isMinor ? formData.guardianPhone : ''),
      email: formData.email,
      address: formData.address || 'Address registered with Aadhaar',
      aadhaarNumber: formData.aadhaarNumber,
      isAadhaarVerified: true,
      isMinor: isMinor,
      emergencyContact: {
        name: isMinor ? formData.guardianName : (formData.guardianName || 'Family Member'),
        relation: isMinor ? formData.guardianRelation : 'Emergency Contact',
        phone: isMinor ? formData.guardianPhone : (formData.phone || '+91 99999 99999')
      },
      guardianDetails: isMinor ? {
        guardianName: formData.guardianName.trim(),
        relation: formData.guardianRelation,
        guardianAadhaar: formData.guardianAadhaar,
        guardianAadhaarVerified: true,
        guardianPhone: formData.guardianPhone,
        guardianEmail: formData.guardianEmail,
        guardianVitalTraceId: 'VT-LINKED-GUARDIAN',
        consentSigned: formData.guardianConsentSigned,
        consentDate: new Date().toISOString().split('T')[0],
        consentScope: 'Emergency cashless hospital admission, pediatric procedure authorization & universal medical history disclosure across empanelled healthcare providers.'
      } : null,
      govtSchemes,
      mediclaimPolicies,
      allergies,
      medications,
      hospitalHistory: []
    };

    onRegister(newProfile);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-icon">
            <Fingerprint size={24} className="text-cyan" />
          </div>
          <div>
            <h2 className="modal-title">Create Aadhaar-Linked Health Account</h2>
            <p className="modal-subtitle">
              VitalTrace National Health Record Registry • Interoperable Hospital & Emergency Access
            </p>
          </div>
          <button type="button" onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        {formError && (
          <div className="alert-box alert-error">
            <AlertCircle size={18} />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Section 1: Unique Aadhaar Verification */}
          <div className="form-section highlight-box">
            <div className="section-header">
              <ShieldCheck size={18} className="text-emerald" />
              <h3>1. Unique Identity: UIDAI Aadhaar Linking</h3>
              <span className="badge badge-emerald">Mandatory Uniqueness</span>
            </div>
            <p className="section-note">
              Aadhaar ensures every patient has a single, non-duplicated national health history across all hospitals.
            </p>

            <div className="form-row">
              <div className="form-group flex-2">
                <label className="field-label">12-Digit Aadhaar Card Number *</label>
                <div className="input-with-icon">
                  <Fingerprint size={18} className="input-icon" />
                  <input
                    type="text"
                    value={formData.aadhaarNumber}
                    onChange={handleAadhaarChange}
                    placeholder="1234 5678 9012"
                    maxLength={14}
                    className="form-input"
                    disabled={isAadhaarVerified}
                  />
                </div>
              </div>

              <div className="form-group flex-1 action-align-end">
                {!isAadhaarVerified ? (
                  <button
                    type="button"
                    onClick={handleSendAadhaarOtp}
                    disabled={!isValidAadhaar(formData.aadhaarNumber) || otpSent}
                    className="btn btn-secondary full-width"
                  >
                    {otpSent ? 'OTP Sent to Mobile' : 'Send UIDAI OTP'}
                  </button>
                ) : (
                  <div className="verified-pill">
                    <CheckCircle size={16} /> Aadhaar Verified
                  </div>
                )}
              </div>
            </div>

            {/* OTP Simulation Panel */}
            {otpSent && !isAadhaarVerified && (
              <div className="otp-verification-box">
                <div className="otp-info">
                  <Shield size={16} className="text-cyan" />
                  <span>
                    Simulated UIDAI e-KYC: OTP sent to linked mobile. Use test code: <strong>{generatedMockOtp}</strong>
                  </span>
                </div>
                <div className="otp-input-group">
                  <input
                    type="text"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.trim())}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="form-input otp-field"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="btn btn-primary"
                  >
                    Verify & Authenticate
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Personal Details */}
          <div className="form-section">
            <div className="section-header">
              <User size={18} className="text-cyan" />
              <h3>2. Patient Details</h3>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="field-label">Full Legal Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Ramesh Kumar Verma"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="field-label">Date of Birth *</label>
                <div className="input-with-icon">
                  <Calendar size={16} className="input-icon" />
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                {calculatedAge !== null && (
                  <span className={`age-badge ${calculatedAge < 18 ? 'badge-amber' : 'badge-neutral'}`}>
                    Age: {calculatedAge} yrs {calculatedAge < 18 ? '(Minor / Dependent)' : '(Adult)'}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="field-label">Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="form-select"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other / Non-binary</option>
                </select>
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="field-label">Blood Group *</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="form-select"
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="field-label">Mobile Number</label>
                <div className="input-with-icon">
                  <Phone size={16} className="input-icon" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="field-label">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="field-label">Residential Address</label>
              <div className="input-with-icon">
                <MapPin size={16} className="input-icon" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street / Colony, City, State, PIN Code"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Minor & Parent/Guardian Details (Conditional) */}
          {isMinor && (
            <div className="form-section guardian-box">
              <div className="section-header">
                <Users size={18} className="text-amber" />
                <h3>3. Minor Patient - Parent / Guardian Legal Details</h3>
                <span className="badge badge-amber">Minor Detected (&lt; 18 yrs)</span>
              </div>
              <p className="section-note">
                Indian healthcare and digital health regulations require verified parent/guardian consent for minor accounts and emergency interventions.
              </p>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="field-label">Guardian Legal Full Name *</label>
                  <input
                    type="text"
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    placeholder="Father / Mother / Legal Guardian name"
                    className="form-input"
                    required={isMinor}
                  />
                </div>

                <div className="form-group">
                  <label className="field-label">Relationship to Minor *</label>
                  <select
                    value={formData.guardianRelation}
                    onChange={(e) => setFormData({ ...formData, guardianRelation: e.target.value })}
                    className="form-select"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Legal Guardian">Legal Court-Appointed Guardian</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="field-label">Guardian Mobile Number *</label>
                  <input
                    type="tel"
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="form-input"
                    required={isMinor}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-2">
                  <label className="field-label">Guardian 12-Digit Aadhaar Card Number *</label>
                  <input
                    type="text"
                    value={formData.guardianAadhaar}
                    onChange={handleGuardianAadhaarChange}
                    placeholder="Guardian Aadhaar (e.g. 7849 2201 9934)"
                    maxLength={14}
                    className="form-input"
                    required={isMinor}
                  />
                </div>
                <div className="form-group flex-1 action-align-end">
                  {!guardianOtpVerified ? (
                    <button
                      type="button"
                      onClick={handleVerifyGuardianOtp}
                      disabled={!isValidAadhaar(formData.guardianAadhaar)}
                      className="btn btn-secondary full-width"
                    >
                      Authenticate Guardian
                    </button>
                  ) : (
                    <div className="verified-pill">
                      <CheckCircle size={16} /> Guardian Linked
                    </div>
                  )}
                </div>
              </div>

              <div className="consent-checkbox-wrap">
                <input
                  type="checkbox"
                  id="guardianConsent"
                  checked={formData.guardianConsentSigned}
                  onChange={(e) => setFormData({ ...formData, guardianConsentSigned: e.target.checked })}
                />
                <label htmlFor="guardianConsent" className="consent-text">
                  I, as the parent/legal guardian, authorize emergency medical access, cashless insurance processing under my policy, and interoperable clinical data sharing for the minor across verified hospitals.
                </label>
              </div>
            </div>
          )}

          {/* Section 4: Optional Initial Health Schemes & Mediclaim */}
          <div className="form-section">
            <div className="section-header">
              <Building size={18} className="text-cyan" />
              <h3>4. Cashless Schemes & Mediclaim (Optional Quick Setup)</h3>
            </div>
            <p className="section-note">
              You can also add or manage comprehensive scheme and policy details anytime from the profile section.
            </p>

            <div className="quick-toggles-grid">
              {/* Scheme Toggle */}
              <div className="toggle-card">
                <div className="toggle-header">
                  <input
                    type="checkbox"
                    id="includeScheme"
                    checked={formData.includeScheme}
                    onChange={(e) => setFormData({ ...formData, includeScheme: e.target.checked })}
                  />
                  <label htmlFor="includeScheme" className="toggle-title">
                    State / Central Health Scheme (Cashless)
                  </label>
                </div>
                {formData.includeScheme && (
                  <div className="toggle-content">
                    <div className="form-group">
                      <label className="field-label">Scheme Name</label>
                      <select
                        value={formData.schemeName}
                        onChange={(e) => {
                          const s = POPULAR_GOVT_SCHEMES.find(item => item.name === e.target.value);
                          setFormData({ 
                            ...formData, 
                            schemeName: e.target.value,
                            schemeCategory: s ? s.category : 'Central'
                          });
                        }}
                        className="form-select"
                      >
                        {POPULAR_GOVT_SCHEMES.map(s => (
                          <option key={s.name} value={s.name}>
                            {s.name} ({s.category} - {s.state})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="field-label">Beneficiary ID / Card Number</label>
                      <input
                        type="text"
                        value={formData.schemeBeneficiaryId}
                        onChange={(e) => setFormData({ ...formData, schemeBeneficiaryId: e.target.value })}
                        placeholder="e.g. PMJAY-UP-98421092"
                        className="form-input"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Mediclaim Toggle */}
              <div className="toggle-card">
                <div className="toggle-header">
                  <input
                    type="checkbox"
                    id="includeMediclaim"
                    checked={formData.includeMediclaim}
                    onChange={(e) => setFormData({ ...formData, includeMediclaim: e.target.checked })}
                  />
                  <label htmlFor="includeMediclaim" className="toggle-title">
                    Private or Corporate Mediclaim Policy
                  </label>
                </div>
                {formData.includeMediclaim && (
                  <div className="toggle-content">
                    <div className="form-group">
                      <label className="field-label">Policy Type</label>
                      <select
                        value={formData.policyType}
                        onChange={(e) => setFormData({ ...formData, policyType: e.target.value })}
                        className="form-select"
                      >
                        <option value="Organizational / Corporate Mediclaim">Organizational / Corporate Mediclaim</option>
                        <option value="Private / Individual Mediclaim">Private / Individual Mediclaim</option>
                        <option value="Private / Family Floater">Private / Family Floater</option>
                      </select>
                    </div>
                    {formData.policyType.includes('Corporate') && (
                      <div className="form-group">
                        <label className="field-label">Employer / Organization Name</label>
                        <input
                          type="text"
                          value={formData.employerName}
                          onChange={(e) => setFormData({ ...formData, employerName: e.target.value })}
                          placeholder="e.g. TechCorp India Pvt Ltd"
                          className="form-input"
                        />
                      </div>
                    )}
                    <div className="form-group">
                      <label className="field-label">Policy Number</label>
                      <input
                        type="text"
                        value={formData.policyNumber}
                        onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                        placeholder="e.g. POL-STAR-2026-904"
                        className="form-input"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 5: Clinical Safety Pre-load */}
          <div className="form-section">
            <div className="section-header">
              <Heart size={18} className="text-rose" />
              <h3>5. Critical Clinical Safety (Emergency Interoperability)</h3>
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="field-label">Known Drug Allergies (e.g. Penicillin, Sulfa)</label>
                <input
                  type="text"
                  value={formData.primaryAllergy}
                  onChange={(e) => setFormData({ ...formData, primaryAllergy: e.target.value })}
                  placeholder="e.g. Penicillin (Severe), Aspirin"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="field-label">Ongoing Daily Medication (e.g. BP, Insulin)</label>
                <input
                  type="text"
                  value={formData.currentMedication}
                  onChange={(e) => setFormData({ ...formData, currentMedication: e.target.value })}
                  placeholder="e.g. Metformin 500mg, Telmisartan 40mg"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={!isAadhaarVerified}
            >
              <Fingerprint size={18} />
              <span>Create Unique VitalTrace Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

