import React, { useState } from 'react';
import { 
  Stethoscope, AlertTriangle, ShieldCheck, HeartPulse, Search, 
  CreditCard, Users, Clock, PlusCircle, CheckCircle, ArrowLeft, 
  Building2, Phone, AlertOctagon, FileText 
} from 'lucide-react';
import { 
  maskAadhaar, formatCurrencyINR, calculateAge, 
  formatAadhaar 
} from '../utils/helpers';

export default function EmergencyDoctorPortal({ 
  profiles, 
  activeProfileId, 
  onClose, 
  onUpdateProfile 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState(activeProfileId || (profiles[0]?.id));
  const [doctorHospital, setDoctorHospital] = useState('AIIMS New Delhi Emergency Trauma Center');
  const [doctorName, setDoctorName] = useState('Dr. Priya Nair, MD (Emergency Medicine)');
  
  // Doctor prescription addition
  const [newRx, setNewRx] = useState({
    medicineName: '',
    dosage: '',
    indication: ''
  });
  const [rxSuccess, setRxSuccess] = useState('');

  const patient = profiles.find(p => p.id === selectedPatientId) || profiles[0];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const clean = searchQuery.replace(/[\s-]/g, '').toLowerCase();
    const found = profiles.find(p => {
      const matchAadhaar = p.aadhaarNumber.replace(/\s+/g, '').includes(clean);
      const matchVtId = p.vitalTraceId.toLowerCase().replace(/-/g, '').includes(clean);
      const matchName = p.fullName.toLowerCase().includes(clean);
      return matchAadhaar || matchVtId || matchName;
    });

    if (found) {
      setSelectedPatientId(found.id);
    } else {
      alert(`No patient found matching "${searchQuery}". Try searching by Aadhaar number, VitalTrace ID or Name.`);
    }
  };

  const handleAddEmergencyRx = (e) => {
    e.preventDefault();
    if (!newRx.medicineName.trim()) return;

    // Check for allergy contraindication warning!
    const isAllergic = (patient.allergies || []).some(all => 
      newRx.medicineName.toLowerCase().includes(all.substance.toLowerCase()) ||
      all.substance.toLowerCase().includes(newRx.medicineName.toLowerCase())
    );

    if (isAllergic) {
      const confirmOverride = window.confirm(
        `🚨 CRITICAL ALLERGY WARNING:\nPatient is documented to be severely allergic to ${newRx.medicineName}!\n\nDo you still wish to prescribe under override protocol?`
      );
      if (!confirmOverride) return;
    }

    const newMedItem = {
      id: `med-reg-${Date.now()}`,
      medicineName: newRx.medicineName,
      dosage: newRx.dosage || 'STAT Emergency Dose',
      condition: newRx.indication || 'Emergency Stabilization',
      prescribedHospital: doctorHospital,
      doctorName: doctorName,
      startDate: new Date().toISOString().split('T')[0],
      status: 'Active (Emergency Rx)'
    };

    onUpdateProfile({
      ...patient,
      medications: [newMedItem, ...(patient.medications || [])]
    });

    setRxSuccess(`Successfully prescribed ${newRx.medicineName}. Synced to national ledger!`);
    setNewRx({ medicineName: '', dosage: '', indication: '' });
    setTimeout(() => setRxSuccess(''), 4000);
  };

  const age = patient ? calculateAge(patient.dob) : 0;

  return (
    <div className="doctor-portal-container">
      {/* Top Emergency Header */}
      <div className="doctor-top-bar">
        <div className="doctor-meta">
          <div className="doctor-badge">
            <Stethoscope size={20} className="text-rose" />
            <span>EMERGENCY ROOM CLINICAL HUD</span>
          </div>
          <div className="hospital-tag">
            <Building2 size={15} />
            <span>{doctorHospital} • Attending: <strong>{doctorName}</strong></span>
          </div>
        </div>

        <button 
          type="button" 
          onClick={onClose}
          className="btn btn-secondary btn-sm"
        >
          <ArrowLeft size={16} /> Exit to Citizen View
        </button>
      </div>

      {/* Patient Search & Quick Switcher Bar */}
      <div className="doctor-search-strip">
        <form onSubmit={handleSearch} className="doctor-search-form">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Scan Patient QR / Enter 12-Digit Aadhaar / VitalTrace ID (e.g. 7849 2201 9934)"
            className="doctor-search-input"
          />
          <button type="submit" className="btn btn-primary">
            Instant Retrieve
          </button>
        </form>

        <div className="quick-patient-buttons">
          <span className="text-muted text-sm">Demo Patients:</span>
          {profiles.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPatientId(p.id)}
              className={`pill-btn ${selectedPatientId === p.id ? 'pill-active' : ''}`}
            >
              {p.fullName} {p.isMinor ? '👶 (Minor)' : '👤'}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Clinical Patient HUD */}
      {patient && (
        <div className="emergency-hud-layout">
          {/* Patient Overview Strip */}
          <div className="hud-patient-header">
            <div className="hud-id-block">
              <div className="hud-avatar">
                {patient.bloodGroup || 'O+'}
              </div>
              <div>
                <div className="hud-name-row">
                  <h2 className="hud-patient-name">{patient.fullName}</h2>
                  {patient.isMinor && <span className="badge badge-amber">Minor Dependent Child</span>}
                  <span className="badge badge-success">UIDAI Aadhaar Verified</span>
                </div>
                <div className="hud-meta-row">
                  <span>Aadhaar: <strong className="font-mono">{maskAadhaar(patient.aadhaarNumber)}</strong></span>
                  <span>•</span>
                  <span>Health ID: <strong className="font-mono">{patient.vitalTraceId}</strong></span>
                  <span>•</span>
                  <span>Age: <strong>{age} yrs ({patient.gender})</strong></span>
                  <span>•</span>
                  <span>Emergency Phone: <strong>{patient.emergencyContact?.phone}</strong></span>
                </div>
              </div>
            </div>

            {/* Minor Guardian Notice for Emergency Room */}
            {patient.isMinor && patient.guardianDetails && (
              <div className="hud-guardian-alert">
                <Users size={18} className="text-amber" />
                <div>
                  <strong>Parent/Guardian Emergency Contact:</strong> {patient.guardianDetails.guardianName} ({patient.guardianDetails.relation}) • Call: <a href={`tel:${patient.guardianDetails.guardianPhone}`}>{patient.guardianDetails.guardianPhone}</a>
                  <p className="guardian-consent-note">✓ Verified legal power of attorney for emergency invasive procedures & cashless processing on file.</p>
                </div>
              </div>
            )}
          </div>

          {/* CRITICAL ALLERGIES FLASH BANNER (The #1 Emergency Need) */}
          <div className="hud-critical-allergies">
            <div className="allergies-banner-head">
              <AlertOctagon size={22} className="text-white" />
              <h3>CRITICAL CONTRAINDICATION ALERT: DOCUMENTED DRUG ALLERGIES</h3>
              <span className="flash-badge">DO NOT ADMINISTER</span>
            </div>

            <div className="allergies-cards-container">
              {patient.allergies && patient.allergies.length > 0 ? (
                patient.allergies.map(all => (
                  <div key={all.id} className="allergy-danger-card">
                    <div className="allergy-danger-top">
                      <span className="substance-title">⚠️ {all.substance}</span>
                      <span className="badge badge-danger-solid">{all.severity}</span>
                    </div>
                    <p className="reaction-desc">
                      <strong>Reaction:</strong> {all.reaction}
                    </p>
                    <span className="diagnosed-by">Diagnosed by: {all.diagnosedBy} (Recorded: {all.dateRecorded})</span>
                  </div>
                ))
              ) : (
                <div className="no-allergies-banner">
                  <CheckCircle size={18} className="text-emerald" />
                  <span>No documented drug allergies recorded in the national interoperable registry.</span>
                </div>
              )}
            </div>
          </div>

          {/* TWO COLUMN GRID: Active Meds across hospitals & Cashless Insurance */}
          <div className="hud-grid-2">
            {/* Column 1: Ongoing Medications across All Hospitals */}
            <div className="hud-panel">
              <div className="hud-panel-title">
                <HeartPulse size={18} className="text-cyan" />
                <h4>Active Medication Regimens (Cross-Hospital History)</h4>
              </div>
              <p className="panel-desc">
                Current prescriptions from other hospitals to prevent double-dosing and adverse drug-drug interactions:
              </p>

              <div className="meds-list">
                {patient.medications && patient.medications.length > 0 ? (
                  patient.medications.map(m => (
                    <div key={m.id} className="med-item-card">
                      <div className="med-item-top">
                        <strong className="med-name">{m.medicineName}</strong>
                        <span className="badge badge-emerald">{m.status}</span>
                      </div>
                      <div className="med-detail-row">
                        <span>Dose: <strong>{m.dosage}</strong></span>
                        <span>•</span>
                        <span>For: {m.condition}</span>
                      </div>
                      <div className="med-prescriber-row">
                        <Building2 size={12} />
                        <span>Prescribed by: {m.doctorName} at <strong>{m.prescribedHospital}</strong> (Started: {m.startDate})</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state-box">
                    <p>No active medications reported.</p>
                  </div>
                )}
              </div>

              {/* Add Emergency Prescription */}
              <div className="emergency-rx-box">
                <h5>Add Emergency Medication / Treatment to Patient Ledger</h5>
                {rxSuccess && (
                  <div className="alert-box alert-success">
                    <CheckCircle size={16} />
                    <span>{rxSuccess}</span>
                  </div>
                )}
                <form onSubmit={handleAddEmergencyRx} className="mini-form">
                  <div className="form-row">
                    <input
                      type="text"
                      value={newRx.medicineName}
                      onChange={(e) => setNewRx({ ...newRx, medicineName: e.target.value })}
                      placeholder="Medication name (e.g. Ceftriaxone 1g IV)"
                      className="form-input flex-2"
                      required
                    />
                    <input
                      type="text"
                      value={newRx.dosage}
                      onChange={(e) => setNewRx({ ...newRx, dosage: e.target.value })}
                      placeholder="Dose (e.g. STAT IV bolus)"
                      className="form-input flex-1"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary full-width mt-2">
                    <PlusCircle size={16} /> Broadcast to National Ledger
                  </button>
                </form>
              </div>
            </div>

            {/* Column 2: Cashless Health Schemes & Mediclaim for Admission */}
            <div className="hud-panel">
              <div className="hud-panel-title">
                <CreditCard size={18} className="text-emerald" />
                <h4>Cashless Schemes & Insurance for ER Admission</h4>
              </div>
              <p className="panel-desc">
                Verified cashless coverage available to eliminate admission deposit delays:
              </p>

              {/* Government Schemes */}
              <div className="schemes-compact-list">
                <h5 className="subhead-tag">Government Health Schemes (Central/State)</h5>
                {patient.govtSchemes && patient.govtSchemes.length > 0 ? (
                  patient.govtSchemes.map(s => (
                    <div key={s.id} className="compact-scheme-card">
                      <div className="scheme-top">
                        <strong>{s.schemeName}</strong>
                        <span className="badge badge-emerald">{formatCurrencyINR(s.availableBalance)} Available</span>
                      </div>
                      <div className="scheme-meta-line">
                        <span>Beneficiary ID: <code className="font-mono">{s.beneficiaryId}</code></span>
                        <span>•</span>
                        <span>Status: <strong className="text-emerald">{s.status}</strong></span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-sm">No government scheme on record.</p>
                )}

                {/* Mediclaim Policies */}
                <h5 className="subhead-tag mt-3">Private & Corporate Mediclaim Policies</h5>
                {patient.mediclaimPolicies && patient.mediclaimPolicies.length > 0 ? (
                  patient.mediclaimPolicies.map(m => (
                    <div key={m.id} className="compact-scheme-card">
                      <div className="scheme-top">
                        <strong>{m.insuranceCompany}</strong>
                        <span className="badge badge-purple">{m.policyType}</span>
                      </div>
                      <div className="scheme-meta-line">
                        <span>Policy No: <code className="font-mono">{m.policyNumber}</code></span>
                        <span>•</span>
                        <span>TPA: <strong>{m.tpaName}</strong></span>
                      </div>
                      <div className="scheme-meta-line">
                        <span>Available Cashless: <strong className="text-emerald">{formatCurrencyINR(m.cashlessBalanceAvailable)}</strong></span>
                        <span>•</span>
                        <span>TPA Helpline: <strong className="font-mono">{m.cashlessDeskHelpline}</strong></span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-sm">No private mediclaim on record.</p>
                )}
              </div>

              {/* Past Admission History */}
              <div className="past-admissions-summary">
                <h5 className="subhead-tag mt-3">Past Hospital Admissions in Network</h5>
                {patient.hospitalHistory && patient.hospitalHistory.length > 0 ? (
                  patient.hospitalHistory.map(h => (
                    <div key={h.id} className="past-adm-card">
                      <div className="adm-top">
                        <strong>{h.hospitalName}</strong>
                        <span className="text-muted text-sm">{h.admissionDate}</span>
                      </div>
                      <p className="adm-diag">{h.diagnosis}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-sm">No prior hospital admission records.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

