import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProfileView from './components/ProfileView';
import RegistrationModal from './components/RegistrationModal';
import DoctorPortal from './components/DoctorPortal';
import LoginModal from './components/LoginModal';
import { INITIAL_PROFILES, REGISTERED_DOCTORS } from './data/initialData';
import './App.css';

const LOCAL_STORAGE_KEY = 'vitaltrace_profiles_v2';
const ROLE_STORAGE_KEY = 'vitaltrace_role_v2';
const DOCTOR_STORAGE_KEY = 'vitaltrace_doctor_v2';

export default function App() {
  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If saved profiles are missing diagnosticReports, merge with INITIAL_PROFILES
          if (!parsed[0].diagnosticReports) {
            return INITIAL_PROFILES;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved profiles from localStorage', e);
    }
    return INITIAL_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState(() => {
    return profiles[0]?.id || 'vt-user-1001';
  });

  // Current Role: 'patient' or 'doctor'
  const [currentRole, setCurrentRole] = useState(() => {
    try {
      const savedRole = localStorage.getItem(ROLE_STORAGE_KEY);
      if (savedRole === 'doctor' || savedRole === 'patient') return savedRole;
    } catch (e) {}
    return 'patient';
  });

  // Current Logged in Doctor
  const [currentDoctor, setCurrentDoctor] = useState(() => {
    try {
      const savedDoc = localStorage.getItem(DOCTOR_STORAGE_KEY);
      if (savedDoc) {
        const parsed = JSON.parse(savedDoc);
        if (parsed?.name) return parsed;
      }
    } catch (e) {}
    return REGISTERED_DOCTORS[0];
  });

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Sync profiles to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profiles));
    } catch (e) {
      console.error('Failed to save profiles to localStorage', e);
    }
  }, [profiles]);

  // Sync role to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, currentRole);
    } catch (e) {}
  }, [currentRole]);

  // Sync doctor to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(DOCTOR_STORAGE_KEY, JSON.stringify(currentDoctor));
    } catch (e) {}
  }, [currentDoctor]);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRegisterNewProfile = (newProfile) => {
    setProfiles(prev => [newProfile, ...prev]);
    setActiveProfileId(newProfile.id);
    setCurrentRole('patient');
    showNotification(`Aadhaar-linked record created for ${newProfile.fullName}!`);
  };

  const handleUpdateProfile = (updatedProfile) => {
    setProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
    showNotification(`Patient record synchronized successfully.`);
  };

  const handleLoginAsPatient = (patientId) => {
    setActiveProfileId(patientId);
    setCurrentRole('patient');
    showNotification(`Logged in as Citizen: ${profiles.find(p => p.id === patientId)?.fullName || 'Patient'}`);
  };

  const handleLoginAsDoctor = (doctor) => {
    setCurrentDoctor(doctor);
    setCurrentRole('doctor');
    showNotification(`Logged in as Doctor: ${doctor.name} (${doctor.hospitalName})`);
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
        onSelectProfile={setActiveProfileId}
        onOpenRegister={() => setIsRegisterOpen(true)}
        currentRole={currentRole}
        currentDoctor={currentDoctor}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Main View: Either Doctor Clinical Portal or Citizen/Patient Portal */}
      <main className="main-content">
        {currentRole === 'doctor' ? (
          <DoctorPortal
            currentDoctor={currentDoctor}
            profiles={profiles}
            activeProfileId={activeProfileId}
            onSelectPatient={setActiveProfileId}
            onUpdateProfile={handleUpdateProfile}
            onSwitchDoctor={() => setIsLoginModalOpen(true)}
          />
        ) : (
          activeProfile && (
            <ProfileView
              profile={activeProfile}
              onUpdateProfile={handleUpdateProfile}
              onOpenDoctorMode={() => {
                setCurrentRole('doctor');
                showNotification(`Switched to Doctor Clinical Mode (${currentDoctor.name})`);
              }}
            />
          )
        )}
      </main>

      {/* Two Types of Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginAsPatient={handleLoginAsPatient}
        onLoginAsDoctor={handleLoginAsDoctor}
        onOpenRegister={() => setIsRegisterOpen(true)}
        profiles={profiles}
        currentRole={currentRole}
      />

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
            Compliant with UIDAI Aadhaar Verification Protocols • Zero-Deposit Cashless Hospital Admission Guarantee • NMC Authorized Doctor Portal
          </p>
        </div>
      </footer>
    </div>
  );
}
