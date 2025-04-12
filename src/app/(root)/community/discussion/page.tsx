"use client";
import DiscussionForm from "@/components/DiscussionForm";
import DiscussionList from "@/components/DiscussionList";
import { useSession } from "next-auth/react";
import { useEffect } from "react";




export default function DiscussionPage() {
  const { data: session } = useSession();
  
  const userId = session?.user?.id;
 
  
  const postDiscussion = async (title: string, content: string) => {
    const response = await fetch("/api/community/discussion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content, authorId: userId }),
    });
    if (!response.ok) {
      throw new Error("Failed to post discussion");
    }
    const newDiscussion = await response.json();  
    return newDiscussion;
  }

  

  useEffect(() => {
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
    };

    fetchDiscussions();
  },[])

  return (
    <div className="max-w-3xl mx-auto p-4 mt-20
    ">
      <h1 className="text-3xl font-bold mb-6">Community Discussions</h1>
      <DiscussionForm />
      <DiscussionList />
    </div>
  );
}