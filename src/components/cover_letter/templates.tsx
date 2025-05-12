import { useState } from "react";
import { generateCoverLetter } from "../../lib/cover-letter-templates/generateDocx";
import { coverLetterTemplates } from "../../lib/cover-letter-templates/templates";
import TemplatePreviewModal from "./templatepreview";

export default function CoverLetterTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);

  const handleTemplateClick = (template: any) => {
    setSelectedTemplate(template);
  };

  const handleCloseModal = () => {
    setSelectedTemplate(null);
  };

  const handleDownload = () => {
    if (selectedTemplate) {
      generateCoverLetter(selectedTemplate.title, selectedTemplate.content);
      handleCloseModal();
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {coverLetterTemplates.map((template) => (
            <div key={template.id} className="p-4 border rounded shadow">
              <button
                onClick={() => handleTemplateClick(template)}
                className="mt-4  text-white px-4 py-2 rounded hover:bg-blue-700"
              >
            <h2 className="text-xl font-semibold mb-2">{template.title}</h2>
            <p className="text-sm text-gray-600 h-32 overflow-hidden whitespace-pre-line">
              {template.content.slice(0, 200)}...
            </p>
            </button>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <TemplatePreviewModal
          title={selectedTemplate.title}
          content={selectedTemplate.content}
          onClose={handleCloseModal}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}
