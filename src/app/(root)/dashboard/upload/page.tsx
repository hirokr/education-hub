"use client";

import type React from "react";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FileText, Upload, Loader2 } from "lucide-react";
import { parseResume } from "@/lib/resume-parser";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Check file type
      if (
        selectedFile.type !== "application/pdf" &&
        selectedFile.type !==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        toast("Invalid file type", {
          description: "Please upload a PDF or DOCX file",
        });
        return;
      }

      // Check file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast("File too large", {
          description: "Please upload a file smaller than 5MB",
        });
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast("No file selected", {
        description: "Please select a resume file to upload",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      // console.log("Starting to parse resume file:", file.name);

      // Parse the resume
      const parsedResume = await parseResume(file);

      console.log(
        "Resume parsed successfully, text length:",
        parsedResume.text.length
      );

      // Store the parsed resume text in session storage for use in other pages
      sessionStorage.setItem("resumeText", parsedResume.text);
      sessionStorage.setItem("resumeFileName", parsedResume.fileName);

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast("Resume uploaded and parsed successfully", {
        description: "Your resume has been processed and is ready for analysis",
      });

      // Navigate to the analysis page
      router.push("/dashboard/analyze");
    } catch (error) {
      console.error("Error parsing resume:", error);

      // For demo purposes, let's create a fallback to allow the user to continue
      const dummyText = `This is a sample resume text for demonstration purposes.
      
Skills:
- JavaScript, React, Node.js
- Project Management
- Team Leadership
- Communication

Experience:
- Senior Developer at Tech Company (2020-Present)
- Developer at Software Inc. (2018-2020)
- Junior Developer at Startup LLC (2016-2018)

Education:
- Bachelor of Computer Science, University (2016)
      `;

      sessionStorage.setItem("resumeText", dummyText);
      sessionStorage.setItem("resumeFileName", file.name);

      toast("Using demo mode", {
        description:
          "We encountered an issue parsing your resume, but you can continue with demo data",
      });

      // Navigate to the analysis page with demo data
      router.push("/analyze");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='flex min-h-screen flex-col justify-center items-center'>
      <main className='flex-1 container py-12'>
        <div className='mx-auto max-w-md'>
          <Card>
            <CardHeader>
              <CardTitle className='text-2xl'>Upload Your Resume</CardTitle>
              <CardDescription>
                Upload your resume in PDF or DOCX format to get started with the
                analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                <div className='space-y-2'>
                  <Label htmlFor='resume'>Resume File</Label>
                  <div className='grid w-full items-center gap-1.5'>
                    <div
                      className='flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 cursor-pointer hover:bg-muted/50 transition-colors'
                      onClick={() => document.getElementById("resume")?.click()}
                    >
                      {file ? (
                        <>
                          <FileText className='h-10 w-10 text-primary mb-2' />
                          <p className='font-medium'>{file.name}</p>
                          <p className='text-sm text-muted-foreground'>
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className='h-10 w-10 text-muted-foreground mb-2' />
                          <p className='font-medium'>
                            Click to upload or drag and drop
                          </p>
                          <p className='text-sm text-muted-foreground'>
                            PDF or DOCX (max 5MB)
                          </p>
                        </>
                      )}
                    </div>
                    <Input
                      id='resume'
                      type='file'
                      accept='.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                      className='hidden'
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className='w-full'
                onClick={handleUpload}
                disabled={!file || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    {uploadProgress < 100
                      ? `Processing (${uploadProgress}%)...`
                      : "Finalizing..."}
                  </>
                ) : (
                  "Upload and Continue"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
