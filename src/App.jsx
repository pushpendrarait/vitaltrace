import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProfileView from './components/ProfileView';
import RegistrationModal from './components/RegistrationModal';
import EmergencyDoctorPortal from './components/EmergencyDoctorPortal';
import { INITIAL_PROFILES } from './data/initialData';
import './App.css';

const LOCAL_STORAGE_KEY = 'vitaltrace_profiles_v1';

export default function App() {
  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved profiles from localStorage', e);
    }
    return INITIAL_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState(() => {
    return profiles[0]?.id || 'vt-user-1001';
  });

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDoctorMode, setIsDoctorMode] = useState(false);
  const [notification, setNotification] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profiles));
    } catch (e) {
      console.error('Failed to save profiles to localStorage', e);
    }
  }, [profiles]);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRegisterNewProfile = (newProfile) => {
    setProfiles(prev => [newProfile, ...prev]);
    setActiveProfileId(newProfile.id);
    showNotification(`New Aadhaar-linked record created for ${newProfile.fullName}!`);
  };

  const handleUpdateProfile = (updatedProfile) => {
    setProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
    showNotification(`Patient record synchronized successfully.`);
  };

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  return (
    <div className="vitaltrace-app">
      {/* Toast Notification */}
      {notification && (
        <div className={`notification-toast ${notification.type === 'error' ? 'toast-error' : 'toast-success'}`}>
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSelectProfile={(id) => {
          setActiveProfileId(id);
          setIsDoctorMode(false);
        }}
        onOpenRegister={() => setIsRegisterOpen(true)}
        isDoctorMode={isDoctorMode}
        onToggleDoctorMode={() => setIsDoctorMode(prev => !prev)}
      />

      {/* Main View: Either Emergency Doctor HUD or Citizen Profile View */}
      <main className="main-content">
        {isDoctorMode ? (
          <EmergencyDoctorPortal
            profiles={profiles}
            activeProfileId={activeProfileId}
            onClose={() => setIsDoctorMode(false)}
            onUpdateProfile={handleUpdateProfile}
          />
        ) : (
          activeProfile && (
            <ProfileView
              profile={activeProfile}
              onUpdateProfile={handleUpdateProfile}
              onOpenDoctorMode={() => setIsDoctorMode(true)}
            />
          )
        )}
      </main>

      {/* Account Creation Modal */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegister={handleRegisterNewProfile}
        existingProfiles={profiles}
      />

      {/* Footer */}
      <footer className="vitaltrace-footer">
        <div className="footer-content">
          <p>
            <strong>VitalTrace Interoperable Health Ledger</strong> • Developed under National Digital Health Mission & ABHA Interoperability Standards
          </p>
          <p className="footer-subtext">
            Compliant with UIDAI Aadhaar Verification Protocols • Zero-Deposit Cashless Hospital Admission Guarantee
          </p>
        </div>
      </footer>
    </div>
  );
}
