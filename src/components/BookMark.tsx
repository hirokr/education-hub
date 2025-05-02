"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Bookmark, BookmarkCheck } from "lucide-react";

type Props = {
  itemId: string; // Review or Discussion ID
  itemType: "review" | "discussion";
};

const BookmarkButton = ({ itemId, itemType }: Props) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch bookmark status from the server on component mount
  useEffect(() => {
    if (!userId) return; // Do nothing if user is not logged in
    const fetchBookmarkStatus = async () => {
      try {
        const res = await fetch(
          `/api/community/bookmark/status?userId=${userId}&itemId=${itemId}&type=${itemType}`,
        );
        const data = await res.json();
        setBookmarked(data.bookmarked);
      } catch (err) {
        console.error("Error fetching bookmark status:", err);
      }
    };
    fetchBookmarkStatus();
  }, [userId, itemId]);

  // Toggle the bookmark status
  const toggleBookmark = async () => {
    if (!userId) {
      toast("Please log in to bookmark.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/community/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, userId, type: itemType }),
      });

      if (!res.ok) throw new Error("Bookmark toggle failed");

      const result = await res.json();
      setBookmarked(result.bookmarked);
      toast(result.bookmarked ? "Bookmarked!" : "Removed from bookmarks.");
    } catch (err) {
      console.error("Bookmark toggle error:", err);
      toast("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className="text-blue-500 hover:text-blue-700"
      title={bookmarked ? "Remove Bookmark" : "Add to Bookmark"}
    >
      {bookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
    </button>
  );
};

export default BookmarkButton;
