// VitalTrace Initial Data: Interoperable Profiles, Doctors, Reports, Visits & Daily Observation Logs

export const REGISTERED_DOCTORS = [
  {
    id: "doc-101",
    name: "Dr. Priya Nair",
    qualification: "MBBS, MD (Emergency Medicine), FACEE",
    regNumber: "MCI-2012-88219",
    council: "Medical Council of India / Delhi Medical Council",
    specialty: "Emergency Medicine & Trauma Critical Care",
    designation: "Chief Medical Officer & Trauma Incharge",
    hospitalName: "AIIMS New Delhi Emergency Trauma Center",
    hospitalAddress: "Ansari Nagar East, Ring Road, New Delhi - 110029",
    contactPhone: "+91 11 2658 8500",
    email: "dr.priya.nair@aiims.edu.in"
  },
  {
    id: "doc-102",
    name: "Dr. Arvind Mehta",
    qualification: "MBBS, MD (General Medicine), DM (Pulmonology)",
    regNumber: "DMC-2008-44210",
    council: "Delhi Medical Council",
    specialty: "Pulmonology & Respiratory Critical Care",
    designation: "Senior Consultant Pulmonologist",
    hospitalName: "Max Super Speciality Hospital, Saket",
    hospitalAddress: "1, 2, Press Enclave Marg, Saket, New Delhi - 110017",
    contactPhone: "+91 11 2651 5050",
    email: "dr.amehta@maxhealthcare.com"
  },
  {
    id: "doc-103",
    name: "Dr. Ananya Sen",
    qualification: "MBBS, MD (Pediatrics), DCH",
    regNumber: "UPMC-2015-77821",
    council: "Uttar Pradesh Medical Council",
    specialty: "Pediatric Critical Care & General Pediatrics",
    designation: "Consultant Pediatrician",
    hospitalName: "Apollo Children's Hospital, Noida",
    hospitalAddress: "E-2, Sector 26, Gautam Buddha Nagar, Noida, UP - 201301",
    contactPhone: "+91 120 401 2000",
    email: "dr.ananya.sen@apollohospitals.com"
  },
  {
    id: "doc-104",
    name: "Dr. Vivek Mehra",
    qualification: "MBBS, MS, M.Ch (Cardiothoracic & Vascular Surgery)",
    regNumber: "DMC-2005-19823",
    council: "Delhi Medical Council",
    specialty: "Cardiology & Interventional Cardiac Surgery",
    designation: "Director - Interventional Cardiology",
    hospitalName: "Fortis Escorts Heart Institute",
    hospitalAddress: "Okhla Road, Sukhdev Vihar Metro Station, New Delhi - 110025",
    contactPhone: "+91 11 4713 5000",
    email: "dr.vmehra@fortishealthcare.com"
  }
];

