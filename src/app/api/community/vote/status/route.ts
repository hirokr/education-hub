import { NextRequest, NextResponse } from "next/server"; // Import next-request and next-response
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient(); // Initialize Prisma Client

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const itemId = searchParams.get("itemId");
  const userId = searchParams.get("userId");

  // Check if itemId and userId are provided
  if (!itemId || !userId) {
    return NextResponse.json(
      { error: "Missing itemId or userId" },
      { status: 400 }
    );
  }

  try {
    // Get all votes for the itemId
    const allVotes = await prisma.vote.findMany({
      where: {
        itemId: String(itemId),
      },
    });

    // Calculate total score (sum of all votes)
    const score = allVotes.reduce((acc, vote) => acc + vote.value, 0);

    // Get the current user's vote for that itemId
    const userVote = await prisma.vote.findFirst({
      where: {
        itemId: String(itemId),
        userId: String(userId),
      },
    });

    // Return the score and current user's vote
    return NextResponse.json({
      score,
      vote: userVote,
    });
  } catch (err) {
    console.error("Error fetching vote status:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
