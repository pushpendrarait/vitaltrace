// Patient Core Microservice
// Implements Longitudinal Health Record aggregation & Profile Management
import { firestoreService } from '../db/firestoreService.js';
import { COLLECTIONS } from '../db/schema.js';

export const patientService = {
  /**
   * Get patient profile by UHID
   */
  async getPatientByUhid(uhid) {
    const patient = await firestoreService.get(COLLECTIONS.USERS, uhid);
    if (!patient) return null;

    // Fetch related records to present unified longitudinal overview
    const visits = await firestoreService.list(COLLECTIONS.MEDICAL_RECORDS, r => r.uhid === uhid && r.type === 'consultation_visit');
    const reports = await firestoreService.list(COLLECTIONS.MEDICAL_RECORDS, r => r.uhid === uhid && r.type === 'diagnostic_report');
    const hospitalizations = await firestoreService.list(COLLECTIONS.HOSPITALIZATIONS, h => h.uhid === uhid);
    const testOrders = await firestoreService.list(COLLECTIONS.DIAGNOSTIC_ORDERS, o => o.uhid === uhid);
    const consents = await firestoreService.list(COLLECTIONS.CONSENT_LOGS, c => c.uhid === uhid);

    return {
      ...patient,
      doctorVisits: visits.sort((a, b) => new Date(b.created_at || b.visitDate) - new Date(a.created_at || a.visitDate)),
      diagnosticReports: reports.sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date)),
      hospitalizations: hospitalizations.sort((a, b) => new Date(b.created_at || b.admissionDate) - new Date(a.created_at || a.admissionDate)),
      pendingTestOrders: testOrders,
      consentLogs: consents
    };
  },

  /**
   * Search patient by Aadhaar, Phone, or Name
   */
  async searchPatient(query) {
    if (!query) return [];
    const q = query.toLowerCase().trim();
    const cleanDigits = query.replace(/\D/g, '');

    return firestoreService.list(COLLECTIONS.USERS, user => {
      const matchName = user.fullName && user.fullName.toLowerCase().includes(q);
      const matchUhid = user.vitalTraceId && user.vitalTraceId.toLowerCase().includes(q);
      const matchAadhaar = user.aadhaarNumber && user.aadhaarNumber.replace(/\D/g, '').includes(cleanDigits);
      const matchPhone = user.contactPhone && user.contactPhone.includes(cleanDigits);
      return matchName || matchUhid || (cleanDigits.length >= 4 && (matchAadhaar || matchPhone));
    });
  },

  /**
   * Update Patient Profile
   */
  async updatePatient(uhid, updateData) {
    const existing = await firestoreService.get(COLLECTIONS.USERS, uhid);
    if (!existing) {
      const err = new Error(`Patient with UHID ${uhid} not found`);
      err.status = 404;
      throw err;
    }

    // Do not allow mutation of immutable identifiers
    const safeUpdate = { ...updateData };
    delete safeUpdate.vitalTraceId;
    delete safeUpdate.aadhaarNumber;
    delete safeUpdate.created_at;

    const updated = await firestoreService.update(COLLECTIONS.USERS, uhid, safeUpdate);
    return updated;
  },

  /**
   * Update Health Insurance / Government Schemes
   */
  async updateInsuranceSchemes(uhid, { stateScheme, centralScheme, privateMediclaim }) {
    const partial = {};
    if (stateScheme !== undefined) partial.stateScheme = stateScheme;
    if (centralScheme !== undefined) partial.centralScheme = centralScheme;
    if (privateMediclaim !== undefined) partial.privateMediclaim = privateMediclaim;

    return firestoreService.update(COLLECTIONS.USERS, uhid, partial);
  },

  /**
   * List all registered patients
   */
  async listPatients(limit = 50) {
    const all = await firestoreService.list(COLLECTIONS.USERS);
    return all.slice(0, limit);
  }
};

