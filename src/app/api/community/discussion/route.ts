// File: pages/api/discussions/index.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, authorId } = body;
    console.log(title, content, authorId);
    

    const discussion = await prisma.discussion.create({
      data: { title, content, authorId },
    });

    return NextResponse.json(discussion, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create discussion" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const discussions = await prisma.discussion.findMany({
      include: { author: true, replies: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(discussions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch discussions" },
      { status: 500 }
    );
  }
}
