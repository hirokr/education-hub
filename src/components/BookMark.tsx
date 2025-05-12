"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
  useCheckBookmarkQuery,
} from "@/features/marked/markedApi";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface BookmarkButtonProps {
  itemId: string;
  itemType: "discussion" | "review";
  initialBookmarked?: boolean; // Optional
  onToggle?: () => void;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  itemId,
  itemType,
  initialBookmarked,
  onToggle,
}) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: bookmarkStatus, isLoading } = useCheckBookmarkQuery(
    { userId: userId || "", itemId, type: itemType },
    { skip: !userId || initialBookmarked != null }
  );

  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    initialBookmarked ?? false
  );

  // Sync with initialBookmarked (important for dynamic props)
  useEffect(() => {
    if (initialBookmarked !== undefined) {
      setIsBookmarked(initialBookmarked);
    }
  }, [initialBookmarked]);

  // Sync with backend query only if initialBookmarked is not provided
  useEffect(() => {
    if (initialBookmarked === undefined && bookmarkStatus !== undefined) {
      setIsBookmarked(bookmarkStatus.bookmarked);
    }
  }, [initialBookmarked, bookmarkStatus]);

  const [addBookmark] = useAddBookmarkMutation();
  const [removeBookmark] = useRemoveBookmarkMutation();

  const toggleBookmark = async () => {
    if (!userId) return;
    try {
      if (isBookmarked) {
        await removeBookmark({ userId, itemId, type: itemType }).unwrap();
        setIsBookmarked(false);
      } else {
        await addBookmark({ userId, itemId, type: itemType }).unwrap();
        setIsBookmarked(true);
      }
      onToggle?.();
    } catch (err) {
      console.error("Bookmark error:", err);
    }
  };

  if (isLoading && initialBookmarked === undefined) return null;

  return (
    <button onClick={toggleBookmark} title={isBookmarked ? "Remove" : "Add"}>
      {isBookmarked ? (
        <BookmarkCheck className="text-blue-600" />
      ) : (
        <Bookmark className="text-gray-400" />
      )}
    </button>
  );
};

export default BookmarkButton;
