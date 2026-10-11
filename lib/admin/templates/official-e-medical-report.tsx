import React from 'react';

interface OfficialEMedicalReportProps {
  documentTitle?: string;
  recipientName?: string;
  date?: string;
  documentNumber?: string;
  description?: string;
  signature?: string;
}

export default function OfficialEMedicalReport({
  documentTitle = "eMedical Official Health Clearance",
  recipientName = "SHAHIDUL ISLAM",
  date = "12-Sep-2026",
  documentNumber = "HAP-2609120045-AU",
  description = "Fit for Employment & Visa Issuance (Australia)",
  signature = "Panel Physician / Etihad Medical Centre"
}: OfficialEMedicalReportProps) {
  return (
    <div className="max-w-[210mm] mx-auto bg-white shadow-lg p-10 my-8 print:shadow-none print:m-0 print:p-6 text-slate-800 font-sans text-sm leading-relaxed">
      <div className="border-b pb-4 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-slate-900">ETIHAD MEDICAL CENTRE LIMITED</h1>
          <p className="text-xs text-emerald-600 font-semibold">✓ SYSTEM VERIFIED ONLINE - APPROVED eMEDICAL PANEL CLINIC</p>
        </div>
        <div className="text-right text-xs">
          <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded font-bold">CLEARED / COMPLETE</span>
        </div>
      </div>

      <div className="bg-slate-50 p-4 border rounded mb-6 text-xs grid grid-cols-2 gap-2">
        <div><span className="text-slate-500">Candidate Name:</span> <strong className="text-slate-900">{recipientName}</strong></div>
        <div><span className="text-slate-500">HAP / Ref ID:</span> <strong className="text-slate-900">{documentNumber}</strong></div>
        <div><span className="text-slate-500">Submission Date:</span> <strong className="text-slate-900">{date}</strong></div>
        <div><span className="text-slate-500">Status:</span> <strong className="text-emerald-700">{description}</strong></div>
      </div>

      <div className="mb-6">
        <h2 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Clinical Findings & Lab Results</h2>
        <p className="text-slate-600 text-xs">All routine assays, hemoglobin, chest X-ray, and serology screenings (HBsAg, Anti-HCV, HIV, VDRL) are negative/normal. No radiological abnormality detected.</p>
      </div>

      <div className="mt-12 pt-6 border-t flex justify-between items-end text-xs">
        <div>
          <p className="text-slate-500">System Authenticated & Encrypted Portal</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-slate-800">{signature}</p>
          <p className="text-slate-500">Dhaka, Bangladesh</p>
        </div>
      </div>
    </div>
  );
}
