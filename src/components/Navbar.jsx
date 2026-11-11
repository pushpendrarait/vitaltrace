import React from 'react';
import { Shield, Activity, UserPlus, Stethoscope, Users, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Navbar({ 
  profiles, 
  activeProfileId, 
  onSelectProfile, 
  onOpenRegister, 
  isDoctorMode, 
  onToggleDoctorMode 
}) {
  const activeProfile = profiles.find(p => p.id === activeProfileId);

  return (
    <header className="navbar-container">
      <div className="navbar-top-banner">
        <div className="banner-content">
          <span className="live-dot"></span>
          <span><strong>National Interoperable Health Network</strong> • Unified Aadhaar-Linked Emergency Ledger • Ayushman Bharat & TPA Integrated</span>
        </div>
        <div className="banner-status">
          <CheckCircle2 size={13} className="text-emerald" />
          <span>UIDAI & ABHA Gateway Connected</span>
        </div>
      </div>

      <div className="navbar-main">
        <div className="brand-group">
          <div className="logo-badge">
            <Activity className="logo-icon" size={26} />
            <Shield className="logo-shield" size={14} />
          </div>
          <div>
            <div className="brand-title-wrap">
              <h1 className="brand-title">VitalTrace</h1>
              <span className="brand-tag">NATIONAL INTEROPERABILITY</span>
            </div>
            <p className="brand-subtitle">Emergency Health Ledger & Cashless Insurance Gateway</p>
          </div>
        </div>

        <div className="navbar-actions">
          {/* Patient Selector */}
          <div className="profile-selector-wrap">
            <label className="selector-label">
              <Users size={14} /> Active Patient:
            </label>
            <select 
              value={activeProfileId || ''} 
              onChange={(e) => onSelectProfile(e.target.value)}
              className="profile-select"
            >
              {profiles.map(p => (
                <option key={p.id} value={p.id}>
                  {p.fullName} {p.isMinor ? '(Minor / Child)' : '(Adult)'} - Aadhaar: ...{p.aadhaarNumber.slice(-4)}
                </option>
              ))}
            </select>
          </div>

          {/* New Patient Registration */}
          <button 
            type="button" 
            onClick={onOpenRegister}
            className="btn btn-outline-cyan"
            title="Register a new Aadhaar-linked citizen"
          >
            <UserPlus size={16} />
            <span>New Patient</span>
          </button>

          {/* Emergency Doctor View Toggle */}
          <button 
            type="button" 
            onClick={onToggleDoctorMode}
            className={`btn ${isDoctorMode ? 'btn-danger-active' : 'btn-emergency'}`}
            title="Toggle Emergency Room Doctor Access"
          >
            <Stethoscope size={17} />
            <span>{isDoctorMode ? 'Exit Doctor ER Mode' : 'Doctor Emergency Portal'}</span>
            <span className="badge-pulse">STAT</span>
          </button>
        </div>
      </div>
    </header>
  );
}
