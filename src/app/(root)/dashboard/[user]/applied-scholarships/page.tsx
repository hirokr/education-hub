'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'sonner';

interface ScholarshipApplication {
  id: string;
  status: string;
  createdAt: string;
  scholarship: {
    scholarship_id: string;
    title: string;
    sponsor: string;
    amount: string;
    deadline: string;
    location: string;
  };
}

export default function AppliedScholarshipsPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);

  useEffect(() => {
    if (!session?.user) return;
    fetch('/api/applied-scholarships')
      .then((res) => res.json())
      .then((data) => setApplications(data.applications || []));
  }, [session]);

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <h1 className="text-3xl font-bold mb-8">Applied Scholarships</h1>
      {applications.length === 0 ? (
        <p className="text-gray-500">No scholarship applications yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((application) => (
            <div key={application.id} className="relative border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-[#0A0A0A]">
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
              </div>
              
              <Link href={`/scholarships/${application.scholarship.scholarship_id}`} className="block">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
                    {application.scholarship.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Sponsored by</span>
                    <p className="text-lg font-semibold text-black dark:text-[#D1E6FF]">
                      {application.scholarship.sponsor}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-600 dark:text-gray-300">Amount</span>
                    <p className="text-xl font-bold text-black dark:text-[#D1E6FF]">
                      {application.scholarship.amount}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-600 dark:text-gray-300">Location</span>
                    <p className="text-base font-semibold text-black dark:text-white">
                      {application.scholarship.location}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-600 dark:text-gray-300">Applied On</span>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-600 dark:text-gray-300">Deadline</span>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {new Date(application.scholarship.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
