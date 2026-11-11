// Initial pre-loaded profiles showcasing adult corporate + PM-JAY holder and minor dependent
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
    // Minor / Guardian Details
    guardianDetails: null,
    // Clinical Interoperable Data
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
    hospitalHistory: [
      {
        id: "hist-1",
        hospitalName: "Apollo Hospital, Delhi",
        admissionDate: "2025-10-14",
        dischargeDate: "2025-10-18",
        diagnosis: "Community Acquired Viral Pneumonia with hypoxemia",
        treatingDoctor: "Dr. K. Swaminathan (Pulmonology)",
        cashlessProcessedUnder: "PM-JAY Cashless (Claim Ref: PMJ-77219)"
      },
      {
        id: "hist-2",
        hospitalName: "Max Super Speciality, Patparganj",
        admissionDate: "2023-05-02",
        dischargeDate: "2023-05-04",
        diagnosis: "Acute Gastroenteritis & Dehydration",
        treatingDoctor: "Dr. Neha Taneja",
        cashlessProcessedUnder: "Star Health Corporate (Claim Ref: SH-88219)"
      }
    ]
  },
  {
    id: "vt-user-1002",
    vitalTraceId: "VT-IND-4019-3829-1092",
    fullName: "Aarav Rajesh Sharma",
    dob: "2018-09-22", // 8 years old - Minor
    gender: "Male",
    bloodGroup: "B+",
    phone: "+91 98765 43210", // Primary parent phone
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
    // Minor Parent / Guardian Details
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
        doctorName: "Dr. Alok Verma",
        startDate: "2025-08-01",
        status: "Active"
      }
    ],
    hospitalHistory: [
      {
        id: "hist-minor-1",
        hospitalName: "Apollo Children's Hospital, Noida",
        admissionDate: "2024-03-12",
        dischargeDate: "2024-03-14",
        diagnosis: "Acute Bronchiolitis with severe wheezing",
        treatingDoctor: "Dr. Alok Verma",
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
