// External Ecosystem & Integration Microservice
// Implements Hyperlocal Diagnostic Aggregation & National E-Pharmacy Fulfillment
import { firestoreService } from '../db/firestoreService.js';
import { COLLECTIONS } from '../db/schema.js';
import { DIAGNOSTIC_TEST_CATALOG, EMPANELED_PHARMACY_PARTNERS } from '../../src/data/catalogData.js';

export const integrationService = {
  /**
   * Get all available diagnostic tests catalog
   */
  getDiagnosticCatalog() {
    return DIAGNOSTIC_TEST_CATALOG;
  },

  /**
   * Compare diagnostic prices across partner diagnostic laboratories
   */
  compareDiagnosticPrices(testQuery) {
    const q = (testQuery || '').toLowerCase();
    const test = DIAGNOSTIC_TEST_CATALOG.find(t => 
      (t.id && t.id.toLowerCase() === q) ||
      (t.code && t.code.toLowerCase().includes(q)) ||
      (t.testName && t.testName.toLowerCase().includes(q))
    );
    if (!test) {
      return {
        testFound: false,
        message: `Diagnostic test ${testQuery} not recognized in national catalog`
      };
    }

    return {
      testFound: true,
      testName: test.testName,
      code: test.code,
      category: test.category,
      suggestedTimeline: test.suggestedTimeline,
      minPrice: test.minPrice,
      maxPrice: test.maxPrice,
      quotes: (test.hyperlocalPricing || []).map(provider => ({
        labName: provider.labName,
        price: provider.price,
        turnaround: provider.turnaround,
        rating: provider.rating,
        savingsFromMax: Math.round(((test.maxPrice - provider.price) / test.maxPrice) * 100)
      }))
    };
  },

  /**
   * Place a new Diagnostic Test Order
   */
  async placeDiagnosticOrder({ uhid, testCode, preferredProvider, orderNotes }) {
    if (!uhid || !testCode) {
      const err = new Error('uhid and testCode are required');
      err.status = 400;
      throw err;
    }

    const q = testCode.toLowerCase();
    const test = DIAGNOSTIC_TEST_CATALOG.find(t => 
      (t.id && t.id.toLowerCase() === q) ||
      (t.code && t.code.toLowerCase().includes(q)) ||
      (t.testName && t.testName.toLowerCase().includes(q))
    );
    const testName = test ? test.testName : testCode;
    const providerQuote = test?.hyperlocalPricing?.find(p => p.labName.toLowerCase().includes((preferredProvider || '').toLowerCase())) || test?.hyperlocalPricing?.[0];

    const orderId = `tst-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder = {
      id: orderId,
      uhid,
      testName,
      code: test?.code || 'LOINC: 18719-5',
      orderDate: new Date().toISOString().split('T')[0],
      orderedBy: 'Attending Physician via VitalTrace Portal',
      provider: providerQuote ? providerQuote.labName : (preferredProvider || 'Jan Aushadhi / Govt PHC Lab'),
      estimatedCost: providerQuote ? providerQuote.price : 150,
      status: 'Sample Collection Scheduled',
      deliveryEstimate: providerQuote?.turnaround || '24 Hours',
      orderNotes: orderNotes || 'Routine diagnostic protocol',
      created_at: new Date().toISOString()
    };

    const saved = await firestoreService.create(COLLECTIONS.DIAGNOSTIC_ORDERS, orderId, newOrder);
    return saved;
  },

  /**
   * List pending / active diagnostic orders for patient
   */
  async getDiagnosticOrders(uhid) {
    const orders = await firestoreService.list(COLLECTIONS.DIAGNOSTIC_ORDERS, o => o.uhid === uhid);
    return orders.sort((a, b) => new Date(b.created_at || b.orderDate) - new Date(a.created_at || a.orderDate));
  },

  /**
   * Dispatch e-Pharmacy prescription fulfillment order
   */
  async dispatchPharmacyOrder({ uhid, partnerId, prescriptionItems, deliveryAddress }) {
    const partner = EMPANELED_PHARMACY_PARTNERS.find(p => p.partnerId === partnerId) || EMPANELED_PHARMACY_PARTNERS[0];
    const fulfillmentOrderId = `rx-ful-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const totalBrandMRP = (prescriptionItems || []).reduce((acc, curr) => acc + (curr.brandPrice || 100), 0);
    const totalGenericPrice = (prescriptionItems || []).reduce((acc, curr) => acc + (curr.genericPrice || 25), 0);
    const netSavings = totalBrandMRP - totalGenericPrice;

    return {
      orderId: fulfillmentOrderId,
      uhid,
      partnerName: partner.partnerName,
      apiEndpoint: partner.apiEndpoint,
      status: 'Dispatched to Empaneled E-Pharmacy Hub',
      deliverySLA: partner.deliverySLA,
      totalBrandMRP,
      totalJanAushadhiPayable: totalGenericPrice,
      totalCitizenSavings: netSavings,
      deliveryAddress: deliveryAddress || 'Registered Aadhaar Communication Address',
      trackingUrl: `https://${partner.partnerName.toLowerCase().replace(/\s/g, '')}.vitaltrace.gov.in/track/${fulfillmentOrderId}`,
      timestamp: new Date().toISOString()
    };
  }
};
