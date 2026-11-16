// VitalTrace Client API Service
// Integrates with Express backend with automatic Offline-First Caching for Rural PHCs
import { INITIAL_PROFILES, REGISTERED_DOCTORS } from '../data/initialData';
import { MASTER_DRUG_DATABASE, DIAGNOSTIC_TEST_CATALOG, EMPANELED_PHARMACY_PARTNERS } from '../data/catalogData';

// Dynamic API Base URL (defaults to current origin /api or local port 5000)
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

// Offline-first LocalStorage Cache Keys
const STORAGE_KEY_PROFILES = 'vt_profiles_cache_v2';
const STORAGE_KEY_OFFLINE_QUEUE = 'vt_offline_sync_queue_v2';

// Initialize offline storage with initial profiles if empty
function getLocalProfiles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('[OfflineStorage] Error reading profiles cache:', e);
  }
  localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(INITIAL_PROFILES));
  return INITIAL_PROFILES;
}

function saveLocalProfiles(profiles) {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  } catch (e) {
    console.warn('[OfflineStorage] Error writing profiles cache:', e);
  }
}

// Queue offline mutations for background sync
function queueOfflineAction(action) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_OFFLINE_QUEUE);
    const queue = raw ? JSON.parse(raw) : [];
    queue.push({ ...action, timestamp: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY_OFFLINE_QUEUE, JSON.stringify(queue));
    console.log(`[OfflineQueue] Mutation queued for rural sync: ${action.type}`);
  } catch (e) {
    console.warn('[OfflineQueue] Failed to queue offline action:', e);
  }
}

// Helper to make API requests with graceful offline fallback
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4-sec timeout for rural resilience
    
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || `HTTP error ${res.status}`);
    }
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn(`[API] Backend request to ${endpoint} failed or offline (${err.message}). Using offline cache engine.`);
    return null; // Signals fallback to caller
  }
}

