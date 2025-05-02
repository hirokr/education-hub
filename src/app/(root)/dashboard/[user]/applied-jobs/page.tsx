'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface JobApplication {
  id: string;
  status: string;
  createdAt: string;
  job: {
    job_id: string;
    job_title: string;
    company_name: string;
    company_logo: string;
    location: string;
    position: string;
    salary_range: {
      min: number;
      max: number;
    };
    job_tags?: string[];
    job_description?: string;
    posted_on?: string;
    deadline: string;
  };
}

export default function AppliedJobsPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<JobApplication[]>([]);

  useEffect(() => {
    if (!session?.user) return;
    fetch('/api/applied-jobs')
      .then((res) => res.json())
      .then((data) => setApplications(data.applications || []));
  }, [session]);

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <h1 className="text-3xl font-bold mb-8">Applied Jobs</h1>
      {applications.length === 0 ? (
        <p className="text-gray-500">No job applications yet.</p>
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
              <div className="flex items-start mb-6 pr-12">
                <Image
                  src={application.job.company_logo}
                  alt={`${application.job.company_name} logo`}
                  width={56}
                  height={56}
                  className="rounded-full mr-4"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-1">{application.job.job_title}</h2>
                  <p className="text-lg font-semibold text-black dark:text-[#D1E6FF]">{application.job.company_name}</p>
                </div>
              </div>
              {application.job.job_description && (
                <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed mb-6">
                  {application.job.job_description.length > 150
                    ? `${application.job.job_description.substring(0, 150)}...`
                    : application.job.job_description}
                </p>
              )}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-gray-600 dark:text-gray-300">Location</span>
                  <p className="text-base font-semibold text-black dark:text-white">{application.job.location}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-gray-600 dark:text-gray-300">Position</span>
                  <p className="text-base font-semibold text-black dark:text-white">{application.job.position}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-gray-600 dark:text-gray-300">Application Deadline</span>
                  <p className="text-lg font-semibold text-black dark:text-[#D1E6FF]">
                    {new Date(application.job.deadline).toLocaleDateString()}
                  </p>
                </div>
                {application.job.posted_on && (
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-600 dark:text-gray-300">Posted</span>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {new Date(application.job.posted_on).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-gray-600 dark:text-gray-300">Salary Range</span>
                  <p className="text-base font-semibold text-black dark:text-white">
                    {formatSalary(application.job.salary_range.min)} - {formatSalary(application.job.salary_range.max)}
                  </p>
                </div>
              </div>
              {application.job.job_tags && application.job.job_tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {application.job.job_tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm font-medium bg-black/5 dark:bg-[#D1E6FF]/10 text-black dark:text-[#D1E6FF] rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
