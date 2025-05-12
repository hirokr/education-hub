import React from "react";
import ReactMarkdown from "react-markdown"; // Add react-markdown to render markdown content

interface Guide {
  title: string;
  description: string;
  videoUrl: string;
  content: string;
}

interface CareerGuideDetailsProps {
  guide: Guide;
}

const CareerGuideDetails: React.FC<CareerGuideDetailsProps> = ({ guide }) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{guide.title}</h1>
      <p className="mt-2 text-gray-600">{guide.description}</p>

      {/* Embed video */}
      <div className="my-4">
        <iframe
          width="100%"
          height="315"
          src={guide.videoUrl}
          title={guide.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* Markdown content */}
      <div className="mt-4">
        <ReactMarkdown>{guide.content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default CareerGuideDetails;
