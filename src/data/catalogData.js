// Master Drug Database with Branded to Generic Mapping, LOINC Diagnostic Catalog, and Local Lab Pricing

export const MASTER_DRUG_DATABASE = [
  {
    id: "drug-1",
    brandName: "Augmentin 625 Duo",
    genericName: "Amoxicillin (500mg) + Clavulanic Acid (125mg)",
    manufacturer: "GlaxoSmithKline Pharmaceuticals",
    brandPrice: 224,
    genericAlternative: {
      name: "Generic Amoxyclav 625 (Jan Aushadhi / PMBI)",
      price: 58,
      savingsPercent: 74
    },
    defaultFrequency: "1-0-1",
    defaultDuration: "5 days",
    intakeInstruction: "Post-meal",
    route: "Oral",
    therapeuticCategory: "Antibiotic (Broad Spectrum)",
    isContraindicatedWithPenicillinAllergy: true
  },
  {
    id: "drug-2",
    brandName: "Pan-D Capsule",
    genericName: "Pantoprazole (40mg) + Domperidone (30mg SR)",
    manufacturer: "Alkem Laboratories",
    brandPrice: 198,
    genericAlternative: {
      name: "Generic Panto-D SR (Jan Aushadhi)",
      price: 45,
      savingsPercent: 77
    },
    defaultFrequency: "1-0-0",
    defaultDuration: "14 days",
    intakeInstruction: "Pre-meal (30 mins before breakfast)",
    route: "Oral",
    therapeuticCategory: "Gastro-resistant Antacid & Antiemetic",
    isContraindicatedWithPenicillinAllergy: false
  },
  {
    id: "drug-3",
    brandName: "Lipitor 20mg / Atorva 20",
    genericName: "Atorvastatin (20mg)",
    manufacturer: "Pfizer / Zydus",
    brandPrice: 285,
    genericAlternative: {
      name: "Generic Atorvastatin 20mg (Jan Aushadhi)",
      price: 35,
      savingsPercent: 88
    },
    defaultFrequency: "0-0-1",
    defaultDuration: "30 days",
    intakeInstruction: "Post-meal (At bedtime)",
    route: "Oral",
    therapeuticCategory: "Lipid Lowering Statin",
    isContraindicatedWithPenicillinAllergy: false
  },
  {
    id: "drug-4",
    brandName: "Glycomet-GP 1 Forte",
    genericName: "Metformin (1000mg SR) + Glimepiride (1mg)",
    manufacturer: "USV Ltd",
    brandPrice: 165,
    genericAlternative: {
      name: "Generic Metformin + Glimepiride 1/1000",
      price: 42,
      savingsPercent: 75
    },
    defaultFrequency: "1-0-1",
    defaultDuration: "30 days",
    intakeInstruction: "With meal (Breakfast & Dinner)",
    route: "Oral",
    therapeuticCategory: "Anti-Diabetic",
    isContraindicatedWithPenicillinAllergy: false
  },
  {
    id: "drug-5",
    brandName: "Telma-40",
    genericName: "Telmisartan (40mg)",
    manufacturer: "Glenmark Pharmaceuticals",
    brandPrice: 142,
    genericAlternative: {
      name: "Generic Telmisartan 40mg (PMBI)",
      price: 28,
      savingsPercent: 80
    },
    defaultFrequency: "1-0-0",
    defaultDuration: "30 days",
    intakeInstruction: "Post-meal (Morning)",
    route: "Oral",
    therapeuticCategory: "Antihypertensive ARB",
    isContraindicatedWithPenicillinAllergy: false
  },
  {
    id: "drug-6",
    brandName: "Dolo 650 / Calpol 650",
    genericName: "Paracetamol (650mg)",
    manufacturer: "Micro Labs",
    brandPrice: 34,
    genericAlternative: {
      name: "Generic Paracetamol 650mg",
      price: 12,
      savingsPercent: 65
    },
    defaultFrequency: "SOS (Max 1-1-1)",
    defaultDuration: "3 days",
    intakeInstruction: "Post-meal (When fever > 100°F)",
    route: "Oral",
    therapeuticCategory: "Antipyretic & Analgesic",
    isContraindicatedWithPenicillinAllergy: false
  },
  {
    id: "drug-7",
    brandName: "Montair-LC / Telekast-L",
    genericName: "Montelukast (10mg) + Levocetirizine (5mg)",
    manufacturer: "Cipla Ltd / Lupin",
    brandPrice: 210,
    genericAlternative: {
      name: "Generic Montelukast-Levocetirizine (Jan Aushadhi)",
      price: 48,
      savingsPercent: 77
    },
    defaultFrequency: "0-0-1",
    defaultDuration: "10 days",
    intakeInstruction: "Post-meal (Night bedtime)",
    route: "Oral",
    therapeuticCategory: "Anti-allergic & Bronchial Antagonist",
    isContraindicatedWithPenicillinAllergy: false
  },
  {
    id: "drug-8",
    brandName: "Voveran-SR 100 / Combiflam",
    genericName: "Diclofenac Sodium (100mg SR)",
    manufacturer: "Novartis",
    brandPrice: 180,
    genericAlternative: {
      name: "Generic Diclofenac Sodium SR 100mg",
      price: 32,
      savingsPercent: 82
    },
    defaultFrequency: "0-0-1",
    defaultDuration: "3 days",
    intakeInstruction: "Post-meal (Never on empty stomach)",
    route: "Oral",
    therapeuticCategory: "NSAID Analgesic",
    isContraindicatedWithNsaidAllergy: true
  }
];

