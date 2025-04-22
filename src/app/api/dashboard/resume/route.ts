import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";

import axios from "axios";// Disable Next.js body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// const readFile = async (req: NextRequest): Promise<Buffer> => {
//   const data: Buffer[] = [];

//   return new Promise((resolve, reject) => {
//     req.on("data", (chunk: Buffer) => data.push(chunk));
//     req.on("end", () => resolve(Buffer.concat(data)));
//     req.on("error", reject);
//   });
// };

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file: File | null = formData.get("pdf") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parsed = await pdfParse(buffer);
    const resumeText = parsed.text;

    const hfRes = await axios.post(
      "https://api-inference.huggingface.co/models/mrm8488/bert-tiny-finetuned-resume-classification", // example
      { inputs: resumeText },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = hfRes.data;
    const confidence = result[0][0].score;
    const label = result[0][0].label;
    const atsScore = Math.round(confidence * 100);

    return NextResponse.json({ atsScore, label });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error parsing resume:", error.message);
    } else {
      console.error("Error parsing resume:", error);
    }
    return NextResponse.json({ error: "Failed to process resume" }, { status: 500 });
  }
}
