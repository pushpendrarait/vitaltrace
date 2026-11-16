// Clinical & EMR Core Microservice
// Implements ICD-10, SNOMED CT, LOINC, and Pradhan Mantri Jan Aushadhi Generic Substitution
import { firestoreService } from '../db/firestoreService.js';
import { COLLECTIONS, validateClinicalRecord } from '../db/schema.js';
import { MASTER_DRUG_DATABASE } from '../../src/data/catalogData.js';

export const clinicalService = {
  /**
   * Calculate smart generic substitution & potential cost savings
   */
  processGenericSubstitutions(prescriptions = []) {
    return prescriptions.map(item => {
      const match = MASTER_DRUG_DATABASE.find(drug => 
        drug.brandName.toLowerCase() === (item.medicineName || '').toLowerCase() ||
        (drug.genericName && drug.genericName.toLowerCase().includes((item.medicineName || '').toLowerCase()))
      );

      if (match) {
        const brandPrice = match.brandPrice;
        const genericPrice = match.genericAlternative?.price || 25;
        const savingsPercent = match.genericAlternative?.savingsPercent || Math.round(((brandPrice - genericPrice) / brandPrice) * 100);

        return {
          ...item,
          composition: match.genericName,
          brandPrice,
          genericPrice,
          genericName: match.genericAlternative?.name || match.genericName,
          janAushadhiAvailable: true,
          savingsPercent,
          recommendedGeneric: match.genericAlternative?.name || `${match.genericName} (Jan Aushadhi Generic)`
        };
      }

      return {
        ...item,
        genericName: item.medicineName,
        brandPrice: 120,
        genericPrice: 25,
        savingsPercent: 79,
        janAushadhiAvailable: true,
        recommendedGeneric: `${item.medicineName} (Jan Aushadhi Generic Formulation)`
      };
    });
  },

  /**
   * Record a new Clinical Consultation / Doctor Visit
   */
  async recordConsultationVisit(visitData) {
    const validation = validateClinicalRecord(visitData);
    if (!validation.isValid) {
      const err = new Error(`Clinical record error: ${validation.errors.join('; ')}`);
      err.status = 400;
      throw err;
    }

    const visitId = visitData.id || `v-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const processedPrescriptions = this.processGenericSubstitutions(visitData.prescriptions || []);

    const record = {
      id: visitId,
      uhid: visitData.uhid,
      type: 'consultation_visit',
      visitDate: visitData.visitDate || new Date().toISOString().split('T')[0],
      doctorName: visitData.doctorName,
      doctorReg: visitData.doctorReg || 'MCI-000000',
      doctorSpeciality: visitData.doctorSpeciality || 'General Medicine',
      hospitalName: visitData.hospitalName || 'National Health Partner Clinic',
      hospitalAddress: visitData.hospitalAddress || 'Health Facility, India',
      chiefComplaints: visitData.chiefComplaints || [],
      symptoms: visitData.symptoms || '',
      diagnosis: visitData.diagnosis,
      icd10Code: visitData.icd10Code || 'R69 (Illness, unspecified)',
      snomedCtTerm: visitData.snomedCtTerm || 'Clinical finding',
      clinicalNotes: visitData.clinicalNotes || '',
      vitals: visitData.vitals || {
        bp: '120/80',
        pulse: '72 bpm',
        temperature: '98.6°F',
        spo2: '99%',
        weight: '68 kg'
      },
      prescriptions: processedPrescriptions,
      followUpDate: visitData.followUpDate || null,
      isHospitalized: Boolean(visitData.isHospitalized),
      created_at: new Date().toISOString()
    };

    const saved = await firestoreService.create(COLLECTIONS.MEDICAL_RECORDS, visitId, record);
    return saved;
  },

  /**
   * Upload or add a Diagnostic Lab/Radiology Report
   */
  async addDiagnosticReport(reportData) {
    if (!reportData.uhid || !reportData.title) {
      const err = new Error('uhid and title are required for diagnostic report');
      err.status = 400;
      throw err;
    }

    const reportId = reportData.id || `rep-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const record = {
      id: reportId,
      uhid: reportData.uhid,
      type: 'diagnostic_report',
      title: reportData.title,
      category: reportData.category || 'Laboratory',
      date: reportData.date || new Date().toISOString().split('T')[0],
      facilityName: reportData.facilityName || 'National Reference Laboratory',
      doctorName: reportData.doctorName || 'Attending Pathologist / Radiologist',
      fileType: reportData.fileType || 'pdf', // 'pdf' or 'image'
      fileUrl: reportData.fileUrl || (reportData.fileType === 'image' 
        ? 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80'
        : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
      summary: reportData.summary || 'Laboratory diagnostic evaluation',
      findings: reportData.findings || [],
      isAbnormal: Boolean(reportData.isAbnormal),
      status: 'verified',
      loincCode: reportData.loincCode || '18719-5',
      created_at: new Date().toISOString()
    };

    const saved = await firestoreService.create(COLLECTIONS.MEDICAL_RECORDS, reportId, record);
    return saved;
  },

  /**
   * Admit patient or update Inpatient Hospitalization
   */
  async admitOrUpdateHospitalization(admissionData) {
    if (!admissionData.uhid || !admissionData.hospitalName) {
      const err = new Error('uhid and hospitalName are required for IPD hospitalization');
      err.status = 400;
      throw err;
    }

    const hospId = admissionData.id || `hosp-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const existing = await firestoreService.get(COLLECTIONS.HOSPITALIZATIONS, hospId);

    const record = {
      id: hospId,
      uhid: admissionData.uhid,
      hospitalName: admissionData.hospitalName,
      wardRoom: admissionData.wardRoom || 'ICU / High Dependency Unit',
      admissionDate: admissionData.admissionDate || new Date().toISOString().split('T')[0],
      dischargeDate: admissionData.dischargeDate || null,
      admittingDoctor: admissionData.admittingDoctor || 'Dr. On Duty',
      admissionReason: admissionData.admissionReason || 'Emergency inpatient stabilization',
      status: admissionData.status || 'admitted', // 'admitted' | 'under_observation' | 'discharged'
      dailyObservations: admissionData.dailyObservations || [],
      created_at: existing ? existing.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    let result;
    if (existing) {
      result = await firestoreService.update(COLLECTIONS.HOSPITALIZATIONS, hospId, record);
    } else {
      result = await firestoreService.create(COLLECTIONS.HOSPITALIZATIONS, hospId, record);
    }
    return result;
  },

  /**
   * Add a Daily Inpatient Round Observation
   */
  async addDailyObservationRound(hospId, observation) {
    const hosp = await firestoreService.get(COLLECTIONS.HOSPITALIZATIONS, hospId);
    if (!hosp) {
      const err = new Error(`Hospitalization record ${hospId} not found`);
      err.status = 404;
      throw err;
    }

    const newObs = {
      id: `obs-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      date: observation.date || new Date().toISOString().split('T')[0],
      time: observation.time || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      doctorName: observation.doctorName || hosp.admittingDoctor,
      conditionStatus: observation.conditionStatus || 'Stable',
      vitals: observation.vitals || 'BP: 120/80 mmHg, SpO2: 98%, Pulse: 74 bpm',
      treatmentNotes: observation.treatmentNotes || 'Patient stable, continuing protocol.',
      created_at: new Date().toISOString()
    };

    const updatedObservations = [...(hosp.dailyObservations || []), newObs];
    return firestoreService.update(COLLECTIONS.HOSPITALIZATIONS, hospId, {
      dailyObservations: updatedObservations
    });
  }
};
