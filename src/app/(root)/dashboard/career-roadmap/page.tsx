"use client";

import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Download } from "lucide-react";
import RoadmapTimeline from "@/components/roadmap-timeline";

export default function CareerRoadmapPage() {
  const [careerGoal, setCareerGoal] = useState("");
  const [timeframe, setTimeframe] = useState("3-years");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmapGenerated, setRoadmapGenerated] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [roadmapData, setRoadmapData] = useState<any[]>([]);

  const handleGenerate = async () => {
    if (!careerGoal.trim()) {
      toast("Career goal required", {
        description: "Please enter your career goal to generate a roadmap",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // In a real app, you would send the career details to your server
      // and generate a roadmap using AI
      // For this demo, we'll simulate a successful generation after a delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Sample roadmap data
      let timelineData = [];

      if (timeframe === "1-year") {
        timelineData = [
          {
            title: "Month 1-3: Skill Assessment & Learning Plan",
            description:
              "Identify skill gaps based on your resume and career goal. Create a learning plan with specific courses and resources.",
            skills: ["Self-assessment", "Goal setting", "Learning strategy"],
          },
          {
            title: "Month 4-6: Core Skill Development",
            description:
              "Focus on developing the most critical skills for your target role. Complete at least one certification or course.",
            skills: ["Technical skills", "Project management", "Certification"],
          },
          {
            title: "Month 7-9: Project Building & Portfolio",
            description:
              "Apply your new skills by building projects that demonstrate your capabilities. Update your resume and LinkedIn profile.",
            skills: [
              "Project development",
              "Portfolio building",
              "Resume optimization",
            ],
          },
          {
            title: "Month 10-12: Networking & Job Preparation",
            description:
              "Expand your professional network, prepare for interviews, and start applying for roles that align with your career goal.",
            skills: [
              "Networking",
              "Interview preparation",
              "Job search strategy",
            ],
          },
        ];
      } else if (timeframe === "3-years") {
        timelineData = [
          {
            title: "Year 1: Foundation Building",
            description:
              "Develop core skills, complete relevant certifications, and build a portfolio of projects that showcase your abilities.",
            skills: [
              "Technical skills",
              "Certification",
              "Portfolio development",
            ],
          },
          {
            title: "Year 2: Professional Growth",
            description:
              "Take on more challenging projects, develop leadership skills, and expand your professional network through industry events.",
            skills: ["Advanced technical skills", "Leadership", "Networking"],
          },
          {
            title: "Year 3: Specialization & Advancement",
            description:
              "Specialize in high-demand areas of your field, mentor others, and position yourself for promotion or a strategic career move.",
            skills: [
              "Specialization",
              "Mentoring",
              "Strategic career planning",
            ],
          },
        ];
      } else {
        timelineData = [
          {
            title: "Years 1-2: Foundation & Growth",
            description:
              "Master core skills, complete certifications, and build a strong professional reputation through quality work and networking.",
            skills: [
              "Technical mastery",
              "Professional reputation",
              "Industry networking",
            ],
          },
          {
            title: "Years 3-4: Leadership & Expertise",
            description:
              "Develop leadership capabilities, become recognized for expertise in specific areas, and mentor junior professionals.",
            skills: ["Leadership", "Domain expertise", "Mentoring"],
          },
          {
            title: "Year 5: Strategic Career Positioning",
            description:
              "Position yourself for senior roles by demonstrating strategic thinking, business acumen, and the ability to drive organizational success.",
            skills: [
              "Strategic thinking",
              "Business acumen",
              "Organizational leadership",
            ],
          },
        ];
      }

      setRoadmapData(timelineData);
      setRoadmapGenerated(true);

      toast("Career roadmap generated", {
        description: "Your personalized career development plan is ready",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast("Generation failed", {
        description:
          "There was an error generating your career roadmap. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    // Create a text representation of the roadmap
    let roadmapText = `CAREER ROADMAP: ${careerGoal}\n\n`;
    roadmapText += `Timeframe: ${
      timeframe === "1-year"
        ? "1 Year"
        : timeframe === "3-years"
        ? "3 Years"
        : "5 Years"
    }\n\n`;

    roadmapData.forEach((item) => {
      roadmapText += `${item.title}\n`;
      roadmapText += `${"-".repeat(item.title.length)}\n`;
      roadmapText += `${item.description}\n\n`;
      roadmapText += `Key skills: ${item.skills.join(", ")}\n\n`;
    });

    // Create and download the file
    const element = document.createElement("a");
    const file = new Blob([roadmapText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Career_Roadmap_${careerGoal.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast("Roadmap downloaded", {
      description: "Your career roadmap has been downloaded as a text file",
    });
  };

  return (
    <div className='flex min-h-screen flex-col justify-center items-center'>
      <main className='flex-1 container py-12'>
        <div className='mx-auto max-w-4xl'>
          <Card>
            <CardHeader>
              <CardTitle className='text-2xl'>
                Career Development Roadmap
              </CardTitle>
              <CardDescription>
                Get a personalized career roadmap based on your resume and
                career goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                <div className='space-y-2'>
                  <Label htmlFor='career-goal'>Career Goal</Label>
                  <Input
                    id='career-goal'
                    placeholder='e.g., Become a Senior Software Engineer'
                    value={careerGoal}
                    onChange={(e) => setCareerGoal(e.target.value)}
                  />
                </div>

                <div className='space-y-2'>
                  <Label>Timeframe</Label>
                  <RadioGroup
                    value={timeframe}
                    onValueChange={setTimeframe}
                    className='flex flex-col space-y-1'
                  >
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='1-year' id='1-year' />
                      <Label htmlFor='1-year' className='font-normal'>
                        1 Year Plan
                      </Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='3-years' id='3-years' />
                      <Label htmlFor='3-years' className='font-normal'>
                        3 Year Plan
                      </Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='5-years' id='5-years' />
                      <Label htmlFor='5-years' className='font-normal'>
                        5 Year Plan
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='additional-info'>
                    Additional Information (Optional)
                  </Label>
                  <Textarea
                    id='additional-info'
                    placeholder='Any specific skills or areas you want to focus on...'
                    className='min-h-[100px]'
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                  />
                </div>

                {roadmapGenerated && (
                  <div className='mt-8 space-y-6'>
                    <div className='flex items-center justify-between'>
                      <h3 className='text-lg font-medium'>
                        Your Career Roadmap
                      </h3>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={handleDownload}
                        className='flex items-center gap-1'
                      >
                        <Download className='h-4 w-4' />
                        Download Roadmap
                      </Button>
                    </div>
                    <RoadmapTimeline data={roadmapData} />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className='w-full'
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Generating Roadmap...
                  </>
                ) : (
                  "Generate Career Roadmap"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
