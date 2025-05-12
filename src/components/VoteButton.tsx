"use client";

import { useSession } from "next-auth/react";
import { ArrowUp, ArrowDown } from "lucide-react";
import {
  useSubmitVoteMutation,
  useGetVoteStatusQuery,
} from "@/features/vote/voteApi";
import { toast } from "sonner";

type Props = {
  itemId: string;
  type: "review" | "reply";
};

const VoteButtons = ({ itemId, type }: Props) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Fetch vote status and score from API
  const { data, isLoading, refetch } = useGetVoteStatusQuery(
    { itemId, userId: userId! }, // Forcefully cast userId to string
    { skip: !userId } // Skip query if userId is undefined
  );

  const [submitVote, { isLoading: submitting }] = useSubmitVoteMutation();

  const handleVote = async (value: 1 | -1) => {
    if (!userId) return toast("Please log in to vote");

    try {
      await submitVote({ userId, itemId, type, value }).unwrap();
      refetch(); // Re-fetch updated status
    } catch (err: any) {
      toast(err?.data?.error || "Voting failed");
    }
  };

  if (isLoading) {
    return <span>Loading...</span>;
  }

  // Ensure data from the API is available before using it
  const score = data?.score ?? 0;
  const userVote = data?.vote?.value ?? null;

  return (
    <div className="flex items-center space-x-2">
      <button onClick={() => handleVote(1)} disabled={isLoading || submitting}>
        <ArrowUp
          className={`h-5 w-5 ${
            userVote === 1 ? "text-green-500" : "text-gray-400"
          }`}
        />
      </button>
      <span>{score}</span> {/* Display the total score */}
      <button onClick={() => handleVote(-1)} disabled={isLoading || submitting}>
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
