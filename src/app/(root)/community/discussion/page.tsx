"use client";
import DiscussionForm from "@/components/DiscussionForm";
import { useSession } from "next-auth/react";
import React from "react";


export default function DiscussionPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  
  const postDiscussion = async (title: string, content: string, category: string) => {
    const response = await fetch("/api/community/discussion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content, category, authorId: userId }),
    });
    if (!response.ok) {
      throw new Error("Failed to post discussion");
    }
    const newDiscussion = await response.json();  
    return newDiscussion;
  }

  


  return (
    <div className="max-w-3xl mx-auto p-4 mt-20
    ">
      <h1 className="text-3xl font-bold mb-6">Community Discussions</h1>
      <DiscussionForm onPost ={postDiscussion}/>
    </div>
  );
}