"use client";

import { FileUpload } from "@/components/FileUpload";
import React, { useState } from "react";

const Resume = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return alert("Please upload a PDF file");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      alert(data.message || "Upload complete!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Something went wrong during upload.");
    }
  };

  return (
    <main>
      <div className='flex flex-col justify-center items-center'>
        <div className='w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-4 '>
          <FileUpload onChange={handleFileChange} />
        </div>
        <button
          onClick={handleSubmit}
          className='mt-4 px-4 py-2  text-white rounded hover:bg-gray-600/50 transition duration-300 cursor-pointer'
        >
          Upload Resume
        </button>
      </div>
    </main>
  );
};

export default Resume;
