import React from 'react';

interface WorkPermitVisaProps {
  documentTitle?: string;
  recipientName?: string;
  date?: string;
  documentNumber?: string;
  description?: string;
  signature?: string;
}

export default function WorkPermitVisa({
  documentTitle = "Work Permit & Visa Authorization",
  recipientName = "MOHAMMAD OLI ULLAH",
  date = "28/05/2025",
  documentNumber = "79V543LG80",
  description = "Temporary Skill Shortage (Subclass 482) Visa Employment Permit.",
  signature = "Paul Barron (Human Resource, RTS Group)"
}: WorkPermitVisaProps) {
  return (
    <div className="max-w-[210mm] mx-auto bg-white shadow-lg p-10 my-8 print:shadow-none print:m-0 print:p-6 text-slate-800 font-sans text-sm leading-relaxed">
      <div className="border-b pb-4 mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-base font-bold text-slate-900">Australian Government</h1>
          <p className="text-xs text-slate-500">Department of Home Affairs, Canberra</p>
          <h2 className="text-xl font-extrabold text-indigo-700 mt-2">{documentTitle}</h2>
        </div>
        <div className="text-right text-xs bg-slate-50 p-3 border rounded">
          <p>Permit No: <strong className="text-slate-900">{documentNumber}</strong></p>
          <p>Date of Issue: <strong className="text-slate-900">{date}</strong></p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-900 text-white px-3 py-1.5 mb-3">
          Personal Details of Permit Holder
        </h3>
        <div className="grid grid-cols-2 gap-3 text-xs border p-4 rounded bg-slate-50">
          <div><span className="text-slate-500">Full Name:</span> <strong className="text-slate-900">{recipientName}</strong></div>
          <div><span className="text-slate-500">Document No:</span> <strong className="text-slate-900">EJ0660984</strong></div>
          <div><span className="text-slate-500">Nationality:</span> <strong className="text-slate-900">Bangladeshi</strong></div>
          <div><span className="text-slate-500">Description:</span> <strong className="text-slate-900">{description}</strong></div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t flex justify-between items-end text-xs">
        <div>
          <p className="text-slate-500">Authorized Government Official & Employer Acknowledgment</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-slate-800">{signature}</p>
          <p className="text-slate-500">Australia</p>
        </div>
      </div>
    </div>
  );
}
