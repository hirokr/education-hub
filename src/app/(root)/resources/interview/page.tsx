// components/interview/InterviewTips.tsx
"use client";

import { useState } from "react";
import { interviewTips, commonQuestions } from "../../../../lib/interview_questions/content";

export default function InterviewTipsPage() {
  const [openTipIndex, setOpenTipIndex] = useState<number | null>(null);
  const [openQIndex, setOpenQIndex] = useState<number | null>(null);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Job Interview Tips</h1>
      {interviewTips.map((tip, i) => (
        <div key={i} className="mb-4 border rounded">
          <button
            onClick={() => setOpenTipIndex(openTipIndex === i ? null : i)}
            className="w-full text-left px-4 py-2 font-medium hover:bg-gray-600"
          >
            {tip.title}
          </button>
          {openTipIndex === i && (
            <div className="px-4 py-2 bg-gray-800">{tip.content}</div>
          )}
        </div>
      ))}

      <h2 className="text-3xl font-bold mt-10 mb-6">
        Common Interview Questions
      </h2>
      {commonQuestions.map((q, i) => (
        <div key={i} className="mb-4 border rounded">
          <button
            onClick={() => setOpenQIndex(openQIndex === i ? null : i)}
            className="w-full text-left px-4 py-2 font-medium hover:bg-gray-600"
          >
            {q.question}
          </button>
          {openQIndex === i && (
            <div className="px-4 py-2 bg-gray-800">
              <p className="font-semibold">Suggested Answer:</p>
              <p >{q.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
