// VitalTrace REST API Router
import { Router } from 'express';
import { authService } from '../services/authService.js';
import { patientService } from '../services/patientService.js';
import { consentService } from '../services/consentService.js';
import { clinicalService } from '../services/clinicalService.js';
import { integrationService } from '../services/integrationService.js';

const router = Router();

// Standard response wrapper helper
const sendSuccess = (res, data, status = 200) => {
  return res.status(status).json({
    success: true,
    data,
    timestamp: new Date().toISOString()
  });
};

const sendError = (res, error) => {
  const status = error.status || 500;
  return res.status(status).json({
    success: false,
    error: error.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
};

// ----------------------------------------------------
// Health Check & System Status
// ----------------------------------------------------
router.get('/health', (req, res) => {
  sendSuccess(res, {
    service: 'VitalTrace National Health Exchange Backend',
    version: '2.0.0',
    status: 'ONLINE',
    dpdp_compliance: 'DPDP Act 2023 Compliant',
    fhir_standard: 'HL7 FHIR R4',
    server_time: new Date().toISOString()
  });
});

// ----------------------------------------------------
// IAM & Authentication Endpoints
// ----------------------------------------------------
router.post('/auth/verify-aadhaar', async (req, res) => {
  try {
    const { aadhaarNumber } = req.body;
    if (!aadhaarNumber) {
      return res.status(400).json({ success: false, error: 'aadhaarNumber is required' });
    }
    const result = await authService.verifyAadhaarUniqueness(aadhaarNumber);
    sendSuccess(res, result);
  } catch (err) {
    sendError(res, err);
  }
});

router.post('/auth/register-patient', async (req, res) => {
  try {
    const newProfile = await authService.registerPatient(req.body);
    sendSuccess(res, newProfile, 201);
  } catch (err) {
    sendError(res, err);
  }
});

router.post('/auth/doctor-login', async (req, res) => {
  try {
    const { registrationNumber, hospitalId } = req.body;
    if (!registrationNumber) {
      return res.status(400).json({ success: false, error: 'Doctor registration number is required' });
    }
    const result = await authService.authenticateDoctor(registrationNumber, hospitalId);
    if (!result.authenticated) {
      return res.status(401).json({ success: false, error: result.message });
    }
    sendSuccess(res, result);
  } catch (err) {
    sendError(res, err);
  }
});

// ----------------------------------------------------
// Patient Core Microservice Endpoints
// ----------------------------------------------------
router.get('/patients', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const patients = await patientService.listPatients(limit);
    sendSuccess(res, patients);
  } catch (err) {
    sendError(res, err);
  }
});

router.get('/patients/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const results = await patientService.searchPatient(query);
    sendSuccess(res, results);
  } catch (err) {
    sendError(res, err);
  }
});

router.get('/patients/:uhid', async (req, res) => {
  try {
    const patient = await patientService.getPatientByUhid(req.params.uhid);
    if (!patient) {
      return res.status(404).json({ success: false, error: `Patient UHID ${req.params.uhid} not found` });
    }
    sendSuccess(res, patient);
  } catch (err) {
    sendError(res, err);
  }
});

router.put('/patients/:uhid', async (req, res) => {
  try {
    const updated = await patientService.updatePatient(req.params.uhid, req.body);
    sendSuccess(res, updated);
  } catch (err) {
    sendError(res, err);
  }
});

router.put('/patients/:uhid/schemes', async (req, res) => {
  try {
    const updated = await patientService.updateInsuranceSchemes(req.params.uhid, req.body);
    sendSuccess(res, updated);
  } catch (err) {
    sendError(res, err);
  }
});

// ----------------------------------------------------
// Consent Gateway & Break-Glass Endpoints
// ----------------------------------------------------
router.post('/consent/grant', async (req, res) => {
  try {
    const consent = await consentService.grantConsent(req.body);
    sendSuccess(res, consent, 201);
  } catch (err) {
    sendError(res, err);
  }
});

router.post('/consent/:id/revoke', async (req, res) => {
  try {
    const revoked = await consentService.revokeConsent(req.params.id);
    sendSuccess(res, revoked);
  } catch (err) {
    sendError(res, err);
  }
});

router.post('/consent/break-glass', async (req, res) => {
  try {
    const result = await consentService.executeBreakGlass(req.body);
    sendSuccess(res, result, 201);
  } catch (err) {
    sendError(res, err);
  }
});

router.get('/consent/:uhid/audit-trail', async (req, res) => {
  try {
    const trail = await consentService.getAuditTrail(req.params.uhid);
    sendSuccess(res, trail);
  } catch (err) {
    sendError(res, err);
  }
});

// ----------------------------------------------------
// Clinical & EMR Core Endpoints
// ----------------------------------------------------
router.post('/clinical/visits', async (req, res) => {
  try {
    const visit = await clinicalService.recordConsultationVisit(req.body);
    sendSuccess(res, visit, 201);
  } catch (err) {
    sendError(res, err);
  }
});

router.post('/clinical/reports', async (req, res) => {
  try {
    const report = await clinicalService.addDiagnosticReport(req.body);
    sendSuccess(res, report, 201);
  } catch (err) {
    sendError(res, err);
  }
});

router.post('/clinical/hospitalizations', async (req, res) => {
  try {
    const hosp = await clinicalService.admitOrUpdateHospitalization(req.body);
    sendSuccess(res, hosp, 201);
  } catch (err) {
    sendError(res, err);
  }
});

router.post('/clinical/hospitalizations/:id/rounds', async (req, res) => {
  try {
    const round = await clinicalService.addDailyObservationRound(req.params.id, req.body);
    sendSuccess(res, round, 201);
  } catch (err) {
    sendError(res, err);
  }
});

// ----------------------------------------------------
// Integration & Ecosystem Endpoints
// ----------------------------------------------------
router.get('/integrations/catalog', (req, res) => {
  sendSuccess(res, integrationService.getDiagnosticCatalog());
});

router.get('/integrations/diagnostic-pricing/:testCode', (req, res) => {
  const comparison = integrationService.compareDiagnosticPrices(req.params.testCode);
  sendSuccess(res, comparison);
});

router.post('/integrations/orders/diagnostic', async (req, res) => {
  try {
    const order = await integrationService.placeDiagnosticOrder(req.body);
    sendSuccess(res, order, 201);
  } catch (err) {
    sendError(res, err);
  }
});

router.get('/integrations/orders/diagnostic/:uhid', async (req, res) => {
  try {
    const orders = await integrationService.getDiagnosticOrders(req.params.uhid);
    sendSuccess(res, orders);
  } catch (err) {
    sendError(res, err);
  }
});

router.post('/integrations/orders/pharmacy', async (req, res) => {
  try {
    const dispatch = await integrationService.dispatchPharmacyOrder(req.body);
    sendSuccess(res, dispatch, 201);
  } catch (err) {
    sendError(res, err);
  }
});

export default router;

