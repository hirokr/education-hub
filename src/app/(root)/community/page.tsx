"use client";
import DiscussionForm from "@/components/DiscussionForm";
import DiscussionList from "@/components/DiscussionList";
import ReviewComponent from "@/components/Review";
import { useSession } from "next-auth/react";
import React from "react";
import { useEffect, useState } from "react";

const Page = () => {
  const [activeTab, setActiveTab] = useState("discussion"); // Default to 'discussion'

    const { data: session } = useSession();
    const [data, setData] = React.useState([]);
    const userId = session?.user?.id;
  
    
  const fetchDiscussions = async () => {
        const response = await fetch("/api/community/discussion", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch discussions");
        }
        
        const discussions = await response.json();
        console.log(discussions);
        setData(discussions);
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
              : "bg-gray-200"
          }`}
        >
          Discussion
        </button>
        <button
          onClick={() => setActiveTab("review")}
          className={`px-4 py-2 border rounded ${
            activeTab === "review" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Review
        </button>
      </div>

      {/* Content Section */}
      <div>
        {activeTab === "discussion" ? (
          <div className="w-screen max-w-3xl mx-auto p-4">
            <DiscussionList data={data} />
          </div>
        ) : (
          <div>
           <ReviewComponent />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
