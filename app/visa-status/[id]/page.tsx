// app/visa-status/[id]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';

// আপনার ডাটাবেস বা এপিআই থেকে ডাটা নিয়ে আসার ফাংশন
async function getVisaData(id: string) {
  // উদাহরণ: আপনি আপনার এপিআই অথবা Redis থেকে ডাটা ফেচ করবেন
  const res = await fetch(`https://your-domain.com/api/visa-status?passport=${id}`, {
    cache: 'no-store' // রিয়েলটাইম ডাটার জন্য
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function VisaDetailsPage({ params }: { params: { id: string } }) {
  const visaData = await getVisaData(params.id);

  // ডাটা না পাওয়া গেলে
  if (!visaData) {
    return <div className="p-10 text-center">Data not found for this passport number.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {/* এখানে আগের মতো ডিজাইনটি থাকবে, শুধু ভেরিয়েবলগুলো ডাইনামিক করে দিন */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-blue-600 p-8 text-white text-center">
          <h1 className="text-2xl font-bold">{visaData.name}</h1>
          <p className="opacity-80">Passport: {visaData.passport}</p>
          <span className="inline-block bg-green-500 text-white px-4 py-1 rounded-full mt-3">
            {visaData.status}
          </span>
        </div>

        {/* বাকি ডিটেইলস এখানে একইভাবে দেখান, শুধু {visaData.field_name} ব্যবহার করুন */}
        <div className="p-8">
           <p>Email: {visaData.email}</p>
           {/* ... অন্যান্য ডাটা */}
        </div>
      </div>
    </div>
  );
}
