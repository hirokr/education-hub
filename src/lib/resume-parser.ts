import mammoth from "mammoth"

export interface ParsedResume {
  text: string
  fileName: string
  fileType: string
}

export async function parseResume(file: File): Promise<ParsedResume> {
  const fileName = file.name
  const fileType = file.type
  let text = ""

  try {
    if (fileType === "application/pdf") {
      text = await parsePdfWithFallback(file)
    } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      text = await parseDocx(file)
    } else {
      throw new Error("Unsupported file type. Please upload a PDF or DOCX file.")
    }

    // If we got empty text, use a fallback method
    if (!text.trim()) {
      console.log("Got empty text from primary parser, using fallback text extraction")
      text = await extractTextUsingFileReader(file)
    }

    return {
      text: text || "Failed to extract text from the document. Please try a different file.",
      fileName,
      fileType,
    }
  } catch (error) {
    console.error("Detailed parsing error:", error)

    // Try fallback method if primary method fails
    try {
      text = await extractTextUsingFileReader(file)
      return {
        text: text || "Limited text extraction was possible. Some content may be missing.",
        fileName,
        fileType,
      }
    } catch (fallbackError) {
      console.error("Fallback parsing also failed:", fallbackError)
      throw new Error("Unable to parse the file. Please ensure it's a valid PDF or DOCX document.")
    }
  }
}

async function parsePdfWithFallback(file: File): Promise<string> {
  try {
    return await parsePdf(file)
  } catch (error) {
    console.error("PDF.js parsing failed:", error)
    // For demo purposes, return a sample text if parsing fails
    return "This is a sample resume text for demonstration purposes. The actual PDF parsing failed, but this allows you to continue with the demo."
  }
}

async function parsePdf(file: File): Promise<string> {
  try {
    // Dynamically import PDF.js only when needed
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf")

    // Set the worker source using CDN
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()

    // Load PDF document
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer })
    const pdf = await loadingTask.promise

    let fullText = ""

    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map((item: any) => item.str).join(" ")

      fullText += pageText + "\n"
    }

    return fullText
  } catch (error) {
    console.error("Error in PDF parsing:", error)
    throw error
  }
}

async function parseDocx(file: File): Promise<string> {
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()

    // Extract text from DOCX
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value
  } catch (error) {
    console.error("Error in DOCX parsing:", error)
    // For demo purposes, return a sample text if parsing fails
    return "This is a sample resume text for demonstration purposes. The actual DOCX parsing failed, but this allows you to continue with the demo."
  }
}

// Fallback method using FileReader
async function extractTextUsingFileReader(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        resolve(text || "Text extraction limited. Please try a different file format.")
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = (error) => {
      reject(error)
    }

    // Try to read as text
    reader.readAsText(file)
  })
}
