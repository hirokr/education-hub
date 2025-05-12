// components/CareerGuideCard.tsx
import Link from "next/link";
import React from "react";

interface CareerGuideCardProps {
  title: string;
  description: string;
  videoUrl: string;

  slug: string;
}

const CareerGuideCard: React.FC<CareerGuideCardProps> = ({
  title,
  description,
  videoUrl,

  slug,
}) => {
  return (
    <div className="bg-black rounded shadow-md p-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <p>{description}</p>
      <div className="flex gap-2 mt-2">
        <Link className="text-blue-500" href={`/resources/career/${slug}`}>Read More</Link>

      </div>
      <div className="mt-4">
        <iframe width="100%" height="315" src={videoUrl} title={title}></iframe>
      </div>
    </div>
  );
};

export default CareerGuideCard;
