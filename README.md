# VitalTrace (राष्ट्रीय स्वास्थ्य अंतर-संचालनीयता प्रणाली)

> **Universal Interoperable Emergency Health Ledger & Cashless Insurance Gateway**

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev)
[![ABHA-Compliant](https://img.shields.io/badge/ABHA-Interoperable-emerald.svg)](https://abdm.gov.in)
[![UIDAI-Linked](https://img.shields.io/badge/UIDAI-Aadhaar%20Verified-orange.svg)](https://uidai.gov.in)

---

## 📌 Problem Statement
Doctors treating patients in emergencies or follow-up visits across different hospitals cannot access consolidated medical histories, previous prescriptions, drug allergy information, or ongoing medication regimens because health records remain fragmented across individual hospital silos with no interoperable national health database system.

---

## 💡 Solution: VitalTrace
**VitalTrace** bridges hospitals, emergency response trauma centers, central/state healthcare schemes, and corporate health insurance TPAs into a single unified clinical ledger.

### 🌟 Key Capabilities

1. **Unique Identity via UIDAI Aadhaar Linking**:
   - Strictly enforces uniqueness across citizens.
   - Built-in interactive UIDAI e-KYC & OTP verification simulation.
   - Generates standardized National VitalTrace Health IDs (ABHA-compatible `VT-IND-XXXX-XXXX-XXXX`).

2. **Central & State Health Schemes (Instant Cashless Processing)**:
   - **Central Schemes**: Ayushman Bharat (PM-JAY) ₹5 Lakh cover, CGHS, ESIC, and ECHS.
   - **State Schemes**: Rajasthan RGHS & Chiranjeevi, Andhra/Telangana Aarogyasri, Maharashtra MJPJAY, Tamil Nadu CMCHIS, West Bengal Swasthya Sathi, Karnataka Arogya, and Kerala KASP.
   - Real-time cashless balance tracking, empanelled hospital network verification, and automated cashless pre-authorization token generation.

3. **Private & Organizational Mediclaim Management**:
   - Corporate / Group Health Insurance (with employer credentials & employee ID tracking).
   - Private Individual & Family Floater policies.
   - Third-Party Administrator (TPA) integration: Medi Assist, Vidal Health, Star Health, ICICI Lombard, HDFC ERGO, etc.
   - 24x7 hospital cashless desk helpline reference and room rent/co-pay rules.

4. **Minor Protection & Parent / Guardian Legal Linking**:
   - Automatic minor detection when age < 18 years.
   - Verified parent/guardian Aadhaar linkage.
   - Digital emergency power of attorney and legal consent for invasive procedures and cashless claim settlement.

5. **Interoperable Emergency Room (ER) Doctor HUD**:
   - **🚨 High-Alert Drug Allergies**: Prominent contraindication warnings (e.g. Penicillin, Sulfa, NSAIDs, Cephalosporins) to prevent fatal medication errors.
   - **💊 Cross-Hospital Medication Regimens**: Prevents accidental overdose or drug-drug interactions.
   - **⚡ 1-Click Cashless Admission Approval**: Eliminates delays in emergency treatment while waiting for financial clearances.
   - **👨‍⚕️ Emergency Clinical Broadcasting**: Attending doctors can add instant clinical notes and emergency prescriptions synced across all national nodes.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Run
```bash
# Clone the repository
git clone https://github.com/pushpendrarait/vitaltrace.git
cd vitaltrace

# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```

---

## 🔒 Security & Compliance
- Compliant with National Digital Health Mission (NDHM) guidelines.
- Aadhaar number masking for privacy protection.
- Emergency consent logging compliant with the IT Act 2000.