export const INITIAL_PROFILES = [
  {
    id: "vt-user-1001",
    vitalTraceId: "VT-IND-8924-1102-7749",
    fullName: "Rajesh Kumar Sharma",
    dob: "1988-06-14",
    gender: "Male",
    bloodGroup: "O+",
    phone: "+91 98765 43210",
    email: "rajesh.sharma@example.com",
    address: "Flat 402, Green Meadows, Sector 62, Noida, Uttar Pradesh - 201309",
    aadhaarNumber: "7849 2201 9934",
    isAadhaarVerified: true,
    isMinor: false,
    emergencyContact: {
      name: "Sunita Sharma",
      relation: "Spouse",
      phone: "+91 98765 43219"
    },

    // Central & State Health Schemes (for cashless processing)
    govtSchemes: [
      {
        id: "sch-1",
        category: "Central",
        schemeName: "Ayushman Bharat - PM-JAY (Pradhan Mantri Jan Arogya Yojana)",
        beneficiaryId: "PMJAY-UP-98421092",
        state: "Uttar Pradesh",
        familyHeadName: "Rajesh Kumar Sharma",
        cashlessCoverageLimit: 500000,
        availableBalance: 465000,
        status: "Active & Verified",
        empanelledHospitalsCount: 28400,
        cardIssuedDate: "2021-03-15",
        lastCashlessClaim: "₹35,000 for Viral Pneumonia at Apollo Hospital (Oct 2025)"
      },
      {
        id: "sch-2",
        category: "Central",
        schemeName: "ESIC (Employees' State Insurance Corporation)",
        beneficiaryId: "ESI-02-8839210-9",
        state: "Uttar Pradesh",
        familyHeadName: "Rajesh Kumar Sharma",
        cashlessCoverageLimit: 250000,
        availableBalance: 250000,
        status: "Active",
        empanelledHospitalsCount: 1550,
        cardIssuedDate: "2020-07-01",
        lastCashlessClaim: "None"
      }
    ],

    // Private & Corporate Mediclaim Policies
    mediclaimPolicies: [
      {
        id: "med-1",
        policyType: "Organizational / Corporate Mediclaim",
        employerName: "TechNova Solutions India Pvt Ltd",
        employeeId: "TN-94021",
        insuranceCompany: "Star Health & Allied Insurance Co Ltd",
        tpaName: "Medi Assist Healthcare TPA",
        policyNumber: "CORP-STAR-2026-90432",
        tpaMemberId: "MEDIASST-TN-882194",
        sumInsured: 1000000,
        cashlessBalanceAvailable: 920000,
        validFrom: "2026-01-01",
        validTill: "2026-12-31",
        cashlessDeskHelpline: "1800-425-2255",
        status: "Active Cashless Approved",
        coPay: "0%",
        roomRentCap: "No Capping"
      },
      {
        id: "med-2",
        policyType: "Private / Family Floater",
        employerName: "N/A (Individual)",
        employeeId: "N/A",
        insuranceCompany: "HDFC ERGO General Insurance",
        tpaName: "In-House Cashless Desk",
        policyNumber: "HDFC-FAM-FLOAT-772190",
        tpaMemberId: "HE-IND-339210",
        sumInsured: 1500000,
        cashlessBalanceAvailable: 1500000,
        validFrom: "2025-08-10",
        validTill: "2027-08-09",
        cashlessDeskHelpline: "1800-266-6400",
        status: "Active Cashless Approved",
        coPay: "0%",
        roomRentCap: "Single Private Room"
      }
    ],

    guardianDetails: null,

    // Clinical Drug Allergies
    allergies: [
      {
        id: "all-1",
        substance: "Penicillin & Amoxicillin",
        severity: "HIGH ALERT (Severe)",
        reaction: "Anaphylaxis, severe broncho-spasm & facial angioedema",
        diagnosedBy: "Dr. Arvind Mehta (Max Super Speciality Hospital, Saket)",
        dateRecorded: "2022-04-18"
      },
      {
        id: "all-2",
        substance: "NSAIDs (Diclofenac & Ibuprofen)",
        severity: "Moderate",
        reaction: "Acute gastric bleeding & severe urticaria",
        diagnosedBy: "Dr. K. Swaminathan (Apollo Hospitals)",
        dateRecorded: "2024-01-11"
      }
    ],

    // Active Medications
    medications: [
      {
        id: "med-reg-1",
        medicineName: "Telmisartan 40mg",
        dosage: "1 tablet once daily (Morning)",
        condition: "Essential Hypertension",
        prescribedHospital: "AIIMS New Delhi",
        doctorName: "Dr. S. K. Gupta",
        startDate: "2023-09-10",
        status: "Active"
      },
      {
        id: "med-reg-2",
        medicineName: "Metformin 500mg SR",
        dosage: "1 tablet with dinner",
        condition: "Type 2 Diabetes Mellitus",
        prescribedHospital: "Fortis Escorts Heart Institute",
        doctorName: "Dr. Reena Sen",
        startDate: "2024-02-14",
        status: "Active"
      }
    ],

    // Diagnostic Reports in PDF and Image format
    diagnosticReports: [
      {
        id: "rep-101",
        title: "High-Resolution Computed Tomography (HRCT) Chest",
        category: "Radiology",
        format: "IMAGE",
        date: "2026-11-09",
        labName: "AIIMS Central Imaging & Diagnostic Center",
        labAddress: "Ansari Nagar, New Delhi - 110029",
        orderingDoctor: "Dr. Priya Nair (AIIMS Emergency Trauma)",
        findings: "Patchy ground-glass opacities in bilateral lower lobes. Bronchial wall thickening in segmental bronchi. No pneumothorax, no mediastinal lymphadenopathy. Correlate with acute infective/inflammatory exacerbation.",
        radiologist: "Dr. Ramanathan Swamy, MD (Radiodiagnosis)",
        fileUrl: "image_ct_chest.jpg",
        imageType: "xray",
        fileSize: "4.8 MB",
        status: "Final Verified"
      },
      {
        id: "rep-102",
        title: "Comprehensive Metabolic & Arterial Blood Gas (ABG) Panel",
        category: "Pathology & Biochemistry",
        format: "PDF",
        date: "2026-11-09",
        labName: "National Accreditation Board for Testing Labs (NABL) Certified AIIMS Lab",
        labAddress: "Ground Floor, Trauma Center, Ring Road, New Delhi",
        orderingDoctor: "Dr. Priya Nair",
        findings: "pH: 7.34 (Slight acidosis), pCO2: 46 mmHg (mild retention), pO2: 68 mmHg (hypoxemia), HCO3: 24 mEq/L, Lactate: 1.8 mmol/L. Hb: 13.8 g/dL, Total Leukocyte Count: 12,400 /mcL with neutrophilia (78%). CRP: 48 mg/L (Elevated).",
        radiologist: "Dr. Suniti Singhal, MD (Biochemistry)",
        fileUrl: "report_abg_panel.pdf",
        fileSize: "1.2 MB",
        status: "Final Verified"
      },
      {
        id: "rep-103",
        title: "Standard 12-Lead Electrocardiogram (ECG)",
        category: "Cardiology",
        format: "IMAGE",
        date: "2026-11-09",
        labName: "AIIMS Emergency Cardiology Unit",
        labAddress: "Ansari Nagar, New Delhi",
        orderingDoctor: "Dr. Priya Nair",
        findings: "Sinus tachycardia, Heart rate 108 bpm. Normal PR interval (140ms), QRS duration 88ms. No acute ST-elevation or T-wave inversion. P-pulmonale noted in Lead II consistent with right atrial strain.",
        radiologist: "Dr. Vivek Mehra (Consultant Cardiologist)",
        fileUrl: "ecg_trace_12lead.png",
        imageType: "ecg",
        fileSize: "2.1 MB",
        status: "Final Verified"
      },
      {
        id: "rep-104",
        title: "Glycated Hemoglobin (HbA1c) & Lipid Profile",
        category: "Biochemistry",
        format: "PDF",
        date: "2026-08-14",
        labName: "Dr. Lal PathLabs Central Reference Lab",
        labAddress: "Block E, Sector 18, Noida, Uttar Pradesh - 201301",
        orderingDoctor: "Dr. Reena Sen (Fortis)",
        findings: "HbA1c: 6.9% (Fair glycemic control). Fasting Blood Glucose: 118 mg/dL. Total Cholesterol: 188 mg/dL, Triglycerides: 164 mg/dL, HDL: 42 mg/dL, LDL: 113 mg/dL.",
        radiologist: "Dr. Vandana Lal, MD (Pathology)",
        fileUrl: "lipid_hba1c_aug2026.pdf",
        fileSize: "850 KB",
        status: "Final Verified"
      }
    ],

    // Past Doctor Consultations & Visits
    doctorVisits: [
      {
        id: "vis-101",
        visitDate: "2026-11-09",
        doctorName: "Dr. Priya Nair",
        doctorQualification: "MBBS, MD (Emergency Medicine)",
        doctorRegNo: "MCI-2012-88219",
        specialty: "Emergency Medicine & Trauma Critical Care",
        hospitalName: "AIIMS New Delhi Emergency Trauma Center",
        hospitalAddress: "Ansari Nagar East, Ring Road, New Delhi - 110029",
        chiefComplaints: "Sudden onset severe breathlessness since 4 hours, wheezing, unable to speak full sentences, productive cough.",
        vitals: {
          bp: "142/92 mmHg",
          pulse: "114 bpm",
          temp: "99.4 °F",
          spo2: "89% on room air",
          respRate: "28 /min"
        },
        clinicalExamination: "Marked respiratory distress, intercostal retractions, bilateral diffuse wheezing on auscultation, no pedal edema.",
        diagnosis: "Acute Severe Bronchospasm with Asthmatic Exacerbation & Hypoxemia",
        treatmentDetails: "Nebulized with Levosalbutamol + Ipratropium bromide. IV Hydrocortisone 100mg given stat. Supplemental O2 via venturi mask @ 4 L/min.",
        prescriptions: [
          { drug: "Inj. Hydrocortisone 100mg IV", dosage: "Stat and Q8H", duration: "2 days", instructions: "Slow IV push" },
          { drug: "Neb. Duolin (Levosalbutamol + Ipratropium)", dosage: "1 respule every 4 hours", duration: "3 days", instructions: "Via oxygen nebulizer" },
          { drug: "Tab. Azithromycin 500mg", dosage: "1 tab once daily", duration: "5 days", instructions: "Post-prandial" }
        ],
        followUpAdvice: "Admitted to Acute Observation Stepdown Bed for continuous SpO2 and arterial blood gas monitoring."
      },
      {
        id: "vis-102",
        visitDate: "2025-10-14",
        doctorName: "Dr. Arvind Mehta",
        doctorQualification: "MBBS, MD, DM (Pulmonology)",
        doctorRegNo: "DMC-2008-44210",
        specialty: "Pulmonology & Respiratory Medicine",
        hospitalName: "Max Super Speciality Hospital, Saket",
        hospitalAddress: "1, 2, Press Enclave Marg, Saket, New Delhi - 110017",
        chiefComplaints: "High grade fever (102°F) with chills for 4 days, chest tightness on right side.",
        vitals: {
          bp: "130/84 mmHg",
          pulse: "98 bpm",
          temp: "102.1 °F",
          spo2: "92% on room air",
          respRate: "24 /min"
        },
        clinicalExamination: "Right lower zone coarse crackles and bronchial breath sounds. Note: Patient has documented severe Penicillin allergy—Penicillin derivatives strictly avoided.",
        diagnosis: "Right Middle/Lower Lobe Community Acquired Viral Bronchopneumonia",
        treatmentDetails: "IV Hydration, antipyretics (non-NSAID - Paracetamol IV), Bronchodilator nebulization. Inpatient admission under PM-JAY Cashless.",
        prescriptions: [
          { drug: "Inj. Paracetamol 1000mg IV", dosage: "TDS SOS for fever > 100°F", duration: "3 days", instructions: "IV Infusion over 15 mins" },
          { drug: "Tab. Doxycycline 100mg", dosage: "1 tab twice daily", duration: "7 days", instructions: "Safe non-penicillin antimicrobial" },
          { drug: "Inhaler Formoterol + Budesonide", dosage: "2 puffs twice daily", duration: "30 days", instructions: "Rinse mouth after inhalation" }
        ],
        followUpAdvice: "Review after 5 days with repeat CRP and Chest X-Ray. Avoid dust and cold beverages."
      }
    ],

    // Inpatient Hospitalization with Daily Observation Logs
    hospitalizations: [
      {
        id: "ipd-101",
        status: "Currently Hospitalized (Under Observation)",
        admissionDate: "2026-11-09",
        dischargeDate: "Active Admission",
        wardBed: "Emergency Observation Ward - Bed 04B",
        admittingHospital: "AIIMS New Delhi Emergency Trauma Center",
        hospitalAddress: "Ansari Nagar East, New Delhi - 110029",
        attendingDoctor: "Dr. Priya Nair, MD (Emergency Medicine)",
        admissionDiagnosis: "Acute Severe Bronchospasm & Respiratory Distress (Hypoxemia SpO2 89%)",
        cashlessAuthorization: "PM-JAY Pre-Auth Approved (Ref: AIIMS-PMJ-2026-99120)",
        dailyObservationLogs: [
          {
            logId: "round-1",
            dayNumber: 1,
            date: "2026-11-09",
            roundTime: "Morning Admission Round (10:30 AM)",
            attendingDoctor: "Dr. Priya Nair, MD",
            shift: "Morning Clinical Round",
            vitals: {
              bp: "140/90 mmHg",
              pulse: "112 bpm",
              spo2: "90% (on 4L O2)",
              temp: "99.2 °F",
              respRate: "26 /min",
              bloodSugar: "138 mg/dL",
              urineOutput: "450 ml / 6 hrs"
            },
            clinicalStatus: "Guarded / Critical Monitoring",
            progressNotes: "Patient admitted from triage in acute bronchospasm. Wheezing audible bilaterally. Supplemental O2 started via venturi mask @ 4L/min. Arterial blood gas ordered. Patient keeping calm, no cyanosis.",
            medicationsGiven: "Nebulization with Duolin (Levosalbutamol + Ipratropium) given immediately. IV Hydrocortisone 100mg administered.",
            investigationsOrdered: "HRCT Chest, ABG, Routine Blood Panel (CBC, Electrolytes, Serum Creatinine).",
            dietAndFluids: "Keep NPO for 2 hours, then clear liquid sips as tolerated. IV Normal Saline @ 75 ml/hr."
          },
          {
            logId: "round-2",
            dayNumber: 1,
            date: "2026-11-09",
            roundTime: "Evening Review Round (06:30 PM)",
            attendingDoctor: "Dr. Sandeep Rawat (Senior Resident)",
            shift: "Evening Round",
            vitals: {
              bp: "132/84 mmHg",
              pulse: "96 bpm",
              spo2: "95% (on 2L O2)",
              temp: "98.6 °F",
              respRate: "22 /min",
              bloodSugar: "126 mg/dL",
              urineOutput: "1100 ml / 14 hrs"
            },
            clinicalStatus: "Stabilizing",
            progressNotes: "Respiratory distress substantially reduced. Patient speaking comfortably in complete sentences. Wheezing significantly milder. ABG shows resolving acidosis (pH 7.37).",
            medicationsGiven: "Duolin nebulization repeated Q6H. Second dose of IV Hydrocortisone given.",
            investigationsOrdered: "Repeat morning fasting blood sugar and pre-prandial glucose.",
            dietAndFluids: "Soft diabetic bland diet permitted. Oral hydration encouraged."
          },
          {
            logId: "round-3",
            dayNumber: 2,
            date: "2026-11-10",
            roundTime: "Morning Consultant Round (09:15 AM)",
            attendingDoctor: "Dr. Priya Nair, MD",
            shift: "Consultant Morning Round",
            vitals: {
              bp: "126/80 mmHg",
              pulse: "82 bpm",
              spo2: "96% (Room Air Trial)",
              temp: "98.4 °F",
              respRate: "18 /min",
              bloodSugar: "114 mg/dL",
              urineOutput: "Normal & Adequate"
            },
            clinicalStatus: "Improving / Clinically Stable",
            progressNotes: "Successfully tolerating room air trial without desaturation for 2 hours. Auscultation reveals clear breath sounds with trace rhonchi at bases. Tolerating oral diet well.",
            medicationsGiven: "Transitioned from IV steroids to oral Prednisolone 20mg tapering course. Inhaler technique verified with nursing staff.",
            investigationsOrdered: "Pre-discharge Spirometry / Peak Flow Rate testing.",
            dietAndFluids: "Regular diabetic diet. IV line capped for emergency access."
          }
        ]
      }
    ],

    hospitalHistory: [
      {
        id: "hist-1",
        hospitalName: "Apollo Hospital, Delhi",
        admissionDate: "2025-10-14",
        dischargeDate: "2025-10-18",
        diagnosis: "Community Acquired Viral Pneumonia with hypoxemia",
        treatingDoctor: "Dr. K. Swaminathan (Pulmonology)",
        cashlessProcessedUnder: "PM-JAY Cashless (Claim Ref: PMJ-77219)"
      }
    ]
  },
  {
    id: "vt-user-1002",
    vitalTraceId: "VT-IND-4019-3829-1092",
    fullName: "Aarav Rajesh Sharma",
    dob: "2018-09-22",
    gender: "Male",
    bloodGroup: "B+",
    phone: "+91 98765 43210",
    email: "rajesh.sharma@example.com",
    address: "Flat 402, Green Meadows, Sector 62, Noida, Uttar Pradesh - 201309",
    aadhaarNumber: "9102 3847 2209",
    isAadhaarVerified: true,
    isMinor: true,
    emergencyContact: {
      name: "Rajesh Kumar Sharma",
      relation: "Father",
      phone: "+91 98765 43210"
    },
    guardianDetails: {
      guardianName: "Rajesh Kumar Sharma",
      relation: "Father",
      guardianAadhaar: "7849 2201 9934",
      guardianAadhaarVerified: true,
      guardianPhone: "+91 98765 43210",
      guardianEmail: "rajesh.sharma@example.com",
      guardianVitalTraceId: "VT-IND-8924-1102-7749",
      consentSigned: true,
      consentDate: "2025-01-10",
      consentScope: "Emergency cashless hospital admission, invasive procedure authorization & universal medical history disclosure across empanelled healthcare providers."
    },
    govtSchemes: [
      {
        id: "sch-minor-1",
        category: "Central",
        schemeName: "Ayushman Bharat - PM-JAY (Dependent Child Cover)",
        beneficiaryId: "PMJAY-UP-98421092-D01",
        state: "Uttar Pradesh",
        familyHeadName: "Rajesh Kumar Sharma (Father)",
        cashlessCoverageLimit: 500000,
        availableBalance: 500000,
        status: "Active & Verified",
        empanelledHospitalsCount: 28400,
        cardIssuedDate: "2021-03-15",
        lastCashlessClaim: "None"
      }
    ],
    mediclaimPolicies: [
      {
        id: "med-minor-1",
        policyType: "Organizational / Corporate Mediclaim (Child Dependent)",
        employerName: "TechNova Solutions India Pvt Ltd",
        employeeId: "TN-94021",
        insuranceCompany: "Star Health & Allied Insurance Co Ltd",
        tpaName: "Medi Assist Healthcare TPA",
        policyNumber: "CORP-STAR-2026-90432-DEP01",
        tpaMemberId: "MEDIASST-TN-882194-C1",
        sumInsured: 1000000,
        cashlessBalanceAvailable: 920000,
        validFrom: "2026-01-01",
        validTill: "2026-12-31",
        cashlessDeskHelpline: "1800-425-2255",
        status: "Active Cashless Approved",
        coPay: "0%",
        roomRentCap: "No Capping"
      }
    ],
    allergies: [
      {
        id: "all-minor-1",
        substance: "Cephalosporins (Cefixime, Ceftriaxone)",
        severity: "HIGH ALERT (Severe)",
        reaction: "Severe wheezing, generalized hives and periorbital edema",
        diagnosedBy: "Dr. Alok Verma (Apollo Children's Hospital)",
        dateRecorded: "2023-11-04"
      },
      {
        id: "all-minor-2",
        substance: "Peanut / Nut extracts",
        severity: "Critical",
        reaction: "Anaphylactic shock risk (EpiPen prescribed)",
        diagnosedBy: "Dr. Sangeeta Rao (Fortis Memorial Research Institute)",
        dateRecorded: "2021-05-19"
      }
    ],
    medications: [
      {
        id: "med-minor-reg-1",
        medicineName: "Montelukast 4mg Chewable",
        dosage: "1 tab daily at bedtime",
        condition: "Pediatric Allergic Bronchitis",
        prescribedHospital: "Apollo Children's Hospital",
        doctorName: "Dr. Ananya Sen",
        startDate: "2025-08-01",
        status: "Active"
      }
    ],
    diagnosticReports: [
      {
        id: "rep-201",
        title: "Pediatric Chest X-Ray (AP View)",
        category: "Radiology",
        format: "IMAGE",
        date: "2025-08-01",
        labName: "Apollo Children's Imaging Services",
        labAddress: "Sector 26, Noida, UP",
        orderingDoctor: "Dr. Ananya Sen",
        findings: "Bilateral lung fields show mild peribronchial thickening. No focal consolidation, no pleural effusion. Cardiac shadow normal in size and contour.",
        radiologist: "Dr. K. L. Narang, MD",
        fileUrl: "pediatric_chest_xray.png",
        imageType: "xray",
        fileSize: "2.8 MB",
        status: "Final Verified"
      },
      {
        id: "rep-202",
        title: "Serum Total IgE & Allergen Sensitivity Profile",
        category: "Pathology",
        format: "PDF",
        date: "2025-08-02",
        labName: "Max Lab Special Diagnostics",
        labAddress: "Sector 19, Noida",
        orderingDoctor: "Dr. Ananya Sen",
        findings: "Total Serum IgE: 420 IU/mL (Significantly elevated for age). Positive specific IgE to peanut extracts (Class 4 high sensitivity). Cephalosporin allergy confirmed by prior challenge documentation.",
        radiologist: "Dr. Meenakshi Sundaram",
        fileUrl: "allergy_ige_panel.pdf",
        fileSize: "920 KB",
        status: "Final Verified"
      }
    ],
    doctorVisits: [
      {
        id: "vis-201",
        visitDate: "2025-08-01",
        doctorName: "Dr. Ananya Sen",
        doctorQualification: "MBBS, MD (Pediatrics)",
        doctorRegNo: "UPMC-2015-77821",
        specialty: "Pediatric Critical Care & General Pediatrics",
        hospitalName: "Apollo Children's Hospital, Noida",
        hospitalAddress: "E-2, Sector 26, Gautam Buddha Nagar, Noida, UP - 201301",
        chiefComplaints: "Nocturnal cough and wheezing for past 2 weeks, exacerbated by cold weather.",
        vitals: {
          bp: "100/64 mmHg",
          pulse: "92 bpm",
          temp: "98.6 °F",
          spo2: "97% on room air",
          respRate: "20 /min"
        },
        clinicalExamination: "Child is active, mild bilateral expiratory rhonchi, ENT examination showed allergic rhinitis with pale nasal mucosa.",
        diagnosis: "Pediatric Allergic Bronchitis & Allergic Rhinitis",
        treatmentDetails: "Montelukast chewable tablets started, saline nasal spray advised. Parent educated on peanut and cephalosporin avoidance.",
        prescriptions: [
          { drug: "Tab. Montelukast 4mg Chewable", dosage: "1 tab daily at bedtime", duration: "60 days", instructions: "Chew before swallowing" },
          { drug: "Saline Nasal Drops", dosage: "2 drops in each nostril BD", duration: "14 days", instructions: "Before feeding/bedtime" }
        ],
        followUpAdvice: "Review after 4 weeks. Keep emergency EpiPen accessible at school and home."
      }
    ],
    hospitalizations: [],
    hospitalHistory: [
      {
        id: "hist-minor-1",
        hospitalName: "Apollo Children's Hospital, Noida",
        admissionDate: "2024-03-12",
        dischargeDate: "2024-03-14",
        diagnosis: "Acute Bronchiolitis with severe wheezing",
        treatingDoctor: "Dr. Ananya Sen",
        cashlessProcessedUnder: "Star Health Corporate Child Dependent (Ref: SH-PED-9912)"
      }
    ]
  }
];

