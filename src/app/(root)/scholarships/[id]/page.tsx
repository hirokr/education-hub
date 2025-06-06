'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CalendarIcon, MapPinIcon, BanknotesIcon, ClockIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import { Upload, BookmarkPlus, BookmarkCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useApplicationStatus } from '@/hooks/useApplicationStatus';

interface Scholarship {
  scholarship_id: string;
  title: string;
  sponsor: string;
  amount: string;
  deadline: string;
  description: string;
  eligibility: string;
  requirements: string;
  tags: string[];
  posted_on: string;
  location: string;
}

export default function ScholarshipDetailsPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const { hasApplied, isLoading: isApplicationStatusLoading, error } = useApplicationStatus('scholarship', id as string);
  const [applicationForm, setApplicationForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    academicInfo: '',
    coverLetter: '',
    documents: null as File | null,
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        const response = await fetch(`/api/scholarships/${id}`);
        if (!response.ok) throw new Error('Failed to fetch scholarship details');
        const data = await response.json();
        setScholarship(data);
      } catch (error) {
        console.error('Error fetching scholarship:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarship();
  }, [id]);

  useEffect(() => {
    const checkIfSaved = async () => {
      if (session?.user) {
        try {
          const res = await fetch('/api/saved-scholarships');
          if (res.ok) {
            const data = await res.json();
            setIsSaved(data.scholarships.some((s: Scholarship) => s.scholarship_id === id));
          }
        } catch (error) {
          console.error('Error checking saved status:', error);
        }
      }
    };
    checkIfSaved();
  }, [session, id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Scholarship not found</h1>
          <Link href="/scholarships" className="text-blue-500 hover:underline mt-4 inline-block">
            Back to Scholarships
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
      toast.info("You have already applied for this scholarship");
      return;
    }
    
    setIsApplicationModalOpen(true);
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!applicationForm.documents) {
        toast.error("Please upload required documents before submitting");
        return;
      }

      const formData = new FormData();
      formData.append('fullName', applicationForm.fullName);
      formData.append('email', applicationForm.email);
      formData.append('phone', applicationForm.phone);
      formData.append('academicInfo', applicationForm.academicInfo);
      formData.append('coverLetter', applicationForm.coverLetter);
      formData.append('documents', applicationForm.documents);

      const response = await fetch(`/api/scholarships/${id}/apply`, {
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
        academicInfo: '',
        coverLetter: '',
        documents: null,
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };

  const handleSaveScholarship = async () => {
    if (!session?.user) {
      toast.error('You must be logged in to save scholarships.');
      return;
    }
    try {
      const res = await fetch('/api/saved-scholarships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scholarshipId: id }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || 'Failed to save scholarship.');
        return;
      }
      
      setIsSaved(true);
      toast.success('Scholarship saved successfully!');
    } catch (error) {
      console.error('Error saving scholarship:', error);
      toast.error('An error occurred while saving the scholarship.');
    }
  };

  const handleUnsaveScholarship = async () => {
    if (!session?.user) return;
    try {
      const res = await fetch('/api/saved-scholarships', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scholarshipId: id }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || 'Failed to unsave scholarship.');
        return;
      }
      
      setIsSaved(false);
      toast.success('Scholarship removed from saved items.');
    } catch (error) {
      console.error('Error removing saved scholarship:', error);
      toast.error('An error occurred while removing the scholarship.');
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/scholarships">
          <Button variant="ghost" className="mb-6">
            ← Back to Scholarships
          </Button>
        </Link>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between w-full">
              <div className="flex flex-col space-y-4">
                <CardTitle className="text-3xl text-black dark:text-white">{scholarship.title}</CardTitle>
                <div className="flex items-center text-black dark:text-[#D1E6FF]">
                  <AcademicCapIcon className="h-5 w-5 mr-2 text-black dark:text-[#D1E6FF]" />
                  <span className="text-lg text-black dark:text-[#D1E6FF]">Sponsored by {scholarship.sponsor}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {scholarship.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      className="px-3 py-1 text-sm font-medium bg-black/5 dark:bg-[#D1E6FF]/10 text-black dark:text-[#D1E6FF] rounded-full"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-black hover:text-black/80 dark:text-[#d1e6ff] dark:hover:text-[#d1e6ff]/80"
                      onClick={isSaved ? handleUnsaveScholarship : handleSaveScholarship}
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
                <BanknotesIcon className="h-5 w-5 text-black dark:text-white" />
                <div>
                  <p className="text-sm font-semibold text-black dark:text-white">Amount</p>
                  <p className="text-2xl font-bold text-black dark:text-[#D1E6FF]">{scholarship.amount}</p>
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
                  <p className="text-lg font-bold text-black dark:text-[#D1E6FF]">{formatDate(scholarship.deadline)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <MapPinIcon className="h-5 w-5 text-black dark:text-white" />
                <div>
                  <p className="text-sm font-semibold text-black dark:text-white">Location</p>
                  <p className="text-lg font-semibold">{scholarship.location}</p>
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
                  <p className="text-lg font-semibold">{formatDate(scholarship.posted_on)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed whitespace-pre-line">
                {scholarship.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Eligibility Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed whitespace-pre-line">
                {scholarship.eligibility}
              </p>
            </CardContent>
          </Card>
        </div>

        <Dialog open={isApplicationModalOpen} onOpenChange={setIsApplicationModalOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Apply for {scholarship?.title}</DialogTitle>
              <DialogDescription>
                Fill out the form below to submit your application for this scholarship
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-2">
              <Card className="border-2 border-primary/20">
                <CardContent className="pt-6">
                  <form onSubmit={handleApplicationSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Scholarship Title</Label>
                      <Input
                        value={scholarship?.title}
                        readOnly
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Sponsored By</Label>
                      <Input
                        value={scholarship?.sponsor}
                        readOnly
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input
                        value={scholarship?.amount}
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
                      <Label htmlFor="academicInfo">Academic Information</Label>
                      <Textarea
                        id="academicInfo"
                        value={applicationForm.academicInfo}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, academicInfo: e.target.value }))}
                        required
                        className="h-32"
                        placeholder="Please provide your current academic status, GPA, and any relevant academic achievements"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coverLetter">Statement of Purpose</Label>
                      <Textarea
                        id="coverLetter"
                        value={applicationForm.coverLetter}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, coverLetter: e.target.value }))}
                        required
                        className="h-32"
                        placeholder="Why should you be awarded this scholarship? Describe your goals and aspirations."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="documents">Supporting Documents</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="documents"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setApplicationForm(prev => ({ 
                            ...prev, 
                            documents: e.target.files ? e.target.files[0] : null 
                          }))}
                          className="hidden"
                          required
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('documents')?.click()}
                          className="w-full"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {applicationForm.documents ? 'Change Document' : 'Upload Documents'}
                        </Button>
                      </div>
                      {applicationForm.documents && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{applicationForm.documents.name}</span>
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Please upload your transcripts, certificates, and other relevant documents in a single PDF file
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