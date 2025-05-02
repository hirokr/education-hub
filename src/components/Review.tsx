import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import BookmarkButton from "./BookMark";
import BookMark from "./BookMark";
import VoteButton from "./VoteButton";

// Mock API functions (replace these with actual API calls)
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

const fetchReviews = async () => {
 try {
    const response = await fetch("/api/community/review");
    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }
    const data = await response.json();
    return data;
  } catch (error) { 
    console.error("Error fetching reviews:", error);
    return [];
  } 
};


const submitReview = async (review: any) => {
  try {
    const response = await fetch("/api/community/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    });

    if (!response.ok) {
      throw new Error("Failed to submit review");
    }

    const data = await response.json();
    console.log("Review submitted:", data);
    return data;
  } catch (error) {
    console.error("Error submitting review:", error);
  }
};


const ReviewComponent = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null); // Holds the selected item for review
  const [rating, setRating] = useState<number>(0); // Holds the rating
  const [reviewText, setReviewText] = useState<string>(""); // Holds the review text
  const [reviews, setReviews] = useState<any[]>([]); // Stores the reviews for each item
  const [items, setItems] = useState<any[]>([]); // Items fetched from API
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term for filtering items
  const [filterType, setFilterType] = useState<string>(""); // Filter by item type (Course, University, etc.)
  const { data: session } = useSession();
  const authorId = session?.user?.id; // Get the user ID from session

  useEffect(() => {
    const loadItems = async () => {
      const fetchedItems = await fetchInitialItems();
      const fetchedReviews = await fetchReviews();
      setReviews(fetchedReviews);
      setItems(fetchedItems);
    };

    loadItems();
  }, []);

  const handleCardClick = (item: any) => {
    setSelectedItem(item);
  };

  const handleReviewSubmit = async () => {
    if (!rating || !reviewText) return;

    const newReview = {
      title: selectedItem.name,
      rating,
      category: selectedItem.type,
      content: reviewText,
      authorId
    };

    // Simulate backend API call to save review
    await submitReview(newReview);

    // Update local state with the new review
    setReviews((prevReviews) => [...prevReviews, newReview]);

    setRating(0);
    setReviewText("");
    setSelectedItem(null); // Deselect item after review
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filterType ? item.type === filterType : true;
    return matchesSearch && matchesFilter;
  });

  const displayItems = searchTerm ? filteredItems : items;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Your Review</h1>

      {/* Search and Filter */}
      <div className="mb-6 flex space-x-4">
        <input
          type="text"
          placeholder="Search university, course, or scholarship..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 border rounded bg-accent"
        >
          <option value="">All Types</option>
          <option value="Course">Course</option>
          <option value="University">University</option>
          <option value="Scholarship">Scholarship</option>
        </select>
      </div>

      {/* Cards for Courses, Universities, and Scholarships */}
      {searchTerm && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              className="p-4 border rounded-lg cursor-pointer hover:bg-gray-200"
            >
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p>{item.type}</p>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-3 text-center text-gray-500">
              <p className="mb-2">No matching results found.</p>
              <button
                onClick={() =>
                  setSelectedItem({
                    id: Date.now(),
                    name: searchTerm,
                    type: "",
                  })
                }
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Create new review for "{searchTerm}"
              </button>
            </div>
          )}
        </div>
      )}

      {/* Review Form for Selected Item */}
      {selectedItem && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">
            Review for {selectedItem.name}
          </h2>

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

          {/* Review Text */}
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here..."
            className="w-full p-2 border rounded mb-4"
          />

          {/* Submit Review */}
          <button
            onClick={handleReviewSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit Review
          </button>
        </div>
      )}

      {/* Display All Reviews */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>

        {reviews.filter((review) =>
          review.title.toLowerCase().includes(searchTerm.toLowerCase())
        ).length > 0 ? (
          <div className="space-y-4">
            {reviews
              .filter((review) =>
                review.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((review, index) => (
                <div key={index} className="p-4 border rounded-lg relative">
                  <h3 className="text-lg font-semibold">{review.title}</h3>
                  <p>
                    Rating:{" "}
                    {[...Array(review.rating)].map((_, i) => "★").join("")}
                  </p>
                  <p>{review.content}</p>
                  <div className="mt-2">
                    <VoteButton 
                      itemId={review.id} 
                      type="review" 
                      initialValue={review.totalVotes ?? 0}
                      initialUserVote={review.userVote ?? 0} 
                    />
                  </div>
                  
                  <div className="absolute top-2 right-2">
                    <BookMark
                      itemId={review.id}
                      itemType="review"
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