export const POPULAR_GOVT_SCHEMES = [
  { name: "Ayushman Bharat - PM-JAY", category: "Central", maxCoverage: 500000, state: "Pan-India" },
  { name: "CGHS (Central Government Health Scheme)", category: "Central", maxCoverage: "Comprehensive Cashless", state: "Pan-India" },
  { name: "ESIC (Employees' State Insurance Corporation)", category: "Central", maxCoverage: "Full Cashless", state: "Pan-India" },
  { name: "ECHS (Ex-Servicemen Contributory Health Scheme)", category: "Central", maxCoverage: "Full Cashless", state: "Pan-India" },
  { name: "RGHS / Mukhyamantri Ayushman Arogya (Chiranjeevi)", category: "State", maxCoverage: 2500000, state: "Rajasthan" },
  { name: "Dr. YSR Aarogyasri Scheme", category: "State", maxCoverage: 500000, state: "Andhra Pradesh / Telangana" },
  { name: "MJPJAY (Mahatma Jyotirao Phule Jan Arogya Yojana)", category: "State", maxCoverage: 500000, state: "Maharashtra" },
  { name: "CMCHIS (Chief Minister Comprehensive Health Insurance)", category: "State", maxCoverage: 500000, state: "Tamil Nadu" },
  { name: "Swasthya Sathi Scheme", category: "State", maxCoverage: 500000, state: "West Bengal" },
  { name: "Arogya Karnataka (Ayushman Bharat)", category: "State", maxCoverage: 500000, state: "Karnataka" },
  { name: "Karunya Arogya Suraksha Padhathi (KASP)", category: "State", maxCoverage: 500000, state: "Kerala" }
];

export const COMMON_TPAS = [
  "Medi Assist Healthcare TPA",
  "Vidal Health TPA",
  "Paramount Health Services TPA",
  "Heritage Health Insurance TPA",
  "MDIndia Health Insurance TPA",
  "Raksha Health Insurance TPA",
  "In-House Cashless Desk (Direct Insurer)"
];

export const POPULAR_INSURERS = [
  "Star Health & Allied Insurance Co Ltd",
  "HDFC ERGO General Insurance",
  "ICICI Lombard General Insurance",
  "Care Health Insurance (Religare)",
  "Niva Bupa Health Insurance (Max Bupa)",
  "Bajaj Allianz General Insurance",
  "Tata AIG General Insurance",
  "The New India Assurance Co Ltd",
  "United India Insurance Co Ltd",
  "National Insurance Co Ltd"
];
