"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { studyGuides } from "../../../../lib/scholarship_studyguide/guide_content";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const StudyGuides = () => {
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-4">Study Guides</h2>
      <div className="space-y-6">
        {studyGuides.map((guide, index) => (
          <div key={index} className="border p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{guide.title}</h3>
            <p className="text-sm text-gray-600">{guide.description}</p>

            <div className="mt-3 space-x-4 flex flex-row items-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => setPdfPreview(guide.pdfUrl)}
                  >
                    View
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-4xl h-[80vh] p-4">
                  <DialogTitle asChild>
                    <VisuallyHidden>{guide.title} Preview</VisuallyHidden>
                  </DialogTitle>

                  {pdfPreview && (
                    <object
                      data={pdfPreview}
                      type="application/pdf"
                      width="100%"
                      height="100%"
                    >
                      <div>
                        <a href={pdfPreview} download className="text-blue-600">
                          Download here
                        </a>
                      </div>
                    </object>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StudyGuides;
