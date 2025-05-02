"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookmarkMinus } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Job {
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
  job_tags: string[];
  job_description: string;
  posted_on: string;
  deadline: string;
}

export default function SavedJobsPage() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/saved-jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data.jobs || []));
  }, [session]);

  const handleRemoveJob = async (jobId: string) => {
    try {
      const res = await fetch("/api/saved-jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      
      if (res.ok) {
        setJobs(jobs.filter(job => job.job_id !== jobId));
        toast.success("Job removed from saved items");
      } else {
        toast.error("Failed to remove job");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <h1 className="text-3xl font-bold mb-8">Saved Jobs</h1>
      {jobs.length === 0 ? (
        <p className="text-gray-500">No saved jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.job_id} className="relative border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-[#0A0A0A]">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-black hover:text-black/80 dark:text-[#d1e6ff] dark:hover:text-[#d1e6ff]/80"
                    onClick={() => handleRemoveJob(job.job_id)}
                  >
                    <BookmarkMinus className="h-8 w-8" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to remove from saved</p>
                </TooltipContent>
              </Tooltip>
              
              <Link href={`/jobs/${job.job_id}`} className="block">
                <div className="flex items-start mb-6 pr-12">
                  <Image 
                    src={job.company_logo} 
                    alt={`${job.company_name} logo`} 
                    width={56}
                    height={56}
                    className="rounded-full mr-4"
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-black dark:text-white mb-1">{job.job_title}</h2>
                    <p className="text-lg font-semibold text-black dark:text-[#D1E6FF]">{job.company_name}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-600 dark:text-gray-300">Location</span>
                    <p className="text-base font-semibold text-black dark:text-white">{job.location}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-600 dark:text-gray-300">Position</span>
                    <p className="text-base font-semibold text-black dark:text-white">{job.position}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-white-700 dark:text-gray-300">Salary Range</span>
                    <p className="text-xl font-bold text-black dark:text-[#D1E6FF]">
                      ${job.salary_range.min.toLocaleString()} - ${job.salary_range.max.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-600 dark:text-gray-300">Posted On</span>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {new Date(job.posted_on).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-white-700 dark:text-gray-300">Application Deadline</span>
                    <p className="text-lg font-semibold text-black dark:text-[#D1E6FF]">
                      {new Date(job.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  {job.job_tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 text-sm font-medium bg-black/5 dark:bg-[#D1E6FF]/10 text-black dark:text-[#D1E6FF] rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 