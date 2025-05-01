"use client";

import React, { useEffect, useState } from "react";
import { Textarea } from "./ui/textarea";
import { useSession } from "next-auth/react";

export default function ReplyList({ discussionId }: { discussionId: string }) {
  const [content, setContent] = useState("");
  const [replies, setReplies] = useState([]);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const fetchDiscussion = async () => {
    const res = await fetch(
      `/api/community/reply?discussionId=${discussionId}`
    );
    const data = await res.json();
    setReplies(data);
  };

  const handleSubmit = async () => {
    if (!content) return;
    await fetch("/api/community/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, authorId: userId, discussionId }),
    });
    setContent("");
    fetchDiscussion();
  };

  useEffect(() => {
    fetchDiscussion();
  }, []);

  return (
    <div className="p-6 border-t">
      <h2 className="text-xl font-semibold mb-4">Answers</h2>
      <Textarea
        placeholder="Write your thoughts here..."
        className="w-full mb-4"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Post Answer
      </button>

      <div className="mt-8">
        {replies.map((reply: any) => (
          <ReplyItem
            key={reply.id}
            reply={reply}
            discussionId={discussionId}
            refresh={fetchDiscussion}
          />
        ))}
      </div>
    </div>
  );
}

function ReplyItem({
  reply,
  discussionId,
  refresh,
  depth = 0,
}: {
  reply: any;
  discussionId: string;
  refresh: () => void;
  depth?: number;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showChildren, setShowChildren] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const handleReplySubmit = async () => {
    if (!replyContent) return;
    await fetch("/api/community/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: replyContent,
        authorId: userId,
        discussionId,
        parentId: reply.id,
      }),
    });
    setReplyContent("");
    setShowReply(false);
    refresh();
  };

  return (
    <div className={`ml-${Math.min(depth * 4, 32)} mb-4 border-l-2 pl-4`}>
      <p className="font-medium">{reply.author.name}</p>
      <p>{reply.content}</p>

      <button
        onClick={() => setShowReply((prev) => !prev)}
        className="text-sm text-blue-500 mt-1 hover:underline"
      >
        {showReply ? "Cancel" : "Reply"}
      </button>

      {showReply && (
        <div className="mt-2">
          <Textarea
            placeholder="Write a reply..."
            className="w-full mb-2"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <button
            onClick={handleReplySubmit}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            Post Reply
          </button>
        </div>
      )}

      {reply.children.length > 0 && (
        <>
          <button
            onClick={() => setShowChildren((prev) => !prev)}
            className="text-xs text-gray-500 mt-2 ml-2 hover:underline"
          >
            {showChildren
              ? "Hide replies"
              : `Show ${reply.children.length} repl${
                  reply.children.length > 1 ? "ies" : "y"
                }`}
          </button>

          {showChildren && (
            <div className="ml-4">
              {reply.children.map((child: any) => (
                <ReplyItem
                  key={child.id}
                  reply={child}
                  discussionId={discussionId}
                  refresh={refresh}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
