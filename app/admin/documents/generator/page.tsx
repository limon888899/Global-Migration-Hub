"use client";
​import React, { useState } from 'react';
​const documentTypes = [
{ id: 'grant-notification', name: '482 Visa Grant Notice', category: 'Immigration Australia', icon: 'fa-award' },
{ id: 'costa-job-offer', name: 'Costa Job Offer Letter', category: 'Employment', icon: 'fa-briefcase' },
{ id: 'emedical-report', name: 'Official eMedical Clearance', category: 'Health & Medical', icon: 'fa-heart-pulse' },
{ id: 'police-clearance', name: 'Police Clearance Certificate', category: 'Government & Police', icon: 'fa-shield-halved' },
{ id: 'work-permit-visa', name: 'Work Permit Visa Document', category: 'Immigration Australia', icon: 'fa-passport' },
{ id: 'form-1401', name: 'Form 1401 Application Record', category: 'Application Forms', icon: 'fa-file-lines' }
];
​export default function DocumentGeneratorPage() {
const [currentDocId, setCurrentDocId] = useState('grant-notification');
const [docData, setDocData] = useState({
fullName: 'JAKIR HOSSAIN',
dob: '10 Jan 1983',
passportNo: 'EL0519627',
passportCountry: 'BANGLADESH',
phone: '+8801834148731',
email: 'jakir.hossain@example.com',
address: 'DAHAR PACHURIA, NAGARPUR, DHUBURIA 1937, TANGAIL, BANGLADESH',
fatherName: 'ABUL HALIM',
motherName: 'SUFIA BEGUM',
nidNumber: '1450190143',
grantDate: '03 August 2026',
mustNotArriveAfter: '03 August 2028',
lengthOfStay: 'Until 03 August 2028',
visaGrantNumber: '1859584856975',
applicationId: '590670018',
trn: 'EGP7D6VTFU',
sponsor: 'RTS Group Pty Ltd',
occupation: 'Software Engineer (261313)',
remuneration: '$3,800 AUD / Month',
hoursPerWeek: '48',
position: 'Fruit Packaging Staff / Operations Officer',
location: 'Melbourne Main Facility, VIC, Australia',
contractPeriod: '3 Years (Renewable)',
monthlyRemuneration: '3,600 AUD',
hapId: 'HAP-2609120045-AU',
clinicName: 'ETIHAD MEDICAL CENTRE LIMITED',
examDate: '28 July 2026',
refNo: '9DK7F21',
policeStation: 'Adamdighi Police Station',
district: 'Bogura',
issueDate: '28 July 2026',
permitNo: '79V543LG80',
startDate: '30 June 2025',
endDate: '29 June 2029',
placeOfBirth: 'Cumilla, Bangladesh'
});
​const activeDoc = documentTypes.find(d => d.id === currentDocId) || documentTypes[0];
​const updateData = (key: string, value: string) => {
setDocData(prev => ({ ...prev, [key]: value }));
};
​const getFields = () => {
switch (currentDocId) {
case 'grant-notification':
return [
{ label: 'Full Legal Name', key: 'fullName' },
{ label: 'Date of Birth', key: 'dob' },
{ label: 'Passport Number', key: 'passportNo' },
{ label: 'Passport Country', key: 'passportCountry' },
{ label: 'Visa Grant Date', key: 'grantDate' },
{ label: 'Visa Grant Number', key: 'visaGrantNumber' },
{ label: 'Application ID', key: 'applicationId' },
{ label: 'Transaction Reference Number (TRN)', key: 'trn' },
{ label: 'Sponsor / Business Name', key: 'sponsor' },
{ label: 'Nominated Occupation', key: 'occupation' },
{ label: 'Remuneration Rate', key: 'remuneration' }
];
case 'costa-job-offer':
return [
{ label: 'Candidate Full Name', key: 'fullName' },
{ label: 'Passport Number', key: 'passportNo' },
{ label: 'Residential Address', key: 'address' },
{ label: 'Job Position Title', key: 'position' },
{ label: 'Work Facility / Location', key: 'location' },
{ label: 'Contract Duration', key: 'contractPeriod' },
{ label: 'Monthly Remuneration', key: 'monthlyRemuneration' },
{ label: 'Offer Date', key: 'grantDate' }
];
case 'emedical-report':
return [
{ label: 'Candidate Full Name', key: 'fullName' },
{ label: 'Father Name', key: 'fatherName' },
{ label: 'Passport Number', key: 'passportNo' },
{ label: 'National ID (NID)', key: 'nidNumber' },
{ label: 'HAP Identification ID', key: 'hapId' },
{ label: 'Medical Clinic Name', key: 'clinicName' },
{ label: 'Examination Date', key: 'examDate' }
];
case 'police-clearance':
return [
{ label: 'Applicant Full Name', key: 'fullName' },
{ label: 'Father Name', key: 'fatherName' },
{ label: 'Passport Number', key: 'passportNo' },
{ label: 'Police Clearance Ref No', key: 'refNo' },
{ label: 'Police Station (P/S)', key: 'policeStation' },
{ label: 'District Name', key: 'district' },
{ label: 'Issue Date', key: 'issueDate' }
];
case 'work-permit-visa':
return [
{ label: 'Full Legal Name', key: 'fullName' },
{ label: 'Passport Number', key: 'passportNo' },
{ label: 'Permit / Visa Number', key: 'permitNo' },
{ label: 'Valid From Date', key: 'startDate' },
{ label: 'Valid Until Date', key: 'endDate' },
{ label: 'Sponsor / Employer', key: 'sponsor' },
{ label: 'Contact Phone Number', key: 'phone' }
];
default:
return [
{ label: 'Full Legal Name', key: 'fullName' },
{ label: 'Passport Number', key: 'passportNo' },
{ label: 'Date of Birth', key: 'dob' },
{ label: 'Email Address', key: 'email' },
{ label: 'Phone Number', key: 'phone' },
{ label: 'National ID Number', key: 'nidNumber' }
];
}
};
​return (
<div className="space-y-6">
<div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
<div>
<h1 className="text-xl font-bold text-slate-900">Document Generator Suite</h1>
<p className="text-xs text-slate-500">Official Template & Field Manager</p>
</div>
<button
onClick={() => window.print()}
className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center space-x-2 shadow"
>
<i className="fa-solid fa-file-pdf"></i>
<span>Print / Save PDF</span>
</button>
</div>
​<div className="flex flex-col lg:flex-row gap-6">
<aside className="w-full lg:w-80 flex-shrink-0 space-y-4">
<div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
<h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">Document Templates</h2>
<nav className="space-y-1.5">
{documentTypes.map(doc => (
<button
key={doc.id}
onClick={() => setCurrentDocId(doc.id)}
className={w-full text-left px-3 py-2.5 rounded-xl text-xs md:text-sm font-medium transition flex items-center space-x-3 ${currentDocId === doc.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'}}
>
<i className={fa-solid ${doc.icon} w-5 text-center ${currentDocId === doc.id ? 'text-white' : 'text-blue-600'}}></i>
<div className="truncate">
<p className="font-semibold leading-tight truncate">{doc.name}</p>
<p className="text-[10px] opacity-75 truncate">{doc.category}</p>
</div>
</button>
))}
</nav>
</div>
</aside>
​<main className="flex-grow flex flex-col space-y-6">
<section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
<div className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center">
<div className="flex items-center space-x-2">
<i className="fa-solid fa-pen-to-square text-blue-400"></i>
<h3 className="font-semibold text-sm">তথ্য সম্পাদনা: {activeDoc.name}</h3>
</div>
<span className="bg-blue-900 text-blue-200 text-xs px-2.5 py-1 rounded-full font-medium border border-blue-700">{activeDoc.category}</span>
</div>
​<div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
{getFields().map(f => (
<div key={f.key}>
<label className="block text-xs font-semibold text-slate-700 mb-1">{f.label}</label>
<input
type="text"
value={(docData as any)[f.key] || ''}
onChange={(e) => updateData(f.key, e.target.value)}
className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none transition bg-slate-50 focus:bg-white text-slate-900"
/>
</div>
))}
</div>
</section>
​<section className="bg-white rounded-xl border border-slate-300 p-8 md:p-12 shadow-sm min-h-[800px]">
{currentDocId === 'grant-notification' && (
<div className="space-y-6 text-slate-900 text-sm font-sans max-w-4xl mx-auto leading-relaxed">
<div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
<div>
<h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Australian Government</h1>
<p className="text-sm font-semibold text-slate-700">Department of Home Affairs</p>
</div>
<div className="text-right text-xs text-slate-600">
<p className="font-bold text-slate-900 uppercase">NOTIFICATION OF GRANT</p>
<p>Date: {docData.grantDate}</p>
</div>
</div>
<p>Dear <strong>{docData.fullName}</strong>,</p>
<p className="text-justify">
We wish to advise that a decision has been made on your application. The Department of Home Affairs has granted you a <strong>Temporary Skill Shortage (subclass 482) visa</strong> on <strong>{docData.grantDate}</strong>.
</p>
<div className="bg-slate-50 border border-slate-300 p-4 rounded-md space-y-2">
<h3 className="font-bold border-b border-slate-300 pb-1 text-slate-900 uppercase text-xs">Visa Summary</h3>
<div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
<div><span className="font-semibold">Applicant Name:</span> {docData.fullName}</div>
<div><span className="font-semibold">Date of Birth:</span> {docData.dob}</div>
<div><span className="font-semibold">Passport Number:</span> {docData.passportNo}</div>
<div><span className="font-semibold">Passport Country:</span> {docData.passportCountry}</div>
<div><span className="font-semibold">Visa Grant Number:</span> {docData.visaGrantNumber}</div>
<div><span className="font-semibold">Application ID:</span> {docData.applicationId}</div>
<div><span className="font-semibold">Transaction Reference (TRN):</span> {docData.trn}</div>
<div><span className="font-semibold">Sponsoring Employer:</span> {docData.sponsor}</div>
</div>
</div>
<div>
<h3 className="font-bold text-slate-900 mb-2 border-b pb-1 uppercase text-xs">Position & Employment Particulars</h3>
<table className="w-full text-xs text-left border-collapse border border-slate-300">
<tbody>
<tr className="border-b border-slate-300"><td className="p-2 font-semibold bg-slate-100 border-r w-1/3">Nominated Occupation</td><td className="p-2">{docData.occupation}</td></tr>
<tr className="border-b border-slate-300"><td className="p-2 font-semibold bg-slate-100 border-r">Agreed Remuneration</td><td className="p-2">{docData.remuneration}</td></tr>
<tr><td className="p-2 font-semibold bg-slate-100 border-r">Nominated Standard Working Hours</td><td className="p-2">{docData.hoursPerWeek} Hours / Week</td></tr>
</tbody>
</table>
</div>
<div className="pt-6 border-t border-slate-300 text-xs text-slate-700">
<p>Yours sincerely,</p>
<p className="font-bold text-slate-900 mt-2">Department of Home Affairs</p>
</div>
</div>
)}
​{currentDocId === 'costa-job-offer' && (
<div className="space-y-6 text-slate-900 font-sans max-w-4xl mx-auto leading-relaxed">
<div className="flex justify-between items-start border-b-2 border-emerald-800 pb-4">
<div>
<h1 className="text-3xl font-extrabold tracking-widest text-emerald-800">costa</h1>
<p className="text-xs tracking-widest uppercase font-bold text-emerald-600">well grown</p>
</div>
<div className="text-right text-xs text-slate-600">
<p><span className="font-semibold">Date:</span> {docData.grantDate}</p>
</div>
</div>
<div className="text-xs space-y-1 bg-slate-50 p-3 rounded border border-slate-200">
<p><strong>To Candidate:</strong> Mr. {docData.fullName}</p>
<p><strong>Passport Identification No:</strong> {docData.passportNo}</p>
<p><strong>Residential Address:</strong> {docData.address}</p>
</div>
<h2 className="text-center text-sm font-bold underline text-slate-900 uppercase">Formal Offer of Employment & Terms of Engagement</h2>
<p className="text-xs text-justify">
We are pleased to offer you the position of <strong>{docData.position}</strong> with Costa Group Holdings Pty Ltd.
</p>
<table className="w-full text-xs border border-slate-300">
<tbody>
<tr className="border-b"><td className="p-2 border font-semibold">Position Title</td><td className="p-2 border">{docData.position}</td></tr>
<tr className="border-b"><td className="p-2 border font-semibold">Primary Work Location</td><td className="p-2 border">{docData.location}</td></tr>
<tr className="border-b"><td className="p-2 border font-semibold">Contract Period</td><td className="p-2 border">{docData.contractPeriod}</td></tr>
<tr><td className="p-2 border font-semibold">Monthly Remuneration</td><td className="p-2 border">{docData.monthlyRemuneration}</td></tr>
</tbody>
</table>
</div>
)}
​{currentDocId === 'emedical-report' && (
<div className="space-y-4 text-xs font-sans max-w-4xl mx-auto border-2 border-slate-800 p-6 rounded-lg">
<div className="bg-slate-900 text-white p-4 rounded flex justify-between items-center">
<div>
<h1 className="text-base font-bold uppercase">eMedical Official System Medical Report</h1>
<p className="text-xs text-slate-300">{docData.clinicName}</p>
</div>
<span className="bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-1 rounded">CLEARED</span>
</div>
<div className="grid grid-cols-2 gap-4 border-b border-slate-300 pb-3 font-semibold text-slate-800">
<p>HAP ID: <span className="font-mono">{docData.hapId}</span></p>
<p>Examination Date: {docData.examDate}</p>
</div>
<div className="grid grid-cols-2 gap-3 p-2 border rounded border-slate-200">
<p><strong>Full Name:</strong> {docData.fullName}</p>
<p><strong>Father's Name:</strong> {docData.fatherName}</p>
<p><strong>Passport Number:</strong> {docData.passportNo}</p>
<p><strong>NID:</strong> {docData.nidNumber}</p>
</div>
</div>
)}
​{currentDocId === 'police-clearance' && (
<div className="space-y-6 text-slate-900 max-w-3xl mx-auto border-4 border-double border-slate-800 p-8 text-center font-serif">
<h1 className="text-base font-bold uppercase">Government of Bangladesh</h1>
<p className="text-sm font-semibold">{docData.policeStation}, {docData.district}</p>
<h2 className="text-lg font-bold underline my-6 uppercase">POLICE CLEARANCE CERTIFICATE</h2>
<p className="text-sm leading-relaxed text-justify indent-8 font-sans">
This is to certify that <strong>Mr. {docData.fullName}</strong>, Son of <strong>{docData.fatherName}</strong>, holding Passport No. <strong>{docData.passportNo}</strong>, has no adverse or criminal record.
</p>
</div>
)}
​{currentDocId === 'work-permit-visa' && (
<div className="space-y-6 text-slate-900 max-w-4xl mx-auto font-sans leading-relaxed">
<div className="border-b-2 border-slate-900 pb-4 flex justify-between items-center">
<div>
<h1 className="text-xl font-bold">Australian Work Permit Document</h1>
<p className="text-sm text-slate-600">Department of Home Affairs</p>
</div>
<div className="bg-slate-900 text-white px-3 py-1 text-xs font-mono rounded">
PERMIT ID: {docData.permitNo}
</div>
</div>
<div className="bg-slate-50 border p-4 rounded-lg grid grid-cols-2 gap-3 text-xs">
<p><strong>Full Name:</strong> {docData.fullName}</p>
<p><strong>Passport:</strong> {docData.passportNo}</p>
<p><strong>Valid From:</strong> {docData.startDate}</p>
<p><strong>Valid Until:</strong> {docData.endDate}</p>
</div>
</div>
)}
​{currentDocId === 'form-1401' && (
<div className="space-y-6 text-slate-900 max-w-4xl mx-auto font-sans">
<h1 className="text-xl font-bold border-b pb-2">Form 1401 Application Record</h1>
<div className="bg-slate-50 border p-4 rounded-lg grid grid-cols-2 gap-3 text-xs">
<p><strong>Full Name:</strong> {docData.fullName}</p>
<p><strong>Passport:</strong> {docData.passportNo}</p>
<p><strong>Email:</strong> {docData.email}</p>
<p><strong>Phone:</strong> {docData.phone}</p>
</div>
</div>
)}
</section>
</main>
</div>
</div>
);
}
