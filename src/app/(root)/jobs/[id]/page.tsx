'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  CalendarIcon, 
  MapPinIcon, 
  BriefcaseIcon, 
  BanknotesIcon, 
  ClockIcon,
  BuildingOfficeIcon 
} from "@heroicons/react/24/outline";
import { Upload, BookmarkPlus, BookmarkCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useApplicationStatus } from '@/hooks/useApplicationStatus';

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

interface SavedJob {
  id: string;
  job_id: string;
}

export default function JobDetailsPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const { hasApplied, isLoading: isApplicationStatusLoading, error } = useApplicationStatus('job', id as string);
  const [applicationForm, setApplicationForm] = useState({
    fullName: '',
    email: session?.user?.email || '',
    phone: '',
    coverLetter: '',
    resume: null as File | null,
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${id}`);
        if (!response.ok) throw new Error('Failed to fetch job details');
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  useEffect(() => {
    const checkIfSaved = async () => {
      if (session?.user) {
        try {
          const res = await fetch('/api/saved-jobs');
          if (res.ok) {
            const data = await res.json();
            if (data && data.jobs && Array.isArray(data.jobs)) {
              setIsSaved(data.jobs.some((job: SavedJob) => 
                job.id === id || job.job_id === id
              ));
            }
          }
        } catch (error) {
          console.error('Error checking saved status:', error);
        }
      }
    };
    checkIfSaved();
  }, [session, id]);

  const handleApplyClick = () => {
    if (!session) {
      toast.error("Please log in first to apply");
      router.push('/sign-in');
      return;
    }
    
    if (error) {
      toast.error("Unable to check application status. Please try again later.");
      return;
    }
    
    if (hasApplied) {
      toast.info("You have already applied for this job");
      return;
    }
    
    setIsApplicationModalOpen(true);
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!applicationForm.resume) {
        toast.error("Please upload your resume before submitting");
        return;
      }

      const formData = new FormData();
      formData.append('fullName', applicationForm.fullName);
      formData.append('email', applicationForm.email);
      formData.append('phone', applicationForm.phone);
      formData.append('coverLetter', applicationForm.coverLetter);
      formData.append('resume', applicationForm.resume);

      const response = await fetch(`/api/jobs/${id}/apply`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      toast.success('Application submitted successfully! A confirmation email has been sent to your email address.');
      setIsApplicationModalOpen(false);
      
      // Reset form after successful submission
      setApplicationForm({
        fullName: '',
        email: session?.user?.email || '',
        phone: '',
        coverLetter: '',
        resume: null,
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };

  const handleSaveJob = async () => {
    if (!session?.user) {
      toast.error('You must be logged in to save jobs.');
      return;
    }
    try {
      const res = await fetch('/api/saved-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: id }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || 'Failed to save job.');
        return;
      }
      
      setIsSaved(true);
      toast.success('Job saved successfully!');
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('An error occurred while saving the job.');
    }
  };

  const handleUnsaveJob = async () => {
    if (!session?.user) return;
    try {
      const res = await fetch('/api/saved-jobs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: id }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || 'Failed to unsave job.');
        return;
      }
      
      setIsSaved(false);
      toast.success('Job removed from saved items.');
    } catch (error) {
      console.error('Error removing saved job:', error);
      toast.error('An error occurred while removing the job.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Job not found</h1>
          <Link href="/jobs" className="text-blue-500 hover:underline mt-4 inline-block">
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/jobs">
          <Button variant="ghost" className="mb-6">
            ← Back to Jobs
          </Button>
        </Link>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between w-full">
              <div className="flex items-start space-x-6">
                <div className="relative h-20 w-20 flex-shrink-0">
                  <Image
                    src={job.company_logo}
                    alt={`${job.company_name} logo`}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="flex flex-col space-y-4">
                  <CardTitle className="text-black dark:text-white text-3xl">{job.job_title}</CardTitle>
                  <div className="flex items-center text-black dark:text-[#D1E6FF]">
                    <BuildingOfficeIcon className="h-5 w-5 mr-2 text-black dark:text-[#D1E6FF]" />
                    <span className="text-lg text-black dark:text-[#D1E6FF]">{job.company_name}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job?.job_tags?.map((tag) => (
                      <Badge 
                        key={tag} 
                        className="px-3 py-1 text-sm font-medium bg-black/5 dark:bg-[#D1E6FF]/10 text-black dark:text-[#D1E6FF] rounded-full"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-black hover:text-black/80 dark:text-[#d1e6ff] dark:hover:text-[#d1e6ff]/80"
                      onClick={isSaved ? handleUnsaveJob : handleSaveJob}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="h-8 w-8 text-blue-500" />
                      ) : (
                        <BookmarkPlus className="h-8 w-8 text-black dark:text-[#d1e6ff]" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isSaved ? 'Click to remove from saved' : 'Click to save'}</p>
                  </TooltipContent>
                </Tooltip>
                <Button 
                  size="lg" 
                  onClick={handleApplyClick}
                  disabled={hasApplied || isApplicationStatusLoading || !!error}
                  className={`bg-black hover:bg-black/80 text-white dark:bg-[#FFFFFF] dark:hover:bg-[#d1e6ff]/80 dark:text-black ${
                    hasApplied || isApplicationStatusLoading || error ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isApplicationStatusLoading ? 'Checking...' : hasApplied ? 'Already Applied' : 'Apply Now'}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <MapPinIcon className="h-5 w-5 text-black dark:text-white" />
                <div>
                  <p className="text-sm font-semibold text-black dark:text-white">Location</p>
                  <p className="text-lg font-semibold text-black dark:text-white">{job.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <BriefcaseIcon className="h-5 w-5 text-black dark:text-white" />
                <div>
                  <p className="text-sm font-semibold text-black dark:text-white">Position Type</p>
                  <p className="text-lg font-semibold">{job.position}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <BanknotesIcon className="h-5 w-5 text-black dark:text-white" />
                <div>
                  <p className="text-sm font-semibold text-black dark:text-white">Salary Range</p>
                  <p className="text-lg font-semibold">
                    {formatSalary(job.salary_range.min)} - {formatSalary(job.salary_range.max)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <CalendarIcon className="h-5 w-5 text-black dark:text-white" />
                <div>
                  <p className="text-sm font-semibold text-black dark:text-white">Application Deadline</p>
                  <p className="text-lg font-bold text-black dark:text-[#D1E6FF]">{formatDate(job.deadline)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <ClockIcon className="h-5 w-5 text-black dark:text-white" />
                <div>
                  <p className="text-sm font-semibold text-black dark:text-white">Posted On</p>
                  <p className="text-lg font-semibold">{formatDate(job.posted_on)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed whitespace-pre-line">
              {job.job_description}
            </p>
          </CardContent>
        </Card>

        <Dialog open={isApplicationModalOpen} onOpenChange={setIsApplicationModalOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Apply for {job?.job_title}</DialogTitle>
              <DialogDescription>
                Fill out the form below to submit your application to {job?.company_name}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-2">
              <Card className="border-2 border-primary/20">
                <CardContent className="pt-6">
                  <form onSubmit={handleApplicationSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input
                        value={job?.job_title}
                        readOnly
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input
                        value={job?.company_name}
                        readOnly
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Position Type</Label>
                      <Input
                        value={job?.position}
                        readOnly
                        className="bg-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={applicationForm.fullName}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={applicationForm.email}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                        placeholder="Your email will be pre-filled from your account"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={applicationForm.phone}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coverLetter">Cover Letter</Label>
                      <Textarea
                        id="coverLetter"
                        value={applicationForm.coverLetter}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, coverLetter: e.target.value }))}
                        required
                        className="h-32"
                        placeholder="Why would you be a good fit for this position?"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resume">Resume</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="resume"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setApplicationForm(prev => ({ 
                            ...prev, 
                            resume: e.target.files ? e.target.files[0] : null 
                          }))}
                          className="hidden"
                          required
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('resume')?.click()}
                          className="w-full"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {applicationForm.resume ? 'Change Resume' : 'Upload Resume'}
                        </Button>
                      </div>
                      {applicationForm.resume && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{applicationForm.resume.name}</span>
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Please upload your resume in PDF or Word format
                      </p>
                    </div>
                    <div className="sticky bottom-0 pt-4 bg-background flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsApplicationModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        Submit Application
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 