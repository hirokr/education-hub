"use client";
import React, { useEffect, useState } from "react";
import { useGetBookmarksQuery } from "@/features/marked/markedApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import Link from "next/link";
import BookmarkButton from "./BookMark";
import VoteButton from "./VoteButton";

const BookmarkComponent: React.FC = () => {
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const {
    data: bookmarks,
    isLoading,
    isError,
    refetch, // Use refetch to reload the bookmarks data
  } = useGetBookmarksQuery(userId!, {
    skip: !userId,
    refetchOnMountOrArgChange: true,
  });
  
  console.log(bookmarks, "bookmarks");
  

  useEffect(() => {
    if (bookmarks && Array.isArray(bookmarks)) {
      const discussionItems = bookmarks
        .filter((item) => item.type === "discussion" && item.content)
        .map((item) => ({
          ...item.content,
          author: item.author || item.content.author || null,
        }));

      const reviewItems = bookmarks
        .filter((item) => item.type === "review" && item.content)
        .map((item) => ({
          ...item.content,
          author: item.author || item.content.author || null,
        }));

      setDiscussions(discussionItems);
      setReviews(reviewItems);
    }
  }, [bookmarks]);

  if (isLoading) return <div className="flex justify-center items-center"><Skeleton/></div>
  if (isError || !bookmarks)
    return (
      <div className="flex justify-center items-center">
        <p className="text-red-500">Failed to load Bookmarks.</p>
      </div>
    );

  const handleToggleBookmark = () => {
    refetch(); // Refetch bookmarks data to ensure UI is updated
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Bookmarks</h2>

      {/* Discussions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Discussions</h3>
        {discussions.length > 0 ? (
          <ul className="space-y-4">
            {discussions.map((d) => (
              <div key={d.id} className="relative">
                <Link href={`/community/discussion/${d.id}`}>
                  <div className="p-4 border rounded-md shadow-sm bg-accent mb-3">
                    <h3 className="text-lg font-semibold">{d.title}</h3>
                    <p className="text-white truncate">{d.content}</p>
                    <p className="text-sm text-blue-800">
                      Posted by {d.author?.name}
                    </p>
                  </div>
                </Link>
                <div className="absolute top-2 right-2">
                  <BookmarkButton
                    itemId={d.id}
                    itemType="discussion"
                    initialBookmarked={true} // Pass the correct state
                    onToggle={handleToggleBookmark} // Trigger refetch on toggle
                  />
                </div>
              </div>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No discussion bookmarks found.</p>
        )}
      </div>

      {/* Reviews */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Reviews</h3>
        {reviews.length > 0 ? (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 border rounded-lg relative">
                <h3 className="text-lg font-semibold">{review.title}</h3>
                <div className="flex">
                  <p>
                    Rating:{" "}
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ★
                      </span>
                    ))}
                  </p>
                  <p>
                    {[...Array(5 - review.rating)].map((_, i) => (
                      <span key={i} className="text-gray-300">
                        ★
                      </span>
                    ))}
                  </p>
                </div>
                <p>{review.content}</p>
                <div className="mt-2">
                  <VoteButton itemId={review.id} type="review" />
                </div>
                <div className="absolute top-2 right-2">
                  <BookmarkButton
                    itemId={review.id}
                    itemType="review"
                    initialBookmarked={true} // Pass the correct state
                    onToggle={handleToggleBookmark} // Trigger refetch on toggle
                  />
                </div>
              </div>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No review bookmarks found.</p>
        )}
      </div>
    </div>
  );
};

export default BookmarkComponent;
