import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/community/bookmark/user/:id
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: id },
    });

    return NextResponse.json(bookmarks, { status: 200 });
  } catch (error) {
    console.error("Fetch bookmarked items error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/community/bookmark
export async function POST(req: NextRequest) {
  try {
    const { userId, itemId, type } = await req.json();

    if (!userId || !itemId || !type) {
      return NextResponse.json(
        { error: "Missing userId, itemId, or type" },
        { status: 400 }
      );
    }

    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_itemId: {
          userId,
          itemId,
        },
      },
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: {
          userId_itemId: {
            userId,
            itemId,
          },
        },
      });

      return NextResponse.json({ bookmarked: false });
    } else {
      await prisma.bookmark.create({
        data: {
          userId,
          itemId,
          type,
        },
      });

      return NextResponse.json({ bookmarked: true });
    }
  } catch (error) {
    console.error("Bookmark toggle error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
