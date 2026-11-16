// Database Service Layer for Cloud Firestore with Persistent In-Memory Fallback
import { COLLECTIONS } from './schema.js';
import { INITIAL_PROFILES, REGISTERED_DOCTORS } from '../../src/data/initialData.js';
import { MASTER_DRUG_DATABASE, DIAGNOSTIC_TEST_CATALOG, EMPANELED_PHARMACY_PARTNERS } from '../../src/data/catalogData.js';

// In-Memory Database Store partitioned by Collections
const store = {
  [COLLECTIONS.USERS]: new Map(),
  [COLLECTIONS.FACILITIES]: new Map(),
  [COLLECTIONS.MEDICAL_RECORDS]: new Map(),
  [COLLECTIONS.CONSENT_LOGS]: new Map(),
  [COLLECTIONS.DIAGNOSTIC_ORDERS]: new Map(),
  [COLLECTIONS.HOSPITALIZATIONS]: new Map()
};

// Seed Initial Data into Collections
function seedDatabase() {
  // Seed Users
  INITIAL_PROFILES.forEach(profile => {
    store[COLLECTIONS.USERS].set(profile.vitalTraceId, {
      ...profile,
      created_at: new Date().toISOString()
    });

    // Seed Medical Records for Profile
    (profile.doctorVisits || []).forEach(visit => {
      store[COLLECTIONS.MEDICAL_RECORDS].set(visit.id, {
        ...visit,
        uhid: profile.vitalTraceId,
        type: 'consultation_visit',
        created_at: visit.visitDate
      });
    });

    (profile.diagnosticReports || []).forEach(report => {
      store[COLLECTIONS.MEDICAL_RECORDS].set(report.id, {
        ...report,
        uhid: profile.vitalTraceId,
        type: 'diagnostic_report',
        created_at: report.date
      });
    });

    // Seed Inpatient Hospitalizations
    (profile.hospitalizations || []).forEach(hosp => {
      store[COLLECTIONS.HOSPITALIZATIONS].set(hosp.id, {
        ...hosp,
        uhid: profile.vitalTraceId,
        created_at: hosp.admissionDate
      });
    });

    // Seed Consent & Break-Glass Logs
    (profile.consentLogs || []).forEach(log => {
      store[COLLECTIONS.CONSENT_LOGS].set(log.id, {
        ...log,
        uhid: profile.vitalTraceId,
        created_at: new Date().toISOString()
      });
    });

    (profile.breakGlassLogs || []).forEach(bg => {
      store[COLLECTIONS.CONSENT_LOGS].set(bg.id, {
        ...bg,
        uhid: profile.vitalTraceId,
        status: 'emergency_override',
        is_break_glass: true,
        audit_retention_years: 7,
        created_at: new Date().toISOString()
      });
    });

    // Seed Diagnostic Orders
    (profile.pendingTestOrders || []).forEach(order => {
      store[COLLECTIONS.DIAGNOSTIC_ORDERS].set(order.id, {
        ...order,
        uhid: profile.vitalTraceId,
        created_at: order.orderDate
      });
    });
  });

  // Seed Facilities
  REGISTERED_DOCTORS.forEach(doc => {
    const facId = `fac-${doc.hospitalName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 16)}`;
    if (!store[COLLECTIONS.FACILITIES].has(facId)) {
      store[COLLECTIONS.FACILITIES].set(facId, {
        facility_id: facId,
        name: doc.hospitalName,
        address: doc.hospitalAddress,
        type: 'Empaneled Hospital / Trauma Center',
        phone: doc.contactPhone,
        created_at: new Date().toISOString()
      });
    }
  });

  console.log(`[FirestoreService] Database initialized & seeded with ${store[COLLECTIONS.USERS].size} patients, ${store[COLLECTIONS.FACILITIES].size} facilities.`);
}

seedDatabase();

export const firestoreService = {
  async get(collection, id) {
    const coll = store[collection];
    if (!coll) return null;
    if (coll.has(id)) return coll.get(id);
    for (const doc of coll.values()) {
      if (doc.vitalTraceId === id || doc.id === id) {
        return doc;
      }
    }
    return null;
  },

  async list(collection, filterFn = null) {
    const coll = store[collection];
    if (!coll) return [];
    const all = Array.from(coll.values());
    if (filterFn) {
      return all.filter(filterFn);
    }
    return all;
  },

  async create(collection, id, data) {
    const coll = store[collection];
    if (!coll) throw new Error(`Collection ${collection} does not exist`);
    const doc = {
      ...data,
      id,
      vitalTraceId: data.vitalTraceId || id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    coll.set(id, doc);
    return doc;
  },

  async update(collection, id, partialData) {
    const coll = store[collection];
    if (!coll) throw new Error(`Collection ${collection} does not exist`);
    let targetKey = id;
    let existing = coll.get(id);
    if (!existing) {
      for (const [k, v] of coll.entries()) {
        if (v.vitalTraceId === id || v.id === id) {
          existing = v;
          targetKey = k;
          break;
        }
      }
    }
    if (!existing) throw new Error(`Document ${id} not found in ${collection}`);
    const updated = {
      ...existing,
      ...partialData,
      updated_at: new Date().toISOString()
    };
    coll.set(targetKey, updated);
    return updated;
  },

  async delete(collection, id) {
    const coll = store[collection];
    if (!coll) return false;
    return coll.delete(id);
  }
};
