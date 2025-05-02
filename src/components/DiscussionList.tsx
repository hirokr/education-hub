import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import BookmarkButton from "@/components/BookMark"; // Import your reusable component

interface Discussion {
  id: string;
  title: string;
  content: string;
  category: string;
  authorId: string;
  author: {
    name: string;
  };
  isBookmarked: boolean; // Track the bookmark status
}

interface DiscussionListProps {
  data: Discussion[];
}

export default function DiscussionList({ data }: DiscussionListProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [discussions, setDiscussions] = useState<Discussion[]>(data);

 

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-2xl font-bold">Discussions</h2>
      <div className="text-right -mt-10">
        <Link href="/community/discussion">Post</Link>
      </div>

      {discussions.map((d) => (
        <div key={d.id} className="relative">
          <Link href={`/community/discussion/${d.id}`}>
            <div className="p-4 border rounded-md shadow-sm bg-accent mb-3">
              <h3 className="text-lg font-semibold">{d.title}</h3>
              <p className="text-white truncate">{d.content}</p>
              <p className="text-sm text-blue-800">Posted by {d.author.name}</p>
            </div>
          </Link>

          {/* Reusable BookmarkButton */}
          {userId && (
            <div className="absolute top-2 right-2">
              <BookmarkButton itemId={d.id} itemType="discussion"  />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
