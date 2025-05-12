// src/app/(root)/resources/career/[slug]/page.tsx

import { notFound } from "next/navigation";
import { careerGuides } from "@/lib/career-guide/content"; // Adjust the path as necessary
import CareerGuideDetails from "@/components/career_guide/CareerGuideDetails";

// Ensure to handle async for the dynamic parameters
export default async function CareerGuidePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  // Find the category that contains the guide with the matching slug
  const category = careerGuides.find((cat) =>
    cat.guides.some((g) => g.slug === slug)
  );

  // If category is not found, return 404
  if (!category) return notFound();

  // Find the guide within the category
  const guide = category.guides.find((g) => g.slug === slug);

  // If guide is not found, return 404
  if (!guide) return notFound();

  // Pass the correct guide object to CareerGuideDetails
  return <CareerGuideDetails guide={guide} />;
}
