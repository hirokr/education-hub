import { useState, useEffect } from "react";

// Mock API functions (replace these with actual API calls)
const fetchItems = async () => {
  return [
    { id: 1, type: "Course", name: "Introduction to Machine Learning" },
    { id: 2, type: "University", name: "Harvard University" },
    { id: 3, type: "Scholarship", name: "AI Research Scholarship" },
  ];
};

const submitReview = async (review: any) => {
  // Simulate API call for review submission
  console.log("Review submitted:", review);
};

const ReviewComponent = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null); // Holds the selected item for review
  const [rating, setRating] = useState<number>(0); // Holds the rating
  const [reviewText, setReviewText] = useState<string>(""); // Holds the review text
  const [reviews, setReviews] = useState<any[]>([]); // Stores the reviews for each item
  const [items, setItems] = useState<any[]>([]); // Items fetched from API
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term for filtering items
  const [filterType, setFilterType] = useState<string>(""); // Filter by item type (Course, University, etc.)

  useEffect(() => {
    const loadItems = async () => {
      const fetchedItems = await fetchItems();
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
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      rating,
      reviewText,
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
          className="p-2 border rounded  bg-accent"
        >
          <option value="">All Types</option>
          <option value="Course">Course</option>
          <option value="University">University</option>
          <option value="Scholarship">Scholarship</option>
        </select>
      </div>

      {/* Cards for Courses, Universities, and Scholarships */}
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
      </div>

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
        <h2 className="text-xl font-semibold">Reviews</h2>
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold">{review.itemName}</h3>
              <p>
                Rating: {[...Array(review.rating)].map((_, i) => "★").join("")}
              </p>
              <p>{review.reviewText}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewComponent;
