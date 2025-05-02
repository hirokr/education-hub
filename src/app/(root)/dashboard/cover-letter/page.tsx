"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Copy, Download, CheckCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CoverLetterPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Retrieve resume text and job description from session storage
    const storedResumeText = sessionStorage.getItem("resumeText");
    const storedJobDescription = sessionStorage.getItem("jobDescription");

    if (!storedResumeText) {
      toast("No resume found", {
        description: "Please upload your resume first",
      });
      router.push("/dashboard/upload");
      return;
    }

    setResumeText(storedResumeText);

    if (storedJobDescription) {
      setJobDescription(storedJobDescription);
    }
  }, [router, toast]);

  const handleGenerate = async () => {
    if (!jobTitle.trim() || !companyName.trim() || !jobDescription.trim()) {
      toast("Missing information", {
        description: "Please fill in all fields to generate a cover letter",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Call the API to generate a cover letter
      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText,
          jobTitle,
          companyName,
          jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate cover letter");
      }

      const data = await response.json();
      console.log(data)
      setCoverLetter(data.coverLetter);

      toast("Cover letter generated", {
        description: "Your personalized cover letter has been created",
      });
    } catch (error) {
      console.error("Error generating cover letter:", error);
      toast("Generation failed", {
        description:
          "There was an error generating your cover letter. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    toast("Copied to clipboard", {
      description: "Your cover letter has been copied to the clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([coverLetter], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Cover_Letter_${companyName.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast("Cover letter downloaded", {
      description: "Your cover letter has been downloaded as a text file",
    });
  };

  return (
    <div className='flex min-h-screen flex-col justify-center items-center'>
      <main className='flex-1 container py-12'>
        <div className='mx-auto max-w-4xl'>
          <Card>
            <CardHeader>
              <CardTitle className='text-2xl'>Generate Cover Letter</CardTitle>
              <CardDescription>
                Create a personalized cover letter based on your resume and the
                job description
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='job-title'>Job Title</Label>
                    <Input
                      id='job-title'
                      placeholder='e.g., Software Engineer'
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='company-name'>Company Name</Label>
                    <Input
                      id='company-name'
                      placeholder='e.g., Acme Inc.'
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='job-description'>Job Description</Label>
                  <Textarea
                    id='job-description'
                    placeholder='Paste the job description here...'
                    className='min-h-[150px]'
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>

                {coverLetter && (
                  <div className='space-y-2 mt-6'>
                    <div className='flex items-center justify-between'>
                      <Label htmlFor='cover-letter'>
                        Generated Cover Letter
                      </Label>
                      <div className='flex gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={handleCopy}
                          className='flex items-center gap-1'
                        >
                          {copied ? (
                            <CheckCircle className='h-4 w-4' />
                          ) : (
                            <Copy className='h-4 w-4' />
                          )}
                          {copied ? "Copied" : "Copy"}
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={handleDownload}
                          className='flex items-center gap-1 bg-amber-900'
                        >
                          <Download className='h-4 w-4' />
                          Download
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      id='cover-letter'
                      className='min-h-[300px] font-mono'
                      value={coverLetter}
                      readOnly
                    />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className='flex flex-col sm:flex-row gap-3'>
              <Button
                variant='outline'
                onClick={() => router.push("/dashboard/analyze")}
                className='w-full sm:w-auto'
              >
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to Analysis
              </Button>
              <Button
                className='w-full sm:flex-1'
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Generating...
                  </>
                ) : (
                  "Generate Cover Letter"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
