import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { careerGuides } from "../../../../lib/scholarship_studyguide/content"; // Adjust the path as needed

export default function ScholarshipTipsPage() {
  const tips =
    careerGuides.find((category) => category.category === "Scholarship Tips")
      ?.guides || [];

  return (
    <div>
      <h1 className="text-7xl">Scholarship Tips</h1>
      {tips.map((tip) => (
        <div key={tip.slug} className="p-4 mb-4 rounded shadow">
          <h2 className="text-xl font-bold">{tip.title}</h2>
          <p>{tip.description}</p>

          {/* View in Modal (Dialog) */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">View PDF</Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl h-[80vh] p-4">
              <DialogTitle asChild>
                <VisuallyHidden>{tip.title} PDF Preview</VisuallyHidden>
              </DialogTitle>

              <iframe
                src={tip.pdfUrl}
                width="100%"
                height="100%"
                title={tip.title}
                style={{ border: "none" }}
              />
            </DialogContent>
          </Dialog>

          {/* Download Link */}
          <div className="mt-3">
            <a
              href={tip.pdfUrl}
              download={tip.title}
              className="text-blue-500 underline"
            >
              Download PDF
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
