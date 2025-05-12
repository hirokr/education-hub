"use client";
import React, { useState } from "react";
import BookmarkComponent from "@/components/BookMarked";
import DiscussionList from "@/components/DiscussionList";
import ReviewComponent from "@/components/Review";
import { useGetDiscussionsQuery } from "@/features/discussion/discussionApi";
import { Skeleton } from "@/components/ui/skeleton";
import { FlipWords } from "@/components/custom/flip-words";
import { TextGenerateEffect } from "@/components/custom/text-generate-effect";

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState("community");
  const [bookmarkType, setBookmarkType] = useState<"discussion" | "review">("discussion");
  const words = ['Discussion', 'Review'];
  const text = "Share & Gain more Knowledge with us here in EduHub";
  const { data, isLoading, isError } = useGetDiscussionsQuery({});

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6 space-y-4">
        <h2 className="text-xl font-bold mb-4">Community</h2>
        <button
          onClick={() => setActiveTab("community")}
          className={`block w-full text-left px-4 py-2 rounded ${
            activeTab === "community" ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
        >
          Community
        </button>
        <button
          onClick={() => setActiveTab("discussion")}
          className={`block w-full text-left px-4 py-2 rounded ${
            activeTab === "discussion" ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
        >
          Discussions
        </button>
        <button
          onClick={() => setActiveTab("review")}
          className={`block w-full text-left px-4 py-2 rounded ${
            activeTab === "review" ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
        >
          Reviews
        </button>
        <button
          onClick={() => setActiveTab("bookmarks")}
          className={`block w-full text-left px-4 py-2 rounded ${
            activeTab === "bookmarks" ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
        >
          Bookmarks
        </button>

     
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === "community" ? (
          <div>
        <div className='text-3xl sm:text-4xl mx-auto pt-30 font-normal text-white dark:text-white mb-10'>
                 <h1 className="text-6xl text-center font-bold">Welcome to the Community</h1> <br />
                 <div className="text-4xl flex justify-center items-center gap-2">
                  <h2>Explore</h2>
                 <FlipWords words={words} /> <br />
                 </div>
                 <div className="text-3xl flex justify-center items-center text-2xl text-gray-500"> 
                  In here we connect with each other & share our knowledge
               </div>
               <TextGenerateEffect words={text} className="flex justify-center" />
               </div>
                
                 
          </div>
        ) : activeTab === "discussion" ? (
          isLoading ? (
            <div className="flex justify-center items-center"><Skeleton/></div>
            
          ) : isError ? (
            <div  className="flex justify-center items-center"><p className="text-red-500">Failed to load discussions.</p></div>
          ) : (
            <DiscussionList data={data} />
          )
        ) : activeTab === "review" ? (
          <ReviewComponent />
        ) : (
          <BookmarkComponent />
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
