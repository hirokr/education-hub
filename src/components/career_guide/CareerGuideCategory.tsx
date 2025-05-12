// components/CareerGuideCategory.tsx
import React from "react";
import CareerGuideCard from "./CareerGuideCard";
import { careerGuides } from "../../lib/career-guide/content";

const CareerGuideCategory: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      {careerGuides.map((category) => (
        <div key={category.category} className="mt-8">
          <h1 className="text-3xl font-bold mb-4">{category.category}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.guides.map((guide) => (
              <CareerGuideCard
                key={guide.title}
                title={guide.title}
                description={guide.description}
                videoUrl={guide.videoUrl}
                slug={guide.title.toLowerCase().replace(/\s+/g, "-")}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CareerGuideCategory;
