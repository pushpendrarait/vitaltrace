import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, Building, CreditCard, Users, HeartPulse, 
  FileCheck, Download, Plus, CheckCircle, ExternalLink, Phone, Calendar, 
  Info, QrCode, Stethoscope, AlertCircle, Trash2, ArrowRight, FileText, 
  Image, Bed, Clock 
} from 'lucide-react';
import { 
  formatCurrencyINR, maskAadhaar, calculateAge, 
  formatAadhaar, isValidAadhaar 
} from '../utils/helpers';
import { POPULAR_GOVT_SCHEMES, POPULAR_INSURERS, COMMON_TPAS } from '../data/initialData';
import ReportViewerModal from './ReportViewerModal';

export default function ProfileView({ 
  profile, 
  onUpdateProfile, 
  onOpenDoctorMode 
}) {
  const [activeTab, setActiveTab] = useState('schemes');
  const [showAddSchemeModal, setShowAddSchemeModal] = useState(false);
  const [showAddMediclaimModal, setShowAddMediclaimModal] = useState(false);
  const [showAddAllergyModal, setShowAddAllergyModal] = useState(false);
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [showCashlessPreAuthModal, setShowCashlessPreAuthModal] = useState(false);
  const [selectedSchemeForPreAuth, setSelectedSchemeForPreAuth] = useState(null);
  const [preAuthSuccessData, setPreAuthSuccessData] = useState(null);
  const [selectedReportForPatientView, setSelectedReportForPatientView] = useState(null);

  // New Scheme Form State
  const [newScheme, setNewScheme] = useState({
    schemeName: 'Ayushman Bharat - PM-JAY',
    category: 'Central',
    beneficiaryId: '',
    state: 'Pan-India',
    cashlessCoverageLimit: 500000,
    familyHeadName: profile.fullName
  });

  // New Mediclaim Form State
  const [newMediclaim, setNewMediclaim] = useState({
    policyType: 'Organizational / Corporate Mediclaim',
    employerName: '',
    employeeId: '',
    insuranceCompany: 'Star Health & Allied Insurance Co Ltd',
    tpaName: 'Medi Assist Healthcare TPA',
    policyNumber: '',
    tpaMemberId: '',
    sumInsured: 1000000,
    validTill: '2027-03-31',
    cashlessDeskHelpline: '1800-425-2255'
  });

  // New Allergy Form State
  const [newAllergy, setNewAllergy] = useState({
    substance: '',
    severity: 'HIGH ALERT (Severe)',
    reaction: '',
    diagnosedBy: ''
  });

  // New Medication Form State
  const [newMed, setNewMed] = useState({
    medicineName: '',
    dosage: '',
    condition: '',
    prescribedHospital: '',
    doctorName: ''
  });

  // Pre-auth simulation state
  const [preAuthForm, setPreAuthForm] = useState({
    hospitalName: 'Apollo Speciality Hospitals, Indraprastha',
    procedureName: 'Emergency Cardiac Stent / Angioplasty (Code: CARD-092)',
    estimatedAmount: 185000,
    treatingDoctor: 'Dr. Vivek Mehra (Chief Cardiologist)'
  });

  // Handlers for adding items
  const handleAddScheme = (e) => {
    e.preventDefault();
    if (!newScheme.beneficiaryId.trim()) return;

    const item = {
      id: `sch-${Date.now()}`,
      category: newScheme.category,
      schemeName: newScheme.schemeName,
      beneficiaryId: newScheme.beneficiaryId,
      state: newScheme.state,
      familyHeadName: newScheme.familyHeadName || profile.fullName,
      cashlessCoverageLimit: Number(newScheme.cashlessCoverageLimit) || 500000,
      availableBalance: Number(newScheme.cashlessCoverageLimit) || 500000,
      status: 'Active & Verified',
      empanelledHospitalsCount: newScheme.category === 'Central' ? 28500 : 4200,
      cardIssuedDate: new Date().toISOString().split('T')[0],
      lastCashlessClaim: 'None'
    };

    onUpdateProfile({
      ...profile,
      govtSchemes: [...(profile.govtSchemes || []), item]
    });

    setShowAddSchemeModal(false);
    setNewScheme({
      schemeName: 'Ayushman Bharat - PM-JAY',
      category: 'Central',
      beneficiaryId: '',
      state: 'Pan-India',
      cashlessCoverageLimit: 500000,
      familyHeadName: profile.fullName
    });
  };

  const handleAddMediclaim = (e) => {
    e.preventDefault();
    if (!newMediclaim.policyNumber.trim()) return;

    const item = {
      id: `med-${Date.now()}`,
      policyType: newMediclaim.policyType,
      employerName: newMediclaim.policyType.includes('Corporate') ? (newMediclaim.employerName || 'Organization') : 'Individual',
      employeeId: newMediclaim.employeeId || 'N/A',
      insuranceCompany: newMediclaim.insuranceCompany,
      tpaName: newMediclaim.tpaName,
      policyNumber: newMediclaim.policyNumber,
      tpaMemberId: newMediclaim.tpaMemberId || `TPA-${Math.floor(100000 + Math.random() * 900000)}`,
      sumInsured: Number(newMediclaim.sumInsured) || 1000000,
      cashlessBalanceAvailable: Number(newMediclaim.sumInsured) || 1000000,
      validFrom: new Date().toISOString().split('T')[0],
      validTill: newMediclaim.validTill || '2027-03-31',
      cashlessDeskHelpline: newMediclaim.cashlessDeskHelpline || '1800-425-2255',
      status: 'Active Cashless Approved',
      coPay: '0%',
      roomRentCap: 'Single Private Room'
    };

    onUpdateProfile({
      ...profile,
      mediclaimPolicies: [...(profile.mediclaimPolicies || []), item]
    });

    setShowAddMediclaimModal(false);
  };

  const handleAddAllergy = (e) => {
    e.preventDefault();
    if (!newAllergy.substance.trim()) return;

    const item = {
      id: `all-${Date.now()}`,
      substance: newAllergy.substance,
      severity: newAllergy.severity,
      reaction: newAllergy.reaction || 'Severe adverse clinical reaction',
      diagnosedBy: newAllergy.diagnosedBy || 'Attending Physician',
      dateRecorded: new Date().toISOString().split('T')[0]
    };

    onUpdateProfile({
      ...profile,
      allergies: [...(profile.allergies || []), item]
    });

    setShowAddAllergyModal(false);
    setNewAllergy({ substance: '', severity: 'HIGH ALERT (Severe)', reaction: '', diagnosedBy: '' });
  };

  const handleAddMedication = (e) => {
    e.preventDefault();
    if (!newMed.medicineName.trim()) return;

    const item = {
      id: `med-reg-${Date.now()}`,
      medicineName: newMed.medicineName,
      dosage: newMed.dosage || '1 dose daily',
      condition: newMed.condition || 'General Treatment',
      prescribedHospital: newMed.prescribedHospital || 'Multi-Speciality Hospital',
      doctorName: newMed.doctorName || 'Medical Officer',
      startDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    onUpdateProfile({
      ...profile,
      medications: [...(profile.medications || []), item]
    });

    setShowAddMedModal(false);
    setNewMed({ medicineName: '', dosage: '', condition: '', prescribedHospital: '', doctorName: '' });
  };

  // Cashless Pre-Auth Claim Trigger
  const handleOpenPreAuth = (scheme) => {
    setSelectedSchemeForPreAuth(scheme);
    setPreAuthSuccessData(null);
    setShowCashlessPreAuthModal(true);
  };

  const handleProcessPreAuth = (e) => {
    e.preventDefault();
    const approvedAmount = Number(preAuthForm.estimatedAmount);
    const newBal = Math.max(0, (selectedSchemeForPreAuth.availableBalance || 0) - approvedAmount);

    const refNumber = `PREAUTH-VT-${Math.floor(100000 + Math.random() * 900000)}`;

    // Update scheme balance in profile
    const updatedSchemes = (profile.govtSchemes || []).map(s => {
      if (s.id === selectedSchemeForPreAuth.id) {
        return {
          ...s,
          availableBalance: newBal,
          lastCashlessClaim: `₹${approvedAmount.toLocaleString('en-IN')} approved at ${preAuthForm.hospitalName} (Ref: ${refNumber})`
        };
      }
      return s;
    });

    // Add entry into hospital history
    const newHistoryEntry = {
      id: `hist-${Date.now()}`,
      hospitalName: preAuthForm.hospitalName,
      admissionDate: new Date().toISOString().split('T')[0],
      dischargeDate: 'Ongoing / Active Admission',
      diagnosis: preAuthForm.procedureName,
      treatingDoctor: preAuthForm.treatingDoctor,
      cashlessProcessedUnder: `${selectedSchemeForPreAuth.schemeName} (Cashless Pre-Auth Ref: ${refNumber})`
    };

    onUpdateProfile({
      ...profile,
      govtSchemes: updatedSchemes,
      hospitalHistory: [newHistoryEntry, ...(profile.hospitalHistory || [])]
    });

    setPreAuthSuccessData({
      refNumber,
      approvedAmount,
      hospital: preAuthForm.hospitalName,
      procedure: preAuthForm.procedureName,
      scheme: selectedSchemeForPreAuth.schemeName,
      timestamp: new Date().toLocaleString('en-IN')
    });
  };

  const age = calculateAge(profile.dob);

  return (
    <div className="profile-container">
      {/* Top Banner: Digital Health Passport Card */}
      <div className="health-card-wrap">
        <div className="national-health-card">
          <div className="card-top">
            <div className="card-govt-emblem">
              <span className="emblem-text">GOVERNMENT OF INDIA • NATIONAL HEALTH LEDGER</span>
              <span className="card-badge-verified">UIDAI AADHAAR VERIFIED</span>
            </div>
            <div className="card-logo-right">
              <span className="chip-icon"></span>
              <span className="card-type-label">VITALTRACE PASSPORT</span>
            </div>
          </div>

          <div className="card-body">
            <div className="card-avatar">
              <div className="avatar-circle">
                {profile.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div className="blood-badge">{profile.bloodGroup || 'O+'}</div>
            </div>

            <div className="card-info">
              <div className="card-name-row">
                <h2 className="card-patient-name">{profile.fullName}</h2>
                {profile.isMinor && (
                  <span className="badge badge-amber">Minor Dependent Child</span>
                )}
              </div>

              <div className="card-grid">
                <div>
                  <span className="card-label">VitalTrace ID (ABHA)</span>
                  <span className="card-value font-mono">{profile.vitalTraceId}</span>
                </div>
                <div>
                  <span className="card-label">Linked Aadhaar</span>
                  <span className="card-value font-mono">{maskAadhaar(profile.aadhaarNumber)}</span>
                </div>
                <div>
                  <span className="card-label">DOB / Age</span>
                  <span className="card-value">{profile.dob} ({age} yrs, {profile.gender})</span>
                </div>
                <div>
                  <span className="card-label">Emergency Contact</span>
                  <span className="card-value">{profile.emergencyContact?.name} ({profile.emergencyContact?.phone})</span>
                </div>
              </div>

              {profile.isMinor && profile.guardianDetails && (
                <div className="card-guardian-bar">
                  <Users size={14} className="text-amber" />
                  <span>
                    Legal Guardian: <strong>{profile.guardianDetails.guardianName}</strong> ({profile.guardianDetails.relation}) • Aadhaar: {maskAadhaar(profile.guardianDetails.guardianAadhaar)}
                  </span>
                </div>
              )}
            </div>

            <div className="card-qr-box">
              <div className="simulated-qr">
                <QrCode size={80} className="qr-image" />
              </div>
              <span className="qr-subtext">Scan in Emergency</span>
              <button 
                type="button" 
                onClick={onOpenDoctorMode}
                className="btn-qr-scan"
                title="Simulate ER Doctor scanning this patient's code"
              >
                ER Doctor Scan
              </button>
            </div>
          </div>

          <div className="card-footer">
            <div className="footer-schemes-quick">
              <span>Cashless Schemes:</span>
              <strong>{profile.govtSchemes?.length || 0} Govt Scheme(s)</strong>
              <span>•</span>
              <strong>{profile.mediclaimPolicies?.length || 0} Mediclaim Policy(s)</strong>
            </div>
            <div className="footer-allergies-warning">
              {profile.allergies?.length > 0 ? (
                <span className="text-rose flex-center gap-1">
                  <AlertTriangle size={14} /> 
                  <strong>{profile.allergies.length} Drug Allergen(s) Alert</strong>
                </span>
              ) : (
                <span className="text-emerald">No Known Drug Allergies</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="profile-tabs-header">
        <button
          className={`tab-btn ${activeTab === 'schemes' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('schemes')}
        >
          <Building size={16} />
          <span>Central & State Health Schemes</span>
          <span className="tab-counter">{profile.govtSchemes?.length || 0}</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'mediclaim' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('mediclaim')}
        >
          <CreditCard size={16} />
          <span>Private & Corporate Mediclaim</span>
          <span className="tab-counter">{profile.mediclaimPolicies?.length || 0}</span>
        </button>

        {profile.isMinor && (
          <button
            className={`tab-btn ${activeTab === 'guardian' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveTab('guardian')}
          >
            <Users size={16} />
            <span>Parent / Guardian Legal Info</span>
            <span className="tab-counter badge-amber-dot"></span>
          </button>
        )}

        <button
          className={`tab-btn ${activeTab === 'clinical' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('clinical')}
        >
          <HeartPulse size={16} />
          <span>Interoperable Medical Ledger & Allergies</span>
          {profile.allergies?.length > 0 && <span className="tab-counter badge-rose-pill">{profile.allergies.length} Alert</span>}
        </button>

        <button
          className={`tab-btn ${activeTab === 'reports' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <FileText size={16} />
          <span>My Diagnostic Reports & Doctor Visits</span>
          <span className="tab-counter">{(profile.diagnosticReports?.length || 0) + (profile.doctorVisits?.length || 0)}</span>
        </button>
      </div>

      {/* Tab 1: State & Central Health Schemes (Cashless Processing) */}
      {activeTab === 'schemes' && (
        <section className="tab-panel">
          <div className="panel-title-row">
            <div>
              <h3 className="panel-title">State & Central Health Schemes (Cashless Network)</h3>
              <p className="panel-subtitle">
                Official Ayushman Bharat (PM-JAY), CGHS, ESIC, and State Government Schemes enabling zero-deposit cashless hospitalization across 30,000+ empanelled hospitals.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddSchemeModal(true)}
              className="btn btn-primary"
            >
              <Plus size={16} /> Add Government Scheme
            </button>
          </div>

          <div className="schemes-grid">
            {profile.govtSchemes && profile.govtSchemes.length > 0 ? (
              profile.govtSchemes.map((sch) => (
                <div key={sch.id} className="scheme-card">
                  <div className="scheme-card-header">
                    <div className="scheme-badge-group">
                      <span className={`badge ${sch.category === 'Central' ? 'badge-cyan' : 'badge-emerald'}`}>
                        {sch.category} Scheme ({sch.state || 'India'})
                      </span>
                      <span className="badge badge-success">
                        <CheckCircle size={12} /> {sch.status}
                      </span>
                    </div>
                    <span className="beneficiary-id-pill font-mono">{sch.beneficiaryId}</span>
                  </div>

                  <h4 className="scheme-name">{sch.schemeName}</h4>

                  <div className="scheme-balance-box">
                    <div className="balance-row">
                      <span className="balance-label">Cashless Pre-Auth Balance Available:</span>
                      <span className="balance-value text-emerald">{formatCurrencyINR(sch.availableBalance)}</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div 
                        className="progress-bar-fill"
                        style={{ width: `${Math.min(100, ((sch.availableBalance || 0) / (sch.cashlessCoverageLimit || 500000)) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="balance-sub-row">
                      <span>Total Annual Cover: {formatCurrencyINR(sch.cashlessCoverageLimit)}</span>
                      <span>Empanelled Hospitals: {sch.empanelledHospitalsCount?.toLocaleString()}+</span>
                    </div>
                  </div>

                  <div className="scheme-details-list">
                    <div className="detail-item">
                      <span className="text-muted">Primary Beneficiary:</span>
                      <strong>{sch.familyHeadName}</strong>
                    </div>
                    <div className="detail-item">
                      <span className="text-muted">Card Issue Date:</span>
                      <span>{sch.cardIssuedDate || 'Registered'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="text-muted">Recent Cashless Claim:</span>
                      <span className="text-truncate">{sch.lastCashlessClaim || 'No prior claims'}</span>
                    </div>
                  </div>

                  <div className="scheme-card-actions">
                    <button
                      type="button"
                      onClick={() => handleOpenPreAuth(sch)}
                      className="btn btn-emerald full-width"
                    >
                      <CreditCard size={15} />
                      <span>Initiate Instant Cashless Pre-Auth</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state-box">
                <Building size={36} className="text-muted" />
                <p>No government health schemes added yet.</p>
                <button
                  type="button"
                  onClick={() => setShowAddSchemeModal(true)}
                  className="btn btn-secondary"
                >
                  Link PM-JAY / State Scheme
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Tab 2: Private & Corporate Mediclaim */}
      {activeTab === 'mediclaim' && (
        <section className="tab-panel">
          <div className="panel-title-row">
            <div>
              <h3 className="panel-title">Private & Organizational Mediclaim Policies</h3>
              <p className="panel-subtitle">
                Corporate employer group health insurance, TPA cashless pre-authorization, and personal family floater policies linked to your Aadhaar.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddMediclaimModal(true)}
              className="btn btn-primary"
            >
              <Plus size={16} /> Add Mediclaim Policy
            </button>
          </div>

          <div className="mediclaim-grid">
            {profile.mediclaimPolicies && profile.mediclaimPolicies.length > 0 ? (
              profile.mediclaimPolicies.map((med) => (
                <div key={med.id} className="mediclaim-card">
                  <div className="mediclaim-header">
                    <div>
                      <span className="badge badge-purple">{med.policyType}</span>
                      <h4 className="insurer-name">{med.insuranceCompany}</h4>
                    </div>
                    <span className="mediclaim-status-pill">{med.status}</span>
                  </div>

                  {med.policyType.includes('Corporate') && (
                    <div className="corporate-employer-banner">
                      <Building size={14} className="text-cyan" />
                      <span>Employer: <strong>{med.employerName}</strong> • Emp ID: {med.employeeId}</span>
                    </div>
                  )}

                  <div className="mediclaim-stats-row">
                    <div className="stat-box">
                      <span className="stat-label">Total Sum Insured</span>
                      <span className="stat-number">{formatCurrencyINR(med.sumInsured)}</span>
                    </div>
                    <div className="stat-box highlight">
                      <span className="stat-label">Available Cashless Limit</span>
                      <span className="stat-number text-emerald">{formatCurrencyINR(med.cashlessBalanceAvailable)}</span>
                    </div>
                  </div>

                  <div className="mediclaim-tpa-info">
                    <div className="tpa-row">
                      <span className="text-muted">Third Party Administrator (TPA):</span>
                      <strong>{med.tpaName}</strong>
                    </div>
                    <div className="tpa-row">
                      <span className="text-muted">Policy Number:</span>
                      <strong className="font-mono">{med.policyNumber}</strong>
                    </div>
                    <div className="tpa-row">
                      <span className="text-muted">TPA Member ID:</span>
                      <strong className="font-mono">{med.tpaMemberId}</strong>
                    </div>
                    <div className="tpa-row">
                      <span className="text-muted">Valid Till:</span>
                      <span>{med.validTill}</span>
                    </div>
                    <div className="tpa-row">
                      <span className="text-muted">Cashless Desk 24x7 Helpline:</span>
                      <span className="phone-tag font-mono"><Phone size={12} /> {med.cashlessDeskHelpline}</span>
                    </div>
                  </div>

                  <div className="mediclaim-features">
                    <span className="feature-pill">Co-Pay: {med.coPay || '0%'}</span>
                    <span className="feature-pill">Room Rent: {med.roomRentCap || 'No Capping'}</span>
                    <span className="feature-pill">Hospital Network: 14,000+ Cashless</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state-box">
                <CreditCard size={36} className="text-muted" />
                <p>No corporate or private mediclaim policies registered.</p>
                <button
                  type="button"
                  onClick={() => setShowAddMediclaimModal(true)}
                  className="btn btn-secondary"
                >
                  Add Mediclaim Policy
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Tab 3: Minor & Guardian Details */}
      {profile.isMinor && activeTab === 'guardian' && (
        <section className="tab-panel">
          <div className="panel-title-row">
            <div>
              <h3 className="panel-title">Minor Child • Parent & Guardian Legal Details</h3>
              <p className="panel-subtitle">
                Official parental linking for pediatric healthcare, emergency medical consent, and cashless co-insurance authorization.
              </p>
            </div>
            <span className="badge badge-amber">Minor Protected Record</span>
          </div>

          <div className="guardian-card-large">
            <div className="guardian-header-bar">
              <div className="guardian-avatar-wrap">
                <div className="guardian-icon-circle">
                  <Users size={28} className="text-amber" />
                </div>
                <div>
                  <h4 className="guardian-name">{profile.guardianDetails?.guardianName}</h4>
                  <span className="guardian-rel-badge">
                    Relationship: <strong>{profile.guardianDetails?.relation}</strong>
                  </span>
                </div>
              </div>
              <div className="guardian-verified-badge">
                <ShieldCheck size={18} className="text-emerald" />
                <span>Guardian Aadhaar e-KYC Verified</span>
              </div>
            </div>

            <div className="guardian-details-grid">
              <div className="guardian-info-card">
                <span className="info-card-label">Guardian Aadhaar Number</span>
                <span className="info-card-val font-mono">
                  {formatAadhaar(profile.guardianDetails?.guardianAadhaar || '')}
                </span>
                <span className="status-sub">Linked with UIDAI</span>
              </div>

              <div className="guardian-info-card">
                <span className="info-card-label">Guardian Emergency Phone</span>
                <span className="info-card-val font-mono">
                  {profile.guardianDetails?.guardianPhone}
                </span>
                <span className="status-sub">Direct Call & SMS Alerts</span>
              </div>

              <div className="guardian-info-card">
                <span className="info-card-label">Guardian Email</span>
                <span className="info-card-val">
                  {profile.guardianDetails?.guardianEmail || 'Not Provided'}
                </span>
                <span className="status-sub">Digital Records Synced</span>
              </div>

              <div className="guardian-info-card">
                <span className="info-card-label">Guardian VitalTrace ID</span>
                <span className="info-card-val font-mono">
                  {profile.guardianDetails?.guardianVitalTraceId || 'VT-LINKED'}
                </span>
                <span className="status-sub">Family Health Mesh</span>
              </div>
            </div>

            <div className="guardian-consent-box">
              <div className="consent-header">
                <FileCheck size={20} className="text-emerald" />
                <h4>Signed Digital Consent & Medical Power of Attorney for Emergency</h4>
              </div>
              <p className="consent-description">
                "{profile.guardianDetails?.consentScope}"
              </p>
              <div className="consent-metadata">
                <span>Consent Date: <strong>{profile.guardianDetails?.consentDate}</strong></span>
                <span>•</span>
                <span>Consent Status: <strong className="text-emerald">Active & Legally Binding under IT Act 2000</strong></span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tab 4: Interoperable Clinical Ledger & Allergies */}
      {activeTab === 'clinical' && (
        <section className="tab-panel">
          <div className="panel-title-row">
            <div>
              <h3 className="panel-title">Consolidated Interoperable Medical Ledger</h3>
              <p className="panel-subtitle">
                Cross-hospital synchronized health records, high-alert drug allergies, and active medication regimens preventing fatal medical errors.
              </p>
            </div>
            <div className="action-button-group">
              <button
                type="button"
                onClick={() => setShowAddAllergyModal(true)}
                className="btn btn-danger-outline"
              >
                <AlertTriangle size={15} /> Add Drug Allergy
              </button>
              <button
                type="button"
                onClick={() => setShowAddMedModal(true)}
                className="btn btn-primary"
              >
                <Plus size={15} /> Add Prescribed Medication
              </button>
            </div>
          </div>

          {/* High-Alert Allergies Banner */}
          <div className="clinical-section">
            <div className="clinical-section-header danger-header">
              <AlertTriangle size={18} className="text-rose" />
              <h4>🚨 High-Alert Drug Allergies & Contraindications</h4>
            </div>

            <div className="allergies-cards-grid">
              {profile.allergies && profile.allergies.length > 0 ? (
                profile.allergies.map((all) => (
                  <div key={all.id} className="allergy-card">
                    <div className="allergy-card-top">
                      <span className="allergy-substance">{all.substance}</span>
                      <span className="badge badge-rose">{all.severity}</span>
                    </div>
                    <p className="allergy-reaction">
                      <strong>Reaction:</strong> {all.reaction}
                    </p>
                    <div className="allergy-footer">
                      <span>Diagnosed by: {all.diagnosedBy}</span>
                      <span>Recorded: {all.dateRecorded}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-allergies-box">
                  <CheckCircle size={20} className="text-emerald" />
                  <span>No documented drug allergies recorded in the national ledger.</span>
                </div>
              )}
            </div>
          </div>

          {/* Active Medication Regimens */}
          <div className="clinical-section">
            <div className="clinical-section-header">
              <Stethoscope size={18} className="text-cyan" />
              <h4>💊 Ongoing Prescriptions & Medication Regimens (Cross-Hospital)</h4>
            </div>

            <div className="medications-table-wrap">
              {profile.medications && profile.medications.length > 0 ? (
                <table className="vt-table">
                  <thead>
                    <tr>
                      <th>Medicine Name</th>
                      <th>Dosage & Frequency</th>
                      <th>Indication / Condition</th>
                      <th>Prescribing Hospital</th>
                      <th>Doctor</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.medications.map((m) => (
                      <tr key={m.id}>
                        <td><strong>{m.medicineName}</strong></td>
                        <td>{m.dosage}</td>
                        <td>{m.condition}</td>
                        <td>{m.prescribedHospital}</td>
                        <td>{m.doctorName}</td>
                        <td>
                          <span className="badge badge-emerald">{m.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state-box">
                  <p>No active medications recorded.</p>
                </div>
              )}
            </div>
          </div>

          {/* Cross-Hospital Admission History */}
          <div className="clinical-section">
            <div className="clinical-section-header">
              <Building size={18} className="text-emerald" />
              <h4>🏥 Past Hospital Admissions & Cashless Claim Records</h4>
            </div>

            <div className="history-timeline">
              {profile.hospitalHistory && profile.hospitalHistory.length > 0 ? (
                profile.hospitalHistory.map((h) => (
                  <div key={h.id} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-card">
                      <div className="timeline-card-header">
                        <h5>{h.hospitalName}</h5>
                        <span className="timeline-date">{h.admissionDate} → {h.dischargeDate}</span>
                      </div>
                      <p className="timeline-diag"><strong>Diagnosis:</strong> {h.diagnosis}</p>
                      <div className="timeline-meta">
                        <span>Attending: {h.treatingDoctor}</span>
                        <span>•</span>
                        <span className="cashless-tag">{h.cashlessProcessedUnder}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state-box">
                  <p>No past hospital admissions recorded in the network.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Tab 5: Diagnostic Reports & Past Consultations (Patient View) */}
      {activeTab === 'reports' && (
        <section className="tab-panel">
          <div className="panel-title-row">
            <div>
              <h3 className="panel-title">My Diagnostic Reports & Doctor Consultations</h3>
              <p className="panel-subtitle">
                Access all laboratory tests, imaging reports in PDF and Image formats, treating doctor details, prescriptions, and daily observation notes.
              </p>
            </div>
          </div>

          {/* Diagnostic Reports Gallery */}
          <div className="clinical-section">
            <div className="clinical-section-header">
              <FileText size={18} className="text-cyan" />
              <h4>📄 Laboratory & Diagnostic Imaging Reports (PDF & Images)</h4>
            </div>

            <div className="reports-gallery-grid">
              {profile.diagnosticReports && profile.diagnosticReports.length > 0 ? (
                profile.diagnosticReports.map((rep) => (
                  <div key={rep.id} className="report-card">
                    <div className="report-card-top">
                      <span className={`format-indicator ${rep.format === 'PDF' ? 'bg-pdf' : 'bg-img'}`}>
                        {rep.format === 'PDF' ? <FileText size={14} /> : <Image size={14} />}
                        {rep.format} Document
                      </span>
                      <span className="report-date-tag">{rep.date}</span>
                    </div>

                    <h4 className="report-title">{rep.title}</h4>
                    <span className="report-dept-badge">{rep.category}</span>

                    <div className="report-lab-info">
                      <p className="lab-name">
                        <Building size={13} className="text-cyan" /> {rep.labName}
                      </p>
                      <p className="lab-addr">{rep.labAddress}</p>
                      <p className="ordering-doc">Ordered by: <strong>{rep.orderingDoctor}</strong></p>
                    </div>

                    <div className="report-findings-preview">
                      <span className="findings-label">Findings Summary:</span>
                      <p className="findings-snippet">{rep.findings}</p>
                    </div>

                    <div className="report-card-footer">
                      <button
                        type="button"
                        onClick={() => setSelectedReportForPatientView(rep)}
                        className="btn btn-primary full-width"
                      >
                        {rep.format === 'PDF' ? <FileText size={15} /> : <Image size={15} />}
                        <span>Open {rep.format} Report Viewer</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state-box full-width">
                  <p>No diagnostic reports on record.</p>
                </div>
              )}
            </div>
          </div>

          {/* Past Doctor Consultations */}
          <div className="clinical-section">
            <div className="clinical-section-header">
              <Stethoscope size={18} className="text-emerald" />
              <h4>👨‍⚕️ Past Doctor Consultations & Prescriptions</h4>
            </div>

            <div className="doctor-visits-timeline">
              {profile.doctorVisits && profile.doctorVisits.length > 0 ? (
                profile.doctorVisits.map((vis) => (
                  <div key={vis.id} className="visit-card">
                    <div className="visit-header">
                      <div className="doctor-badge-group">
                        <div className="doc-avatar-sm">
                          <Stethoscope size={18} className="text-white" />
                        </div>
                        <div>
                          <h4 className="treating-doctor-name">{vis.doctorName}</h4>
                          <p className="treating-doctor-creds">
                            {vis.doctorQualification} • <span className="font-mono text-cyan">Reg: {vis.doctorRegNo}</span>
                          </p>
                          <span className="badge badge-purple">{vis.specialty}</span>
                        </div>
                      </div>
                      <div className="visit-meta-tag">
                        <span className="visit-date-badge"><Calendar size={13} /> {vis.visitDate}</span>
                      </div>
                    </div>

                    <div className="hospital-facility-banner">
                      <Building size={15} className="text-cyan flex-shrink-0" />
                      <div>
                        <strong>{vis.hospitalName}</strong>
                        <p className="facility-address">{vis.hospitalAddress}</p>
                      </div>
                    </div>

                    <div className="clinical-findings-box">
                      <div className="findings-row">
                        <span className="findings-heading">Presenting Complaints:</span>
                        <p>{vis.chiefComplaints}</p>
                      </div>
                      <div className="findings-row highlight-diag">
                        <span className="findings-heading">Diagnosis:</span>
                        <strong className="text-rose font-large">{vis.diagnosis}</strong>
                      </div>
                      <div className="findings-row">
                        <span className="findings-heading">Treatment Details:</span>
                        <p>{vis.treatmentDetails}</p>
                      </div>
                    </div>

                    {vis.prescriptions && vis.prescriptions.length > 0 && (
                      <div className="visit-prescriptions-section">
                        <h5 className="rx-heading">Prescriptions</h5>
                        <div className="rx-table-wrap">
                          <table className="rx-table">
                            <thead>
                              <tr>
                                <th>Medicine</th>
                                <th>Dosage</th>
                                <th>Duration</th>
                                <th>Instructions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {vis.prescriptions.map((rx, idx) => (
                                <tr key={idx}>
                                  <td><strong>{rx.drug}</strong></td>
                                  <td>{rx.dosage}</td>
                                  <td>{rx.duration}</td>
                                  <td>{rx.instructions}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-state-box full-width">
                  <p>No past doctor consultations recorded.</p>
                </div>
              )}
            </div>
          </div>

          {/* Inpatient Observation Records */}
          {profile.hospitalizations && profile.hospitalizations.length > 0 && (
            <div className="clinical-section">
              <div className="clinical-section-header">
                <Bed size={18} className="text-rose" />
                <h4>🏥 Inpatient Observation Logs & Daily Doctor Rounds</h4>
              </div>

              {profile.hospitalizations.map((hosp) => (
                <div key={hosp.id} className="active-inpatient-container mb-3">
                  <div className="admission-status-banner">
                    <div className="status-banner-head">
                      <div className="ward-icon-wrap">
                        <Bed size={22} className="text-rose" />
                      </div>
                      <div>
                        <h4 className="ward-title">{hosp.wardBed}</h4>
                        <p className="hospital-tag-line">
                          {hosp.admittingHospital} — {hosp.hospitalAddress}
                        </p>
                      </div>
                    </div>
                    <div className="admission-meta-grid">
                      <div className="adm-meta-cell">
                        <span className="cell-lbl">Admission:</span>
                        <strong>{hosp.admissionDate}</strong>
                      </div>
                      <div className="adm-meta-cell">
                        <span className="cell-lbl">Attending:</span>
                        <strong>{hosp.attendingDoctor}</strong>
                      </div>
                      <div className="adm-meta-cell">
                        <span className="cell-lbl">Diagnosis:</span>
                        <strong className="text-rose">{hosp.admissionDiagnosis}</strong>
                      </div>
                    </div>
                  </div>

                  {hosp.dailyObservationLogs && hosp.dailyObservationLogs.length > 0 && (
                    <div className="daily-rounds-list mt-2">
                      {hosp.dailyObservationLogs.map((log) => (
                        <div key={log.logId} className="round-card">
                          <div className="round-card-top">
                            <span className="day-badge">Day {log.dayNumber}</span>
                            <strong className="round-time">{log.roundTime}</strong>
                            <span className="badge badge-emerald">Status: {log.clinicalStatus}</span>
                          </div>
                          <p className="text-muted text-sm mt-1">Doctor: {log.attendingDoctor}</p>
                          <div className="round-notes-box mt-2">
                            <p className="note-body">{log.progressNotes}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* MODAL 1: Add Government Health Scheme */}
      {showAddSchemeModal && (
        <div className="modal-overlay">
          <div className="modal-card small-modal">
            <div className="modal-header">
              <h3>Add State or Central Health Scheme</h3>
              <button type="button" onClick={() => setShowAddSchemeModal(false)} className="modal-close-btn">×</button>
            </div>
            <form onSubmit={handleAddScheme} className="modal-form">
              <div className="form-group">
                <label className="field-label">Select Recognized Government Scheme</label>
                <select
                  value={newScheme.schemeName}
                  onChange={(e) => {
                    const sel = POPULAR_GOVT_SCHEMES.find(s => s.name === e.target.value);
                    setNewScheme({
                      ...newScheme,
                      schemeName: e.target.value,
                      category: sel ? sel.category : 'Central',
                      state: sel ? sel.state : 'Pan-India',
                      cashlessCoverageLimit: typeof sel?.maxCoverage === 'number' ? sel.maxCoverage : 500000
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
                <label className="field-label">Beneficiary ID / Scheme Card Number *</label>
                <input
                  type="text"
                  value={newScheme.beneficiaryId}
                  onChange={(e) => setNewScheme({ ...newScheme, beneficiaryId: e.target.value })}
                  placeholder="e.g. PMJAY-DL-88219401 or RGHS-99214"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="field-label">Scheme Category</label>
                  <select
                    value={newScheme.category}
                    onChange={(e) => setNewScheme({ ...newScheme, category: e.target.value })}
                    className="form-select"
                  >
                    <option value="Central">Central Govt Scheme</option>
                    <option value="State">State Govt Scheme</option>
                  </select>
                </div>

                <div className="form-group flex-1">
                  <label className="field-label">Cashless Cover Limit (₹)</label>
                  <input
                    type="number"
                    value={newScheme.cashlessCoverageLimit}
                    onChange={(e) => setNewScheme({ ...newScheme, cashlessCoverageLimit: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="field-label">Primary Beneficiary / Family Head</label>
                <input
                  type="text"
                  value={newScheme.familyHeadName}
                  onChange={(e) => setNewScheme({ ...newScheme, familyHeadName: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddSchemeModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Health Scheme</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Mediclaim Policy */}
      {showAddMediclaimModal && (
        <div className="modal-overlay">
          <div className="modal-card small-modal">
            <div className="modal-header">
              <h3>Add Private or Corporate Mediclaim</h3>
              <button type="button" onClick={() => setShowAddMediclaimModal(false)} className="modal-close-btn">×</button>
            </div>
            <form onSubmit={handleAddMediclaim} className="modal-form">
              <div className="form-group">
                <label className="field-label">Policy Type</label>
                <select
                  value={newMediclaim.policyType}
                  onChange={(e) => setNewMediclaim({ ...newMediclaim, policyType: e.target.value })}
                  className="form-select"
                >
                  <option value="Organizational / Corporate Mediclaim">Organizational / Corporate Mediclaim (Employer)</option>
                  <option value="Private / Individual Mediclaim">Private / Individual Mediclaim</option>
                  <option value="Private / Family Floater">Private / Family Floater Policy</option>
                </select>
              </div>

              {newMediclaim.policyType.includes('Corporate') && (
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="field-label">Employer / Corporate Name *</label>
                    <input
                      type="text"
                      value={newMediclaim.employerName}
                      onChange={(e) => setNewMediclaim({ ...newMediclaim, employerName: e.target.value })}
                      placeholder="e.g. Infosys, TCS, Wipro"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label className="field-label">Employee ID</label>
                    <input
                      type="text"
                      value={newMediclaim.employeeId}
                      onChange={(e) => setNewMediclaim({ ...newMediclaim, employeeId: e.target.value })}
                      placeholder="e.g. EMP-10492"
                      className="form-input"
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="field-label">Insurance Company</label>
                <select
                  value={newMediclaim.insuranceCompany}
                  onChange={(e) => setNewMediclaim({ ...newMediclaim, insuranceCompany: e.target.value })}
                  className="form-select"
                >
                  {POPULAR_INSURERS.map(ins => (
                    <option key={ins} value={ins}>{ins}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="field-label">Third Party Administrator (TPA)</label>
                <select
                  value={newMediclaim.tpaName}
                  onChange={(e) => setNewMediclaim({ ...newMediclaim, tpaName: e.target.value })}
                  className="form-select"
                >
                  {COMMON_TPAS.map(tpa => (
                    <option key={tpa} value={tpa}>{tpa}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="field-label">Policy Number *</label>
                  <input
                    type="text"
                    value={newMediclaim.policyNumber}
                    onChange={(e) => setNewMediclaim({ ...newMediclaim, policyNumber: e.target.value })}
                    placeholder="e.g. STAR-POL-2026-904"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label className="field-label">TPA Member ID</label>
                  <input
                    type="text"
                    value={newMediclaim.tpaMemberId}
                    onChange={(e) => setNewMediclaim({ ...newMediclaim, tpaMemberId: e.target.value })}
                    placeholder="e.g. MEDI-884920"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="field-label">Sum Insured (₹)</label>
                  <input
                    type="number"
                    value={newMediclaim.sumInsured}
                    onChange={(e) => setNewMediclaim({ ...newMediclaim, sumInsured: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group flex-1">
                  <label className="field-label">Validity Till</label>
                  <input
                    type="date"
                    value={newMediclaim.validTill}
                    onChange={(e) => setNewMediclaim({ ...newMediclaim, validTill: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddMediclaimModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Mediclaim Policy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Drug Allergy */}
      {showAddAllergyModal && (
        <div className="modal-overlay">
          <div className="modal-card small-modal">
            <div className="modal-header">
              <h3>🚨 Add Drug Allergy Warning</h3>
              <button type="button" onClick={() => setShowAddAllergyModal(false)} className="modal-close-btn">×</button>
            </div>
            <form onSubmit={handleAddAllergy} className="modal-form">
              <div className="form-group">
                <label className="field-label">Allergen / Drug Name *</label>
                <input
                  type="text"
                  value={newAllergy.substance}
                  onChange={(e) => setNewAllergy({ ...newAllergy, substance: e.target.value })}
                  placeholder="e.g. Penicillin, Sulfa, Aspirin, Ceftriaxone"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="field-label">Severity Level</label>
                <select
                  value={newAllergy.severity}
                  onChange={(e) => setNewAllergy({ ...newAllergy, severity: e.target.value })}
                  className="form-select"
                >
                  <option value="HIGH ALERT (Severe)">HIGH ALERT (Severe / Anaphylaxis Risk)</option>
                  <option value="Critical">Critical</option>
                  <option value="Moderate">Moderate (Rash, Hives)</option>
                  <option value="Mild">Mild</option>
                </select>
              </div>

              <div className="form-group">
                <label className="field-label">Clinical Reaction Description</label>
                <input
                  type="text"
                  value={newAllergy.reaction}
                  onChange={(e) => setNewAllergy({ ...newAllergy, reaction: e.target.value })}
                  placeholder="e.g. Bronchospasm, facial swelling, tachycardia"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="field-label">Diagnosing Hospital / Physician</label>
                <input
                  type="text"
                  value={newAllergy.diagnosedBy}
                  onChange={(e) => setNewAllergy({ ...newAllergy, diagnosedBy: e.target.value })}
                  placeholder="e.g. Dr. A. K. Sharma (AIIMS)"
                  className="form-input"
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddAllergyModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-danger">Broadcast Allergy Warning</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Add Medication Regimen */}
      {showAddMedModal && (
        <div className="modal-overlay">
          <div className="modal-card small-modal">
            <div className="modal-header">
              <h3>Add Prescribed Medication</h3>
              <button type="button" onClick={() => setShowAddMedModal(false)} className="modal-close-btn">×</button>
            </div>
            <form onSubmit={handleAddMedication} className="modal-form">
              <div className="form-group">
                <label className="field-label">Medicine Name & Strength *</label>
                <input
                  type="text"
                  value={newMed.medicineName}
                  onChange={(e) => setNewMed({ ...newMed, medicineName: e.target.value })}
                  placeholder="e.g. Atorvastatin 20mg or Insulin Glargine"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="field-label">Dosage & Frequency</label>
                <input
                  type="text"
                  value={newMed.dosage}
                  onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                  placeholder="e.g. 1 tablet once daily at bedtime"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="field-label">Medical Condition / Indication</label>
                <input
                  type="text"
                  value={newMed.condition}
                  onChange={(e) => setNewMed({ ...newMed, condition: e.target.value })}
                  placeholder="e.g. Hyperlipidemia / Post-PTCA"
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="field-label">Prescribing Hospital</label>
                  <input
                    type="text"
                    value={newMed.prescribedHospital}
                    onChange={(e) => setNewMed({ ...newMed, prescribedHospital: e.target.value })}
                    placeholder="e.g. Fortis Healthcare"
                    className="form-input"
                  />
                </div>
                <div className="form-group flex-1">
                  <label className="field-label">Doctor Name</label>
                  <input
                    type="text"
                    value={newMed.doctorName}
                    onChange={(e) => setNewMed({ ...newMed, doctorName: e.target.value })}
                    placeholder="e.g. Dr. P. Joshi"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddMedModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Medication</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Cashless Pre-Auth Claim Simulator */}
      {showCashlessPreAuthModal && selectedSchemeForPreAuth && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-header-icon">
                <CreditCard size={24} className="text-emerald" />
              </div>
              <div>
                <h3>Instant Cashless Pre-Authorization Simulation</h3>
                <p className="modal-subtitle">
                  {selectedSchemeForPreAuth.schemeName} • Available Balance: {formatCurrencyINR(selectedSchemeForPreAuth.availableBalance)}
                </p>
              </div>
              <button type="button" onClick={() => setShowCashlessPreAuthModal(false)} className="modal-close-btn">×</button>
            </div>

            {!preAuthSuccessData ? (
              <form onSubmit={handleProcessPreAuth} className="modal-form">
                <div className="alert-box alert-info">
                  <Info size={16} />
                  <span>
                    This simulator mimics the national cashless desk API: Hospital submits treatment estimation, Aadhaar verification confirms identity, and the scheme pre-approves hospital admission without deposit!
                  </span>
                </div>

                <div className="form-group">
                  <label className="field-label">Empanelled Hospital Name</label>
                  <select
                    value={preAuthForm.hospitalName}
                    onChange={(e) => setPreAuthForm({ ...preAuthForm, hospitalName: e.target.value })}
                    className="form-select"
                  >
                    <option value="Apollo Speciality Hospitals, Indraprastha">Apollo Speciality Hospitals, Indraprastha</option>
                    <option value="Fortis Memorial Research Institute, Gurugram">Fortis Memorial Research Institute, Gurugram</option>
                    <option value="Max Super Speciality Hospital, Saket">Max Super Speciality Hospital, Saket</option>
                    <option value="AIIMS New Delhi Emergency Trauma Center">AIIMS New Delhi Emergency Trauma Center</option>
                    <option value="Narayana Institute of Cardiac Sciences, Bengaluru">Narayana Institute of Cardiac Sciences, Bengaluru</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="field-label">Procedure / Treatment Name</label>
                  <input
                    type="text"
                    value={preAuthForm.procedureName}
                    onChange={(e) => setPreAuthForm({ ...preAuthForm, procedureName: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="field-label">Estimated Cashless Claim Amount (₹)</label>
                    <input
                      type="number"
                      value={preAuthForm.estimatedAmount}
                      onChange={(e) => setPreAuthForm({ ...preAuthForm, estimatedAmount: e.target.value })}
                      max={selectedSchemeForPreAuth.availableBalance}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label className="field-label">Attending Specialist Doctor</label>
                    <input
                      type="text"
                      value={preAuthForm.treatingDoctor}
                      onChange={(e) => setPreAuthForm({ ...preAuthForm, treatingDoctor: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowCashlessPreAuthModal(false)} className="btn btn-ghost">Cancel</button>
                  <button type="submit" className="btn btn-emerald btn-large">
                    <CheckCircle size={18} />
                    <span>Generate Instant Cashless Approval Token</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="preauth-success-box">
                <div className="success-icon-wrap">
                  <CheckCircle size={48} className="text-emerald" />
                </div>
                <h3 className="success-title">Cashless Pre-Authorization Approved!</h3>
                <p className="success-subtitle">
                  Hospital admission token generated. Zero deposit required at admission counter.
                </p>

                <div className="approval-slip">
                  <div className="slip-row">
                    <span>Pre-Auth Reference ID:</span>
                    <strong className="font-mono text-emerald">{preAuthSuccessData.refNumber}</strong>
                  </div>
                  <div className="slip-row">
                    <span>Patient Name:</span>
                    <strong>{profile.fullName}</strong>
                  </div>
                  <div className="slip-row">
                    <span>Linked Aadhaar:</span>
                    <strong className="font-mono">{maskAadhaar(profile.aadhaarNumber)}</strong>
                  </div>
                  <div className="slip-row">
                    <span>Scheme Utilized:</span>
                    <strong>{preAuthSuccessData.scheme}</strong>
                  </div>
                  <div className="slip-row">
                    <span>Empanelled Hospital:</span>
                    <strong>{preAuthSuccessData.hospital}</strong>
                  </div>
                  <div className="slip-row">
                    <span>Approved Amount:</span>
                    <strong className="text-emerald font-large">{formatCurrencyINR(preAuthSuccessData.approvedAmount)}</strong>
                  </div>
                  <div className="slip-row">
                    <span>Timestamp:</span>
                    <span>{preAuthSuccessData.timestamp}</span>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setShowCashlessPreAuthModal(false)}
                    className="btn btn-primary full-width"
                  >
                    Done & Return to Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* REPORT VIEWER MODAL FOR PATIENT */}
      {selectedReportForPatientView && (
        <ReportViewerModal
          report={selectedReportForPatientView}
          patient={profile}
          onClose={() => setSelectedReportForPatientView(null)}
        />
      )}
    </div>
  );
}
