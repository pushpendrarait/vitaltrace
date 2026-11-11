import React, { useState } from 'react';
import { 
  X, User, Stethoscope, ShieldCheck, CheckCircle2, 
  Building, Fingerprint, Lock, ArrowRight, UserPlus 
} from 'lucide-react';
import { REGISTERED_DOCTORS } from '../data/initialData';
import { maskAadhaar } from '../utils/helpers';

export default function LoginModal({ 
  isOpen, 
  onClose, 
  onLoginAsPatient, 
  onLoginAsDoctor, 
  onOpenRegister, 
  profiles, 
  currentRole 
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState(currentRole || 'patient');
  const [selectedPatientId, setSelectedPatientId] = useState(profiles[0]?.id || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState(REGISTERED_DOCTORS[0]?.id || '');
  
  // Custom Doctor Form state
  const [isCustomDoctor, setIsCustomDoctor] = useState(false);
  const [customDoc, setCustomDoc] = useState({
    name: 'Dr. Ramesh Chandra',
    qualification: 'MBBS, MD (Internal Medicine)',
    regNumber: 'DMC-2010-55912',
    specialty: 'Internal Medicine',
    hospitalName: 'Apollo Hospitals, New Delhi',
    hospitalAddress: 'Sarita Vihar, Delhi Mathura Road, New Delhi - 110076'
  });

  const handlePatientSubmit = (e) => {
    e.preventDefault();
    const p = profiles.find(item => item.id === selectedPatientId) || profiles[0];
    onLoginAsPatient(p.id);
    onClose();
  };

  const handleDoctorSubmit = (e) => {
    e.preventDefault();
    if (isCustomDoctor) {
      const doc = {
        id: `doc-${Date.now()}`,
        ...customDoc,
        designation: 'Attending Physician',
        contactPhone: '+91 98100 00000',
        email: 'doctor@hospital.org'
      };
      onLoginAsDoctor(doc);
    } else {
      const doc = REGISTERED_DOCTORS.find(d => d.id === selectedDoctorId) || REGISTERED_DOCTORS[0];
      onLoginAsDoctor(doc);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card small-modal login-modal-card">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="brand-group">
            <div className="logo-badge">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <div>
              <h3 className="modal-title">National Healthcare Access Login</h3>
              <p className="modal-subtitle">Secure Gateway for Citizens & Registered Medical Officers</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        {/* Role Selection Tabs */}
        <div className="login-role-tabs">
          <button
            type="button"
            className={`role-tab-btn ${activeTab === 'patient' ? 'role-tab-active-patient' : ''}`}
            onClick={() => setActiveTab('patient')}
          >
            <User size={18} />
            <span>Citizen / Patient Login</span>
          </button>

          <button
            type="button"
            className={`role-tab-btn ${activeTab === 'doctor' ? 'role-tab-active-doctor' : ''}`}
            onClick={() => setActiveTab('doctor')}
          >
            <Stethoscope size={18} />
            <span>Doctor / Hospital Login</span>
          </button>
        </div>

        {/* Tab 1: Patient Login */}
        {activeTab === 'patient' ? (
          <form onSubmit={handlePatientSubmit} className="modal-form login-form">
            <div className="alert-box alert-info">
              <Fingerprint size={16} />
              <span>
                Patients can access their health passport, cashless insurance cards, diagnostic PDF/Image reports, and past prescriptions.
              </span>
            </div>

            <div className="form-group">
              <label className="field-label">Select Patient Profile / Registered Aadhaar</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="form-select login-select"
              >
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} {p.isMinor ? '(Minor Child)' : '(Adult)'} • Aadhaar: {maskAadhaar(p.aadhaarNumber)}
                  </option>
                ))}
              </select>
            </div>

            <div className="login-actions">
              <button type="submit" className="btn btn-primary btn-large full-width">
                <User size={17} />
                <span>Enter Patient Health Portal</span>
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="register-prompt-box">
              <span>Don't have an Aadhaar-linked record?</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRegister();
                }}
                className="btn btn-outline-cyan btn-sm"
              >
                <UserPlus size={14} /> Create New Account
              </button>
            </div>
          </form>
        ) : (
          /* Tab 2: Doctor Login */
          <form onSubmit={handleDoctorSubmit} className="modal-form login-form">
            <div className="alert-box alert-error">
              <Stethoscope size={16} />
              <span>
                Authorized National Medical Commission (NMC) verification gateway for emergency & OPD clinical access.
              </span>
            </div>

            {!isCustomDoctor ? (
              <div className="form-group">
                <label className="field-label">Select Registered Medical Officer / Specialist</label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="form-select login-select"
                >
                  {REGISTERED_DOCTORS.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty}) • {d.hospitalName}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsCustomDoctor(true)}
                  className="text-btn text-cyan text-sm mt-2"
                >
                  + Login with custom doctor credentials
                </button>
              </div>
            ) : (
              <div className="custom-doctor-fields">
                <div className="form-row">
                  <div className="form-group flex-2">
                    <label className="field-label">Doctor Full Name *</label>
                    <input
                      type="text"
                      value={customDoc.name}
                      onChange={(e) => setCustomDoc({ ...customDoc, name: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label className="field-label">NMC / State Reg No *</label>
                    <input
                      type="text"
                      value={customDoc.regNumber}
                      onChange={(e) => setCustomDoc({ ...customDoc, regNumber: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="field-label">Specialty / Department *</label>
                  <input
                    type="text"
                    value={customDoc.specialty}
                    onChange={(e) => setCustomDoc({ ...customDoc, specialty: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="field-label">Hospital / Clinic Name *</label>
                  <input
                    type="text"
                    value={customDoc.hospitalName}
                    onChange={(e) => setCustomDoc({ ...customDoc, hospitalName: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="field-label">Hospital Full Address *</label>
                  <input
                    type="text"
                    value={customDoc.hospitalAddress}
                    onChange={(e) => setCustomDoc({ ...customDoc, hospitalAddress: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setIsCustomDoctor(false)}
                  className="text-btn text-muted text-sm"
                >
                  ← Select from verified doctor roster
                </button>
              </div>
            )}

            <div className="login-actions">
              <button type="submit" className="btn btn-emerald btn-large full-width">
                <Stethoscope size={17} />
                <span>Enter Doctor Clinical Workspace</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

