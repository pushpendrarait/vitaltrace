import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, Building, CreditCard, Users, HeartPulse, 
  FileCheck, Download, Plus, CheckCircle, ExternalLink, Phone, Calendar, 
  Info, QrCode, Stethoscope, AlertCircle, Trash2, ArrowRight, FileText, 
  Image, Bed, Clock, Bell, ShoppingBag, Lock, ShieldAlert, Sparkles, 
  Check, RefreshCw, X 
} from 'lucide-react';
import { 
  formatCurrencyINR, maskAadhaar, calculateAge, 
  formatAadhaar, isValidAadhaar 
} from '../utils/helpers';
import { POPULAR_GOVT_SCHEMES, POPULAR_INSURERS, COMMON_TPAS } from '../data/initialData';
import { EMPANELED_PHARMACY_PARTNERS, DIAGNOSTIC_TEST_CATALOG } from '../data/catalogData';
import ReportViewerModal from './ReportViewerModal';

export default function ProfileView({ 
  profile, 
  onUpdateProfile, 
  onOpenDoctorMode 
}) {
  const [activeTab, setActiveTab] = useState('schemes'); // 'schemes', 'medications', 'test_orders', 'reports', 'consent', 'guardian'
  
  // Modals
  const [showAddSchemeModal, setShowAddSchemeModal] = useState(false);
  const [showAddMediclaimModal, setShowAddMediclaimModal] = useState(false);
  const [showAddAllergyModal, setShowAddAllergyModal] = useState(false);
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [showCashlessPreAuthModal, setShowCashlessPreAuthModal] = useState(false);
  const [selectedSchemeForPreAuth, setSelectedSchemeForPreAuth] = useState(null);
  const [preAuthSuccessData, setPreAuthSuccessData] = useState(null);
  const [selectedReportForPatientView, setSelectedReportForPatientView] = useState(null);

  // E-Pharmacy Order Modal State
  const [showEPharmacyModal, setShowEPharmacyModal] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(EMPANELED_PHARMACY_PARTNERS[0]);
  const [orderDeliveryAddress, setOrderDeliveryAddress] = useState(profile.address || 'Flat 402, Green Meadows, Sector 62, Noida');
  const [orderPlacedData, setOrderPlacedData] = useState(null);

  // Lab Booking Modal State
  const [showLabBookingModal, setShowLabBookingModal] = useState(false);
  const [selectedTestToBook, setSelectedTestToBook] = useState(null);
  const [selectedLabChoice, setSelectedLabChoice] = useState(null);
  const [bookingMode, setBookingMode] = useState('Home Collection');
  const [bookingDate, setBookingDate] = useState('Tomorrow Morning (07:30 AM)');
  const [bookingConfirmedData, setBookingConfirmedData] = useState(null);

  // Consent Management State
  const [selectedDuration, setSelectedDuration] = useState('7 Days');

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

  // Toggle Pill Reminder
  const handleToggleReminder = (reminderId) => {
    const updated = (profile.medicationReminders || []).map(r => {
      if (r.id === reminderId) {
        return { ...r, isActive: !r.isActive };
      }
      return r;
    });
    onUpdateProfile({ ...profile, medicationReminders: updated });
  };

  // Mark Pill as Taken
  const handleMarkTaken = (reminderId) => {
    const nowStr = `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const updated = (profile.medicationReminders || []).map(r => {
      if (r.id === reminderId) {
        return { ...r, lastTaken: nowStr, history: 'Taken' };
      }
      return r;
    });
    onUpdateProfile({ ...profile, medicationReminders: updated });
    alert('Medication marked as taken! Pill adherence logged in your health diary.');
  };

  // E-Pharmacy Order Placement
  const handlePlacePharmacyOrder = (e) => {
    e.preventDefault();
    const orderRef = `RX-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderPlacedData({
      orderRef,
      partner: selectedPharmacy.name,
      deliveryTime: selectedPharmacy.deliveryTime,
      address: orderDeliveryAddress,
      itemCount: profile.medications?.length || 2,
      estimatedTotal: '₹340 (After 18% Discount applied)'
    });
  };

  // Book Diagnostic Lab Appointment
  const handleConfirmLabBooking = (e) => {
    e.preventDefault();
    const bookingRef = `LAB-BK-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Update order status in profile
    const updatedOrders = (profile.pendingTestOrders || []).map(o => {
      if (o.id === selectedTestToBook.id) {
        return { ...o, status: `Scheduled (${bookingMode} - Ref: ${bookingRef})` };
      }
      return o;
    });

    onUpdateProfile({ ...profile, pendingTestOrders: updatedOrders });

    setBookingConfirmedData({
      bookingRef,
      testName: selectedTestToBook.testName,
      lab: selectedLabChoice?.labName || 'Dr. Lal PathLabs',
      price: selectedLabChoice?.price || 450,
      mode: bookingMode,
      date: bookingDate
    });
  };

  // Consent Action: Revoke Access
  const handleRevokeConsent = (consentId) => {
    const updated = (profile.consentLogs || []).map(c => {
      if (c.id === consentId) {
        return { ...c, status: 'Revoked by Patient', validUntil: 'Revoked' };
      }
      return c;
    });
    onUpdateProfile({ ...profile, consentLogs: updated });
    alert('Access revoked! The physician/hospital can no longer access your longitudinal records.');
  };

  // Consent Action: Approve Request
  const handleApproveConsent = (consentId) => {
    const updated = (profile.consentLogs || []).map(c => {
      if (c.id === consentId) {
        return { ...c, status: 'Approved', validUntil: `Active (${selectedDuration})` };
      }
      return c;
    });
    onUpdateProfile({ ...profile, consentLogs: updated });
    alert(`Access granted for ${selectedDuration} under Account Aggregator framework.`);
  };

  // Add Scheme
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
  };

  // Add Mediclaim
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

    const newHistoryEntry = {
      id: `hist-${Date.now()}`,
      hospitalName: preAuthForm.hospitalName,
      admissionDate: new Date().toISOString().split('T')[0],
      dischargeDate: 'Ongoing / Active Admission',
      diagnosis: preAuthForm.procedureName,
      treatingDoctor: preAuthForm.treatingDoctor,
      cashlessProcessedUnder: `${selectedSchemeForPreAuth.schemeName} (Pre-Auth Ref: ${refNumber})`
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
              <span className="card-type-label">VITALTRACE UHID PASSPORT</span>
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
                  <span className="card-label">Unique Health ID (UHID)</span>
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
              <span className="qr-subtext">Emergency QR (Break-Glass)</span>
              <button 
                type="button" 
                onClick={onOpenDoctorMode}
                className="btn-qr-scan"
                title="Simulate ER Doctor scanning this patient's code"
              >
                Doctor Scanner
              </button>
            </div>
          </div>

          <div className="card-footer">
            <div className="footer-schemes-quick">
              <span>Cashless Coverage:</span>
              <strong>{profile.govtSchemes?.length || 0} Govt Scheme(s)</strong>
              <span>•</span>
              <strong>{profile.mediclaimPolicies?.length || 0} Mediclaim Policy(s)</strong>
            </div>
            <div className="footer-allergies-warning">
              {profile.allergies?.length > 0 ? (
                <span className="text-rose flex-center gap-1">
                  <AlertTriangle size={14} /> 
                  <strong>{profile.allergies.length} Drug Allergen(s) Documented</strong>
                </span>
              ) : (
                <span className="text-emerald">No Known Drug Allergies</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation (Aligned with Section 10 BRD Specifications) */}
      <div className="profile-tabs-header">
        <button
          className={`tab-btn ${activeTab === 'schemes' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('schemes')}
        >
          <Building size={16} />
          <span>Health Schemes & Cashless Insurance</span>
          <span className="tab-counter">{(profile.govtSchemes?.length || 0) + (profile.mediclaimPolicies?.length || 0)}</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'medications' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('medications')}
        >
          <HeartPulse size={16} />
          <span>Medications & E-Pharmacy</span>
          <span className="tab-counter">{profile.medications?.length || 0}</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'test_orders' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('test_orders')}
        >
          <Clock size={16} />
          <span>Diagnostic Orders & Lab Booking</span>
          {profile.pendingTestOrders?.length > 0 && <span className="tab-counter badge-amber-dot"></span>}
        </button>

        <button
          className={`tab-btn ${activeTab === 'reports' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <FileText size={16} />
          <span>Digital Vault: Reports & Visits</span>
          <span className="tab-counter">{(profile.diagnosticReports?.length || 0) + (profile.doctorVisits?.length || 0)}</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'consent' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('consent')}
        >
          <Lock size={16} />
          <span>Consent & Privacy Manager</span>
          <span className="badge badge-emerald">DPDP Act</span>
        </button>

        {profile.isMinor && (
          <button
            className={`tab-btn ${activeTab === 'guardian' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveTab('guardian')}
          >
            <Users size={16} />
            <span>Parent / Guardian Legal Info</span>
          </button>
        )}
      </div>

      {/* TAB 1: HEALTH SCHEMES & CASHLESS INSURANCE (Central & State + Private Mediclaim) */}
      {activeTab === 'schemes' && (
        <section className="tab-panel">
          <div className="panel-title-row">
            <div>
              <h3 className="panel-title">Government Schemes & Private Mediclaim (Cashless Vault)</h3>
              <p className="panel-subtitle">
                Official Ayushman Bharat (PM-JAY), CGHS, State Schemes, and Private TPA health insurance policies enabling zero-deposit cashless hospitalization across 30,000+ hospitals.
              </p>
            </div>
            <div className="action-button-group">
              <button
                type="button"
                onClick={() => setShowAddSchemeModal(true)}
                className="btn btn-outline-cyan btn-sm"
              >
                <Plus size={15} /> Add Govt Scheme
              </button>
              <button
                type="button"
                onClick={() => setShowAddMediclaimModal(true)}
                className="btn btn-primary btn-sm"
              >
                <Plus size={15} /> Add Mediclaim
              </button>
            </div>
          </div>

          <div className="schemes-grid">
            {profile.govtSchemes?.map((sch) => (
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
                    <span>Empaneled Network: {sch.empanelledHospitalsCount?.toLocaleString()}+</span>
                  </div>
                </div>

                <div className="scheme-card-actions">
                  <button
                    type="button"
                    onClick={() => handleOpenPreAuth(sch)}
                    className="btn btn-emerald full-width"
                  >
                    <CreditCard size={15} />
                    <span>Initiate Cashless Hospital Pre-Auth</span>
                  </button>
                </div>
              </div>
            ))}

            {profile.mediclaimPolicies?.map((med) => (
              <div key={med.id} className="mediclaim-card">
                <div className="mediclaim-header">
                  <div>
                    <span className="badge badge-purple">{med.policyType}</span>
                    <h4 className="insurer-name">{med.insuranceCompany}</h4>
                  </div>
                  <span className="mediclaim-status-pill">{med.status}</span>
                </div>

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
                    <span className="text-muted">TPA Administrator:</span>
                    <strong>{med.tpaName}</strong>
                  </div>
                  <div className="tpa-row">
                    <span className="text-muted">Policy Number:</span>
                    <strong className="font-mono">{med.policyNumber}</strong>
                  </div>
                  <div className="tpa-row">
                    <span className="text-muted">24x7 Cashless Desk Helpline:</span>
                    <span className="phone-tag font-mono"><Phone size={12} /> {med.cashlessDeskHelpline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 2: ACTIVE MEDICATIONS, SMART REMINDERS & E-PHARMACY (Section 10.3) */}
      {activeTab === 'medications' && (
        <section className="tab-panel">
          <div className="panel-title-row">
            <div>
              <h3 className="panel-title">Active Regimens, Pill Reminders & E-Pharmacy Ordering</h3>
              <p className="panel-subtitle">
                Track ongoing medications, manage automated pill reminders, and order doorstep medicine delivery via empaneled e-pharmacy partners (Tata 1mg, Apollo, PharmEasy).
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowEPharmacyModal(true)}
              className="btn btn-emerald"
            >
              <ShoppingBag size={16} /> One-Click E-Pharmacy Order
            </button>
          </div>

          {/* Active Medications List with Reminders */}
          <div className="meds-reminders-grid">
            {profile.medications?.map((m) => {
              const reminder = (profile.medicationReminders || []).find(r => r.medicineName.toLowerCase().includes(m.medicineName.toLowerCase()));
              return (
                <div key={m.id} className="medication-regimen-card">
                  <div className="med-regimen-header">
                    <div>
                      <h4 className="med-card-name">{m.medicineName}</h4>
                      <span className="med-condition-pill">{m.condition}</span>
                    </div>
                    <span className="badge badge-emerald">{m.status}</span>
                  </div>

                  <div className="med-schedule-box">
                    <div className="schedule-row">
                      <span className="text-muted">Dosage & Frequency:</span>
                      <strong>{m.dosage}</strong>
                    </div>
                    <div className="schedule-row">
                      <span className="text-muted">Prescribed At:</span>
                      <span>{m.prescribedHospital} ({m.doctorName})</span>
                    </div>
                  </div>

                  {/* Smart Pill Reminder Card */}
                  <div className="reminder-status-strip">
                    <div className="reminder-left">
                      <Bell size={16} className={reminder?.isActive ? 'text-amber' : 'text-muted'} />
                      <div>
                        <strong>Pill Reminder Alarm: {reminder?.time || '08:00 AM'}</strong>
                        <span className="reminder-sub">Status: {reminder?.isActive ? 'Active Daily Notification' : 'Muted'} • Last taken: {reminder?.lastTaken || 'Not recorded today'}</span>
                      </div>
                    </div>
                    <div className="reminder-actions">
                      <button
                        type="button"
                        onClick={() => reminder && handleToggleReminder(reminder.id)}
                        className={`btn btn-sm ${reminder?.isActive ? 'btn-secondary' : 'btn-outline-cyan'}`}
                      >
                        {reminder?.isActive ? 'Mute' : 'Enable'}
                      </button>
                      <button
                        type="button"
                        onClick={() => reminder && handleMarkTaken(reminder.id)}
                        className="btn btn-emerald btn-sm"
                      >
                        <Check size={14} /> Mark as Taken
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* E-Pharmacy Partners Banner */}
          <div className="e-pharmacy-banner-card mt-3">
            <div className="pharmacy-banner-head">
              <ShoppingBag size={20} className="text-cyan" />
              <div>
                <h4>Empaneled E-Pharmacy Delivery Partners</h4>
                <p className="text-muted text-sm">Direct integration with digital prescriptions for instant cart building and doorstep dispatch:</p>
              </div>
            </div>

            <div className="pharmacy-partners-strip">
              {EMPANELED_PHARMACY_PARTNERS.map(p => (
                <div key={p.id} className="partner-card">
                  <strong className="partner-name">{p.name}</strong>
                  <span className="partner-del">{p.deliveryTime}</span>
                  <span className="badge badge-emerald">{p.discount}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPharmacy(p);
                      setShowEPharmacyModal(true);
                    }}
                    className="btn btn-secondary btn-sm full-width mt-2"
                  >
                    Order via {p.name.split(' ')[0]}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: DIAGNOSTIC ORDERS & LAB SCHEDULING (Section 10.4) */}
      {activeTab === 'test_orders' && (
        <section className="tab-panel">
          <div className="panel-title-row">
            <div>
              <h3 className="panel-title">Pending Diagnostic Orders & Lab Scheduling</h3>
              <p className="panel-subtitle">
                Review actionable pathology and radiology investigations prescribed by your doctors. Compare transparent prices across local labs and schedule clinic visits or home sample collection.
              </p>
            </div>
          </div>

          <div className="pending-orders-list">
            {profile.pendingTestOrders && profile.pendingTestOrders.length > 0 ? (
              profile.pendingTestOrders.map((ord) => (
                <div key={ord.id} className="pending-order-card">
                  <div className="order-card-top">
                    <div>
                      <span className="badge badge-cyan">{ord.category}</span>
                      <h4 className="order-name">{ord.testName}</h4>
                      <span className="loinc-tag font-mono">{ord.code}</span>
                    </div>
                    <div className="order-urgency-box">
                      <span className="urgency-lbl">Timeline:</span>
                      <strong className="urgency-val text-rose">{ord.urgency}</strong>
                    </div>
                  </div>

                  <div className="order-meta-row">
                    <span>Prescribed by: <strong>{ord.orderedBy}</strong> on {ord.orderDate}</span>
                    <span>•</span>
                    <span>Preparation: <em>{ord.preparation}</em></span>
                    <span>•</span>
                    <span>Estimated Cost: <strong className="text-emerald">{ord.estimatedCostRange}</strong></span>
                  </div>

                  <div className="order-action-bar">
                    <span className="status-indicator-tag">Status: <strong>{ord.status}</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        const matchingTest = DIAGNOSTIC_TEST_CATALOG.find(t => t.testName.toLowerCase().includes(ord.testName.toLowerCase().slice(0, 10))) || DIAGNOSTIC_TEST_CATALOG[0];
                        setSelectedTestToBook(ord);
                        setSelectedLabChoice(matchingTest.hyperlocalPricing[0]);
                        setShowLabBookingModal(true);
                      }}
                      className="btn btn-emerald"
                    >
                      <Calendar size={15} /> Schedule Test / Book Home Collection
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state-box full-width">
                <CheckCircle size={40} className="text-emerald" />
                <p>No pending diagnostic orders. All prescribed lab tests are completed.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* TAB 4: DIGITAL VAULT: REPORTS & DOCTOR VISITS */}
      {activeTab === 'reports' && (
        <section className="tab-panel">
          <div className="panel-title-row">
            <div>
              <h3 className="panel-title">Digital Health Vault: Diagnostic Reports & Doctor Visits</h3>
              <p className="panel-subtitle">
                Access verified laboratory test results in official PDF and high-res Image formats, doctor visit notes, and inpatient observation logs.
              </p>
            </div>
          </div>

          {/* Diagnostic Reports Grid */}
          <div className="clinical-section">
            <div className="clinical-section-header">
              <FileText size={18} className="text-cyan" />
              <h4>📄 Laboratory & Diagnostic Imaging Reports (PDF & Images)</h4>
            </div>

            <div className="reports-gallery-grid">
              {profile.diagnosticReports?.map((rep) => (
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
              ))}
            </div>
          </div>

          {/* Past Doctor Consultations */}
          <div className="clinical-section">
            <div className="clinical-section-header">
              <Stethoscope size={18} className="text-emerald" />
              <h4>👨‍⚕️ Past Doctor Consultations & Prescriptions</h4>
            </div>

            <div className="doctor-visits-timeline">
              {profile.doctorVisits?.map((vis) => (
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
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TAB 5: CONSENT & PRIVACY MANAGER (Section 10.5, DPDP Act 2023) */}
      {activeTab === 'consent' && (
        <section className="tab-panel">
          <div className="panel-title-row">
            <div>
              <h3 className="panel-title">Patient-Centric Consent & Privacy Management</h3>
              <p className="panel-subtitle">
                Account Aggregator architecture empowering you with granular control over who views your medical data, for how long, and for what purpose under the Digital Personal Data Protection (DPDP) Act 2023.
              </p>
            </div>
            <span className="badge badge-emerald">DPDP Act Compliant</span>
          </div>

          {/* Active Consent Requests & Approvals */}
          <div className="clinical-section">
            <div className="clinical-section-header">
              <Lock size={18} className="text-cyan" />
              <h4>🔐 Data Sharing Permissions & Active Doctor Authorizations</h4>
            </div>

            <div className="consent-logs-list">
              {profile.consentLogs?.map((con) => (
                <div key={con.id} className="consent-log-card">
                  <div className="consent-card-top">
                    <div>
                      <h5 className="consent-doc-name">{con.doctorName} ({con.doctorReg})</h5>
                      <p className="consent-hosp-name">{con.hospital}</p>
                    </div>
                    <span className={`badge ${con.status === 'Approved' ? 'badge-emerald' : 'badge-neutral'}`}>
                      {con.status}
                    </span>
                  </div>

                  <div className="consent-meta-grid">
                    <div>
                      <span className="text-muted text-xs">Purpose:</span>
                      <p className="text-sm font-semibold">{con.purpose}</p>
                    </div>
                    <div>
                      <span className="text-muted text-xs">Scope:</span>
                      <p className="text-sm">{con.scope}</p>
                    </div>
                    <div>
                      <span className="text-muted text-xs">Validity:</span>
                      <p className="text-sm font-mono text-cyan">{con.validUntil}</p>
                    </div>
                  </div>

                  <div className="consent-action-row">
                    {con.status === 'Approved' ? (
                      <button
                        type="button"
                        onClick={() => handleRevokeConsent(con.id)}
                        className="btn btn-danger-outline btn-sm"
                      >
                        Revoke Access Immediately
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleApproveConsent(con.id)}
                        className="btn btn-emerald btn-sm"
                      >
                        Grant Access (7 Days)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Break-Glass Emergency Audit Log (FR-05) */}
          <div className="clinical-section">
            <div className="clinical-section-header danger-header">
              <ShieldAlert size={18} className="text-rose" />
              <h4>🚨 Emergency "Break-Glass" Access Audit Trail (7-Year Statutory Log)</h4>
            </div>
            <p className="section-note mb-2">
              Whenever an emergency department accesses your record without prior OTP consent, a mandatory legal audit record is created and preserved for 7 years per the DPDP Act.
            </p>

            <div className="breakglass-audit-list">
              {profile.breakGlassLogs && profile.breakGlassLogs.length > 0 ? (
                profile.breakGlassLogs.map((bg) => (
                  <div key={bg.id} className="breakglass-log-card">
                    <div className="bg-log-top">
                      <strong className="text-rose">{bg.hospital}</strong>
                      <span className="font-mono text-xs">{bg.timestamp}</span>
                    </div>
                    <p className="bg-justification">
                      <strong>Mandatory Clinical Justification:</strong> "{bg.clinicalJustification}"
                    </p>
                    <div className="bg-meta-tags">
                      <span>Attending Doctor: <strong>{bg.doctorName}</strong></span>
                      <span>•</span>
                      <span>SMS Dispatched: <strong className="text-emerald">{bg.emergencyContactNotified}</strong></span>
                      <span>•</span>
                      <span>Retention: {bg.auditRetentionPeriod}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state-box full-width">
                  <p>No emergency break-glass overrides recorded on your file.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* TAB 6: MINOR GUARDIAN INFO (If Minor) */}
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
            </div>

            <div className="guardian-consent-box">
              <div className="consent-header">
                <FileCheck size={20} className="text-emerald" />
                <h4>Signed Digital Consent & Medical Power of Attorney for Emergency</h4>
              </div>
              <p className="consent-description">
                "{profile.guardianDetails?.consentScope}"
              </p>
            </div>
          </div>
        </section>
      )}

      {/* MODAL: E-PHARMACY ORDER PLACEMENT (Section 10.3) */}
      {showEPharmacyModal && (
        <div className="modal-overlay">
          <div className="modal-card small-modal">
            <div className="modal-header">
              <div className="modal-header-icon">
                <ShoppingBag size={24} className="text-emerald" />
              </div>
              <div>
                <h3 className="modal-title">Order Prescribed Medicines Online</h3>
                <p className="modal-subtitle">Direct Dispatch from Empaneled E-Pharmacy Partners</p>
              </div>
              <button type="button" onClick={() => setShowEPharmacyModal(false)} className="modal-close-btn">×</button>
            </div>

            {!orderPlacedData ? (
              <form onSubmit={handlePlacePharmacyOrder} className="modal-form">
                <div className="form-group">
                  <label className="field-label">Select Delivery Partner</label>
                  <select
                    value={selectedPharmacy.id}
                    onChange={(e) => {
                      const p = EMPANELED_PHARMACY_PARTNERS.find(item => item.id === e.target.value);
                      if (p) setSelectedPharmacy(p);
                    }}
                    className="form-select"
                  >
                    {EMPANELED_PHARMACY_PARTNERS.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.deliveryTime} • {p.discount})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="field-label">Delivery Address *</label>
                  <input
                    type="text"
                    value={orderDeliveryAddress}
                    onChange={(e) => setOrderDeliveryAddress(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="order-items-preview-box">
                  <span className="preview-lbl">Medicines to be Dispatched:</span>
                  <ul className="preview-meds-list">
                    {profile.medications?.map((m, i) => (
                      <li key={i}><strong>{m.medicineName}</strong> — {m.dosage}</li>
                    ))}
                  </ul>
                  <div className="order-discount-notice text-emerald">
                    ✓ E-Prescription verified from national ledger • {selectedPharmacy.discount} applied
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowEPharmacyModal(false)} className="btn btn-ghost">Cancel</button>
                  <button type="submit" className="btn btn-emerald btn-large">
                    <ShoppingBag size={16} /> Place Doorstep Delivery Order
                  </button>
                </div>
              </form>
            ) : (
              <div className="preauth-success-box">
                <div className="success-icon-wrap">
                  <CheckCircle size={48} className="text-emerald" />
                </div>
                <h3 className="success-title">Medicine Order Placed Successfully!</h3>
                <p className="success-subtitle">
                  Dispatched via {orderPlacedData.partner}. Expected delivery in {orderPlacedData.deliveryTime}.
                </p>

                <div className="approval-slip">
                  <div className="slip-row">
                    <span>Order Reference ID:</span>
                    <strong className="font-mono text-emerald">{orderPlacedData.orderRef}</strong>
                  </div>
                  <div className="slip-row">
                    <span>Delivery Address:</span>
                    <span className="text-truncate">{orderPlacedData.address}</span>
                  </div>
                  <div className="slip-row">
                    <span>Total Amount Payable:</span>
                    <strong className="text-emerald">{orderPlacedData.estimatedTotal}</strong>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEPharmacyModal(false);
                      setOrderPlacedData(null);
                    }}
                    className="btn btn-primary full-width"
                  >
                    Done & Return
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: LAB BOOKING & HOME COLLECTION (Section 10.4) */}
      {showLabBookingModal && selectedTestToBook && (
        <div className="modal-overlay">
          <div className="modal-card small-modal">
            <div className="modal-header">
              <div className="modal-header-icon">
                <Calendar size={24} className="text-cyan" />
              </div>
              <div>
                <h3 className="modal-title">Schedule Diagnostic Lab Investigation</h3>
                <p className="modal-subtitle">{selectedTestToBook.testName}</p>
              </div>
              <button type="button" onClick={() => setShowLabBookingModal(false)} className="modal-close-btn">×</button>
            </div>

            {!bookingConfirmedData ? (
              <form onSubmit={handleConfirmLabBooking} className="modal-form">
                <div className="form-group">
                  <label className="field-label">Select Empaneled Lab (Price Comparison)</label>
                  <select
                    onChange={(e) => {
                      const lab = DIAGNOSTIC_TEST_CATALOG[0].hyperlocalPricing.find(l => l.labName === e.target.value);
                      if (lab) setSelectedLabChoice(lab);
                    }}
                    className="form-select"
                  >
                    <option value="Dr. Lal PathLabs">Dr. Lal PathLabs (₹450 • 6 hr turnaround)</option>
                    <option value="SRL Diagnostics (Agilus)">SRL Diagnostics (₹420 • 8 hr turnaround)</option>
                    <option value="Metropolis Healthcare">Metropolis Healthcare (₹460 • 6 hr turnaround)</option>
                    <option value="Jan Aushadhi / Govt PHC">Jan Aushadhi / Govt PHC (₹80 • Subsidized)</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="field-label">Sample Collection Mode</label>
                    <select
                      value={bookingMode}
                      onChange={(e) => setBookingMode(e.target.value)}
                      className="form-select"
                    >
                      <option value="Home Collection">Home Sample Collection (Phlebotomist Visit)</option>
                      <option value="Lab Center Visit">Direct Lab Center Walk-in</option>
                    </select>
                  </div>

                  <div className="form-group flex-1">
                    <label className="field-label">Preferred Time Slot</label>
                    <input
                      type="text"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowLabBookingModal(false)} className="btn btn-ghost">Cancel</button>
                  <button type="submit" className="btn btn-primary btn-large">
                    <CheckCircle size={16} /> Confirm Appointment Booking
                  </button>
                </div>
              </form>
            ) : (
              <div className="preauth-success-box">
                <div className="success-icon-wrap">
                  <CheckCircle size={48} className="text-emerald" />
                </div>
                <h3 className="success-title">Appointment Confirmed!</h3>
                <p className="success-subtitle">Phlebotomist scheduled for {bookingConfirmedData.mode}.</p>

                <div className="approval-slip">
                  <div className="slip-row">
                    <span>Booking Token:</span>
                    <strong className="font-mono text-emerald">{bookingConfirmedData.bookingRef}</strong>
                  </div>
                  <div className="slip-row">
                    <span>Laboratory:</span>
                    <strong>{bookingConfirmedData.lab}</strong>
                  </div>
                  <div className="slip-row">
                    <span>Test:</span>
                    <strong>{bookingConfirmedData.testName}</strong>
                  </div>
                  <div className="slip-row">
                    <span>Estimated Fee:</span>
                    <strong className="text-emerald">₹{bookingConfirmedData.price}</strong>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLabBookingModal(false);
                      setBookingConfirmedData(null);
                    }}
                    className="btn btn-primary full-width"
                  >
                    Done & Return
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* REPORT VIEWER MODAL */}
      {selectedReportForPatientView && (
        <ReportViewerModal
          report={selectedReportForPatientView}
          patient={profile}
          onClose={() => setSelectedReportForPatientView(null)}
        />
      )}

      {/* MODAL: ADD GOVERNMENT SCHEME */}
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

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddSchemeModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Scheme</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD MEDICLAIM */}
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
                <label className="field-label">Policy Number *</label>
                <input
                  type="text"
                  value={newMediclaim.policyNumber}
                  onChange={(e) => setNewMediclaim({ ...newMediclaim, policyNumber: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddMediclaimModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Mediclaim</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CASHLESS PRE-AUTH CLAIM SIMULATOR */}
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
                <div className="form-group">
                  <label className="field-label">Empaneled Hospital Name</label>
                  <select
                    value={preAuthForm.hospitalName}
                    onChange={(e) => setPreAuthForm({ ...preAuthForm, hospitalName: e.target.value })}
                    className="form-select"
                  >
                    <option value="Apollo Speciality Hospitals, Indraprastha">Apollo Speciality Hospitals, Indraprastha</option>
                    <option value="Fortis Memorial Research Institute, Gurugram">Fortis Memorial Research Institute, Gurugram</option>
                    <option value="Max Super Speciality Hospital, Saket">Max Super Speciality Hospital, Saket</option>
                    <option value="AIIMS New Delhi Emergency Trauma Center">AIIMS New Delhi Emergency Trauma Center</option>
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

                <div className="form-group">
                  <label className="field-label">Estimated Cashless Claim Amount (₹)</label>
                  <input
                    type="number"
                    value={preAuthForm.estimatedAmount}
                    onChange={(e) => setPreAuthForm({ ...preAuthForm, estimatedAmount: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowCashlessPreAuthModal(false)} className="btn btn-ghost">Cancel</button>
                  <button type="submit" className="btn btn-emerald btn-large">
                    <CheckCircle size={18} /> Generate Instant Cashless Token
                  </button>
                </div>
              </form>
            ) : (
              <div className="preauth-success-box">
                <div className="success-icon-wrap">
                  <CheckCircle size={48} className="text-emerald" />
                </div>
                <h3 className="success-title">Cashless Pre-Authorization Approved!</h3>
                <div className="approval-slip">
                  <div className="slip-row">
                    <span>Reference ID:</span>
                    <strong className="font-mono text-emerald">{preAuthSuccessData.refNumber}</strong>
                  </div>
                  <div className="slip-row">
                    <span>Approved Amount:</span>
                    <strong className="text-emerald font-large">{formatCurrencyINR(preAuthSuccessData.approvedAmount)}</strong>
                  </div>
                  <div className="slip-row">
                    <span>Hospital:</span>
                    <strong>{preAuthSuccessData.hospital}</strong>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setShowCashlessPreAuthModal(false)}
                    className="btn btn-primary full-width"
                  >
                    Done & Return
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
