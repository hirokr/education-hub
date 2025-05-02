"use client";
import DiscussionForm from "@/components/DiscussionForm";
import DiscussionList from "@/components/DiscussionList";
import ReviewComponent from "@/components/Review";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [activeTab, setActiveTab] = useState("discussion");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // New state

  const fetchDiscussions = async () => {
    try {
      const response = await fetch("/api/community/discussion");
      if (!response.ok) {
        throw new Error("Failed to fetch discussions");
      }
      const discussions = await response.json();
      setData(discussions);
    } catch (error) {
      console.error("Error loading discussions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  return (
    <div className="p-4 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Community</h1>

      {/* Sub Navbar */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("discussion")}
          className={`px-4 py-2 border rounded ${
            activeTab === "discussion"
              ? "bg-blue-500 text-white"
              : "bg-black text-white"
          }`}
        >
          Discussion
        </button>
        <button
          onClick={() => setActiveTab("review")}
          className={`px-4 py-2 border rounded ${
            activeTab === "review"
              ? "bg-blue-500 text-white"
              : "bg-black text-white"
          }`}
        >
          Review
        </button>
      </div>

      {/* Content Section */}
      <div className="w-full max-w-3xl mx-auto p-4">
        {activeTab === "discussion" ? (
          loading ? (
            <div className="text-center text-gray-400 flex flex-col items-center justify-center">
             <Skeleton />
            </div>
          ) : (
            <DiscussionList data={data} />
          )
        ) : (
          <ReviewComponent />
        )}
      </div>
    </div>
  );
};

export default Page;
