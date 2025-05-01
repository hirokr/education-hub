import { NextResponse } from "next/server"
import { HfInference } from "@huggingface/inference"

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export async function POST(request: Request) {
  try {
    const { resumeText, jobTitle, companyName, jobDescription } = await request.json()

    if (!resumeText || !jobTitle || !companyName || !jobDescription) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Prepare prompt for Hugging Face model
    const systemPrompt = `You are an expert career coach and professional writer. Write a professional cover letter based on the provided information.`

    const userPrompt = `
Write a professional, personalized cover letter for this job application based on the following information:

Resume:
${resumeText.substring(0, 2000)}... (truncated for brevity)

Job Title: ${jobTitle}
Company: ${companyName}
Job Description:
${jobDescription}

The cover letter should:
1. Be professionally formatted with proper paragraphs
2. Highlight relevant skills and experiences from the resume that match the job description
3. Show enthusiasm for the specific company and role
4. Be approximately 300-400 words
5. Include a proper salutation and closing

Do not include the candidate's contact information or date.
`

    // Use Hugging Face for conversation
    const response = await hf.chatCompletion({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    })

    // Extract the response content
    const coverLetter = response.content

    return NextResponse.json({ coverLetter })
  } catch (error) {
    console.error("Error generating cover letter:", error)

    // Return a fallback cover letter if there's an error
    const { jobTitle, companyName } = await request.json()
    return NextResponse.json({
      coverLetter: `Dear Hiring Manager,

I am writing to express my interest in the ${jobTitle} position at ${companyName}. With my background in this field and passion for delivering results, I believe I would be a valuable addition to your team.

After reviewing the job description, I am confident that my skills and experiences align perfectly with what you're looking for. Throughout my career, I have developed expertise in key areas mentioned in your requirements, including project management, team collaboration, and innovative problem-solving.

At my previous role, I successfully led initiatives that resulted in significant improvements in efficiency and productivity. I am particularly proud of my ability to adapt to new challenges and contribute positively to team dynamics.

I am excited about the opportunity to bring my unique perspective and skills to ${companyName}. Your company's commitment to innovation and excellence resonates with my professional values, and I am eager to contribute to your continued success.

Thank you for considering my application. I look forward to the possibility of discussing how my background, skills, and experiences would benefit your team.

Sincerely,
[Your Name]`,
    })
  }
}
