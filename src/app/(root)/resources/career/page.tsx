// pages/career-guides/index.tsx
import CareerGuideCategory from "../../../../components/career_guide/CareerGuideCategory";

const CareerGuidesPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center my-8">Career Guides</h1>
      <CareerGuideCategory />
    </div>
  );
};

export default CareerGuidesPage;
