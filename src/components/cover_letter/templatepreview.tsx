import { FC } from "react";

interface TemplatePreviewModalProps {
  title: string;
  content: string;
  onClose: () => void;
  onDownload: () => void;
}

const TemplatePreviewModal: FC<TemplatePreviewModalProps> = ({
  title,
  content,
  onClose,
  onDownload,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-black p-6 rounded-lg w-96 max-h-[90%] overflow-auto">
        <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
        <pre className="whitespace-pre-wrap break-words text-sm text-white">
          {content}
        </pre>
        <div className="mt-4 flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Close
          </button>
          <button
            onClick={onDownload}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Download as .docx
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewModal;
