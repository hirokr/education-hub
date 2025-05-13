// app/resources/layout.tsx
import Link from "next/link";

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar-border text-sidebar-primary p-6 fixed h-full">
        <h1 className="text-xl font-bold mb-6">Resources</h1>
        <nav className="space-y-4">
          <Link
            href="/resources/resume"
            className="block hover:text-blue-400"
          >
            Resume Templates
          </Link>
          <Link
            href="/resources/career"
            className="block hover:text-blue-400"
          >
            Career Guides
          </Link>
          <Link
            href="/resources/study_guides"
            className="block hover:text-blue-400"
          >
            Study Guides
          </Link>
          <Link
            href="/resources/scholarship"
            className="block hover:text-blue-400"
          >
            Scholarship Tips
          </Link>
          <Link
            href="/resources/interview"
            className="block hover:text-blue-400"
          >
            Interview Tips
          </Link>
          <Link href="/resources/ebook" className="block hover:text-blue-400">
            eBooks & Study Materials
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="ml-64 p-8 w-full min-h-screen text-foreground bg-background">
        {children}
      </main>
    </div>
  );
}
