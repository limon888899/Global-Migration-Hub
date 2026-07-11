import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Globe, Mail, Phone, MapPin, FileText, Calendar, ArrowLeft, X } from 'lucide-react';

// আপনার প্রজেক্টের বিদ্যমান Redis বা API লজিক কল করার জন্য
async function getVisaData(passportId: string) {
  try {
    // Next.js Server Component থেকে সরাসরি আপনার API কল 
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/visa-status?passport=${passportId}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching visa data:", error);
    return null;
  }
}

export default async function VisaStatusInterface({ params }: { params: { id: string } }) {
  const visaData = await getVisaData(params.id);

  // ডাটা না পেলে সরাসরি 404 বা নট ফাউন্ড দেখাবে
  if (!visaData) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-slate-200 py-6 px-4 font-sans">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        
        {/* Header Section (Blue Background) */}
        <div className="bg-[#3b82f6] p-6 text-white relative">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="flex items-center text-sm font-medium hover:text-gray-200 transition">
              <ArrowLeft size={16} className="mr-1" /> Search another passport
            </Link>
            <Link href="/">
              <X size={20} className="hover:text-gray-200 cursor-pointer transition" />
            </Link>
          </div>
          
          <div className="flex flex-col items-center text-center">
            {/* User Image Placeholder - Replace src with visaData.imageUrl if available */}
            <div className="w-20 h-20 bg-white rounded-full p-1 mb-3">
              <img 
                src={visaData.imageUrl || "https://ui-avatars.com/api/?name=" + visaData.name} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <h1 className="text-xl font-bold tracking-wide uppercase">{visaData.name}</h1>
            <p className="text-sm opacity-90 mt-1">Passport: {params.id}</p>
            <span className="mt-3 bg-[#10b981] text-white text-xs font-bold px-3 py-1 rounded-full">
              {visaData.status || "Visa Approved"}
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <InfoCard icon={<Globe size={18}/>} label="NATIONALITY" value={visaData.nationality || "BANGLADESHI"} />
            <InfoCard icon={<Mail size={18}/>} label="EMAIL" value={visaData.email} />
            <InfoCard icon={<Phone size={18}/>} label="PHONE" value={visaData.phone} />
            <InfoCard icon={<MapPin size={18}/>} label="DESTINATION" value={visaData.destination} />
            <InfoCard icon={<FileText size={18}/>} label="VISA TYPE" value={visaData.visaType || "Work Permit / Skilled Worker"} />
            <InfoCard icon={<Calendar size={18}/>} label="SUBMITTED" value={visaData.submittedDate} />
          </div>

          {/* Application Progress */}
          <div className="mb-8 border-t border-gray-100 pt-6">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Application Progress</h3>
            <div className="space-y-4">
              {['Submitted', 'Processing', 'Document Verified', 'Visa Approved'].map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-blue-500" fill="#eff6ff" />
                  <span className="text-sm font-medium text-gray-700">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Documents Section */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Documents</h3>
            
            {/* Passport Copy Area */}
            <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 flex items-center gap-2 border-b border-gray-200">
                <FileText size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Passport Copy</span>
              </div>
              <div className="p-4 bg-white">
                {visaData.passportCopyUrl ? (
                   <img src={visaData.passportCopyUrl} alt="Passport Copy" className="w-full h-auto rounded" />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 rounded">
                    Image Not Available
                  </div>
                )}
              </div>
            </div>

            {/* Job Letter Area */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 flex items-center gap-2">
                <FileText size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Job Letter</span>
              </div>
               {/* Expandable content can go here */}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Small Card Component
function InfoCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-3 border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition">
      <div className="text-blue-400 bg-blue-50 p-2 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-gray-500 font-semibold tracking-wider">{label}</p>
        <p className="text-sm font-medium text-gray-800 truncate">{value || 'N/A'}</p>
      </div>
    </div>
  );
}
