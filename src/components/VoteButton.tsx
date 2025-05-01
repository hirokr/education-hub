"use client";

import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

type Props = {
  itemId: string;
  type: "review" | "reply";
  initialValue: number;
  initialUserVote: number | null; // 1, -1 or null
};

const VoteButtons = ({
  itemId,
  type,
  initialValue,
  initialUserVote,
}: Props) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [score, setScore] = useState(initialValue);
  const [userVote, setUserVote] = useState<number | null>(initialUserVote);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVoteStatus = async () => {
      if (!userId) return;

      try {
        const res = await fetch(
          `/api/community/vote/status?itemId=${itemId}&userId=${userId}`
        );
        const data = await res.json();
        if (res.ok) {
          setScore(data.score); // Set the total score from API
          setUserVote(data.vote?.value ?? null); // Set the user's vote if available
        } else {
          toast(data.error || "Failed to fetch vote status");
        }
      } catch (err) {
        console.error(err);
        toast("Error fetching vote status");
      }
    };

    fetchVoteStatus();
  }, [itemId, userId]); // Run effect when itemId or userId changes

const handleVote = async (value: 1 | -1) => {
  if (!userId) return toast("Please log in to vote");

  setLoading(true);
  try {
    const res = await fetch("/api/community/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, itemId, type, value }),
    });

    const data = await res.json();
    if (res.ok) {
      // ✅ Re-fetch updated score and vote status from server after voting
      const statusRes = await fetch(
        `/api/community/vote/status?itemId=${itemId}&userId=${userId}`
      );
      const statusData = await statusRes.json();
      if (statusRes.ok) {
        setScore(statusData.score);
        setUserVote(statusData.vote?.value ?? null);
      } else {
        toast("Failed to refresh vote status");
      }
    } else {
      toast(data.error || "Voting failed");
    }
  } catch (err) {
    console.error(err);
    toast("Error submitting vote");
  }
  setLoading(false);
};


  return (
    <div className="flex items-center space-x-2">
      <button onClick={() => handleVote(1)} disabled={loading}>
        <ArrowUp
          className={`h-5 w-5 ${
            userVote === 1 ? "text-green-500" : "text-gray-400"
          }`}
        />
      </button>
      <span>{score}</span>
      <button onClick={() => handleVote(-1)} disabled={loading}>
        <ArrowDown
          className={`h-5 w-5 ${
            userVote === -1 ? "text-red-500" : "text-gray-400"
          }`}
        />
      </button>
    </div>
  );
};

export default VoteButtons;
