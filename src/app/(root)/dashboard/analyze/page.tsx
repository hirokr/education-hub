"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

import {
  Loader2,
  CheckCircle,
  AlertCircle,
  FileText,
  FileCheck,
  ArrowLeft,
} from "lucide-react";

export default function AnalyzePage() {
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [atsScore, setAtsScore] = useState(0);
  const [improvementTips, setImprovementTips] = useState<string[]>([]);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Retrieve resume text from session storage
    const storedResumeText = sessionStorage.getItem("resumeText");
    const storedResumeFileName = sessionStorage.getItem("resumeFileName");

    if (!storedResumeText) {
      toast("No resume found", {
        description: "Please upload your resume first",
      });
      router.push("/upload");
      return;
    }

    setResumeText(storedResumeText);
    if (storedResumeFileName) {
      setResumeFileName(storedResumeFileName);
    }
  }, [router, toast]);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast("Job description required", {
        description:
          "Please enter a job description to analyze your resume against",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Call the API to analyze the resume
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText,
          jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze resume");
      }

      const data = await response.json();

      // Update state with analysis results
      setAtsScore(data.score);
      setImprovementTips(data.tips);
      setMissingKeywords(data.missingKeywords || []);
      setAnalysisComplete(true);

      toast("Analysis complete", {
        description:
          "Your resume has been analyzed against the job description",
      });
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast("Analysis failed", {
        description:
          "There was an error analyzing your resume. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateCoverLetter = () => {
    // Store job description in session storage for use in cover letter page
    sessionStorage.setItem("jobDescription", jobDescription);
    router.push("/dashboard/cover-letter");
  };

  const handleCareerRoadmap = () => {
    router.push("/dashboard/career-roadmap");
  };

  return (
    <div className='flex min-h-screen flex-col justify-center items-center'>
      <main className='flex-1 container py-12'>
        <div className='mx-auto max-w-4xl'>
          <Tabs defaultValue='analyze' className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='analyze'>ATS Analysis</TabsTrigger>
              <TabsTrigger value='results' disabled={!analysisComplete}>
                Results
              </TabsTrigger>
            </TabsList>
            <TabsContent value='analyze'>
              <Card>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <div>
                      <CardTitle className='text-2xl'>
                        Analyze Your Resume
                      </CardTitle>
                      <CardDescription>
                        Enter a job description to analyze your resume against
                        ATS requirements
                      </CardDescription>
                    </div>
                    {resumeFileName && (
                      <div className='flex items-center text-sm text-muted-foreground'>
                        <FileText className='mr-2 h-4 w-4' />
                        {resumeFileName}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='space-y-6'>
                    <div className='space-y-2'>
                      <Label htmlFor='job-description'>Job Description</Label>
                      <Textarea
                        id='job-description'
                        placeholder='Paste the job description here...'
                        className='min-h-[200px]'
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className='flex flex-col sm:flex-row gap-3'>
                  <Button
                    variant='outline'
                    onClick={() => router.push("/dashboard/upload")}
                    className='w-full sm:w-auto'
                  >
                    <ArrowLeft className='mr-2 h-4 w-4' />
                    Back to Upload
                  </Button>
                  <Button
                    className='w-full sm:flex-1'
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Resume"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value='results'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-2xl'>
                    ATS Analysis Results
                  </CardTitle>
                  <CardDescription>
                    See how your resume performs against ATS systems for this
                    job
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-8'>
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <h3 className='text-lg font-medium'>
                          ATS Compatibility Score
                        </h3>
                        <span className='text-lg font-bold'>{atsScore}%</span>
                      </div>
                      <Progress value={atsScore} className='h-3' />
                      <div className='flex items-center text-sm'>
                        {atsScore >= 80 ? (
                          <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                        ) : (
                          <AlertCircle className='mr-2 h-4 w-4 text-yellow-500' />
                        )}
                        {atsScore >= 80
                          ? "Your resume is well-optimized for ATS systems"
                          : "Your resume needs improvement to pass ATS systems"}
                      </div>
                    </div>

                    <div className='space-y-4'>
                      <h3 className='text-lg font-medium'>Improvement Tips</h3>
                      <ul className='space-y-2'>
                        {improvementTips.map((tip, index) => (
                          <li key={index} className='flex items-start'>
                            <CheckCircle className='mr-2 h-4 w-4 text-primary mt-1 shrink-0' />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {missingKeywords.length > 0 && (
                      <div className='space-y-4'>
                        <h3 className='text-lg font-medium'>
                          Missing Keywords
                        </h3>
                        <div className='flex flex-wrap gap-2'>
                          {missingKeywords.map((keyword, index) => (
                            <div
                              key={index}
                              className='bg-muted px-3 py-1 rounded-full text-sm'
                            >
                              {keyword}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className='flex flex-col sm:flex-row gap-3'>
                  <Button
                    className='w-full sm:w-1/2'
                    onClick={handleGenerateCoverLetter}
                    variant='outline'
                  >
                    <FileText className='mr-2 h-4 w-4' />
                    Generate Cover Letter
                  </Button>
                  <Button
                    className='w-full sm:w-1/2'
                    onClick={handleCareerRoadmap}
                  >
                    <FileCheck className='mr-2 h-4 w-4' />
                    Get Career Roadmap
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
