// Database Schema & Data Models for VitalTrace National Health Exchange
// Compliant with HL7 FHIR Release 4, LOINC, SNOMED CT, and India DPDP Act 2023

export const COLLECTIONS = {
  USERS: 'users',
  FACILITIES: 'facilities',
  MEDICAL_RECORDS: 'medical_records',
  CONSENT_LOGS: 'consent_logs',
  DIAGNOSTIC_ORDERS: 'diagnostic_orders',
  HOSPITALIZATIONS: 'hospitalizations'
};

/**
 * Validates a user profile against the schema
 */
export function validateUserProfile(data) {
  const errors = [];
  if (!data.fullName || typeof data.fullName !== 'string') errors.push('fullName is required');
  if (!data.dob) errors.push('dob (Date of Birth) is required');
  if (!data.aadhaarNumber || !/^\d{4}\s\d{4}\s\d{4}$/.test(data.aadhaarNumber.trim())) {
    errors.push('aadhaarNumber must be a valid 12-digit formatted number (XXXX XXXX XXXX)');
  }
  if (data.isMinor && (!data.guardianDetails || !data.guardianDetails.guardianName)) {
    errors.push('guardianDetails are mandatory for minor profiles (< 18 years)');
  }
  return { isValid: errors.length === 0, errors };
}

/**
 * Validates a clinical consultation / visit record
 */
export function validateClinicalRecord(data) {
  const errors = [];
  if (!data.uhid) errors.push('uhid is required to partition medical record');
  if (!data.doctorName) errors.push('doctorName is required');
  if (!data.diagnosis) errors.push('diagnosis is required (mapped to ICD-10 / SNOMED CT)');
  return { isValid: errors.length === 0, errors };
}

/**
 * Validates a break-glass emergency override request
 */
export function validateBreakGlassRequest(data) {
  const errors = [];
  if (!data.uhid) errors.push('uhid is required');
  if (!data.doctorName || !data.doctorReg) errors.push('attending doctor identity & registration number are required');
  if (!data.clinicalJustification || data.clinicalJustification.trim().length < 15) {
    errors.push('A comprehensive clinical emergency justification (min 15 chars) is legally required under the DPDP Act 2023');
  }
  return { isValid: errors.length === 0, errors };
}

