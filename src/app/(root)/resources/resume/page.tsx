// pages/resource-library.tsx or wherever relevant
"use client";
import CoverLetterTemplates from "@/components/cover_letter/templates";

export default function ResourceLibrary() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Cover Letter Templates</h1>
      <CoverLetterTemplates />
    </div>
  );
}