export const vitalTraceApi = {
  /**
   * Health Check
   */
  async checkHealth() {
    const data = await request('/health');
    return data || { status: 'OFFLINE_MODE', fhir_standard: 'HL7 FHIR R4', rural_mode: true };
  },

  /**
   * Get all Patient Profiles
   */
  async getPatients() {
    const backendData = await request('/patients');
    if (backendData && Array.isArray(backendData) && backendData.length > 0) {
      saveLocalProfiles(backendData);
      return backendData;
    }
    return getLocalProfiles();
  },

  /**
   * Get single Patient Profile by UHID
   */
  async getPatient(uhid) {
    const backendData = await request(`/patients/${uhid}`);
    if (backendData) {
      // Update local cache
      const profiles = getLocalProfiles();
      const idx = profiles.findIndex(p => p.vitalTraceId === uhid);
      if (idx !== -1) {
        profiles[idx] = backendData;
      } else {
        profiles.push(backendData);
      }
      saveLocalProfiles(profiles);
      return backendData;
    }

    const profiles = getLocalProfiles();
    return profiles.find(p => p.vitalTraceId === uhid) || null;
  },

  /**
   * Search patients by query string
   */
  async searchPatients(query) {
    const backendData = await request(`/patients/search?q=${encodeURIComponent(query)}`);
    if (backendData) return backendData;

    // Offline search fallback
    const q = (query || '').toLowerCase().trim();
    const digits = (query || '').replace(/\D/g, '');
    const profiles = getLocalProfiles();
    return profiles.filter(user => {
      const matchName = user.fullName && user.fullName.toLowerCase().includes(q);
      const matchUhid = user.vitalTraceId && user.vitalTraceId.toLowerCase().includes(q);
      const matchAadhaar = user.aadhaarNumber && user.aadhaarNumber.replace(/\D/g, '').includes(digits);
      return matchName || matchUhid || (digits.length >= 4 && matchAadhaar);
    });
  },

  /**
   * Register a new Patient Profile
   */
  async registerPatient(profileData) {
    const backendData = await request('/auth/register-patient', {
      method: 'POST',
      body: JSON.stringify(profileData)
    });

    if (backendData) {
      const profiles = getLocalProfiles();
      profiles.unshift(backendData);
      saveLocalProfiles(profiles);
      return backendData;
    }

    // Local registration fallback
    const year = new Date().getFullYear();
    const uhid = profileData.vitalTraceId || `VT-${year}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPatient = {
      ...profileData,
      vitalTraceId: uhid,
      doctorVisits: [],
      diagnosticReports: [],
      hospitalizations: [],
      consentLogs: [],
      pendingTestOrders: [],
      ekyc_verified: true,
      created_at: new Date().toISOString()
    };

    const profiles = getLocalProfiles();
    profiles.unshift(newPatient);
    saveLocalProfiles(profiles);
    queueOfflineAction({ type: 'REGISTER_PATIENT', data: newPatient });
    return newPatient;
  },

  /**
   * Update Patient Profile
   */
  async updatePatient(uhid, updateData) {
    const backendData = await request(`/patients/${uhid}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });

    const profiles = getLocalProfiles();
    const idx = profiles.findIndex(p => p.vitalTraceId === uhid);
    if (idx !== -1) {
      profiles[idx] = { ...profiles[idx], ...updateData, ...(backendData || {}) };
      saveLocalProfiles(profiles);
    }

    if (!backendData) {
      queueOfflineAction({ type: 'UPDATE_PATIENT', uhid, data: updateData });
    }
    return backendData || profiles[idx];
  },

  /**
   * Record a Doctor Consultation Visit (with Smart Generic Substitution)
   */
  async recordDoctorVisit(visitData) {
    const backendData = await request('/clinical/visits', {
      method: 'POST',
      body: JSON.stringify(visitData)
    });

    const record = backendData || {
      ...visitData,
      id: visitData.id || `v-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    // Update local cache
    const profiles = getLocalProfiles();
    const idx = profiles.findIndex(p => p.vitalTraceId === visitData.uhid);
    if (idx !== -1) {
      profiles[idx].doctorVisits = [record, ...(profiles[idx].doctorVisits || [])];
      saveLocalProfiles(profiles);
    }

    if (!backendData) {
      queueOfflineAction({ type: 'RECORD_VISIT', data: record });
    }
    return record;
  },

  /**
   * Add a Diagnostic Report (PDF / Image)
   */
  async addDiagnosticReport(reportData) {
    const backendData = await request('/clinical/reports', {
      method: 'POST',
      body: JSON.stringify(reportData)
    });

    const record = backendData || {
      ...reportData,
      id: reportData.id || `rep-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    const profiles = getLocalProfiles();
    const idx = profiles.findIndex(p => p.vitalTraceId === reportData.uhid);
    if (idx !== -1) {
      profiles[idx].diagnosticReports = [record, ...(profiles[idx].diagnosticReports || [])];
      saveLocalProfiles(profiles);
    }

    if (!backendData) {
      queueOfflineAction({ type: 'ADD_REPORT', data: record });
    }
    return record;
  },

  /**
   * Execute Break-Glass Emergency Override Protocol
   */
  async executeBreakGlass(breakGlassData) {
    const backendData = await request('/consent/break-glass', {
      method: 'POST',
      body: JSON.stringify(breakGlassData)
    });

    const timestamp = new Date().toISOString();
    const auditRecord = backendData?.auditRecord || {
      id: `bg-${Date.now()}`,
      uhid: breakGlassData.uhid,
      doctorName: breakGlassData.doctorName,
      doctorReg: breakGlassData.doctorReg,
      hospitalName: breakGlassData.hospitalName || 'Emergency Care Center',
      clinicalJustification: breakGlassData.clinicalJustification,
      timestamp,
      is_break_glass: true,
      audit_retention_years: 7,
      status: 'emergency_override'
    };

    const profiles = getLocalProfiles();
    const idx = profiles.findIndex(p => p.vitalTraceId === breakGlassData.uhid);
    if (idx !== -1) {
      profiles[idx].breakGlassLogs = [auditRecord, ...(profiles[idx].breakGlassLogs || [])];
      saveLocalProfiles(profiles);
    }

    if (!backendData) {
      queueOfflineAction({ type: 'BREAK_GLASS', data: auditRecord });
    }

    return {
      success: true,
      auditRecord,
      message: 'Emergency access granted under statutory DPDP Act 2023 emergency provisions.'
    };
  },

  /**
   * Add Daily Inpatient Observation Round
   */
  async addObservationRound(hospId, uhid, observation) {
    const backendData = await request(`/clinical/hospitalizations/${hospId}/rounds`, {
      method: 'POST',
      body: JSON.stringify(observation)
    });

    const profiles = getLocalProfiles();
    const pIdx = profiles.findIndex(p => p.vitalTraceId === uhid);
    if (pIdx !== -1) {
      const hosp = (profiles[pIdx].hospitalizations || []).find(h => h.id === hospId);
      if (hosp) {
        hosp.dailyObservations = [
          ...(hosp.dailyObservations || []),
          {
            ...observation,
            id: `obs-${Date.now()}`,
            date: observation.date || new Date().toISOString().split('T')[0],
            time: observation.time || '10:00 AM'
          }
        ];
        saveLocalProfiles(profiles);
      }
    }

    return backendData || { success: true };
  },

  /**
   * Diagnostic Lab Order Placement
   */
  async placeDiagnosticOrder(orderData) {
    const backendData = await request('/integrations/orders/diagnostic', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });

    const newOrder = backendData || {
      ...orderData,
      id: `tst-${Date.now()}`,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Sample Collection Scheduled'
    };

    const profiles = getLocalProfiles();
    const pIdx = profiles.findIndex(p => p.vitalTraceId === orderData.uhid);
    if (pIdx !== -1) {
      profiles[pIdx].pendingTestOrders = [newOrder, ...(profiles[pIdx].pendingTestOrders || [])];
      saveLocalProfiles(profiles);
    }

    return newOrder;
  },

  /**
   * Dispatch e-Pharmacy Order
   */
  async dispatchPharmacyOrder(dispatchData) {
    const backendData = await request('/integrations/orders/pharmacy', {
      method: 'POST',
      body: JSON.stringify(dispatchData)
    });

    return backendData || {
      orderId: `rx-local-${Date.now()}`,
      status: 'Dispatched to Jan Aushadhi Hub',
      deliverySLA: 'Within 24 Hours',
      trackingUrl: 'https://janaushadhi.gov.in/track'
    };
  },

  /**
   * Get Diagnostic Test Catalog
   */
  getDiagnosticCatalog() {
    return DIAGNOSTIC_TEST_CATALOG;
  },

  /**
   * Master Drug Database
   */
  getMasterDrugDatabase() {
    return MASTER_DRUG_DATABASE;
  },

  /**
   * Empaneled Pharmacies
   */
  getPharmacyPartners() {
    return EMPANELED_PHARMACY_PARTNERS;
  }
};

