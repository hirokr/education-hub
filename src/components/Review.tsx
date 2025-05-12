"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  useGetReviewsQuery,
  useAddReviewMutation,
} from "@/features/review/reviewApi";
import BookmarkButton from "./BookMark";
import VoteButton from "./VoteButton";
import { useGetBookmarksQuery } from "@/features/marked/markedApi";
import { Skeleton } from "./ui/skeleton";

// Static items for selection (mock data)
const fetchInitialItems = async () => {
  return [
    { id: 1, type: "Course", name: "Introduction to Machine Learning" },
    { id: 2, type: "University", name: "Harvard University" },
    { id: 3, type: "Scholarship", name: "AI Research Scholarship" },
    { id: 4, type: "Course", name: "Advanced React Development" },
    { id: 5, type: "University", name: "Stanford University" },
    { id: 6, type: "Scholarship", name: "Women in Tech Grant" },
    { id: 7, type: "Course", name: "Data Structures and Algorithms" },
    { id: 8, type: "University", name: "MIT" },
    { id: 9, type: "Scholarship", name: "Undergraduate Merit Scholarship" },
    { id: 10, type: "Course", name: "UX/UI Design Fundamentals" },
    { id: 11, type: "University", name: "Oxford University" },
    { id: 12, type: "Scholarship", name: "International Student Support Fund" },
    { id: 13, type: "Course", name: "Python for Data Science" },
    { id: 14, type: "University", name: "University of Cambridge" },
    { id: 15, type: "Scholarship", name: "Graduate Fellowship in AI" },
  ];
};

interface ReviewType {
  id: string;
  title: string;
  rating: number;
  content: string;
  category: string;
  authorId: string;
}

interface SelectedItem {
  id: number;
  type: string;
  name: string;
}

type BookmarkType = {
  itemId: string;
  type: string;
  userId: string;
  createdAt: string;
};

const ReviewComponent = () => {


  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [items, setItems] = useState<SelectedItem[]>([]);

  const { data: session } = useSession();
  const authorId = session?.user?.id;

    const userId = session?.user?.id;

    const itemId = selectedItem?.id || ""; // Initialize itemId with selectedItem's id or an empty string
    const itemType = selectedItem?.type as "discussion" | "review" || "review"; // Narrow down type to match the expected union type

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
      
  const { data: reviews = [], isLoading: isReviewsLoading,isError: isReviewError } = useGetReviewsQuery();
  const [addReview] = useAddReviewMutation();

  useEffect(() => {
    const loadItems = async () => {
      const initialItems = await fetchInitialItems();
      setItems(initialItems);
    };
    loadItems();
  }, []);

  const handleReviewSubmit = async () => {
    if (
      !rating ||
      !reviewText ||
      !selectedItem?.name ||
      !selectedItem?.type ||
      !authorId
    ) {
      return;
    }

    const newReview = {
      title: selectedItem.name,
      rating,
      category: selectedItem.type,
      content: reviewText,
      authorId,
    };

    await addReview(newReview);

    setRating(0);
    setReviewText("");
    setSelectedItem(null);
  };

  const filteredReviews = reviews.filter((review) =>
    review.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Your Review</h1>

      {/* Search bar */}
      <div className="mb-6 flex space-x-4">
        <input
          type="text"
          placeholder="Search reviews by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <button
          onClick={() =>
            setSelectedItem({ id: Date.now(), name: "", type: "" })
          }
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create New Review
        </button>
      </div>

      {/* Review form */}
      {selectedItem && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">New Review</h2>

          <input
            type="text"
            placeholder="Title (e.g., Harvard University)"
            value={selectedItem.name}
            onChange={(e) =>
              setSelectedItem((prev) =>
                prev ? { ...prev, name: e.target.value } : null
              )
            }
            className="w-full p-2 border rounded mb-4"
          />

          <select
            value={selectedItem.type}
            onChange={(e) =>
              setSelectedItem((prev) =>
                prev ? { ...prev, type: e.target.value } : null
              )
            }
            className="w-full p-2 border rounded mb-4 bg-black"
          >
            <option value="">Select Type</option>
            <option value="Course">Course</option>
            <option value="University">University</option>
            <option value="Scholarship">Scholarship</option>
          </select>

          {/* Star Rating */}
          <div className="mb-4">
            <span className="text-lg font-semibold">Rating: </span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-xl ${
                    rating >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here..."
            className="w-full p-2 border rounded mb-4"
          />

          <button
            onClick={handleReviewSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit Review
          </button>
        </div>
      )}

      {/* Review List */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        {isReviewsLoading ? (
          <div className="flex justify-center items-center">
            <Skeleton />
          </div>
        ) : isReviewError ? (
          <div className="flex justify-center items-center">
            <p className="text-red-500">Failed to load reviews.</p>
          </div>
        ) : filteredReviews.length > 0 ? (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
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
                    initialBookmarked={
                      bookmarks?.some(
                        (bookmark: BookmarkType) =>
                          bookmark.itemId === review.id &&
                          bookmark.type === "review"
                      ) ?? false
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews found for "{searchTerm}"</p>
        )}
      </div>
    </div>
  );
};

export default ReviewComponent;
