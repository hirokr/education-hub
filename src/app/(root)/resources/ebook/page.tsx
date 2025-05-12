"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { ebooks, studyMaterials } from "@/lib/ebook-studymaterials/content";

export default function ResourcesPage() {
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [dialogTitle, setDialogTitle] = useState<string>("");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">eBooks & Study Materials</h1>

      {/* eBooks Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">eBooks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ebooks.map((ebook) => (
            <div
              key={ebook.id}
              className="border rounded-lg shadow-md p-4 flex flex-col"
            >
              <Image
                src={ebook.coverImage}
                alt={ebook.title}
                width={300}
                height={400}
                className="w-full h-64 object-cover mb-4 rounded"
              />
              <h3 className="text-xl font-semibold">{ebook.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {ebook.description}
              </p>
              <span className="text-xs text-gray-500 mb-4">
                Category: {ebook.category}
              </span>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPdfPreview(ebook.filePath);
                      setDialogTitle(ebook.title + " PDF Preview");
                    }}
                  >
                    View
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-[80vh] p-4">
                  <DialogTitle asChild>
                    <VisuallyHidden>{dialogTitle}</VisuallyHidden>
                  </DialogTitle>
                  {pdfPreview && (
                    <object
                      data={pdfPreview}
                      type="application/pdf"
                      width="100%"
                      height="100%"
                    >
                      <p>
                        PDF preview not supported.{" "}
                        <a href={pdfPreview} download>
                          Download here
                        </a>
                        .
                      </p>
                    </object>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </div>

      {/* Study Materials Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Study Materials</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {studyMaterials.map((material) => (
            <div
              key={material.id}
              className="border rounded-lg shadow-md p-4 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold mb-2">{material.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {material.description}
                </p>
                <span className="text-xs text-gray-500">
                  Category: {material.category}
                </span>
              </div>
              <div className="mt-4 flex justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPdfPreview(material.filePath);
                        setDialogTitle(material.title + " PDF Preview");
                      }}
                    >
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl h-[80vh] p-4">
                    <DialogTitle asChild>
                      <VisuallyHidden>{dialogTitle}</VisuallyHidden>
                    </DialogTitle>
                    {pdfPreview && (
                      <object
                        data={pdfPreview}
                        type="application/pdf"
                        width="100%"
                        height="100%"
                      >
                        <p>
                          PDF preview not supported.{" "}
                          <a href={pdfPreview} download>
                            Download here
                          </a>
                          .
                        </p>
                      </object>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
