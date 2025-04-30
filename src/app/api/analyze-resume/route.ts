import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(request: Request) {
  try {
    const { resumeText, jobDescription } = await request.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "Resume text and job description are required" },
        { status: 400 }
      );
    }

    // Prepare prompt for Hugging Face model
    const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyzer and career coach. Analyze the resume against the job description and provide:
1. An ATS compatibility score (0-100)
2. 5 specific improvement tips to make the resume more ATS-friendly for this job
3. Key missing keywords from the job description

Format your response as JSON with the following structure:
{
  "score": number,
  "tips": string[],
  "missingKeywords": string[]
}
`;

    const userPrompt = `
Resume:
${resumeText.substring(0, 2000)}... (truncated for brevity)

Job Description:
${jobDescription}

Please provide the analysis in the JSON format specified.
`;

    // Use Hugging Face for conversation
    const response = await hf.chatCompletion({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    // Extract the response content
    const generatedText = response.choices[0].message.content as string;

    // Extract and parse the JSON from the response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      // If JSON parsing fails, return a default response
      return NextResponse.json({
        score: 70,
        tips: [
          "Add more industry-specific keywords from the job description",
          "Quantify your achievements with specific metrics and numbers",
          "Ensure your contact information is at the top of the resume",
          "Use bullet points for better readability",
          "Tailor your skills section to match the job requirements",
        ],
        missingKeywords: [
          "relevant skills",
          "specific technologies",
          "required certifications",
        ],
      });
    }

    const result = JSON.parse(jsonMatch[0]);
    // console.log(result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error analyzing resume:", error);

    // Return a fallback response if there's an error
    return NextResponse.json({
      score: 65,
      tips: [
        "Add more industry-specific keywords from the job description",
        "Quantify your achievements with specific metrics and numbers",
        "Remove graphics and complex formatting that ATS systems struggle with",
        "Include the exact job title from the listing in your resume",
        "Ensure your contact information is at the top of the resume",
      ],
      missingKeywords: [
        "relevant skills",
        "specific technologies",
        "required certifications",
      ],
    });
  }
}
