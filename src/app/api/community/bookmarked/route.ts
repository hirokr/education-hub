import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
// Define the bookmark type
type Bookmark = {
  id: string;
  userId: string;
  itemId: string;
  type: "discussion" | "review"; // Type of the item being bookmarked
};

// Add a bookmark (POST request)
export async function POST(req: Request) {
  try {
    const { userId, itemId, type } = await req.json();

    if (!userId || !itemId || !type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check if bookmark already exists
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_itemId: {
          userId,
          itemId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Bookmark already exists" },
        { status: 200 }
      );
    }

    // Create new bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        itemId,
        type,
      },
    });

    return NextResponse.json(bookmark);
  } catch (error) {
    console.error("Error adding bookmark:", error);
    return NextResponse.json(
      { error: "Failed to add bookmark" },
      { status: 500 }
    );
  }
}
// Remove a bookmark (DELETE request)
export async function DELETE(req: Request) {
  try {
    const { userId, itemId } = await req.json();

    if (!userId || !itemId) {
      return NextResponse.json(
        { error: "Missing userId or itemId" },
        { status: 400 }
      );
    }

    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_itemId: {
          userId,
          itemId,
        },
      },
    });

    if (!bookmark) {
      return NextResponse.json(
        { message: "Bookmark not found" },
        { status: 404 }
      );
    }

    await prisma.bookmark.delete({
      where: {
        userId_itemId: {
          userId,
          itemId,
        },
      },
    });

    return NextResponse.json({ message: "Bookmark removed" });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    return NextResponse.json(
      { error: "Failed to remove bookmark" },
      { status: 500 }
    );
  }
}

// Get a user's bookmarks (GET request)
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
    });

    const enrichedBookmarks = await Promise.all(
      bookmarks.map(async (bookmark) => {
        if (bookmark.type === "discussion") {
          const discussion = await prisma.discussion.findUnique({
            where: { id: bookmark.itemId ?? undefined },
            include: {
              author: {
                select: {
                  name: true,
                  email: true,
                  id: true,
                },
              },
            },
          });

          return {
            ...bookmark,
            content: discussion,
            author: discussion?.author || null,
          };
        } else if (bookmark.type === "review") {
          const review = await prisma.review.findUnique({
            where: { id: bookmark.itemId ?? undefined },
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          });

          return {
            ...bookmark,
            content: review,
            author: review?.user || null,
          };
        }

        return bookmark;
      })
    );
    
    return NextResponse.json(enrichedBookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to load bookmarks" },
      { status: 500 }
    );
  }
}