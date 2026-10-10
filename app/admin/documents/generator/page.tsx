"use client";

import React, { useState } from "react";

// ১. টাইপ ডেফিনিশন (সব ফিল্ডের নাম এখান থেকে নির্ধারিত)
export interface DocumentData {
  documentType: "visa_482" | "job_offer" | "emedical" | "police_clearance" | "work_permit";
  fullName: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: string;
  issueDate: string;
  expiryDate: string;
  applicationId: string;
  grantNumber: string;
  sponsorName: string;
  occupation: string;
  salaryOrWage: string;
  healthHAPId: string;
  clearanceStatus: string;
}

export default function DocumentGeneratorPage() {
  // ২. স্টেট ডেটা সেটআপ
  const [docData, setDocData] = useState<DocumentData>({
    documentType: "visa_482",
    fullName: "MD JOHN DOE",
    passportNumber: "A12345678",
    nationality: "Bangladeshi",
    dateOfBirth: "1990-01-01",
    issueDate: "2026-10-10",
    expiryDate: "2030-10-10",
    applicationId: "APP-998877",
    grantNumber: "G-11223344",
    sponsorName: "Global Tech Pty Ltd",
    occupation: "Software Engineer",
    salaryOrWage: "$95,000 AUD",
    healthHAPId: "HAP-883321",
    clearanceStatus: "PASSED",
  });

  // ফর্মের ইনপুট চেঞ্জ হ্যান্ডলার
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDocData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // প্রিন্ট বা পিডিএফ জেনারেট ফাংশন
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* প্রিন্ট সিএসএস স্টাইল */}
      <style jsx global>{`
        @media print {
          body {
            background-color: #ffffff !important;
          }
          .no-print {
            display: none !important;
          }
          .print-area {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>

      {/* নেভিগেশন ও হেডার (প্রিন্ট টাইমে হাইড হবে) */}
      <div className="no-print mb-6 flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Official Document Generator
          </h1>
          <p className="text-sm text-gray-600">
            Generate and print official migration documents with verified formatting.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="rounded bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          Print / Save as PDF
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* বাম পাশের ফর্ম (প্রিন্ট টাইমে হাইড হবে) */}
        <div className="no-print rounded-lg border bg-white p-6 shadow-sm lg:col-span-5">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">
            Document Information Form
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Document Type
              </label>
              <select
                name="documentType"
                value={docData.documentType}
                onChange={handleChange}
                className="w-full rounded border p-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="visa_482">Australia Visa 482 Notice</option>
                <option value="job_offer">Costa Job Offer Letter</option>
                <option value="emedical">eMedical Health Clearance</option>
                <option value="police_clearance">Police Clearance Certificate</option>
                <option value="work_permit">Work Permit Notice</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={docData.fullName}
                onChange={handleChange}
                className="w-full rounded border p-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Passport Number
                </label>
                <input
                  type="text"
                  name="passportNumber"
                  value={docData.passportNumber}
                  onChange={handleChange}
                  className="w-full rounded border p-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nationality
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={docData.nationality}
                  onChange={handleChange}
                  className="w-full rounded border p-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={docData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full rounded border p-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Application ID
                </label>
                <input
                  type="text"
                  name="applicationId"
                  value={docData.applicationId}
                  onChange={handleChange}
                  className="w-full rounded border p-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Grant / Ref Number
                </label>
                <input
                  type="text"
                  name="grantNumber"
                  value={docData.grantNumber}
                  onChange={handleChange}
                  className="w-full rounded border p-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Sponsor / Employer
                </label>
                <input
                  type="text"
                  name="sponsorName"
                  value={docData.sponsorName}
                  onChange={handleChange}
                  className="w-full rounded border p-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Occupation / Position
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={docData.occupation}
                  onChange={handleChange}
                  className="w-full rounded border p-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Salary / Wage
                </label>
                <input
                  type="text"
                  name="salaryOrWage"
                  value={docData.salaryOrWage}
                  onChange={handleChange}
                  className="w-full rounded border p-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Issue Date
                </label>
                <input
                  type="date"
                  name="issueDate"
                  value={docData.issueDate}
                  onChange={handleChange}
                  className="w-full rounded border p-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={docData.expiryDate}
                  onChange={handleChange}
                  className="w-full rounded border p-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  HAP / Health ID
                </label>
                <input
                  type="text"
                  name="healthHAPId"
                  value={docData.healthHAPId}
                  onChange={handleChange}
                  className="w-full rounded border p-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Clearance Status
                </label>
                <input
                  type="text"
                  name="clearanceStatus"
                  value={docData.clearanceStatus}
                  onChange={handleChange}
                  className="w-full rounded border p-2 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ডান পাশের ডকুমেন্টের প্রিভিউ ও প্রিন্ট এলাকা */}
        <div className="lg:col-span-7">
          <div className="print-area min-h-[800px] rounded-lg border bg-white p-8 shadow-sm">
            {/* হেডার লোগো / টাইটেল এলাকা */}
            <div className="border-b pb-4 text-center">
              <h2 className="text-xl font-bold uppercase tracking-wide text-gray-900">
                {docData.documentType === "visa_482" && "VISA GRANT NOTICE"}
                {docData.documentType === "job_offer" && "JOB OFFER LETTER"}
                {docData.documentType === "emedical" && "eMEDICAL HEALTH CLEARANCE"}
                {docData.documentType === "police_clearance" && "POLICE CLEARANCE CERTIFICATE"}
                {docData.documentType === "work_permit" && "OFFICIAL WORK PERMIT"}
              </h2>
              <p className="text-xs text-gray-500">
                Global Migration Hub Official Document Service
              </p>
            </div>

            {/* ডায়নামিক কন্টেন্ট এলাকা */}
            <div className="mt-6 space-y-6 text-sm text-gray-800">
              <div className="rounded border bg-gray-50 p-4">
                <h3 className="mb-2 font-semibold text-gray-700">
                  Applicant Details
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <p>
                    <strong className="text-gray-600">Full Name:</strong>{" "}
                    {docData.fullName}
                  </p>
                  <p>
                    <strong className="text-gray-600">Passport No:</strong>{" "}
                    {docData.passportNumber}
                  </p>
                  <p>
                    <strong className="text-gray-600">Nationality:</strong>{" "}
                    {docData.nationality}
                  </p>
                  <p>
                    <strong className="text-gray-600">Date of Birth:</strong>{" "}
                    {docData.dateOfBirth}
                  </p>
                </div>
              </div>

              <div className="rounded border bg-gray-50 p-4">
                <h3 className="mb-2 font-semibold text-gray-700">
                  Document Details
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <p>
                    <strong className="text-gray-600">Application ID:</strong>{" "}
                    {docData.applicationId}
                  </p>
                  <p>
                    <strong className="text-gray-600">Grant/Ref No:</strong>{" "}
                    {docData.grantNumber}
                  </p>
                  <p>
                    <strong className="text-gray-600">Issue Date:</strong>{" "}
                    {docData.issueDate}
                  </p>
                  <p>
                    <strong className="text-gray-600">Expiry Date:</strong>{" "}
                    {docData.expiryDate}
                  </p>
                </div>
              </div>

              <div className="rounded border bg-gray-50 p-4">
                <h3 className="mb-2 font-semibold text-gray-700">
                  Sponsorship & Position
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <p>
                    <strong className="text-gray-600">Sponsor/Company:</strong>{" "}
                    {docData.sponsorName}
                  </p>
                  <p>
                    <strong className="text-gray-600">Occupation:</strong>{" "}
                    {docData.occupation}
                  </p>
                  <p>
                    <strong className="text-gray-600">Salary/Wage:</strong>{" "}
                    {docData.salaryOrWage}
                  </p>
                  <p>
                    <strong className="text-gray-600">Status:</strong>{" "}
                    <span className="font-semibold text-green-600">APPROVED</span>
                  </p>
                </div>
              </div>

              {/* অফিশিয়াল নোট ও নোটিশ */}
              <div className="mt-8 border-t pt-4 text-xs text-gray-500">
                <p>
                  <strong>Notice:</strong> This document is generated by the Global Migration Hub document system. Any unauthorized alteration or reproduction is strictly prohibited.
                </p>
                <div className="mt-6 flex justify-between">
                  <div>
                    <p className="font-semibold text-gray-700">Authorized Signature</p>
                    <p className="mt-8 border-t pt-1">Immigration Officer</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-700">Verification ID</p>
                    <p className="mt-1 font-mono text-gray-900">{docData.grantNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
