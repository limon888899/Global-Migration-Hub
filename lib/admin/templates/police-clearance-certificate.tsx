import React from 'react';

interface PoliceClearanceProps {
  documentTitle?: string;
  recipientName?: string;
  date?: string;
  documentNumber?: string;
  description?: string;
  signature?: string;
}

export default function PoliceClearanceCertificate({
  documentTitle = "Police Clearance Certificate",
  recipientName = "MD. MIZANUR AKANDA",
  date = "28-JUL-2026",
  documentNumber = "9DK7F21",
  description = "No adverse information found on record.",
  signature = "Superintendent of Police, Bogura"
}: PoliceClearanceProps) {
  return (
    <div className="max-w-[210mm] mx-auto bg-white shadow-lg p-10 my-8 print:shadow-none print:m-0 print:p-6 text-slate-800 font-sans text-sm leading-relaxed border-8 border-double border-slate-300">
      <div className="text-center mb-6">
        <h1 className="text-xs uppercase tracking-widest text-slate-500">Government of the People's Republic of Bangladesh</h1>
        <h2 className="text-base font-bold text-slate-900 mt-1">Adamdighi Police Station, Bogura</h2>
        <h3 className="text-lg font-extrabold text-indigo-900 mt-3">{documentTitle}</h3>
      </div>

      <div className="flex justify-between text-xs bg-slate-50 p-3 border rounded mb-6">
        <span>Ref No: <strong>{documentNumber}</strong></span>
        <span>Dated: <strong>{date}</strong></span>
      </div>

      <div className="text-slate-700 leading-loose mb-8 text-justify">
        <p>
          The character and antecedents of <strong className="text-slate-900">{recipientName}</strong> (Passport No: <strong>EK0480130</strong>) have been verified and 
          <span className="font-semibold text-slate-900"> {description}</span>
        </p>
        <p className="mt-4 text-xs text-slate-500">
          This certificate is issued in pursuance of Ministry of Home Affairs Memo No. Nirdesh-2/75-Pt.2152-Bohi(1), dated 19th May, 1977.
        </p>
      </div>

      <div className="mt-16 pt-6 border-t flex justify-between items-end text-xs">
        <div>
          <p className="text-slate-400 italic">Digital copy from Bangladesh Police Online PCC System.</p>
        </div>
        <div className="text-center">
          <div className="font-serif font-bold text-slate-800 mb-1">{signature}</div>
          <p className="text-slate-600">District Special Branch, Bogura</p>
        </div>
      </div>
    </div>
  );
}
