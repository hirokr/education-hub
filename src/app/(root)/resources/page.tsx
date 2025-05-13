"use client";

export default function ResourcesPage() {
  return (
    <div className="space-y-6 bg-background text-foreground">
      <h1 className="text-3xl font-semibold">Explore Our Resources</h1>
      <p className="max-w-2xl">
        Find tools, guides, templates, and helpful content to boost your career
        journey. Select a category from the sidebar to get started.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Resume Templates */}
        <div className="p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
          <h2 className="text-2xl font-medium">Resume Templates</h2>
          <p className="mt-2 text-sm text-gray-400">
            Download professional resume templates tailored for various
            industries.
          </p>
        </div>

        {/* Card 2: Career Guides */}
        <div className="p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
          <h2 className="text-2xl font-medium">Career Guides</h2>
          <p className="mt-2 text-sm text-gray-400">
            Step-by-step career advice for job seekers and students.
          </p>
        </div>

        {/* Card 3: Cover Letters */}
        <div className="p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
          <h2 className="text-2xl font-medium">Cover Letters</h2>
          <p className="mt-2 text-sm text-gray-400">
            Learn how to write compelling cover letters that get noticed.
          </p>
        </div>

        {/* Card 4: Interview Tips */}
        <div className="p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
          <h2 className="text-2xl font-medium">Interview Tips</h2>
          <p className="mt-2 text-sm text-gray-400">
            Prepare effectively for interviews with actionable tips.
          </p>
        </div>
        {/* Card 4: Interview Tips */}
        <div className="p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
          <h2 className="text-2xl font-medium">Scholarship Tips</h2>
          <p className="mt-2 text-sm text-gray-400">
            Prepare effectively for scholarships with awesome tips.
          </p>
        </div>

        {/* Card 5: eBooks & Downloads */}
        <div className="p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
          <h2 className="text-2xl font-medium">eBooks & Downloads</h2>
          <p className="mt-2 text-sm text-gray-400">
            Access downloadable resources to read offline and grow your skills.
          </p>
        </div>
      </div>
    </div>
  );
}
