import { NextResponse } from "next/server"
import { HfInference } from "@huggingface/inference"

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export async function POST(request: Request) {
  try {
    const { resumeText, careerGoal, timeframe, additionalInfo } = await request.json()

    if (!resumeText || !careerGoal || !timeframe) {
      return NextResponse.json({ error: "Resume, career goal, and timeframe are required" }, { status: 400 })
    }

    // Prepare prompt for Hugging Face model
    const systemPrompt = `You are an expert career coach and professional development specialist. Create a detailed career development roadmap based on the provided information.`

    const userPrompt = `
Create a detailed career development roadmap to help this person achieve their career goal within the specified timeframe.

Resume:
${resumeText.substring(0, 2000)}... (truncated for brevity)

Career Goal: ${careerGoal}
Timeframe: ${timeframe} years
Additional Info: ${additionalInfo || "None provided"}

The roadmap should:
1. Be divided into logical time periods (e.g., quarters for 1 year, years for longer timeframes)
2. Include specific skills to develop at each stage
3. Suggest concrete actions, certifications, or experiences to pursue
4. Be realistic and achievable based on their current resume

Format your response as JSON with the following structure:
{
  "roadmap": [
    {
      "period": "string", // e.g., "Months 1-3" or "Year 1"
      "title": "string",
      "description": "string",
      "skills": ["string", "string"],
      "actions": ["string", "string"]
    }
  ]
}
`

    // Use Hugging Face for conversation
    const response = await hf.chatCompletion({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    // Extract the response content
    const generatedText = response.content

    // Extract and parse the JSON from the response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      // If JSON parsing fails, return a default roadmap
      return NextResponse.json({
        roadmap: generateDefaultRoadmap(timeframe, careerGoal),
      })
    }

    const result = JSON.parse(jsonMatch[0])

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error generating roadmap:", error)

    // Return a fallback roadmap if there's an error
    return NextResponse.json({
      roadmap: generateDefaultRoadmap(request.body?.timeframe || "3", request.body?.careerGoal || "Career advancement"),
    })
  }
}

// Helper function to generate a default roadmap if the API call fails
function generateDefaultRoadmap(timeframe: string, careerGoal: string) {
  const timeframeNum = Number.parseInt(timeframe)

  if (timeframeNum === 1) {
    return [
      {
        period: "Months 1-3",
        title: "Skill Assessment & Learning Plan",
        description:
          "Identify skill gaps based on your resume and career goal. Create a learning plan with specific courses and resources.",
        skills: ["Self-assessment", "Goal setting", "Learning strategy"],
        actions: ["Complete skills assessment", "Research industry requirements", "Create learning plan"],
      },
      {
        period: "Months 4-6",
        title: "Core Skill Development",
        description:
          "Focus on developing the most critical skills for your target role. Complete at least one certification or course.",
        skills: ["Technical skills", "Project management", "Certification"],
        actions: ["Complete online course", "Start certification process", "Practice new skills"],
      },
      {
        period: "Months 7-9",
        title: "Project Building & Portfolio",
        description:
          "Apply your new skills by building projects that demonstrate your capabilities. Update your resume and LinkedIn profile.",
        skills: ["Project development", "Portfolio building", "Resume optimization"],
        actions: ["Build 2-3 portfolio projects", "Update resume", "Enhance LinkedIn profile"],
      },
      {
        period: "Months 10-12",
        title: "Networking & Job Preparation",
        description:
          "Expand your professional network, prepare for interviews, and start applying for roles that align with your career goal.",
        skills: ["Networking", "Interview preparation", "Job search strategy"],
        actions: ["Attend industry events", "Practice interview questions", "Apply for target positions"],
      },
    ]
  } else if (timeframeNum === 3) {
    return [
      {
        period: "Year 1",
        title: "Foundation Building",
        description:
          "Develop core skills, complete relevant certifications, and build a portfolio of projects that showcase your abilities.",
        skills: ["Technical skills", "Certification", "Portfolio development"],
        actions: ["Complete 2-3 certifications", "Build portfolio", "Join professional organizations"],
      },
      {
        period: "Year 2",
        title: "Professional Growth",
        description:
          "Take on more challenging projects, develop leadership skills, and expand your professional network through industry events.",
        skills: ["Advanced technical skills", "Leadership", "Networking"],
        actions: ["Lead team projects", "Mentor junior colleagues", "Speak at industry events"],
      },
      {
        period: "Year 3",
        title: "Specialization & Advancement",
        description:
          "Specialize in high-demand areas of your field, mentor others, and position yourself for promotion or a strategic career move.",
        skills: ["Specialization", "Mentoring", "Strategic career planning"],
        actions: ["Become subject matter expert", "Publish articles or research", "Prepare for senior role"],
      },
    ]
  } else {
    return [
      {
        period: "Years 1-2",
        title: "Foundation & Growth",
        description:
          "Master core skills, complete certifications, and build a strong professional reputation through quality work and networking.",
        skills: ["Technical mastery", "Professional reputation", "Industry networking"],
        actions: ["Master fundamental skills", "Build professional brand", "Expand network"],
      },
      {
        period: "Years 3-4",
        title: "Leadership & Expertise",
        description:
          "Develop leadership capabilities, become recognized for expertise in specific areas, and mentor junior professionals.",
        skills: ["Leadership", "Domain expertise", "Mentoring"],
        actions: ["Take leadership roles", "Develop specialized expertise", "Mentor others"],
      },
      {
        period: "Year 5",
        title: "Strategic Career Positioning",
        description:
          "Position yourself for senior roles by demonstrating strategic thinking, business acumen, and the ability to drive organizational success.",
        skills: ["Strategic thinking", "Business acumen", "Organizational leadership"],
        actions: ["Lead strategic initiatives", "Develop business skills", "Prepare for executive role"],
      },
    ]
  }
}
