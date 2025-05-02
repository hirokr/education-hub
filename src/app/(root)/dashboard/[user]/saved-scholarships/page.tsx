"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookmarkMinus } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Scholarship {
  scholarship_id: string;
  title: string;
  sponsor: string;
  description: string;
  deadline: string;
  amount: string;
  eligibility: string;
  location: string;
  tags: string[];
  posted_on: string;
}

export default function SavedScholarshipsPage() {
  const { data: session } = useSession();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/saved-scholarships")
      .then((res) => res.json())
      .then((data) => setScholarships(data.scholarships || []));
  }, [session]);

  const handleRemoveScholarship = async (scholarshipId: string) => {
    try {
      const res = await fetch("/api/saved-scholarships", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scholarshipId }),
      });
      
      if (res.ok) {
        setScholarships(scholarships.filter(sch => sch.scholarship_id !== scholarshipId));
        toast.success("Scholarship removed from saved items");
      } else {
        toast.error("Failed to remove scholarship");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <h1 className="text-3xl font-bold mb-8">Saved Scholarships</h1>
      {scholarships.length === 0 ? (
        <p className="text-gray-500">No saved scholarships yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.map((scholarship) => (
            <div key={scholarship.scholarship_id} className="relative border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-[#0A0A0A]">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-black hover:text-black/80 dark:text-[#d1e6ff] dark:hover:text-[#d1e6ff]/80"
                    onClick={() => handleRemoveScholarship(scholarship.scholarship_id)}
                  >
                    <BookmarkMinus className="h-8 w-8" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to remove from saved</p>
                </TooltipContent>
              </Tooltip>
              
              <Link href={`/scholarships/${scholarship.scholarship_id}`} className="block">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-2">{scholarship.title}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Sponsored by</span>
                    <p className="text-lg font-semibold text-black dark:text-[#D1E6FF]">{scholarship.sponsor}</p>
                  </div>
                </div>
                
                <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed mb-6">
                  {scholarship.description.length > 150 
                    ? `${scholarship.description.substring(0, 150)}...` 
                    : scholarship.description}
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-600 dark:text-gray-300">Amount</span>
                    <p className="text-xl font-bold text-black dark:text-[#D1E6FF]">{scholarship.amount}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-600 dark:text-gray-300">Application Deadline</span>
                    <p className="text-lg font-semibold text-black dark:text-[#D1E6FF]">
                      {new Date(scholarship.deadline).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-600 dark:text-gray-300">Posted</span>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {new Date(scholarship.posted_on).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-600 dark:text-gray-300">Location</span>
                    <p className="text-base font-semibold text-black dark:text-white">{scholarship.location}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-600 dark:text-gray-300">Eligibility</span>
                    <p className="text-base font-semibold text-black dark:text-[#D1E6FF]">{scholarship.eligibility}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  {scholarship.tags.map((tag) => (
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