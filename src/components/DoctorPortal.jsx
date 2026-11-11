import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, AlertTriangle, FileText, Image, Search, PlusCircle, 
  Clock, CheckCircle, Calendar, Building2, User, HeartPulse, 
  Activity, ShieldCheck, AlertOctagon, Download, UploadCloud, 
  MapPin, Phone, ArrowLeft, Bed, Plus, Trash2, CheckSquare, 
  Mic, MicOff, DollarSign, Sparkles, Flame, ShieldAlert, 
  Layers, ShoppingBag, Eye, ArrowRight 
} from 'lucide-react';
import { maskAadhaar, calculateAge, formatCurrencyINR } from '../utils/helpers';
import ReportViewerModal from './ReportViewerModal';
import { MASTER_DRUG_DATABASE, DIAGNOSTIC_TEST_CATALOG } from '../data/catalogData';

export default function DoctorPortal({ 
  currentDoctor, 
  profiles, 
  activeProfileId, 
  onSelectPatient, 
  onUpdateProfile, 
  onSwitchDoctor 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('diagnostics'); // 'diagnostics', 'visits', 'inpatient', 'order_tests', 'emergency'
  const [selectedReportForView, setSelectedReportForView] = useState(null);
  
  // Modals
  const [showAddVisitModal, setShowAddVisitModal] = useState(false);
  const [showAddReportModal, setShowAddReportModal] = useState(false);
  const [showAddDailyRoundModal, setShowAddDailyRoundModal] = useState(false);
  const [showAdmitPatientModal, setShowAdmitPatientModal] = useState(false);
  const [showBreakGlassModal, setShowBreakGlassModal] = useState(false);
  const [showOrderTestModal, setShowOrderTestModal] = useState(false);
  
  const patient = profiles.find(p => p.id === activeProfileId) || profiles[0];

  // Filter for reports
  const [reportCategoryFilter, setReportCategoryFilter] = useState('ALL');

  // Speech Recognition (Web Speech API for Zero-Handwriting Policy)
  const [isDictating, setIsDictating] = useState(false);
  const [dictationTarget, setDictationTarget] = useState('complaints'); // 'complaints' | 'examination' | 'diagnosis'
  const [dictationTranscript, setDictationTranscript] = useState('');

  // Break-Glass State
  const [breakGlassJustification, setBreakGlassJustification] = useState('');
  const [breakGlassSuccessNotice, setBreakGlassSuccessNotice] = useState(null);

  // Diagnostic Test Ordering State
  const [selectedTestToOrder, setSelectedTestToOrder] = useState(DIAGNOSTIC_TEST_CATALOG[0]);
  const [testOrderUrgency, setTestOrderUrgency] = useState('Fasting, tomorrow morning');

  // Form states: New Consultation / Visit
  const [newVisit, setNewVisit] = useState({
    chiefComplaints: '',
    bp: '120/80 mmHg',
    pulse: '76 bpm',
    temp: '98.6 °F',
    spo2: '98%',
    respRate: '18 /min',
    clinicalExamination: '',
    diagnosis: '',
    treatmentDetails: '',
    prescriptions: [
      { 
        drug: '', 
        genericEquivalent: '',
        genericSavings: '',
        frequency: '1-0-1', 
        duration: '5 days', 
        intake: 'Post-meal',
        route: 'Oral',
        instructions: '' 
      }
    ],
    followUpAdvice: 'Review after 5 days or if symptoms worsen.'
  });

  // Master Drug Search State for Smart E-Prescription
  const [drugSearchQuery, setDrugSearchQuery] = useState('');
  const [filteredDrugSuggestions, setFilteredDrugSuggestions] = useState([]);
  const [activeRxRowIndex, setActiveRxRowIndex] = useState(0);

  // Form states: New Diagnostic Report
  const [newReport, setNewReport] = useState({
    title: '',
    category: 'Radiology',
    format: 'PDF',
    labName: currentDoctor.hospitalName || 'AIIMS Diagnostic Center',
    labAddress: currentDoctor.hospitalAddress || 'Ansari Nagar, New Delhi',
    orderingDoctor: currentDoctor.name,
    findings: '',
    radiologist: currentDoctor.name,
    fileSize: '1.5 MB'
  });

  // Form states: Daily Observation Round
  const [newDailyRound, setNewDailyRound] = useState({
    dayNumber: 2,
    roundTime: 'Morning Round (09:30 AM)',
    shift: 'Morning Consultant Round',
    bp: '122/80 mmHg',
    pulse: '78 bpm',
    spo2: '97% (Room Air)',
    temp: '98.4 °F',
    respRate: '18 /min',
    bloodSugar: '118 mg/dL',
    urineOutput: 'Adequate / 1200ml',
    clinicalStatus: 'Improving / Clinically Stable',
    progressNotes: '',
    medicationsGiven: '',
    investigationsOrdered: 'Routine Morning Blood Sugar & Electrolytes',
    dietAndFluids: 'Regular diet. Maintain oral hydration.'
  });

  // Form states: Hospitalization Admission
  const [admissionForm, setAdmissionForm] = useState({
    wardBed: 'Emergency Observation Ward - Bed 06A',
    admittingDiagnosis: 'Under Clinical Observation & Diagnostic Workup',
    initialStatus: 'Guarded / Critical Monitoring',
    cashlessScheme: 'PM-JAY Cashless Emergency'
  });

  // Web Speech API initialization
  useEffect(() => {
    let recognition = null;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition && isDictating) {
      try {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        recognition.onresult = (event) => {
          let current = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          setDictationTranscript(current);

          if (dictationTarget === 'complaints') {
            setNewVisit(prev => ({ ...prev, chiefComplaints: (prev.chiefComplaints ? prev.chiefComplaints + ' ' : '') + current }));
          } else if (dictationTarget === 'examination') {
            setNewVisit(prev => ({ ...prev, clinicalExamination: (prev.clinicalExamination ? prev.clinicalExamination + ' ' : '') + current }));
          } else if (dictationTarget === 'diagnosis') {
            setNewVisit(prev => ({ ...prev, diagnosis: current }));
          }
        };

        recognition.onerror = (e) => {
          console.warn('Speech recognition error:', e);
          setIsDictating(false);
        };

        recognition.onend = () => {
          setIsDictating(false);
        };

        recognition.start();
      } catch (err) {
        console.warn('Web Speech API not started:', err);
        setIsDictating(false);
      }
    }

    return () => {
      if (recognition) {
        try { recognition.stop(); } catch (e) {}
      }
    };
  }, [isDictating, dictationTarget]);

  // Drug auto-complete handler
  const handleDrugSearch = (query, rowIndex) => {
    setDrugSearchQuery(query);
    setActiveRxRowIndex(rowIndex);
    if (!query.trim()) {
      setFilteredDrugSuggestions([]);
      return;
    }
    const q = query.toLowerCase();
    const matches = MASTER_DRUG_DATABASE.filter(d => 
      d.brandName.toLowerCase().includes(q) || 
      d.genericName.toLowerCase().includes(q) ||
      d.therapeuticCategory.toLowerCase().includes(q)
    );
    setFilteredDrugSuggestions(matches);
  };

  const handleSelectDrugSuggestion = (drug, rowIndex) => {
    const updated = [...newVisit.prescriptions];
    updated[rowIndex] = {
      ...updated[rowIndex],
      drug: drug.brandName,
      genericEquivalent: drug.genericAlternative.name,
      genericSavings: `Save ${drug.genericAlternative.savingsPercent}% (₹${drug.brandPrice} → ₹${drug.genericAlternative.price})`,
      genericPrice: drug.genericAlternative.price,
      brandPrice: drug.brandPrice,
      frequency: drug.defaultFrequency,
      duration: drug.defaultDuration,
      intake: drug.intakeInstruction,
      route: drug.route
    };
    setNewVisit(prev => ({ ...prev, prescriptions: updated }));
    setFilteredDrugSuggestions([]);
    setDrugSearchQuery('');
  };

  // Smart Generic Substitution
  const handleSubstituteGeneric = (rowIndex) => {
    const rx = newVisit.prescriptions[rowIndex];
    if (!rx.genericEquivalent) return;

    const updated = [...newVisit.prescriptions];
    updated[rowIndex] = {
      ...updated[rowIndex],
      drug: rx.genericEquivalent,
      genericSavings: 'Substituted: Cost-effective Generic Applied'
    };
    setNewVisit(prev => ({ ...prev, prescriptions: updated }));
  };

  // Add Prescription Row
  const handleAddRxRow = () => {
    setNewVisit(prev => ({
      ...prev,
      prescriptions: [
        ...prev.prescriptions, 
        { 
          drug: '', 
          genericEquivalent: '',
          genericSavings: '',
          frequency: '1-0-1', 
          duration: '5 days', 
          intake: 'Post-meal',
          route: 'Oral',
          instructions: '' 
        }
      ]
    }));
  };

  const handleUpdateRxRow = (index, field, value) => {
    const updated = [...newVisit.prescriptions];
    updated[index][field] = value;
    setNewVisit(prev => ({ ...prev, prescriptions: updated }));
  };

  const handleRemoveRxRow = (index) => {
    setNewVisit(prev => ({
      ...prev,
      prescriptions: prev.prescriptions.filter((_, i) => i !== index)
    }));
  };

  // Search handler
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
      onSelectPatient(found.id);
      setSearchQuery('');
    } else {
      alert(`No record found matching "${searchQuery}". Search by 12-digit Aadhaar, VitalTrace ID or patient name.`);
    }
  };

  // Submit Break-Glass Protocol (FR-05, DPDP Act 2023)
  const handleBreakGlassSubmit = (e) => {
    e.preventDefault();
    if (!breakGlassJustification.trim()) {
      alert('Mandatory clinical justification is legally required for emergency break-glass access under the DPDP Act.');
      return;
    }

    const logEntry = {
      id: `bg-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN') + ' IST',
      hospital: currentDoctor.hospitalName,
      doctorName: currentDoctor.name,
      doctorReg: currentDoctor.regNumber,
      clinicalJustification: breakGlassJustification,
      patientSmsNotified: true,
      emergencyContactNotified: `${patient.emergencyContact?.name} (${patient.emergencyContact?.phone})`,
      auditRetentionPeriod: '7 Years (DPDP Act 2023 Compliant)'
    };

    onUpdateProfile({
      ...patient,
      breakGlassLogs: [logEntry, ...(patient.breakGlassLogs || [])]
    });

    setShowBreakGlassModal(false);
    setBreakGlassSuccessNotice(logEntry);
    setBreakGlassJustification('');
  };

  // Submit Diagnostic Test Order (Section 9.3)
  const handleOrderDiagnosticTest = (e) => {
    e.preventDefault();
    const orderItem = {
      id: `ord-${Date.now()}`,
      testName: selectedTestToOrder.testName,
      code: selectedTestToOrder.code,
      category: selectedTestToOrder.category,
      orderedBy: `${currentDoctor.name} (${currentDoctor.hospitalName})`,
      orderDate: new Date().toISOString().split('T')[0],
      urgency: testOrderUrgency,
      status: 'Pending Schedule',
      estimatedCostRange: `₹${selectedTestToOrder.minPrice} - ₹${selectedTestToOrder.maxPrice}`,
      preparation: selectedTestToOrder.preparation
    };

    onUpdateProfile({
      ...patient,
      pendingTestOrders: [orderItem, ...(patient.pendingTestOrders || [])]
    });

    setShowOrderTestModal(false);
    alert(`Test order created: "${selectedTestToOrder.testName}" (Urgency: ${testOrderUrgency}). Synced to patient portal.`);
  };

  // Submit New Visit / Consultation
  const handleSaveVisit = (e) => {
    e.preventDefault();
    if (!newVisit.diagnosis.trim()) return;

    // Allergy check warning
    const prescribedText = newVisit.prescriptions.map(p => p.drug).join(' ').toLowerCase();
    const allergic = (patient.allergies || []).find(all => 
      prescribedText.includes(all.substance.toLowerCase()) || 
      all.substance.toLowerCase().includes(prescribedText)
    );

    if (allergic) {
      const ok = window.confirm(
        `🚨 CRITICAL ALLERGY CONTRAINDICATION:\n\nPatient is documented to be severely allergic to: "${allergic.substance}"!\n\nDo you wish to override and prescribe anyway?`
      );
      if (!ok) return;
    }

    const visitItem = {
      id: `vis-${Date.now()}`,
      visitDate: new Date().toISOString().split('T')[0],
      doctorName: currentDoctor.name,
      doctorQualification: currentDoctor.qualification,
      doctorRegNo: currentDoctor.regNumber,
      specialty: currentDoctor.specialty,
      hospitalName: currentDoctor.hospitalName,
      hospitalAddress: currentDoctor.hospitalAddress,
      chiefComplaints: newVisit.chiefComplaints,
      vitals: {
        bp: newVisit.bp,
        pulse: newVisit.pulse,
        temp: newVisit.temp,
        spo2: newVisit.spo2,
        respRate: newVisit.respRate
      },
      clinicalExamination: newVisit.clinicalExamination,
      diagnosis: newVisit.diagnosis,
      treatmentDetails: newVisit.treatmentDetails,
      prescriptions: newVisit.prescriptions
        .filter(p => p.drug.trim() !== '')
        .map(p => ({
          drug: p.drug,
          dosage: `${p.frequency} (${p.intake})`,
          duration: p.duration,
          instructions: `${p.route} • ${p.instructions || 'As advised'}`
        })),
      followUpAdvice: newVisit.followUpAdvice
    };

    onUpdateProfile({
      ...patient,
      doctorVisits: [visitItem, ...(patient.doctorVisits || [])]
    });

    setShowAddVisitModal(false);
    alert('Visit consultation recorded with Smart E-Prescriptions and synced to national health ledger!');
  };

  // Submit New Diagnostic Report
  const handleSaveReport = (e) => {
    e.preventDefault();
    if (!newReport.title.trim()) return;

    const reportItem = {
      id: `rep-${Date.now()}`,
      title: newReport.title,
      category: newReport.category,
      format: newReport.format,
      date: new Date().toISOString().split('T')[0],
      labName: newReport.labName,
      labAddress: newReport.labAddress,
      orderingDoctor: newReport.orderingDoctor,
      findings: newReport.findings || 'Investigation report uploaded by attending medical officer.',
      radiologist: newReport.radiologist,
      fileSize: newReport.fileSize,
      imageType: newReport.category.toLowerCase().includes('cardio') ? 'ecg' : 'xray',
      status: 'Final Verified'
    };

    onUpdateProfile({
      ...patient,
      diagnosticReports: [reportItem, ...(patient.diagnosticReports || [])]
    });

    setShowAddReportModal(false);
    alert(`New ${newReport.format} report added successfully.`);
  };

  // Submit Daily Inpatient Observation Log
  const handleSaveDailyRound = (e) => {
    e.preventDefault();
    if (!newDailyRound.progressNotes.trim()) return;

    const roundItem = {
      logId: `round-${Date.now()}`,
      dayNumber: Number(newDailyRound.dayNumber) || 1,
      date: new Date().toISOString().split('T')[0],
      roundTime: newDailyRound.roundTime,
      attendingDoctor: currentDoctor.name,
      shift: newDailyRound.shift,
      vitals: {
        bp: newDailyRound.bp,
        pulse: newDailyRound.pulse,
        spo2: newDailyRound.spo2,
        temp: newDailyRound.temp,
        respRate: newDailyRound.respRate,
        bloodSugar: newDailyRound.bloodSugar,
        urineOutput: newDailyRound.urineOutput
      },
      clinicalStatus: newDailyRound.clinicalStatus,
      progressNotes: newDailyRound.progressNotes,
      medicationsGiven: newDailyRound.medicationsGiven,
      investigationsOrdered: newDailyRound.investigationsOrdered,
      dietAndFluids: newDailyRound.dietAndFluids
    };

    const currentHosp = (patient.hospitalizations || [])[0];
    if (currentHosp) {
      const updatedHosp = {
        ...currentHosp,
        dailyObservationLogs: [...(currentHosp.dailyObservationLogs || []), roundItem]
      };
      onUpdateProfile({
        ...patient,
        hospitalizations: [updatedHosp, ...(patient.hospitalizations.slice(1))]
      });
    }

    setShowAddDailyRoundModal(false);
    alert('Daily observation clinical round added to patient chart!');
  };

  // Submit Inpatient Admission
  const handleAdmitPatient = (e) => {
    e.preventDefault();
    const newHosp = {
      id: `ipd-${Date.now()}`,
      status: 'Currently Hospitalized (Under Observation)',
      admissionDate: new Date().toISOString().split('T')[0],
      dischargeDate: 'Active Admission',
      wardBed: admissionForm.wardBed,
      admittingHospital: currentDoctor.hospitalName,
      hospitalAddress: currentDoctor.hospitalAddress,
      attendingDoctor: currentDoctor.name,
      admissionDiagnosis: admissionForm.admittingDiagnosis,
      cashlessAuthorization: admissionForm.cashlessScheme,
      dailyObservationLogs: [
        {
          logId: `round-${Date.now()}`,
          dayNumber: 1,
          date: new Date().toISOString().split('T')[0],
          roundTime: 'Initial Admission Assessment',
          attendingDoctor: currentDoctor.name,
          shift: 'Admission Round',
          vitals: {
            bp: '130/85 mmHg',
            pulse: '88 bpm',
            spo2: '96%',
            temp: '98.6 °F',
            respRate: '20 /min',
            bloodSugar: '120 mg/dL',
            urineOutput: 'Initial'
          },
          clinicalStatus: admissionForm.initialStatus,
          progressNotes: 'Patient admitted under observation. Bedside vitals monitoring established.',
          medicationsGiven: 'Symptomatic stabilization started.',
          investigationsOrdered: 'Baseline admission blood work, ECG & imaging.',
          dietAndFluids: 'NPO / Maintenance fluids pending evaluation.'
        }
      ]
    };

    onUpdateProfile({
      ...patient,
      hospitalizations: [newHosp, ...(patient.hospitalizations || [])]
    });

    setShowAdmitPatientModal(false);
    alert(`Patient admitted to ${admissionForm.wardBed} for inpatient observation.`);
  };

  const activeHospitalization = (patient.hospitalizations || []).find(h => h.status.includes('Currently'));
  const age = calculateAge(patient.dob);

  const filteredReports = (patient.diagnosticReports || []).filter(r => {
    if (reportCategoryFilter === 'ALL') return true;
    return r.category.toLowerCase().includes(reportCategoryFilter.toLowerCase());
  });

  return (
    <div className="doctor-portal-main">
      {/* Doctor Header Banner */}
      <div className="doctor-header-card">
        <div className="doctor-profile-top">
          <div className="doctor-avatar-circle">
            <Stethoscope size={28} className="text-white" />
          </div>
          <div className="doctor-info-text">
            <div className="doc-name-row">
              <h2 className="doctor-name">{currentDoctor.name}</h2>
              <span className="badge badge-emerald">
                <ShieldCheck size={13} /> NMC Verified Medical Officer
              </span>
            </div>
            <p className="doctor-creds">
              <strong>{currentDoctor.qualification}</strong> • Reg: <span className="font-mono text-cyan">{currentDoctor.regNumber}</span> • {currentDoctor.specialty}
            </p>
            <div className="hospital-affiliation-row">
              <Building2 size={15} className="text-muted" />
              <span><strong>{currentDoctor.hospitalName}</strong> — {currentDoctor.hospitalAddress}</span>
            </div>
          </div>
        </div>

        <div className="doctor-header-action-btns">
          {/* Break-Glass Emergency Bypass Button (FR-05) */}
          <button
            type="button"
            onClick={() => setShowBreakGlassModal(true)}
            className="btn btn-emergency btn-sm"
            title="Break-Glass: Emergency Access Override when patient OTP is unavailable"
          >
            <Flame size={15} />
            <span>Break-Glass Access</span>
          </button>

          <button
            type="button"
            onClick={onSwitchDoctor}
            className="btn btn-secondary btn-sm"
          >
            Switch Doctor
          </button>
        </div>
      </div>

      {/* Break-Glass Notification Alert if triggered */}
      {breakGlassSuccessNotice && (
        <div className="alert-box alert-error flex-between">
          <div className="flex-center gap-2">
            <ShieldAlert size={20} className="text-rose" />
            <div>
              <strong>BREAK-GLASS EMERGENCY OVERRIDE ACTIVE</strong>
              <p className="text-sm">
                Access authorized by {breakGlassSuccessNotice.doctorName}. Mandatory SMS broadcast to {breakGlassSuccessNotice.emergencyContactNotified}. Logged for 7-year statutory audit per DPDP Act 2023.
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setBreakGlassSuccessNotice(null)}
            className="btn btn-ghost btn-sm"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Patient Search & Selection Strip */}
      <div className="patient-selector-strip">
        <form onSubmit={handleSearch} className="patient-search-form">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Patient by UHID / 12-digit Aadhaar / Phone / Name..."
            className="patient-search-input"
          />
          <button type="submit" className="btn btn-primary">
            Retrieve Record
          </button>
        </form>

        <div className="patient-quick-pills">
          <span className="text-muted text-sm">Active Roster:</span>
          {profiles.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectPatient(p.id)}
              className={`pill-btn ${activeProfileId === p.id ? 'pill-active' : ''}`}
            >
              {p.fullName} {p.isMinor ? '👶 (Minor)' : '👤'}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Clinical Banner & Allergy Flash */}
      <div className="patient-clinical-banner">
        <div className="patient-banner-left">
          <div className="patient-blood-avatar">
            {patient.bloodGroup || 'O+'}
          </div>
          <div>
            <div className="banner-name-line">
              <h3 className="patient-display-name">{patient.fullName}</h3>
              {patient.isMinor && <span className="badge badge-amber">Minor Dependent Child</span>}
              {activeHospitalization ? (
                <span className="badge badge-danger-solid flex-center gap-1">
                  <Bed size={13} /> Inpatient (Under Observation)
                </span>
              ) : (
                <span className="badge badge-cyan">OPD Patient</span>
              )}
            </div>
            <div className="banner-meta-line">
              <span>UHID: <strong className="font-mono">{patient.vitalTraceId}</strong></span>
              <span>•</span>
              <span>Aadhaar: <strong className="font-mono">{maskAadhaar(patient.aadhaarNumber)}</strong></span>
              <span>•</span>
              <span>Age: <strong>{age} yrs ({patient.gender})</strong></span>
              <span>•</span>
              <span>Emergency: <strong>{patient.emergencyContact?.name} ({patient.emergencyContact?.phone})</strong></span>
            </div>
          </div>
        </div>

        <div className="patient-banner-right">
          {activeHospitalization ? (
            <div className="inpatient-active-badge-box">
              <span className="bed-label">Ward Location:</span>
              <strong className="text-rose">{activeHospitalization.wardBed}</strong>
              <span className="admitted-date-tag">Admitted: {activeHospitalization.admissionDate}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAdmitPatientModal(true)}
              className="btn btn-outline-cyan btn-sm"
            >
              <Bed size={15} /> Admit for Observation
            </button>
          )}
        </div>
      </div>

      {/* High Alert Allergies Warning */}
      {patient.allergies && patient.allergies.length > 0 && (
        <div className="critical-allergies-alert-strip">
          <AlertOctagon size={22} className="text-white flex-shrink-0" />
          <div className="alert-strip-text">
            <strong>CRITICAL DRUG ALLERGIES ON RECORD (DO NOT PRESCRIBE):</strong>
            <div className="allergens-tags-row">
              {patient.allergies.map(a => (
                <span key={a.id} className="allergen-pill">
                  ⚠️ {a.substance} ({a.severity}) — Reaction: {a.reaction}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Doctor Tabs Navigation */}
      <div className="doctor-nav-tabs">
        <button
          className={`doc-tab-btn ${activeTab === 'diagnostics' ? 'doc-tab-active' : ''}`}
          onClick={() => setActiveTab('diagnostics')}
        >
          <FileText size={17} />
          <span>Diagnostic Reports (PDF & Images)</span>
          <span className="doc-tab-count">{patient.diagnosticReports?.length || 0}</span>
        </button>

        <button
          className={`doc-tab-btn ${activeTab === 'visits' ? 'doc-tab-active' : ''}`}
          onClick={() => setActiveTab('visits')}
        >
          <Stethoscope size={17} />
          <span>Past Doctor Visits & E-Prescriptions</span>
          <span className="doc-tab-count">{patient.doctorVisits?.length || 0}</span>
        </button>

        <button
          className={`doc-tab-btn ${activeTab === 'order_tests' ? 'doc-tab-active' : ''}`}
          onClick={() => setActiveTab('order_tests')}
        >
          <DollarSign size={17} />
          <span>Order Diagnostic Tests & Local Pricing</span>
          <span className="badge badge-emerald">LOINC Mapped</span>
        </button>

        <button
          className={`doc-tab-btn ${activeTab === 'inpatient' ? 'doc-tab-active' : ''}`}
          onClick={() => setActiveTab('inpatient')}
        >
          <Bed size={17} />
          <span>Inpatient & Daily Observation Logs</span>
          {activeHospitalization && <span className="doc-tab-pulse"></span>}
        </button>

        <button
          className={`doc-tab-btn ${activeTab === 'emergency' ? 'doc-tab-active' : ''}`}
          onClick={() => setActiveTab('emergency')}
        >
          <Activity size={17} />
          <span>Active Regimens & Cashless Insurance</span>
        </button>
      </div>

      {/* TAB 1: DIAGNOSTIC REPORTS (PDF & IMAGE) */}
      {activeTab === 'diagnostics' && (
        <section className="doc-tab-content">
          <div className="section-action-header">
            <div>
              <h3 className="section-title">Diagnostic Investigation History & Reports</h3>
              <p className="section-subtitle">
                Access all laboratory tests, pathology blood panels, and radiology imaging (CT, X-Ray, ECG) in official PDF and high-res Image formats.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddReportModal(true)}
              className="btn btn-primary"
            >
              <UploadCloud size={16} /> Upload Diagnostic Report
            </button>
          </div>

          {/* Category Filters */}
          <div className="category-filter-strip">
            <span className="filter-label">Filter Department:</span>
            {['ALL', 'Radiology', 'Pathology', 'Cardiology', 'Biochemistry'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setReportCategoryFilter(cat)}
                className={`filter-btn ${reportCategoryFilter === cat ? 'filter-btn-active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Diagnostic Reports Grid */}
          <div className="reports-gallery-grid">
            {filteredReports.length > 0 ? (
              filteredReports.map((rep) => (
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
                      <Building2 size={13} className="text-cyan" /> {rep.labName}
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
                      onClick={() => setSelectedReportForView(rep)}
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
                <FileText size={40} className="text-muted" />
                <p>No diagnostic reports found under "{reportCategoryFilter}".</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* TAB 2: PAST DOCTOR VISITS & SMART E-PRESCRIPTIONS */}
      {activeTab === 'visits' && (
        <section className="doc-tab-content">
          <div className="section-action-header">
            <div>
              <h3 className="section-title">Past Consultations & Smart E-Prescriptions</h3>
              <p className="section-subtitle">
                Consolidated clinical visits across different hospitals with full doctor credentials, facility addresses, examination findings, and itemized prescriptions with smart generic substitution.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddVisitModal(true)}
              className="btn btn-emerald"
            >
              <Plus size={16} /> Document Current Visit (Voice / Smart Rx)
            </button>
          </div>

          <div className="doctor-visits-timeline">
            {patient.doctorVisits && patient.doctorVisits.length > 0 ? (
              patient.doctorVisits.map((vis) => (
                <div key={vis.id} className="visit-card">
                  <div className="visit-header">
                    <div className="doctor-badge-group">
                      <div className="doc-avatar-sm">
                        <Stethoscope size={18} className="text-white" />
                      </div>
                      <div>
                        <h4 className="treating-doctor-name">{vis.doctorName}</h4>
                        <p className="treating-doctor-creds">
                          {vis.doctorQualification} • <span className="font-mono text-cyan">Reg No: {vis.doctorRegNo}</span>
                        </p>
                        <span className="badge badge-purple">{vis.specialty}</span>
                      </div>
                    </div>

                    <div className="visit-meta-tag">
                      <span className="visit-date-badge"><Calendar size={13} /> {vis.visitDate}</span>
                    </div>
                  </div>

                  <div className="hospital-facility-banner">
                    <Building2 size={15} className="text-cyan flex-shrink-0" />
                    <div>
                      <strong>{vis.hospitalName}</strong>
                      <p className="facility-address">{vis.hospitalAddress}</p>
                    </div>
                  </div>

                  {/* Vitals */}
                  <div className="visit-vitals-strip">
                    <div className="vital-item">
                      <span className="vital-lbl">BP</span>
                      <strong className="vital-val">{vis.vitals?.bp || 'N/A'}</strong>
                    </div>
                    <div className="vital-item">
                      <span className="vital-lbl">Pulse</span>
                      <strong className="vital-val">{vis.vitals?.pulse || 'N/A'}</strong>
                    </div>
                    <div className="vital-item">
                      <span className="vital-lbl">Temp</span>
                      <strong className="vital-val">{vis.vitals?.temp || 'N/A'}</strong>
                    </div>
                    <div className="vital-item">
                      <span className="vital-lbl">SpO2</span>
                      <strong className="vital-val text-emerald">{vis.vitals?.spo2 || 'N/A'}</strong>
                    </div>
                    <div className="vital-item">
                      <span className="vital-lbl">Resp Rate</span>
                      <strong className="vital-val">{vis.vitals?.respRate || 'N/A'}</strong>
                    </div>
                  </div>

                  <div className="clinical-findings-box">
                    <div className="findings-row">
                      <span className="findings-heading">Chief Complaints:</span>
                      <p>{vis.chiefComplaints}</p>
                    </div>
                    <div className="findings-row">
                      <span className="findings-heading">Clinical Examination:</span>
                      <p>{vis.clinicalExamination}</p>
                    </div>
                    <div className="findings-row highlight-diag">
                      <span className="findings-heading">Confirmed Diagnosis:</span>
                      <strong className="text-rose font-large">{vis.diagnosis}</strong>
                    </div>
                    <div className="findings-row">
                      <span className="findings-heading">Treatment Details:</span>
                      <p>{vis.treatmentDetails}</p>
                    </div>
                  </div>

                  {/* Prescribed Medications */}
                  {vis.prescriptions && vis.prescriptions.length > 0 && (
                    <div className="visit-prescriptions-section">
                      <h5 className="rx-heading">Prescribed Medications & Regimen</h5>
                      <div className="rx-table-wrap">
                        <table className="rx-table">
                          <thead>
                            <tr>
                              <th>Medicine / Formulation</th>
                              <th>Dosage & Frequency</th>
                              <th>Duration</th>
                              <th>Intake Instructions</th>
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

                  {vis.followUpAdvice && (
                    <div className="visit-advice-footer">
                      <span className="text-muted">Follow-up Advice:</span>
                      <span>{vis.followUpAdvice}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-state-box full-width">
                <Stethoscope size={40} className="text-muted" />
                <p>No past doctor consultations recorded for this patient.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* TAB 3: DIAGNOSTIC TEST ORDERING & LOCAL PRICING (Section 9.3) */}
      {activeTab === 'order_tests' && (
        <section className="doc-tab-content">
          <div className="section-action-header">
            <div>
              <h3 className="section-title">Diagnostic Test Catalog & Hyperlocal Pricing</h3>
              <p className="section-subtitle">
                Select pathology and radiology tests mapped to standard LOINC codes. Review price transparency across empaneled labs in patient's area to inform them of out-of-pocket expenses.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowOrderTestModal(true)}
              className="btn btn-primary"
            >
              <PlusCircle size={16} /> Order New Diagnostic Test
            </button>
          </div>

          <div className="test-catalog-grid">
            {DIAGNOSTIC_TEST_CATALOG.map((test) => (
              <div key={test.id} className="test-order-card">
                <div className="test-card-top">
                  <span className="badge badge-cyan">{test.category}</span>
                  <span className="loinc-tag font-mono">{test.code}</span>
                </div>

                <h4 className="test-title">{test.testName}</h4>
                <p className="test-prep text-sm">
                  <strong>Preparation:</strong> {test.preparation} • Specimen: {test.specimen}
                </p>

                <div className="pricing-range-box">
                  <div className="price-header">
                    <span className="text-muted text-sm">Estimated Local Price Range:</span>
                    <strong className="text-emerald font-large">₹{test.minPrice} - ₹{test.maxPrice}</strong>
                  </div>
                  <div className="labs-comparison-list">
                    {test.hyperlocalPricing.map((lab, idx) => (
                      <div key={idx} className="lab-price-row">
                        <span>{lab.labName} (★ {lab.rating})</span>
                        <strong>₹{lab.price} <span className="turnaround-text">({lab.turnaround})</span></strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="test-card-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTestToOrder(test);
                      setShowOrderTestModal(true);
                    }}
                    className="btn btn-emerald full-width"
                  >
                    <PlusCircle size={15} /> Order for Patient
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 4: INPATIENT & DAILY OBSERVATION ROUNDS */}
      {activeTab === 'inpatient' && (
        <section className="doc-tab-content">
          <div className="section-action-header">
            <div>
              <h3 className="section-title">Inpatient (IPD) Hospitalization & Daily Rounds</h3>
              <p className="section-subtitle">
                Comprehensive tracking of hospitalized patients under observation, including daily morning/evening rounds, vitals telemetry, clinical notes, and fluid balance.
              </p>
            </div>
            <div className="action-button-group">
              {activeHospitalization ? (
                <button
                  type="button"
                  onClick={() => setShowAddDailyRoundModal(true)}
                  className="btn btn-emerald"
                >
                  <PlusCircle size={16} /> Log Daily Clinical Round
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAdmitPatientModal(true)}
                  className="btn btn-primary"
                >
                  <Bed size={16} /> Admit Patient Under Observation
                </button>
              )}
            </div>
          </div>

          {activeHospitalization ? (
            <div className="active-inpatient-container">
              <div className="admission-status-banner">
                <div className="status-banner-head">
                  <div className="ward-icon-wrap">
                    <Bed size={26} className="text-rose" />
                  </div>
                  <div>
                    <div className="banner-title-flex">
                      <h4 className="ward-title">{activeHospitalization.wardBed}</h4>
                      <span className="badge badge-danger-solid">CURRENTLY ADMITTED</span>
                    </div>
                    <p className="hospital-tag-line">
                      <Building2 size={14} className="text-cyan" /> {activeHospitalization.admittingHospital} — {activeHospitalization.hospitalAddress}
                    </p>
                  </div>
                </div>

                <div className="admission-meta-grid">
                  <div className="adm-meta-cell">
                    <span className="cell-lbl">Admission Date:</span>
                    <strong>{activeHospitalization.admissionDate}</strong>
                  </div>
                  <div className="adm-meta-cell">
                    <span className="cell-lbl">Admitting Consultant:</span>
                    <strong>{activeHospitalization.attendingDoctor}</strong>
                  </div>
                  <div className="adm-meta-cell">
                    <span className="cell-lbl">Admission Diagnosis:</span>
                    <strong className="text-rose">{activeHospitalization.admissionDiagnosis}</strong>
                  </div>
                  <div className="adm-meta-cell">
                    <span className="cell-lbl">Cashless Pre-Auth Ref:</span>
                    <strong className="font-mono text-emerald">{activeHospitalization.cashlessAuthorization || 'PM-JAY Approved'}</strong>
                  </div>
                </div>
              </div>

              {/* Daily Observation Rounds Timeline */}
              <div className="daily-rounds-header">
                <h4 className="subhead-title">Daily Clinical Observation Rounds & Nursing Updates</h4>
                <button
                  type="button"
                  onClick={() => setShowAddDailyRoundModal(true)}
                  className="btn btn-outline-cyan btn-sm"
                >
                  + Add Daily Progress Round
                </button>
              </div>

              <div className="daily-rounds-list">
                {activeHospitalization.dailyObservationLogs && activeHospitalization.dailyObservationLogs.length > 0 ? (
                  activeHospitalization.dailyObservationLogs.map((log) => (
                    <div key={log.logId} className="round-card">
                      <div className="round-card-top">
                        <div className="round-title-group">
                          <span className="day-badge">Day {log.dayNumber}</span>
                          <h5 className="round-time">{log.roundTime}</h5>
                          <span className="round-shift-tag">{log.shift}</span>
                        </div>
                        <div className="round-status-wrap">
                          <span className={`badge ${log.clinicalStatus.includes('Improving') || log.clinicalStatus.includes('Stable') ? 'badge-emerald' : 'badge-rose'}`}>
                            Status: {log.clinicalStatus}
                          </span>
                        </div>
                      </div>

                      <div className="round-attending-doc">
                        <Stethoscope size={14} className="text-cyan" />
                        <span>Attending Physician: <strong>{log.attendingDoctor}</strong> • Recorded: {log.date}</span>
                      </div>

                      {/* Daily Vitals */}
                      <div className="daily-vitals-row">
                        <div className="daily-vital-box">
                          <span className="dv-label">BP</span>
                          <strong className="dv-val">{log.vitals?.bp}</strong>
                        </div>
                        <div className="daily-vital-box">
                          <span className="dv-label">Pulse</span>
                          <strong className="dv-val">{log.vitals?.pulse}</strong>
                        </div>
                        <div className="daily-vital-box">
                          <span className="dv-label">SpO2</span>
                          <strong className="dv-val text-emerald">{log.vitals?.spo2}</strong>
                        </div>
                        <div className="daily-vital-box">
                          <span className="dv-label">Temp</span>
                          <strong className="dv-val">{log.vitals?.temp}</strong>
                        </div>
                        <div className="daily-vital-box">
                          <span className="dv-label">Resp Rate</span>
                          <strong className="dv-val">{log.vitals?.respRate}</strong>
                        </div>
                        <div className="daily-vital-box">
                          <span className="dv-label">Blood Sugar</span>
                          <strong className="dv-val">{log.vitals?.bloodSugar}</strong>
                        </div>
                        <div className="daily-vital-box">
                          <span className="dv-label">Urine Output</span>
                          <strong className="dv-val">{log.vitals?.urineOutput}</strong>
                        </div>
                      </div>

                      <div className="round-notes-box">
                        <span className="note-heading">Progress Note:</span>
                        <p className="note-body">{log.progressNotes}</p>
                      </div>

                      <div className="round-treatments-grid">
                        <div className="round-treatment-item">
                          <span className="rt-label">Medications Administered:</span>
                          <p>{log.medicationsGiven || 'Continued existing regimen.'}</p>
                        </div>
                        <div className="round-treatment-item">
                          <span className="rt-label">Investigations Ordered:</span>
                          <p>{log.investigationsOrdered || 'None for this round.'}</p>
                        </div>
                        <div className="round-treatment-item">
                          <span className="rt-label">Diet & Fluids:</span>
                          <p>{log.dietAndFluids || 'As tolerated.'}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No daily observation rounds logged yet.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="empty-state-box full-width">
              <Bed size={48} className="text-muted" />
              <h4>Patient is Currently Not Hospitalized</h4>
              <p>This patient is currently an outpatient. You can admit them to an observation ward or ICU bed to begin logging daily clinical observation rounds.</p>
              <button
                type="button"
                onClick={() => setShowAdmitPatientModal(true)}
                className="btn btn-primary"
              >
                <Bed size={16} /> Admit for Inpatient Observation
              </button>
            </div>
          )}
        </section>
      )}

      {/* TAB 5: ACTIVE MEDICATIONS & CASHLESS SCHEMES */}
      {activeTab === 'emergency' && (
        <section className="doc-tab-content">
          <div className="section-action-header">
            <div>
              <h3 className="section-title">Active Regimens & Cashless Insurance Coverage</h3>
              <p className="section-subtitle">
                Review verified government schemes and private mediclaim to facilitate cashless treatment authorization without deposit delays.
              </p>
            </div>
          </div>

          <div className="hud-grid-2">
            <div className="hud-panel">
              <div className="hud-panel-title">
                <HeartPulse size={18} className="text-cyan" />
                <h4>Ongoing Medication Regimens (Cross-Hospital History)</h4>
              </div>
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
                        <span>Prescribed at: <strong>{m.prescribedHospital}</strong> ({m.doctorName})</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No active medications recorded.</p>
                )}
              </div>
            </div>

            <div className="hud-panel">
              <div className="hud-panel-title">
                <Building2 size={18} className="text-emerald" />
                <h4>Cashless Schemes Available for Instant Admission</h4>
              </div>

              <div className="schemes-compact-list">
                {patient.govtSchemes?.map(s => (
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
                ))}

                {patient.mediclaimPolicies?.map(m => (
                  <div key={m.id} className="compact-scheme-card mt-2">
                    <div className="scheme-top">
                      <strong>{m.insuranceCompany}</strong>
                      <span className="badge badge-purple">{m.policyType}</span>
                    </div>
                    <div className="scheme-meta-line">
                      <span>Policy No: <code className="font-mono">{m.policyNumber}</code></span>
                      <span>•</span>
                      <span>Available: <strong className="text-emerald">{formatCurrencyINR(m.cashlessBalanceAvailable)}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* REPORT VIEWER MODAL */}
      {selectedReportForView && (
        <ReportViewerModal
          report={selectedReportForView}
          patient={patient}
          onClose={() => setSelectedReportForView(null)}
        />
      )}

      {/* MODAL: DOCUMENT CURRENT VISIT WITH VOICE DICTATION & SMART RX */}
      {showAddVisitModal && (
        <div className="modal-overlay">
          <div className="modal-card large-modal">
            <div className="modal-header">
              <div className="modal-header-icon">
                <Stethoscope size={24} className="text-emerald" />
              </div>
              <div>
                <h3 className="modal-title">Document Consultation & Smart E-Prescription</h3>
                <p className="modal-subtitle">
                  AI Voice-to-Text Dictation (Zero-Handwriting Mandate) • Smart Generic Medicine Substitution
                </p>
              </div>
              <button type="button" onClick={() => setShowAddVisitModal(false)} className="modal-close-btn">×</button>
            </div>

            <form onSubmit={handleSaveVisit} className="modal-form">
              {/* Voice-to-Text Dictation Control Bar */}
              <div className="voice-dictation-control-bar">
                <div className="voice-status-left">
                  <span className={`voice-mic-indicator ${isDictating ? 'mic-pulse' : ''}`}>
                    {isDictating ? <Mic size={18} className="text-rose" /> : <MicOff size={18} className="text-muted" />}
                  </span>
                  <div>
                    <strong>AI Voice-to-Text Clinical Dictation</strong>
                    <span className="voice-subtext">
                      {isDictating ? 'Listening... Speak symptoms, clinical findings or diagnosis clearly' : 'Click "Start Voice Dictation" to capture clinical narrative hands-free'}
                    </span>
                  </div>
                </div>

                <div className="voice-actions">
                  <select
                    value={dictationTarget}
                    onChange={(e) => setDictationTarget(e.target.value)}
                    className="form-select form-select-sm"
                  >
                    <option value="complaints">Dictate into Chief Complaints</option>
                    <option value="examination">Dictate into Clinical Examination</option>
                    <option value="diagnosis">Dictate into Diagnosis</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setIsDictating(!isDictating)}
                    className={`btn btn-sm ${isDictating ? 'btn-danger' : 'btn-outline-cyan'}`}
                  >
                    {isDictating ? 'Stop Voice Recording' : 'Start Voice Dictation'}
                  </button>
                </div>
              </div>

              {/* Chief Complaints */}
              <div className="form-group">
                <div className="field-label-row">
                  <label className="field-label">Chief Complaints & Presenting Symptoms *</label>
                  <span className="snmd-tag">SNOMED CT Mapped</span>
                </div>
                <textarea
                  value={newVisit.chiefComplaints}
                  onChange={(e) => setNewVisit({ ...newVisit, chiefComplaints: e.target.value })}
                  placeholder="e.g. High grade fever for 3 days with chills, retrosternal chest discomfort, breathlessness on exertion..."
                  className="form-input form-textarea"
                  rows={2}
                  required
                />
              </div>

              {/* Vitals in visit */}
              <div className="form-grid-3">
                <div className="form-group">
                  <label className="field-label">Blood Pressure (mmHg)</label>
                  <input
                    type="text"
                    value={newVisit.bp}
                    onChange={(e) => setNewVisit({ ...newVisit, bp: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="field-label">Pulse (bpm)</label>
                  <input
                    type="text"
                    value={newVisit.pulse}
                    onChange={(e) => setNewVisit({ ...newVisit, pulse: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="field-label">SpO2 Oxygen (%)</label>
                  <input
                    type="text"
                    value={newVisit.spo2}
                    onChange={(e) => setNewVisit({ ...newVisit, spo2: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Clinical Examination */}
              <div className="form-group">
                <label className="field-label">Clinical Examination & Systemic Findings</label>
                <textarea
                  value={newVisit.clinicalExamination}
                  onChange={(e) => setNewVisit({ ...newVisit, clinicalExamination: e.target.value })}
                  placeholder="e.g. Bilateral lower zone crackles, clear S1/S2 heart sounds, soft non-tender abdomen..."
                  className="form-input form-textarea"
                  rows={2}
                />
              </div>

              {/* Diagnosis */}
              <div className="form-group">
                <div className="field-label-row">
                  <label className="field-label">Provisional / Confirmed Diagnosis (ICD-10) *</label>
                  <span className="snmd-tag">ICD-10 / SNOMED CT</span>
                </div>
                <input
                  type="text"
                  value={newVisit.diagnosis}
                  onChange={(e) => setNewVisit({ ...newVisit, diagnosis: e.target.value })}
                  placeholder="e.g. Acute Viral Bronchitis (ICD-10: J20.9)"
                  className="form-input"
                  required
                />
              </div>

              {/* SMART E-PRESCRIPTION BUILDER WITH GENERIC SUBSTITUTION (Section 9.2) */}
              <div className="smart-rx-builder-section">
                <div className="section-header-flex">
                  <div>
                    <h4 className="smart-rx-title">
                      <Sparkles size={16} className="text-cyan" /> Smart E-Prescription & Generic Alternatives
                    </h4>
                    <p className="smart-rx-sub">
                      Type branded drug to view price comparison and substitute affordable generics with 1 click.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddRxRow}
                    className="btn btn-outline-cyan btn-sm"
                  >
                    + Add Drug
                  </button>
                </div>

                {newVisit.prescriptions.map((rx, idx) => (
                  <div key={idx} className="rx-builder-card">
                    <div className="rx-card-top-row">
                      <div className="form-group flex-2 relative-input">
                        <label className="field-label">Search Medicine / Drug Name</label>
                        <input
                          type="text"
                          value={rx.drug}
                          onChange={(e) => {
                            handleUpdateRxRow(idx, 'drug', e.target.value);
                            handleDrugSearch(e.target.value, idx);
                          }}
                          placeholder="Search e.g. Augmentin, Pan-D, Lipitor, Glycomet, Telma..."
                          className="form-input"
                        />

                        {/* Drug Suggestions Dropdown */}
                        {filteredDrugSuggestions.length > 0 && activeRxRowIndex === idx && (
                          <div className="drug-suggestions-dropdown">
                            {filteredDrugSuggestions.map(d => (
                              <div
                                key={d.id}
                                onClick={() => handleSelectDrugSuggestion(d, idx)}
                                className="drug-suggestion-item"
                              >
                                <div className="suggestion-brand">
                                  <strong>{d.brandName}</strong> ({d.therapeuticCategory})
                                </div>
                                <div className="suggestion-generic">
                                  Generic: {d.genericName}
                                </div>
                                <div className="suggestion-savings text-emerald">
                                  Generic alternative: ₹{d.genericAlternative.price} (Save {d.genericAlternative.savingsPercent}%)
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="form-group flex-1">
                        <label className="field-label">Frequency</label>
                        <select
                          value={rx.frequency}
                          onChange={(e) => handleUpdateRxRow(idx, 'frequency', e.target.value)}
                          className="form-select"
                        >
                          <option value="1-0-1">1-0-1 (Morning & Night)</option>
                          <option value="1-0-0">1-0-0 (Morning Only)</option>
                          <option value="0-0-1">0-0-1 (Night Bedtime)</option>
                          <option value="1-1-1">1-1-1 (TDS - Thrice Daily)</option>
                          <option value="SOS">SOS (When needed for emergency)</option>
                        </select>
                      </div>

                      <div className="form-group flex-1">
                        <label className="field-label">Duration</label>
                        <select
                          value={rx.duration}
                          onChange={(e) => handleUpdateRxRow(idx, 'duration', e.target.value)}
                          className="form-select"
                        >
                          <option value="3 days">3 days</option>
                          <option value="5 days">5 days</option>
                          <option value="7 days">7 days</option>
                          <option value="14 days">14 days</option>
                          <option value="1 month">1 month</option>
                          <option value="3 months">3 months</option>
                        </select>
                      </div>

                      {newVisit.prescriptions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRxRow(idx)}
                          className="btn-icon-danger mt-4"
                        >
                          ×
                        </button>
                      )}
                    </div>

                    {/* Generic Alternative Card Prompt */}
                    {rx.genericEquivalent && (
                      <div className="generic-substitute-card">
                        <div className="gen-left">
                          <span className="badge badge-emerald">Affordable Generic Option Available</span>
                          <p className="gen-name">{rx.genericEquivalent}</p>
                          <span className="gen-savings">{rx.genericSavings}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSubstituteGeneric(idx)}
                          className="btn btn-emerald btn-sm"
                        >
                          Substitute Generic (1-Click)
                        </button>
                      </div>
                    )}

                    <div className="rx-card-bottom-row">
                      <div className="form-group flex-1">
                        <label className="field-label">Intake Timing</label>
                        <select
                          value={rx.intake}
                          onChange={(e) => handleUpdateRxRow(idx, 'intake', e.target.value)}
                          className="form-select"
                        >
                          <option value="Post-meal">Post-meal (After food)</option>
                          <option value="Pre-meal">Pre-meal (30 mins before food)</option>
                          <option value="With meal">With meal / Food</option>
                          <option value="Empty stomach">Early morning empty stomach</option>
                        </select>
                      </div>

                      <div className="form-group flex-1">
                        <label className="field-label">Route</label>
                        <select
                          value={rx.route}
                          onChange={(e) => handleUpdateRxRow(idx, 'route', e.target.value)}
                          className="form-select"
                        >
                          <option value="Oral">Oral (Tablet / Syrup)</option>
                          <option value="Inhalation">Inhalation (Metered Dose Inhaler)</option>
                          <option value="Topical">Topical / Ointment</option>
                          <option value="IV / IM">Intravenous / Intramuscular</option>
                        </select>
                      </div>

                      <div className="form-group flex-2">
                        <label className="field-label">Special Advisory Notes</label>
                        <input
                          type="text"
                          value={rx.instructions}
                          onChange={(e) => handleUpdateRxRow(idx, 'instructions', e.target.value)}
                          placeholder="e.g. Take with warm water, avoid milk products..."
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Follow-up advice */}
              <div className="form-group">
                <label className="field-label">Follow-up Advice & Emergency Precautions</label>
                <input
                  type="text"
                  value={newVisit.followUpAdvice}
                  onChange={(e) => setNewVisit({ ...newVisit, followUpAdvice: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddVisitModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-emerald btn-large">
                  <CheckCircle size={16} /> Save Visit & Broadcast Nationally
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ORDER DIAGNOSTIC TEST (Section 9.3) */}
      {showOrderTestModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-header-icon">
                <DollarSign size={24} className="text-emerald" />
              </div>
              <div>
                <h3 className="modal-title">Order Diagnostic Test & Review Local Pricing</h3>
                <p className="modal-subtitle">
                  LOINC Standardized Pathology & Radiology Catalog • Empaneled Lab Price Comparison
                </p>
              </div>
              <button type="button" onClick={() => setShowOrderTestModal(false)} className="modal-close-btn">×</button>
            </div>

            <form onSubmit={handleOrderDiagnosticTest} className="modal-form">
              <div className="form-group">
                <label className="field-label">Select Standardized Diagnostic Investigation</label>
                <select
                  value={selectedTestToOrder.id}
                  onChange={(e) => {
                    const t = DIAGNOSTIC_TEST_CATALOG.find(item => item.id === e.target.value);
                    if (t) setSelectedTestToOrder(t);
                  }}
                  className="form-select"
                >
                  {DIAGNOSTIC_TEST_CATALOG.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.testName} ({t.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="field-label">Completion Timeline & Urgency Flag *</label>
                <select
                  value={testOrderUrgency}
                  onChange={(e) => setTestOrderUrgency(e.target.value)}
                  className="form-select"
                >
                  <option value="Fasting, tomorrow morning">Fasting, tomorrow morning</option>
                  <option value="Within 24 hours">Within 24 hours</option>
                  <option value="Stat Emergency">Stat Emergency (Immediate Priority)</option>
                  <option value="Before next visit in 5 days">Before next follow-up visit</option>
                </select>
              </div>

              {/* Local Price Range Display */}
              <div className="local-pricing-preview-box">
                <div className="pricing-box-head">
                  <div>
                    <h5 className="pricing-title">Local Area Out-of-Pocket Cost Guidance</h5>
                    <span className="pricing-sub text-muted">Estimated price across empaneled labs in patient's district:</span>
                  </div>
                  <strong className="text-emerald font-large">₹{selectedTestToOrder.minPrice} - ₹{selectedTestToOrder.maxPrice}</strong>
                </div>

                <div className="labs-strip">
                  {selectedTestToOrder.hyperlocalPricing.map((lab, i) => (
                    <div key={i} className="lab-price-pill">
                      <span>{lab.labName}</span>
                      <strong>₹{lab.price}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowOrderTestModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary btn-large">
                  <CheckCircle size={16} /> Place Test Order on Patient Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BREAK-GLASS EMERGENCY OVERRIDE (FR-05, DPDP Act 2023) */}
      {showBreakGlassModal && (
        <div className="modal-overlay">
          <div className="modal-card small-modal">
            <div className="modal-header">
              <div className="modal-header-icon bg-danger-icon">
                <Flame size={24} className="text-white" />
              </div>
              <div>
                <h3 className="modal-title text-rose">"Break-Glass" Emergency Override Protocol</h3>
                <p className="modal-subtitle">Bypass Standard OTP Consent for Unconscious / Critical Patients</p>
              </div>
              <button type="button" onClick={() => setShowBreakGlassModal(false)} className="modal-close-btn">×</button>
            </div>

            <form onSubmit={handleBreakGlassSubmit} className="modal-form">
              <div className="alert-box alert-error">
                <ShieldAlert size={18} />
                <span>
                  <strong>LEGAL NOTICE (DPDP Act 2023):</strong> Break-glass access provides immediate read permissions to allergies and medical history. An immutable audit record will be logged and preserved for 7 years. Immediate SMS alerts will be transmitted to the patient and registered emergency contact.
                </span>
              </div>

              <div className="form-group">
                <label className="field-label">Mandatory Clinical Emergency Justification *</label>
                <textarea
                  value={breakGlassJustification}
                  onChange={(e) => setBreakGlassJustification(e.target.value)}
                  placeholder="e.g. Patient brought in comatose / severe shock. Patient unable to verify OTP. Immediate review of drug allergies and ongoing medication required to prevent fatal medical error."
                  className="form-input form-textarea"
                  rows={4}
                  required
                />
              </div>

              <div className="break-glass-meta-info">
                <div>
                  <span className="text-muted">Physician In-Charge:</span>
                  <strong>{currentDoctor.name} ({currentDoctor.regNumber})</strong>
                </div>
                <div>
                  <span className="text-muted">Emergency Contact to Notify:</span>
                  <strong>{patient.emergencyContact?.name} ({patient.emergencyContact?.phone})</strong>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowBreakGlassModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-danger btn-large">
                  <Flame size={16} /> Confirm & Execute Break-Glass Protocol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD DIAGNOSTIC REPORT */}
      {showAddReportModal && (
        <div className="modal-overlay">
          <div className="modal-card small-modal">
            <div className="modal-header">
              <div className="modal-header-icon">
                <UploadCloud size={24} className="text-cyan" />
              </div>
              <div>
                <h3 className="modal-title">Attach Diagnostic Report</h3>
                <p className="modal-subtitle">Upload Investigation in PDF or High-Res Image Format</p>
              </div>
              <button type="button" onClick={() => setShowAddReportModal(false)} className="modal-close-btn">×</button>
            </div>

            <form onSubmit={handleSaveReport} className="modal-form">
              <div className="form-group">
                <label className="field-label">Report Title / Test Name *</label>
                <input
                  type="text"
                  value={newReport.title}
                  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                  placeholder="e.g. Magnetic Resonance Imaging (MRI) Brain"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="field-label">Department / Category</label>
                  <select
                    value={newReport.category}
                    onChange={(e) => setNewReport({ ...newReport, category: e.target.value })}
                    className="form-select"
                  >
                    <option value="Radiology">Radiology (X-Ray / CT / MRI / USG)</option>
                    <option value="Pathology">Pathology & Histology</option>
                    <option value="Cardiology">Cardiology (ECG / ECHO)</option>
                    <option value="Biochemistry">Biochemistry & Blood Panel</option>
                  </select>
                </div>

                <div className="form-group flex-1">
                  <label className="field-label">File Format *</label>
                  <select
                    value={newReport.format}
                    onChange={(e) => setNewReport({ ...newReport, format: e.target.value })}
                    className="form-select"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="IMAGE">Image (JPEG / PNG / DICOM)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="field-label">Diagnostic Laboratory / Hospital *</label>
                <input
                  type="text"
                  value={newReport.labName}
                  onChange={(e) => setNewReport({ ...newReport, labName: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="field-label">Laboratory Address</label>
                <input
                  type="text"
                  value={newReport.labAddress}
                  onChange={(e) => setNewReport({ ...newReport, labAddress: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="field-label">Findings & Clinical Impression Summary *</label>
                <textarea
                  value={newReport.findings}
                  onChange={(e) => setNewReport({ ...newReport, findings: e.target.value })}
                  placeholder="Summary of radiologist or pathologist impressions..."
                  className="form-input form-textarea"
                  rows={3}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddReportModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <UploadCloud size={16} /> Save & Broadcast Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DAILY OBSERVATION ROUND */}
      {showAddDailyRoundModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-header-icon">
                <Activity size={24} className="text-emerald" />
              </div>
              <div>
                <h3 className="modal-title">Log Daily Inpatient Observation Round</h3>
                <p className="modal-subtitle">
                  Patient: {patient.fullName} • Location: {activeHospitalization?.wardBed || 'Inpatient Bed'}
                </p>
              </div>
              <button type="button" onClick={() => setShowAddDailyRoundModal(false)} className="modal-close-btn">×</button>
            </div>

            <form onSubmit={handleSaveDailyRound} className="modal-form">
              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="field-label">Hospitalization Day Number</label>
                  <input
                    type="number"
                    value={newDailyRound.dayNumber}
                    onChange={(e) => setNewDailyRound({ ...newDailyRound, dayNumber: e.target.value })}
                    className="form-input"
                    min={1}
                  />
                </div>
                <div className="form-group flex-2">
                  <label className="field-label">Round Time / Shift *</label>
                  <input
                    type="text"
                    value={newDailyRound.roundTime}
                    onChange={(e) => setNewDailyRound({ ...newDailyRound, roundTime: e.target.value })}
                    placeholder="e.g. Morning Round (10:00 AM)"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label className="field-label">Patient Clinical Status</label>
                  <select
                    value={newDailyRound.clinicalStatus}
                    onChange={(e) => setNewDailyRound({ ...newDailyRound, clinicalStatus: e.target.value })}
                    className="form-select"
                  >
                    <option value="Improving / Clinically Stable">Improving / Clinically Stable</option>
                    <option value="Stabilizing">Stabilizing</option>
                    <option value="Guarded / Active Monitoring">Guarded / Active Monitoring</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Vitals */}
              <div className="form-grid-3">
                <div className="form-group">
                  <label className="field-label">BP (mmHg)</label>
                  <input
                    type="text"
                    value={newDailyRound.bp}
                    onChange={(e) => setNewDailyRound({ ...newDailyRound, bp: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="field-label">Pulse (bpm)</label>
                  <input
                    type="text"
                    value={newDailyRound.pulse}
                    onChange={(e) => setNewDailyRound({ ...newDailyRound, pulse: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="field-label">SpO2 (%)</label>
                  <input
                    type="text"
                    value={newDailyRound.spo2}
                    onChange={(e) => setNewDailyRound({ ...newDailyRound, spo2: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="field-label">Temp (°F)</label>
                  <input
                    type="text"
                    value={newDailyRound.temp}
                    onChange={(e) => setNewDailyRound({ ...newDailyRound, temp: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="field-label">Blood Sugar (mg/dL)</label>
                  <input
                    type="text"
                    value={newDailyRound.bloodSugar}
                    onChange={(e) => setNewDailyRound({ ...newDailyRound, bloodSugar: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="field-label">Urine Output</label>
                  <input
                    type="text"
                    value={newDailyRound.urineOutput}
                    onChange={(e) => setNewDailyRound({ ...newDailyRound, urineOutput: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="field-label">Clinical Progress Notes & Examination *</label>
                <textarea
                  value={newDailyRound.progressNotes}
                  onChange={(e) => setNewDailyRound({ ...newDailyRound, progressNotes: e.target.value })}
                  placeholder="Document clinical evolution, chest sounds, abdominal findings, response to therapy..."
                  className="form-input form-textarea"
                  rows={3}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="field-label">Medication / IV Fluid Adjustments</label>
                  <input
                    type="text"
                    value={newDailyRound.medicationsGiven}
                    onChange={(e) => setNewDailyRound({ ...newDailyRound, medicationsGiven: e.target.value })}
                    placeholder="e.g. Switched to oral bronchodilator, reduced O2..."
                    className="form-input"
                  />
                </div>
                <div className="form-group flex-1">
                  <label className="field-label">New Lab Orders / Diagnostics</label>
                  <input
                    type="text"
                    value={newDailyRound.investigationsOrdered}
                    onChange={(e) => setNewDailyRound({ ...newDailyRound, investigationsOrdered: e.target.value })}
                    placeholder="e.g. ABG in morning, Serum Potassium..."
                    className="form-input"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddDailyRoundModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-emerald btn-large">
                  <CheckCircle size={16} /> Save Daily Round Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADMIT PATIENT FOR OBSERVATION */}
      {showAdmitPatientModal && (
        <div className="modal-overlay">
          <div className="modal-card small-modal">
            <div className="modal-header">
              <div className="modal-header-icon">
                <Bed size={24} className="text-rose" />
              </div>
              <div>
                <h3 className="modal-title">Admit Patient for Inpatient Observation</h3>
                <p className="modal-subtitle">{patient.fullName} • {currentDoctor.hospitalName}</p>
              </div>
              <button type="button" onClick={() => setShowAdmitPatientModal(false)} className="modal-close-btn">×</button>
            </div>

            <form onSubmit={handleAdmitPatient} className="modal-form">
              <div className="form-group">
                <label className="field-label">Ward / Bed Allocation *</label>
                <input
                  type="text"
                  value={admissionForm.wardBed}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, wardBed: e.target.value })}
                  placeholder="e.g. Acute Observation Unit - Bed 04B"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="field-label">Admission Diagnosis / Indication *</label>
                <input
                  type="text"
                  value={admissionForm.admittingDiagnosis}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, admittingDiagnosis: e.target.value })}
                  placeholder="e.g. Acute Severe Bronchospasm & Respiratory Distress"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="field-label">Initial Clinical Acuity</label>
                <select
                  value={admissionForm.initialStatus}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, initialStatus: e.target.value })}
                  className="form-select"
                >
                  <option value="Guarded / Critical Monitoring">Guarded / Critical Monitoring</option>
                  <option value="Active Observation">Active Observation</option>
                  <option value="Stable / Elective Workup">Stable / Elective Workup</option>
                </select>
              </div>

              <div className="form-group">
                <label className="field-label">Cashless Authorization Scheme</label>
                <input
                  type="text"
                  value={admissionForm.cashlessScheme}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, cashlessScheme: e.target.value })}
                  placeholder="e.g. Ayushman Bharat PM-JAY Cashless Approved"
                  className="form-input"
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAdmitPatientModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-danger btn-large">
                  <Bed size={16} /> Confirm Admission & Open Chart
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