export const DIAGNOSTIC_TEST_CATALOG = [
  {
    id: "test-1",
    code: "LOINC: 58410-2",
    testName: "Complete Blood Count (CBC) with ESR & Platelets",
    category: "Pathology / Hematology",
    specimen: "Whole Blood (EDTA)",
    preparation: "No fasting required",
    suggestedTimeline: "Within 24 hours",
    hyperlocalPricing: [
      { labName: "Dr. Lal PathLabs", price: 450, turnaround: "6 hours", rating: 4.8 },
      { labName: "SRL Diagnostics (Agilus)", price: 420, turnaround: "8 hours", rating: 4.7 },
      { labName: "Metropolis Healthcare", price: 460, turnaround: "6 hours", rating: 4.7 },
      { labName: "Jan Aushadhi / Govt PHC", price: 80, turnaround: "24 hours", rating: 4.4 }
    ],
    minPrice: 80,
    maxPrice: 460
  },
  {
    id: "test-2",
    code: "LOINC: 4548-4",
    testName: "HbA1c (Glycated Hemoglobin) by HPLC Method",
    category: "Biochemistry",
    specimen: "Venous Blood",
    preparation: "No fasting required",
    suggestedTimeline: "Fasting, tomorrow morning",
    hyperlocalPricing: [
      { labName: "Dr. Lal PathLabs", price: 580, turnaround: "8 hours", rating: 4.8 },
      { labName: "Max Lab Special Diagnostics", price: 650, turnaround: "6 hours", rating: 4.9 },
      { labName: "Thyrocare Technologies", price: 380, turnaround: "12 hours", rating: 4.6 },
      { labName: "Jan Aushadhi Center", price: 120, turnaround: "24 hours", rating: 4.3 }
    ],
    minPrice: 120,
    maxPrice: 650
  },
  {
    id: "test-3",
    code: "LOINC: 24331-1",
    testName: "Lipid Profile Comprehensive (Cholesterol, Triglycerides, HDL, LDL)",
    category: "Biochemistry",
    specimen: "Serum",
    preparation: "10-12 hours overnight fasting mandatory",
    suggestedTimeline: "Fasting, tomorrow morning",
    hyperlocalPricing: [
      { labName: "Dr. Lal PathLabs", price: 750, turnaround: "8 hours", rating: 4.8 },
      { labName: "Apollo Diagnostics", price: 720, turnaround: "8 hours", rating: 4.7 },
      { labName: "SRL Diagnostics", price: 700, turnaround: "8 hours", rating: 4.7 },
      { labName: "Govt District Hospital", price: 150, turnaround: "24 hours", rating: 4.2 }
    ],
    minPrice: 150,
    maxPrice: 750
  },
  {
    id: "test-4",
    code: "LOINC: 24627-2",
    testName: "Chest X-Ray PA View (Digital Radiography)",
    category: "Radiology",
    specimen: "Digital Imaging",
    preparation: "Remove metallic objects",
    suggestedTimeline: "Within 24 hours",
    hyperlocalPricing: [
      { labName: "Apollo Clinic Imaging", price: 500, turnaround: "1 hour", rating: 4.8 },
      { labName: "Max Super Speciality Radiology", price: 650, turnaround: "1 hour", rating: 4.9 },
      { labName: "Ganga Diagnostic Centre", price: 350, turnaround: "2 hours", rating: 4.5 },
      { labName: "Government Hospital / AIIMS", price: 50, turnaround: "3 hours", rating: 4.5 }
    ],
    minPrice: 50,
    maxPrice: 650
  },
  {
    id: "test-5",
    code: "LOINC: 883-9",
    testName: "High Resolution CT Scan Chest (HRCT)",
    category: "Radiology",
    specimen: "Computed Tomography",
    preparation: "4 hours fasting if contrast required",
    suggestedTimeline: "Stat Emergency / Within 12 hrs",
    hyperlocalPricing: [
      { labName: "Mahajan Imaging & Labs", price: 4500, turnaround: "3 hours", rating: 4.9 },
      { labName: "Max Healthcare Saket", price: 5200, turnaround: "2 hours", rating: 4.9 },
      { labName: "Star Imaging Delhi", price: 3800, turnaround: "4 hours", rating: 4.6 },
      { labName: "AIIMS / Safdarjung Hospital", price: 800, turnaround: "12 hours", rating: 4.6 }
    ],
    minPrice: 800,
    maxPrice: 5200
  },
  {
    id: "test-6",
    code: "LOINC: 11524-6",
    testName: "12-Lead Electrocardiogram (ECG with Rhythm Strip)",
    category: "Cardiology",
    specimen: "Electrophysiological Trace",
    preparation: "Rest 10 minutes prior",
    suggestedTimeline: "Stat Emergency",
    hyperlocalPricing: [
      { labName: "Apollo Clinic", price: 300, turnaround: "Immediate", rating: 4.8 },
      { labName: "Dr. Lal PathLabs", price: 280, turnaround: "Immediate", rating: 4.7 },
      { labName: "Local Diagnostic Clinic", price: 200, turnaround: "Immediate", rating: 4.5 },
      { labName: "Govt PHC / Dispensary", price: 0, turnaround: "Immediate", rating: 4.3 }
    ],
    minPrice: 0,
    maxPrice: 300
  }
];

export const EMPANELED_PHARMACY_PARTNERS = [
  {
    id: "pharma-1",
    name: "Tata 1mg",
    deliveryTime: "2 to 4 Hours Express Delivery",
    discount: "18% OFF on Prescriptions",
    rating: 4.8,
    logoText: "1mg"
  },
  {
    id: "pharma-2",
    name: "Apollo Pharmacy 24/7",
    deliveryTime: "2 Hours Doorstep Delivery",
    discount: "15% OFF + Free Home Delivery",
    rating: 4.9,
    logoText: "Apollo"
  },
  {
    id: "pharma-3",
    name: "PharmEasy",
    deliveryTime: "Same Day Evening Delivery",
    discount: "20% OFF on Generic Alternatives",
    rating: 4.7,
    logoText: "PharmEasy"
  },
  {
    id: "pharma-4",
    name: "Jan Aushadhi Kendra (Govt Stores)",
    deliveryTime: "Local Store Pickup / Assisted Dispatch",
    discount: "Up to 80% OFF (Generic Subsidy)",
    rating: 4.6,
    logoText: "JanAushadhi"
  }
];

