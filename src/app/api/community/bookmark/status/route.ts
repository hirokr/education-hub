import { NextRequest, NextResponse } from "next/server";
import  {prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const itemId = req.nextUrl.searchParams.get("itemId");
  const type = req.nextUrl.searchParams.get("type");

  if (!userId || !itemId || !type) {
    return NextResponse.json(
      { error: "User ID, item ID, and type are required" },
      { status: 400 }
    );
  }

  try {
    // Conditional query based on 'type'
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_itemId: {
          userId: userId as string,
          itemId: itemId as string, // either reviewId or discussionId
        },
      },
    });

    return NextResponse.json({ bookmarked: !!bookmark });
  } catch (error) {
    console.error("Error fetching bookmark status:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmark status" },
      { status: 500 }
    );
  }
}
