import React, { useState } from 'react';
import { 
  X, Download, FileText, Image, ZoomIn, ZoomOut, RotateCcw, 
  CheckCircle, AlertCircle, Building, Calendar, User, Shield 
} from 'lucide-react';
import { maskAadhaar } from '../utils/helpers';

export default function ReportViewerModal({ report, patient, onClose }) {
  if (!report) return null;

  const [zoomLevel, setZoomLevel] = useState(1);
  const [isInverted, setIsInverted] = useState(false);
  const [activePage, setActivePage] = useState(1);

  const isPdf = report.format === 'PDF';

  const handleDownload = () => {
    alert(`Downloading verified diagnostic document: "${report.title}" (${report.format})`);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card report-viewer-modal">
        {/* Modal Top Bar */}
        <div className="report-modal-header">
          <div className="report-header-left">
            <span className={`format-tag ${isPdf ? 'tag-pdf' : 'tag-img'}`}>
              {isPdf ? <FileText size={15} /> : <Image size={15} />}
              {report.format}
            </span>
            <div>
              <h3 className="report-modal-title">{report.title}</h3>
              <p className="report-modal-meta">
                {report.category} • Date: <strong>{report.date}</strong> • File Size: {report.fileSize || '1.8 MB'}
              </p>
            </div>
          </div>

          <div className="report-header-actions">
            <button 
              type="button" 
              onClick={handleDownload}
              className="btn btn-secondary btn-sm"
              title="Download diagnostic document"
            >
              <Download size={15} /> Download {report.format}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="modal-close-btn"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Viewer Area */}
        <div className="report-viewer-body">
          {isPdf ? (
            /* PDF DOCUMENT VIEWER */
            <div className="pdf-document-container">
              <div className="pdf-toolbar">
                <span className="pdf-page-indicator">Page {activePage} of 2</span>
                <div className="pdf-page-controls">
                  <button 
                    disabled={activePage === 1} 
                    onClick={() => setActivePage(1)}
                    className="btn btn-ghost btn-sm"
                  >
                    Prev
                  </button>
                  <button 
                    disabled={activePage === 2} 
                    onClick={() => setActivePage(2)}
                    className="btn btn-ghost btn-sm"
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="pdf-sheet">
                {/* PDF Lab Header */}
                <div className="pdf-lab-header">
                  <div className="pdf-lab-brand">
                    <div className="pdf-lab-logo">
                      <Building size={22} className="text-cyan" />
                    </div>
                    <div>
                      <h4 className="pdf-lab-name">{report.labName}</h4>
                      <p className="pdf-lab-address">{report.labAddress}</p>
                      <span className="nabl-tag">NABL & CAP ACCREDITED CLINICAL LABORATORY</span>
                    </div>
                  </div>
                  <div className="pdf-report-barcode">
                    <span className="barcode-font">||||| ||||||| ||| |||||||| ||||</span>
                    <span className="barcode-num">LAB-ID: {report.id}-2026</span>
                  </div>
                </div>

                {/* Patient Information Table */}
                <div className="pdf-patient-table">
                  <div className="pdf-cell">
                    <span className="pdf-lbl">Patient Name:</span>
                    <strong>{patient.fullName}</strong>
                  </div>
                  <div className="pdf-cell">
                    <span className="pdf-lbl">Aadhaar (Masked):</span>
                    <strong className="font-mono">{maskAadhaar(patient.aadhaarNumber)}</strong>
                  </div>
                  <div className="pdf-cell">
                    <span className="pdf-lbl">VitalTrace ID:</span>
                    <strong className="font-mono">{patient.vitalTraceId}</strong>
                  </div>
                  <div className="pdf-cell">
                    <span className="pdf-lbl">Age / Gender:</span>
                    <span>{patient.dob} ({patient.gender})</span>
                  </div>
                  <div className="pdf-cell">
                    <span className="pdf-lbl">Referring Doctor:</span>
                    <span>{report.orderingDoctor}</span>
                  </div>
                  <div className="pdf-cell">
                    <span className="pdf-lbl">Sample Date:</span>
                    <span>{report.date} 08:30 AM</span>
                  </div>
                </div>

                {/* PDF Structured Results / Investigation Findings */}
                <div className="pdf-content-area">
                  <h5 className="pdf-section-title">INVESTIGATION TEST RESULTS & PARAMETERS</h5>
                  
                  {report.title.includes('Blood Gas') || report.title.includes('Metabolic') ? (
                    <table className="pdf-results-table">
                      <thead>
                        <tr>
                          <th>Test Parameter</th>
                          <th>Observed Result</th>
                          <th>Biological Reference Range</th>
                          <th>Units</th>
                          <th>Flag</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="row-abnormal">
                          <td><strong>Arterial Blood pH</strong></td>
                          <td><strong>7.34</strong></td>
                          <td>7.35 - 7.45</td>
                          <td>pH units</td>
                          <td><span className="pdf-flag-badge">LOW (Acidosis)</span></td>
                        </tr>
                        <tr className="row-abnormal">
                          <td><strong>pCO2 (Partial Pressure CO2)</strong></td>
                          <td><strong>46.0</strong></td>
                          <td>35.0 - 45.0</td>
                          <td>mmHg</td>
                          <td><span className="pdf-flag-badge">HIGH</span></td>
                        </tr>
                        <tr className="row-abnormal">
                          <td><strong>pO2 (Partial Pressure O2)</strong></td>
                          <td><strong>68.0</strong></td>
                          <td>80.0 - 100.0</td>
                          <td>mmHg</td>
                          <td><span className="pdf-flag-badge">LOW (Hypoxemia)</span></td>
                        </tr>
                        <tr>
                          <td>Bicarbonate (HCO3-)</td>
                          <td>24.2</td>
                          <td>22.0 - 28.0</td>
                          <td>mEq/L</td>
                          <td>Normal</td>
                        </tr>
                        <tr className="row-abnormal">
                          <td><strong>Total Leukocyte Count (TLC)</strong></td>
                          <td><strong>12,400</strong></td>
                          <td>4,000 - 11,000</td>
                          <td>/mcL</td>
                          <td><span className="pdf-flag-badge">ELEVATED</span></td>
                        </tr>
                        <tr className="row-abnormal">
                          <td><strong>C-Reactive Protein (Quantitative CRP)</strong></td>
                          <td><strong>48.0</strong></td>
                          <td>&lt; 5.0</td>
                          <td>mg/L</td>
                          <td><span className="pdf-flag-badge">HIGH</span></td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <div className="pdf-text-findings">
                      <p className="findings-paragraph">{report.findings}</p>
                    </div>
                  )}

                  {/* Clinical Impression Box */}
                  <div className="pdf-impression-box">
                    <h6>CLINICAL IMPRESSION & INTERPRETATION:</h6>
                    <p>{report.findings}</p>
                  </div>

                  {/* Sign-off signatures */}
                  <div className="pdf-footer-signatures">
                    <div>
                      <span className="sig-line">Verified Digitally</span>
                      <strong>{report.radiologist || 'Chief Pathologist'}</strong>
                      <p className="sig-sub">MD (Pathology / Biochemistry), NABL Signatory</p>
                    </div>
                    <div className="qr-stamp-box">
                      <Shield size={28} className="text-emerald" />
                      <span>ABDM & UIDAI Validated National Health Ledger Document</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* IMAGE DIAGNOSTIC VIEWER (X-Ray / CT / ECG) */
            <div className="image-viewer-container">
              <div className="image-controls-bar">
                <div className="zoom-buttons">
                  <button 
                    type="button" 
                    onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.2))}
                    className="btn btn-secondary btn-sm"
                    title="Zoom Out"
                  >
                    <ZoomOut size={15} />
                  </button>
                  <span className="zoom-text">{Math.round(zoomLevel * 100)}%</span>
                  <button 
                    type="button" 
                    onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.2))}
                    className="btn btn-secondary btn-sm"
                    title="Zoom In"
                  >
                    <ZoomIn size={15} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setZoomLevel(1); setIsInverted(false); }}
                    className="btn btn-secondary btn-sm"
                    title="Reset Zoom"
                  >
                    <RotateCcw size={15} /> Reset
                  </button>
                </div>

                <div className="invert-toggle">
                  <button
                    type="button"
                    onClick={() => setIsInverted(prev => !prev)}
                    className={`btn btn-sm ${isInverted ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {isInverted ? 'Normal View' : 'Invert Radiography (Negative)'}
                  </button>
                </div>
              </div>

              {/* Simulated Diagnostic Imaging Canvas */}
              <div className="imaging-canvas-wrap">
                <div 
                  className={`diagnostic-image-canvas ${isInverted ? 'inverted-canvas' : ''}`}
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  {report.imageType === 'ecg' ? (
                    /* High-resolution ECG Graphic */
                    <div className="ecg-view-box">
                      <div className="ecg-grid-overlay">
                        <svg className="ecg-wave-svg" viewBox="0 0 800 300" preserveAspectRatio="none">
                          <path
                            d="M0,150 L50,150 L60,140 L70,160 L80,150 L100,150 L105,145 L110,150 L115,150 L120,60 L128,240 L136,150 L145,150 L160,135 L175,150 L200,150 L250,150 L260,140 L270,160 L280,150 L300,150 L305,145 L310,150 L315,150 L320,60 L328,240 L336,150 L345,150 L360,135 L375,150 L400,150 L450,150 L460,140 L470,160 L480,150 L500,150 L505,145 L510,150 L515,150 L520,60 L528,240 L536,150 L545,150 L560,135 L575,150 L600,150 L650,150 L660,140 L670,160 L680,150 L700,150 L705,145 L710,150 L715,150 L720,60 L728,240 L736,150 L745,150 L760,135 L775,150 L800,150"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2.5"
                          />
                        </svg>
                      </div>
                      <div className="ecg-hud-overlay">
                        <span>LEAD II (Standard 25mm/s, 10mm/mV)</span>
                        <span>Heart Rate: 108 BPM (Sinus Tachycardia)</span>
                      </div>
                    </div>
                  ) : (
                    /* High-resolution Radiology / X-Ray / CT Representation */
                    <div className="xray-view-box">
                      <div className="xray-screen">
                        <div className="xray-ribs-shadow"></div>
                        <div className="xray-lung-infiltrates">
                          <span className="radiology-marker">Bilateral Basal Ground-Glass Opacities</span>
                        </div>
                        <div className="xray-cardiac-silhouette"></div>
                      </div>
                      <div className="radiology-corner-tags">
                        <span className="corner-top-left font-mono">
                          {patient.fullName.toUpperCase()} | AGE: {patient.dob} | MRN: {patient.vitalTraceId}
                        </span>
                        <span className="corner-top-right font-mono">
                          {report.date} | {report.labName}
                        </span>
                        <span className="corner-bottom-left font-mono">
                          KV: 120 | mAs: 250 | SLICE: 1.0mm
                        </span>
                        <span className="corner-bottom-right font-mono">
                          R / PA ERECT
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Radiologist Finding Below Canvas */}
              <div className="imaging-report-drawer">
                <div className="drawer-title-row">
                  <span className="badge badge-cyan">{report.category} Report</span>
                  <span className="text-muted text-sm">Reviewed by: <strong>{report.radiologist}</strong></span>
                </div>
                <p className="radiology-findings-text">{report.findings}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
