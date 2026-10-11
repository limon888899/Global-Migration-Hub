'use client';

import React from 'react';

interface DocumentTemplateProps {
  documentTitle?: string;
  documentNumber?: string;
  date?: string;
  recipientName?: string;
  recipientEmail?: string;
  description?: string;
  signature?: string;
  status?: string;
}

export default function DocumentTemplate({
  documentTitle = "Official Authorization Certificate",
  documentNumber = "DOC-2026-0892",
  date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  recipientName = "Jane Doe",
  recipientEmail = "jane.doe@example.com",
  description = "This document certifies that the named recipient has successfully fulfilled all regulatory requirements and is hereby granted official authorization in accordance with standard compliance frameworks.",
  signature = "A. Authorized Officer",
  status = "Verified & Active"
}: DocumentTemplateProps) {
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 print:bg-white print:py-0 print:px-0">
      
      {/* Print / Export Action Bar (Hidden when printing) */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center print:hidden">
        <div>
          <span className="text-sm font-medium text-slate-700">A4 Document Preview</span>
          <p className="text-xs text-slate-500">Optimized for standard print & PDF export</p>
        </div>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition font-medium text-sm flex items-center gap-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / Save as PDF
        </button>
      </div>

      {/* A4 Document Container */}
      <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white shadow-2xl rounded-none sm:rounded-xl p-8 sm:p-14 flex flex-col justify-between border border-slate-200 print:shadow-none print:border-none print:w-full print:max-w-none">
        
        {/* Top Content Section */}
        <div>
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                🏛️
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">REGULATORY AFFAIRS & COMPLIANCE</h1>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Official Departmental Record</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200 mb-2">
                {status}
              </span>
              <p className="text-xs font-mono text-slate-500">Ref: {documentNumber}</p>
              <p className="text-xs text-slate-500">Date: {date}</p>
            </div>
          </div>

          {/* Document Title */}
          <div className="text-center my-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
              {documentTitle}
            </h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto mt-3 rounded-full"></div>
          </div>

          {/* Recipient Details Grid */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Recipient Name</span>
              <p className="text-base font-semibold text-slate-800 mt-0.5">{recipientName}</p>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Contact / Email</span>
              <p className="text-base font-medium text-slate-700 mt-0.5">{recipientEmail}</p>
            </div>
          </div>

          {/* Description & Body Content */}
          <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
            <p>{description}</p>
            <p>
              This official certification confirms full adherence to all mandated compliance protocols. All rights, privileges, and responsibilities associated with this document take effect immediately upon validation.
            </p>
            
            {/* Structured Table */}
            <div className="mt-6 border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Parameter / Item</th>
                    <th className="py-3 px-4">Status / Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  <tr>
                    <td className="py-3 px-4 font-medium">Compliance Verification</td>
                    <td className="py-3 px-4 text-emerald-600 font-semibold">Passed (100%)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Security Clearance Level</td>
                    <td className="py-3 px-4">Level 3 - Enterprise Standard</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Issuing Authority</td>
                    <td className="py-3 px-4">Central Regulatory Board</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer & Signature Section */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div className="text-xs text-slate-500 max-w-sm">
              <p className="font-semibold text-slate-700 mb-1">Important Notice:</p>
              <p>Giving false or misleading information is a serious offense. Retain this document in a secure location for your official records.</p>
            </div>
            <div className="text-center sm:text-right min-w-[200px]">
              <div className="h-14 mb-2 flex items-end justify-center sm:justify-end">
                <span className="font-serif italic text-lg text-indigo-900 border-b border-slate-400 pb-1 px-4">
                  {signature}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Authorized Signature</p>
              <p className="text-[10px] text-slate-400">Department of Regulatory Affairs</p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
            <span>Document ID: {documentNumber}</span>
            <span>Page 1 of 1</span>
            <span>Secure Digital Record</span>
          </div>
        </div>

      </div>
    </div>
  );
}
