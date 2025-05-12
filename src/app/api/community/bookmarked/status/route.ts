import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const itemId = req.nextUrl.searchParams.get("itemId");
  const type = req.nextUrl.searchParams.get("type");
  console.log(userId, itemId, type);
  
  if (!userId || !itemId || !type) {
    return NextResponse.json(
      { error: "User ID, item ID, and type are required" },
      { status: 400 }
    );
  }

  try {
    const bookmark = await prisma.bookmark.findFirst({
      where: {
        userId: userId as string,
        itemId: itemId as string,
        type: type as "discussion" | "review",
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
