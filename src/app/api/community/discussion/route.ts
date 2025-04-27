// File: pages/api/discussions/index.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../../prisma-client";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, category, authorId } = body;
    console.log(title, content, category, authorId);
    
    const discussions = await prisma.discussion.create({
      data: { title, content, category, authorId },
    });
    console.log(discussions);
    return NextResponse.json(discussions, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create discussion",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const discussions = await prisma.discussion.findMany({
      include: {
        author: {
          select: {
            name: true,
          },
        },
        replies: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(discussions);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create discussion",
      },
      { status: 500 }
    );
  }
}
