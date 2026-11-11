import React from 'react';
import { 
  Shield, Activity, UserPlus, Stethoscope, Users, 
  CheckCircle2, LogIn, UserCheck, RefreshCw 
} from 'lucide-react';

export default function Navbar({ 
  profiles, 
  activeProfileId, 
  onSelectProfile, 
  onOpenRegister, 
  currentRole, 
  currentDoctor, 
  onOpenLoginModal 
}) {
  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const isDoctor = currentRole === 'doctor';

  return (
    <header className="navbar-container">
      <div className="navbar-top-banner">
        <div className="banner-content">
          <span className="live-dot"></span>
          <span><strong>National Interoperable Health Network</strong> • Unified Aadhaar-Linked Diagnostic & Clinical Ledger • Ayushman Bharat & TPA Integrated</span>
        </div>
        <div className="banner-status">
          <CheckCircle2 size={13} className="text-emerald" />
          <span>ABHA & National Medical Council (NMC) Connected</span>
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
              <span className="brand-tag">INTEROPERABLE CLINICAL LEDGER</span>
            </div>
            <p className="brand-subtitle">Consolidated Diagnostics, Prescriptions, Cashless Schemes & Daily Observation</p>
          </div>
        </div>

        <div className="navbar-actions">
          {/* Active Role Indicator */}
          <div className="role-status-badge-wrap">
            {isDoctor ? (
              <div className="active-role-pill role-pill-doctor">
                <Stethoscope size={15} />
                <span>Doctor Mode: <strong>{currentDoctor.name}</strong> ({currentDoctor.hospitalName.split(' ')[0]})</span>
              </div>
            ) : (
              <div className="active-role-pill role-pill-patient">
                <UserCheck size={15} />
                <span>Patient Portal: <strong>{activeProfile?.fullName}</strong></span>
              </div>
            )}
          </div>

          {/* Patient Quick Selector */}
          <div className="profile-selector-wrap">
            <label className="selector-label">
              <Users size={14} /> Patient:
            </label>
            <select 
              value={activeProfileId || ''} 
              onChange={(e) => onSelectProfile(e.target.value)}
              className="profile-select"
            >
              {profiles.map(p => (
                <option key={p.id} value={p.id}>
                  {p.fullName} {p.isMinor ? '(Minor Child)' : '(Adult)'} - ...{p.aadhaarNumber.slice(-4)}
                </option>
              ))}
            </select>
          </div>

          {/* New Patient Registration */}
          {!isDoctor && (
            <button 
              type="button" 
              onClick={onOpenRegister}
              className="btn btn-outline-cyan btn-sm"
              title="Register a new Aadhaar-linked citizen"
            >
              <UserPlus size={15} />
              <span>New Patient</span>
            </button>
          )}

          {/* Switch Role / Login Button */}
          <button 
            type="button" 
            onClick={onOpenLoginModal}
            className={`btn ${isDoctor ? 'btn-secondary' : 'btn-emerald'} btn-sm`}
            title="Switch between Patient and Doctor Login"
          >
            {isDoctor ? (
              <>
                <RefreshCw size={15} />
                <span>Switch to Patient Login</span>
              </>
            ) : (
              <>
                <Stethoscope size={15} />
                <span>Doctor Login</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
